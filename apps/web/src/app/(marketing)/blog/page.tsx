import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { BlogPostCard } from '@/components/features/blog/blog-post-card';
import { FaqSection } from '@/components/features/faq/faq-section';
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

const BLOG_BANNER_IMAGE =
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2070&q=80';

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
    <main className="min-h-screen bg-neutral-50 text-neutral-800">
      {/* Banner — kampanyalar sayfası ile aynı dil */}
      <section className="relative h-[380px] w-full overflow-hidden bg-neutral-900 md:h-[420px]">
        <Image
          src={BLOG_BANNER_IMAGE}
          alt="turta Blog"
          fill
          className="object-cover object-center opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white drop-shadow-lg md:text-5xl">
              Blog
            </h1>
            <p className="text-lg font-light leading-relaxed text-neutral-200 drop-shadow md:text-xl">
              Popüler yurtiçi ve yurtdışı rotalar, gastronomi ve seyahat
              ipuçları — tur planlamadan önce okuyun.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        <form
          className="flex flex-col gap-3 sm:flex-row"
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

      {/* Footer üstü — iletişim sayfasıyla aynı SSS */}
      <FaqSection contactHref="/contact" />
    </main>
  );
}
