import { NextResponse } from 'next/server';
import { BookingStatus } from '@prisma/client';
import { resolvePartnerContext } from '@/lib/partner/auth';
import {
  PartnerReservationStatusUpdate,
  getPartnerReservationsProvider,
} from '@/lib/partner/reservations';

const ALLOWED_STATUSES: PartnerReservationStatusUpdate[] = [
  BookingStatus.CONFIRMED,
  BookingStatus.CANCELLED,
  BookingStatus.SUSPENDED,
];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const partner = await resolvePartnerContext();
    if (!partner) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const status = String(body.status || '').toUpperCase() as BookingStatus;

    if (!ALLOWED_STATUSES.includes(status as PartnerReservationStatusUpdate)) {
      return NextResponse.json(
        { error: 'Geçersiz durum. İzin verilen: CONFIRMED, CANCELLED, SUSPENDED' },
        { status: 400 }
      );
    }

    const provider = getPartnerReservationsProvider();
    const operatorId =
      partner.type === 'tour' ? partner.tourOperatorId : partner.experienceOperatorId;

    const updated = await provider.updateStatus(
      {
        operatorId,
        operatorType: partner.type,
        userId: partner.userId,
      },
      id,
      status as PartnerReservationStatusUpdate
    );

    if (!updated) {
      return NextResponse.json(
        { error: 'Rezervasyon bulunamadı veya bu işletmeye ait değil' },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Rezervasyon güncellenirken hata:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
