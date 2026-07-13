import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  buildDepartureCityOptions,
  buildRegionOptions,
} from '@/lib/tours/filter-options';

export async function GET() {
  try {
    const [tours, priceStats] = await Promise.all([
      prisma.tour.findMany({
        select: {
          departureCity: true,
          region: true,
          destinations: true,
          pickupPoints: {
            where: { isActive: true },
            select: { city: true },
          },
        },
      }),
      prisma.tour.aggregate({
        _min: { price: true },
        _max: { price: true },
      }),
    ]);

    return NextResponse.json({
      departureCities: buildDepartureCityOptions(tours),
      regions: buildRegionOptions(tours),
      priceRange: {
        min: priceStats._min.price ?? 0,
        max: priceStats._max.price ?? 0,
      },
    });
  } catch (error) {
    console.error('Error fetching tour filters:', error);
    return NextResponse.json(
      { error: 'Filtre seçenekleri getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
