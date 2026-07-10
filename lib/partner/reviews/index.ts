import { PartnerReviewsProvider } from './types';
import { prismaPartnerReviewsProvider } from './prisma-provider';

/**
 * Partner değerlendirme veri katmanı.
 * Şu an Prisma kullanılıyor; gelecekte Firebase sağlayıcısı buradan takılabilir.
 */
export function getPartnerReviewsProvider(): PartnerReviewsProvider {
  return prismaPartnerReviewsProvider;
}

export * from './types';
export { usePartnerReviews } from './use-partner-reviews';
export type { UsePartnerReviewsOptions, UsePartnerReviewsResult } from './use-partner-reviews';
export {
  createPollingPartnerReviewsSubscription,
  DEFAULT_POLLING_INTERVAL_MS,
} from './polling-subscription';
