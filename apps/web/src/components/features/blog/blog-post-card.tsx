import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@turta/shared-types';

type PostCardData = Post & {
  coverImage?: string | null;
  categories?: Array<{ name: string; slug: string }>;
};

export function BlogPostCard({ post }: { post: PostCardData }) {
  const href = `/blog/${post.slug}`;
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md">
      <Link
        href={href}
        className="relative aspect-[16/10] overflow-hidden bg-neutral-100"
      >
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-neutral-500">
            Blog
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {post.categories && post.categories.length > 0 ? (
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            {post.categories.map((c) => c.name).join(' · ')}
          </p>
        ) : null}
        <h2 className="text-lg font-semibold text-neutral-900">
          <Link href={href} className="hover:text-neutral-600">
            {post.title}
          </Link>
        </h2>
        {post.excerpt ? (
          <p className="line-clamp-3 text-sm text-neutral-600">
            {post.excerpt}
          </p>
        ) : null}
        <Link
          href={href}
          className="mt-auto pt-2 text-sm font-semibold text-neutral-950 hover:underline"
        >
          Devamını oku →
        </Link>
      </div>
    </article>
  );
}
