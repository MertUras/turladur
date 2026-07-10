import { PartnerTourDatesProvider } from './types';
import { prismaPartnerTourDatesProvider } from './prisma-provider';

/**
 * Partner tur tarihi veri katmanı.
 * Şu an Prisma kullanılıyor; gelecekte Firebase sağlayıcısı buradan takılabilir.
 */
export function getPartnerTourDatesProvider(): PartnerTourDatesProvider {
  return prismaPartnerTourDatesProvider;
}

export * from './types';
