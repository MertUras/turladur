"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// İstatistik verileri - satış odaklı metriklerle zenginleştirildi
const stats = [
  {
    id: 1,
    title: "Aktif Kullanıcı",
    value: 2500,
    suffix: "+",
    description: "Turizm ekosisteminde aktif kullanıcı",
    color: "blue",
    bgImage: "https://images.unsplash.com/photo-1580094333632-438bdc04f79f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    color: "green",
    bgImage: "https://images.unsplash.com/photo-1528702748617-c64d49f918af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    color: "orange",
    bgImage: "https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    color: "red",
    bgImage: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
];

const getColorClass = (color: string, element: 'bg' | 'text' | 'border' = 'bg', intensity: string = '600') => {
  const prefix = element === 'bg' ? 'bg' : element === 'text' ? 'text' : 'border';
  return `${prefix}-${color}-${intensity}`;
};

export default function Stats() {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValues, setAnimatedValues] = useState<number[]>(stats.map(() => 0));
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
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
      className="py-24 relative overflow-hidden bg-gradient-to-b from-gray-50 to-white"
    >
      {/* Dekoratif arka plan öğeleri */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-500 mix-blend-multiply filter blur-3xl opacity-70"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-green-500 mix-blend-multiply filter blur-3xl opacity-70"></div>
          <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-orange-500 mix-blend-multiply filter blur-3xl opacity-70"></div>
        </div>
      </div>

      <div className="container px-4 mx-auto relative z-10">
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-4">
            SAYILARLA TURLADUR
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-orange-500">
            Neden TurlaDur ile Seyahat Etmelisiniz?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Binlerce memnun müşteri, yüzlerce başarılı tur ve otel rezervasyonu.
            <br className="hidden md:inline" />
            Sizin için en iyi fırsatları sunuyoruz!
          </p>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {stats.map((stat, idx) => (
            <div 
              key={stat.id}
              className={`rounded-2xl shadow-lg transition-all duration-500 transform group relative overflow-hidden cursor-pointer ${
                isVisible ? `opacity-100 translate-y-0` : `opacity-0 translate-y-10`
              }`}
              style={{ 
                transitionDelay: `${idx * 150 + 300}ms`
              }}
              onMouseEnter={() => setHoveredCard(stat.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Arkaplan Görsel */}
              <div className="absolute inset-0 w-full h-full">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40 z-10"></div>
                <Image 
                  src={stat.bgImage} 
                  alt={stat.title}
                  fill
                  className={`object-cover transition-transform duration-700 ${hoveredCard === stat.id ? 'scale-110' : 'scale-100'}`}
                />
              </div>
              
              {/* İçerik */}
              <div className="p-8 relative z-20 text-white h-full flex flex-col">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${getColorClass(stat.color)} bg-opacity-90 backdrop-blur-sm`}>
                  <div className={`text-white`}>
                    {stat.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-2">{stat.title}</h3>
                
                <div className="flex items-baseline mb-2">
                  <span className="text-5xl sm:text-6xl font-bold">
                    {animatedValues[idx].toLocaleString()}
                  </span>
                  <span className={`text-4xl font-bold ${getColorClass(stat.color, 'text')} ml-1`}>
                    {stat.suffix}
                  </span>
                </div>
                
                <p className="text-gray-200 flex-grow">{stat.description}</p>
                
                {stat.callToAction && (
                  <Link 
                    href="#" 
                    className={`mt-4 inline-flex items-center text-sm font-medium ${getColorClass(stat.color, 'text')} hover:text-white transition-colors`}
                  >
                    {stat.callToAction}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform duration-300 transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
                
                {/* Yüksek vurgu için rozet */}
                {stat.highlight && (
                  <div className={`absolute -right-10 top-7 ${getColorClass(stat.color)} text-white text-xs font-bold px-10 py-1 transform rotate-45 shadow-lg`}>
                    En Çok Tercih Edilen
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* İstatistik Açıklaması */}
        <div className={`mt-20 bg-white rounded-xl shadow-xl p-8 md:p-10 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-1 md:col-span-1">
              <div className="w-14 h-1 bg-blue-600 mb-4"></div>
              <h3 className="text-2xl font-bold mb-4 text-blue-600">Rakamlarla Büyüyen Başarımız</h3>
              <p className="text-gray-600">2023 yılında kullanıcı sayımız %75, rezervasyon sayımız %120 arttı. Hedefimiz 2024'te daha da büyümek.</p>
              
              <Link 
                href="/about" 
                className="mt-6 inline-flex items-center px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-all duration-300 font-medium shadow-md hover:shadow-lg"
              >
                <span>Hakkımızda</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-2 transition-transform duration-300 transform group-hover:translate-x-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1 text-blue-600">Sürekli Büyüme</h4>
                      <p className="text-gray-600">Son 5 yıldır kesintisiz büyüme trendimizi sürdürüyoruz.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-6">
                  <div className="flex items-start">
                    <div className="bg-orange-100 p-3 rounded-lg mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1 text-orange-600">Fiyat Avantajı</h4>
                      <p className="text-gray-600">Özel anlaşmalarımız sayesinde en iyi fiyatları sunuyoruz.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-start">
                    <div className="bg-green-100 p-3 rounded-lg mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1 text-green-600">Güvenilirlik</h4>
                      <p className="text-gray-600">Tüm rezervasyonlar garanti altına alınır ve sigortalanır.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-red-50 rounded-lg p-6">
                  <div className="flex items-start">
                    <div className="bg-red-100 p-3 rounded-lg mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1 text-red-600">7/24 Destek</h4>
                      <p className="text-gray-600">Seyahatinizin her anında yanınızdayız.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`mt-16 text-center transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Link 
            href="/tours" 
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            <span>Hemen Rezervasyon Yap</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
} 