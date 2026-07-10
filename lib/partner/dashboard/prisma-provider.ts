import { BookingStatus, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { translateReservationStatus } from '@/lib/partner/reservations/labels';
import {
  PartnerDashboardContext,
  PartnerDashboardData,
  PartnerDashboardProvider,
  RecentReservationItem,
} from './types';
import {
  addDays,
  addMonths,
  endOfMonth,
  extractLocation,
  formatAbsoluteTrend,
  formatPercentTrend,
  formatRatingTrend,
  formatTurkishCurrency,
  formatTurkishDate,
  formatTurkishTime,
  getInitials,
  groupRevenueByPeriod,
  startOfDay,
  startOfMonth,
} from './utils';

const REVENUE_STATUSES: BookingStatus[] = [BookingStatus.CONFIRMED, BookingStatus.COMPLETED];
const PENDING_STATUSES: BookingStatus[] = [BookingStatus.PENDING, BookingStatus.PENDING_PAYMENT];

function tourBookingWhere(tourOperatorId: string): Prisma.BookingWhereInput {
  return { tourOperatorId };
}

function experienceBookingWhere(userId: string): Prisma.BookingWhereInput {
  return { experience: { userId } };
}

function bookingsInRange(
  baseWhere: Prisma.BookingWhereInput,
  start: Date,
  end: Date
): Prisma.BookingWhereInput {
  return {
    ...baseWhere,
    createdAt: { gte: start, lte: end },
  };
}

function mapStatusToDisplay(
  status: BookingStatus
): RecentReservationItem['status'] {
  const translated = translateReservationStatus(status.toLowerCase());
  return translated as RecentReservationItem['status'];
}

export class PrismaPartnerDashboardProvider implements PartnerDashboardProvider {
  async getDashboard(context: PartnerDashboardContext): Promise<PartnerDashboardData> {
    if (context.operatorType === 'tour') {
      return this.getTourOperatorDashboard(context.tourOperatorId);
    }
    return this.getExperienceOperatorDashboard(context.experienceOperatorId, context.userId);
  }

  private async getTourOperatorDashboard(tourOperatorId: string): Promise<PartnerDashboardData> {
    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const lastMonthStart = startOfMonth(addMonths(now, -1));
    const lastMonthEnd = endOfMonth(addMonths(now, -1));
    const sevenDaysAgo = addDays(now, -7);
    const baseWhere = tourBookingWhere(tourOperatorId);

    const operator = await prisma.tourOperator.findUnique({
      where: { id: tourOperatorId },
      select: { rating: true, reviewCount: true },
    });

    const [
      totalTours,
      totalBookings,
      totalRevenueAgg,
      totalCustomers,
      upcomingTours,
      recentBookings,
      popularToursRaw,
      reservationStatusRaw,
      revenueBookings,
      toursThisMonth,
      toursLastMonth,
      bookingsThisMonth,
      bookingsLastMonth,
      revenueThisMonth,
      revenueLastMonth,
      customersThisMonth,
      customersLastMonth,
      upcomingNow,
      upcomingSevenDaysAgo,
      reviewsThisMonth,
      reviewsLastMonth,
    ] = await Promise.all([
      prisma.tour.count({ where: { tourOperatorId } }),
      prisma.booking.count({ where: baseWhere }),
      prisma.booking.aggregate({
        where: { ...baseWhere, status: { in: REVENUE_STATUSES } },
        _sum: { totalPrice: true },
      }),
      prisma.booking.groupBy({ by: ['userId'], where: baseWhere }).then((r) => r.length),
      prisma.tourDate.count({
        where: { startDate: { gt: now }, tour: { tourOperatorId } },
      }),
      prisma.booking.findMany({
        where: baseWhere,
        include: {
          user: { select: { name: true, email: true } },
          tour: { select: { name: true, duration: true, tourType: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.tour.findMany({
        where: { tourOperatorId },
        include: {
          _count: { select: { bookings: true } },
          bookings: {
            select: { adults: true, children: true },
            where: { status: { in: REVENUE_STATUSES } },
          },
        },
        orderBy: { bookings: { _count: 'desc' } },
        take: 4,
      }),
      prisma.booking.groupBy({
        by: ['status'],
        where: baseWhere,
        _count: true,
      }),
      prisma.booking.findMany({
        where: { ...baseWhere, status: { in: REVENUE_STATUSES } },
        select: { startDate: true, totalPrice: true },
      }),
      prisma.tour.count({
        where: { tourOperatorId, createdAt: { gte: thisMonthStart } },
      }),
      prisma.tour.count({
        where: {
          tourOperatorId,
          createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
        },
      }),
      prisma.booking.count({
        where: bookingsInRange(baseWhere, thisMonthStart, now),
      }),
      prisma.booking.count({
        where: bookingsInRange(baseWhere, lastMonthStart, lastMonthEnd),
      }),
      prisma.booking.aggregate({
        where: {
          ...bookingsInRange(baseWhere, thisMonthStart, now),
          status: { in: REVENUE_STATUSES },
        },
        _sum: { totalPrice: true },
      }),
      prisma.booking.aggregate({
        where: {
          ...bookingsInRange(baseWhere, lastMonthStart, lastMonthEnd),
          status: { in: REVENUE_STATUSES },
        },
        _sum: { totalPrice: true },
      }),
      prisma.booking
        .groupBy({
          by: ['userId'],
          where: bookingsInRange(baseWhere, thisMonthStart, now),
        })
        .then((r) => r.length),
      prisma.booking
        .groupBy({
          by: ['userId'],
          where: bookingsInRange(baseWhere, lastMonthStart, lastMonthEnd),
        })
        .then((r) => r.length),
      prisma.tourDate.count({
        where: { startDate: { gt: now }, tour: { tourOperatorId } },
      }),
      prisma.tourDate.count({
        where: {
          startDate: { gt: sevenDaysAgo },
          createdAt: { lte: sevenDaysAgo },
          tour: { tourOperatorId },
        },
      }),
      prisma.partnerReview.aggregate({
        where: {
          tourOperatorId,
          createdAt: { gte: thisMonthStart },
        },
        _avg: { rating: true },
        _count: true,
      }),
      prisma.partnerReview.aggregate({
        where: {
          tourOperatorId,
          createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
        },
        _avg: { rating: true },
        _count: true,
      }),
    ]);

    return this.buildDashboardResponse({
      stats: {
        totalTours,
        totalBookings,
        totalRevenue: totalRevenueAgg._sum.totalPrice || 0,
        totalCustomers,
        averageRating: operator?.rating ?? 0,
        upcomingTours,
      },
      trends: {
        totalTours: formatPercentTrend(toursThisMonth, toursLastMonth),
        totalBookings: formatPercentTrend(bookingsThisMonth, bookingsLastMonth),
        totalRevenue: formatPercentTrend(
          revenueThisMonth._sum.totalPrice || 0,
          revenueLastMonth._sum.totalPrice || 0
        ),
        totalCustomers: formatPercentTrend(customersThisMonth, customersLastMonth),
        averageRating:
          reviewsThisMonth._count > 0 || reviewsLastMonth._count > 0
            ? formatRatingTrend(
                reviewsThisMonth._avg.rating || 0,
                reviewsLastMonth._avg.rating || 0
              )
            : undefined,
        upcomingTours: formatAbsoluteTrend(upcomingNow, upcomingSevenDaysAgo, 'Geçen haftaya göre'),
      },
      recentReservations: recentBookings.map((b) => this.mapRecentBooking(b)),
      popularTours: await this.mapPopularTours(
        popularToursRaw.map((t) => ({
          id: t.id,
          title: t.name,
          location: extractLocation(t.destinations, t.departureCity),
          rating: t.rating ?? 0,
          reservationCount: t._count.bookings,
          guestCount: t.bookings.reduce((sum, b) => sum + b.adults + b.children, 0),
          price: t.price,
          image:
            Array.isArray(t.images) && t.images.length > 0
              ? String(t.images[0])
              : '/images/placeholder.jpg',
        })),
        'tour'
      ),
      reservationStatus: this.formatReservationStatus(reservationStatusRaw),
      revenueChart: {
        week: groupRevenueByPeriod(revenueBookings, 'week', now),
        month: groupRevenueByPeriod(revenueBookings, 'month', now),
        year: groupRevenueByPeriod(revenueBookings, 'year', now),
      },
    });
  }

  private async getExperienceOperatorDashboard(
    experienceOperatorId: string,
    userId: string
  ): Promise<PartnerDashboardData> {
    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const lastMonthStart = startOfMonth(addMonths(now, -1));
    const lastMonthEnd = endOfMonth(addMonths(now, -1));
    const sevenDaysAgo = addDays(now, -7);
    const baseWhere = experienceBookingWhere(userId);

    const operator = await prisma.experienceOperator.findUnique({
      where: { id: experienceOperatorId },
      select: { rating: true, reviewCount: true },
    });

    const [
      totalExperiences,
      totalBookings,
      totalRevenueAgg,
      totalCustomers,
      upcomingActivities,
      recentBookings,
      popularExperiencesRaw,
      reservationStatusRaw,
      revenueBookings,
      experiencesThisMonth,
      experiencesLastMonth,
      bookingsThisMonth,
      bookingsLastMonth,
      revenueThisMonth,
      revenueLastMonth,
      customersThisMonth,
      customersLastMonth,
      upcomingNow,
      upcomingSevenDaysAgo,
      reviewsThisMonth,
      reviewsLastMonth,
    ] = await Promise.all([
      prisma.experience.count({ where: { userId } }),
      prisma.booking.count({ where: baseWhere }),
      prisma.booking.aggregate({
        where: { ...baseWhere, status: { in: REVENUE_STATUSES } },
        _sum: { totalPrice: true },
      }),
      prisma.booking.groupBy({ by: ['userId'], where: baseWhere }).then((r) => r.length),
      prisma.activityDate.count({
        where: { startDate: { gt: now }, experience: { userId } },
      }),
      prisma.booking.findMany({
        where: baseWhere,
        include: {
          user: { select: { name: true, email: true } },
          experience: { select: { title: true, category: true, duration: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.experience.findMany({
        where: { userId },
        include: {
          _count: { select: { bookings: true } },
          bookings: {
            select: { adults: true, children: true },
            where: { status: { in: REVENUE_STATUSES } },
          },
        },
        orderBy: { bookings: { _count: 'desc' } },
        take: 4,
      }),
      prisma.booking.groupBy({
        by: ['status'],
        where: baseWhere,
        _count: true,
      }),
      prisma.booking.findMany({
        where: { ...baseWhere, status: { in: REVENUE_STATUSES } },
        select: { startDate: true, totalPrice: true },
      }),
      prisma.experience.count({
        where: { userId, createdAt: { gte: thisMonthStart } },
      }),
      prisma.experience.count({
        where: {
          userId,
          createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
        },
      }),
      prisma.booking.count({
        where: bookingsInRange(baseWhere, thisMonthStart, now),
      }),
      prisma.booking.count({
        where: bookingsInRange(baseWhere, lastMonthStart, lastMonthEnd),
      }),
      prisma.booking.aggregate({
        where: {
          ...bookingsInRange(baseWhere, thisMonthStart, now),
          status: { in: REVENUE_STATUSES },
        },
        _sum: { totalPrice: true },
      }),
      prisma.booking.aggregate({
        where: {
          ...bookingsInRange(baseWhere, lastMonthStart, lastMonthEnd),
          status: { in: REVENUE_STATUSES },
        },
        _sum: { totalPrice: true },
      }),
      prisma.booking
        .groupBy({
          by: ['userId'],
          where: bookingsInRange(baseWhere, thisMonthStart, now),
        })
        .then((r) => r.length),
      prisma.booking
        .groupBy({
          by: ['userId'],
          where: bookingsInRange(baseWhere, lastMonthStart, lastMonthEnd),
        })
        .then((r) => r.length),
      prisma.activityDate.count({
        where: { startDate: { gt: now }, experience: { userId } },
      }),
      prisma.activityDate.count({
        where: {
          startDate: { gt: sevenDaysAgo },
          createdAt: { lte: sevenDaysAgo },
          experience: { userId },
        },
      }),
      prisma.partnerReview.aggregate({
        where: {
          experienceOperatorId,
          createdAt: { gte: thisMonthStart },
        },
        _avg: { rating: true },
        _count: true,
      }),
      prisma.partnerReview.aggregate({
        where: {
          experienceOperatorId,
          createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
        },
        _avg: { rating: true },
        _count: true,
      }),
    ]);

    return this.buildDashboardResponse({
      stats: {
        totalTours: totalExperiences,
        totalBookings,
        totalRevenue: totalRevenueAgg._sum.totalPrice || 0,
        totalCustomers,
        averageRating: operator?.rating ?? 0,
        upcomingTours: upcomingActivities,
      },
      trends: {
        totalTours: formatPercentTrend(experiencesThisMonth, experiencesLastMonth),
        totalBookings: formatPercentTrend(bookingsThisMonth, bookingsLastMonth),
        totalRevenue: formatPercentTrend(
          revenueThisMonth._sum.totalPrice || 0,
          revenueLastMonth._sum.totalPrice || 0
        ),
        totalCustomers: formatPercentTrend(customersThisMonth, customersLastMonth),
        averageRating:
          reviewsThisMonth._count > 0 || reviewsLastMonth._count > 0
            ? formatRatingTrend(
                reviewsThisMonth._avg.rating || 0,
                reviewsLastMonth._avg.rating || 0
              )
            : undefined,
        upcomingTours: formatAbsoluteTrend(upcomingNow, upcomingSevenDaysAgo, 'Geçen haftaya göre'),
      },
      recentReservations: recentBookings.map((b) => this.mapRecentBooking(b)),
      popularTours: await this.mapPopularTours(
        popularExperiencesRaw.map((e) => ({
          id: e.id,
          title: e.title,
          location: e.location || 'Belirtilmemiş',
          rating: e.rating ?? 0,
          reservationCount: e._count.bookings,
          guestCount: e.bookings.reduce((sum, b) => sum + b.adults + b.children, 0),
          price: e.price,
          image: e.imageUrl || '/images/placeholder.jpg',
        })),
        'experience'
      ),
      reservationStatus: this.formatReservationStatus(reservationStatusRaw),
      revenueChart: {
        week: groupRevenueByPeriod(revenueBookings, 'week', now),
        month: groupRevenueByPeriod(revenueBookings, 'month', now),
        year: groupRevenueByPeriod(revenueBookings, 'year', now),
      },
    });
  }

  private mapRecentBooking(
    booking: {
      id: string;
      startDate: Date;
      totalPrice: number;
      status: BookingStatus;
      user: { name: string | null; email: string };
      tour?: { name: string; duration: number; tourType: string | null } | null;
      experience?: { title: string; category: string; duration: string } | null;
    }
  ): RecentReservationItem {
    const activity = booking.tour?.name || booking.experience?.title || 'Belirtilmemiş';
    const activityType =
      booking.tour?.tourType ||
      booking.experience?.category ||
      (booking.tour
        ? `${booking.tour.duration} gün`
        : booking.experience?.duration || '');

    return {
      id: booking.id,
      customerName: booking.user.name || 'İsimsiz Müşteri',
      customerEmail: booking.user.email,
      customerInitials: getInitials(booking.user.name),
      activity,
      activityType: String(activityType),
      date: formatTurkishDate(booking.startDate),
      time: formatTurkishTime(booking.startDate),
      amount: formatTurkishCurrency(booking.totalPrice),
      status: mapStatusToDisplay(booking.status),
    };
  }

  private formatReservationStatus(
    rows: { status: BookingStatus; _count: number }[]
  ) {
    const countFor = (...statuses: BookingStatus[]) =>
      rows
        .filter((r) => statuses.includes(r.status))
        .reduce((sum, r) => sum + r._count, 0);

    return {
      pending: countFor(...PENDING_STATUSES),
      confirmed: countFor(BookingStatus.CONFIRMED),
      cancelled: countFor(BookingStatus.CANCELLED),
      completed: countFor(BookingStatus.COMPLETED),
    };
  }

  private buildDashboardResponse(data: PartnerDashboardData): PartnerDashboardData {
    return data;
  }

  private async mapPopularTours(
    items: {
      id: string;
      title: string;
      location: string;
      rating: number;
      reservationCount: number;
      guestCount: number;
      price: number;
      image: string;
    }[],
    kind: 'tour' | 'experience'
  ) {
    const ids = items.map((item) => item.id);
    const reviewCounts = new Map<string, number>();

    if (ids.length > 0) {
      const reviews = await prisma.partnerReview.findMany({
        where:
          kind === 'tour'
            ? { booking: { tourId: { in: ids } } }
            : { booking: { experienceId: { in: ids } } },
        select: {
          booking: {
            select: {
              tourId: true,
              experienceId: true,
            },
          },
        },
      });

      for (const review of reviews) {
        const key = kind === 'tour' ? review.booking.tourId : review.booking.experienceId;
        if (!key) continue;
        reviewCounts.set(key, (reviewCounts.get(key) || 0) + 1);
      }
    }

    return items.map((item) => ({
      id: item.id,
      title: item.title,
      location: item.location,
      rating: item.rating,
      reviewCount: reviewCounts.get(item.id) || 0,
      reservationCount: item.reservationCount,
      guestCount: item.guestCount,
      price: formatTurkishCurrency(item.price),
      image: item.image,
    }));
  }
}

export const prismaPartnerDashboardProvider = new PrismaPartnerDashboardProvider();
