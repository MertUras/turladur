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

    const tour = await prisma.tour.create({
      data: {
        name: title,
        description,
        duration: parseInt(duration),
        price: parseFloat(price),
        discount: discount ? parseFloat(discount) : null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        maxParticipants: parseInt(maxParticipants),
        destinations: destinations || [],
        inclusions: includes || [],
        exclusions: excludes || [],
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
        ageRestriction: ageRestriction ? parseInt(ageRestriction) : null,
        languages: languages || ['Türkçe'],
        tags: tags || [],
      },
    });

    // Tur tarihlerini ekle
    if (body.tourDates && Array.isArray(body.tourDates)) {
      await prisma.tourDate.createMany({
        data: body.tourDates.map((date: { startDate: string; endDate: string }) => ({
          startDate: new Date(date.startDate),
          endDate: new Date(date.endDate),
          tourId: tour.id
        }))
      });
    }

    return NextResponse.json(tour);
  } catch (error) {
    console.error('Error creating tour:', error);
    return NextResponse.json(
      { error: 'Tur oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
} 