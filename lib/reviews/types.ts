/** Kategori bazlı tur değerlendirme puanları (1–5). */
export interface CategoryRatings {
  guideRating: number;
  operatorRating: number;
  routeRating: number;
  foodRating: number;
  hotelRating: number;
  transportRating: number;
}

export type CategoryRatingKey = keyof CategoryRatings;

export const CATEGORY_RATING_KEYS: CategoryRatingKey[] = [
  'guideRating',
  'operatorRating',
  'routeRating',
  'foodRating',
  'hotelRating',
  'transportRating',
];

/** Müşteri tur değerlendirme formu etiketleri (Türkçe). */
export const CATEGORY_RATING_LABELS: Record<CategoryRatingKey, string> = {
  guideRating: 'Rehber',
  operatorRating: 'Tur Operatörü',
  routeRating: 'Rota',
  foodRating: 'Yemek',
  hotelRating: 'Oteller',
  transportRating: 'Ulaşım',
};

/** Düşük puan (1–2 yıldız) kategori geri bildirim alanları. Firebase geçişinde aynı şekil korunur. */
export interface CategoryFeedback {
  guideFeedback?: string;
  operatorFeedback?: string;
  routeFeedback?: string;
  foodFeedback?: string;
  hotelFeedback?: string;
  transportFeedback?: string;
}

export type CategoryFeedbackKey = keyof CategoryFeedback;

/** Kategori puanı anahtarı → geri bildirim alanı eşlemesi. */
export const CATEGORY_TO_FEEDBACK_KEY: Record<CategoryRatingKey, CategoryFeedbackKey> = {
  guideRating: 'guideFeedback',
  operatorRating: 'operatorFeedback',
  routeRating: 'routeFeedback',
  foodRating: 'foodFeedback',
  hotelRating: 'hotelFeedback',
  transportRating: 'transportFeedback',
};

/** Düşük puanlı kategori geri bildirimi için placeholder metni. */
export const LOW_RATING_FEEDBACK_PLACEHOLDER =
  'Bu durum bizi çok üzdü Memnuniyetinizi arttırmak için önerilerinize açığız';

/** POST /api/reviews/partner istek gövdesi. Firebase geçişinde aynı şekil korunur. */
export interface SubmitPartnerReviewRequest {
  bookingId: string;
  /** İstemci doğrulaması için opsiyonel; sunucu tur+ tarih grubunu bookingId üzerinden çözer. */
  reviewGroupKey?: string;
  comment?: string;
  categoryRatings: CategoryRatings;
  /** Yalnızca 1–2 yıldız verilen kategoriler için opsiyonel geri bildirim. */
  categoryFeedback?: Partial<Record<CategoryRatingKey, string>>;
}

export interface SubmitPartnerReviewResponse {
  success: true;
  reviewId: string;
  overallRating: number;
}

export interface SubmitPartnerReviewError {
  error: string;
}

/** 6 kategori puanının aritmetik ortalamasını 1–5 arası tamsayıya yuvarlar. */
export function computeOverallRating(ratings: CategoryRatings): number {
  const values = CATEGORY_RATING_KEYS.map((key) => ratings[key]);
  const sum = values.reduce((acc, value) => acc + value, 0);
  return Math.round(sum / values.length);
}

/** Tüm kategori puanlarının 1–5 aralığında olup olmadığını doğrular. */
export function validateCategoryRatings(
  ratings: Partial<CategoryRatings>
): ratings is CategoryRatings {
  return CATEGORY_RATING_KEYS.every(
    (key) => typeof ratings[key] === 'number' && ratings[key]! >= 1 && ratings[key]! <= 5
  );
}

/** İstek gövdesindeki kategori geri bildirimini veritabanı alanlarına dönüştürür. */
export function mapCategoryFeedbackToDb(
  feedback?: Partial<Record<CategoryRatingKey, string>>
): CategoryFeedback {
  const result: CategoryFeedback = {};
  if (!feedback) return result;

  for (const key of CATEGORY_RATING_KEYS) {
    const text = feedback[key]?.trim();
    if (text) {
      result[CATEGORY_TO_FEEDBACK_KEY[key]] = text;
    }
  }

  return result;
}
