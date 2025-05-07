"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { ShieldCheckIcon, CurrencyDollarIcon, TicketIcon } from "@heroicons/react/24/outline";

// Avantajlar verisi
const advantages = [
  { id: 1, text: "Ücretsiz İptal", icon: TicketIcon },
  { id: 2, text: "En İyi Fiyat Garantisi", icon: CurrencyDollarIcon },
  { id: 3, text: "Güvenli Ödeme", icon: ShieldCheckIcon },
];

export default function CTA() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-neutral-50 to-white border-y border-neutral-200/60 overflow-hidden">
      <div className="container px-4 mx-auto max-w-6xl relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div>
            <div className="inline-flex items-center justify-center px-4 py-1.5 bg-sky-100 rounded-full text-sky-700 font-medium text-sm mb-4">
              Fırsatı Yakala
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4 leading-tight">
              Hayalindeki Tatile İlk Adımı At!
            </h2>
            <p className="text-lg text-neutral-600 mb-8">
              Hemen kaydol, ilk rezervasyonunda geçerli %15 indirim kodunu kap! 
              Binlerce tur seçeneği arasından sana en uygun olanı bul.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <Link 
                href="/register" 
                className="group inline-flex items-center justify-center px-8 py-3.5 bg-sky-600 text-white hover:bg-sky-700 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 text-sm"
              >
                <span>%15 İndirim Kodu Al</span>
                <ArrowRightIcon className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link 
                href="/tours" 
                className="group inline-flex items-center justify-center px-8 py-3.5 bg-white text-sky-700 border border-neutral-200 hover:bg-neutral-50 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 text-sm"
              >
                <span>Turları İncele</span>
                <ArrowRightIcon className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
            
            <div className="flex flex-wrap gap-x-8 gap-y-4 justify-center">
              {advantages.map((advantage) => {
                const Icon = advantage.icon;
                return (
                  <div key={advantage.id} className="flex items-center text-sm text-neutral-600 group">
                    <Icon className="w-5 h-5 text-sky-600 mr-2 flex-shrink-0" />
                    <span className="transition-colors duration-200 group-hover:text-neutral-800 font-medium">{advantage.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 