import Image from 'next/image';
import Link from 'next/link';
import {
  Users as UserGroupIcon,
  Globe as GlobeAltIcon,
  Trophy as TrophyIcon,
  Heart as HeartIcon,
  BadgeCheck as CheckBadgeIcon,
  Building2 as BuildingOfficeIcon,
  Clock as ClockIcon,
  Lightbulb as LightBulbIcon,
  Eye as EyeIcon,
  ArrowRight as ArrowRightIcon,
} from 'lucide-react';

const companyValues = [
  {
    title: 'İnovasyon',
    description:
      'Turizm ekosistemini yenilikçi teknolojilerle dönüştürerek sektörde öncü konum elde etmeyi hedefliyoruz.',
    icon: LightBulbIcon,
  },
  {
    title: 'Müşteri Odaklılık',
    description:
      'Tüm iş süreçlerimizde müşterilerimizin memnuniyetini ve beklentilerini öncelikli olarak değerlendiriyoruz.',
    icon: HeartIcon,
  },
  {
    title: 'Mükemmellik',
    description:
      'Hizmetlerimizi uluslararası standartlarda kalite yönetim sistemleri çerçevesinde sunuyoruz.',
    icon: CheckBadgeIcon,
  },
  {
    title: 'Sürdürülebilirlik',
    description:
      'Faaliyetlerimizde çevresel, sosyal ve ekonomik sürdürülebilirlik ilkelerini gözetiyoruz.',
    icon: GlobeAltIcon,
  },
  {
    title: 'Şeffaflık',
    description:
      'Tüm paydaşlarımızla dürüst, açık ve şeffaf bir iletişim politikası benimsiyoruz.',
    icon: EyeIcon,
  },
  {
    title: 'İş Birliği',
    description:
      'Çeşitlilik ve kapsayıcılık ilkelerimizle farklı kültür ve ihtiyaçlara hitap eden çözümler geliştiriyoruz.',
    icon: UserGroupIcon,
  },
];

const milestones = [
  {
    year: '2013',
    title: 'Kuruluş',
    description:
      "turta A.Ş., İstanbul Levent'te kurumsal ofisini açarak 5 kişilik profesyonel ekibiyle faaliyetlerine başlamıştır.",
  },
  {
    year: '2015',
    title: 'Sektörel Tanınırlık',
    description:
      'Türkiye Turizm Teknolojileri Birliği tarafından "Yılın En İnovatif Turizm Teknolojisi" ödülüne layık görülerek ilk kurumsal yatırımımızı elde ettik.',
  },
  {
    year: '2017',
    title: 'Ürün Portföyü Genişletilmesi',
    description:
      'Turizm işletmeleri için geliştirdiğimiz bulut tabanlı entegre yönetim sistemimiz, sektörde kapsamlı dijital dönüşüm sürecini başlattı.',
  },
  {
    year: '2019',
    title: 'Global Pazar Genişlemesi',
    description:
      "İstanbul merkez ofisimize ek olarak Dubai ve Belgrad'da bölge ofislerimizi açarak uluslararası pazarlarda faaliyetlerimize başladık.",
  },
  {
    year: '2021',
    title: 'Yapay Zeka Teknolojisi Entegrasyonu',
    description:
      "Rezervasyon ve kişiselleştirilmiş seyahat önerilerinde yapay zeka teknolojisini entegre eden Türkiye'deki ilk turizm teknolojileri şirketi konumuna yükseldik.",
  },
  {
    year: '2023',
    title: 'Sürdürülebilir Turizm İnisiyatifi',
    description:
      'Kurumsal Sürdürülebilirlik Stratejimiz kapsamında karbon-nötr seyahat programımızı başlatarak turizm sektöründe çevresel sorumluluk alanında öncü konuma geldik.',
  },
];

const stats = [
  { number: '10+', label: 'Yıllık Sektörel Deneyim', icon: ClockIcon },
  { number: '250+', label: 'Profesyonel Çalışan', icon: UserGroupIcon },
  { number: '3500+', label: 'Kurumsal İş Ortağı', icon: BuildingOfficeIcon },
  { number: '1M+', label: 'Aktif Platform Kullanıcısı', icon: HeartIcon },
  { number: '25+', label: 'Sektörel Ödül & Başarı', icon: TrophyIcon },
  { number: '15+', label: 'Faaliyet Gösterilen Ülke', icon: GlobeAltIcon },
];

export default function AboutPageContent() {
  return (
    <main className="bg-neutral-50 text-neutral-800">
      {/* Hero — brand first, no colored pill */}
      <section className="relative overflow-hidden border-b border-neutral-200/80 bg-gradient-to-b from-white via-neutral-50 to-neutral-100/80 pt-36 pb-20 md:pt-44 md:pb-28">
        <div className="container relative z-10 mx-auto px-6">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-4 text-sm font-semibold tracking-[0.2em] text-neutral-950 uppercase">
              turta
            </p>
            <h1 className="mb-6 text-4xl !leading-tight font-bold text-neutral-900 sm:text-5xl md:text-6xl">
              Turizmin Geleceğini
              <br />
              Teknolojiyle Şekillendiriyoruz
            </h1>
            <p className="mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-neutral-600">
              Yolculuğumuzda turizm sektörünü teknolojiyle buluşturarak
              yenilikçi ve sürdürülebilir çözümler üretmeyi hedefliyoruz.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-lg bg-neutral-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-neutral-800"
              >
                <span>Bize Ulaşın</span>
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
              <a
                href="#profile"
                className="inline-flex items-center rounded-lg border border-neutral-200 bg-white px-6 py-3 text-sm font-medium text-neutral-900 shadow-sm transition-colors hover:bg-neutral-50"
              >
                Daha Fazla Bilgi
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-neutral-200/80 bg-white py-16 sm:py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="mx-auto mb-3 h-7 w-7 text-neutral-950" />
                <div className="mb-1 text-3xl font-semibold text-neutral-900">
                  {stat.number}
                </div>
                <div className="text-xs tracking-wider text-neutral-500 uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Profile */}
      <section className="bg-neutral-50 py-20 md:py-28" id="profile">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <div className="lg:order-last">
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80"
                  alt="turta Ekibi"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
            <div className="max-w-xl">
              <p className="mb-3 text-sm font-semibold tracking-wider text-neutral-950 uppercase">
                Kurumsal Profil
              </p>
              <h2 className="mb-6 text-3xl font-bold text-neutral-900 md:text-4xl">
                Türkiye&apos;nin Lider Turizm Teknoloji Sağlayıcısı
              </h2>
              <p className="mb-5 text-base leading-relaxed text-neutral-600">
                turta, turizm sektörünün dijital dönüşümüne öncülük eden
                yenilikçi bir teknoloji platformudur. Yapay zeka destekli
                çözümlerimiz ve kullanıcı odaklı yaklaşımımızla, seyahat
                deneyimini daha kişiselleştirilmiş ve verimli hale getiriyoruz.
              </p>
              <p className="text-base leading-relaxed text-neutral-600">
                Türkiye&apos;nin benzersiz destinasyonlarını dünyaya tanıtırken,
                yerel ekonomilere katkı sağlıyor ve sürdürülebilir turizmi
                destekliyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section
        className="border-y border-neutral-200/80 bg-white py-20 md:py-28"
        id="mission-vision"
      >
        <div className="container mx-auto space-y-20 px-4 sm:px-6 lg:px-8 md:space-y-28">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <div className="relative h-80 overflow-hidden rounded-2xl border border-neutral-200 lg:order-last lg:h-[28rem]">
              <Image
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                alt="turta Misyon"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/25 to-transparent" />
            </div>
            <div className="lg:order-first">
              <p className="mb-3 text-sm font-semibold tracking-wider text-neutral-950 uppercase">
                Misyonumuz
              </p>
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
                Teknoloji ile Seyahat Deneyimini İyileştirmek
              </h2>
              <p className="text-lg leading-relaxed text-neutral-600">
                Turizm paydaşlarına yenilikçi, verimli ve kullanıcı dostu
                teknolojik çözümler sunarak seyahat planlama ve deneyim
                süreçlerini kolaylaştırmak, optimize etmek ve daha keyifli hale
                getirmektir.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <div className="relative h-80 overflow-hidden rounded-2xl border border-neutral-200 lg:h-[28rem]">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                alt="turta Vizyon"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/25 to-transparent" />
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold tracking-wider text-neutral-950 uppercase">
                Vizyonumuz
              </p>
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
                Global Turizm Teknolojilerinde Öncü Olmak
              </h2>
              <p className="text-lg leading-relaxed text-neutral-600">
                Türkiye&apos;den çıkarak global ölçekte tanınan, turizm
                teknolojileri alanında standartları belirleyen, inovasyon ve
                sürdürülebilirlik ilkeleriyle sektöre yön veren lider bir marka
                olmaktır.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-neutral-50 py-20 md:py-28">
        <div className="container mx-auto px-6">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <p className="mb-3 text-sm font-semibold tracking-wider text-neutral-950 uppercase">
              Temel İlkelerimiz
            </p>
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 md:text-4xl">
              Bizi Biz Yapan Değerler
            </h2>
            <p className="text-lg text-neutral-600">
              Başarımızın temelinde inovasyon, müşteri odaklılık ve mükemmellik
              anlayışımız yatar.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {companyValues.map((value) => (
              <div
                key={value.title}
                className="rounded-xl border border-neutral-200/80 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex items-center">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
                    <value.icon className="h-5 w-5 text-neutral-950" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900">
                    {value.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-neutral-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="border-t border-neutral-200/80 bg-white py-20 md:py-28">
        <div className="container mx-auto px-6">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <p className="mb-3 text-sm font-semibold tracking-wider text-neutral-950 uppercase">
              Yolculuğumuz
            </p>
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 md:text-4xl">
              Başarı Dolu Geçmişimiz
            </h2>
            <p className="text-lg text-neutral-600">
              Kuruluşumuzdan bugüne katettiğimiz önemli adımlar ve başarılar.
            </p>
          </div>

          <div className="relative mx-auto max-w-4xl">
            <div
              className="absolute top-0 bottom-0 left-1/2 hidden w-0.5 -translate-x-1/2 bg-neutral-200 md:block"
              aria-hidden="true"
            />

            <div className="space-y-12 md:space-y-0">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.year}
                  className={`relative items-center md:flex ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className="mb-8 md:mb-0 md:w-1/2 md:px-8 lg:px-12">
                    <div className="rounded-xl border border-neutral-200/80 bg-white p-6 shadow-sm">
                      <p className="mb-1 text-sm font-semibold text-neutral-950">
                        {milestone.year}
                      </p>
                      <h3 className="mb-2 text-lg font-semibold text-neutral-900">
                        {milestone.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-neutral-600">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  <div className="absolute top-1/2 left-1/2 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-neutral-950 shadow-md md:block" />
                  <div className="absolute top-0 bottom-0 left-0 w-0.5 -translate-x-4 bg-neutral-200 md:hidden" />
                  <div className="absolute top-8 left-0 h-3 w-3 -translate-x-[calc(50%+0.25rem)] rounded-full border-2 border-white bg-neutral-950 md:hidden" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-neutral-950 py-16 md:py-24">
        <div className="container mx-auto px-6 text-center">
          <div className="mx-auto max-w-3xl">
            <h3 className="mb-5 text-3xl font-bold text-white md:text-4xl">
              turta Ailesine Katılın
            </h3>
            <p className="mb-10 text-lg text-neutral-300">
              Turizm teknolojilerinin geleceğini şekillendiren dinamik
              ekibimizin bir parçası olmak ister misiniz? Açık pozisyonlarımızı
              inceleyin.
            </p>
            <Link
              href="/careers"
              className="inline-block rounded-lg bg-white px-7 py-3 text-sm font-semibold text-neutral-950 transition-colors hover:bg-neutral-100"
            >
              Açık Pozisyonlar
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
