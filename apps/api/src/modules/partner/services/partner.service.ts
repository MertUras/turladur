import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Prisma } from '../../../generated/prisma';

import { PrismaService } from '../../../core/database/prisma.service';
import { StorageService } from '../../../core/storage/storage.service';
import { BusinessException } from '../../../shared/exceptions/business.exception';
import { BookingCompletedEvent } from '../../booking/events/booking-completed.event';
import { BookingCancelledEvent } from '../../booking/events/booking-cancelled.event';
import { PaymentCompletedEvent } from '../../payment/events/payment-completed.event';

type ReportDateRangeId =
  | 'today'
  | 'yesterday'
  | 'thisWeek'
  | 'lastWeek'
  | 'thisMonth'
  | 'lastMonth'
  | 'last3Months'
  | 'lastYear'
  | 'custom';

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}

function addMonths(d: Date, months: number) {
  const x = new Date(d);
  x.setMonth(x.getMonth() + months);
  return x;
}

function resolveReportDateRange(id: ReportDateRangeId, now = new Date()) {
  const today = startOfDay(now);
  const endOfToday = new Date(today);
  endOfToday.setHours(23, 59, 59, 999);

  const ranges: Record<
    ReportDateRangeId,
    {
      label: string;
      start: Date;
      end: Date;
      previousStart: Date;
      previousEnd: Date;
    }
  > = {
    today: {
      label: 'Bugün',
      start: today,
      end: endOfToday,
      previousStart: addDays(today, -1),
      previousEnd: new Date(addDays(today, -1).setHours(23, 59, 59, 999)),
    },
    yesterday: {
      label: 'Dün',
      start: addDays(today, -1),
      end: new Date(addDays(today, -1).setHours(23, 59, 59, 999)),
      previousStart: addDays(today, -2),
      previousEnd: new Date(addDays(today, -2).setHours(23, 59, 59, 999)),
    },
    thisWeek: {
      label: 'Bu Hafta',
      start: addDays(today, -today.getDay() + 1),
      end: endOfToday,
      previousStart: addDays(addDays(today, -today.getDay() + 1), -7),
      previousEnd: addDays(addDays(today, -today.getDay()), -1),
    },
    lastWeek: {
      label: 'Geçen Hafta',
      start: addDays(addDays(today, -today.getDay() + 1), -7),
      end: addDays(addDays(today, -today.getDay()), -1),
      previousStart: addDays(addDays(today, -today.getDay() + 1), -14),
      previousEnd: addDays(addDays(today, -today.getDay()), -8),
    },
    thisMonth: {
      label: 'Bu Ay',
      start: startOfMonth(today),
      end: endOfToday,
      previousStart: startOfMonth(addMonths(today, -1)),
      previousEnd: endOfMonth(addMonths(today, -1)),
    },
    lastMonth: {
      label: 'Geçen Ay',
      start: startOfMonth(addMonths(today, -1)),
      end: endOfMonth(addMonths(today, -1)),
      previousStart: startOfMonth(addMonths(today, -2)),
      previousEnd: endOfMonth(addMonths(today, -2)),
    },
    last3Months: {
      label: 'Son 3 Ay',
      start: startOfMonth(addMonths(today, -2)),
      end: endOfToday,
      previousStart: startOfMonth(addMonths(today, -5)),
      previousEnd: endOfMonth(addMonths(today, -3)),
    },
    lastYear: {
      label: 'Geçen Yıl',
      start: new Date(today.getFullYear() - 1, 0, 1),
      end: new Date(today.getFullYear() - 1, 11, 31, 23, 59, 59, 999),
      previousStart: new Date(today.getFullYear() - 2, 0, 1),
      previousEnd: new Date(today.getFullYear() - 2, 11, 31, 23, 59, 59, 999),
    },
    custom: {
      label: 'Özel Tarih Aralığı',
      start: startOfMonth(addMonths(today, -1)),
      end: endOfMonth(addMonths(today, -1)),
      previousStart: startOfMonth(addMonths(today, -2)),
      previousEnd: endOfMonth(addMonths(today, -2)),
    },
  };

  return { id, ...ranges[id] };
}

@Injectable()
export class PartnerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
    private readonly storage: StorageService,
  ) {}

  async getDashboardStats(
    partnerId: string | undefined,
    actor?: { userId: string; role: string },
  ) {
    this.requirePartnerId(partnerId);

    const canSeeRevenue = await this.actorCanSeeRevenue(actor);

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
        canSeeRevenue
          ? this.prisma.reservation.aggregate({
              where: {
                partnerId,
                deletedAt: null,
                status: { in: ['CONFIRMED', 'COMPLETED'] },
              },
              _sum: { totalAmount: true },
            })
          : Promise.resolve({ _sum: { totalAmount: null } }),
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
        revenue: canSeeRevenue
          ? {
              confirmedTotal: revenue._sum.totalAmount?.toString() ?? '0',
              currency: 'TRY',
            }
          : null,
      },
      error: null,
    };
  }

  private async actorCanSeeRevenue(actor?: {
    userId: string;
    role: string;
  }): Promise<boolean> {
    if (!actor) return true;
    if (
      actor.role === 'PARTNER' ||
      actor.role === 'ADMIN' ||
      actor.role === 'SUPER_ADMIN'
    ) {
      return true;
    }
    if (actor.role !== 'PARTNER_STAFF') return false;

    const user = await this.prisma.user.findFirst({
      where: { id: actor.userId, deletedAt: null },
      select: { permissions: true },
    });
    const permissions = user?.permissions;
    if (
      !permissions ||
      typeof permissions !== 'object' ||
      Array.isArray(permissions)
    ) {
      return false;
    }
    const value = (permissions as Record<string, unknown>).reports;
    if (value === true) return true;
    if (Array.isArray(value) && value.length > 0) return true;
    return false;
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
        coverUrl: this.storage.resolvePublicUrl(tour.coverUrl),
        durationDays: tour.durationDays,
        createdAt: tour.createdAt.toISOString(),
        updatedAt: tour.updatedAt.toISOString(),
      })),
      error: null,
    };
  }

  async getTourDetail(partnerId: string | undefined, tourId: string) {
    this.requirePartnerId(partnerId);

    const baseSelect = {
      id: true,
      title: true,
      slug: true,
      description: true,
      coverUrl: true,
      price: true,
      currency: true,
      category: true,
      status: true,
      durationDays: true,
      partnerId: true,
      createdAt: true,
      updatedAt: true,
      partner: {
        select: {
          id: true,
          companyName: true,
          logo: true,
        },
      },
    } as const;

    let tour: {
      id: string;
      title: string;
      slug: string;
      description: string;
      coverUrl: string | null;
      price: { toString(): string };
      currency: string;
      category: string;
      status: string;
      durationDays: number;
      partnerId: string;
      createdAt: Date;
      updatedAt: Date;
      galleryUrls?: string[];
      extras?: unknown;
      partner: {
        id: string;
        companyName: string;
        logo: string | null;
      };
    } | null = null;

    try {
      tour = await this.prisma.tour.findFirst({
        where: { id: tourId, partnerId, deletedAt: null },
        select: {
          ...baseSelect,
          galleryUrls: true,
          extras: true,
        },
      });
    } catch {
      // galleryUrls/extras migration henüz uygulanmamış olabilir
      tour = await this.prisma.tour.findFirst({
        where: { id: tourId, partnerId, deletedAt: null },
        select: baseSelect,
      });
    }

    if (!tour) {
      throw new NotFoundException({
        code: 'TOUR_NOT_FOUND',
        message: 'Tur bulunamadı',
      });
    }

    const extras =
      tour.extras &&
      typeof tour.extras === 'object' &&
      !Array.isArray(tour.extras)
        ? (tour.extras as Record<string, unknown>)
        : {};

    return {
      success: true,
      data: {
        id: tour.id,
        title: tour.title,
        slug: tour.slug,
        description: tour.description,
        coverUrl: this.storage.resolvePublicUrl(tour.coverUrl),
        galleryUrls: this.storage.resolvePublicUrlList(tour.galleryUrls ?? []),
        extras,
        price: tour.price.toString(),
        currency: tour.currency,
        category: tour.category,
        status: tour.status,
        durationDays: tour.durationDays,
        partnerId: tour.partnerId,
        partner: tour.partner,
        createdAt: tour.createdAt.toISOString(),
        updatedAt: tour.updatedAt.toISOString(),
      },
      error: null,
    };
  }

  async listExperiences(partnerId: string | undefined) {
    this.requirePartnerId(partnerId);

    const experiences = await this.prisma.experience.findMany({
      where: { partnerId, deletedAt: null },
      orderBy: { updatedAt: 'desc' },
    });

    return {
      success: true,
      data: experiences.map((experience) => ({
        id: experience.id,
        title: experience.title,
        slug: experience.slug,
        category: experience.category,
        location: experience.location,
        price: experience.price.toString(),
        currency: experience.currency,
        status: experience.status,
        imageUrl: this.storage.resolvePublicUrl(experience.imageUrl),
        duration: experience.duration,
        averageRating: experience.averageRating.toString(),
        reviewCount: experience.reviewCount,
        createdAt: experience.createdAt.toISOString(),
        updatedAt: experience.updatedAt.toISOString(),
      })),
      error: null,
    };
  }

  async getProfile(partnerId: string | undefined) {
    this.requirePartnerId(partnerId);
    const partner = await this.prisma.partner.findFirst({
      where: { id: partnerId, deletedAt: null },
    });
    if (!partner) {
      throw new NotFoundException({
        code: 'PARTNER_NOT_FOUND',
        message: 'Partner bulunamadı',
      });
    }
    return {
      success: true,
      data: {
        id: partner.id,
        companyName: partner.companyName,
        taxNumber: partner.taxNumber,
        contactEmail: partner.contactEmail,
        contactPhone: partner.contactPhone,
        status: partner.status,
        capabilities: partner.capabilities,
        membershipTier: partner.membershipTier,
        address: partner.address,
        city: partner.city,
        country: partner.country,
        website: partner.website,
        logo: partner.logo,
        averageRating: partner.averageRating.toString(),
        reviewCount: partner.reviewCount,
      },
      error: null,
    };
  }

  async updateProfile(
    partnerId: string | undefined,
    dto: {
      companyName?: string;
      contactPhone?: string | null;
      address?: string | null;
      city?: string | null;
      country?: string | null;
      website?: string | null;
      logo?: string | null;
      taxNumber?: string | null;
    },
  ) {
    this.requirePartnerId(partnerId);
    await this.getProfile(partnerId);

    const updated = await this.prisma.partner.update({
      where: { id: partnerId },
      data: {
        ...(dto.companyName !== undefined
          ? { companyName: dto.companyName.trim() }
          : {}),
        ...(dto.contactPhone !== undefined
          ? { contactPhone: dto.contactPhone?.trim() || null }
          : {}),
        ...(dto.address !== undefined
          ? { address: dto.address?.trim() || null }
          : {}),
        ...(dto.city !== undefined ? { city: dto.city?.trim() || null } : {}),
        ...(dto.country !== undefined
          ? { country: dto.country?.trim() || null }
          : {}),
        ...(dto.website !== undefined
          ? { website: dto.website?.trim() || null }
          : {}),
        ...(dto.logo !== undefined ? { logo: dto.logo?.trim() || null } : {}),
        ...(dto.taxNumber !== undefined
          ? { taxNumber: dto.taxNumber?.trim() || null }
          : {}),
      },
    });

    return {
      success: true,
      data: {
        id: updated.id,
        companyName: updated.companyName,
        contactPhone: updated.contactPhone,
        address: updated.address,
        city: updated.city,
        country: updated.country,
        website: updated.website,
        logo: updated.logo,
        taxNumber: updated.taxNumber,
      },
      error: null,
    };
  }

  /** Monthly revenue for financial charts (last 12 months). */
  async getFinancials(partnerId: string | undefined) {
    this.requirePartnerId(partnerId);

    const since = new Date();
    since.setMonth(since.getMonth() - 11);
    since.setDate(1);
    since.setHours(0, 0, 0, 0);

    const rows = await this.prisma.reservation.findMany({
      where: {
        partnerId,
        deletedAt: null,
        status: { in: ['CONFIRMED', 'COMPLETED'] },
        createdAt: { gte: since },
      },
      select: { createdAt: true, totalAmount: true, currency: true },
      orderBy: { createdAt: 'asc' },
    });

    const byMonth = new Map<string, number>();
    for (let i = 0; i < 12; i++) {
      const d = new Date(since);
      d.setMonth(since.getMonth() + i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      byMonth.set(key, 0);
    }

    for (const row of rows) {
      const key = `${row.createdAt.getFullYear()}-${String(row.createdAt.getMonth() + 1).padStart(2, '0')}`;
      byMonth.set(key, (byMonth.get(key) ?? 0) + Number(row.totalAmount));
    }

    const months = [...byMonth.entries()].map(([month, total]) => ({
      month,
      total: total.toFixed(2),
    }));

    const total = months.reduce((sum, m) => sum + Number(m.total), 0);

    return {
      success: true,
      data: {
        currency: 'TRY',
        total: total.toFixed(2),
        months,
      },
      error: null,
    };
  }

  async listSubUsers(partnerId: string | undefined) {
    this.requirePartnerId(partnerId);

    const rows = await this.prisma.subUser.findMany({
      where: { partnerId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      data: rows.map((row) => ({
        id: row.id,
        partnerId: row.partnerId,
        name: row.name,
        email: row.email,
        role: row.role,
        status: row.status,
        permissions: row.permissions,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
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

    const tourIds = [
      ...new Set(rows.map((row) => row.tourId).filter(Boolean)),
    ] as string[];
    const experienceIds = [
      ...new Set(rows.map((row) => row.experienceId).filter(Boolean)),
    ] as string[];

    const [tours, experiences] = await Promise.all([
      tourIds.length
        ? this.prisma.tour.findMany({
            where: { id: { in: tourIds } },
            select: { id: true, title: true },
          })
        : [],
      experienceIds.length
        ? this.prisma.experience.findMany({
            where: { id: { in: experienceIds } },
            select: { id: true, title: true },
          })
        : [],
    ]);

    const tourTitleById = new Map(tours.map((t) => [t.id, t.title]));
    const experienceTitleById = new Map(
      experiences.map((e) => [e.id, e.title]),
    );

    return {
      success: true,
      data: rows.map((row) =>
        this.toReservation(row, {
          tourTitle: row.tourId
            ? (tourTitleById.get(row.tourId) ?? null)
            : row.experienceId
              ? (experienceTitleById.get(row.experienceId) ?? null)
              : null,
        }),
      ),
      error: null,
    };
  }

  async updateReservation(
    reservationId: string,
    partnerId: string | undefined,
    input: {
      status?: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
      seatNumbers?: string;
    },
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

    if (input.seatNumbers != null) {
      const base =
        reservation.metadata &&
        typeof reservation.metadata === 'object' &&
        !Array.isArray(reservation.metadata)
          ? { ...(reservation.metadata as Record<string, unknown>) }
          : {};
      await this.prisma.reservation.update({
        where: { id: reservation.id },
        data: {
          metadata: {
            ...base,
            seatNumbers: input.seatNumbers.trim(),
          } as Prisma.InputJsonValue,
        },
      });
    }

    if (!input.status) {
      const refreshed = await this.prisma.reservation.findFirstOrThrow({
        where: { id: reservation.id },
      });
      return {
        success: true,
        data: this.toReservation(refreshed),
        error: null,
      };
    }

    return this.updateReservationStatus(reservationId, partnerId, input.status);
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
        return tx.reservation.update({
          where: { id: reservation.id },
          data: { status: 'CANCELLED', cancelledAt: new Date() },
        });
      });

      this.eventEmitter.emit(
        'booking.cancelled',
        new BookingCancelledEvent(
          updated.id,
          updated.userId,
          'RESERVATION',
          'PARTNER_CANCELLED',
          'Tur firması tarafından iptal edildi',
        ),
      );

      return {
        success: true,
        data: this.toReservation(updated),
        error: null,
      };
    }

    // CONFIRMED — seat numbers required for participants
    const meta =
      reservation.metadata &&
      typeof reservation.metadata === 'object' &&
      !Array.isArray(reservation.metadata)
        ? (reservation.metadata as Record<string, unknown>)
        : {};
    const seats =
      typeof meta.seatNumbers === 'string' ? meta.seatNumbers.trim() : '';
    if (!seats) {
      throw new BusinessException(
        'SEAT_NUMBERS_REQUIRED',
        'Onaylamadan önce katılımcılar için koltuk numarası girmelisiniz',
      );
    }

    const updated = await this.prisma.reservation.update({
      where: { id: reservation.id },
      data: {
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        paymentMethod: reservation.paymentMethod ?? 'bank_transfer',
      },
    });

    // Bank transfer / manual confirm — trigger same post-payment notifications as card.
    this.eventEmitter.emit(
      'payment.completed',
      new PaymentCompletedEvent(
        `manual-${updated.id}`,
        updated.id,
        updated.totalAmount.toString(),
      ),
    );

    return {
      success: true,
      data: this.toReservation(updated),
      error: null,
    };
  }

  async getReports(
    partnerId: string | undefined,
    dateRangeId:
      | 'today'
      | 'yesterday'
      | 'thisWeek'
      | 'lastWeek'
      | 'thisMonth'
      | 'lastMonth'
      | 'last3Months'
      | 'lastYear'
      | 'custom',
  ) {
    this.requirePartnerId(partnerId);

    const range = resolveReportDateRange(dateRangeId);
    const saleStatuses = ['CONFIRMED', 'COMPLETED'] as const;

    const [current, previous, allReviews, tours] = await Promise.all([
      this.prisma.reservation.findMany({
        where: {
          partnerId,
          deletedAt: null,
          createdAt: { gte: range.start, lte: range.end },
        },
      }),
      this.prisma.reservation.findMany({
        where: {
          partnerId,
          deletedAt: null,
          createdAt: { gte: range.previousStart, lte: range.previousEnd },
        },
      }),
      this.prisma.review.findMany({
        where: { partnerId, deletedAt: null },
        select: { rating: true, tourId: true, experienceId: true },
      }),
      this.prisma.tour.findMany({
        where: { partnerId, deletedAt: null },
        select: { id: true, title: true },
      }),
    ]);

    const isSale = (status: string) =>
      saleStatuses.includes(status as (typeof saleStatuses)[number]);

    const currentSales = current.filter((r) => isSale(r.status));
    const previousSales = previous.filter((r) => isSale(r.status));

    const totalSales = currentSales.length;
    const totalRevenue = currentSales.reduce(
      (s, r) => s + Number(r.totalAmount),
      0,
    );
    const prevRevenue = previousSales.reduce(
      (s, r) => s + Number(r.totalAmount),
      0,
    );
    const compared =
      prevRevenue === 0 && totalRevenue === 0
        ? null
        : prevRevenue === 0
          ? totalRevenue > 0
            ? 100
            : 0
          : Math.round(((totalRevenue - prevRevenue) / prevRevenue) * 1000) /
            10;

    const tourTitle = new Map(tours.map((t) => [t.id, t.title]));
    const byTour = new Map<string, { sales: number; revenue: number }>();
    for (const r of currentSales) {
      const key = r.tourId ?? r.experienceId ?? 'other';
      const prev = byTour.get(key) ?? { sales: 0, revenue: 0 };
      prev.sales += 1;
      prev.revenue += Number(r.totalAmount);
      byTour.set(key, prev);
    }

    const topSelling = [...byTour.entries()]
      .map(([id, v]) => ({
        id,
        name: tourTitle.get(id) ?? (id === 'other' ? 'Diğer' : id),
        sales: v.sales,
        revenue: Math.round(v.revenue * 100) / 100,
        growth: null as number | null,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8);

    const ratingByTour = new Map<string, number[]>();
    for (const rev of allReviews) {
      const key = rev.tourId ?? rev.experienceId;
      if (!key) continue;
      const arr = ratingByTour.get(key) ?? [];
      arr.push(rev.rating);
      ratingByTour.set(key, arr);
    }

    const avgRating = (id: string) => {
      const arr = ratingByTour.get(id) ?? [];
      if (!arr.length) return 0;
      return (
        Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10
      );
    };

    const completed = current.filter((r) => r.status === 'COMPLETED').length;
    const cancelled = current.filter((r) => r.status === 'CANCELLED').length;
    const completionRate =
      current.length === 0
        ? 0
        : Math.round((completed / current.length) * 1000) / 10;

    const trendMap = new Map<string, { sales: number; revenue: number }>();
    for (const r of currentSales) {
      const label = `${r.createdAt.getFullYear()}-${String(r.createdAt.getMonth() + 1).padStart(2, '0')}`;
      const prev = trendMap.get(label) ?? { sales: 0, revenue: 0 };
      prev.sales += 1;
      prev.revenue += Number(r.totalAmount);
      trendMap.set(label, prev);
    }
    const trend = [...trendMap.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([label, v]) => ({
        label,
        sales: v.sales,
        revenue: Math.round(v.revenue * 100) / 100,
      }));

    const customerMap = new Map<
      string,
      { bookings: number; spent: number; lastBooking: string }
    >();
    for (const r of current) {
      const email = r.contactEmail || 'bilinmiyor';
      const prev = customerMap.get(email) ?? {
        bookings: 0,
        spent: 0,
        lastBooking: r.createdAt.toISOString(),
      };
      prev.bookings += 1;
      if (isSale(r.status)) prev.spent += Number(r.totalAmount);
      if (new Date(r.createdAt) > new Date(prev.lastBooking)) {
        prev.lastBooking = r.createdAt.toISOString();
      }
      customerMap.set(email, prev);
    }

    const topCustomers = [...customerMap.entries()]
      .map(([email, v]) => ({
        id: email,
        name: email.split('@')[0] || email,
        bookings: v.bookings,
        spent: Math.round(v.spent * 100) / 100,
        lastBooking: new Date(v.lastBooking).toLocaleDateString('tr-TR'),
      }))
      .sort((a, b) => b.spent - a.spent)
      .slice(0, 8);

    const newCustomers = customerMap.size;
    const returning = [...customerMap.values()].filter(
      (c) => c.bookings > 1,
    ).length;

    const satisfaction = [5, 4, 3, 2, 1].map((rating) => {
      const count = allReviews.filter((r) => r.rating === rating).length;
      const percentage =
        allReviews.length === 0
          ? 0
          : Math.round((count / allReviews.length) * 1000) / 10;
      return { rating, percentage };
    });

    const tourPerformance = tours.map((t) => {
      const stats = byTour.get(t.id) ?? { sales: 0, revenue: 0 };
      return {
        id: t.id,
        name: t.title,
        bookings: stats.sales,
        avgRating: avgRating(t.id),
        conversionRate: null as number | null,
        revenue: Math.round(stats.revenue * 100) / 100,
      };
    });

    const overallAvg =
      allReviews.length === 0
        ? 0
        : Math.round(
            (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length) *
              10,
          ) / 10;

    return {
      success: true,
      data: {
        dateRange: {
          id: range.id,
          label: range.label,
        },
        sales: {
          summary: {
            totalSales,
            totalRevenue: Math.round(totalRevenue * 100) / 100,
            averageOrderValue:
              totalSales === 0
                ? 0
                : Math.round((totalRevenue / totalSales) * 100) / 100,
            comparedToLastPeriod: compared,
            increase: compared === null ? null : compared >= 0,
          },
          periodLabel: range.label,
          periodRangeText: `${range.start.toLocaleDateString('tr-TR')} – ${range.end.toLocaleDateString('tr-TR')}`,
          topSelling,
          bookingSummary: {
            totalReservations: current.length,
            completedTours: completed,
            cancelledReservations: cancelled,
            refundedCount: 0,
            averageRating: overallAvg,
          },
          trend,
        },
        performance: {
          summary: {
            conversionRate: null,
            completionRate,
            avgBookingValue:
              totalSales === 0
                ? 0
                : Math.round((totalRevenue / totalSales) * 100) / 100,
            monthlyBookings: totalSales,
          },
          monthlyTrend: trend.map((t) => ({
            label: t.label,
            count: t.sales,
          })),
          tourPerformance,
          goals: [
            {
              name: 'Aylık rezervasyon',
              current: totalSales,
              target: Math.max(10, totalSales),
              percentage: Math.min(
                100,
                Math.round((totalSales / Math.max(10, totalSales)) * 100),
              ),
            },
            {
              name: 'Tamamlanma oranı',
              current: completionRate,
              target: 80,
              percentage: Math.min(
                100,
                Math.round((completionRate / 80) * 100),
              ),
            },
          ],
        },
        customer: {
          summary: {
            totalCustomers: customerMap.size,
            newCustomers,
            returningCustomers: returning,
            customerLifetimeValue:
              customerMap.size === 0
                ? 0
                : Math.round(
                    ([...customerMap.values()].reduce(
                      (s, c) => s + c.spent,
                      0,
                    ) /
                      customerMap.size) *
                      100,
                  ) / 100,
            percentChange: null,
            increase: null,
          },
          topCustomers,
          satisfactionDistribution: satisfaction,
        },
        visitors: {
          disclaimer:
            'Ziyaretçi metrikleri rezervasyon etkileşiminden türetilir. Gerçek trafik analytics sonra eklenecek.',
          summary: {
            uniqueVisitors: customerMap.size,
            totalInteractions: current.length,
            conversionRate:
              current.length === 0
                ? 0
                : Math.round((totalSales / current.length) * 1000) / 10,
            comparedToLastPeriod: compared,
            increase: compared === null ? null : compared >= 0,
          },
          trend: trend.map((t) => ({
            label: t.label,
            interactions: t.sales,
            uniqueVisitors: t.sales,
          })),
        },
      },
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

  private toReservation(
    row: {
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
      guests?: Prisma.JsonValue;
      metadata?: Prisma.JsonValue | null;
      startDate?: Date | null;
      endDate?: Date | null;
      createdAt: Date;
      updatedAt: Date;
    },
    extra?: { tourTitle?: string | null },
  ) {
    const guests = Array.isArray(row.guests)
      ? (row.guests as Array<{ firstName?: string; lastName?: string }>)
      : [];
    const primary = guests[0];
    const customerName = primary
      ? `${primary.firstName ?? ''} ${primary.lastName ?? ''}`.trim()
      : row.contactEmail;
    const meta =
      row.metadata &&
      typeof row.metadata === 'object' &&
      !Array.isArray(row.metadata)
        ? (row.metadata as Record<string, unknown>)
        : {};

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
      status: row.status,
      paymentStatus: row.paymentStatus ?? 'UNPAID',
      adults: row.adults,
      children: row.children,
      guestCount: row.adults + row.children,
      totalAmount: row.totalAmount.toString(),
      currency: row.currency,
      contactEmail: row.contactEmail,
      contactPhone: row.contactPhone,
      customerName,
      tourTitle: extra?.tourTitle ?? null,
      seatNumbers:
        typeof meta.seatNumbers === 'string' ? meta.seatNumbers : null,
      startDate: row.startDate?.toISOString() ?? null,
      endDate: row.endDate?.toISOString() ?? null,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
