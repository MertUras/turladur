'use client';
import ContactForm from './contact-form';

import React from 'react';
import Image from 'next/image';
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

// Ofis bilgileri
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

export default function ContactPageContent() {
  return (
    <main className="bg-neutral-50 text-neutral-800">
      {/* Hero Bölümü */}
      <div className="relative bg-white pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full lg:w-1/2 hidden lg:block">
          <div className="h-full w-full relative">
            <Image
              src="https://images.unsplash.com/photo-1577412647305-991150c7d163?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt="Kurumsal İletişim"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-l from-white/0 via-white/70 to-white"></div>
          </div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-xl">
              <div className="inline-flex items-center px-3 py-1 bg-sky-100 rounded-full text-sky-700 font-medium text-xs mb-6">
                <BuildingOffice2Icon className="w-4 h-4 mr-1.5" />
                Kurumsal İletişim
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 !leading-tight">
                Sizinle İletişimde Olmaktan{' '}
                <span className="text-sky-600">Memnuniyet</span> Duyarız
              </h1>
              <p className="text-lg text-neutral-600 mb-10 leading-relaxed">
                turta olarak değerli müşterilerimize ve iş ortaklarımıza
                profesyonel hizmet sunmaktayız. Sorularınız ve talepleriniz için
                bizimle iletişime geçebilirsiniz.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                <div className="flex items-center p-5 bg-neutral-100/50 rounded-lg border border-neutral-200/80">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 bg-sky-100 rounded-md flex items-center justify-center">
                      <PhoneIcon className="w-5 h-5 text-sky-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
                      Müşteri Hizmetleri
                    </p>
                    <p className="text-base font-semibold text-neutral-900">
                      +90 850 123 45 67
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-5 bg-neutral-100/50 rounded-lg border border-neutral-200/80">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 bg-sky-100 rounded-md flex items-center justify-center">
                      <EnvelopeIcon className="w-5 h-5 text-sky-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
                      E-posta
                    </p>
                    <p className="text-base font-semibold text-neutral-900">
                      iletisim@tourtech.com
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="#contactForm"
                  className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors shadow-sm inline-flex items-center text-sm"
                >
                  <UserIcon className="w-4 h-4 mr-2" />
                  İletişim Formu
                </a>
                <a
                  href="#offices"
                  className="px-6 py-3 bg-white hover:bg-neutral-100 text-sky-600 font-medium rounded-lg transition-colors shadow-sm border border-neutral-200 inline-flex items-center text-sm"
                >
                  <MapPinIcon className="w-4 h-4 mr-2" />
                  Ofislerimiz
                </a>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </div>

      {/* İletişim Kartları */}
      <div className="py-24 bg-neutral-100/70">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              İletişim Kanallarımız
            </h2>
            <p className="text-lg text-neutral-600">
              Size en uygun iletişim kanalını seçerek bizimle bağlantı
              kurabilirsiniz. Profesyonel ekibimiz sorularınızı yanıtlamak için
              hazır.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: PhoneIcon,
                color: 'sky',
                title: 'Müşteri Hizmetleri',
                text: '7/24 müşteri hizmetleri ekibimiz her türlü sorunuz için yanınızda. Dilediğiniz zaman bizimle iletişime geçebilirsiniz.',
                phone: '+90 850 123 45 67',
                email: 'destek@tourtech.com',
              },
              {
                icon: ClockIcon,
                color: 'green',
                title: 'Rezervasyon',
                text: 'Rezervasyon yapmak, değişiklik veya iptal işlemleri için uzman ekibimizle iletişime geçebilirsiniz.',
                phone: '+90 850 123 45 68',
                email: 'rezervasyon@tourtech.com',
              },
              {
                icon: UserGroupIcon,
                color: 'purple',
                title: 'İş Ortaklığı',
                text: 'Otel, tur operatörü veya aktivite sağlayıcısı olarak turta ile iş birliği yapmak için bizimle iletişime geçin.',
                phone: '+90 850 123 45 69',
                email: 'partner@tourtech.com',
              },
            ].map((card, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-neutral-200/80 flex flex-col"
              >
                <div
                  className={`rounded-lg bg-${card.color}-100 p-3 inline-flex items-center justify-center w-12 h-12 mb-6`}
                >
                  <card.icon className={`w-6 h-6 text-${card.color}-600`} />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                  {card.title}
                </h3>
                <p className="text-neutral-600 mb-6 flex-grow text-sm leading-relaxed">
                  {card.text}
                </p>
                <div className="space-y-3 pt-5 border-t border-neutral-100">
                  <div className="flex items-center text-sm">
                    <PhoneIcon
                      className={`w-4 h-4 text-${card.color}-600 mr-3 flex-shrink-0`}
                    />
                    <p className="font-medium text-neutral-800">{card.phone}</p>
                  </div>
                  <div className="flex items-center text-sm">
                    <EnvelopeIcon
                      className={`w-4 h-4 text-${card.color}-600 mr-3 flex-shrink-0`}
                    />
                    <p className="text-neutral-700 hover:text-neutral-900 transition-colors">
                      {card.email}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* İletişim Formu ve Harita */}
      <div id="contactForm" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center px-3 py-1 bg-sky-100 rounded-full text-sky-700 font-medium text-xs mb-6">
              <EnvelopeIcon className="w-4 h-4 mr-1.5" />
              İletişim Formu
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Bizimle İletişime Geçin
            </h2>
            <p className="text-lg text-neutral-600">
              Aşağıdaki formu doldurarak bizimle iletişime geçebilirsiniz. Uzman
              ekibimiz en kısa sürede size dönüş yapacaktır.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
            <div className="bg-white rounded-xl p-8 lg:p-10 shadow-lg border border-neutral-200/60 lg:col-span-3">
              <ContactForm />
            </div>

            <div className="lg:col-span-2 space-y-8">
              <div className="bg-neutral-50/80 rounded-xl p-8 border border-neutral-200/80">
                <h3 className="text-xl font-semibold text-neutral-900 mb-5 pb-4 border-b border-neutral-200">
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
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <item.icon className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                      <p className="ml-3 text-neutral-700 text-sm">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl overflow-hidden shadow-md border border-neutral-200/80 h-[300px] relative">
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
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ofisler */}
      <div id="offices" className="py-24 bg-neutral-50">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center px-3 py-1 bg-sky-100 rounded-full text-sky-700 font-medium text-xs mb-6">
              <BuildingOffice2Icon className="w-4 h-4 mr-1.5" />
              Ofislerimiz
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Global Ağımız
            </h2>
            <p className="text-lg text-neutral-600">
              Türkiye&apos;nin farklı şehirlerindeki turta ofisleri, profesyonel
              ekibimizle hizmetinizdedir. Size en yakın ofisimizi ziyaret
              edebilirsiniz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {officeLocations.map((office, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 border border-neutral-200/80 flex flex-col"
              >
                <div className="flex items-center mb-6">
                  <div className="w-11 h-11 bg-sky-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <BuildingOffice2Icon className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <span className="text-xs text-sky-600 font-medium uppercase tracking-wider">
                      turta
                    </span>
                    <h3 className="text-lg font-semibold text-neutral-900 leading-tight">
                      {office.city} Ofisi
                    </h3>
                  </div>
                </div>
                <div className="space-y-3 text-sm flex-grow mb-6">
                  {[
                    { icon: MapPinIcon, text: office.address },
                    { icon: PhoneIcon, text: office.phone },
                    { icon: EnvelopeIcon, text: office.email },
                    { icon: ClockIcon, text: office.hours },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start">
                      <item.icon className="w-4 h-4 text-neutral-400 flex-shrink-0 mt-0.5" />
                      <p className="ml-3 text-neutral-600">{item.text}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-auto pt-5 border-t border-neutral-100">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(office.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-sky-600 font-medium hover:text-sky-700 transition-colors group"
                  >
                    <MapPinIcon className="w-4 h-4 mr-1.5 group-hover:animate-pulse" />
                    Yol Tarifi Al
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl p-8 md:p-10 border border-sky-100/70">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-lg">
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  Kurumsal Ziyaretçiler İçin
                </h3>
                <p className="text-neutral-600 text-sm">
                  Kurumsal görüşmeler ve özel toplantılar için lütfen iletişim
                  formumuz üzerinden önceden randevu talep ediniz.
                </p>
              </div>
              <a
                href="#contactForm"
                className="inline-flex items-center px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors shadow-sm text-sm flex-shrink-0 whitespace-nowrap"
              >
                <UserIcon className="w-4 h-4 mr-2" />
                Randevu Talep Et
              </a>
            </div>
          </div>
        </div>
      </div>

      <FaqSection contactHref="#contactForm" />

      {/* CTA */}
      <div className="py-20 bg-gradient-to-r from-sky-600 to-blue-700">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-5">
              Profesyonel Tatil Planlaması için turta
            </h3>
            <p className="text-lg text-sky-100 mb-10">
              En iyi otel, tur ve aktivite seçenekleriyle unutulmaz bir tatil
              deneyimi için hemen keşfetmeye başlayın.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/"
                className="inline-block px-7 py-3 bg-white text-sky-700 font-medium rounded-lg transition-colors hover:bg-sky-50 shadow-sm text-sm"
              >
                Tüm Seyahat Seçenekleri
              </Link>
              <Link
                href="/tours"
                className="inline-block px-7 py-3 bg-sky-700/50 text-white border border-sky-400/50 font-medium rounded-lg transition-colors hover:bg-sky-700 hover:border-sky-400 shadow-sm text-sm"
              >
                Özel Turlar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
