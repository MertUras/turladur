import { prisma } from '@/lib/prisma';
import { CategoryFeedback, CategoryRatings } from './types';

export interface CreatePartnerReviewInput {
  rating: number;
  comment: string | null;
  categoryData: CategoryRatings | null;
  feedbackData: CategoryFeedback;
  userId: string;
  bookingId: string;
  tourOperatorId: string | null;
  experienceOperatorId: string | null;
}

const partnerReviewListSelect = {
  id: true,
  rating: true,
  comment: true,
  responseText: true,
  respondedAt: true,
  createdAt: true,
  guideRating: true,
  operatorRating: true,
  routeRating: true,
  foodRating: true,
  hotelRating: true,
  transportRating: true,
  guideFeedback: true,
  operatorFeedback: true,
  routeFeedback: true,
  foodFeedback: true,
  hotelFeedback: true,
  transportFeedback: true,
  user: {
    select: {
      name: true,
      image: true,
    },
  },
  booking: {
    select: {
      startDate: true,
      endDate: true,
      tour: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  tourOperator: {
    select: {
      companyName: true,
    },
  },
} as const;

const legacyPartnerReviewListSelect = {
  id: true,
  rating: true,
  comment: true,
  createdAt: true,
  user: {
    select: {
      name: true,
      image: true,
    },
  },
  booking: {
    select: {
      startDate: true,
      endDate: true,
      tour: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
} as const;

function isUnknownFieldError(error: unknown): boolean {
  return (
    error instanceof Error &&
    error.name === 'PrismaClientValidationError' &&
    error.message.includes('Unknown field')
  );
}

function buildLegacyCreateData(input: CreatePartnerReviewInput) {
  return {
    rating: input.rating,
    comment: input.comment,
    userId: input.userId,
    bookingId: input.bookingId,
    tourOperatorId: input.tourOperatorId,
    experienceOperatorId: input.experienceOperatorId,
  };
}

function buildFullCreateData(input: CreatePartnerReviewInput) {
  return {
    ...buildLegacyCreateData(input),
    ...(input.categoryData ?? {}),
    ...input.feedbackData,
  };
}

/** Stale Prisma client fallback: category/feedback alanları yoksa yalnızca rating kaydedilir. */
export async function createPartnerReview(input: CreatePartnerReviewInput) {
  try {
    return await prisma.partnerReview.create({ data: buildFullCreateData(input) });
  } catch (error) {
    if (!isUnknownFieldError(error)) {
      throw error;
    }

    console.warn(
      '[createPartnerReview] Stale Prisma client detected; retrying without category/feedback fields. Run `npx prisma generate`.'
    );
    return prisma.partnerReview.create({ data: buildLegacyCreateData(input) });
  }
}

export async function fetchPartnerReviewsForOperator(
  tourOperatorId: string,
  take = 20
) {
  try {
    return await prisma.partnerReview.findMany({
      where: { tourOperatorId },
      select: partnerReviewListSelect,
      orderBy: { createdAt: 'desc' },
      take,
    });
  } catch (error) {
    if (!isUnknownFieldError(error)) {
      throw error;
    }

    const reviews = await prisma.partnerReview.findMany({
      where: { tourOperatorId },
      select: legacyPartnerReviewListSelect,
      orderBy: { createdAt: 'desc' },
      take,
    });

    return reviews.map((review) => ({
      ...review,
      responseText: null,
      respondedAt: null,
      guideRating: null,
      operatorRating: null,
      routeRating: null,
      foodRating: null,
      hotelRating: null,
      transportRating: null,
      guideFeedback: null,
      operatorFeedback: null,
      routeFeedback: null,
      foodFeedback: null,
      hotelFeedback: null,
      transportFeedback: null,
      tourOperator: null,
    }));
  }
}
