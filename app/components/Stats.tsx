"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// İkonlar (Heroicons outline)
const UserGroupIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-3.741-5.588M14.25 18.72a9.094 9.094 0 0 1-3.741-.479 3 3 0 0 1-3.741-5.588M2.25 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-3.741-5.588M10.5 6a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Zm-4.5 6A2.25 2.25 0 0 0 3.75 14.25v.039m11.25-.039A2.25 2.25 0 0 1 18.75 12v.039" />
  </svg>
);

const TicketIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
  </svg>
);

const FaceSmileIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm4.5 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Z" />
  </svg>
);

const CurrencyDollarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

// İstatistik verileri
const stats = [
  {
    id: 1,
    title: "Aktif Kullanıcı",
    value: 2500,
    suffix: "+",
    description: "Platformumuzu düzenli kullanan gezgin",
    icon: UserGroupIcon,
    color: "blue"
  },
  {
    id: 2,
    title: "Gerçekleşen Rezervasyon",
    value: 3850,
    suffix: "+",
    description: "Son 3 ayda yapılan toplam rezervasyon",
    icon: TicketIcon,
    color: "green"
  },
  {
    id: 3,
    title: "Müşteri Memnuniyeti",
    value: 98,
    suffix: "%",
    description: "Müşteri anketlerinden alınan ortalama puan",
    icon: FaceSmileIcon,
    color: "orange"
  },
  {
    id: 4,
    title: "Ortalama Fırsat İndirimi",
    value: 25,
    suffix: "%",
    description: "Öne çıkan turlardaki ortalama indirim",
    icon: CurrencyDollarIcon,
    color: "red",
    highlight: true // Bu kartı vurgulamak için
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

  // Renk sınıfları (İkas stilinde daha sade tonlar düşünülebilir)
  const colorClasses = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
    green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
    red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
  };

  return (
    <section 
      ref={statsRef}
      className={`py-20 sm:py-28 bg-white transition-opacity duration-1000 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="container px-4 mx-auto max-w-7xl">
        {/* Başlık Bölümü */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2 block">
            Başarı Hikayemiz
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Rakamlarla TurlaDur
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Binlerce mutlu gezgin, unutulmaz anılar ve sürekli büyüyen bir topluluk.
            Size en iyi seyahat deneyimini sunmak için buradayız.
          </p>
        </div>

        {/* İstatistik Kartları */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat) => {
            const colors = colorClasses[stat.color as keyof typeof colorClasses] || colorClasses.blue;
            const IconComponent = stat.icon;
            return (
              <div 
                key={stat.id}
                className={`bg-white rounded-xl border ${stat.highlight ? 'border-blue-300 shadow-lg' : 'border-gray-200'} p-6 transition-all duration-300 ease-out hover:shadow-lg hover:border-blue-300`}
              >
                <div className="flex items-start gap-4">
                  {/* İkon */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${colors.bg}`}>
                    <IconComponent className={`h-6 w-6 ${colors.text}`} />
                  </div>
                  {/* Değer ve Başlık */}
                  <div className="flex-1">
                    <p className="text-3xl sm:text-4xl font-bold text-gray-900">
                      {stat.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                      <span className={`${colors.text} ml-1`}>{stat.suffix}</span>
                    </p>
                    <p className="text-sm font-medium text-gray-500 mt-1">{stat.title}</p>
                  </div>
                </div>
                {/* Açıklama */}
                <p className="text-sm text-gray-600 mt-4">{stat.description}</p>
              </div>
            );
          })}
        </div>

        {/* Ekstra Bilgi veya CTA (Opsiyonel) */}
        <div className="mt-16 sm:mt-20 text-center">
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Türkiye'nin dört bir yanındaki eşsiz destinasyonları keşfedin.
            Özel fırsatlar ve unutulmaz deneyimler sizi bekliyor.
          </p>
          <Link 
            href="/tours" 
            className="inline-flex items-center justify-center px-7 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors duration-300 font-medium shadow-md hover:shadow-lg"
          >
            Turları Keşfet
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 ml-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
} 