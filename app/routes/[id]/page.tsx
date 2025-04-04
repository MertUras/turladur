'use client';

import React, { useState, use } from 'react';
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
  CheckCircleIcon,
  ShieldCheckIcon,
  CloudIcon,
  TruckIcon,
  PhotoIcon,
  TagIcon
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
  const routeId = resolvedParams.id as string;
  const [selectedTour, setSelectedTour] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const route = routeTours[routeId];

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Rota bulunamadı</h1>
          <p className="text-gray-600 mb-6">Aradığınız rota mevcut değil veya kaldırılmış olabilir.</p>
          <Link
            href="/routes"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Rotalara Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Paralax Efekti İle */}
      <div className="relative h-[500px] sm:h-[600px] bg-fixed bg-cover bg-center" 
           style={{backgroundImage: `url(${route.image})`}}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl mx-auto">
            <div className="mb-6">
              <Link href="/routes" className="inline-flex items-center text-white/80 hover:text-white text-sm font-medium py-1 px-3 rounded-full bg-white/10 backdrop-blur-sm transition-all">
                <ArrowLeftIcon className="w-4 h-4 mr-1" />
                Rotalara Dön
              </Link>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">{route.name}</h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto mb-8">{route.description}</p>
            <div className="inline-flex items-center space-x-2 text-sm text-white/80 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <MapPinIcon className="w-4 h-4" />
              <span>{route.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hızlı Bilgiler */}
      <div className="bg-white shadow-md relative -mt-12 max-w-5xl mx-auto rounded-xl overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4">
          <div className="p-6 border-r border-b md:border-b-0 border-gray-100 flex flex-col items-center text-center">
            <ClockIcon className="w-8 h-8 text-blue-600 mb-3" />
            <div className="text-sm text-gray-500 mb-1">Süre</div>
            <div className="font-semibold text-gray-900">{route.duration}</div>
          </div>
          <div className="p-6 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col items-center text-center">
            <CalendarIcon className="w-8 h-8 text-blue-600 mb-3" />
            <div className="text-sm text-gray-500 mb-1">En İyi Zaman</div>
            <div className="font-semibold text-gray-900">{route.bestTimeToVisit}</div>
          </div>
          <div className="p-6 border-r border-gray-100 flex flex-col items-center text-center">
            <CurrencyDollarIcon className="w-8 h-8 text-blue-600 mb-3" />
            <div className="text-sm text-gray-500 mb-1">Fiyat Aralığı</div>
            <div className="font-semibold text-gray-900">{route.priceRange}</div>
          </div>
          <div className="p-6 flex flex-col items-center text-center">
            <UserGroupIcon className="w-8 h-8 text-blue-600 mb-3" />
            <div className="text-sm text-gray-500 mb-1">Grup Büyüklüğü</div>
            <div className="font-semibold text-gray-900">2-12 kişi</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Sol Kolon - Detaylar */}
          <div className="lg:col-span-2">
            {/* Gezilecek Yerler Kartları */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <span className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3">
                  <MapPinIcon className="w-6 h-6" />
                </span>
                Hakkında
              </h2>
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
                <div className="p-8">
                  <div className="prose max-w-none">
                    {route.longDescription.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-gray-600 mb-4 text-lg leading-relaxed">{paragraph}</p>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-blue-50 rounded-xl p-5">
                      <CloudIcon className="w-8 h-8 text-blue-600 mb-3" />
                      <h3 className="font-semibold text-gray-900 mb-2">Hava Durumu</h3>
                      <p className="text-gray-600 text-sm">{route.weather}</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-5">
                      <TruckIcon className="w-8 h-8 text-blue-600 mb-3" />
                      <h3 className="font-semibold text-gray-900 mb-2">Ulaşım</h3>
                      <p className="text-gray-600 text-sm">{route.transportation}</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-5">
                      <CalendarIcon className="w-8 h-8 text-blue-600 mb-3" />
                      <h3 className="font-semibold text-gray-900 mb-2">Ziyaret İçin</h3>
                      <p className="text-gray-600 text-sm">{route.bestTimeToVisit}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tur Programı */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <span className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3">
                  <ClockIcon className="w-6 h-6" />
                </span>
                Tur Programı
              </h2>
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-8">
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-100"></div>
                    <div className="space-y-8">
                      {route.itinerary.map((day) => (
                        <div key={day.day} className="relative flex gap-6">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold z-10 relative">
                              {day.day}
                            </div>
                          </div>
                          <div className="bg-blue-50 rounded-xl p-6 flex-grow">
                            <h3 className="font-bold text-xl text-gray-900 mb-2">{day.title}</h3>
                            <p className="text-gray-600">{day.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dahil Olanlar ve Dahil Olmayanlar */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <span className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3">
                  <TagIcon className="w-6 h-6" />
                </span>
                Neler Dahil?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-2">
                        <CheckCircleIcon className="w-5 h-5" />
                      </span>
                      Dahil Olanlar
                    </h3>
                    <ul className="space-y-4">
                      {route.included.map((item, index) => (
                        <li key={index} className="flex items-center text-gray-600">
                          <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3">
                            <CheckCircleIcon className="w-4 h-4" />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <span className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center mr-2">
                        <CheckCircleIcon className="w-5 h-5" />
                      </span>
                      Dahil Olmayanlar
                    </h3>
                    <ul className="space-y-4">
                      {route.notIncluded.map((item, index) => (
                        <li key={index} className="flex items-center text-gray-600">
                          <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center mr-3">
                            <CheckCircleIcon className="w-4 h-4" />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Kolon - Rezervasyon Formu */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden sticky top-6">
              <div className="bg-blue-600 px-6 py-5">
                <h2 className="text-xl font-bold text-white">Rezervasyon Yap</h2>
                <p className="text-blue-100 text-sm mt-1">Hemen yerinizi ayırtın!</p>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg mb-6">
                  <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
                  <span>En İyi Fiyat Garantisi</span>
                </div>
                
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    Rezervasyon Yap
                  </button>
                </form>
                
                <div className="mt-6 text-center text-sm text-gray-500">
                  Rezervasyon yaparken sorun yaşarsanız bize ulaşın
                  <div className="text-gray-900 font-medium mt-1">+90 850 123 45 67</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Kategoriler ve Turlar */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Öne Çıkan Turlar</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {route.name} bölgesinde en popüler turları keşfedin
            </p>
          </div>
          
          <div className="space-y-16">
            {Object.entries(route.categories).map(([category, tours]) => (
              <div key={category}>
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                  <span className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3">
                    <PhotoIcon className="w-6 h-6" />
                  </span>
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {tours.map((tour: Tour) => (
                    <div key={tour.id} className="bg-white rounded-2xl shadow-sm overflow-hidden group hover:shadow-md transition-all">
                      <div className="relative h-64">
                        <Image
                          src={tour.image}
                          alt={tour.company}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <span className={`inline-block px-3 py-1 text-xs font-medium ${
                            tour.difficulty === 'Kolay' ? 'bg-green-100 text-green-800' :
                            tour.difficulty === 'Orta' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          } rounded-full mb-2`}>
                            {tour.difficulty}
                          </span>
                          <h3 className="text-xl font-bold text-white mb-2">{tour.company}</h3>
                          <div className="flex items-center text-white/80 text-sm">
                            <div className="flex items-center mr-4">
                              <ClockIcon className="w-4 h-4 mr-1" />
                              {tour.duration}
                            </div>
                            <div className="flex items-center">
                              <CurrencyDollarIcon className="w-4 h-4 mr-1" />
                              {tour.price}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center mb-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon 
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(tour.rating)
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600 ml-2">({tour.reviews} değerlendirme)</span>
                        </div>
                        
                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{tour.description}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {tour.features.slice(0, 3).map((feature: string, index: number) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {feature}
                            </span>
                          ))}
                          {tour.features.length > 3 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              +{tour.features.length - 3}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex space-x-3">
                          <Link
                            href={`/routes/${routeId}/tours/${tour.id}`}
                            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50"
                          >
                            Detaylar
                          </Link>
                          <Link
                            href={`/routes/${routeId}/rezervasyon?tour=${tour.id}`}
                            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                          >
                            Rezervasyon
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {reservationSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Rezervasyon Başarılı!</h3>
              <p className="text-gray-600 mb-6">Rezervasyonunuz alındı. En kısa sürede sizinle iletişime geçeceğiz.</p>
              <button
                onClick={() => setReservationSuccess(false)}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Tamam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 