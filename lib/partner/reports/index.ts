import { PartnerReportsProvider } from './types';
import { prismaPartnerReportsProvider } from './prisma-provider';

/**
 * Partner raporlama veri katmanı.
 * Prisma üzerinden rezervasyon verisi; ziyaretçi metrikleri booking proxy kullanır.
 */
export function getPartnerReportsProvider(): PartnerReportsProvider {
  return prismaPartnerReportsProvider;
}

export * from './types';
