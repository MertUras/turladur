import { RatingScoringProvider } from './scoring';
import { prismaRatingScoringProvider } from './prisma-scoring-provider';
import { TourRatingProvider } from './tour-ratings';
import { prismaTourRatingProvider } from './prisma-tour-ratings-provider';

export { recalculatePartnerTier } from './recalculate';

/**
 * Değerlendirme puanlama veri katmanı.
 * Şu an Prisma kullanılıyor; gelecekte Firebase sağlayıcısı buradan takılabilir.
 */
export function getRatingScoringProvider(): RatingScoringProvider {
  return prismaRatingScoringProvider;
}

/** Tur bazlı değerlendirme özeti veri katmanı (Firebase geçişine hazır). */
export function getTourRatingProvider(): TourRatingProvider {
  return prismaTourRatingProvider;
}
