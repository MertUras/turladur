import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Prisma } from '@prisma/client';
import { getTourRatingProvider } from '@/lib/reviews/server';
import { getCitiesForRegion } from '@/lib/tours/filter-options';

interface PickupPoint {
  id?: string;
  city: string;
  location: string;
  time: string;
  description?: string;
  order: number;
  isActive: boolean;
}

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
        ...(departureCity
          ? [
              {
                OR: [
                  {
                    departureCity: {
                      contains: departureCity,
                      mode: 'insensitive',
                    },
                  },
                  {
                    pickupPoints: {
                      some: {
                        city: { contains: departureCity, mode: 'insensitive' },
                        isActive: true,
                      },
                    },
                  },
                  {
                    // JSON fields cannot use mode: 'insensitive' (Postgres lower(jsonb) does not exist)
                    destinations: {
                      string_contains: departureCity,
                    },
                  },
                ],
              },
            ]
          : []),
        ...(region
          ? [
              {
                OR: [
                  { region: { equals: region, mode: 'insensitive' } },
                  ...getCitiesForRegion(region).map((city) => ({
                    departureCity: {
                      contains: city,
                      mode: 'insensitive' as const,
                    },
                  })),
                  {
                    pickupPoints: {
                      some: {
                        city: { in: getCitiesForRegion(region) },
                        isActive: true,
                      },
                    },
                  },
                ],
              },
            ]
          : []),
        ...(transportation ? [{ transportation }] : []),
        ...(duration ? [{ duration: parseInt(duration) }] : []),
        ...(period ? [{ period }] : []),
        ...(featured === 'true' ? [{ featured: true }] : []),
        ...(minRating ? [{ rating: { gte: parseFloat(minRating) } }] : []),
        ...(startDate || endDate
          ? [
              {
                tourDates: {
                  some: {
                    isActive: true,
                    ...(startDate
                      ? { startDate: { gte: new Date(startDate) } }
                      : {}),
                    ...(endDate ? { endDate: { lte: new Date(endDate) } } : {}),
                  },
                },
              },
            ]
          : []),
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
              availableSeats: true,
              earlyBirdDiscount: true,
              lastMinuteDiscount: true,
              earlyBirdDeadlineStart: true,
              earlyBirdDeadline: true,
              lastMinuteStart: true,
              lastMinuteStartEnd: true,
            },
            orderBy: {
              startDate: 'asc',
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      prisma.tour.count({ where }),
    ]);

    const tourIds = tours.map((tour) => tour.id);
    const ratingMap =
      await getTourRatingProvider().getTourRatingsForTourIds(tourIds);

    const toursWithRatings = tours.map((tour) => {
      const summary = ratingMap.get(tour.id);
      return {
        ...tour,
        rating: summary?.averageRating ?? 0,
        reviewCount: summary?.reviewCount ?? 0,
      };
    });

    return NextResponse.json({
      tours: toursWithRatings,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching tours:', error);
    return NextResponse.json(
      { error: 'Turlar getirilirken bir hata oluştu' },
      { status: 500 },
    );
  }
}

// Yeni tur oluştur
export async function POST(request: Request) {
  let body: any = null;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Bu işlem için giriş yapmanız gerekiyor' },
        { status: 401 },
      );
    }

    body = await request.json();
    console.log('Gelen veri:', JSON.stringify(body, null, 2));

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
      healthPrivileges,
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
      ageRestriction,
      languages,
      tags,
      tourDates,
      pickupPoints,
      data,
      accommodationName,
      accommodationImage,
      accommodationLocation,
      accommodationRating,
      accommodationFeatures,
    } = body;

    // Veri doğrulama
    console.log(
      'departureCity tipi:',
      typeof departureCity,
      'değeri:',
      departureCity,
    );
    console.log(
      'destinations tipi:',
      typeof destinations,
      'değeri:',
      destinations,
    );

    // Tur operatörünü kontrol et
    const tourOperator = await prisma.tourOperator.findFirst({
      where: {
        id: tourOperatorId,
        userId: session.user.id,
      },
    });

    if (!tourOperator) {
      return NextResponse.json(
        { error: 'Tur operatörü bulunamadı veya yetkiniz yok' },
        { status: 403 },
      );
    }

    // Destinasyon validasyonu
    if (!Array.isArray(destinations) || destinations.length === 0) {
      return NextResponse.json(
        { error: 'En az bir destinasyon girilmeli.' },
        { status: 400 },
      );
    }

    // Destinasyonları temizle ve validate et
    const cleanDestinations = destinations
      .filter(
        (dest) =>
          dest &&
          typeof dest === 'object' &&
          dest.city &&
          typeof dest.city === 'string' &&
          dest.city.trim(),
      )
      .map((dest) => ({
        city: dest.city.trim(),
        description: dest.description || '',
      }));

    if (cleanDestinations.length === 0) {
      return NextResponse.json(
        { error: 'En az bir geçerli şehir girilmeli.' },
        { status: 400 },
      );
    }

    console.log('Temizlenmiş destinasyonlar:', cleanDestinations);

    // departureCity validasyonu
    let departureCityString = '';
    if (Array.isArray(departureCity)) {
      departureCityString = departureCity
        .filter((city) => city && city.trim())
        .join(', ');
    } else if (typeof departureCity === 'string') {
      departureCityString = departureCity;
    } else {
      return NextResponse.json(
        { error: 'Kalkış şehri bilgisi geçersiz.' },
        { status: 400 },
      );
    }

    console.log('İşlenmiş departureCity:', departureCityString);

    const newTour = await prisma.$transaction(async (tx) => {
      // Önce turu oluştur
      const tour = await tx.tour.create({
        data: {
          name: title,
          description,
          duration: parseInt(duration.toString()),
          nights: parseInt(data?.nights?.toString() || '0'),
          price: parseFloat(price.toString()),
          discount: discount ? parseFloat(discount.toString()) : null,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          maxParticipants: parseInt(maxParticipants.toString()),
          destinations: cleanDestinations,
          inclusions: includes || [],
          exclusions: excludes || [],
          healthPrivileges: healthPrivileges || [],
          features: data?.features || [],
          itinerary: itinerary || [],
          images: images || [],
          featured: featured || false,
          tourOperatorId: tourOperator.id,
          departureCity: departureCityString,
          region,
          transportation,
          period,
          tourType,
          accommodationType: body.accommodationType,
          ageRestriction: ageRestriction
            ? parseInt(ageRestriction.toString())
            : null,
          languages: languages || ['Türkçe'],
          tags: tags || [],
          meetingPoint: data?.meetingPoint || null,
          meetingTime: data?.meetingTime || null,
        },
      });

      // Konaklama bilgisi varsa, TourAccommodation tablosuna ekle
      if (accommodationName) {
        await tx.tourAccommodation.create({
          data: {
            tourId: tour.id,
            name: accommodationName,
            image: accommodationImage || '',
            location: accommodationLocation || '',
            type: body.accommodationType || '',
            rating: accommodationRating ? parseFloat(accommodationRating) : 0,
            features: accommodationFeatures || [],
          },
        });
      }

      // Tur tarihlerini oluştur
      if (tourDates && tourDates.length > 0) {
        console.log('Tur tarihleri ekleniyor:', tourDates.length);

        for (const date of tourDates) {
          console.log('Tur tarihi verisi:', JSON.stringify(date, null, 2));

          // Tarih validasyonu
          if (!date.startDate || !date.endDate) {
            console.error(
              'Tur tarihi için başlangıç veya bitiş tarihi eksik:',
              date,
            );
            continue;
          }

          const tourDateData = {
            startDate: new Date(date.startDate),
            endDate: new Date(date.endDate),
            price: parseFloat(date.price?.toString() || '0'),
            availableSeats: parseInt(date.availableSeats?.toString() || '0'),
            soldSeats: date.soldSeats ? parseInt(date.soldSeats.toString()) : 0,
            waitingList: date.waitingList
              ? parseInt(date.waitingList.toString())
              : 0,
            minParticipants: date.minParticipants
              ? parseInt(date.minParticipants.toString())
              : null,
            maxParticipants: date.maxParticipants
              ? parseInt(date.maxParticipants.toString())
              : null,
            earlyBirdDiscount: date.earlyBirdDiscount
              ? parseFloat(date.earlyBirdDiscount.toString())
              : 0,
            lastMinuteDiscount: date.lastMinuteDiscount
              ? parseFloat(date.lastMinuteDiscount.toString())
              : 0,
            earlyBirdDeadlineStart: date.earlyBirdDeadlineStart
              ? new Date(date.earlyBirdDeadlineStart)
              : null,
            earlyBirdDeadline: date.earlyBirdDeadline
              ? new Date(date.earlyBirdDeadline)
              : null,
            lastMinuteStart: date.lastMinuteStart
              ? new Date(date.lastMinuteStart)
              : null,
            lastMinuteStartEnd: date.lastMinuteStartEnd
              ? new Date(date.lastMinuteStartEnd)
              : null,
            notes: date.notes || '',
            status: date.status || 'ACTIVE',
            isActive: true,
            tourId: tour.id,
          };

          console.log(
            'Tur tarihi oluşturuluyor:',
            JSON.stringify(tourDateData, null, 2),
          );

          const createdTourDate = await tx.tourDate.create({
            data: tourDateData,
          });

          console.log('Tur tarihi oluşturuldu, ID:', createdTourDate.id);

          // Yaş aralıklarını ekle
          if (
            date.ageRanges &&
            Array.isArray(date.ageRanges) &&
            date.ageRanges.length > 0
          ) {
            console.log('Yaş aralıkları ekleniyor:', date.ageRanges.length);

            const ageRangeData = date.ageRanges
              .filter(
                (range: any) =>
                  range &&
                  typeof range === 'object' &&
                  range.minAge !== undefined,
              )
              .map((range: any) => ({
                tourDateId: createdTourDate.id,
                minAge: parseInt(range.minAge?.toString() || '0'),
                maxAge: range.maxAge ? parseInt(range.maxAge.toString()) : null,
                pricingType: range.pricingType || 'percentage',
                value: parseFloat(range.value?.toString() || '0'),
              }));

            console.log(
              'Yaş aralığı verileri:',
              JSON.stringify(ageRangeData, null, 2),
            );

            if (ageRangeData.length > 0) {
              await tx.tourDateAgeRange.createMany({
                data: ageRangeData,
              });
              console.log('Yaş aralıkları oluşturuldu');
            }
          }
        }
      }

      // Yolcu alma noktalarını ekle
      if (pickupPoints && pickupPoints.length > 0) {
        console.log('Yolcu alma noktaları ekleniyor:', pickupPoints.length);

        const pickupPointData = pickupPoints
          .filter(
            (point: any) =>
              point &&
              typeof point === 'object' &&
              point.city &&
              point.location &&
              point.time,
          )
          .map((point: any, index: number) => ({
            tourId: tour.id,
            city: point.city.trim(),
            location: point.location.trim(),
            time: point.time.trim(),
            description: point.description?.trim() || null,
            order: index,
            isActive: true,
          }));

        console.log(
          'Yolcu alma noktası verileri:',
          JSON.stringify(pickupPointData, null, 2),
        );

        if (pickupPointData.length > 0) {
          await tx.tourPickupPoint.createMany({
            data: pickupPointData,
          });
          console.log('Yolcu alma noktaları oluşturuldu');
        }
      }

      return tour;
    });

    return NextResponse.json(newTour, { status: 201 });
  } catch (error) {
    console.error('Tur oluşturma hatası:', error);
    console.error('Gelen veri:', JSON.stringify(body, null, 2));

    // Daha detaylı hata mesajı
    let errorMessage = 'Tur oluşturulurken bir hata oluştu';

    if (error instanceof Error) {
      errorMessage = error.message;

      // Prisma hatalarını daha anlaşılır hale getir
      if (error.message.includes('Invalid value provided')) {
        errorMessage =
          'Geçersiz veri formatı. Lütfen tüm alanları kontrol ediniz.';
      } else if (error.message.includes('Unique constraint')) {
        errorMessage =
          'Bu tur adı zaten kullanılıyor. Lütfen farklı bir ad seçiniz.';
      } else if (error.message.includes('Foreign key constraint')) {
        errorMessage =
          'Tur operatörü bilgisi hatalı. Lütfen tekrar giriş yapınız.';
      } else if (error.message.includes('Invalid date')) {
        errorMessage = 'Tarih formatı hatalı. Lütfen tarihleri kontrol ediniz.';
      } else if (error.message.includes('Invalid number')) {
        errorMessage =
          'Sayısal değer formatı hatalı. Lütfen fiyat ve kontenjan bilgilerini kontrol ediniz.';
      } else if (error.message.includes('Required field')) {
        errorMessage =
          'Zorunlu alanlar eksik. Lütfen tüm gerekli alanları doldurunuz.';
      }
    }

    // Prisma hatalarını daha detaylı logla
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Prisma Error Code:', error.code);
      console.error('Prisma Error Meta:', error.meta);

      switch (error.code) {
        case 'P2002':
          errorMessage =
            'Bu tur adı zaten kullanılıyor. Lütfen farklı bir ad seçiniz.';
          break;
        case 'P2003':
          errorMessage =
            'Tur operatörü bilgisi hatalı. Lütfen tekrar giriş yapınız.';
          break;
        case 'P2011':
          errorMessage =
            'Zorunlu alanlar eksik. Lütfen tüm gerekli alanları doldurunuz.';
          break;
        case 'P2012':
          errorMessage =
            'Geçersiz veri formatı. Lütfen tüm alanları kontrol ediniz.';
          break;
        default:
          errorMessage = 'Veritabanı hatası. Lütfen tekrar deneyiniz.';
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
