import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET /api/user/bookings
// Giriş yapmış müşterinin kendi rezervasyonlarını (tur + aktivite + otel)
// döner. Her rezervasyon için, tur/aktivite süresi bitmiş ve henüz partner
// değerlendirmesi yapılmamışsa `canReviewPartner: true` işaretlenir; böylece
// arayüz "Partneri Değerlendir" CTA'sını ne zaman göstereceğini bilir.
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: session.user.id },
      include: {
        hotel: { select: { id: true, name: true, images: true } },
        tour: {
          select: {
            id: true,
            name: true,
            images: true,
            tourOperator: { select: { id: true, companyName: true, rating: true, membershipTier: true } },
          },
        },
        experience: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
            userId: true,
            user: {
              select: {
                experienceOperators: { select: { id: true, companyName: true, rating: true, membershipTier: true } },
              },
            },
          },
        },
        partnerReview: { select: { id: true, rating: true, comment: true } },
      },
      orderBy: { startDate: 'desc' },
    });

    const now = new Date();

    const formatted = bookings.map((booking) => {
      const isCompletedByDate = new Date(booking.endDate) < now && booking.status !== 'CANCELLED';
      const hasPartnerToReview = Boolean(booking.tourId || booking.experienceId);
      const alreadyReviewed = Boolean(booking.partnerReview);

      const experienceOperator = booking.experience?.user?.experienceOperators?.[0] ?? null;

      return {
        id: booking.id,
        bookingNumber: booking.bookingNumber,
        startDate: booking.startDate,
        endDate: booking.endDate,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        totalPrice: booking.totalPrice,
        adults: booking.adults,
        children: booking.children,
        hotelId: booking.hotelId,
        tourId: booking.tourId,
        experienceId: booking.experienceId,
        hotel: booking.hotel,
        tour: booking.tour
          ? {
              id: booking.tour.id,
              name: booking.tour.name,
              images: booking.tour.images,
              operator: booking.tour.tourOperator
                ? { id: booking.tour.tourOperator.id, name: booking.tour.tourOperator.companyName, rating: booking.tour.tourOperator.rating, membershipTier: booking.tour.tourOperator.membershipTier }
                : null,
            }
          : null,
        experience: booking.experience
          ? {
              id: booking.experience.id,
              title: booking.experience.title,
              imageUrl: booking.experience.imageUrl,
              operator: experienceOperator
                ? { id: experienceOperator.id, name: experienceOperator.companyName, rating: experienceOperator.rating, membershipTier: experienceOperator.membershipTier }
                : null,
            }
          : null,
        partnerReview: booking.partnerReview,
        canReviewPartner: isCompletedByDate && hasPartnerToReview && !alreadyReviewed,
      };
    });

    return NextResponse.json({ bookings: formatted });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
