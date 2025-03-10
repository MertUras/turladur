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

// API'den gelecek otel tipi
interface Hotel {
  id: string;
  name: string;
  description: string;
  images: string[]; // API'den parse edilmiş olarak gelecek
  address: string;
  city: string;
  country: string;
  stars: number;
  amenities: string[];
  rooms: {
    id: string;
    name: string;
    price: number;
  }[];
  reviews: {
    id: string;
    rating: number;
    comment: string;
    user: {
      name: string;
      image: string;
    };
  }[];
}

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

export default function FeaturedHotels() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [visibleHotels, setVisibleHotels] = useState<Hotel[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Veritabanından otelleri çek
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/hotels`);
        
        if (!response.ok) {
          throw new Error('Oteller yüklenirken bir hata oluştu');
        }
        
        const data = await response.json();
        
        // Veriyi işle - string'leri parse et
        const processedData = data.map((hotel: any) => {
          // Güvenli bir şekilde parse et
          let parsedImages: string[] = [];
          let parsedAmenities: string[] = [];
          
          try {
            if (typeof hotel.images === 'string') {
              parsedImages = JSON.parse(hotel.images);
            } else if (Array.isArray(hotel.images)) {
              parsedImages = hotel.images;
            }
            
            if (typeof hotel.amenities === 'string') {
              try {
                // Amenities bir obje olarak geliyor, true olan özellikleri dizi olarak al
                const amenitiesObj = JSON.parse(hotel.amenities);
                
                // Eğer bir obje ise (key-value pairs)
                if (typeof amenitiesObj === 'object' && !Array.isArray(amenitiesObj)) {
                  parsedAmenities = Object.keys(amenitiesObj).filter(key => amenitiesObj[key] === true);
                } 
                // Eğer zaten bir dizi ise
                else if (Array.isArray(amenitiesObj)) {
                  parsedAmenities = amenitiesObj;
                }
                
                console.log('Parsed amenities:', parsedAmenities); // Hata ayıklama
              } catch (error) {
                console.error('Amenities parse hatası:', error);
              }
            } else if (Array.isArray(hotel.amenities)) {
              parsedAmenities = hotel.amenities;
            }
          } catch (error) {
            console.error('Veri parse hatası:', error);
          }
          
          return {
            ...hotel,
            images: parsedImages,
            amenities: parsedAmenities
          };
        });
        
        setHotels(processedData);
        setIsLoading(false);
        setIsInitialLoad(false);
      } catch (error) {
        console.error('Oteller yüklenirken hata:', error);
        setError('Oteller yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    };

    fetchHotels();
  }, []);

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

  // Filtreye göre otelleri filtrele
  const filteredHotels = useMemo(() => {
    if (activeFilter === "all") return hotels;
    if (activeFilter === "deals") return hotels.filter(hotel => hotel.rooms.some(room => room.price < 1500));
    if (activeFilter === "bestseller") return hotels.filter(hotel => hotel.reviews.length > 0);
    
    // Şehir filtreleme
    const searchTerm = activeFilter.toLowerCase();
    return hotels.filter(hotel => {
      const cityMatch = hotel.city.toLowerCase().includes(searchTerm);
      const countryMatch = hotel.country.toLowerCase().includes(searchTerm);
      return cityMatch || countryMatch;
    });
  }, [activeFilter, hotels]);

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

  // Otel yıldızlarını render et (1-5 arası tam yıldız)
  const renderHotelStars = (stars: number) => {
    return (
      <div className="flex">
        {[...Array(stars)].map((_, i) => (
          <StarIconSolid key={i} className="w-4 h-4 text-yellow-400" />
        ))}
      </div>
    );
  };

  // Fiyat formatını düzenle
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(price);
  };

  // Favorilere ekle/çıkar
  const toggleFavorite = (id: string) => {
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
    } else if (feature.toLowerCase().includes('spa') || feature.toLowerCase().includes('havuz') || feature.toLowerCase().includes('pool')) {
      return <BeakerIcon className="w-3 h-3" />;
    } else if (index === 2) {
      return <SparklesIcon className="w-3 h-3" />;
    } else {
      return <ComputerDesktopIcon className="w-3 h-3" />;
    }
  };

  // Özellik adını Türkçe'ye çevir
  const getFeatureName = (feature: string): string => {
    const featureMap: Record<string, string> = {
      'wifi': 'Wi-Fi',
      'parking': 'Otopark',
      'pool': 'Havuz',
      'spa': 'Spa',
      'restaurant': 'Restoran',
      'gym': 'Spor Salonu',
      'beach': 'Plaj',
      'bar': 'Bar',
      'breakfast': 'Kahvaltı',
      'roomservice': 'Oda Servisi',
      'airconditioning': 'Klima'
    };

    return featureMap[feature.toLowerCase()] || feature;
  };

  // Hata durumunda göster
  if (error) {
    return (
      <div className="text-center py-16 px-4">
        <div className="mx-auto w-20 h-20 mb-6 text-red-500 bg-red-50 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Bir Hata Oluştu</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Yeniden Dene
        </button>
      </div>
    );
  }

  // Yükleme durumunda göster
  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Dekoratif arkaplan şekilleri */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-50 opacity-50 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-50 opacity-50 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.8),transparent_70%)]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          {/* Başlık bölümü */}
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <div className="inline-block px-4 py-1 rounded-full text-sm font-medium mb-4 bg-blue-50 text-blue-600 shadow-sm">
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
                const isActive = category.id === "all";
                const colorClass = isActive 
                  ? `${category.activeClass} text-white` 
                  : `${category.hoverClass}`;
                
                return (
                  <button
                    key={category.id}
                    disabled
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
          
          {/* Oteller listesi - Skeleton */}
          <div className="flex space-x-6 overflow-x-auto hide-scrollbar py-4 pb-6">
            {[...Array(3)].map((_, index) => (
              <div 
                key={index} 
                className="flex-none w-full sm:w-[340px] rounded-2xl bg-white shadow-xl overflow-hidden animate-pulse"
              >
                {/* Resim skeleton */}
                <div className="relative h-52 bg-gray-200"></div>
                
                {/* İçerik skeleton */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  </div>
                  
                  {/* Otel yıldızları skeleton */}
                  <div className="flex items-center mb-3">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-4 h-4 rounded-full bg-gray-200"></div>
                      ))}
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-24 ml-2"></div>
                  </div>
                  
                  {/* Değerlendirmeler skeleton */}
                  <div className="flex items-center mb-3">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-4 h-4 rounded-full bg-gray-200"></div>
                      ))}
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-32 ml-2"></div>
                  </div>
                  
                  {/* Özellikler skeleton */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-6 bg-gray-200 rounded-full w-20"></div>
                    ))}
                  </div>
                  
                  {/* Fiyat ve buton skeleton */}
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                    <div className="h-10 bg-gray-200 rounded-lg w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Tümünü Gör butonu skeleton */}
          <div className="flex justify-center mt-12">
            <div className="h-12 bg-gray-200 rounded-full w-48"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Dekoratif arkaplan şekilleri */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-50 opacity-50 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-50 opacity-50 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.8),transparent_70%)]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        {/* Başlık bölümü */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <div className="inline-block px-4 py-1 rounded-full text-sm font-medium mb-4 bg-blue-50 text-blue-600 shadow-sm">
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
              visibleHotels.map((hotel, index) => {
                // En düşük oda fiyatını bul
                const minPrice = hotel.rooms.length > 0 
                  ? Math.min(...hotel.rooms.map(room => room.price))
                  : 0;
                
                // Ortalama puanı hesapla
                const averageRating = hotel.reviews.length > 0
                  ? hotel.reviews.reduce((acc, review) => acc + review.rating, 0) / hotel.reviews.length
                  : 0;
                
                return (
                  <div 
                    key={hotel.id} 
                    className={`flex-none w-full sm:w-[340px] rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-1 group
                      ${isInitialLoad ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
                    style={{
                      transitionDelay: `${isInitialLoad ? index * 100 : 0}ms`,
                      transitionProperty: 'all'
                    }}
                  >
                    {/* Resim alanı */}
                    <div className="relative h-52 overflow-hidden">
                      <Image
                        src={(() => {
                          // Images'i güvenli bir şekilde dizi olarak al
                          let imagesList: string[] = [];
                          
                          try {
                            if (typeof hotel.images === 'string') {
                              imagesList = JSON.parse(hotel.images);
                            } else if (Array.isArray(hotel.images)) {
                              imagesList = hotel.images;
                            }
                          } catch (error) {
                            console.error('Images parse hatası:', error);
                          }
                          
                          return imagesList.length > 0 ? imagesList[0] : '/placeholder-hotel.jpg';
                        })()}
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
                      
                      {/* Değerlendirme puanı */}
                      {averageRating > 0 && (
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-md flex items-center gap-1">
                          <StarIconSolid className="w-4 h-4 text-yellow-400" />
                          <span className="font-medium text-gray-800">{averageRating.toFixed(1)}</span>
                        </div>
                      )}
                      
                      {/* Yer bilgisi */}
                      <div className="absolute bottom-3 left-3 flex items-center text-white">
                        <div className="flex items-center space-x-1 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                          <MapPinIcon className="w-4 h-4" />
                          <span>{hotel.city}, {hotel.country}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* İçerik alanı */}
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{hotel.name}</h3>
                        {hotel.reviews.length > 3 && (
                          <div className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
                            <StarIconSolid className="w-3 h-3" />
                            <span>Popüler</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Otel yıldızları */}
                      <div className="flex items-center mb-3">
                        {renderHotelStars(hotel.stars)}
                        <span className="text-gray-600 text-sm ml-2">
                          {hotel.stars} Yıldızlı Otel
                        </span>
                      </div>
                      
                      {/* Değerlendirmeler */}
                      {averageRating > 0 && (
                        <div className="flex items-center mb-3">
                          <div className="flex items-center">
                            {renderStars(averageRating)}
                          </div>
                          <span className="text-gray-600 text-sm ml-2">
                            {hotel.reviews.length} değerlendirme
                          </span>
                        </div>
                      )}
                      
                      {/* Özellikler */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(() => {
                          console.log('Hotel amenities:', hotel.amenities); // Hata ayıklama
                          
                          // Amenities'i güvenli bir şekilde dizi olarak al
                          let amenitiesList: string[] = [];
                          
                          try {
                            if (typeof hotel.amenities === 'string') {
                              const parsed = JSON.parse(hotel.amenities);
                              
                              // Eğer bir obje ise (key-value pairs)
                              if (typeof parsed === 'object' && !Array.isArray(parsed)) {
                                amenitiesList = Object.keys(parsed).filter(key => parsed[key] === true);
                              } 
                              // Eğer zaten bir dizi ise
                              else if (Array.isArray(parsed)) {
                                amenitiesList = parsed;
                              }
                            } else if (Array.isArray(hotel.amenities)) {
                              amenitiesList = hotel.amenities;
                            }
                            
                            console.log('Amenities list:', amenitiesList); // Hata ayıklama
                          } catch (error) {
                            console.error('Amenities parse hatası:', error);
                          }
                          
                          // Eğer amenitiesList boşsa, varsayılan özellikler göster
                          if (!amenitiesList || !Array.isArray(amenitiesList) || amenitiesList.length === 0) {
                            amenitiesList = ['wifi', 'parking', 'restaurant'];
                          }
                          
                          // İlk 3 özelliği göster
                          return amenitiesList.slice(0, 3).map((feature, index) => (
                            <span 
                              key={index} 
                              className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full flex items-center gap-1 hover:bg-blue-100 transition-colors"
                            >
                              {getFeatureIcon(feature, index)}
                              {getFeatureName(feature)}
                            </span>
                          ));
                        })()}
                        
                        {(() => {
                          // Amenities'i güvenli bir şekilde dizi olarak al
                          let amenitiesLength = 0;
                          
                          try {
                            if (typeof hotel.amenities === 'string') {
                              const parsed = JSON.parse(hotel.amenities);
                              
                              // Eğer bir obje ise (key-value pairs)
                              if (typeof parsed === 'object' && !Array.isArray(parsed)) {
                                amenitiesLength = Object.keys(parsed).filter(key => parsed[key] === true).length;
                              } 
                              // Eğer zaten bir dizi ise
                              else if (Array.isArray(parsed)) {
                                amenitiesLength = parsed.length;
                              }
                            } else if (Array.isArray(hotel.amenities)) {
                              amenitiesLength = hotel.amenities.length;
                            }
                          } catch (error) {
                            console.error('Amenities parse hatası:', error);
                          }
                          
                          // Eğer amenitiesLength 0 ise, varsayılan değer kullan
                          if (amenitiesLength === 0) {
                            amenitiesLength = 3; // Varsayılan özellik sayısı
                          }
                          
                          // 3'ten fazla özellik varsa kalan sayıyı göster
                          return amenitiesLength > 3 && (
                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full hover:bg-gray-200 transition-colors cursor-pointer">
                              +{amenitiesLength - 3}
                            </span>
                          );
                        })()}
                      </div>
                      
                      {/* Fiyat ve buton */}
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                        <div>
                          <div className="text-lg font-bold text-blue-600">
                            {formatPrice(minPrice)}
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
                );
              })
            ) : (
              <div className="w-full flex justify-center items-center py-10">
                <div className="text-center">
                  <div className="mx-auto w-20 h-20 mb-4 text-blue-400 bg-blue-50 rounded-full flex items-center justify-center">
                    <SparklesIcon className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Sonuç Bulunamadı</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">Bu filtreye uygun otel bulunamadı. Farklı bir filtre seçmeyi deneyin.</p>
                  <button
                    onClick={() => {
                      setActiveFilter("all");
                      setIsLoading(true);
                    }}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    Tüm Otelleri Göster
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Tümünü Gör butonu */}
        <div className="flex justify-center mt-12">
          <Link href="/hotels" 
            className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 px-8 py-3.5 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 overflow-hidden"
          >
            <span className="relative z-10 font-medium">Tüm Otelleri Görüntüle</span>
            <ArrowRightIcon className="h-5 w-5 transition-transform relative z-10 group-hover:translate-x-1" />
            <span className="absolute bottom-0 left-0 h-1 w-full bg-white/20 transition-all group-hover:h-full"></span>
          </Link>
        </div>
      </div>
    </section>
  );
} 