"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// Zenginleştirilmiş müşteri yorumları
const testimonials = [
  {
    id: 1,
    name: "Ahmet Yılmaz",
    role: "Otel Sahibi",
    company: "Grand Hotel İstanbul",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    content: "TourTech sayesinde otelimizin doluluk oranı %40 arttı. Rezervasyon yönetimi artık çok daha kolay ve son 3 ayda gelirlerimiz %30 yükseldi!",
    rating: 5,
    bgColor: "bg-gray-50",
    iconColor: "text-blue-600",
    stats: {
      increase: "40%",
      metric: "Doluluk Oranı"
    },
    productLink: {
      text: "Otel Yönetim Çözümü",
      url: "/cozumler/otel-yonetimi"
    }
  },
  {
    id: 2,
    name: "Ayşe Kaya",
    role: "Tur Operatörü",
    company: "Kapadokya Gezileri",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    content: "Tur operasyonlarımızı TourTech üzerinden yönetmeye başladıktan sonra müşteri memnuniyetimiz %95'e yükseldi ve satışlarımız iki katına çıktı!",
    rating: 5,
    bgColor: "bg-gray-50",
    iconColor: "text-blue-600",
    stats: {
      increase: "100%",
      metric: "Satış Artışı"
    },
    productLink: {
      text: "Tur Yönetim Çözümü",
      url: "/cozumler/tur-yonetimi"
    }
  },
  {
    id: 3,
    name: "Mehmet Demir",
    role: "Seyahat Acentesi Sahibi",
    company: "Mavi Tur Seyahat",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    content: "TourTech'in analitik araçlarıyla hangi turların daha çok ilgi gördüğünü belirleyip stratejimizi değiştirdik. Böylece dönüşüm oranımızı %35 artırdık!",
    rating: 4,
    bgColor: "bg-gray-50",
    iconColor: "text-blue-600",
    stats: {
      increase: "35%",
      metric: "Dönüşüm Oranı"
    },
    productLink: {
      text: "Analitik Çözümleri",
      url: "/cozumler/analitik"
    }
  },
  {
    id: 4,
    name: "Zeynep Şahin",
    role: "Deneyim Sağlayıcı",
    company: "İstanbul Lezzet Turları",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    content: "Yerel deneyimlerimizi TourTech üzerinden sunmak bize yeni bir müşteri kitlesi kazandırdı. Yeni rezervasyonlarımız %75 arttı ve operasyon maliyetlerimiz düştü!",
    rating: 5,
    bgColor: "bg-gray-50",
    iconColor: "text-blue-600",
    stats: {
      increase: "75%",
      metric: "Yeni Rezervasyon"
    },
    productLink: {
      text: "Deneyim Pazarlama",
      url: "/cozumler/deneyim-pazarlama"
    }
  },
  {
    id: 5,
    name: "Can Özkan",
    role: "Otel Müdürü",
    company: "Bodrum Paradise Resort",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    content: "Otelimizin dijital dönüşümünde TourTech vazgeçilmez bir ortak oldu. Online satışlarımız %60 artarken, komisyon maliyetlerimiz %25 azaldı!",
    rating: 5,
    bgColor: "bg-gray-50",
    iconColor: "text-blue-600",
    stats: {
      increase: "60%",
      metric: "Online Satış"
    },
    productLink: {
      text: "Dijital Dönüşüm",
      url: "/cozumler/dijital-donusum"
    }
  }
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [visibleTestimonials, setVisibleTestimonials] = useState(3);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Ekran boyutuna göre görünür yorum sayısını ayarla
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleTestimonials(1);
      } else if (window.innerWidth < 1024) {
        setVisibleTestimonials(2);
      } else {
        setVisibleTestimonials(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Görünürlük kontrolü
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    if (testimonialsRef.current) {
      observer.observe(testimonialsRef.current);
    }
    
    return () => {
      if (testimonialsRef.current) {
        observer.unobserve(testimonialsRef.current);
      }
    };
  }, []);

  // Otomatik kaydırma
  useEffect(() => {
    if (autoplay) {
      autoplayRef.current = setInterval(() => {
        goToNext();
      }, 5000);
    }
    
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [autoplay, activeIndex]);

  // Yıldız oluşturma fonksiyonu
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <svg 
        key={index} 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill={index < Math.floor(rating) ? "currentColor" : "none"}
        stroke={index < Math.floor(rating) ? "none" : "currentColor"}
        className={`w-4 h-4 ${index < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}`}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
      </svg>
    ));
  };

  // Hover durumunda otomatik kaydırmayı durdur
  const pauseAutoplay = () => {
    setAutoplay(false);
  };

  // Hover dışında otomatik kaydırmayı devam ettir
  const resumeAutoplay = () => {
    setAutoplay(true);
  };

  // Bir sonraki yoruma git
  const goToNext = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  // Bir önceki yoruma git
  const goToPrev = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  // Belirli bir yoruma git
  const goToIndex = (index: number) => {
    if (isAnimating || index === activeIndex) return;
    
    setIsAnimating(true);
    setActiveIndex(index);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  // Görünür yorumları al
  const getVisibleTestimonials = () => {
    const result = [];
    for (let i = 0; i < visibleTestimonials; i++) {
      const index = (activeIndex + i) % testimonials.length;
      result.push({
        ...testimonials[index],
        index
      });
    }
    return result;
  };

  return (
    <section 
      ref={testimonialsRef}
      className="py-24 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden"
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
    >
      {/* Dekoratif arka plan öğeleri */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-600 rounded-full"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-blue-600 rounded-full"></div>
          <div className="absolute bottom-10 left-1/4 w-24 h-24 bg-blue-600 rounded-full"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600 rounded-full"></div>
        </div>
      </div>

      <div className="container px-4 mx-auto relative z-10">
        <div className={`text-center max-w-3xl mx-auto mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-block mb-4">
            <div className="h-1 w-24 bg-blue-600 mb-1"></div>
            <div className="h-1 w-12 bg-blue-600"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Başarı Hikayeleri
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            İşletmelerinin performansını TourTech ile artıran müşterilerimizin deneyimlerini keşfedin
          </p>
        </div>
        
        {/* Büyük başarı hikayeleri kartı */}
        <div className={`mb-16 bg-white rounded-xl shadow-xl overflow-hidden border border-blue-100 transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex flex-col lg:flex-row">
            <div className="p-8 lg:p-10 lg:w-2/3">
              <div className="mb-6">
                <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 font-medium text-sm rounded-full mb-3">
                  Öne Çıkan Başarı Hikayesi
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">%120 Rezervasyon Artışı ile TourTech Başarısı</h3>
                <div className="flex mb-5">
                  <div className="flex mr-2 text-yellow-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-500">498 değerlendirme</span>
                </div>
                <p className="text-lg leading-relaxed text-gray-700 mb-6">
                  "TourTech platformuna geçtikten sonra rezervasyon hacmimiz 3 ay içinde %120 arttı. Sistem, hem müşterilerimizin rezervasyon sürecini kolaylaştırdı hem de operasyonel maliyetlerimizi %30 azalttı. Artık tüm süreçlerimizi tek bir platformdan yönetiyoruz."
                </p>
                <div className="flex items-center">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src="https://randomuser.me/api/portraits/women/65.jpg"
                      alt="Leyla Yıldız"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Leyla Yıldız</h4>
                    <p className="text-sm text-gray-600">Satış Direktörü, Antalya Resort Collection</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="font-bold text-3xl text-blue-600 mb-1">%120</p>
                  <p className="text-gray-700 text-sm">Rezervasyon Artışı</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="font-bold text-3xl text-green-600 mb-1">%30</p>
                  <p className="text-gray-700 text-sm">Maliyet Azalması</p>
                </div>
              </div>
              
              <Link
                href="/basari-hikayeleri/antalya-resort"
                className="inline-flex items-center font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Tüm Başarı Hikayesini Oku
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="lg:w-1/3 bg-blue-600 flex flex-col items-center justify-center p-8 lg:p-10 text-white">
              <h3 className="text-xl font-bold mb-6 text-center">Sonuçları Siz de Elde Edin</h3>
              <ul className="space-y-4 mb-8 w-full">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Rezervasyon hacmini arttırın</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Operasyonel maliyetleri düşürün</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Müşteri memnuniyetini artırın</span>
                </li>
              </ul>
              <Link
                href="/demo-talebi"
                className="w-full bg-white text-blue-600 hover:bg-blue-50 py-3 px-6 rounded-md font-medium text-center transition-colors"
              >
                Ücretsiz Demo Talep Et
              </Link>
            </div>
          </div>
        </div>

        {/* Kontrol butonları */}
        <div className={`flex justify-between items-center mb-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900">Müşteri Değerlendirmeleri</h3>
          <div className="flex space-x-2">
            <button
              onClick={goToPrev}
              className="p-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Önceki"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="p-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Sonraki"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>

        {/* Değerlendirme kartları */}
        <div 
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          {getVisibleTestimonials().map((testimonial: any) => (
            <div 
              key={testimonial.id}
              className={`bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden transition-all duration-500 transform hover:shadow-lg hover:-translate-y-1 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}
              style={{ transitionDelay: `${testimonial.index * 100}ms` }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex">
                    {renderStars(testimonial.rating)}
                  </div>
                  <div className={`${testimonial.iconColor} bg-blue-50 w-10 h-10 rounded-full flex items-center justify-center`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                    </svg>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-gray-700 mb-4">{testimonial.content}</p>
                  
                  {/* Başarı İstatistiği */}
                  <div className="bg-green-50 border border-green-100 rounded-lg p-3 mb-4 flex items-center">
                    <div className="bg-green-500 rounded-lg h-10 w-10 flex items-center justify-center text-white mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-green-800 font-bold text-lg">{testimonial.stats.increase}</p>
                      <p className="text-green-700 text-sm">{testimonial.stats.metric}</p>
                    </div>
                  </div>
                  
                  <Link
                    href={testimonial.productLink.url}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                  >
                    {testimonial.productLink.text}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
                
                <div className="flex items-center">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Göstergeler */}
        <div className={`flex justify-center mt-8 space-x-2 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex ? "w-8 bg-blue-600" : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Değerlendirme ${index + 1}`}
            />
          ))}
        </div>

        {/* CTA Butonu */}
        <div className={`text-center mt-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Link 
            href="/basari-hikayeleri" 
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-md shadow-md transition-all duration-300 font-medium"
          >
            <span>Tüm Başarı Hikayelerini Keşfedin</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
} 