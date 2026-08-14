import {
  buildOsmMapsUrl,
  isGoogleMapsShortUrl,
  isValidGeoCoordinate,
  parseGoogleMapsUrl,
} from '@turta/shared-constants';

import {
  renderVoucherHtml,
  resolvePickupMapsUrl,
  type VoucherTemplateData,
} from '../voucher-template';

function baseVoucher(
  patch: Partial<VoucherTemplateData> = {},
): VoucherTemplateData {
  return {
    bookingNumber: 'TRL-20260811-TEST',
    issuedAt: new Date('2026-08-11T10:00:00.000Z'),
    tourTitle: 'Kapadokya Turu',
    tourStartDate: new Date('2026-09-01T00:00:00.000Z'),
    tourEndDate: new Date('2026-09-03T00:00:00.000Z'),
    partnerName: 'Demo Acente',
    partnerPhone: '+905551112233',
    partnerTaxNumber: null,
    partnerLogoUrl: null,
    platformLogoUrl: null,
    tursabLogoUrl: null,
    guests: [{ firstName: 'Ada', lastName: 'Yılmaz', identityNumber: '123' }],
    pickupLocation: 'Ankara — Kızılay',
    pickupTime: '07:00',
    pickupMapsUrl: null,
    seatLabel: 'Partner tarafından atanacak',
    payerName: 'Ada Yılmaz',
    totalAmount: '1500',
    currency: 'TRY',
    paymentStatusLabel: 'ÖDENDİ (Tahsil Edildi)',
    ...patch,
  };
}

describe('pickup geo + voucher map link', () => {
  describe('isValidGeoCoordinate', () => {
    it('should accept a valid Ankara pin', () => {
      expect(isValidGeoCoordinate(39.9334, 32.8597)).toBe(true);
    });

    it('should reject incomplete or out-of-range values', () => {
      expect(isValidGeoCoordinate(39.9334, null)).toBe(false);
      expect(isValidGeoCoordinate(undefined, 32.8597)).toBe(false);
      expect(isValidGeoCoordinate(91, 32)).toBe(false);
      expect(isValidGeoCoordinate(39, 181)).toBe(false);
    });
  });

  describe('parseGoogleMapsUrl', () => {
    it('should read @lat,lng from a place URL', () => {
      expect(
        parseGoogleMapsUrl(
          'https://www.google.com/maps/place/Izmir/@38.4237,27.1428,12z',
        ),
      ).toEqual({ latitude: 38.4237, longitude: 27.1428 });
    });

    it('should prefer !3d!4d pin over map center', () => {
      expect(
        parseGoogleMapsUrl(
          'https://www.google.com/maps/place/X/@38.4,27.1,17z/data=!3d38.4192!4d27.1287',
        ),
      ).toEqual({ latitude: 38.4192, longitude: 27.1287 });
    });

    it('should read q=lat,lng and reject short links', () => {
      expect(
        parseGoogleMapsUrl('https://maps.google.com/?q=41.0082,28.9784'),
      ).toEqual({ latitude: 41.0082, longitude: 28.9784 });
      expect(isGoogleMapsShortUrl('https://maps.app.goo.gl/abc')).toBe(true);
      expect(parseGoogleMapsUrl('https://maps.app.goo.gl/abc')).toBeNull();
    });
  });

  describe('buildOsmMapsUrl / resolvePickupMapsUrl', () => {
    it('should build an OSM link from lat/lng', () => {
      expect(buildOsmMapsUrl(41.0082, 28.9784)).toContain(
        'openstreetmap.org/?mlat=41.0082&mlon=28.9784',
      );
    });

    it('should snapshot coords into a voucher URL and skip missing pins', () => {
      expect(
        resolvePickupMapsUrl({ latitude: 41.0082, longitude: 28.9784 }),
      ).toContain('mlat=41.0082');
      expect(resolvePickupMapsUrl({ latitude: 41.0082 })).toBeNull();
      expect(resolvePickupMapsUrl(null)).toBeNull();
    });
  });

  describe('renderVoucherHtml', () => {
    it('should include Haritada aç only when a maps URL exists', () => {
      const withoutMap = renderVoucherHtml(baseVoucher());
      expect(withoutMap).toContain('Ankara — Kızılay');
      expect(withoutMap).not.toContain('Haritada aç');

      const withMap = renderVoucherHtml(
        baseVoucher({
          pickupMapsUrl: buildOsmMapsUrl(39.9334, 32.8597),
        }),
      );
      expect(withMap).toContain('Haritada aç');
      expect(withMap).toContain('openstreetmap.org/?mlat=39.9334');
      expect(withMap).not.toContain('leaflet');
    });
  });
});
