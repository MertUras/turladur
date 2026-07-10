import { prismaRatingScoringProvider } from './prisma-scoring-provider';

interface RecalculateParams {
  tourOperatorId?: string | null;
  experienceOperatorId?: string | null;
}

/**
 * Bir PartnerReview eklendiğinde/silindiğinde çağrılır: ilgili operatörün
 * operatorRating ortalamasını yeniden hesaplayıp `rating`, `reviewCount` ve
 * `membershipTier` alanlarını günceller (bkz. lib/reviews/scoring.ts).
 */
export async function recalculatePartnerTier({
  tourOperatorId,
  experienceOperatorId,
}: RecalculateParams) {
  if (tourOperatorId) {
    await prismaRatingScoringProvider.recalculateOperatorRating(tourOperatorId, 'tour');
  }

  if (experienceOperatorId) {
    await prismaRatingScoringProvider.recalculateOperatorRating(
      experienceOperatorId,
      'experience'
    );
  }
}
