/**
 * Legacy Prisma blog seed (app/(dashboard)/blog).
 * Run from repo root:
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed-blog-posts.ts
 */
import { PrismaClient } from '@prisma/client';
import {
  BLOG_SEED_CATEGORIES,
  BLOG_SEED_POSTS,
} from '../apps/api/prisma/data/blog-posts';

const prisma = new PrismaClient();

async function main() {
  const author = await prisma.user.upsert({
    where: { email: 'editor@turladur.com' },
    update: { name: 'Turta Editör', status: 'active' },
    create: {
      email: 'editor@turladur.com',
      name: 'Turta Editör',
      role: 'ADMIN',
      status: 'active',
    },
  });

  const categoryIds = new Map<string, string>();
  for (const cat of BLOG_SEED_CATEGORIES) {
    const row = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
      },
    });
    categoryIds.set(cat.slug, row.id);
  }

  for (let index = 0; index < BLOG_SEED_POSTS.length; index++) {
    const post = BLOG_SEED_POSTS[index];
    const publishedAt = new Date();
    publishedAt.setDate(
      publishedAt.getDate() - (BLOG_SEED_POSTS.length - index),
    );

    const connect: { id: string }[] = [];
    for (const slug of post.categorySlugs) {
      const id = categoryIds.get(slug);
      if (id) connect.push({ id });
    }

    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        published: true,
        publishedAt,
        authorId: author.id,
        categories: { set: connect },
      },
      create: {
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        published: true,
        publishedAt,
        authorId: author.id,
        categories: { connect },
      },
    });
  }

  console.log(`Legacy blog seed OK — ${BLOG_SEED_POSTS.length} yazı`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
