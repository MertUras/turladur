import { apiRequest } from './api-client';

export type PartnerStats = {
  tours: { total: number; published: number; pendingReview: number };
  reservations: { total: number };
  revenue: { confirmedTotal: string; currency: string };
};

export type PartnerTour = {
  id: string;
  title: string;
  slug: string;
  price: string;
  currency: string;
  category: string;
  status: string;
  coverUrl: string | null;
  durationDays: number;
};

export type PartnerReservation = {
  id: string;
  bookingNumber: string;
  tourId: string;
  status: string;
  totalAmount: string;
  currency: string;
  contactEmail: string;
  adults: number;
  children: number;
  createdAt: string;
};

export async function getPartnerStats(token: string) {
  return apiRequest<PartnerStats>('/partner/dashboard/stats', { token });
}

export async function listPartnerTours(token: string) {
  return apiRequest<PartnerTour[]>('/partner/tours', { token });
}

export async function listPartnerReservations(token: string) {
  return apiRequest<PartnerReservation[]>('/partner/reservations', { token });
}

export async function updatePartnerReservation(
  id: string,
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED',
  token: string,
) {
  return apiRequest<PartnerReservation>(`/partner/reservations/${id}`, {
    method: 'PATCH',
    body: { status },
    token,
  });
}

export type AdminStats = {
  users: number;
  partners: { total: number; pending: number };
  tours: { total: number; pendingReview: number };
  reservations: number;
  paymentsSuccess: number;
};

export async function getAdminStats(token: string) {
  return apiRequest<AdminStats>('/admin/dashboard/stats', { token });
}

export async function listAdminUsers(token: string) {
  return apiRequest<
    Array<{
      id: string;
      email: string;
      firstName: string | null;
      lastName: string | null;
      role: string;
      isActive: boolean;
      partnerId: string | null;
    }>
  >('/admin/users', { token });
}

export async function updateAdminUser(
  id: string,
  body: { isActive?: boolean; role?: string },
  token: string,
) {
  return apiRequest(`/admin/users/${id}`, {
    method: 'PATCH',
    body,
    token,
  });
}

export async function listAdminPartners(token: string, status?: string) {
  const qs = status ? `?status=${status}` : '';
  return apiRequest<
    Array<{
      id: string;
      companyName: string;
      contactEmail: string;
      status: string;
      verifiedAt: string | null;
    }>
  >(`/admin/partners${qs}`, { token });
}

export async function setPartnerStatus(
  id: string,
  status: 'VERIFIED' | 'REJECTED' | 'SUSPENDED',
  token: string,
) {
  return apiRequest(`/admin/partners/${id}/status`, {
    method: 'PATCH',
    body: { status },
    token,
  });
}

export async function listPendingTours(token: string) {
  return apiRequest<
    Array<{
      id: string;
      title: string;
      partnerId: string;
      price: string;
      currency: string;
      category: string;
      status: string;
    }>
  >('/admin/tours/pending', { token });
}

export async function setTourStatusAdmin(
  id: string,
  status: 'PUBLISHED' | 'ARCHIVED' | 'DRAFT',
  token: string,
) {
  return apiRequest(`/admin/tours/${id}/status`, {
    method: 'PATCH',
    body: { status },
    token,
  });
}

export async function createPartnerTour(
  body: {
    title: string;
    description: string;
    price: number;
    category: string;
    durationDays?: number;
    coverUrl?: string;
  },
  token: string,
) {
  return apiRequest<{ id: string; title: string; status: string }>(
    '/catalog/tours',
    {
      method: 'POST',
      body,
      token,
    },
  );
}

export async function updatePartnerTour(
  id: string,
  body: { coverUrl?: string; title?: string; description?: string },
  token: string,
) {
  return apiRequest(`/catalog/tours/${id}`, {
    method: 'PATCH',
    body,
    token,
  });
}

export async function getPresignedUpload(
  body: {
    folder: string;
    entityId: string;
    filename: string;
    contentType: string;
  },
  token: string,
) {
  return apiRequest<{
    uploadUrl: string;
    publicUrl: string;
    key: string;
  }>('/storage/presigned-url', {
    method: 'POST',
    body,
    token,
  });
}
