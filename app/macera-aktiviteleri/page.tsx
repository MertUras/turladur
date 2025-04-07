import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  StarIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

import {
  Users,
  Clock,
  MapPin,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Macera Aktiviteleri | TourTech - Türkiye\'nin Lider Turizm Teknolojileri Şirketi',
  description: 'Türkiye\'nin en heyecan verici macera aktivitelerini keşfedin. Doğa yürüyüşleri, su sporları, tırmanış ve daha fazlası.',
};

// Macera Aktiviteleri
const adventureActivities = [
  {
    title: 'Kapadokya Balon Turu',
    description: 'Güneşin doğuşunu izlerken peri bacaları üzerinde unutulmaz bir balon deneyimi yaşayın.',
    image: 'https://images.unsplash.com/photo-1641130773378-db900d4b00dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    duration: '3 Saat',
    groupSize: '12-16 Kişi',
    location: 'Kapadokya',
    planRate: '96',
    price: '4.500',
    category: 'Hava'
  },
  {
    title: 'Fethiye Yamaç Paraşütü',
    description: 'Babadağ\'dan Ölüdeniz manzarasına karşı profesyonel eğitmenler eşliğinde yamaç paraşütü.',
    image: 'https://images.unsplash.com/photo-1600255821058-c4f89958d700?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    duration: '5 Saat',
    groupSize: '1-2 Kişi',
    location: 'Fethiye',
    planRate: '94',
    price: '3.200',
    category: 'Ekstrem'
  },
  {
    title: 'Köprülü Kanyon Rafting',
    description: 'Antalya\'nın doğal güzelliği Köprülü Kanyon\'da rafting heyecanını yaşayın.',
    image: 'https://images.unsplash.com/photo-1530866495561-e3aa5c2461cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    duration: '6 Saat',
    groupSize: '8-12 Kişi',
    location: 'Antalya',
    planRate: '92',
    price: '1.200',
    category: 'Su'
  },
  {
    title: 'Likya Yolu Trekking',
    description: 'Antik Likya medeniyetinin izlerini taşıyan patikalarda doğa yürüyüşü.',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    duration: '8 Saat',
    groupSize: '6-10 Kişi',
    location: 'Fethiye-Antalya',
    planRate: '89',
    price: '800',
    category: 'Trekking'
  },
  {
    title: 'Kaş Dalış Deneyimi',
    description: 'Akdeniz\'in berrak sularında batıkları ve deniz yaşamını keşfedin.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    duration: '4 Saat',
    groupSize: '4-8 Kişi',
    location: 'Kaş',
    planRate: '91',
    price: '1.800',
    category: 'Dalış'
  },
  {
    title: 'Erciyes Kayak Turu',
    description: 'Her seviyeye uygun pistlerde kayak ve snowboard deneyimi.',
    image: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    duration: '7 Saat',
    groupSize: '6-12 Kişi',
    location: 'Kayseri',
    planRate: '93',
    price: '2.200',
    category: 'Kış'
  }
];

// Macera İstatistikleri
const adventureStats = [
  {
    number: '30+',
    label: 'Farklı Aktivite',
  },
  {
    number: '100+',
    label: 'Uzman Eğitmen',
  },
  {
    number: '5000+',
    label: 'Başarılı Deneyim',
  },
  {
    number: '15+',
    label: 'Lokasyon',
  }
];

export default function AdventureActivitiesPage() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1682686580391-615b1e32be1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Macera Aktiviteleri"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center justify-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
                Macera Aktiviteleri
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                Sınırları Aşan<br />
                <span className="text-blue-400">Macera Deneyimleri</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
                Profesyonel eğitmenler eşliğinde güvenli ve unutulmaz macera aktiviteleri. 
                Hava, kara ve su sporlarında eşsiz deneyimler yaşayın.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="#experiences"
                  className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all flex items-center"
                >
                  <span>Aktiviteleri Keşfet</span>
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
            {adventureStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/10 rounded-2xl mb-4">
                  <span className="text-2xl text-blue-400">🏃‍♂️</span>
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Aktiviteler Grid */}
      <section id="experiences" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-100 rounded-full text-blue-600 font-medium text-sm mb-6">
              Macera Aktiviteleri
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Öne Çıkan Aktiviteler</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Türkiye'nin en güzel lokasyonlarında adrenalin dolu macera aktiviteleri
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {adventureActivities.map((activity, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all transform hover:-translate-y-1 flex flex-col"
              >
                <div className="relative h-64">
                  <Image
                    src={activity.image}
                    alt={activity.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-800">%{activity.planRate} gezginin planında</span>
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 bg-blue-600 px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-white">{activity.category}</span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{activity.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{activity.description}</p>
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{activity.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Users className="w-4 h-4" />
                        <span>{activity.groupSize}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>{activity.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                    <span className="text-xl font-bold text-blue-600">₺{activity.price}</span>
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
            <h2 className="text-4xl font-bold text-white mb-6">Macera Dolu Bir Deneyim Planlayın</h2>
            <p className="text-xl text-white/80 mb-8">
              Size özel macera aktiviteleri ve adrenalin dolu deneyimler için bizimle iletişime geçin.
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