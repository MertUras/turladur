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
  ShieldCheckIcon,
  LightBulbIcon,
  EyeIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Hakkımızda | TourTech - Premium Turizm Teknolojileri',
  description: 'TourTech\'in vizyonu, değerleri ve başarı öyküsü. Turizm sektörünü teknolojiyle dönüştüren lider şirketimizin kurumsal kimliğini keşfedin.',
};

// Kurumsal Değerlerimiz
const companyValues = [
  {
    title: 'İnovasyon',
    description: 'Turizm ekosistemini yenilikçi teknolojilerle dönüştürerek sektörde öncü konum elde etmeyi hedefliyoruz.',
    icon: LightBulbIcon,
    color: 'text-indigo-600'
  },
  {
    title: 'Müşteri Odaklılık',
    description: 'Tüm iş süreçlerimizde müşterilerimizin memnuniyetini ve beklentilerini öncelikli olarak değerlendiriyoruz.',
    icon: HeartIcon,
    color: 'text-orange-500'
  },
  {
    title: 'Mükemmellik',
    description: 'Hizmetlerimizi uluslararası standartlarda kalite yönetim sistemleri çerçevesinde sunuyoruz.',
    icon: CheckBadgeIcon,
    color: 'text-indigo-600'
  },
  {
    title: 'Sürdürülebilirlik',
    description: 'Faaliyetlerimizde çevresel, sosyal ve ekonomik sürdürülebilirlik ilkelerini gözetiyoruz.',
    icon: GlobeAltIcon,
    color: 'text-emerald-600'
  },
  {
    title: 'Şeffaflık',
    description: 'Tüm paydaşlarımızla dürüst, açık ve şeffaf bir iletişim politikası benimsiyoruz.',
    icon: EyeIcon,
    color: 'text-indigo-600'
  },
  {
    title: 'İş Birliği',
    description: 'Çeşitlilik ve kapsayıcılık ilkelerimizle farklı kültür ve ihtiyaçlara hitap eden çözümler geliştiriyoruz.',
    icon: UserGroupIcon,
    color: 'text-orange-500'
  }
];

// Yönetim Kurulu
const executiveTeam = [
  {
    name: 'Dr. Ahmet Yılmaz',
    position: 'Yönetim Kurulu Başkanı & CEO',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Turizm ve teknoloji sektöründe 15+ yıllık liderlik deneyimine sahip olan Dr. Yılmaz, global turizm teknolojileri alanında uzmanlığını TourTech\'in stratejik vizyonunu şekillendirmede kullanmaktadır.'
  },
  {
    name: 'Doç. Dr. Ayşe Kaya',
    position: 'Teknoloji Direktörü (CTO)',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    bio: 'Bilgisayar mühendisliği alanında doktorası bulunan Doç. Dr. Kaya, yapay zeka ve veri bilimleri konusundaki derin bilgisiyle şirketimizin teknoloji altyapısını yönetmektedir.'
  },
  {
    name: 'Mehmet Demir',
    position: 'Finans Direktörü (CFO)',
    image: 'https://randomuser.me/api/portraits/men/55.jpg',
    bio: 'Kariyerine önde gelen uluslararası yatırım bankalarında başlayan Demir, finansal stratejileri ve kurumsal kaynak yönetimindeki uzmanlığıyla şirketimize değer katmaktadır.'
  },
  {
    name: 'Zeynep Yıldız',
    position: 'Operasyon Direktörü (COO)',
    image: 'https://randomuser.me/api/portraits/women/67.jpg',
    bio: 'Turizm işletmeciliği alanında master derecesine sahip olan Yıldız, operasyonel mükemmellik ve süreç optimizasyonu konularındaki 12 yıllık deneyimiyle şirketimize liderlik etmektedir.'
  }
];

// Kurumsal Tarihçe
const milestones = [
  {
    year: '2013',
    title: 'Kuruluş',
    description: 'TourTech A.Ş., İstanbul Levent\'te kurumsal ofisini açarak 5 kişilik profesyonel ekibiyle faaliyetlerine başlamıştır.'
  },
  {
    year: '2015',
    title: 'Sektörel Tanınırlık',
    description: 'Türkiye Turizm Teknolojileri Birliği tarafından "Yılın En İnovatif Turizm Teknolojisi" ödülüne layık görülerek ilk kurumsal yatırımımızı elde ettik.'
  },
  {
    year: '2017',
    title: 'Ürün Portföyü Genişletilmesi',
    description: 'Turizm işletmeleri için geliştirdiğimiz bulut tabanlı entegre yönetim sistemimiz, sektörde kapsamlı dijital dönüşüm sürecini başlattı.'
  },
  {
    year: '2019',
    title: 'Global Pazar Genişlemesi',
    description: 'İstanbul merkez ofisimize ek olarak Dubai ve Belgrad\'da bölge ofislerimizi açarak uluslararası pazarlarda faaliyetlerimize başladık.'
  },
  {
    year: '2021',
    title: 'Yapay Zeka Teknolojisi Entegrasyonu',
    description: 'Rezervasyon ve kişiselleştirilmiş seyahat önerilerinde yapay zeka teknolojisini entegre eden Türkiye\'deki ilk turizm teknolojileri şirketi konumuna yükseldik.'
  },
  {
    year: '2023',
    title: 'Sürdürülebilir Turizm İnisiyatifi',
    description: 'Kurumsal Sürdürülebilirlik Stratejimiz kapsamında karbon-nötr seyahat programımızı başlatarak turizm sektöründe çevresel sorumluluk alanında öncü konuma geldik.'
  }
];

// Kurumsal İstatistikler
const stats = [
  {
    number: '10+',
    label: 'Yıllık Sektörel Deneyim',
    icon: ClockIcon,
    color: 'text-indigo-600'
  },
  {
    number: '250+',
    label: 'Profesyonel Çalışan',
    icon: UserGroupIcon,
    color: 'text-orange-500'
  },
  {
    number: '3500+',
    label: 'Kurumsal İş Ortağı',
    icon: BuildingOfficeIcon,
    color: 'text-indigo-600'
  },
  {
    number: '1M+',
    label: 'Aktif Platform Kullanıcısı',
    icon: HeartIcon,
    color: 'text-orange-500'
  },
  {
    number: '25+',
    label: 'Sektörel Ödül & Başarı',
    icon: TrophyIcon,
    color: 'text-indigo-600'
  },
  {
    number: '15+',
    label: 'Faaliyet Gösterilen Ülke',
    icon: GlobeAltIcon,
    color: 'text-orange-500'
  }
];

export default function AboutPage() {
  return (
    <main className="bg-white text-gray-800">
      {/* Kurumsal Ana Görsel */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden bg-gray-900">
        <Image
          src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="TourTech Kurumsal Ofis"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-black/70"></div>
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl text-center mx-auto">
              <div className="inline-flex items-center justify-center px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs font-semibold mb-4 tracking-widest uppercase">
                HAKKIMIZDA
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white mb-6 leading-tight">
                Turizmin Geleceğini<br />
                <span className="text-orange-400">Teknolojiyle</span> Şekillendiriyoruz
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed max-w-3xl mx-auto">
                2013\'ten beri Türkiye\'nin öncü turizm teknoloji sağlayıcısı olarak, sektöre ilham veren yenilikçi ve sürdürülebilir çözümler üretiyoruz.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link 
                  href="/contact"
                  className="group inline-flex items-center justify-center px-7 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg active:scale-[0.98] tracking-tight"
                >
                  <span>Bize Ulaşın</span>
                  <ArrowRightIcon className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
                <a 
                  href="#profile"
                  className="inline-flex items-center justify-center px-7 py-3 border border-white/40 hover:border-white text-white font-medium rounded-lg transition-all duration-300 ease-in-out hover:bg-white/10 backdrop-blur-sm active:scale-[0.98] tracking-tight"
                >
                  Daha Fazla Bilgi
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kurumsal İstatistikler */}
      <section className="py-20 sm:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 sm:gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-3">
                <stat.icon className={`w-8 h-8 mb-3 mx-auto ${stat.color}`} />
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-0.5 tracking-tighter">{stat.number}</div>
                <div className="text-xs sm:text-sm text-gray-500 leading-tight">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kurumsal Profil */}
      <section className="py-24 md:py-32" id="profile">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div>
              <p className="text-base font-semibold text-indigo-600 uppercase tracking-wide mb-3">Kurumsal Profil</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tighter mb-6">
                Türkiye'nin Lider Turizm <br />Teknoloji Sağlayıcısı
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                TourTech A.Ş., turizm sektörünü teknolojiyle buluşturarak kurumsal müşterilerimize ve bireysel kullanıcılara katma değerli çözümler sunar. Yüksek teknolojili sistemlerimiz ve kullanıcı odaklı platformlarımızla sektörde dönüşüm yaratıyoruz.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                 Gelişmiş veri analitiği altyapımız ve uzman ekibimizle seyahat deneyimini yeniden tanımlıyoruz.
              </p>
            </div>
            <div className="relative h-80 lg:h-[28rem] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                alt="TourTech Teknoloji Ekibi"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Kurumsal Misyon & Vizyon */}
      <section className="py-24 md:py-32 bg-gray-50/70" id="mission-vision">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-24 md:space-y-32">
          {/* Misyon */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="relative h-80 lg:h-[28rem] rounded-2xl overflow-hidden shadow-xl lg:order-last">
              <Image
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                alt="TourTech Misyon"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-orange-800/20 to-transparent"></div>
            </div>
            <div className="lg:order-first">
              <p className="text-base font-semibold text-orange-500 uppercase tracking-wide mb-3">Misyonumuz</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tighter mb-6">
                 Teknoloji ile <span className="text-orange-500">Seyahat Deneyimini</span> İyileştirmek
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Turizm paydaşlarına yenilikçi, verimli ve kullanıcı dostu teknolojik çözümler sunarak seyahat planlama ve deneyim süreçlerini kolaylaştırmak, optimize etmek ve daha keyifli hale getirmektir.
              </p>
            </div>
          </div>

          {/* Vizyon */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="relative h-80 lg:h-[28rem] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                alt="TourTech Vizyon"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/20 to-transparent"></div>
            </div>
            <div>
              <p className="text-base font-semibold text-indigo-600 uppercase tracking-wide mb-3">Vizyonumuz</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tighter mb-6">
                 Global Turizm Teknolojilerinde <span className="text-indigo-600">Öncü Olmak</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Türkiye'den çıkarak global ölçekte tanınan, turizm teknolojileri alanında standartları belirleyen, inovasyon ve sürdürülebilirlik ilkeleriyle sektöre yön veren lider bir marka olmaktır.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Kurumsal Değerler */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
            <p className="text-base font-semibold text-indigo-600 uppercase tracking-wide mb-3">Temel İlkelerimiz</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tighter">
              Kurumsal Kültürümüzün Temelleri
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {companyValues.map((value, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1.5"
              >
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-${value.color.split('-')[1]}-50/70 mb-4`}>
                  <value.icon className={`w-5 h-5 ${value.color}`} aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 tracking-tight">{value.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kurumsal Tarihçe */}
      <section className="py-24 md:py-32 bg-indigo-50/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
            <p className="text-base font-semibold text-orange-500 uppercase tracking-wide mb-3">Geçmişten Günümüze</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tighter">
              Başarı Yolculuğumuz
            </h2>
          </div>

          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-4 md:left-1/2 top-2 bottom-0 w-0.5 bg-gradient-to-b from-orange-100 via-indigo-100 to-transparent transform md:-translate-x-1/2"></div>
            
            {milestones.map((milestone, index) => (
              <div key={index} className="relative pl-10 md:pl-0 pb-10 md:pb-0 group">
                <div className="md:flex items-start" >
                  <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-10' : 'md:pl-10 md:text-right md:order-last'} mb-3 md:mb-0`}>
                    <div className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold tracking-wide ${index % 2 === 0 ? 'bg-orange-100 text-orange-700' : 'bg-indigo-100 text-indigo-700'}`}>
                      {milestone.year}
                    </div>
                  </div>
                  <div className={`absolute left-4 top-1 w-3 h-3 rounded-full transform -translate-x-[calc(50%+1px)] md:left-1/2 md:-translate-x-1/2 border-2 border-white group-hover:scale-125 transition-transform duration-300 ease-in-out ${index % 2 === 0 ? 'bg-orange-400' : 'bg-indigo-400'}`}></div>
                  <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pl-10' : 'md:pr-10 md:order-first'}`}>
                    <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg border border-gray-100/50 transition-all duration-300 ease-in-out mb-4 md:mb-10">
                      <h3 className="text-base font-semibold text-gray-900 mb-1.5 tracking-tight">{milestone.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{milestone.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kurumsal CTA */}
      <section className="py-24 md:py-32 bg-gradient-to-r from-indigo-700 to-purple-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tighter mb-5">
            Ekibimize Katılın!
          </h2>
          <p className="text-lg md:text-xl text-indigo-100 max-w-3xl mx-auto mb-10 leading-relaxed">
            Turizm ve teknolojinin dinamik dünyasında fark yaratmak, yenilikçi projelere imza atmak ve kariyerinizde yükselmek için bize katılın.
          </p>
          <Link 
            href="/careers" 
            className="group inline-flex items-center justify-center px-7 py-3 bg-white hover:bg-gray-100 text-indigo-700 font-semibold rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg active:scale-[0.98] tracking-tight"
          >
             <span>Açık Pozisyonlar</span>
             <BriefcaseIcon className="w-5 h-5 ml-2 text-indigo-500 group-hover:text-indigo-600 transition-colors" />
          </Link>
        </div>
      </section>
    </main>
  );
} 