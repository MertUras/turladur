import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Tur detaylarını getir
export async function GET(
  request: Request,
  { params }: { params: { tourId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const tourId = params.tourId;
    
    // Partner'ı bul
    const partner = await prisma.tourOperator.findFirst({
      where: { userId },
      select: { id: true }
    });

    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    // Turu bul ve partner'a ait olduğunu kontrol et
    const tour = await prisma.tour.findFirst({
      where: {
        id: tourId,
        tourOperatorId: partner.id
      },
      include: {
        tourOperator: {
          select: {
            id: true,
            name: true,
            logo: true
          }
        }
      }
    });

    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    return NextResponse.json(tour);
  } catch (error) {
    console.error('Error fetching tour:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Turu güncelle
export async function PUT(
  request: Request,
  { params }: { params: { tourId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const tourId = params.tourId;
    const data = await request.json();
    
    // Partner'ı bul
    const partner = await prisma.tourOperator.findFirst({
      where: { userId },
      select: { id: true }
    });

    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    // Turu bul ve partner'a ait olduğunu kontrol et
    const tour = await prisma.tour.findFirst({
      where: {
        id: tourId,
        tourOperatorId: partner.id
      }
    });

    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    // Turu güncelle
    const updatedTour = await prisma.tour.update({
      where: { id: tourId },
      data: {
        name: data.name,
        description: data.description,
        duration: data.duration,
        price: data.price,
        discount: data.discount,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        maxParticipants: data.maxParticipants,
        destinations: data.destinations,
        inclusions: data.inclusions,
        exclusions: data.exclusions,
        itinerary: data.itinerary,
        images: data.images,
        featured: data.featured,
        departureCity: data.departureCity,
        region: data.region,
        transportation: data.transportation,
        period: data.period,
        tourType: data.tourType,
        accommodationType: data.accommodationType,
        difficultyLevel: data.difficultyLevel,
        ageRestriction: data.ageRestriction,
        isPopular: data.isPopular,
        isLastMinute: data.isLastMinute,
        isEarlyBird: data.isEarlyBird,
        languages: data.languages,
        tags: data.tags,
        updatedAt: new Date()
      },
      include: {
        tourOperator: {
          select: {
            id: true,
            companyName: true,
            logo: true
          }
        }
      }
    });

    // 1. Mevcut tarihleri sil
await prisma.tourDate.deleteMany({
  where: { tourId }
});

// 2. Yeni tarihleri ekle
if (Array.isArray(data.tourDates)) {
  await prisma.tourDate.createMany({
    data: data.tourDates.map((date: { startDate: string; endDate: string }) => ({
      startDate: new Date(date.startDate),
      endDate: new Date(date.endDate),
      tourId
    }))
  });
}

return NextResponse.json(updatedTour);

    return NextResponse.json(updatedTour);
  } catch (error) {
    console.error('Error updating tour:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Turu sil
export async function DELETE(
  request: Request,
  { params }: { params: { tourId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const tourId = params.tourId;
    
    // Partner'ı bul
    const partner = await prisma.tourOperator.findFirst({
      where: { userId },
      select: { id: true }
    });

    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

// Turu bul ve partner'a ait olduğunu kontrol et
const tour = await prisma.tour.findFirst({
  where: {
    id: tourId,
    tourOperatorId: partner.id
  },
  include: {
    tourOperator: {
      select: {
        id: true,
        companyName: true,
        logo: true
      }
    },
    tourDates: true // ← BURASI EKLENDİ
  }
});


    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    // Turu sil
    await prisma.tour.delete({
      where: { id: tourId }
    });

    return NextResponse.json({ message: 'Tour deleted successfully' });
  } catch (error) {
    console.error('Error deleting tour:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 