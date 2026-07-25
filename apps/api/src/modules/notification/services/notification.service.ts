import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AppNotification, BookingGuest } from '@turta/shared-types';
import { Prisma } from '../../../generated/prisma';

import { PrismaService } from '../../../core/database/prisma.service';
import {
  renderVoucherHtml,
  resolveVoucherBrandLogos,
} from '../../../core/mail/voucher-template';
import { EmailQueueService } from '../../../core/queue/email-queue.service';
import { NotificationGateway } from '../../../core/realtime/notification.gateway';
import { BookingCancelledEvent } from '../../booking/events/booking-cancelled.event';
import { BookingCompletedEvent } from '../../booking/events/booking-completed.event';
import { ReviewCreatedEvent } from '../../review/events/review-created.event';

type ReservationMeta = {
  billing?: { fullName?: string };
  pickup?: { location?: string; city?: string; time?: string };
  seatNumbers?: string | string[] | null;
};

const DEFAULT_BRAND_URL = 'https://turladur-zjyf.vercel.app';

@Injectable()
export class NotificationService {
  private readonly brandBaseUrl: string;
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailQueue: EmailQueueService,
    private readonly config: ConfigService,
    private readonly notificationGateway: NotificationGateway,
  ) {
    this.brandBaseUrl = (
      config.get<string>('EMAIL_BRAND_URL') ??
      config.get<string>('FRONTEND_URL') ??
      config.get<string>('PUBLIC_WEB_URL') ??
      DEFAULT_BRAND_URL
    )
      .split(',')[0]
      .trim()
      .replace(/\/$/, '');
  }

  async createInApp(input: {
    userId: string;
    type: string;
    title: string;
    body: string;
    data?: Record<string, unknown>;
  }) {
    const row = await this.prisma.notification.create({
      data: {
        userId: input.userId,
        type: input.type,
        title: input.title,
        body: input.body,
        data: (input.data ?? Prisma.JsonNull) as Prisma.InputJsonValue,
      },
    });
    const shared = this.toShared(row);

    // Realtime is best-effort — never fail the write path
    try {
      this.notificationGateway.emitNotificationCreated(input.userId, shared);
    } catch (err) {
      this.logger.warn(
        `WS emit failed for notification ${shared.id}: ${String(err)}`,
      );
    }

    return shared;
  }

  async listForUser(userId: string, unreadOnly = false) {
    const rows = await this.prisma.notification.findMany({
      where: {
        userId,
        ...(unreadOnly ? { readAt: null } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return {
      success: true,
      data: rows.map((r) => this.toShared(r)),
      error: null,
    };
  }

  async unreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: { userId, readAt: null },
    });
    return { success: true, data: { count }, error: null };
  }

  async markRead(id: string, userId: string) {
    const row = await this.prisma.notification.findFirst({
      where: { id, userId },
    });
    if (!row) {
      return { success: true, data: null, error: null };
    }
    const updated = await this.prisma.notification.update({
      where: { id },
      data: { readAt: new Date() },
    });
    return { success: true, data: this.toShared(updated), error: null };
  }

  async markAllRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });
    return { success: true, data: { ok: true }, error: null };
  }

  async enqueueEmail(
    to: string,
    template: string,
    data: Record<string, unknown>,
    delayMs?: number,
  ) {
    await this.emailQueue.enqueue({ to, template, data }, { delayMs });
  }

  async notifyBookingConfirmed(reservationId: string) {
    const reservation = await this.prisma.reservation.findFirst({
      where: { id: reservationId, deletedAt: null },
    });
    if (!reservation) return;

    const [tour, experience, partner] = await Promise.all([
      reservation.tourId
        ? this.prisma.tour.findFirst({
            where: { id: reservation.tourId },
            select: { title: true },
          })
        : null,
      reservation.experienceId
        ? this.prisma.experience.findFirst({
            where: { id: reservation.experienceId },
            select: { title: true },
          })
        : null,
      this.prisma.partner.findFirst({
        where: { id: reservation.partnerId },
        select: {
          companyName: true,
          contactPhone: true,
          taxNumber: true,
          logo: true,
        },
      }),
    ]);

    const tourName = tour?.title ?? experience?.title ?? 'Rezervasyonunuz';
    const guests = (reservation.guests as unknown as BookingGuest[]) ?? [];
    const primary = guests[0];
    const meta = (reservation.metadata ?? {}) as ReservationMeta;
    const guestName =
      meta.billing?.fullName?.trim() ||
      (primary ? `${primary.firstName} ${primary.lastName}`.trim() : 'Misafir');

    const tourDateLabel = this.formatTourDateRange(
      reservation.startDate,
      reservation.endDate,
    );
    const totalAmountLabel = new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: reservation.currency || 'TRY',
    }).format(Number(reservation.totalAmount.toString()));

    const pickupLocation = meta.pickup?.location
      ? [meta.pickup.city, meta.pickup.location].filter(Boolean).join(' — ')
      : null;
    const seatLabel = this.formatSeatLabel(meta.seatNumbers);

    const voucherHtml = renderVoucherHtml({
      bookingNumber: reservation.bookingNumber,
      issuedAt: reservation.createdAt,
      tourTitle: tourName,
      tourStartDate: reservation.startDate,
      tourEndDate: reservation.endDate,
      partnerName: partner?.companyName ?? 'turta Partner',
      partnerPhone: partner?.contactPhone ?? null,
      partnerTaxNumber: partner?.taxNumber ?? null,
      partnerLogoUrl: partner?.logo ?? null,
      ...resolveVoucherBrandLogos(this.brandBaseUrl),
      guests: guests.map((guest) => ({
        firstName: guest.firstName,
        lastName: guest.lastName,
        identityNumber: guest.identityNumber,
      })),
      pickupLocation,
      pickupTime: meta.pickup?.time ?? null,
      seatLabel,
      payerName: guestName,
      totalAmount: reservation.totalAmount.toString(),
      currency: reservation.currency,
      paymentStatusLabel: 'ÖDENDİ (Tahsil Edildi)',
    });

    await this.createInApp({
      userId: reservation.userId,
      type: 'BOOKING_CONFIRMED',
      title: 'Rezervasyon onaylandı',
      body: `${tourName} ödeme ile onaylandı. Kod: ${reservation.bookingNumber}`,
      data: {
        reservationId: reservation.id,
        bookingNumber: reservation.bookingNumber,
      },
    });

    // Notify partner users (in-app)
    const partnerUsers = await this.findPartnerUserIds(reservation.partnerId);
    for (const userId of partnerUsers) {
      await this.createInApp({
        userId,
        type: 'BOOKING_CONFIRMED',
        title: 'Yeni rezervasyon',
        body: `${tourName} — ${reservation.bookingNumber}`,
        data: {
          reservationId: reservation.id,
          bookingNumber: reservation.bookingNumber,
        },
      });
    }

    await this.enqueueEmail(reservation.contactEmail, 'booking-confirmed', {
      tourName,
      bookingId: reservation.bookingNumber,
      guestName,
      partnerName: partner?.companyName ?? 'Partner',
      tourDateLabel,
      totalAmountLabel,
      voucherHtml,
    });
  }

  private formatTourDateRange(start: Date | null, end: Date | null): string {
    const fmt = (value: Date) =>
      new Intl.DateTimeFormat('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(value);
    if (!start && !end) return '—';
    if (start && end && start.getTime() !== end.getTime()) {
      return `${fmt(start)} - ${fmt(end)}`;
    }
    return fmt(start ?? end!);
  }

  private formatSeatLabel(value: string | string[] | null | undefined): string {
    if (value == null) return 'Partner tarafından atanacak';
    if (Array.isArray(value)) {
      const joined = value.map(String).filter(Boolean).join(', ');
      return joined || 'Partner tarafından atanacak';
    }
    const trimmed = String(value).trim();
    return trimmed || 'Partner tarafından atanacak';
  }

  async notifyReviewReceived(event: ReviewCreatedEvent) {
    const tour = event.tourId
      ? await this.prisma.tour.findFirst({
          where: { id: event.tourId },
          select: { title: true },
        })
      : null;
    const experience =
      !tour && event.experienceId
        ? await this.prisma.experience.findFirst({
            where: { id: event.experienceId },
            select: { title: true },
          })
        : null;
    const productTitle = tour?.title ?? experience?.title ?? 'Ürün';
    const partnerUsers = await this.findPartnerUserIds(event.partnerId);
    const partner = await this.prisma.partner.findFirst({
      where: { id: event.partnerId },
      select: { contactEmail: true, companyName: true },
    });

    for (const userId of partnerUsers) {
      await this.createInApp({
        userId,
        type: 'REVIEW_RECEIVED',
        title: 'Yeni yorum aldınız',
        body: `${productTitle} için ${event.rating}/5 puanlı yeni bir yorum var.`,
        data: {
          reviewId: event.reviewId,
          tourId: event.tourId,
          experienceId: event.experienceId,
        },
      });
    }

    if (partner?.contactEmail) {
      await this.enqueueEmail(partner.contactEmail, 'new-review', {
        companyName: partner.companyName,
        tourName: productTitle,
        rating: event.rating,
      });
    }
  }

  async notifyBookingCompleted(event: BookingCompletedEvent) {
    const tour = event.tourId
      ? await this.prisma.tour.findFirst({
          where: { id: event.tourId },
          select: { title: true },
        })
      : null;

    await this.createInApp({
      userId: event.userId,
      type: 'BOOKING_COMPLETED',
      title: 'Rezervasyonunuz tamamlandı',
      body: `${tour?.title ?? 'Rezervasyonunuz'} tamamlandı. Deneyiminizi değerlendirin.`,
      data: {
        reservationId: event.reservationId,
        tourId: event.tourId,
      },
    });
  }

  async notifyBookingCancelled(event: BookingCancelledEvent) {
    const reservation = await this.prisma.reservation.findFirst({
      where: { id: event.reservationId, deletedAt: null },
    });
    if (!reservation) return;

    const [tour, experience] = await Promise.all([
      reservation.tourId
        ? this.prisma.tour.findFirst({
            where: { id: reservation.tourId },
            select: { title: true },
          })
        : null,
      reservation.experienceId
        ? this.prisma.experience.findFirst({
            where: { id: reservation.experienceId },
            select: { title: true },
          })
        : null,
    ]);

    const tourName = tour?.title ?? experience?.title ?? 'Rezervasyonunuz';
    const guests =
      (reservation.guests as unknown as Array<{
        firstName?: string;
        lastName?: string;
      }>) ?? [];
    const primary = guests[0];
    const guestName = primary
      ? `${primary.firstName ?? ''} ${primary.lastName ?? ''}`.trim()
      : 'Misafir';

    const reasonLabel =
      event.reasonLabel ||
      (event.scope === 'TOUR' || event.scope === 'TOUR_DATE'
        ? 'Tur firması tarafından tur iptal edildi'
        : event.scope === 'PAYMENT'
          ? 'Ödeme iptali / iade'
          : 'Rezervasyon iptali');

    const datePart = event.cancelledDateLabel
      ? ` Tarih: ${event.cancelledDateLabel}.`
      : '';

    await this.createInApp({
      userId: reservation.userId,
      type: 'BOOKING_CANCELLED',
      title:
        event.scope === 'TOUR' || event.scope === 'TOUR_DATE'
          ? 'Tur iptal edildi'
          : 'Rezervasyon iptal edildi',
      body: `${tourName} — ${reservation.bookingNumber}.${datePart} ${reasonLabel}`,
      data: {
        reservationId: reservation.id,
        bookingNumber: reservation.bookingNumber,
        scope: event.scope,
        reasonCode: event.reasonCode,
        cancelledDateLabel: event.cancelledDateLabel,
      },
    });

    await this.enqueueEmail(reservation.contactEmail, 'booking-cancelled', {
      bookingId: reservation.bookingNumber,
      tourName,
      guestName,
      scope: event.scope,
      reasonLabel,
      cancelledDateLabel: event.cancelledDateLabel,
    });
  }

  async notifyPaymentRefunded(input: {
    reservationId: string;
    amount: string;
    currency?: string;
  }) {
    const reservation = await this.prisma.reservation.findFirst({
      where: { id: input.reservationId, deletedAt: null },
    });
    if (!reservation) return;

    const amountLabel = new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: input.currency || reservation.currency || 'TRY',
    }).format(Number(input.amount));

    await this.createInApp({
      userId: reservation.userId,
      type: 'PAYMENT_REFUNDED',
      title: 'Ödeme iadesi',
      body: `${reservation.bookingNumber} için ${amountLabel} iade`,
      data: {
        reservationId: reservation.id,
        bookingNumber: reservation.bookingNumber,
      },
    });

    await this.enqueueEmail(reservation.contactEmail, 'payment-refunded', {
      bookingId: reservation.bookingNumber,
      amountLabel,
    });
  }

  async findPartnerUserIds(partnerId: string): Promise<string[]> {
    const users = await this.prisma.user.findMany({
      where: {
        partnerId,
        deletedAt: null,
        isActive: true,
        role: { in: ['PARTNER', 'PARTNER_STAFF'] },
      },
      select: { id: true },
    });
    return users.map((u) => u.id);
  }

  private toShared(row: {
    id: string;
    userId: string;
    type: string;
    title: string;
    body: string;
    data: Prisma.JsonValue | null;
    readAt: Date | null;
    createdAt: Date;
  }): AppNotification {
    return {
      id: row.id,
      userId: row.userId,
      type: row.type,
      title: row.title,
      body: row.body,
      data:
        row.data && typeof row.data === 'object' && !Array.isArray(row.data)
          ? (row.data as Record<string, unknown>)
          : null,
      readAt: row.readAt?.toISOString() ?? null,
      createdAt: row.createdAt.toISOString(),
    };
  }
}
