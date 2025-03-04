'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Deal = {
  id: number;
  title: string;
  description: string;
  originalPrice: number;
  salePrice: number;
  discount: number;
  image: string;
  label: 'hot' | 'last-minute' | 'best-seller';
  expiry: string;
  location: string;
  remainingSpots: number;
  category: 'popular' | 'lastMinute' | 'discount';
  rating: number;
  reviewCount: number;
};

const allDeals: Deal[] = [
  // Popüler Turlar
  {
    id: 1,
    title: 'Kapadokya Balon Turu',
    description: 'Eşsiz peri bacaları manzarasında unutulmaz bir balon deneyimi yaşayın',
    originalPrice: 3600,
    salePrice: 2880,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1570654230464-9e63b3497a1e',
    label: 'hot',
    expiry: '2023-12-15',
    location: 'Kapadokya',
    remainingSpots: 5,
    category: 'popular',
    rating: 4.8,
    reviewCount: 423
  },
  {
    id: 2,
    title: 'İstanbul Boğaz Turu',
    description: 'Tekne ile İstanbul Boğazının güzelliklerini keşfedin',
    originalPrice: 1200,
    salePrice: 840,
    discount: 30,
    image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b',
    label: 'last-minute',
    expiry: '2023-12-05',
    location: 'İstanbul',
    remainingSpots: 12,
    category: 'lastMinute',
    rating: 4.7,
    reviewCount: 352
  },
  {
    id: 3,
    title: 'Pamukkale & Hierapolis Turu',
    description: 'Doğal travertenleri ve antik kenti keşfedin',
    originalPrice: 1800,
    salePrice: 1530,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1571215682738-574b686ecb0b',
    label: 'best-seller',
    expiry: '2023-12-25',
    location: 'Denizli',
    remainingSpots: 8,
    category: 'popular',
    rating: 4.6,
    reviewCount: 182
  },
  // Son Dakika
  {
    id: 4,
    title: 'Efes Antik Kenti Turu',
    description: 'Dünyanın en iyi korunmuş antik kentlerinden birini ziyaret edin',
    originalPrice: 1500,
    salePrice: 1125,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1555869433-94f21d89a10d',
    label: 'last-minute',
    expiry: '2023-12-10',
    location: 'İzmir',
    remainingSpots: 3,
    category: 'lastMinute',
    rating: 4.9,
    reviewCount: 128
  },
  {
    id: 5,
    title: 'Safranbolu Evleri Turu',
    description: 'UNESCO Dünya Mirası Listesinde yer alan tarihi evlerde bir gün geçirin',
    originalPrice: 900,
    salePrice: 720,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1600687621645-113ced83a0d5',
    label: 'last-minute',
    expiry: '2023-12-08',
    location: 'Karabük',
    remainingSpots: 6,
    category: 'lastMinute',
    rating: 4.5,
    reviewCount: 96
  },
  // İndirimli Turlar
  {
    id: 6,
    title: 'Fethiye & Ölüdeniz Tekne Turu',
    description: 'Berrak sularda yüzün ve muhteşem koyları keşfedin',
    originalPrice: 2200,
    salePrice: 1540,
    discount: 30,
    image: 'https://images.unsplash.com/photo-1519356162333-4d49ceade668',
    label: 'hot',
    expiry: '2023-12-20',
    location: 'Muğla',
    remainingSpots: 15,
    category: 'discount',
    rating: 4.7,
    reviewCount: 215
  },
  {
    id: 7,
    title: 'Göreme Açık Hava Müzesi',
    description: "Kapadokya'nın binlerce yıllık tarihi kiliselerini keşfedin",
    originalPrice: 800,
    salePrice: 560,
    discount: 30,
    image: 'https://images.unsplash.com/photo-1563290173-a81f98c6183a',
    label: 'best-seller',
    expiry: '2023-12-18',
    location: 'Nevşehir',
    remainingSpots: 25,
    category: 'discount',
    rating: 4.8,
    reviewCount: 176
  },
  {
    id: 8,
    title: 'Antalya Körfezi Yat Turu',
    description: "Lüks bir yatla Akdeniz'in turkuaz sularında gezinin",
    originalPrice: 3000,
    salePrice: 2100,
    discount: 30,
    image: 'https://images.unsplash.com/photo-1544998340-82295f75cfec',
    label: 'hot',
    expiry: '2023-12-22',
    location: 'Antalya',
    remainingSpots: 10,
    category: 'discount',
    rating: 4.9,
    reviewCount: 138
  }
];

// Fiyatı formatlı göstermek için yardımcı fonksiyon
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0
  }).format(price);
};

// Kalan gün sayısını hesaplayan yardımcı fonksiyon
const getDaysRemaining = (expiryDate: string) => {
  const expiry = new Date(expiryDate);
  const today = new Date();
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

type CategoryTab = 'popular' | 'lastMinute' | 'discount' | 'all';

export default function HotDeals() {
  const [activeCategory, setActiveCategory] = useState<CategoryTab>('all');
  const [isScrolling, setIsScrolling] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const dealsRef = useRef<HTMLDivElement>(null);

  // Yıldız oluşturan fonksiyon
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
          </svg>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
        );
      }
    }
    return stars;
  };

  // Mouse events for horizontal scrolling
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dealsRef.current) return;
    setIsScrolling(true);
    setStartX(e.pageX - dealsRef.current.offsetLeft);
    setScrollLeft(dealsRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isScrolling || !dealsRef.current) return;
    e.preventDefault();
    const x = e.pageX - dealsRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll hızı
    dealsRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsScrolling(false);
  };

  const handleMouseLeave = () => {
    setIsScrolling(false);
  };

  // Touch events for mobile devices
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!dealsRef.current) return;
    setIsScrolling(true);
    setStartX(e.touches[0].pageX - dealsRef.current.offsetLeft);
    setScrollLeft(dealsRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isScrolling || !dealsRef.current) return;
    const x = e.touches[0].pageX - dealsRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    dealsRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsScrolling(false);
  };

  // Filtrelenmiş turları al
  const getFilteredDeals = () => {
    if (activeCategory === 'all') return allDeals;
    return allDeals.filter(deal => deal.category === activeCategory);
  };

  const filteredDeals = getFilteredDeals();

  return (
    <section className="py-16 bg-white">
      <div className="container px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center px-4 py-1 rounded-full bg-red-50 text-red-700 font-medium text-sm mb-3">
            <span className="flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            SINIRLI SÜRE TEKLİFLERİ
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Öne Çıkan Turlarımız</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            En popüler turlarımız, son dakika fırsatlarımız ve özel indirimli turlarımızı keşfedin. Bu fırsatları başka hiçbir yerde bulamazsınız!
          </p>
          
          {/* Kategori Seçme */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8">
            <button 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setActiveCategory('all')}
            >
              Tüm Turlar
            </button>
            <button 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === 'popular' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setActiveCategory('popular')}
            >
              <span className="hidden sm:inline">En </span>Popüler<span className="hidden sm:inline"> Turlar</span>
            </button>
            <button 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === 'lastMinute' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setActiveCategory('lastMinute')}
            >
              Son Dakika<span className="hidden sm:inline"> Fırsatları</span>
            </button>
            <button 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === 'discount' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setActiveCategory('discount')}
            >
              İndirimli<span className="hidden sm:inline"> Turlar</span>
            </button>
          </div>
        </div>
        
        {/* Touch ve mouse kaydırma destekli tur kartları */}
        <div 
          className="overflow-x-auto pb-4 hide-scrollbar cursor-grab active:cursor-grabbing"
          ref={dealsRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="inline-flex gap-6 min-w-full">
            {filteredDeals.map((deal) => (
              <div 
                key={deal.id} 
                className="relative flex-shrink-0 w-[280px] bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg group hover:shadow-xl transition-all duration-300"
              >
                {/* İndirim etiketi */}
                <div className="absolute top-4 left-4 z-10 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
                  %{deal.discount} İndirim
                </div>
                
                {/* Türüne göre etiket */}
                <div className="absolute top-4 right-4 z-10">
                  {deal.label === 'hot' && (
                    <div className="bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
                      </svg>
                      POPÜLER
                    </div>
                  )}
                  {deal.label === 'last-minute' && (
                    <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      SON DAKİKA
                    </div>
                  )}
                  {deal.label === 'best-seller' && (
                    <div className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
                      </svg>
                      ÇOK SATAN
                    </div>
                  )}
                </div>
                
                {/* Görsel */}
                <div className="relative h-48 overflow-hidden">
                  <Image 
                    src={deal.image} 
                    alt={deal.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  {/* Konum */}
                  <div className="absolute bottom-4 left-4 text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                    <span className="text-sm font-medium">{deal.location}</span>
                  </div>
                </div>
                
                {/* İçerik */}
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-1 text-gray-800 group-hover:text-blue-700 transition-colors duration-200">
                    {deal.title}
                  </h3>
                  
                  {/* Değerlendirme */}
                  <div className="flex items-center mb-2">
                    <div className="flex mr-1">
                      {renderStars(deal.rating)}
                    </div>
                    <span className="text-gray-600 text-sm">
                      ({deal.reviewCount} değerlendirme)
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {deal.description}
                  </p>
                  
                  {/* Fiyat */}
                  <div className="flex items-baseline mb-3">
                    <span className="text-gray-500 text-sm line-through mr-2">
                      {formatPrice(deal.originalPrice)}
                    </span>
                    <span className="text-red-600 font-bold text-xl">
                      {formatPrice(deal.salePrice)}
                    </span>
                    <span className="text-gray-500 text-xs ml-1">/ kişi</span>
                  </div>
                  
                  {/* Alt bilgi */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-xs text-orange-800 bg-orange-50 px-2 py-1 rounded">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      Son {getDaysRemaining(deal.expiry)} gün
                    </div>
                    <div className="flex items-center text-xs text-blue-800 bg-blue-50 px-2 py-1 rounded">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                      </svg>
                      Son {deal.remainingSpots} kişi
                    </div>
                  </div>
                  
                  {/* Buton */}
                  <Link 
                    href={`/tour/${deal.id}`} 
                    className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-2 transition-colors duration-200"
                  >
                    Hemen Rezervasyon Yap
                  </Link>
                </div>
                
                {/* İlerleme çubuğu */}
                <div className="px-4 pb-4">
                  <div className="text-xs text-gray-600 mb-1 flex justify-between">
                    <span>Doluluk Oranı</span>
                    <span className="font-medium">{Math.min(90, 100 - (deal.remainingSpots / 20) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-blue-600 rounded-full" 
                      style={{ width: `${Math.min(90, 100 - (deal.remainingSpots / 20) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-10 text-center">
          <Link 
            href="/tours"
            className="inline-flex items-center bg-white text-blue-600 hover:bg-blue-50 border-2 border-blue-600 px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Tüm Turları Görüntüle
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
} 