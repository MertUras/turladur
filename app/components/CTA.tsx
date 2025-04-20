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
    <section className="py-24 md:py-32 bg-neutral-50 border-y border-neutral-200/60 overflow-hidden">
      <div className="container px-6 mx-auto max-w-7xl relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div>
            <div className="inline-flex items-center justify-center px-3 py-1 bg-sky-100 rounded-full text-sky-700 font-medium text-xs mb-6">
              Fırsatı Yakala
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-5 leading-tight">
              Hayalindeki Tatile İlk Adımı At!
            </h2>
            <p className="text-lg text-neutral-600 mb-10">
              Hemen kaydol, ilk rezervasyonunda geçerli %15 indirim kodunu kap! 
              Binlerce tur seçeneği arasından sana en uygun olanı bul.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
              <Link 
                href="/register" 
                className="group inline-flex items-center justify-center px-6 py-3 bg-sky-600 text-white hover:bg-sky-700 rounded-lg transition-colors duration-200 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 text-sm"
              >
                <span>%15 İndirim Kodu Al</span>
                <ArrowRightIcon className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <Link 
                href="/tours" 
                className="group inline-flex items-center justify-center px-6 py-3 bg-white text-sky-700 border border-neutral-300 hover:bg-neutral-50 rounded-lg transition-colors duration-200 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 text-sm"
              >
                <span>Turları İncele</span>
                <ArrowRightIcon className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
            
            <div className="flex flex-wrap gap-x-6 gap-y-3 justify-center">
              {advantages.map((advantage) => {
                const Icon = advantage.icon;
                return (
                  <div key={advantage.id} className="flex items-center text-xs text-neutral-600 group">
                    <Icon className="w-4 h-4 text-sky-600 mr-1.5 flex-shrink-0" />
                    <span className="transition-colors duration-200 group-hover:text-neutral-800">{advantage.text}</span>
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