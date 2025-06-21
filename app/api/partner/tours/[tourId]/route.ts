import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Tur detaylarını getir
export async function GET(
  request: Request,
  { params }: { params: { tourId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const tourId = params.tourId;
    
    // Partner'ı bul
    const partner = await prisma.tourOperator.findFirst({
      where: { userId },
      select: { id: true }
    });

    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    // Turu bul ve partner'a ait olduğunu kontrol et
    const tour = await prisma.tour.findFirst({
      where: {
        id: tourId,
        tourOperatorId: partner.id
      },
      include: {
        tourDates: {
          include: {
            ageRanges: true
          },
          orderBy: {
            startDate: 'asc'
          }
        },
        pickupPoints: {
          orderBy: {
            order: 'asc'
          }
        },
        accommodation: true,
        tourOperator: {
          select: {
            id: true,
            companyName: true,
            logo: true
          }
        }
      }
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
      // Diğer alanları da ekle
      currentParticipants: tour.currentParticipants || 0,
      reviews: 0, // Varsayılan değer
      isJointTour: false, // Varsayılan değer
      accommodationName: tour.accommodation?.name || '', // Konaklama bilgisini ekle
      mainImage: null, // Varsayılan değer
      galleryImages: [], // Varsayılan değer
      // Tur tarihlerini frontend formatına çevir
      tourDates: tour.tourDates.map(date => ({
        ...date,
        startDate: date.startDate.toISOString().split('T')[0],
        endDate: date.endDate.toISOString().split('T')[0],
        earlyBirdDeadlineStart: date.earlyBirdDeadlineStart?.toISOString().split('T')[0] || '',
        earlyBirdDeadline: date.earlyBirdDeadline?.toISOString().split('T')[0] || '',
        lastMinuteStart: date.lastMinuteStart?.toISOString().split('T')[0] || '',
        lastMinuteStartEnd: date.lastMinuteStartEnd?.toISOString().split('T')[0] || '',
        isExpanded: false,
        price: date.price.toString(),
        availableSeats: date.availableSeats.toString(),
        soldSeats: date.soldSeats.toString(),
        minParticipants: date.minParticipants?.toString() || '',
        maxParticipants: date.maxParticipants?.toString() || '',
        earlyBirdDiscount: date.earlyBirdDiscount?.toString() || '',
        lastMinuteDiscount: date.lastMinuteDiscount?.toString() || '',
        notes: date.notes || '',
        ageRanges: date.ageRanges.map(range => ({
          ...range,
          value: range.value.toString()
        }))
      })),
      // Yolcu alma noktalarını frontend formatına çevir
      pickupPoints: tour.pickupPoints.map(point => ({
        ...point,
        description: point.description || ''
      })),
      // Destinasyonları kontrol et
      destinations: Array.isArray(tour.destinations) ? tour.destinations : [],
      // Diğer JSON alanlarını kontrol et
      features: Array.isArray(tour.features) ? tour.features : [],
      itinerary: Array.isArray(tour.itinerary) ? tour.itinerary : [],
      images: Array.isArray(tour.images) ? tour.images : [],
      languages: Array.isArray(tour.languages) ? tour.languages : [],
      tags: Array.isArray(tour.tags) ? tour.tags : []
    };

    return NextResponse.json(formattedTour);
  } catch (error) {
    console.error('Error fetching tour:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Turu güncelle
export async function PUT(
  request: Request,
  { params }: { params: { tourId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
  }

  const { tourId } = params;
  if (!tourId) {
    return NextResponse.json({ error: 'Tur ID\'si eksik' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const {
      title, description, duration, price, discount, startDate, endDate,
      maxParticipants, destinations, includes, excludes, itinerary, images,
      featured, departureCity, region, transportation, period, tourType,
      accommodationType, ageRestriction, languages, tags, tourDates,
      pickupPoints, accommodationName, accommodationImage, accommodationLocation,
      accommodationRating, accommodationFeatures, features
    } = body;

    // Turun mevcut sahibini kontrol et
    const tourOperator = await prisma.tourOperator.findFirst({
      where: { userId: session.user.id },
    });

    if (!tourOperator) {
      return NextResponse.json({ error: 'Tur operatörü bulunamadı' }, { status: 404 });
    }

    const existingTour = await prisma.tour.findUnique({
      where: { id: tourId },
    });

    if (!existingTour || existingTour.tourOperatorId !== tourOperator.id) {
      return NextResponse.json({ error: 'Tur bulunamadı veya bu turu düzenleme yetkiniz yok' }, { status: 403 });
    }

    const updatedTour = await prisma.$transaction(async (tx) => {
      // 1. İlişkili eski verileri temizle (Pickup Points)
      await tx.tourPickupPoint.deleteMany({ where: { tourId: tourId } });
      
      // TourAccommodation için upsert daha mantıklı olabilir ama şimdilik delete/create
      await tx.tourAccommodation.deleteMany({ where: { tourId: tourId }});

      // 2. Tur ana verisini güncelle
      const tour = await tx.tour.update({
        where: { id: tourId },
        data: {
          name: title,
          description,
          duration: parseInt(duration, 10),
          price: parseFloat(price),
          discount: discount ? parseFloat(discount) : null,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          maxParticipants: parseInt(maxParticipants, 10),
          destinations: destinations || [],
          inclusions: includes || [],
          exclusions: excludes || [],
          features: features || [],
          itinerary: itinerary || [],
          images: images.map((img: any) => img.url).filter((url: any) => url !== undefined && url !== null) || [], // Undefined değerleri filtrele
          featured: featured || false,
          departureCity: Array.isArray(departureCity) ? departureCity.join(', ') : departureCity,
          region,
          transportation,
          period,
          tourType,
          accommodationType,
          ageRestriction: ageRestriction ? parseInt(ageRestriction, 10) : null,
          languages: languages || [],
          tags: tags || [],
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
            waitingList: date.waitingList ? parseInt(date.waitingList.toString()) : 0,
            minParticipants: date.minParticipants ? parseInt(date.minParticipants.toString()) : null,
            maxParticipants: date.maxParticipants ? parseInt(date.maxParticipants.toString()) : null,
            earlyBirdDiscount: date.earlyBirdDiscount ? parseFloat(date.earlyBirdDiscount.toString()) : 0,
            lastMinuteDiscount: date.lastMinuteDiscount ? parseFloat(date.lastMinuteDiscount.toString()) : 0,
            earlyBirdDeadlineStart: date.earlyBirdDeadlineStart ? new Date(date.earlyBirdDeadlineStart) : null,
            earlyBirdDeadline: date.earlyBirdDeadline ? new Date(date.earlyBirdDeadline) : null,
            lastMinuteStart: date.lastMinuteStart ? new Date(date.lastMinuteStart) : null,
            lastMinuteStartEnd: date.lastMinuteStartEnd ? new Date(date.lastMinuteStartEnd) : null,
            notes: date.notes || '',
            status: date.status || 'ACTIVE',
            isActive: true,
            tourId: tour.id
          };

          const createdTourDate = await tx.tourDate.create({
            data: tourDateData
          });

          // Yaş aralıklarını ekle
          if (date.ageRanges && Array.isArray(date.ageRanges) && date.ageRanges.length > 0) {
            const ageRangeData = date.ageRanges
              .filter((range: any) => range && typeof range === 'object' && range.minAge !== undefined)
              .map((range: any) => ({
                tourDateId: createdTourDate.id,
                minAge: parseInt(range.minAge?.toString() || '0'),
                maxAge: range.maxAge ? parseInt(range.maxAge.toString()) : null,
                pricingType: range.pricingType || 'percentage',
                value: parseFloat(range.value?.toString() || '0')
              }));

            if (ageRangeData.length > 0) {
              await tx.tourDateAgeRange.createMany({
                data: ageRangeData
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
    if (error instanceof Error) {
        return NextResponse.json({ error: 'Tur güncellenirken bir hata oluştu: ' + error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Bilinmeyen bir hata oluştu' }, { status: 500 });
  }
}

// Turu sil
export async function DELETE(
  request: Request,
  { params }: { params: { tourId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const tourId = params.tourId;
    
    // Partner'ı bul
    const partner = await prisma.tourOperator.findFirst({
      where: { userId },
      select: { id: true }
    });

    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    // Turu bul ve partner'a ait olduğunu kontrol et
    const tour = await prisma.tour.findFirst({
      where: {
        id: tourId,
        tourOperatorId: partner.id
      }
    });

    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    // Transaction içinde tüm ilişkili verileri sil
    await prisma.$transaction(async (tx) => {
      // 1. Tur tarihlerinin yaş aralıklarını sil
      const tourDates = await tx.tourDate.findMany({
        where: { tourId: tourId },
        select: { id: true }
      });
      
      for (const tourDate of tourDates) {
        await tx.tourDateAgeRange.deleteMany({
          where: { tourDateId: tourDate.id }
        });
      }

      // 2. Tur tarihlerini sil
      await tx.tourDate.deleteMany({
        where: { tourId: tourId }
      });

      // 3. Kalkış noktalarını sil
      await tx.tourPickupPoint.deleteMany({
        where: { tourId: tourId }
      });

      // 4. Konaklama bilgisini sil
      await tx.tourAccommodation.deleteMany({
        where: { tourId: tourId }
      });

      // 5. Son olarak turu sil
      await tx.tour.delete({
        where: { id: tourId }
      });
    });

    return NextResponse.json({ message: 'Tour deleted successfully' });
  } catch (error) {
    console.error('Error deleting tour:', error);
    return NextResponse.json(
      { error: 'Tur silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 