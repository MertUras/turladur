// Tek seferlik yardımcı script: test partnerlerinin üyelik seviyesinin artık
// SATIN ALINAN bir paket değil, MÜŞTERİ DEĞERLENDİRMELERİNDEN otomatik
// hesaplanan bir seviye olduğunu göstermek için gerçekçi tamamlanmış
// rezervasyonlar + partner değerlendirmeleri (PartnerReview) oluşturur.
//
// Sonuç (Puan Değerlendirme kuralları — bkz. lib/partner/rating-tier.ts):
// - test.operator@tourtech.com        -> 50 review, ~4.3 ort. -> GOLD (3★)
// - test.activity@tourtech.com        -> 50 review, ~4.3 ort. -> GOLD (3★)
// - test.silver.operator@tourtech.com -> 25 review, ~4.15 ort. -> SILVER (2★)
// - test.bronze.operator@tourtech.com -> 4 review, düşük ort.  -> BRONZE (0★)
//
// Çalıştırma: npx ts-node prisma/seed-partner-reviews.ts
import { PrismaClient, UserRole, BookingStatus, PaymentStatus } from '@prisma/client';
import bcrypt from 'bcrypt';
import { recalculatePartnerTier } from '../lib/membership';

const prisma = new PrismaClient();

const CUSTOMER_PROFILES = [
  { email: 'musteri1@tourtech.com', name: 'Ayşe Demir' },
  { email: 'musteri2@tourtech.com', name: 'Mehmet Kaya' },
  { email: 'musteri3@tourtech.com', name: 'Zeynep Arslan' },
  { email: 'musteri4@tourtech.com', name: 'Can Öztürk' },
];

const COMMENTS_BY_RATING: Record<number, string[]> = {
  5: [
    'Harika bir deneyimdi, rehberimiz çok ilgiliydi. Kesinlikle tavsiye ederim!',
    'Her şey planlandığı gibiydi, otel ve ulaşım mükemmeldi.',
    'Ailemle birlikte çok keyifli bir tatil geçirdik, tekrar tercih edeceğiz.',
  ],
  4: [
    'Genel olarak çok iyiydi, küçük organizasyon detayları iyileştirilebilir.',
    'Güzel bir turdu, yemekler biraz daha çeşitli olabilirdi.',
    'Rehber bilgiliydi, rota biraz yoğundu ama memnun kaldık.',
  ],
  3: [
    'Ortalama bir deneyimdi, beklentilerimi tam karşılamadı.',
    'Tur güzeldi ancak otel konforu daha iyi olabilirdi.',
    'Fiyat-performans açısından idare eder, tekrar düşünürüm.',
  ],
  2: [
    'Organizasyon yetersizdi, buluşma noktasında uzun süre bekledik.',
    'Tur programı vaat edilenle uyuşmadı, hayal kırıklığı yaşadık.',
    'Rehber ilgisizdi, iletişim zayıftı.',
  ],
};

function commentForRating(rating: number, index: number): string {
  const pool = COMMENTS_BY_RATING[rating] ?? COMMENTS_BY_RATING[3];
  return pool[index % pool.length];
}

async function ensureCustomers() {
  const password = await bcrypt.hash('test123', 10);
  const customers = [];
  for (const { email, name } of CUSTOMER_PROFILES) {
    const user = await prisma.user.upsert({
      where: { email },
      update: { name },
      create: { email, password, role: UserRole.USER, name },
    });
    customers.push(user);
  }
  return customers;
}

async function ensureOperatorContactInfo() {
  const profiles = [
    {
      email: 'test.operator@tourtech.com',
      phone: '+90 212 555 0101',
      address: 'Levent Mah. Büyükdere Cad. No: 185, Şişli',
      city: 'İstanbul',
      country: 'Türkiye',
      website: 'https://www.turladur.com',
    },
    {
      email: 'test.silver.operator@tourtech.com',
      phone: '+90 312 555 0202',
      address: 'Kızılırmak Mah. Ufuk Üniversitesi Cad. No: 12, Çankaya',
      city: 'Ankara',
      country: 'Türkiye',
      website: 'https://www.silverturizm.com',
    },
    {
      email: 'test.bronze.operator@tourtech.com',
      phone: '+90 232 555 0303',
      address: 'Alsancak Mah. Kordon Boyu No: 45, Konak',
      city: 'İzmir',
      country: 'Türkiye',
      website: 'https://www.bronzeturizm.com',
    },
  ] as const;

  for (const profile of profiles) {
    const operator = await prisma.tourOperator.findFirst({ where: { email: profile.email } });
    if (!operator) continue;

    await prisma.tourOperator.update({
      where: { id: operator.id },
      data: {
        phone: operator.phone ?? profile.phone,
        address: operator.address ?? profile.address,
        city: operator.city ?? profile.city,
        country: operator.country ?? profile.country,
        website: operator.website ?? profile.website,
      },
    });
  }
}

async function ensureSilverBronzeTours() {
  const results: Record<string, string[]> = {};

  for (const [email, companyName, imageSeed] of [
    ['test.silver.operator@tourtech.com', 'Silver Turizm (Test)', 700],
    ['test.bronze.operator@tourtech.com', 'Bronze Turizm (Test)', 710],
  ] as const) {
    const operator = await prisma.tourOperator.findFirst({ where: { email } });
    if (!operator) continue;

    const existing = await prisma.tour.findMany({ where: { tourOperatorId: operator.id }, select: { id: true } });
    if (existing.length > 0) {
      results[email] = existing.map((t) => t.id);
      continue;
    }

    const tour = await prisma.tour.create({
      data: {
        name: `${companyName} - Örnek Tur`,
        description: 'Test amaçlı örnek tur.',
        duration: 3,
        price: 4500,
        maxParticipants: 20,
        departureCity: 'İstanbul',
        destinations: ['İstanbul'],
        images: [`https://picsum.photos/800/${imageSeed}`],
        tourOperatorId: operator.id,
      },
    });
    results[email] = [tour.id];
  }

  return results;
}

async function createCompletedBooking(params: {
  userId: string;
  tourId?: string;
  experienceId?: string;
  tourOperatorId?: string;
  price: number;
  daysAgo: number;
}) {
  const { userId, tourId, experienceId, tourOperatorId, price, daysAgo } = params;
  const endDate = new Date();
  endDate.setDate(endDate.getDate() - daysAgo);
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 3);

  return prisma.booking.create({
    data: {
      bookingNumber: `TT-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
      startDate,
      endDate,
      adults: 2,
      children: 0,
      totalPrice: price,
      status: BookingStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
      userId,
      tourId,
      experienceId,
      tourOperatorId,
    },
  });
}

async function seedReviewsFor(params: {
  bookings: { id: string }[];
  ratings: number[];
  customers: { id: string }[];
  tourOperatorId?: string;
  experienceOperatorId?: string;
}) {
  const { bookings, ratings, tourOperatorId, experienceOperatorId } = params;
  for (let i = 0; i < bookings.length; i++) {
    const booking = bookings[i];
    const rating = ratings[i % ratings.length];

    const existing = await prisma.partnerReview.findUnique({ where: { bookingId: booking.id } });
    if (existing) continue;

    await prisma.partnerReview.create({
      data: {
        rating,
        comment: commentForRating(rating, i),
        userId: params.customers[i % params.customers.length].id,
        bookingId: booking.id,
        tourOperatorId,
        experienceOperatorId,
      },
    });
  }
}

async function backfillReviewComments() {
  const reviews = await prisma.partnerReview.findMany({
    where: { comment: null },
    select: { id: true, rating: true },
    orderBy: { createdAt: 'asc' },
  });

  for (let i = 0; i < reviews.length; i++) {
    await prisma.partnerReview.update({
      where: { id: reviews[i].id },
      data: { comment: commentForRating(reviews[i].rating, i) },
    });
  }

  if (reviews.length > 0) {
    console.log(`✔ ${reviews.length} mevcut değerlendirmeye yorum eklendi`);
  }
}

function buildRatingsForTarget(count: number, targetAverage: number): number[] {
  const fiveStarCount = Math.min(count, Math.max(0, Math.round((targetAverage - 4) * count)));
  const ratings: number[] = [];

  for (let i = 0; i < fiveStarCount; i++) {
    ratings.push(5);
  }
  for (let i = fiveStarCount; i < count; i++) {
    ratings.push(4);
  }

  return ratings;
}

function buildLowRatings(count: number): number[] {
  return Array.from({ length: count }, (_, index) => (index % 2 === 0 ? 3 : 2));
}

async function seedOperatorReviews(params: {
  operatorId: string;
  tourIds: string[];
  customers: { id: string }[];
  ratings: number[];
  price?: number;
}) {
  const { operatorId, tourIds, customers, ratings, price = 4500 } = params;
  const bookings = [];

  for (let i = 0; i < ratings.length; i++) {
    bookings.push(
      await createCompletedBooking({
        userId: customers[i % customers.length].id,
        tourId: tourIds[i % tourIds.length],
        tourOperatorId: operatorId,
        price,
        daysAgo: 6 + i,
      })
    );
  }

  await seedReviewsFor({ bookings, ratings, customers, tourOperatorId: operatorId });
  await recalculatePartnerTier({ tourOperatorId: operatorId });

  return bookings.length;
}

async function seedExperienceOperatorReviews(params: {
  operatorId: string;
  experienceIds: string[];
  customers: { id: string }[];
  ratings: number[];
}) {
  const { operatorId, experienceIds, customers, ratings } = params;
  const experiences = await prisma.experience.findMany({
    where: { id: { in: experienceIds } },
    select: { id: true, price: true },
  });
  const priceById = new Map(experiences.map((experience) => [experience.id, experience.price]));
  const bookings = [];

  for (let i = 0; i < ratings.length; i++) {
    const experienceId = experienceIds[i % experienceIds.length];
    bookings.push(
      await createCompletedBooking({
        userId: customers[i % customers.length].id,
        experienceId,
        price: priceById.get(experienceId) ?? 1000,
        daysAgo: 8 + i,
      })
    );
  }

  await seedReviewsFor({ bookings, ratings, customers, experienceOperatorId: operatorId });
  await recalculatePartnerTier({ experienceOperatorId: operatorId });

  return bookings.length;
}

async function main() {
  const customers = await ensureCustomers();
  await backfillReviewComments();
  await ensureOperatorContactInfo();
  const silverBronzeTours = await ensureSilverBronzeTours();

  // --- GOLD: test.operator (tur) — 3 yıldız: min 50 review, min 4.20 ortalama ---
  const tourOperator = await prisma.tourOperator.findFirst({ where: { email: 'test.operator@tourtech.com' } });
  if (tourOperator) {
    const tours = await prisma.tour.findMany({
      where: { tourOperatorId: tourOperator.id },
      select: { id: true },
    });
    const goldRatings = buildRatingsForTarget(50, 4.3);
    const goldCount = await seedOperatorReviews({
      operatorId: tourOperator.id,
      tourIds: tours.map((tour) => tour.id),
      customers,
      ratings: goldRatings,
    });
    console.log(`✔ ${goldCount} tamamlanmış rezervasyon + review -> test.operator GOLD hedefleniyor`);
  }

  // --- GOLD: test.activity (aktivite) — 3 yıldız: min 50 review, min 4.20 ortalama ---
  const experienceOperator = await prisma.experienceOperator.findFirst({ where: { email: 'test.activity@tourtech.com' } });
  if (experienceOperator) {
    const activityUser = await prisma.user.findUnique({ where: { email: 'test.activity@tourtech.com' } });
    const experiences = await prisma.experience.findMany({
      where: { userId: activityUser!.id },
      select: { id: true },
    });
    const goldRatings = buildRatingsForTarget(50, 4.3);
    const goldCount = await seedExperienceOperatorReviews({
      operatorId: experienceOperator.id,
      experienceIds: experiences.map((experience) => experience.id),
      customers,
      ratings: goldRatings,
    });
    console.log(`✔ ${goldCount} tamamlanmış rezervasyon + review -> test.activity GOLD hedefleniyor`);
  }

  // --- SILVER: test.silver.operator — 2 yıldız: min 25 review, min 4.10 ortalama ---
  const silverOperator = await prisma.tourOperator.findFirst({ where: { email: 'test.silver.operator@tourtech.com' } });
  if (silverOperator) {
    const tourIds = silverBronzeTours['test.silver.operator@tourtech.com'] || [];
    const silverRatings = buildRatingsForTarget(25, 4.15);
    const silverCount = await seedOperatorReviews({
      operatorId: silverOperator.id,
      tourIds,
      customers,
      ratings: silverRatings,
    });
    console.log(`✔ ${silverCount} tamamlanmış rezervasyon + review -> test.silver.operator SILVER hedefleniyor`);
  }

  // --- BRONZE: test.bronze.operator — 25 review altı ve düşük ortalama ---
  const bronzeOperator = await prisma.tourOperator.findFirst({ where: { email: 'test.bronze.operator@tourtech.com' } });
  if (bronzeOperator) {
    const tourIds = silverBronzeTours['test.bronze.operator@tourtech.com'] || [];
    const bronzeRatings = buildLowRatings(4);
    const bronzeCount = await seedOperatorReviews({
      operatorId: bronzeOperator.id,
      tourIds,
      customers,
      ratings: bronzeRatings,
    });
    console.log(`✔ ${bronzeCount} tamamlanmış rezervasyon + review -> test.bronze.operator BRONZE hedefleniyor`);
  }

  const [go, ao, so, bo] = await Promise.all([
    prisma.tourOperator.findFirst({ where: { email: 'test.operator@tourtech.com' }, select: { rating: true, reviewCount: true, membershipTier: true } }),
    prisma.experienceOperator.findFirst({ where: { email: 'test.activity@tourtech.com' }, select: { rating: true, reviewCount: true, membershipTier: true } }),
    prisma.tourOperator.findFirst({ where: { email: 'test.silver.operator@tourtech.com' }, select: { rating: true, reviewCount: true, membershipTier: true } }),
    prisma.tourOperator.findFirst({ where: { email: 'test.bronze.operator@tourtech.com' }, select: { rating: true, reviewCount: true, membershipTier: true } }),
  ]);
  console.log('Sonuç ->', { test_operator: go, test_activity: ao, test_silver_operator: so, test_bronze_operator: bo });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
