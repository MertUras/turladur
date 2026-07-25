'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  Search,
  Star,
  Filter,
  Calendar,
  Users,
  X,
  Wallet,
  Timer,
  ChevronDown,
  SlidersHorizontal,
  Trash2,
  ArrowUpDown,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import MembershipBadge from '@/components/features/tour/membership-badge';
import { getPublicApiBaseUrl } from '@/services/api-client';

interface Experience {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  featured: boolean;
  createdAt: string;
  location: string;
  duration: string;
  rating: number;
  reviewCount: number;
  popularityRate: number;
  price?: number;
  category?: string;
  durationHours?: number;
  experienceType?: string;
  experienceOperator?: {
    id: string;
    companyName: string;
    logo: string | null;
    membershipTier?: 'BRONZE' | 'SILVER' | 'GOLD' | null;
  } | null;
}

// --- Helper Function for Countdown ---
const calculateTimeLeft = (targetDate: Date) => {
  const difference = +targetDate - +new Date();
  let timeLeft = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

const ITEMS_PER_PAGE = 8; // Number of items to load per page

export default function ActivitiesPageClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Experience[]>([]);
  const [allFilteredActivities, setAllFilteredActivities] = useState<
    Experience[]
  >([]); // Store all filtered/sorted results
  const [displayedActivities, setDisplayedActivities] = useState<Experience[]>(
    [],
  ); // Store currently displayed results
  const [currentPage, setCurrentPage] = useState(1);

  // --- Filter & Sort States ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    'tumu',
  );
  const [minPrice, setMinPrice] = useState<number | string>('');
  const [maxPrice, setMaxPrice] = useState<number | string>('');
  const [maxDuration, setMaxDuration] = useState<number | string>('');
  const [selectedActivityType, setSelectedActivityType] = useState<
    string | undefined
  >(undefined);
  const [selectedCity, setSelectedCity] = useState<string | undefined>(
    undefined,
  );
  const [sortBy, setSortBy] = useState<string>('popularity');

  // --- UI States ---
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);

  // --- Countdown State ---
  const [targetDate] = useState(
    new Date(
      new Date().getTime() +
        21 * 24 * 60 * 60 * 1000 +
        18 * 60 * 60 * 1000 +
        45 * 60 * 1000 +
        37 * 1000,
    ),
  );
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  // Kategoriler
  const categories = [
    { id: 'tumu', name: 'Tümü' },
    { id: 'doga', name: 'Doğa' },
    { id: 'tarihi', name: 'Tarihi' },
    { id: 'deniz', name: 'Deniz' },
    { id: 'kultur', name: 'Kültür' },
    { id: 'macera', name: 'Macera' },
    { id: 'gastronomi', name: 'Gastronomi' },
    { id: 'spor', name: 'Spor' },
    { id: 'eglence', name: 'Eğlence' },
  ];

  // Aktivite Türleri
  const activityTypes = [
    { id: 'balon-turu', name: 'Balon Turu' },
    { id: 'helikopter-turu', name: 'Helikopter Turu' },
    { id: 'jetski', name: 'Jetski' },
    { id: 'parasailing', name: 'Parasailing' },
    { id: 'atv-safari', name: 'ATV Safari' },
    { id: 'tekne-turu', name: 'Tekne Turu' },
    { id: 'dalis', name: 'Dalış' },
    { id: 'zipline', name: 'Zipline' },
  ];

  // Sorting options
  const sortOptions = [
    { id: 'popularity', name: 'Popülerliğe Göre' },
    { id: 'price_asc', name: 'Fiyata Göre (Artan)' },
    { id: 'price_desc', name: 'Fiyata Göre (Azalan)' },
    { id: 'rating', name: 'Puana Göre (Yüksek)' },
  ];

  // Fetch experiences from API or use demo data
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${getPublicApiBaseUrl()}/catalog/experiences?limit=100`,
          { headers: { Accept: 'application/json' } },
        );
        if (!response.ok) {
          throw new Error('Failed to fetch activities');
        }
        const payload = await response.json();
        const rows = Array.isArray(payload) ? payload : payload.data || [];
        const mapped = rows.map((row: any) => ({
          id: String(row.id),
          title: row.title || '',
          description: row.description || '',
          imageUrl: row.coverUrl || row.imageUrl || '',
          featured: Boolean(row.featured),
          createdAt: row.createdAt || new Date().toISOString(),
          location: row.location || row.city || 'Türkiye',
          duration:
            row.durationHours != null
              ? `${row.durationHours} saat`
              : row.duration || '',
          rating: Number(row.averageRating ?? row.rating ?? 0),
          reviewCount: Number(row.reviewCount ?? 0),
          popularityRate: Number(row.popularityRate ?? 0),
          price: row.price != null ? Number(row.price) : undefined,
          category: row.category,
          durationHours: row.durationHours,
          experienceType: row.experienceType || row.category,
          experienceOperator: row.experienceOperator || row.partner || null,
        }));
        setActivities(mapped);
        setAllFilteredActivities(mapped);
        setDisplayedActivities(mapped.slice(0, ITEMS_PER_PAGE));
      } catch (error) {
        console.error('Error fetching experiences:', error);
        // Fallback to demo data in case of error
        const demoExperiences = [
          {
            id: '1',
            title: 'Kapadokya Balon Turu',
            description:
              'Eşsiz peri bacaları manzarasında unutulmaz bir balon deneyimi yaşayın',
            imageUrl:
              'https://images.unsplash.com/photo-1641128324972-af3ef285b470?q=80&w=2070&auto=format&fit=crop',
            featured: true,
            createdAt: new Date().toISOString(),
            location: 'Kapadokya',
            duration: '3 saat',
            durationHours: 3,
            rating: 4.8,
            reviewCount: 423,
            popularityRate: 90,
            price: 4200,
            category: 'macera',
            experienceType: 'balon-turu',
          },
          {
            id: '2',
            title: 'Pamukkale & Hierapolis Turu',
            description: 'Doğal travertenleri ve antik kenti keşfedin',
            imageUrl: 'https://picsum.photos/800/500?random=2',
            featured: true,
            createdAt: new Date().toISOString(),
            location: 'Denizli',
            duration: '8 saat',
            durationHours: 8,
            rating: 4.7,
            reviewCount: 182,
            popularityRate: 85,
            price: 1200,
            category: 'doga',
          },
          {
            id: '3',
            title: 'Efes Antik Kenti Turu',
            description:
              'Dünyanın en iyi korunmuş antik kentlerinden birini ziyaret edin',
            imageUrl: 'https://picsum.photos/800/500?random=3',
            featured: true,
            createdAt: new Date().toISOString(),
            location: 'İzmir',
            duration: '6 saat',
            durationHours: 6,
            rating: 4.9,
            reviewCount: 128,
            popularityRate: 95,
            price: 800,
            category: 'tarihi',
          },
          {
            id: '4',
            title: 'İstanbul Boğaz Turu',
            description: "Tekne ile İstanbul Boğazı'nı keşfedin",
            imageUrl: 'https://picsum.photos/800/500?random=4',
            featured: true,
            createdAt: new Date().toISOString(),
            location: 'İstanbul',
            duration: '4 saat',
            durationHours: 4,
            rating: 4.6,
            reviewCount: 352,
            popularityRate: 88,
            price: 1500,
            category: 'sehir',
            experienceType: 'tekne-turu',
          },
          {
            id: '5',
            title: 'Bodrum Tekne Turu',
            description:
              'Mavi sularında yüzme molalarıyla Bodrum koylarını keşfedin',
            imageUrl: 'https://picsum.photos/800/500?random=5',
            featured: false,
            createdAt: new Date().toISOString(),
            location: 'Muğla',
            duration: '7 saat',
            durationHours: 7,
            rating: 4.5,
            reviewCount: 276,
            popularityRate: 82,
            price: 950,
            category: 'deniz',
            experienceType: 'tekne-turu',
          },
          {
            id: '6',
            title: 'Safranbolu Evleri Turu',
            description:
              "UNESCO Dünya Mirası Listesi'nde yer alan tarihi evleri keşfedin",
            imageUrl: 'https://picsum.photos/800/500?random=6',
            featured: false,
            createdAt: new Date().toISOString(),
            location: 'Karabük',
            duration: '5 saat',
            durationHours: 5,
            rating: 4.4,
            reviewCount: 198,
            popularityRate: 75,
            price: 600,
            category: 'tarihi',
          },
          {
            id: '7',
            title: 'Fethiye Yamaç Paraşütü',
            description:
              'Ölüdeniz manzarasında heyecan dolu bir yamaç paraşütü deneyimi.',
            imageUrl:
              'https://images.unsplash.com/photo-1605539090181-d5d631629db1?q=80&w=2070&auto=format&fit=crop',
            featured: true,
            createdAt: new Date().toISOString(),
            location: 'Muğla',
            duration: '2 saat',
            durationHours: 2,
            rating: 4.9,
            reviewCount: 512,
            popularityRate: 96,
            price: 3500,
            category: 'macera',
            experienceType: 'parasailing',
          },
          {
            id: '8',
            title: 'Antalya Jeep Safari',
            description: "Toros Dağları'nda macera dolu bir jeep safari turu.",
            imageUrl:
              'https://images.unsplash.com/photo-1580654712642-f1643c51794a?q=80&w=2070&auto=format&fit=crop',
            featured: false,
            createdAt: new Date().toISOString(),
            location: 'Antalya',
            duration: '7 saat',
            durationHours: 7,
            rating: 4.6,
            reviewCount: 215,
            popularityRate: 80,
            price: 850,
            category: 'macera',
            experienceType: 'atv-safari',
          },
        ];
        setActivities(demoExperiences);
        setAllFilteredActivities(demoExperiences);
        setDisplayedActivities(demoExperiences.slice(0, ITEMS_PER_PAGE));
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  // Updated Filtering Logic
  useEffect(() => {
    const minPriceNum =
      typeof minPrice === 'string' ? parseFloat(minPrice) : minPrice;
    const maxPriceNum =
      typeof maxPrice === 'string' ? parseFloat(maxPrice) : maxPrice;
    const maxDurationNum =
      typeof maxDuration === 'string' ? parseFloat(maxDuration) : maxDuration;

    let tempFiltered = activities.filter((experience) => {
      const matchesSearch =
        experience.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        experience.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        experience.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'tumu' || experience.category === selectedCategory;

      const matchesExperienceType =
        !selectedActivityType ||
        experience.experienceType === selectedActivityType;

      const matchesCity =
        !selectedCity ||
        experience.location.toLowerCase() === selectedCity.toLowerCase();

      const matchesPrice =
        !experience.price ||
        ((isNaN(minPriceNum) || experience.price >= minPriceNum) &&
          (isNaN(maxPriceNum) || experience.price <= maxPriceNum));

      const matchesDuration =
        !experience.durationHours ||
        isNaN(maxDurationNum) ||
        experience.durationHours <= maxDurationNum;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesExperienceType &&
        matchesCity &&
        matchesPrice &&
        matchesDuration
      );
    });

    // Sorting logic
    tempFiltered.sort((a, b) => {
      const priceA = a.price ?? 0;
      const priceB = b.price ?? 0;
      switch (sortBy) {
        case 'price_asc':
          return priceA - priceB;
        case 'price_desc':
          return priceB - priceA;
        case 'rating':
          return b.rating - a.rating;
        case 'popularity': // Default sort
        default:
          return b.popularityRate - a.popularityRate;
      }
    });

    setAllFilteredActivities(tempFiltered); // Store all results
    setCurrentPage(1); // Reset page number when filters/sort change
    setDisplayedActivities(tempFiltered.slice(0, ITEMS_PER_PAGE)); // Display first page
  }, [
    searchTerm,
    selectedCategory,
    selectedActivityType,
    selectedCity,
    minPrice,
    maxPrice,
    maxDuration,
    sortBy,
    activities,
  ]);

  // Load More Handler
  const loadMoreActivities = () => {
    const nextPage = currentPage + 1;
    const nextItems = allFilteredActivities.slice(0, nextPage * ITEMS_PER_PAGE);
    setDisplayedActivities(nextItems);
    setCurrentPage(nextPage);
  };

  // Countdown Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    // Clear timeout if the component unmounts
    return () => clearTimeout(timer);
  }, [timeLeft, targetDate]);

  // Click outside handler for filter menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterMenuRef.current &&
        !filterMenuRef.current.contains(event.target as Node)
      ) {
        setIsFilterMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Active Filters Calculation & Display Logic
  const activeFilters = useMemo(() => {
    const filters = [];
    if (selectedActivityType) {
      const type = activityTypes.find((t) => t.id === selectedActivityType);
      if (type)
        filters.push({
          key: 'type',
          value: selectedActivityType,
          label: type.name,
        });
    }
    if (selectedCity) {
      filters.push({
        key: 'city',
        value: selectedCity,
        label: selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1),
      });
    }
    if (minPrice !== '' && maxPrice !== '') {
      filters.push({
        key: 'price',
        value: `${minPrice}-${maxPrice}`,
        label: `₺${minPrice} - ₺${maxPrice}`,
      });
    } else if (minPrice !== '') {
      filters.push({
        key: 'price',
        value: `min-${minPrice}`,
        label: `Min ₺${minPrice}`,
      });
    } else if (maxPrice !== '') {
      filters.push({
        key: 'price',
        value: `max-${maxPrice}`,
        label: `Max ₺${maxPrice}`,
      });
    }
    if (maxDuration !== '') {
      filters.push({
        key: 'duration',
        value: maxDuration,
        label: `Max ${maxDuration} sa`,
      });
    }
    return filters;
  }, [selectedActivityType, selectedCity, minPrice, maxPrice, maxDuration]);

  const removeFilter = (key: string) => {
    switch (key) {
      case 'type':
        setSelectedActivityType(undefined);
        break;
      case 'city':
        setSelectedCity(undefined);
        break;
      case 'price':
        setMinPrice('');
        setMaxPrice('');
        break;
      case 'duration':
        setMaxDuration('');
        break;
    }
    setIsFilterMenuOpen(false); // Close menu if open
  };

  // Reset Filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('tumu');
    setSelectedActivityType(undefined);
    setSelectedCity(undefined);
    setMinPrice('');
    setMaxPrice('');
    setMaxDuration('');
    setSortBy('popularity');
    setIsFilterMenuOpen(false);
  };

  // Skeleton component
  const ActivityCardSkeleton = () => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100/80 animate-pulse">
      <div className="relative h-56 bg-neutral-200"></div>
      <div className="p-5">
        <div className="h-6 bg-neutral-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-neutral-200 rounded w-1/2 mb-1.5"></div>
        <div className="h-4 bg-neutral-200 rounded w-1/3 mb-4"></div>
        <div className="flex items-center justify-between pt-4 border-t border-neutral-100/80">
          <div className="h-6 bg-neutral-200 rounded w-1/4"></div>
          <div className="h-8 bg-neutral-200 rounded-lg w-1/3"></div>
        </div>
      </div>
    </div>
  );

  // Helper function to generate city options
  const cities = useMemo(
    () => [
      'İstanbul',
      'Ankara',
      'İzmir',
      'Bursa',
      'Adana',
      'Antalya',
      'Konya',
      'Kayseri',
      'Eskişehir',
      'Kırıkkale',
      'Kırşehir',
      'Kızılcahamam',
      'Malatya',
      'Manisa',
      'Mardin',
      'Mersin',
      'Muğla',
      'Muş',
      'Nevşehir',
      'Ordu',
      'Rize',
      'Sakarya',
      'Samsun',
      'Şanlıurfa',
      'Siirt',
      'Sivas',
      'Tekirdağ',
      'Tokat',
      'Trabzon',
      'Tunceli',
      'Şırnak',
      'Uşak',
      'Van',
      'Yozgat',
      'Zonguldak',
    ],
    [],
  );

  return (
    <>
      {/* Hero Section - Stil Güncellendi */}
      <section className="relative w-full h-[550px] md:h-[600px]">
        <Image
          src="https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?q=80&w=2070&auto=format&fit=crop"
          alt="Bölge Aktiviteleri"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-sky-700/70 via-blue-800/60 to-sky-900/70 pointer-events-none" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Unutulmaz <span className="text-sky-300">Deneyimler</span>{' '}
              Keşfedin
            </h1>
            <p className="mt-4 text-lg text-sky-100/90 max-w-3xl mx-auto font-light">
              Türkiye'nin dört bir yanındaki en popüler turları ve aktiviteleri
              bulun.
            </p>
          </div>

          {/* Arama/Filtre Çubuğu Güncellendi */}
          <div className="relative z-10 w-full max-w-4xl mx-auto">
            <div className="bg-white/95 backdrop-blur-sm rounded-full shadow-xl p-1.5 flex items-center gap-1.5">
              {/* Search Input */}
              <div className="flex-1 relative pl-3 pr-2 flex items-center">
                <Search className="h-4 w-4 text-neutral-400 mr-2.5 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Aktivite, şehir veya açıklama ara..."
                  className="w-full py-2.5 text-sm text-neutral-900 placeholder-neutral-500 focus:outline-none bg-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filter Button */}
              <div className="relative" ref={filterMenuRef}>
                <button
                  onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-xs font-semibold transition-colors ${isFilterMenuOpen || activeFilters.length > 0 ? 'bg-sky-100/80 text-sky-700' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span>Filtrele</span>
                  {activeFilters.length > 0 && (
                    <span className="ml-0.5 bg-sky-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {activeFilters.length}
                    </span>
                  )}
                </button>

                {/* Filter Dropdown/Menu - Stil Güncellendi */}
                {isFilterMenuOpen && (
                  <div
                    className={cn(
                      'absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-neutral-100/80 z-50 overflow-hidden',
                      'transition-all duration-200 ease-out',
                      isFilterMenuOpen
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-95 pointer-events-none',
                    )}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-3 pb-3 border-b border-neutral-100">
                        <h4 className="text-sm font-semibold text-neutral-800">
                          Filtreler
                        </h4>
                        <button
                          onClick={resetFilters}
                          className="text-xs text-neutral-500 hover:text-rose-600 font-medium flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={
                            activeFilters.length === 0 &&
                            sortBy === 'popularity'
                          }
                        >
                          <Trash2 className="w-3 h-3" />
                          Temizle
                        </button>
                      </div>

                      {/* Filter Options - Stiller Güncellendi */}
                      <div className="space-y-3.5">
                        {/* Sort By */}
                        <div>
                          <label className="block text-xs font-medium text-neutral-600 mb-1">
                            Sırala
                          </label>
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-300 focus:border-sky-500 bg-white appearance-none"
                          >
                            {sortOptions.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Activity Type */}
                        <div>
                          <label className="block text-xs font-medium text-neutral-600 mb-1">
                            Aktivite Türü
                          </label>
                          <select
                            value={selectedActivityType || ''}
                            onChange={(e) =>
                              setSelectedActivityType(
                                e.target.value || undefined,
                              )
                            }
                            className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-300 focus:border-sky-500 bg-white appearance-none"
                          >
                            <option value="">Tüm Türler</option>
                            {activityTypes.map((type) => (
                              <option key={type.id} value={type.id}>
                                {type.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* City */}
                        <div>
                          <label className="block text-xs font-medium text-neutral-600 mb-1">
                            Şehir
                          </label>
                          <select
                            value={selectedCity || ''}
                            onChange={(e) =>
                              setSelectedCity(e.target.value || undefined)
                            }
                            className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-300 focus:border-sky-500 bg-white appearance-none"
                          >
                            <option value="">Tüm Şehirler</option>
                            {cities.map((city: string) => (
                              <option key={city} value={city.toLowerCase()}>
                                {city}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Price Range */}
                        <div>
                          <label className="block text-xs font-medium text-neutral-600 mb-1">
                            Fiyat Aralığı (₺)
                          </label>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              placeholder="Min"
                              min="0"
                              className="w-1/2 px-3 py-1.5 text-xs border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-300 focus:border-sky-500"
                              value={minPrice}
                              onChange={(e) => setMinPrice(e.target.value)}
                            />
                            <span className="text-neutral-400 text-sm">-</span>
                            <input
                              type="number"
                              placeholder="Max"
                              min="0"
                              className="w-1/2 px-3 py-1.5 text-xs border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-300 focus:border-sky-500"
                              value={maxPrice}
                              onChange={(e) => setMaxPrice(e.target.value)}
                            />
                          </div>
                        </div>

                        {/* Max Duration */}
                        <div>
                          <label
                            htmlFor="max-duration"
                            className="block text-xs font-medium text-neutral-600 mb-1.5"
                          >
                            Maksimum Süre (Saat)
                          </label>
                          <input
                            id="max-duration"
                            type="range"
                            min="1"
                            max="24" // Adjust max as needed
                            step="1"
                            value={maxDuration || 24}
                            onChange={(e) =>
                              setMaxDuration(
                                e.target.valueAsNumber === 24
                                  ? ''
                                  : e.target.value,
                              )
                            }
                            className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer range-thumb-sky accent-sky-600"
                          />
                          <div className="flex justify-between text-xs text-neutral-500 mt-1">
                            <span>1 sa</span>
                            <span>
                              {maxDuration ? `${maxDuration} sa` : 'Sınırsız'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setIsFilterMenuOpen(false)}
                        className="mt-4 w-full bg-sky-600 hover:bg-sky-700 text-white py-2 px-4 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Filtreleri Uygula
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Search Button */}
              <button className="bg-sky-600 hover:bg-sky-700 text-white rounded-full p-2.5 transition-colors shadow-md">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Wrapper */}
      <main className="w-full bg-neutral-50 py-12 md:py-16">
        <div className="w-full max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Kategori Butonları Güncellendi */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-800">
                Kategoriler
              </h3>
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="text-sky-600 hover:text-sky-800 text-xs font-medium flex items-center gap-1"
              >
                {showAllCategories ? 'Daha Az Göster' : 'Tümünü Göster'}
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${showAllCategories ? 'rotate-180' : ''}`}
                />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(showAllCategories ? categories : categories.slice(0, 6)).map(
                (category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ease-out ${selectedCategory === category.id ? 'bg-sky-600 text-white shadow-sm' : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200/80'}`}
                  >
                    {category.name}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Active Filter Tags */}
          {activeFilters.length > 0 && (
            <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-neutral-200 pb-4">
              <span className="text-xs font-semibold text-neutral-600 mr-1">
                Aktif Filtreler:
              </span>
              {activeFilters.map((filter) => (
                <div
                  key={filter.key}
                  className="inline-flex items-center gap-1 bg-sky-100/80 text-sky-800 text-xs font-semibold px-2.5 py-1 rounded-full"
                >
                  <span>{filter.label}</span>
                  <button
                    onClick={() => removeFilter(filter.key)}
                    className="ml-0.5 text-sky-600 hover:text-sky-800"
                  >
                    <X className="h-3 w-3 stroke-2" />
                  </button>
                </div>
              ))}
              <button
                onClick={resetFilters}
                className="text-xs text-neutral-500 hover:text-rose-600 font-medium flex items-center gap-1 ml-auto"
              >
                <Trash2 className="w-3.5 h-3.5" /> Filtreleri Temizle
              </button>
            </div>
          )}

          {/* Activity Listing Section Header */}
          <div className="mb-6 flex flex-col md:flex-row justify-between md:items-center gap-2">
            <div>
              <h2 className="text-xl lg:text-2xl font-semibold text-neutral-900 tracking-tight">
                Aktiviteler
              </h2>
              <p className="mt-0.5 text-xs text-neutral-600">
                {!loading &&
                  `${allFilteredActivities.length} aktivite bulundu.`}
              </p>
            </div>
          </div>

          {/* Loading / No Results / Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                <ActivityCardSkeleton key={i} />
              ))}
            </div>
          ) : displayedActivities.length === 0 ? (
            <div className="mt-10 text-center">
              <div className="rounded-lg border-2 border-dashed border-neutral-300 p-12 bg-white">
                <Filter className="mx-auto h-10 w-10 text-neutral-400 mb-4" />
                <h3 className="text-base font-semibold text-neutral-800 mb-2">
                  Sonuç Bulunamadı
                </h3>
                <p className="text-xs text-neutral-500 mb-4 max-w-xs mx-auto">
                  Arama kriterlerinize uygun aktivite bulunamadı. Filtreleri
                  değiştirmeyi veya temizlemeyi deneyin.
                </p>
                <button
                  className="text-sky-600 hover:text-sky-800 font-medium text-xs flex items-center justify-center mx-auto gap-1"
                  onClick={resetFilters}
                >
                  <Trash2 className="w-3.5 h-3.5" /> Filtreleri Temizle
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {displayedActivities.map((experience) => (
                  <Link
                    href={`/activities/${experience.id}`}
                    key={experience.id}
                    className="group block bg-white rounded-xl overflow-hidden shadow-sm border border-neutral-100/80 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={experience.imageUrl}
                        alt={experience.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Top Right Badge (Rating) */}
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-semibold text-gray-800">
                            {experience.rating.toFixed(1)}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({experience.reviewCount})
                          </span>
                        </div>
                      </div>
                      {/* Top Left Badge (Category/Type) */}
                      {experience.category && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-sky-500 to-blue-600 px-2.5 py-1 rounded-md shadow">
                          <span className="text-[11px] font-semibold text-white capitalize tracking-wide">
                            {experience.category}
                          </span>
                        </div>
                      )}
                      {/* Partner üyelik arması (müşteri değerlendirmelerinden otomatik hesaplanır) */}
                      <div
                        className={`absolute left-3 ${experience.category ? 'top-12' : 'top-3'}`}
                      >
                        <MembershipBadge
                          tier={experience.experienceOperator?.membershipTier}
                          variant="onImage"
                        />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-base font-semibold text-neutral-900 mb-1.5 line-clamp-2 group-hover:text-sky-700 transition-colors duration-200">
                        {experience.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-600 mb-1">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-neutral-400" />
                        <span>{experience.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-600 mb-3">
                        <Clock className="w-3.5 h-3.5 flex-shrink-0 text-neutral-400" />
                        <span>
                          {experience.duration}{' '}
                          {experience.durationHours
                            ? `(${experience.durationHours} sa)`
                            : ''}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-neutral-100/80">
                        {experience.price ? (
                          <span className="text-lg font-bold text-sky-600">
                            ₺{experience.price.toLocaleString('tr-TR')}
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-neutral-500">
                            Fiyat Sorunuz
                          </span>
                        )}
                        <span className="inline-flex items-center px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-md transition-colors duration-200 cursor-pointer">
                          Detayları Gör
                          <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {/* Load More Button */}
              {displayedActivities.length < allFilteredActivities.length && (
                <div className="mt-12 text-center">
                  <button
                    onClick={loadMoreActivities}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                    Daha Fazla Yükle (
                    {allFilteredActivities.length -
                      displayedActivities.length}{' '}
                    tane daha)
                  </button>
                </div>
              )}
            </>
          )}

          {/* Other Sections (Popular Categories, Offers, Events, Stats, Testimonials) */}

          {/* --- Popular Categories: Stil Güncellendi */}
          <div className="mt-16 md:mt-20">
            <div className="mb-6 md:mb-8">
              <h2 className="text-xl lg:text-2xl font-semibold text-neutral-900">
                Popüler Kategorilerimiz
              </h2>
              <p className="mt-1 text-xs text-neutral-600">
                En çok tercih edilen deneyim türlerini keşfedin.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {[
                {
                  id: 'doga',
                  name: 'Doğa Turları',
                  image:
                    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop',
                  count: 24,
                },
                {
                  id: 'macera',
                  name: 'Macera Turları',
                  image:
                    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop',
                  count: 18,
                },
                {
                  id: 'kultur',
                  name: 'Kültür Turları',
                  image:
                    'https://images.unsplash.com/photo-1639580636443-7e739c13bbde?q=80&w=2070&auto=format&fit=crop',
                  count: 32,
                },
                {
                  id: 'gastronomi',
                  name: 'Gastronomi Turları',
                  image:
                    'https://images.unsplash.com/photo-1561758033-7e924f619b47?q=80&w=2070&auto=format&fit=crop',
                  count: 12,
                },
              ].map((category) => (
                <Link
                  href={`/activities?category=${category.id}`}
                  key={category.id}
                  className="group relative overflow-hidden rounded-lg h-64 shadow-sm block border border-neutral-100/80 hover:shadow-lg transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10 transition-opacity duration-300 group-hover:from-black/70" />
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 z-20 flex flex-col justify-end p-5 text-white">
                    <h3 className="text-lg font-semibold mb-1 transition-transform duration-300 group-hover:-translate-y-1">
                      {category.name}
                    </h3>
                    <p className="text-xs text-white/80 mb-2 transition-opacity duration-300 group-hover:opacity-0">
                      {category.count} aktivite
                    </p>
                    <div className="flex items-center text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <span>Kategoriyi Keşfet</span>
                      <ChevronRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* --- Limited Time Offer - Stil Güncellendi */}
          <div className="mt-16 md:mt-20">
            <div className="bg-gradient-to-r from-sky-600 to-blue-700 rounded-xl overflow-hidden shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-8 lg:p-10 flex flex-col justify-center text-white">
                  <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-sky-700 mb-3 self-start shadow-sm">
                    <Timer className="w-3 h-3 mr-1" /> SINIRLI SÜRE TEKLİFİ
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-3 tracking-tight">
                    Yaz Tatili Erken Rezervasyon Fırsatı
                  </h2>
                  <p className="text-sky-100/90 mb-5 text-sm font-light">
                    Yaz aylarındaki tüm tur paketlerinde %25'e varan indirim
                    fırsatını kaçırmayın. Erken rezervasyon avantajlarıyla
                    hayalinizdeki tatili şimdiden planlayın.
                  </p>
                  <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
                    {Object.entries(timeLeft).map(([unit, value]) => (
                      <div
                        key={unit}
                        className="bg-white/15 backdrop-blur-sm rounded-md p-2 text-center min-w-[60px] sm:min-w-[70px]"
                      >
                        <div className="text-xl sm:text-2xl font-bold tabular-nums">
                          {String(value).padStart(2, '0')}
                        </div>
                        <div className="text-[10px] text-sky-200/80 uppercase tracking-wider capitalize">
                          {unit === 'days'
                            ? 'Gün'
                            : unit === 'hours'
                              ? 'Saat'
                              : unit === 'minutes'
                                ? 'Dakika'
                                : 'Saniye'}
                        </div>
                      </div>
                    ))}
                  </div>
                  {timeLeft.days === 0 &&
                    timeLeft.hours === 0 &&
                    timeLeft.minutes === 0 &&
                    timeLeft.seconds === 0 && (
                      <p className="text-amber-300 font-medium text-xs w-full">
                        Bu fırsat sona erdi!
                      </p>
                    )}
                </div>
                <div className="relative h-64 lg:h-auto min-h-[300px]">
                  <Image
                    src="https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=2070&auto=format&fit=crop"
                    alt="Yaz Tatili Fırsatları"
                    fill
                    className="object-cover lg:rounded-r-xl"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* --- Special Events - Stil Güncellendi */}
          <div className="mt-16 md:mt-20">
            <div className="mb-6 md:mb-8 flex justify-between items-center">
              <div>
                <h2 className="text-xl lg:text-2xl font-semibold text-neutral-900">
                  Özel Etkinlikler
                </h2>
                <p className="mt-1 text-xs text-neutral-600">
                  Bu yaz unutulmaz deneyimler yaşayabileceğiniz özel etkinlikler
                </p>
              </div>
              <Link
                href="/special-events"
                className="text-sky-600 hover:text-sky-800 font-medium flex items-center text-xs"
              >
                Tümünü Görüntüle
                <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
              {[
                {
                  id: 1,
                  title: 'Kapadokya Festival Haftası',
                  date: '15-22 Temmuz 2023',
                  image:
                    'https://images.unsplash.com/photo-1486911278844-a81c5267e227?q=80&w=2070&auto=format&fit=crop',
                  location: 'Kapadokya Vadisi',
                },
                {
                  id: 2,
                  title: 'Efes Antik Tiyatro Konserleri',
                  date: '5-12 Ağustos 2023',
                  image:
                    'https://images.unsplash.com/photo-1607998802009-26ce5b682ad1?q=80&w=2070&auto=format&fit=crop',
                  location: 'Efes Antik Kenti, İzmir',
                },
                {
                  id: 3,
                  title: "Boğaz'da Yemek Festivali",
                  date: '3-10 Haziran 2023',
                  image:
                    'https://images.unsplash.com/photo-1527547637224-a93d42c7b332?q=80&w=2070&auto=format&fit=crop',
                  location: 'İstanbul Boğazı',
                },
              ].map((event) => (
                <Link
                  href={`/event/${event.id}`}
                  key={event.id}
                  className="group relative block overflow-hidden rounded-lg shadow-sm border border-neutral-100/80 hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative h-64 w-full">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/80" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="text-sky-300 text-[11px] font-semibold mb-0.5 uppercase tracking-wider">
                      {event.date}
                    </div>
                    <h3 className="text-white text-base font-semibold mb-0.5 line-clamp-2 transition-transform duration-300 group-hover:-translate-y-0.5">
                      {event.title}
                    </h3>
                    <div className="flex items-center text-white/70 text-[11px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <MapPin className="h-3 w-3 mr-0.5" />
                      {event.location}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* --- Statistics Section - Stil Güncellendi */}
          <div className="mt-16 md:mt-20 bg-neutral-100/70 rounded-xl py-10 px-6 md:px-8 border border-neutral-200/60 relative overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
              {[
                {
                  icon: Users,
                  val: '10K+',
                  text: 'Mutlu Müşteri',
                  color: 'text-sky-600',
                },
                {
                  icon: MapPin,
                  val: '500+',
                  text: 'Benzersiz Tur',
                  color: 'text-amber-600',
                },
                {
                  icon: Star,
                  val: '4.8/5',
                  text: 'Ortalama Puan',
                  color: 'text-emerald-600',
                },
                {
                  icon: Calendar,
                  val: '7+',
                  text: 'Yıllık Deneyim',
                  color: 'text-rose-600',
                },
              ].map((stat, index) => (
                <div key={index} className="flex flex-col items-center">
                  <stat.icon
                    className={`w-8 h-8 md:w-10 md:h-10 mb-2 ${stat.color}`}
                    strokeWidth={1.5}
                  />
                  <div className="text-2xl md:text-3xl font-bold text-neutral-800 tracking-tight">
                    {stat.val}
                  </div>
                  <div className="mt-0.5 text-xs md:text-sm text-neutral-600">
                    {stat.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- Customer Testimonials - Stil Güncellendi */}
          <div className="mt-16 md:mt-20 mb-12 md:mb-16">
            <div className="text-center mb-10 md:mb-12">
              <h2 className="text-2xl lg:text-3xl font-semibold text-neutral-900 tracking-tight">
                Müşterilerimiz Ne Diyor?
              </h2>
              <p className="mt-2 text-sm text-neutral-600 max-w-xl mx-auto">
                Misafirlerimizin bizimle yaşadıkları unutulmaz deneyimlere göz
                atın.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  name: 'Ayşe Y.',
                  avatar: 'https://picsum.photos/100/100?random=20',
                  text: 'Kapadokya balon turu hayatımda yaşadığım en güzel deneyimlerden biriydi. Her şey sorunsuz ilerledi ve rehberimiz çok bilgiliydi.',
                  tour: 'Kapadokya Balon Turu',
                  rating: 5,
                },
                {
                  name: 'Mehmet K.',
                  avatar: 'https://picsum.photos/100/100?random=21',
                  text: "İstanbul Boğaz Turu'nda harika bir gün geçirdik. Tekne çok konforluydu ve boğaz manzarası muhteşemdi. Kesinlikle tavsiye ederim!",
                  tour: 'İstanbul Boğaz Turu',
                  rating: 4,
                },
                {
                  name: 'Zeynep A.',
                  avatar: 'https://picsum.photos/100/100?random=22',
                  text: 'Efes Antik Kenti turu beklentilerimin ötesindeydi. Rehberimiz çok bilgiliydi ve tarih hakkında çok şey öğrendim.',
                  tour: 'Efes Antik Kenti Turu',
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-sm border border-neutral-100/80 hover:shadow-lg transition-shadow duration-300 flex flex-col"
                >
                  <div className="flex items-center mb-2.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-300'}`}
                      />
                    ))}
                  </div>
                  <p className="text-neutral-600 italic mb-4 text-sm flex-grow">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center mt-auto pt-3.5 border-t border-neutral-100/80">
                    <div className="relative w-9 h-9 mr-3 flex-shrink-0">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        fill
                        sizes="44px"
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-900 text-sm">
                        {testimonial.name}
                      </h4>
                      <p className="text-xs text-neutral-500">
                        Katıldığı Tur: {testimonial.tour}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

// Helper function or CSS needed for custom scrollbar and range thumb
/*
Add to your global CSS or a style block:
.custom-scrollbar::-webkit-scrollbar {
  height: 4px; 
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1; // gray-300
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8; // gray-500
}

.range-thumb-blue::-webkit-slider-thumb {
  -webkit-appearance: none; 
  appearance: none;
  width: 16px; 
  height: 16px; 
  background: #3b82f6; // blue-500
  border-radius: 50%;
  cursor: pointer;
}

.range-thumb-blue::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}
*/
