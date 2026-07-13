import { BookingStatus, PaymentStatus, Prisma } from '@prisma/client';

export const PENDING_STATUSES: BookingStatus[] = [
  BookingStatus.PENDING,
  BookingStatus.PENDING_PAYMENT,
];

export const SALE_BOOKING_STATUSES: BookingStatus[] = [
  BookingStatus.CONFIRMED,
  BookingStatus.COMPLETED,
];

export function isSaleBooking(
  status: BookingStatus,
  paymentStatus: PaymentStatus
): boolean {
  return (
    SALE_BOOKING_STATUSES.includes(status) &&
    paymentStatus === PaymentStatus.PAID
  );
}

export function isPendingReservation(status: BookingStatus): boolean {
  return PENDING_STATUSES.includes(status);
}

export function isCompletedTour(status: BookingStatus): boolean {
  return status === BookingStatus.COMPLETED;
}

export function getRefundAmount(booking: {
  totalPrice: number;
  paymentStatus: PaymentStatus;
  metadata: Prisma.JsonValue | null;
}): number {
  if (booking.paymentStatus === PaymentStatus.REFUNDED) {
    return booking.totalPrice;
  }

  if (!booking.metadata || typeof booking.metadata !== 'object' || Array.isArray(booking.metadata)) {
    return 0;
  }

  const meta = booking.metadata as Record<string, unknown>;
  const partial = meta.refundAmount ?? meta.refundedAmount;
  if (typeof partial === 'number' && partial > 0) {
    return Math.min(partial, booking.totalPrice);
  }

  return 0;
}

export function saleWhere(base: Prisma.BookingWhereInput): Prisma.BookingWhereInput {
  return {
    ...base,
    status: { in: SALE_BOOKING_STATUSES },
    paymentStatus: PaymentStatus.PAID,
  };
}

export function pendingWhere(base: Prisma.BookingWhereInput): Prisma.BookingWhereInput {
  return {
    ...base,
    status: { in: PENDING_STATUSES },
  };
}
