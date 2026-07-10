import { BookingStatus, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import {
  formatTurkishCurrency,
  formatTurkishDate,
} from '@/lib/partner/dashboard/utils';
import {
  PartnerCustomer,
  PartnerCustomersContext,
  PartnerCustomersData,
  PartnerCustomersProvider,
} from './types';

const REVENUE_STATUSES: BookingStatus[] = [BookingStatus.CONFIRMED, BookingStatus.COMPLETED];

type BookingMetadata = {
  contact?: {
    phone?: string;
    city?: string;
  };
};

function bookingWhere(context: PartnerCustomersContext): Prisma.BookingWhereInput {
  return context.operatorType === 'tour'
    ? { tourOperatorId: context.tourOperatorId }
    : { experience: { userId: context.userId } };
}

export class PrismaPartnerCustomersProvider implements PartnerCustomersProvider {
  async list(context: PartnerCustomersContext): Promise<PartnerCustomersData> {
    const baseWhere = bookingWhere(context);

    const bookings = await prisma.booking.findMany({
      where: baseWhere,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
          },
        },
        tour: { select: { departureCity: true, destinations: true } },
        experience: { select: { location: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const customerMap = new Map<string, PartnerCustomer>();

    for (const booking of bookings) {
      const userId = booking.userId;
      const isRevenue = REVENUE_STATUSES.includes(booking.status);
      const metadata =
        booking.metadata && typeof booking.metadata === 'object' && !Array.isArray(booking.metadata)
          ? (booking.metadata as BookingMetadata)
          : undefined;

      const location =
        booking.tour?.departureCity ||
        booking.experience?.location ||
        metadata?.contact?.city ||
        'Belirtilmemiş';

      const phone = metadata?.contact?.phone || booking.user.phone || '—';

      const existing = customerMap.get(userId);
      if (!existing) {
        customerMap.set(userId, {
          id: userId,
          name: booking.user.name || 'İsimsiz Müşteri',
          email: booking.user.email,
          phone,
          location,
          totalBookings: 1,
          totalSpent: isRevenue ? booking.totalPrice : 0,
          totalSpentFormatted: formatTurkishCurrency(isRevenue ? booking.totalPrice : 0),
          lastBookingDate: formatTurkishDate(booking.createdAt),
          lastBookingAt: booking.createdAt.toISOString(),
          profileImage: booking.user.image || undefined,
        });
        continue;
      }

      existing.totalBookings += 1;
      if (isRevenue) {
        existing.totalSpent += booking.totalPrice;
        existing.totalSpentFormatted = formatTurkishCurrency(existing.totalSpent);
      }
      if (booking.createdAt > new Date(existing.lastBookingAt)) {
        existing.lastBookingDate = formatTurkishDate(booking.createdAt);
        existing.lastBookingAt = booking.createdAt.toISOString();
      }
      if (existing.phone === '—' && phone !== '—') {
        existing.phone = phone;
      }
      if (existing.location === 'Belirtilmemiş' && location !== 'Belirtilmemiş') {
        existing.location = location;
      }
    }

    const customers = Array.from(customerMap.values()).sort(
      (a, b) => new Date(b.lastBookingAt).getTime() - new Date(a.lastBookingAt).getTime()
    );

    return {
      customers,
      totalCount: customers.length,
    };
  }
}

export const prismaPartnerCustomersProvider = new PrismaPartnerCustomersProvider();
