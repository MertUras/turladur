import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  Clock,
  Users,
  MapPin,
  ArrowRightIcon,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kültür Turları | Turladur - Türkiye\'nin Lider Turizm Teknolojileri Şirketi',
  description: 'Türkiye\'nin zengin tarihini ve kültürel mirasını keşfedin. Antik kentler, müzeler, tarihi yapılar ve yerel yaşam deneyimleri.',
};

// Kültür Turları
const culturalTours = [
  {
    title: 'İstanbul Tarihi Yarımada Turu',
    description: 'Ayasofya, Topkapı Sarayı ve Sultanahmet Camii\'ni profesyonel rehber eşliğinde keşfedin.',
    image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    duration: '8 Saat',
    groupSize: '8-15 Kişi',
    location: 'İstanbul',
    planRate: '95',
    price: '1.400',
    category: 'Tarihi'
  },
  {
    title: 'Efes Antik Kenti Keşfi',
    description: 'UNESCO Dünya Mirası Listesi\'ndeki Efes Antik Kenti\'ni detaylı rehberlik ile gezin.',
    image: 'https://images.unsplash.com/photo-1590579491624-f98f36d4c763?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    duration: '6 Saat',
    groupSize: '6-12 Kişi',
    location: 'İzmir',
    planRate: '92',
    price: '900',
    category: 'Antik'
  },
  {
    title: 'Kapadokya Yeraltı Şehirleri',
    description: 'Derinkuyu ve Kaymaklı yeraltı şehirlerinin gizemli dünyasını keşfedin.',
    image: 'https://images.unsplash.com/photo-1642419688095-e4b579e0e8d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    duration: '7 Saat',
    groupSize: '6-10 Kişi',
    location: 'Nevşehir',
    planRate: '88',
    price: '1.100',
    category: 'Keşif'
  },
  {
    title: 'Mardin Taş Evler ve Manastırlar',
    description: 'Mardin\'in eşsiz mimarisi, taş evleri ve kadim manastırlarını ziyaret edin.',
    image: 'https://images.unsplash.com/photo-1598714805247-5dd474743c4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    duration: '6 Saat',
    groupSize: '6-12 Kişi',
    location: 'Mardin',
    planRate: '90',
    price: '800',
    category: 'Mimari'
  },
  {
    title: 'Göbeklitepe ve Şanlıurfa Turu',
    description: 'İnsanlık tarihinin en eski tapınak merkezi ve kutsal mekanlarını ziyaret edin.',
    image: 'https://images.unsplash.com/photo-1588959570728-081e5e39e994?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    duration: '9 Saat',
    groupSize: '8-15 Kişi',
    location: 'Şanlıurfa',
    planRate: '93',
    price: '1.300',
    category: 'Arkeoloji'
  },
  {
    title: 'Safranbolu Osmanlı Evleri',
    description: 'UNESCO koruması altındaki Osmanlı mimarisinin en güzel örneklerini keşfedin.',
    image: 'https://images.unsplash.com/photo-1458560871784-56d23406c091?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    duration: '5 Saat',
    groupSize: '6-12 Kişi',
    location: 'Karabük',
    planRate: '87',
    price: '700',
    category: 'Mimari'
  }
];

// Kültür İstatistikleri
const culturalStats = [
  {
    number: '100+',
    label: 'Tarihi Mekan',
  },
  {
    number: '50+',
    label: 'Uzman Rehber',
  },
  {
    number: '1500+',
    label: 'Yıllık Tarih',
  },
  {
    number: '25+',
    label: 'Antik Kent',
  }
];

export default function CulturalToursPage() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1584232352890-51866b5c7b94?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Kültür Turları"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center justify-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
                Kültür Turları
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                Anadolu'nun<br />
                <span className="text-blue-400">Kadim Mirası</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
                Binlerce yıllık tarihi, eşsiz mimari yapıları ve zengin kültürel mirası 
                uzman rehberler eşliğinde keşfedin.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="#experiences"
                  className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all flex items-center"
                >
                  <span>Turları Keşfet</span>
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/contact"
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all backdrop-blur-sm"
                >
                  İletişime Geç
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* İstatistikler */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {culturalStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/10 rounded-2xl mb-4">
                  <span className="text-2xl text-blue-400">🏛️</span>
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Turlar Grid */}
      <section id="experiences" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-100 rounded-full text-blue-600 font-medium text-sm mb-6">
              Kültür Turları
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Öne Çıkan Turlar</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Anadolu'nun en özel kültürel ve tarihi mekanlarını keşfedebileceğiniz turlar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {culturalTours.map((tour, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all transform hover:-translate-y-1 flex flex-col"
              >
                <div className="relative h-64">
                  <Image
                    src={tour.image}
                    alt={tour.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-800">%{tour.planRate} gezginin planında</span>
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 bg-blue-600 px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-white">{tour.category}</span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{tour.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{tour.description}</p>
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{tour.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Users className="w-4 h-4" />
                        <span>{tour.groupSize}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>{tour.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                    <span className="text-xl font-bold text-blue-600">₺{tour.price}</span>
                    <Link
                      href="/contact"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                      Rezervasyon
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Kültür Turunuzu Planlayın</h2>
            <p className="text-xl text-white/80 mb-8">
              Size özel kültür turları ve tarihi mekan ziyaretleri için bizimle iletişime geçin.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/contact"
                className="group px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 font-medium rounded-lg transition-colors shadow-lg flex items-center"
              >
                <span>Hemen Rezervasyon Yapın</span>
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/experiences"
                className="px-8 py-4 bg-blue-700/50 hover:bg-blue-700/70 text-white font-medium rounded-lg transition-colors backdrop-blur-sm"
              >
                Tüm Deneyimler
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 