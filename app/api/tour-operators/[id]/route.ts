import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OperatorRatingSummary } from '@/lib/reviews';
import { getRatingScoringProvider } from '@/lib/reviews/server';
import { fetchPartnerReviewsForOperator } from '@/lib/reviews/partner-review-queries';
import { resolveMembershipTier } from '@/lib/membership';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const tourOperator = await prisma.tourOperator.findUnique({
      where: { id },
      select: {
        id: true,
        companyName: true,
        email: true,
        phone: true,
        logo: true,
        description: true,
        status: true,
        address: true,
        city: true,
        country: true,
        website: true,
        rating: true,
        reviewCount: true,
        membershipTier: true,
        certified: true,
        license: true,
        _count: {
          select: {
            tours: true,
          },
        },
      },
    });

    if (!tourOperator) {
      return new NextResponse('Tur operatörü bulunamadı', { status: 404 });
    }

    const scoringProvider = getRatingScoringProvider();
    let ratingSummary: OperatorRatingSummary;
    try {
      ratingSummary = await scoringProvider.getOperatorRatingSummary(id, 'tour');
    } catch (scoringError) {
      console.error('[TOUR_OPERATOR_GET] rating summary failed, using cached values', scoringError);
      ratingSummary = {
        overallRating: tourOperator.rating ?? 0,
        reviewCount: tourOperator.reviewCount ?? 0,
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

    const [tours, reviews] = await Promise.all([
      prisma.tour.findMany({
        where: { tourOperatorId: id },
        select: {
          id: true,
          name: true,
          description: true,
          duration: true,
          price: true,
          discount: true,
          destinations: true,
          images: true,
          rating: true,
          maxParticipants: true,
          inclusions: true,
          tourDates: {
            select: {
              id: true,
              startDate: true,
              endDate: true,
              price: true,
              availableSeats: true,
            },
            orderBy: { startDate: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      fetchPartnerReviewsForOperator(id),
    ]);

    return NextResponse.json({
      ...tourOperator,
      rating: ratingSummary.overallRating,
      reviewCount: ratingSummary.reviewCount,
      membershipTier: resolveMembershipTier(ratingSummary.overallRating, ratingSummary.reviewCount),
      categoryAverages: ratingSummary.categoryAverages,
      tours,
      reviews,
    });
  } catch (error) {
    console.error('[TOUR_OPERATOR_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
