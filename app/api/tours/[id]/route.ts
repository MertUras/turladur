import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { Prisma } from '@prisma/client';

interface TourDate {
  id: string;
  startDate: Date;
  endDate: Date;
  price: number;
  availableSeats: number;
  soldSeats: number;
  waitingList: number;
  minParticipants: number;
  maxParticipants: number;
  earlyBirdDiscount: number | null;
  lastMinuteDiscount: number | null;
  earlyBirdDeadline: Date | null;
  lastMinuteStart: Date | null;
  status: string;
  notes: string | null;
  ageRanges: {
    id: string;
    minAge: number;
    description: string;
    pricingType: string;
    value: number;
  }[];
}

interface Tour {
  id: string;
  name: string;
  description: string | null;
  tourOperator: {
    id: string;
    companyName: string;
    logo: string | null;
    description: string | null;
  };
  tourDates: TourDate[];
  [key: string]: any;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Bugünün tarihini normalize et
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Turu ve ilişkili tarihleri getir
    const tour = await prisma.tour.findUnique({
      where: {
        id: params.id,
      },
      include: {
        tourOperator: {
          select: {
            id: true,
            companyName: true,
            logo: true,
            description: true,
          },
        },
        tourDates: {
          where: {
            AND: [
              { isActive: true },
              { status: 'ACTIVE' },
              { startDate: { gte: today } }
            ]
          },
          include: {
            ageRanges: true
          },
          orderBy: {
            startDate: 'asc'
          }
        }
      },
    });

    if (!tour) {
      return NextResponse.json({ error: 'Tur bulunamadı' }, { status: 404 });
    }

    // Tarihleri dönüştür
    const transformedTour = {
      ...tour,
      tourDates: tour.tourDates.map(date => ({
        ...date,
        startDate: date.startDate.toISOString(),
        endDate: date.endDate.toISOString(),
        earlyBirdDeadline: date.earlyBirdDeadline?.toISOString(),
        lastMinuteStart: date.lastMinuteStart?.toISOString()
      }))
    };

    return NextResponse.json(transformedTour);
  } catch (error) {
    console.error('Tur detayları alınırken hata:', error);
    return NextResponse.json(
      { error: 'Tur detayları alınırken bir hata oluştu' },
      { status: 500 }
    );
  }
} 