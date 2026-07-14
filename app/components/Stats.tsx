"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
// Heroicons outline importlarını standartlaştıralım
import {
  UserGroupIcon,
  TicketIcon,
  FaceSmileIcon,
  CurrencyDollarIcon,
  ArrowRightIcon // Buton için ikon
} from '@heroicons/react/24/outline';

// İstatistik verileri - renkleri tema ile uyumlu hale getirelim
const stats = [
  {
    id: 1,
    title: "Aktif Kullanıcı",
    value: 2500,
    suffix: "+",
    description: "Platformumuzu düzenli kullanan gezgin",
    icon: UserGroupIcon,
    color: "sky" // Temaya uygun renk
  },
  {
    id: 2,
    title: "Gerçekleşen Rezervasyon",
    value: 3850,
    suffix: "+",
    description: "Son 3 ayda yapılan toplam rezervasyon",
    icon: TicketIcon,
    color: "emerald" // Temaya uygun renk
  },
  {
    id: 3,
    title: "Müşteri Memnuniyeti",
    value: 98,
    suffix: "%",
    description: "Müşteri anketlerinden alınan ortalama puan",
    icon: FaceSmileIcon,
    color: "amber" // Temaya uygun renk
  },
  {
    id: 4,
    title: "Ortalama Fırsat İndirimi",
    value: 25,
    suffix: "%",
    description: "Öne çıkan turlardaki ortalama indirim",
    icon: CurrencyDollarIcon,
    color: "rose", // Temaya uygun renk
    // highlight: true // Vurguyu kaldırabilir veya farklı stilleyebiliriz
  }
];

export default function Stats() {
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  // Görünürlük kontrolü
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // Bir kere göründükten sonra gözlemciyi durdur
        }
      },
      { threshold: 0.1 } // %10 görünür olduğunda tetikle
    );
    
    const currentRef = statsRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Renk sınıfları - Temaya uygun güncellendi
  const colorClasses = {
    sky: { bg: 'bg-sky-100', text: 'text-sky-600' },
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600' },
    rose: { bg: 'bg-rose-100', text: 'text-rose-600' },
  };

  return (
    <section 
      ref={statsRef}
      // Bölüm arkaplanı ve geçiş güncellendi
      className={`py-24 md:py-32 bg-white transition-opacity duration-1000 ease-out ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}
    >
      <div className="container px-6 mx-auto max-w-7xl">
        {/* Başlık Bölümü - Stil güncellendi */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center px-3 py-1 bg-sky-100 rounded-full text-sky-700 font-medium text-xs mb-6">
            Başarı Hikayemiz
           </div>
           <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            Rakamlarla Turladur
          </h2>
           <p className="text-lg text-neutral-600">
            Binlerce mutlu gezgin, unutulmaz anılar ve sürekli büyüyen bir topluluk.
            Size en iyi seyahat deneyimini sunmak için buradayız.
          </p>
        </div>

        {/* İstatistik Kartları - Stil güncellendi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => {
            const colors = colorClasses[stat.color as keyof typeof colorClasses] || colorClasses.sky;
            const IconComponent = stat.icon;
            return (
              <div 
                key={stat.id}
                 // Kart stili güncellendi (daha sade, hover efekti)
                 className={`bg-white rounded-xl border border-neutral-200/70 p-6 transition-all duration-300 ease-out hover:border-neutral-300 hover:shadow-sm ${isVisible ? `animate-fadeInUp delay-${index * 100}` : 'opacity-0 translate-y-3'}`}
              >
                 {/* İkon ve Değer Alanı */}
                 <div className="flex items-center gap-4 mb-3">
                   {/* İkon stili güncellendi */}
                   <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${colors.bg}`}>
                    <IconComponent className={`h-5 w-5 ${colors.text}`} />
                  </div>
                   {/* Değer stili güncellendi */}
                   <p className="text-3xl font-semibold text-neutral-900">
                    {stat.value.toLocaleString('tr-TR')} {/* Nokta yerine toLocaleString */} 
                     <span className={`text-xl ${colors.text}`}>{stat.suffix}</span>
                  </p>
                </div>
                 {/* Başlık */}
                 <p className="text-sm font-medium text-neutral-700 mb-1.5">{stat.title}</p>
                 {/* Açıklama */}
                 <p className="text-xs text-neutral-500 leading-relaxed">{stat.description}</p>
              </div>
            );
          })}
        </div>

        {/* Ekstra Bilgi veya CTA - Stil güncellendi */}
        <div className="mt-16 md:mt-20 text-center">
           <p className="text-neutral-600 text-base mb-6 max-w-2xl mx-auto">
            Türkiye'nin dört bir yanındaki eşsiz destinasyonları ve aktiviteleri keşfedin.
            Özel fırsatlar ve unutulmaz deneyimler sizi bekliyor.
          </p>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mx-auto max-w-xs sm:max-w-none">
            <Link 
              href="/tours" 
              className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-sky-600 text-white hover:bg-sky-700 rounded-lg transition-colors duration-200 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 text-sm"
            >
              Turları Keşfet
              <ArrowRightIcon className="w-4 h-4 ml-1.5" />
            </Link>
            <Link 
              href="/activities" 
              className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-sky-600 text-white hover:bg-sky-700 rounded-lg transition-colors duration-200 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 text-sm"
            >
              Aktiviteleri Keşfet
              <ArrowRightIcon className="w-4 h-4 ml-1.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 