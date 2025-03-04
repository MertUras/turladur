"use client";

import { useState, useEffect, useRef } from "react";
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
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

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

  // Filtrelenmiş oteller - geliştirilmiş filtre
  const filteredHotels = hotels.filter(hotel => {
    if (activeFilter === "all") return true;
    if (activeFilter === "deals") return hotel.discount >= 15 || hotel.promotion || hotel.limitedOffer;
    if (activeFilter === "bestseller") return hotel.isBestSeller;
    return hotel.location.toLowerCase().includes(activeFilter.toLowerCase());
  });

  return (
    <section 
      ref={sectionRef}
      className="py-24 bg-gradient-to-b from-white to-blue-50 relative overflow-hidden"
    >
      {/* Dekoratif arka plan öğeleri */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-900 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-blue-900 to-transparent"></div>
        </div>
      </div>

      <div className="container px-4 mx-auto relative z-10">
        {/* Özel kampanya duyurusu */}
        <div className={`mb-12 p-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg text-white text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <span className="bg-yellow-400 text-blue-900 text-xs font-semibold px-3 py-1 rounded-full uppercase">Özel Fırsat</span>
              <h3 className="text-xl font-bold mt-2">TourTech'e Özel Otel Rezervasyonlarında %20'ye Varan İndirimler</h3>
            </div>
            <div className="flex space-x-4">
              <span className="bg-white bg-opacity-20 px-4 py-2 rounded-md text-sm">
                <span className="font-semibold">Kupon Kodu:</span> TOURTECH20
              </span>
              <Link 
                href="/hotels/special-offers" 
                className="bg-white text-blue-800 px-4 py-2 rounded-md font-medium hover:bg-blue-50 transition-colors"
              >
                Fırsatı Yakala
              </Link>
            </div>
          </div>
        </div>

        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-block mb-4">
            <div className="h-1 w-24 bg-blue-600 mb-1"></div>
            <div className="h-1 w-12 bg-blue-600"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            En İyi Fiyat Garantili Oteller
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Türkiye'nin en iyi otellerini keşfedin ve özel indirimlerle hemen rezervasyonunuzu yapın
          </p>
        </div>

        {/* Filtre butonları */}
        <div className={`flex flex-wrap justify-center gap-3 mb-12 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {filterCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                activeFilter === category.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-blue-600 hover:text-blue-600"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Otel kartları */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {filteredHotels.map((hotel, idx) => (
            <div
              key={hotel.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all duration-500 transform hover:shadow-lg hover:border-blue-200 hover:-translate-y-1"
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <div className="relative h-60 w-full">
                <Image
                  src={hotel.image}
                  alt={hotel.name}
                  fill
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-500 hover:scale-105"
                />
                
                {/* Fiyat etiketi */}
                <div className="absolute top-4 right-4 bg-white px-3 py-2 rounded-md shadow-md">
                  <div className="flex flex-col items-end">
                    {hotel.oldPrice && (
                      <span className="text-xs text-gray-500 line-through">{hotel.oldPrice} ₺</span>
                    )}
                    <span className="text-blue-600 font-semibold">{hotel.price} ₺ / gece</span>
                  </div>
                </div>
                
                {/* İndirim etiketi */}
                {hotel.discount && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 rounded-md text-sm font-bold shadow-md">
                    %{hotel.discount} İndirim
                  </div>
                )}
                
                {/* Kampanya etiketi */}
                {hotel.campaign && (
                  <div className="absolute bottom-4 left-4 bg-blue-600 text-white px-2 py-1 rounded-md text-sm font-medium shadow-md">
                    {hotel.campaign}
                  </div>
                )}
                
                {/* En çok satan etiketi */}
                {hotel.isBestSeller && (
                  <div className="absolute top-16 left-0 bg-amber-500 text-white px-4 py-1 text-sm font-medium shadow-md transform -rotate-45 -translate-x-8">
                    En Çok Satan
                  </div>
                )}
                
                {/* Sınırlı fırsat etiketi */}
                {hotel.limitedOffer && (
                  <div className="absolute bottom-4 right-4 flex items-center bg-green-600 text-white px-2 py-1 rounded-md text-xs font-medium shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Sınırlı Fırsat
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{hotel.name}</h3>
                </div>
                
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-600 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  <span className="text-gray-600 text-sm">{hotel.location}</span>
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="flex mr-2">
                    {renderStars(hotel.rating)}
                  </div>
                  <span className="text-gray-700 font-medium">{hotel.rating}</span>
                  <span className="text-gray-500 text-sm ml-1">({hotel.reviewCount} değerlendirme)</span>
                </div>
                
                {/* Promosyon */}
                {hotel.promotion && (
                  <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                    {hotel.promotion}
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {hotel.features.map((feature, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md">
                      {feature}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center mt-auto">
                  <Link 
                    href={`/hotel/${hotel.id}`}
                    className="text-blue-600 font-medium inline-flex items-center hover:underline"
                  >
                    Detayları Görüntüle
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                  
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300">
                    Rezervasyon Yap
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bonus indirim teklifi */}
        <div className={`my-16 p-6 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-lg shadow-xl text-white text-center transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h3 className="text-2xl font-bold mb-3">Son Dakika Rezervasyonlarda %30'a Varan İndirim!</h3>
          <p className="mb-6 max-w-3xl mx-auto">Son 48 saat içinde başlayan konaklamalarda geçerli özel fiyatlarla lüks tatil deneyimini kaçırmayın.</p>
          <Link 
            href="/oteller/last-minute" 
            className="inline-flex items-center px-6 py-3 bg-white text-amber-600 rounded-md font-semibold hover:bg-amber-50 transition-colors"
          >
            Son Dakika Fırsatları
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* Tüm otelleri görüntüle butonu */}
        <div className={`text-center mt-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Link 
            href="/hotel"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-all duration-300 font-medium"
          >
            <span>Tüm Otelleri Görüntüle</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
} 