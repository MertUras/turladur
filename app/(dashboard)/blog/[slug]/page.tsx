import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

import { prisma } from '@/lib/prisma';

type PageProps = { params: Promise<{ slug: string }> };

function renderBlocks(content: string) {
  return content
    .split(/\n\n+/)
    .map((b) => b.trim())
    .filter(Boolean)
    .map((block, index) => {
      if (block.startsWith('## ')) {
        return (
          <h2 key={index} className="mt-8 text-xl font-bold text-neutral-900">
            {block.replace(/^##\s+/, '')}
          </h2>
        );
      }
      return (
        <p key={index} className="mt-4 leading-relaxed text-neutral-700">
          {block}
        </p>
      );
    });
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findFirst({
    where: { slug, published: true },
  });
  if (!post) return { title: 'Yazı | turta Blog' };
  const description = (post.excerpt ?? post.content).slice(0, 160);
  return {
    title: `${post.title} | turta Blog`,
    description,
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  };
}

export default async function LegacyBlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await prisma.post.findFirst({
    where: { slug, published: true },
    include: {
      author: { select: { name: true, image: true } },
      categories: { select: { name: true, slug: true } },
    },
  });

  if (!post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? [post.coverImage] : undefined,
    datePublished:
      post.publishedAt?.toISOString() ?? post.createdAt.toISOString(),
    author: { '@type': 'Person', name: post.author.name ?? 'turta' },
  };

  return (
    <article className="container mx-auto max-w-3xl px-4 pb-16 pt-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link href="/blog" className="text-sm text-neutral-950 hover:underline">
        ← Blog
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-neutral-900 sm:text-4xl">
        {post.title}
      </h1>
      {post.excerpt ? (
        <p className="mt-3 text-lg text-neutral-600">{post.excerpt}</p>
      ) : null}
      <p className="mt-2 text-sm text-neutral-500">
        {post.author.name ?? 'turta'} ·{' '}
        {format(post.publishedAt ?? post.createdAt, 'd MMMM yyyy', {
          locale: tr,
        })}
      </p>
      {post.coverImage ? (
        <div className="relative mt-8 aspect-[21/9] overflow-hidden rounded-2xl bg-neutral-100">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      ) : null}
      <div className="mt-8">{renderBlocks(post.content)}</div>
      <div className="mt-8 flex flex-wrap gap-2">
        {post.categories.map((c) => (
          <span
            key={c.slug}
            className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700"
          >
            {c.name}
          </span>
        ))}
      </div>
    </article>
  );
}
