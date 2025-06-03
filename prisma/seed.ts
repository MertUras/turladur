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
    
    // Add accommodation for each tour
    const tours = await prisma.tour.findMany();
    
    for (const tour of tours) {
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