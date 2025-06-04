import { PrismaClient, TourOperatorStatus } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Test kullanıcılarını oluştur (eğer yoksa)
    const testOperatorUser = await prisma.user.upsert({
      where: { email: 'test.operator@tourtech.com' },
      update: {},
      create: {
        name: 'Test Tur Operatörü',
        email: 'test.operator@tourtech.com',
        password: await hash('test123', 12),
        role: 'TOUR_OPERATOR',
      }
    });

    const testActivityUser = await prisma.user.upsert({
      where: { email: 'test.activity@tourtech.com' },
      update: {},
      create: {
        name: 'Test Aktivite Sağlayıcı',
        email: 'test.activity@tourtech.com',
        password: await hash('test123', 12),
        role: 'EXPERIENCE_PROVIDER',
      }
    });

    // Test tur operatörünü oluştur (eğer yoksa)
    const testOperator = await prisma.tourOperator.upsert({
      where: { email: 'test.operator@tourtech.com' },
    update: {},
    create: {
        companyName: 'Test Tur Operatörü',
        email: 'test.operator@tourtech.com',
        phone: '5551234567',
        status: TourOperatorStatus.approved,
        userId: testOperatorUser.id,
      }
    });

    // Test aktivite sağlayıcısını oluştur (eğer yoksa)
    const testActivityOperator = await prisma.experienceOperator.upsert({
      where: { email: 'test.activity@tourtech.com' },
      update: {},
      create: {
        companyName: 'Test Aktivite Sağlayıcı',
        email: 'test.activity@tourtech.com',
        phone: '5551234568',
        status: 'APPROVED',
        userId: testActivityUser.id,
        description: 'Test aktivite sağlayıcı açıklaması',
      city: 'İstanbul',
        address: 'Test Adres',
      }
    });

    // Karadeniz turlarını temizle
    await prisma.tourDate.deleteMany({
      where: {
        tour: {
          name: {
            contains: 'Karadeniz'
          }
        }
      }
    });
    await prisma.tourPickupPoint.deleteMany({
      where: {
        tour: {
          name: {
            contains: 'Karadeniz'
          }
        }
      }
    });
    await prisma.tour.deleteMany({
      where: {
        name: {
          contains: 'Karadeniz'
        }
      }
    });

    // Karadeniz turlarını oluştur
    const karadenizTours = [
      {
        name: 'Karadeniz Yaylaları Turu',
        description: 'Karadeniz\'in eşsiz yaylalarını keşfedin',
        duration: 5,
        price: 5000,
        discount: 10,
        maxParticipants: 25,
        images: [
          'https://images.unsplash.com/photo-1564742223598-263e61b72e92',
          'https://images.unsplash.com/photo-1564742228304-7b91caa08b11',
        ],
      },
      {
        name: 'Doğu Karadeniz Kültür Turu',
        description: 'Doğu Karadeniz\'in kültürel zenginliklerini keşfedin',
        duration: 4,
        price: 4000,
        discount: 15,
        maxParticipants: 20,
        images: [
          'https://images.unsplash.com/photo-1564742223598-263e61b72e92',
          'https://images.unsplash.com/photo-1564742228304-7b91caa08b11',
        ],
      },
      {
        name: 'Batum & Borçka Turu',
        description: 'Gürcistan sınırında muhteşem bir gezi',
        duration: 3,
        price: 3500,
        maxParticipants: 15,
        images: [
          'https://images.unsplash.com/photo-1564742223598-263e61b72e92',
          'https://images.unsplash.com/photo-1564742228304-7b91caa08b11',
        ],
      },
      {
        name: 'Sümela & Zigana Turu',
        description: 'Tarihi Sümela Manastırı ve Zigana\'yı keşfedin',
        duration: 2,
        price: 2500,
        discount: 5,
        maxParticipants: 20,
        images: [
          'https://images.unsplash.com/photo-1564742223598-263e61b72e92',
          'https://images.unsplash.com/photo-1564742228304-7b91caa08b11',
        ],
      },
      {
        name: 'Fırtına Vadisi & Çamlıhemşin Turu',
        description: 'Doğa ve adrenalin dolu bir macera',
        duration: 3,
        price: 3000,
        discount: 20,
        maxParticipants: 18,
        images: [
          'https://images.unsplash.com/photo-1564742223598-263e61b72e92',
          'https://images.unsplash.com/photo-1564742228304-7b91caa08b11',
        ],
      }
    ];

    for (const tourData of karadenizTours) {
      const tour = await prisma.tour.create({
        data: {
          name: tourData.name,
          description: tourData.description,
          duration: tourData.duration,
          price: tourData.price,
          maxParticipants: tourData.maxParticipants,
          currentParticipants: 0,
          images: tourData.images,
          inclusions: [
            'Konaklama',
            'Kahvaltı',
            'Rehberlik Hizmeti',
            'Ulaşım'
          ],
          exclusions: [
            'Akşam Yemeği',
            'Ekstra Aktiviteler'
          ],
          itinerary: Array.from({ length: tourData.duration }, (_, i) => ({
            title: `${i + 1}. Gün`,
            description: 'Detaylı program yakında eklenecek'
          })),
        featured: true,
          tourOperatorId: testOperator.id,
          departureCity: 'İstanbul',
          transportation: 'Otobüs',
        period: 'Yaz',
          tourType: 'Doğa Turu',
        accommodationType: 'Otel',
        difficultyLevel: 'Orta',
          ageRestriction: 0,
          languages: ['Türkçe'],
          tags: ['doğa', 'yayla', 'kültür'],
          features: ['WiFi', 'Klima', 'Rehber'],
          meetingPoint: 'Kadıköy Rıhtım',
          meetingTime: '07:00',
          destinations: [
            {
              city: 'Trabzon',
              description: 'Karadeniz\'in incisi'
            },
            {
              city: 'Rize',
              description: 'Çay ve yeşilin başkenti'
            }
          ]
        }
      });

      // Her tur için 3 farklı tarih oluştur (Haziran, Temmuz, Ağustos)
      const months = [
        { month: 6, price: tourData.price },
        { month: 7, price: tourData.price * 1.1 }, // Temmuz +%10
        { month: 8, price: tourData.price * 1.2 }  // Ağustos +%20
      ];

      for (const { month, price } of months) {
        const startDate = new Date(2024, month - 1, 15);
        const endDate = new Date(2024, month - 1, 15 + tourData.duration - 1);

        await prisma.tourDate.create({
    data: {
            tourId: tour.id,
            startDate,
            endDate,
            availableSeats: tourData.maxParticipants,
            soldSeats: 0,
            waitingList: 0,
            minParticipants: Math.floor(tourData.maxParticipants * 0.4),
            maxParticipants: tourData.maxParticipants,
            earlyBirdDiscount: tourData.discount || 0,
            lastMinuteDiscount: 5,
            earlyBirdDeadline: new Date(2024, month - 2, 15),
            lastMinuteStart: new Date(2024, month - 1, 10),
            notes: 'Erken rezervasyon fırsatı',
            status: 'ACTIVE',
            price: price
          }
        });
      }

      // Her tur için ortak yolcu alma noktaları
      await prisma.tourPickupPoint.createMany({
        data: [
          {
            tourId: tour.id,
            city: 'İstanbul',
            location: 'Kadıköy Rıhtım',
            time: '07:00',
            description: 'Rıhtım otobüs durağı önü',
            order: 1,
            isActive: true
          },
          {
            tourId: tour.id,
            city: 'İstanbul',
            location: 'Beşiktaş İskele',
            time: '07:30',
            description: 'İskele meydanı',
            order: 2,
            isActive: true
          }
        ]
      });
    }

    console.log('Karadeniz turları başarıyla oluşturuldu');
    
    // Add accommodation for each tour (unique constraint hatası önleniyor)
    const tours = await prisma.tour.findMany();
    for (const tour of tours) {
      const existing = await prisma.tourAccommodation.findUnique({ where: { tourId: tour.id } });
      if (!existing) {
        await prisma.tourAccommodation.create({
          data: {
            name: "Rixos Premium Belek",
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
            location: "Belek, Antalya",
            type: "Ultra Her Şey Dahil",
            rating: 4.8,
            features: ["Özel Plaj", "Açık Havuz", "SPA Merkezi", "Fitness Merkezi", "Restoran & Bar"],
            description: "Lüks ve konforun buluştuğu, Akdeniz'in eşsiz kıyısında yer alan 5 yıldızlı otel.",
            tourId: tour.id
          }
        });
      }
    }

    // Test deneyimi ekle (meetingPoint ile)
    await prisma.experience.create({
      data: {
        title: 'Kapadokya Balon Turu',
        description: 'Kapadokya semalarında gün doğumunda unutulmaz bir balon turu deneyimi!',
        longDescription: `Kapadokya'nın büyüleyici manzarasında, profesyonel pilotlar eşliğinde gün doğumunda balon turu. Tur öncesi otelden transfer, uçuş sonrası kutlama ve sertifika. Farklı kalkış noktaları, çeşitli uçuş süreleri ve özel fotoğraf molaları ile zenginleştirilmiş bir deneyim.\n\nTur programı boyunca peri bacaları, vadiler ve tarihi köyler üzerinde süzülürken, Kapadokya'nın eşsiz güzelliklerini kuş bakışı izleyebilirsiniz.\n\nTüm güvenlik önlemleri alınmış olup, her katılımcıya uçuş öncesi kısa bir bilgilendirme yapılır.`,
        imageUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=2070&auto=format&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1464983953574-0892a716854b?q=80&w=2070&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?q=80&w=2070&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2070&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?q=80&w=2070&auto=format&fit=crop'
        ],
        location: 'Kapadokya, Nevşehir',
        duration: '1',
        price: 3200,
        category: 'Macera',
        included: [
          'Balon uçuşu (yaklaşık 1 saat)',
          'Otelden çift yön transfer',
          'Uçuş sonrası kutlama (alkolsüz şampanya)',
          'Uçuş sertifikası',
          'Profesyonel pilot ve ekip',
          'Sigorta',
          'Fotoğraf molası'
        ],
        notIncluded: [
          'Kahvaltı',
          'Kişisel harcamalar',
          'Ekstra fotoğraf ve video çekimi',
          'Bahşişler'
        ],
        highlights: [
          'Gün doğumunda balon uçuşu',
          'Peri bacaları ve vadiler üzerinde süzülme',
          'Kutlama ve sertifika',
          'Profesyonel ekip',
          'Unutulmaz fotoğraf kareleri'
        ],
        schedule: [
          { time: '04:30', activity: 'Otelden transfer ve kalkış alanına varış' },
          { time: '05:00', activity: 'Kısa bilgilendirme ve hazırlık' },
          { time: '05:15', activity: 'Balonun şişirilmesi ve biniş' },
          { time: '05:30', activity: 'Gün doğumunda balon uçuşu (yaklaşık 1 saat)' },
          { time: '06:30', activity: 'İniş, kutlama ve sertifika dağıtımı' },
          { time: '07:00', activity: 'Otele dönüş transferi' }
        ],
        featured: true,
        userId: testActivityUser.id,
        meetingPoint: 'https://maps.google.com/?q=38.6431,34.8270',
        meetingPointAddress: 'Göreme Balon Kalkış Alanı, Müze Cd. No:36, 50180 Göreme/Nevşehir',
        activityDates: {
          create: [
            { startDate: new Date('2024-08-01T04:30:00Z'), endDate: new Date('2024-08-01T07:00:00Z'), price: 3200, availableSeats: 16 },
            { startDate: new Date('2024-08-05T04:30:00Z'), endDate: new Date('2024-08-05T07:00:00Z'), price: 3400, availableSeats: 12 },
            { startDate: new Date('2024-08-10T04:30:00Z'), endDate: new Date('2024-08-10T07:00:00Z'), price: 3500, availableSeats: 10 }
          ]
        }
      }
    });

    // Sadece adres ile test edilecek yeni bir aktivite ekle
    await prisma.experience.create({
      data: {
        title: 'Adresli Aktivite (Haritasız)',
        description: 'Sadece adres gösterimi için seed edilen test aktivitesi.',
        longDescription: 'Bu aktivite, sadece meetingPointAddress alanı ile test amaçlı eklenmiştir. Harita veya link yoktur.',
        imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1464983953574-0892a716854b?q=80&w=2070&auto=format&fit=crop'
        ],
        location: 'Milano',
        duration: '1',
        price: 1234,
        category: 'Test',
        included: ['Test dahil'],
        notIncluded: ['Test hariç'],
        highlights: ['Adresli test highlight'],
        schedule: [
          { time: '18:00', activity: 'Buluşma ve başlangıç' }
        ],
        featured: false,
        userId: (await prisma.user.findFirst({ where: { email: 'test.activity@tourtech.com' } }))?.id ?? '',
        meetingPoint: '',
        meetingPointAddress: 'Il Teatro della Pasta, 20159 Milano, Lombardiya, İtalya',
      }
    });

    // Sadece aktivite detaylarını test edebileceğin yeni bir deneyim ekle
    await prisma.experience.create({
      data: {
        title: 'İstanbul Boğazı Tekne Turu',
        description: 'Boğazın eşsiz manzarasında unutulmaz bir tekne turu.',
        longDescription: 'İstanbul Boğazı\'nda, tarihi yalılar ve köprüler eşliğinde rehberli bir tekne turu. Fotoğraf molaları ve ikramlar dahil.',
        imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1464983953574-0892a716854b?q=80&w=2070&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=2070&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?q=80&w=2070&auto=format&fit=crop'
        ],
        location: 'İstanbul Boğazı',
        duration: '2',
        price: 950,
        category: 'Deniz Turları',
        included: [
          'Rehberlik hizmeti',
          'Çay ve simit ikramı',
          'Fotoğraf molası',
          'Sigorta'
        ],
        notIncluded: [
          'Ulaşım',
          'Kişisel harcamalar',
          'Ekstra yiyecek ve içecekler'
        ],
        highlights: [
          'Boğaz köprüleri ve tarihi yalılar',
          'Profesyonel rehber anlatımı',
          'Eşsiz fotoğraf fırsatları',
          'İstanbul silüeti eşliğinde çay keyfi'
        ],
        schedule: [
          { time: '10:00', activity: 'Kabataş İskelesi buluşma' },
          { time: '10:30', activity: 'Tekne ile boğaz turu başlangıcı' },
          { time: '11:30', activity: 'Fotoğraf ve çay molası' },
          { time: '12:00', activity: 'Kabataş İskelesi dönüş' }
        ],
        featured: false,
        userId: testActivityUser.id,
        meetingPoint: 'https://maps.google.com/?q=41.0342,28.9948',
        meetingPointAddress: 'Bebek Sahili, Beşiktaş/İstanbul',
      }
    });

    // HATA OLSA BİLE EN BAŞTA TEST KAYDI EKLE
    await prisma.experience.create({
      data: {
        title: 'Test Activity - Meeting Point',
        description: 'Seed test activity for meeting point',
        longDescription: 'Bu kayıt seed scripti başında eklenir ve meetingPoint test içindir.',
        imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1464983953574-0892a716854b?q=80&w=2070&auto=format&fit=crop'
        ],
        location: 'Test Lokasyon',
        duration: '1',
        price: 100,
        category: 'Test',
        included: ['Test dahil'],
        notIncluded: ['Test hariç'],
        highlights: ['Test highlight'],
        schedule: [
          { time: '10:00', activity: 'Test buluşma' }
        ],
        featured: false,
        userId: (await prisma.user.findFirst({ where: { email: 'test.activity@tourtech.com' } }))?.id ?? '',
        meetingPoint: 'https://maps.google.com/?q=41.015137,28.979530',
        meetingPointAddress: 'Test Lokasyon, İstanbul',
      }
    });

    // --- AKTİVİTE (EXPERIENCE) TABLOSUNA KESİN SEED ---
    (async () => {
      try {
        let testUser = await prisma.user.findFirst({ where: { email: 'test.activity@tourtech.com' } });
        if (!testUser) {
          testUser = await prisma.user.create({
            data: {
              name: 'Test Aktivite Sağlayıcı',
              email: 'test.activity@tourtech.com',
              password: await hash('test123', 12),
              role: 'EXPERIENCE_PROVIDER',
            }
          });
        }
        const existing = await prisma.experience.findFirst({ where: { title: 'Seed Garantili Aktivite' } });
        if (!existing) {
          await prisma.experience.create({
            data: {
              title: 'Seed Garantili Aktivite',
              description: 'Bu kayıt seed scriptinin en başında eklenir ve asla silinmez.',
              longDescription: 'Test ve demo amaçlıdır.',
              imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop',
              gallery: [
                'https://images.unsplash.com/photo-1464983953574-0892a716854b?q=80&w=2070&auto=format&fit=crop'
              ],
              location: 'Test Lokasyon',
              duration: '1',
              price: 100,
              category: 'Test',
              included: ['Test dahil'],
              notIncluded: ['Test hariç'],
              highlights: ['Test highlight'],
              schedule: [
                { time: '10:00', activity: 'Test buluşma' }
              ],
              featured: false,
              userId: testUser.id,
              meetingPoint: 'https://maps.google.com/?q=41.015137,28.979530',
              meetingPointAddress: 'Test Lokasyon, İstanbul',
            }
          });
          console.log('Seed Garantili Aktivite başarıyla eklendi!');
        }
      } catch (e) {
        console.error('Seed Garantili Aktivite eklenemedi:', e);
      }
    })();

    // --- AIRBNB BENZERİ ZENGİN AKTİVİTE SEEDLERİ ---
    try {
      const testUser = await prisma.user.findFirst({ where: { email: 'test.activity@tourtech.com' } });
      if (testUser) {
        // 1. İstanbul Boğazı Yürüyüşü
        await prisma.experience.create({
          data: {
            title: 'İstanbul Boğazı Yürüyüşü',
            description: 'Boğaz kıyısında rehberli yürüyüş ve fotoğraf molaları.',
            longDescription: 'İstanbul Boğazı boyunca, tarihi yalılar ve köprüler eşliğinde rehberli bir yürüyüş. Farklı saatlerde buluşma ve çeşitli rotalar.',
            imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop',
            gallery: [
              'https://images.unsplash.com/photo-1464983953574-0892a716854b?q=80&w=2070&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=2070&auto=format&fit=crop'
            ],
            location: 'İstanbul',
            duration: '2',
            price: 350,
            category: 'Şehir Turları',
            included: ['Rehberlik', 'Fotoğraf molası'],
            notIncluded: ['Ulaşım', 'Yemek'],
            highlights: ['Boğaz manzarası', 'Tarihi yalılar'],
            schedule: [
              { time: '10:00', activity: 'Bebek buluşma' },
              { time: '12:00', activity: 'Ortaköy bitiş' }
            ],
            featured: false,
            userId: testUser.id,
            meetingPoint: 'https://maps.google.com/?q=41.0766,29.0434',
            meetingPointAddress: 'Bebek Sahili, Beşiktaş/İstanbul',
            activityDates: {
              create: [
                { startDate: new Date('2024-07-01T10:00:00Z'), endDate: new Date('2024-07-01T12:00:00Z'), price: 350, availableSeats: 10 },
                { startDate: new Date('2024-07-05T14:00:00Z'), endDate: new Date('2024-07-05T16:00:00Z'), price: 350, availableSeats: 8 }
              ]
            }
          }
        });
        // 2. Kapadokya Balon Deneyimi
        await prisma.experience.create({
          data: {
            title: 'Kapadokya Balon Deneyimi',
            description: 'Gün doğumunda balonla Kapadokya turu.',
            longDescription: 'Kapadokya\'nın eşsiz manzarasında, farklı gün ve saatlerde balon uçuşu. Her uçuşun buluşma noktası farklı.',
            imageUrl: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?q=80&w=2070&auto=format&fit=crop',
            gallery: [
              'https://images.unsplash.com/photo-1570654230464-9c862da9c189?q=80&w=2070&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1669156130305-2c9ab81b8440?q=80&w=2070&auto=format&fit=crop'
            ],
            location: 'Kapadokya',
            duration: '1',
            price: 2500,
            category: 'Macera',
            included: ['Balon uçuşu', 'Transfer'],
            notIncluded: ['Kahvaltı'],
            highlights: ['Gün doğumu', 'Peri bacaları'],
            schedule: [
              { time: '05:00', activity: 'Buluşma ve hazırlık' },
              { time: '06:00', activity: 'Balon uçuşu' }
            ],
            featured: true,
            userId: testUser.id,
            meetingPoint: 'https://maps.google.com/?q=38.6431,34.8270',
            meetingPointAddress: 'Göreme Balon Kalkış Alanı, Kapadokya/Nevşehir',
            activityDates: {
              create: [
                { startDate: new Date('2024-07-10T05:00:00Z'), endDate: new Date('2024-07-10T07:00:00Z'), price: 2500, availableSeats: 12 },
                { startDate: new Date('2024-07-12T05:00:00Z'), endDate: new Date('2024-07-12T07:00:00Z'), price: 2600, availableSeats: 10 }
              ]
            }
          }
        });
        // 3. İzmir Gurme Turu
        await prisma.experience.create({
          data: {
            title: 'İzmir Gurme Turu',
            description: 'Kordon\'da lezzetli bir gün.',
            longDescription: 'İzmir\'in en iyi restoranlarında, farklı gün ve saatlerde gurme turu. Her turun buluşma noktası farklı.',
            imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop',
            gallery: [
              'https://images.unsplash.com/photo-1464983953574-0892a716854b?q=80&w=2070&auto=format&fit=crop'
            ],
            location: 'İzmir',
            duration: '3',
            price: 700,
            category: 'Gastronomi',
            included: ['Yemek tadımı', 'Rehberlik'],
            notIncluded: ['Ulaşım'],
            highlights: ['Kordon', 'Yerel lezzetler'],
            schedule: [
              { time: '13:00', activity: 'Kordon buluşma' },
              { time: '16:00', activity: 'Tur bitişi' }
            ],
            featured: false,
            userId: testUser.id,
            meetingPoint: 'https://maps.google.com/?q=38.4280,27.1287',
            meetingPointAddress: 'Kordonboyu, Alsancak/İzmir',
            activityDates: {
              create: [
                { startDate: new Date('2024-07-15T13:00:00Z'), endDate: new Date('2024-07-15T16:00:00Z'), price: 700, availableSeats: 15 },
                { startDate: new Date('2024-07-20T13:00:00Z'), endDate: new Date('2024-07-20T16:00:00Z'), price: 750, availableSeats: 12 }
              ]
            }
          }
        });
      }
    } catch (e) {
      console.error('Airbnb benzeri aktivite seed hatası:', e);
    }

  } catch (error) {
    console.error('Seed hatası:', error);
    throw error;
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