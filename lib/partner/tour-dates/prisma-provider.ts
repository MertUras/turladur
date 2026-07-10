import { BookingStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import {
  PartnerTourDatesContext,
  PartnerTourDatesProvider,
  TourDateActionResult,
  TourDateItem,
} from './types';

const TERMINAL_STATUSES = new Set(['COMPLETED', 'CANCELLED']);

function mapTourDate(tourDate: {
  id: string;
  tourId: string;
  startDate: Date;
  endDate: Date;
  price: number;
  availableSeats: number;
  status: string;
  isActive: boolean;
  updatedAt: Date;
}): TourDateItem {
  return {
    id: tourDate.id,
    tourId: tourDate.tourId,
    startDate: tourDate.startDate.toISOString(),
    endDate: tourDate.endDate.toISOString(),
    price: tourDate.price,
    availableSeats: tourDate.availableSeats,
    status: tourDate.status as TourDateItem['status'],
    isActive: tourDate.isActive,
    updatedAt: tourDate.updatedAt.toISOString(),
  };
}

async function assertOwnedTourDate(
  context: PartnerTourDatesContext,
  tourId: string,
  dateId: string
) {
  const tourDate = await prisma.tourDate.findFirst({
    where: {
      id: dateId,
      tourId,
      tour: { tourOperatorId: context.tourOperatorId },
    },
  });

  return tourDate;
}

export class PrismaPartnerTourDatesProvider implements PartnerTourDatesProvider {
  async completeTourDate(
    context: PartnerTourDatesContext,
    tourId: string,
    dateId: string
  ): Promise<TourDateActionResult | null> {
    const tourDate = await assertOwnedTourDate(context, tourId, dateId);
    if (!tourDate) return null;

    if (TERMINAL_STATUSES.has(tourDate.status)) {
      throw new Error('Bu tur tarihi zaten tamamlanmış veya iptal edilmiş');
    }

    const now = new Date();
    const reviewEndDate = tourDate.endDate < now ? tourDate.endDate : now;

    const result = await prisma.$transaction(async (tx) => {
      const updatedTourDate = await tx.tourDate.update({
        where: { id: dateId },
        data: {
          status: 'COMPLETED',
          isActive: false,
        },
      });

      const bookingUpdate = await tx.booking.updateMany({
        where: {
          tourId,
          startDate: tourDate.startDate,
          endDate: tourDate.endDate,
          status: BookingStatus.CONFIRMED,
        },
        data: {
          status: BookingStatus.COMPLETED,
          endDate: reviewEndDate,
        },
      });

      return { updatedTourDate, updatedBookingsCount: bookingUpdate.count };
    });

    return {
      tourDate: mapTourDate(result.updatedTourDate),
      updatedBookingsCount: result.updatedBookingsCount,
    };
  }

  async cancelTourDate(
    context: PartnerTourDatesContext,
    tourId: string,
    dateId: string
  ): Promise<TourDateActionResult | null> {
    const tourDate = await assertOwnedTourDate(context, tourId, dateId);
    if (!tourDate) return null;

    if (TERMINAL_STATUSES.has(tourDate.status)) {
      throw new Error('Bu tur tarihi zaten tamamlanmış veya iptal edilmiş');
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedTourDate = await tx.tourDate.update({
        where: { id: dateId },
        data: {
          status: 'CANCELLED',
          isActive: false,
        },
      });

      const bookingUpdate = await tx.booking.updateMany({
        where: {
          tourId,
          startDate: tourDate.startDate,
          endDate: tourDate.endDate,
          status: {
            in: [
              BookingStatus.CONFIRMED,
              BookingStatus.PENDING,
              BookingStatus.PENDING_PAYMENT,
            ],
          },
        },
        data: {
          status: BookingStatus.CANCELLED,
        },
      });

      return { updatedTourDate, updatedBookingsCount: bookingUpdate.count };
    });

    return {
      tourDate: mapTourDate(result.updatedTourDate),
      updatedBookingsCount: result.updatedBookingsCount,
    };
  }
}

export const prismaPartnerTourDatesProvider = new PrismaPartnerTourDatesProvider();
