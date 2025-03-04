"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// İstatistik verileri - satış odaklı metriklerle zenginleştirildi
const stats = [
  {
    id: 1,
    title: "Aktif Kullanıcı",
    value: 2500,
    suffix: "+",
    description: "Turizm ekosisteminde aktif kullanıcı",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  },
  {
    id: 2,
    title: "Tur Satışları",
    value: 3850,
    suffix: "+",
    description: "Son bir ayda gerçekleşen rezervasyon",
    callToAction: "Turları Keşfet",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    id: 3,
    title: "Müşteri Memnuniyeti",
    value: 98,
    suffix: "%",
    description: "Yüksek memnuniyet oranı",
    callToAction: "Değerlendirmeleri Gör",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
      </svg>
    )
  },
  {
    id: 4,
    title: "Ortalama Tasarruf",
    value: 25,
    suffix: "%",
    description: "Müşterilerimizin sağladığı ortalama tasarruf",
    callToAction: "İndirimli Turlar",
    highlight: true,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
];

export default function Stats() {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValues, setAnimatedValues] = useState<number[]>(stats.map(() => 0));
  const statsRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  // Görünürlük kontrolü
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (!hasAnimated.current) {
            animateNumbers();
            hasAnimated.current = true;
          }
        }
      },
      { threshold: 0.1 }
    );
    
    if (statsRef.current) {
      observer.observe(statsRef.current);
    }
    
    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  // Sayıları animasyonlu şekilde artır
  const animateNumbers = () => {
    const duration = 2000; // ms cinsinden animasyon süresi
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    
    let frame = 0;
    const countUpInterval = setInterval(() => {
      frame++;
      
      const progress = frame / totalFrames;
      const easedProgress = easeOutQuart(progress);
      
      const newValues = stats.map((stat) => {
        return Math.floor(easedProgress * stat.value);
      });
      
      setAnimatedValues(newValues);
      
      if (frame === totalFrames) {
        clearInterval(countUpInterval);
        setAnimatedValues(stats.map((stat) => stat.value));
      }
    }, frameDuration);
  };

  // Easing fonksiyonu - daha doğal bir animasyon için
  const easeOutQuart = (x: number): number => {
    return 1 - Math.pow(1 - x, 4);
  };

  return (
    <section 
      ref={statsRef}
      className="py-24 bg-gradient-to-b from-white to-blue-50 relative overflow-hidden"
    >
      {/* Dekoratif arka plan öğeleri */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-900 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-blue-900 to-transparent"></div>
        </div>
        <div className="absolute -top-20 -right-20 w-80 h-80 opacity-5">
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" stroke="#1E40AF" strokeWidth="2" />
            <circle cx="50" cy="50" r="30" stroke="#1E40AF" strokeWidth="2" />
            <circle cx="50" cy="50" r="20" stroke="#1E40AF" strokeWidth="2" />
          </svg>
        </div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 opacity-5">
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="10" width="80" height="80" stroke="#1E40AF" strokeWidth="2" />
            <rect x="25" y="25" width="50" height="50" stroke="#1E40AF" strokeWidth="2" />
            <rect x="40" y="40" width="20" height="20" stroke="#1E40AF" strokeWidth="2" />
          </svg>
        </div>
      </div>

      <div className="container px-4 mx-auto relative z-10">
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-block mb-4">
            <div className="h-1 w-24 bg-blue-600 mb-1"></div>
            <div className="h-1 w-12 bg-blue-600"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Neden TourTech ile Seyahat Etmelisiniz?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Binlerce memnun müşteri, yüzlerce başarılı tur ve otel rezervasyonu. Sizin için en iyi fırsatları sunuyoruz!
          </p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {stats.map((stat, idx) => (
            <div 
              key={stat.id}
              className={`bg-white rounded-lg shadow-md border transition-all duration-500 transform hover:shadow-lg hover:-translate-y-1 relative overflow-hidden ${stat.highlight ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200 hover:border-blue-200'}`}
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              <div className="h-2 bg-blue-600 w-full absolute top-0 left-0"></div>
              {stat.highlight && (
                <div className="absolute -right-12 -top-3 bg-blue-600 text-white text-xs px-12 py-1 transform rotate-45 shadow-sm">
                  En Çok Tercih Edilen
                </div>
              )}
              
              <div className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-lg font-medium text-blue-600 mb-2">{stat.title}</h3>
                <div className="flex items-center justify-center">
                  <span className="text-4xl md:text-5xl font-bold text-gray-900">
                    {animatedValues[idx].toLocaleString()}
                  </span>
                  <span className="text-4xl md:text-5xl font-bold text-blue-600 ml-1">
                    {stat.suffix}
                  </span>
                </div>
                <p className="text-gray-600 mt-3 mb-4">{stat.description}</p>
                
                {stat.callToAction && (
                  <Link 
                    href="#" 
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {stat.callToAction}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className={`mt-16 text-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Link 
            href="/tours" 
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-all duration-300 font-medium"
          >
            <span>Hemen Rezervasyon Yap</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
} 