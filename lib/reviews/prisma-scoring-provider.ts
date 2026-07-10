import { prisma } from '@/lib/prisma';
import { computeMembershipTier } from '@/lib/membership';
import {
  computeOperatorRatingSummary,
  OperatorRatingSummary,
  OperatorType,
  RatingScoringProvider,
  ReviewRatingRow,
} from './scoring';

const reviewSelect = {
  rating: true,
  guideRating: true,
  operatorRating: true,
  routeRating: true,
  foodRating: true,
  hotelRating: true,
  transportRating: true,
} as const;

const legacyReviewSelect = {
  rating: true,
} as const;

function isUnknownFieldError(error: unknown): boolean {
  return (
    error instanceof Error &&
    error.name === 'PrismaClientValidationError' &&
    error.message.includes('Unknown field')
  );
}

function toReviewRatingRow(
  row: { rating: number } & Partial<Omit<ReviewRatingRow, 'rating'>>
): ReviewRatingRow {
  return {
    rating: row.rating,
    guideRating: row.guideRating ?? null,
    operatorRating: row.operatorRating ?? null,
    routeRating: row.routeRating ?? null,
    foodRating: row.foodRating ?? null,
    hotelRating: row.hotelRating ?? null,
    transportRating: row.transportRating ?? null,
  };
}

async function fetchReviews(
  operatorId: string,
  type: OperatorType
): Promise<ReviewRatingRow[]> {
  const where =
    type === 'tour'
      ? { tourOperatorId: operatorId }
      : { experienceOperatorId: operatorId };

  try {
    const reviews = await prisma.partnerReview.findMany({ where, select: reviewSelect });
    return reviews.map(toReviewRatingRow);
  } catch (error) {
    if (!isUnknownFieldError(error)) {
      throw error;
    }

    const reviews = await prisma.partnerReview.findMany({ where, select: legacyReviewSelect });
    return reviews.map(toReviewRatingRow);
  }
}

async function persistSummary(
  operatorId: string,
  type: OperatorType,
  summary: OperatorRatingSummary
): Promise<void> {
  const data = {
    rating: summary.overallRating,
    reviewCount: summary.reviewCount,
    membershipTier: computeMembershipTier(summary.overallRating, summary.reviewCount),
  };

  if (type === 'tour') {
    await prisma.tourOperator.update({ where: { id: operatorId }, data });
  } else {
    await prisma.experienceOperator.update({ where: { id: operatorId }, data });
  }
}

export class PrismaRatingScoringProvider implements RatingScoringProvider {
  async getOperatorRatingSummary(
    operatorId: string,
    type: OperatorType
  ): Promise<OperatorRatingSummary> {
    const reviews = await fetchReviews(operatorId, type);
    return computeOperatorRatingSummary(reviews);
  }

  async recalculateOperatorRating(
    operatorId: string,
    type: OperatorType
  ): Promise<OperatorRatingSummary> {
    const summary = await this.getOperatorRatingSummary(operatorId, type);
    await persistSummary(operatorId, type, summary);
    return summary;
  }
}

export const prismaRatingScoringProvider = new PrismaRatingScoringProvider();
