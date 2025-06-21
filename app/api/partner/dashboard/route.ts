import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const userRole = session.user.role;

    if (userRole === 'TOUR_OPERATOR') {
      // Mevcut Tur Operatörü Mantığı
      const tourOperator = await prisma.tourOperator.findFirst({
        where: { userId },
        select: { id: true }
      });

      if (!tourOperator) {
        return NextResponse.json({ error: 'Partner hesabı bulunamadı' }, { status: 404 });
      }
      
      const tourOperatorId = tourOperator.id;

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
        prisma.tour.count({ where: { tourOperatorId } }),
        prisma.booking.count({ where: { tourOperatorId } }),
        prisma.booking.aggregate({ where: { tourOperatorId, status: { in: ['CONFIRMED', 'COMPLETED'] } }, _sum: { totalPrice: true } }),
        prisma.booking.groupBy({ by: ['userId'], where: { tourOperatorId } }).then(r => r.length),
        prisma.tour.aggregate({ where: { tourOperatorId }, _avg: { rating: true } }),
        prisma.tour.count({ where: { tourOperatorId, startDate: { gt: new Date() } } }),
        prisma.booking.findMany({ where: { tourOperatorId }, include: { user: { select: { name: true, email: true } }, tour: { select: { name: true, duration: true } } }, orderBy: { createdAt: 'desc' }, take: 5 }),
        prisma.tour.findMany({ where: { tourOperatorId }, include: { _count: { select: { bookings: true } } }, orderBy: { rating: 'desc' }, take: 4 }),
        prisma.booking.groupBy({ by: ['status'], where: { tourOperatorId }, _count: true })
      ]);

      const formattedReservationStatus = {
        pending: reservationStatus.find(s => s.status === 'PENDING')?._count || 0,
        confirmed: reservationStatus.find(s => s.status === 'CONFIRMED')?._count || 0,
        cancelled: reservationStatus.find(s => s.status === 'CANCELLED')?._count || 0,
        completed: reservationStatus.find(s => s.status === 'COMPLETED')?._count || 0
      };
      
      const formattedPopularTours = popularTours.map(t => {
          const image = Array.isArray(t.images) && t.images.length > 0 ? t.images[0] as string : undefined;
          return { id: t.id, title: t.name, rating: t.rating, reservationCount: t._count.bookings, price: t.price, image };
      });

      return NextResponse.json({
        stats: {
          totalTours,
          totalBookings,
          totalRevenue: totalRevenue._sum.totalPrice || 0,
          totalCustomers,
          averageRating: averageRating._avg.rating || 0,
          upcomingTours
        },
        recentReservations: recentReservations.map(b => ({ id: b.id, customerName: b.user.name, activity: b.tour?.name, amount: b.totalPrice, status: b.status})),
        popularTours: formattedPopularTours,
        reservationStatus: formattedReservationStatus
      });

    } else if (userRole === 'EXPERIENCE_PROVIDER') {
      // Yeni Aktivite Sağlayıcısı Mantığı
      const [
        totalExperiences,
        totalBookings,
        totalRevenue,
        totalCustomers,
        averageRating,
        upcomingActivities,
        recentReservations,
        popularExperiences,
        reservationStatusResult
      ] = await Promise.all([
        prisma.experience.count({ where: { userId } }),
        prisma.booking.count({ where: { experience: { userId } } }),
        prisma.booking.aggregate({ where: { experience: { userId }, status: { in: ['CONFIRMED', 'COMPLETED'] } }, _sum: { totalPrice: true } }),
        prisma.booking.groupBy({ by: ['userId'], where: { experience: { userId } } }).then(r => r.length),
        prisma.experience.aggregate({ where: { userId }, _avg: { rating: true } }),
        prisma.activityDate.count({ where: { experience: { userId }, startDate: { gt: new Date() } } }),
        prisma.booking.findMany({ where: { experience: { userId } }, include: { user: { select: { name: true, email: true } }, experience: { select: { title: true } } }, orderBy: { createdAt: 'desc' }, take: 5 }),
        prisma.experience.findMany({ where: { userId }, include: { _count: { select: { bookings: true } } }, orderBy: { rating: 'desc' }, take: 4 }),
        prisma.booking.groupBy({ by: ['status'], where: { experience: { userId } }, _count: true })
      ]);
      
      const formattedReservationStatus = {
        pending: reservationStatusResult.find(s => s.status === 'PENDING')?._count || 0,
        confirmed: reservationStatusResult.find(s => s.status === 'CONFIRMED')?._count || 0,
        cancelled: reservationStatusResult.find(s => s.status === 'CANCELLED')?._count || 0,
        completed: reservationStatusResult.find(s => s.status === 'COMPLETED')?._count || 0
      };

      return NextResponse.json({
        stats: {
          totalTours: totalExperiences, // Ön yüzde 'totalTours' olarak kullanılıyor
          totalBookings,
          totalRevenue: totalRevenue._sum.totalPrice || 0,
          totalCustomers,
          averageRating: averageRating._avg.rating || 0,
          upcomingTours: upcomingActivities, // Ön yüzde 'upcomingTours'
        },
        recentReservations: recentReservations.map(b => ({ id: b.id, customerName: b.user.name, activity: b.experience?.title, amount: b.totalPrice, status: b.status})),
        popularTours: popularExperiences.map(e => ({ id: e.id, title: e.title, rating: e.rating, reservationCount: e._count.bookings, price: e.price, image: e.imageUrl })),
        reservationStatus: formattedReservationStatus
      });
    } else {
      return NextResponse.json({ error: 'Invalid partner role' }, { status: 403 });
    }

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 