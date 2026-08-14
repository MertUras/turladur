import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { renderBlogContent } from '@/components/features/blog/render-blog-content';
import { getPostBySlug } from '@/services/content';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getPostBySlug(slug);
    const description = (post.excerpt ?? post.content ?? '').slice(0, 160);
    return {
      title: `${post.title} | turta Blog`,
      description,
      openGraph: {
        title: post.title,
        description,
        type: 'article',
        publishedTime: post.publishedAt ?? undefined,
        images: post.coverImage ? [{ url: post.coverImage }] : undefined,
      },
      alternates: { canonical: `/blog/${post.slug}` },
    };
  } catch {
    return { title: 'Yazı | turta Blog' };
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  let post;
  try {
    post = await getPostBySlug(slug);
  } catch {
    notFound();
  }

  if (!post.content) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? [post.coverImage] : undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: {
      '@type': 'Organization',
      name: 'turta',
    },
    publisher: {
      '@type': 'Organization',
      name: 'turta',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `/blog/${post.slug}`,
    },
  };

  return (
    <article className="mx-auto max-w-3xl px-4 pb-16 pt-24 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <p className="text-sm text-neutral-500">
        <Link href="/blog" className="text-neutral-950 hover:underline">
          ← Blog
        </Link>
        {post.categories && post.categories.length > 0
          ? ` · ${post.categories.map((c) => c.name).join(', ')}`
          : null}
      </p>

      <h1 className="mt-4 font-[family-name:var(--font-montserrat)] text-3xl font-bold text-neutral-900 sm:text-4xl">
        {post.title}
      </h1>
      {post.excerpt ? (
        <p className="mt-4 text-lg text-neutral-600">{post.excerpt}</p>
      ) : null}
      {post.publishedAt ? (
        <time
          dateTime={post.publishedAt}
          className="mt-3 block text-sm text-neutral-500"
        >
          {new Date(post.publishedAt).toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </time>
      ) : null}

      {post.coverImage ? (
        <div className="relative mt-8 aspect-[21/9] overflow-hidden rounded-2xl bg-neutral-100">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="mt-8">{renderBlogContent(post.content)}</div>

      <div className="mt-12 rounded-xl border border-neutral-200 bg-neutral-50 p-5">
        <p className="font-semibold text-neutral-900">Rotanı şimdi planla</p>
        <p className="mt-1 text-sm text-neutral-600">
          Yazıdaki destinasyonlara uygun tur ve aktiviteleri turta’da keşfet.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link
            href="/routes"
            className="rounded-lg bg-neutral-950 px-4 py-2 font-semibold text-white"
          >
            Rotalar
          </Link>
          <Link
            href="/tours"
            className="rounded-lg border border-neutral-300 px-4 py-2 font-medium text-neutral-900"
          >
            Turlar
          </Link>
          <Link
            href="/activities"
            className="rounded-lg border border-neutral-300 px-4 py-2 font-medium text-neutral-900"
          >
            Aktiviteler
          </Link>
        </div>
      </div>
    </article>
  );
}
