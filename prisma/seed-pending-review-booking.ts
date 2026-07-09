// Tek seferlik yardımcı script: "Partneri Değerlendir" CTA'sını test edebilmek
// için musteri1@tourtech.com hesabına, TAMAMLANMIŞ ama HENÜZ DEĞERLENDİRİLMEMİŞ
// bir tur rezervasyonu ekler (endDate geçmişte, partnerReview kaydı YOK).
//
// Çalıştırma: npx ts-node prisma/seed-pending-review-booking.ts
import { PrismaClient, BookingStatus, PaymentStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const customer = await prisma.user.findUnique({ where: { email: 'musteri1@tourtech.com' } });
  if (!customer) {
    throw new Error('musteri1@tourtech.com bulunamadı. Önce prisma/seed-partner-reviews.ts çalıştırılmış olmalı.');
  }

  // test.operator'ın (GOLD) daha önce review'lenmemiş bir turunu kullanalım.
  const tourOperator = await prisma.tourOperator.findFirst({ where: { email: 'test.operator@tourtech.com' } });
  if (!tourOperator) {
    throw new Error('test.operator@tourtech.com için TourOperator bulunamadı.');
  }

  const tour = await prisma.tour.findFirst({
    where: { tourOperatorId: tourOperator.id, name: 'Kapadokya Kültür Turu' },
    select: { id: true, price: true, name: true },
  });
  if (!tour) {
    throw new Error('Kapadokya Kültür Turu bulunamadı.');
  }

  const existing = await prisma.booking.findFirst({
    where: { userId: customer.id, tourId: tour.id, partnerReview: null, status: BookingStatus.COMPLETED },
  });
  if (existing) {
    console.log(`✔ Zaten değerlendirilmemiş bir rezervasyon mevcut: ${existing.bookingNumber} (${tour.name})`);
    return;
  }

  const endDate = new Date();
  endDate.setDate(endDate.getDate() - 3);
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 4);

  const booking = await prisma.booking.create({
    data: {
      bookingNumber: `TT-PENDING-${Date.now()}`,
      startDate,
      endDate,
      adults: 2,
      children: 0,
      totalPrice: tour.price,
      status: BookingStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
      userId: customer.id,
      tourId: tour.id,
      tourOperatorId: tourOperator.id,
    },
  });

  console.log(`✔ Değerlendirme bekleyen yeni rezervasyon oluşturuldu: ${booking.bookingNumber} (${tour.name}) -> musteri1@tourtech.com`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
