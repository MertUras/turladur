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

// Kategori verilerini oluştur
const categoryData = [
  {
    id: 'all',
    title: 'Tüm Turlar',
    description: 'En iyi fiyat garantisiyle tüm turlarımızı keşfedin',
    color: 'blue',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    )
  },
  {
    id: 'popular',
    title: 'En Popüler',
    description: 'Misafirlerimizin en çok tercih ettiği turlar',
    color: 'orange',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
      </svg>
    )
  },
  {
    id: 'lastMinute',
    title: 'Son Dakika',
    description: 'Acele edin, son yerler ve özel fırsatlar',
    color: 'red',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    )
  },
  {
    id: 'discount',
    title: 'İndirimli Turlar',
    description: 'En büyük indirimli turları kaçırmayın',
    color: 'green',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m9 14.25 6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185ZM9.75 9h.008v.008H9.75V9Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 4.5h.008v.008h-.008V13.5Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
    )
  }
];

export default function HotDeals() {
  const [activeCategory, setActiveCategory] = useState<CategoryTab>('all');
  const [hoveredCategory, setHoveredCategory] = useState<CategoryTab | null>(null);
  const [hoveredDeal, setHoveredDeal] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Renge göre CSS sınıfı oluşturan yardımcı fonksiyon
  const getColorClass = (color: string, isActive: boolean = false, element: 'bg' | 'text' | 'border' = 'bg') => {
    const prefix = element === 'bg' ? 'bg' : element === 'text' ? 'text' : 'border';
    const intensity = isActive ? '600' : element === 'bg' ? '50' : '500';
    return `${prefix}-${color}-${intensity}`;
  };

  // Aktif kategoriyi al
  const activeTabData = categoryData.find(cat => cat.id === activeCategory);

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

  // Etiket rengini belirle
  const getLabelColor = (label: 'hot' | 'last-minute' | 'best-seller') => {
    switch (label) {
      case 'hot': return 'orange';
      case 'last-minute': return 'red';
      case 'best-seller': return 'green';
      default: return 'blue';
    }
  };

  // Filtrelenmiş turları al
  const getFilteredDeals = () => {
    if (activeCategory === 'all') return allDeals;
    return allDeals.filter(deal => deal.category === activeCategory);
  };

  const filteredDeals = getFilteredDeals();

  // Kategori değiştiğinde animasyon efekti
  const handleCategoryChange = (category: CategoryTab) => {
    if (category === activeCategory) return;
    
    setIsAnimating(true);
    setActiveCategory(category);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container px-4">
        <div className="text-center mb-12">
          <span className="inline-block py-1 px-3 rounded-full bg-red-100 text-red-800 text-sm font-medium mb-4">
            SINIRLI SÜRE TEKLİFLERİ
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-500">
            Öne Çıkan Turlarımız
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            En popüler turlarımız, son dakika fırsatlarımız ve özel indirimli turlarımızı keşfedin.
            <br className="hidden md:inline" />
            Bu fırsatları başka hiçbir yerde bulamazsınız!
          </p>
        </div>
        
        {/* Kategori Seçme Sekmeleri */}
        <div className="flex flex-wrap justify-center mb-12 gap-2">
          {categoryData.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id as CategoryTab)}
              onMouseEnter={() => setHoveredCategory(category.id as CategoryTab)}
              onMouseLeave={() => setHoveredCategory(null)}
              className={`px-5 py-3 rounded-full transition-all duration-300 font-medium flex items-center gap-2 ${
                activeCategory === category.id
                  ? `${getColorClass(category.color, true)} text-white shadow-lg shadow-${category.color}-200`
                  : `${getColorClass(category.color, false)} hover:bg-${category.color}-100 text-gray-700`
              }`}
            >
              <span className={`transition-all duration-300 ${
                hoveredCategory === category.id && activeCategory !== category.id ? 'scale-110' : ''
              }`}>
                {category.icon}
              </span>
              <span>{category.title}</span>
            </button>
          ))}
        </div>
        
        {/* Aktif Kategori Açıklaması */}
        {activeTabData && (
          <div className={`max-w-3xl mx-auto mb-10 text-center ${isAnimating ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
            <p className={`text-lg ${getColorClass(activeTabData.color, false, 'text')}`}>
              {activeTabData.description}
            </p>
          </div>
        )}
        
        {/* Fırsat Kartları */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${isAnimating ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
          {filteredDeals.map((deal) => (
            <div 
              key={deal.id}
              onMouseEnter={() => setHoveredDeal(deal.id)}
              onMouseLeave={() => setHoveredDeal(null)}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 group border border-gray-100"
            >
              {/* Görsel Alanı */}
              <div className="relative h-52 overflow-hidden">
                <Image 
                  src={deal.image} 
                  alt={deal.title}
                  fill
                  className={`object-cover transition-transform duration-700 ${hoveredDeal === deal.id ? 'scale-110' : 'scale-100'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                
                {/* İndirim etiketi */}
                <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm text-red-600 text-sm font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9 14.25 6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185Z" />
                  </svg>
                  %{deal.discount} İndirim
                </div>
                
                {/* Etiket */}
                <div className="absolute top-4 right-4 z-10">
                  <div className={`${getColorClass(getLabelColor(deal.label), true)} text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1`}>
                    {deal.label === 'hot' && (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                        </svg>
                        POPÜLER
                      </>
                    )}
                    {deal.label === 'last-minute' && (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        SON DAKİKA
                      </>
                    )}
                    {deal.label === 'best-seller' && (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
                        </svg>
                        ÇOK SATAN
                      </>
                    )}
                  </div>
                </div>
                
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
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                    {deal.title}
                  </h3>
                </div>
                
                {/* Değerlendirme */}
                <div className="flex items-center mb-3">
                  <div className="flex mr-1">
                    {renderStars(deal.rating)}
                  </div>
                  <span className="text-gray-600 text-sm">
                    ({deal.reviewCount})
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {deal.description}
                </p>
                
                {/* Fiyat ve Bilgiler */}
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <span className="text-gray-500 text-sm line-through">
                      {formatPrice(deal.originalPrice)}
                    </span>
                    <div className="text-red-600 font-bold text-xl">
                      {formatPrice(deal.salePrice)}
                      <span className="text-gray-500 text-xs ml-1">/ kişi</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <div className="flex items-center text-xs text-orange-800 bg-orange-50 px-2 py-1 rounded mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      Son {getDaysRemaining(deal.expiry)} gün
                    </div>
                    <div className="flex items-center text-xs text-blue-800 bg-blue-50 px-2 py-1 rounded">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                      </svg>
                      Son {deal.remainingSpots} kişilik
                    </div>
                  </div>
                </div>
                
                {/* İlerleme çubuğu */}
                <div className="mb-4">
                  <div className="text-xs text-gray-600 mb-1 flex justify-between">
                    <span>Doluluk Oranı</span>
                    <span className="font-medium">{Math.min(90, 100 - (deal.remainingSpots / 20) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        deal.remainingSpots <= 5 
                          ? 'bg-gradient-to-r from-red-500 to-orange-500 animate-pulse' 
                          : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                      }`}
                      style={{ width: `${Math.min(90, 100 - (deal.remainingSpots / 20) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Buton */}
                <Link 
                  href={`/tour/${deal.id}`} 
                  className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-3 transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
                >
                  Hemen Rezervasyon Yap
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {/* Daha Fazla Tur Butonu */}
        <div className="mt-16 text-center">
          <Link 
            href="/tours"
            className="inline-flex items-center bg-white text-blue-600 hover:text-white hover:bg-blue-600 border-2 border-blue-600 px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-sm hover:shadow-md"
          >
            Tüm Turları Görüntüle
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
} 