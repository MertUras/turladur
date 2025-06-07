import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Yaş aralıkları tanımları
const defaultAgeRanges = [
  {
    minAge: 0,
    maxAge: 2,
    pricingType: 'free',
    value: 0
  },
  {
    minAge: 3,
    maxAge: 6,
    pricingType: 'percentage',
    value: 50 // %50 indirim
  },
  {
    minAge: 7,
    maxAge: 12,
    pricingType: 'percentage',
    value: 25 // %25 indirim
  },
  {
    minAge: 13,
    maxAge: null,
    pricingType: 'fixed',
    value: 0 // Tam fiyat
  }
];

// Örnek turlar
const tours = [
  {
    name: 'Karadeniz Yaylalar Turu',
    description: '7 günlük muhteşem Karadeniz turu. Uzungöl, Ayder Yaylası, Sümela Manastırı ve daha fazlası...',
    duration: 7,
    basePrice: 8500,
    maxParticipants: 30,
    departureCity: 'İstanbul',
    destinations: [
      'Trabzon',
      'Rize',
      'Uzungöl',
      'Ayder Yaylası',
      'Sümela Manastırı',
      'Giresun',
      'Ordu'
    ],
    itinerary: [
      {
        day: 1,
        title: 'İstanbul - Trabzon',
        description: 'Sabah erken saatlerde İstanbul\'dan hareket. Trabzon\'a varış ve şehir turu. Ayasofya Müzesi ve Atatürk Köşkü ziyareti.',
        activities: ['Trabzon Ayasofya Müzesi', 'Atatürk Köşkü', 'Akşam yemeği'],
        accommodation: 'Trabzon Otel'
      },
      {
        day: 2,
        title: 'Uzungöl Turu',
        description: 'Uzungöl\'e hareket. Göl çevresinde yürüyüş, fotoğraf çekimi ve yerel lezzetlerin tadımı.',
        activities: ['Uzungöl gezisi', 'Yayla kahvaltısı', 'Göl çevresinde yürüyüş'],
        accommodation: 'Uzungöl Otel'
      },
      {
        day: 3,
        title: 'Ayder Yaylası',
        description: 'Ayder Yaylası\'na hareket. Termal tesislerde dinlenme ve doğa yürüyüşü.',
        activities: ['Ayder Yaylası gezisi', 'Termal havuz keyfi', 'Yayla pazarı ziyareti'],
        accommodation: 'Ayder Yayla Evi'
      },
      {
        day: 4,
        title: 'Sümela Manastırı',
        description: 'Sümela Manastırı ziyareti. Tarihi yapının keşfi ve fotoğraf çekimi.',
        activities: ['Sümela Manastırı turu', 'Öğle yemeği', 'Maçka gezisi'],
        accommodation: 'Trabzon Otel'
      },
      {
        day: 5,
        title: 'Giresun Adası',
        description: 'Giresun\'a hareket. Ada turu ve fındık bahçeleri ziyareti.',
        activities: ['Giresun Adası turu', 'Fındık bahçeleri gezisi', 'Yerel pazar'],
        accommodation: 'Giresun Otel'
      },
      {
        day: 6,
        title: 'Ordu Boztepe',
        description: 'Ordu\'ya hareket. Boztepe\'ye teleferik ile çıkış ve panoramik şehir manzarası.',
        activities: ['Boztepe teleferik', 'Şehir turu', 'Akşam yemeği'],
        accommodation: 'Ordu Otel'
      },
      {
        day: 7,
        title: 'Dönüş Yolculuğu',
        description: 'Kahvaltı sonrası İstanbul\'a dönüş yolculuğu.',
        activities: ['Kahvaltı', 'Dönüş yolculuğu'],
        accommodation: null
      }
    ],
    dates: [
      {
        startDate: '2025-06-15',
        endDate: '2025-06-21',
        price: 8500,
        availableSeats: 30
      },
      {
        startDate: '2025-07-13',
        endDate: '2025-07-19',
        price: 9350, // Yaz sezonu +%10
        availableSeats: 30
      },
      {
        startDate: '2025-08-17',
        endDate: '2025-08-23',
        price: 9350,
        availableSeats: 30
      }
    ]
  },
  {
    name: 'Kapadokya Kültür Turu',
    description: '3 günlük büyülü Kapadokya deneyimi. Balon turu, yeraltı şehirleri, vadiler ve peri bacaları...',
    duration: 3,
    basePrice: 4500,
    maxParticipants: 25,
    departureCity: 'Ankara',
    destinations: [
      'Göreme',
      'Ürgüp',
      'Uçhisar',
      'Avanos',
      'Derinkuyu'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Ankara - Kapadokya',
        description: 'Sabah Ankara\'dan hareket. Tuz Gölü molası. Kapadokya\'ya varış ve Göreme Açık Hava Müzesi ziyareti.',
        activities: ['Tuz Gölü molası', 'Göreme Açık Hava Müzesi', 'Akşam yemeği'],
        accommodation: 'Göreme Mağara Otel'
      },
      {
        day: 2,
        title: 'Balon Turu ve Vadiler',
        description: 'İsteğe bağlı balon turu. Kızıl Vadi, Güvercinlik Vadisi ve Paşabağı gezileri.',
        activities: ['Balon turu (opsiyonel)', 'Vadi yürüyüşleri', 'Çömlek atölyesi'],
        accommodation: 'Göreme Mağara Otel'
      },
      {
        day: 3,
        title: 'Yeraltı Şehri ve Dönüş',
        description: 'Derinkuyu Yeraltı Şehri ziyareti. Ürgüp ve Uçhisar gezileri sonrası Ankara\'ya dönüş.',
        activities: ['Derinkuyu Yeraltı Şehri', 'Ürgüp gezisi', 'Dönüş yolculuğu'],
        accommodation: null
      }
    ],
    dates: [
      {
        startDate: '2025-06-20',
        endDate: '2025-06-22',
        price: 4500,
        availableSeats: 25
      },
      {
        startDate: '2025-07-18',
        endDate: '2025-07-20',
        price: 4950, // Yaz sezonu +%10
        availableSeats: 25
      },
      {
        startDate: '2025-08-22',
        endDate: '2025-08-24',
        price: 4950,
        availableSeats: 25
      }
    ]
  },
  {
    name: 'Ege Kıyıları Turu',
    description: '5 günlük muhteşem Ege turu. Antik kentler, mavi yolculuk ve eşsiz plajlar...',
    duration: 5,
    basePrice: 6500,
    maxParticipants: 28,
    departureCity: 'İzmir',
    destinations: [
      'Çeşme',
      'Alaçatı',
      'Efes',
      'Kuşadası',
      'Bodrum',
      'Marmaris'
    ],
    itinerary: [
      {
        day: 1,
        title: 'İzmir - Çeşme - Alaçatı',
        description: 'İzmir\'den hareket. Çeşme ve Alaçatı gezisi. Rüzgar sörfü imkanı.',
        activities: ['Çeşme plajları', 'Alaçatı sokakları', 'Sörf deneyimi'],
        accommodation: 'Alaçatı Butik Otel'
      },
      {
        day: 2,
        title: 'Efes Antik Kenti',
        description: 'Efes Antik Kenti ve Meryem Ana Evi ziyareti. Şirince Köyü turu.',
        activities: ['Efes Antik Kenti', 'Meryem Ana Evi', 'Şirince şarap tadımı'],
        accommodation: 'Kuşadası Otel'
      },
      {
        day: 3,
        title: 'Kuşadası - Bodrum',
        description: 'Kuşadası\'ndan Bodrum\'a hareket. Bodrum Kalesi ve Sualtı Müzesi ziyareti.',
        activities: ['Bodrum Kalesi', 'Sualtı Müzesi', 'Tekne turu'],
        accommodation: 'Bodrum Otel'
      },
      {
        day: 4,
        title: 'Bodrum - Marmaris',
        description: 'Bodrum\'dan Marmaris\'e hareket. Koy gezisi ve yüzme molaları.',
        activities: ['Koy turu', 'Yüzme molası', 'Akşam eğlencesi'],
        accommodation: 'Marmaris Otel'
      },
      {
        day: 5,
        title: 'Marmaris ve Dönüş',
        description: 'Marmaris çarşı gezisi ve alışveriş. İzmir\'e dönüş yolculuğu.',
        activities: ['Çarşı gezisi', 'Alışveriş', 'Dönüş yolculuğu'],
        accommodation: null
      }
    ],
    dates: [
      {
        startDate: '2025-06-25',
        endDate: '2025-06-29',
        price: 6500,
        availableSeats: 28
      },
      {
        startDate: '2025-07-23',
        endDate: '2025-07-27',
        price: 7150, // Yaz sezonu +%10
        availableSeats: 28
      },
      {
        startDate: '2025-08-27',
        endDate: '2025-08-31',
        price: 7150,
        availableSeats: 28
      }
    ]
  },
  {
    name: 'Güneydoğu Lezzetleri Turu',
    description: '4 günlük gastronomi ve kültür turu. Gaziantep, Şanlıurfa, Mardin...',
    duration: 4,
    basePrice: 5500,
    maxParticipants: 22,
    departureCity: 'İstanbul',
    destinations: [
      'Gaziantep',
      'Şanlıurfa',
      'Mardin',
      'Adıyaman'
    ],
    itinerary: [
      {
        day: 1,
        title: 'İstanbul - Gaziantep',
        description: 'Gaziantep\'e varış. Mutfak Müzesi ve Bakırcılar Çarşısı ziyareti.',
        activities: ['Mutfak Müzesi', 'Bakırcılar Çarşısı', 'Baklava tadımı'],
        accommodation: 'Gaziantep Otel'
      },
      {
        day: 2,
        title: 'Şanlıurfa',
        description: 'Balıklıgöl, Göbeklitepe ve Harran Evleri ziyareti.',
        activities: ['Balıklıgöl', 'Göbeklitepe', 'Harran Evleri'],
        accommodation: 'Şanlıurfa Otel'
      },
      {
        day: 3,
        title: 'Mardin',
        description: 'Mardin\'e hareket. Eski şehir turu ve manastır ziyaretleri.',
        activities: ['Deyrulzafaran Manastırı', 'Eski şehir turu', 'Telkari atölyesi'],
        accommodation: 'Mardin Otel'
      },
      {
        day: 4,
        title: 'Adıyaman ve Dönüş',
        description: 'Nemrut Dağı gün doğumu turu. İstanbul\'a dönüş.',
        activities: ['Nemrut gün doğumu', 'Kahvaltı', 'Dönüş yolculuğu'],
        accommodation: null
      }
    ],
    dates: [
      {
        startDate: '2025-06-10',
        endDate: '2025-06-13',
        price: 5500,
        availableSeats: 22
      },
      {
        startDate: '2025-09-18',
        endDate: '2025-09-21',
        price: 5500,
        availableSeats: 22
      },
      {
        startDate: '2025-10-16',
        endDate: '2025-10-19',
        price: 5225, // Sezon sonu -%5
        availableSeats: 22
      }
    ]
  },
  {
    name: 'Akdeniz Sahilleri Turu',
    description: '6 günlük Akdeniz sahil turu. Antalya, Kaş, Fethiye, Olimpos...',
    duration: 6,
    basePrice: 7500,
        maxParticipants: 25,
    departureCity: 'İstanbul',
    destinations: [
      'Antalya',
      'Kaş',
      'Kalkan',
      'Fethiye',
      'Olimpos',
      'Demre'
    ],
    itinerary: [
      {
        day: 1,
        title: 'İstanbul - Antalya',
        description: 'Antalya\'ya varış. Kaleiçi ve Düden Şelalesi turu.',
        activities: ['Kaleiçi turu', 'Düden Şelalesi', 'Akşam yemeği'],
        accommodation: 'Antalya Otel'
      },
      {
        day: 2,
        title: 'Kaş - Kalkan',
        description: 'Kaş\'a hareket. Kaputaş Plajı ve Kalkan gezisi.',
        activities: ['Kaputaş Plajı', 'Kalkan gezisi', 'Tekne turu'],
        accommodation: 'Kaş Otel'
      },
      {
        day: 3,
        title: 'Fethiye',
        description: 'Ölüdeniz ve Kelebekler Vadisi turu.',
        activities: ['Ölüdeniz', 'Kelebekler Vadisi', 'Yamaç paraşütü'],
        accommodation: 'Fethiye Otel'
      },
      {
        day: 4,
        title: 'Olimpos',
        description: 'Olimpos antik kenti ve plaj keyfi. Yanartaş gece turu.',
        activities: ['Olimpos antik kenti', 'Plaj', 'Yanartaş gece turu'],
        accommodation: 'Olimpos Ağaç Ev'
      },
      {
        day: 5,
        title: 'Demre',
        description: 'Myra antik kenti ve Noel Baba Kilisesi ziyareti.',
        activities: ['Myra antik kenti', 'Noel Baba Kilisesi', 'Tekne turu'],
        accommodation: 'Demre Otel'
      },
      {
        day: 6,
        title: 'Antalya ve Dönüş',
        description: 'Antalya Arkeoloji Müzesi ziyareti ve İstanbul\'a dönüş.',
        activities: ['Arkeoloji Müzesi', 'Serbest zaman', 'Dönüş yolculuğu'],
        accommodation: null
      }
    ],
    dates: [
      {
        startDate: '2025-06-22',
        endDate: '2025-06-27',
        price: 8250, // Yaz sezonu +%10
        availableSeats: 25
      },
      {
        startDate: '2025-07-20',
        endDate: '2025-07-25',
        price: 8625, // Yüksek sezon +%15
        availableSeats: 25
      },
      {
        startDate: '2025-08-24',
        endDate: '2025-08-29',
        price: 8625,
        availableSeats: 25
      }
    ]
  }
];

async function main() {
  try {
    console.log('Seed data ekleniyor...');

    // Kullanıcıları oluştur
    const users = [
      {
        email: 'test.activity@tourtech.com',
        password: await bcrypt.hash('test123', 10),
        role: UserRole.EXPERIENCE_PROVIDER
      },
      {
        email: 'test.operator@tourtech.com',
        password: await bcrypt.hash('test123', 10),
        role: UserRole.TOUR_OPERATOR
      }
    ];

    for (const user of users) {
      await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: user
      });
    }

    // Experience Provider oluştur
    const experienceProvider = await prisma.experienceOperator.create({
      data: {
        companyName: 'Adventure Activities',
        description: 'Profesyonel macera aktiviteleri sağlayıcısı',
        email: 'test.activity@tourtech.com',
        phone: '+90 555 123 4567',
        website: 'www.adventureactivities.com',
        address: 'Fethiye, Muğla',
        logo: '/images/activity-providers/adventure.jpg',
        userId: (await prisma.user.findUnique({ where: { email: 'test.activity@tourtech.com' } }))!.id
      }
    });

    // Örnek deneyimleri oluştur
    const experiences = [
      {
        title: 'Yamaç Paraşütü',
        description: 'Babadağ\'dan profesyonel eğitmenler eşliğinde yamaç paraşütü deneyimi',
        longDescription: 'Türkiye\'nin en ünlü yamaç paraşütü merkezi Babadağ\'da, deneyimli eğitmenler eşliğinde unutulmaz bir deneyim yaşayın.',
        imageUrl: '/images/activities/paragliding1.jpg',
        gallery: ['/images/activities/paragliding1.jpg', '/images/activities/paragliding2.jpg'],
        location: 'Fethiye, Muğla',
        duration: '4 saat',
        price: 2500,
        category: 'ADVENTURE',
        included: ['Ekipman', 'Transfer', 'Sigorta', 'Eğitmen'],
        notIncluded: ['Yemek', 'Kişisel harcamalar'],
        highlights: ['1800m yükseklikten atlayış', 'Profesyonel eğitmen eşliğinde', 'HD video çekimi'],
        schedule: [
          { time: '09:00', description: 'Otel transferi' },
          { time: '10:00', description: 'Babadağ\'a varış ve hazırlık' },
          { time: '11:00', description: 'Atlayış' },
          { time: '13:00', description: 'Dönüş transferi' }
        ],
        featured: true,
        userId: (await prisma.user.findUnique({ where: { email: 'test.activity@tourtech.com' } }))!.id,
        meetingPoint: 'https://goo.gl/maps/example',
        meetingPointAddress: 'Ölüdeniz Mahallesi, Fethiye/Muğla'
      },
      {
        title: 'Dalış Deneyimi',
        description: 'PADI sertifikalı eğitmenler eşliğinde keşif dalışı',
        longDescription: 'Akdeniz\'in berrak sularında, PADI sertifikalı eğitmenler eşliğinde güvenli ve unutulmaz bir dalış deneyimi.',
        imageUrl: '/images/activities/diving1.jpg',
        gallery: ['/images/activities/diving1.jpg', '/images/activities/diving2.jpg'],
        location: 'Kaş, Antalya',
        duration: '6 saat',
        price: 3000,
        category: 'WATER_SPORTS',
        included: ['Ekipman', 'Transfer', 'Sigorta', 'Eğitmen', 'Öğle yemeği'],
        notIncluded: ['Kişisel harcamalar', 'PADI sertifikası'],
        highlights: ['Berrak sularda dalış', 'Deneyimli eğitmenler', 'Tam ekipman desteği'],
        schedule: [
          { time: '08:00', description: 'Otel transferi' },
          { time: '09:00', description: 'Teorik eğitim' },
          { time: '10:30', description: 'Dalış' },
          { time: '12:00', description: 'Öğle yemeği' },
          { time: '14:00', description: 'Dönüş transferi' }
        ],
        featured: true,
        userId: (await prisma.user.findUnique({ where: { email: 'test.activity@tourtech.com' } }))!.id,
        meetingPoint: 'https://goo.gl/maps/example2',
        meetingPointAddress: 'Kaş Marina, Kaş/Antalya'
      }
    ];

    for (const experience of experiences) {
      const createdExperience = await prisma.experience.create({
        data: {
          ...experience,
          gallery: JSON.stringify(experience.gallery),
          included: JSON.stringify(experience.included),
          notIncluded: JSON.stringify(experience.notIncluded),
          highlights: JSON.stringify(experience.highlights),
          schedule: JSON.stringify(experience.schedule)
        }
      });

      // Her deneyim için tarihleri oluştur
      const activityDates = [
        {
          startDate: new Date('2025-06-10T09:00:00Z'),
          endDate: new Date('2025-06-10T13:00:00Z'),
          price: experience.price,
          availableSeats: 10,
          activityId: createdExperience.id
        },
        {
          startDate: new Date('2025-06-11T09:00:00Z'),
          endDate: new Date('2025-06-11T13:00:00Z'),
          price: experience.price,
          availableSeats: 10,
          activityId: createdExperience.id
        }
      ];

      for (const date of activityDates) {
        await prisma.activityDate.create({
          data: date
        });
      }
    }

    // Örnek tur operatörü oluştur
    const tourOperator = await prisma.tourOperator.create({
      data: {
        companyName: 'Turladur Turizm',
        description: 'Türkiye\'nin önde gelen tur operatörlerinden biri.',
        email: 'test.operator@tourtech.com',
        phone: '+90 555 123 4567',
        address: 'İstanbul, Türkiye',
        logo: 'https://picsum.photos/200',
        status: 'approved',
        userId: (await prisma.user.findUnique({ where: { email: 'test.operator@tourtech.com' } }))!.id
      }
    });

    // Her tur için
    for (const tourData of tours) {
      // Turu oluştur
      const tour = await prisma.tour.create({
        data: {
          name: tourData.name,
          description: tourData.description,
          duration: tourData.duration,
          price: tourData.basePrice,
          maxParticipants: tourData.maxParticipants,
          departureCity: tourData.departureCity,
          destinations: tourData.destinations,
          itinerary: tourData.itinerary,
          images: [
            'https://picsum.photos/800/600',
            'https://picsum.photos/800/601',
            'https://picsum.photos/800/602',
            'https://picsum.photos/800/603'
          ],
          tourOperatorId: tourOperator.id
        }
      });

      // Tur tarihlerini ekle
      const tourDates = [
        {
          startDate: new Date('2025-06-15'),
          endDate: new Date('2025-06-21'),
          price: 8500,
          availableSeats: 30,
          soldSeats: 0,
          waitingList: 0,
          minParticipants: 10,
          maxParticipants: 30,
          earlyBirdDiscount: 15,
          lastMinuteDiscount: 10,
          earlyBirdDeadline: new Date('2025-05-15'),
          lastMinuteStart: new Date('2025-06-01'),
          status: 'ACTIVE',
          isActive: true,
          tourId: tour.id,
          ageRanges: [
            {
              minAge: 0,
              maxAge: 2,
              pricingType: 'free',
              value: 0
            },
            {
              minAge: 3,
              maxAge: 6,
              pricingType: 'percentage',
              value: 50
            },
            {
              minAge: 7,
              maxAge: 12,
              pricingType: 'percentage',
              value: 25
            },
            {
              minAge: 13,
              maxAge: null,
              pricingType: 'fixed',
              value: 8500
            }
          ]
        },
        {
          startDate: new Date('2025-07-13'),
          endDate: new Date('2025-07-19'),
          price: 9350,
          availableSeats: 30,
            soldSeats: 0,
            waitingList: 0,
          minParticipants: 10,
          maxParticipants: 30,
          earlyBirdDiscount: 15,
          lastMinuteDiscount: 10,
          earlyBirdDeadline: new Date('2025-06-13'),
          lastMinuteStart: new Date('2025-07-01'),
            status: 'ACTIVE',
          isActive: true,
          tourId: tour.id,
          ageRanges: [
            {
              minAge: 0,
              maxAge: 2,
              pricingType: 'free',
              value: 0
            },
            {
              minAge: 3,
              maxAge: 6,
              pricingType: 'percentage',
              value: 50
            },
            {
              minAge: 7,
              maxAge: 12,
              pricingType: 'percentage',
              value: 25
            },
            {
              minAge: 13,
              maxAge: null,
              pricingType: 'fixed',
              value: 9350
            }
          ]
        },
        {
          startDate: new Date('2025-08-17'),
          endDate: new Date('2025-08-23'),
          price: 9350,
          availableSeats: 30,
          soldSeats: 0,
          waitingList: 0,
          minParticipants: 10,
          maxParticipants: 30,
          earlyBirdDiscount: 15,
          lastMinuteDiscount: 10,
          earlyBirdDeadline: new Date('2025-07-17'),
          lastMinuteStart: new Date('2025-08-01'),
          status: 'ACTIVE',
          isActive: true,
          tourId: tour.id,
          ageRanges: [
            {
              minAge: 0,
              maxAge: 2,
              pricingType: 'free',
              value: 0
            },
            {
              minAge: 3,
              maxAge: 6,
              pricingType: 'percentage',
              value: 50
            },
            {
              minAge: 7,
              maxAge: 12,
              pricingType: 'percentage',
              value: 25
            },
            {
              minAge: 13,
              maxAge: null,
              pricingType: 'fixed',
              value: 9350
            }
          ]
        }
      ];

      for (const date of tourDates) {
        const { ageRanges, ...tourDateData } = date;
        const tourDate = await prisma.tourDate.create({
          data: tourDateData
        });

        // Yaş aralıklarını ekle
        for (const range of ageRanges) {
          await prisma.tourDateAgeRange.create({
            data: {
              ...range,
              tourDateId: tourDate.id
            }
          });
        }
      }
    }

    console.log('Seed data başarıyla oluşturuldu!');
  } catch (error) {
    console.error('Seed data oluşturulurken hata:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
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