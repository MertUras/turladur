"use client"
import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  ChevronDownIcon, 
  FunnelIcon, 
  ArrowPathIcon, 
  ArrowsUpDownIcon, 
  GlobeAltIcon, 
  UserGroupIcon, 
  CalendarDaysIcon, 
  HomeModernIcon, 
  TvIcon, 
  WifiIcon, 
  CheckBadgeIcon, 
  BanknotesIcon, 
  BuildingOfficeIcon, 
  ShieldCheckIcon, 
  HeartIcon, 
  StarIcon, 
  FireIcon, 
  SparklesIcon, 
  PresentationChartLineIcon,
  TagIcon,
  BellAlertIcon,
  CameraIcon,
  BeakerIcon,
  CakeIcon,
  SunIcon,
  MoonIcon,
  MinusIcon,
  PlusIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  CheckIcon,
  CloudIcon,
  TicketIcon
} from '@heroicons/react/24/outline';

import { 
  StarIcon as StarIconSolid,
  HeartIcon as HeartIconSolid,
  FireIcon as FireIconSolid,
  SparklesIcon as SparklesIconSolid,
  CheckBadgeIcon as CheckBadgeIconSolid
} from '@heroicons/react/24/solid';


// Simüle edilmiş oteller veritabanı
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
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
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
    image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80",
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
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2025&q=80",
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
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
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
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
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
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2080&q=80",
    features: ["Marina Manzarası", "Havuz", "Bar", "Ücretsiz Wi-Fi"],
    promotion: "Tekne Turu Hediye"
  },
  {
    id: 7,
    name: "Uludağ Mountain Resort",
    location: "Bursa, Türkiye",
    rating: 4.5,
    reviewCount: 128,
    price: 1350,
    oldPrice: 1600,
    discount: 16,
    image: "https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80",
    features: ["Kayak Merkezi", "Şömine", "Spa", "Restoran"],
    campaign: "Kış Fırsatı"
  },
  {
    id: 8,
    name: "Alaçatı Butik Otel",
    location: "İzmir, Türkiye",
    rating: 4.9,
    reviewCount: 89,
    price: 1550,
    oldPrice: 1900,
    discount: 18,
    image: "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    features: ["Bahçe", "Kahvaltı", "Bisiklet Kiralama", "Ücretsiz Wi-Fi"],
    promotion: "Çiftlere Özel"
  }
];

// Özellik filtreleri için ikonlar
const featureFilters = [
  { id: 'wifi', label: 'Ücretsiz Wi-Fi', icon: <WifiIcon className="w-4 h-4" /> },
  { id: 'pool', label: 'Havuz', icon: <BeakerIcon className="w-4 h-4" /> },
  { id: 'breakfast', label: 'Kahvaltı Dahil', icon: <CakeIcon className="w-4 h-4" /> },
  { id: 'spa', label: 'Spa', icon: <SparklesIcon className="w-4 h-4" /> },
  { id: 'sea-view', label: 'Deniz Manzaralı', icon: <CameraIcon className="w-4 h-4" /> },
  { id: 'all-inclusive', label: 'Her Şey Dahil', icon: <CheckBadgeIcon className="w-4 h-4" /> },
  { id: 'kids-friendly', label: 'Çocuk Dostu', icon: <UserGroupIcon className="w-4 h-4" /> },
  { id: 'bar', label: 'Bar', icon: <BeakerIcon className="w-4 h-4" /> },
];

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

// Popüler filtreler
const popularFilters = [
  { id: 'discount', label: 'İndirimli Oteller', icon: <TagIcon className="w-4 h-4" /> },
  { id: 'bestseller', label: 'En Çok Satanlar', icon: <FireIconSolid className="w-4 h-4" /> },
  { id: 'new', label: 'Yeni Eklenenler', icon: <BellAlertIcon className="w-4 h-4" /> },
  { id: 'sea-view', label: 'Deniz Manzaralı', icon: <CameraIcon className="w-4 h-4" /> },
];

// Özellik ikonları için yardımcı fonksiyon
const getFeatureIcon = (feature: string) => {
  const featureLower = feature.toLowerCase();
  
  if (featureLower.includes('deniz') || featureLower.includes('manzara')) {
    return <CameraIcon className="w-3.5 h-3.5 text-blue-500" />;
  } else if (featureLower.includes('wifi') || featureLower.includes('internet') || featureLower.includes('wi-fi')) {
    return <WifiIcon className="w-3.5 h-3.5 text-blue-500" />;
  } else if (featureLower.includes('havuz')) {
    return <BeakerIcon className="w-3.5 h-3.5 text-blue-500" />;
  } else if (featureLower.includes('spa') || featureLower.includes('masaj')) {
    return <SparklesIcon className="w-3.5 h-3.5 text-blue-500" />;
  } else if (featureLower.includes('restoran') || featureLower.includes('kahvaltı') || featureLower.includes('yemek')) {
    return <CakeIcon className="w-3.5 h-3.5 text-blue-500" />;
  } else if (featureLower.includes('tv') || featureLower.includes('televizyon')) {
    return <TvIcon className="w-3.5 h-3.5 text-blue-500" />;
  } else if (featureLower.includes('teras') || featureLower.includes('balkon')) {
    return <HomeModernIcon className="w-3.5 h-3.5 text-blue-500" />;
  } else if (featureLower.includes('klima') || featureLower.includes('ısıtma')) {
    return <SunIcon className="w-3.5 h-3.5 text-blue-500" />;
  } else if (featureLower.includes('ücretsiz') || featureLower.includes('bedava')) {
    // Eğer ücretsiz Wi-Fi ise, Wi-Fi ikonunu kullan
    if (featureLower.includes('wifi') || featureLower.includes('wi-fi') || featureLower.includes('internet')) {
      return <WifiIcon className="w-3.5 h-3.5 text-blue-500" />;
    }
    return <TagIcon className="w-3.5 h-3.5 text-blue-500" />;
  } else if (featureLower.includes('bar')) {
    return <BeakerIcon className="w-3.5 h-3.5 text-blue-500" />;
  } else if (featureLower.includes('çocuk') || featureLower.includes('cocuk')) {
    return <UserGroupIcon className="w-3.5 h-3.5 text-blue-500" />;
  } else if (featureLower.includes('spor') || featureLower.includes('salon')) {
    return <BuildingOfficeIcon className="w-3.5 h-3.5 text-blue-500" />;
  } else if (featureLower.includes('marina')) {
    return <CloudIcon className="w-3.5 h-3.5 text-blue-500" />;
  } else if (featureLower.includes('her şey') || featureLower.includes('her sey') || featureLower.includes('dahil')) {
    return <CheckBadgeIcon className="w-3.5 h-3.5 text-blue-500" />;
  } else if (featureLower.includes('aquapark') || featureLower.includes('su park')) {
    return <BeakerIcon className="w-3.5 h-3.5 text-blue-500" />;
  } else {
    return <CheckIcon className="w-3.5 h-3.5 text-blue-500" />;
  }
};

export default function HotelsPage() {
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null
  });

  // Filtrelenmiş otelleri hesapla
  const filteredHotels = useMemo(() => {
    return hotels.filter(hotel => {
      // Şehir filtresi
      if (selectedCity !== 'all' && !hotel.location.toLowerCase().includes(selectedCity)) {
        return false;
      }

      // Fiyat aralığı filtresi
      if (selectedPriceRange !== 'all') {
        const price = hotel.price;
        switch (selectedPriceRange) {
          case 'low':
            if (price > 1000) return false;
            break;
          case 'medium':
            if (price < 1000 || price > 2000) return false;
            break;
          case 'high':
            if (price < 2000 || price > 3000) return false;
            break;
          case 'luxury':
            if (price < 3000) return false;
            break;
        }
      }

      // Özellik filtresi
      if (selectedFeatures.length > 0) {
        const hasAllFeatures = selectedFeatures.every(feature =>
          hotel.features.some(f => f.toLowerCase().includes(feature.toLowerCase()))
        );
        if (!hasAllFeatures) return false;
      }

      // Arama filtresi
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        return (
          hotel.name.toLowerCase().includes(searchLower) ||
          hotel.location.toLowerCase().includes(searchLower) ||
          hotel.features.some(f => f.toLowerCase().includes(searchLower))
        );
      }

      return true;
    }).sort((a, b) => {
      switch (selectedSort) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'discount':
          return (b.discount || 0) - (a.discount || 0);
        default:
          return b.reviewCount - a.reviewCount;
      }
    });
  }, [hotels, selectedCity, selectedPriceRange, selectedFeatures, selectedSort, searchQuery]);

  // Filtreleri temizle
  const clearFilters = () => {
    setSelectedCity('all');
    setSelectedPriceRange('all');
    setSelectedFeatures([]);
    setSearchQuery('');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Lüks otel odası manzarası"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
        
        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container px-4 text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Profesyonel Konaklama Deneyimi
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
              Türkiye'nin seçkin otellerinde ayrıcalıklı bir tatil için rezervasyonunuzu hemen yapın.
            </p>
            
            {/* Arama ve Filtreleme Kartı */}
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto transform translate-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Konum */}
                <div>
                  <label className="text-gray-700 font-semibold block text-left text-sm mb-1">Konum</label>
                  <div className="relative">
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 appearance-none bg-white text-gray-800"
                    >
                      {cities.map(city => (
                        <option key={city.id} value={city.id}>{city.label}</option>
                      ))}
                    </select>
                    <MapPinIcon className="w-5 h-5 text-blue-600 absolute left-2.5 top-2.5" />
                    <ChevronDownIcon className="w-4 h-4 text-gray-500 absolute right-2.5 top-3" />
                  </div>
                </div>

                {/* Tarih Aralığı */}
                <div>
                  <label className="text-gray-700 font-semibold block text-left text-sm mb-1">Tarih</label>
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-800"
                    />
                    <CalendarDaysIcon className="w-5 h-5 text-blue-600 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                {/* Misafir Sayısı */}
                <div>
                  <label className="text-gray-700 font-semibold block text-left text-sm mb-1">Misafir</label>
                  <div className="relative">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                        className="px-3 py-2.5 hover:bg-gray-100 text-gray-700 transition-colors"
                      >
                        <MinusIcon className="w-4 h-4" />
                      </button>
                      <div className="flex-1 text-center font-medium text-gray-800 py-2">
                        {guestCount} Kişi
                      </div>
                      <button
                        onClick={() => setGuestCount(guestCount + 1)}
                        className="px-3 py-2.5 hover:bg-gray-100 text-gray-700 transition-colors"
                      >
                        <PlusIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <UserGroupIcon className="w-5 h-5 text-blue-600 absolute left-2.5 top-2.5 hidden" />
                  </div>
                </div>

                {/* Arama Butonu */}
                <div className="flex items-end">
                  <button className="w-full bg-blue-700 hover:bg-blue-800 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 shadow-md">
                    <MagnifyingGlassIcon className="w-5 h-5" />
                    Ara
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="container px-4 py-24">
        {/* Aktif Filtreler */}
        <div className="flex flex-wrap items-center gap-2 mb-6 mt-4">
          {selectedCity !== 'all' && (
            <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5">
              <MapPinIcon className="w-4 h-4" />
              {cities.find(c => c.id === selectedCity)?.label}
              <button onClick={() => setSelectedCity('all')} className="ml-1 text-blue-500 hover:text-blue-700">
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          )}
          
          {selectedPriceRange !== 'all' && (
            <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5">
              <BanknotesIcon className="w-4 h-4" />
              {priceRanges.find(p => p.id === selectedPriceRange)?.label}
              <button onClick={() => setSelectedPriceRange('all')} className="ml-1 text-blue-500 hover:text-blue-700">
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          )}
          
          {selectedFeatures.map(feature => (
            <div key={feature} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5">
              <CheckIcon className="w-4 h-4" />
              {featureFilters.find(f => f.id === feature)?.label}
              <button 
                onClick={() => setSelectedFeatures(selectedFeatures.filter(f => f !== feature))} 
                className="ml-1 text-blue-500 hover:text-blue-700"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          {(selectedCity !== 'all' || selectedPriceRange !== 'all' || selectedFeatures.length > 0) && (
            <button 
              onClick={clearFilters}
              className="text-gray-600 hover:text-gray-800 text-sm font-medium flex items-center gap-1.5 ml-2"
            >
              <ArrowPathIcon className="w-4 h-4" />
              Filtreleri Temizle
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sol Sidebar - Filtreler */}
          <div className="lg:col-span-1 space-y-6">
            {/* Mobil Filtre Butonu */}
            <div className="lg:hidden mb-4">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg py-3 px-4 text-gray-700 font-medium shadow-sm"
              >
                <AdjustmentsHorizontalIcon className="w-5 h-5" />
                Filtreleri {showFilters ? 'Gizle' : 'Göster'}
                {activeFilters > 0 && (
                  <span className="bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFilters}
                  </span>
                )}
              </button>
            </div>

            {/* Filtreler (Mobilde Gizlenebilir) */}
            <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              {/* Arama */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MagnifyingGlassIcon className="w-5 h-5 text-blue-600" />
                  Otel Ara
                </h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Otel adı veya özellik ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  />
                  <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* Popüler Filtreler */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FireIconSolid className="w-5 h-5 text-blue-600" />
                  Popüler Filtreler
                </h3>
                <div className="space-y-2">
                  {popularFilters.map(filter => (
                    <button
                      key={filter.id}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-blue-50 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <div className="text-blue-600 group-hover:text-blue-700">{filter.icon}</div>
                        <span className="text-gray-700 group-hover:text-blue-700 font-medium">{filter.label}</span>
                      </div>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full group-hover:bg-blue-100 group-hover:text-blue-700">142</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Fiyat Aralığı */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <BanknotesIcon className="w-5 h-5 text-blue-600" />
                  Fiyat Aralığı
                </h3>
                <div className="space-y-3">
                  {priceRanges.map(range => (
                    <label
                      key={range.id}
                      className="flex items-center gap-3 cursor-pointer hover:bg-blue-50 p-2 rounded-lg transition-colors"
                    >
                      <div className="relative flex items-center justify-center">
                        <input
                          type="radio"
                          name="priceRange"
                          value={range.id}
                          checked={selectedPriceRange === range.id}
                          onChange={(e) => setSelectedPriceRange(e.target.value)}
                          className="text-blue-600 focus:ring-blue-500 h-5 w-5"
                        />
                      </div>
                      <span className="text-gray-700 font-medium">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Özellikler */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckBadgeIconSolid className="w-5 h-5 text-blue-600" />
                  Otel Özellikleri
                </h3>
                <div className="space-y-3">
                  {featureFilters.map(feature => (
                    <label
                      key={feature.id}
                      className="flex items-center gap-3 cursor-pointer hover:bg-blue-50 p-2 rounded-lg transition-colors"
                    >
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          value={feature.id}
                          checked={selectedFeatures.includes(feature.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedFeatures([...selectedFeatures, feature.id]);
                            } else {
                              setSelectedFeatures(selectedFeatures.filter(f => f !== feature.id));
                            }
                          }}
                          className="text-blue-600 focus:ring-blue-500 rounded h-5 w-5"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-blue-600">{feature.icon}</div>
                        <span className="text-gray-700 font-medium">{feature.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Taraf - Otel Listesi */}
          <div className="lg:col-span-3">
            {/* Üst Bar */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <BuildingOfficeIcon className="w-5 h-5 text-blue-600" />
                    {filteredHotels.length} Otel Bulundu
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {selectedCity !== 'all' ? cities.find(c => c.id === selectedCity)?.label : 'Tüm Şehirler'}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-gray-700 text-sm font-medium">Sırala:</span>
                  <div className="relative">
                    <select
                      value={selectedSort}
                      onChange={(e) => setSelectedSort(e.target.value)}
                      className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 appearance-none bg-white text-gray-800"
                    >
                      {sortOptions.map(option => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon className="w-4 h-4 text-gray-500 absolute right-2.5 top-2.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Otel Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
              {filteredHotels.map((hotel) => (
                <Link 
                  href={`/hotel/${hotel.id}`} 
                  key={hotel.id}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full transform hover:-translate-y-1"
                >
                  <div className="relative h-64">
                    <Image
                      src={hotel.image}
                      alt={hotel.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    
                    {/* Discount Badge */}
                    {hotel.discount && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-md flex items-center gap-1 shadow-md">
                          <FireIconSolid className="w-3.5 h-3.5" />
                          %{hotel.discount} İndirim
                        </span>
                      </div>
                    )}
                    
                    {/* Promotion Label */}
                    {hotel.promotion && (
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="bg-blue-600/90 backdrop-blur-sm text-white text-sm py-1.5 px-3 rounded-lg font-medium shadow-md flex items-center gap-1.5 justify-center">
                          <SparklesIconSolid className="w-4 h-4 text-yellow-300" />
                          {hotel.promotion}
                        </div>
                      </div>
                    )}
                    
                    {/* Favori Butonu */}
                    <button className="absolute top-3 left-3 p-2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full shadow-md text-gray-600 hover:text-red-500 transition-colors">
                      <HeartIcon className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {hotel.name}
                      </h3>
                      <div className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        <StarIconSolid className="w-4 h-4 text-yellow-400" />
                        <span className="ml-1 font-semibold">{hotel.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm flex items-center mb-2">
                      <MapPinIcon className="w-4 h-4 mr-1 text-blue-500 flex-shrink-0" />
                      {hotel.location}
                    </p>
                    
                    <div className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                      <StarIconSolid className="w-3 h-3 text-yellow-400" />
                      <span className="font-medium text-gray-700">{hotel.rating}</span>
                      <span>({hotel.reviewCount} değerlendirme)</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {hotel.features.map((feature, i) => (
                        <span key={i} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-md border border-gray-100 flex items-center gap-1">
                          {getFeatureIcon(feature)}
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <div className="flex items-end justify-between">
                        <div>
                          {hotel.oldPrice && (
                            <span className="text-sm text-gray-400 line-through mr-2">
                              {hotel.oldPrice.toLocaleString('tr-TR')} ₺
                            </span>
                          )}
                          <span className="text-xl font-bold text-gray-900">
                            {hotel.price.toLocaleString('tr-TR')} ₺
                          </span>
                          <span className="text-gray-500 text-xs block">gecelik</span>
                        </div>
                        <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center gap-1.5">
                          <CheckBadgeIconSolid className="w-4 h-4" />
                          İncele
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Sayfalama */}
            <div className="mt-10 flex justify-center">
              <div className="flex items-center gap-2">
                <button className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors">
                  <ChevronDownIcon className="w-5 h-5 rotate-90" />
                </button>
                <button className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-medium">1</button>
                <button className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors">2</button>
                <button className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors">3</button>
                <span className="text-gray-500">...</span>
                <button className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors">8</button>
                <button className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors">
                  <ChevronDownIcon className="w-5 h-5 -rotate-90" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
