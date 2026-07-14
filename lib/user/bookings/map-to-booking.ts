import { Booking } from '@/app/types';
import { UserBooking } from './types';
import { extractBookingSpecialConditions } from './special-conditions';

/** API yanıtını mevcut BookingCard / modal bileşenlerinin beklediği tipe dönüştürür. */
export function mapUserBookingToBooking(userBooking: UserBooking, userId: string): Booking {
  const specialConditionsSummary =
    userBooking.specialConditionsSummary ??
    extractBookingSpecialConditions({
      metadata: userBooking.metadata,
      specialRequests: userBooking.specialRequests,
    });

  return {
    id: userBooking.id,
    bookingNumber: userBooking.bookingNumber,
    startDate: new Date(userBooking.startDate),
    endDate: new Date(userBooking.endDate),
    adults: userBooking.adults,
    children: userBooking.children,
    totalPrice: userBooking.totalPrice,
    status: userBooking.status,
    paymentStatus: userBooking.paymentStatus,
    specialRequests: userBooking.specialRequests ?? undefined,
    metadata: userBooking.metadata,
    specialConditionsSummary:
      specialConditionsSummary.length > 0 ? specialConditionsSummary : undefined,
    createdAt: userBooking.createdAt ? new Date(userBooking.createdAt) : new Date(userBooking.startDate),
    updatedAt: userBooking.updatedAt ? new Date(userBooking.updatedAt) : new Date(userBooking.startDate),
    userId,
    hotelId: userBooking.hotelId ?? undefined,
    tourId: userBooking.tourId ?? undefined,
    experienceId: userBooking.experienceId ?? undefined,
    productTitle: userBooking.productTitle ?? undefined,
    operatorName: userBooking.operatorName ?? undefined,
    fromLocation: userBooking.fromLocation ?? undefined,
    toLocation: userBooking.toLocation ?? undefined,
    routeLabel: userBooking.routeLabel ?? undefined,
  };
}
