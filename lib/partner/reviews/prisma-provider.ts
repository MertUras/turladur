import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { formatTurkishDate } from '@/lib/partner/dashboard/utils';
import { computeOperatorRatingSummary } from '@/lib/reviews/scoring';
import {
  PartnerReviewItem,
  PartnerReviewsContext,
  PartnerReviewsData,
  PartnerReviewsProvider,
} from './types';

const reviewInclude = {
  user: {
    select: {
      name: true,
      image: true,
    },
  },
  booking: {
    select: {
      tour: { select: { id: true, name: true } },
      experience: { select: { id: true, title: true } },
    },
  },
} satisfies Prisma.PartnerReviewInclude;

type ReviewWithRelations = Prisma.PartnerReviewGetPayload<{
  include: typeof reviewInclude;
}>;

function reviewWhere(context: PartnerReviewsContext): Prisma.PartnerReviewWhereInput {
  return context.operatorType === 'tour'
    ? { tourOperatorId: context.tourOperatorId }
    : { experienceOperatorId: context.experienceOperatorId };
}

function mapReview(review: ReviewWithRelations): PartnerReviewItem {
  const product = review.booking.tour ?? review.booking.experience;
  const productName =
    review.booking.tour?.name ?? review.booking.experience?.title ?? 'Ürün';
  const productId = review.booking.tour?.id ?? review.booking.experience?.id ?? '';

  return {
    id: review.id,
    customerName: review.user.name || 'Müşteri',
    customerImage: review.user.image || undefined,
    tourName: productName,
    tourId: productId,
    productType: review.booking.tour ? 'tour' : 'experience',
    rating: review.rating,
    categoryRatings: {
      guideRating: review.guideRating,
      operatorRating: review.operatorRating,
      routeRating: review.routeRating,
      foodRating: review.foodRating,
      hotelRating: review.hotelRating,
      transportRating: review.transportRating,
    },
    categoryFeedback: {
      guideFeedback: review.guideFeedback,
      operatorFeedback: review.operatorFeedback,
      routeFeedback: review.routeFeedback,
      foodFeedback: review.foodFeedback,
      hotelFeedback: review.hotelFeedback,
      transportFeedback: review.transportFeedback,
    },
    reviewDate: formatTurkishDate(review.createdAt),
    reviewDateRaw: review.createdAt.toISOString(),
    reviewText: review.comment || '',
    isResponded: Boolean(review.responseText?.trim()),
    responseText: review.responseText || undefined,
    respondedAt: review.respondedAt?.toISOString(),
  };
}

function buildStats(
  reviews: PartnerReviewItem[],
  agencyOverallRating: number
): PartnerReviewsData['stats'] {
  const total = reviews.length;
  if (total === 0) {
    return {
      total: 0,
      averageRating: '0.0',
      fiveStarCount: 0,
      fiveStarPercentage: 0,
      respondedCount: 0,
      respondedPercentage: 0,
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

  const fiveStarCount = reviews.filter((review) => review.rating === 5).length;
  const respondedCount = reviews.filter((review) => review.isResponded).length;

  const ratingRows = reviews.map((r) => ({
    rating: r.rating,
    ...r.categoryRatings,
  }));
  const summary = computeOperatorRatingSummary(ratingRows);

  return {
    total,
    averageRating: agencyOverallRating.toFixed(1),
    fiveStarCount,
    fiveStarPercentage: Math.round((fiveStarCount / total) * 100),
    respondedCount,
    respondedPercentage: Math.round((respondedCount / total) * 100),
    categoryAverages: summary.categoryAverages,
  };
}

export class PrismaPartnerReviewsProvider implements PartnerReviewsProvider {
  async list(context: PartnerReviewsContext): Promise<PartnerReviewsData> {
    const reviews = await prisma.partnerReview.findMany({
      where: reviewWhere(context),
      include: reviewInclude,
      orderBy: { createdAt: 'desc' },
    });

    const items = reviews.map(mapReview);
    const ratingRows = reviews.map((r) => ({
      rating: r.rating,
      guideRating: r.guideRating,
      operatorRating: r.operatorRating,
      routeRating: r.routeRating,
      foodRating: r.foodRating,
      hotelRating: r.hotelRating,
      transportRating: r.transportRating,
    }));
    const summary = computeOperatorRatingSummary(ratingRows);

    return {
      reviews: items,
      stats: buildStats(items, summary.overallRating),
    };
  }

  async reply(
    context: PartnerReviewsContext,
    reviewId: string,
    responseText: string
  ): Promise<PartnerReviewItem | null> {
    const trimmed = responseText.trim();
    if (!trimmed) return null;

    const existing = await prisma.partnerReview.findFirst({
      where: {
        id: reviewId,
        ...reviewWhere(context),
      },
      select: { id: true },
    });

    if (!existing) return null;

    const updated = await prisma.partnerReview.update({
      where: { id: reviewId },
      data: {
        responseText: trimmed,
        respondedAt: new Date(),
      },
      include: reviewInclude,
    });

    return mapReview(updated);
  }
}

export const prismaPartnerReviewsProvider = new PrismaPartnerReviewsProvider();
