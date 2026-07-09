import { prisma } from '@/lib/prisma';
import {
  computeTourPricing,
  countParticipants,
  getParticipantTotal,
  participantsToAdultChild,
} from '@/app/lib/booking-utils';
import { tourRequiresEquipment } from '@/app/lib/special-conditions';

export type CheckoutType = 'tour' | 'activity';

export async function buildCheckoutPreview(
  type: CheckoutType,
  itemId: string,
  dateId: string,
  participants: Record<string, number>
) {
  const participantTotal = getParticipantTotal(participants);
  if (participantTotal <= 0) {
    return { error: 'Katılımcı sayısı en az 1 olmalıdır', status: 400 as const };
  }

  if (type === 'tour') {
    const tourDate = await prisma.tourDate.findUnique({
      where: { id: dateId },
      include: {
        ageRanges: true,
        tour: {
          include: {
            tourOperator: {
              select: { id: true, companyName: true },
            },
          },
        },
      },
    });

    if (!tourDate || tourDate.tourId !== itemId) {
      return { error: 'Tur tarihi bulunamadı', status: 404 as const };
    }

    if (!tourDate.isActive || tourDate.status !== 'ACTIVE') {
      return { error: 'Bu tur tarihi artık aktif değil', status: 400 as const };
    }

    if (participantTotal > tourDate.availableSeats) {
      return { error: 'Yeterli kontenjan bulunmuyor', status: 400 as const };
    }

    const basePrice = tourDate.price;
    let totalPrice = 0;
    const breakdown: { label: string; count: number; unitPrice: number; subtotal: number }[] = [];

    if (Object.keys(participants).includes('total')) {
      totalPrice = basePrice * participantTotal;
      breakdown.push({
        label: 'Katılımcı',
        count: participantTotal,
        unitPrice: basePrice,
        subtotal: totalPrice,
      });
    } else {
      const { adults, children } = participantsToAdultChild(
        participants,
        tourDate.ageRanges
      );
      const pricing = computeTourPricing(
        basePrice,
        tourDate.ageRanges,
        adults,
        children
      );
      totalPrice = pricing.total;
      breakdown.push(...pricing.breakdown);
    }

    const rawImages = tourDate.tour.images;
    let images: string[] = [];
    if (Array.isArray(rawImages)) {
      images = rawImages as string[];
    } else if (typeof rawImages === 'string') {
      try {
        images = JSON.parse(rawImages);
      } catch {
        images = [];
      }
    }

    return {
      preview: {
        type: 'tour' as const,
        itemId,
        dateId,
        title: tourDate.tour.name,
        image: images[0] || null,
        location: tourDate.tour.departureCity || tourDate.tour.region || 'Türkiye',
        startDate: tourDate.startDate,
        endDate: tourDate.endDate,
        participants: countParticipants(participants, tourDate.ageRanges),
        totalPrice,
        breakdown,
        operator: tourDate.tour.tourOperator
          ? { name: tourDate.tour.tourOperator.companyName }
          : null,
        availableSeats: tourDate.availableSeats,
        requiresEquipment: tourRequiresEquipment(tourDate.tour),
      },
    };
  }

  const activityDate = await prisma.activityDate.findUnique({
    where: { id: dateId },
    include: {
      experience: {
        include: {
          user: {
            select: {
              experienceOperators: {
                select: { id: true, companyName: true },
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  if (!activityDate || activityDate.experienceId !== itemId) {
    return { error: 'Aktivite tarihi bulunamadı', status: 404 as const };
  }

  if (participantTotal > activityDate.availableSeats) {
    return { error: 'Yeterli kontenjan bulunmuyor', status: 400 as const };
  }

  const experience = activityDate.experience!;
  const totalPrice = activityDate.price * participantTotal;
  const operator = experience.user?.experienceOperators?.[0] ?? null;

  return {
    preview: {
      type: 'activity' as const,
      itemId,
      dateId,
      title: experience.title,
      image: experience.imageUrl,
      location: experience.location,
      startDate: activityDate.startDate,
      endDate: activityDate.endDate,
      participants: { adults: participantTotal, children: 0, total: participantTotal },
      totalPrice,
      breakdown: [
        {
          label: 'Katılımcı',
          count: participantTotal,
          unitPrice: activityDate.price,
          subtotal: totalPrice,
        },
      ],
      operator: operator ? { name: operator.companyName } : null,
      availableSeats: activityDate.availableSeats,
      requiresEquipment: false,
    },
  };
}
