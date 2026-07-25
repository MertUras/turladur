import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Prisma } from '@prisma/client';

function normalizeImageUrls(images: unknown): string[] {
  if (!Array.isArray(images)) {
    return [];
  }

  return images
    .map((img) => {
      if (typeof img === 'string' && img.trim()) {
        return img.trim();
      }
      if (img && typeof img === 'object' && 'url' in img) {
        const url = (img as { url?: unknown }).url;
        return typeof url === 'string' && url.trim() ? url.trim() : null;
      }
      return null;
    })
    .filter((url): url is string => Boolean(url));
}

function toInt(value: unknown, fallback = 0): number {
  const parsed = parseInt(String(value ?? ''), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toFloat(value: unknown, fallback = 0): number {
  const parsed = parseFloat(String(value ?? ''));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toOptionalInt(value: unknown): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const parsed = parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function toOptionalFloat(value: unknown): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const parsed = parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : null;
}

function mapPrismaError(error: unknown): string {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        if (
          error.meta?.target &&
          String(error.meta.target).includes('tour_date_age_ranges')
        ) {
          return 'Aynı yaş aralığı birden fazla kez tanımlanmış. Lütfen yaş aralıklarını kontrol edin.';
        }
        return 'Bu tur adı zaten kullanılıyor. Lütfen farklı bir ad seçiniz.';
      case 'P2003':
        return 'Tur operatörü bilgisi hatalı. Lütfen tekrar giriş yapınız.';
      case 'P2011':
        return 'Zorunlu alanlar eksik. Lütfen tüm gerekli alanları doldurunuz.';
      case 'P2012':
        return 'Geçersiz veri formatı. Lütfen tüm alanları kontrol ediniz.';
      default:
        return 'Veritabanı hatası. Lütfen tekrar deneyiniz.';
    }
  }

  if (error instanceof Error) {
    if (error.message.includes('Invalid value provided')) {
      return 'Geçersiz veri formatı. Lütfen tüm alanları kontrol ediniz.';
    }
    if (error.message.includes('Invalid date')) {
      return 'Tarih formatı hatalı. Lütfen tarihleri kontrol ediniz.';
    }
    return error.message;
  }

  return 'Bilinmeyen bir hata oluştu';
}

// Tur detaylarını getir
export async function GET(
  request: Request,
  { params }: { params: Promise<{ tourId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { tourId } = await params;

    // Partner'ı bul
    const partner = await prisma.tourOperator.findFirst({
      where: { userId },
      select: { id: true },
    });

    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    // Turu bul ve partner'a ait olduğunu kontrol et
    const tour = await prisma.tour.findFirst({
      where: {
        id: tourId,
        tourOperatorId: partner.id,
      },
      include: {
        tourDates: {
          include: {
            ageRanges: true,
          },
          orderBy: {
            startDate: 'asc',
          },
        },
        pickupPoints: {
          orderBy: {
            order: 'asc',
          },
        },
        accommodation: true,
        tourOperator: {
          select: {
            id: true,
            companyName: true,
            logo: true,
          },
        },
      },
    });

    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    // Frontend'in beklediği formatta veri döndür
    const formattedTour = {
      ...tour,
      title: tour.name,
      includes: Array.isArray(tour.inclusions) ? tour.inclusions : [],
      excludes: Array.isArray(tour.exclusions) ? tour.exclusions : [],
      healthPrivileges: Array.isArray(tour.healthPrivileges)
        ? tour.healthPrivileges
        : [],
      // Diğer alanları da ekle
      currentParticipants: tour.currentParticipants || 0,
      reviews: 0, // Varsayılan değer
      isJointTour: false, // Varsayılan değer
      accommodationName: tour.accommodation?.name || '', // Konaklama bilgisini ekle
      mainImage: null, // Varsayılan değer
      galleryImages: [], // Varsayılan değer
      // Tur tarihlerini frontend formatına çevir
      tourDates: tour.tourDates.map((date) => ({
        ...date,
        startDate: date.startDate.toISOString().split('T')[0],
        endDate: date.endDate.toISOString().split('T')[0],
        earlyBirdDeadlineStart:
          date.earlyBirdDeadlineStart?.toISOString().split('T')[0] || '',
        earlyBirdDeadline:
          date.earlyBirdDeadline?.toISOString().split('T')[0] || '',
        lastMinuteStart:
          date.lastMinuteStart?.toISOString().split('T')[0] || '',
        lastMinuteStartEnd:
          date.lastMinuteStartEnd?.toISOString().split('T')[0] || '',
        isExpanded: false,
        price: date.price.toString(),
        availableSeats: date.availableSeats.toString(),
        soldSeats: date.soldSeats.toString(),
        minParticipants: date.minParticipants?.toString() || '',
        maxParticipants: date.maxParticipants?.toString() || '',
        earlyBirdDiscount: date.earlyBirdDiscount?.toString() || '',
        lastMinuteDiscount: date.lastMinuteDiscount?.toString() || '',
        notes: date.notes || '',
        ageRanges: date.ageRanges.map((range) => ({
          ...range,
          value: range.value.toString(),
        })),
      })),
      // Yolcu alma noktalarını frontend formatına çevir
      pickupPoints: tour.pickupPoints.map((point) => ({
        ...point,
        description: point.description || '',
      })),
      // Destinasyonları kontrol et
      destinations: Array.isArray(tour.destinations) ? tour.destinations : [],
      // Diğer JSON alanlarını kontrol et
      features: Array.isArray(tour.features) ? tour.features : [],
      itinerary: Array.isArray(tour.itinerary) ? tour.itinerary : [],
      images: Array.isArray(tour.images) ? tour.images : [],
      languages: Array.isArray(tour.languages) ? tour.languages : [],
      tags: Array.isArray(tour.tags) ? tour.tags : [],
    };

    return NextResponse.json(formattedTour);
  } catch (error) {
    console.error('Error fetching tour:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// Turu güncelle
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ tourId: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
  }

  const { tourId } = await params;
  if (!tourId) {
    return NextResponse.json({ error: "Tur ID'si eksik" }, { status: 400 });
  }

  try {
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
      healthPrivileges,
      itinerary,
      images,
      featured,
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
      accommodationName,
      accommodationImage,
      accommodationLocation,
      accommodationRating,
      accommodationFeatures,
      features,
      data,
    } = body;

    const normalizedImages = normalizeImageUrls(images);

    // Turun mevcut sahibini kontrol et
    const tourOperator = await prisma.tourOperator.findFirst({
      where: { userId: session.user.id },
    });

    if (!tourOperator) {
      return NextResponse.json(
        { error: 'Tur operatörü bulunamadı' },
        { status: 404 },
      );
    }

    const existingTour = await prisma.tour.findUnique({
      where: { id: tourId },
    });

    if (!existingTour || existingTour.tourOperatorId !== tourOperator.id) {
      return NextResponse.json(
        { error: 'Tur bulunamadı veya bu turu düzenleme yetkiniz yok' },
        { status: 403 },
      );
    }

    const updatedTour = await prisma.$transaction(async (tx) => {
      // 1. İlişkili eski verileri temizle (Pickup Points)
      await tx.tourPickupPoint.deleteMany({ where: { tourId: tourId } });

      // TourAccommodation için upsert daha mantıklı olabilir ama şimdilik delete/create
      await tx.tourAccommodation.deleteMany({ where: { tourId: tourId } });

      // 2. Tur ana verisini güncelle
      const tour = await tx.tour.update({
        where: { id: tourId },
        data: {
          name: title,
          description,
          duration: toInt(duration),
          nights: toInt(data?.nights, 0),
          price: toFloat(price),
          discount: toOptionalFloat(discount),
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          maxParticipants: toInt(maxParticipants),
          destinations: destinations || [],
          inclusions: includes || [],
          exclusions: excludes || [],
          healthPrivileges: healthPrivileges || [],
          features: features || data?.features || [],
          itinerary: itinerary || [],
          images: normalizedImages,
          featured: featured || false,
          departureCity: Array.isArray(departureCity)
            ? departureCity.join(', ')
            : departureCity,
          region,
          transportation,
          period,
          tourType,
          accommodationType,
          ageRestriction: toOptionalInt(ageRestriction),
          languages: languages || [],
          tags: tags || [],
          meetingPoint: data?.meetingPoint || null,
          meetingTime: data?.meetingTime || null,
        },
      });

      // 3. Yeni konaklama bilgisini oluştur
      if (accommodationName) {
        await tx.tourAccommodation.create({
          data: {
            tourId: tour.id,
            name: accommodationName,
            image: accommodationImage || '',
            location: accommodationLocation || '',
            type: accommodationType || '',
            rating: accommodationRating ? parseFloat(accommodationRating) : 0,
            features: accommodationFeatures || [],
          },
        });
      }

      // 4. Yeni kalkış noktalarını oluştur
      if (pickupPoints && pickupPoints.length > 0) {
        await tx.tourPickupPoint.createMany({
          data: pickupPoints.map((point: any) => ({
            tourId: tour.id,
            city: point.city,
            location: point.location,
            time: point.time,
            description: point.description,
            order: point.order,
            isActive: point.isActive,
          })),
        });
      }

      // 5. Tur tarihlerini güncelle
      if (tourDates && tourDates.length > 0) {
        // Önce mevcut tarihleri sil
        await tx.tourDate.deleteMany({ where: { tourId: tour.id } });

        // Yeni tarihleri oluştur
        for (const date of tourDates) {
          if (!date.startDate || !date.endDate) {
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

          const createdTourDate = await tx.tourDate.create({
            data: tourDateData,
          });

          // Yaş aralıklarını ekle
          if (
            date.ageRanges &&
            Array.isArray(date.ageRanges) &&
            date.ageRanges.length > 0
          ) {
            const seenAgeRanges = new Set<string>();
            const ageRangeData = date.ageRanges
              .filter(
                (range: any) =>
                  range &&
                  typeof range === 'object' &&
                  range.minAge !== undefined,
              )
              .map((range: any) => ({
                tourDateId: createdTourDate.id,
                minAge: parseInt(range.minAge?.toString() || '0', 10),
                maxAge: range.maxAge
                  ? parseInt(range.maxAge.toString(), 10)
                  : null,
                pricingType: range.pricingType || 'percentage',
                value: parseFloat(range.value?.toString() || '0'),
              }))
              .filter((range) => {
                const key = `${range.minAge}:${range.maxAge ?? 'null'}`;
                if (seenAgeRanges.has(key)) {
                  return false;
                }
                seenAgeRanges.add(key);
                return true;
              });

            if (ageRangeData.length > 0) {
              await tx.tourDateAgeRange.createMany({
                data: ageRangeData,
              });
            }
          }
        }
      }

      return tour;
    });

    return NextResponse.json(updatedTour, { status: 200 });
  } catch (error) {
    console.error(`Tur Güncelleme Hatası (ID: ${tourId}):`, error);
    return NextResponse.json(
      { error: `Tur güncellenirken bir hata oluştu: ${mapPrismaError(error)}` },
      { status: 500 },
    );
  }
}

// Turu sil
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ tourId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { tourId } = await params;

    // Partner'ı bul
    const partner = await prisma.tourOperator.findFirst({
      where: { userId },
      select: { id: true },
    });

    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    // Turu bul ve partner'a ait olduğunu kontrol et
    const tour = await prisma.tour.findFirst({
      where: {
        id: tourId,
        tourOperatorId: partner.id,
      },
    });

    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    // Transaction içinde tüm ilişkili verileri sil
    await prisma.$transaction(async (tx) => {
      // 1. Tur tarihlerinin yaş aralıklarını sil
      const tourDates = await tx.tourDate.findMany({
        where: { tourId: tourId },
        select: { id: true },
      });

      for (const tourDate of tourDates) {
        await tx.tourDateAgeRange.deleteMany({
          where: { tourDateId: tourDate.id },
        });
      }

      // 2. Tur tarihlerini sil
      await tx.tourDate.deleteMany({
        where: { tourId: tourId },
      });

      // 3. Kalkış noktalarını sil
      await tx.tourPickupPoint.deleteMany({
        where: { tourId: tourId },
      });

      // 4. Konaklama bilgisini sil
      await tx.tourAccommodation.deleteMany({
        where: { tourId: tourId },
      });

      // 5. Son olarak turu sil
      await tx.tour.delete({
        where: { id: tourId },
      });
    });

    return NextResponse.json({ message: 'Tour deleted successfully' });
  } catch (error) {
    console.error('Error deleting tour:', error);
    return NextResponse.json(
      { error: 'Tur silinirken bir hata oluştu' },
      { status: 500 },
    );
  }
}
