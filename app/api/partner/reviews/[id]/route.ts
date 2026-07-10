import { NextResponse } from 'next/server';
import { resolvePartnerContext } from '@/lib/partner/auth';
import { getPartnerReviewsProvider } from '@/lib/partner/reviews';

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
    const responseText = String(body.responseText || '').trim();

    if (!responseText) {
      return NextResponse.json({ error: 'Yanıt metni gerekli' }, { status: 400 });
    }

    const provider = getPartnerReviewsProvider();
    const context =
      partner.type === 'tour'
        ? {
            operatorType: 'tour' as const,
            tourOperatorId: partner.tourOperatorId,
            userId: partner.userId,
          }
        : {
            operatorType: 'experience' as const,
            experienceOperatorId: partner.experienceOperatorId,
            userId: partner.userId,
          };

    const updated = await provider.reply(context, id, responseText);

    if (!updated) {
      return NextResponse.json(
        { error: 'Değerlendirme bulunamadı veya bu işletmeye ait değil' },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error replying to review:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
