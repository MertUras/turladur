/**
 * Müşteri rezervasyon veri katmanı (istemci).
 * Şu an REST + polling kullanılıyor; Firebase için `UserBookingsSubscriptionProvider`
 * uygulayıp `useUserBookings({ subscriptionProvider })` ile takılabilir.
 */
export * from './types';
export { mapUserBookingToBooking } from './map-to-booking';
export { useUserBookings } from './use-user-bookings';
export type { UseUserBookingsOptions, UseUserBookingsResult } from './use-user-bookings';
export {
  createPollingUserBookingsSubscription,
  DEFAULT_POLLING_INTERVAL_MS,
} from './polling-subscription';
export {
  buildPartnerReviewGroupKey,
  countPendingPartnerReviews,
  formatBookingDisplayDate,
  getBookingGuestCount,
  resolvePartnerReviewGroups,
} from './booking-display';
export { extractBookingSpecialConditions } from './special-conditions';
