'use client';

import { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPinIcon, 
  CalendarIcon, 
  ClockIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon,
  StarIcon,
  ArrowLeftIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface Tour {
  id: number;
  company: string;
  price: string;
  rating: number;
  reviews: number;
  features: string[];
  image: string;
  description: string;
  duration: string;
  included: string[];
  schedule: {
    day: number;
    title: string;
    description: string;
  }[];
  type: string;
  gallery: string[];
  highlights: string[];
  location: string;
  maxParticipants: number;
  difficulty: 'Kolay' | 'Orta' | 'Zor';
  languages: string[];
}

interface RouteTours {
  [key: string]: {
    name: string;
    description: string;
    longDescription: string;
    image: string;
    location: string;
    bestTimeToVisit: string;
    weather: string;
    transportation: string;
    duration: string;
    priceRange: string;
    itinerary: {
      day: number;
      title: string;
      description: string;
    }[];
    included: string[];
    notIncluded: string[];
    categories: {
      [key: string]: Tour[];
    };
  };
}

const routeTours: RouteTours = {
  1: {
    name: 'Kapadokya',
    description: 'Peri bacaları, yeraltı şehirleri ve balon turlarıyla unutulmaz bir deneyim. UNESCO Dünya Mirası Listesi\'nde yer alan bu eşsiz bölge, doğal güzellikleri ve tarihi zenginlikleriyle ziyaretçilerini büyülüyor.',
    longDescription: `Kapadokya, Türkiye'nin en etkileyici doğal ve tarihi bölgelerinden biridir. Peri bacaları, yeraltı şehirleri, antik kiliseler ve vadileriyle benzersiz bir deneyim sunar.

    Balon turları, at turları, yürüyüş rotaları ve şarap tadımları gibi birçok aktivite seçeneği bulunmaktadır. Bölge, her mevsim farklı güzellikler sunar ve fotoğraf tutkunları için ideal bir destinasyondur.

    Yeraltı şehirleri, antik kiliseler ve vadilerdeki yürüyüş rotaları ile tarihi keşfedebilir, yerel restoranlarda geleneksel lezzetleri tadabilirsiniz.`,
    image: 'https://images.unsplash.com/photo-1570654230464-9e63b3497a1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    location: 'Nevşehir, Türkiye',
    bestTimeToVisit: 'Nisan - Ekim',
    weather: 'Yazları sıcak (25-35°C), kışları soğuk (-5-5°C)',
    transportation: 'Nevşehir Havalimanı\'na uçuş veya Kayseri Havalimanı\'na uçuş + 1 saat transfer',
    duration: '3-4 gün',
    priceRange: '₺2,500 - ₺4,000',
    itinerary: [
      {
        day: 1,
        title: 'Geliş ve İlk Keşif',
        description: 'Havaalanından transfer ve otel yerleşimi. Akşam yemeği ve Kapadokya tanıtım sunumu.'
      },
      {
        day: 2,
        title: 'Balon Turu ve Yeraltı Şehri',
        description: 'Erken saatte balon turu. Öğleden sonra yeraltı şehri ziyareti ve vadilerde yürüyüş.'
      },
      {
        day: 3,
        title: 'At Turu ve Şarap Tadımı',
        description: 'Sabah at turu. Öğleden sonra şarap tadımı ve akşam yemeği.'
      },
      {
        day: 4,
        title: 'Dönüş',
        description: 'Kahvaltı sonrası havaalanı transferi.'
      }
    ],
    included: [
      'Otel konaklaması',
      'Kahvaltı ve akşam yemeği',
      'Profesyonel rehberlik',
      'Tüm transferler',
      'Balon turu',
      'Yeraltı şehri ziyareti',
      'Şarap tadımı',
      'At turu'
    ],
    notIncluded: [
      'Uçak bileti',
      'Öğle yemekleri',
      'Kişisel harcamalar',
      'Opsiyonel turlar'
    ],
    categories: {
      'Balon Turları': [
        {
          id: 1,
          company: 'Kapadokya Balon Turu',
          price: '₺2,500',
          rating: 4.8,
          reviews: 156,
          features: ['Güneş Doğuşu', 'Peri Bacaları', 'Fotoğraf Çekimi', 'Kahvaltı'],
          image: 'https://images.unsplash.com/photo-1570654230464-9e63b3497a1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
          description: 'Güneşin doğuşunu Kapadokya\'nın eşsiz manzarasıyla izleyin. 1 saatlik balon turu ile peri bacalarının üzerinde süzülün.',
          duration: '1 gün',
          included: ['Transfer', 'Kahvaltı', 'Sertifika', 'Sigorta'],
          schedule: [
            {
              day: 1,
              title: 'Balon Turu',
              description: 'Sabah erken saatlerde otelinizden alınacaksınız. Kahvaltı sonrası balon turu başlayacak.'
            }
          ],
          type: 'Balon Turları',
          gallery: [
            'https://images.unsplash.com/photo-1570654230464-9e63b3497a1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
            'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80'
          ],
          highlights: ['Güneş doğuşu manzarası', 'Peri bacaları üzerinde uçuş', 'Fotoğraf fırsatları'],
          location: 'Göreme Vadisi',
          maxParticipants: 20,
          difficulty: 'Kolay',
          languages: ['Türkçe', 'İngilizce']
        },
        {
          id: 2,
          company: 'VIP Balon Deneyimi',
          price: '₺3,500',
          rating: 4.9,
          reviews: 89,
          features: ['VIP Transfer', 'Özel Kahvaltı', 'Özel Fotoğraf Çekimi', 'Şampanya'],
          image: 'https://images.unsplash.com/photo-1570654230464-9e63b3497a1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
          description: 'VIP balon deneyimi ile özel bir gün yaşayın. Daha küçük gruplar ve özel hizmet.',
          duration: '1 gün',
          included: ['VIP Transfer', 'Özel Kahvaltı', 'Özel Fotoğraf Çekimi', 'Sigorta', 'Şampanya'],
          schedule: [
            {
              day: 1,
              title: 'VIP Balon Turu',
              description: 'Özel VIP transfer ile alınacaksınız. Lüks kahvaltı sonrası özel balon turu.'
            }
          ],
          type: 'Balon Turları',
          gallery: [
            'https://images.unsplash.com/photo-1570654230464-9e63b3497a1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
            'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80'
          ],
          highlights: ['Özel VIP deneyimi', 'Küçük grup', 'Lüks hizmet'],
          location: 'Göreme Vadisi',
          maxParticipants: 8,
          difficulty: 'Kolay',
          languages: ['Türkçe', 'İngilizce', 'Almanca']
        }
      ],
      'Yeraltı Şehirleri': [
        {
          id: 3,
          company: 'Derinkuyu Yeraltı Şehri Turu',
          price: '₺1,200',
          rating: 4.7,
          reviews: 92,
          features: ['Profesyonel Rehber', 'Transfer', 'Yemek', 'Güvenlik Ekipmanı'],
          image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
          description: 'Derinkuyu Yeraltı Şehri\'ni profesyonel rehber eşliğinde keşfedin. 8 katlı bu antik yapı, tarihin en etkileyici yerleşim alanlarından biridir.',
          duration: '1 gün',
          included: ['Transfer', 'Rehber', 'Yemek', 'Giriş Ücreti', 'Güvenlik Ekipmanı'],
          schedule: [
            {
              day: 1,
              title: 'Derinkuyu Yeraltı Şehri',
              description: 'Sabah otelinizden alınacaksınız. Rehber eşliğinde yeraltı şehri turu.'
            }
          ],
          type: 'Yeraltı Şehirleri',
          gallery: [
            'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
            'https://images.unsplash.com/photo-1570654230464-9e63b3497a1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80'
          ],
          highlights: ['8 katlı yeraltı şehri', 'Antik yaşam alanları', 'Tarihi keşif'],
          location: 'Derinkuyu, Nevşehir',
          maxParticipants: 15,
          difficulty: 'Orta',
          languages: ['Türkçe', 'İngilizce']
        }
      ],
      'At Turları': [
        {
          id: 4,
          company: 'Vadilerde At Turu',
          price: '₺1,500',
          rating: 4.6,
          reviews: 78,
          features: ['At Eğitimi', 'Güvenlik Ekipmanı', 'Fotoğraf', 'Öğle Yemeği'],
          image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80',
          description: 'Kapadokya\'nın vadilerinde at sırtında unutulmaz bir deneyim. Profesyonel eğitmenler eşliğinde güvenli ve keyifli bir tur.',
          duration: '1 gün',
          included: ['Transfer', 'At Eğitimi', 'Güvenlik Ekipmanı', 'Fotoğraf', 'Öğle Yemeği'],
          schedule: [
            {
              day: 1,
              title: 'At Turu',
              description: 'Sabah otelinizden alınacaksınız. At eğitimi sonrası vadi turu.'
            }
          ],
          type: 'At Turları',
          gallery: [
            'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80',
            'https://images.unsplash.com/photo-1570654230464-9e63b3497a1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80'
          ],
          highlights: ['Vadi manzarası', 'At sırtında keşif', 'Doğa ile iç içe'],
          location: 'Güvercinlik Vadisi',
          maxParticipants: 10,
          difficulty: 'Orta',
          languages: ['Türkçe', 'İngilizce']
        }
      ]
    }
  }
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

interface ReservationFormData {
  name: string;
  email: string;
  phone: string;
  date: string;
  guests: number;
  message: string;
  tourId?: number;
}

export default function RouteDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const [selectedTour, setSelectedTour] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const route = routeTours[resolvedParams.id];

  const [formData, setFormData] = useState<ReservationFormData>({
    name: '',
    email: '',
    phone: '',
    date: '',
    guests: 1,
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Burada API çağrısı yapılacak
      console.log('Rezervasyon formu gönderildi:', formData);
      
      // Başarılı rezervasyon simülasyonu
      setReservationSuccess(true);
      setTimeout(() => {
        setShowReservationModal(false);
        setReservationSuccess(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          date: '',
          guests: 1,
          message: '',
        });
      }, 3000);
    } catch (error) {
      console.error('Rezervasyon hatası:', error);
    }
  };

  const handleReserveTour = (tourId: number) => {
    setFormData(prev => ({ ...prev, tourId }));
    setShowReservationModal(true);
  };

  if (!route) {
    return <div>Rota bulunamadı</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[400px] sm:h-[500px]">
          <Image
            src={route.image}
            alt={route.name}
            fill
          className="object-cover"
            priority
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <Link href="/routes" className="inline-flex items-center text-white/90 hover:text-white mb-4">
              <ArrowLeftIcon className="w-5 h-5 mr-1" />
              Rotalara Dön
            </Link>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{route.name}</h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">{route.description}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Kolon - Detaylar */}
          <div className="lg:col-span-2">
            {/* Genel Bilgiler */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Genel Bilgiler</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <ClockIcon className="w-6 h-6 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Süre</p>
                    <p className="font-medium">{route.duration}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="w-6 h-6 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">En İyi Ziyaret Zamanı</p>
                    <p className="font-medium">{route.bestTimeToVisit}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <UserGroupIcon className="w-6 h-6 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Grup Büyüklüğü</p>
                    <p className="font-medium">2-12 kişi</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <CurrencyDollarIcon className="w-6 h-6 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Fiyat Aralığı</p>
                    <p className="font-medium">{route.priceRange}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detaylı Açıklama */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Detaylı Açıklama</h2>
              <div className="prose max-w-none">
                {route.longDescription.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-600 mb-4">{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Tur Programı */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Tur Programı</h2>
              <div className="space-y-6">
                {route.itinerary.map((day) => (
                  <div key={day.day} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                      {day.day}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{day.title}</h3>
                      <p className="text-gray-600 mt-1">{day.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dahil Olanlar ve Dahil Olmayanlar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Dahil Olanlar</h2>
                <ul className="space-y-3">
                  {route.included.map((item, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Dahil Olmayanlar</h2>
                <ul className="space-y-3">
                  {route.notIncluded.map((item, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <CheckCircleIcon className="w-5 h-5 text-red-500 mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sağ Kolon - Rezervasyon Formu */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Rezervasyon Yap</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    E-posta
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Tarih
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
                    Kişi Sayısı
                  </label>
                  <select
                    id="guests"
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} Kişi
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Mesajınız
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Rezervasyon Yap
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Tours Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {Object.entries(route.categories).map(([category, tours]) => (
            <div key={category}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{category}</h2>
              <div className="space-y-8">
                {tours.map((tour: Tour) => (
                  <div key={tour.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="relative h-64 md:h-96">
                      <Image
                        src={tour.image}
                        alt={tour.company}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{tour.company}</h3>
                        <p className="text-white/90 mb-4">{tour.description}</p>
                        <div className="flex items-center space-x-4 text-white/80 text-sm">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {tour.duration}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {tour.price}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Max {tour.maxParticipants} kişi
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(tour.rating)
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">({tour.reviews} değerlendirme)</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            tour.difficulty === 'Kolay' ? 'bg-green-100 text-green-800' :
                            tour.difficulty === 'Orta' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {tour.difficulty}
                          </span>
                          <button
                            onClick={() => handleReserveTour(tour.id)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Turu Rezerve Et
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {tour.features.map((feature: string, index: number) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>

                      {selectedTour === tour.id && (
                        <div className="mt-6 space-y-6">
                          {/* Galeri */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Galeri</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {tour.gallery.map((image: string, index: number) => (
                                <div
                                  key={index}
                                  className="relative h-48 cursor-pointer"
                                  onClick={() => setSelectedImage(image)}
                                >
                                  <Image
                                    src={image}
                                    alt={`${tour.company} - Görsel ${index + 1}`}
                                    fill
                                    className="object-cover rounded-lg hover:opacity-90 transition-opacity"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Öne Çıkanlar */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Öne Çıkanlar</h3>
                            <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {tour.highlights.map((highlight: string, index: number) => (
                                <li key={index} className="flex items-center text-gray-600">
                                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                  {highlight}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Dahil Olan Hizmetler */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Dahil Olan Hizmetler</h3>
                            <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {tour.included.map((item: string, index: number) => (
                                <li key={index} className="flex items-center text-gray-600">
                                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Tur Programı */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tur Programı</h3>
                            <div className="space-y-4">
                              {tour.schedule.map((day: { day: number; title: string; description: string }, index: number) => (
                                <div key={index} className="flex items-start">
                                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                                    {day.day}
                                  </div>
                                  <div className="ml-4">
                                    <h4 className="font-medium text-gray-900">{day.title}</h4>
                                    <p className="text-gray-600">{day.description}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Konum ve Dil Bilgisi */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">Konum</h3>
                              <p className="text-gray-600">{tour.location}</p>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">Diller</h3>
                              <div className="flex flex-wrap gap-2">
                                {tour.languages.map((lang: string, index: number) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-sm"
                                  >
                                    {lang}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Görsel Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <Image
              src={selectedImage}
              alt="Büyük görsel"
              width={1200}
              height={800}
              className="rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Rezervasyon Modal */}
      {showReservationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowReservationModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {reservationSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Rezervasyon Başarılı!</h3>
                <p className="text-gray-600">Rezervasyonunuz alındı. En kısa sürede sizinle iletişime geçeceğiz.</p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Rezervasyon Yap</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Ad Soyad
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      E-posta
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      Tarih
                    </label>
                    <input
                      type="date"
                      id="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
                      Kişi Sayısı
                    </label>
                    <select
                      id="guests"
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num} Kişi
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Mesajınız
                    </label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Rezervasyon Yap
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 