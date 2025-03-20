"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  StarIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
  CheckIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  GlobeAltIcon
} from "@heroicons/react/24/outline";
import { 
  StarIcon as StarIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid
} from "@heroicons/react/24/solid";

// Zenginleştirilmiş müşteri yorumları
const testimonials = [
  {
    id: 1,
    name: "Ayşe Kaya",
    role: "Tur Operatörü",
    company: "Kapadokya Gezileri",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    content: "Tur operasyonlarımızı TourTech üzerinden yönetmeye başladıktan sonra müşteri memnuniyetimiz %95'e yükseldi ve satışlarımız iki katına çıktı!",
    rating: 5,
    bgColor: "bg-pink-50",
    iconColor: "text-pink-600",
    icon: <GlobeAltIcon className="w-6 h-6" />,
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
    id: 2,
    name: "Mehmet Demir",
    role: "Seyahat Acentesi Sahibi",
    company: "Mavi Tur Seyahat",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    content: "TourTech'in analitik araçlarıyla hangi turların daha çok ilgi gördüğünü belirleyip stratejimizi değiştirdik. Böylece dönüşüm oranımızı %35 artırdık!",
    rating: 4,
    bgColor: "bg-indigo-50",
    iconColor: "text-indigo-600",
    icon: <ArrowTrendingUpIcon className="w-6 h-6" />,
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
    id: 3,
    name: "Zeynep Şahin",
    role: "Deneyim Sağlayıcı",
    company: "İstanbul Lezzet Turları",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    content: "Yerel deneyimlerimizi TourTech üzerinden sunmak bize yeni bir müşteri kitlesi kazandırdı. Yeni rezervasyonlarımız %75 arttı ve operasyon maliyetlerimiz düştü!",
    rating: 5,
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
    icon: <UserGroupIcon className="w-6 h-6" />,
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
    id: 4,
    name: "Can Özkan",
    role: "Otel Müdürü",
    company: "Bodrum Paradise Resort",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    content: "Otelimizin dijital dönüşümünde TourTech vazgeçilmez bir ortak oldu. Online satışlarımız %60 artarken, komisyon maliyetlerimiz %25 azaldı!",
    rating: 5,
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
    icon: <CurrencyDollarIcon className="w-6 h-6" />,
    stats: {
      increase: "60%",
      metric: "Online Satış"
    },
    productLink: {
      text: "Dijital Dönüşüm",
      url: "/cozumler/dijital-donusum"
    }
  },
  {
    id: 5,
    name: "Ahmet Yılmaz",
    role: "Otel Sahibi",
    company: "Grand Hotel İstanbul",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    content: "TourTech sayesinde otelimizin doluluk oranı %40 arttı. Rezervasyon yönetimi artık çok daha kolay ve son 3 ayda gelirlerimiz %30 yükseldi!",
    rating: 5,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    icon: <BuildingOfficeIcon className="w-6 h-6" />,
    stats: {
      increase: "40%",
      metric: "Doluluk Oranı"
    },
    productLink: {
      text: "Otel Yönetim Çözümü",
      url: "/cozumler/otel-yonetimi"
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
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Client-side'da olduğunu kontrol et
  useEffect(() => {
    setIsClient(true);
    setIsMobile(window.innerWidth < 640);
  }, []);

  // Tek bir kaydırma kontrol mekanizması
  const checkScrollPosition = useCallback(() => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 10);
      
      // Son kartın tam görünüp görünmediğini kontrol et
      const maxScroll = scrollWidth - clientWidth - 5;
      setCanScrollRight(scrollLeft < maxScroll);
    }
  }, []);

  // Kartların genişliğini hesapla
  const calculateCardWidth = useCallback(() => {
    if (sliderRef.current && typeof window !== 'undefined') {
      const containerWidth = sliderRef.current.clientWidth;
      let newCardWidth;
      
      // Ekran genişliğine göre kart genişliğini hesapla
      if (window.innerWidth < 640) { // Mobil
        newCardWidth = containerWidth - 32; // Padding ve margin hesaba katılıyor
        setVisibleTestimonials(1);
      } else if (window.innerWidth < 1024) { // Tablet
        newCardWidth = (containerWidth - 48) / 2; // 2 kart göster, boşluklarla
        setVisibleTestimonials(2);
      } else { // Desktop
        newCardWidth = (containerWidth - 64) / 3; // 3 kart göster, boşluklarla
        setVisibleTestimonials(3);
      }
      
      setCardWidth(newCardWidth);
    }
  }, []);

  // Ekran boyutuna göre görünür yorum sayısını ayarla
  useEffect(() => {
    const handleResize = () => {
      calculateCardWidth();
      setIsMobile(window.innerWidth < 640);
      
      // Boyut değiştiğinde scroll durumunu kontrol et
      setTimeout(checkScrollPosition, 100);
    };

    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [checkScrollPosition, calculateCardWidth]);

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
        // Auto için sadece bir sonraki slide'a git
        navigateToSlide('next');
      }, 5000);
    }
    
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [autoplay, activeIndex]);

  // Scroll butonları için
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.addEventListener('scroll', checkScrollPosition);
      
      // İlk yüklemede scroll pozisyonunu kontrol et
      setTimeout(checkScrollPosition, 500);
    }
    
    return () => {
      if (sliderRef.current) {
        sliderRef.current.removeEventListener('scroll', checkScrollPosition);
      }
    };
  }, [checkScrollPosition]);

  // Yıldız oluşturma fonksiyonu - Heroicons ile
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => {
      if (index < Math.floor(rating)) {
        return <StarIconSolid key={index} className="w-5 h-5 text-yellow-400" />;
      } else if (index === Math.floor(rating) && rating % 1 !== 0) {
        return (
          <div key={index} className="relative">
            <StarIcon className="w-5 h-5 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${(rating % 1) * 100}%` }}>
              <StarIconSolid className="w-5 h-5 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        return <StarIcon key={index} className="w-5 h-5 text-gray-300" />;
      }
    });
  };

  // Hover durumunda otomatik kaydırmayı durdur
  const pauseAutoplay = () => {
    setAutoplay(false);
  };

  // Hover dışında otomatik kaydırmayı devam ettir
  const resumeAutoplay = () => {
    setAutoplay(true);
  };

  // TÜM NAVİGASYON FONKSİYONLARINI BİRLEŞTİREN TEK FONKSİYON
  const navigateToSlide = useCallback((target: 'prev' | 'next' | number) => {
    if (isAnimating || !sliderRef.current) return;
    
    setIsAnimating(true);
    
    let newIndex: number;
    let scrollAmount: number = 0;
    const spaceBetweenCards = 24; // Kartlar arası mesafe
    const totalItems = testimonials.length;
    
    if (target === 'next') {
      newIndex = (activeIndex + 1) % totalItems;
      
      // Sonraki karta kaydırma miktarını hesapla
      scrollAmount = cardWidth + spaceBetweenCards;
      
      // Son kartın kesilmemesi için kontrol
      if (newIndex === totalItems - 1) {
        scrollAmount = Math.min(
          scrollAmount, 
          sliderRef.current.scrollWidth - sliderRef.current.clientWidth - sliderRef.current.scrollLeft
        );
      }
      
      // Kaydır
      sliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    } 
    else if (target === 'prev') {
      newIndex = (activeIndex - 1 + totalItems) % totalItems;
      
      // Önceki karta kaydırma miktarını hesapla
      scrollAmount = -(cardWidth + spaceBetweenCards);
      
      // İlk kartın kesilmemesi için kontrol
      if (newIndex === 0) {
        scrollAmount = -sliderRef.current.scrollLeft;
      }
      
      // Kaydır
      sliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    } 
    else if (typeof target === 'number') {
      newIndex = target;
      
      // Doğrudan belirli indekse git
      const targetPosition = target * (cardWidth + spaceBetweenCards);
      
      sliderRef.current.scrollTo({
        left: targetPosition,
        behavior: 'smooth'
      });
    }
    else {
      // Geçersiz hedef - animasyonu kapat ve çık
      setIsAnimating(false);
      return;
    }
    
    // Buton animasyonu (sadece prev/next için)
    if (target === 'prev' || target === 'next') {
      const buttonClass = target === 'prev' ? 'nav-prev-btn' : 'nav-next-btn';
      const button = document.querySelector(`.${buttonClass}`);
      if (button) {
        button.classList.add('animate-pulse');
        setTimeout(() => button.classList.remove('animate-pulse'), 500);
      }
    }
    
    // Active index'i güncelle
    setActiveIndex(newIndex);
    
    // Scroll işlemi bittikten sonra butonların durumunu kontrol et
    setTimeout(() => {
      checkScrollPosition();
      setIsAnimating(false);
    }, 500);
  }, [isAnimating, activeIndex, cardWidth, checkScrollPosition]);

  // Görünür yorumları al
  const getVisibleTestimonials = () => {
    return testimonials.map((testimonial, index) => ({
      ...testimonial,
      index
    }));
  };

  return (
    <section 
      ref={testimonialsRef}
      className="py-24 bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden"
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
    >
      {/* Dekoratif arka plan öğeleri */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 blur-3xl"></div>
          <div className="absolute top-40 right-40 w-64 h-64 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 blur-3xl"></div>
          <div className="absolute bottom-20 left-1/4 w-72 h-72 rounded-full bg-gradient-to-br from-green-500 to-blue-500 blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-blue-500 to-indigo-700 blur-3xl"></div>
        </div>
      </div>

      <div className="container px-4 mx-auto relative z-10">
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-block mb-4 text-blue-600">
            <ChatBubbleLeftRightIconSolid className="w-12 h-12 mb-2 mx-auto" />
            <div className="h-1 w-24 bg-blue-600 mb-1 mx-auto"></div>
            <div className="h-1 w-12 bg-blue-600 mx-auto"></div>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-800 to-blue-600">
            Başarı Hikayeleri
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            İşletmelerinin performansını TourTech ile artıran müşterilerimizin deneyimlerini keşfedin
          </p>
        </div>
        
        {/* Büyük başarı hikayeleri kartı */}
        <div className={`mb-20 bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100 transition-all duration-1000 delay-100 transform hover:shadow-2xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex flex-col lg:flex-row">
            <div className="p-8 lg:p-10 lg:w-2/3">
              <div className="mb-6">
                <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-800 font-medium text-sm rounded-full mb-4">
                  Öne Çıkan Başarı Hikayesi
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">%120 Rezervasyon Artışı ile TourTech Başarısı</h3>
                <div className="flex mb-5">
                  <div className="flex mr-2 text-yellow-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIconSolid key={star} className="w-5 h-5" />
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm ml-2">
                    498 değerlendirme
                  </span>
                </div>
                
                {/* Alıntı işareti ve içerik */}
                <div className="relative mb-6">
                  <span className="text-blue-100 text-6xl font-serif absolute -top-4 -left-1">"</span>
                  <p className="relative text-lg leading-relaxed text-gray-700 pl-6">
                    "TourTech platformuna geçtikten sonra rezervasyon hacmimiz 3 ay içinde %120 arttı. Sistem, hem müşterilerimizin rezervasyon sürecini kolaylaştırdı hem de operasyonel maliyetlerimizi %30 azalttı. Artık tüm süreçlerimizi tek bir platformdan yönetiyoruz."
                  </p>
                </div>
                
                <div className="flex items-center">
                  <div className="relative h-14 w-14 rounded-full overflow-hidden mr-4 border-2 border-blue-100">
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
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200 shadow-sm">
                  <p className="font-bold text-3xl text-blue-600 mb-2">%120</p>
                  <div className="flex items-center text-blue-800">
                    <ArrowTrendingUpIcon className="w-4 h-4 mr-1.5" />
                    <p className="text-sm font-medium">Rezervasyon Artışı</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200 shadow-sm">
                  <p className="font-bold text-3xl text-green-600 mb-2">%30</p>
                  <div className="flex items-center text-green-800">
                    <ArrowTrendingUpIcon className="w-4 h-4 mr-1.5" />
                    <p className="text-sm font-medium">Maliyet Azalması</p>
                  </div>
                </div>
              </div>
              
              <Link
                href="/basari-hikayeleri/antalya-resort"
                className="inline-flex items-center font-medium text-blue-600 hover:text-blue-700 transition-colors group"
              >
                Tüm Başarı Hikayesini Oku
                <ArrowRightIcon className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="lg:w-1/3 bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col items-center justify-center p-8 lg:p-10 text-white">
              <h3 className="text-xl font-bold mb-8 text-center">Sonuçları Siz de Elde Edin</h3>
              <ul className="space-y-5 mb-10 w-full">
                <li className="flex items-center">
                  <div className="bg-blue-500/20 rounded-full p-1.5 mr-3">
                    <CheckIcon className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-medium">Rezervasyon hacmini arttırın</span>
                </li>
                <li className="flex items-center">
                  <div className="bg-blue-500/20 rounded-full p-1.5 mr-3">
                    <CheckIcon className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-medium">Operasyonel maliyetleri düşürün</span>
                </li>
                <li className="flex items-center">
                  <div className="bg-blue-500/20 rounded-full p-1.5 mr-3">
                    <CheckIcon className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-medium">Müşteri memnuniyetini artırın</span>
                </li>
              </ul>
              <Link
                href="/demo-talebi"
                className="w-full bg-white text-blue-600 hover:bg-blue-50 py-3.5 px-6 rounded-lg font-medium text-center transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
              >
                Ücretsiz Demo Talep Et
              </Link>
            </div>
          </div>
        </div>

        {/* Müşteri Değerlendirmeleri - Başlık ve Navigasyon */}
        <div className={`flex justify-between items-center mb-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900">Müşteri Değerlendirmeleri</h3>
          <div className="flex space-x-3">
            <button
              onClick={() => navigateToSlide('prev')}
              disabled={!canScrollLeft}
              className={`nav-prev-btn p-2.5 rounded-full border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                !canScrollLeft 
                  ? 'opacity-40 cursor-not-allowed text-gray-300 border-gray-200' 
                  : 'opacity-90 text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-400'
              }`}
              aria-label="Önceki"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigateToSlide('next')}
              disabled={!canScrollRight}
              className={`nav-next-btn p-2.5 rounded-full border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                !canScrollRight 
                  ? 'opacity-40 cursor-not-allowed text-gray-300 border-gray-200' 
                  : 'opacity-90 text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-400'
              }`}
              aria-label="Sonraki"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Değerlendirme kartları */}
        <div className="relative mb-8">
          {/* Testimonial Slider Container */}
          <div 
            ref={sliderRef}
            className={`flex space-x-6 overflow-x-auto scrollbar-none pb-8 px-[1px] -mx-[1px] transition-opacity duration-300 ${
              isAnimating ? 'opacity-70' : 'opacity-100'
            }`}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {getVisibleTestimonials().map((testimonial: any) => (
              <div 
                key={testimonial.id}
                className={`flex-none sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden transition-all duration-500 transform hover:shadow-lg hover:-translate-y-1 cursor-pointer ${
                  testimonial.index === activeIndex ? 'scale-[1.02] shadow-lg border-blue-200' : ''
                }`}
                style={{ 
                  transitionDelay: `${testimonial.index * 100}ms`,
                  minWidth: isClient ? (isMobile ? 'calc(100% - 24px)' : 'auto') : 'auto'
                }}
              >
                <div className={`p-6 ${testimonial.index === activeIndex ? 'border-t-4 border-t-blue-500' : ''}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex">
                      {renderStars(testimonial.rating)}
                    </div>
                    <div className={`${testimonial.iconColor} ${testimonial.bgColor} w-10 h-10 rounded-full flex items-center justify-center`}>
                      {testimonial.icon}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    {/* Alıntı işareti ve içerik */}
                    <div className="relative">
                      <span className="text-gray-100 text-4xl font-serif absolute -top-2 -left-1">"</span>
                      <p className="text-gray-700 mb-5 leading-relaxed pl-5">{testimonial.content}</p>
                    </div>
                    
                    {/* Başarı İstatistiği */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 mb-5 flex items-center border border-green-200">
                      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg h-10 w-10 flex items-center justify-center text-white mr-3 shadow-sm">
                        <ArrowTrendingUpIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-green-800 font-bold text-lg">{testimonial.stats.increase}</p>
                        <p className="text-green-700 text-sm">{testimonial.stats.metric}</p>
                      </div>
                    </div>
                    
                    <Link
                      href={testimonial.productLink.url}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center group"
                    >
                      {testimonial.productLink.text}
                      <ArrowRightIcon className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                  
                  <div className="flex items-center pt-4 border-t border-gray-100">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4 border-2 border-blue-100">
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
          

        </div>



        {/* CTA Butonu */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Link 
            href="/basari-hikayeleri" 
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium transform hover:-translate-y-1"
          >
            <span>Tüm Başarı Hikayelerini Keşfedin</span>
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
} 