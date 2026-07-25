import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BookingStatus as SharedBookingStatus } from '@turta/shared-constants';
import type {
  BookingGuest,
  Reservation as SharedReservation,
} from '@turta/shared-types';
import { Prisma } from '../../../generated/prisma';

import { PrismaService } from '../../../core/database/prisma.service';
import { BusinessException } from '../../../shared/exceptions/business.exception';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { BookingCancelledEvent } from '../events/booking-cancelled.event';
import { BookingCompletedEvent } from '../events/booking-completed.event';
import { BookingCreatedEvent } from '../events/booking-created.event';
import { isValidTckn } from '../../../shared/utils/tckn';

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

    for (const [index, guest] of dto.guests.entries()) {
      if (!isValidTckn(guest.identityNumber)) {
        throw new BusinessException(
          'INVALID_IDENTITY_NUMBER',
          `${guest.firstName} ${guest.lastName}: TC kimlik no geçersiz`,
        );
      }
      if (index === 0) {
        const address = guest.address?.trim() ?? '';
        if (address.length < 5) {
          throw new BusinessException(
            'ADDRESS_REQUIRED',
            'Satın alan katılımcı için adres zorunludur',
          );
        }
        if (!guest.phone?.trim() || guest.phone.trim().length < 10) {
          throw new BusinessException(
            'PHONE_REQUIRED',
            'Satın alan katılımcı için telefon zorunludur',
          );
        }
        if (!guest.email?.trim() || !guest.email.includes('@')) {
          throw new BusinessException(
            'EMAIL_REQUIRED',
            'Satın alan katılımcı için e-posta zorunludur',
          );
        }
      }
    }

    if (
      !dto.billing?.line1?.trim() ||
      !dto.billing?.city?.trim() ||
      !dto.billing?.country?.trim()
    ) {
      throw new BusinessException(
        'BILLING_REQUIRED',
        'Fatura adresi, şehir ve ülke zorunludur',
      );
    }

    const productCount = [
      dto.tourDateId,
      dto.roomId,
      dto.activityDateId,
    ].filter(Boolean).length;
    if (productCount !== 1) {
      throw new BusinessException(
        'INVALID_BOOKING_PRODUCT',
        'Tam olarak bir ürün seçilmeli: tourDateId, roomId veya activityDateId',
      );
    }

    if (dto.tourDateId) {
      return this.createTourReservation(dto, userId, partySize);
    }
    if (dto.roomId) {
      return this.createHotelReservation(dto, userId, partySize);
    }
    return this.createExperienceReservation(dto, userId, partySize);
  }

  async getById(
    reservationId: string,
    userId: string,
    role: string,
    partnerId?: string,
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

    this.assertAccess(reservation, userId, role, partnerId);

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

    this.assertAccess(reservation, userId, role, undefined);

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
      await this.restoreCapacity(tx, reservation, partySize);

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
      new BookingCancelledEvent(updated.id, updated.userId, 'RESERVATION'),
    );

    return {
      success: true,
      data: this.toShared(updated),
      error: null,
    };
  }

  /**
   * Cancel every active reservation for a delisted tour (capacity restore + events).
   */
  async cancelAllForTour(
    tourId: string,
    reasonCode?: string,
    reasonLabel?: string,
  ) {
    const rows = await this.prisma.reservation.findMany({
      where: {
        tourId,
        deletedAt: null,
        status: { notIn: ['CANCELLED', 'COMPLETED'] },
      },
    });

    for (const reservation of rows) {
      const partySize = reservation.adults + reservation.children;
      const meta =
        reservation.metadata &&
        typeof reservation.metadata === 'object' &&
        !Array.isArray(reservation.metadata)
          ? { ...(reservation.metadata as Record<string, unknown>) }
          : {};

      const updated = await this.prisma.$transaction(async (tx) => {
        await this.restoreCapacity(tx, reservation, partySize);
        return tx.reservation.update({
          where: { id: reservation.id },
          data: {
            status: 'CANCELLED',
            cancelledAt: new Date(),
            metadata: {
              ...meta,
              cancelScope: 'TOUR',
              cancelReason: reasonCode ?? null,
              cancelReasonLabel: reasonLabel ?? null,
            } as Prisma.InputJsonValue,
          },
        });
      });

      this.eventEmitter.emit(
        'booking.cancelled',
        new BookingCancelledEvent(
          updated.id,
          updated.userId,
          'TOUR',
          reasonCode,
          reasonLabel,
        ),
      );
    }

    return { cancelledCount: rows.length };
  }

  /**
   * Cancel active reservations for specific tour departure dates.
   */
  async cancelAllForTourDates(
    tourDateIds: string[],
    reasonCode?: string,
    reasonLabel?: string,
    dateLabelById?: Record<string, string>,
  ) {
    if (tourDateIds.length === 0) {
      return { cancelledCount: 0 };
    }

    const rows = await this.prisma.reservation.findMany({
      where: {
        tourDateId: { in: tourDateIds },
        deletedAt: null,
        status: { notIn: ['CANCELLED', 'COMPLETED'] },
      },
    });

    for (const reservation of rows) {
      const partySize = reservation.adults + reservation.children;
      const meta =
        reservation.metadata &&
        typeof reservation.metadata === 'object' &&
        !Array.isArray(reservation.metadata)
          ? { ...(reservation.metadata as Record<string, unknown>) }
          : {};

      const dateLabel =
        (reservation.tourDateId && dateLabelById?.[reservation.tourDateId]) ||
        undefined;

      const updated = await this.prisma.$transaction(async (tx) => {
        await this.restoreCapacity(tx, reservation, partySize);
        return tx.reservation.update({
          where: { id: reservation.id },
          data: {
            status: 'CANCELLED',
            cancelledAt: new Date(),
            metadata: {
              ...meta,
              cancelScope: 'TOUR_DATE',
              cancelReason: reasonCode ?? null,
              cancelReasonLabel: reasonLabel ?? null,
              cancelledDateLabel: dateLabel ?? null,
              cancelledTourDateId: reservation.tourDateId,
            } as Prisma.InputJsonValue,
          },
        });
      });

      this.eventEmitter.emit(
        'booking.cancelled',
        new BookingCancelledEvent(
          updated.id,
          updated.userId,
          'TOUR_DATE',
          reasonCode,
          reasonLabel,
          dateLabel,
        ),
      );
    }

    return { cancelledCount: rows.length };
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

  /**
   * Partner/admin marks a confirmed booking as completed after the tour ends.
   * Required for Sprint 17 review eligibility.
   */
  async markCompleted(
    reservationId: string,
    actor?: {
      userId: string;
      role: string;
      partnerId?: string;
    },
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

    if (actor) {
      this.assertAccess(reservation, actor.userId, actor.role, actor.partnerId);
    }

    if (reservation.status === 'COMPLETED') {
      return {
        success: true,
        data: this.toShared(reservation),
        error: null,
      };
    }

    if (reservation.status !== 'CONFIRMED') {
      throw new BusinessException(
        'INVALID_STATUS_TRANSITION',
        'Sadece onaylı rezervasyonlar tamamlanabilir',
      );
    }

    const updated = await this.prisma.reservation.update({
      where: { id: reservationId },
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
      data: this.toShared(updated),
      error: null,
    };
  }

  private async createTourReservation(
    dto: CreateReservationDto,
    userId: string,
    partySize: number,
  ) {
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
    const metadata = await this.buildReservationMetadata(dto, tourDate.tourId);

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
          paymentStatus: 'UNPAID',
          paymentMethod: 'pending',
          adults: dto.adults,
          children: dto.children ?? 0,
          totalAmount,
          currency: tourDate.tour.currency,
          contactEmail: dto.contactEmail.toLowerCase().trim(),
          contactPhone: dto.contactPhone,
          guests: dto.guests as unknown as Prisma.InputJsonValue,
          specialRequests: dto.specialRequests ?? null,
          startDate: tourDate.startDate,
          endDate: tourDate.endDate,
          metadata,
        },
      });
    });

    this.emitCreated(reservation);
    return {
      success: true,
      data: this.toShared(reservation),
      error: null,
    };
  }

  private async createHotelReservation(
    dto: CreateReservationDto,
    userId: string,
    partySize: number,
  ) {
    if (!dto.startDate || !dto.endDate) {
      throw new BusinessException(
        'HOTEL_DATES_REQUIRED',
        'Otel rezervasyonu için check-in ve check-out tarihi zorunlu',
      );
    }

    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    if (endDate <= startDate) {
      throw new BusinessException(
        'INVALID_DATE_RANGE',
        'Check-out tarihi check-in sonrasında olmalı',
      );
    }

    const room = await this.prisma.room.findFirst({
      where: {
        id: dto.roomId,
        deletedAt: null,
        available: true,
        ...(dto.hotelId ? { hotelId: dto.hotelId } : {}),
      },
      include: { hotel: true },
    });

    if (!room || room.hotel.deletedAt) {
      throw new NotFoundException({
        code: 'ROOM_NOT_FOUND',
        message: 'Oda bulunamadı veya müsait değil',
      });
    }

    if (partySize > room.capacity) {
      throw new BusinessException(
        'ROOM_CAPACITY_EXCEEDED',
        `Oda kapasitesi ${room.capacity} kişi`,
      );
    }

    const nights = Math.max(
      1,
      Math.round(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
      ),
    );
    const nightPrice = room.discount ?? room.price;
    const totalAmount = new Prisma.Decimal(nightPrice).mul(nights);
    const bookingNumber = await this.nextBookingNumber();
    const metadata = await this.buildReservationMetadata(dto, null);

    const reservation = await this.prisma.reservation.create({
      data: {
        bookingNumber,
        userId,
        hotelId: room.hotelId,
        roomId: room.id,
        partnerId: room.hotel.partnerId,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
        adults: dto.adults,
        children: dto.children ?? 0,
        totalAmount,
        currency: 'TRY',
        contactEmail: dto.contactEmail.toLowerCase().trim(),
        contactPhone: dto.contactPhone,
        guests: dto.guests as unknown as Prisma.InputJsonValue,
        startDate,
        endDate,
        specialRequests: dto.specialRequests ?? null,
        metadata,
      },
    });

    this.emitCreated(reservation);
    return {
      success: true,
      data: this.toShared(reservation),
      error: null,
    };
  }

  private async createExperienceReservation(
    dto: CreateReservationDto,
    userId: string,
    partySize: number,
  ) {
    const activityDate = await this.prisma.activityDate.findFirst({
      where: { id: dto.activityDateId, deletedAt: null, isActive: true },
      include: { experience: true },
    });

    if (
      !activityDate ||
      activityDate.experience.deletedAt ||
      activityDate.experience.status !== 'PUBLISHED'
    ) {
      throw new NotFoundException({
        code: 'ACTIVITY_DATE_NOT_FOUND',
        message: 'Aktivite tarihi bulunamadı veya yayında değil',
      });
    }

    const totalAmount = new Prisma.Decimal(activityDate.price).mul(partySize);
    const bookingNumber = await this.nextBookingNumber();
    const metadata = await this.buildReservationMetadata(dto, null);

    const reservation = await this.prisma.$transaction(async (tx) => {
      const remaining =
        activityDate.remainingCapacity ?? activityDate.availableSeats;
      if (remaining < partySize) {
        throw new BusinessException(
          'BOOKING_NOT_AVAILABLE',
          'Seçilen tarihte müsaitlik bulunmamaktadır.',
        );
      }

      const updated = await tx.activityDate.updateMany({
        where: {
          id: activityDate.id,
          deletedAt: null,
          isActive: true,
          OR: [
            { remainingCapacity: { gte: partySize } },
            {
              remainingCapacity: null,
              availableSeats: { gte: partySize },
            },
          ],
        },
        data: {
          remainingCapacity: remaining - partySize,
        },
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
          experienceId: activityDate.experienceId,
          activityDateId: activityDate.id,
          partnerId: activityDate.experience.partnerId,
          status: 'PENDING',
          paymentStatus: 'UNPAID',
          paymentMethod: 'pending',
          adults: dto.adults,
          children: dto.children ?? 0,
          totalAmount,
          currency: activityDate.experience.currency,
          contactEmail: dto.contactEmail.toLowerCase().trim(),
          contactPhone: dto.contactPhone,
          guests: dto.guests as unknown as Prisma.InputJsonValue,
          startDate: activityDate.startDate,
          endDate: activityDate.endDate,
          specialRequests: dto.specialRequests ?? null,
          metadata,
        },
      });
    });

    this.emitCreated(reservation);
    return {
      success: true,
      data: this.toShared(reservation),
      error: null,
    };
  }

  private emitCreated(reservation: {
    id: string;
    userId: string;
    tourDateId: string | null;
    partnerId: string;
    totalAmount: Prisma.Decimal;
  }) {
    this.eventEmitter.emit(
      'booking.created',
      new BookingCreatedEvent(
        reservation.id,
        reservation.userId,
        reservation.tourDateId,
        reservation.partnerId,
        reservation.totalAmount.toString(),
      ),
    );
  }

  private async restoreCapacity(
    tx: Prisma.TransactionClient,
    reservation: {
      tourDateId: string | null;
      activityDateId: string | null;
    },
    partySize: number,
  ) {
    if (reservation.tourDateId) {
      await tx.tourDate.update({
        where: { id: reservation.tourDateId },
        data: { remainingCapacity: { increment: partySize } },
      });
    }
    if (reservation.activityDateId) {
      await tx.activityDate.update({
        where: { id: reservation.activityDateId },
        data: { remainingCapacity: { increment: partySize } },
      });
    }
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
      data: {
        status: to,
        ...(to === 'CONFIRMED'
          ? { paymentStatus: 'PAID' as const }
          : to === 'PAYMENT_FAILED'
            ? { paymentStatus: 'UNPAID' as const }
            : {}),
      },
    });
  }

  private async buildReservationMetadata(
    dto: CreateReservationDto,
    tourId?: string | null,
  ): Promise<Prisma.InputJsonValue> {
    const primary = dto.guests[0];
    const billingFullName =
      dto.billing.fullName?.trim() ||
      `${primary.firstName} ${primary.lastName}`.trim();

    const meta: Record<string, unknown> = {
      billing: {
        ...dto.billing,
        fullName: billingFullName,
      },
    };

    if (dto.pickupPointId && tourId) {
      const point = await this.prisma.tourPickupPoint.findFirst({
        where: {
          id: dto.pickupPointId,
          tourId,
          deletedAt: null,
          isActive: true,
        },
      });
      if (!point) {
        throw new BusinessException(
          'PICKUP_POINT_NOT_FOUND',
          'Seçilen kalkış noktası bulunamadı',
        );
      }
      meta.pickup = {
        pickupPointId: point.id,
        location: point.location,
        city: point.city,
        time: point.time,
        description: point.description,
      };
    }

    // Seat numbers are assigned later by the partner (not at checkout).
    meta.seatNumbers = null;

    return meta as Prisma.InputJsonValue;
  }

  private assertAccess(
    reservation: { userId: string; partnerId: string },
    userId: string,
    role: string,
    partnerId?: string,
  ) {
    const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';
    const isOwner = reservation.userId === userId;
    const isPartnerOwner =
      (role === 'PARTNER' || role === 'PARTNER_STAFF') &&
      Boolean(partnerId) &&
      reservation.partnerId === partnerId;

    if (isAdmin || isOwner || isPartnerOwner) {
      return;
    }

    throw new ForbiddenException({
      code: 'FORBIDDEN',
      message: 'Bu rezervasyona erişim yetkiniz yok',
    });
  }

  private async nextBookingNumber(): Promise<string> {
    const ymd = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
      const candidate = `TRL-${ymd}-${suffix}`;
      const exists = await this.prisma.reservation.findFirst({
        where: { bookingNumber: candidate },
        select: { id: true },
      });
      if (!exists) return candidate;
    }
    return `TRL-${ymd}-${Date.now().toString(36).toUpperCase().slice(-4)}`;
  }

  private toShared(row: {
    id: string;
    bookingNumber: string;
    userId: string;
    tourId: string | null;
    tourDateId: string | null;
    hotelId?: string | null;
    roomId?: string | null;
    experienceId?: string | null;
    activityDateId?: string | null;
    partnerId: string;
    status: string;
    paymentStatus?: string;
    adults: number;
    children: number;
    totalAmount: Prisma.Decimal;
    currency: string;
    contactEmail: string;
    contactPhone: string | null;
    guests: Prisma.JsonValue;
    metadata?: Prisma.JsonValue | null;
    startDate?: Date | null;
    endDate?: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): SharedReservation {
    return {
      id: row.id,
      bookingNumber: row.bookingNumber,
      userId: row.userId,
      tourId: row.tourId,
      tourDateId: row.tourDateId,
      hotelId: row.hotelId ?? null,
      roomId: row.roomId ?? null,
      experienceId: row.experienceId ?? null,
      activityDateId: row.activityDateId ?? null,
      partnerId: row.partnerId,
      status: row.status as SharedBookingStatus,
      paymentStatus: row.paymentStatus ?? 'UNPAID',
      adults: row.adults,
      children: row.children,
      totalAmount: row.totalAmount.toString(),
      currency: row.currency,
      contactEmail: row.contactEmail,
      contactPhone: row.contactPhone,
      guests: row.guests as unknown as BookingGuest[],
      metadata: (row.metadata as Record<string, unknown> | null) ?? null,
      startDate: row.startDate?.toISOString() ?? null,
      endDate: row.endDate?.toISOString() ?? null,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
