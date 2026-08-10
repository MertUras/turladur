'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';

import { useAuth } from '@/providers/auth-provider';
import {
  addFavorite,
  listFavorites,
  removeFavorite,
  type Favorite,
} from '@/services/favorite';

const FAVORITES_QUERY_KEY = ['catalog', 'favorites'] as const;

function loginRedirectUrl(returnPath: string) {
  return `/login?callbackUrl=${encodeURIComponent(returnPath)}`;
}

export function useFavorites() {
  const { accessToken, isAuthenticated, isBootstrapping } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  const query = useQuery({
    queryKey: [...FAVORITES_QUERY_KEY, accessToken],
    queryFn: () => listFavorites(accessToken!),
    enabled: Boolean(accessToken) && isAuthenticated && !isBootstrapping,
    staleTime: 60_000,
  });

  const favorites = useMemo(() => query.data ?? [], [query.data]);

  const byTourId = useMemo(() => {
    const map = new Map<string, Favorite>();
    for (const row of favorites) {
      if (row.tourId) map.set(row.tourId, row);
    }
    return map;
  }, [favorites]);

  const byExperienceId = useMemo(() => {
    const map = new Map<string, Favorite>();
    for (const row of favorites) {
      if (row.experienceId) map.set(row.experienceId, row);
    }
    return map;
  }, [favorites]);

  const invalidate = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
  }, [queryClient]);

  const addMutation = useMutation({
    mutationFn: (body: { tourId: string } | { experienceId: string }) =>
      addFavorite(body, accessToken!),
    onSuccess: invalidate,
  });

  const removeMutation = useMutation({
    mutationFn: (favoriteId: string) =>
      removeFavorite(favoriteId, accessToken!),
    onSuccess: invalidate,
  });

  const requireAuth = useCallback(
    (returnPath?: string) => {
      if (isBootstrapping) return false;
      if (isAuthenticated && accessToken) return true;
      router.push(loginRedirectUrl(returnPath ?? pathname ?? '/tours'));
      return false;
    },
    [accessToken, isAuthenticated, isBootstrapping, pathname, router],
  );

  const isTourFavorite = useCallback(
    (tourId: string) => byTourId.has(tourId),
    [byTourId],
  );

  const isExperienceFavorite = useCallback(
    (experienceId: string) => byExperienceId.has(experienceId),
    [byExperienceId],
  );

  const toggleTourFavorite = useCallback(
    async (tourId: string, returnPath?: string) => {
      if (!requireAuth(returnPath ?? `/tours/${tourId}`)) return;
      const existing = byTourId.get(tourId);
      if (existing) {
        await removeMutation.mutateAsync(existing.id);
        return;
      }
      await addMutation.mutateAsync({ tourId });
    },
    [addMutation, byTourId, removeMutation, requireAuth],
  );

  const toggleExperienceFavorite = useCallback(
    async (experienceId: string, returnPath?: string) => {
      if (!requireAuth(returnPath ?? `/activities/${experienceId}`)) return;
      const existing = byExperienceId.get(experienceId);
      if (existing) {
        await removeMutation.mutateAsync(existing.id);
        return;
      }
      await addMutation.mutateAsync({ experienceId });
    },
    [addMutation, byExperienceId, removeMutation, requireAuth],
  );

  return {
    favorites,
    isLoading: query.isLoading,
    isTourFavorite,
    isExperienceFavorite,
    toggleTourFavorite,
    toggleExperienceFavorite,
    isMutating: addMutation.isPending || removeMutation.isPending,
  };
}
