import type { Tour } from '@turta/shared-types';

import { apiRequest, apiRequestWithMeta } from './api-client';

export type TourSearchParams = {
  q?: string;
  category?: string;
  /** Bucket: 1 | 2-3 | 4-6 | 7+ */
  duration?: string;
  durationDays?: number;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: 'createdAt' | 'price' | 'rating' | 'durationDays';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
};

export async function searchTours(params: TourSearchParams = {}) {
  const query = new URLSearchParams();
  if (params.q) query.set('q', params.q);
  if (params.category) query.set('category', params.category);
  if (params.duration) query.set('duration', params.duration);
  if (params.durationDays != null) {
    query.set('durationDays', String(params.durationDays));
  }
  if (params.featured === true) query.set('featured', 'true');
  if (params.minPrice != null) query.set('minPrice', String(params.minPrice));
  if (params.maxPrice != null) query.set('maxPrice', String(params.maxPrice));
  if (params.minRating != null)
    query.set('minRating', String(params.minRating));
  if (params.sortBy) query.set('sortBy', params.sortBy);
  if (params.sortOrder) query.set('sortOrder', params.sortOrder);
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

export type TourPickupPoint = {
  id: string;
  tourId: string;
  city: string;
  location: string;
  time: string;
  description: string | null;
  order: number;
  isActive: boolean;
};

export async function getTourPickupPoints(tourId: string) {
  return apiRequest<TourPickupPoint[]>(
    `/catalog/tours/${tourId}/pickup-points`,
    { next: { revalidate: 60 } },
  );
}
