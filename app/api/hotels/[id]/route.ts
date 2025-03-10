import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const hotelId = params.id;

    const hotel = await prisma.hotel.findUnique({
      where: {
        id: hotelId
      },
      include: {
        rooms: true,
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                image: true
              }
            }
          }
        },
        user: {
          select: {
            name: true,
            email: true,
            image: true
          }
        }
      }
    });

    if (!hotel) {
      return NextResponse.json(
        { error: 'Otel bulunamadı' },
        { status: 404 }
      );
    }

    // Amenities ve images alanlarını parse et
    const parsedHotel = {
      ...hotel,
      amenities: typeof hotel.amenities === 'string' 
        ? (() => {
            try {
              const parsedAmenities = JSON.parse(hotel.amenities);
              // Eğer bir obje ise (key-value pairs)
              if (typeof parsedAmenities === 'object' && !Array.isArray(parsedAmenities)) {
                return Object.keys(parsedAmenities).filter(key => parsedAmenities[key] === true);
              }
              // Eğer zaten bir dizi ise
              return parsedAmenities;
            } catch (error) {
              console.error('Amenities parse hatası:', error);
              return [];
            }
          })()
        : hotel.amenities,
      images: typeof hotel.images === 'string' 
        ? (() => {
            try {
              const parsedImages = JSON.parse(hotel.images);
              // Dizi olup olmadığını kontrol et
              if (Array.isArray(parsedImages)) {
                // Her bir öğenin geçerli bir URL olduğundan emin ol
                return parsedImages
                  .filter(img => typeof img === 'string')
                  .filter(img => img.startsWith('http'));
              }
              return [];
            } catch (error) {
              console.error('Images parse hatası:', error);
              return [];
            }
          })()
        : (Array.isArray(hotel.images) 
            ? hotel.images
                .filter(img => typeof img === 'string')
                .filter(img => img.startsWith('http')) 
            : []),
      // Odaların amenities ve images alanlarını da parse et
      rooms: hotel.rooms.map(room => ({
        ...room,
        amenities: typeof room.amenities === 'string' 
          ? (() => {
              try {
                const parsedAmenities = JSON.parse(room.amenities);
                // Eğer bir obje ise (key-value pairs)
                if (typeof parsedAmenities === 'object' && !Array.isArray(parsedAmenities)) {
                  return Object.keys(parsedAmenities).filter(key => parsedAmenities[key] === true);
                }
                // Eğer zaten bir dizi ise
                return parsedAmenities;
              } catch (error) {
                console.error('Oda özellikleri parse hatası:', error);
                return [];
              }
            })()
          : room.amenities,
        images: typeof room.images === 'string' 
          ? (() => {
              try {
                const parsedImages = JSON.parse(room.images);
                // Dizi olup olmadığını kontrol et
                if (Array.isArray(parsedImages)) {
                  // Her bir öğenin geçerli bir URL olduğundan emin ol
                  return parsedImages
                    .filter(img => typeof img === 'string')
                    .filter(img => img.startsWith('http'));
                }
                return [];
              } catch (error) {
                console.error('Oda resimleri parse hatası:', error);
                return [];
              }
            })()
          : (Array.isArray(room.images) 
              ? room.images
                  .filter(img => typeof img === 'string')
                  .filter(img => img.startsWith('http')) 
              : [])
      }))
    };

    return NextResponse.json(parsedHotel);
  } catch (error) {
    console.error('Otel detayları getirilirken hata:', error);
    return NextResponse.json(
      { error: 'Otel detayları getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 