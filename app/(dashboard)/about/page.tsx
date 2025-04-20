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
    color: 'sky'
  },
  {
    title: 'Müşteri Odaklılık',
    description: 'Tüm iş süreçlerimizde müşterilerimizin memnuniyetini ve beklentilerini öncelikli olarak değerlendiriyoruz.',
    icon: HeartIcon,
    color: 'rose'
  },
  {
    title: 'Mükemmellik',
    description: 'Hizmetlerimizi uluslararası standartlarda kalite yönetim sistemleri çerçevesinde sunuyoruz.',
    icon: CheckBadgeIcon,
    color: 'sky'
  },
  {
    title: 'Sürdürülebilirlik',
    description: 'Faaliyetlerimizde çevresel, sosyal ve ekonomik sürdürülebilirlik ilkelerini gözetiyoruz.',
    icon: GlobeAltIcon,
    color: 'emerald'
  },
  {
    title: 'Şeffaflık',
    description: 'Tüm paydaşlarımızla dürüst, açık ve şeffaf bir iletişim politikası benimsiyoruz.',
    icon: EyeIcon,
    color: 'sky'
  },
  {
    title: 'İş Birliği',
    description: 'Çeşitlilik ve kapsayıcılık ilkelerimizle farklı kültür ve ihtiyaçlara hitap eden çözümler geliştiriyoruz.',
    icon: UserGroupIcon,
    color: 'rose'
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
    color: 'sky'
  },
  {
    number: '250+',
    label: 'Profesyonel Çalışan',
    icon: UserGroupIcon,
    color: 'rose'
  },
  {
    number: '3500+',
    label: 'Kurumsal İş Ortağı',
    icon: BuildingOfficeIcon,
    color: 'sky'
  },
  {
    number: '1M+',
    label: 'Aktif Platform Kullanıcısı',
    icon: HeartIcon,
    color: 'rose'
  },
  {
    number: '25+',
    label: 'Sektörel Ödül & Başarı',
    icon: TrophyIcon,
    color: 'sky'
  },
  {
    number: '15+',
    label: 'Faaliyet Gösterilen Ülke',
    icon: GlobeAltIcon,
    color: 'rose'
  }
];

export default function AboutPage() {
  return (
    <main className="bg-neutral-50 text-neutral-800">
      {/* Kurumsal Ana Görsel */}
      <section className="relative pt-40 pb-24 md:pt-48 md:pb-32 overflow-hidden bg-gradient-to-b from-white to-sky-50/50">
        <div className="absolute inset-0 opacity-10">
           {/* Arka plan deseni veya soyut görsel eklenebilir */}
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl text-center mx-auto">
             {/* Etiket stilini güncelle */}
             <div className="inline-flex items-center px-3 py-1 bg-sky-100 rounded-full text-sky-700 font-medium text-xs mb-6">
              HAKKIMIZDA
            </div>
             {/* Başlık ve metin stillerini güncelle */}
             <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-900 mb-6 !leading-tight">
              Turizmin Geleceğini<br />
              <span className="text-sky-600">Teknolojiyle</span> Şekillendiriyoruz
            </h1>
            <p className="text-lg text-neutral-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              2013'ten beri Türkiye'nin öncü turizm teknoloji sağlayıcısı olarak, sektöre ilham veren yenilikçi ve sürdürülebilir çözümler üretiyoruz.
            </p>
             {/* Buton stillerini güncelle */}
             <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/contact"
                 className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors shadow-sm inline-flex items-center text-sm"
              >
                <span>Bize Ulaşın</span>
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Link>
              <a
                href="#profile"
                 className="px-6 py-3 bg-white hover:bg-neutral-100 text-sky-600 font-medium rounded-lg transition-colors shadow-sm border border-neutral-200 inline-flex items-center text-sm"
              >
                Daha Fazla Bilgi
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Kurumsal İstatistikler */}
      <section className="py-20 sm:py-24 bg-neutral-100/60 border-y border-neutral-200/80">
        <div className="container mx-auto px-6">
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {stats.map((stat, index) => (
               <div key={index} className="text-center">
                 {/* İkon stilini güncelle */}
                 <stat.icon className={`w-7 h-7 mb-3 mx-auto text-${stat.color}-500`} />
                 {/* Sayı ve etiket stilini güncelle */}
                 <div className="text-3xl font-semibold text-neutral-900 mb-1">{stat.number}</div>
                 <div className="text-xs text-neutral-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kurumsal Profil */}
      <section className="py-24 md:py-32 bg-white" id="profile">
        <div className="container mx-auto px-6">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="lg:order-last">
               {/* Görsel stilini güncelle */}
               <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl border border-neutral-200/50">
                <Image
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80" // Daha uygun bir görsel seçilebilir
                  alt="TourTech Ekibi"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
             <div className="max-w-xl">
               {/* Etiket stilini güncelle */}
               <p className="text-sm font-semibold text-sky-600 uppercase tracking-wider mb-3">Kurumsal Profil</p>
               {/* Başlık ve metin stillerini güncelle */}
               <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                Türkiye'nin Lider Turizm Teknoloji Sağlayıcısı
              </h2>
              <p className="text-base text-neutral-600 mb-5 leading-relaxed">
                TourTech A.Ş., turizm sektörünü teknolojiyle buluşturarak kurumsal müşterilerimize ve bireysel kullanıcılara katma değerli çözümler sunar. Yüksek teknolojili sistemlerimiz ve kullanıcı odaklı platformlarımızla sektörde dönüşüm yaratıyoruz.
              </p>
              <p className="text-base text-neutral-600 leading-relaxed">
                 Gelişmiş veri analitiği altyapımız ve uzman ekibimizle seyahat deneyimini yeniden tanımlıyoruz.
              </p>
               {/* İsteğe bağlı olarak ek butonlar veya linkler eklenebilir */}
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
      <section className="py-24 md:py-32 bg-neutral-50 border-y border-neutral-200/80">
        <div className="container mx-auto px-6">
           <div className="max-w-3xl mx-auto text-center mb-16">
             {/* Etiket stilini güncelle */}
             <p className="text-sm font-semibold text-sky-600 uppercase tracking-wider mb-3">Temel İlkelerimiz</p>
             {/* Başlık ve metin stillerini güncelle */}
             <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Bizi Biz Yapan Değerler</h2>
             <p className="text-lg text-neutral-600">
              Başarımızın temelinde inovasyon, müşteri odaklılık ve mükemmellik anlayışımız yatar.
            </p>
          </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {companyValues.map((value, index) => (
               <div key={index} className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-sm hover:shadow-md transition-shadow duration-300">
                 <div className="flex items-center mb-4">
                   {/* İkon stilini güncelle */}
                   <div className={`w-10 h-10 rounded-lg bg-${value.color}-100 flex items-center justify-center mr-4`}>
                    <value.icon className={`w-5 h-5 text-${value.color}-600`} />
                  </div>
                   {/* Başlık stilini güncelle */}
                   <h3 className="text-lg font-semibold text-neutral-900">{value.title}</h3>
                 </div>
                 {/* Açıklama stilini güncelle */}
                 <p className="text-sm text-neutral-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kurumsal Tarihçe */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container mx-auto px-6">
           <div className="max-w-3xl mx-auto text-center mb-16">
             {/* Etiket stilini güncelle */}
             <p className="text-sm font-semibold text-sky-600 uppercase tracking-wider mb-3">Yolculuğumuz</p>
             {/* Başlık ve metin stillerini güncelle */}
             <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Başarı Dolu Geçmişimiz</h2>
             <p className="text-lg text-neutral-600">
              Kuruluşumuzdan bugüne katettiğimiz önemli adımlar ve başarılar.
            </p>
          </div>

           <div className="relative max-w-4xl mx-auto">
             {/* Dikey çizgi */}
             <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-neutral-200 hidden md:block" aria-hidden="true"></div>

             <div className="space-y-12 md:space-y-0">
              {milestones.map((milestone, index) => (
                 <div key={index} className={`relative md:flex ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} items-center`}>
                   {/* İçerik Bloğu */}
                   <div className="md:w-1/2 md:px-8 lg:px-12 mb-8 md:mb-0">
                     <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-sm">
                       <p className="text-sm font-semibold text-sky-600 mb-1">{milestone.year}</p>
                       <h3 className="text-lg font-semibold text-neutral-900 mb-2">{milestone.title}</h3>
                       <p className="text-sm text-neutral-600 leading-relaxed">{milestone.description}</p>
                     </div>
                   </div>

                   {/* Bağlantı Noktası */}
                   <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-sky-500 border-4 border-white hidden md:block shadow-md"></div>
                   {/* Mobil için çizgi ve nokta */} 
                  <div className="md:hidden absolute left-0 top-0 bottom-0 w-0.5 bg-neutral-200 -translate-x-4"></div>
                  <div className="md:hidden absolute left-0 top-8 w-3 h-3 rounded-full bg-sky-500 border-2 border-white -translate-x-[calc(50%+0.25rem)]"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Kurumsal CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-r from-sky-600 to-blue-700">
        <div className="container mx-auto px-6 text-center">
           <div className="max-w-3xl mx-auto">
             {/* Başlık ve metin stilini güncelle */}
             <h3 className="text-3xl md:text-4xl font-bold text-white mb-5">TourTech Ailesine Katılın</h3>
             <p className="text-lg text-sky-100 mb-10">
              Turizm teknolojilerinin geleceğini şekillendiren dinamik ekibimizin bir parçası olmak ister misiniz? Açık pozisyonlarımızı inceleyin.
            </p>
             {/* Buton stilini güncelle */}
             <Link
              href="/careers" // Varsayılan kariyer sayfası linki
               className="inline-block px-7 py-3 bg-white text-sky-700 font-medium rounded-lg transition-colors hover:bg-sky-50 shadow-sm text-sm"
            >
              Açık Pozisyonlar
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
} 