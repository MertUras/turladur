/**
 * Minimal Nest catalog + content seed
 * Çalıştır: pnpm --filter api prisma:seed
 */
import { PrismaClient } from '../src/generated/prisma';
import * as bcrypt from 'bcrypt';

import { BLOG_SEED_CATEGORIES, BLOG_SEED_POSTS } from './data/blog-posts';

const prisma = new PrismaClient();

async function seedBlog(authorId: string) {
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
        authorId,
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
        authorId,
        categories: { connect },
      },
    });
  }
}

async function main() {
  const passwordHash = await bcrypt.hash('Demo1234!', 12);

  const partner = await prisma.partner.upsert({
    where: { id: 'seed-partner-demo' },
    update: {
      capabilities: ['TOURS', 'EXPERIENCES'],
      membershipTier: 'SILVER',
      status: 'VERIFIED',
    },
    create: {
      id: 'seed-partner-demo',
      companyName: 'Demo Tur & Aktivite',
      contactEmail: 'partner@demo.turladur.com',
      contactPhone: '+90 312 555 0000',
      status: 'VERIFIED',
      capabilities: ['TOURS', 'EXPERIENCES'],
      membershipTier: 'SILVER',
      city: 'Ankara',
      country: 'Türkiye',
    },
  });

  await prisma.user.upsert({
    where: { email: 'partner@demo.turladur.com' },
    update: {},
    create: {
      email: 'partner@demo.turladur.com',
      passwordHash,
      firstName: 'Demo',
      lastName: 'Partner',
      role: 'PARTNER',
      partnerId: partner.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'demo@turladur.com' },
    update: {},
    create: {
      email: 'demo@turladur.com',
      passwordHash,
      firstName: 'Demo',
      lastName: 'Müşteri',
      role: 'CUSTOMER',
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'editor@turladur.com' },
    update: {
      firstName: 'Turta',
      lastName: 'Editör',
      role: 'ADMIN',
    },
    create: {
      email: 'editor@turladur.com',
      passwordHash,
      firstName: 'Turta',
      lastName: 'Editör',
      role: 'ADMIN',
    },
  });

  const tour = await prisma.tour.upsert({
    where: { slug: 'ankara-kapadokya-demo' },
    update: { featured: true },
    create: {
      title: 'Ankara — Kapadokya Demo Turu',
      slug: 'ankara-kapadokya-demo',
      description: 'Sprint 19 seed turu. Göreme ve peri bacaları.',
      price: 4890,
      category: 'CULTURAL',
      status: 'PUBLISHED',
      durationDays: 3,
      featured: true,
      partnerId: partner.id,
    },
  });

  const start = new Date();
  start.setDate(start.getDate() + 21);
  const end = new Date(start);
  end.setDate(end.getDate() + 2);

  const existingDate = await prisma.tourDate.findFirst({
    where: { tourId: tour.id, deletedAt: null },
  });
  const tourDate =
    existingDate ??
    (await prisma.tourDate.create({
      data: {
        tourId: tour.id,
        startDate: start,
        endDate: end,
        capacity: 24,
        remainingCapacity: 24,
        isActive: true,
      },
    }));

  const ageRangeCount = await prisma.tourDateAgeRange.count({
    where: { tourDateId: tourDate.id, deletedAt: null },
  });
  if (ageRangeCount === 0) {
    await prisma.tourDateAgeRange.createMany({
      data: [
        {
          tourDateId: tourDate.id,
          minAge: 0,
          maxAge: 12,
          pricingType: 'HALF',
          value: 50,
        },
        {
          tourDateId: tourDate.id,
          minAge: 18,
          maxAge: null,
          pricingType: 'PERCENTAGE',
          value: 0,
        },
      ],
    });
  }

  await prisma.hotel.upsert({
    where: { slug: 'goreme-demo-otel' },
    update: {},
    create: {
      name: 'Göreme Demo Taş Otel',
      slug: 'goreme-demo-otel',
      city: 'Nevşehir',
      country: 'Türkiye',
      type: 'BOUTIQUE_HOTEL',
      partnerId: partner.id,
      stars: 4,
    },
  });

  await prisma.experience.upsert({
    where: { slug: 'avanos-comlek-demo' },
    update: {},
    create: {
      title: 'Avanos Çömlek Atölyesi',
      slug: 'avanos-comlek-demo',
      description: 'Kısa çömlek workshop deneyimi.',
      longDescription: 'Yerel ustalarla 2 saatlik atölye.',
      category: 'Kültür',
      location: 'Avanos',
      duration: '2 saat',
      price: 890,
      status: 'PUBLISHED',
      partnerId: partner.id,
    },
  });

  await seedBlog(admin.id);

  console.log(
    'Seed OK — partner:',
    partner.id,
    'tour:',
    tour.slug,
    'blog posts:',
    BLOG_SEED_POSTS.length,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
