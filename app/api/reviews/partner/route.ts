import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { recalculatePartnerTier } from '@/lib/membership';
import {
  computeReviewOverall,
  mapCategoryFeedbackToDb,
  SubmitPartnerReviewRequest,
  validateCategoryRatings,
} from '@/lib/reviews';
import { createPartnerReview } from '@/lib/reviews/partner-review-queries';
import {
  buildPartnerReviewGroupKey,
  getReviewedViaBookingId,
  isBookingDirectlyOrIndirectlyReviewed,
} from '@/lib/user/bookings/booking-display';

// POST /api/reviews/partner
// Müşteri, süresi dolmuş (endDate geçmiş) bir rezervasyonu kategori bazlı
// 1-5 yıldız üzerinden değerlendirir. Değerlendirme ÜRÜNE değil, o rezervasyonu
// gerçekleştiren PARTNERE (tur operatörü / aktivite sağlayıcısı) aittir.
// Aynı tur/aktivite + tarih aralığındaki birden fazla rezervasyon tek değerlendirme
// olarak kabul edilir; yalnızca bir PartnerReview kaydı oluşturulur.
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as SubmitPartnerReviewRequest & {
      // Geriye dönük uyumluluk: eski tek puanlı istekler
      rating?: number;
    };

    const { bookingId, comment, categoryRatings, categoryFeedback, reviewGroupKey } = body;

    if (!bookingId) {
      return NextResponse.json({ error: 'Rezervasyon kimliği gerekli.' }, { status: 400 });
    }

    let overallRating: number;
    let categoryData: {
      guideRating: number;
      operatorRating: number;
      routeRating: number;
      foodRating: number;
      hotelRating: number;
      transportRating: number;
    } | null = null;

    if (categoryRatings && validateCategoryRatings(categoryRatings)) {
      overallRating = computeReviewOverall(categoryRatings);
      categoryData = categoryRatings;
    } else if (typeof body.rating === 'number' && body.rating >= 1 && body.rating <= 5) {
      // Eski tek puanlı API uyumluluğu
      overallRating = Math.round(body.rating);
    } else {
      return NextResponse.json(
        { error: 'Geçersiz değerlendirme. Tüm kategoriler için 1-5 arası puan gerekli.' },
        { status: 400 }
      );
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

    const resolvedGroupKey = buildPartnerReviewGroupKey(booking);
    if (reviewGroupKey && resolvedGroupKey && reviewGroupKey !== resolvedGroupKey) {
      return NextResponse.json({ error: 'Değerlendirme grubu eşleşmiyor' }, { status: 400 });
    }

    const groupBookings = resolvedGroupKey
      ? await prisma.booking.findMany({
          where: {
            userId: session.user.id,
            tourId: booking.tourId,
            experienceId: booking.experienceId,
            startDate: booking.startDate,
            endDate: booking.endDate,
          },
          select: {
            id: true,
            partnerReview: { select: { id: true } },
            metadata: true,
          },
        })
      : [
          {
            id: booking.id,
            partnerReview: booking.partnerReview,
            metadata: booking.metadata,
          },
        ];

    const groupAlreadyReviewed = groupBookings.some((groupBooking) =>
      isBookingDirectlyOrIndirectlyReviewed({
        partnerReview: groupBooking.partnerReview,
        reviewedViaBookingId: getReviewedViaBookingId(groupBooking.metadata),
      })
    );

    if (groupAlreadyReviewed) {
      return NextResponse.json(
        { error: 'Bu tur tarihi için zaten bir değerlendirme yapıldı' },
        { status: 409 }
      );
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

    const feedbackData = mapCategoryFeedbackToDb(categoryFeedback);

    const review = await createPartnerReview({
      rating: overallRating,
      comment: comment?.trim() || null,
      categoryData,
      feedbackData,
      userId: session.user.id,
      bookingId: booking.id,
      tourOperatorId,
      experienceOperatorId,
    });

    const siblingBookings = groupBookings.filter((groupBooking) => groupBooking.id !== booking.id);
    if (siblingBookings.length > 0) {
      await Promise.all(
        siblingBookings.map((sibling) => {
          const existingMetadata =
            sibling.metadata &&
            typeof sibling.metadata === 'object' &&
            !Array.isArray(sibling.metadata)
              ? (sibling.metadata as Record<string, unknown>)
              : {};

          const nextMetadata: Prisma.InputJsonValue = {
            ...existingMetadata,
            reviewedViaBookingId: booking.id,
          };

          return prisma.booking.update({
            where: { id: sibling.id },
            data: { metadata: nextMetadata },
          });
        })
      );
    }

    try {
      await recalculatePartnerTier({ tourOperatorId, experienceOperatorId });
    } catch (tierError) {
      console.error('Partner tier recalculation failed after review save:', tierError);
    }

    return NextResponse.json({ success: true, reviewId: review.id, overallRating });
  } catch (error) {
    console.error('Error submitting partner review:', error);

    const isDev = process.env.NODE_ENV === 'development';
    const prismaHint =
      error instanceof Error && error.message.includes('Unknown argument')
        ? ' Prisma Client güncel değil; npx prisma generate çalıştırıp dev sunucusunu yeniden başlatın.'
        : '';

    const detail =
      error instanceof Error ? `${error.message}${prismaHint}` : String(error);

    return NextResponse.json(
      {
        error: isDev ? detail : 'Değerlendirme kaydedilemedi',
        ...(isDev && { detail }),
      },
      { status: 500 }
    );
  }
}
