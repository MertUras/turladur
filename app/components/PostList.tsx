'use client';

import { usePosts } from '@/hooks/usePosts';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function PostList() {
  const { posts, isLoading, error } = usePosts();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neutral-800" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-neutral-500">Henüz hiç post bulunmuyor.</p>
        <p className="mt-2 text-sm text-neutral-400">
          Seed için: <code>npx ts-node prisma/seed-blog-posts.ts</code>
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
      {posts.map((post) => {
        const cover = post.coverImage || post.image;
        const summary = post.excerpt || post.content;
        return (
          <article
            key={post.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-neutral-100"
          >
            {cover ? (
              <div className="relative h-48 w-full">
                <Image
                  src={cover}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            ) : null}
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {post.author.image ? (
                    <Image
                      src={post.author.image}
                      alt={post.author.name || ''}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center text-white text-sm">
                      {post.author.name?.[0] || 'T'}
                    </div>
                  )}
                  <span className="ml-2 text-sm text-neutral-600">
                    {post.author.name}
                  </span>
                </div>
                <span className="mx-2 text-neutral-300">•</span>
                <time className="text-sm text-neutral-500">
                  {format(new Date(post.createdAt), 'd MMMM yyyy', {
                    locale: tr,
                  })}
                </time>
              </div>
              <h2 className="text-xl font-semibold mb-2">
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-neutral-900 hover:text-neutral-600 transition-colors duration-200"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="text-neutral-600 mb-4 line-clamp-3">{summary}</p>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {post.categories.map((category) => (
                    <span
                      key={category.slug}
                      className="text-sm text-neutral-700 bg-neutral-100 px-3 py-1 rounded-full"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
                <span className="text-neutral-500 text-sm">
                  {post._count.comments} yorum
                </span>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
