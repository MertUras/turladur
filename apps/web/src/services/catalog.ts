import type { Tour } from '@turladur/shared-types';

import { apiRequest, apiRequestWithMeta } from './api-client';

export type TourSearchParams = {
  q?: string;
  category?: string;
  page?: number;
  limit?: number;
};

export async function searchTours(params: TourSearchParams = {}) {
  const query = new URLSearchParams();
  if (params.q) query.set('q', params.q);
  if (params.category) query.set('category', params.category);
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));

  const qs = query.toString();
  return apiRequestWithMeta<Tour[]>(
    `/catalog/tours/search${qs ? `?${qs}` : ''}`,
    { next: { revalidate: 60 } },
  );
}

export async function getTourById(id: string) {
  return apiRequest<Tour>(`/catalog/tours/${id}`, {
    next: { revalidate: 60 },
  });
}

export type TourDateRow = {
  id: string;
  tourId: string;
  startDate: string;
  endDate: string;
  capacity: number;
  remainingCapacity: number;
  priceOverride: string | null;
  isActive: boolean;
};

export async function getTourDates(tourId: string) {
  return apiRequest<TourDateRow[]>(`/catalog/tours/${tourId}/dates`, {
    next: { revalidate: 30 },
  });
}
