import { NextResponse } from 'next/server';
import { resolvePartnerContext } from '@/lib/partner/auth';
import { getPartnerReservationsProvider } from '@/lib/partner/reservations';

export async function GET(request: Request) {
  try {
    const partner = await resolvePartnerContext();
    if (!partner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const provider = getPartnerReservationsProvider();

    const operatorId =
      partner.type === 'tour' ? partner.tourOperatorId : partner.experienceOperatorId;

    const reservations = await provider.list(
      {
        operatorId,
        operatorType: partner.type,
        userId: partner.userId,
      },
      {
        search: searchParams.get('search') || '',
        status: searchParams.get('status') || 'all',
        payment: searchParams.get('payment') || 'all',
        sort: (searchParams.get('sort') || 'desc') as 'asc' | 'desc',
      }
    );

    return NextResponse.json(reservations);
  } catch (error) {
    console.error('Rezervasyonlar getirilirken hata:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
