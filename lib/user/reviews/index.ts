/**
 * Müşteri değerlendirme veri katmanı (istemci).
 * Şu an REST + polling kullanılıyor; Firebase için `UserReviewsSubscriptionProvider`
 * uygulayıp `useUserReviews({ subscriptionProvider })` ile takılabilir.
 */
export * from './types';
export { useUserReviews } from './use-user-reviews';
export type { UseUserReviewsOptions, UseUserReviewsResult } from './use-user-reviews';
export {
  createPollingUserReviewsSubscription,
  DEFAULT_POLLING_INTERVAL_MS,
} from './polling-subscription';
