import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    
    // Partner'ı bul
    const tourOperator = await prisma.tourOperator.findFirst({
      where: { userId },
      select: { id: true }
    });

    if (!tourOperator) {
      return NextResponse.json({ error: 'Tour operator not found' }, { status: 404 });
    }

    // İstatistikleri hesapla
    const [
      totalTours,
      totalBookings,
      totalRevenue,
      totalCustomers,
      averageRating,
      upcomingTours,
      recentReservations,
      popularTours,
      reservationStatus
    ] = await Promise.all([
      // Toplam tur sayısı
      prisma.tour.count({
        where: { tourOperatorId: tourOperator.id }
      }),
      // Toplam rezervasyon sayısı
      prisma.booking.count({
        where: { tourOperatorId: tourOperator.id }
      }),
      // Toplam gelir
      prisma.booking.aggregate({
        where: { 
          tourOperatorId: tourOperator.id,
          status: { in: ['CONFIRMED', 'COMPLETED'] }
        },
        _sum: { totalPrice: true }
      }),
      // Toplam müşteri sayısı
      prisma.booking.groupBy({
        by: ['userId'],
        where: { tourOperatorId: tourOperator.id }
      }).then(result => result.length),
      // Ortalama puan
      prisma.tour.aggregate({
        where: { tourOperatorId: tourOperator.id },
        _avg: { rating: true }
      }),
      // Yaklaşan turlar
      prisma.tour.count({
        where: {
          tourOperatorId: tourOperator.id,
          startDate: { gt: new Date() }
        }
      }),
      // Son rezervasyonlar
      prisma.booking.findMany({
        where: { tourOperatorId: tourOperator.id },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          },
          tour: {
            select: {
              name: true,
              duration: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      // Popüler turlar
      prisma.tour.findMany({
        where: { tourOperatorId: tourOperator.id },
        include: {
          _count: {
            select: {
              bookings: true
            }
          }
        },
        orderBy: { rating: 'desc' },
        take: 4
      }),
      // Rezervasyon durumları
      prisma.booking.groupBy({
        by: ['status'],
        where: { tourOperatorId: tourOperator.id },
        _count: true
      })
    ]);

    // Rezervasyon durumlarını düzenle
    const formattedReservationStatus = {
      pending: reservationStatus.find(s => s.status === 'PENDING')?._count || 0,
      confirmed: reservationStatus.find(s => s.status === 'CONFIRMED')?._count || 0,
      cancelled: reservationStatus.find(s => s.status === 'CANCELLED')?._count || 0,
      completed: reservationStatus.find(s => s.status === 'COMPLETED')?._count || 0
    };

    // Son rezervasyonları formatla
    const formattedRecentReservations = recentReservations.map(booking => ({
      id: booking.id,
      customerName: booking.user.name || 'İsimsiz Müşteri',
      customerEmail: booking.user.email,
      customerInitials: (booking.user.name || 'İM').split(' ').map(n => n[0]).join('').toUpperCase(),
      activity: booking.tour?.name || 'Tur',
      activityType: `${booking.tour?.duration || 1} Günlük Tur`,
      date: new Date(booking.startDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: '09:00 - 18:00',
      amount: `${booking.totalPrice.toLocaleString('tr-TR')}₺`,
      status: booking.status === 'PENDING' ? 'Beklemede' :
              booking.status === 'CONFIRMED' ? 'Onaylandı' :
              booking.status === 'CANCELLED' ? 'İptal Edildi' : 'Tamamlandı'
    }));

    // Popüler turları formatla
    const formattedPopularTours = popularTours.map(tour => ({
      id: tour.id,
      title: tour.name,
      location: tour.departureCity || 'Belirtilmemiş',
      rating: tour.rating || 0,
      reviewCount: 0, // TODO: Implement review count
      reservationCount: tour._count.bookings,
      guestCount: 0, // TODO: Implement guest count
      price: `${tour.price.toLocaleString('tr-TR')}₺`,
      image: Array.isArray(tour.images) && tour.images.length > 0 
        ? tour.images[0] 
        : 'https://images.unsplash.com/photo-1527838832700-5059252407fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
    }));

    return NextResponse.json({
      stats: {
        totalTours,
        totalBookings,
        totalRevenue: totalRevenue._sum.totalPrice || 0,
        totalCustomers,
        averageRating: averageRating._avg.rating || 0,
        upcomingTours
      },
      recentReservations: formattedRecentReservations,
      popularTours: formattedPopularTours,
      reservationStatus: formattedReservationStatus
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 