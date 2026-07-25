import { Injectable } from '@nestjs/common';
import type { AppNotification } from '@turladur/shared-types';
import { Prisma } from '../../../generated/prisma';

import { PrismaService } from '../../../core/database/prisma.service';
import { EmailQueueService } from '../../../core/queue/email-queue.service';
import { BookingCompletedEvent } from '../../booking/events/booking-completed.event';
import { ReviewCreatedEvent } from '../../review/events/review-created.event';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailQueue: EmailQueueService,
  ) {}

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
    return this.toShared(row);
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

    const tour = reservation.tourId
      ? await this.prisma.tour.findFirst({
          where: { id: reservation.tourId },
          select: { title: true },
        })
      : null;

    await this.createInApp({
      userId: reservation.userId,
      type: 'BOOKING_CONFIRMED',
      title: 'Rezervasyon onaylandı',
      body: `${tour?.title ?? 'Rezervasyonunuz'} ödeme ile onaylandı.`,
      data: {
        reservationId: reservation.id,
        bookingNumber: reservation.bookingNumber,
      },
    });

    await this.enqueueEmail(reservation.contactEmail, 'booking-confirmed', {
      tourName: tour?.title ?? '',
      bookingId: reservation.bookingNumber,
    });
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
