import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const CUSTOMER_PROFILES = [
  { email: 'musteri1@tourtech.com', name: 'Ayşe Demir' },
  { email: 'musteri2@tourtech.com', name: 'Mehmet Kaya' },
  { email: 'musteri3@tourtech.com', name: 'Zeynep Arslan' },
  { email: 'musteri4@tourtech.com', name: 'Can Öztürk' },
];

function addDays(base: Date, days: number): Date {
  const result = new Date(base);
  result.setDate(result.getDate() + days);
  return result;
}

function atMidnight(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function buildTourDateSpecs(basePrice: number, duration: number) {
  const offsets = [14, 45, 75];
  return offsets.map((offset, index) => {
    const startDate = atMidnight(addDays(new Date(), offset));
    const endDate = atMidnight(addDays(startDate, duration - 1));
    const price = Math.round(basePrice * (index === 0 ? 1 : 1.1));
    return { startDate, endDate, price };
  });
}

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
      },
      {
        email: 'test.silver.operator@tourtech.com',
        password: await bcrypt.hash('test123', 10),
        role: UserRole.TOUR_OPERATOR
      },
      {
        email: 'test.bronze.operator@tourtech.com',
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

    const customerPassword = await bcrypt.hash('test123', 10);
    for (const profile of CUSTOMER_PROFILES) {
      await prisma.user.upsert({
        where: { email: profile.email },
        update: { name: profile.name },
        create: {
          email: profile.email,
          password: customerPassword,
          role: UserRole.USER,
          name: profile.name,
        },
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
        logo: 'https://ui-avatars.com/api/?name=Adventure+Activities&background=0EA5E9&color=fff',
        status: 'approved',
        userId: (await prisma.user.findUnique({ where: { email: 'test.activity@tourtech.com' } }))!.id
      }
    });

    // Örnek deneyimleri oluştur
    const experiences = [
      {
        title: 'Yamaç Paraşütü',
        description: 'Babadağ\'dan profesyonel eğitmenler eşliğinde yamaç paraşütü deneyimi',
        longDescription: 'Türkiye\'nin en ünlü yamaç paraşütü merkezi Babadağ\'da, deneyimli eğitmenler eşliğinde unutulmaz bir deneyim yaşayın.',
        // Not: Public klasöründe karşılığı olmayan yerel dosya yolları (örn.
        // /images/activities/paragliding1.jpg) kırık görsellere yol açar; bu
        // yüzden burada her zaman erişilebilir olan Unsplash URL'leri kullanılır.
        imageUrl: 'https://images.unsplash.com/photo-1521673461164-de300ebcfb17?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1521673461164-de300ebcfb17?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1445307806294-bff7f67ff225?auto=format&fit=crop&w=1200&q=80',
        ],
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
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=1200&q=80',
        ],
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
        // Not: Bu alanlar Prisma şemasında `Json` tipinde olduğu için
        // JSON.stringify ile tekrar metne çevrilmemeli; aksi halde
        // veritabanına dizi yerine "[...]" içeren bir metin yazılır ve
        // uygulama tarafında `.map is not a function` hatasına yol açar.
        data: experience
      });

      // Her deneyim için tarihleri oluştur
      const activityDateOffsets = [3, 4];
      for (const offset of activityDateOffsets) {
        const startDate = addDays(new Date(), offset);
        startDate.setHours(9, 0, 0, 0);
        const endDate = new Date(startDate);
        endDate.setHours(13, 0, 0, 0);

        const createdDate = await prisma.activityDate.create({
          data: {
            startDate,
            endDate,
            price: experience.price,
            availableSeats: 10,
            experienceId: createdExperience.id,
          },
        });
        // Yaş aralıklarını ekle (TourDateAgeRange ile aynı seed)
        for (const range of defaultAgeRanges) {
          await prisma.experienceDateAgeRange.create({
            data: {
              activityDateId: createdDate.id,
              minAge: range.minAge,
              maxAge: range.maxAge,
              pricingType: range.pricingType,
              value: range.value
            }
          });
        }
      }
    }

    const tourOperatorProfiles = [
      {
        email: 'test.operator@tourtech.com',
        companyName: 'Turladur Turizm',
        description: 'Türkiye\'nin önde gelen tur operatörlerinden biri.',
        phone: '+90 212 555 0101',
        address: 'Levent Mah. Büyükdere Cad. No: 185, Şişli',
        city: 'İstanbul',
        country: 'Türkiye',
        website: 'https://www.turladur.com',
        logo: 'https://picsum.photos/200',
      },
      {
        email: 'test.silver.operator@tourtech.com',
        companyName: 'Silver Turizm (Test)',
        description: 'Orta segment kültür ve şehir turları sunan test operatörü.',
        phone: '+90 312 555 0202',
        address: 'Kızılırmak Mah. Ufuk Üniversitesi Cad. No: 12, Çankaya',
        city: 'Ankara',
        country: 'Türkiye',
        website: 'https://www.silverturizm.com',
        logo: 'https://picsum.photos/201',
      },
      {
        email: 'test.bronze.operator@tourtech.com',
        companyName: 'Bronze Turizm (Test)',
        description: 'Ekonomik paket turlar sunan test operatörü.',
        phone: '+90 232 555 0303',
        address: 'Alsancak Mah. Kordon Boyu No: 45, Konak',
        city: 'İzmir',
        country: 'Türkiye',
        website: 'https://www.bronzeturizm.com',
        logo: 'https://picsum.photos/202',
      },
    ] as const;

    const tourOperatorByEmail: Record<string, { id: string }> = {};

    for (const profile of tourOperatorProfiles) {
      const user = await prisma.user.findUnique({ where: { email: profile.email } });
      if (!user) continue;

      const operator = await prisma.tourOperator.upsert({
        where: { email: profile.email },
        update: {
          companyName: profile.companyName,
          description: profile.description,
          phone: profile.phone,
          address: profile.address,
          city: profile.city,
          country: profile.country,
          website: profile.website,
          logo: profile.logo,
          status: 'approved',
        },
        create: {
          companyName: profile.companyName,
          description: profile.description,
          email: profile.email,
          phone: profile.phone,
          address: profile.address,
          city: profile.city,
          country: profile.country,
          website: profile.website,
          logo: profile.logo,
          status: 'approved',
          userId: user.id,
        },
      });

      tourOperatorByEmail[profile.email] = operator;
    }

    const tourOperator = tourOperatorByEmail['test.operator@tourtech.com'];
    if (!tourOperator) {
      throw new Error('test.operator@tourtech.com için TourOperator oluşturulamadı.');
    }

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

      // Tur tarihlerini ekle (bugünden itibaren gelecek tarihler)
      const tourDateSpecs = buildTourDateSpecs(tourData.basePrice, tourData.duration);
      const tourDates = tourDateSpecs.map(({ startDate, endDate, price }) => ({
        startDate,
        endDate,
        price,
        availableSeats: tourData.maxParticipants,
        soldSeats: 0,
        waitingList: 0,
        minParticipants: 10,
        maxParticipants: tourData.maxParticipants,
        earlyBirdDiscount: 15,
        lastMinuteDiscount: 10,
        earlyBirdDeadline: addDays(startDate, -30),
        lastMinuteStart: addDays(startDate, -14),
        status: 'ACTIVE',
        isActive: true,
        tourId: tour.id,
        ageRanges: [
          { minAge: 0, maxAge: 2, pricingType: 'free', value: 0 },
          { minAge: 3, maxAge: 6, pricingType: 'percentage', value: 50 },
          { minAge: 7, maxAge: 12, pricingType: 'percentage', value: 25 },
          { minAge: 13, maxAge: null, pricingType: 'fixed', value: price },
        ],
      }));

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