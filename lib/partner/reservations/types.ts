import { BookingStatus } from '@prisma/client';

export interface ReservationFilters {
  search?: string;
  status?: string;
  payment?: string;
  sort?: 'asc' | 'desc';
}

export interface ReservationContactInfo {
  email: string;
  phone: string;
}

export interface SpecialConditionRow {
  category: string;
  detail: string;
}

export interface PartnerReservation {
  id: string;
  referenceNumber: string;
  customerName: string;
  tourName: string;
  date: string;
  participants: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  paymentLabel: string;
  contactInfo: ReservationContactInfo;
  notes?: string | null;
  specialConditions: string[];
  specialConditionsDetail: SpecialConditionRow[];
}

export type PartnerReservationStatusUpdate = Extract<
  BookingStatus,
  'CONFIRMED' | 'CANCELLED' | 'SUSPENDED'
>;

export interface PartnerReservationsProvider {
  list(
    context: {
      operatorId: string;
      operatorType: 'tour' | 'experience';
      userId?: string;
    },
    filters: ReservationFilters
  ): Promise<PartnerReservation[]>;

  updateStatus(
    context: {
      operatorId: string;
      operatorType: 'tour' | 'experience';
      userId?: string;
    },
    bookingId: string,
    status: PartnerReservationStatusUpdate
  ): Promise<PartnerReservation | null>;
}
