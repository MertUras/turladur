import { MembershipTier } from '@prisma/client';

/**
 * Puan Değerlendirme (score rating) kuralları.
 * Yıldız seviyesi, hem minimum doğrulanmış değerlendirme sayısını hem de
 * ortalama puanı karşılamalıdır. Yalnızca tamamlanmış rezervasyonlara bağlı
 * değerlendirmeler "doğrulanmış" sayılır (bkz. prisma-scoring-provider).
 */
export const RATING_TIER_RULES = [
  { stars: 1, minVerifiedReviews: 10, minAverage: 4.0 },
  { stars: 2, minVerifiedReviews: 25, minAverage: 4.1 },
  { stars: 3, minVerifiedReviews: 50, minAverage: 4.2 },
  { stars: 4, minVerifiedReviews: 100, minAverage: 4.3 },
  { stars: 5, minVerifiedReviews: 200, minAverage: 4.4 },
] as const;

export type StarTier = 0 | 1 | 2 | 3 | 4 | 5;

/** Yıldız seviyesinden Bronze/Silver/Gold üyelik rozetine eşleme. */
export function starTierToMembershipTier(stars: StarTier): MembershipTier {
  if (stars >= 3) return 'GOLD';
  if (stars === 2) return 'SILVER';
  return 'BRONZE';
}

/** Doğrulanmış değerlendirme sayısı ve ortalama puana göre yıldız seviyesini hesaplar. */
export function computeStarTier(verifiedReviewCount: number, averageRating: number): StarTier {
  let stars: StarTier = 0;

  for (const rule of RATING_TIER_RULES) {
    if (verifiedReviewCount >= rule.minVerifiedReviews && averageRating >= rule.minAverage) {
      stars = rule.stars;
    }
  }

  return stars;
}

/** Ortalama puan ve doğrulanmış değerlendirme sayısına göre üyelik seviyesini hesaplar. */
export function computeMembershipTier(averageRating: number, reviewCount: number): MembershipTier {
  return starTierToMembershipTier(computeStarTier(reviewCount, averageRating));
}

/** DB'deki önbellekli alanlardan güncel üyelik seviyesini türetir. */
export function resolveMembershipTier(
  rating: number | null | undefined,
  reviewCount: number | null | undefined
): MembershipTier {
  return computeMembershipTier(rating ?? 0, reviewCount ?? 0);
}
