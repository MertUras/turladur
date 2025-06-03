import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Tur tarihlerini getir
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
    
    // Partner'ı bul
    const tourOperator = await prisma.tourOperator.findFirst({
      where: { userId },
      select: { id: true }
    });

    if (!tourOperator) {
      return NextResponse.json({ error: 'Tour operator not found' }, { status: 404 });
    }

    // Turun partner'a ait olduğunu kontrol et
    const tour = await prisma.tour.findFirst({
      where: {
        id: params.tourId,
        tourOperatorId: tourOperator.id
      }
    });

    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    // Tur tarihlerini getir
    const tourDates = await prisma.tourDate.findMany({
      where: {
        tourId: params.tourId
      },
      orderBy: {
        startDate: 'asc'
      }
    });

    return NextResponse.json(tourDates);
  } catch (error) {
    console.error('Error fetching tour dates:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Yeni tur tarihi ekle
export async function POST(
  request: Request,
  { params }: { params: { tourId: string } }
) {
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

    // Turun partner'a ait olduğunu kontrol et
    const tour = await prisma.tour.findFirst({
      where: {
        id: params.tourId,
        tourOperatorId: tourOperator.id
      }
    });

    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    const data = await request.json();

    // Gerekli alanların kontrolü
    if (!data.startDate || !data.endDate || !data.price || !data.availableSeats) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Yeni tur tarihi oluştur
    const tourDate = await prisma.tourDate.create({
      data: {
        tourId: params.tourId,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        price: parseFloat(data.price),
        availableSeats: parseInt(data.availableSeats),
        discount: data.discount ? parseFloat(data.discount) : 0,
        isActive: data.isActive !== undefined ? data.isActive : true
      }
    });

    return NextResponse.json(tourDate);
  } catch (error) {
    console.error('Error creating tour date:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Tur tarihini güncelle
export async function PUT(
  request: Request,
  { params }: { params: { tourId: string; dateId: string } }
) {
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

    // Turun partner'a ait olduğunu kontrol et
    const tour = await prisma.tour.findFirst({
      where: {
        id: params.tourId,
        tourOperatorId: tourOperator.id
      }
    });

    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    const data = await request.json();

    // Gerekli alanların kontrolü
    if (!data.startDate || !data.endDate || !data.price || !data.availableSeats) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Tur tarihini güncelle
    const tourDate = await prisma.tourDate.update({
      where: {
        id: params.dateId,
        tourId: params.tourId
      },
      data: {
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        price: parseFloat(data.price),
        availableSeats: parseInt(data.availableSeats),
        discount: data.discount ? parseFloat(data.discount) : 0,
        isActive: data.isActive !== undefined ? data.isActive : true
      }
    });

    return NextResponse.json(tourDate);
  } catch (error) {
    console.error('Error updating tour date:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Tur tarihini sil
export async function DELETE(
  request: Request,
  { params }: { params: { tourId: string; dateId: string } }
) {
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

    // Turun partner'a ait olduğunu kontrol et
    const tour = await prisma.tour.findFirst({
      where: {
        id: params.tourId,
        tourOperatorId: tourOperator.id
      }
    });

    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    // Tur tarihini sil
    await prisma.tourDate.delete({
      where: {
        id: params.dateId,
        tourId: params.tourId
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tour date:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 