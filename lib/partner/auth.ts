import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export type PartnerContext =
  | { type: 'tour'; tourOperatorId: string; userId: string }
  | { type: 'experience'; experienceOperatorId: string; userId: string };

export async function resolvePartnerContext(): Promise<PartnerContext | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const userId = session.user.id;

  if (session.user.role === 'EXPERIENCE_PROVIDER') {
    const experienceOperator = await prisma.experienceOperator.findFirst({
      where: { userId },
      select: { id: true },
    });
    if (!experienceOperator) return null;
    return { type: 'experience', experienceOperatorId: experienceOperator.id, userId };
  }

  const tourOperator = await prisma.tourOperator.findFirst({
    where: { userId },
    select: { id: true },
  });
  if (!tourOperator) return null;
  return { type: 'tour', tourOperatorId: tourOperator.id, userId };
}
