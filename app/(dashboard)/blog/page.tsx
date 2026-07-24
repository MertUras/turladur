import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Blog | turta — Yurtiçi & Yurtdışı Rota Rehberleri',
  description:
    'Kapadokya, Karadeniz, Ege, Balkanlar, İtalya ve daha fazlası: popüler tur rotaları ve seyahat ipuçları.',
  openGraph: {
    title: 'turta Blog',
    description: 'Yurtiçi ve yurtdışı popüler rota rehberleri.',
    type: 'website',
  },
};

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  let posts: Awaited<
    ReturnType<
      typeof prisma.post.findMany<{
        include: {
          author: { select: { name: true; image: true } };
          categories: { select: { name: true; slug: true } };
          _count: { select: { comments: true } };
        };
      }>
    >
  > = [];
  let loadError: string | null = null;

  try {
    posts = await prisma.post.findMany({
      where: { published: true },
      include: {
        author: { select: { name: true, image: true } },
        categories: { select: { name: true, slug: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { publishedAt: 'desc' },
    });
  } catch (error) {
    console.error('Blog list error', error);
    loadError = error instanceof Error ? error.message : 'Yazılar yüklenemedi';
  }

  return (
    <div className="container mx-auto px-4 pb-8 pt-28">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold text-neutral-900">Blog</h1>
        <p className="mb-8 text-neutral-600">
          Popüler yurtiçi ve yurtdışı rotalar, gastronomi ve seyahat ipuçları.
        </p>

        {loadError ? (
          <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
            {loadError}
          </p>
        ) : null}

        {!loadError && posts.length === 0 ? (
          <div className="py-10 text-center text-neutral-500">
            <p>Henüz hiç post bulunmuyor.</p>
            <p className="mt-2 text-sm">
              Seed: <code>npx ts-node prisma/seed-blog-posts.ts</code>
            </p>
          </div>
        ) : null}

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 py-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const summary = post.excerpt || post.content;
              return (
                <article
                  key={post.id}
                  className="overflow-hidden rounded-lg border border-neutral-100 bg-white shadow-md transition-shadow hover:shadow-lg"
                >
                  {post.coverImage ? (
                    <div className="relative h-48 w-full">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  ) : null}
                  <div className="p-6">
                    <div className="mb-3 flex items-center text-sm text-neutral-500">
                      <span>{post.author.name ?? 'turta'}</span>
                      <span className="mx-2">·</span>
                      <time>
                        {format(
                          post.publishedAt ?? post.createdAt,
                          'd MMMM yyyy',
                          { locale: tr },
                        )}
                      </time>
                    </div>
                    <h2 className="mb-2 text-xl font-semibold text-neutral-900">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:text-neutral-600"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <p className="mb-4 line-clamp-3 text-neutral-600">
                      {summary}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {post.categories.map((category) => (
                        <span
                          key={category.slug}
                          className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700"
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
