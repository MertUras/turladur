'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
    image: string;
    location: string;
    bestTimeToVisit: string;
    weather: string;
    transportation: string;
    categories: {
      [key: string]: Tour[];
    };
  };
}

const routeTours: RouteTours = {
  1: {
    name: 'Kapadokya',
    description: 'Peri bacaları, yeraltı şehirleri ve balon turlarıyla unutulmaz bir deneyim. UNESCO Dünya Mirası Listesi\'nde yer alan bu eşsiz bölge, doğal güzellikleri ve tarihi zenginlikleriyle ziyaretçilerini büyülüyor.',
    image: 'https://images.unsplash.com/photo-1570654230464-9e63b3497a1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    location: 'Nevşehir, Türkiye',
    bestTimeToVisit: 'Nisan - Ekim',
    weather: 'Yazları sıcak (25-35°C), kışları soğuk (-5-5°C)',
    transportation: 'Nevşehir Havalimanı\'na uçuş veya Kayseri Havalimanı\'na uçuş + 1 saat transfer',
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
  params: {
    id: string;
  };
}

export default function RouteDetailPage({ params }: PageProps) {
  const [selectedTour, setSelectedTour] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const route = routeTours[params.id];

  if (!route) {
    return <div>Rota bulunamadı</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0">
          <Image
            src={route.image}
            alt={route.name}
            fill
            className="object-cover opacity-20"
            priority
            sizes="100vw"
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {route.name}
          </h1>
          <p className="mt-6 text-xl text-white max-w-3xl">
            {route.description}
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white">Konum</h3>
              <p className="text-white/90">{route.location}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white">En İyi Ziyaret Zamanı</h3>
              <p className="text-white/90">{route.bestTimeToVisit}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white">Ulaşım</h3>
              <p className="text-white/90">{route.transportation}</p>
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
                            onClick={() => setSelectedTour(selectedTour === tour.id ? null : tour.id)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {selectedTour === tour.id ? 'Detayları Gizle' : 'Detayları Göster'}
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

                          {/* Rezervasyon Butonu */}
                          <div className="pt-4">
                            <Link
                              href={`/tours/${tour.id}`}
                              className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Turu Rezerve Et
                            </Link>
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
    </div>
  );
} 