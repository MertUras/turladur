export enum Role {
  CUSTOMER = 'CUSTOMER',
  PARTNER = 'PARTNER',
  PARTNER_STAFF = 'PARTNER_STAFF',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  AWAITING_3DS = 'AWAITING_3DS',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum TourCategory {
  CULTURAL = 'CULTURAL',
  ADVENTURE = 'ADVENTURE',
  GASTRONOMY = 'GASTRONOMY',
  NATURE = 'NATURE',
  CITY = 'CITY',
  BEACH = 'BEACH',
}

export enum TourStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

/** Partner cancels an entire tour (delists) — shown in UI + emails. */
export enum TourCancelReason {
  OPERATIONAL = 'OPERATIONAL',
  LOW_PARTICIPANTS = 'LOW_PARTICIPANTS',
  WEATHER = 'WEATHER',
}

export const TOUR_CANCEL_REASON_LABELS: Record<TourCancelReason, string> = {
  [TourCancelReason.OPERATIONAL]: 'Operasyonel nedenler',
  [TourCancelReason.LOW_PARTICIPANTS]: 'Yetersiz katılımcı sayısı',
  [TourCancelReason.WEATHER]: 'Hava koşulları',
};

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_LIMIT = 20;
export const MAX_PAGE_LIMIT = 100;
export const DEFAULT_CURRENCY = 'TRY';

/** Tour operator declares which health conditions the tour can accommodate. */
export const HEALTH_PRIVILEGE_OPTIONS = [
  'Tip 1 Diyabet',
  'Tip 2 Diyabet',
  'Çölyak (Glütensiz)',
  'Laktoz intoleransı',
  'Fındık / fıstık alerjisi',
  'Deniz ürünü alerjisi',
  'Astım',
  'Epilepsi',
  'Kalp rahatsızlığı',
  'Hareket kısıtlılığı',
  'Görme engeli desteği',
  'İşitme engeli desteği',
  'Hamilelik',
] as const;
