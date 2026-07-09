import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tours = await prisma.tour.findMany({
      where: {
        tourOperatorId: id,
        NOT: {
          id: request.headers.get('x-current-tour-id') || ''
        }
      },
      include: {
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
        },
        tourOperator: {
          select: {
            id: true,
            companyName: true,
            logo: true,
            description: true,
            membershipTier: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 4
    });

    return NextResponse.json(tours);
  } catch (error) {
    console.error('[TOUR_OPERATOR_TOURS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 