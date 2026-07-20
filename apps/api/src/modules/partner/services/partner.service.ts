import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Prisma } from '../../../generated/prisma';

import { PrismaService } from '../../../core/database/prisma.service';
import { BusinessException } from '../../../shared/exceptions/business.exception';
import { BookingCompletedEvent } from '../../booking/events/booking-completed.event';

@Injectable()
export class PartnerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async getDashboardStats(partnerId: string | undefined) {
    this.requirePartnerId(partnerId);

    const [tourCount, publishedCount, pendingCount, reservationCount, revenue] =
      await Promise.all([
        this.prisma.tour.count({
          where: { partnerId, deletedAt: null },
        }),
        this.prisma.tour.count({
          where: { partnerId, deletedAt: null, status: 'PUBLISHED' },
        }),
        this.prisma.tour.count({
          where: { partnerId, deletedAt: null, status: 'PENDING_REVIEW' },
        }),
        this.prisma.reservation.count({
          where: { partnerId, deletedAt: null },
        }),
        this.prisma.reservation.aggregate({
          where: {
            partnerId,
            deletedAt: null,
            status: { in: ['CONFIRMED', 'COMPLETED'] },
          },
          _sum: { totalAmount: true },
        }),
      ]);

    return {
      success: true,
      data: {
        tours: {
          total: tourCount,
          published: publishedCount,
          pendingReview: pendingCount,
        },
        reservations: { total: reservationCount },
        revenue: {
          confirmedTotal: revenue._sum.totalAmount?.toString() ?? '0',
          currency: 'TRY',
        },
      },
      error: null,
    };
  }

  async listTours(partnerId: string | undefined) {
    this.requirePartnerId(partnerId);

    const tours = await this.prisma.tour.findMany({
      where: { partnerId, deletedAt: null },
      orderBy: { updatedAt: 'desc' },
    });

    return {
      success: true,
      data: tours.map((tour) => ({
        id: tour.id,
        title: tour.title,
        slug: tour.slug,
        price: tour.price.toString(),
        currency: tour.currency,
        category: tour.category,
        status: tour.status,
        coverUrl: tour.coverUrl,
        durationDays: tour.durationDays,
        createdAt: tour.createdAt.toISOString(),
        updatedAt: tour.updatedAt.toISOString(),
      })),
      error: null,
    };
  }

  async listReservations(partnerId: string | undefined) {
    this.requirePartnerId(partnerId);

    const rows = await this.prisma.reservation.findMany({
      where: { partnerId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      data: rows.map((row) => this.toReservation(row)),
      error: null,
    };
  }

  async updateReservationStatus(
    reservationId: string,
    partnerId: string | undefined,
    status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED',
  ) {
    this.requirePartnerId(partnerId);

    const reservation = await this.prisma.reservation.findFirst({
      where: { id: reservationId, partnerId, deletedAt: null },
    });

    if (!reservation) {
      throw new NotFoundException({
        code: 'RESERVATION_NOT_FOUND',
        message: 'Rezervasyon bulunamadı',
      });
    }

    if (
      reservation.status === 'COMPLETED' ||
      reservation.status === 'CANCELLED'
    ) {
      throw new BusinessException(
        'INVALID_STATUS_TRANSITION',
        'Bu rezervasyon güncellenemez',
      );
    }

    if (status === 'COMPLETED') {
      if (reservation.status !== 'CONFIRMED') {
        throw new BusinessException(
          'INVALID_STATUS_TRANSITION',
          'Sadece onaylı rezervasyonlar tamamlanabilir',
        );
      }

      const updated = await this.prisma.reservation.update({
        where: { id: reservation.id },
        data: { status: 'COMPLETED' },
      });

      this.eventEmitter.emit(
        'booking.completed',
        new BookingCompletedEvent(
          updated.id,
          updated.userId,
          updated.tourId,
          updated.partnerId,
          updated.contactEmail,
        ),
      );

      return {
        success: true,
        data: this.toReservation(updated),
        error: null,
      };
    }

    if (status === 'CANCELLED') {
      const partySize = reservation.adults + reservation.children;
      const updated = await this.prisma.$transaction(async (tx) => {
        await tx.tourDate.update({
          where: { id: reservation.tourDateId },
          data: { remainingCapacity: { increment: partySize } },
        });
        return tx.reservation.update({
          where: { id: reservation.id },
          data: { status: 'CANCELLED', cancelledAt: new Date() },
        });
      });
      return {
        success: true,
        data: this.toReservation(updated),
        error: null,
      };
    }

    const updated = await this.prisma.reservation.update({
      where: { id: reservation.id },
      data: { status: 'CONFIRMED' },
    });

    return {
      success: true,
      data: this.toReservation(updated),
      error: null,
    };
  }

  private requirePartnerId(
    partnerId: string | undefined,
  ): asserts partnerId is string {
    if (!partnerId) {
      throw new ForbiddenException({
        code: 'PARTNER_REQUIRED',
        message: 'Partner hesabı gerekli',
      });
    }
  }

  private toReservation(row: {
    id: string;
    bookingNumber: string;
    userId: string;
    tourId: string;
    tourDateId: string;
    partnerId: string;
    status: string;
    adults: number;
    children: number;
    totalAmount: Prisma.Decimal;
    currency: string;
    contactEmail: string;
    contactPhone: string | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      id: row.id,
      bookingNumber: row.bookingNumber,
      userId: row.userId,
      tourId: row.tourId,
      tourDateId: row.tourDateId,
      partnerId: row.partnerId,
      status: row.status,
      adults: row.adults,
      children: row.children,
      totalAmount: row.totalAmount.toString(),
      currency: row.currency,
      contactEmail: row.contactEmail,
      contactPhone: row.contactPhone,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
