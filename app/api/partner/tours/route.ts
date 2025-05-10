import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    
    // Partner'ı bul
    const tourOperator = await prisma.tourOperator.findFirst({
      where: { userId },
      select: { id: true }
    });

    if (!tourOperator) {
      return NextResponse.json({ error: 'Tour operator not found' }, { status: 404 });
    }

    // Partner'ın turlarını getir
    const tours = await prisma.tour.findMany({
      where: {
        tourOperatorId: tourOperator.id
      },
      include: {
        tourOperator: {
          select: {
            id: true,
            name: true,
            logo: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(tours);
  } catch (error) {
    console.error('Error fetching partner tours:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 