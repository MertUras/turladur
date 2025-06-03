import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tourOperator = await prisma.tourOperator.findUnique({
      where: {
        id: params.id,
      },
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
        certified: true,
        _count: {
          select: {
            tours: true
          }
        }
      },
    });

    if (!tourOperator) {
      return new NextResponse('Tur operatörü bulunamadı', { status: 404 });
    }

    // Tur operatörünün turlarını getir
    const tours = await prisma.tour.findMany({
      where: {
        tourOperatorId: params.id,
      },
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
        tourDates: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
            price: true,
            availableSeats: true,
          },
          orderBy: {
            startDate: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 4
    });

    return NextResponse.json({
      ...tourOperator,
      tours
    });
  } catch (error) {
    console.error('[TOUR_OPERATOR_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 