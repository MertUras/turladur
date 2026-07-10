import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { resolvePartnerContext } from '@/lib/partner/auth';
import {
  getPartnerTourDatesProvider,
  TourDateAction,
} from '@/lib/partner/tour-dates';

const VALID_ACTIONS = new Set<TourDateAction>(['complete', 'cancel']);

// Tur tarihini tamamla veya iptal et
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ tourId: string; dateId: string }> }
) {
  try {
    const partner = await resolvePartnerContext();
    if (!partner || partner.type !== 'tour') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const { tourId, dateId } = await params;
    const body = await request.json();
    const action = String(body.action || '') as TourDateAction;

    if (!VALID_ACTIONS.has(action)) {
      return NextResponse.json(
        { error: 'Geçersiz işlem. İzin verilen: complete, cancel' },
        { status: 400 }
      );
    }

    const provider = getPartnerTourDatesProvider();
    const context = { tourOperatorId: partner.tourOperatorId };

    let result;
    try {
      result =
        action === 'complete'
          ? await provider.completeTourDate(context, tourId, dateId)
          : await provider.cancelTourDate(context, tourId, dateId);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Tur tarihi güncellenemedi';
      return NextResponse.json({ error: message }, { status: 409 });
    }

    if (!result) {
      return NextResponse.json(
        { error: 'Tur tarihi bulunamadı veya bu işletmeye ait değil' },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating tour date status:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

// Tur tarihini güncelle
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ tourId: string; dateId: string }> }
) {
  try {
    const { tourId, dateId } = await params;
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
        id: tourId,
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
        id: dateId,
        tourId: tourId
      },
      data: {
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        price: parseFloat(data.price),
        availableSeats: parseInt(data.availableSeats),
        minParticipants: data.minParticipants ? parseInt(data.minParticipants) : null,
        maxParticipants: data.maxParticipants ? parseInt(data.maxParticipants) : null,
        earlyBirdDiscount: data.earlyBirdDiscount ? parseFloat(data.earlyBirdDiscount) : 0,
        lastMinuteDiscount: data.lastMinuteDiscount ? parseFloat(data.lastMinuteDiscount) : 0,
        earlyBirdDeadlineStart: data.earlyBirdDeadlineStart ? new Date(data.earlyBirdDeadlineStart) : null,
        earlyBirdDeadline: data.earlyBirdDeadlineEnd ? new Date(data.earlyBirdDeadlineEnd) : null,
        lastMinuteStart: data.lastMinuteStartStart ? new Date(data.lastMinuteStartStart) : null,
        lastMinuteStartEnd: data.lastMinuteStartEnd ? new Date(data.lastMinuteStartEnd) : null,
        notes: data.notes || '',
        status: data.status || 'ACTIVE',
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
  { params }: { params: Promise<{ tourId: string; dateId: string }> }
) {
  try {
    const { tourId, dateId } = await params;
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
        id: tourId,
        tourOperatorId: tourOperator.id
      }
    });

    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    // Tur tarihini sil
    await prisma.tourDate.delete({
      where: {
        id: dateId,
        tourId: tourId
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