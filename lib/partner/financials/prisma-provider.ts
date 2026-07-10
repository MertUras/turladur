import { BookingStatus, PaymentStatus, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { RevenueChartData } from '@/lib/partner/dashboard';
import {
  addDays,
  addMonths,
  endOfMonth,
  formatTurkishDate,
  groupRevenueByPeriod,
  startOfDay,
  startOfMonth,
} from '@/lib/partner/dashboard/utils';
import {
  FinancialDateRangeId,
  FinancialTransaction,
  FinancialTransactionType,
  PartnerFinancialsContext,
  PartnerFinancialsData,
  PartnerFinancialsProvider,
} from './types';

const REVENUE_STATUSES: BookingStatus[] = [BookingStatus.CONFIRMED, BookingStatus.COMPLETED];
const PENDING_STATUSES: BookingStatus[] = [BookingStatus.PENDING, BookingStatus.PENDING_PAYMENT];

function percentChange(current: number, previous: number): number | null {
  if (current === 0 && previous === 0) return null;
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

function resolveDateRange(id: FinancialDateRangeId, now = new Date()) {
  const today = startOfDay(now);
  const endOfToday = new Date(today);
  endOfToday.setHours(23, 59, 59, 999);

  const ranges: Record<
    FinancialDateRangeId,
    { start: Date; end: Date; previousStart: Date; previousEnd: Date }
  > = {
    thisWeek: {
      start: addDays(today, -today.getDay() + 1),
      end: endOfToday,
      previousStart: addDays(addDays(today, -today.getDay() + 1), -7),
      previousEnd: addDays(addDays(today, -today.getDay()), -1),
    },
    thisMonth: {
      start: startOfMonth(today),
      end: endOfToday,
      previousStart: startOfMonth(addMonths(today, -1)),
      previousEnd: endOfMonth(addMonths(today, -1)),
    },
    lastMonth: {
      start: startOfMonth(addMonths(today, -1)),
      end: endOfMonth(addMonths(today, -1)),
      previousStart: startOfMonth(addMonths(today, -2)),
      previousEnd: endOfMonth(addMonths(today, -2)),
    },
    last3Months: {
      start: startOfMonth(addMonths(today, -2)),
      end: endOfToday,
      previousStart: startOfMonth(addMonths(today, -5)),
      previousEnd: endOfMonth(addMonths(today, -3)),
    },
    thisYear: {
      start: new Date(today.getFullYear(), 0, 1),
      end: endOfToday,
      previousStart: new Date(today.getFullYear() - 1, 0, 1),
      previousEnd: new Date(today.getFullYear() - 1, 11, 31, 23, 59, 59, 999),
    },
  };

  return ranges[id];
}

function bookingWhere(context: PartnerFinancialsContext): Prisma.BookingWhereInput {
  return context.operatorType === 'tour'
    ? { tourOperatorId: context.tourOperatorId }
    : { experience: { userId: context.userId } };
}

function inPeriod(
  base: Prisma.BookingWhereInput,
  start: Date,
  end: Date
): Prisma.BookingWhereInput {
  return { ...base, createdAt: { gte: start, lte: end } };
}

function mapTransactionType(
  status: BookingStatus,
  paymentStatus: PaymentStatus
): FinancialTransactionType {
  if (paymentStatus === PaymentStatus.REFUNDED) return 'iade';
  if (PENDING_STATUSES.includes(status)) return 'beklemede';
  return 'ödeme';
}

function mapTransactionStatus(
  status: BookingStatus,
  paymentStatus: PaymentStatus
): FinancialTransaction['status'] {
  if (status === BookingStatus.CANCELLED || paymentStatus === PaymentStatus.REFUNDED) {
    return 'iptal';
  }
  if (PENDING_STATUSES.includes(status)) return 'beklemede';
  if (REVENUE_STATUSES.includes(status)) return 'tamamlandı';
  return 'beklemede';
}

function formatPaymentMethodLabel(method: string | null): string {
  if (!method) return 'Belirtilmemiş';
  const labels: Record<string, string> = {
    credit_card: 'Kredi Kartı',
    bank_transfer: 'Banka Havalesi',
    cash: 'Nakit',
    paypal: 'PayPal',
  };
  return labels[method.toLowerCase()] || method;
}

export class PrismaPartnerFinancialsProvider implements PartnerFinancialsProvider {
  async getFinancials(
    context: PartnerFinancialsContext,
    dateRangeId: FinancialDateRangeId
  ): Promise<PartnerFinancialsData> {
    const now = new Date();
    const dateRange = resolveDateRange(dateRangeId, now);
    const baseWhere = bookingWhere(context);
    const periodWhere = inPeriod(baseWhere, dateRange.start, dateRange.end);
    const previousWhere = inPeriod(baseWhere, dateRange.previousStart, dateRange.previousEnd);

    const revenueWhere = { ...periodWhere, status: { in: REVENUE_STATUSES } };
    const previousRevenueWhere = { ...previousWhere, status: { in: REVENUE_STATUSES } };

    const [
      periodRevenue,
      previousRevenue,
      pendingAgg,
      pendingCount,
      payoutsAgg,
      completedCount,
      refundsAgg,
      periodBookings,
      allRevenueBookings,
      paymentMethodGroups,
    ] = await Promise.all([
      prisma.booking.aggregate({ where: revenueWhere, _sum: { totalPrice: true } }),
      prisma.booking.aggregate({ where: previousRevenueWhere, _sum: { totalPrice: true } }),
      prisma.booking.aggregate({
        where: {
          ...periodWhere,
          status: { in: PENDING_STATUSES },
        },
        _sum: { totalPrice: true },
      }),
      prisma.booking.count({
        where: {
          ...periodWhere,
          status: { in: PENDING_STATUSES },
        },
      }),
      prisma.booking.aggregate({
        where: revenueWhere,
        _sum: { totalPrice: true },
      }),
      prisma.booking.count({
        where: revenueWhere,
      }),
      prisma.booking.aggregate({
        where: {
          ...periodWhere,
          paymentStatus: PaymentStatus.REFUNDED,
        },
        _sum: { totalPrice: true },
      }),
      prisma.booking.findMany({
        where: periodWhere,
        include: {
          user: { select: { name: true } },
          tour: { select: { name: true } },
          experience: { select: { title: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      prisma.booking.findMany({
        where: { ...baseWhere, status: { in: REVENUE_STATUSES } },
        select: { startDate: true, totalPrice: true },
      }),
      prisma.booking.groupBy({
        by: ['paymentMethod'],
        where: revenueWhere,
        _count: true,
        _sum: { totalPrice: true },
      }),
    ]);

    const totalRevenue = periodRevenue._sum.totalPrice || 0;
    const previousTotal = previousRevenue._sum.totalPrice || 0;
    const refunds = refundsAgg._sum.totalPrice || 0;
    const compared = percentChange(totalRevenue, previousTotal);
    const netProfit = totalRevenue - refunds;
    const previousNet = (previousRevenue._sum.totalPrice || 0);
    const netProfitChange = percentChange(netProfit, previousNet);

    const transactions: FinancialTransaction[] = periodBookings.map((booking) => {
      const type = mapTransactionType(booking.status, booking.paymentStatus);
      const amount =
        type === 'iade' ? -booking.totalPrice : booking.totalPrice;

      return {
        id: booking.id,
        date: formatTurkishDate(booking.createdAt),
        type,
        amount,
        status: mapTransactionStatus(booking.status, booking.paymentStatus),
        customer: booking.user.name || 'İsimsiz Müşteri',
        tourName:
          booking.tour?.name || booking.experience?.title || 'Belirtilmemiş',
      };
    });

    const revenueChart: RevenueChartData = {
      week: groupRevenueByPeriod(allRevenueBookings, 'week', now),
      month: groupRevenueByPeriod(allRevenueBookings, 'month', now),
      year: groupRevenueByPeriod(allRevenueBookings, 'year', now),
    };

    const paymentMethods = paymentMethodGroups.map((group) => ({
      method: formatPaymentMethodLabel(group.paymentMethod),
      count: group._count,
      amount: group._sum.totalPrice || 0,
    }));

    return {
      summary: {
        totalRevenue,
        pendingPayments: pendingAgg._sum.totalPrice || 0,
        totalPayouts: payoutsAgg._sum.totalPrice || 0,
        netProfit,
        comparedToLastPeriod: compared,
        increase: compared === null ? null : compared >= 0,
        pendingTransactionCount: pendingCount,
        completedTransactionCount: completedCount,
        netProfitChange,
        netProfitIncrease: netProfitChange === null ? null : netProfitChange >= 0,
      },
      transactions,
      revenueChart,
      paymentMethods,
    };
  }
}

export const prismaPartnerFinancialsProvider = new PrismaPartnerFinancialsProvider();
