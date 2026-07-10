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
 * otomatik türetilir. Puan, operatörün operatorRating ortalamasıdır
 * (bkz. lib/reviews/scoring.ts).
 */
export function computeMembershipTier(averageRating: number, reviewCount: number): MembershipTier {
  if (reviewCount < MIN_REVIEWS_FOR_TIER) return 'BRONZE';
  if (averageRating >= GOLD_THRESHOLD) return 'GOLD';
  if (averageRating >= SILVER_THRESHOLD) return 'SILVER';
  return 'BRONZE';
}

export { recalculatePartnerTier } from './reviews/recalculate';
