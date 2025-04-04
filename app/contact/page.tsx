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
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="İletişim"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Sizinle <span className="text-blue-400">İletişimde</span> Olmaktan Mutluluk Duyarız
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Sorunlarınız, önerileriniz veya rezervasyon talepleriniz için bizimle iletişime geçin. 
                7/24 hizmetinizdeyiz.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="#contactForm"
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  İletişim Formu
                </a>
                <a 
                  href="#offices"
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors backdrop-blur-sm"
                >
                  Ofislerimiz
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* İletişim Kartları */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Müşteri Hizmetleri */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                <PhoneIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Müşteri Hizmetleri</h3>
              <p className="text-gray-600 mb-6">7/24 müşteri hizmetleri ekibimiz her türlü sorunuz için yanınızda.</p>
              <div className="space-y-2">
                <p className="font-medium text-blue-600">+90 850 123 45 67</p>
                <p className="text-gray-600">destek@tourtech.com</p>
              </div>
            </div>
            
            {/* Rezervasyon */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <ClockIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Rezervasyon</h3>
              <p className="text-gray-600 mb-6">Rezervasyon yapmak veya değişiklik için bizimle iletişime geçin.</p>
              <div className="space-y-2">
                <p className="font-medium text-green-600">+90 850 123 45 68</p>
                <p className="text-gray-600">rezervasyon@tourtech.com</p>
              </div>
            </div>
            
            {/* İş Ortaklığı */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
                <ChatBubbleLeftIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">İş Ortaklığı</h3>
              <p className="text-gray-600 mb-6">Otel, tur operatörü veya aktivite sağlayıcısı olarak iş birliği yapmak için.</p>
              <div className="space-y-2">
                <p className="font-medium text-purple-600">+90 850 123 45 69</p>
                <p className="text-gray-600">partner@tourtech.com</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>
      
      {/* İletişim Formu ve Harita */}
      <div id="contactForm" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-100 rounded-full text-blue-600 font-medium text-sm mb-6">
              İletişim Formu
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Bize Ulaşın</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Aşağıdaki formu doldurarak bizimle iletişime geçebilirsiniz. En kısa sürede size dönüş yapacağız.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Form */}
            <div className="bg-white rounded-xl p-8 shadow-xl">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ad Soyad"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Telefon (İsteğe Bağlı)</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+90 5XX XXX XX XX"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Konu</label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Konu Seçin</option>
                    <option value="reservation">Rezervasyon</option>
                    <option value="cancellation">İptal & İade</option>
                    <option value="support">Teknik Destek</option>
                    <option value="partnership">İş Ortaklığı</option>
                    <option value="other">Diğer</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Mesajınız</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Mesajınızı buraya yazın..."
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
                    <span>Kişisel verilerimin işlenmesine ilişkin </span>
                    <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                      aydınlatma metnini
                    </Link>
                    <span> okudum ve kabul ediyorum.</span>
                  </label>
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Gönder
                </button>
              </form>
            </div>
            
            {/* Harita */}
            <div className="rounded-xl overflow-hidden shadow-xl h-[500px] relative">
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
      
      {/* Ofisler */}
      <div id="offices" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-100 rounded-full text-blue-600 font-medium text-sm mb-6">
              Ofislerimiz
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Bizi Ziyaret Edin</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Türkiye'nin farklı şehirlerindeki ofislerimize bekliyoruz. Size en yakın TourTech ofisini ziyaret edin.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {officeLocations.map((office, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{office.city} Ofisi</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPinIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="ml-3 text-gray-600">{office.address}</p>
                  </div>
                  <div className="flex items-start">
                    <PhoneIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="ml-3 text-gray-600">{office.phone}</p>
                  </div>
                  <div className="flex items-start">
                    <EnvelopeIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="ml-3 text-gray-600">{office.email}</p>
                  </div>
                  <div className="flex items-start">
                    <ClockIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="ml-3 text-gray-600">{office.hours}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* SSS */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-100 rounded-full text-blue-600 font-medium text-sm mb-6">
              Sıkça Sorulan Sorular
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Aklınızdaki Sorulara Yanıtlar</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              En çok sorulan soruların yanıtlarını aşağıda bulabilirsiniz. Daha fazla bilgi için müşteri hizmetlerimizle iletişime geçebilirsiniz.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {faqData.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                  <details className="group">
                    <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                      <span className="text-lg font-semibold">{faq.question}</span>
                      <span className="transition group-open:rotate-180">
                        <ChevronDownIcon className="w-5 h-5 text-blue-600" />
                      </span>
                    </summary>
                    <p className="text-gray-600 mt-4 group-open:animate-fadeIn">
                      {faq.answer}
                    </p>
                  </details>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-white mb-6">Hemen Tatil Planınızı Yapmaya Başlayın</h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Yüzlerce otel, tur ve aktivite seçeneği ile unutulmaz bir tatil deneyimi için TourTech yanınızda.
          </p>
          <Link href="/" className="inline-block px-8 py-4 bg-white text-blue-700 font-medium rounded-lg transition-colors hover:bg-blue-50">
            Keşfetmeye Başla
          </Link>
        </div>
      </div>
      
    </main>
  );
} 