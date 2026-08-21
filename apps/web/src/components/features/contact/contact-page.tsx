'use client';

import Link from 'next/link';
import {
  MapPin as MapPinIcon,
  Phone as PhoneIcon,
  Mail as EnvelopeIcon,
  Clock as ClockIcon,
  Building2 as BuildingOffice2Icon,
  User as UserIcon,
  Users as UserGroupIcon,
} from 'lucide-react';

import { FaqSection } from '@/components/features/faq/faq-section';
import ContactForm from './contact-form';

const officeLocations = [
  {
    city: 'İstanbul',
    address: 'Levent Mah. Büyükdere Cad. No:201 Kat:5, 34394 Şişli/İstanbul',
    phone: '+90 212 555 67 89',
    email: 'istanbul@tourtech.com',
    hours: 'Pazartesi - Cuma: 09:00 - 18:00',
  },
  {
    city: 'Antalya',
    address: 'Lara Cad. No:122, 07230 Muratpaşa/Antalya',
    phone: '+90 242 444 12 34',
    email: 'antalya@tourtech.com',
    hours: 'Pazartesi - Cumartesi: 09:00 - 19:00',
  },
  {
    city: 'İzmir',
    address: 'Konak Mah. Atatürk Cad. No:58/A, 35210 Konak/İzmir',
    phone: '+90 232 333 22 11',
    email: 'izmir@tourtech.com',
    hours: 'Pazartesi - Cuma: 09:00 - 18:00',
  },
];

const channelCards = [
  {
    icon: PhoneIcon,
    title: 'Müşteri Hizmetleri',
    text: '7/24 müşteri hizmetleri ekibimiz her türlü sorunuz için yanınızda. Dilediğiniz zaman bizimle iletişime geçebilirsiniz.',
    phone: '+90 850 123 45 67',
    email: 'destek@tourtech.com',
  },
  {
    icon: ClockIcon,
    title: 'Rezervasyon',
    text: 'Rezervasyon yapmak, değişiklik veya iptal işlemleri için uzman ekibimizle iletişime geçebilirsiniz.',
    phone: '+90 850 123 45 68',
    email: 'rezervasyon@tourtech.com',
  },
  {
    icon: UserGroupIcon,
    title: 'İş Ortaklığı',
    text: 'Otel, tur operatörü veya aktivite sağlayıcısı olarak turta ile iş birliği yapmak için bizimle iletişime geçin.',
    phone: '+90 850 123 45 69',
    email: 'partner@tourtech.com',
  },
];

export default function ContactPageContent() {
  return (
    <main className="bg-neutral-50 text-neutral-800">
      {/* Hero — brand first; soft surface instead of inset photo panel */}
      <section className="relative overflow-hidden border-b border-neutral-200/80 bg-gradient-to-b from-white via-neutral-50 to-neutral-100/80 pt-36 pb-20 lg:pt-44 lg:pb-28">
        <div className="pointer-events-none absolute inset-0 opacity-[0.35]">
          <div className="absolute -top-24 right-0 h-80 w-80 rounded-full bg-neutral-200/60 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-neutral-300/40 blur-3xl" />
        </div>

        <div className="container relative z-10 mx-auto px-6">
          <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:max-w-xl lg:text-left">
            <p className="mb-4 text-sm font-semibold tracking-[0.2em] text-neutral-950 uppercase">
              turta
            </p>
            <h1 className="mb-6 text-4xl !leading-tight font-bold text-neutral-900 md:text-5xl lg:text-6xl">
              Sizinle İletişimde Olmaktan Memnuniyet Duyarız
            </h1>
            <p className="mb-10 text-lg leading-relaxed text-neutral-600">
              turta olarak değerli müşterilerimize ve iş ortaklarımıza
              profesyonel hizmet sunmaktayız. Sorularınız ve talepleriniz için
              bizimle iletişime geçebilirsiniz.
            </p>

            <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center rounded-lg border border-neutral-200/80 bg-white/80 p-5">
                <div className="mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-neutral-100">
                  <PhoneIcon className="h-5 w-5 text-neutral-950" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-medium tracking-wider text-neutral-500 uppercase">
                    Müşteri Hizmetleri
                  </p>
                  <p className="text-base font-semibold text-neutral-900">
                    +90 850 123 45 67
                  </p>
                </div>
              </div>

              <div className="flex items-center rounded-lg border border-neutral-200/80 bg-white/80 p-5">
                <div className="mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-neutral-100">
                  <EnvelopeIcon className="h-5 w-5 text-neutral-950" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-medium tracking-wider text-neutral-500 uppercase">
                    E-posta
                  </p>
                  <p className="text-base font-semibold text-neutral-900">
                    iletisim@tourtech.com
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
              <a
                href="#contactForm"
                className="inline-flex items-center rounded-lg bg-neutral-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-neutral-800"
              >
                <UserIcon className="mr-2 h-4 w-4" />
                İletişim Formu
              </a>
              <a
                href="#offices"
                className="inline-flex items-center rounded-lg border border-neutral-200 bg-white px-6 py-3 text-sm font-medium text-neutral-900 shadow-sm transition-colors hover:bg-neutral-50"
              >
                <MapPinIcon className="mr-2 h-4 w-4" />
                Ofislerimiz
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Channels */}
      <section className="border-b border-neutral-200/80 bg-white py-20 md:py-24">
        <div className="container mx-auto px-6">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 md:text-4xl">
              İletişim Kanallarımız
            </h2>
            <p className="text-lg text-neutral-600">
              Size en uygun iletişim kanalını seçerek bizimle bağlantı
              kurabilirsiniz. Profesyonel ekibimiz sorularınızı yanıtlamak için
              hazır.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {channelCards.map((card) => (
              <div
                key={card.title}
                className="flex flex-col rounded-xl border border-neutral-200/80 bg-neutral-50/50 p-8 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100">
                  <card.icon className="h-6 w-6 text-neutral-950" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-neutral-900">
                  {card.title}
                </h3>
                <p className="mb-6 flex-grow text-sm leading-relaxed text-neutral-600">
                  {card.text}
                </p>
                <div className="space-y-3 border-t border-neutral-200/80 pt-5">
                  <div className="flex items-center text-sm">
                    <PhoneIcon className="mr-3 h-4 w-4 shrink-0 text-neutral-950" />
                    <p className="font-medium text-neutral-800">{card.phone}</p>
                  </div>
                  <div className="flex items-center text-sm">
                    <EnvelopeIcon className="mr-3 h-4 w-4 shrink-0 text-neutral-950" />
                    <p className="text-neutral-700">{card.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + map */}
      <section id="contactForm" className="bg-neutral-50 py-20 md:py-24">
        <div className="container mx-auto px-6">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <p className="mb-3 text-sm font-semibold tracking-wider text-neutral-950 uppercase">
              İletişim Formu
            </p>
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 md:text-4xl">
              Bizimle İletişime Geçin
            </h2>
            <p className="text-lg text-neutral-600">
              Aşağıdaki formu doldurarak bizimle iletişime geçebilirsiniz. Uzman
              ekibimiz en kısa sürede size dönüş yapacaktır.
            </p>
          </div>

          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-5 lg:gap-14">
            <div className="rounded-xl border border-neutral-200/80 bg-white p-8 shadow-sm lg:col-span-3 lg:p-10">
              <ContactForm />
            </div>

            <div className="space-y-6 lg:col-span-2">
              <div className="rounded-xl border border-neutral-200/80 bg-white p-8">
                <h3 className="mb-5 border-b border-neutral-200 pb-4 text-xl font-semibold text-neutral-900">
                  Genel Merkez
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: MapPinIcon,
                      text: 'Levent Mah. Büyükdere Cad. No:201 Kat:5, 34394 Şişli/İstanbul',
                    },
                    { icon: PhoneIcon, text: '+90 212 555 67 89' },
                    { icon: EnvelopeIcon, text: 'info@tourtech.com' },
                    {
                      icon: ClockIcon,
                      text: 'Pazartesi - Cuma: 09:00 - 18:00',
                    },
                  ].map((item) => (
                    <div key={item.text} className="flex items-start">
                      <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-neutral-950" />
                      <p className="ml-3 text-sm text-neutral-700">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative h-[300px] overflow-hidden rounded-xl border border-neutral-200/80 shadow-sm">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.2589461255607!2d29.004343316232286!3d41.07661201791399!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab63f6f4a844b%3A0x41e8e7a9ca36f0f3!2sLevent%2C%20B%C3%BCy%C3%BCkdere%20Cd.%20201%2C%2034394%20%C5%9Ei%C5%9Fli%2F%C4%B0stanbul!5e0!3m2!1str!2str!4v1615376568447!5m2!1str!2str"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="turta İstanbul Ofisi"
                  className="absolute inset-0"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offices */}
      <section
        id="offices"
        className="border-t border-neutral-200/80 bg-white py-20 md:py-24"
      >
        <div className="container mx-auto px-6">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <p className="mb-3 text-sm font-semibold tracking-wider text-neutral-950 uppercase">
              Ofislerimiz
            </p>
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 md:text-4xl">
              Global Ağımız
            </h2>
            <p className="text-lg text-neutral-600">
              Türkiye&apos;nin farklı şehirlerindeki turta ofisleri, profesyonel
              ekibimizle hizmetinizdedir. Size en yakın ofisimizi ziyaret
              edebilirsiniz.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {officeLocations.map((office) => (
              <div
                key={office.city}
                className="flex flex-col rounded-xl border border-neutral-200/80 bg-neutral-50/40 p-6 transition-shadow hover:shadow-md"
              >
                <div className="mb-6 flex items-center">
                  <div className="mr-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                    <BuildingOffice2Icon className="h-5 w-5 text-neutral-950" />
                  </div>
                  <div>
                    <span className="text-xs font-medium tracking-wider text-neutral-500 uppercase">
                      turta
                    </span>
                    <h3 className="text-lg leading-tight font-semibold text-neutral-900">
                      {office.city} Ofisi
                    </h3>
                  </div>
                </div>
                <div className="mb-6 flex-grow space-y-3 text-sm">
                  {[
                    { icon: MapPinIcon, text: office.address },
                    { icon: PhoneIcon, text: office.phone },
                    { icon: EnvelopeIcon, text: office.email },
                    { icon: ClockIcon, text: office.hours },
                  ].map((item) => (
                    <div key={item.text} className="flex items-start">
                      <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                      <p className="ml-3 text-neutral-600">{item.text}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-auto border-t border-neutral-200/80 pt-5">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(office.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-medium text-neutral-950 transition-colors hover:text-neutral-700"
                  >
                    <MapPinIcon className="mr-1.5 h-4 w-4" />
                    Yol Tarifi Al
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 rounded-xl border border-neutral-200 bg-neutral-50 p-8 md:p-10">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div className="max-w-lg">
                <h3 className="mb-2 text-xl font-semibold text-neutral-900">
                  Kurumsal Ziyaretçiler İçin
                </h3>
                <p className="text-sm text-neutral-600">
                  Kurumsal görüşmeler ve özel toplantılar için lütfen iletişim
                  formumuz üzerinden önceden randevu talep ediniz.
                </p>
              </div>
              <a
                href="#contactForm"
                className="inline-flex shrink-0 items-center whitespace-nowrap rounded-lg bg-neutral-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-neutral-800"
              >
                <UserIcon className="mr-2 h-4 w-4" />
                Randevu Talep Et
              </a>
            </div>
          </div>
        </div>
      </section>

      <FaqSection contactHref="#contactForm" />

      {/* CTA */}
      <section className="bg-neutral-950 py-16 md:py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="mx-auto max-w-3xl">
            <h3 className="mb-5 text-3xl font-bold text-white md:text-4xl">
              Profesyonel Tatil Planlaması için turta
            </h3>
            <p className="mb-10 text-lg text-neutral-300">
              En iyi otel, tur ve aktivite seçenekleriyle unutulmaz bir tatil
              deneyimi için hemen keşfetmeye başlayın.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/"
                className="inline-block rounded-lg bg-white px-7 py-3 text-sm font-semibold text-neutral-950 transition-colors hover:bg-neutral-100"
              >
                Tüm Seyahat Seçenekleri
              </Link>
              <Link
                href="/tours"
                className="inline-block rounded-lg border border-neutral-600 bg-transparent px-7 py-3 text-sm font-medium text-white transition-colors hover:border-neutral-400 hover:bg-neutral-900"
              >
                Özel Turlar
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
