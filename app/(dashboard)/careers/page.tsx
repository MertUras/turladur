// 'use client'; // Removed 'use client' directive

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { 
  UserGroupIcon, 
  BriefcaseIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  HeartIcon,
  LightBulbIcon,
  StarIcon,
  CheckBadgeIcon,
  ArrowRightIcon,
  MapPinIcon,
  ClockIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import JobListingCard from '@/components/careers/JobListingCard';

export const metadata: Metadata = {
  title: 'Kariyer | TourTech - Turizm Teknolojilerinde Lider Ekibe Katılın',
  description: 'TourTech ile kariyerinize yön verin. Turizm teknolojileri alanında yenilikçi projeler geliştiren ekibimizde açık pozisyonları, avantajları ve başvuru sürecini keşfedin.',
};

// Açık Pozisyonlar
const jobPositions = [
  {
    id: 'swe-senior',
    title: 'Kıdemli Yazılım Geliştirici',
    department: 'Yazılım Geliştirme',
    location: 'İstanbul (Hibrit)',
    type: 'Tam Zamanlı',
    description: 'Turizm teknolojileri platformumuzu ölçeklendirmek ve yeni özellikler geliştirmek üzere Next.js, React ve Node.js\'de deneyimli takım arkadaşları arıyoruz.',
    requirements: [
      'Bilgisayar Mühendisliği veya ilgili alanda lisans/yüksek lisans derecesi',
      'Modern JavaScript/TypeScript, React.js/Next.js konularında min. 5 yıl tecrübe',
      'API tasarımı (REST/GraphQL) ve mikroservis mimarileri konusunda deneyim',
      'Veritabanı (SQL/NoSQL) tasarımı ve optimizasyonunda yetkinlik',
      'Bulut platformları (AWS/Azure/GCP) ve CI/CD süreçlerinde deneyim',
      'Agile/Scrum metodolojilerine aşinalık ve takım çalışmasına yatkınlık'
    ]
  },
  {
    id: 'ux-designer',
    title: 'UX/UI Tasarımcı',
    department: 'Tasarım & Kullanıcı Deneyimi',
    location: 'İstanbul (Hibrit)',
    type: 'Tam Zamanlı',
    description: 'Kullanıcı odaklı ve estetik açıdan güçlü arayüzler tasarlayarak turizm platformumuzun kullanıcı deneyimini en üst düzeye çıkaracak yaratıcı tasarımcılar arıyoruz.',
    requirements: [
      'Grafik Tasarım, Etkileşim Tasarımı veya ilgili alanda lisans derecesi',
      'UI/UX tasarım prensiplerinde ve süreçlerinde min. 3 yıl deneyim',
      'Figma, Adobe XD, Sketch gibi modern tasarım araçlarında uzmanlık',
      'Web ve mobil platformlar için responsive tasarım portföyü',
      'Kullanıcı araştırması, prototipleme ve kullanılabilirlik testlerinde deneyim',
      'Tasarım sistemleri oluşturma veya kullanma tecrübesi'
    ]
  },
  {
    id: 'product-manager',
    title: 'Ürün Yöneticisi',
    department: 'Ürün Yönetimi',
    location: 'İstanbul veya Uzaktan',
    type: 'Tam Zamanlı',
    description: 'Turizm teknoloji ürünlerimizin stratejik vizyonunu belirleyecek, pazar ve kullanıcı ihtiyaçlarını analiz ederek ürün yol haritasını oluşturacak deneyimli ürün yöneticileri arıyoruz.',
    requirements: [
      'İşletme, Mühendislik veya ilgili alanda lisans/yüksek lisans derecesi',
      'Teknoloji odaklı ürün yönetiminde min. 4 yıl deneyim',
      'Veri analizi, pazar araştırması ve A/B testi konularında yetkinlik',
      'Agile/Scrum metodolojileriyle ürün geliştirme tecrübesi',
      'Paydaş yönetimi ve etkili iletişim becerileri',
      'Teknik ekiplerle yakın çalışabilme ve teknik kavramları anlama yeteneği'
    ]
  },
  {
    id: 'data-scientist',
    title: 'Veri Bilimci',
    department: 'Veri Analizi & Yapay Zeka',
    location: 'İstanbul veya Uzaktan',
    type: 'Tam Zamanlı',
    description: 'Büyük veri setlerini kullanarak makine öğrenmesi modelleri geliştirecek, müşteri davranışlarını analiz edecek ve iş kararlarına yön verecek içgörüler üretecek veri bilimciler arıyoruz.',
    requirements: [
      'İstatistik, Matematik, Bilgisayar Bilimleri veya ilgili alanda yüksek lisans/doktora derecesi',
      'Python/R ve SQL ile veri analizi ve modellemede min. 3 yıl deneyim',
      'Makine öğrenmesi algoritmaları ve kütüphaneleri konusunda derin bilgi',
      'Büyük veri teknolojileri (Spark, Hadoop vb.) deneyimi tercih sebebidir',
      'Veri görselleştirme (Tableau, Power BI vb.) becerisi',
      'Problem çözme ve analitik düşünme yeteneği'
    ]
  },
  {
    id: 'customer-success',
    title: 'Müşteri Başarı Uzmanı',
    department: 'Müşteri İlişkileri',
    location: 'İstanbul (Hibrit)',
    type: 'Tam Zamanlı',
    description: 'Kurumsal müşterilerimizin platformumuzu en etkin şekilde kullanmalarını sağlayarak değer yaratmalarına yardımcı olacak, proaktif destek ve eğitim sunacak uzmanlar arıyoruz.',
    requirements: [
      'İşletme, İletişim veya ilgili alanda lisans derecesi',
      'Müşteri ilişkileri, hesap yönetimi veya SaaS desteği alanında min. 2 yıl deneyim',
      'Mükemmel iletişim, sunum ve ilişki kurma becerileri',
      'Problem çözme ve müşteri odaklı yaklaşım',
      'Teknoloji ürünlerine hızlı adapte olabilme yeteneği',
      'CRM yazılımları (örn. Salesforce) kullanım deneyimi tercih sebebidir'
    ]
  }
];

// Çalışan Avantajları
const benefits = [
  {
    title: 'Esnek Çalışma Modelleri',
    description: 'Hibrit ve uzaktan çalışma seçenekleriyle iş-yaşam dengenizi destekliyoruz.',
    icon: ClockIcon,
    color: 'text-indigo-600'
  },
  {
    title: 'Kapsamlı Sağlık Paketi',
    description: 'Özel sağlık sigortası, yıllık check-up ve diğer sağlık destekleri.',
    icon: HeartIcon,
    color: 'text-rose-500'
  },
  {
    title: 'Sürekli Öğrenme ve Gelişim',
    description: 'Online eğitim platformları, konferans katılımları ve kariyer gelişim programları.',
    icon: AcademicCapIcon,
    color: 'text-emerald-600'
  },
  {
    title: 'Rekabetçi Yan Haklar',
    description: 'Performansa dayalı primler, yemek kartı ve ulaşım desteği.',
    icon: CheckBadgeIcon,
    color: 'text-indigo-600'
  },
  {
    title: 'Dinamik ve Destekleyici Kültür',
    description: 'Takım etkinlikleri, sosyal kulüpler ve iş birliğine dayalı pozitif bir çalışma ortamı.',
    icon: UserGroupIcon,
    color: 'text-orange-500'
  },
  {
    title: 'Teknoloji ve Araçlar',
    description: 'İşinizi en iyi şekilde yapmanız için en güncel donanım ve yazılımlar.',
    icon: BriefcaseIcon,
    color: 'text-sky-600'
  }
];

// Başvuru Süreci
const applicationProcess = [
  {
    step: '1',
    title: 'Online Başvuru',
    description: 'Kariyer sayfamızdan ilgili pozisyona başvurarak CV\'nizi ve ön yazınızı iletin.'
  },
  {
    step: '2',
    title: 'İK Değerlendirmesi',
    description: 'İnsan Kaynakları ekibimiz başvurunuzu inceler ve uygun adaylarla ön görüşme yapar.'
  },
  {
    step: '3',
    title: 'Teknik Görüşme',
    description: 'İlgili departman yöneticileri ve ekip üyeleriyle teknik yetkinlikleriniz değerlendirilir.'
  },
  {
    step: '4',
    title: 'Yetkinlik Bazlı Mülakat',
    description: 'Problem çözme, takım çalışması ve iletişim becerileriniz değerlendirilir (Gerekirse vaka çalışması yapılır).'
  },
  {
    step: '5',
    title: 'Referans Kontrolü ve Teklif',
    description: 'Referans kontrollerinin ardından başarılı adaylara iş teklifi sunulur.'
  },
  {
    step: '6',
    title: 'Ekibe Katılım',
    description: 'Teklifin kabulüyle birlikte işe başlangıç süreci ve oryantasyon programı başlar.'
  }
];

export default function CareersPage() {
  return (
    <main className="bg-white text-gray-800">
      {/* Hero Section - Refined */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden bg-gray-900">
        <Image
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="TourTech Ekibi Çalışıyor"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/60 to-black/70"></div>
        
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs font-semibold mb-4 tracking-widest uppercase">
                KARİYER
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white mb-6 leading-tight">
                Turizmin Geleceğini<br />
                <span className="text-orange-400">Birlikte</span> Kodlayalım
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed max-w-2xl mx-auto">
                TourTech ailesine katılarak, dinamik ve yenilikçi bir ortamda turizm teknolojilerine yön veren projelerde yer alın.
              </p>
              <a
                href="#jobs"
                className="group inline-flex items-center justify-center px-7 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg active:scale-[0.98] tracking-tight"
              >
                <span>Açık Pozisyonlar</span>
                <ArrowRightIcon className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Şirket Kültürü - Refined */}
      <section className="py-24 md:py-32 bg-gray-50/70">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="relative h-80 lg:h-[28rem] rounded-2xl overflow-hidden shadow-xl order-last lg:order-first">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
                alt="TourTech İşbirliği Ortamı"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/10 to-transparent"></div>
            </div>
            <div className="order-first lg:order-last">
              <p className="text-base font-semibold text-indigo-600 uppercase tracking-wide mb-3">Şirket Kültürümüz</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tighter mb-6">
                Yenilikçi, İşbirlikçi ve <br />Destekleyici Bir Ortam
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                TourTech\'te, çalışanlarımızın potansiyelini en üst düzeye çıkarabileceği, fikirlerini özgürce paylaşabileceği ve sürekli öğrenebileceği bir kültürü benimsiyoruz.
              </p>
              <ul className="space-y-3 text-gray-700">
                {[
                  { icon: LightBulbIcon, text: 'Yenilikçi projelerle sektöre yön verme fırsatı.', color: 'text-indigo-500' },
                  { icon: AcademicCapIcon, text: 'Kapsamlı eğitim ve mentorluk programlarıyla sürekli gelişim imkanı.', color: 'text-emerald-500' },
                  { icon: UserGroupIcon, text: 'Farklı disiplinlerden yetenekli profesyonellerle iş birliği.', color: 'text-orange-500' },
                  { icon: GlobeAltIcon, text: 'Global ölçekte projelerde yer alma ve uluslararası deneyim.', color: 'text-sky-500' }
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <item.icon className={`flex-shrink-0 w-5 h-5 ${item.color} mr-2.5 mt-1`} aria-hidden="true" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Açık Pozisyonlar - Refined */}
      <section id="jobs" className="py-24 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
            <p className="text-base font-semibold text-indigo-600 uppercase tracking-wide mb-3">Bize Katılın</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tighter mb-5">Açık Pozisyonlarımız</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Dinamik ekibimizin bir parçası olmak ve turizm teknolojilerinin geleceğini şekillendirmek için güncel iş fırsatlarımıza göz atın.
            </p>
          </div>

          <div className="space-y-6">
            {jobPositions.map((job, index) => (
              <JobListingCard key={index} job={job} />
            ))}
          </div>
        </div>
      </section>

      {/* Çalışan Avantajları - Refined */}
      <section className="py-24 md:py-32 bg-gray-50/70">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
            <p className="text-base font-semibold text-indigo-600 uppercase tracking-wide mb-3">Size Sunduklarımız</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tighter mb-5">Ayrıcalıklı Çalışma Ortamı</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Başarımızın temelinde yer alan çalışanlarımızın mutluluğu ve gelişimi için sunduğumuz avantajlar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-100/50 shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-${benefit.color.split('-')[1]}-50/70 mb-4`}>
                  <benefit.icon className={`w-5 h-5 ${benefit.color}`} aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 tracking-tight">{benefit.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Başvuru Süreci - Refined */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
            <p className="text-base font-semibold text-indigo-600 uppercase tracking-wide mb-3">Nasıl Başvurulur?</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tighter mb-5">Başvuru Sürecimiz</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              TourTech ekibine katılma yolculuğunuzdaki adımlar.
            </p>
          </div>

          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-4 md:left-1/2 top-2 bottom-0 w-0.5 bg-gradient-to-b from-indigo-100 via-orange-100 to-transparent transform md:-translate-x-1/2"></div>
            
            <div className="space-y-8 md:space-y-0">
              {applicationProcess.map((process, index) => (
                <div key={index} className="relative pl-10 md:pl-0 pb-8 md:pb-12 group last:pb-0">
                  <div className="md:flex items-start">
                    <div className={`absolute left-4 top-0.5 md:left-1/2 flex items-center justify-center w-7 h-7 rounded-full transform -translate-x-[calc(50%+1px)] md:-translate-x-1/2 border-2 border-white z-10 transition-all duration-300 ease-in-out ${index % 2 === 0 ? 'bg-indigo-500 group-hover:bg-indigo-600' : 'bg-orange-500 group-hover:bg-orange-600'}`}>
                      <span className="text-xs font-bold text-white">{process.step}</span>
                    </div>
                    <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-10' : 'md:pl-10 md:order-last'}`}>
                      <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg border border-gray-100/50 transition-all duration-300 ease-in-out relative md:top-[-0.8rem]">
                        <h3 className={`text-base font-semibold mb-1.5 tracking-tight ${index % 2 === 0 ? 'text-indigo-800' : 'text-orange-700'}`}>{process.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{process.description}</p>
                      </div>
                    </div>
                    <div className={`hidden md:block md:w-1/2 ${index % 2 === 0 ? 'md:pl-10' : 'md:pr-10 md:order-first'}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Başvuru CTA - Refined */}
      <section className="py-24 md:py-32 bg-gradient-to-r from-indigo-700 to-purple-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tighter mb-5">
            Kariyerinizde Parlamaya Hazır mısınız?
          </h2>
          <p className="text-lg md:text-xl text-indigo-100 max-w-3xl mx-auto mb-10 leading-relaxed">
            Turizm teknolojilerinin geleceğini birlikte inşa etmek için bize katılın. Yeteneklerinizi sergileyin ve fark yaratın.
          </p>
          <a
            href="#jobs"
            className="group inline-flex items-center justify-center px-7 py-3 bg-white hover:bg-gray-100 text-indigo-700 font-semibold rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg active:scale-[0.98] tracking-tight"
          >
            <span>Güncel İlanlara Göz Atın</span>
            <BriefcaseIcon className="w-5 h-5 ml-2 text-indigo-500 group-hover:text-indigo-600 transition-colors" />
          </a>
        </div>
      </section>
    </main>
  );
} 