import { ForbiddenException, Injectable } from '@nestjs/common';

import { CacheService } from '../../../core/cache/cache.service';
import { PrismaService } from '../../../core/database/prisma.service';

const OVERVIEW_CACHE_TTL_SECONDS = 120;

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  async getAdminOverview() {
    const cacheKey = 'analytics:admin:overview';
    const cached = await this.cache.get<Record<string, unknown>>(cacheKey);
    if (cached) {
      return { success: true, data: cached, error: null };
    }

    const since30Days = new Date();
    since30Days.setDate(since30Days.getDate() - 30);

    const [
      users,
      partners,
      partnersPending,
      tours,
      toursPending,
      reservations,
      reservationsLast30Days,
      paymentsSuccess,
      revenueSum,
    ] = await Promise.all([
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.partner.count({ where: { deletedAt: null } }),
      this.prisma.partner.count({
        where: { deletedAt: null, status: 'PENDING' },
      }),
      this.prisma.tour.count({ where: { deletedAt: null } }),
      this.prisma.tour.count({
        where: { deletedAt: null, status: 'PENDING_REVIEW' },
      }),
      this.prisma.reservation.count({ where: { deletedAt: null } }),
      this.prisma.reservation.count({
        where: { deletedAt: null, createdAt: { gte: since30Days } },
      }),
      this.prisma.paymentTransaction.count({ where: { status: 'SUCCESS' } }),
      this.prisma.paymentTransaction.aggregate({
        where: { status: 'SUCCESS' },
        _sum: { amount: true },
      }),
    ]);

    const data = {
      users,
      partners: { total: partners, pending: partnersPending },
      tours: { total: tours, pendingReview: toursPending },
      reservations: { total: reservations, last30Days: reservationsLast30Days },
      payments: {
        successCount: paymentsSuccess,
        successVolume: revenueSum._sum.amount?.toString() ?? '0',
        currency: 'TRY',
      },
    };

    await this.cache.set(cacheKey, data, OVERVIEW_CACHE_TTL_SECONDS);

    return { success: true, data, error: null };
  }

  async getPartnerOverview(partnerId: string | undefined) {
    if (!partnerId) {
      throw new ForbiddenException({
        code: 'PARTNER_REQUIRED',
        message: 'Partner hesabı gerekir',
      });
    }

    const cacheKey = `analytics:partner:${partnerId}:overview`;
    const cached = await this.cache.get<Record<string, unknown>>(cacheKey);
    if (cached) {
      return { success: true, data: cached, error: null };
    }

    const since7Days = new Date();
    since7Days.setDate(since7Days.getDate() - 7);

    const [
      tourCount,
      publishedCount,
      pendingCount,
      reservationCount,
      reservationsLast7Days,
      revenue,
    ] = await Promise.all([
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
      this.prisma.reservation.count({
        where: {
          partnerId,
          deletedAt: null,
          createdAt: { gte: since7Days },
        },
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

    const data = {
      tours: {
        total: tourCount,
        published: publishedCount,
        pendingReview: pendingCount,
      },
      reservations: {
        total: reservationCount,
        last7Days: reservationsLast7Days,
      },
      revenue: {
        confirmedTotal: revenue._sum.totalAmount?.toString() ?? '0',
        currency: 'TRY',
      },
    };

    await this.cache.set(cacheKey, data, OVERVIEW_CACHE_TTL_SECONDS);

    return { success: true, data, error: null };
  }

  async getPopularSearches(limit = 10) {
    const cacheKey = `analytics:popular-searches:${limit}`;
    const cached =
      await this.cache.get<
        { query: string; count: number; avgResults: number }[]
      >(cacheKey);
    if (cached) {
      return { success: true, data: cached, error: null };
    }

    const since30Days = new Date();
    since30Days.setDate(since30Days.getDate() - 30);

    const rows = await this.prisma.searchQueryLog.groupBy({
      by: ['query'],
      where: {
        createdAt: { gte: since30Days },
        query: { not: '(category-only)' },
      },
      _count: { query: true },
      _avg: { resultCount: true },
    });

    const data = rows
      .sort((left, right) => right._count.query - left._count.query)
      .slice(0, limit)
      .map((row) => ({
        query: row.query,
        count: row._count.query,
        avgResults: Math.round(row._avg.resultCount ?? 0),
      }));

    await this.cache.set(cacheKey, data, OVERVIEW_CACHE_TTL_SECONDS);

    return { success: true, data, error: null };
  }
}
