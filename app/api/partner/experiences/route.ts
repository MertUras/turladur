import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Kullanıcıya ait ExperienceOperator kaydını bul
    const experienceOperator = await prisma.experienceOperator.findFirst({
      where: { userId: session.user.id },
      select: { id: true }
    });

    if (!experienceOperator) {
      return NextResponse.json({ error: 'Experience operator not found' }, { status: 404 });
    }

    // Sadece bu operatöre ait aktiviteleri getir
    const experiences = await prisma.experience.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(experiences);
  } catch (error) {
    console.error('Error fetching partner experiences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 