'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { searchExperiences } from '@/services/activity';
import {
  calculateTimeLeft,
  ITEMS_PER_PAGE,
} from './activities-page/activities-page.helpers';
import {
  ActivitiesPageUiProvider,
  type ActivitiesPageUiContextValue,
} from './activities-page/activities-page-context';
import { ActivitiesPageHero } from './activities-page/activities-page-hero';
import { ActivitiesPageListing } from './activities-page/activities-page-listing';
import { ActivitiesPageMarketing } from './activities-page/activities-page-marketing';
import type {
  Experience,
  ExperienceApiRow,
} from './activities-page/activities-page.types';

export default function ActivitiesPageClient() {
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
        const { data: payload } = await searchExperiences({ limit: 100 });
        const rows = Array.isArray(payload) ? payload : [];
        const mapped = rows.map((row) => {
          const r = row as unknown as ExperienceApiRow;
          return {
            id: String(r.id),
            title: r.title || '',
            description: r.description || '',
            imageUrl: r.coverUrl || r.imageUrl || '',
            featured: Boolean(r.featured),
            createdAt: r.createdAt || new Date().toISOString(),
            location: r.location || r.city || 'Türkiye',
            duration:
              r.durationHours != null
                ? `${r.durationHours} saat`
                : r.duration || '',
            rating: Number(r.averageRating ?? r.rating ?? 0),
            reviewCount: Number(r.reviewCount ?? 0),
            popularityRate: Number(r.popularityRate ?? 0),
            price: r.price != null ? Number(r.price) : undefined,
            category: r.category,
            durationHours: r.durationHours,
            experienceType: r.experienceType || r.category,
            experienceOperator: r.experienceOperator || r.partner || null,
          };
        });
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

    const tempFiltered = activities.filter((experience) => {
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

  const ui: ActivitiesPageUiContextValue = {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    maxDuration,
    setMaxDuration,
    selectedActivityType,
    setSelectedActivityType,
    selectedCity,
    setSelectedCity,
    sortBy,
    setSortBy,
    isFilterMenuOpen,
    setIsFilterMenuOpen,
    filterMenuRef,
    resetFilters,
    categories,
    showAllCategories,
    setShowAllCategories,
    loading,
    displayedActivities,
    allFilteredActivities,
    cities,
    activityTypes,
    sortOptions,
    timeLeft,
    activeFilters,
    removeFilter,
    loadMoreActivities,
  };

  return (
    <ActivitiesPageUiProvider value={ui}>
      <>
        <ActivitiesPageHero />

        {/* Main Content Wrapper */}
        <main className="w-full bg-neutral-50 py-12 md:py-16">
          <div className="w-full max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            <ActivitiesPageListing />
            <ActivitiesPageMarketing />
          </div>
        </main>
      </>
    </ActivitiesPageUiProvider>
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
