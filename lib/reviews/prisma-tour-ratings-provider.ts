import { prisma } from '@/lib/prisma';
import {
  computeTourRatingSummary,
  TourRatingProvider,
  TourRatingSummary,
} from './tour-ratings';

const EMPTY_SUMMARY: TourRatingSummary = {
  averageRating: 0,
  reviewCount: 0,
};

function buildRatingsMap(
  tourIds: string[],
  reviews: { rating: number; booking: { tourId: string | null } }[]
): Map<string, TourRatingSummary> {
  const grouped = new Map<string, { rating: number }[]>();

  for (const tourId of tourIds) {
    grouped.set(tourId, []);
  }

  for (const review of reviews) {
    const tourId = review.booking.tourId;
    if (!tourId || !grouped.has(tourId)) continue;
    grouped.get(tourId)!.push({ rating: review.rating });
  }

  const result = new Map<string, TourRatingSummary>();
  for (const [tourId, rows] of grouped) {
    result.set(tourId, computeTourRatingSummary(rows));
  }

  return result;
}

export class PrismaTourRatingProvider implements TourRatingProvider {
  async getTourRatingSummary(tourId: string): Promise<TourRatingSummary> {
    const ratings = await this.getTourRatingsForTourIds([tourId]);
    return ratings.get(tourId) ?? EMPTY_SUMMARY;
  }

  async getTourRatingsForTourIds(tourIds: string[]): Promise<Map<string, TourRatingSummary>> {
    if (tourIds.length === 0) {
      return new Map();
    }

    const reviews = await prisma.partnerReview.findMany({
      where: {
        booking: {
          tourId: { in: tourIds },
        },
      },
      select: {
        rating: true,
        booking: {
          select: {
            tourId: true,
          },
        },
      },
    });

    return buildRatingsMap(tourIds, reviews);
  }
}

export const prismaTourRatingProvider = new PrismaTourRatingProvider();
