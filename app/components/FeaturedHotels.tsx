"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "../utils/cn";

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
  { id: "all", label: "Tümü" },
  { id: "istanbul", label: "İstanbul" },
  { id: "antalya", label: "Antalya" },
  { id: "kapadokya", label: "Kapadokya" },
  { id: "bodrum", label: "Bodrum" },
  { id: "deals", label: "Fırsatlar" },
  { id: "bestseller", label: "En Çok Satan" }
];

export default function FeaturedHotels() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Scroll durumunu kontrol et
  const checkScrollPosition = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10); // Küçük bir tolerans ekle
    }
  };

  // Component mount olduğunda ve pencere boyutu değiştiğinde scroll durumunu kontrol et
  useEffect(() => {
    checkScrollPosition();
    window.addEventListener('resize', checkScrollPosition);
    return () => window.removeEventListener('resize', checkScrollPosition);
  }, []);

  // Filtreye göre otelleri filtrele
  const filteredHotels = useMemo(() => {
    if (activeFilter === "all") return hotels;
    if (activeFilter === "deals") return hotels.filter(hotel => hotel.discount > 15 || hotel.promotion);
    return hotels.filter(hotel => hotel.location.toLowerCase().includes(activeFilter));
  }, [activeFilter]);

  // Yıldız sayısını render et
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
        );
      } else if (i === fullStars && halfStar) {
        stars.push(
          <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="halfStarGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#e5e7eb" />
              </linearGradient>
            </defs>
            <path fill="url(#halfStarGradient)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
        );
      }
    }

    return stars;
  };

  // Slider'ı kaydır
  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const { clientWidth } = sliderRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth / 2 : clientWidth / 2;
      
      sliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
      
      // Scroll işlemi bittikten sonra butonların durumunu kontrol et
      setTimeout(checkScrollPosition, 500);
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Öne Çıkan Oteller</h2>
            <p className="text-gray-600">En popüler ve en yüksek puan alan otelleri keşfedin</p>
          </div>
          
          {/* Filter tabs */}
          <div className="flex overflow-x-auto scrollbar-hide mt-4 md:mt-0 gap-2">
            {filterCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setActiveFilter(category.id);
                  // Filtre değiştiğinde yükleme animasyonu göster
                  setIsLoading(true);
                  setTimeout(() => setIsLoading(false), 400);
                }}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                  activeFilter === category.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                )}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scroll butonları */}
        <div className="relative">
          <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10">
            <button 
              onClick={() => scrollSlider('left')}
              disabled={!canScrollLeft}
              className={`p-2 rounded-full shadow-lg bg-white text-gray-800 hover:bg-gray-100 transition-all ${
                !canScrollLeft ? 'opacity-40 cursor-not-allowed' : 'opacity-100'
              }`}
              aria-label="Sola kaydır"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
          </div>
          
          <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
            <button 
              onClick={() => scrollSlider('right')}
              disabled={!canScrollRight}
              className={`p-2 rounded-full shadow-lg bg-white text-gray-800 hover:bg-gray-100 transition-all ${
                !canScrollRight ? 'opacity-40 cursor-not-allowed' : 'opacity-100'
              }`}
              aria-label="Sağa kaydır"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>

          {/* Otel kartları */}
          <div 
            ref={sliderRef}
            className="flex overflow-x-auto scrollbar-hide scroll-smooth pb-4 -mx-2 px-2 snap-x"
            onScroll={checkScrollPosition}
          >
            {isLoading ? (
              // Yükleme durumu
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="min-w-[300px] md:min-w-[350px] p-2 snap-start">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden h-full animate-pulse">
                    <div className="h-48 bg-gray-300"></div>
                    <div className="p-4">
                      <div className="h-5 w-3/4 bg-gray-300 rounded mb-3"></div>
                      <div className="h-4 w-1/2 bg-gray-300 rounded mb-3"></div>
                      <div className="h-4 w-full bg-gray-300 rounded mb-3"></div>
                      <div className="h-8 w-full bg-gray-300 rounded mt-4"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : filteredHotels.length > 0 ? (
              filteredHotels.map((hotel) => (
                <div key={hotel.id} className="min-w-[300px] md:min-w-[350px] p-2 snap-start">
                  <div className="group bg-white rounded-xl shadow-md overflow-hidden h-full hover:shadow-xl transition-all duration-300">
                    <div className="relative h-48 overflow-hidden">
                      <Image 
                        src={hotel.image} 
                        alt={hotel.name}
                        width={400}
                        height={250}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      
                      {/* Etiketler */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {hotel.discount > 0 && (
                          <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                            %{hotel.discount} İndirim
                          </span>
                        )}
                        {hotel.isBestSeller && (
                          <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
                            Çok Satan
                          </span>
                        )}
                        {hotel.limitedOffer && (
                          <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                            </svg>
                            Sınırlı
                          </span>
                        )}
                      </div>
                      
                      {/* Favori butonu */}
                      <button className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-700 hover:text-red-500 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                        </svg>
                      </button>
                      
                      {/* Promosyon bandı */}
                      {hotel.promotion && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-center py-1.5 text-sm font-medium">
                          {hotel.promotion}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <div className="flex justify-between mb-1">
                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{hotel.name}</h3>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        {hotel.location}
                      </div>
                      
                      <div className="flex items-center mb-3">
                        <div className="flex mr-1">
                          {renderStars(hotel.rating)}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{hotel.rating.toFixed(1)}</span>
                        <span className="mx-1.5 text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{hotel.reviewCount} değerlendirme</span>
                      </div>
                      
                      {/* Özellikler */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {hotel.features.slice(0, 3).map((feature, idx) => (
                          <span key={idx} className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                            {feature}
                          </span>
                        ))}
                        {hotel.features.length > 3 && (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                            +{hotel.features.length - 3}
                          </span>
                        )}
                      </div>
                      
                      {/* Fiyat ve rezervasyon */}
                      <div className="flex items-end justify-between mt-4">
                        <div>
                          {hotel.oldPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              {hotel.oldPrice} ₺
                            </span>
                          )}
                          <div className="flex items-baseline">
                            <span className="text-xl font-bold text-gray-900">{hotel.price} ₺</span>
                            <span className="text-sm text-gray-600 ml-1">/ gece</span>
                          </div>
                        </div>
                        
                        <Link 
                          href={`/hotel/${hotel.id}`} 
                          className="inline-flex items-center px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors"
                        >
                          İncele
                          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full flex justify-center items-center py-10">
                <div className="text-center">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Otel bulunamadı</h3>
                  <p className="text-gray-600">Arama kriterlerinize uygun otel bulunamadı. Lütfen farklı bir filtre deneyin.</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Tüm Otelleri Görüntüle butonları */}
        <div className="mt-8 text-center">
          <Link 
            href="/hotels" 
            className="inline-flex items-center px-6 py-3 rounded-lg border border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition-colors"
          >
            Tüm Otelleri Görüntüle
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
} 