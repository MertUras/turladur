import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { formatDate } from '@/app/utils/format';
import { UserReview } from '@/lib/user/reviews/types';

const reviewInclude = {
  booking: {
    select: {
      bookingNumber: true,
      startDate: true,
      tour: { select: { name: true } },
      experience: { select: { title: true } },
    },
  },
  tourOperator: { select: { companyName: true } },
  experienceOperator: { select: { companyName: true } },
} satisfies Prisma.PartnerReviewInclude;

type ReviewWithRelations = Prisma.PartnerReviewGetPayload<{
  include: typeof reviewInclude;
}>;

function mapReview(review: ReviewWithRelations): UserReview {
  const productName =
    review.booking.tour?.name ?? review.booking.experience?.title ?? 'Tur';
  const productType: UserReview['productType'] = review.booking.tour ? 'tour' : 'experience';
  const operatorName =
    review.tourOperator?.companyName ??
    review.experienceOperator?.companyName ??
    'Operatör';
  const tourDate = review.booking.startDate.toISOString();
  const tourDateLabel = formatDate(review.booking.startDate);

  return {
    id: review.id,
    rating: review.rating,
    comment: review.comment,
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
    responseText: review.responseText,
    respondedAt: review.respondedAt?.toISOString() ?? null,
    createdAt: review.createdAt.toISOString(),
    bookingNumber: review.booking.bookingNumber,
    productName,
    productType,
    operatorName,
    tourDate,
    tourDateLabel,
    displayTitle: `${productName} · ${tourDateLabel}`,
  };
}

// GET /api/user/reviews
// Oturum açmış müşterinin tüm PartnerReview kayıtlarını döner.
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reviews = await prisma.partnerReview.findMany({
      where: { userId: session.user.id },
      include: reviewInclude,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ reviews: reviews.map(mapReview) });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
