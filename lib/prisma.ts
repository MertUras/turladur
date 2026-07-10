import { Prisma, PrismaClient } from '@prisma/client';

/** PartnerReview kategori alanları — şema/client uyumsuzluğunu erken yakalamak için. */
const PARTNER_REVIEW_CATEGORY_FIELDS = [
  'guideRating',
  'operatorRating',
  'routeRating',
  'foodRating',
  'hotelRating',
  'transportRating',
  'guideFeedback',
  'foodFeedback',
] as const;

function assertPartnerReviewSchema() {
  if (typeof window !== 'undefined') return;
  if (process.env.NODE_ENV === 'production') return;

  const partnerReview = Prisma.dmmf.datamodel.models.find((m) => m.name === 'PartnerReview');
  const fieldNames = new Set(partnerReview?.fields.map((f) => f.name) ?? []);
  const missing = PARTNER_REVIEW_CATEGORY_FIELDS.filter((f) => !fieldNames.has(f));

  if (missing.length > 0) {
    throw new Error(
      `Prisma Client güncel değil (eksik PartnerReview alanları: ${missing.join(', ')}). ` +
        'Çalıştırın: npx prisma generate && npm run dev'
    );
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  assertPartnerReviewSchema();
  globalForPrisma.prisma = prisma;
} 