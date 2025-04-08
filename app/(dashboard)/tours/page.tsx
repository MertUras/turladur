"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { dummyTours, dummyTourOperators } from "@/app/lib/dummy-data";
import { parseJsonString } from "@/app/utils/format";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Star, 
  Search, 
  Filter,
  ChevronDown,
  Check,
  X,
  ChevronRight,
  SlidersHorizontal,
  ArrowDownWideNarrow,
  Loader2
} from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface Tour {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  discount: number;
  startDate: Date;
  endDate: Date;
  maxParticipants: number;
  currentParticipants: number;
  departureCity: string;
  region: string;
  transportation: string;
  period: string;
  destinations: string;
  inclusions: string;
  exclusions: string;
  itinerary: string;
  images: string;
  features: string;
  rating: number;
  reviews: number;
  featured: boolean;
  isJointTour: boolean;
  createdAt: Date;
  updatedAt: Date;
  tourOperatorId: string;
  experienceType?: string;
}

interface FilterOptions {
  departureCity: string | null;
  region: string | null;
  transportation: string | null;
  duration: string | null;
  period: string | null;
  priceRange: [number, number];
  featured: boolean;
  month: string | null;
  remainingDays: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  experienceType: string | null;
}

export default function ToursPage() {
  const searchParams = useSearchParams();
  const experienceTypeParam = searchParams.get('experienceType');
  const durationParam = searchParams.get('duration');
  const featuredParam = searchParams.get('featured');
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [sortBy, setSortBy] = useState('popular'); // popular, price-low, price-high, duration
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    departureCity: null,
    region: null,
    transportation: null,
    duration: null,
    period: null,
    priceRange: [0, 10000],
    featured: false,
    month: null,
    remainingDays: null,
    minPrice: null,
    maxPrice: null,
    experienceType: null
  });

  // Sayfalama ve gösterim seçenekleri
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [isLoading, setIsLoading] = useState(false);

  const [loadingMore, setLoadingMore] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filtreleme seçenekleri
  const departureCities = [
    { city: 'İstanbul', count: 1 },
    { city: 'Ankara', count: 1 },
    { city: 'İzmir', count: 2 },
    { city: 'Antalya', count: 1 },
    { city: 'Bursa', count: 1 },
    { city: 'Trabzon', count: 1 },
    { city: 'Nevşehir', count: 1 },
    { city: 'Denizli', count: 1 },
    { city: 'Mardin', count: 1 },
    { city: 'Van', count: 1 },
    { city: 'Gaziantep', count: 1 },
    { city: 'Konya', count: 1 },
    { city: 'Çanakkale', count: 1 },
    { city: 'Muğla', count: 1 },
    { city: 'Aydın', count: 1 },
    { city: 'Rize', count: 1 },
    { city: 'Karabük', count: 1 },
    { city: 'Adıyaman', count: 1 },
    { city: 'Şanlıurfa', count: 1 }
  ];
  
  const regions = [
    { region: 'Marmara', count: 2 },
    { region: 'Ege', count: 3 },
    { region: 'Akdeniz', count: 2 },
    { region: 'İç Anadolu', count: 4 },
    { region: 'Karadeniz', count: 2 },
    { region: 'Doğu Anadolu', count: 2 },
    { region: 'Güneydoğu Anadolu', count: 2 }
  ];
  
  const transportationTypes = [
    { type: 'Uçak', count: 3 },
    { type: 'Otobüs', count: 8 },
    { type: 'Tren', count: 2 },
    { type: 'Uçak + Otobüs', count: 4 },
    { type: 'Uçak + Tren', count: 1 }
  ];
  
  const durations = [
    { duration: '1 Gün', count: 6 },
    { duration: '2 Gün', count: 8 },
    { duration: '3 Gün', count: 4 },
    { duration: '4 Gün', count: 1 },
    { duration: '5 Gün', count: 1 }
  ];
  
  const periods = [
    { period: 'Nisan 2024', count: 3 },
    { period: 'Mayıs 2024', count: 4 },
    { period: 'Haziran 2024', count: 5 },
    { period: 'Temmuz 2024', count: 4 },
    { period: 'Ağustos 2024', count: 4 }
  ];

  // Deneyim Türleri
  const experienceTypes = [
    { type: "havacilik", name: "Havacılık", count: 8 },
    { type: "su-sporlari", name: "Su Sporları", count: 12 },
    { type: "doga-yuruyusu", name: "Doğa Yürüyüşü", count: 15 },
    { type: "su-alti", name: "Su Altı", count: 6 },
    { type: "kis-sporlari", name: "Kış Sporları", count: 10 },
    { type: "kultur", name: "Kültür", count: 20 },
    { type: "gastronomi", name: "Gastronomi", count: 14 },
    { type: "ekstrem", name: "Ekstrem", count: 9 }
  ];

  // Sayfalama seçenekleri
  const pageSizeOptions = [9, 18, 27, 36];

  // URL'den gelen deneyim türü parametresini kontrol et ve filtre seçeneğini güncelle
  useEffect(() => {
    if (experienceTypeParam) {
      const matchedType = experienceTypes.find(type => 
        type.type === experienceTypeParam
      );
      if (matchedType) {
        setFilterOptions(prev => ({
          ...prev,
          experienceType: matchedType.type
        }));
        
        // Otomatik olarak filtre bölümüne scroll
        const filterSection = document.getElementById('experience-filters');
        if (filterSection) {
          setTimeout(() => {
            filterSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 500);
        }
      }
    }
  }, [experienceTypeParam]);

  useEffect(() => {
    // API isteği simülasyonu
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = [...dummyTours];
    
    // Fiyat filtresi
    if (filterOptions.minPrice !== null && filterOptions.maxPrice !== null) {
      filtered = filtered.filter(tour => 
        tour.price >= filterOptions.minPrice! && 
        tour.price <= filterOptions.maxPrice!
      );
    }
    
    // Diğer filtreler
    if (filterOptions.departureCity) {
      filtered = filtered.filter(tour => tour.departureCity === filterOptions.departureCity);
    }
    if (filterOptions.region) {
      filtered = filtered.filter(tour => tour.region === filterOptions.region);
    }
    if (filterOptions.transportation) {
      filtered = filtered.filter(tour => tour.transportation === filterOptions.transportation);
    }
    if (filterOptions.duration) {
      filtered = filtered.filter(tour => tour.duration.toString() === filterOptions.duration);
    }
    if (filterOptions.period) {
      filtered = filtered.filter(tour => tour.period === filterOptions.period);
    }
    if (filterOptions.featured) {
      filtered = filtered.filter(tour => tour.featured);
    }
    if (filterOptions.experienceType) {
      filtered = filtered.filter(tour => tour.experienceType === filterOptions.experienceType);
    }
    
    // Sıralama
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'duration':
        filtered.sort((a, b) => a.duration - b.duration);
        break;
      default: // popular
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }
    
    setFilteredTours(filtered as Tour[]);
  }, [filterOptions, sortBy]);

  // Filtreleri sıfırla
  const resetFilters = () => {
    setSearchTerm("");
    setFilterOptions({
      departureCity: null,
      region: null,
      transportation: null,
      duration: null,
      period: null,
      priceRange: [0, 10000],
      featured: false,
      month: null,
      remainingDays: null,
      minPrice: null,
      maxPrice: null,
      experienceType: null
    });
    setSortBy("popular");
  };

  // Sayfalama için hesaplamalar
  const totalItems = filteredTours.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentTours = filteredTours.slice(startIndex, endIndex);

  // Sayfa değiştirme fonksiyonu
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Bölümü */}
      <div className="relative bg-gradient-to-r from-blue-700 to-blue-900 pt-28 pb-12 md:pb-20">
        <div className="absolute inset-0 opacity-10 overflow-hidden">
          <div className="absolute inset-0 bg-repeat" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'2\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'2\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center bg-blue-900/30 backdrop-blur-sm text-blue-100 rounded-full py-1.5 px-4 text-xs font-medium mb-4">
              <span className="w-2 h-2 bg-blue-200 rounded-full mr-2"></span>
              En İyi Tur Deneyimleri
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Türkiye'nin En İyi Turları
            </h1>
            <p className="text-lg text-blue-100 md:px-8 mb-8">
              Profesyonel rehberler eşliğinde, en iyi tur operatörlerinin özenle hazırladığı tur paketleri ile unutulmaz deneyimler yaşayın.
            </p>
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-0 bg-blue-400 blur-xl opacity-20 rounded-xl"></div>
              <div className="relative flex bg-white rounded-xl p-1.5 shadow-xl">
                <div className="flex-1 flex items-center pl-3">
                  <Search className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Tur adı, destinasyon veya aktivite ara..."
                    className="w-full py-3 px-2 outline-none text-gray-700 bg-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm("")}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-5 py-3 transition-colors flex items-center"
                  onClick={() => {
                    // Zaten sayfadayız, sadece filtreleri uygula
                    setLoading(true);
                    setTimeout(() => setLoading(false), 500);
                  }}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Ara
                </button>
              </div>
            </div>
          </div>
          
          {/* İstatistikler */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-12 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-white mb-1">100+</div>
              <div className="text-sm text-blue-100">Tur Rotası</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-white mb-1">50+</div>
              <div className="text-sm text-blue-100">Tur Operatörü</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-white mb-1">4.8/5</div>
              <div className="text-sm text-blue-100">Müşteri Puanı</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-white mb-1">24/7</div>
              <div className="text-sm text-blue-100">Müşteri Desteği</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Mobil Filtre Kontrolleri */}
        <div className="lg:hidden flex justify-between items-center mb-6">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center gap-2 bg-white py-2.5 px-4 rounded-lg shadow-sm border border-gray-200"
          >
            <SlidersHorizontal className="h-4 w-4 text-gray-500" />
            <span className="font-medium text-gray-700">Filtreler</span>
            {Object.values(filterOptions).some(value => value !== null && value !== false) && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                {Object.values(filterOptions).filter(value => value !== null && value !== false).length}
              </span>
            )}
          </button>
          
          <div className="relative">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sırala:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg py-2.5 pl-4 pr-10 text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              >
                <option value="popular">Popülerlik</option>
                <option value="price-low">Fiyat: Düşük - Yüksek</option>
                <option value="price-high">Fiyat: Yüksek - Düşük</option>
                <option value="duration">Süre</option>
              </select>
              <ArrowDownWideNarrow className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>
        
        {/* Filtreler ve Kategoriler */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tüm Turlar</h1>
          <div className="h-1 w-16 bg-blue-600 mt-2"></div>
          <div className="h-3"></div>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Tur Listesi */}
          <div className="lg:w-3/4">
            {/* Aktif Filtreler */}
            {Object.values(filterOptions).some(value => value !== null && value !== false) && (
              <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-600">Aktif Filtreler:</span>
                      {Object.entries(filterOptions).map(([key, value]) => {
                        if (!value || key === 'priceRange') return null;
                        return (
                          <div key={key} className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                            <span className="text-sm text-gray-600">{key}: {value}</span>
                            <button
                              onClick={() => setFilterOptions({...filterOptions, [key as keyof FilterOptions]: null})}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600">Sırala:</span>
                        <select className="text-sm border rounded-md px-2 py-1 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option>Popülerlik</option>
                          <option>Fiyat (Artan)</option>
                          <option>Fiyat (Azalan)</option>
                          <option>Değerlendirme</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600">Sayfa Başına:</span>
                        <select className="text-sm border rounded-md px-2 py-1 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option>9 Tur</option>
                          <option>12 Tur</option>
                          <option>15 Tur</option>
                          <option>18 Tur</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Tur Listesi */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                    <div className="h-52 bg-gray-200"></div>
                    <div className="p-5 space-y-3">
                      <div className="flex justify-between">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="flex gap-2">
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <div className="h-6 bg-gray-200 rounded w-24"></div>
                        <div className="h-8 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredTours.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <div className="mx-auto w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Tur bulunamadı</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">Arama kriterlerinize uygun tur bulunamadı. Farklı filtreler deneyebilir veya tüm filtreleri temizleyebilirsiniz.</p>
                <button
                  onClick={resetFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg inline-flex items-center transition-colors"
                >
                  Tüm filtreleri temizle
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4 flex justify-between items-center">
                  <h2 className="text-base font-medium text-gray-700">
                    <span className="text-blue-600 font-semibold">{totalItems}</span> tur arasından <span className="text-blue-600 font-semibold">{currentTours.length}</span> tanesi gösteriliyor
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentTours.map((tour) => {
                    const tourImages = parseJsonString<string[]>(tour.images, []);
                    const destinations = parseJsonString<string[]>(tour.destinations, []);
                    const tourOperator = dummyTourOperators.find(op => op.id === tour.tourOperatorId);
                    const remainingSpots = tour.maxParticipants - (tour.currentParticipants || 0);
                    const startDate = new Date(tour.startDate || new Date());
                    
                    // İndirimli fiyat hesaplama
                    const discountedPrice = tour.discount 
                      ? tour.price * (1 - tour.discount / 100) 
                      : tour.price;
                    
                    return (
                      <div 
                        key={tour.id} 
                        className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300 flex flex-col"
                      >
                        <div className="relative h-64 overflow-hidden">
                          <div className="relative w-full h-full">
                            <Image
                              src={tourImages[0] || '/images/tours/default.jpg'}
                              alt={tour.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              priority={true}
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                          
                          {/* Tur Durumu Etiketleri */}
                          <div className="absolute top-4 right-4 flex flex-col gap-2">
                            {tour.discount > 0 && (
                              <div className="bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-lg shadow-md">
                                %{tour.discount} İndirim
                              </div>
                            )}
                            {remainingSpots <= 5 && remainingSpots > 0 && (
                              <div className="bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-lg shadow-md">
                                Son {remainingSpots} yer
                              </div>
                            )}
                            {remainingSpots === 0 && (
                              <div className="bg-gray-600 text-white text-xs font-semibold px-3 py-1 rounded-lg shadow-md">
                                Dolu
                              </div>
                            )}
                          </div>
                          
                          {/* Tur Operatörü ve Destinasyon Bilgisi */}
                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full overflow-hidden mr-2 border-2 border-white">
                                  <Image
                                    src={tourOperator?.logo || '/images/tour-operators/default.jpg'}
                                    alt={tourOperator?.name || 'Tur Operatörü'}
                                    width={32}
                                    height={32}
                                    className="object-cover"
                                  />
                                </div>
                                <span className="text-white text-sm font-medium">{tourOperator?.name}</span>
                              </div>
                              {tour.isJointTour && (
                                <div className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                                  Ortak Tur
                                </div>
                              )}
                            </div>
                            <div className="flex items-center text-white/90 text-sm">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span className="truncate">{destinations.join(', ')}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-5 flex-grow flex flex-col">
                          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {tour.name}
                          </h3>
                          
                          {/* En Önemli 4 Bilgi */}
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center text-gray-600">
                              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                                <Calendar className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="text-xs text-gray-500">Tarih</div>
                                <div className="text-sm font-medium">
                                  {startDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center text-gray-600">
                              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mr-3">
                                <Clock className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <div className="text-xs text-gray-500">Süre</div>
                                <div className="text-sm font-medium">{tour.duration} gün</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center text-gray-600">
                              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mr-3">
                                <Users className="h-5 w-5 text-amber-600" />
                              </div>
                              <div>
                                <div className="text-xs text-gray-500">Kalan Yer</div>
                                <div className="text-sm font-medium">{remainingSpots} kişi</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center text-gray-600">
                              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mr-3">
                                <Star className="h-5 w-5 text-purple-600" />
                              </div>
                              <div>
                                <div className="text-xs text-gray-500">Puan</div>
                                <div className="text-sm font-medium">4.8/5 (128)</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-auto flex items-center justify-between">
                            <div>
                              {tour.discount > 0 && (
                                <span className="text-gray-500 text-sm line-through mr-2">
                                  ₺{tour.price.toLocaleString()}
                                </span>
                              )}
                              <span className="text-xl font-bold text-blue-600">
                                ₺{discountedPrice.toLocaleString()}
                              </span>
                              <span className="text-gray-500 text-sm">/kişi</span>
                            </div>
                            <Link
                              href={`/tour/${tour.id}`}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors inline-flex items-center"
                            >
                              İncele
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Sayfalama ve Bilgi */}
                <div className="mt-8 flex flex-col items-center gap-4">
                  {/* Sayfa Numaraları */}
                  {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 border rounded-md hover:bg-gray-100 disabled:opacity-50 text-gray-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 rounded-md ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'border hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 border rounded-md hover:bg-gray-100 disabled:opacity-50 text-gray-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Sayfalama Bilgisi */}
                  <div className="text-sm text-gray-600">
                    {totalItems > 0 ? (
                      <>
                        Toplam <span className="font-semibold text-gray-800">{totalItems}</span> tur arasından{' '}
                        <span className="font-semibold text-gray-800">{startIndex + 1}-{endIndex}</span> arası gösteriliyor
                      </>
                    ) : (
                      <span className="text-gray-500">Gösterilecek tur bulunamadı</span>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Filtreler */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-24">
              <div className="bg-gray-50 border-b border-gray-100 py-4 px-6 flex justify-between items-center">
                <h3 className="font-bold text-gray-900 flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-blue-600" />
                  Filtreler
                </h3>
                <button 
                  onClick={resetFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <X className="h-4 w-4 mr-1" />
                  Filtreleri Temizle
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Hareket Noktası */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Hareket Noktası</h4>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Şehir ara..."
                      className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-gray-700 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mb-2"
                    />
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {departureCities.map((item) => (
                        <button
                          key={item.city}
                          onClick={() => setFilterOptions({
                            ...filterOptions,
                            departureCity: filterOptions.departureCity === item.city ? null : item.city
                          })}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            filterOptions.departureCity === item.city
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {item.city} ({item.count})
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Deneyim Türü - YENİ EKLENEN */}
                <div id="experience-filters">
                  <h4 className="font-medium text-gray-900 mb-3">Deneyim Türü</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {experienceTypes.map((item) => (
                      <button
                        key={item.type}
                        onClick={() => setFilterOptions({
                          ...filterOptions,
                          experienceType: filterOptions.experienceType === item.type ? null : item.type
                        })}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          filterOptions.experienceType === item.type
                            ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {item.name} ({item.count})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bölge */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Bölge</h4>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Bölge ara..."
                      className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-gray-700 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mb-2"
                    />
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {regions.map((item) => (
                        <button
                          key={item.region}
                          onClick={() => setFilterOptions({
                            ...filterOptions,
                            region: filterOptions.region === item.region ? null : item.region
                          })}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            filterOptions.region === item.region
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {item.region} ({item.count})
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Ulaşım Tipi */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Ulaşım Tipi</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {transportationTypes.map((item) => (
                      <button
                        key={item.type}
                        onClick={() => setFilterOptions({
                          ...filterOptions,
                          transportation: filterOptions.transportation === item.type ? null : item.type
                        })}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          filterOptions.transportation === item.type
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {item.type} ({item.count})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tur Süresi */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Tur Süresi</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {durations.map((item) => (
                      <button
                        key={item.duration}
                        onClick={() => setFilterOptions({
                          ...filterOptions,
                          duration: filterOptions.duration === item.duration ? null : item.duration
                        })}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          filterOptions.duration === item.duration
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {item.duration} ({item.count})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dönem */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Dönem</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {periods.map((item) => (
                      <button
                        key={item.period}
                        onClick={() => setFilterOptions({
                          ...filterOptions,
                          month: filterOptions.month === item.period ? null : item.period
                        })}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          filterOptions.month === item.period
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {item.period} ({item.count})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fiyat Aralığı */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Fiyat Aralığı</h4>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="₺ Min"
                        className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-gray-700 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        value={filterOptions.minPrice ? filterOptions.minPrice.toLocaleString('tr-TR') : ''}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d]/g, '');
                          setFilterOptions({
                            ...filterOptions,
                            minPrice: value ? parseInt(value) : null
                          });
                        }}
                      />
                    </div>
                    <span className="text-gray-400">-</span>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="₺ Max"
                        className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-gray-700 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        value={filterOptions.maxPrice ? filterOptions.maxPrice.toLocaleString('tr-TR') : ''}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d]/g, '');
                          setFilterOptions({
                            ...filterOptions,
                            maxPrice: value ? parseInt(value) : null
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sabit Filtreleme Butonları */}
        <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2">
          <button
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 500);
            }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium py-1.5 px-3 rounded-md transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg"
          >
            <Search className="h-3 w-3 mr-1.5" />
            Turları Filtrele
          </button>
          <button
            onClick={resetFilters}
            className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 text-sm font-medium py-1.5 px-3 rounded-md transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg"
          >
            <X className="h-3 w-3 mr-1.5" />
            Filtreleri Temizle
          </button>
        </div>

        {/* Popüler Destinasyonlar */}
        <div className="mb-20">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Popüler Destinasyonlar</h2>
              <p className="text-gray-600">En çok tercih edilen tatil bölgelerini keşfedin</p>
            </div>
            <Link 
              href="/destinations"
              className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium inline-flex items-center hover:underline"
            >
              Tümünü gör
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { 
                name: "İstanbul", 
                slug: "istanbul",
                image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800&auto=format&fit=crop", 
                count: 42 
              },
              { 
                name: "Kapadokya", 
                slug: "kapadokya",
                image: "https://images.unsplash.com/photo-1586611292717-f828b167408c?q=80&w=800&auto=format&fit=crop", 
                count: 28 
              },
              { 
                name: "Antalya", 
                slug: "antalya",
                image: "https://images.unsplash.com/photo-1591804374401-9f6a7d0e0b1a?q=80&w=800&auto=format&fit=crop", 
                count: 36 
              },
              { 
                name: "Pamukkale", 
                slug: "pamukkale",
                image: "https://images.unsplash.com/photo-1586611292717-f828b167408c?q=80&w=800&auto=format&fit=crop", 
                count: 18 
              },
              { 
                name: "Efes", 
                slug: "efes",
                image: "https://images.unsplash.com/photo-1586611292717-f828b167408c?q=80&w=800&auto=format&fit=crop", 
                count: 15 
              },
              { 
                name: "Karadeniz", 
                slug: "karadeniz",
                image: "https://images.unsplash.com/photo-1586611292717-f828b167408c?q=80&w=800&auto=format&fit=crop", 
                count: 24 
              }
            ].map((destination, index) => (
              <Link 
                href={`/destinations/${destination.slug}`}
                key={index}
                className="group relative rounded-xl overflow-hidden aspect-square shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10"></div>
                <div className="relative w-full h-full">
                  <Image
                    src={destination.image}
                    alt={destination.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    priority={index < 2}
                  />
                </div>
                <div className="absolute bottom-3 left-3 right-3 z-20 text-white">
                  <h3 className="font-bold mb-1">{destination.name}</h3>
                  <div className="text-xs font-medium text-white/90">{destination.count} tur</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Turlarınızı Planlama Rehberi */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 mb-20">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2">
              <div className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full py-1 px-3 text-xs font-medium mb-4">
                TourTech Rehberi
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Turlarınızı Planlarken Dikkat Edilmesi Gerekenler</h2>
              <p className="text-gray-700 mb-6">
                Mükemmel bir tur deneyimi için önceden planlamanın önemi büyüktür. 
                Rehberimiz, tur seçiminden rezervasyona kadar tüm süreçte size yardımcı olacak 
                bilgiler içerir.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-2 mr-4 mt-0.5">
                    <Calendar className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Doğru Zamanı Seçin</h3>
                    <p className="text-gray-600 text-sm">
                      Her destinasyonun en ideal ziyaret dönemi farklıdır. Seçtiğiniz destinasyonun iklim 
                      koşullarına ve yoğun turist dönemlerine dikkat edin.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-100 rounded-full p-2 mr-4 mt-0.5">
                    <Users className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Grup Büyüklüğü</h3>
                    <p className="text-gray-600 text-sm">
                      Küçük grup turları daha kişisel bir deneyim sunarken, büyük gruplar genellikle daha 
                      ekonomiktir. Tercihlerinize uygun grup büyüklüğünü seçin.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-amber-100 rounded-full p-2 mr-4 mt-0.5">
                    <Star className="h-5 w-5 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Yorumları İnceleyin</h3>
                    <p className="text-gray-600 text-sm">
                      Önceki katılımcıların deneyimleri, tur kalitesi hakkında değerli bilgiler sunar. 
                      Rezervasyon yapmadan önce mutlaka yorumları inceleyin.
                    </p>
                  </div>
                </div>
              </div>
              
              <Link 
                href="/planning-guide"
                className="inline-flex items-center text-blue-700 font-medium mt-6 hover:text-blue-800 hover:underline"
              >
                Detaylı rehberi görüntüle
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="md:w-1/2 relative">
              <div className="relative h-96 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/planning-guide.jpg"
                  alt="Tur planlama rehberi"
                  fill
                  className="object-cover"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                    <div className="flex items-center mb-3">
                      <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900">Özel Tur Danışmanlığı</h3>
                    </div>
                    <p className="text-gray-700 text-sm mb-3">
                      Tur planlama konusunda uzman danışmanlarımızdan ücretsiz yardım alın.
                    </p>
                    <Link 
                      href="/contact"
                      className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      Danışmana Bağlan
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -right-6 h-32 w-32 bg-yellow-400 rounded-2xl -z-10 hidden md:block"></div>
              <div className="absolute -top-6 -left-6 h-24 w-24 bg-blue-200 rounded-full -z-10 hidden md:block"></div>
            </div>
          </div>
        </div>
        
        {/* Sık Sorulan Sorular */}
        <div className="mb-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full py-1 px-3 text-xs font-medium mb-4">
              MERAK EDİLENLER
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Sık Sorulan Sorular</h2>
            <p className="text-gray-600">
              Tur rezervasyonları ve seyahat planlaması hakkında en çok sorulan sorulara yanıtlar
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              { 
                question: "Rezervasyon iptali durumunda iade politikamız nedir?", 
                answer: "Tur başlangıcından 30 gün öncesine kadar yapılan iptallerde tam iade, 15-29 gün arasında %70 iade, 7-14 gün arasında %50 iade yapılmaktadır. Son 7 gün içerisindeki iptallerde iade yapılamamaktadır. Detaylı bilgi için 'İptal ve İade Koşulları' sayfamızı inceleyebilirsiniz."
              },
              { 
                question: "Tur fiyatlarına neler dahildir?", 
                answer: "Tur fiyatlarına genellikle ulaşım, konaklama, belirtilen öğünler ve tur programında yer alan aktiviteler dahildir. Her turun içeriği farklılık gösterebileceği için tur detay sayfasında 'Fiyata Dahil Olan Hizmetler' bölümünü incelemenizi öneririz."
              },
              { 
                question: "Çocuklar için yaş sınırlaması veya indirim var mı?", 
                answer: "Turların çoğunda 0-6 yaş grubu çocuklar için %50'ye varan indirimler, 7-12 yaş arası çocuklar için %30 indirim uygulanmaktadır. Bazı turlar için yaş sınırlaması olabilir, tur detaylarını incelemenizi öneririz."
              },
              { 
                question: "Özel turlar düzenliyor musunuz?", 
                answer: "Evet, özel grup ve kurumsal turlar düzenliyoruz. Kendi rotanızı belirleyebilir veya mevcut turlarımızı özel grup olarak düzenleyebilirsiniz. Özel tur talepleriniz için 'İletişim' sayfamızdan bize ulaşabilirsiniz."
              },
              { 
                question: "Tur sırasında rehberler hangi dillerde hizmet veriyor?", 
                answer: "Tur rehberlerimiz genellikle Türkçe ve İngilizce dillerinde hizmet vermektedir. Bazı turlarda Almanca, Fransızca, İspanyolca, Rusça gibi dil seçenekleri de bulunmaktadır. Tur detay sayfasında dil bilgisi belirtilmektedir."
              },
              { 
                question: "Online ödeme güvenli mi?", 
                answer: "Tüm ödeme işlemleri SSL sertifikalı güvenli ödeme altyapısı üzerinden gerçekleştirilmektedir. Kredi kartı bilgileriniz hiçbir şekilde sistemimizde saklanmaz ve 3D Secure ödeme sistemi ile maksimum güvenlik sağlanır."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-gray-900 font-bold text-lg mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link 
              href="/faq"
              className="inline-flex items-center text-blue-700 font-medium hover:text-blue-800 hover:underline"
            >
              Tüm sık sorulan soruları görüntüle
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
        
        {/* Abone Ol Bölümü */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 mb-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center gap-8">
              <div className="md:w-2/3">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Özel Fırsatlar ve İndirimleri Kaçırmayın
                </h2>
                <p className="text-blue-100 mb-4">
                  E-bültenimize abone olun, yeni turlar ve özel indirimlerden ilk siz haberdar olun. 
                  Ayrıca, abone olan herkese ilk turlarında kullanabilecekleri %10 indirim kuponu hediye!
                </p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="E-posta adresiniz"
                    className="flex-1 py-3 px-4 rounded-l-lg border-0 focus:ring-2 focus:ring-white/20 text-gray-700"
                  />
                  <button
                    className="bg-white text-blue-700 hover:bg-blue-50 font-medium px-6 py-3 rounded-r-lg transition-colors"
                  >
                    Abone Ol
                  </button>
                </div>
                <div className="mt-3 text-sm text-blue-100">
                  Kişisel verileriniz, e-bülten gönderimi amacıyla KVKK'ya uygun şekilde işlenecektir.
                </div>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <div className="w-32 h-32 relative">
                  <div className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-full animate-ping opacity-75" style={{ animationDuration: '3s' }}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-md rounded-full p-6">
                      <div className="text-white text-center">
                        <div className="font-bold text-3xl">%10</div>
                        <div className="text-xs font-medium">İNDİRİM</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 