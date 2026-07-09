import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
      prisma.partnerReview.findMany({
        where: { tourOperatorId: id },
        select: {
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
              tour: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
    ]);

    return NextResponse.json({
      ...tourOperator,
      tours,
      reviews,
    });
  } catch (error) {
    console.error('[TOUR_OPERATOR_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
