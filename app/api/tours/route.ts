import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const tours = await prisma.tour.findMany({
      include: {
        tourOperator: {
          select: {
            name: true,
            logo: true
          }
        },
        bookings: true
      },
      where: {
        featured: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 6 // Ana sayfada gösterilecek tur sayısı
    });

    return NextResponse.json(tours);
  } catch (error) {
    console.error('Turlar getirilirken hata:', error);
    return NextResponse.json(
      { error: 'Turlar getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 