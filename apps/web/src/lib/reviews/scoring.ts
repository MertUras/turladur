import {
  CATEGORY_RATING_KEYS,
  CategoryRatingKey,
  CategoryRatings,
  computeOverallRating,
} from './types';

/**
 * DEĞERLENDİRME PUANLAMA KURALLARI
 * ─────────────────────────────────
 *
 * 1. Tekil değerlendirme genel puanı (PartnerReview.rating):
 *    6 kategori puanının aritmetik ortalaması, 1–5 arası tamsayıya yuvarlanır.
 *    Müşteri formu gönderiminde hesaplanır (computeReviewOverall).
 *
 * 2. Operatör ajans puanı (TourOperator.rating / ExperienceOperator.rating):
 *    Tüm değerlendirmelerin "Tur Operatörü" (operatorRating) alanının ortalaması.
 *    Bu, ajansın genel puanıdır; üyelik seviyesi ve ana sayfa sıralaması buna dayanır.
 *    Eski kayıtlarda operatorRating null ise `rating` alanına düşülür.
 *
 * 3. Kategori ortalamaları (görüntüleme):
 *    Her kategori için o operatöre ait tüm değerlendirmelerin ilgili alanının ortalaması.
 *    Eski kayıtlarda kategori alanları null ise tüm kategoriler `rating` değeriyle
 *    temsil edilir (tutarlı görüntüleme için).
 */

export type OperatorType = 'tour' | 'experience';

export interface CategoryRatingAverages {
  guideRating: number | null;
  operatorRating: number | null;
  routeRating: number | null;
  foodRating: number | null;
  hotelRating: number | null;
  transportRating: number | null;
}

export interface OperatorRatingSummary {
  /** Ajans puanı: operatorRating ortalaması (yoksa rating'e düşer). */
  overallRating: number;
  reviewCount: number;
  categoryAverages: CategoryRatingAverages;
}

/** Tekil değerlendirme genel puanı — 6 kategorinin yuvarlanmış ortalaması. */
export function computeReviewOverall(categoryRatings: CategoryRatings): number {
  return computeOverallRating(categoryRatings);
}

export interface ReviewRatingRow {
  rating: number;
  guideRating?: number | null;
  operatorRating?: number | null;
  routeRating?: number | null;
  foodRating?: number | null;
  hotelRating?: number | null;
  transportRating?: number | null;
}

/** Operatör ajans puanına katkı sağlayan değer (operatorRating ?? rating). */
export function getAgencyScoreForReview(
  review: Pick<ReviewRatingRow, 'rating' | 'operatorRating'>,
): number {
  return review.operatorRating ?? review.rating;
}

/** Kategori ortalamasına katkı — kategori null ise legacy olarak rating kullanılır. */
export function getCategoryScoreForReview(
  review: ReviewRatingRow,
  key: CategoryRatingKey,
): number {
  const value = review[key];
  return value ?? review.rating;
}

/** Ham değerlendirme listesinden özet hesaplar (sağlayıcıdan bağımsız saf fonksiyon). */
export function computeOperatorRatingSummary(
  reviews: ReviewRatingRow[],
): OperatorRatingSummary {
  const reviewCount = reviews.length;

  if (reviewCount === 0) {
    return {
      overallRating: 0,
      reviewCount: 0,
      categoryAverages: {
        guideRating: null,
        operatorRating: null,
        routeRating: null,
        foodRating: null,
        hotelRating: null,
        transportRating: null,
      },
    };
  }

  const agencySum = reviews.reduce(
    (sum, r) => sum + getAgencyScoreForReview(r),
    0,
  );
  const overallRating = agencySum / reviewCount;

  const categoryAverages = {} as CategoryRatingAverages;
  for (const key of CATEGORY_RATING_KEYS) {
    const sum = reviews.reduce(
      (acc, r) => acc + getCategoryScoreForReview(r, key),
      0,
    );
    categoryAverages[key] = Math.round((sum / reviewCount) * 10) / 10;
  }

  return {
    overallRating: Math.round(overallRating * 100) / 100,
    reviewCount,
    categoryAverages,
  };
}

export interface RatingScoringProvider {
  recalculateOperatorRating(
    operatorId: string,
    type: OperatorType,
  ): Promise<OperatorRatingSummary>;

  getOperatorRatingSummary(
    operatorId: string,
    type: OperatorType,
  ): Promise<OperatorRatingSummary>;
}

export type StarRatingValue = 1 | 2 | 3 | 4 | 5;

export type StarDistribution = Record<StarRatingValue, number>;

export interface CategoryAggregate {
  average: number;
  count: number;
}

export interface ReviewAggregates {
  averageRating: number;
  reviewCount: number;
  starDistribution: StarDistribution;
  categoryAggregates: Record<CategoryRatingKey, CategoryAggregate>;
}

const EMPTY_STAR_DISTRIBUTION: StarDistribution = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
};

/** Yıldız dağılımı (1–5) — her değerlendirme kendi genel puanına göre sayılır. */
export function computeStarDistribution(
  reviews: Pick<ReviewRatingRow, 'rating'>[],
): StarDistribution {
  const distribution: StarDistribution = { ...EMPTY_STAR_DISTRIBUTION };

  for (const review of reviews) {
    const star = Math.min(
      5,
      Math.max(1, Math.round(review.rating)),
    ) as StarRatingValue;
    distribution[star]++;
  }

  return distribution;
}

/** Kategori bazlı ortalama ve katkı sağlayan değerlendirme sayısı. */
export function computeCategoryAggregates(
  reviews: ReviewRatingRow[],
): Record<CategoryRatingKey, CategoryAggregate> {
  const aggregates = {} as Record<CategoryRatingKey, CategoryAggregate>;

  for (const key of CATEGORY_RATING_KEYS) {
    const explicitReviews = reviews.filter((review) => review[key] != null);
    const pool = explicitReviews.length > 0 ? explicitReviews : reviews;
    const count = pool.length;
    const sum = pool.reduce(
      (acc, review) => acc + getCategoryScoreForReview(review, key),
      0,
    );

    aggregates[key] = {
      average: count > 0 ? Math.round((sum / count) * 10) / 10 : 0,
      count:
        explicitReviews.length > 0 ? explicitReviews.length : reviews.length,
    };
  }

  return aggregates;
}

/** Tur / operatör değerlendirme listesinden özet istatistikler. */
export function computeReviewAggregates(
  reviews: ReviewRatingRow[],
): ReviewAggregates {
  const reviewCount = reviews.length;

  if (reviewCount === 0) {
    const emptyCategoryAggregates = {} as Record<
      CategoryRatingKey,
      CategoryAggregate
    >;
    for (const key of CATEGORY_RATING_KEYS) {
      emptyCategoryAggregates[key] = { average: 0, count: 0 };
    }

    return {
      averageRating: 0,
      reviewCount: 0,
      starDistribution: { ...EMPTY_STAR_DISTRIBUTION },
      categoryAggregates: emptyCategoryAggregates,
    };
  }

  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);

  return {
    averageRating: Math.round((sum / reviewCount) * 10) / 10,
    reviewCount,
    starDistribution: computeStarDistribution(reviews),
    categoryAggregates: computeCategoryAggregates(reviews),
  };
}

/** En yüksek puana göre sıralar; eşit puanda en yeni değerlendirme önce gelir. */
export function sortReviewsByRatingDesc<
  T extends { rating: number; createdAt?: string },
>(reviews: T[]): T[] {
  return [...reviews].sort((a, b) => {
    if (b.rating !== a.rating) return b.rating - a.rating;
    if (a.createdAt && b.createdAt) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });
}
