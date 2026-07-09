// Tek seferlik yardımcı script: test partnerlerinin üyelik seviyesinin artık
// SATIN ALINAN bir paket değil, MÜŞTERİ DEĞERLENDİRMELERİNDEN otomatik
// hesaplanan bir seviye olduğunu göstermek için gerçekçi tamamlanmış
// rezervasyonlar + partner değerlendirmeleri (PartnerReview) oluşturur.
//
// Sonuç:
// - test.operator@tourtech.com      -> yüksek puanlı review'ler  -> GOLD
// - test.activity@tourtech.com      -> yüksek puanlı review'ler  -> GOLD
// - test.silver.operator@tourtech.com -> orta puanlı review'ler  -> SILVER
// - test.bronze.operator@tourtech.com -> düşük puanlı review'ler -> BRONZE
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

async function main() {
  const customers = await ensureCustomers();
  await backfillReviewComments();
  await ensureOperatorContactInfo();
  const silverBronzeTours = await ensureSilverBronzeTours();

  // --- GOLD: test.operator (tur) ---
  const tourOperator = await prisma.tourOperator.findFirst({ where: { email: 'test.operator@tourtech.com' } });
  if (tourOperator) {
    const tours = await prisma.tour.findMany({ where: { tourOperatorId: tourOperator.id }, take: 5, select: { id: true, price: true } });
    const bookings = [];
    for (let i = 0; i < Math.min(5, tours.length); i++) {
      bookings.push(
        await createCompletedBooking({
          userId: customers[i % customers.length].id,
          tourId: tours[i].id,
          tourOperatorId: tourOperator.id,
          price: tours[i].price,
          daysAgo: 10 + i * 5,
        })
      );
    }
    await seedReviewsFor({ bookings, ratings: [5, 5, 4, 5, 5], customers, tourOperatorId: tourOperator.id });
    await recalculatePartnerTier({ tourOperatorId: tourOperator.id });
    console.log(`✔ ${tours.length} tur üzerinden ${bookings.length} tamamlanmış rezervasyon + review -> test.operator GOLD hedefleniyor`);
  }

  // --- GOLD: test.activity (aktivite) ---
  const experienceOperator = await prisma.experienceOperator.findFirst({ where: { email: 'test.activity@tourtech.com' } });
  if (experienceOperator) {
    const activityUser = await prisma.user.findUnique({ where: { email: 'test.activity@tourtech.com' } });
    const experiences = await prisma.experience.findMany({ where: { userId: activityUser!.id }, select: { id: true, price: true } });
    const bookings = [];
    // İki aktiviteyi toplam 4 rezervasyonla kapsayalım
    const plan = [0, 1, 0, 1].filter((idx) => experiences[idx]);
    for (let i = 0; i < plan.length; i++) {
      const exp = experiences[plan[i]];
      bookings.push(
        await createCompletedBooking({
          userId: customers[i % customers.length].id,
          experienceId: exp.id,
          price: exp.price,
          daysAgo: 8 + i * 4,
        })
      );
    }
    await seedReviewsFor({ bookings, ratings: [5, 4, 5, 5], customers, experienceOperatorId: experienceOperator.id });
    await recalculatePartnerTier({ experienceOperatorId: experienceOperator.id });
    console.log(`✔ ${bookings.length} tamamlanmış rezervasyon + review -> test.activity GOLD hedefleniyor`);
  }

  // --- SILVER: test.silver.operator ---
  const silverOperator = await prisma.tourOperator.findFirst({ where: { email: 'test.silver.operator@tourtech.com' } });
  if (silverOperator) {
    const tourIds = silverBronzeTours['test.silver.operator@tourtech.com'] || [];
    const bookings = [];
    for (let i = 0; i < 4; i++) {
      bookings.push(
        await createCompletedBooking({
          userId: customers[i % customers.length].id,
          tourId: tourIds[0],
          tourOperatorId: silverOperator.id,
          price: 4500,
          daysAgo: 6 + i * 3,
        })
      );
    }
    await seedReviewsFor({ bookings, ratings: [4, 4, 3, 4], customers, tourOperatorId: silverOperator.id });
    await recalculatePartnerTier({ tourOperatorId: silverOperator.id });
    console.log(`✔ ${bookings.length} tamamlanmış rezervasyon + review -> test.silver.operator SILVER hedefleniyor`);
  }

  // --- BRONZE: test.bronze.operator ---
  const bronzeOperator = await prisma.tourOperator.findFirst({ where: { email: 'test.bronze.operator@tourtech.com' } });
  if (bronzeOperator) {
    const tourIds = silverBronzeTours['test.bronze.operator@tourtech.com'] || [];
    const bookings = [];
    for (let i = 0; i < 4; i++) {
      bookings.push(
        await createCompletedBooking({
          userId: customers[i % customers.length].id,
          tourId: tourIds[0],
          tourOperatorId: bronzeOperator.id,
          price: 4500,
          daysAgo: 5 + i * 2,
        })
      );
    }
    await seedReviewsFor({ bookings, ratings: [3, 2, 3, 2], customers, tourOperatorId: bronzeOperator.id });
    await recalculatePartnerTier({ tourOperatorId: bronzeOperator.id });
    console.log(`✔ ${bookings.length} tamamlanmış rezervasyon + review -> test.bronze.operator BRONZE hedefleniyor`);
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
