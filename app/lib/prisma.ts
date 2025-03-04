import { PrismaClient } from '@prisma/client';

// PrismaClient örneğini global olarak tanımlama
// Bu, geliştirme sırasında hot-reload nedeniyle birden fazla bağlantı oluşmasını önler
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma; 