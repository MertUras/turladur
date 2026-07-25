import type { Reservation } from '@turladur/shared-types';

import { apiRequest } from './api-client';

export type CreateReservationInput = {
  tourDateId?: string;
  activityDateId?: string;
  adults: number;
  children?: number;
  contactEmail: string;
  contactPhone: string;
  guests: Array<{
    firstName: string;
    lastName: string;
    birthDate?: string;
    identityNumber: string;
    phone: string;
    email: string;
    address?: string;
  }>;
  billing: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode?: string;
    country: string;
    taxId?: string;
    companyName?: string;
  };
  specialRequests?: string;
};

export async function createReservation(
  input: CreateReservationInput,
  token: string,
) {
  return apiRequest<Reservation>('/booking/reservations', {
    method: 'POST',
    body: input,
    token,
  });
}

export async function listReservations(token: string) {
  return apiRequest<Reservation[]>('/booking/reservations', { token });
}

export async function checkoutPayment(
  input: {
    reservationId: string;
    cardHolderName: string;
    cardNumber: string;
    expireMonth: string;
    expireYear: string;
    cvc: string;
  },
  token: string,
) {
  return apiRequest<{
    id: string;
    status: string;
    reservationId: string;
  }>('/payment/checkout', {
    method: 'POST',
    body: input,
    token,
  });
}
