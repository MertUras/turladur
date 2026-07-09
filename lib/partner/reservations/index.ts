import { PartnerReservationsProvider } from './types';
import { prismaPartnerReservationsProvider } from './prisma-provider';

/**
 * Partner rezervasyon veri katmanı.
 * Şu an Prisma kullanılıyor; gelecekte Firebase sağlayıcısı buradan takılabilir.
 */
export function getPartnerReservationsProvider(): PartnerReservationsProvider {
  return prismaPartnerReservationsProvider;
}

export * from './types';
export * from './labels';
