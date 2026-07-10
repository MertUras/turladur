/**
 * Tur bazlı değerlendirme özeti.
 * Firebase geçişinde aynı arayüz korunur; yalnızca sağlayıcı değişir.
 */

export interface TourRatingSummary {
  /** PartnerReview.rating ortalaması (1–5). */
  averageRating: number;
  reviewCount: number;
}

export interface TourRatingRow {
  rating: number;
}

const EMPTY_SUMMARY: TourRatingSummary = {
  averageRating: 0,
  reviewCount: 0,
};

/** Ham değerlendirme listesinden tur özeti hesaplar (sağlayıcıdan bağımsız). */
export function computeTourRatingSummary(reviews: TourRatingRow[]): TourRatingSummary {
  const reviewCount = reviews.length;

  if (reviewCount === 0) {
    return EMPTY_SUMMARY;
  }

  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);

  return {
    averageRating: Math.round((sum / reviewCount) * 10) / 10,
    reviewCount,
  };
}

export interface TourRatingProvider {
  getTourRatingSummary(tourId: string): Promise<TourRatingSummary>;
  getTourRatingsForTourIds(tourIds: string[]): Promise<Map<string, TourRatingSummary>>;
}
