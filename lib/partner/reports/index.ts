import { PartnerReportsProvider } from './types';
import { prismaPartnerReportsProvider } from './prisma-provider';

/**
 * Partner raporlama veri katmanı.
 * Şu an Prisma kullanılıyor; ziyaretçi analitiği Firebase için ayrıldı.
 */
export function getPartnerReportsProvider(): PartnerReportsProvider {
  return prismaPartnerReportsProvider;
}

export * from './types';
