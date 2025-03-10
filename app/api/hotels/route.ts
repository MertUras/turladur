import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const hotels = await prisma.hotel.findMany({
      include: {
        rooms: true,
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
      orderBy: {
        createdAt: 'desc'
      },
      take: 6 // Ana sayfada gösterilecek otel sayısı
    });

    // Otellerin amenities ve images alanlarını parse et
    const parsedHotels = hotels.map(hotel => ({
      ...hotel,
      amenities: JSON.parse(hotel.amenities as string),
      images: JSON.parse(hotel.images as string)
    }));

    return NextResponse.json(parsedHotels);
  } catch (error) {
    console.error('Oteller getirilirken hata:', error);
    return NextResponse.json(
      { error: 'Oteller getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 