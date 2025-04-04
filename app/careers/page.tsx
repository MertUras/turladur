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
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Kariyer Fırsatları | TourTech - Türkiye\'nin Lider Turizm Teknolojileri Şirketi',
  description: 'TourTech\'te kariyer fırsatları. Turizm teknolojileri alanında lider şirketimizde açık pozisyonlar, çalışan avantajları ve başvuru bilgilerini keşfedin.',
};

// Açık Pozisyonlar
const jobPositions = [
  {
    title: 'Kıdemli Yazılım Geliştirici',
    department: 'Yazılım Geliştirme',
    location: 'İstanbul (Merkez Ofis)',
    type: 'Tam Zamanlı',
    description: 'Turizm teknolojileri platformumuzu geliştirmek için Next.js, React ve Node.js teknolojilerinde deneyimli kıdemli yazılım geliştirici arıyoruz.',
    requirements: [
      'Computer Science, Yazılım Mühendisliği veya ilgili alanda lisans derecesi',
      'Modern JavaScript/TypeScript, React.js ve Next.js konularında en az 5 yıl deneyim',
      'RESTful API ve GraphQL deneyimi',
      'Veritabanı tasarımı ve optimizasyonu konusunda deneyim (SQL ve NoSQL)',
      'AWS veya Azure gibi bulut platformlarında deneyim',
      'Agile/Scrum metodolojilerine hakimiyet'
    ]
  },
  {
    title: 'UX/UI Tasarımcı',
    department: 'Tasarım & Kullanıcı Deneyimi',
    location: 'İstanbul (Merkez Ofis)',
    type: 'Tam Zamanlı',
    description: 'Turizm platformumuzu kullanıcı deneyimi açısından mükemmelleştirmek için yaratıcı ve kullanıcı odaklı UX/UI tasarımcı arıyoruz.',
    requirements: [
      'Grafik Tasarım, Etkileşim Tasarımı veya ilgili alanda lisans derecesi',
      'UI/UX tasarım prensiplerinde en az 3 yıl deneyim',
      'Figma, Adobe XD ve Sketch gibi tasarım araçlarında uzmanlık',
      'Responsive web ve mobil uygulama tasarımında kanıtlanmış portföy',
      'Kullanıcı araştırması ve kullanılabilirlik testlerinde deneyim',
      'Güçlü iletişim ve sunum becerileri'
    ]
  },
  {
    title: 'Ürün Yöneticisi',
    department: 'Ürün Yönetimi',
    location: 'İstanbul veya Uzaktan',
    type: 'Tam Zamanlı',
    description: 'Turizm teknoloji ürünlerimizin vizyonunu oluşturacak, pazar araştırması yaparak müşteri ihtiyaçları doğrultusunda yol haritası belirleyecek ürün yöneticisi arıyoruz.',
    requirements: [
      'İşletme, Mühendislik veya ilgili alanda lisans derecesi',
      'Ürün yönetiminde en az 4 yıl deneyim, tercihen teknoloji sektöründe',
      'Güçlü analitik beceriler ve veri odaklı karar verme yeteneği',
      'Agile proje yönetimi ve ürün geliştirme süreçlerinde deneyim',
      'Müşteri görüşmeleri ve pazar araştırması konusunda tecrübe',
      'Teknik ve teknik olmayan ekiplerle etkili iletişim kurabilme'
    ]
  },
  {
    title: 'Veri Bilimci',
    department: 'Veri Analizi & Yapay Zeka',
    location: 'İstanbul veya Uzaktan',
    type: 'Tam Zamanlı',
    description: 'Turizm sektöründeki büyük veriyi analiz ederek müşteri davranışlarını modelleyecek, rezervasyon sistemlerimiz için tahminleme algoritmaları geliştirecek veri bilimci arıyoruz.',
    requirements: [
      'İstatistik, Matematik, Bilgisayar Bilimleri veya ilgili alanda yüksek lisans veya doktora derecesi',
      'Python, R, SQL ile veri analizi konusunda en az 3 yıl deneyim',
      'Makine öğrenmesi ve yapay zeka modellerini geliştirme tecrübesi',
      'Büyük veri teknolojileri (Hadoop, Spark) konusunda deneyim',
      'Veri görselleştirme araçları (Tableau, Power BI) kullanım tecrübesi',
      'İş ihtiyaçlarını teknik çözümlere dönüştürebilme yeteneği'
    ]
  },
  {
    title: 'Müşteri Başarı Uzmanı',
    department: 'Müşteri İlişkileri',
    location: 'İstanbul veya Ankara',
    type: 'Tam Zamanlı',
    description: 'Kurumsal müşterilerimizin TourTech platformunu etkin kullanmasını sağlayacak, eğitimler düzenleyecek ve müşteri memnuniyetini artıracak müşteri başarı uzmanı arıyoruz.',
    requirements: [
      'İşletme, İletişim veya ilgili alanda lisans derecesi',
      'Müşteri ilişkileri veya destek alanında en az 2 yıl deneyim',
      'Güçlü iletişim ve sunum becerileri',
      'Problem çözme ve analitik düşünme yeteneği',
      'Tercihen turizm veya teknoloji sektöründe deneyim',
      'CRM sistemleri kullanımında deneyim'
    ]
  }
];

// Çalışan Avantajları
const benefits = [
  {
    title: 'Esnek Çalışma',
    description: 'Hibrit ve esnek çalışma modelleri ile iş-yaşam dengenizi koruyabilirsiniz.',
    icon: UserGroupIcon,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    title: 'Sağlık Sigortası',
    description: 'Özel sağlık sigortası ve yıllık check-up imkanı sunuyoruz.',
    icon: HeartIcon,
    color: 'bg-red-100 text-red-600'
  },
  {
    title: 'Eğitim & Gelişim',
    description: 'Sürekli öğrenme kültürümüz ile kişisel ve profesyonel gelişim fırsatları.',
    icon: AcademicCapIcon,
    color: 'bg-green-100 text-green-600'
  },
  {
    title: 'Seyahat İndirimleri',
    description: 'Çalışanlarımıza özel indirimli tatil ve seyahat paketleri sunuyoruz.',
    icon: GlobeAltIcon,
    color: 'bg-emerald-100 text-emerald-600'
  },
  {
    title: 'Sosyal Aktiviteler',
    description: 'Takım ruhu geliştiren organizasyonlar ve sosyal etkinlikler.',
    icon: StarIcon,
    color: 'bg-purple-100 text-purple-600'
  },
  {
    title: 'Rekabetçi Ücret',
    description: 'Sektör ortalamasının üzerinde maaş ve ikramiye seçenekleri.',
    icon: CheckBadgeIcon,
    color: 'bg-amber-100 text-amber-600'
  }
];

// Başvuru Süreci
const applicationProcess = [
  {
    step: '1',
    title: 'Başvuru',
    description: 'Online iş başvuru formunu doldurun ve güncel CV\'nizi yükleyin.'
  },
  {
    step: '2',
    title: 'İlk Değerlendirme',
    description: 'İK ekibimiz başvurunuzu inceleyecek ve uygun adaylarla ilk telefon görüşmesi gerçekleştirecek.'
  },
  {
    step: '3',
    title: 'Teknik Mülakat',
    description: 'Departman yöneticilerimiz ve ekip üyelerimizle teknik mülakata davet edileceksiniz.'
  },
  {
    step: '4',
    title: 'Örnek Çalışma/Case Study',
    description: 'Gerekli pozisyonlar için yeteneklerinizi gösterebileceğiniz bir örnek çalışma istenebilir.'
  },
  {
    step: '5',
    title: 'Son Görüşme',
    description: 'Üst yönetim ile son bir görüşme yapılarak karşılıklı beklentiler netleştirilir.'
  },
  {
    step: '6',
    title: 'İş Teklifi',
    description: 'Başarılı adaylara detaylı iş teklifi sunularak onay beklenir ve ardından işe başlama süreci planlanır.'
  }
];

export default function CareersPage() {
  return (
    <main className="bg-white">
      {/* Kariyer Ana Görsel */}
      <section className="relative h-[70vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="TourTech Kariyer Fırsatları"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center justify-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
                Kariyer Fırsatları
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                Turizmin Geleceğini<br />
                <span className="text-blue-400">Birlikte Şekillendirelim</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
                TourTech ailesine katılarak, turizm teknolojileri alanında yenilikçi projelerle kariyerinizi 
                bir üst seviyeye taşıyın.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="#jobs"
                  className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all flex items-center"
                >
                  Açık Pozisyonları Görüntüle
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Şirket Kültürü */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Şirket Kültürümüz</h2>
            <p className="text-lg text-gray-600">
              TourTech'te yenilikçi, işbirlikçi ve sürekli öğrenmeyi destekleyen bir ortamda çalışacaksınız. 
              Teknoloji tutkunları olarak, turizm endüstrisini dönüştürürken kariyerinizi de geliştirmeniz için tüm imkanları sunuyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="relative h-[400px] rounded-xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
                alt="TourTech Ofis Ortamı"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Neden TourTech?</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                    <CheckBadgeIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-900">Yenilikçi projeler:</span> Turizmin geleceğini şekillendiren teknolojik çözümler geliştiriyoruz.
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                    <CheckBadgeIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-900">Profesyonel gelişim:</span> Mentorluk programları ve eğitimlerle sürekli öğrenme imkanı sunuyoruz.
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                    <CheckBadgeIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-900">Global perspektif:</span> Uluslararası pazarda faaliyet gösteren bir ekibin parçası olacaksınız.
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                    <CheckBadgeIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-900">Çalışan memnuniyeti:</span> İş-yaşam dengesi ve çalışan memnuniyeti en önemli önceliklerimizdendir.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Açık Pozisyonlar */}
      <section id="jobs" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Açık Pozisyonlar</h2>
            <p className="text-lg text-gray-600">
              Turizm teknolojileri alanında uzmanlaşmış ekibimize katılmak için aşağıdaki açık pozisyonlarımıza göz atabilirsiniz.
            </p>
          </div>

          <div className="space-y-8">
            {jobPositions.map((job, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{job.title}</h3>
                      <div className="flex flex-wrap gap-3 mt-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                          <BriefcaseIcon className="w-4 h-4 mr-1" />
                          {job.department}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                          <BuildingOfficeIcon className="w-4 h-4 mr-1" />
                          {job.location}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm font-medium">
                          {job.type}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 lg:mt-0">
                      <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all flex items-center">
                        Başvur
                        <ArrowRightIcon className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6">{job.description}</p>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Gereksinimler:</h4>
                    <ul className="space-y-2 text-gray-600">
                      {job.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="flex items-start">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                            <CheckBadgeIcon className="w-3 h-3 text-blue-600" />
                          </div>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Çalışan Avantajları */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Çalışan Avantajları</h2>
            <p className="text-lg text-gray-600">
              TourTech'te çalışanlarımıza sundığumuz ayrıcalıklı imkanlar ve avantajlar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-14 h-14 rounded-full ${benefit.color} flex items-center justify-center mb-6`}>
                  <benefit.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Başvuru Süreci */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Başvuru Süreci</h2>
            <p className="text-lg text-gray-600">
              TourTech'e başvuru sürecinde izlenen adımlar ve değerlendirme kriterleri.
            </p>
          </div>

          <div className="relative">
            {/* Süreç çizgisi */}
            <div className="absolute left-8 lg:left-1/2 h-full w-1 bg-blue-100 transform -translate-x-1/2"></div>
            
            <div className="space-y-12">
              {applicationProcess.map((process, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center mb-4">
                    <div className="absolute left-8 lg:left-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center transform -translate-x-1/2 z-10 text-white font-bold">
                      {process.step}
                    </div>
                    <div className={`ml-16 lg:ml-0 lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-16 lg:text-right' : 'lg:pl-16 lg:ml-auto'}`}>
                      <h3 className="text-xl font-bold text-gray-900">{process.title}</h3>
                    </div>
                  </div>
                  <div className={`ml-16 lg:ml-0 lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-16 lg:text-right' : 'lg:pl-16 lg:ml-auto'}`}>
                    <p className="text-gray-600">{process.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Başvuru CTA */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Kariyerinizde Yeni Bir Sayfa Açın</h2>
            <p className="text-xl text-blue-100 mb-10">
              TourTech ailesine katılarak turizm teknolojileri alanında yenilikçi projelerle geleceği şekillendirin.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="#jobs"
                className="px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 font-medium rounded-lg transition-all flex items-center justify-center"
              >
                Açık Pozisyonları İncele
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </a>
              <Link 
                href="/contact"
                className="px-8 py-4 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg transition-all flex items-center justify-center"
              >
                İletişime Geç
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 