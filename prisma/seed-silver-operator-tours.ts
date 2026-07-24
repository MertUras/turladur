/**
 * test.silver.operator@tourtech.com için 3 adet detaylı demo tur oluşturur.
 * Çalıştırma: npx ts-node prisma/seed-silver-operator-tours.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SILVER_OPERATOR_EMAIL = 'test.silver.operator@tourtech.com';

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

function buildTourDateSpecs(
  basePrice: number,
  duration: number,
  maxParticipants: number,
) {
  const offsets = [21, 56, 91];
  return offsets.map((offset, index) => {
    const startDate = atMidnight(addDays(new Date(), offset));
    const endDate = atMidnight(addDays(startDate, duration - 1));
    const price = Math.round(
      basePrice * (index === 0 ? 1 : index === 1 ? 1.08 : 1.12),
    );
    return { startDate, endDate, price, availableSeats: maxParticipants };
  });
}

const defaultAgeRanges = [
  { minAge: 0, maxAge: 2, pricingType: 'free', value: 0 },
  { minAge: 3, maxAge: 6, pricingType: 'percentage', value: 50 },
  { minAge: 7, maxAge: 12, pricingType: 'percentage', value: 25 },
  { minAge: 13, maxAge: null, pricingType: 'fixed', value: 0 },
];

type TourSeed = {
  name: string;
  description: string;
  duration: number;
  nights: number;
  basePrice: number;
  maxParticipants: number;
  departureCity: string;
  region: string;
  destinations: string[];
  tourType: string;
  transportation: string;
  difficultyLevel: string;
  isPopular: boolean;
  featured: boolean;
  languages: string[];
  tags: string[];
  meetingPoint: string;
  meetingTime: string;
  meetingPointAddress: string;
  inclusions: string[];
  exclusions: string[];
  features: string[];
  images: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
    highlights: string[];
    schedule: { time: string; activity: string }[];
  }[];
  accommodation: {
    name: string;
    location: string;
    type: string;
    rating: number;
    features: string[];
    description: string;
    image: string;
  };
  pickupPoints: {
    city: string;
    location: string;
    time: string;
    description?: string;
    order: number;
  }[];
};

const silverTours: TourSeed[] = [
  {
    name: 'Kapadokya: Peri Bacaları ve Yeraltı Şehirleri',
    description:
      'Silver Turizm imzasıyla 3 gün 2 gece Kapadokya kültür turu. Göreme Açık Hava Müzesi, Ihlara Vadisi, Derinkuyu Yeraltı Şehri, Avanos çömlek atölyesi ve opsiyonel sıcak hava balonu. Profesyonel rehber, seçili mağara otel konaklaması ve yarım pansiyon dahil.',
    duration: 3,
    nights: 2,
    basePrice: 4890,
    maxParticipants: 24,
    departureCity: 'Ankara',
    region: 'İç Anadolu',
    destinations: ['Göreme', 'Uçhisar', 'Avanos', 'Derinkuyu', 'Ihlara'],
    tourType: 'Kültür',
    transportation: 'Klimalı midibüs',
    difficultyLevel: 'Kolay',
    isPopular: true,
    featured: true,
    languages: ['Türkçe', 'İngilizce'],
    tags: ['kapadokya', 'kültür', 'balon', 'mağara otel'],
    meetingPoint: 'Ankara AŞTİ Dış Hatlar Otobüs Terminali',
    meetingTime: '06:30',
    meetingPointAddress: 'Ankara AŞTİ, Dış Hatlar Girişi, Yenimahalle / Ankara',
    inclusions: [
      '2 gece seçili mağara otelde konaklama',
      'Profesyonel Türkçe rehberlik',
      'Programdaki müze ve ören yeri giriş ücretleri',
      'Klimalı midibüs ile ulaşım',
      '2 akşam yemeği (set menü)',
      'Seyahat sigortası (zorunlu temel paket)',
    ],
    exclusions: [
      'Sıcak hava balonu turu (opsiyonel, ek ücret)',
      'Öğle yemekleri ve kişisel harcamalar',
      'İsteğe bağlı bahşişler',
      'Balon dışındaki ekstra aktiviteler',
    ],
    features: [
      'Wi-Fi (otobüs)',
      'Rehberli tur',
      'Fotoğraf molaları',
      'Esnek iptal (7 gün öncesine kadar)',
    ],
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
      'https://images.unsplash.com/photo-1580837119756-563d608dd1c4?w=1200',
      'https://images.unsplash.com/photo-1605218457769-40f7f4c7f0e8?w=1200',
      'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=1200',
    ],
    itinerary: [
      {
        day: 1,
        title: '1. Gün - Ankara çıkışlı Göreme keşfi',
        description:
          "Ankara'dan erken hareket, Aksaray molası ve Kapadokya'ya varış. Göreme Açık Hava Müzesi ve Uçhisar Kalesi panoraması. Akşam otelde serbest zaman.",
        highlights: [
          'Göreme Açık Hava Müzesi',
          'Uçhisar manzarası',
          'Mağara otel check-in',
        ],
        schedule: [
          { time: '06:30', activity: 'Ankara AŞTİ buluşma ve hareket' },
          { time: '10:00', activity: 'Aksaray mola ve kahvaltı' },
          { time: '13:30', activity: 'Göreme Açık Hava Müzesi gezisi' },
          { time: '17:00', activity: 'Uçhisar Kalesi fotoğraf molası' },
          { time: '19:30', activity: 'Otelde akşam yemeği' },
        ],
      },
      {
        day: 2,
        title: '2. Gün - Ihlara Vadisi ve Derinkuyu',
        description:
          'Ihlara Vadisi yürüyüşü, Belisırma köyünde öğle molası. Öğleden sonra Derinkuyu Yeraltı Şehri. İsteğe bağlı balon turu için erken kalkış seçeneği.',
        highlights: [
          'Ihlara Vadisi',
          'Derinkuyu Yeraltı Şehri',
          'Opsiyonel balon turu',
        ],
        schedule: [
          { time: '05:30', activity: 'Opsiyonel sıcak hava balonu (ek ücret)' },
          { time: '08:30', activity: 'Ihlara Vadisi yürüyüş rotası' },
          { time: '12:30', activity: 'Belisırma öğle molası' },
          { time: '15:00', activity: 'Derinkuyu Yeraltı Şehri' },
          { time: '18:00', activity: 'Avanos çömlek atölyesi ziyareti' },
        ],
      },
      {
        day: 3,
        title: '3. Gün - Paşabağ ve Ankara dönüşü',
        description:
          "Paşabağ ve Devrent Vadisi kısa gezileri. Avanos'ta son alışveriş molası ve Ankara'ya dönüş.",
        highlights: ['Paşabağ peri bacaları', 'Devrent Vadisi', 'Ankara varış'],
        schedule: [
          { time: '08:00', activity: 'Kahvaltı ve otelden çıkış' },
          { time: '09:30', activity: 'Paşabağ ve Devrent Vadisi' },
          { time: '11:30', activity: 'Avanos serbest zaman' },
          { time: '12:30', activity: 'Ankara yönüne hareket' },
          { time: '18:00', activity: 'Ankara AŞTİ tahmini varış' },
        ],
      },
    ],
    accommodation: {
      name: 'Göreme Taş Konak Otel',
      location: 'Göreme, Nevşehir',
      type: 'Mağara Otel',
      rating: 4.6,
      features: ['Kahvaltı dahil', 'Teras manzara', 'Ücretsiz Wi-Fi'],
      description: 'Peri bacalarına yakın, restore edilmiş taş odalar.',
      image:
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    },
    pickupPoints: [
      { city: 'Ankara', location: 'AŞTİ Dış Hatlar', time: '06:30', order: 0 },
      {
        city: 'Ankara',
        location: 'Kızılay Metro Çıkışı (Anadolu Otogarı servis)',
        time: '06:15',
        order: 1,
      },
    ],
  },
  {
    name: 'Safranbolu & Amasra Tarih ve Doğa Turu',
    description:
      "UNESCO mirası Safranbolu evleri, Bakırcılar Çarşısı ve Amasra'nın Karadeniz kıyısı. 2 gün 1 gece, yarım pansiyon, kültür rehberi eşliğinde kompakt ama dolu program.",
    duration: 2,
    nights: 1,
    basePrice: 3290,
    maxParticipants: 20,
    departureCity: 'Ankara',
    region: 'Karadeniz / Batı Karadeniz',
    destinations: ['Safranbolu', 'Yörük Köyü', 'Amasra'],
    tourType: 'Kültür & Doğa',
    transportation: 'Klimalı midibüs',
    difficultyLevel: 'Kolay',
    isPopular: false,
    featured: false,
    languages: ['Türkçe'],
    tags: ['safranbolu', 'amasra', 'unesco', 'hafta sonu'],
    meetingPoint: 'Ankara Kızılay Silver Turizm Ofisi önü',
    meetingTime: '07:00',
    meetingPointAddress:
      'Kızılay Meydanı, Atatürk Bulvarı No: 45, Çankaya / Ankara',
    inclusions: [
      '1 gece Safranbolu konak butik otel',
      '1 akşam yemeği',
      'Rehberlik hizmeti',
      'Müze kartı gerektiren yerlerde giriş (program dahilindekiler)',
      'Ulaşım',
    ],
    exclusions: [
      'Öğle yemekleri',
      'Kişisel harcamalar',
      'Safranbolu lokum alışverişi',
    ],
    features: ['Küçük grup', 'Fotoğraf durakları', 'Tarihi ev gezisi'],
    images: [
      'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200',
      'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=1200',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200',
    ],
    itinerary: [
      {
        day: 1,
        title: '1. Gün - Safranbolu Osmanlı mirası',
        description:
          "Ankara'dan Safranbolu'ya transfer. Cinci Han, Kaymakamlar Evi, Bakırcılar Çarşısı ve gün batımında Hidirlik Tepesi.",
        highlights: [
          'Kaymakamlar Evi',
          'Bakırcılar Çarşısı',
          'Hidirlik manzarası',
        ],
        schedule: [
          { time: '07:00', activity: 'Ankara hareket' },
          { time: '10:30', activity: 'Safranbolu varış ve kahvaltı molası' },
          { time: '11:30', activity: 'Osmanlı konakları yürüyüş turu' },
          { time: '15:00', activity: 'Yörük Köyü ziyareti' },
          { time: '18:30', activity: 'Hidirlik Tepesi gün batımı' },
        ],
      },
      {
        day: 2,
        title: '2. Gün - Amasra kıyıları ve dönüş',
        description:
          "Safranbolu'dan Amasra'ya geçiş. Kale içi, liman gezisi ve balık restoranında öğle molası (ekstra). Öğleden sonra Ankara dönüşü.",
        highlights: ['Amasra Kalesi', 'Kemere Köprüsü', 'Karadeniz manzarası'],
        schedule: [
          { time: '08:00', activity: 'Kahvaltı ve otelden çıkış' },
          { time: '09:30', activity: 'Amasra varış' },
          { time: '10:30', activity: 'Kale ve liman turu' },
          { time: '13:00', activity: 'Serbest öğle yemeği molası' },
          { time: '14:30', activity: 'Ankara yönüne hareket' },
          { time: '18:30', activity: 'Ankara varış' },
        ],
      },
    ],
    accommodation: {
      name: 'Safranbolu Konak Butik',
      location: 'Safranbolu, Karabük',
      type: 'Butik Otel',
      rating: 4.4,
      features: ['Tarihi konak', 'Bahçe', 'Kahvaltı'],
      description: 'Restore edilmiş ahşap detaylı Osmanlı konak otel.',
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    },
    pickupPoints: [
      {
        city: 'Ankara',
        location: 'Kızılay Silver Ofis',
        time: '07:00',
        order: 0,
      },
    ],
  },
  {
    name: 'Güneydoğu: Gaziantep Lezzetleri & Mardin Taşları',
    description:
      '5 gün 4 gece gastronomi ve kültür rotası. Gaziantep mutfağı, Zeugma Mozaik Müzesi, Halfeti tekne turu, Mardin sokakları ve Deyrulzafaran Manastırı. Silver Turizm konforlu otobüs ve yerel rehberler.',
    duration: 5,
    nights: 4,
    basePrice: 7990,
    maxParticipants: 28,
    departureCity: 'Ankara',
    region: 'Güneydoğu Anadolu',
    destinations: ['Gaziantep', 'Halfeti', 'Şanlıurfa', 'Mardin', 'Midyat'],
    tourType: 'Kültür & Gastronomi',
    transportation: '2+1 klimalı otobüs',
    difficultyLevel: 'Orta',
    isPopular: true,
    featured: false,
    languages: ['Türkçe', 'İngilizce', 'Arapça (Mardin günü)'],
    tags: ['gastronomi', 'mardin', 'gaziantep', 'halfeti'],
    meetingPoint: 'Ankara AŞTİ Silver Turizm peronu',
    meetingTime: '05:45',
    meetingPointAddress: 'AŞTİ Dış Hatlar, Peron 12, Yenimahalle / Ankara',
    inclusions: [
      '4 gece 4* ve butik otel konaklaması',
      '4 akşam yemeği (yerel restoran)',
      'Halfeti tekne turu',
      'Programdaki müze girişleri',
      'Profesyonel rehber',
      'Lüks otobüs ulaşımı',
    ],
    exclusions: [
      'Öğle yemekleri (rehber önerili restoranlar)',
      'Göbeklitepe ekstra giriş (isteğe bağlı uzatma)',
      'Kişisel alışveriş ve bahşiş',
    ],
    features: ['Yerel lezzet durakları', 'Tekne turu', 'Küçük grup opsiyonu'],
    images: [
      'https://images.unsplash.com/photo-1599819177826-2d8e8a4e8f1a?w=1200',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200',
      'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200',
    ],
    itinerary: [
      {
        day: 1,
        title: '1. Gün - Gaziantep mutfak kültürü',
        description:
          "Ankara'dan Gaziantep'e uzun yol transferi. Varışta Bakırcılar Çarşısı, Zeugma Mozaik Müzesi ve akşam baklava & kebap tadımı.",
        highlights: [
          'Zeugma Mozaik Müzesi',
          'Baklava atölyesi',
          'Bakırcılar Çarşısı',
        ],
        schedule: [
          { time: '05:45', activity: 'Ankara hareket' },
          { time: '12:00', activity: 'Adana mola' },
          { time: '15:30', activity: 'Gaziantep varış' },
          { time: '16:30', activity: 'Zeugma Mozaik Müzesi' },
          { time: '20:00', activity: 'Akşam yemeği — Antep mutfağı' },
        ],
      },
      {
        day: 2,
        title: '2. Gün - Halfeti ve Birecik',
        description:
          "Halfeti tekne turu ile Birecik Baraj Gölü manzarası. Öğleden sonra Şanlıurfa'ya geçiş ve Balıklıgöl ziyareti.",
        highlights: [
          'Halfeti tekne turu',
          'Batık cami manzarası',
          'Balıklıgöl',
        ],
        schedule: [
          { time: '08:00', activity: "Gaziantep'ten hareket" },
          { time: '10:30', activity: 'Halfeti tekne turu' },
          { time: '14:00', activity: 'Şanlıurfa varış' },
          { time: '16:00', activity: 'Balıklıgöl ve Mevlid-i Halil' },
          { time: '19:30', activity: 'Ciğer kebabı akşam yemeği' },
        ],
      },
      {
        day: 3,
        title: '3. Gün - Göbeklitepe ve Harran',
        description:
          "Sabah Göbeklitepe arkeolojik alanı. Harran ören yeri ve kubbeli evler. Akşam Mardin'e transfer.",
        highlights: [
          'Göbeklitepe',
          'Harran ören yeri',
          'Mardin gece manzarası',
        ],
        schedule: [
          { time: '07:00', activity: 'Göbeklitepe ziyareti' },
          { time: '10:30', activity: 'Harran turu' },
          { time: '14:00', activity: "Mardin'e transfer" },
          { time: '17:00', activity: 'Mardin Kalesi manzarası' },
          { time: '20:00', activity: 'Taş evler arasında akşam yürüyüşü' },
        ],
      },
      {
        day: 4,
        title: '4. Gün - Mardin & Midyat',
        description:
          'Eski Mardin sokakları, Kasımiye Medresesi, Deyrulzafaran Manastırı. Öğleden sonra Midyat gümüş telkari atölyesi.',
        highlights: ['Kasımiye Medresesi', 'Deyrulzafaran', 'Midyat telkari'],
        schedule: [
          { time: '09:00', activity: 'Mardin şehir turu' },
          { time: '11:30', activity: 'Deyrulzafaran Manastırı' },
          { time: '14:30', activity: 'Midyat gezisi' },
          { time: '17:00', activity: 'Serbest zaman / alışveriş' },
          { time: '20:00', activity: 'Akşam yemeği — Süryani mutfağı' },
        ],
      },
      {
        day: 5,
        title: '5. Gün - Diyarbakır surları ve dönüş',
        description:
          "Dönüş güzergahında Diyarbakır surları fotoğraf molası. Ankara'ya gece varış.",
        highlights: [
          'Diyarbakır surları',
          'Mezopotamya manzarası',
          'Ankara varış',
        ],
        schedule: [
          { time: '07:00', activity: "Mardin'den hareket" },
          { time: '10:00', activity: 'Diyarbakır sur molası' },
          { time: '13:00', activity: 'Malatya öğle molası' },
          { time: '21:00', activity: 'Ankara AŞTİ tahmini varış' },
        ],
      },
    ],
    accommodation: {
      name: 'Mardin Tas Otel',
      location: 'Eski Mardin, Mardin',
      type: 'Butik Otel',
      rating: 4.7,
      features: ['Mezopotamya manzarası', 'Teras kahvaltı', 'Tarihi taş bina'],
      description: "Eski Mardin'de restore edilmiş taş konak.",
      image:
        'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
    },
    pickupPoints: [
      { city: 'Ankara', location: 'AŞTİ Peron 12', time: '05:45', order: 0 },
      {
        city: 'Konya',
        location: 'Konya Otogarı (transit)',
        time: '09:30',
        description: 'Ekstra koltuk — ön rezervasyon',
        order: 1,
      },
    ],
  },
];

async function createTourForOperator(operatorId: string, tourData: TourSeed) {
  const existing = await prisma.tour.findFirst({
    where: { tourOperatorId: operatorId, name: tourData.name },
    select: { id: true, name: true },
  });
  if (existing) {
    console.log(`↷ Zaten var: "${existing.name}" (${existing.id})`);
    return existing.id;
  }

  const tour = await prisma.tour.create({
    data: {
      name: tourData.name,
      description: tourData.description,
      duration: tourData.duration,
      nights: tourData.nights,
      price: tourData.basePrice,
      maxParticipants: tourData.maxParticipants,
      departureCity: tourData.departureCity,
      region: tourData.region,
      destinations: tourData.destinations,
      itinerary: tourData.itinerary,
      images: tourData.images,
      inclusions: tourData.inclusions,
      exclusions: tourData.exclusions,
      features: tourData.features,
      tourType: tourData.tourType,
      transportation: tourData.transportation,
      difficultyLevel: tourData.difficultyLevel,
      isPopular: tourData.isPopular,
      featured: tourData.featured,
      languages: tourData.languages,
      tags: tourData.tags,
      meetingPoint: tourData.meetingPoint,
      meetingTime: tourData.meetingTime,
      meetingPointAddress: tourData.meetingPointAddress,
      tourOperatorId: operatorId,
    },
  });

  await prisma.tourAccommodation.create({
    data: {
      tourId: tour.id,
      name: tourData.accommodation.name,
      image: tourData.accommodation.image,
      location: tourData.accommodation.location,
      type: tourData.accommodation.type,
      rating: tourData.accommodation.rating,
      features: tourData.accommodation.features,
      description: tourData.accommodation.description,
    },
  });

  for (const point of tourData.pickupPoints) {
    await prisma.tourPickupPoint.create({
      data: {
        tourId: tour.id,
        city: point.city,
        location: point.location,
        time: point.time,
        description: point.description ?? null,
        order: point.order,
      },
    });
  }

  const dateSpecs = buildTourDateSpecs(
    tourData.basePrice,
    tourData.duration,
    tourData.maxParticipants,
  );
  for (const spec of dateSpecs) {
    const tourDate = await prisma.tourDate.create({
      data: {
        tourId: tour.id,
        startDate: spec.startDate,
        endDate: spec.endDate,
        price: spec.price,
        availableSeats: spec.availableSeats,
        soldSeats: 0,
        waitingList: 0,
        minParticipants: Math.min(8, tourData.maxParticipants),
        maxParticipants: tourData.maxParticipants,
        earlyBirdDiscount: 12,
        lastMinuteDiscount: 8,
        earlyBirdDeadlineStart: addDays(spec.startDate, -45),
        earlyBirdDeadline: addDays(spec.startDate, -21),
        lastMinuteStart: addDays(spec.startDate, -10),
        lastMinuteStartEnd: addDays(spec.startDate, -2),
        status: 'ACTIVE',
        isActive: true,
      },
    });

    for (const range of defaultAgeRanges) {
      await prisma.tourDateAgeRange.create({
        data: {
          tourDateId: tourDate.id,
          minAge: range.minAge,
          maxAge: range.maxAge,
          pricingType: range.pricingType,
          value: range.pricingType === 'fixed' ? spec.price : range.value,
        },
      });
    }
  }

  console.log(`✔ Oluşturuldu: "${tour.name}" → /tour/${tour.id}`);
  return tour.id;
}

async function main() {
  const operator = await prisma.tourOperator.findFirst({
    where: { email: SILVER_OPERATOR_EMAIL },
  });

  if (!operator) {
    throw new Error(
      `${SILVER_OPERATOR_EMAIL} bulunamadı. Önce: npm run db:seed veya pnpm db:seed çalıştırın.`,
    );
  }

  console.log(`Silver operatör: ${operator.companyName} (${operator.id})\n`);

  const ids: string[] = [];
  for (const tourData of silverTours) {
    ids.push(await createTourForOperator(operator.id, tourData));
  }

  console.log('\nTamamlandı. Tur ID listesi:', ids);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
