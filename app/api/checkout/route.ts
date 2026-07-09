import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { BookingStatus, PaymentStatus, Prisma } from '@prisma/client';
import { generateBookingNumber, getParticipantTotal, parseParticipantsParam } from '@/app/lib/booking-utils';
import { getPaymentProvider, PaymentMethodType } from '@/app/lib/payments';
import { buildCheckoutPreview } from '@/app/lib/checkout';
import {
  SpecialConditionsData,
  buildSpecialRequestsText,
  formatSpecialConditionsSummary,
  isValidPhone,
  validateSpecialConditions,
} from '@/app/lib/special-conditions';

export const dynamic = 'force-dynamic';

interface CheckoutBody {
  type: 'tour' | 'activity';
  itemId: string;
  dateId: string;
  participants: Record<string, number> | string;
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    specialConditions?: SpecialConditionsData;
    specialRequests?: string;
  };
  paymentMethod: PaymentMethodType;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Giriş yapmanız gerekiyor' }, { status: 401 });
    }

    const body = (await request.json()) as CheckoutBody;
    const { type, itemId, dateId, contact, paymentMethod } = body;

    if (!type || !itemId || !dateId || !contact || !paymentMethod) {
      return NextResponse.json({ error: 'Eksik alanlar var' }, { status: 400 });
    }

    if (!contact.firstName?.trim() || !contact.lastName?.trim() || !contact.email?.trim() || !contact.phone?.trim()) {
      return NextResponse.json({ error: 'İletişim bilgileri eksik' }, { status: 400 });
    }

    if (!isValidPhone(contact.phone)) {
      return NextResponse.json({ error: 'Geçerli bir telefon numarası girin' }, { status: 400 });
    }

    const specialConditions: SpecialConditionsData = contact.specialConditions || {
      selected: [],
      details: {},
    };
    const conditionErrors = validateSpecialConditions(specialConditions);
    if (Object.keys(conditionErrors).length > 0) {
      const firstError = Object.values(conditionErrors)[0];
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    if (paymentMethod !== 'bank_transfer' && paymentMethod !== 'card') {
      return NextResponse.json({ error: 'Geçersiz ödeme yöntemi' }, { status: 400 });
    }

    const participants =
      typeof body.participants === 'string'
        ? parseParticipantsParam(body.participants)
        : body.participants;

    const previewResult = await buildCheckoutPreview(type, itemId, dateId, participants);
    if ('error' in previewResult) {
      return NextResponse.json({ error: previewResult.error }, { status: previewResult.status });
    }

    const preview = previewResult.preview;
    const participantTotal = getParticipantTotal(participants);
    const bookingNumber = generateBookingNumber();

    const conditionsText = buildSpecialRequestsText(specialConditions);
    const specialRequests = [
      conditionsText,
      contact.specialRequests?.trim(),
      `İletişim: ${contact.firstName} ${contact.lastName}`,
      `Tel: ${contact.phone}`,
      `E-posta: ${contact.email}`,
    ]
      .filter(Boolean)
      .join(' | ');

    const metadata: Prisma.InputJsonValue = {
      specialConditions,
      contact: {
        firstName: contact.firstName.trim(),
        lastName: contact.lastName.trim(),
        email: contact.email.trim(),
        phone: contact.phone.trim(),
      },
    };

    const booking = await prisma.$transaction(async (tx) => {
      if (type === 'tour') {
        const tourDate = await tx.tourDate.findUnique({
          where: { id: dateId },
          include: { tour: { select: { tourOperatorId: true } } },
        });
        if (!tourDate) throw new Error('Tur tarihi bulunamadı');

        const updated = await tx.tourDate.updateMany({
          where: {
            id: dateId,
            availableSeats: { gte: participantTotal },
          },
          data: {
            availableSeats: { decrement: participantTotal },
            soldSeats: { increment: participantTotal },
          },
        });

        if (updated.count === 0) {
          throw new Error('Kontenjan yetersiz');
        }

        return tx.booking.create({
          data: {
            bookingNumber,
            startDate: preview.startDate,
            endDate: preview.endDate,
            adults: preview.participants.adults,
            children: preview.participants.children,
            totalPrice: preview.totalPrice,
            status: BookingStatus.PENDING_PAYMENT,
            paymentStatus: PaymentStatus.UNPAID,
            paymentMethod,
            specialRequests,
            metadata,
            userId: session.user!.id,
            tourId: itemId,
            tourOperatorId: tourDate.tour.tourOperatorId,
          },
        });
      }

      const updated = await tx.activityDate.updateMany({
        where: {
          id: dateId,
          availableSeats: { gte: participantTotal },
        },
        data: {
          availableSeats: { decrement: participantTotal },
        },
      });

      if (updated.count === 0) {
        throw new Error('Kontenjan yetersiz');
      }

      return tx.booking.create({
        data: {
          bookingNumber,
          startDate: preview.startDate,
          endDate: preview.endDate,
          adults: preview.participants.adults,
          children: preview.participants.children,
          totalPrice: preview.totalPrice,
          status: BookingStatus.PENDING_PAYMENT,
          paymentStatus: PaymentStatus.UNPAID,
          paymentMethod,
          specialRequests,
          metadata,
          userId: session.user!.id,
          experienceId: itemId,
        },
      });
    });

    const provider = getPaymentProvider(paymentMethod);
    const paymentResult = await provider.initPayment({
      bookingId: booking.id,
      bookingNumber: booking.bookingNumber,
      amount: booking.totalPrice,
      currency: 'TRY',
      method: paymentMethod,
      customerEmail: contact.email,
    });

    return NextResponse.json({
      booking: {
        id: booking.id,
        bookingNumber: booking.bookingNumber,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        paymentMethod: booking.paymentMethod,
        totalPrice: booking.totalPrice,
        startDate: booking.startDate,
        endDate: booking.endDate,
        title: preview.title,
      },
      payment: paymentResult,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    const message = error instanceof Error ? error.message : 'Rezervasyon oluşturulamadı';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
