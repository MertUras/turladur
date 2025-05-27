import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

type BookingWithRelations = Prisma.BookingGetPayload<{
  include: {
    user: {
      select: {
        name: true;
        email: true;
        phone: true;
      }
    };
    tour: {
      select: {
        name: true;
        duration: true;
      }
    }
  }
}>;

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // URL'den query parametrelerini al
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const paymentStatus = searchParams.get('payment') || 'all';
    const sortOrder = searchParams.get('sort') || 'desc';

    // Filtreleme koşullarını oluştur
    const where: any = {
      tourOperatorId: session.user.id,
    };

    if (searchTerm) {
      where.OR = [
        { bookingNumber: { contains: searchTerm, mode: 'insensitive' } },
        { user: { name: { contains: searchTerm, mode: 'insensitive' } } },
        { tour: { name: { contains: searchTerm, mode: 'insensitive' } } },
      ];
    }

    if (status !== 'all') {
      where.status = status.toUpperCase();
    }

    if (paymentStatus !== 'all') {
      where.paymentStatus = paymentStatus.toUpperCase();
    }

    // Rezervasyonları getir
    const reservations = await prisma.booking.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          }
        },
        tour: {
          select: {
            name: true,
            duration: true,
          }
        }
      },
      orderBy: {
        startDate: sortOrder as 'asc' | 'desc'
      }
    });

    // Frontend'e uygun formata dönüştür
    const formattedReservations = reservations.map((booking: BookingWithRelations) => ({
      id: booking.id,
      referenceNumber: booking.bookingNumber,
      customerName: booking.user.name || 'İsimsiz Müşteri',
      tourName: booking.tour?.name || 'Belirtilmemiş',
      date: booking.startDate.toISOString(),
      participants: booking.adults + booking.children,
      totalPrice: booking.totalPrice,
      status: booking.status.toLowerCase(),
      paymentStatus: booking.paymentStatus.toLowerCase(),
      contactInfo: {
        email: booking.user.email,
        phone: booking.user.phone || ''
      },
      notes: booking.specialRequests
    }));

    return NextResponse.json(formattedReservations);
  } catch (error) {
    console.error('Rezervasyonlar getirilirken hata:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 