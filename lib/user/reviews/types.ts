import {
  PartnerReviewCategoryFeedback,
  PartnerReviewCategoryRatings,
} from '@/lib/partner/reviews/types';

export interface UserReview {
  id: string;
  rating: number;
  comment: string | null;
  categoryRatings: PartnerReviewCategoryRatings;
  categoryFeedback: PartnerReviewCategoryFeedback;
  responseText: string | null;
  respondedAt: string | null;
  createdAt: string;
  bookingNumber: string;
  productName: string;
  productType: 'tour' | 'experience';
  operatorName: string;
  tourDate: string;
  tourDateLabel: string;
  /** Örn. "Kapadokya Turu · 23 Temmuz 2026" */
  displayTitle: string;
}

export interface UserReviewsData {
  reviews: UserReview[];
}

/** İstemci tarafı gerçek zamanlı abonelik geri çağrıları */
export interface UserReviewsSubscriptionCallbacks {
  onData: (data: UserReviewsData) => void;
  onError: (error: Error) => void;
  onFetching?: () => void;
}

/**
 * İstemci tarafı abonelik sağlayıcısı.
 * Prisma uygulaması polling kullanır; Firebase uygulaması onSnapshot kullanabilir.
 */
export interface UserReviewsSubscriptionProvider {
  subscribe(callbacks: UserReviewsSubscriptionCallbacks): () => void;
}

export const EMPTY_USER_REVIEWS_DATA: UserReviewsData = {
  reviews: [],
};
