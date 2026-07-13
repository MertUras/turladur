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
  const role = session.user.role;

  if (role === 'EXPERIENCE_PROVIDER') {
    if (session.user.experienceOperatorId) {
      return {
        type: 'experience',
        experienceOperatorId: session.user.experienceOperatorId,
        userId,
      };
    }

    const experienceOperator = await prisma.experienceOperator.findFirst({
      where: { userId },
      select: { id: true },
    });
    if (!experienceOperator) return null;
    return { type: 'experience', experienceOperatorId: experienceOperator.id, userId };
  }

  if (role === 'TOUR_OPERATOR') {
    if (session.user.tourOperatorId) {
      return {
        type: 'tour',
        tourOperatorId: session.user.tourOperatorId,
        userId,
      };
    }

    const tourOperator = await prisma.tourOperator.findFirst({
      where: { userId },
      select: { id: true },
    });
    if (!tourOperator) return null;
    return { type: 'tour', tourOperatorId: tourOperator.id, userId };
  }

  return null;
}
