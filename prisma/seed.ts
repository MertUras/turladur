import { PrismaClient, HotelType } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Kullanıcılar
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Anadolu Turizm Admin',
        email: 'admin@anadoluturizm.com',
        password: 'hashedpassword123', // Gerçek uygulamada şifre hash'lenmelidir
        role: 'TOUR_OPERATOR',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Ege Tur Admin',
        email: 'admin@egetur.com',
        password: 'hashedpassword123', // Gerçek uygulamada şifre hash'lenmelidir
        role: 'TOUR_OPERATOR',
      },
    }),
  ]);

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
        userId: users[0].id,
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

  // Tur operatörleri
  const tourOperators = await Promise.all([
    prisma.tourOperator.create({
      data: {
        name: 'Anadolu Turizm',
        description: 'Türkiye\'nin en büyük tur operatörlerinden biri',
        logo: '/images/tour-operators/anadolu-turizm.jpg',
        userId: users[0].id,
      },
    }),
    prisma.tourOperator.create({
      data: {
        name: 'Ege Tur',
        description: 'Ege bölgesinin önde gelen tur operatörü',
        logo: '/images/tour-operators/ege-tur.jpg',
        userId: users[1].id,
      },
    }),
  ]);

  // Turlar
  await Promise.all([
    prisma.tour.create({
      data: {
        name: 'Kapadokya Balon Turu',
        description: 'Kapadokya\'nın eşsiz manzarasını balonla keşfedin',
        duration: 2,
        price: 2500,
        discount: 10,
        startDate: new Date('2024-05-01'),
        endDate: new Date('2024-05-03'),
        maxParticipants: 20,
        destinations: ['Nevşehir', 'Ürgüp', 'Göreme'],
        inclusions: ['Balon turu', 'Otel konaklama', 'Kahvaltı'],
        exclusions: ['Ulaşım', 'Öğle yemeği'],
        itinerary: ['1. Gün: Balon turu', '2. Gün: Kapadokya gezisi'],
        images: ['/images/tours/kapadokya-1.jpg', '/images/tours/kapadokya-2.jpg'],
        featured: true,
        departureCity: 'İstanbul',
        region: 'İç Anadolu',
        transportation: 'Uçak',
        period: 'Bahar',
        rating: 4.8,
        tourType: 'Macera',
        accommodationType: 'Otel',
        difficultyLevel: 'Kolay',
        ageRestriction: 12,
        isPopular: true,
        isLastMinute: false,
        isEarlyBird: true,
        languages: ['Türkçe', 'İngilizce'],
        tags: ['balon', 'kapadokya', 'macera'],
        tourOperatorId: tourOperators[0].id,
      },
    }),
    prisma.tour.create({
      data: {
        name: 'Efes Antik Kenti Turu',
        description: 'Antik dünyanın en önemli şehirlerinden birini keşfedin',
        duration: 1,
        price: 1200,
        discount: 5,
        startDate: new Date('2024-06-15'),
        endDate: new Date('2024-06-16'),
        maxParticipants: 15,
        destinations: ['Efes', 'Selçuk'],
        inclusions: ['Rehberlik', 'Giriş ücretleri'],
        exclusions: ['Ulaşım', 'Yemek'],
        itinerary: ['Efes Antik Kenti gezisi', 'Artemis Tapınağı ziyareti'],
        images: ['/images/tours/efes-1.jpg', '/images/tours/efes-2.jpg'],
        featured: false,
        departureCity: 'İzmir',
        region: 'Ege',
        transportation: 'Otobüs',
        period: 'Yaz',
        rating: 4.5,
        tourType: 'Kültür',
        accommodationType: 'Yok',
        difficultyLevel: 'Orta',
        ageRestriction: 8,
        isPopular: true,
        isLastMinute: false,
        isEarlyBird: false,
        languages: ['Türkçe', 'İngilizce'],
        tags: ['efes', 'antik kent', 'kültür'],
        tourOperatorId: tourOperators[1].id,
      },
    }),
    prisma.tour.create({
      data: {
        name: 'Pamukkale Termal Turu',
        description: 'Beyaz travertenleri ve termal suları keşfedin',
        duration: 2,
        price: 1800,
        discount: 15,
        startDate: new Date('2024-07-01'),
        endDate: new Date('2024-07-03'),
        maxParticipants: 25,
        destinations: ['Pamukkale', 'Hierapolis'],
        inclusions: ['Termal otel konaklama', 'Giriş ücretleri'],
        exclusions: ['Ulaşım', 'Yemek'],
        itinerary: ['1. Gün: Pamukkale gezisi', '2. Gün: Termal havuz keyfi'],
        images: ['/images/tours/pamukkale-1.jpg', '/images/tours/pamukkale-2.jpg'],
        featured: true,
        departureCity: 'İzmir',
        region: 'Ege',
        transportation: 'Otobüs',
        period: 'Yaz',
        rating: 4.7,
        tourType: 'Termal',
        accommodationType: 'Termal Otel',
        difficultyLevel: 'Kolay',
        ageRestriction: 6,
        isPopular: true,
        isLastMinute: true,
        isEarlyBird: false,
        languages: ['Türkçe', 'İngilizce'],
        tags: ['pamukkale', 'termal', 'sağlık'],
        tourOperatorId: tourOperators[1].id,
      },
    }),
    prisma.tour.create({
      data: {
        name: 'Bodrum Mavi Tur',
        description: 'Bodrum\'un eşsiz koylarını tekne ile keşfedin',
        duration: 3,
        price: 3500,
        discount: 20,
        startDate: new Date('2024-08-01'),
        endDate: new Date('2024-08-04'),
        maxParticipants: 12,
        destinations: ['Bodrum', 'Gökova', 'Karaada'],
        inclusions: ['Tekne konaklama', 'Tüm yemekler', 'Su sporları'],
        exclusions: ['Ulaşım', 'Ekstra aktiviteler'],
        itinerary: ['1. Gün: Bodrum limanından hareket', '2. Gün: Gökova koyları', '3. Gün: Karaada ve dönüş'],
        images: ['/images/tours/bodrum-1.jpg', '/images/tours/bodrum-2.jpg'],
        featured: true,
        departureCity: 'Bodrum',
        region: 'Ege',
        transportation: 'Tekne',
        period: 'Yaz',
        rating: 4.9,
        tourType: 'Deniz',
        accommodationType: 'Tekne',
        difficultyLevel: 'Orta',
        ageRestriction: 10,
        isPopular: true,
        isLastMinute: false,
        isEarlyBird: true,
        languages: ['Türkçe', 'İngilizce'],
        tags: ['bodrum', 'mavi tur', 'deniz'],
        tourOperatorId: tourOperators[1].id,
      },
    }),
    prisma.tour.create({
      data: {
        name: 'Fethiye Saklıkent Turu',
        description: 'Saklıkent Kanyonu\'nda macera dolu bir gün',
        duration: 1,
        price: 800,
        discount: 10,
        startDate: new Date('2024-09-15'),
        endDate: new Date('2024-09-16'),
        maxParticipants: 15,
        destinations: ['Fethiye', 'Saklıkent'],
        inclusions: ['Rehberlik', 'Giriş ücretleri', 'Öğle yemeği'],
        exclusions: ['Ulaşım', 'Ekstra aktiviteler'],
        itinerary: ['Saklıkent Kanyonu gezisi', 'Tazı Kanyonu ziyareti'],
        images: ['/images/tours/saklikent-1.jpg', '/images/tours/saklikent-2.jpg'],
        featured: false,
        departureCity: 'Fethiye',
        region: 'Ege',
        transportation: 'Minibüs',
        period: 'Yaz',
        rating: 4.6,
        tourType: 'Doğa',
        accommodationType: 'Yok',
        difficultyLevel: 'Orta',
        ageRestriction: 8,
        isPopular: true,
        isLastMinute: false,
        isEarlyBird: false,
        languages: ['Türkçe', 'İngilizce'],
        tags: ['fethiye', 'saklıkent', 'doğa'],
        tourOperatorId: tourOperators[1].id,
      },
    }),
    prisma.tour.create({
      data: {
        name: 'Marmaris Dalış Turu',
        description: 'Ege\'nin derinliklerini keşfedin',
        duration: 2,
        price: 2000,
        discount: 15,
        startDate: new Date('2024-10-01'),
        endDate: new Date('2024-10-03'),
        maxParticipants: 8,
        destinations: ['Marmaris', 'Kumlubük'],
        inclusions: ['Dalış ekipmanları', 'Eğitmen', 'Otel konaklama'],
        exclusions: ['Ulaşım', 'Yemekler'],
        itinerary: ['1. Gün: Dalış eğitimi', '2. Gün: Dalış turu'],
        images: ['/images/tours/marmaris-1.jpg', '/images/tours/marmaris-2.jpg'],
        featured: true,
        departureCity: 'Marmaris',
        region: 'Ege',
        transportation: 'Tekne',
        period: 'Sonbahar',
        rating: 4.8,
        tourType: 'Su Sporları',
        accommodationType: 'Otel',
        difficultyLevel: 'Zor',
        ageRestriction: 14,
        isPopular: true,
        isLastMinute: false,
        isEarlyBird: true,
        languages: ['Türkçe', 'İngilizce'],
        tags: ['marmaris', 'dalış', 'su sporları'],
        tourOperatorId: tourOperators[1].id,
      },
    }),
    prisma.tour.create({
      data: {
        name: 'Datça Rüzgar Sörfü Turu',
        description: 'Rüzgar sörfü yaparak eğlenceli bir tatil',
        duration: 3,
        price: 2800,
        discount: 10,
        startDate: new Date('2024-11-01'),
        endDate: new Date('2024-11-04'),
        maxParticipants: 10,
        destinations: ['Datça', 'Palamutbükü'],
        inclusions: ['Sörf ekipmanları', 'Eğitmen', 'Otel konaklama'],
        exclusions: ['Ulaşım', 'Yemekler'],
        itinerary: ['1. Gün: Sörf eğitimi', '2. Gün: Pratik', '3. Gün: Serbest sörf'],
        images: ['/images/tours/datca-1.jpg', '/images/tours/datca-2.jpg'],
        featured: true,
        departureCity: 'Datça',
        region: 'Ege',
        transportation: 'Yok',
        period: 'Sonbahar',
        rating: 4.7,
        tourType: 'Su Sporları',
        accommodationType: 'Otel',
        difficultyLevel: 'Orta',
        ageRestriction: 12,
        isPopular: true,
        isLastMinute: false,
        isEarlyBird: true,
        languages: ['Türkçe', 'İngilizce'],
        tags: ['datça', 'sörf', 'su sporları'],
        tourOperatorId: tourOperators[1].id,
      },
    }),
  ]);

  console.log('Seed data başarıyla eklendi!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 