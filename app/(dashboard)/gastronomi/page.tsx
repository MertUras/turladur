import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  StarIcon,
  ClockIcon,
  UserGroupIcon,
  MapPinIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

import {
  Users,
  Clock,
  MapPin,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Gastronomi Deneyimleri | TourTech - Türkiye\'nin Lider Turizm Teknolojileri Şirketi',
  description: 'Türk mutfağının eşsiz lezzetlerini ve gastronomi turlarını keşfedin. Yerel mutfak kültürü, yemek atölyeleri ve özel şef deneyimleri.',
};

// Gastronomi Deneyimleri
const gastronomyExperiences = [
  {
    title: 'Türk Mutfağı Workshop',
    description: 'Profesyonel şeflerle birlikte Türk mutfağının klasik lezzetlerini öğrenin ve pişirin.',
    image: 'https://images.unsplash.com/photo-1605522561233-768ad7a8fabf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    duration: '4 Saat',
    groupSize: '6-12 Kişi',
    location: 'İstanbul',
    planRate: '92',
    price: '₺1.200',
    category: 'Workshop'
  },
  {
    title: 'Sokak Lezzetleri Turu',
    description: 'İstanbul\'un en iyi sokak yemeklerini ve gizli lezzet duraklarını keşfedin.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    duration: '3 Saat',
    groupSize: '4-8 Kişi',
    location: 'İstanbul',
    planRate: '88',
    price: '₺800',
    category: 'Tur'
  },
  {
    title: 'Zeytinyağı Tadım Deneyimi',
    description: 'Ege\'nin premium zeytinyağlarını tadın ve zeytinyağı üretim sürecini öğrenin.',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    duration: '2 Saat',
    groupSize: '4-10 Kişi',
    location: 'İzmir',
    planRate: '85',
    price: '₺600',
    category: 'Tadım'
  },
  {
    title: 'Şef Masası Deneyimi',
    description: 'Michelin yıldızlı şeflerle özel menü tadımı ve pişirme teknikleri.',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    duration: '3 Saat',
    groupSize: '4-6 Kişi',
    location: 'İstanbul',
    planRate: '95',
    price: '₺2.500',
    category: 'Premium'
  },
  {
    title: 'Bağ ve Şarap Rotası',
    description: 'Kapadokya\'nın üzüm bağlarını gezin, şarap yapımını öğrenin ve tadım yapın.',
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    duration: '6 Saat',
    groupSize: '6-12 Kişi',
    location: 'Kapadokya',
    planRate: '89',
    price: '₺1.500',
    category: 'Tur'
  },
  {
    title: 'Kahve Kavurma Atölyesi',
    description: 'Türk kahvesi kültürünü öğrenin, kahve kavurma ve pişirme teknikleri.',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    duration: '3 Saat',
    groupSize: '4-8 Kişi',
    location: 'İstanbul',
    planRate: '91',
    price: '₺900',
    category: 'Workshop'
  }
];

// Gastronomi İstatistikleri
const gastronomyStats = [
  {
    number: '50+',
    label: 'Özel Şef',
    icon: StarIcon
  },
  {
    number: '100+',
    label: 'Benzersiz Deneyim',
    icon: ChartBarIcon
  },
  {
    number: '1000+',
    label: 'Mutlu Misafir',
    icon: UserGroupIcon
  },
  {
    number: '20+',
    label: 'Şehir',
    icon: MapPinIcon
  }
];

export default function GastronomyPage() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Gastronomi Deneyimleri"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center justify-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
                Gastronomi Deneyimleri
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                Türk Mutfağının<br />
                <span className="text-blue-400">Eşsiz Lezzetleri</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
                Yerel şeflerle birlikte Türk mutfağının zengin kültürünü keşfedin, 
                özel workshop'lara katılın ve unutulmaz lezzet deneyimleri yaşayın.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="#experiences"
                  className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all flex items-center"
                >
                  <span>Deneyimleri Keşfet</span>
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
            {gastronomyStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/10 rounded-2xl mb-4">
                  <stat.icon className="w-8 h-8 text-blue-400" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deneyimler Grid */}
      <section id="experiences" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-100 rounded-full text-blue-600 font-medium text-sm mb-6">
              Gastronomi Deneyimleri
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Öne Çıkan Deneyimler</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Türk mutfağının zengin kültürünü ve lezzetlerini keşfedebileceğiniz özel deneyimler
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gastronomyExperiences.map((experience, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all transform hover:-translate-y-1 flex flex-col"
              >
                <div className="relative h-64">
                  <Image
                    src={experience.image}
                    alt={experience.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-800">%{experience.planRate} gezginin planında</span>
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 bg-blue-600 px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-white">{experience.category}</span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{experience.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{experience.description}</p>
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{experience.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Users className="w-4 h-4" />
                        <span>{experience.groupSize}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>{experience.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                    <span className="text-xl font-bold text-blue-600">₺{experience.price}</span>
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
            <h2 className="text-4xl font-bold text-white mb-6">Özel Gastronomi Deneyiminizi Planlayın</h2>
            <p className="text-xl text-white/80 mb-8">
              Size özel gastronomi turları, workshop'lar ve şef masası deneyimleri için bizimle iletişime geçin.
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