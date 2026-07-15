import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BookingStatus as SharedBookingStatus } from '@turladur/shared-constants';
import type {
  BookingGuest,
  Reservation as SharedReservation,
} from '@turladur/shared-types';
import { Prisma } from '../../../generated/prisma';

import { PrismaService } from '../../../core/database/prisma.service';
import { BusinessException } from '../../../shared/exceptions/business.exception';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { BookingCancelledEvent } from '../events/booking-cancelled.event';
import { BookingCreatedEvent } from '../events/booking-created.event';

@Injectable()
export class ReservationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateReservationDto, userId: string) {
    const partySize = dto.adults + (dto.children ?? 0);
    if (dto.guests.length !== partySize) {
      throw new BusinessException(
        'GUEST_COUNT_MISMATCH',
        `Misafir sayısı (${dto.guests.length}) yetişkin+çocuk (${partySize}) ile eşleşmeli`,
      );
    }

    const tourDate = await this.prisma.tourDate.findFirst({
      where: { id: dto.tourDateId, deletedAt: null, isActive: true },
      include: { tour: true },
    });

    if (
      !tourDate ||
      tourDate.tour.deletedAt ||
      tourDate.tour.status !== 'PUBLISHED'
    ) {
      throw new NotFoundException({
        code: 'TOUR_DATE_NOT_FOUND',
        message: 'Tur tarihi bulunamadı veya yayında değil',
      });
    }

    if (tourDate.remainingCapacity < partySize) {
      throw new BusinessException(
        'BOOKING_NOT_AVAILABLE',
        'Seçilen tarihte müsaitlik bulunmamaktadır.',
      );
    }

    const unitPrice = tourDate.priceOverride ?? tourDate.tour.price;
    const totalAmount = new Prisma.Decimal(unitPrice).mul(partySize);
    const bookingNumber = await this.nextBookingNumber();

    const reservation = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.tourDate.updateMany({
        where: {
          id: tourDate.id,
          remainingCapacity: { gte: partySize },
          deletedAt: null,
        },
        data: { remainingCapacity: { decrement: partySize } },
      });

      if (updated.count === 0) {
        throw new BusinessException(
          'BOOKING_NOT_AVAILABLE',
          'Seçilen tarihte müsaitlik bulunmamaktadır.',
        );
      }

      return tx.reservation.create({
        data: {
          bookingNumber,
          userId,
          tourId: tourDate.tourId,
          tourDateId: tourDate.id,
          partnerId: tourDate.tour.partnerId,
          status: 'PENDING',
          adults: dto.adults,
          children: dto.children ?? 0,
          totalAmount,
          currency: tourDate.tour.currency,
          contactEmail: dto.contactEmail.toLowerCase().trim(),
          contactPhone: dto.contactPhone,
          guests: dto.guests as unknown as Prisma.InputJsonValue,
        },
      });
    });

    this.eventEmitter.emit(
      'booking.created',
      new BookingCreatedEvent(
        reservation.id,
        userId,
        reservation.tourDateId,
        reservation.partnerId,
        reservation.totalAmount.toString(),
      ),
    );

    return {
      success: true,
      data: this.toShared(reservation),
      error: null,
    };
  }

  async getById(reservationId: string, userId: string, role: string) {
    const reservation = await this.prisma.reservation.findFirst({
      where: { id: reservationId, deletedAt: null },
    });

    if (!reservation) {
      throw new NotFoundException({
        code: 'RESERVATION_NOT_FOUND',
        message: 'Rezervasyon bulunamadı',
      });
    }

    this.assertAccess(reservation, userId, role);

    return {
      success: true,
      data: this.toShared(reservation),
      error: null,
    };
  }

  async listForUser(userId: string) {
    const rows = await this.prisma.reservation.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      data: rows.map((row) => this.toShared(row)),
      error: null,
    };
  }

  async cancel(reservationId: string, userId: string, role: string) {
    const reservation = await this.prisma.reservation.findFirst({
      where: { id: reservationId, deletedAt: null },
    });

    if (!reservation) {
      throw new NotFoundException({
        code: 'RESERVATION_NOT_FOUND',
        message: 'Rezervasyon bulunamadı',
      });
    }

    this.assertAccess(reservation, userId, role);

    if (
      reservation.status === 'CANCELLED' ||
      reservation.status === 'COMPLETED'
    ) {
      throw new BusinessException(
        'INVALID_STATUS_TRANSITION',
        'Bu rezervasyon iptal edilemez',
      );
    }

    const partySize = reservation.adults + reservation.children;

    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.tourDate.update({
        where: { id: reservation.tourDateId },
        data: { remainingCapacity: { increment: partySize } },
      });

      return tx.reservation.update({
        where: { id: reservation.id },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
        },
      });
    });

    this.eventEmitter.emit(
      'booking.cancelled',
      new BookingCancelledEvent(updated.id, updated.userId),
    );

    return {
      success: true,
      data: this.toShared(updated),
      error: null,
    };
  }

  async markConfirmed(reservationId: string) {
    return this.transition(
      reservationId,
      ['PENDING', 'PAYMENT_FAILED'],
      'CONFIRMED',
    );
  }

  async markPaymentFailed(reservationId: string) {
    return this.transition(reservationId, ['PENDING'], 'PAYMENT_FAILED');
  }

  private async transition(
    reservationId: string,
    from: Array<'PENDING' | 'PAYMENT_FAILED' | 'CONFIRMED'>,
    to: 'CONFIRMED' | 'PAYMENT_FAILED',
  ) {
    const reservation = await this.prisma.reservation.findFirst({
      where: { id: reservationId, deletedAt: null },
    });

    if (!reservation) {
      throw new NotFoundException({
        code: 'RESERVATION_NOT_FOUND',
        message: 'Rezervasyon bulunamadı',
      });
    }

    if (!from.includes(reservation.status as (typeof from)[number])) {
      return reservation;
    }

    return this.prisma.reservation.update({
      where: { id: reservationId },
      data: { status: to },
    });
  }

  private assertAccess(
    reservation: { userId: string },
    userId: string,
    role: string,
  ) {
    const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';
    if (isAdmin || reservation.userId === userId) {
      return;
    }

    throw new ForbiddenException({
      code: 'FORBIDDEN',
      message: 'Bu rezervasyona erişim yetkiniz yok',
    });
  }

  private async nextBookingNumber(): Promise<string> {
    const suffix = Date.now().toString(36).toUpperCase().slice(-8);
    return `TD-${suffix}`;
  }

  private toShared(row: {
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
    guests: Prisma.JsonValue;
    createdAt: Date;
    updatedAt: Date;
  }): SharedReservation {
    return {
      id: row.id,
      bookingNumber: row.bookingNumber,
      userId: row.userId,
      tourId: row.tourId,
      tourDateId: row.tourDateId,
      partnerId: row.partnerId,
      status: row.status as SharedBookingStatus,
      adults: row.adults,
      children: row.children,
      totalAmount: row.totalAmount.toString(),
      currency: row.currency,
      contactEmail: row.contactEmail,
      contactPhone: row.contactPhone,
      guests: row.guests as unknown as BookingGuest[],
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
