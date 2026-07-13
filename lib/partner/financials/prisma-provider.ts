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
  getRefundAmount,
  isCompletedTour,
  isPendingReservation,
  isSaleBooking,
  saleWhere,
} from './booking-rules';
import {
  FinancialDateRangeId,
  FinancialTransaction,
  FinancialTransactionType,
  PartnerFinancialsContext,
  PartnerFinancialsData,
  PartnerFinancialsProvider,
} from './types';

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
  paymentStatus: PaymentStatus,
  refundAmount: number
): FinancialTransactionType {
  if (paymentStatus === PaymentStatus.REFUNDED || refundAmount > 0) return 'iade';
  if (isPendingReservation(status)) return 'beklemede';
  if (isSaleBooking(status, paymentStatus)) return 'ödeme';
  return 'beklemede';
}

function mapTransactionStatus(
  status: BookingStatus,
  paymentStatus: PaymentStatus,
  refundAmount: number
): FinancialTransaction['status'] {
  if (
    status === BookingStatus.CANCELLED ||
    paymentStatus === PaymentStatus.REFUNDED ||
    refundAmount > 0
  ) {
    return 'iptal';
  }
  if (isPendingReservation(status)) return 'beklemede';
  if (isSaleBooking(status, paymentStatus)) return 'tamamlandı';
  return 'beklemede';
}

function formatPaymentMethodLabel(method: string | null): string {
  if (!method) return 'Belirtilmemiş';
  const labels: Record<string, string> = {
    credit_card: 'Kredi Kartı',
    card: 'Banka & Kredi Kartı',
    bank_transfer: 'Banka Havalesi',
    havale: 'Havale / EFT',
    cash: 'Nakit',
    paypal: 'PayPal',
  };
  return labels[method.toLowerCase()] || method;
}

type PeriodSummary = {
  grossSales: number;
  refundTotal: number;
  totalRevenue: number;
  pendingPayments: number;
  pendingTransactionCount: number;
  paidTransactionCount: number;
  completedToursCount: number;
};

function summarizeBookings(
  bookings: {
    totalPrice: number;
    status: BookingStatus;
    paymentStatus: PaymentStatus;
    metadata: Prisma.JsonValue | null;
  }[]
): PeriodSummary {
  let grossSales = 0;
  let refundTotal = 0;
  let pendingPayments = 0;
  let pendingTransactionCount = 0;
  let paidTransactionCount = 0;
  let completedToursCount = 0;

  for (const booking of bookings) {
    const refundAmount = getRefundAmount(booking);

    if (isPendingReservation(booking.status)) {
      pendingPayments += booking.totalPrice;
      pendingTransactionCount += 1;
    }

    if (isCompletedTour(booking.status)) {
      completedToursCount += 1;
    }

    if (isSaleBooking(booking.status, booking.paymentStatus)) {
      grossSales += booking.totalPrice;
      paidTransactionCount += 1;
    }

    if (refundAmount > 0) {
      refundTotal += refundAmount;
    }
  }

  return {
    grossSales,
    refundTotal,
    totalRevenue: grossSales - refundTotal,
    pendingPayments,
    pendingTransactionCount,
    paidTransactionCount,
    completedToursCount,
  };
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

    const bookingSelect = {
      id: true,
      totalPrice: true,
      status: true,
      paymentStatus: true,
      paymentMethod: true,
      metadata: true,
      createdAt: true,
      user: { select: { name: true } },
      tour: { select: { name: true } },
      experience: { select: { title: true } },
    } satisfies Prisma.BookingSelect;

    const [
      periodBookings,
      previousBookings,
      chartBookings,
    ] = await Promise.all([
      prisma.booking.findMany({
        where: periodWhere,
        select: bookingSelect,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.booking.findMany({
        where: previousWhere,
        select: {
          totalPrice: true,
          status: true,
          paymentStatus: true,
          metadata: true,
        },
      }),
      prisma.booking.findMany({
        where: saleWhere(baseWhere),
        select: { startDate: true, totalPrice: true },
      }),
    ]);

    const summary = summarizeBookings(periodBookings);
    const previousSummary = summarizeBookings(previousBookings);
    const compared = percentChange(summary.totalRevenue, previousSummary.totalRevenue);
    const netProfitChange = percentChange(summary.totalRevenue, previousSummary.totalRevenue);

    const paymentMethodMap = new Map<string, { count: number; amount: number }>();
    for (const booking of periodBookings) {
      if (!isSaleBooking(booking.status, booking.paymentStatus)) continue;

      const method = formatPaymentMethodLabel(booking.paymentMethod);
      const refundAmount = getRefundAmount(booking);
      const existing = paymentMethodMap.get(method) || { count: 0, amount: 0 };
      existing.count += 1;
      existing.amount += booking.totalPrice - refundAmount;
      paymentMethodMap.set(method, existing);
    }

    const transactions: FinancialTransaction[] = periodBookings.slice(0, 50).map((booking) => {
      const refundAmount = getRefundAmount(booking);
      const type = mapTransactionType(booking.status, booking.paymentStatus, refundAmount);
      const signedAmount =
        type === 'iade'
          ? -refundAmount
          : isSaleBooking(booking.status, booking.paymentStatus)
            ? booking.totalPrice
            : booking.totalPrice;

      return {
        id: booking.id,
        date: formatTurkishDate(booking.createdAt),
        type,
        amount: signedAmount,
        status: mapTransactionStatus(booking.status, booking.paymentStatus, refundAmount),
        customer: booking.user.name || 'İsimsiz Müşteri',
        tourName:
          booking.tour?.name || booking.experience?.title || 'Belirtilmemiş',
      };
    });

    const revenueChart: RevenueChartData = {
      week: groupRevenueByPeriod(chartBookings, 'week', now),
      month: groupRevenueByPeriod(chartBookings, 'month', now),
      year: groupRevenueByPeriod(chartBookings, 'year', now),
    };

    const paymentMethods = Array.from(paymentMethodMap.entries()).map(([method, stats]) => ({
      method,
      count: stats.count,
      amount: stats.amount,
    }));

    return {
      summary: {
        totalRevenue: summary.totalRevenue,
        grossSales: summary.grossSales,
        refundTotal: summary.refundTotal,
        pendingPayments: summary.pendingPayments,
        totalPayouts: summary.grossSales,
        netProfit: summary.totalRevenue,
        comparedToLastPeriod: compared,
        increase: compared === null ? null : compared >= 0,
        pendingTransactionCount: summary.pendingTransactionCount,
        completedTransactionCount: summary.paidTransactionCount,
        completedToursCount: summary.completedToursCount,
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
