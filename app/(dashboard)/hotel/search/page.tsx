'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  BuildingOfficeIcon, 
  ChevronDownIcon,
  ArrowUpRightIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  FunnelIcon,
  XMarkIcon,
  CalendarIcon,
  MinusIcon,
  PlusIcon,
  StarIcon,
  MapPinIcon,
  WifiIcon,
  RestaurantIcon,
  SwimmingPoolIcon,
  ParkingIcon,
  SunIcon,
  TvIcon,
  KeyIcon,
  BellIcon,
  HeartIcon,
  ShoppingBagIcon,
  GiftIcon,
  SparklesIcon,
  FireIcon,
  BoltIcon,
  RocketLaunchIcon,
  TrophyIcon,
  StarIcon as StarIconSolid
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import HotelCard from '../components/HotelCard';
import SearchBar from '../components/SearchBar';
import { Hotel as HotelType, FeatureIconInfo as FeatureIconInfoType } from '@/types/hotel';
import { useSearchParams } from 'next/navigation';
import Slider from '@mui/material/Slider';

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

interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  price: number;
  oldPrice?: number;
  image: string;
  features: string[];
  isBestSeller?: boolean;
  discount: number;
  checkInDate?: string;
  checkOutDate?: string;
  guests?: number;
  description: string;
  stars: number;
  type: string;
  breakfast: boolean;
  cancellationPolicy: string;
}

interface FeatureIconInfo {
  feature: string;
  iconType: string;
}

// Özellik ikonları listesi
const featureIcons: FeatureIconInfo[] = [
  { feature: 'Ücretsiz İptal', iconType: 'cancel' },
  { feature: 'Kahvaltı Dahil', iconType: 'breakfast' },
  { feature: 'Ücretsiz WiFi', iconType: 'wifi' },
  { feature: 'Otopark', iconType: 'parking' },
  { feature: 'Spa', iconType: 'spa' },
  { feature: 'Restoran', iconType: 'restaurant' },
  { feature: 'Havuz', iconType: 'pool' },
  { feature: 'Deniz Manzarası', iconType: 'sea-view' },
  { feature: 'Çay Bahçesi', iconType: 'garden' },
  { feature: 'Göl Manzarası', iconType: 'lake-view' }
];

// Dummy otel verileri
const dummyHotels: Hotel[] = [
  {
    id: "1",
    name: "Grand Hotel Istanbul",
    location: "Istanbul",
    rating: 4.5,
    reviewCount: 1284,
    price: 1200,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    features: ["Ücretsiz WiFi", "Havuz", "Spa", "Deniz Manzarası", "Kahvaltı Dahil"],
    isBestSeller: true,
    discount: 15,
    description: "İstanbul'un kalbinde, tarihi yarımadaya yakın konumda bulunan lüks bir otel.",
    stars: 5,
    type: "Lüks Otel",
    breakfast: true,
    cancellationPolicy: 'Ücretsiz İptal'
  },
  {
    id: "13",
    name: "Bosphorus Palace Hotel",
    location: "Istanbul",
    rating: 4.7,
    reviewCount: 987,
    price: 1500,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    features: ["Ücretsiz WiFi", "Havuz", "Spa", "Boğaz Manzarası", "Kahvaltı Dahil", "Restoran"],
    isBestSeller: true,
    discount: 10,
    description: "Boğaz'ın eşsiz manzarasına hakim, lüks bir konaklama deneyimi sunan otel.",
    stars: 5,
    type: "Lüks Otel",
    breakfast: true,
    cancellationPolicy: 'Ücretsiz İptal'
  },
  {
    id: "14",
    name: "Sultanahmet Boutique Hotel",
    location: "Istanbul",
    rating: 4.4,
    reviewCount: 654,
    price: 950,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    features: ["Ücretsiz WiFi", "Restoran", "Kahvaltı Dahil", "Tarihi Bina"],
    discount: 5,
    description: "Sultanahmet'in tarihi dokusunda, butik bir konaklama deneyimi sunan otel.",
    stars: 4,
    type: "Butik Otel",
    breakfast: true,
    cancellationPolicy: 'Ücretsiz İptal'
  },
  {
    id: "15",
    name: "Taksim Business Hotel",
    location: "Istanbul",
    rating: 4.2,
    reviewCount: 432,
    price: 850,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    features: ["Ücretsiz WiFi", "Restoran", "Kahvaltı Dahil", "Otopark", "Fitness Merkezi"],
    discount: 8,
    description: "Taksim'in iş merkezinde, modern tasarımlı iş oteli.",
    stars: 4,
    type: "İş Oteli",
    breakfast: true,
    cancellationPolicy: 'Ücretsiz İptal'
  },
  {
    id: "16",
    name: "Kadıköy Sea View Hotel",
    location: "Istanbul",
    rating: 4.6,
    reviewCount: 543,
    price: 1100,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    features: ["Ücretsiz WiFi", "Havuz", "Spa", "Deniz Manzarası", "Kahvaltı Dahil"],
    isBestSeller: true,
    discount: 0,
    description: "Kadıköy'ün deniz manzarasına hakim, modern bir otel.",
    stars: 4,
    type: "Standart Otel",
    breakfast: true,
    cancellationPolicy: 'Ücretsiz İptal'
  },
  {
    id: "2",
    name: "Blue Sea Resort",
    location: "Antalya",
    rating: 4.8,
    reviewCount: 892,
    price: 1800,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    features: ["Ücretsiz WiFi", "Havuz", "Spa", "Deniz Manzarası", "Kahvaltı Dahil", "Her Şey Dahil"],
    isBestSeller: true,
    discount: 0,
    description: "Antalya'nın en güzel koylarında, denize sıfır konumda bulunan her şey dahil resort.",
    stars: 5,
    type: "Lüks Otel",
    breakfast: true,
    cancellationPolicy: 'Ücretsiz İptal'
  },
  {
    id: "3",
    name: "Mountain View Hotel",
    location: "Bursa",
    rating: 4.2,
    reviewCount: 567,
    price: 950,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    features: ["Ücretsiz WiFi", "Spa", "Restoran", "Kahvaltı Dahil"],
    discount: 10,
    description: "Uludağ'ın eteklerinde, doğayla iç içe bir konaklama deneyimi sunan otel.",
    stars: 4,
    type: "Standart Otel",
    breakfast: true,
    cancellationPolicy: 'Ücretsiz İptal'
  },
  {
    id: "4",
    name: "Cappadocia Cave Hotel",
    location: "Nevşehir",
    rating: 4.7,
    reviewCount: 432,
    price: 1500,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    features: ["Ücretsiz WiFi", "Spa", "Restoran", "Kahvaltı Dahil", "Mağara Oda"],
    isBestSeller: true,
    discount: 0,
    description: "Kapadokya'nın eşsiz mağara odalarında konaklama imkanı sunan butik otel.",
    stars: 5,
    type: "Butik Otel",
    breakfast: true,
    cancellationPolicy: 'Ücretsiz İptal'
  },
  {
    id: "5",
    name: "Bodrum Beach Resort",
    location: "Muğla",
    rating: 4.6,
    reviewCount: 765,
    price: 2200,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    features: ["Ücretsiz WiFi", "Havuz", "Spa", "Deniz Manzarası", "Kahvaltı Dahil", "Her Şey Dahil"],
    isBestSeller: true,
    discount: 0,
    description: "Bodrum'un en lüks koylarında, özel plajı olan her şey dahil resort.",
    stars: 5,
    type: "Lüks Otel",
    breakfast: true,
    cancellationPolicy: 'Ücretsiz İptal'
  },
  {
    id: "6",
    name: "Trabzon Black Sea Hotel",
    location: "Trabzon",
    rating: 4.3,
    reviewCount: 321,
    price: 850,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    features: ["Ücretsiz WiFi", "Restoran", "Kahvaltı Dahil", "Deniz Manzarası"],
    discount: 5,
    description: "Karadeniz'in eşsiz manzarasına hakim, şehir merkezine yakın konumda otel.",
    stars: 4,
    type: "Standart Otel",
    breakfast: true,
    cancellationPolicy: 'Ücretsiz İptal'
  },
  {
    id: "7",
    name: "Izmir City Hotel",
    location: "İzmir",
    rating: 4.4,
    reviewCount: 654,
    price: 1100,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    features: ["Ücretsiz WiFi", "Restoran", "Kahvaltı Dahil", "Otopark"],
    isBestSeller: true,
    discount: 0,
    description: "İzmir'in iş ve alışveriş merkezine yakın, modern tasarımlı otel.",
    stars: 4,
    type: "Standart Otel",
    breakfast: true,
    cancellationPolicy: 'Ücretsiz İptal'
  },
  {
    id: "8",
    name: "Ankara Business Hotel",
    location: "Ankara",
    rating: 4.1,
    reviewCount: 432,
    price: 900,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    features: ["Ücretsiz WiFi", "Restoran", "Kahvaltı Dahil", "Otopark", "Fitness Merkezi"],
    discount: 8,
    description: "Ankara'nın iş merkezinde, toplantı ve konferans salonlarına sahip iş oteli.",
    stars: 4,
    type: "İş Oteli",
    breakfast: true,
    cancellationPolicy: 'Ücretsiz İptal'
  },
  {
    id: "9",
    name: "Fethiye Yacht Hotel",
    location: "Muğla",
    rating: 4.7,
    reviewCount: 543,
    price: 1900,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    features: ["Ücretsiz WiFi", "Havuz", "Spa", "Deniz Manzarası", "Kahvaltı Dahil", "Marina Manzaralı"],
    isBestSeller: true,
    discount: 0,
    description: "Fethiye Marina'ya yakın, yat turizmi için ideal konumda lüks otel.",
    stars: 5,
    type: "Lüks Otel",
    breakfast: true,
    cancellationPolicy: 'Ücretsiz İptal'
  },
  {
    id: "10",
    name: "Pamukkale Thermal Hotel",
    location: "Denizli",
    rating: 4.5,
    reviewCount: 387,
    price: 1300,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    features: ["Ücretsiz WiFi", "Spa", "Restoran", "Kahvaltı Dahil", "Termal Havuz"],
    discount: 12,
    description: "Pamukkale travertenlerine yakın, termal su kaynaklarına sahip otel.",
    stars: 4,
    type: "Termal Otel",
    breakfast: true,
    cancellationPolicy: 'Ücretsiz İptal'
  },
  {
    id: "11",
    name: "Rize Tea Garden Hotel",
    location: "Rize",
    rating: 4.4,
    reviewCount: 234,
    price: 950,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    features: ["Ücretsiz WiFi", "Çay Bahçesi", "Kahvaltı Dahil"],
    discount: 5,
    description: "Rize'nin çay bahçeleri arasında, doğayla iç içe butik otel.",
    stars: 4,
    type: "Butik Otel",
    breakfast: true,
    cancellationPolicy: 'Ücretsiz İptal'
  },
  {
    id: "12",
    name: "Trabzon Uzungöl Resort",
    location: "Trabzon",
    rating: 4.7,
    reviewCount: 189,
    price: 1400,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    features: ["Ücretsiz WiFi", "Spa", "Restoran", "Kahvaltı Dahil", "Göl Manzarası"],
    isBestSeller: true,
    discount: 0,
    description: "Uzungöl'ün eşsiz manzarasına hakim, doğayla iç içe resort otel.",
    stars: 5,
    type: "Lüks Otel",
    breakfast: true,
    cancellationPolicy: 'Ücretsiz İptal'
  }
];

interface FilterOptions {
  city: string | null;
  checkInDate: string | null;
  checkOutDate: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  stars: number[];
  features: string[];
  types: string[];
  ratings: string[];
  guests: number;
  priceRange: [number, number];
}

// Şehir eşleştirme fonksiyonu
const matchCity = (hotelCity: string, selectedCity: string) => {
  const normalizedHotelCity = hotelCity.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const normalizedSelectedCity = selectedCity.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  // Şehir eşleştirme kuralları
  const cityMapping: { [key: string]: string[] } = {
    'istanbul': ['istanbul', 'i̇stanbul'],
    'antalya': ['antalya'],
    'mugla': ['mugla', 'muğla', 'bodrum', 'fethiye'],
    'izmir': ['izmir', 'i̇zmir'],
    'nevsehir': ['nevsehir', 'nevşehir', 'kapadokya'],
    'sakarya': ['sakarya']
  };

  // Seçilen şehir için eşleşme kurallarını kontrol et
  if (cityMapping[normalizedSelectedCity]) {
    return cityMapping[normalizedSelectedCity].some(city => normalizedHotelCity.includes(city));
  }

  return normalizedHotelCity.includes(normalizedSelectedCity);
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const city = searchParams.get('city');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const guests = searchParams.get('guests');
  const filter = searchParams.get('filter') || 'all';

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    city: null,
    checkInDate: null,
    checkOutDate: null,
    minPrice: null,
    maxPrice: null,
    stars: [],
    features: [],
    types: [],
    ratings: [],
    guests: 2,
    priceRange: [0, 5000]
  });

  const resetFilters = () => {
    setFilterOptions({
      city: null,
      checkInDate: null,
      checkOutDate: null,
      minPrice: null,
      maxPrice: null,
      stars: [],
      features: [],
      types: [],
      ratings: [],
      guests: 2,
      priceRange: [0, 5000]
    });
  };

  // Otelleri filtrele
  const filteredHotels = dummyHotels.filter(hotel => {
    // Şehir filtresi
    if (filterOptions.city && filterOptions.city !== 'all') {
      if (!matchCity(hotel.location, filterOptions.city)) {
        return false;
      }
    }

    // Tarih filtresi
    if (filterOptions.checkInDate && filterOptions.checkOutDate) {
      // Tarih kontrolü burada yapılabilir
      // Şu an için sadece tarihlerin seçili olup olmadığını kontrol ediyoruz
    }

    // Fiyat aralığı filtresi
    if (filterOptions.minPrice !== null && hotel.price < filterOptions.minPrice) {
      return false;
    }
    if (filterOptions.maxPrice !== null && hotel.price > filterOptions.maxPrice) {
      return false;
    }

    // Yıldız filtresi
    if (filterOptions.stars.length > 0 && !filterOptions.stars.includes(hotel.stars)) {
      return false;
    }

    // Özellikler filtresi
    if (filterOptions.features.length > 0) {
      const hasAllFeatures = filterOptions.features.every(feature => 
        hotel.features.includes(feature)
      );
      if (!hasAllFeatures) return false;
    }

    // Konaklama türü filtresi
    if (filterOptions.types.length > 0 && !filterOptions.types.includes(hotel.type)) {
      return false;
    }

    // Misafir puanı filtresi
    if (filterOptions.ratings.length > 0) {
      const ratingThresholds: { [key: string]: number } = {
        'Harika (9+)': 9,
        'Çok İyi (8+)': 8,
        'İyi (7+)': 7,
        'Yeterli (6+)': 6
      };
      
      const hasMatchingRating = filterOptions.ratings.some(rating => 
        hotel.rating >= ratingThresholds[rating]
      );
      if (!hasMatchingRating) return false;
    }

    return true;
  }).map(hotel => ({
    ...hotel,
    checkInDate: checkIn || undefined,
    checkOutDate: checkOut || undefined,
    guests: guests ? parseInt(guests) : 2,
    oldPrice: hotel.oldPrice || hotel.price,
    description: `${hotel.name} ${hotel.location}'da konumlanmış, ${hotel.features.join(', ')} özelliklerine sahip bir oteldir.`,
    stars: Math.floor(hotel.rating),
    type: hotel.isBestSeller ? 'Lüks Otel' : 'Standart Otel',
    breakfast: hotel.features.includes('Kahvaltı Dahil'),
    cancellationPolicy: 'Ücretsiz İptal',
    discount: hotel.discount || 0
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px]">
        <Image
          src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Hotel Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              {city ? `${city} Otelleri` : 'Hayalinizdeki Tatili Keşfedin'}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              {filteredHotels.length} otel bulundu
            </p>
          </div>
        </div>
      </div>

      {/* Arama ve Filtreleme Kartı */}
      <div className="max-w-7xl mx-auto px-4 -mt-6 sm:-mt-8 md:-mt-12 mb-12 relative z-10">
        <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 border border-gray-100">
          <SearchBar cities={cities} />
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filtreler */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Filtreler</h2>
              
              {/* Harita */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Harita</h3>
                <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-sm text-gray-500">Harita yükleniyor...</p>
                </div>
              </div>

              {/* Fiyat Aralığı */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Fiyat Aralığı</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">₺{filterOptions.priceRange[0]}</span>
                    <span className="text-gray-500">₺{filterOptions.priceRange[1]}</span>
                  </div>
                  <Slider
                    min={0}
                    max={5000}
                    step={100}
                    value={filterOptions.priceRange}
                    onChange={(_, value) => setFilterOptions({ ...filterOptions, priceRange: value as [number, number] })}
                    className="w-full"
                    sx={{
                      color: '#2563eb',
                      '& .MuiSlider-thumb': {
                        backgroundColor: '#2563eb',
                      },
                      '& .MuiSlider-track': {
                        backgroundColor: '#2563eb',
                      },
                      '& .MuiSlider-rail': {
                        backgroundColor: '#e5e7eb',
                      },
                    }}
                  />
                </div>
              </div>

              {/* Yıldız Derecelendirmesi */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Yıldız Derecelendirmesi</h3>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <label key={stars} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filterOptions.stars.includes(stars)}
                        onChange={(e) => {
                          const newStars = e.target.checked
                            ? [...filterOptions.stars, stars]
                            : filterOptions.stars.filter((s) => s !== stars);
                          setFilterOptions({ ...filterOptions, stars: newStars });
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex items-center">
                        {[...Array(stars)].map((_, i) => (
                          <StarIconSolid key={i} className="h-4 w-4 text-yellow-400" />
                        ))}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Özellikler */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Özellikler</h3>
                <div className="space-y-2">
                  {featureIcons.map(({ feature }) => (
                    <label key={feature} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filterOptions.features.includes(feature)}
                        onChange={(e) => {
                          const newFeatures = e.target.checked
                            ? [...filterOptions.features, feature]
                            : filterOptions.features.filter((f) => f !== feature);
                          setFilterOptions({ ...filterOptions, features: newFeatures });
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Konaklama Tipleri */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Konaklama Tipi</h3>
                <div className="space-y-2">
                  {['Otel', 'Apart', 'Pansiyon', 'Villa', 'Termal Otel', 'Butik Otel', 'İş Oteli', 'Resort'].map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filterOptions.types.includes(type)}
                        onChange={(e) => {
                          const newTypes = e.target.checked
                            ? [...filterOptions.types, type]
                            : filterOptions.types.filter((t) => t !== type);
                          setFilterOptions({ ...filterOptions, types: newTypes });
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Misafir Puanı */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Misafir Puanı</h3>
                <div className="space-y-2">
                  {[9, 8, 7, 6].map((rating) => (
                    <label key={rating} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filterOptions.ratings.includes(rating.toString())}
                        onChange={(e) => {
                          const newRatings = e.target.checked
                            ? [...filterOptions.ratings, rating.toString()]
                            : filterOptions.ratings.filter((r) => r !== rating.toString());
                          setFilterOptions({ ...filterOptions, ratings: newRatings });
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{rating}+ Puan</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Otel Listesi */}
          <div className="flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} featureIcons={featureIcons} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 