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
  getRefundAmount,
  isCompletedTour,
  isSaleBooking,
} from '@/lib/partner/financials/booking-rules';
import { prismaTourRatingProvider } from '@/lib/reviews/prisma-tour-ratings-provider';
import {
  PartnerReportsContext,
  PartnerReportsData,
  PartnerReportsProvider,
  ReportDateRangeId,
  ResolvedDateRange,
} from './types';

type BookingRow = {
  id: string;
  userId: string;
  totalPrice: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  metadata: Prisma.JsonValue | null;
  createdAt: Date;
  tourId: string | null;
  experienceId: string | null;
};

const BOOKING_SELECT = {
  id: true,
  userId: true,
  totalPrice: true,
  status: true,
  paymentStatus: true,
  metadata: true,
  createdAt: true,
  tourId: true,
  experienceId: true,
} satisfies Prisma.BookingSelect;

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

function conversionRate(sales: number, attempts: number): number | null {
  if (attempts === 0) return null;
  return Math.round((sales / attempts) * 1000) / 10;
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

function productId(booking: BookingRow, context: PartnerReportsContext): string | null {
  return context.operatorType === 'tour' ? booking.tourId : booking.experienceId;
}

function summarizeSales(bookings: BookingRow[]) {
  let salesCount = 0;
  let grossRevenue = 0;
  let refundTotal = 0;

  for (const booking of bookings) {
    const refundAmount = getRefundAmount(booking);
    if (refundAmount > 0) {
      refundTotal += refundAmount;
    }
    if (isSaleBooking(booking.status, booking.paymentStatus)) {
      salesCount += 1;
      grossRevenue += booking.totalPrice;
    }
  }

  return {
    salesCount,
    grossRevenue,
    refundTotal,
    netRevenue: grossRevenue - refundTotal,
  };
}

async function fetchBookings(
  where: Prisma.BookingWhereInput
): Promise<BookingRow[]> {
  return prisma.booking.findMany({
    where,
    select: BOOKING_SELECT,
    orderBy: { createdAt: 'asc' },
  });
}

async function resolveProductNames(
  context: PartnerReportsContext,
  ids: string[]
): Promise<Map<string, string>> {
  const nameMap = new Map<string, string>();
  if (ids.length === 0) return nameMap;

  if (context.operatorType === 'tour') {
    const tours = await prisma.tour.findMany({
      where: { id: { in: ids } },
      select: { id: true, name: true },
    });
    tours.forEach((t) => nameMap.set(t.id, t.name));
  } else {
    const experiences = await prisma.experience.findMany({
      where: { id: { in: ids } },
      select: { id: true, title: true },
    });
    experiences.forEach((e) => nameMap.set(e.id, e.title));
  }

  return nameMap;
}

function aggregateByProduct(
  bookings: BookingRow[],
  context: PartnerReportsContext
): Map<string, { attempts: number; sales: number; revenue: number; users: Set<string> }> {
  const map = new Map<string, { attempts: number; sales: number; revenue: number; users: Set<string> }>();

  for (const booking of bookings) {
    const id = productId(booking, context);
    if (!id) continue;

    const existing = map.get(id) || {
      attempts: 0,
      sales: 0,
      revenue: 0,
      users: new Set<string>(),
    };

    existing.attempts += 1;
    existing.users.add(booking.userId);

    if (isSaleBooking(booking.status, booking.paymentStatus)) {
      existing.sales += 1;
      existing.revenue += booking.totalPrice - getRefundAmount(booking);
    }

    map.set(id, existing);
  }

  return map;
}

export class PrismaPartnerReportsProvider implements PartnerReportsProvider {
  async getReports(
    context: PartnerReportsContext,
    dateRangeId: ReportDateRangeId
  ): Promise<PartnerReportsData> {
    const dateRange = resolveDateRange(dateRangeId);
    const baseWhere = bookingWhere(context);

    const [sales, performance, customer, visitors] = await Promise.all([
      this.buildSalesReport(context, baseWhere, dateRange),
      this.buildPerformanceReport(context, baseWhere, dateRange),
      this.buildCustomerReport(context, baseWhere, dateRange),
      this.buildVisitorsReport(context, baseWhere, dateRange),
    ]);

    return {
      dateRange,
      sales,
      performance,
      customer,
      visitors,
    };
  }

  private async buildSalesReport(
    context: PartnerReportsContext,
    baseWhere: Prisma.BookingWhereInput,
    dateRange: ResolvedDateRange
  ) {
    const periodWhere = inPeriod(baseWhere, dateRange.start, dateRange.end);
    const previousWhere = inPeriod(baseWhere, dateRange.previousStart, dateRange.previousEnd);

    const [periodBookings, previousBookings, operatorRating] = await Promise.all([
      fetchBookings(periodWhere),
      fetchBookings(previousWhere),
      context.operatorType === 'tour'
        ? prisma.tourOperator.findUnique({
            where: { id: context.tourOperatorId },
            select: { rating: true },
          })
        : prisma.experienceOperator.findUnique({
            where: { id: context.experienceOperatorId },
            select: { rating: true },
          }),
    ]);

    const periodSales = summarizeSales(periodBookings);
    const previousSales = summarizeSales(previousBookings);
    const compared = percentChange(periodSales.salesCount, previousSales.salesCount);

    const currentByProduct = aggregateByProduct(periodBookings, context);
    const previousByProduct = aggregateByProduct(previousBookings, context);

    const productIds = Array.from(currentByProduct.entries())
      .sort((a, b) => b[1].sales - a[1].sales)
      .slice(0, 5)
      .map(([id]) => id);

    const nameMap = await resolveProductNames(context, productIds);

    const topSelling = productIds.map((id) => {
      const current = currentByProduct.get(id)!;
      const previous = previousByProduct.get(id);
      return {
        id,
        name: nameMap.get(id) || 'Belirtilmemiş',
        sales: current.sales,
        revenue: current.revenue,
        growth: percentChange(current.sales, previous?.sales ?? 0),
      };
    });

    let completedTours = 0;
    let cancelledReservations = 0;
    let refundedCount = 0;

    for (const booking of periodBookings) {
      if (isCompletedTour(booking.status)) completedTours += 1;
      if (booking.status === BookingStatus.CANCELLED) cancelledReservations += 1;
      if (
        booking.paymentStatus === PaymentStatus.REFUNDED ||
        getRefundAmount(booking) > 0
      ) {
        refundedCount += 1;
      }
    }

    const trendMap = new Map<string, { sales: number; revenue: number }>();
    for (const booking of periodBookings) {
      if (!isSaleBooking(booking.status, booking.paymentStatus)) continue;

      const key = `${booking.createdAt.getFullYear()}-${booking.createdAt.getMonth()}-${booking.createdAt.getDate()}`;
      const existing = trendMap.get(key) || { sales: 0, revenue: 0 };
      existing.sales += 1;
      existing.revenue += booking.totalPrice - getRefundAmount(booking);
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
        totalSales: periodSales.salesCount,
        totalRevenue: periodSales.netRevenue,
        averageOrderValue:
          periodSales.salesCount > 0 ? periodSales.netRevenue / periodSales.salesCount : 0,
        comparedToLastPeriod: compared,
        increase: compared === null ? null : compared >= 0,
      },
      periodLabel: dateRange.label,
      periodRangeText: `${formatTurkishDate(dateRange.start)} - ${formatTurkishDate(dateRange.end)}`,
      topSelling,
      bookingSummary: {
        totalReservations: periodBookings.length,
        completedTours,
        cancelledReservations,
        refundedCount,
        averageRating: operatorRating?.rating ?? 0,
      },
      trend,
    };
  }

  private async buildVisitorsReport(
    context: PartnerReportsContext,
    baseWhere: Prisma.BookingWhereInput,
    dateRange: ResolvedDateRange
  ) {
    const periodWhere = inPeriod(baseWhere, dateRange.start, dateRange.end);
    const previousWhere = inPeriod(baseWhere, dateRange.previousStart, dateRange.previousEnd);

    const [periodBookings, previousBookings] = await Promise.all([
      fetchBookings(periodWhere),
      fetchBookings(previousWhere),
    ]);

    const uniqueVisitors = new Set(periodBookings.map((b) => b.userId)).size;
    const previousUnique = new Set(previousBookings.map((b) => b.userId)).size;
    const compared = percentChange(uniqueVisitors, previousUnique);

    const periodSales = summarizeSales(periodBookings);
    const overallConversion = conversionRate(periodSales.salesCount, periodBookings.length) ?? 0;

    const trendMap = new Map<string, { interactions: number; users: Set<string> }>();
    for (const booking of periodBookings) {
      const key = `${booking.createdAt.getFullYear()}-${booking.createdAt.getMonth()}-${booking.createdAt.getDate()}`;
      const existing = trendMap.get(key) || { interactions: 0, users: new Set<string>() };
      existing.interactions += 1;
      existing.users.add(booking.userId);
      trendMap.set(key, existing);
    }

    const trend = Array.from(trendMap.entries()).map(([key, value]) => {
      const [year, month, day] = key.split('-').map(Number);
      const date = new Date(year, month, day);
      return {
        label: formatTurkishDate(date),
        interactions: value.interactions,
        uniqueVisitors: value.users.size,
      };
    });

    const byProduct = aggregateByProduct(periodBookings, context);
    const productIds = Array.from(byProduct.entries())
      .sort((a, b) => b[1].attempts - a[1].attempts)
      .slice(0, 10)
      .map(([id]) => id);

    const nameMap = await resolveProductNames(context, productIds);

    const tourBreakdown = productIds.map((id) => {
      const stats = byProduct.get(id)!;
      return {
        id,
        name: nameMap.get(id) || 'Belirtilmemiş',
        interactions: stats.attempts,
        uniqueVisitors: stats.users.size,
        conversions: stats.sales,
        conversionRate: conversionRate(stats.sales, stats.attempts) ?? 0,
      };
    });

    return {
      available: true as const,
      dataSource: 'booking_proxy' as const,
      disclaimer:
        'Sayfa görüntüleme verisi olmadığı için ziyaretçi metrikleri rezervasyon etkileşimlerinden türetilmiştir. Gerçek trafik analitiği Firebase entegrasyonu sonrası sağlanacaktır.',
      summary: {
        uniqueVisitors,
        totalInteractions: periodBookings.length,
        conversionRate: overallConversion,
        comparedToLastPeriod: compared,
        increase: compared === null ? null : compared >= 0,
      },
      trend,
      tourBreakdown,
    };
  }

  private async buildPerformanceReport(
    context: PartnerReportsContext,
    baseWhere: Prisma.BookingWhereInput,
    dateRange: ResolvedDateRange
  ) {
    const periodWhere = inPeriod(baseWhere, dateRange.start, dateRange.end);
    const twelveMonthStart = startOfMonth(addMonths(new Date(), -11));

    const [periodBookings, monthlyBookings, products] = await Promise.all([
      fetchBookings(periodWhere),
      fetchBookings(inPeriod(baseWhere, twelveMonthStart, new Date())),
      context.operatorType === 'tour'
        ? prisma.tour.findMany({
            where: { tourOperatorId: context.tourOperatorId },
            select: { id: true, name: true, rating: true },
          })
        : prisma.experience.findMany({
            where: { userId: context.userId },
            select: { id: true, title: true, rating: true },
          }),
    ]);

    const periodSales = summarizeSales(periodBookings);
    let completed = 0;

    for (const booking of periodBookings) {
      if (isCompletedTour(booking.status)) completed += 1;
    }

    const completionRate =
      periodBookings.length > 0
        ? Math.round((completed / periodBookings.length) * 1000) / 10
        : 0;

    const overallConversion = conversionRate(periodSales.salesCount, periodBookings.length);

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

    const byProduct = aggregateByProduct(periodBookings, context);

    const tourIds =
      context.operatorType === 'tour' ? products.map((t) => t.id) : [];
    const tourRatings =
      context.operatorType === 'tour' && tourIds.length > 0
        ? await prismaTourRatingProvider.getTourRatingsForTourIds(tourIds)
        : new Map();

    const tourPerformance = products
      .map((item) => {
        const stats = byProduct.get(item.id);
        const bookings = stats?.attempts ?? 0;
        const revenue = stats?.revenue ?? 0;
        const sales = stats?.sales ?? 0;

        const avgRating =
          context.operatorType === 'tour'
            ? tourRatings.get(item.id)?.averageRating ?? item.rating ?? 0
            : item.rating ?? 0;

        return {
          id: item.id,
          name: context.operatorType === 'tour' ? (item as { name: string }).name : (item as { title: string }).title,
          bookings,
          avgRating,
          conversionRate: conversionRate(sales, bookings),
          revenue,
        };
      })
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 10);

    const monthlyTotal = monthlyTrend.reduce((sum, m) => sum + m.count, 0);

    const bookingTarget = Math.max(Math.ceil(periodBookings.length * 1.2), 10);
    const revenueTarget = Math.max(Math.ceil(periodSales.netRevenue * 1.2), 10000);
    const completedTarget = Math.max(Math.ceil(completed * 1.2), 5);

    return {
      summary: {
        conversionRate: overallConversion,
        completionRate,
        avgBookingValue:
          periodSales.salesCount > 0 ? periodSales.netRevenue / periodSales.salesCount : 0,
        monthlyBookings: monthlyTotal,
      },
      monthlyTrend,
      tourPerformance,
      goals: [
        {
          name: 'Aylık Rezervasyon',
          current: periodBookings.length,
          target: bookingTarget,
          percentage: Math.min(100, Math.round((periodBookings.length / bookingTarget) * 100)),
        },
        {
          name: 'Aylık Gelir',
          current: periodSales.netRevenue,
          target: revenueTarget,
          percentage: Math.min(
            100,
            Math.round((periodSales.netRevenue / revenueTarget) * 100)
          ),
        },
        {
          name: 'Tamamlanan Turlar',
          current: completed,
          target: completedTarget,
          percentage: Math.min(100, Math.round((completed / completedTarget) * 100)),
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

    const [periodBookings, previousBookings, allCustomerBookings, satisfactionRows, userNames] =
      await Promise.all([
        prisma.booking.findMany({
          where: periodWhere,
          select: {
            userId: true,
            totalPrice: true,
            status: true,
            paymentStatus: true,
            metadata: true,
            createdAt: true,
            user: { select: { name: true } },
          },
        }),
        prisma.booking.groupBy({
          by: ['userId'],
          where: previousWhere,
        }),
        fetchBookings(baseWhere),
        prisma.partnerReview.groupBy({
          by: ['rating'],
          where:
            context.operatorType === 'tour'
              ? { tourOperatorId: context.tourOperatorId }
              : { experienceOperatorId: context.experienceOperatorId },
          _count: true,
        }),
        prisma.booking.findMany({
          where: periodWhere,
          select: { userId: true, user: { select: { name: true } } },
          distinct: ['userId'],
        }),
      ]);

    const uniqueCustomers = new Set(periodBookings.map((b) => b.userId));
    const previousUnique = previousBookings.length;
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

    const nameByUser = new Map(userNames.map((b) => [b.userId, b.user.name || 'İsimsiz Müşteri']));

    const spendByUser = new Map<
      string,
      { bookings: number; spent: number; lastBooking: Date; name: string }
    >();

    for (const booking of periodBookings) {
      if (!isSaleBooking(booking.status, booking.paymentStatus)) continue;

      const netAmount = booking.totalPrice - getRefundAmount(booking);
      const existing = spendByUser.get(booking.userId) || {
        bookings: 0,
        spent: 0,
        lastBooking: booking.createdAt,
        name: booking.user.name || nameByUser.get(booking.userId) || 'İsimsiz Müşteri',
      };
      existing.bookings += 1;
      existing.spent += netAmount;
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

    const saleBookings = allCustomerBookings.filter((b) =>
      isSaleBooking(b.status, b.paymentStatus)
    );
    const totalSpent = saleBookings.reduce(
      (sum, b) => sum + b.totalPrice - getRefundAmount(b),
      0
    );
    const allUnique = new Set(saleBookings.map((b) => b.userId)).size;
    const clv = allUnique > 0 ? totalSpent / allUnique : 0;

    const totalReviews = satisfactionRows.reduce((sum, r) => sum + r._count, 0);
    const satisfactionDistribution =
      totalReviews > 0
        ? [5, 4, 3, 2, 1].map((rating) => {
            const count = satisfactionRows.find((r) => r.rating === rating)?._count || 0;
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
