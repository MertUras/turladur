"use client";

import Link from "next/link";
import { ArrowRightIcon, ShieldCheckIcon, CurrencyDollarIcon, TicketIcon } from "@heroicons/react/24/outline";

// Avantajlar verisi
const advantages = [
  { id: 1, text: "Ücretsiz İptal", icon: TicketIcon },
  { id: 2, text: "En İyi Fiyat Garantisi", icon: CurrencyDollarIcon },
  { id: 3, text: "Güvenli Ödeme", icon: ShieldCheckIcon },
];

export default function CTA() {

  return (
    <section className="py-20 sm:py-28 bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
      ></div>

      <div className="container px-4 mx-auto max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 items-center">
          {/* Metin İçeriği */}
          <div className="text-center lg:text-left">
            <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-3 block">
              Fırsatı Yakala
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
              Hayalindeki Tatile İlk Adımı At!
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Hemen kaydol, ilk rezervasyonunda geçerli %15 indirim kodunu kap! 
              Binlerce tur seçeneği arasından sana en uygun olanı bul.
            </p>
            
            {/* Butonlar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Link 
                href="/register" 
                className="group inline-flex items-center justify-center px-7 py-3.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-all duration-300 ease-out font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span>%15 İndirim Kodu Al</span>
                <ArrowRightIcon className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link 
                href="/tours" 
                className="group inline-flex items-center justify-center px-7 py-3.5 bg-white text-indigo-600 hover:bg-indigo-50 border border-gray-300 hover:border-indigo-300 rounded-lg transition-all duration-300 ease-out font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span>Turları İncele</span>
                <ArrowRightIcon className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
            
            {/* Avantajlar */}
            <div className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:gap-8 justify-center lg:justify-start">
              {advantages.map((advantage) => {
                const Icon = advantage.icon;
                return (
                  <div key={advantage.id} className="flex items-center text-sm text-gray-700 group">
                    <Icon className="w-5 h-5 text-indigo-500 mr-2 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                    <span className="transition-colors duration-300 group-hover:text-indigo-600">{advantage.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Görsel Alanı - Soyut Grafik */}
          <div className="hidden lg:flex items-center justify-center relative h-96 lg:h-[500px]">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="max-w-md lg:max-w-lg xl:max-w-xl opacity-80">
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#6366F1', stopOpacity:1}} /> {/* indigo-500 */}
                    <stop offset="100%" style={{stopColor: '#818CF8', stopOpacity:1}} /> {/* indigo-400 */}
                  </linearGradient>
                  <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#A5B4FC', stopOpacity:1}} /> {/* indigo-300 */}
                    <stop offset="100%" style={{stopColor: '#C7D2FE', stopOpacity:1}} /> {/* indigo-200 */}
                  </linearGradient>
                  <filter id="blur1" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="30" />
                  </filter>
                  <filter id="blur2" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="40" />
                  </filter>
                </defs>
                {/* Arka plan blur shape'leri */}
                <circle cx="100" cy="300" r="150" fill="url(#grad2)" opacity="0.4" filter="url(#blur2)"/>
                <circle cx="300" cy="100" r="180" fill="url(#grad1)" opacity="0.5" filter="url(#blur1)"/>
                
                {/* Ana şekiller */}
                <path d="M50 150 Q100 50 200 100 T350 250" stroke="url(#grad1)" strokeWidth="15" strokeLinecap="round" transform="rotate(-15 200 200)"/>
                <path d="M100 350 Q200 300 250 200 T350 50" stroke="url(#grad2)" strokeWidth="10" strokeLinecap="round" strokeDasharray="20 10" transform="rotate(10 200 200)"/>
                <circle cx="80" cy="80" r="30" fill="white" opacity="0.8"/>
                <circle cx="320" cy="320" r="40" fill="white" opacity="0.7"/>
                <rect x="250" y="280" width="60" height="60" rx="10" fill="url(#grad1)" opacity="0.7" transform="rotate(30 280 310)"/>
              </svg>
            </div>
             {/* İsteğe bağlı: Kaliteli bir görsel eklenebilir */}
             {/* <Image src="/path/to/your/high-quality-image.jpg" alt="TurlaDur CTA Görseli" fill className="object-contain rounded-2xl" /> */}
          </div>
        </div>
      </div>
    </section>
  );
} 