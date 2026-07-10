import { PartnerDashboardProvider } from './types';
import { prismaPartnerDashboardProvider } from './prisma-provider';

/**
 * Partner dashboard veri katmanı.
 * Şu an Prisma kullanılıyor; gelecekte Firebase sağlayıcısı buradan takılabilir.
 */
export function getPartnerDashboardProvider(): PartnerDashboardProvider {
  return prismaPartnerDashboardProvider;
}

export * from './types';
