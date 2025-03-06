"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "../utils/cn";
import { 
  StarIcon, 
  HeartIcon, 
  MapPinIcon, 
  WifiIcon, 
  SparklesIcon,
  PlusIcon,
  MinusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  ComputerDesktopIcon,
  BeakerIcon,
  HomeIcon,
  BuildingOfficeIcon,
  SunIcon,
  CloudIcon,
  FireIcon as FireIconOutline,
  TagIcon,
  GlobeEuropeAfricaIcon
} from "@heroicons/react/24/outline";
import { 
  StarIcon as StarIconSolid,
  HeartIcon as HeartIconSolid,
  FireIcon
} from "@heroicons/react/24/solid";

// Zenginleştirilmiş otel verileri
const hotels = [
  {
    id: 1,
    name: "Grand Hotel İstanbul",
    location: "İstanbul, Türkiye",
    rating: 4.8,
    reviewCount: 324,
    price: 1250,
    oldPrice: 1650,
    discount: 25,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    features: ["Spa", "Havuz", "Restoran", "Ücretsiz Wi-Fi"],
    isBestSeller: true,
    campaign: "Erken Rezervasyon"
  },
  {
    id: 2,
    name: "Kapadokya Suites",
    location: "Nevşehir, Türkiye",
    rating: 4.9,
    reviewCount: 186,
    price: 1800,
    oldPrice: 2200,
    discount: 18,
    image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    features: ["Manzara", "Özel Teras", "Kahvaltı", "Ücretsiz Wi-Fi"],
    promotion: "2 Gece Kal 1 Gece Bedava",
    limitedOffer: true
  },
  {
    id: 3,
    name: "Bodrum Paradise Resort",
    location: "Muğla, Türkiye",
    rating: 4.7,
    reviewCount: 452,
    price: 2200,
    oldPrice: 2750,
    discount: 20,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2025&q=80",
    features: ["Deniz Manzarası", "Özel Plaj", "Spa", "Havuz"],
    isBestSeller: true,
    campaign: "Yaz Fırsatı"
  },
  {
    id: 4,
    name: "Antalya Luxury Hotel",
    location: "Antalya, Türkiye",
    rating: 4.6,
    reviewCount: 278,
    price: 1650,
    oldPrice: 1950,
    discount: 15,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    features: ["Her Şey Dahil", "Aquapark", "Çocuk Kulübü", "Spor Salonu"],
    promotion: "Çocuklar Ücretsiz"
  },
  {
    id: 5,
    name: "Sapanca Lake Resort",
    location: "Sakarya, Türkiye",
    rating: 4.5,
    reviewCount: 156,
    price: 1450,
    oldPrice: 1800,
    discount: 20,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    features: ["Göl Manzarası", "Spa", "Restoran", "Ücretsiz Otopark"],
    limitedOffer: true
  },
  {
    id: 6,
    name: "Çeşme Marina Hotel",
    location: "İzmir, Türkiye",
    rating: 4.7,
    reviewCount: 203,
    price: 1750,
    oldPrice: 1950,
    discount: 10,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
    features: ["Marina Manzarası", "Havuz", "Bar", "Ücretsiz Wi-Fi"],
    promotion: "Tekne Turu Hediye"
  }
];

// Geliştirilmiş filtre kategorileri
const filterCategories = [
  { id: "all", label: "Tümü", icon: <HomeIcon className="w-5 h-5" />, activeClass: "bg-blue-600", hoverClass: "hover:bg-blue-50 hover:text-blue-600" },
  { id: "istanbul", label: "İstanbul", icon: <BuildingOfficeIcon className="w-5 h-5" />, activeClass: "bg-purple-600", hoverClass: "hover:bg-purple-50 hover:text-purple-600" },
  { id: "antalya", label: "Antalya", icon: <SunIcon className="w-5 h-5" />, activeClass: "bg-orange-600", hoverClass: "hover:bg-orange-50 hover:text-orange-600" },
  { id: "kapadokya", label: "Kapadokya", icon: <CloudIcon className="w-5 h-5" />, activeClass: "bg-indigo-600", hoverClass: "hover:bg-indigo-50 hover:text-indigo-600" },
  { id: "bodrum", label: "Bodrum", icon: <GlobeEuropeAfricaIcon className="w-5 h-5" />, activeClass: "bg-cyan-600", hoverClass: "hover:bg-cyan-50 hover:text-cyan-600" },
  { id: "deals", label: "Fırsatlar", icon: <FireIcon className="w-5 h-5" />, activeClass: "bg-red-600", hoverClass: "hover:bg-red-50 hover:text-red-600" },
  { id: "bestseller", label: "En Çok Satan", icon: <TagIcon className="w-5 h-5" />, activeClass: "bg-green-600", hoverClass: "hover:bg-green-50 hover:text-green-600" }
];

// Benzersiz özellikleri alır
const getUniqueFeatures = () => {
  const allFeatures = hotels.flatMap(hotel => hotel.features);
  return [...new Set(allFeatures)];
};

export default function FeaturedHotels() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [visibleHotels, setVisibleHotels] = useState<typeof hotels>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  // Scroll durumunu kontrol et
  const checkScrollPosition = useCallback(() => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  // Component mount olduğunda ve pencere boyutu değiştiğinde scroll durumunu kontrol et
  useEffect(() => {
    // İlk yükleme kontrolü
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
      
      // Başlangıçta sağa kaydırma butonunu göster
      if (sliderRef.current) {
        const { scrollWidth, clientWidth } = sliderRef.current;
        // Kaydırılacak içerik varsa sağ butonu göster
        setCanScrollRight(scrollWidth > clientWidth);
      }
    }, 100);
    
    // Dokunmatik ekran olaylarını dinle
    const sliderElement = sliderRef.current;
    if (sliderElement) {
      // Kaydırma olaylarını dinle
      sliderElement.addEventListener('scroll', checkScrollPosition);
    }
    
    // Pencere boyutu değiştikçe kontrol et
    window.addEventListener('resize', checkScrollPosition);
    
    return () => {
      window.removeEventListener('resize', checkScrollPosition);
      if (sliderElement) {
        sliderElement.removeEventListener('scroll', checkScrollPosition);
      }
      clearTimeout(timer);
    };
  }, [checkScrollPosition]);

  // Filtreye göre otelleri filtrele - case insensitive ile iyileştirildi
  const filteredHotels = useMemo(() => {
    if (activeFilter === "all") return hotels;
    if (activeFilter === "deals") return hotels.filter(hotel => hotel.discount > 15 || hotel.promotion);
    if (activeFilter === "bestseller") return hotels.filter(hotel => hotel.isBestSeller);
    
    // Case insensitive arama için
    const searchTerm = activeFilter.toLowerCase();
    return hotels.filter(hotel => {
      const locationMatch = hotel.location.toLowerCase().includes(searchTerm);
      const nameMatch = hotel.name.toLowerCase().includes(searchTerm);
      return locationMatch || nameMatch;
    });
  }, [activeFilter]);

  // Filtrelenmiş otelleri görünür otellere ayarla (animasyon için)
  useEffect(() => {
    if (isLoading) {
      setVisibleHotels([]);
      const timer = setTimeout(() => {
        setVisibleHotels(filteredHotels);
        setIsLoading(false);
        
        // Filtre değiştiğinde slider'ı başa al ve scroll durumunu güncelle
        if (sliderRef.current) {
          sliderRef.current.scrollLeft = 0;
          // Scroll durumunu güncelle
          setTimeout(checkScrollPosition, 100);
        }
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setVisibleHotels(filteredHotels);
      // Görünür oteller değiştiğinde scroll durumunu güncelle
      setTimeout(checkScrollPosition, 100);
    }
  }, [filteredHotels, isLoading, checkScrollPosition]);

  // Yıldız sayısını render et
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarIconSolid key={i} className="w-4 h-4 text-yellow-400" />
        );
      } else if (i === fullStars && halfStar) {
        stars.push(
          <StarIcon key={i} className="w-4 h-4 text-yellow-400" fill="url(#halfStarGradient)" />
        );
      } else {
        stars.push(
          <StarIcon key={i} className="w-4 h-4 text-gray-300" />
        );
      }
    }

    return (
      <div className="flex">
        <svg width="0" height="0" className="hidden">
          <defs>
            <linearGradient id="halfStarGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="50%" stopColor="#facc15" />
              <stop offset="50%" stopColor="#e5e7eb" />
            </linearGradient>
          </defs>
        </svg>
        {stars}
      </div>
    );
  };

  // Fiyat formatını düzenle
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(price);
  };

  // Favorilere ekle/çıkar
  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  // Scroll butonlarının daha etkin gösterilmesi
  const scrollSlider = useCallback((direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth / 2 
        : scrollLeft + clientWidth / 2;
      
      sliderRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
      
      // Scroll butonlarının animasyonu
      const buttonClass = direction === 'left' ? 'left-scroll-btn' : 'right-scroll-btn';
      const button = document.querySelector(`.${buttonClass}`);
      if (button) {
        button.classList.add('animate-pulse');
        setTimeout(() => button.classList.remove('animate-pulse'), 500);
      }
      
      // Scroll işlemi bittikten sonra butonların durumunu kontrol et
      setTimeout(checkScrollPosition, 500);
    }
  }, [checkScrollPosition]);

  // Dokunmatik ekran işlemleri
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 100) {
      // Sola kaydırma (sağa gidiş)
      scrollSlider('right');
    } else if (touchEndX - touchStartX > 100) {
      // Sağa kaydırma (sola gidiş)
      scrollSlider('left');
    }
  };

  // Özellik ikonlarını göster
  const getFeatureIcon = (feature: string, index: number) => {
    if (feature.toLowerCase().includes('wifi')) {
      return <WifiIcon className="w-3 h-3" />;
    } else if (feature.toLowerCase().includes('spa') || feature.toLowerCase().includes('havuz')) {
      return <BeakerIcon className="w-3 h-3" />;
    } else if (index === 2) {
      return <SparklesIcon className="w-3 h-3" />;
    } else {
      return <ComputerDesktopIcon className="w-3 h-3" />;
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Dekoratif arkaplan şekilleri */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-50 opacity-50 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-50 opacity-50 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative">
        {/* Başlık bölümü */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <div className="inline-block px-4 py-1 rounded-full text-sm font-medium mb-4 bg-blue-50 text-blue-600">
            Lüks ve Konfor
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r animate-text-gradient-slow 
            bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900">
            Öne Çıkan Oteller
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            En popüler ve en yüksek puan alan otelleri keşfedin. Seyahatinizi unutulmaz kılacak eşsiz konaklama deneyimleri.
          </p>
        </div>
          
        {/* Filter tabs - Görsel olarak geliştirilmiş */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-full bg-white shadow-lg overflow-x-auto hide-scrollbar flex-wrap gap-1">
            {filterCategories.map((category) => {
              const isActive = activeFilter === category.id;
              const colorClass = isActive 
                ? `${category.activeClass} text-white` 
                : `${category.hoverClass}`;
              
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveFilter(category.id);
                    // Filtre değiştiğinde yükleme animasyonu göster
                    setIsLoading(true);
                    
                    // Filtre değiştiğinde butonu görünür yapmak için scroll pozisyonunu kontrol et
                    if (sliderRef.current) {
                      // Butona tıklandığında slider scroll pozisyonunu resetle
                      sliderRef.current.scrollLeft = 0;
                      setCanScrollLeft(false);
                      
                      // Kaydırılabilecek içerik olup olmadığını kontrol et
                      const hasScrollableContent = sliderRef.current.scrollWidth > sliderRef.current.clientWidth;
                      setCanScrollRight(hasScrollableContent);
                    }
                    
                    setTimeout(() => setIsLoading(false), 400);
                  }}
                  className={cn(
                    "px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 flex items-center gap-2 border",
                    isActive
                      ? `${colorClass} shadow-md scale-105 border-transparent`
                      : "bg-white text-gray-700 hover:bg-gray-50 border-gray-100"
                  )}
                >
                  <span className={`flex items-center justify-center ${isActive ? 'text-white' : ''}`}>
                    {category.icon}
                  </span>
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scroll butonları - Daha belirgin ve büyük */}
        <div className="relative mb-6">
          <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10">
            <button 
              onClick={() => scrollSlider('left')}
              disabled={!canScrollLeft}
              className={`left-scroll-btn p-4 rounded-full shadow-xl bg-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border border-gray-100 ${
                !canScrollLeft 
                  ? 'opacity-40 cursor-not-allowed text-gray-300' 
                  : 'opacity-90 text-blue-600 hover:bg-blue-50 hover:opacity-100 hover:shadow-2xl'
              }`}
              aria-label="Sola kaydır"
            >
              <ChevronLeftIcon className="w-7 h-7" />
            </button>
          </div>
          
          <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
            <button 
              onClick={() => scrollSlider('right')}
              disabled={!canScrollRight}
              className={`right-scroll-btn p-4 rounded-full shadow-xl bg-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border border-gray-100 ${
                !canScrollRight 
                  ? 'opacity-40 cursor-not-allowed text-gray-300' 
                  : 'opacity-90 text-blue-600 hover:bg-blue-50 hover:opacity-100 hover:shadow-2xl'
              }`}
              aria-label="Sağa kaydır"
            >
              <ChevronRightIcon className="w-7 h-7" />
            </button>
          </div>
          
          {/* Oteller listesi */}
          <div 
            ref={sliderRef} 
            className={`flex space-x-6 overflow-x-auto hide-scrollbar py-4 pb-6 transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onScroll={checkScrollPosition}
          >
            {visibleHotels.length > 0 ? (
              visibleHotels.map((hotel, index) => (
                <div 
                  key={hotel.id} 
                  className={`flex-none w-full sm:w-[340px] rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-1
                    ${isInitialLoad ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
                  style={{
                    transitionDelay: `${isInitialLoad ? index * 100 : 0}ms`,
                    transitionProperty: 'all'
                  }}
                >
                  {/* Resim alanı */}
                  <div className="relative h-52 overflow-hidden group">
                    <Image
                      src={hotel.image}
                      alt={hotel.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 340px"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    
                    {/* Favori butonu */}
                    <button 
                      aria-label="Favorilere ekle"
                      onClick={() => toggleFavorite(hotel.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/50 transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    >
                      {favorites.includes(hotel.id) ? (
                        <HeartIconSolid className="w-5 h-5 text-red-500" />
                      ) : (
                        <HeartIcon className="w-5 h-5 text-white group-hover:text-red-500 transition-colors" />
                      )}
                    </button>
                    
                    {/* Yer bilgisi */}
                    <div className="absolute bottom-3 left-3 flex items-center text-white">
                      <div className="flex items-center space-x-1 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                        <MapPinIcon className="w-4 h-4" />
                        <span>{hotel.location}</span>
                      </div>
                    </div>
                    
                    {/* Fırsatlar ve kampanyalar */}
                    {(hotel.campaign || hotel.promotion || hotel.limitedOffer) && (
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {hotel.campaign && (
                          <div className="bg-green-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-md">
                            {hotel.campaign}
                          </div>
                        )}
                        {hotel.promotion && (
                          <div className="bg-purple-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-md">
                            {hotel.promotion}
                          </div>
                        )}
                        {hotel.limitedOffer && (
                          <div className="bg-red-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                            <FireIcon className="w-3 h-3" />
                            <span>Sınırlı Süre</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* İçerik alanı */}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{hotel.name}</h3>
                      {hotel.isBestSeller && (
                        <div className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
                          <StarIconSolid className="w-3 h-3" />
                          <span>En Çok Satan</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Yıldızlar */}
                    <div className="flex items-center mb-3">
                      {renderStars(hotel.rating)}
                      <span className="text-gray-600 text-sm ml-2">
                        {hotel.rating} ({hotel.reviewCount} değerlendirme)
                      </span>
                    </div>
                    
                    {/* Özellikler */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {hotel.features.slice(0, 3).map((feature, index) => (
                        <span 
                          key={index} 
                          className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full flex items-center gap-1"
                        >
                          {getFeatureIcon(feature, index)}
                          {feature}
                        </span>
                      ))}
                      {hotel.features.length > 3 && (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                          +{hotel.features.length - 3}
                        </span>
                      )}
                    </div>
                    
                    {/* Fiyat ve buton */}
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                      <div>
                        {hotel.discount > 0 && (
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-gray-500 text-sm line-through">{formatPrice(hotel.oldPrice)}</span>
                            <span className="bg-red-100 text-red-600 text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <MinusIcon className="w-3 h-3" />
                              %{hotel.discount}
                            </span>
                          </div>
                        )}
                        <div className="text-lg font-bold text-blue-600">
                          {formatPrice(hotel.price)}
                          <span className="text-gray-500 text-xs font-normal"> / gece</span>
                        </div>
                      </div>
                      
                      <Link 
                        href={`/hotel/${hotel.id}`}
                        className="group relative inline-flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      >
                        <span className="relative z-10">İncele</span>
                        <ArrowRightIcon className="h-5 w-5 transition-transform relative z-10 group-hover:translate-x-1" />
                        <span className="absolute inset-0 bg-black/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full flex justify-center items-center py-10">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 mb-4 text-gray-400 bg-gray-100 rounded-full flex items-center justify-center">
                    <SparklesIcon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Sonuç Bulunamadı</h3>
                  <p className="text-gray-600 mb-4">Bu filtreye uygun otel bulunamadı.</p>
                  <button
                    onClick={() => {
                      setActiveFilter("all");
                      setIsLoading(true);
                    }}
                    className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    Tüm Otelleri Göster
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Tümünü Gör butonu */}
        <div className="flex justify-center mt-8">
          <Link href="/hotels" 
            className="group relative inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 px-8 py-3 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            <span className="font-medium">Tüm Otelleri Görüntüle</span>
            <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            <span className="absolute -bottom-0 left-1/2 h-px w-0 bg-white transition-all group-hover:w-4/5 -translate-x-1/2"></span>
          </Link>
        </div>
      </div>
    </section>
  );
} 