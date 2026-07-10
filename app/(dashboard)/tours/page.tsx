"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { parseJsonString } from "@/app/utils/format";
import { format, differenceInDays } from 'date-fns';
import { tr } from 'date-fns/locale';
import { type Tour } from "@/app/types";
import MembershipBadge from "@/app/components/partner-dashboard/MembershipBadge";
import StarRating from "@/app/components/StarRating";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Search, 
  Filter,
  ChevronDown,
  Check,
  X,
  ChevronRight,
  SlidersHorizontal,
  ArrowDownWideNarrow,
  Loader2,
  Heart,
  Eye,
  Zap,
  Shield,
  Award,
  Plane,
  Hotel,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import React from "react";

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

// Fiyat formatlama yardımcı fonksiyonu
const formatPrice = (price: number) => {
  return price.toLocaleString('tr-TR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).replace(/,/g, '.');
};

const mapTourFromApi = (tour: any): Tour => ({
  ...tour,
  rating: tour.rating ?? 0,
  reviewCount: tour.reviewCount ?? 0,
  tourOperator: {
    id: tour.tourOperator?.id || '',
    companyName: tour.tourOperator?.companyName || tour.tourOperator?.name || '',
    logo: tour.tourOperator?.logo || null,
    membershipTier: tour.tourOperator?.membershipTier || null,
  },
});

export default function ToursPage() {
  const searchParams = useSearchParams();
  const durationParam = searchParams.get('duration');
  const featuredParam = searchParams.get('featured');
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');
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
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [isLoading, setIsLoading] = useState(false);
  const [totalTours, setTotalTours] = useState(0);

  const [loadingMore, setLoadingMore] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Turları getir
  const fetchTours = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: searchTerm,
        sortBy: sortBy === 'popular' ? 'createdAt' : sortBy,
        sortOrder: 'desc'
      });

      const response = await fetch(`/api/tours?${params}`);
      const data = await response.json();

      if (response.ok) {
        const mappedTours: Tour[] = data.tours.map(mapTourFromApi);
        setFilteredTours(mappedTours);
        setTotalTours(data.total);
      } else {
        console.error('Error fetching tours:', data.error);
      }
    } catch (error) {
      console.error('Error fetching tours:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm, sortBy]);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

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
          const scoreA = (b.rating || 0) * 0.7 + (b.reviewCount || 0) * 0.3;
          const scoreB = (a.rating || 0) * 0.7 + (a.reviewCount || 0) * 0.3;
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

  // Filtreleme fonksiyonunu güncelle
  useEffect(() => {
    const applyFilters = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams({
          page: '1',
          limit: itemsPerPage.toString(),
          search: searchTerm,
          sortBy: sortBy === 'popular' ? 'createdAt' : sortBy,
          sortOrder: 'desc'
        });

        // Filtre parametrelerini ekle
        if (filterOptions.minPrice) params.append('minPrice', filterOptions.minPrice.toString());
        if (filterOptions.maxPrice) params.append('maxPrice', filterOptions.maxPrice.toString());
        if (filterOptions.departureCity) params.append('departureCity', filterOptions.departureCity);
        if (filterOptions.region) params.append('region', filterOptions.region);
        if (filterOptions.transportation) params.append('transportation', filterOptions.transportation);
        if (filterOptions.duration) params.append('duration', filterOptions.duration);
        if (filterOptions.period) params.append('period', filterOptions.period);
        if (filterOptions.featured) params.append('featured', 'true');
        if (filterOptions.rating) params.append('minRating', filterOptions.rating.toString());
        if (filterOptions.dateRange[0]) params.append('startDate', filterOptions.dateRange[0].toISOString());
        if (filterOptions.dateRange[1]) params.append('endDate', filterOptions.dateRange[1].toISOString());

        const response = await fetch(`/api/tours?${params}`);
        const data = await response.json();

        if (response.ok) {
          setFilteredTours(data.tours.map(mapTourFromApi));
          setTotalTours(data.total);
          setCurrentPage(1);
        } else {
          console.error('Error filtering tours:', data.error);
        }
      } catch (error) {
        console.error('Error filtering tours:', error);
      } finally {
        setIsLoading(false);
      }
    };

    applyFilters();
  }, [filterOptions, itemsPerPage, searchTerm, sortBy]);

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

  // Modern Tur Kartı Bileşeni
  const ModernTourCard = ({ tour }: { tour: Tour }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    
    const getDepartureSuffix = (city: string): string => {
      if (!city) return "'dan";

      // Turkish vowel harmony rules
      const cityLower = city.toLowerCase();
      const vowels = "aıoueiöü";
      
      let lastVowel = 'a'; // default to back vowel
      for (let i = cityLower.length - 1; i >= 0; i--) {
          if (vowels.includes(cityLower[i])) {
              lastVowel = cityLower[i];
              break;
          }
      }

      const unvoicedConsonants = "pçtkfhsş";
      const lastChar = city.slice(-1).toLowerCase();

      const useT = unvoicedConsonants.includes(lastChar);
      const useA = "aıou".includes(lastVowel);

      if (useT) {
          return useA ? "'tan" : "'ten";
      } else {
          return useA ? "'dan" : "'den";
      }
    };

    const formatDepartureCity = (cityData: string | string[] | null): string => {
      if (!cityData) return '';
      const cities = (Array.isArray(cityData) ? cityData : [cityData]).filter(c => c && c.trim() !== '');
      if (cities.length === 0) return '';
      
      const lastCity = cities[cities.length - 1];
      const suffix = getDepartureSuffix(lastCity);

      if (cities.length === 1) {
        return `${lastCity}${suffix} kalkışlı`;
      }

      const otherCities = cities.slice(0, -1);
      return `${otherCities.join(', ')} ve ${lastCity}${suffix} kalkışlı`;
    };
    
    const departureText = formatDepartureCity(tour.departureCity);

    const tourImages = parseJsonString<string[]>(tour.images || '[]', []);
    const rawDestinations = parseJsonString<any[]>(tour.destinations || '[]', []);
    const destinations = rawDestinations.map(dest => {
      if (typeof dest === 'string') return dest;
      if (typeof dest === 'object' && dest.city) return dest.city;
      return '';
    }).filter(dest => dest !== '');
    
    const inclusions = parseJsonString<string[]>(tour.inclusions || '[]', []);
    const features = parseJsonString<string[]>((tour as any).features || '[]', []);

    const remainingSpots = (tour.maxParticipants || 0) - 0; // currentParticipants yok
    const reviewCount = tour.reviewCount ?? 0;
    const averageRating = tour.rating ?? 0;
    
    // Fiyat hesaplama
    const price = tour.price;
    let discountedPrice = price;
    let appliedDiscount = 0;
    
    // O günün tarihine göre en uygun indirimi bul
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if ((tour as any).tourDates && (tour as any).tourDates.length > 0) {
      for (const tourDate of (tour as any).tourDates) {
        // Erken rezervasyon kontrolü
        if (tourDate.earlyBirdDiscount && tourDate.earlyBirdDiscount > 0) {
          const earlyBirdStart = tourDate.earlyBirdDeadlineStart ? new Date(tourDate.earlyBirdDeadlineStart) : null;
          const earlyBirdEnd = tourDate.earlyBirdDeadline ? new Date(tourDate.earlyBirdDeadline) : null;
          
          if (earlyBirdStart && earlyBirdEnd && today >= earlyBirdStart && today <= earlyBirdEnd) {
            const discountAmount = tourDate.price * (tourDate.earlyBirdDiscount / 100);
            if (discountAmount > appliedDiscount) {
              appliedDiscount = discountAmount;
              discountedPrice = tourDate.price - discountAmount;
            }
          }
        }
        
        // Son dakika kontrolü
        if (tourDate.lastMinuteDiscount && tourDate.lastMinuteDiscount > 0) {
          const lastMinuteStart = tourDate.lastMinuteStart ? new Date(tourDate.lastMinuteStart) : null;
          const lastMinuteEnd = tourDate.lastMinuteStartEnd ? new Date(tourDate.lastMinuteStartEnd) : null;
          
          if (lastMinuteStart && lastMinuteEnd && today >= lastMinuteStart && today <= lastMinuteEnd) {
            const discountAmount = tourDate.price * (tourDate.lastMinuteDiscount / 100);
            if (discountAmount > appliedDiscount) {
              appliedDiscount = discountAmount;
              discountedPrice = tourDate.price - discountAmount;
            }
          }
        }
      }
    }
    
    // Eğer tarih bazlı indirim yoksa genel tur indirimini uygula
    if (appliedDiscount === 0 && tour.discount && tour.discount > 0) {
      discountedPrice = price * (1 - (tour.discount || 0) / 100);
    }

    const firstDate = (tour as any).tourDates?.[0];
    const tourDateText = firstDate?.startDate && firstDate?.endDate
        ? `${format(new Date(firstDate.startDate), 'd MMMM', { locale: tr })} - ${format(new Date(firstDate.endDate), 'd MMMM yyyy', { locale: tr })}`
        : `${tour.duration || 1} Gün`;
    
    const otherDatesCount = (tour as any).tourDates ? (tour as any).tourDates.length - 1 : 0;

    // Tur için tek ve öncelikli etiket belirle
    const getTourBadge = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Sadece tarih kısmını al
      
      // Tur tarihlerini kontrol et
      if ((tour as any).tourDates && (tour as any).tourDates.length > 0) {
        for (const tourDate of (tour as any).tourDates) {
          // Erken rezervasyon kontrolü
          if (tourDate.earlyBirdDiscount && tourDate.earlyBirdDiscount > 0) {
            const earlyBirdStart = tourDate.earlyBirdDeadlineStart ? new Date(tourDate.earlyBirdDeadlineStart) : null;
            const earlyBirdEnd = tourDate.earlyBirdDeadline ? new Date(tourDate.earlyBirdDeadline) : null;
            
            if (earlyBirdStart && earlyBirdEnd && today >= earlyBirdStart && today <= earlyBirdEnd) {
              return { text: `%${tourDate.earlyBirdDiscount} Erken Rezervasyon`, icon: Zap, color: 'bg-green-500' };
            }
          }
          
          // Son dakika kontrolü
          if (tourDate.lastMinuteDiscount && tourDate.lastMinuteDiscount > 0) {
            const lastMinuteStart = tourDate.lastMinuteStart ? new Date(tourDate.lastMinuteStart) : null;
            const lastMinuteEnd = tourDate.lastMinuteStartEnd ? new Date(tourDate.lastMinuteStartEnd) : null;
            
            if (lastMinuteStart && lastMinuteEnd && today >= lastMinuteStart && today <= lastMinuteEnd) {
              return { text: `%${tourDate.lastMinuteDiscount} Son Dakika`, icon: Clock, color: 'bg-orange-500' };
            }
          }
        }
      }
      
      // Genel tur indirimi kontrolü
      if (tour.discount && tour.discount > 0) return { text: `%${tour.discount} İndirim`, icon: Zap, color: 'bg-red-500' };
      if (tour.isLastMinute) return { text: 'Son Dakika', icon: Clock, color: 'bg-orange-500' };
      if (tour.isEarlyBird) return { text: 'Erken Rezervasyon', icon: Zap, color: 'bg-green-500' };
      
      return null;
    };

    const badge = getTourBadge();

    return (
      <Link 
        href={`/tour/${tour.id}`}
        className="block h-full focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 flex flex-col h-full"
        >
          {/* Görsel Alanı */}
          <div className="relative h-48 overflow-hidden">
              <Image
              src={tourImages[0] || 'https://placehold.co/800x600/e5e7eb/6b7280?text=Tur'}
                alt={tour.name || 'Tur görseli'}
                fill
              className={`object-cover transition-transform duration-500 ${
                isHovered ? 'scale-105' : 'scale-100'
              }`}
                priority={true}
              />
            
            {/* Etiket */}
            {badge && (
              <div 
                className={`absolute top-3 left-3 flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-white ${badge.color}`}
              >
                <badge.icon className="h-3 w-3" />
                <span>{badge.text}</span>
                </div>
              )}

            {/* Partner üyelik arması (müşteri değerlendirmelerinden otomatik hesaplanır) */}
            <div className={`absolute left-3 ${badge ? 'top-11' : 'top-3'}`}>
              <MembershipBadge tier={tour.tourOperator?.membershipTier} variant="onImage" />
            </div>

            {/* Favori Butonu */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsFavorite(!isFavorite);
              }}
              className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
                isFavorite 
                  ? 'text-red-500' 
                  : 'text-gray-600 hover:text-red-500'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            {/* Kalkış Şehri */}
            {departureText && (
              <div className="absolute bottom-3 left-3 bg-blue-600/60 backdrop-blur-sm rounded-lg px-2 py-1 max-w-[calc(100%-3rem)]">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                  <span className="text-white text-xs font-medium truncate">
                    {departureText}
                  </span>
                </div>
                </div>
              )}

            {/* Tur Operatörü */}
            <div className="absolute bottom-3 right-3">
              <div className="relative group/operator">
                <div className="w-6 h-6 rounded-full overflow-hidden border border-white">
                    <Image
                    src={tour.tourOperator?.logo || 'https://ui-avatars.com/api/?name=Tur&background=0EA5E9&color=fff'}
                    alt={tour.tourOperator?.companyName || 'Tur Operatörü'}
                    width={24}
                    height={24}
                    className="object-cover w-full h-full"
                    />
                  </div>
                {/* Hover Tooltip */}
                <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover/operator:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                  {tour.tourOperator?.companyName || 'Tur Operatörü'}
                </div>
              </div>
            </div>
          </div>
          
          {/* İçerik Alanı */}
          <div className="p-4 flex flex-col flex-1">
            {/* Başlık */}
            <h3 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight min-h-[2.5rem]">
              {tour.name}
            </h3>
            
            {/* Konum ve Tarih */}
            <div className="flex items-center gap-2 mb-3 text-gray-600 min-h-[1.5rem]">
              <div className="flex items-center gap-1 flex-1 min-w-0">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <span className="text-xs truncate">{destinations.join(', ')}</span>
            </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Calendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
                <span className="text-xs whitespace-nowrap">{tourDateText}</span>
                </div>
              </div>
              
            {/* Puanlama */}
            <div className="flex items-center gap-2 mb-3 min-h-[1.5rem]">
              {reviewCount > 0 ? (
                <>
                  <StarRating rating={averageRating} size="sm" />
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {averageRating.toFixed(1)} ({reviewCount})
                  </span>
                </>
              ) : (
                <span className="text-xs text-gray-400">Henüz değerlendirme yok</span>
              )}
              
              {/* Kalan Yer */}
              {remainingSpots <= 10 && remainingSpots > 0 && (
                <div className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium flex-shrink-0 ml-auto">
                  Son {remainingSpots}
                </div>
              )}
              </div>
              
            {/* Fiyat ve Buton */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto min-h-[3rem]">
              <div className="flex flex-col flex-1 min-w-0">
                {(appliedDiscount > 0 || (tour.discount && tour.discount > 0)) && (
                  <span className="text-gray-400 text-xs line-through">
                    ₺{formatPrice(price)}
                  </span>
                )}
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-gray-900">
                  ₺{formatPrice(discountedPrice)}
                </span>
                  <span className="text-gray-500 text-xs">kişi</span>
              </div>
              </div>
              
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <div className="flex items-center gap-1 text-blue-600 group-hover:text-blue-700 transition-colors font-medium text-sm">
                  <span>İncele</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
                {otherDatesCount > 0 && (
                  <div className="flex items-center gap-1 text-xs text-green-600 whitespace-nowrap">
                    <Calendar className="w-3 h-3" />
                    <span>+{otherDatesCount} tur tarihi</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  };

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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-20 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center bg-blue-900/30 backdrop-blur-sm text-blue-100 rounded-full py-1.5 px-4 text-xs font-medium mb-4">
              <span className="w-2 h-2 bg-blue-200 rounded-full mr-2"></span>
              En İyi Tur Deneyimleri
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Türkiye'nin <span className="text-orange-400">En İyi</span> Turları
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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-20 py-10">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobil Filtre Butonu */}
          <div className="lg:hidden mb-4">
                            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full flex items-center justify-center gap-2 bg-white py-3 px-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <Filter className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-gray-900">Filtreler</span>
              <span className="ml-auto text-sm text-gray-500">
                {Object.values(filterOptions).filter(v => v !== null && v !== false).length} aktif
              </span>
                            </button>
                </div>
                
          {/* Overlay */}
          {isFilterOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsFilterOpen(false)}
            />
          )}

          {/* Yandan Açılır Filtre Menüsü */}
          <div className={`
            fixed inset-y-0 right-0 w-full lg:w-80 bg-gray-50 shadow-lg transform transition-transform duration-300 ease-in-out z-30
            ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}
            lg:relative lg:translate-x-0 lg:shadow-none lg:w-72 xl:w-80
          `}>
            <div className="h-full flex flex-col">
              <div className="bg-gray-50 border-b border-gray-100 pt-0 pb-3 px-6 flex justify-between items-center">
                <h3 className="font-bold text-gray-900 flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-blue-600" />
                  Filtreler
                </h3>
                <div className="flex items-center gap-2">
                <button 
                    onClick={() => setIsFilterOpen(false)}
                    className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                    <X className="h-5 w-5" />
                </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 lg:p-6">
                {/* Mevcut filtre içeriği */}
                <div className="space-y-6">
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

                {/* Fiyat Aralığı */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Fiyat Aralığı</h4>
                    <div className="flex items-center gap-2">
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
                      </div>
                        </div>
            </div>
          </div>
          
          {/* Tur Listesi */}
          <div className="flex-1 min-w-0">
            {/* Başlık ve Filtreler */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-gray-900">Tüm Turlar</h1>
                <div className="h-1 w-16 bg-blue-600"></div>
              </div>
              {/* Görünüm Seçenekleri */}
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => setView('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    view === 'grid' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    view === 'list' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
                </div>

            {/* Sıralama Seçenekleri */}
            <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <select 
                          value={sortBy}
                          onChange={(e) => handleSortChange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="popular">Popülerliğe Göre</option>
                  <option value="price-low">Fiyat (Düşükten Yükseğe)</option>
                  <option value="price-high">Fiyat (Yüksekten Düşüğe)</option>
                  <option value="date">Tarihe Göre</option>
                  <option value="rating">Puana Göre</option>
                        </select>
          </div>
              
              <div className="text-sm text-gray-600">
                {totalTours > 0 ? (
                  <>
                    Toplam <span className="font-semibold text-gray-800">{totalTours}</span> tur bulundu
                  </>
                ) : (
                  <span className="text-gray-500">Gösterilecek tur bulunamadı</span>
              )}
                </div>
            </div>

            {/* Yükleme Durumu */}
            {isLoading ? (
              <LoadingSkeleton />
            ) : filteredTours.length === 0 ? (
              <NoResults />
            ) : (
              <>
                {/* Tur Kartları */}
                {view === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                    {filteredTours.map((tour) => (
                      <ModernTourCard key={tour.id} tour={tour} />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {filteredTours.map((tour) => (
                      <ModernTourCard key={tour.id} tour={tour} />
                    ))}
                                    </div>
                                  )}
                
                {/* Sayfalama */}
                {totalTours > itemsPerPage && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 border rounded-md hover:bg-gray-100 disabled:opacity-50 text-gray-700"
                      >
                        Önceki
                      </button>
                      
                      {Array.from({ length: Math.ceil(totalTours / itemsPerPage) }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 rounded-md ${
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
                        disabled={currentPage === Math.ceil(totalTours / itemsPerPage)}
                        className="px-3 py-2 border rounded-md hover:bg-gray-100 disabled:opacity-50 text-gray-700"
                      >
                        Sonraki
                      </button>
                  </div>
        </div>
                )}
              </>
            )}
              </div>
          </div>
      </div>
    </div>
  );
} 