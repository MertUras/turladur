import { BookingStatus, PaymentStatus, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import {
  addDays,
  addMonths,
  endOfMonth,
  formatTurkishDate,
  startOfDay,
  startOfMonth,
  monthLabel,
} from '@/lib/partner/dashboard/utils';
import {
  PartnerReportsContext,
  PartnerReportsData,
  PartnerReportsProvider,
  ReportDateRangeId,
  ResolvedDateRange,
} from './types';

const REVENUE_STATUSES: BookingStatus[] = [BookingStatus.CONFIRMED, BookingStatus.COMPLETED];

function resolveDateRange(id: ReportDateRangeId, now = new Date()): ResolvedDateRange {
  const today = startOfDay(now);
  const endOfToday = new Date(today);
  endOfToday.setHours(23, 59, 59, 999);

  const ranges: Record<
    ReportDateRangeId,
    { label: string; start: Date; end: Date; previousStart: Date; previousEnd: Date }
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

  const range = ranges[id];
  return { id, ...range };
}

function percentChange(current: number, previous: number): number | null {
  if (current === 0 && previous === 0) return null;
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

function bookingWhere(context: PartnerReportsContext): Prisma.BookingWhereInput {
  return context.operatorType === 'tour'
    ? { tourOperatorId: context.tourOperatorId }
    : { experience: { userId: context.userId } };
}

function inPeriod(
  base: Prisma.BookingWhereInput,
  start: Date,
  end: Date
): Prisma.BookingWhereInput {
  return {
    ...base,
    createdAt: { gte: start, lte: end },
  };
}

export class PrismaPartnerReportsProvider implements PartnerReportsProvider {
  async getReports(
    context: PartnerReportsContext,
    dateRangeId: ReportDateRangeId
  ): Promise<PartnerReportsData> {
    const dateRange = resolveDateRange(dateRangeId);
    const baseWhere = bookingWhere(context);

    const [sales, performance, customer] = await Promise.all([
      this.buildSalesReport(context, baseWhere, dateRange),
      this.buildPerformanceReport(context, baseWhere, dateRange),
      this.buildCustomerReport(context, baseWhere, dateRange),
    ]);

    return {
      dateRange,
      sales,
      performance,
      customer,
      visitors: {
        available: false,
        message:
          'Ziyaretçi analizi Firebase Analytics entegrasyonu sonrası aktif olacaktır.',
      },
    };
  }

  private async buildSalesReport(
    context: PartnerReportsContext,
    baseWhere: Prisma.BookingWhereInput,
    dateRange: ResolvedDateRange
  ) {
    const periodWhere = inPeriod(baseWhere, dateRange.start, dateRange.end);
    const previousWhere = inPeriod(baseWhere, dateRange.previousStart, dateRange.previousEnd);
    const revenueWhere = { ...periodWhere, status: { in: REVENUE_STATUSES } };
    const previousRevenueWhere = { ...previousWhere, status: { in: REVENUE_STATUSES } };

    const [
      periodBookings,
      previousBookings,
      periodRevenue,
      previousRevenue,
      statusBreakdown,
      operatorRating,
      topTours,
      topExperiences,
      trendBookings,
    ] = await Promise.all([
      prisma.booking.count({ where: revenueWhere }),
      prisma.booking.count({ where: previousRevenueWhere }),
      prisma.booking.aggregate({ where: revenueWhere, _sum: { totalPrice: true } }),
      prisma.booking.aggregate({ where: previousRevenueWhere, _sum: { totalPrice: true } }),
      prisma.booking.groupBy({
        by: ['status'],
        where: periodWhere,
        _count: true,
      }),
      context.operatorType === 'tour'
        ? prisma.tourOperator.findUnique({
            where: { id: context.tourOperatorId },
            select: { rating: true },
          })
        : prisma.experienceOperator.findUnique({
            where: { id: context.experienceOperatorId },
            select: { rating: true },
          }),
      context.operatorType === 'tour'
        ? prisma.booking.groupBy({
            by: ['tourId'],
            where: { ...revenueWhere, tourId: { not: null } },
            _count: true,
            _sum: { totalPrice: true },
            orderBy: { _count: { tourId: 'desc' } },
            take: 5,
          })
        : Promise.resolve([]),
      context.operatorType === 'experience'
        ? prisma.booking.groupBy({
            by: ['experienceId'],
            where: { ...revenueWhere, experienceId: { not: null } },
            _count: true,
            _sum: { totalPrice: true },
            orderBy: { _count: { experienceId: 'desc' } },
            take: 5,
          })
        : Promise.resolve([]),
      prisma.booking.findMany({
        where: revenueWhere,
        select: { createdAt: true, totalPrice: true },
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    const totalRevenue = periodRevenue._sum.totalPrice || 0;
    const compared = percentChange(periodBookings, previousBookings);

    const topGroups =
      context.operatorType === 'tour'
        ? topTours.filter((g) => g.tourId)
        : topExperiences.filter((g) => g.experienceId);

    const itemIds = topGroups.map((g) =>
      context.operatorType === 'tour'
        ? (g as { tourId: string }).tourId
        : (g as { experienceId: string }).experienceId
    );

    const [tourNames, experienceNames] = await Promise.all([
      context.operatorType === 'tour' && itemIds.length
        ? prisma.tour.findMany({
            where: { id: { in: itemIds as string[] } },
            select: { id: true, name: true },
          })
        : Promise.resolve([]),
      context.operatorType === 'experience' && itemIds.length
        ? prisma.experience.findMany({
            where: { id: { in: itemIds as string[] } },
            select: { id: true, title: true },
          })
        : Promise.resolve([]),
    ]);

    const nameMap = new Map<string, string>();
    tourNames.forEach((t) => nameMap.set(t.id, t.name));
    experienceNames.forEach((e) => nameMap.set(e.id, e.title));

    const topSelling = await Promise.all(
      topGroups.map(async (group) => {
        const id =
          context.operatorType === 'tour'
            ? (group as { tourId: string }).tourId
            : (group as { experienceId: string }).experienceId;

        const prevCount = await prisma.booking.count({
          where: {
            ...previousRevenueWhere,
            ...(context.operatorType === 'tour'
              ? { tourId: id }
              : { experienceId: id }),
          },
        });

        return {
          id,
          name: nameMap.get(id) || 'Belirtilmemiş',
          sales: group._count,
          revenue: group._sum.totalPrice || 0,
          growth: percentChange(group._count, prevCount),
        };
      })
    );

    const countStatus = (...statuses: BookingStatus[]) =>
      statusBreakdown
        .filter((s) => statuses.includes(s.status))
        .reduce((sum, s) => sum + s._count, 0);

    const refundedCount = await prisma.booking.count({
      where: {
        ...periodWhere,
        paymentStatus: PaymentStatus.REFUNDED,
      },
    });

    const trendMap = new Map<string, { sales: number; revenue: number }>();
    for (const booking of trendBookings) {
      const key = `${booking.createdAt.getFullYear()}-${booking.createdAt.getMonth()}-${booking.createdAt.getDate()}`;
      const existing = trendMap.get(key) || { sales: 0, revenue: 0 };
      existing.sales += 1;
      existing.revenue += booking.totalPrice;
      trendMap.set(key, existing);
    }

    const trend = Array.from(trendMap.entries()).map(([key, value]) => {
      const [year, month, day] = key.split('-').map(Number);
      const date = new Date(year, month, day);
      return {
        label: formatTurkishDate(date),
        sales: value.sales,
        revenue: value.revenue,
      };
    });

    return {
      summary: {
        totalSales: periodBookings,
        totalRevenue,
        averageOrderValue: periodBookings > 0 ? totalRevenue / periodBookings : 0,
        comparedToLastPeriod: compared,
        increase: compared === null ? null : compared >= 0,
      },
      periodLabel: dateRange.label,
      periodRangeText: `${formatTurkishDate(dateRange.start)} - ${formatTurkishDate(dateRange.end)}`,
      topSelling,
      bookingSummary: {
        totalReservations: statusBreakdown.reduce((sum, s) => sum + s._count, 0),
        completedTours: countStatus(BookingStatus.COMPLETED),
        cancelledReservations: countStatus(BookingStatus.CANCELLED),
        refundedCount,
        averageRating: operatorRating?.rating ?? 0,
      },
      trend,
    };
  }

  private async buildPerformanceReport(
    context: PartnerReportsContext,
    baseWhere: Prisma.BookingWhereInput,
    dateRange: ResolvedDateRange
  ) {
    const periodWhere = inPeriod(baseWhere, dateRange.start, dateRange.end);
    const revenueWhere = { ...periodWhere, status: { in: REVENUE_STATUSES } };

    const [periodBookings, completed, cancelled, revenueAgg, monthlyBookings, tours, experiences] =
      await Promise.all([
        prisma.booking.count({ where: periodWhere }),
        prisma.booking.count({
          where: { ...periodWhere, status: BookingStatus.COMPLETED },
        }),
        prisma.booking.count({
          where: { ...periodWhere, status: BookingStatus.CANCELLED },
        }),
        prisma.booking.aggregate({ where: revenueWhere, _sum: { totalPrice: true } }),
        prisma.booking.findMany({
          where: inPeriod(baseWhere, addMonths(new Date(), -11), new Date()),
          select: { createdAt: true },
        }),
        context.operatorType === 'tour'
          ? prisma.tour.findMany({
              where: { tourOperatorId: context.tourOperatorId },
              include: {
                _count: {
                  select: {
                    bookings: {
                      where: inPeriod(baseWhere, dateRange.start, dateRange.end),
                    },
                  },
                },
                bookings: {
                  where: revenueWhere,
                  select: { totalPrice: true },
                },
              },
            })
          : Promise.resolve([]),
        context.operatorType === 'experience'
          ? prisma.experience.findMany({
              where: { userId: context.userId },
              include: {
                _count: {
                  select: {
                    bookings: {
                      where: inPeriod(baseWhere, dateRange.start, dateRange.end),
                    },
                  },
                },
                bookings: {
                  where: revenueWhere,
                  select: { totalPrice: true },
                },
              },
            })
          : Promise.resolve([]),
      ]);

    const totalRevenue = revenueAgg._sum.totalPrice || 0;
    const completionRate =
      periodBookings > 0 ? Math.round((completed / periodBookings) * 1000) / 10 : 0;

    const monthlyTrendMap = new Map<string, number>();
    for (let i = 11; i >= 0; i--) {
      const monthStart = startOfMonth(addMonths(new Date(), -i));
      monthlyTrendMap.set(`${monthStart.getFullYear()}-${monthStart.getMonth()}`, 0);
    }
    for (const booking of monthlyBookings) {
      const key = `${booking.createdAt.getFullYear()}-${booking.createdAt.getMonth()}`;
      if (monthlyTrendMap.has(key)) {
        monthlyTrendMap.set(key, (monthlyTrendMap.get(key) || 0) + 1);
      }
    }

    const monthlyTrend = Array.from(monthlyTrendMap.entries()).map(([key, count]) => {
      const [year, month] = key.split('-').map(Number);
      return { label: monthLabel(new Date(year, month, 1)), count };
    });

    const items =
      context.operatorType === 'tour'
        ? tours.map((t) => ({
            id: t.id,
            name: t.name,
            bookings: t._count.bookings,
            avgRating: t.rating ?? 0,
            revenue: t.bookings.reduce((sum, b) => sum + b.totalPrice, 0),
          }))
        : experiences.map((e) => ({
            id: e.id,
            name: e.title,
            bookings: e._count.bookings,
            avgRating: e.rating ?? 0,
            revenue: e.bookings.reduce((sum, b) => sum + b.totalPrice, 0),
          }));

    const tourPerformance = items
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 5)
      .map((item) => ({
        ...item,
        conversionRate: null,
      }));

    const monthlyTotal = monthlyTrend.reduce((sum, m) => sum + m.count, 0);

    return {
      summary: {
        conversionRate: null,
        completionRate,
        avgBookingValue: periodBookings > 0 ? totalRevenue / periodBookings : 0,
        monthlyBookings: monthlyTotal,
      },
      monthlyTrend,
      tourPerformance,
      goals: [
        {
          name: 'Aylık Rezervasyon',
          current: periodBookings,
          target: Math.max(periodBookings, 10),
          percentage: Math.min(100, Math.round((periodBookings / Math.max(periodBookings, 10)) * 100)),
        },
        {
          name: 'Aylık Gelir',
          current: totalRevenue,
          target: Math.max(totalRevenue, 10000),
          percentage: Math.min(
            100,
            Math.round((totalRevenue / Math.max(totalRevenue, 10000)) * 100)
          ),
        },
        {
          name: 'Tamamlanan Turlar',
          current: completed,
          target: Math.max(completed, 5),
          percentage: Math.min(100, Math.round((completed / Math.max(completed, 5)) * 100)),
        },
      ],
    };
  }

  private async buildCustomerReport(
    context: PartnerReportsContext,
    baseWhere: Prisma.BookingWhereInput,
    dateRange: ResolvedDateRange
  ) {
    const periodWhere = inPeriod(baseWhere, dateRange.start, dateRange.end);
    const previousWhere = inPeriod(baseWhere, dateRange.previousStart, dateRange.previousEnd);

    const [periodBookings, previousCustomers, allCustomerBookings, satisfactionRows] =
      await Promise.all([
        prisma.booking.findMany({
          where: periodWhere,
          select: {
            userId: true,
            totalPrice: true,
            createdAt: true,
            user: { select: { name: true } },
          },
        }),
        prisma.booking.groupBy({
          by: ['userId'],
          where: previousWhere,
        }),
        prisma.booking.findMany({
          where: baseWhere,
          select: { userId: true, totalPrice: true, createdAt: true },
        }),
        prisma.partnerReview.groupBy({
          by: ['rating'],
          where:
            context.operatorType === 'tour'
              ? { tourOperatorId: context.tourOperatorId }
              : { experienceOperatorId: context.experienceOperatorId },
          _count: true,
        }),
      ]);

    const uniqueCustomers = new Set(periodBookings.map((b) => b.userId));
    const previousUnique = previousCustomers.length;
    const percentChangeValue = percentChange(uniqueCustomers.size, previousUnique);

    const firstBookingByUser = new Map<string, Date>();
    for (const booking of allCustomerBookings) {
      const existing = firstBookingByUser.get(booking.userId);
      if (!existing || booking.createdAt < existing) {
        firstBookingByUser.set(booking.userId, booking.createdAt);
      }
    }

    let newCustomers = 0;
    let returningCustomers = 0;
    for (const userId of uniqueCustomers) {
      const first = firstBookingByUser.get(userId);
      if (first && first >= dateRange.start && first <= dateRange.end) {
        newCustomers += 1;
      } else {
        returningCustomers += 1;
      }
    }

    const spendByUser = new Map<string, { bookings: number; spent: number; lastBooking: Date; name: string }>();
    for (const booking of periodBookings) {
      const existing = spendByUser.get(booking.userId) || {
        bookings: 0,
        spent: 0,
        lastBooking: booking.createdAt,
        name: booking.user.name || 'İsimsiz Müşteri',
      };
      existing.bookings += 1;
      existing.spent += booking.totalPrice;
      if (booking.createdAt > existing.lastBooking) {
        existing.lastBooking = booking.createdAt;
      }
      spendByUser.set(booking.userId, existing);
    }

    const topCustomers = Array.from(spendByUser.entries())
      .map(([id, data]) => ({
        id,
        name: data.name,
        bookings: data.bookings,
        spent: data.spent,
        lastBooking: formatTurkishDate(data.lastBooking),
      }))
      .sort((a, b) => b.spent - a.spent)
      .slice(0, 5);

    const totalSpent = allCustomerBookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const allUnique = new Set(allCustomerBookings.map((b) => b.userId)).size;
    const clv = allUnique > 0 ? totalSpent / allUnique : 0;

    const totalReviews = satisfactionRows.reduce((sum, r) => sum + r._count, 0);
    const satisfactionDistribution =
      totalReviews > 0
        ? [5, 4, 3, 2, 1].map((rating) => {
            const count =
              satisfactionRows.find((r) => r.rating === rating)?._count || 0;
            return {
              rating,
              percentage: Math.round((count / totalReviews) * 100),
            };
          })
        : [];

    return {
      summary: {
        totalCustomers: uniqueCustomers.size,
        newCustomers,
        returningCustomers,
        customerLifetimeValue: clv,
        percentChange: percentChangeValue,
        increase: percentChangeValue === null ? null : percentChangeValue >= 0,
      },
      topCustomers,
      satisfactionDistribution,
    };
  }
}

export const prismaPartnerReportsProvider = new PrismaPartnerReportsProvider();
