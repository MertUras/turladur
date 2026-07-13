import 'server-only';

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
