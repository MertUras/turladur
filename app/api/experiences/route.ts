import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      include: {
        provider: {
          select: {
            name: true,
            image: true
          }
        },
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                image: true
              }
            }
          }
        }
      },
      where: {
        featured: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 6 // Ana sayfada gösterilecek deneyim sayısı
    });

    return NextResponse.json(experiences);
  } catch (error) {
    console.error('Deneyimler getirilirken hata:', error);
    return NextResponse.json(
      { error: 'Deneyimler getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 