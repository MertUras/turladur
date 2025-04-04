import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  ChatBubbleLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BuildingOffice2Icon,
  UserIcon,
  QuestionMarkCircleIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'İletişim | TourTech - Profesyonel Seyahat Deneyimi',
  description: 'TourTech ile iletişime geçin. Sorunlarınız, önerileriniz veya rezervasyonlarınız için bize ulaşın. 7/24 müşteri hizmetleri desteği.',
};

// SSS verileri
const faqData = [
  {
    question: "Rezervasyon iptali nasıl yapılır?",
    answer: "Rezervasyon iptallerinizi hesabınızın 'Rezervasyonlarım' bölümünden yapabilirsiniz. İptal koşulları rezervasyon tipine göre değişiklik gösterebilir. Detaylı bilgi için müşteri hizmetlerimizle iletişime geçebilirsiniz."
  },
  {
    question: "Ödeme seçenekleri nelerdir?",
    answer: "TourTech üzerinden kredi kartı, banka kartı, havale/EFT ve online ödeme sistemleri ile ödeme yapabilirsiniz. Bazı rezervasyonlarda taksit seçenekleri de sunulmaktadır."
  },
  {
    question: "Rezervasyon sonrası değişiklik yapabilir miyim?",
    answer: "Evet, çoğu rezervasyonda değişiklik yapabilirsiniz. Değişiklik koşulları ve ücretleri, rezervasyon tipine ve otel/tur politikasına göre değişiklik gösterebilir."
  },
  {
    question: "Grup rezervasyonları için özel fiyatlar mevcut mu?",
    answer: "Evet, 10 kişi ve üzeri grup rezervasyonları için özel fiyat ve avantajlar sunuyoruz. Grup rezervasyonları için iletişim formumuz üzerinden bize ulaşabilirsiniz."
  },
  {
    question: "Yurt dışı turlarında vize desteği sağlıyor musunuz?",
    answer: "Evet, yurt dışı turlarımızda vize süreçlerinize destek sağlıyoruz. Gerekli evraklar ve başvuru süreci hakkında detaylı bilgilendirme yapıyoruz."
  }
];

// Ofis bilgileri
const officeLocations = [
  {
    city: "İstanbul",
    address: "Levent Mah. Büyükdere Cad. No:201 Kat:5, 34394 Şişli/İstanbul",
    phone: "+90 212 555 67 89",
    email: "istanbul@tourtech.com",
    hours: "Pazartesi - Cuma: 09:00 - 18:00",
  },
  {
    city: "Antalya",
    address: "Lara Cad. No:122, 07230 Muratpaşa/Antalya",
    phone: "+90 242 444 12 34",
    email: "antalya@tourtech.com",
    hours: "Pazartesi - Cumartesi: 09:00 - 19:00",
  },
  {
    city: "İzmir",
    address: "Konak Mah. Atatürk Cad. No:58/A, 35210 Konak/İzmir",
    phone: "+90 232 333 22 11",
    email: "izmir@tourtech.com",
    hours: "Pazartesi - Cuma: 09:00 - 18:00",
  }
];

export default function ContactPage() {
  return (
    <main>
      
      {/* Hero Bölümü */}
      <div className="relative bg-gray-50 py-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
          <div className="h-full w-full relative">
            <Image
              src="https://images.unsplash.com/photo-1577412647305-991150c7d163?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt="Kurumsal İletişim"
              fill
              className="object-cover rounded-bl-[100px] shadow-2xl"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-transparent to-transparent"></div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="py-12">
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-blue-700 font-medium text-sm mb-8 text-caption">
                <BuildingOffice2Icon className="w-4 h-4 mr-2" />
                Kurumsal İletişim
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight font-heading">
                Sizinle <span className="text-gradient span-inherit">İletişimde</span> Olmaktan Memnuniyet Duyarız
              </h1>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-xl font-body">
                TourTech olarak değerli müşterilerimize ve iş ortaklarımıza profesyonel hizmet sunmaktayız. Sorularınız ve talepleriniz için bizimle iletişime geçebilirsiniz.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
                <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <PhoneIcon className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Müşteri Hizmetleri</p>
                    <p className="text-lg font-semibold text-gray-900">+90 850 123 45 67</p>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <EnvelopeIcon className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">E-posta</p>
                    <p className="text-lg font-semibold text-gray-900">iletisim@tourtech.com</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <a 
                  href="#contactForm"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-md inline-flex items-center"
                >
                  <UserIcon className="w-5 h-5 mr-2" />
                  İletişim Formu
                </a>
                <a 
                  href="#offices"
                  className="px-6 py-3 bg-white hover:bg-gray-50 text-blue-600 font-medium rounded-lg transition-colors shadow-sm border border-gray-200 inline-flex items-center"
                >
                  <MapPinIcon className="w-5 h-5 mr-2" />
                  Ofislerimiz
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* İletişim Kartları */}
      <div className="py-20 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-heading">İletişim Kanallarımız</h2>
            <p className="text-lg text-gray-600 font-body">
              Size en uygun iletişim kanalını seçerek bizimle bağlantı kurabilirsiniz. Profesyonel ekibimiz sorularınızı yanıtlamak için hazır.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Müşteri Hizmetleri */}
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col h-full">
              <div className="rounded-xl bg-blue-50 p-4 inline-block mb-6">
                <PhoneIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Müşteri Hizmetleri</h3>
              <p className="text-gray-600 mb-6 flex-grow">7/24 müşteri hizmetleri ekibimiz her türlü sorunuz için yanınızda. Dilediğiniz zaman bizimle iletişime geçebilirsiniz.</p>
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex items-center">
                  <PhoneIcon className="w-5 h-5 text-blue-600 mr-3" />
                  <p className="font-medium text-gray-800">+90 850 123 45 67</p>
                </div>
                <div className="flex items-center">
                  <EnvelopeIcon className="w-5 h-5 text-blue-600 mr-3" />
                  <p className="text-gray-700">destek@tourtech.com</p>
                </div>
              </div>
            </div>
            
            {/* Rezervasyon */}
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col h-full">
              <div className="rounded-xl bg-green-50 p-4 inline-block mb-6">
                <ClockIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Rezervasyon</h3>
              <p className="text-gray-600 mb-6 flex-grow">Rezervasyon yapmak, değişiklik veya iptal işlemleri için uzman ekibimizle iletişime geçebilirsiniz.</p>
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex items-center">
                  <PhoneIcon className="w-5 h-5 text-green-600 mr-3" />
                  <p className="font-medium text-gray-800">+90 850 123 45 68</p>
                </div>
                <div className="flex items-center">
                  <EnvelopeIcon className="w-5 h-5 text-green-600 mr-3" />
                  <p className="text-gray-700">rezervasyon@tourtech.com</p>
                </div>
              </div>
            </div>
            
            {/* İş Ortaklığı */}
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col h-full">
              <div className="rounded-xl bg-purple-50 p-4 inline-block mb-6">
                <UserGroupIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">İş Ortaklığı</h3>
              <p className="text-gray-600 mb-6 flex-grow">Otel, tur operatörü veya aktivite sağlayıcısı olarak TourTech ile iş birliği yapmak için bizimle iletişime geçin.</p>
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex items-center">
                  <PhoneIcon className="w-5 h-5 text-purple-600 mr-3" />
                  <p className="font-medium text-gray-800">+90 850 123 45 69</p>
                </div>
                <div className="flex items-center">
                  <EnvelopeIcon className="w-5 h-5 text-purple-600 mr-3" />
                  <p className="text-gray-700">partner@tourtech.com</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
      
      {/* İletişim Formu ve Harita */}
      <div id="contactForm" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-50 rounded-full text-blue-600 font-medium text-sm mb-6 text-caption">
              <EnvelopeIcon className="w-4 h-4 mr-2" />
              İletişim Formu
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-heading">Bizimle İletişime Geçin</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-body">
              Aşağıdaki formu doldurarak bizimle iletişime geçebilirsiniz. Uzman ekibimiz en kısa sürede size dönüş yapacaktır.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-16">
            {/* Form */}
            <div className="bg-white rounded-xl p-8 shadow-xl lg:col-span-3">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Ad Soyad"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">E-posta Adresiniz</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="+90 5XX XXX XX XX"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Konu</label>
                    <select
                      id="subject"
                      name="subject"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    >
                      <option value="">Konu Seçiniz</option>
                      <option value="reservation">Rezervasyon</option>
                      <option value="cancellation">İptal & İade</option>
                      <option value="support">Teknik Destek</option>
                      <option value="partnership">İş Ortaklığı</option>
                      <option value="other">Diğer</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Mesajınız</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Mesajınızı detaylı bir şekilde yazınız..."
                    required
                  ></textarea>
                </div>
                
                <div className="flex items-start">
                  <input
                    id="privacy"
                    name="privacy"
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                    required
                  />
                  <label htmlFor="privacy" className="ml-3 text-sm text-gray-600">
                    <span className="span-inherit">Kişisel verilerimin işlenmesine ilişkin </span>
                    <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                      aydınlatma metnini
                    </Link>
                    <span className="span-inherit"> okudum ve kabul ediyorum.</span>
                  </label>
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-md flex items-center justify-center"
                >
                  <EnvelopeIcon className="w-5 h-5 mr-2" />
                  Mesajı Gönder
                </button>
              </form>
            </div>
            
            {/* İletişim Bilgileri ve Harita */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Genel Merkez</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <MapPinIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="ml-3 text-gray-700">Levent Mah. Büyükdere Cad. No:201 Kat:5, 34394 Şişli/İstanbul</p>
                  </div>
                  <div className="flex items-start">
                    <PhoneIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="ml-3 text-gray-700">+90 212 555 67 89</p>
                  </div>
                  <div className="flex items-start">
                    <EnvelopeIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="ml-3 text-gray-700">info@tourtech.com</p>
                  </div>
                  <div className="flex items-start">
                    <ClockIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="ml-3 text-gray-700">Pazartesi - Cuma: 09:00 - 18:00</p>
                  </div>
                </div>
              </div>
            
              {/* Harita */}
              <div className="rounded-xl overflow-hidden shadow-lg h-[300px] relative">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.2589461255607!2d29.004343316232286!3d41.07661201791399!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab63f6f4a844b%3A0x41e8e7a9ca36f0f3!2sLevent%2C%20B%C3%BCy%C3%BCkdere%20Cd.%20201%2C%2034394%20%C5%9Ei%C5%9Fli%2F%C4%B0stanbul!5e0!3m2!1str!2str!4v1615376568447!5m2!1str!2str" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="TourTech İstanbul Ofisi"
                  className="absolute inset-0"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Ofisler */}
      <div id="offices" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-50 rounded-full text-blue-600 font-medium text-sm mb-6 text-caption">
              <BuildingOffice2Icon className="w-4 h-4 mr-2" />
              Ofislerimiz
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-heading">Global Ağımız</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-body">
              Türkiye'nin farklı şehirlerindeki TourTech ofisleri, profesyonel ekibimizle hizmetinizdedir. Size en yakın ofisimizi ziyaret edebilirsiniz.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {officeLocations.map((office, index) => (
              <div key={index} className="bg-white rounded-xl p-6 hover:scale-[1.02] transition-all duration-300 border border-gray-100 shadow-md hover:shadow-lg">
                <div className="flex items-start mb-6">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mr-4">
                    <BuildingOffice2Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <span className="text-sm text-blue-600 font-medium span-small">TourTech</span>
                    <h3 className="text-xl font-bold text-gray-900">{office.city} Ofisi</h3>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPinIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="ml-3 text-gray-700 text-sm">{office.address}</p>
                  </div>
                  <div className="flex items-start">
                    <PhoneIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="ml-3 text-gray-700 text-sm">{office.phone}</p>
                  </div>
                  <div className="flex items-start">
                    <EnvelopeIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="ml-3 text-gray-700 text-sm">{office.email}</p>
                  </div>
                  <div className="flex items-start">
                    <ClockIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="ml-3 text-gray-700 text-sm">{office.hours}</p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(office.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
                  >
                    <MapPinIcon className="w-4 h-4 mr-2" />
                    Yol Tarifi Al
                  </a>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 bg-blue-50 rounded-xl p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-6 md:mb-0">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Kurumsal Ziyaretçiler İçin</h3>
                <p className="text-gray-600 max-w-lg">
                  Kurumsal görüşmeler ve özel toplantılar için lütfen önceden randevu alınız.
                </p>
              </div>
              <a
                href="#contactForm"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-md"
              >
                <UserIcon className="w-5 h-5 mr-2" />
                Randevu Talep Et
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* SSS */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-50 rounded-full text-blue-600 font-medium text-sm mb-6 text-caption">
              <QuestionMarkCircleIcon className="w-4 h-4 mr-2" />
              Sıkça Sorulan Sorular
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-heading">Aklınızdaki Soruların Yanıtları</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-body">
              Seyahat ve rezervasyon süreçlerinizle ilgili en çok sorulan soruların yanıtlarını burada bulabilirsiniz.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {faqData.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md">
                  <details className="group">
                    <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-6">
                      <span className="text-lg font-semibold text-gray-900 span-large">{faq.question}</span>
                      <span className="ml-6 flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 group-open:rotate-180 transition-transform span-inherit">
                        <ChevronDownIcon className="w-5 h-5" />
                      </span>
                    </summary>
                    <div className="p-6 pt-0 mt-4 border-t border-gray-100">
                      <p className="text-gray-700">
                        {faq.answer}
                      </p>
                    </div>
                  </details>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-6">Aradığınız sorunun cevabını bulamadınız mı?</p>
              <a 
                href="#contactForm"
                className="inline-flex items-center px-6 py-3 bg-white hover:bg-gray-50 text-blue-600 font-medium rounded-lg transition-colors shadow-sm border border-gray-200"
              >
                <EnvelopeIcon className="w-5 h-5 mr-2" />
                Bize Sorun
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA */}
      <div className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-6 font-heading">Profesyonel Tatil Planlaması için TourTech</h3>
            <p className="text-xl text-blue-100 mb-10 font-body">
              En iyi otel, tur ve aktivite seçenekleriyle unutulmaz bir tatil deneyimi için hemen keşfetmeye başlayın.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/" className="inline-block px-8 py-4 bg-white text-blue-700 font-medium rounded-lg transition-colors hover:bg-blue-50 shadow-md">
                Tüm Seyahat Seçenekleri
              </Link>
              <Link href="/tours" className="inline-block px-8 py-4 bg-blue-700 text-white border border-blue-400 font-medium rounded-lg transition-colors hover:bg-blue-800 shadow-md">
                Özel Turlar
              </Link>
            </div>
          </div>
        </div>
      </div>
      
    </main>
  );
} 