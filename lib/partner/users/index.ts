import { PartnerUsersProvider } from './types';
import { prismaPartnerUsersProvider } from './prisma-provider';

/**
 * Partner alt kullanıcı veri katmanı.
 * Şu an Prisma kullanılıyor; gelecekte Firebase sağlayıcısı buradan takılabilir.
 */
export function getPartnerUsersProvider(): PartnerUsersProvider {
  return prismaPartnerUsersProvider;
}

export * from './types';
