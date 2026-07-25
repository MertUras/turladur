import type { Metadata } from 'next';
import Link from 'next/link';

import { BlogPostCard } from '@/components/features/blog/blog-post-card';
import { searchPosts } from '@/services/content';

export const metadata: Metadata = {
  title: 'Blog | turta — Yurtiçi & Yurtdışı Rota Rehberleri',
  description:
    'Kapadokya, Karadeniz, Ege, Balkanlar, İtalya, İspanya ve daha fazlası: popüler tur rotaları, gastronomi ve seyahat ipuçları.',
  openGraph: {
    title: 'turta Blog — Rota ve Seyahat Rehberleri',
    description:
      'Yurtiçi ve yurtdışı popüler rotalar, sürdürülebilir seyahat ve gastronomi yazıları.',
    type: 'website',
  },
  alternates: { canonical: '/blog' },
};

type PageProps = {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
};

export default async function BlogPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q?.trim() ?? '';
  const category = params.category;
  const page = Number(params.page ?? '1') || 1;

  let posts: Awaited<ReturnType<typeof searchPosts>>['data'] = [];
  let total = 0;
  let errorMessage: string | null = null;

  try {
    const result = await searchPosts({
      q: q || undefined,
      categorySlug: category,
      page,
      limit: 18,
    });
    posts = result.data ?? [];
    total = result.meta?.total ?? posts.length;
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : 'Yazılar yüklenemedi';
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6">
      <header className="max-w-3xl">
        <h1 className="font-[family-name:var(--font-montserrat)] text-3xl font-bold text-neutral-900 sm:text-4xl">
          Blog
        </h1>
        <p className="mt-3 text-neutral-600">
          Popüler yurtiçi ve yurtdışı rotalar, gastronomi ve seyahat ipuçları —
          tur planlamadan önce okuyun.
        </p>
      </header>

      <form
        className="mt-8 flex flex-col gap-3 sm:flex-row"
        action="/blog"
        method="get"
      >
        <input
          name="q"
          defaultValue={q}
          placeholder="Kapadokya, Balkanlar, gastronomi…"
          className="h-11 flex-1 rounded-lg border border-neutral-300 px-3 outline-none ring-neutral-950 focus:ring-2"
        />
        <select
          name="category"
          defaultValue={category ?? ''}
          className="h-11 rounded-lg border border-neutral-300 px-3 sm:w-52"
        >
          <option value="">Tüm kategoriler</option>
          <option value="yurtici-rotalar">Yurtiçi Rotalar</option>
          <option value="yurtdisi-rotalar">Yurtdışı Rotalar</option>
          <option value="seyahat-ipuclari">Seyahat İpuçları</option>
          <option value="gastronomi">Gastronomi</option>
        </select>
        <button
          type="submit"
          className="h-11 rounded-lg bg-neutral-950 px-5 text-sm font-semibold text-white hover:bg-neutral-800"
        >
          Ara
        </button>
      </form>

      {errorMessage ? (
        <p className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          {errorMessage}. Seed çalıştı mı?{' '}
          <code>pnpm --filter api prisma:seed</code>
        </p>
      ) : null}

      {!errorMessage && posts.length === 0 ? (
        <p className="mt-10 text-neutral-600">Henüz yazı yok.</p>
      ) : (
        <>
          <p className="mt-6 text-sm text-neutral-500">{total} yazı</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        </>
      )}

      <p className="mt-12 text-center text-sm text-neutral-500">
        <Link href="/routes" className="text-neutral-950 hover:underline">
          Rotaları keşfet
        </Link>
        {' · '}
        <Link href="/tours" className="text-neutral-950 hover:underline">
          Turlara bak
        </Link>
      </p>
    </div>
  );
}
