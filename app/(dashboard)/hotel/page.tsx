import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';
import { 
  BuildingOfficeIcon, 
  ChevronDownIcon
} from '@heroicons/react/24/outline';

import { prisma } from '@/lib/prisma';
import HotelFilters from './components/HotelFilters';
import HotelCard from './components/HotelCard';
import SearchBar from './components/SearchBar';

// Şehir seçenekleri
const cities = [
  { id: 'all', label: 'Tüm Şehirler', count: 120 },
  { id: 'istanbul', label: 'İstanbul', count: 42 },
  { id: 'antalya', label: 'Antalya', count: 28 },
  { id: 'mugla', label: 'Muğla', count: 18 },
  { id: 'izmir', label: 'İzmir', count: 15 },
  { id: 'nevsehir', label: 'Nevşehir', count: 9 },
  { id: 'sakarya', label: 'Sakarya', count: 8 },
];

// Fiyat aralıkları
const priceRanges = [
  { id: 'all', label: 'Tüm Fiyatlar' },
  { id: 'low', label: '₺0 - ₺1000' },
  { id: 'medium', label: '₺1000 - ₺2000' },
  { id: 'high', label: '₺2000 - ₺3000' },
  { id: 'luxury', label: '₺3000+' },
];

// Sıralama seçenekleri
const sortOptions = [
  { id: 'popular', label: 'En Popüler' },
  { id: 'price-low', label: 'Fiyat (Düşükten Yükseğe)' },
  { id: 'price-high', label: 'Fiyat (Yüksekten Düşüğe)' },
  { id: 'rating', label: 'Puan (En Yüksek)' },
  { id: 'discount', label: 'İndirim Oranı' },
];

// Özellik filtreleri için ikonlar
const featureFilters = [
  { id: 'wifi', label: 'Ücretsiz Wi-Fi', icon: 'wifi' },
  { id: 'pool', label: 'Havuz', icon: 'pool' },
  { id: 'breakfast', label: 'Kahvaltı Dahil', icon: 'breakfast' },
  { id: 'spa', label: 'Spa', icon: 'spa' },
  { id: 'sea-view', label: 'Deniz Manzaralı', icon: 'sea-view' },
  { id: 'all-inclusive', label: 'Her Şey Dahil', icon: 'all-inclusive' },
  { id: 'kids-friendly', label: 'Çocuk Dostu', icon: 'kids-friendly' },
  { id: 'bar', label: 'Bar', icon: 'bar' },
];

// Popüler filtreler
const popularFilters = [
  { id: 'discount', label: 'İndirimli Oteller', icon: 'discount' },
  { id: 'bestseller', label: 'En Çok Satanlar', icon: 'bestseller' },
  { id: 'new', label: 'Yeni Eklenenler', icon: 'new' },
  { id: 'sea-view', label: 'Deniz Manzaralı', icon: 'sea-view' },
];

// Özellik ikonları için yardımcı fonksiyon
const getFeatureIcon = (feature: string) => {
  const featureLower = feature.toLowerCase();
  
  if (featureLower.includes('deniz') || featureLower.includes('manzara')) {
    return 'sea-view';
  } else if (featureLower.includes('wifi') || featureLower.includes('internet') || featureLower.includes('wi-fi')) {
    return 'wifi';
  } else if (featureLower.includes('havuz')) {
    return 'pool';
  } else if (featureLower.includes('spa') || featureLower.includes('masaj')) {
    return 'spa';
  } else if (featureLower.includes('restoran') || featureLower.includes('kahvaltı') || featureLower.includes('yemek')) {
    return 'breakfast';
  } else if (featureLower.includes('tv') || featureLower.includes('televizyon')) {
    return 'tv';
  } else if (featureLower.includes('teras') || featureLower.includes('balkon')) {
    return 'balcony';
  } else if (featureLower.includes('klima') || featureLower.includes('ısıtma')) {
    return 'climate';
  } else if (featureLower.includes('ücretsiz') || featureLower.includes('bedava')) {
    // Eğer ücretsiz Wi-Fi ise, Wi-Fi ikonunu kullan
    if (featureLower.includes('wifi') || featureLower.includes('wi-fi') || featureLower.includes('internet')) {
      return 'wifi';
    }
    return 'free';
  } else if (featureLower.includes('bar')) {
    return 'bar';
  } else if (featureLower.includes('çocuk') || featureLower.includes('cocuk')) {
    return 'kids-friendly';
  } else if (featureLower.includes('spor') || featureLower.includes('salon')) {
    return 'gym';
  } else if (featureLower.includes('marina')) {
    return 'marina';
  } else if (featureLower.includes('her şey') || featureLower.includes('her sey') || featureLower.includes('dahil')) {
    return 'all-inclusive';
  } else if (featureLower.includes('aquapark') || featureLower.includes('su park')) {
    return 'aquapark';
  } else {
    return 'default';
  }
};

// Veritabanından otelleri getir
async function getHotels() {
  try {
    const hotels = await prisma.hotel.findMany({
      include: {
        rooms: {
          orderBy: {
            price: 'asc'
          },
          take: 1
        },
        reviews: {
          include: {
            user: true
          }
        }
      }
    });

    return hotels.map(hotel => {
      // Ortalama puanı hesapla
      const avgRating = hotel.reviews.length 
        ? hotel.reviews.reduce((sum, review) => sum + review.rating, 0) / hotel.reviews.length 
        : 0;
      
      // Özellikleri parse et
      let amenities: string[] = [];
      try {
        if (typeof hotel.amenities === 'string') {
          const parsedAmenities = JSON.parse(hotel.amenities as string);
          if (typeof parsedAmenities === 'object' && !Array.isArray(parsedAmenities)) {
            amenities = Object.keys(parsedAmenities).filter(key => parsedAmenities[key]);
          } else if (Array.isArray(parsedAmenities)) {
            amenities = parsedAmenities;
          }
        } else if (typeof hotel.amenities === 'object') {
          if (Array.isArray(hotel.amenities)) {
            amenities = hotel.amenities as string[];
          } else {
            const amenitiesObj = hotel.amenities as Record<string, boolean>;
            amenities = Object.keys(amenitiesObj).filter(key => amenitiesObj[key]);
          }
        }
      } catch (error) {
        console.error('Amenities parsing error:', error);
      }

      // Resimleri parse et
      let images: string[] = [];
      try {
        if (typeof hotel.images === 'string') {
          const parsedImages = JSON.parse(hotel.images as string);
          if (Array.isArray(parsedImages)) {
            images = parsedImages;
          }
        } else if (Array.isArray(hotel.images)) {
          images = hotel.images as string[];
        }
      } catch (error) {
        console.error('Images parsing error:', error);
      }

      // En düşük oda fiyatını al
      const lowestPrice = hotel.rooms.length > 0 ? hotel.rooms[0].price : 0;
      
      // Rastgele indirim (gerçek uygulamada bu veritabanından gelir)
      const discount = Math.floor(Math.random() * 30) + 5; // %5 ile %35 arası
      const oldPrice = Math.round(lowestPrice * (1 + discount / 100));

      return {
        id: hotel.id,
        name: hotel.name,
        description: hotel.description || '',
        location: `${hotel.city || ''}, ${hotel.country || ''}`,
        rating: parseFloat(avgRating.toFixed(1)),
        reviewCount: hotel.reviews.length,
        price: lowestPrice,
        oldPrice: oldPrice,
        discount: discount,
        image: images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
        features: amenities.slice(0, 5),
        isBestSeller: hotel.reviews.length > 10,
        stars: hotel.stars || 3
      };
    });
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return [];
  }
}

export const metadata: Metadata = {
  title: 'Oteller | TourTech',
  description: 'Türkiye\'nin en iyi otellerini keşfedin ve rezervasyon yapın.',
};

export default async function HotelsPage() {
  const hotels = await getHotels();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Lüks otel odası manzarası"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70"></div>
        
        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container px-4 text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-md">
              Hayalinizdeki Konaklamayı Keşfedin
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto drop-shadow-md">
              Türkiye'nin seçkin otellerinde ayrıcalıklı bir tatil için rezervasyonunuzu hemen yapın.
            </p>
            
            {/* Arama ve Filtreleme Kartı */}
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-5xl mx-auto transform translate-y-12 border border-gray-100">
              <SearchBar cities={cities} />
            </div>
          </div>
        </div>
      </div>

      {/* Otel Listesi */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sol Sidebar - Filtreler */}
          <div className="lg:w-1/4">
            <HotelFilters 
              cities={cities}
              priceRanges={priceRanges}
              featureFilters={featureFilters}
              popularFilters={popularFilters}
            />
          </div>
          
          {/* Sağ Taraf - Otel Listesi */}
          <div className="lg:w-3/4">
            {/* Üst Bar - Sıralama ve Sonuç Sayısı */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Otel Sonuçları</h2>
                <p className="text-gray-500 text-sm">{hotels.length} otel bulundu</p>
              </div>
              
              <div className="relative">
                <select 
                  className="appearance-none bg-white border border-gray-200 rounded-lg py-2.5 pl-4 pr-10 text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                >
                  <option value="recommended">Önerilen</option>
                  <option value="price-asc">Fiyat (Artan)</option>
                  <option value="price-desc">Fiyat (Azalan)</option>
                  <option value="rating-desc">Puan (Yüksek-Düşük)</option>
                  <option value="rating-asc">Puan (Düşük-Yüksek)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Otel Kartları */}
            {hotels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {hotels.map((hotel) => {
                  const hotelFeatureIcons = hotel.features.map(feature => ({
                    feature,
                    iconType: getFeatureIcon(feature)
                  }));
                  
                  return (
                    <HotelCard 
                      key={hotel.id} 
                      hotel={hotel}
                      featureIcons={hotelFeatureIcons}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Otel Bulunamadı</h3>
                <p className="text-gray-600 mb-6">Arama kriterlerinize uygun otel bulunamadı. Lütfen filtrelerinizi değiştirin.</p>
                <button 
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  Filtreleri Temizle
                </button>
              </div>
            )}
            
            {/* Sayfalama */}
            {hotels.length > 0 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center gap-1">
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                  </button>
                  
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-blue-600 bg-blue-600 text-white">1</button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">2</button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">3</button>
                  
                  <span className="w-10 h-10 flex items-center justify-center text-gray-500">...</span>
                  
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">8</button>
                  
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
