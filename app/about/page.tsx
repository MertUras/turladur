import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { 
  UserGroupIcon, 
  GlobeAltIcon, 
  TrophyIcon, 
  HeartIcon, 
  CheckBadgeIcon,
  BuildingOfficeIcon,
  MapIcon,
  PhoneIcon,
  EnvelopeIcon,
  StarIcon,
  ChartBarIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  ClockIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Hakkımızda | TourTech - Profesyonel Seyahat Deneyimi',
  description: 'TourTech olarak 10 yılı aşkın deneyimimizle Türkiye\'nin en iyi otel ve tur rezervasyon platformuyuz. Misyonumuz, vizyonumuz ve değerlerimiz hakkında bilgi edinin.',
};

const timelineData = [
  {
    year: '2013',
    title: 'Şirketin Kuruluşu',
    description: 'TourTech, turizm sektörüne yenilikçi bir yaklaşım getirmek amacıyla kuruldu.'
  },
  {
    year: '2015',
    title: 'İlk Büyük Başarı',
    description: 'Yılın En İyi Turizm Teknolojisi Ödülünü kazandık.'
  },
  {
    year: '2018',
    title: 'Uluslararası Genişleme',
    description: 'Global pazara açılarak 10+ ülkede hizmet vermeye başladık.'
  },
  {
    year: '2021',
    title: 'Teknoloji Liderliği',
    description: 'AI destekli rezervasyon sistemimizi devreye aldık.'
  },
  {
    year: '2023',
    title: 'Sürdürülebilir Turizm',
    description: 'Karbon-nötr seyahat programımızı başlattık.'
  }
];

const certifications = [
  {
    name: 'ISO 9001:2015',
    description: 'Kalite Yönetim Sistemi Sertifikası',
    icon: CheckBadgeIcon
  },
  {
    name: 'TÜRSAB A Grubu',
    description: 'Seyahat Acentesi Belgesi',
    icon: StarIcon
  },
  {
    name: 'PCI DSS',
    description: 'Ödeme Güvenliği Sertifikası',
    icon: ShieldCheckIcon
  }
];

const stats = [
  {
    number: '10+',
    label: 'Yıllık Deneyim',
    icon: ClockIcon
  },
  {
    number: '100K+',
    label: 'Mutlu Müşteri',
    icon: UserGroupIcon
  },
  {
    number: '1000+',
    label: 'Partner Otel',
    icon: BuildingOfficeIcon
  },
  {
    number: '50+',
    label: 'Ödül & Başarı',
    icon: TrophyIcon
  }
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Bölümü */}
      <div className="relative h-[600px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="TourTech Ofisi"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Turizmin Geleceğini<br />
                <span className="text-blue-400">Teknolojiyle</span> Şekillendiriyoruz
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                10 yılı aşkın deneyimimiz, yenilikçi teknolojilerimiz ve uzman ekibimizle
                Türkiye'nin lider seyahat platformuyuz.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/contact"
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Bizimle İletişime Geçin
                </Link>
                <Link 
                  href="/careers"
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors backdrop-blur-sm"
                >
                  Kariyer Fırsatları
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* İstatistikler */}
      <div className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
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
      </div>

      {/* Şirket Tanıtımı */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-100 rounded-full text-blue-600 font-medium text-sm mb-6">
                Hakkımızda
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Yenilikçi Teknolojilerle<br />
                <span className="text-blue-600">Mükemmel Deneyimler</span><br />
                Sunuyoruz
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                TourTech olarak, turizm sektörünü teknolojiyle buluşturarak müşterilerimize benzersiz deneyimler sunuyoruz. 
                Yapay zeka destekli rezervasyon sistemimiz, kişiselleştirilmiş önerilerimiz ve kullanıcı dostu platformumuzla 
                seyahat planlamanın en kolay yolunu sunuyoruz.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <ChartBarIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Veri Odaklı Yaklaşım</h3>
                    <p className="text-gray-600">En iyi fırsatları sunmak için gelişmiş veri analizi kullanıyoruz.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <AcademicCapIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Uzman Ekip</h3>
                    <p className="text-gray-600">Deneyimli profesyonellerden oluşan ekibimizle hizmet veriyoruz.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
                alt="TourTech Ekibi"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tarihçe */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-100 rounded-full text-blue-600 font-medium text-sm mb-6">
              Tarihçemiz
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Başarı Dolu Yolculuğumuz</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              2013 yılından bu yana sürekli gelişerek ve yenilenerek sektörün öncü şirketi haline geldik.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {timelineData.map((item, index) => (
              <div key={index} className="relative pl-8 pb-12 last:pb-0">
                <div className="absolute left-0 top-0 w-px h-full bg-blue-200"></div>
                <div className="absolute left-0 top-0 w-8 h-8 -translate-x-1/2 rounded-full border-4 border-blue-200 bg-white"></div>
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow ml-6">
                  <div className="text-blue-600 font-bold mb-2">{item.year}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sertifikalar ve Başarılar */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-100 rounded-full text-blue-600 font-medium text-sm mb-6">
              Sertifikalarımız
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Kalite ve Güvenilirlik</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Uluslararası standartlarda hizmet kalitemizi belgeleyen sertifikalarımız.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {certifications.map((cert, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                  <cert.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{cert.name}</h3>
                <p className="text-gray-600">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* İletişim CTA */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">Bizimle İletişime Geçin</h2>
            <p className="text-xl text-blue-100 mb-12">
              Sorularınız için ekibimiz size yardımcı olmaktan mutluluk duyacaktır.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <a 
                href="tel:+902121234567"
                className="flex items-center justify-center gap-3 px-6 py-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                <PhoneIcon className="w-6 h-6" />
                <span>+90 212 123 45 67</span>
              </a>
              <a 
                href="mailto:info@tourtech.com"
                className="flex items-center justify-center gap-3 px-6 py-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                <EnvelopeIcon className="w-6 h-6" />
                <span>info@tourtech.com</span>
              </a>
              <a 
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 px-6 py-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                <MapIcon className="w-6 h-6" />
                <span>Konum</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 