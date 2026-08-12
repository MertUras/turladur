import type {
  Category,
  Post,
  RoutePageOverlay,
  SitePageCover,
} from '@turta/shared-types';

import { apiRequest, apiRequestWithMeta } from './api-client';

export type PostDetail = Post & {
  content: string;
  coverImage: string | null;
  categories?: Category[];
};

export async function searchPosts(
  params: {
    q?: string;
    categorySlug?: string;
    page?: number;
    limit?: number;
  } = {},
) {
  const query = new URLSearchParams();
  if (params.q) query.set('q', params.q);
  if (params.categorySlug) query.set('categorySlug', params.categorySlug);
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  const qs = query.toString();
  return apiRequestWithMeta<PostDetail[]>(
    `/content/posts${qs ? `?${qs}` : ''}`,
    { next: { revalidate: 120 } },
  );
}

export async function getPostBySlug(slug: string) {
  return apiRequest<PostDetail>(`/content/posts/${slug}`, {
    next: { revalidate: 120 },
  });
}

export async function getPageCover(key: string) {
  return apiRequest<SitePageCover>(`/content/page-covers/${key}`, {
    cache: 'no-store',
  });
}

export async function listRoutePageOverlays() {
  return apiRequest<RoutePageOverlay[]>('/content/route-pages', {
    next: { revalidate: 120 },
  });
}

export async function getRoutePageOverlay(routeKey: string) {
  return apiRequest<RoutePageOverlay>(`/content/route-pages/${routeKey}`, {
    next: { revalidate: 120 },
  });
}
