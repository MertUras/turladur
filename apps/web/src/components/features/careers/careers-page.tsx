'use client';

import Image from 'next/image';
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Clock,
  Globe,
  GraduationCap,
  Heart,
  Lightbulb,
  Users,
} from 'lucide-react';

import {
  JobListingCard,
  type JobPosition,
} from '@/components/features/careers/job-listing-card';

const jobPositions: JobPosition[] = [
  {
    id: 'swe-senior',
    title: 'Kıdemli Yazılım Geliştirici',
    department: 'Yazılım Geliştirme',
    location: 'İstanbul (Hibrit)',
    type: 'Tam Zamanlı',
    description:
      "Turizm teknolojileri platformumuzu ölçeklendirmek ve yeni özellikler geliştirmek üzere Next.js, React ve Node.js'de deneyimli takım arkadaşları arıyoruz.",
    requirements: [
      'Bilgisayar Mühendisliği veya ilgili alanda lisans/yüksek lisans derecesi',
      'Modern JavaScript/TypeScript, React.js/Next.js konularında min. 5 yıl tecrübe',
      'API tasarımı (REST/GraphQL) ve mikroservis mimarileri konusunda deneyim',
      'Veritabanı (SQL/NoSQL) tasarımı ve optimizasyonunda yetkinlik',
      'Bulut platformları (AWS/Azure/GCP) ve CI/CD süreçlerinde deneyim',
      'Agile/Scrum metodolojilerine aşinalık ve takım çalışmasına yatkınlık',
    ],
  },
  {
    id: 'ux-designer',
    title: 'UX/UI Tasarımcı',
    department: 'Tasarım & Kullanıcı Deneyimi',
    location: 'İstanbul (Hibrit)',
    type: 'Tam Zamanlı',
    description:
      'Kullanıcı odaklı ve estetik açıdan güçlü arayüzler tasarlayarak turizm platformumuzun kullanıcı deneyimini en üst düzeye çıkaracak yaratıcı tasarımcılar arıyoruz.',
    requirements: [
      'Grafik Tasarım, Etkileşim Tasarımı veya ilgili alanda lisans derecesi',
      'UI/UX tasarım prensiplerinde ve süreçlerinde min. 3 yıl deneyim',
      'Figma, Adobe XD, Sketch gibi modern tasarım araçlarında uzmanlık',
      'Web ve mobil platformlar için responsive tasarım portföyü',
      'Kullanıcı araştırması, prototipleme ve kullanılabilirlik testlerinde deneyim',
      'Tasarım sistemleri oluşturma veya kullanma tecrübesi',
    ],
  },
  {
    id: 'product-manager',
    title: 'Ürün Yöneticisi',
    department: 'Ürün Yönetimi',
    location: 'İstanbul veya Uzaktan',
    type: 'Tam Zamanlı',
    description:
      'Turizm teknoloji ürünlerimizin stratejik vizyonunu belirleyecek, pazar ve kullanıcı ihtiyaçlarını analiz ederek ürün yol haritasını oluşturacak deneyimli ürün yöneticileri arıyoruz.',
    requirements: [
      'İşletme, Mühendislik veya ilgili alanda lisans/yüksek lisans derecesi',
      'Teknoloji odaklı ürün yönetiminde min. 4 yıl deneyim',
      'Veri analizi, pazar araştırması ve A/B testi konularında yetkinlik',
      'Agile/Scrum metodolojileriyle ürün geliştirme tecrübesi',
      'Paydaş yönetimi ve etkili iletişim becerileri',
      'Teknik ekiplerle yakın çalışabilme ve teknik kavramları anlama yeteneği',
    ],
  },
  {
    id: 'data-scientist',
    title: 'Veri Bilimci',
    department: 'Veri Analizi & Yapay Zeka',
    location: 'İstanbul veya Uzaktan',
    type: 'Tam Zamanlı',
    description:
      'Büyük veri setlerini kullanarak makine öğrenmesi modelleri geliştirecek, müşteri davranışlarını analiz edecek ve iş kararlarına yön verecek içgörüler üretecek veri bilimciler arıyoruz.',
    requirements: [
      'İstatistik, Matematik, Bilgisayar Bilimleri veya ilgili alanda yüksek lisans/doktora derecesi',
      'Python/R ve SQL ile veri analizi ve modellemede min. 3 yıl deneyim',
      'Makine öğrenmesi algoritmaları ve kütüphaneleri konusunda derin bilgi',
      'Büyük veri teknolojileri (Spark, Hadoop vb.) deneyimi tercih sebebidir',
      'Veri görselleştirme (Tableau, Power BI vb.) becerisi',
      'Problem çözme ve analitik düşünme yeteneği',
    ],
  },
  {
    id: 'customer-success',
    title: 'Müşteri Başarı Uzmanı',
    department: 'Müşteri İlişkileri',
    location: 'İstanbul (Hibrit)',
    type: 'Tam Zamanlı',
    description:
      'Kurumsal müşterilerimizin platformumuzu en etkin şekilde kullanmalarını sağlayarak değer yaratmalarına yardımcı olacak, proaktif destek ve eğitim sunacak uzmanlar arıyoruz.',
    requirements: [
      'İşletme, İletişim veya ilgili alanda lisans derecesi',
      'Müşteri ilişkileri, hesap yönetimi veya SaaS desteği alanında min. 2 yıl deneyim',
      'Mükemmel iletişim, sunum ve ilişki kurma becerileri',
      'Problem çözme ve müşteri odaklı yaklaşım',
      'Teknoloji ürünlerine hızlı adapte olabilme yeteneği',
      'CRM yazılımları (örn. Salesforce) kullanım deneyimi tercih sebebidir',
    ],
  },
];

const benefits = [
  {
    title: 'Esnek Çalışma Modelleri',
    description:
      'Hibrit ve uzaktan çalışma seçenekleriyle iş-yaşam dengenizi destekliyoruz.',
    icon: Clock,
  },
  {
    title: 'Kapsamlı Sağlık Paketi',
    description:
      'Özel sağlık sigortası, yıllık check-up ve diğer sağlık destekleri.',
    icon: Heart,
  },
  {
    title: 'Sürekli Öğrenme ve Gelişim',
    description:
      'Online eğitim platformları, konferans katılımları ve kariyer gelişim programları.',
    icon: GraduationCap,
  },
  {
    title: 'Rekabetçi Yan Haklar',
    description: 'Performansa dayalı primler, yemek kartı ve ulaşım desteği.',
    icon: BadgeCheck,
  },
  {
    title: 'Dinamik ve Destekleyici Kültür',
    description:
      'Takım etkinlikleri, sosyal kulüpler ve iş birliğine dayalı pozitif bir çalışma ortamı.',
    icon: Users,
  },
  {
    title: 'Teknoloji ve Araçlar',
    description:
      'İşinizi en iyi şekilde yapmanız için en güncel donanım ve yazılımlar.',
    icon: Briefcase,
  },
];

const applicationProcess = [
  {
    step: '1',
    title: 'Online Başvuru',
    description:
      "Kariyer sayfamızdan ilgili pozisyona başvurarak CV'nizi ve ön yazınızı iletin.",
  },
  {
    step: '2',
    title: 'İK Değerlendirmesi',
    description:
      'İnsan Kaynakları ekibimiz başvurunuzu inceler ve uygun adaylarla ön görüşme yapar.',
  },
  {
    step: '3',
    title: 'Teknik Görüşme',
    description:
      'İlgili departman yöneticileri ve ekip üyeleriyle teknik yetkinlikleriniz değerlendirilir.',
  },
  {
    step: '4',
    title: 'Yetkinlik Bazlı Mülakat',
    description:
      'Problem çözme, takım çalışması ve iletişim becerileriniz değerlendirilir (Gerekirse vaka çalışması yapılır).',
  },
  {
    step: '5',
    title: 'Referans Kontrolü ve Teklif',
    description:
      'Referans kontrollerinin ardından başarılı adaylara iş teklifi sunulur.',
  },
  {
    step: '6',
    title: 'Ekibe Katılım',
    description:
      'Teklifin kabulüyle birlikte işe başlangıç süreci ve oryantasyon programı başlar.',
  },
];

export function CareersPageContent() {
  return (
    <main className="bg-neutral-50 text-neutral-800">
      <section className="relative h-[70vh] overflow-hidden bg-neutral-900 md:h-[80vh]">
        <Image
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="TourTech Ekibi Çalışıyor"
          fill
          className="object-cover opacity-25"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-black/20 px-3 py-1 text-xs font-semibold tracking-widest text-white uppercase backdrop-blur-md">
                KARİYER
              </div>
              <h1 className="mb-6 text-4xl leading-tight font-extrabold tracking-tighter text-white sm:text-5xl md:text-6xl lg:text-7xl">
                Turizmin Geleceğini
                <br />
                <span className="text-sky-400">Birlikte</span> Kodlayalım
              </h1>
              <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-neutral-200 md:text-xl">
                TourTech ailesine katılarak, dinamik ve yenilikçi bir ortamda
                turizm teknolojilerine yön veren projelerde yer alın.
              </p>
              <a
                href="#jobs"
                className="group inline-flex items-center justify-center rounded-lg bg-sky-600 px-7 py-3 font-semibold tracking-tight text-white shadow-sm transition-colors duration-200 ease-in-out hover:bg-sky-700 active:scale-[0.98]"
              >
                <span>Açık Pozisyonlar</span>
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-24 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">
            <div className="relative order-last h-80 overflow-hidden rounded-2xl border border-neutral-100 shadow-lg lg:order-first lg:h-[28rem]">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
                alt="TourTech İşbirliği Ortamı"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/10 to-transparent" />
            </div>
            <div className="order-first lg:order-last">
              <p className="mb-3 text-base font-semibold tracking-wide text-sky-600 uppercase">
                Şirket Kültürümüz
              </p>
              <h2 className="mb-6 text-3xl font-extrabold tracking-tighter text-neutral-900 md:text-4xl lg:text-5xl">
                Yenilikçi, İşbirlikçi ve <br />
                Destekleyici Bir Ortam
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-neutral-600">
                TourTech&apos;te, çalışanlarımızın potansiyelini en üst düzeye
                çıkarabileceği, fikirlerini özgürce paylaşabileceği ve sürekli
                öğrenebileceği bir kültürü benimsiyoruz.
              </p>
              <ul className="space-y-3 text-neutral-700">
                {[
                  {
                    icon: Lightbulb,
                    text: 'Yenilikçi projelerle sektöre yön verme fırsatı.',
                    color: 'text-indigo-500',
                  },
                  {
                    icon: GraduationCap,
                    text: 'Kapsamlı eğitim ve mentorluk programlarıyla sürekli gelişim imkanı.',
                    color: 'text-emerald-500',
                  },
                  {
                    icon: Users,
                    text: 'Farklı disiplinlerden yetenekli profesyonellerle iş birliği.',
                    color: 'text-orange-500',
                  },
                  {
                    icon: Globe,
                    text: 'Global ölçekte projelerde yer alma ve uluslararası deneyim.',
                    color: 'text-sky-500',
                  },
                ].map((item) => (
                  <li key={item.text} className="flex items-start">
                    <item.icon
                      className={`mt-1 mr-2.5 h-5 w-5 shrink-0 ${item.color}`}
                      aria-hidden
                    />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="jobs" className="bg-neutral-50 py-24 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center md:mb-20">
            <p className="mb-3 text-base font-semibold tracking-wide text-sky-600 uppercase">
              Bize Katılın
            </p>
            <h2 className="mb-5 text-3xl font-extrabold tracking-tighter text-neutral-900 md:text-4xl lg:text-5xl">
              Açık Pozisyonlarımız
            </h2>
            <p className="text-lg leading-relaxed text-neutral-600">
              Dinamik ekibimizin bir parçası olmak ve turizm teknolojilerinin
              geleceğini şekillendirmek için güncel iş fırsatlarımıza göz atın.
            </p>
          </div>

          <div className="space-y-6">
            {jobPositions.map((job) => (
              <JobListingCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-24 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center md:mb-20">
            <p className="mb-3 text-base font-semibold tracking-wide text-sky-600 uppercase">
              Size Sunduklarımız
            </p>
            <h2 className="mb-5 text-3xl font-extrabold tracking-tighter text-neutral-900 md:text-4xl lg:text-5xl">
              Ayrıcalıklı Çalışma Ortamı
            </h2>
            <p className="text-lg leading-relaxed text-neutral-600">
              Başarımızın temelinde yer alan çalışanlarımızın mutluluğu ve
              gelişimi için sunduğumuz avantajlar.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-xl border border-neutral-100 bg-white p-6 shadow-sm transition-shadow duration-300 ease-in-out hover:shadow-md"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50">
                  <benefit.icon className="h-5 w-5 text-sky-600" aria-hidden />
                </div>
                <h3 className="mb-2 text-lg font-semibold tracking-tight text-neutral-900">
                  {benefit.title}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-24 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center md:mb-20">
            <p className="mb-3 text-base font-semibold tracking-wide text-sky-600 uppercase">
              Nasıl Başvurulur?
            </p>
            <h2 className="mb-5 text-3xl font-extrabold tracking-tighter text-neutral-900 md:text-4xl lg:text-5xl">
              Başvuru Sürecimiz
            </h2>
            <p className="text-lg leading-relaxed text-neutral-600">
              TourTech ekibine katılma yolculuğunuzdaki adımlar.
            </p>
          </div>

          <div className="relative mx-auto max-w-3xl">
            <div className="absolute top-2 bottom-0 left-4 w-0.5 bg-gradient-to-b from-sky-100 via-sky-100 to-transparent md:left-1/2 md:-translate-x-1/2" />

            <div className="space-y-8 md:space-y-0">
              {applicationProcess.map((process, index) => (
                <div
                  key={process.step}
                  className="group relative pb-8 pl-10 last:pb-0 md:pb-12 md:pl-0"
                >
                  <div className="items-start md:flex">
                    <div className="absolute top-0.5 left-4 z-10 flex h-7 w-7 -translate-x-[calc(50%+1px)] transform items-center justify-center rounded-full border-2 border-neutral-50 bg-sky-500 transition-colors duration-300 ease-in-out group-hover:bg-sky-600 md:left-1/2 md:-translate-x-1/2">
                      <span className="text-xs font-bold text-white">
                        {process.step}
                      </span>
                    </div>
                    <div
                      className={`w-full md:w-1/2 ${
                        index % 2 === 0 ? 'md:pr-10' : 'md:order-last md:pl-10'
                      }`}
                    >
                      <div className="relative rounded-lg border border-neutral-100/80 bg-white p-5 shadow-sm transition-shadow duration-300 ease-in-out hover:shadow-md md:top-[-0.8rem]">
                        <h3 className="mb-1.5 text-base font-semibold tracking-tight text-neutral-800">
                          {process.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-neutral-600">
                          {process.description}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`hidden md:block md:w-1/2 ${
                        index % 2 === 0 ? 'md:pl-10' : 'md:order-first md:pr-10'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-sky-600 py-24 md:py-32">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-5 text-3xl font-extrabold tracking-tighter text-white md:text-4xl lg:text-5xl">
            Kariyerinizde Parlamaya Hazır mısınız?
          </h2>
          <p className="mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-sky-100 md:text-xl">
            Turizm teknolojilerinin geleceğini birlikte inşa etmek için bize
            katılın. Yeteneklerinizi sergileyin ve fark yaratın.
          </p>
          <a
            href="#jobs"
            className="group inline-flex items-center justify-center rounded-lg bg-white px-7 py-3 font-semibold tracking-tight text-sky-700 shadow-md transition-colors duration-200 ease-in-out hover:bg-neutral-100 active:scale-[0.98]"
          >
            <span>Güncel İlanlara Göz Atın</span>
            <Briefcase className="ml-2 h-5 w-5 text-sky-600 transition-colors" />
          </a>
        </div>
      </section>
    </main>
  );
}
