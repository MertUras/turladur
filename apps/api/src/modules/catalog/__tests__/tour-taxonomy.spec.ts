import {
  inferDestinationScope,
  inferStayKind,
  normalizeDepartureCity,
  normalizeDepartureCities,
  TourDestinationScope,
  TourStayKind,
} from '@turta/shared-constants';

import { resolveTourTaxonomy } from '../utils/tour-taxonomy';

describe('tour taxonomy', () => {
  describe('normalizeDepartureCity', () => {
    it('should canonicalize Turkish casing', () => {
      expect(normalizeDepartureCity('ankara')).toBe('Ankara');
      expect(normalizeDepartureCity('İSTANBUL')).toBe('İstanbul');
    });

    it('should not treat Antalya as Ankara', () => {
      expect(normalizeDepartureCity('Antalya')).toBe('Antalya');
      expect(normalizeDepartureCity('Ankara')).toBe('Ankara');
    });
  });

  describe('inferStayKind', () => {
    it('should infer day trip from legacy tourType', () => {
      expect(
        inferStayKind({ tourType: 'Günübirlik Tur', durationDays: 3 }),
      ).toBe(TourStayKind.DAY_TRIP);
    });

    it('should infer overnight when duration is more than one day', () => {
      expect(inferStayKind({ durationDays: 4, tourType: 'Kültür Turu' })).toBe(
        TourStayKind.OVERNIGHT,
      );
    });
  });

  describe('inferDestinationScope', () => {
    it('should default to domestic', () => {
      expect(inferDestinationScope({ tourType: 'Kültür Turu' })).toBe(
        TourDestinationScope.DOMESTIC,
      );
    });
  });

  describe('resolveTourTaxonomy', () => {
    it('should lock day trips to one day and keep departure cities exact', () => {
      const result = resolveTourTaxonomy({
        stayKind: TourStayKind.DAY_TRIP,
        durationDays: 4,
        departureCities: ['Ankara', 'ankara'],
      });

      expect(result.durationDays).toBe(1);
      expect(result.departureCities).toEqual(['Ankara']);
      expect(normalizeDepartureCities(['Antalya'])).toEqual(['Antalya']);
    });
  });
});
