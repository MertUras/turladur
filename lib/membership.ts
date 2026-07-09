import { prisma } from './prisma';
import { MembershipTier } from '@prisma/client';

export type { MembershipTier };

// Bir partnerin GOLD/SILVER seviyesine çıkabilmesi için sahip olması gereken
// minimum değerlendirme sayısı. Yeterli veri yoksa (ör. henüz hiç tamamlanmış
// rezervasyonu değerlendirilmemiş yeni bir partner) seviye her zaman BRONZE'dur;
// böylece tek bir 5 yıldızlı değerlendirme partneri anında GOLD yapmaz.
export const MIN_REVIEWS_FOR_TIER = 3;

// Eşik değerleri: 5 üzerinden ortalama puana göre.
export const GOLD_THRESHOLD = 4.5;
export const SILVER_THRESHOLD = 3.5;

/**
 * Ortalama puan ve değerlendirme sayısına göre üyelik seviyesini hesaplar.
 * Satın alınan bir paket değildir; tamamen müşteri değerlendirmelerinden
 * otomatik türetilir.
 */
export function computeMembershipTier(averageRating: number, reviewCount: number): MembershipTier {
  if (reviewCount < MIN_REVIEWS_FOR_TIER) return 'BRONZE';
  if (averageRating >= GOLD_THRESHOLD) return 'GOLD';
  if (averageRating >= SILVER_THRESHOLD) return 'SILVER';
  return 'BRONZE';
}

interface RecalculateParams {
  tourOperatorId?: string | null;
  experienceOperatorId?: string | null;
}

/**
 * Bir PartnerReview eklendiğinde/silindiğinde çağrılır: ilgili operatörün tüm
 * PartnerReview kayıtlarının ortalamasını yeniden hesaplayıp `rating`,
 * `reviewCount` ve `membershipTier` alanlarını günceller. Basit, senkron bir
 * hesaplamadır; arka plan job/kuyruk gerektirmez.
 */
export async function recalculatePartnerTier({ tourOperatorId, experienceOperatorId }: RecalculateParams) {
  if (tourOperatorId) {
    const agg = await prisma.partnerReview.aggregate({
      where: { tourOperatorId },
      _avg: { rating: true },
      _count: { rating: true },
    });
    const averageRating = agg._avg.rating ?? 0;
    const reviewCount = agg._count.rating;
    await prisma.tourOperator.update({
      where: { id: tourOperatorId },
      data: {
        rating: averageRating,
        reviewCount,
        membershipTier: computeMembershipTier(averageRating, reviewCount),
      },
    });
  }

  if (experienceOperatorId) {
    const agg = await prisma.partnerReview.aggregate({
      where: { experienceOperatorId },
      _avg: { rating: true },
      _count: { rating: true },
    });
    const averageRating = agg._avg.rating ?? 0;
    const reviewCount = agg._count.rating;
    await prisma.experienceOperator.update({
      where: { id: experienceOperatorId },
      data: {
        rating: averageRating,
        reviewCount,
        membershipTier: computeMembershipTier(averageRating, reviewCount),
      },
    });
  }
}
