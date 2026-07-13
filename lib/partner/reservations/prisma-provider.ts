import { BookingStatus, PaymentStatus, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import {
  SpecialConditionsData,
  formatSpecialConditionsSummary,
  formatSpecialConditionsTable,
} from '@/app/lib/special-conditions';
import { formatPaymentLabel } from './labels';
import {
  PartnerReservation,
  PartnerReservationsProvider,
  PartnerReservationStatusUpdate,
  ReservationFilters,
} from './types';

type BookingMetadata = {
  specialConditions?: SpecialConditionsData;
  contact?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
};

type BookingWithRelations = Prisma.BookingGetPayload<{
  include: {
    user: { select: { name: true; email: true; phone: true } };
    tour: { select: { name: true; duration: true } };
    experience: { select: { title: true } };
  };
}>;

function normalizeStatus(status: BookingStatus): string {
  return status.toLowerCase();
}

function normalizePaymentStatus(status: PaymentStatus): string {
  return status === PaymentStatus.PARTIALLY_PAID ? 'partial' : status.toLowerCase();
}

function extractSpecialConditions(
  metadata: Prisma.JsonValue | null,
  specialRequests: string | null
): { summary: string[]; detail: { category: string; detail: string }[] } {
  if (metadata && typeof metadata === 'object' && !Array.isArray(metadata)) {
    const parsed = metadata as BookingMetadata;
    if (parsed.specialConditions) {
      const summary = formatSpecialConditionsSummary(parsed.specialConditions);
      const detail = formatSpecialConditionsTable(parsed.specialConditions);
      if (
        summary.length > 1 ||
        (summary.length === 1 && summary[0] !== 'Özel bir durum belirtilmedi.')
      ) {
        return { summary, detail };
      }
    }
  }

  if (specialRequests?.trim()) {
    const contactMarker = 'İletişim:';
    const contactIdx = specialRequests.indexOf(contactMarker);
    const conditionText =
      contactIdx >= 0
        ? specialRequests.slice(0, contactIdx).replace(/\s*\|\s*$/, '').trim()
        : specialRequests.trim();

    if (conditionText && conditionText !== 'Özel bir durum belirtilmedi.') {
      const summary = conditionText.split(' | ').filter(Boolean);
      return {
        summary,
        detail: summary.map((line) => {
          const colonIdx = line.indexOf(':');
          if (colonIdx > 0) {
            return {
              category: line.slice(0, colonIdx).trim(),
              detail: line.slice(colonIdx + 1).trim(),
            };
          }
          return { category: 'Not', detail: line };
        }),
      };
    }
  }

  return { summary: [], detail: [] };
}

function mapBookingToReservation(booking: BookingWithRelations): PartnerReservation {
  const metadataPhone =
    booking.metadata &&
    typeof booking.metadata === 'object' &&
    !Array.isArray(booking.metadata)
      ? (booking.metadata as BookingMetadata).contact?.phone
      : undefined;

  const paymentStatus = normalizePaymentStatus(booking.paymentStatus);
  const { summary, detail } = extractSpecialConditions(
    booking.metadata,
    booking.specialRequests
  );

  return {
    id: booking.id,
    referenceNumber: booking.bookingNumber,
    customerName: booking.user.name || 'İsimsiz Müşteri',
    tourName:
      booking.tour?.name || booking.experience?.title || 'Belirtilmemiş',
    date: booking.startDate.toISOString(),
    participants: booking.adults + booking.children,
    totalPrice: booking.totalPrice,
    status: normalizeStatus(booking.status),
    paymentStatus,
    paymentMethod: booking.paymentMethod,
    paymentLabel: formatPaymentLabel(booking.paymentMethod, paymentStatus),
    contactInfo: {
      email: booking.user.email,
      phone: metadataPhone || booking.user.phone || '',
    },
    notes: booking.specialRequests,
    specialConditions: summary,
    specialConditionsDetail: detail,
  };
}

function buildWhereClause(
  context: {
    operatorId: string;
    operatorType: 'tour' | 'experience';
    userId?: string;
  },
  filters: ReservationFilters
): Prisma.BookingWhereInput {
  const where: Prisma.BookingWhereInput =
    context.operatorType === 'tour'
      ? { tourOperatorId: context.operatorId }
      : { experience: { userId: context.userId } };

  if (filters.search) {
    where.OR = [
      { bookingNumber: { contains: filters.search, mode: 'insensitive' } },
      { user: { name: { contains: filters.search, mode: 'insensitive' } } },
      { tour: { name: { contains: filters.search, mode: 'insensitive' } } },
      { experience: { title: { contains: filters.search, mode: 'insensitive' } } },
    ];
  }

  if (filters.status && filters.status !== 'all') {
    const statusMap: Record<string, BookingStatus> = {
      pending: BookingStatus.PENDING,
      pending_payment: BookingStatus.PENDING_PAYMENT,
      confirmed: BookingStatus.CONFIRMED,
      suspended: BookingStatus.SUSPENDED,
      cancelled: BookingStatus.CANCELLED,
      completed: BookingStatus.COMPLETED,
    };
    const mapped = statusMap[filters.status.toLowerCase()];
    if (mapped) where.status = mapped;
  }

  if (filters.payment && filters.payment !== 'all') {
    const paymentMap: Record<string, PaymentStatus> = {
      paid: PaymentStatus.PAID,
      partial: PaymentStatus.PARTIALLY_PAID,
      unpaid: PaymentStatus.UNPAID,
      refunded: PaymentStatus.REFUNDED,
    };
    const mapped = paymentMap[filters.payment.toLowerCase()];
    if (mapped) where.paymentStatus = mapped;
  }

  return where;
}

const bookingInclude = {
  user: { select: { name: true, email: true, phone: true } },
  tour: { select: { name: true, duration: true } },
  experience: { select: { title: true } },
} as const;

export class PrismaPartnerReservationsProvider implements PartnerReservationsProvider {
  async list(
    context: {
      operatorId: string;
      operatorType: 'tour' | 'experience';
      userId?: string;
    },
    filters: ReservationFilters
  ): Promise<PartnerReservation[]> {
    const bookings = await prisma.booking.findMany({
      where: buildWhereClause(context, filters),
      include: bookingInclude,
      orderBy: { startDate: filters.sort === 'asc' ? 'asc' : 'desc' },
    });

    return bookings.map(mapBookingToReservation);
  }

  async updateStatus(
    context: {
      operatorId: string;
      operatorType: 'tour' | 'experience';
      userId?: string;
    },
    bookingId: string,
    status: PartnerReservationStatusUpdate
  ): Promise<PartnerReservation | null> {
    const ownershipWhere: Prisma.BookingWhereInput =
      context.operatorType === 'tour'
        ? { id: bookingId, tourOperatorId: context.operatorId }
        : { id: bookingId, experience: { userId: context.userId } };

    const existing = await prisma.booking.findFirst({ where: ownershipWhere });
    if (!existing) return null;

    const updateData: Prisma.BookingUpdateInput = { status };

    if (
      status === BookingStatus.CONFIRMED &&
      (existing.paymentStatus === PaymentStatus.UNPAID ||
        existing.paymentStatus === PaymentStatus.PARTIALLY_PAID)
    ) {
      updateData.paymentStatus = PaymentStatus.PAID;
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
      include: bookingInclude,
    });

    return mapBookingToReservation(updated);
  }
}

export const prismaPartnerReservationsProvider = new PrismaPartnerReservationsProvider();
