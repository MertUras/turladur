import { escapeHtml } from './mail-layout';

export type VoucherGuestLine = {
  firstName: string;
  lastName: string;
  identityNumber: string;
};

export type VoucherTemplateData = {
  bookingNumber: string;
  issuedAt: Date;
  tourTitle: string;
  tourStartDate: Date | null;
  tourEndDate: Date | null;
  partnerName: string;
  partnerPhone: string | null;
  partnerTaxNumber: string | null;
  partnerLogoUrl: string | null;
  /** Absolute URL — turta wordmark (top-left). */
  platformLogoUrl: string | null;
  /** Absolute URL — TÜRSAB mark (top-left, next to turta). */
  tursabLogoUrl: string | null;
  guests: VoucherGuestLine[];
  pickupLocation: string | null;
  pickupTime: string | null;
  seatLabel: string;
  payerName: string;
  totalAmount: string;
  currency: string;
  paymentStatusLabel: string;
};

function formatDateTr(value: Date | null): string {
  if (!value) return '—';
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(value);
}

function formatDateTimeTr(value: Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value);
}

function formatMoneyTr(amount: string, currency: string): string {
  const numeric = Number(amount);
  if (!Number.isFinite(numeric)) return `${amount} ${currency}`;
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: currency || 'TRY',
  }).format(numeric);
}

function tourDateRange(start: Date | null, end: Date | null): string {
  if (!start && !end) return '—';
  if (start && end && start.getTime() !== end.getTime()) {
    return `${formatDateTr(start)} - ${formatDateTr(end)}`;
  }
  return formatDateTr(start ?? end);
}

export function resolveVoucherBrandLogos(webBaseUrl: string): {
  platformLogoUrl: string;
  tursabLogoUrl: string;
} {
  const base = webBaseUrl.replace(/\/$/, '');
  return {
    platformLogoUrl: `${base}/brand/wordmark-on-light.png`,
    tursabLogoUrl: `${base}/brand/tursab.svg`,
  };
}

/** Printable / email-safe tur katılım belgesi (voucher) HTML fragment (no html/body). */
export function renderVoucherHtml(data: VoucherTemplateData): string {
  const guestRows = data.guests
    .map((guest, index) => {
      const name = escapeHtml(`${guest.firstName} ${guest.lastName}`.trim());
      const tc = escapeHtml(guest.identityNumber || '—');
      return `<tr>
        <td style="padding:6px 0;border-bottom:1px solid #e5e5e5;font-size:13px;color:#171717;">
          ${index + 1}. ${name} — TC: ${tc}
        </td>
      </tr>`;
    })
    .join('');

  const platformLogo = data.platformLogoUrl
    ? `<img src="${escapeHtml(data.platformLogoUrl)}" alt="turta" height="36" style="height:36px;width:auto;max-width:140px;object-fit:contain;" />`
    : `<span style="font-size:18px;font-weight:800;color:#0a0a0a;letter-spacing:-0.02em;">turta</span>`;

  const tursabLogo = data.tursabLogoUrl
    ? `<img src="${escapeHtml(data.tursabLogoUrl)}" alt="TÜRSAB" height="36" style="height:36px;width:auto;max-width:110px;object-fit:contain;" />`
    : `<span style="display:inline-block;padding:6px 10px;background:#0B3D2E;color:#f5f5f4;font-size:11px;font-weight:700;letter-spacing:0.08em;border-radius:4px;">TÜRSAB</span>`;

  const partnerLogo = data.partnerLogoUrl
    ? `<img src="${escapeHtml(data.partnerLogoUrl)}" alt="${escapeHtml(data.partnerName)}" height="44" style="height:44px;width:auto;max-width:140px;object-fit:contain;" />`
    : `<span style="font-size:13px;font-weight:700;color:#0a0a0a;text-align:right;">${escapeHtml(data.partnerName)}</span>`;

  return `
  <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #d4d4d4;border-radius:8px;overflow:hidden;">
    <div style="padding:16px 24px;border-bottom:2px solid #0a0a0a;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="vertical-align:middle;width:55%;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-right:12px;vertical-align:middle;">${platformLogo}</td>
                <td style="vertical-align:middle;">${tursabLogo}</td>
              </tr>
            </table>
          </td>
          <td style="vertical-align:middle;text-align:right;width:45%;">${partnerLogo}</td>
        </tr>
      </table>
      <p style="margin:14px 0 0;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#737373;text-align:center;">Tur Katılım Belgesi (Voucher)</p>
      <h1 style="margin:6px 0 0;font-size:20px;color:#0a0a0a;text-align:center;">${escapeHtml(data.tourTitle)}</h1>
    </div>

    <div style="padding:20px 24px;border-bottom:1px solid #e5e5e5;">
      <p style="margin:0;font-size:16px;font-weight:700;color:#0a0a0a;">${escapeHtml(data.partnerName)}</p>
      <p style="margin:6px 0 0;font-size:12px;color:#525252;">
        İletişim: ${escapeHtml(data.partnerPhone || '—')}
        ${data.partnerTaxNumber ? ` | Vergi No: ${escapeHtml(data.partnerTaxNumber)}` : ''}
      </p>
    </div>

    <div style="padding:20px 24px;border-bottom:1px solid #e5e5e5;">
      <p style="margin:0 0 10px;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#737373;font-weight:600;">Rezervasyon Bilgileri</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding:4px 0;font-size:13px;color:#525252;">PNR / Rezervasyon No</td>
            <td style="padding:4px 0;font-size:13px;font-weight:700;text-align:right;font-family:ui-monospace,Menlo,monospace;">${escapeHtml(data.bookingNumber)}</td></tr>
        <tr><td style="padding:4px 0;font-size:13px;color:#525252;">İşlem Tarihi</td>
            <td style="padding:4px 0;font-size:13px;text-align:right;">${escapeHtml(formatDateTimeTr(data.issuedAt))}</td></tr>
        <tr><td style="padding:4px 0;font-size:13px;color:#525252;">Tur Adı</td>
            <td style="padding:4px 0;font-size:13px;text-align:right;">${escapeHtml(data.tourTitle)}</td></tr>
        <tr><td style="padding:4px 0;font-size:13px;color:#525252;">Tur Tarihi</td>
            <td style="padding:4px 0;font-size:13px;text-align:right;">${escapeHtml(tourDateRange(data.tourStartDate, data.tourEndDate))}</td></tr>
      </table>
    </div>

    <div style="padding:20px 24px;border-bottom:1px solid #e5e5e5;">
      <p style="margin:0 0 10px;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#737373;font-weight:600;">Yolcu Bilgileri</p>
      <table width="100%" cellpadding="0" cellspacing="0">${guestRows || '<tr><td style="font-size:13px;">—</td></tr>'}</table>
    </div>

    <div style="padding:20px 24px;border-bottom:1px solid #e5e5e5;">
      <p style="margin:0 0 10px;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#737373;font-weight:600;">Operasyonel Detaylar</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding:4px 0;font-size:13px;color:#525252;">Kalkış Noktası</td>
            <td style="padding:4px 0;font-size:13px;text-align:right;">${escapeHtml(data.pickupLocation || '—')}</td></tr>
        <tr><td style="padding:4px 0;font-size:13px;color:#525252;">Kalkış Saati</td>
            <td style="padding:4px 0;font-size:13px;text-align:right;">${escapeHtml(data.pickupTime || '—')}</td></tr>
        <tr><td style="padding:4px 0;font-size:13px;color:#525252;">Koltuk No</td>
            <td style="padding:4px 0;font-size:13px;text-align:right;">${escapeHtml(data.seatLabel)}</td></tr>
      </table>
    </div>

    <div style="padding:20px 24px;border-bottom:1px solid #e5e5e5;">
      <p style="margin:0 0 10px;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#737373;font-weight:600;">Ödeme Bilgileri</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding:4px 0;font-size:13px;color:#525252;">Ödemeyi Yapan</td>
            <td style="padding:4px 0;font-size:13px;text-align:right;">${escapeHtml(data.payerName)}</td></tr>
        <tr><td style="padding:4px 0;font-size:13px;color:#525252;">Toplam Tutar</td>
            <td style="padding:4px 0;font-size:13px;font-weight:700;text-align:right;">${escapeHtml(formatMoneyTr(data.totalAmount, data.currency))}</td></tr>
        <tr><td style="padding:4px 0;font-size:13px;color:#525252;">Durum</td>
            <td style="padding:4px 0;font-size:13px;font-weight:700;color:${data.paymentStatusLabel.includes('ÖDENDİ') ? '#15803d' : '#b45309'};text-align:right;">${escapeHtml(data.paymentStatusLabel)}</td></tr>
      </table>
    </div>

    <div style="padding:20px 24px;background:#fafafa;">
      <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#737373;font-weight:600;">Önemli Notlar</p>
      <ul style="margin:0;padding-left:18px;color:#525252;font-size:12px;line-height:1.55;">
        <li>Hareket saatinden en az 15 dakika önce kalkış noktasında bulunulması gerekmektedir.</li>
        <li>İptal ve iade koşulları mesafeli satış sözleşmesinde belirtilmiştir.</li>
        <li>Koltuk numarası partner tarafından atanır; güncel voucher için profilinizden tekrar indirebilirsiniz.</li>
      </ul>
    </div>
  </div>`;
}

export function wrapVoucherDocument(
  bookingNumber: string,
  fragmentHtml: string,
): string {
  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8" />
  <title>Voucher — ${escapeHtml(bookingNumber)}</title>
</head>
<body style="margin:0;padding:24px;background:#f5f5f5;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;">
${fragmentHtml}
</body>
</html>`;
}
