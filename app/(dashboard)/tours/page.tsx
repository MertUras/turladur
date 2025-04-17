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
import React from "react";

interface Tour {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  rating: number;
  reviewCount: number;
  departurePoint: string;
  departureDate: string;
  returnDate: string;
  availableSeats: number;
  totalSeats: number;
  isPopular: boolean;
  isLastMinute: boolean;
  isEarlyBird: boolean;
  tourType: string;
  accommodationType: string;
  difficultyLevel: string;
  ageRestriction: number;
  languages: string[];
  tags: string[];
  region: string;
  transportationType: string;
  period: string;
  startDate: string;
  discount: number;
  reviews: number;
  isFavorite: boolean;
  tourOperatorId: string;
  cancellationPolicy: string;
  highlights: string[];
  requirements: string[];
  mapUrl: string;
  videoUrl: string;
  priceHistory: {
    date: string;
    price: number;
  }[];
  isJointTour: boolean;
  createdAt: string;
  updatedAt: string;
  destinations: string;
  inclusions: string;
  exclusions: string;
  itinerary: string;
  images: string;
  features: string;
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
  tourType: string | null;
  accommodationType: string | null;
  difficultyLevel: string | null;
  ageRestriction: number | null;
  rating: number | null;
  dateRange: [Date | null, Date | null];
  isPopular: boolean;
  isLastMinute: boolean;
  isEarlyBird: boolean;
  languages: string[];
  tags: string[];
  departurePoint: string | null;
}

export default function ToursPage() {
  const searchParams = useSearchParams();
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
    tourType: null,
    accommodationType: null,
    difficultyLevel: null,
    ageRestriction: null,
    rating: null,
    dateRange: [null, null],
    isPopular: false,
    isLastMinute: false,
    isEarlyBird: false,
    languages: [],
    tags: [],
    departurePoint: null
  });

  // Sayfalama ve gösterim seçenekleri
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15); // Varsayılan değeri 15 olarak değiştirdim
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

  // Sayfalama seçenekleri
  const pageSizeOptions = [15, 30, 45, 60]; // Seçenekleri 15'ten başlayacak şekilde güncelledim

  // Filtreleme seçenekleri için sabit değerler
  const tourTypes = [
    { type: 'kultur', label: 'Kültür Turu', count: 12 },
    { type: 'doga', label: 'Doğa Turu', count: 8 },
    { type: 'macera', label: 'Macera Turu', count: 6 },
    { type: 'deniz', label: 'Deniz Turu', count: 10 },
    { type: 'yemek', label: 'Yemek Turu', count: 4 },
    { type: 'spor', label: 'Spor Turu', count: 3 }
  ];

  const accommodationTypes = [
    { type: 'otel', label: 'Otel', count: 15 },
    { type: 'pansiyon', label: 'Pansiyon', count: 8 },
    { type: 'kamp', label: 'Kamp', count: 5 },
    { type: 'villa', label: 'Villa', count: 3 },
    { type: 'apart', label: 'Apart', count: 4 }
  ];

  const difficultyLevels = [
    { level: 'kolay', label: 'Kolay', count: 10 },
    { level: 'orta', label: 'Orta', count: 15 },
    { level: 'zor', label: 'Zor', count: 5 }
  ];

  const languages = [
    { code: 'tr', label: 'Türkçe', count: 25 },
    { code: 'en', label: 'İngilizce', count: 20 },
    { code: 'de', label: 'Almanca', count: 10 },
    { code: 'fr', label: 'Fransızca', count: 8 },
    { code: 'ru', label: 'Rusça', count: 5 }
  ];

  // Sıralama seçenekleri
  const sortOptions = [
    { value: 'popular', label: 'Popülerlik' },
    { value: 'price-low', label: 'Fiyat (Artan)' },
    { value: 'price-high', label: 'Fiyat (Azalan)' },
    { value: 'duration', label: 'Süre' },
    { value: 'rating', label: 'Değerlendirme' },
    { value: 'date', label: 'Tarih' },
    { value: 'discount', label: 'İndirim Oranı' }
  ];

  // Sıralama fonksiyonu
  const sortTours = (tours: Tour[]) => {
    const sorted = [...tours];
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'duration':
        sorted.sort((a, b) => (a.duration || 0) - (b.duration || 0));
        break;
      case 'rating':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'date':
        sorted.sort((a, b) => {
          const dateA = new Date(a.startDate || '');
          const dateB = new Date(b.startDate || '');
          return dateA.getTime() - dateB.getTime();
        });
        break;
      case 'discount':
        sorted.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      default: // popular
        sorted.sort((a, b) => {
          const scoreA = (b.rating || 0) * 0.7 + (b.reviews || 0) * 0.3;
          const scoreB = (a.rating || 0) * 0.7 + (a.reviews || 0) * 0.3;
          return scoreA - scoreB;
        });
        break;
    }
    return sorted;
  };

  useEffect(() => {
    // API isteği simülasyonu
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = [...dummyTours];
    
    // Mevcut filtreler
    if (filterOptions.minPrice !== null && filterOptions.maxPrice !== null) {
      filtered = filtered.filter(tour => 
        (tour.price || 0) >= filterOptions.minPrice! && 
        (tour.price || 0) <= filterOptions.maxPrice!
      );
    }
    
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
      filtered = filtered.filter(tour => tour.duration?.toString() === filterOptions.duration);
    }
    if (filterOptions.period) {
      filtered = filtered.filter(tour => tour.period === filterOptions.period);
    }
    if (filterOptions.featured) {
      filtered = filtered.filter(tour => tour.featured);
    }
    
    // Yeni filtreler
    if (filterOptions.tourType) {
      filtered = filtered.filter(tour => tour.tourType === filterOptions.tourType);
    }
    if (filterOptions.accommodationType) {
      filtered = filtered.filter(tour => tour.accommodationType === filterOptions.accommodationType);
    }
    if (filterOptions.difficultyLevel) {
      filtered = filtered.filter(tour => tour.difficultyLevel === filterOptions.difficultyLevel);
    }
    if (filterOptions.ageRestriction) {
      filtered = filtered.filter(tour => (tour.ageRestriction || 0) <= filterOptions.ageRestriction!);
    }
    if (filterOptions.rating) {
      filtered = filtered.filter(tour => (tour.rating || 0) >= filterOptions.rating!);
    }
    if (filterOptions.dateRange[0] && filterOptions.dateRange[1]) {
      filtered = filtered.filter(tour => {
        const startDate = new Date(tour.startDate || '');
        return startDate >= filterOptions.dateRange[0]! && startDate <= filterOptions.dateRange[1]!;
      });
    }
    if (filterOptions.isPopular) {
      filtered = filtered.filter(tour => tour.isPopular);
    }
    if (filterOptions.isLastMinute) {
      filtered = filtered.filter(tour => tour.isLastMinute);
    }
    if (filterOptions.isEarlyBird) {
      filtered = filtered.filter(tour => tour.isEarlyBird);
    }
    if (filterOptions.languages.length > 0) {
      filtered = filtered.filter(tour => 
        tour.languages?.some(lang => filterOptions.languages.includes(lang))
      );
    }
    if (filterOptions.tags.length > 0) {
      filtered = filtered.filter(tour => 
        tour.tags?.some(tag => filterOptions.tags.includes(tag))
      );
    }
    
    // Sıralama uygula
    filtered = sortTours(filtered);
    
    setFilteredTours(filtered);
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
      tourType: null,
      accommodationType: null,
      difficultyLevel: null,
      ageRestriction: null,
      rating: null,
      dateRange: [null, null],
      isPopular: false,
      isLastMinute: false,
      isEarlyBird: false,
      languages: [],
      tags: [],
      departurePoint: null
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
    const heroSection = document.querySelector('.bg-gradient-to-r.from-blue-700.to-blue-900');
    if (heroSection) {
      const heroBottom = heroSection.getBoundingClientRect().bottom + window.scrollY - 20;
      window.scrollTo({ top: heroBottom, behavior: 'smooth' });
    }
  };

  // Sayfalama ve sıralama işlevleri
  const handlePageSizeChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  // Arama işlevi
  const handleSearch = useCallback(() => {
    let filtered = [...dummyTours];
    
    if (searchTerm) {
      filtered = filtered.filter(tour => 
        tour.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.destinations?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredTours(filtered);
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  // Performans optimizasyonu için memoize edilmiş tur kartı bileşeni
  const TourCard = React.memo(({ tour }: { tour: Tour }) => {
    const tourImages = parseJsonString<string[]>(tour.images || '[]', []);
    const destinations = parseJsonString<string[]>(tour.destinations || '[]', []);
                    const tourOperator = dummyTourOperators.find(op => op.id === tour.tourOperatorId);
    const remainingSpots = (tour.maxParticipants || 0) - (tour.currentParticipants || 0);
                    const startDate = new Date(tour.startDate || new Date());
    const discountedPrice = tour.discount && tour.price 
      ? tour.price * (1 - (tour.discount || 0) / 100) 
      : tour.price || 0;
                    
                    return (
                      <Link href={`/tour/${tour.id}`} className="block">
                        <div 
                          className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300 flex flex-col"
                          role="article"
                          aria-label={`${tour.name} turu`}
                        >
                          <div className="relative h-64 overflow-hidden">
                            <div className="relative w-full h-full">
                              <Image
                                src={tourImages[0] || '/images/tours/default.jpg'}
              alt={tour.name || 'Tur görseli'}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                priority={true}
                              />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                            
                            {/* Tur Durumu Etiketleri */}
                            <div className="absolute top-4 right-4 flex flex-col gap-2">
          {(tour.discount || 0) > 0 && (
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
                            
                            {/* Tur Detayları */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {tour.tourType && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {tourTypes.find(t => t.type === tour.tourType)?.label || tour.tourType}
                                </span>
                              )}
                              {tour.transportationType && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  {transportationTypes.find(t => t.type === tour.transportationType)?.type || tour.transportationType}
                                </span>
                              )}
                              {tour.accommodationType && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  {accommodationTypes.find(t => t.type === tour.accommodationType)?.label || tour.accommodationType}
                                </span>
                              )}
                            </div>
                            
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
                  <div className="text-sm font-medium">{tour.duration || 0} gün</div>
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
                  <div className="text-sm font-medium">{tour.rating || 0}/5 ({tour.reviews || 0})</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-auto flex items-center justify-between">
                              <div>
                {(tour.discount || 0) > 0 && (
                                  <span className="text-gray-500 text-sm line-through mr-2">
                    ₺{(tour.price || 0).toLocaleString()}
                                  </span>
                                )}
                                <span className="text-xl font-bold text-blue-600">
                                  ₺{discountedPrice.toLocaleString()}
                                </span>
                                <span className="text-gray-500 text-sm">/kişi</span>
                              </div>
                              <div
                                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors inline-flex items-center"
                              >
                                İncele
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  });

  // Yükleme durumu için bileşen
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: itemsPerPage }).map((_, index) => (
        <div 
          key={index} 
          className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse"
          role="status"
          aria-label="Yükleniyor"
        >
          <div className="h-64 bg-gray-200"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Sonuç bulunamadı durumu için bileşen
  const NoResults = () => (
    <div 
      className="bg-white rounded-xl shadow-md p-8 text-center"
      role="alert"
      aria-live="polite"
    >
      <div className="mx-auto w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
        <Search className="w-10 h-10 text-blue-500" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Tur bulunamadı</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Arama kriterlerinize uygun tur bulunamadı. Farklı filtreler deneyebilir veya tüm filtreleri temizleyebilirsiniz.
      </p>
      <button
        onClick={resetFilters}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg inline-flex items-center transition-colors"
        aria-label="Tüm filtreleri temizle"
      >
        Tüm filtreleri temizle
        <ChevronRight className="w-4 h-4 ml-1" />
      </button>
    </div>
  );

  // Filtreleme seçenekleri için sabit değerler
  const departurePoints = [
    { id: 'istanbul', name: 'İstanbul', count: 25 },
    { id: 'ankara', name: 'Ankara', count: 15 },
    { id: 'izmir', name: 'İzmir', count: 12 },
    { id: 'antalya', name: 'Antalya', count: 8 },
    { id: 'bursa', name: 'Bursa', count: 6 },
    { id: 'adana', name: 'Adana', count: 4 },
    { id: 'trabzon', name: 'Trabzon', count: 3 },
    { id: 'gaziantep', name: 'Gaziantep', count: 2 }
  ];

  const [filteredDeparturePoints, setFilteredDeparturePoints] = useState(departurePoints);

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
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Tur Listesi */}
          <div className="lg:w-3/4">
            {/* Başlık ve Filtreler */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-gray-900">Tüm Turlar</h1>
                <div className="h-1 w-16 bg-blue-600"></div>
              </div>
              {/* Aktif Filtreler */}
              {Object.values(filterOptions).some(value => value !== null && value !== false) && (
                <div className="bg-white rounded-xl shadow-sm p-2 flex-1">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 flex-1 flex-wrap">
                      <span className="text-sm font-medium text-gray-600">Aktif Filtreler:</span>
                      {Object.entries(filterOptions).map(([key, value]) => {
                        if (!value || key === 'priceRange' || value === false) return null;
                        
                        let displayValue = value;
                        if (Array.isArray(value)) {
                          if (key === 'dateRange') {
                            const [start, end] = value;
                            if (!start && !end) return null;
                            displayValue = `${start?.toLocaleDateString('tr-TR') || ''} - ${end?.toLocaleDateString('tr-TR') || ''}`;
                          } else if (value.length === 0) return null;
                        }
                        
                        return (
                          <div key={key} className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                            <span className="text-sm text-gray-600">{displayValue}</span>
                            <button
                              onClick={() => {
                                if (Array.isArray(value)) {
                                  setFilterOptions({...filterOptions, [key]: []});
                                } else {
                                  setFilterOptions({...filterOptions, [key]: null});
                                }
                              }}
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
                        <select 
                          className="text-sm border rounded-md px-2 py-1 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={sortBy}
                          onChange={(e) => handleSortChange(e.target.value)}
                        >
                          {sortOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600">Sayfa Başına:</span>
                        <select 
                          className="text-sm border rounded-md px-2 py-1 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={itemsPerPage}
                          onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                        >
                          {pageSizeOptions.map((size) => (
                            <option key={size} value={size}>
                              {size} Tur
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Tur Listesi */}
            {loading ? (
              <LoadingSkeleton />
            ) : filteredTours.length === 0 ? (
              <NoResults />
            ) : (
              <>
                <div className="mb-4 flex justify-between items-center">
                  <h2 className="text-base font-medium text-gray-700">
                    <span className="text-blue-600 font-semibold">{totalItems}</span> tur arasından <span className="text-blue-600 font-semibold">{currentTours.length}</span> tanesi gösteriliyor
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentTours.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
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

                  {/* Sayfa Başına Gösterim Seçeneği */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Sayfa Başına:</span>
                    <select 
                      className="text-sm border rounded-md px-2 py-1 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={itemsPerPage}
                      onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                    >
                      {pageSizeOptions.map((size) => (
                        <option key={size} value={size}>
                          {size} Tur
                        </option>
                      ))}
                    </select>
                  </div>

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
                {/* Kalkış Noktası */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Kalkış Noktası</h4>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Kalkış noktası ara..."
                      className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-gray-700 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mb-2"
                      onChange={(e) => {
                        const searchTerm = e.target.value.toLowerCase();
                        const filteredPoints = departurePoints.filter(point => 
                          point.name.toLowerCase().includes(searchTerm)
                        );
                        setFilteredDeparturePoints(filteredPoints);
                      }}
                    />
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {filteredDeparturePoints.map((point) => (
                        <button
                          key={point.id}
                          onClick={() => setFilterOptions({
                            ...filterOptions,
                            departurePoint: filterOptions.departurePoint === point.id ? null : point.id
                          })}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            filterOptions.departurePoint === point.id
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {point.name} ({point.count})
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tarih Aralığı */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Tarih Aralığı</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <input
                        type="date"
                        className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-gray-700 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                        value={filterOptions.dateRange[0]?.toISOString().split('T')[0] || ''}
                        onChange={(e) => setFilterOptions({
                          ...filterOptions,
                          dateRange: [e.target.value ? new Date(e.target.value) : null, filterOptions.dateRange[1]]
                        })}
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
                    </div>
                    <div className="relative">
                      <input
                        type="date"
                        className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-gray-700 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                        value={filterOptions.dateRange[1]?.toISOString().split('T')[0] || ''}
                        onChange={(e) => setFilterOptions({
                          ...filterOptions,
                          dateRange: [filterOptions.dateRange[0], e.target.value ? new Date(e.target.value) : null]
                        })}
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
                    </div>
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

                {/* Diğer Filtreler Accordion */}
                <div className="border-t border-gray-200 pt-4">
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer">
                      <h4 className="font-medium text-gray-900">Diğer Filtreler</h4>
                      <ChevronDown className="h-4 w-4 text-gray-500 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="mt-4 space-y-6">
                      {/* Tur Tipi */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Tur Tipi</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {tourTypes.map((item) => (
                            <button
                              key={item.type}
                              onClick={() => setFilterOptions({
                                ...filterOptions,
                                tourType: filterOptions.tourType === item.type ? null : item.type
                              })}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                filterOptions.tourType === item.type
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {item.label} ({item.count})
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Konaklama Tipi */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Konaklama Tipi</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {accommodationTypes.map((item) => (
                            <button
                              key={item.type}
                              onClick={() => setFilterOptions({
                                ...filterOptions,
                                accommodationType: filterOptions.accommodationType === item.type ? null : item.type
                              })}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                filterOptions.accommodationType === item.type
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {item.label} ({item.count})
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Zorluk Seviyesi */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Zorluk Seviyesi</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {difficultyLevels.map((item) => (
                            <button
                              key={item.level}
                              onClick={() => setFilterOptions({
                                ...filterOptions,
                                difficultyLevel: filterOptions.difficultyLevel === item.level ? null : item.level
                              })}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                filterOptions.difficultyLevel === item.level
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {item.label} ({item.count})
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Yaş Sınırı */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Yaş Sınırı</h4>
                        <div className="relative">
                          <input
                            type="number"
                            placeholder="Minimum yaş"
                            className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-gray-700 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            value={filterOptions.ageRestriction || ''}
                            onChange={(e) => setFilterOptions({
                              ...filterOptions,
                              ageRestriction: e.target.value ? parseInt(e.target.value) : null
                            })}
                          />
                        </div>
                      </div>

                      {/* Değerlendirme Puanı */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Değerlendirme Puanı</h4>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="5"
                            step="0.1"
                            className="w-full"
                            value={filterOptions.rating || 0}
                            onChange={(e) => setFilterOptions({
                              ...filterOptions,
                              rating: parseFloat(e.target.value)
                            })}
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {filterOptions.rating || 0}+
                          </span>
                        </div>
                      </div>

                      {/* Özel Filtreler */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Özel Filtreler</h4>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={filterOptions.isPopular}
                              onChange={(e) => setFilterOptions({
                                ...filterOptions,
                                isPopular: e.target.checked
                              })}
                              className="rounded text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Popüler Turlar</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={filterOptions.isLastMinute}
                              onChange={(e) => setFilterOptions({
                                ...filterOptions,
                                isLastMinute: e.target.checked
                              })}
                              className="rounded text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Son Dakika Turları</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={filterOptions.isEarlyBird}
                              onChange={(e) => setFilterOptions({
                                ...filterOptions,
                                isEarlyBird: e.target.checked
                              })}
                              className="rounded text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Erken Rezervasyon</span>
                          </label>
                        </div>
                      </div>

                      {/* Dil Seçenekleri */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Dil Seçenekleri</h4>
                        <div className="space-y-2">
                          {languages.map((item) => (
                            <label key={item.code} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={filterOptions.languages.includes(item.code)}
                                onChange={(e) => {
                                  const newLanguages = e.target.checked
                                    ? [...filterOptions.languages, item.code]
                                    : filterOptions.languages.filter(lang => lang !== item.code);
                                  setFilterOptions({
                                    ...filterOptions,
                                    languages: newLanguages
                                  });
                                }}
                                className="rounded text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">
                                {item.label} ({item.count})
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </details>
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
        <div className="mt-20 mb-20">
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
                TurlaDur Rehberi
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