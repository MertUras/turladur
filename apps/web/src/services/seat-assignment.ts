import { apiRequest } from './api-client';
import type { BusLayoutKindValue } from '@/lib/bus-layout-kinds';

export type SeatCellType =
  'SEAT' | 'CREW' | 'AISLE' | 'WC' | 'BLOCKED' | 'DOOR' | string;

export type SeatOccupancy = {
  assignmentId: string;
  guestId: string;
  fullName: string;
  bookingNumber: string;
  source: string;
};

export type SeatMapCell = {
  code: string;
  row: number;
  col: number;
  type: SeatCellType;
  sellable: boolean;
  occupancy: SeatOccupancy | null;
};

export type UnassignedGuest = {
  id: string;
  fullName: string;
  reservationId: string;
  bookingNumber: string;
  identityNumber?: string | null;
};

export type SeatMapData = {
  tourDateId: string;
  layout: {
    id: string;
    kind: string;
    passengerSeats: number;
    orientation: string;
    legend: string[];
    cells: SeatMapCell[];
  };
  assignments: unknown[];
  unassignedGuests: UnassignedGuest[];
};

export async function getTourDateSeatMap(tourDateId: string, token: string) {
  return apiRequest<SeatMapData>(`/booking/tour-dates/${tourDateId}/seats`, {
    token,
  });
}

export async function assignSeatManual(
  tourDateId: string,
  body: { seatCode: string; reservationGuestId: string },
  token: string,
) {
  return apiRequest(`/booking/tour-dates/${tourDateId}/seats/assign`, {
    method: 'POST',
    body,
    token,
  });
}

export async function autoFifoSeats(tourDateId: string, token: string) {
  return apiRequest(`/booking/tour-dates/${tourDateId}/seats/auto-fifo`, {
    method: 'POST',
    token,
  });
}

export async function unassignSeat(assignmentId: string, token: string) {
  return apiRequest(`/booking/seat-assignments/${assignmentId}`, {
    method: 'DELETE',
    token,
  });
}

export async function setTourDateBusLayout(
  tourDateId: string,
  kind: BusLayoutKindValue,
  token: string,
) {
  return apiRequest(`/catalog/tour-dates/${tourDateId}/bus-seat-layout`, {
    method: 'PUT',
    body: { kind },
    token,
  });
}
