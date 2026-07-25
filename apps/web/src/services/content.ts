import type { Category, Post } from '@turta/shared-types';

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
