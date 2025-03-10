const { PrismaClient, HotelType } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Örnek admin kullanıcı
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@tourtech.com' },
    update: {},
    create: {
      email: 'admin@tourtech.com',
      name: 'Admin User',
      password: await hash('123456', 12),
      role: 'ADMIN',
    },
  });

  // Örnek otel yöneticisi
  const hotelAdmin = await prisma.user.upsert({
    where: { email: 'hotel@tourtech.com' },
    update: {},
    create: {
      email: 'hotel@tourtech.com',
      name: 'Otel Yöneticisi',
      password: await hash('123456', 12),
      role: 'HOTEL_ADMIN',
    },
  });

  // Örnek oteller
  const hotels = [
    {
      name: 'Luxury Palace Hotel',
      description: 'İstanbul Boğazı\'nın muhteşem manzarasına sahip 5 yıldızlı lüks otel. Spa merkezi, açık havuz ve özel plaj alanı ile misafirlerine unutulmaz bir deneyim sunuyor.',
      address: 'Beşiktaş Caddesi No: 123',
      city: 'İstanbul',
      country: 'Türkiye',
      stars: 5,
      type: HotelType.HOTEL,
      amenities: JSON.stringify({
        wifi: true,
        parking: true,
        pool: true,
        spa: true,
        restaurant: true,
        gym: true,
        beach: true,
      }),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1566073771259-6a8506099945',
        'https://images.unsplash.com/photo-1582719508461-905c673771fd',
        'https://images.unsplash.com/photo-1630660664869-c9d3cc676880',
      ]),
      userId: hotelAdmin.id,
    },
    {
      name: 'Kapadokya Cave Suites',
      description: 'Eşsiz Kapadokya manzarasına sahip mağara otel. Geleneksel mimarisi ve modern konforu birleştiren özel tasarımlı odalar.',
      address: 'Göreme Mahallesi No: 45',
      city: 'Nevşehir',
      country: 'Türkiye',
      stars: 4,
      type: HotelType.BOUTIQUE_HOTEL,
      amenities: JSON.stringify({
        wifi: true,
        parking: true,
        restaurant: true,
        baloon: true,
        terrace: true,
      }),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1622914607052-a4a4cfa5c0c8',
        'https://images.unsplash.com/photo-1612958668983-76b05598962b',
        'https://images.unsplash.com/photo-1669201984611-3c58061b2edf',
      ]),
      userId: hotelAdmin.id,
    },
    {
      name: 'Bodrum Beach Resort',
      description: 'Özel plajı ve muhteşem deniz manzarasıyla Bodrum\'un en güzel koyunda yer alan resort otel.',
      address: 'Yalıkavak Mahallesi No: 78',
      city: 'Muğla',
      country: 'Türkiye',
      stars: 5,
      type: HotelType.RESORT,
      amenities: JSON.stringify({
        wifi: true,
        parking: true,
        pool: true,
        beach: true,
        spa: true,
        waterSports: true,
      }),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1582719508461-905c673771fd',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
        'https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd',
      ]),
      userId: hotelAdmin.id,
    },
  ];

  for (const hotel of hotels) {
    const createdHotel = await prisma.hotel.create({
      data: hotel,
    });

    // Her otel için örnek odalar
    const rooms = [
      {
        name: 'Standart Oda',
        description: 'Konforlu ve şık tasarlanmış standart oda',
        type: 'STANDARD',
        capacity: 2,
        price: 1500,
        size: 25,
        bedType: 'DOUBLE',
        amenities: JSON.stringify({
          wifi: true,
          tv: true,
          minibar: true,
          airConditioning: true,
        }),
        images: JSON.stringify([hotel.images[0]]),
        hotelId: createdHotel.id,
      },
      {
        name: 'Deluxe Oda',
        description: 'Geniş ve lüks deluxe oda',
        type: 'DELUXE',
        capacity: 3,
        price: 2500,
        size: 35,
        bedType: 'KING',
        amenities: JSON.stringify({
          wifi: true,
          tv: true,
          minibar: true,
          airConditioning: true,
          balcony: true,
          seaView: true,
        }),
        images: JSON.stringify([hotel.images[1]]),
        hotelId: createdHotel.id,
      },
      {
        name: 'Suit Oda',
        description: 'Lüks ve geniş suit oda',
        type: 'SUITE',
        capacity: 4,
        price: 3500,
        size: 50,
        bedType: 'KING',
        amenities: JSON.stringify({
          wifi: true,
          tv: true,
          minibar: true,
          airConditioning: true,
          balcony: true,
          seaView: true,
          jacuzzi: true,
          livingRoom: true,
        }),
        images: JSON.stringify([hotel.images[2]]),
        hotelId: createdHotel.id,
      },
    ];

    await prisma.room.createMany({
      data: rooms,
    });

    // Her otel için örnek değerlendirmeler
    const reviews = [
      {
        rating: 5,
        comment: 'Muhteşem bir deneyimdi, kesinlikle tekrar geleceğim!',
        userId: adminUser.id,
        hotelId: createdHotel.id,
      },
      {
        rating: 4,
        comment: 'Çok güzel bir otel, personel çok ilgiliydi.',
        userId: hotelAdmin.id,
        hotelId: createdHotel.id,
      },
    ];

    await prisma.review.createMany({
      data: reviews,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 