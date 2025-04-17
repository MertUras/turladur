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
  title: 'Kurumsal | TourTech - Türkiye\'nin Lider Turizm Teknolojileri Şirketi',
  description: 'TourTech kurumsal kimliği, misyonu, vizyonu ve değerleri. Turizm sektöründe teknoloji odaklı çözümler sunan şirketimizin başarı hikayesini keşfedin.',
};

// Kurumsal Değerlerimiz
const companyValues = [
  {
    title: 'İnovasyon',
    description: 'Turizm ekosistemini yenilikçi teknolojilerle dönüştürerek sektörde öncü konum elde etmeyi hedefliyoruz.',
    icon: LightBulbIcon,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    title: 'Müşteri Memnuniyeti',
    description: 'Tüm iş süreçlerimizde müşterilerimizin memnuniyetini ve beklentilerini öncelikli olarak değerlendiriyoruz.',
    icon: HeartIcon,
    color: 'bg-red-100 text-red-600'
  },
  {
    title: 'Kalite Standartları',
    description: 'Hizmetlerimizi uluslararası standartlarda kalite yönetim sistemleri çerçevesinde sunuyoruz.',
    icon: CheckBadgeIcon,
    color: 'bg-green-100 text-green-600'
  },
  {
    title: 'Sürdürülebilirlik',
    description: 'Faaliyetlerimizde çevresel, sosyal ve ekonomik sürdürülebilirlik ilkelerini gözetiyoruz.',
    icon: GlobeAltIcon,
    color: 'bg-emerald-100 text-emerald-600'
  },
  {
    title: 'Kurumsal Şeffaflık',
    description: 'Tüm paydaşlarımızla dürüst, açık ve şeffaf bir iletişim politikası benimsiyoruz.',
    icon: EyeIcon,
    color: 'bg-purple-100 text-purple-600'
  },
  {
    title: 'Kapsayıcılık',
    description: 'Çeşitlilik ve kapsayıcılık ilkelerimizle farklı kültür ve ihtiyaçlara hitap eden çözümler geliştiriyoruz.',
    icon: UserGroupIcon,
    color: 'bg-amber-100 text-amber-600'
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
    icon: ClockIcon
  },
  {
    number: '250+',
    label: 'Profesyonel Çalışan',
    icon: UserGroupIcon
  },
  {
    number: '3500+',
    label: 'Kurumsal İş Ortağı',
    icon: BuildingOfficeIcon
  },
  {
    number: '1M+',
    label: 'Aktif Platform Kullanıcısı',
    icon: HeartIcon
  },
  {
    number: '25+',
    label: 'Sektörel Ödül & Başarı',
    icon: TrophyIcon
  },
  {
    number: '15+',
    label: 'Faaliyet Gösterilen Ülke',
    icon: GlobeAltIcon
  }
];

export default function AboutPage() {
  return (
    <main className="bg-white">
      {/* Kurumsal Ana Görsel */}
      <section className="relative h-[70vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="TourTech Genel Merkez"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center justify-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
                Kurumsal
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                Teknoloji ile Turizmin<br />
                <span className="text-blue-400">Stratejik Entegrasyonu</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
                2013 yılından bu yana Türkiye'nin turizm teknolojileri alanında lider kuruluşu olarak, 
                sektöre yön veren yenilikçi çözümler sunmaktayız.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/contact"
                  className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all flex items-center"
                >
                  <span>Kurumsal İletişim</span>
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a 
                  href="#mission-vision"
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all backdrop-blur-sm"
                >
                  Misyon & Vizyon
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kurumsal İstatistikler */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
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
      </section>

      {/* Kurumsal Profil */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-100 rounded-full text-blue-600 font-medium text-sm mb-6">
                Kurumsal Profil
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Türkiye'nin Lider<br />
                <span className="text-blue-600">Turizm Teknolojileri</span><br />
                Şirketi
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                TourTech A.Ş. olarak, turizm sektörünü teknoloji ile entegre ederek hem kurumsal müşterilerimize 
                hem de bireysel kullanıcılara katma değerli çözümler sunmaktayız. Yüksek teknolojili sistemlerimiz, 
                gelişmiş veri analitiği altyapımız ve kullanıcı odaklı platformlarımızla sektörde dönüşümün öncüsü 
                konumundayız.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                250'yi aşkın nitelikli profesyonel kadromuz, 3500'den fazla kurumsal iş ortağımız ve milyonlarca 
                kullanıcımızla sürdürülebilir büyüme stratejimiz doğrultusunda faaliyet göstermekteyiz. İstanbul'daki 
                genel merkezimizin yanı sıra Antalya, İzmir ve Ankara'daki bölge ofislerimizle ülke genelinde hizmet vermekteyiz.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/careers"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Kariyer Fırsatları
                </Link>
                <Link 
                  href="/contact"
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors"
                >
                  Lokasyon Bilgileri
                </Link>
              </div>
            </div>
            <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
                alt="TourTech Kurumsal Ekip"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white font-medium">TourTech İstanbul Genel Merkez</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kurumsal Misyon & Vizyon */}
      <section id="mission-vision" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-100 rounded-full text-blue-600 font-medium text-sm mb-6">
              Kurumsal Kimlik
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Misyonumuz & Vizyonumuz</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Stratejik hedeflerimiz ve kurumsal değerlerimiz doğrultusunda belirlediğimiz misyon ve vizyonumuz
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 flex flex-col h-full hover:shadow-2xl transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6">
                <EyeIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Vizyonumuz</h3>
              <p className="text-gray-600 leading-relaxed flex-grow">
                Turizm endüstrisini yenilikçi teknolojilerle dönüştüren, hizmet kalitesini üst seviyeye taşıyan ve 
                sürdürülebilir turizm ekosistemini destekleyen, global ölçekte öncü teknoloji şirketi konumuna ulaşmak.
              </p>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-blue-600 font-medium italic">
                  "Teknoloji ve insan odaklı yaklaşımla seyahat deneyimlerini mükemmelleştirmek"
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 flex flex-col h-full hover:shadow-2xl transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6">
                <CheckCircleIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Misyonumuz</h3>
              <p className="text-gray-600 leading-relaxed flex-grow">
                İleri teknoloji çözümlerimizle turizm sektöründeki işletmelerin dijital dönüşümüne öncülük etmek ve
                seyahat eden herkes için kişiselleştirilmiş, verimli ve unutulmaz deneyimler oluşturarak sektörün
                geleceğini şekillendirmek.
              </p>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-blue-600 font-medium italic">
                  "Turizm ekosistemini ileri teknoloji ile güçlendirerek değer yaratmak"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kurumsal Değerler */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-100 rounded-full text-blue-600 font-medium text-sm mb-6">
              Kurumsal Değerlerimiz
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Temel Değerlerimiz</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Kurumsal kimliğimizi şekillendiren ve tüm iş süreçlerimize yön veren temel değerlerimiz
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {companyValues.map((value, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 duration-300"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 ${value.color} rounded-xl mb-6`}>
                  <value.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Yönetim Kurulu */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-100 rounded-full text-blue-600 font-medium text-sm mb-6">
              Yönetim Kurulu
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Kurumsal Yönetim</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Vizyoner bakış açısı, sektörel deneyim ve liderlik vasıflarıyla şirketimize yön veren yönetim kurulumuz
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {executiveTeam.map((member, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all"
              >
                <div className="relative h-72">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-4">{member.position}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kurumsal Tarihçe */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-100 rounded-full text-blue-600 font-medium text-sm mb-6">
              Kurumsal Tarihçe
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Kilometre Taşlarımız</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              2013 yılından bu yana süregelen kurumsal gelişim sürecimiz ve başarı hikayemiz
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((item, index) => (
              <div key={index} className="relative pl-8 pb-12 last:pb-0">
                {/* Zaman çizgisi çizgisi */}
                {index !== milestones.length - 1 && (
                  <div className="absolute left-0 top-0 w-px h-full bg-blue-200"></div>
                )}
                {/* Zaman çizgisi noktası */}
                <div className="absolute left-0 top-0 w-8 h-8 -translate-x-1/2 rounded-full border-4 border-blue-200 bg-white"></div>
                {/* İçerik */}
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow ml-6">
                  <div className="text-blue-600 font-bold mb-2">{item.year}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kurumsal CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Sektörün Geleceğini Birlikte İnşa Edelim</h2>
            <p className="text-xl text-white/80 mb-8">
              İster iş ortaklığı kurarak, ister ekibimize katılarak veya hizmetlerimizden faydalanarak 
              turizm teknolojileri ekosistemimizin bir parçası olabilirsiniz.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/contact"
                className="group px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 font-medium rounded-lg transition-colors shadow-lg flex items-center"
              >
                <span>Kurumsal İletişim</span>
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/careers"
                className="px-8 py-4 bg-blue-700/50 hover:bg-blue-700/70 text-white font-medium rounded-lg transition-colors backdrop-blur-sm"
              >
                Kariyer Fırsatları
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 