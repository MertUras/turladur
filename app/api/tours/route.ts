import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Prisma } from '@prisma/client';

// Tüm turları getir
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '15');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const departureCity = searchParams.get('departureCity');
    const region = searchParams.get('region');
    const transportation = searchParams.get('transportation');
    const duration = searchParams.get('duration');
    const period = searchParams.get('period');
    const featured = searchParams.get('featured');
    const minRating = searchParams.get('minRating');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const partnerId = searchParams.get('partnerId');

    const skip = (page - 1) * limit;

    const where: Prisma.TourWhereInput = {
      AND: [
        ...(partnerId ? [{ tourOperatorId: partnerId }] : []),
        {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        },
        ...(minPrice ? [{ price: { gte: parseFloat(minPrice) } }] : []),
        ...(maxPrice ? [{ price: { lte: parseFloat(maxPrice) } }] : []),
        ...(departureCity ? [{ departureCity }] : []),
        ...(region ? [{ region }] : []),
        ...(transportation ? [{ transportation }] : []),
        ...(duration ? [{ duration: parseInt(duration) }] : []),
        ...(period ? [{ period }] : []),
        ...(featured === 'true' ? [{ featured: true }] : []),
        ...(minRating ? [{ rating: { gte: parseFloat(minRating) } }] : []),
        ...(startDate && endDate ? [
          {
            startDate: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          },
        ] : []),
      ],
    };

    const [tours, total] = await Promise.all([
      prisma.tour.findMany({
        where,
        include: {
          tourOperator: true,
          tourDates: {
            select: {
              id: true,
              startDate: true,
              endDate: true,
              price: true,
              availableSeats: true
            },
            orderBy: {
              startDate: 'asc'
            }
          }
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      prisma.tour.count({ where }),
    ]);

    return NextResponse.json({
      tours,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching tours:', error);
    return NextResponse.json(
      { error: 'Turlar getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// Yeni tur oluştur
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Bu işlem için giriş yapmanız gerekiyor' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      duration,
      price,
      discount,
      startDate,
      endDate,
      maxParticipants,
      destinations,
      includes,
      excludes,
      itinerary,
      images,
      featured,
      tourOperatorId,
      departureCity,
      region,
      transportation,
      period,
      tourType,
      accommodationType,
      difficultyLevel,
      ageRestriction,
      languages,
      tags,
      tourDates,
      pickupPoints,
      data
    } = body;

    // Tur operatörünü kontrol et
    const tourOperator = await prisma.tourOperator.findFirst({
      where: {
        id: tourOperatorId,
        userId: session.user.id
      }
    });

    if (!tourOperator) {
      return NextResponse.json(
        { error: 'Tur operatörü bulunamadı veya yetkiniz yok' },
        { status: 403 }
      );
    }

    // Önce turu oluştur
    const tour = await prisma.tour.create({
      data: {
        name: title,
        description,
        duration: parseInt(duration.toString()),
        nights: parseInt(data.nights?.toString() || '0'),
        price: parseFloat(price.toString()),
        discount: discount ? parseFloat(discount.toString()) : null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        maxParticipants: parseInt(maxParticipants.toString()),
        destinations: destinations || [],
        inclusions: includes || [],
        exclusions: excludes || [],
        features: data.features || [],
        itinerary: itinerary || [],
        images: images || [],
        featured: featured || false,
        tourOperatorId: tourOperator.id,
        departureCity,
        region,
        transportation,
        period,
        tourType,
        accommodationType,
        difficultyLevel,
        ageRestriction: ageRestriction ? parseInt(ageRestriction.toString()) : null,
        languages: languages || ['Türkçe'],
        tags: tags || [],
        meetingPoint: data.meetingPoint || null,
        meetingTime: data.meetingTime || null,
      },
    });

    // Tur tarihlerini ekle
    if (tourDates && Array.isArray(tourDates) && tourDates.length > 0) {
      await prisma.tourDate.createMany({
        data: tourDates.map((date: any) => ({
          startDate: new Date(date.startDate),
          endDate: new Date(date.endDate),
          price: parseFloat(date.price.toString()),
          availableSeats: parseInt(date.availableSeats.toString()),
          soldSeats: date.soldSeats || 0,
          waitingList: date.waitingList || 0,
          discount: date.discount || 0,
          minParticipants: date.minParticipants ? parseInt(date.minParticipants) : null,
          maxParticipants: date.maxParticipants ? parseInt(date.maxParticipants) : null,
          earlyBirdDiscount: date.earlyBirdDiscount || 0,
          lastMinuteDiscount: date.lastMinuteDiscount || 0,
          earlyBirdDeadline: date.earlyBirdDeadline ? new Date(date.earlyBirdDeadline) : null,
          lastMinuteStart: date.lastMinuteStart ? new Date(date.lastMinuteStart) : null,
          notes: date.notes || '',
          status: date.status || 'ACTIVE',
          isActive: true,
          tourId: tour.id
        }))
      });
    }

    // Yolcu alma noktalarını ekle
    if (pickupPoints && Array.isArray(pickupPoints) && pickupPoints.length > 0) {
      await prisma.tourPickupPoint.createMany({
        data: pickupPoints.map((point: PickupPoint, index: number) => ({
          tourId: tour.id,
          city: point.city,
          location: point.location,
          time: point.time,
          description: point.description || null,
          order: index,
          isActive: true
        }))
      });
    }

    const createdTour = await prisma.tour.findUnique({
      where: { id: tour.id },
      include: {
        tourDates: true,
        pickupPoints: true,
        tourOperator: {
          select: {
            id: true,
            companyName: true,
            logo: true
          }
        }
      }
    });

    return NextResponse.json(createdTour);
  } catch (error) {
    console.error('Error creating tour:', error);
    return NextResponse.json(
      { error: 'Tur oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
} 