import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { 
  ClockIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  ArrowRightIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon,
  StarIcon,
  MapIcon,
  HeartIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Popüler Rotalar | TourTech - Türkiye\'nin Lider Turizm Teknolojileri Şirketi',
  description: 'TourTech ile Türkiye\'nin en popüler turizm rotalarını keşfedin. Kapadokya, Likya Yolu, Pamukkale ve daha fazlası için tur seçeneklerini inceleyin.',
};

// Popüler Rotalar
const popularRoutes = [
  {
    id: 1,
    name: 'Kapadokya',
    description: 'Peri bacaları, yeraltı şehirleri ve balon turlarıyla unutulmaz bir deneyim.',
    image: 'https://images.unsplash.com/photo-1570654230464-9e63b3497a1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    duration: '3-4 gün',
    bestTimeToVisit: 'Nisan - Ekim',
    highlights: ['Balon Turu', 'Yeraltı Şehirleri', 'Şarap Tadımı', 'At Turu'],
    priceRange: '₺2,500 - ₺4,000',
    tourCount: 12,
    rating: 4.8,
    reviews: 156,
  },
  {
    id: 2,
    name: 'Likya Yolu',
    description: 'Antik Likya uygarlığının izlerini takip eden, deniz manzaralı yürüyüş rotası.',
    image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80',
    duration: '7-8 gün',
    bestTimeToVisit: 'Mart - Mayıs, Eylül - Kasım',
    highlights: ['Antik Kentler', 'Deniz Manzarası', 'Doğa Yürüyüşü', 'Plajlar'],
    priceRange: '₺3,500 - ₺5,000',
    tourCount: 8,
    rating: 4.7,
    reviews: 78,
  },
  {
    id: 3,
    name: 'Pamukkale & Hierapolis',
    description: 'Travertenler ve antik havuzuyla dünyaca ünlü doğa harikası.',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    duration: '1-2 gün',
    bestTimeToVisit: 'Mart - Kasım',
    highlights: ['Travertenler', 'Antik Havuz', 'Hierapolis', 'Kleopatra Havuzu'],
    priceRange: '₺1,500 - ₺2,500',
    tourCount: 15,
    rating: 4.6,
    reviews: 92,
  },
  {
    id: 4,
    name: 'Efes Antik Kenti',
    description: 'Roma İmparatorluğu\'nun en önemli antik kentlerinden biri.',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    duration: '1 gün',
    bestTimeToVisit: 'Mart - Kasım',
    highlights: ['Celsus Kütüphanesi', 'Büyük Tiyatro', 'Hadrian Tapınağı', 'Antik Agora'],
    priceRange: '₺1,200 - ₺2,000',
    tourCount: 10,
    rating: 4.9,
    reviews: 145,
  },
  {
    id: 5,
    name: 'Fethiye - Ölüdeniz',
    description: 'Muhteşem koylar ve plajlarla çevrili doğa cenneti.',
    image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80',
    duration: '2-3 gün',
    bestTimeToVisit: 'Mayıs - Ekim',
    highlights: ['Ölüdeniz Plajı', 'Kelebekler Vadisi', 'Paragliding', 'Tekne Turu'],
    priceRange: '₺2,000 - ₺3,500',
    tourCount: 18,
    rating: 4.8,
    reviews: 167,
  },
  {
    id: 6,
    name: 'İstanbul - Tarihi Yarımada',
    description: 'Medeniyetlerin buluşma noktasında binlerce yıllık tarih ve kültür.',
    image: 'https://images.unsplash.com/photo-1621867822738-0b8db9ea15e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    duration: '3-4 gün',
    bestTimeToVisit: 'Nisan - Haziran, Eylül - Kasım',
    highlights: ['Ayasofya', 'Topkapı Sarayı', 'Kapalıçarşı', 'Boğaz Turu'],
    priceRange: '₺2,500 - ₺4,500',
    tourCount: 25,
    rating: 4.9,
    reviews: 215,
  },
];

// Rota Kategorileri
const routeCategories = [
  {
    name: 'Tarihi & Kültürel',
    icon: GlobeAltIcon,
    description: 'Antik kentler, müzeler ve tarihi mekanlarıyla kültürel keşifler',
    count: 45,
    color: 'bg-amber-100 text-amber-600'
  },
  {
    name: 'Doğa & Manzara',
    icon: MapIcon,
    description: 'Doğal güzelliklerle dolu, fotoğraf tutkunları için ideal rotalar',
    count: 38,
    color: 'bg-green-100 text-green-600'
  },
  {
    name: 'Deniz & Plaj',
    icon: HeartIcon,
    description: 'Turkuaz sularla çevrili muhteşem koylar ve plajlar',
    count: 27,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    name: 'Gastronomi',
    icon: MapPinIcon,
    description: 'Yöresel lezzetler ve mutfak kültürüyle öne çıkan rotalar',
    count: 19,
    color: 'bg-red-100 text-red-600'
  },
  {
    name: 'Aile Dostu',
    icon: UserGroupIcon,
    description: 'Çocuklu aileler için ideal, herkesin keyif alabileceği destinasyonlar',
    count: 22,
    color: 'bg-purple-100 text-purple-600'
  },
];

// Rota İstatistikleri
const routeStats = [
  {
    number: '150+',
    label: 'Özenle Seçilmiş Rota',
    icon: MapIcon
  },
  {
    number: '500+',
    label: 'Profesyonel Rehber',
    icon: UserGroupIcon
  },
  {
    number: '1M+',
    label: 'Memnun Turist',
    icon: HeartIcon
  },
  {
    number: '25+',
    label: 'Ödüllü Tur Deneyimi',
    icon: StarIcon
  },
];

export default function RoutesPage() {
  return (
    <main className="bg-white">
      {/* Ana Görsel */}
      <section className="relative h-[70vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1570654230464-9e63b3497a1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Türkiye'nin Popüler Rotaları"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center justify-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
                Rotalar
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                Türkiye'nin En<br />
                <span className="text-blue-400">Popüler Rotaları</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
                Birbirinden güzel doğal ve tarihi destinasyonlar, benzersiz yolculuk deneyimleri ve unutulmaz anılar için aradığınız rotaları TourTech ile keşfedin.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="#popular-routes"
                  className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all flex items-center"
                >
                  Rotaları Keşfet
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Arama Bölümü */}
      <section className="relative -mt-12 mb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Rota ara... (örn: Kapadokya, Likya Yolu)"
              />
              <button
                type="button"
                className="absolute right-2 top-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all"
              >
                Ara
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="relative mt-2">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select
                  id="category"
                  className="block w-full pl-3 pr-10 py-2.5 border border-gray-300 bg-white rounded-lg text-base text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Tüm Kategoriler</option>
                  <option value="historical">Tarihi & Kültürel</option>
                  <option value="nature">Doğa & Manzara</option>
                  <option value="beach">Deniz & Plaj</option>
                  <option value="gastronomy">Gastronomi</option>
                  <option value="family">Aile Dostu</option>
                </select>
              </div>
              <div className="relative mt-2">
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Süre</label>
                <select
                  id="duration"
                  className="block w-full pl-3 pr-10 py-2.5 border border-gray-300 bg-white rounded-lg text-base text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Tüm Süreler</option>
                  <option value="1-day">1 gün</option>
                  <option value="2-3-days">2-3 gün</option>
                  <option value="4-7-days">4-7 gün</option>
                  <option value="7-plus-days">7+ gün</option>
                </select>
              </div>
              <div className="relative mt-2">
                <label htmlFor="season" className="block text-sm font-medium text-gray-700 mb-1">Sezon</label>
                <select
                  id="season"
                  className="block w-full pl-3 pr-10 py-2.5 border border-gray-300 bg-white rounded-lg text-base text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Tüm Sezonlar</option>
                  <option value="spring">İlkbahar</option>
                  <option value="summer">Yaz</option>
                  <option value="autumn">Sonbahar</option>
                  <option value="winter">Kış</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rota Kategorileri */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Rota Kategorileri</h2>
            <p className="text-lg text-gray-600">
              İlgi alanlarınıza göre özenle hazırladığımız rota kategorilerimizi keşfedin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {routeCategories.map((category, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-14 h-14 rounded-full ${category.color} flex items-center justify-center mb-6`}>
                  <category.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-600">{category.count} rota</span>
                  <Link 
                    href="#"
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                  >
                    Keşfet
                    <ArrowRightIcon className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popüler Rotalar */}
      <section id="popular-routes" className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popüler Rotalar</h2>
            <p className="text-lg text-gray-600">
              Türkiye'nin en çok tercih edilen destinasyonları ve gezi rotaları
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularRoutes.map((route) => (
              <Link
                key={route.id}
                href={`/routes/${route.id}`}
                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={route.image}
                    alt={route.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                    <div className="absolute bottom-4 left-4">
                      <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
                        {route.tourCount} tur
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {route.name}
                  </h3>
                  <p className="mt-2 text-gray-600 line-clamp-2">{route.description}</p>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <ClockIcon className="w-4 h-4 mr-2 text-blue-600" />
                      {route.duration}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="w-4 h-4 mr-2 text-blue-600" />
                      {route.bestTimeToVisit}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <CurrencyDollarIcon className="w-4 h-4 mr-2 text-blue-600" />
                      {route.priceRange}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {route.highlights.slice(0, 3).map((highlight, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {highlight}
                      </span>
                    ))}
                    {route.highlights.length > 3 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        +{route.highlights.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(route.rating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">{route.rating} ({route.reviews})</span>
                    </div>
                    <span className="text-sm font-medium text-blue-600 flex items-center">
                      Detaylar
                      <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <a
              href="#"
              className="px-8 py-3 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium rounded-lg transition-all inline-flex items-center"
            >
              Tüm Rotaları Görüntüle
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* İstatistikler */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">TourTech Rotalar</h2>
            <p className="text-lg text-blue-100">
              Türkiye'nin en kapsamlı ve detaylı rota arşivi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {routeStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-white/20 rounded-full p-3">
                    <stat.icon className="w-8 h-8" />
                  </div>
                </div>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rota Rehberi CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Ücretsiz Rota Rehberi İndirin
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Türkiye'nin en popüler rotalarını, gizli kalmış destinasyonlarını ve seyahat ipuçlarını içeren kapsamlı rehberimizi hemen indirin.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    placeholder="E-posta adresiniz"
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all">
                    Rehberi İndir
                  </button>
                </div>
              </div>
              <div className="relative h-64 lg:h-auto">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
                  alt="Rota Rehberi"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 