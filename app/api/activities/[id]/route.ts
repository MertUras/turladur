import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseJsonArray, parseJsonSchedule } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export interface Activity {
    id: number;
    title: string;
    description: string;
    longDescription: string;
    imageUrl: string;
    gallery: string[];
    location: string;
    duration: string;
    rating: number;
    reviewCount: number;
    popularityRate: number;
    price: number;
    category: string;
    included: string[];
    notIncluded: string[];
    highlights: string[];
    schedule: Array<{ time: string; activity: string }>;
    reviews: Array<{
        id: number;
        name: string;
        rating: number;
        comment: string;
        date: string;
    }>;
    meetingPoint?: string;
    meetingPointAddress?: string;
}

export const activities: Activity[] = [
    {
        id: 1,
        title: "Kapadokya Balon Turu",
        description: "Güneşin doğuşunu gökyüzünden izleyin",
        longDescription: `Kapadokya'nın eşsiz manzarasını gökyüzünden keşfedin. Profesyonel pilotlar eşliğinde güvenli ve unutulmaz bir balon deneyimi yaşayın.

Gün doğumunda başlayan bu büyülü yolculukta, Kapadokya'nın peribacaları, vadileri ve tarihi yerleşim yerlerini kuşbakışı görme fırsatı bulacaksınız. Yaklaşık 1 saat süren uçuş sonrası geleneksel şampanya seremonisi ile turumuzu tamamlıyoruz.`,
        imageUrl: "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?q=80&w=2070&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1570654230464-9c862da9c189?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1669156130305-2c9ab81b8440?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1669156130293-fb8a5cb3b9a2?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1669156130246-09796d3e951b?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1599108859519-8ac78d18b341?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1647517368034-e2f4b0a22f06?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1647517367964-c8a615d6ed92?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?q=80&w=2070&auto=format&fit=crop"
        ],
        location: "Kapadokya, Nevşehir",
        duration: "3 Saat",
        rating: 4.9,
        reviewCount: 1250,
        popularityRate: 98,
        price: 4200,
        category: "Hava Aktiviteleri",
        included: [
            "Otel transferleri",
            "Balon uçuşu (45-60 dakika)",
            "Şampanya seremonisi",
            "Uçuş sertifikası",
            "Sigorta"
        ],
        notIncluded: [
            "Ekstra aktiviteler",
            "Kişisel harcamalar",
            "Bahşişler"
        ],
        highlights: [
            "Güneş doğumunda büyüleyici Kapadokya manzarası",
            "Profesyonel pilotlar eşliğinde güvenli uçuş",
            "Peribacaları ve vadiler üzerinde panoramik görüntüler",
            "Şampanya eşliğinde uçuş sertifikası seremonisi"
        ],
        schedule: [
            { time: "04:30", activity: "Otel transferi" },
            { time: "05:00", activity: "Kalkış alanına varış ve hazırlıklar" },
            { time: "05:30", activity: "Balon şişirme ve kalkış" },
            { time: "06:30", activity: "İniş ve şampanya seremonisi" },
            { time: "07:30", activity: "Otele dönüş" }
        ],
        reviews: [
            {
                id: 1,
                name: "Ahmet H.",
                rating: 5,
                comment: "Muhteşem bir deneyimdi! Pilot çok profesyoneldi ve manzara inanılmazdı.",
                date: "2024-03-15"
            },
            {
                id: 2,
                name: "Ayşe K.",
                rating: 5,
                comment: "Hayatımda yaşadığım en güzel deneyimlerden biri. Kesinlikle tavsiye ediyorum.",
                date: "2024-03-10"
            },
            {
                id: 3,
                name: "Mehmet S.",
                rating: 4,
                comment: "Çok güzel bir deneyimdi, sadece hava biraz soğuktu.",
                date: "2024-03-05"
            }
        ]
    },
    {
        id: 2,
        title: "Pamukkale Travertenleri Turu",
        description: "Doğal beyaz terasları keşfedin",
        longDescription: "Pamukkale'nin dünyaca ünlü beyaz travertenlerini ve antik Hierapolis kentini keşfedin. UNESCO Dünya Mirası Listesi'nde yer alan bu eşsiz doğa harikasında unutulmaz bir gün geçirin.",
        imageUrl: "https://images.unsplash.com/photo-1642435480504-70a13d6dce91?q=80&w=1974&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1642435480504-70a13d6dce91?q=80&w=1974&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1643840697855-9a2e81c5c1a4?q=80&w=1974&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1643840697855-9a2e81c5c1a4?q=80&w=1974&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1643840697855-9a2e81c5c1a4?q=80&w=1974&auto=format&fit=crop"
        ],
        location: "Pamukkale, Denizli",
        duration: "8 Saat",
        rating: 4.8,
        reviewCount: 850,
        popularityRate: 95,
        price: 1800,
        category: "Doğa Turları",
        included: [
            "Rehberlik hizmeti",
            "Ulaşım",
            "Müze giriş ücretleri",
            "Öğle yemeği",
            "Sigorta"
        ],
        notIncluded: [
            "Ekstra aktiviteler",
            "Kişisel harcamalar",
            "İçecekler"
        ],
        highlights: [
            "UNESCO Dünya Mirası Listesi'ndeki travertenler",
            "Antik Hierapolis kenti",
            "Kleopatra Havuzu (opsiyonel)",
            "Profesyonel rehber eşliğinde tur"
        ],
        schedule: [
            { time: "08:00", activity: "Otel transferi" },
            { time: "09:30", activity: "Pamukkale'ye varış" },
            { time: "10:00", activity: "Travertenleri gezisi" },
            { time: "12:30", activity: "Öğle yemeği" },
            { time: "14:00", activity: "Hierapolis antik kenti turu" },
            { time: "16:00", activity: "Serbest zaman" },
            { time: "17:00", activity: "Dönüş yolculuğu" }
        ],
        reviews: [
            {
                id: 1,
                name: "Zeynep A.",
                rating: 5,
                comment: "Harika bir deneyimdi, rehberimiz çok bilgiliydi.",
                date: "2024-03-12"
            },
            {
                id: 2,
                name: "Can B.",
                rating: 4,
                comment: "Manzara muhteşemdi, kesinlikle görülmeli.",
                date: "2024-03-08"
            }
        ]
    },
    {
        id: 3,
        title: "Kapadokya ATV Safari",
        description: "Vadileri ATV ile keşfedin",
        longDescription: "Kapadokya'nın eşsiz vadilerini ve peri bacalarını ATV motorlar ile keşfedin. Gün batımında yapacağımız turda, bölgenin en güzel manzaralarını görecek ve unutulmaz anlar yaşayacaksınız.",
        imageUrl: "https://images.unsplash.com/photo-1622125114823-344e5e14125f?q=80&w=1974&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1622125114823-344e5e14125f?q=80&w=1974&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1622125297125-c89f47771cd2?q=80&w=1974&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1622125297623-5c7be8449269?q=80&w=1974&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1601024445121-e294d15442b7?q=80&w=1974&auto=format&fit=crop"
        ],
        location: "Kapadokya, Nevşehir",
        duration: "2 Saat",
        rating: 4.7,
        reviewCount: 450,
        popularityRate: 92,
        price: 1200,
        category: "Macera",
        included: [
            "ATV kiralama",
            "Güvenlik ekipmanları",
            "Rehberlik hizmeti",
            "Sigorta"
        ],
        notIncluded: [
            "Otel transferi",
            "Kişisel harcamalar",
            "Fotoğraf çekimi"
        ],
        highlights: [
            "Güneş batımında vadilerde ATV sürüşü",
            "Kızıl Vadi ve Aşk Vadisi turu",
            "Profesyonel rehber eşliğinde güvenli sürüş",
            "Muhteşem fotoğraf fırsatları"
        ],
        schedule: [
            { time: "16:30", activity: "Karşılama ve güvenlik brifingi" },
            { time: "17:00", activity: "ATV safari başlangıcı" },
            { time: "18:00", activity: "Vadi manzarası molası" },
            { time: "19:00", activity: "Tur bitişi" }
        ],
        reviews: [
            {
                id: 1,
                name: "Burak D.",
                rating: 5,
                comment: "Harika bir deneyimdi, kesinlikle tavsiye ederim!",
                date: "2024-03-14"
            }
        ]
    },
    {
        id: 4,
        title: "Kapadokya Yöresel Gözleme Yapımı",
        description: "Geleneksel lezzetleri öğrenin",
        longDescription: "Yerel bir ailede geleneksel Türk gözlemesinin yapılışını öğrenin. Taze malzemeler ve otantik atmosferde unutulmaz bir yemek deneyimi yaşayın.",
        imageUrl: "https://images.unsplash.com/photo-1608797178977-8f0e8b90e499?q=80&w=1974&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1608797178977-8f0e8b90e499?q=80&w=1974&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1608797178977-8f0e8b90e499?q=80&w=1974&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1608797178977-8f0e8b90e499?q=80&w=1974&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1608797178977-8f0e8b90e499?q=80&w=1974&auto=format&fit=crop"
        ],
        location: "Kapadokya, Nevşehir",
        duration: "3 Saat",
        rating: 4.9,
        reviewCount: 320,
        popularityRate: 96,
        price: 800,
        category: "Yemek",
        included: [
            "Tüm malzemeler",
            "Yemek dersi",
            "İkramlar",
            "Tarif kitapçığı"
        ],
        notIncluded: [
            "Ulaşım",
            "Ekstra içecekler"
        ],
        highlights: [
            "Yerel bir ailede gözleme yapımı",
            "Geleneksel tarifleri öğrenme",
            "Taze ve organik malzemeler",
            "Türk çayı eşliğinde sohbet"
        ],
        schedule: [
            { time: "10:00", activity: "Karşılama ve tanışma" },
            { time: "10:30", activity: "Malzemelerin tanıtımı" },
            { time: "11:00", activity: "Gözleme yapımı" },
            { time: "12:00", activity: "Hazırlanan gözlemelerin tadımı" }
        ],
        reviews: [
            {
                id: 1,
                name: "Sarah M.",
                rating: 5,
                comment: "Çok keyifli bir deneyimdi, ev sahiplerimiz harikaydı!",
                date: "2024-03-13"
            }
        ]
    },
    {
        id: 5,
        title: "Kapadokya Şarap Tadımı",
        description: "Yerel şarapları keşfedin",
        longDescription: "Kapadokya'nın ünlü şaraplarını profesyonel bir sommelier eşliğinde tadın. Bölgenin tarihi şarap kültürünü öğrenin ve yerel üzümlerden yapılan özel şarapları deneyimleyin.",
        imageUrl: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=1974&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=1974&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=1974&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=1974&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=1974&auto=format&fit=crop"
        ],
        location: "Kapadokya, Nevşehir",
        duration: "2 Saat",
        rating: 4.8,
        reviewCount: 280,
        popularityRate: 94,
        price: 1500,
        category: "Yemek",
        included: [
            "6 farklı şarap tadımı",
            "Peynir tabağı",
            "Profesyonel sommelier",
            "Şarap notları kitapçığı"
        ],
        notIncluded: [
            "Ulaşım",
            "Ekstra şarap siparişleri",
            "Bahşişler"
        ],
        highlights: [
            "Profesyonel sommelier eşliğinde tadım",
            "Yerel üzüm çeşitlerini tanıma",
            "Tarihi şarap mahzeninde deneyim",
            "Özel peynir tabağı eşliğinde tadım"
        ],
        schedule: [
            { time: "17:00", activity: "Karşılama ve şarap kültürü sunumu" },
            { time: "17:30", activity: "Şarap mahzeni turu" },
            { time: "18:00", activity: "Şarap tadımı başlangıcı" },
            { time: "19:00", activity: "Soru-cevap ve kapanış" }
        ],
        reviews: [
            {
                id: 1,
                name: "Elena K.",
                rating: 5,
                comment: "Muhteşem şaraplar ve çok bilgilendirici bir deneyim!",
                date: "2024-03-11"
            }
        ]
    },
    {
        id: 6,
        title: "Kapadokya At Binme Turu",
        description: "Vadileri atlarla keşfedin",
        longDescription: "Kapadokya'nın büyüleyici vadilerini ve peri bacalarını Anadolu atları üzerinde keşfedin. Profesyonel biniciler eşliğinde, hem doğanın hem de tarihin içinde unutulmaz bir yolculuğa çıkın.",
        imageUrl: "https://images.unsplash.com/photo-1600697394936-59934aa5951f?q=80&w=2070&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1600697394936-59934aa5951f?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1600697394799-f172eff8c3f6?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1600697394590-8d3e0ad1352f?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1600697394431-0d7e2c0a4130?q=80&w=2070&auto=format&fit=crop"
        ],
        location: "Kapadokya, Nevşehir",
        duration: "2 Saat",
        rating: 4.8,
        reviewCount: 380,
        popularityRate: 93,
        price: 1400,
        category: "Macera",
        included: [
            "At kiralama",
            "Güvenlik ekipmanları",
            "Profesyonel eğitmen",
            "Sigorta",
            "Su"
        ],
        notIncluded: [
            "Otel transferi",
            "Fotoğraf çekimi",
            "Ekstra aktiviteler"
        ],
        highlights: [
            "Eğitimli Anadolu atları ile güvenli sürüş",
            "Kızıl ve Güvercinlik Vadisi turu",
            "Gün batımı manzarası",
            "Küçük gruplar halinde özel tur"
        ],
        schedule: [
            { time: "16:00", activity: "Karşılama ve güvenlik eğitimi" },
            { time: "16:30", activity: "At binme eğitimi" },
            { time: "17:00", activity: "Vadi turu başlangıcı" },
            { time: "18:00", activity: "Mola ve fotoğraf çekimi" },
            { time: "18:30", activity: "Tur bitişi" }
        ],
        reviews: [
            {
                id: 1,
                name: "Deniz Y.",
                rating: 5,
                comment: "Atlar çok iyi eğitilmiş, eğitmenler çok profesyonel. Harika bir deneyimdi!",
                date: "2024-03-16"
            }
        ]
    },
    {
        id: 7,
        title: "Kapadokya Türk Gecesi Show",
        description: "Geleneksel dans ve müzik şovu",
        longDescription: "Kapadokya'nın tarihi bir mağara restoranında unutulmaz bir gece geçirin. Geleneksel Türk dansları, müzik ve lezzetli yemekler eşliğinde kültürümüzü yakından tanıyın.",
        imageUrl: "https://images.unsplash.com/photo-1586006B9c0e4?q=80&w=2070&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1586006B9c0e4?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1578485491245-3f6c7a3bb170?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1578485491205-f8f53a3c3550?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1578485491205-f8f53a3c3550?q=80&w=2070&auto=format&fit=crop"
        ],
        location: "Kapadokya, Nevşehir",
        duration: "4 Saat",
        rating: 4.7,
        reviewCount: 520,
        popularityRate: 91,
        price: 1800,
        category: "Kültür",
        included: [
            "Akşam yemeği",
            "Sınırsız yerli içecek",
            "Dans gösterileri",
            "Otel transferi"
        ],
        notIncluded: [
            "Yabancı içecekler",
            "Özel fotoğraf çekimi",
            "Bahşişler"
        ],
        highlights: [
            "Geleneksel Türk dansları gösterisi",
            "Canlı müzik performansı",
            "Yöresel lezzetlerden oluşan menü",
            "Tarihi mağara restoranda akşam yemeği"
        ],
        schedule: [
            { time: "19:30", activity: "Otel transferi" },
            { time: "20:00", activity: "Karşılama kokteyli" },
            { time: "20:30", activity: "Akşam yemeği" },
            { time: "21:30", activity: "Dans gösterileri" },
            { time: "23:00", activity: "Program sonu ve transfer" }
        ],
        reviews: [
            {
                id: 1,
                name: "Maria S.",
                rating: 5,
                comment: "Muhteşem bir gece! Danslar ve müzik harikaydı, yemekler çok lezzetliydi.",
                date: "2024-03-15"
            }
        ]
    },
    {
        id: 8,
        title: "Ihlara Vadisi Yürüyüş Turu",
        description: "Doğa ve tarihin buluştuğu vadi",
        longDescription: "14 km uzunluğundaki Ihlara Vadisi'nde, tarihi kiliseleri ve doğal güzellikleri keşfedin. Profesyonel rehber eşliğinde yapacağınız yürüyüşte, vadinin eşsiz atmosferini deneyimleyin.",
        imageUrl: "https://images.unsplash.com/photo-1669847667777-a6c37c41d48f?q=80&w=2069&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1669847667777-a6c37c41d48f?q=80&w=2069&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1669847667740-2207f2227812?q=80&w=2069&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1669847667808-b9d707892e93?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1669847667808-b9d707892e93?q=80&w=2070&auto=format&fit=crop"
        ],
        location: "Ihlara Vadisi, Aksaray",
        duration: "6 Saat",
        rating: 4.8,
        reviewCount: 420,
        popularityRate: 89,
        price: 1100,
        category: "Doğa Turları",
        included: [
            "Profesyonel rehberlik",
            "Ulaşım",
            "Öğle yemeği",
            "Giriş ücretleri",
            "Sigorta"
        ],
        notIncluded: [
            "Ekstra içecekler",
            "Kişisel harcamalar"
        ],
        highlights: [
            "14 km'lik vadi yürüyüşü",
            "Tarihi kaya kiliseleri ziyareti",
            "Melendiz Çayı kenarında mola",
            "Yerel restoranda öğle yemeği"
        ],
        schedule: [
            { time: "08:30", activity: "Otel transferi" },
            { time: "09:30", activity: "Vadiye varış ve yürüyüş başlangıcı" },
            { time: "11:30", activity: "Kilise ziyaretleri" },
            { time: "13:00", activity: "Öğle yemeği molası" },
            { time: "14:00", activity: "Yürüyüşe devam" },
            { time: "15:30", activity: "Tur sonu ve dönüş" }
        ],
        reviews: [
            {
                id: 1,
                name: "John D.",
                rating: 5,
                comment: "İnanılmaz bir doğa yürüyüşü, rehberimiz çok bilgiliydi ve tempo harikaydı.",
                date: "2024-03-14"
            }
        ]
    },
    {
        id: 9,
        title: "Kızıl Vadi Günbatımı Yürüyüşü",
        description: "Eşsiz günbatımı manzarası",
        longDescription: "Kapadokya'nın en güzel günbatımı noktalarından biri olan Kızıl Vadi'de unutulmaz bir yürüyüş deneyimi yaşayın. Güneşin peri bacaları arasında batışını izlerken muhteşem fotoğraflar çekin.",
        imageUrl: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?q=80&w=2070&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1564587432435-01c247c88b7a?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1576324487366-964827427520?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1576324487229-e5655f019353?q=80&w=2070&auto=format&fit=crop"
        ],
        location: "Kızıl Vadi, Kapadokya",
        duration: "3 Saat",
        rating: 4.9,
        reviewCount: 280,
        popularityRate: 94,
        price: 600,
        category: "Doğa Turları",
        included: [
            "Profesyonel rehberlik",
            "Su",
            "Fotoğraf molası",
            "Çay ikramı"
        ],
        notIncluded: [
            "Ulaşım",
            "Ekstra içecekler",
            "Akşam yemeği"
        ],
        highlights: [
            "Muhteşem günbatımı manzarası",
            "Profesyonel fotoğraf çekim noktaları",
            "Vadi içinde keyifli yürüyüş",
            "Yerel rehber eşliğinde rota keşfi"
        ],
        schedule: [
            { time: "16:30", activity: "Buluşma ve yürüyüş başlangıcı" },
            { time: "17:30", activity: "Fotoğraf molası" },
            { time: "18:00", activity: "Günbatımı izleme noktasına varış" },
            { time: "19:00", activity: "Yürüyüş sonu ve çay molası" }
        ],
        reviews: [
            {
                id: 1,
                name: "Merve K.",
                rating: 5,
                comment: "Günbatımında vadinin aldığı renk inanılmazdı. Rehberimiz harika fotoğraf noktaları gösterdi.",
                date: "2024-03-10"
            }
        ]
    },
    {
        id: 10,
        title: "Yeraltı Şehri Turu",
        description: "Derinkuyu Yeraltı Şehrini Keşfedin",
        longDescription: "Kapadokya'nın gizemli yeraltı şehirlerinden Derinkuyu'yu profesyonel rehber eşliğinde keşfedin. 8 katlı bu antik yerleşimi gezerken binlerce yıl öncesine yolculuk yapın.",
        imageUrl: "https://images.unsplash.com/photo-1585500692791-67cf935c18af?q=80&w=2070&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1585500692791-67cf935c18af?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1601024445121-e294d15442b7?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1669156130293-fb8a5cb3b9a2?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1669156130246-09796d3e951b?q=80&w=2070&auto=format&fit=crop"
        ],
        location: "Derinkuyu, Kapadokya",
        duration: "4 Saat",
        rating: 4.8,
        reviewCount: 340,
        popularityRate: 92,
        price: 800,
        category: "Kültür",
        included: [
            "Profesyonel rehberlik",
            "Giriş biletleri",
            "Ulaşım",
            "Sigorta"
        ],
        notIncluded: [
            "Öğle yemeği",
            "Kişisel harcamalar",
            "Ekstra aktiviteler"
        ],
        highlights: [
            "8 katlı antik yeraltı şehri",
            "Tarihi depolama alanları",
            "Havalandırma sistemleri",
            "Yaşam alanları ve kiliseler"
        ],
        schedule: [
            { time: "09:00", activity: "Otel transferi" },
            { time: "09:45", activity: "Yeraltı şehrine varış" },
            { time: "10:00", activity: "Rehberli tur başlangıcı" },
            { time: "12:00", activity: "Serbest zaman" },
            { time: "13:00", activity: "Dönüş yolculuğu" }
        ],
        reviews: [
            {
                id: 1,
                name: "Ali R.",
                rating: 5,
                comment: "İnanılmaz bir deneyimdi. Rehberimiz çok bilgiliydi ve yeraltı şehrinin tarihini çok iyi anlattı.",
                date: "2024-03-12"
            }
        ]
    },
    {
        id: 11,
        title: "Çömlek Yapım Atölyesi",
        description: "Geleneksel çömlek sanatını öğrenin",
        longDescription: "Avanos'un ünlü çömlek atölyelerinde, yüzyıllardır devam eden geleneksel çömlek yapım sanatını öğrenin. Kendi eserinizi yaratın ve unutulmaz bir deneyim yaşayın.",
        imageUrl: "https://images.unsplash.com/photo-1513564774965-ac25ddf81e1e?q=80&w=2070&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1513564774965-ac25ddf81e1e?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1505571167457-a5b8a5048e57?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1513564774965-ac25ddf81e1e?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1505571167457-a5b8a5048e57?q=80&w=2070&auto=format&fit=crop"
        ],
        location: "Avanos, Kapadokya",
        duration: "2 Saat",
        rating: 4.9,
        reviewCount: 180,
        popularityRate: 88,
        price: 900,
        category: "Sanat",
        included: [
            "Malzeme kullanımı",
            "Usta eğitimi",
            "Çay ikramı",
            "Kendi eseriniz"
        ],
        notIncluded: [
            "Ulaşım",
            "Ekstra ürün alımı",
            "Fotoğraf çekimi"
        ],
        highlights: [
            "Profesyonel çömlekçiden eğitim",
            "Kendi eserinizi yaratma",
            "Geleneksel teknikleri öğrenme",
            "Tarihi atölyede deneyim"
        ],
        schedule: [
            { time: "10:00", activity: "Karşılama ve malzeme tanıtımı" },
            { time: "10:30", activity: "Çömlek yapım teknikleri" },
            { time: "11:00", activity: "Uygulama başlangıcı" },
            { time: "12:00", activity: "Çay molası ve sohbet" }
        ],
        reviews: [
            {
                id: 1,
                name: "Ayşe M.",
                rating: 5,
                comment: "Çok keyifli bir aktiviteydi. Usta çok sabırlı ve yardımseverdi.",
                date: "2024-03-15"
            }
        ]
    }
];

// Prisma'nın `Json?` alanları null, gerçek bir dizi ya da (eski seed
// verilerinde olduğu gibi) JSON.stringify edilmiş bir metin olarak
// saklanmış olabilir; `parseJsonArray`/`parseJsonSchedule` her durumu
// güvenli şekilde normalize eder.
const safeArray = parseJsonArray;
const safeSchedule = parseJsonSchedule;

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        
        if (!id) {
            return NextResponse.json({ error: 'Activity ID is required' }, { status: 400 });
        }

        const experience: any = await prisma.experience.findUnique({
            where: { id: id },
            include: {
                activityDates: {
                    orderBy: {
                        startDate: 'asc',
                    },
                },
                reviews: true,
                user: true, 
            },
        });

        if (!experience) {
            return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
        }

        const reviews = Array.isArray(experience.reviews) ? experience.reviews : [];
        const rating = reviews.reduce((acc: number, review: { rating: number }) => acc + review.rating, 0) / (reviews.length || 1);

        const PLACEHOLDER_IMAGE = 'https://placehold.co/1200x800/e5e7eb/6b7280?text=G%C3%B6rsel+Yok';
        const gallery = safeArray<string>(experience.gallery);
        // `gallery` boşsa da tekil `imageUrl` alanı dolu olabilir; ikisi de
        // boşsa kırık bir yerel dosyaya değil, her zaman yüklenen bir
        // görsele düşülür.
        const coverImage = gallery[0] || experience.imageUrl || PLACEHOLDER_IMAGE;

        const activityResponse = {
            id: experience.id,
            title: experience.title,
            description: experience.description,
            longDescription: experience.longDescription,
            imageUrl: coverImage,
            gallery: gallery.length > 0 ? gallery : [coverImage],
            location: experience.location,
            duration: `${experience.duration} saat`,
            rating: rating,
            reviewCount: reviews.length,
            popularityRate: 90, 
            price: experience.price,
            category: experience.category,
            included: safeArray(experience.included),
            notIncluded: safeArray(experience.notIncluded),
            highlights: safeArray(experience.highlights),
            schedule: safeSchedule(experience.schedule),
            reviews: reviews.map((r: any) => ({...r, user: 'Anonymous'})),
            activityDates: experience.activityDates,
            meetingPoint: experience.meetingPoint,
            meetingPointAddress: experience.meetingPointAddress,
            operator: experience.user,
            ageRestriction: experience.ageRestriction || 'everyone'
        };

        return NextResponse.json(activityResponse);

    } catch (error) {
        console.error(`Error fetching activity ${params.id}:`, error);
        if (error instanceof Error) {
            return NextResponse.json({ error: 'Failed to load activity', details: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'Failed to load activity' }, { status: 500 });
    }
}

// API route for fetching related activities
export async function generateStaticParams() {
    return activities.map((activity) => ({
        id: activity.id.toString(),
    }));
} 