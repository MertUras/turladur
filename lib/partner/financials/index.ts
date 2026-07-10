import { PartnerFinancialsProvider } from './types';
import { prismaPartnerFinancialsProvider } from './prisma-provider';

/**
 * Partner finansal veri katmanı.
 * Şu an Prisma kullanılıyor; gelecekte Firebase sağlayıcısı buradan takılabilir.
 */
export function getPartnerFinancialsProvider(): PartnerFinancialsProvider {
  return prismaPartnerFinancialsProvider;
}

export * from './types';
