import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { recalculatePartnerTier } from '@/lib/membership';

// POST /api/reviews/partner
// Müşteri, süresi dolmuş (endDate geçmiş) bir rezervasyonu 1-5 yıldız
// üzerinden değerlendirir. Değerlendirme ÜRÜNE değil, o rezervasyonu
// gerçekleştiren PARTNERE (tur operatörü / aktivite sağlayıcısı) aittir.
// Bir booking için en fazla bir değerlendirme yapılabilir.
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { bookingId, rating, comment } = body as { bookingId?: string; rating?: number; comment?: string };

    if (!bookingId || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Geçersiz değerlendirme. 1-5 arası bir puan gerekli.' }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        tour: { select: { tourOperatorId: true } },
        experience: { select: { userId: true } },
        partnerReview: { select: { id: true } },
      },
    });

    if (!booking || booking.userId !== session.user.id) {
      return NextResponse.json({ error: 'Rezervasyon bulunamadı' }, { status: 404 });
    }

    if (booking.partnerReview) {
      return NextResponse.json({ error: 'Bu rezervasyon için zaten bir değerlendirme yapıldı' }, { status: 409 });
    }

    if (new Date(booking.endDate) > new Date()) {
      return NextResponse.json({ error: 'Değerlendirme yalnızca tamamlanan rezervasyonlar için yapılabilir' }, { status: 400 });
    }

    if (booking.status === 'CANCELLED') {
      return NextResponse.json({ error: 'İptal edilen rezervasyonlar değerlendirilemez' }, { status: 400 });
    }

    let tourOperatorId: string | null = null;
    let experienceOperatorId: string | null = null;

    if (booking.tourId) {
      tourOperatorId = booking.tour?.tourOperatorId ?? booking.tourOperatorId ?? null;
    } else if (booking.experienceId && booking.experience?.userId) {
      const experienceOperator = await prisma.experienceOperator.findFirst({
        where: { userId: booking.experience.userId },
        select: { id: true },
      });
      experienceOperatorId = experienceOperator?.id ?? null;
    }

    if (!tourOperatorId && !experienceOperatorId) {
      return NextResponse.json({ error: 'Bu rezervasyon bir partnere bağlı değil' }, { status: 400 });
    }

    await prisma.partnerReview.create({
      data: {
        rating: Math.round(rating),
        comment: comment?.trim() || null,
        userId: session.user.id,
        bookingId: booking.id,
        tourOperatorId,
        experienceOperatorId,
      },
    });

    await recalculatePartnerTier({ tourOperatorId, experienceOperatorId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error submitting partner review:', error);
    return NextResponse.json({ error: 'Değerlendirme kaydedilemedi' }, { status: 500 });
  }
}
