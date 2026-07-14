import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { resolveMembershipTier } from '@/lib/membership';
import {
  formatBookingDisplayDate,
  getBookingGuestCount,
  getExperienceRouteFields,
  getTourRouteFields,
  isBookingEligibleForPartnerReview,
  resolvePartnerReviewGroups,
} from '@/lib/user/bookings/booking-display';

// GET /api/user/bookings
// Giriş yapmış müşterinin kendi rezervasyonlarını (tur + aktivite + otel)
// döner. Her rezervasyon için, tur/aktivite süresi bitmiş ve henüz partner
// değerlendirmesi yapılmamışsa `canReviewPartner: true` işaretlenir.
// Aynı tur/aktivite + tarih aralığındaki birden fazla rezervasyon tek grupta
// birleştirilir; grupta yalnızca bir temsilci `canReviewPartner: true` alır.
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: session.user.id },
      include: {
        hotel: { select: { id: true, name: true, images: true, city: true } },
        tour: {
          select: {
            id: true,
            name: true,
            images: true,
            departureCity: true,
            destinations: true,
            tourOperator: { select: { id: true, companyName: true, rating: true, reviewCount: true } },
          },
        },
        experience: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
            location: true,
            meetingPoint: true,
            userId: true,
            user: {
              select: {
                experienceOperators: { select: { id: true, companyName: true, rating: true, reviewCount: true } },
              },
            },
          },
        },
        partnerReview: { select: { id: true, rating: true, comment: true } },
      },
      orderBy: { startDate: 'desc' },
    });

    const now = new Date();

    const formatted = resolvePartnerReviewGroups(
      bookings.map((booking) => {
      const experienceOperator = booking.experience?.user?.experienceOperators?.[0] ?? null;

      const isEligibleForReview = isBookingEligibleForPartnerReview({
        status: booking.status,
        endDate: booking.endDate,
        now,
      });
      const hasPartnerToReview = Boolean(
        (booking.tourId && booking.tour?.tourOperator) ||
          (booking.experienceId && experienceOperator)
      );
      const alreadyReviewed = Boolean(booking.partnerReview);
      const guestCount = getBookingGuestCount(booking.adults, booking.children);

      const tourRoute = booking.tour
        ? getTourRouteFields({
            departureCity: booking.tour.departureCity,
            destinations: booking.tour.destinations,
          })
        : null;

      const experienceRoute = booking.experience
        ? getExperienceRouteFields({
            location: booking.experience.location,
            meetingPoint: booking.experience.meetingPoint,
          })
        : null;

      const productTitle =
        booking.tour?.name ||
        booking.experience?.title ||
        booking.hotel?.name ||
        null;

      const operatorName =
        booking.tour?.tourOperator?.companyName ||
        experienceOperator?.companyName ||
        null;

      const fromLocation = tourRoute?.fromLocation ?? experienceRoute?.fromLocation ?? booking.hotel?.city ?? null;
      const toLocation = tourRoute?.toLocation ?? experienceRoute?.toLocation ?? null;
      const routeLabel = tourRoute?.routeLabel ?? experienceRoute?.routeLabel ?? booking.hotel?.city ?? null;

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
        specialRequests: booking.specialRequests,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
        hotelId: booking.hotelId,
        tourId: booking.tourId,
        experienceId: booking.experienceId,
        metadata: booking.metadata,
        hotel: booking.hotel,
        tour: booking.tour
          ? {
              id: booking.tour.id,
              name: booking.tour.name,
              images: booking.tour.images,
              departureCity: booking.tour.departureCity,
              destinations: booking.tour.destinations,
              operator: booking.tour.tourOperator
                ? {
                    id: booking.tour.tourOperator.id,
                    name: booking.tour.tourOperator.companyName,
                    rating: booking.tour.tourOperator.rating,
                    membershipTier: resolveMembershipTier(
                      booking.tour.tourOperator.rating,
                      booking.tour.tourOperator.reviewCount
                    ),
                  }
                : null,
            }
          : null,
        experience: booking.experience
          ? {
              id: booking.experience.id,
              title: booking.experience.title,
              imageUrl: booking.experience.imageUrl,
              location: booking.experience.location,
              meetingPoint: booking.experience.meetingPoint,
              operator: experienceOperator
                ? {
                    id: experienceOperator.id,
                    name: experienceOperator.companyName,
                    rating: experienceOperator.rating,
                    membershipTier: resolveMembershipTier(
                      experienceOperator.rating,
                      experienceOperator.reviewCount
                    ),
                  }
                : null,
            }
          : null,
        partnerReview: booking.partnerReview,
        canReviewPartner: isEligibleForReview && hasPartnerToReview && !alreadyReviewed,
        productTitle,
        operatorName,
        fromLocation,
        toLocation,
        routeLabel,
        displayDateLabel: formatBookingDisplayDate(booking.startDate),
        guestCount,
      };
    })
    );

    return NextResponse.json({ bookings: formatted });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
