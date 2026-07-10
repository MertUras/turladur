import { CategoryFeedbackKey, CATEGORY_TO_FEEDBACK_KEY } from '@/lib/reviews/types';
import { CategoryRatingAverages } from '@/lib/reviews/scoring';

export interface PartnerReviewCategoryRatings {
  guideRating: number | null;
  operatorRating: number | null;
  routeRating: number | null;
  foodRating: number | null;
  hotelRating: number | null;
  transportRating: number | null;
}

export interface PartnerReviewCategoryFeedback {
  guideFeedback: string | null;
  operatorFeedback: string | null;
  routeFeedback: string | null;
  foodFeedback: string | null;
  hotelFeedback: string | null;
  transportFeedback: string | null;
}

export type PartnerReviewCategoryFeedbackByRatingKey = Partial<
  Record<keyof PartnerReviewCategoryRatings, string>
>;

export function resolveCategoryFeedback(
  categoryRatings: PartnerReviewCategoryRatings,
  categoryFeedback: PartnerReviewCategoryFeedback
): PartnerReviewCategoryFeedbackByRatingKey {
  const result: PartnerReviewCategoryFeedbackByRatingKey = {};

  for (const [ratingKey, feedbackKey] of Object.entries(CATEGORY_TO_FEEDBACK_KEY) as Array<
    [keyof PartnerReviewCategoryRatings, CategoryFeedbackKey]
  >) {
    const rating = categoryRatings[ratingKey];
    const feedback = categoryFeedback[feedbackKey];
    if (rating != null && rating < 3 && feedback?.trim()) {
      result[ratingKey] = feedback.trim();
    }
  }

  return result;
}

export interface PartnerReviewItem {
  id: string;
  customerName: string;
  customerImage?: string;
  tourName: string;
  tourId: string;
  productType: 'tour' | 'experience';
  rating: number;
  categoryRatings: PartnerReviewCategoryRatings;
  categoryFeedback: PartnerReviewCategoryFeedback;
  reviewDate: string;
  reviewDateRaw: string;
  reviewText: string;
  isResponded: boolean;
  responseText?: string;
  respondedAt?: string;
}

export interface PartnerReviewsStats {
  total: number;
  averageRating: string;
  fiveStarCount: number;
  fiveStarPercentage: number;
  respondedCount: number;
  respondedPercentage: number;
  categoryAverages?: CategoryRatingAverages;
}

export interface PartnerReviewsData {
  reviews: PartnerReviewItem[];
  stats: PartnerReviewsStats;
}

export type PartnerReviewsContext =
  | { operatorType: 'tour'; tourOperatorId: string; userId: string }
  | { operatorType: 'experience'; experienceOperatorId: string; userId: string };

export interface PartnerReviewsProvider {
  list(context: PartnerReviewsContext): Promise<PartnerReviewsData>;
  reply(
    context: PartnerReviewsContext,
    reviewId: string,
    responseText: string
  ): Promise<PartnerReviewItem | null>;
}

/** İstemci tarafı gerçek zamanlı abonelik geri çağrıları */
export interface PartnerReviewsSubscriptionCallbacks {
  onData: (data: PartnerReviewsData) => void;
  onError: (error: Error) => void;
  onFetching?: () => void;
}

/**
 * İstemci tarafı abonelik sağlayıcısı.
 * Prisma uygulaması polling kullanır; Firebase uygulaması onSnapshot kullanabilir.
 */
export interface PartnerReviewsSubscriptionProvider {
  subscribe(callbacks: PartnerReviewsSubscriptionCallbacks): () => void;
}

export const EMPTY_PARTNER_REVIEWS_STATS: PartnerReviewsStats = {
  total: 0,
  averageRating: '0.0',
  fiveStarCount: 0,
  fiveStarPercentage: 0,
  respondedCount: 0,
  respondedPercentage: 0,
};

export const EMPTY_PARTNER_REVIEWS_DATA: PartnerReviewsData = {
  reviews: [],
  stats: EMPTY_PARTNER_REVIEWS_STATS,
};
