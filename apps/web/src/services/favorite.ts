import { apiRequest } from './api-client';

export type FavoriteTourSummary = {
  id: string;
  title: string;
  slug: string;
  coverUrl: string | null;
  price: string | number;
  currency: string;
  averageRating: string | number;
  reviewCount: number;
  durationDays: number;
};

export type FavoriteExperienceSummary = {
  id: string;
  title: string;
  slug: string;
  imageUrl: string | null;
  location: string;
  price: string | number;
  currency: string;
  averageRating: string | number;
  reviewCount: number;
  duration: string;
};

export type Favorite = {
  id: string;
  userId: string;
  tourId: string | null;
  experienceId: string | null;
  createdAt: string;
  tour: FavoriteTourSummary | null;
  experience: FavoriteExperienceSummary | null;
};

export async function listFavorites(token: string) {
  return apiRequest<Favorite[]>('/catalog/favorites', { token });
}

export async function addFavorite(
  body: { tourId: string } | { experienceId: string },
  token: string,
) {
  return apiRequest<Favorite>('/catalog/favorites', {
    method: 'POST',
    body,
    token,
  });
}

/** Soft-delete by favorite row id (ownership enforced on API). */
export async function removeFavorite(favoriteId: string, token: string) {
  return apiRequest<Favorite>(`/catalog/favorites/${favoriteId}`, {
    method: 'DELETE',
    token,
  });
}
