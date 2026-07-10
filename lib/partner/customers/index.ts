import { PartnerCustomersProvider } from './types';
import { prismaPartnerCustomersProvider } from './prisma-provider';

/**
 * Partner müşteri veri katmanı.
 * Şu an Prisma kullanılıyor; gelecekte Firebase sağlayıcısı buradan takılabilir.
 */
export function getPartnerCustomersProvider(): PartnerCustomersProvider {
  return prismaPartnerCustomersProvider;
}

export * from './types';
