import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { buildCheckoutPreview } from '@/app/lib/checkout';
import { parseParticipantsParam } from '@/app/lib/booking-utils';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const itemId = searchParams.get('itemId');
    const dateId = searchParams.get('dateId');
    const participants = parseParticipantsParam(searchParams.get('participants'));

    if (!type || !itemId || !dateId || (type !== 'tour' && type !== 'activity')) {
      return NextResponse.json({ error: 'Geçersiz checkout parametreleri' }, { status: 400 });
    }

    const result = await buildCheckoutPreview(type, itemId, dateId, participants);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result.preview);
  } catch (error) {
    console.error('Checkout preview error:', error);
    return NextResponse.json({ error: 'Önizleme yüklenemedi' }, { status: 500 });
  }
}
