/**
 * Minimal Nest catalog + content seed
 * Çalıştır: pnpm --filter api prisma:seed
 */
import { Prisma, PrismaClient } from '../src/generated/prisma';
import * as bcrypt from 'bcrypt';

import { BLOG_SEED_CATEGORIES, BLOG_SEED_POSTS } from './data/blog-posts';
import { buildSystemBusLayoutDefs } from '../src/shared/utils/bus-seat-layout';

const prisma = new PrismaClient();

/** Soft-delete uyumlu: email artık Prisma @unique değil (partial unique SQL). */
async function upsertUserByEmail(
  email: string,
  data: {
    update: Record<string, unknown>;
    create: {
      email: string;
      passwordHash: string;
      firstName?: string;
      lastName?: string;
      role: string;
    };
  },
) {
  const existing = await prisma.user.findFirst({
    where: { email, deletedAt: null },
  });
  if (existing) {
    return prisma.user.update({
      where: { id: existing.id },
      data: data.update,
    });
  }
  return prisma.user.create({ data: data.create as never });
}

async function seedBusSeatLayouts() {
  const defs = buildSystemBusLayoutDefs();
  for (const def of defs) {
    const layoutJson = def.layoutJson as unknown as Prisma.InputJsonValue;
    await prisma.busSeatLayout.upsert({
      where: { kind: def.kind },
      update: {
        name: def.name,
        passengerSeats: def.passengerSeats,
        crewSeats: def.crewSeats,
        rows: def.rows,
        cols: def.cols,
        layoutJson,
        isSystem: true,
        deletedAt: null,
      },
      create: {
        kind: def.kind,
        name: def.name,
        passengerSeats: def.passengerSeats,
        crewSeats: def.crewSeats,
        rows: def.rows,
        cols: def.cols,
        layoutJson,
        isSystem: true,
      },
    });
  }
}

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

  await upsertUserByEmail('demo@turta.com', {
    update: {},
    create: {
      email: 'demo@turta.com',
      passwordHash,
      firstName: 'Demo',
      lastName: 'Müşteri',
      role: 'CUSTOMER',
    },
  });

  const admin = await upsertUserByEmail('editor@turta.com', {
    update: {
      firstName: 'Turta',
      lastName: 'Editör',
      role: 'ADMIN',
    },
    create: {
      email: 'editor@turta.com',
      passwordHash,
      firstName: 'Turta',
      lastName: 'Editör',
      role: 'ADMIN',
    },
  });

  await upsertUserByEmail('platform-admin@turta.com', {
    update: {
      role: 'PLATFORM_ADMIN',
      firstName: 'Platform',
      lastName: 'Admin',
    },
    create: {
      email: 'platform-admin@turta.com',
      passwordHash,
      firstName: 'Platform',
      lastName: 'Admin',
      role: 'PLATFORM_ADMIN',
    },
  });

  await upsertUserByEmail('superadmin@turta.com', {
    update: {
      role: 'PLATFORM_SUPER_ADMIN',
      firstName: 'Platform',
      lastName: 'Super',
    },
    create: {
      email: 'superadmin@turta.com',
      passwordHash,
      firstName: 'Platform',
      lastName: 'Super',
      role: 'PLATFORM_SUPER_ADMIN',
    },
  });

  const agency = await prisma.agency.upsert({
    where: { id: 'seed-agency-demo' },
    update: {
      companyName: 'Demo Satıcı Acente',
      taxNumber: '1234567890',
      legalTitle: 'Demo Satıcı Acente A.Ş.',
      address: 'Atatürk Cad. No:1 Çankaya/Ankara',
      contactEmail: 'agency-owner@demo.turta.com',
      status: 'VERIFIED',
      sellerTier: 'SILVER',
      capabilities: ['TOURS'],
      verifiedAt: new Date(),
    },
    create: {
      id: 'seed-agency-demo',
      companyName: 'Demo Satıcı Acente',
      taxNumber: '1234567890',
      legalTitle: 'Demo Satıcı Acente A.Ş.',
      address: 'Atatürk Cad. No:1 Çankaya/Ankara',
      city: 'Ankara',
      country: 'Türkiye',
      contactEmail: 'agency-owner@demo.turta.com',
      contactPhone: '+90 312 555 1111',
      status: 'VERIFIED',
      sellerTier: 'SILVER',
      capabilities: ['TOURS'],
      verifiedAt: new Date(),
    },
  });

  const existingOwner = await prisma.agencyStaff.findFirst({
    where: {
      agencyId: agency.id,
      role: 'AGENCY_OWNER',
      deletedAt: null,
    },
  });
  if (!existingOwner) {
    await prisma.agencyStaff.create({
      data: {
        agencyId: agency.id,
        name: 'Demo Acente Sahibi',
        email: 'agency-owner@demo.turta.com',
        passwordHash,
        role: 'AGENCY_OWNER',
        status: 'ACTIVE',
      },
    });
  } else {
    await prisma.agencyStaff.update({
      where: { id: existingOwner.id },
      data: {
        passwordHash,
        status: 'ACTIVE',
        email: 'agency-owner@demo.turta.com',
      },
    });
  }

  const tour = await prisma.tour.upsert({
    where: { slug: 'ankara-kapadokya-demo' },
    update: {
      featured: true,
      agencyId: agency.id,
      status: 'PUBLISHED',
    },
    create: {
      title: 'Ankara — Kapadokya Demo Turu',
      slug: 'ankara-kapadokya-demo',
      description: 'Sprint 19 seed turu. Göreme ve peri bacaları.',
      price: 4890,
      category: 'CULTURAL',
      status: 'PUBLISHED',
      durationDays: 3,
      featured: true,
      agencyId: agency.id,
    },
  });

  const start = new Date();
  start.setDate(start.getDate() + 21);
  const end = new Date(start);
  end.setDate(end.getDate() + 2);

  const existingDate = await prisma.tourDate.findFirst({
    where: { tourId: tour.id, deletedAt: null },
  });
  // Re-seed: keep demo tour dates in the future (CI refresh jobs)
  const tourDate = existingDate
    ? await prisma.tourDate.update({
        where: { id: existingDate.id },
        data: {
          startDate: start,
          endDate: end,
          capacity: 24,
          remainingCapacity: Math.max(existingDate.remainingCapacity, 8),
          isActive: true,
        },
      })
    : await prisma.tourDate.create({
        data: {
          tourId: tour.id,
          startDate: start,
          endDate: end,
          capacity: 24,
          remainingCapacity: 24,
          isActive: true,
        },
      });

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
      agencyId: agency.id,
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
      agencyId: agency.id,
    },
  });

  await seedBlog(admin.id);
  await seedBusSeatLayouts();

  const existingGuide = await prisma.guide.findFirst({
    where: { email: 'guide@demo.turta.com', deletedAt: null },
  });
  if (!existingGuide) {
    await prisma.guide.create({
      data: {
        identityNumber: '10000000146',
        firstName: 'Demo',
        lastName: 'Rehber',
        email: 'guide@demo.turta.com',
        passwordHash,
        phone: '+90 532 555 2222',
        birthDate: new Date('1990-05-15T00:00:00.000Z'),
        status: 'VERIFIED',
        languages: ['tr', 'en'],
        oda: 'Ankara',
        sicilNo: 'SIC-DEMO-001',
        ruhsatNo: 'RH-DEMO-001',
        ruhsatExpiresAt: new Date('2027-12-31T00:00:00.000Z'),
        city: 'Ankara',
        verifiedAt: new Date(),
      },
    });
  } else {
    await prisma.guide.update({
      where: { id: existingGuide.id },
      data: {
        oda: existingGuide.oda ?? 'Ankara',
        sicilNo: existingGuide.sicilNo ?? 'SIC-DEMO-001',
        ruhsatNo: existingGuide.ruhsatNo ?? 'RH-DEMO-001',
        ruhsatExpiresAt:
          existingGuide.ruhsatExpiresAt ?? new Date('2027-12-31T00:00:00.000Z'),
        birthDate:
          existingGuide.birthDate ?? new Date('1990-05-15T00:00:00.000Z'),
        languages:
          existingGuide.languages.length > 0
            ? existingGuide.languages
            : ['tr', 'en'],
        status: 'VERIFIED',
        verifiedAt: existingGuide.verifiedAt ?? new Date(),
      },
    });
  }

  const existingBus = await prisma.busCompany.findFirst({
    where: { contactEmail: 'bus@demo.turta.com', deletedAt: null },
  });
  let busCompany = existingBus;
  if (!existingBus) {
    busCompany = await prisma.busCompany.create({
      data: {
        companyName: 'Demo Otobüs',
        contactEmail: 'bus@demo.turta.com',
        passwordHash,
        contactPhone: '+90 312 555 3333',
        status: 'VERIFIED',
        city: 'Ankara',
        country: 'Türkiye',
        verifiedAt: new Date(),
      },
    });
  }

  if (busCompany) {
    const existingVehicle = await prisma.vehicle.findFirst({
      where: {
        busCompanyId: busCompany.id,
        plateNumber: '06 DEMO 46',
        deletedAt: null,
      },
    });
    if (!existingVehicle) {
      await prisma.vehicle.create({
        data: {
          busCompanyId: busCompany.id,
          plateNumber: '06 DEMO 46',
          modelYear: 2022,
          seatLayoutKind: 'BUS_46_PLUS_1',
          capacity: 46,
          isActive: true,
          notes: 'Seed demo araç — müsaitlik takvimi',
        },
      });
    }
  }

  console.log(
    'Seed OK — agency:',
    agency.id,
    'tour:',
    tour.slug,
    'blog posts:',
    BLOG_SEED_POSTS.length,
    'busLayouts: 5',
    'agency-owner@demo.turta.com / Demo1234!',
    'guide: guide@demo.turta.com',
    'bus: bus@demo.turta.com',
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
