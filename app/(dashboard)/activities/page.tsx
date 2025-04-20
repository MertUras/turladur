"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, MapPin, Clock, ChevronLeft, ChevronRight, Search, Star, Filter, Calendar, Users, X, Wallet, Timer, ChevronDown, SlidersHorizontal, Trash2, ArrowUpDown, Plus } from "lucide-react";

interface Experience {
    id: number;
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
}

// --- Helper Function for Countdown --- 
const calculateTimeLeft = (targetDate: Date) => {
    const difference = +targetDate - +new Date();
    let timeLeft = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    };

    if (difference > 0) {
        timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
        };
    }

    return timeLeft;
};

const ITEMS_PER_PAGE = 8; // Number of items to load per page

export default function ActivitiesPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [activities, setActivities] = useState<Experience[]>([]);
    const [allFilteredActivities, setAllFilteredActivities] = useState<Experience[]>([]); // Store all filtered/sorted results
    const [displayedActivities, setDisplayedActivities] = useState<Experience[]>([]); // Store currently displayed results
    const [currentPage, setCurrentPage] = useState(1);
    
    // --- Filter & Sort States --- 
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>("tumu");
    const [minPrice, setMinPrice] = useState<number | string>('');
    const [maxPrice, setMaxPrice] = useState<number | string>('');
    const [maxDuration, setMaxDuration] = useState<number | string>('');
    const [selectedActivityType, setSelectedActivityType] = useState<string | undefined>(undefined);
    const [selectedCity, setSelectedCity] = useState<string | undefined>(undefined);
    const [sortBy, setSortBy] = useState<string>('popularity');
    
    // --- UI States --- 
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const filterMenuRef = useRef<HTMLDivElement>(null);

    // --- Countdown State --- 
    const [targetDate] = useState(new Date(new Date().getTime() + 21 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000 + 45 * 60 * 1000 + 37 * 1000));
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

    // Kategoriler
    const categories = [
        { id: "tumu", name: "Tümü" },
        { id: "doga", name: "Doğa" },
        { id: "tarihi", name: "Tarihi" },
        { id: "deniz", name: "Deniz" },
        { id: "sehir", name: "Şehir" },
        { id: "macera", name: "Macera" }
    ];

    // Aktivite Türleri
    const activityTypes = [
        { id: "balon-turu", name: "Balon Turu" },
        { id: "helikopter-turu", name: "Helikopter Turu" },
        { id: "jetski", name: "Jetski" },
        { id: "parasailing", name: "Parasailing" },
        { id: "atv-safari", name: "ATV Safari" },
        { id: "tekne-turu", name: "Tekne Turu" },
        { id: "dalis", name: "Dalış" },
        { id: "zipline", name: "Zipline" }
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
                const response = await fetch('/api/activities');
                if (!response.ok) {
                    throw new Error('Failed to fetch activities');
                }
                const data = await response.json();
                setActivities(data);
                setAllFilteredActivities(data);
                setDisplayedActivities(data.slice(0, ITEMS_PER_PAGE));
            } catch (error) {
                console.error("Error fetching experiences:", error);
                // Fallback to demo data in case of error
                const demoExperiences = [
                    {
                        id: 1,
                        title: "Kapadokya Balon Turu",
                        description: "Eşsiz peri bacaları manzarasında unutulmaz bir balon deneyimi yaşayın",
                        imageUrl: "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?q=80&w=2070&auto=format&fit=crop",
                        featured: true,
                        createdAt: new Date().toISOString(),
                        location: "Kapadokya",
                        duration: "3 saat",
                        durationHours: 3,
                        rating: 4.8,
                        reviewCount: 423,
                        popularityRate: 90,
                        price: 4200,
                        category: "macera",
                        experienceType: "balon-turu"
                    },
                    {
                        id: 2,
                        title: "Pamukkale & Hierapolis Turu",
                        description: "Doğal travertenleri ve antik kenti keşfedin",
                        imageUrl: "https://picsum.photos/800/500?random=2",
                        featured: true,
                        createdAt: new Date().toISOString(),
                        location: "Denizli",
                        duration: "8 saat",
                        durationHours: 8,
                        rating: 4.7,
                        reviewCount: 182,
                        popularityRate: 85,
                        price: 1200,
                        category: "doga"
                    },
                    {
                        id: 3,
                        title: "Efes Antik Kenti Turu",
                        description: "Dünyanın en iyi korunmuş antik kentlerinden birini ziyaret edin",
                        imageUrl: "https://picsum.photos/800/500?random=3",
                        featured: true,
                        createdAt: new Date().toISOString(),
                        location: "İzmir",
                        duration: "6 saat",
                        durationHours: 6,
                        rating: 4.9,
                        reviewCount: 128,
                        popularityRate: 95,
                        price: 800,
                        category: "tarihi"
                    },
                    {
                        id: 4,
                        title: "İstanbul Boğaz Turu",
                        description: "Tekne ile İstanbul Boğazı'nı keşfedin",
                        imageUrl: "https://picsum.photos/800/500?random=4",
                        featured: true,
                        createdAt: new Date().toISOString(),
                        location: "İstanbul",
                        duration: "4 saat",
                        durationHours: 4,
                        rating: 4.6,
                        reviewCount: 352,
                        popularityRate: 88,
                        price: 1500,
                        category: "sehir",
                        experienceType: "tekne-turu"
                    },
                    {
                        id: 5,
                        title: "Bodrum Tekne Turu",
                        description: "Mavi sularında yüzme molalarıyla Bodrum koylarını keşfedin",
                        imageUrl: "https://picsum.photos/800/500?random=5",
                        featured: false,
                        createdAt: new Date().toISOString(),
                        location: "Muğla",
                        duration: "7 saat",
                        durationHours: 7,
                        rating: 4.5,
                        reviewCount: 276,
                        popularityRate: 82,
                        price: 950,
                        category: "deniz",
                        experienceType: "tekne-turu"
                    },
                    {
                        id: 6,
                        title: "Safranbolu Evleri Turu",
                        description: "UNESCO Dünya Mirası Listesi'nde yer alan tarihi evleri keşfedin",
                        imageUrl: "https://picsum.photos/800/500?random=6",
                        featured: false,
                        createdAt: new Date().toISOString(),
                        location: "Karabük",
                        duration: "5 saat",
                        durationHours: 5,
                        rating: 4.4,
                        reviewCount: 198,
                        popularityRate: 75,
                        price: 600,
                        category: "tarihi"
                    }
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
        const minPriceNum = typeof minPrice === 'string' ? parseFloat(minPrice) : minPrice;
        const maxPriceNum = typeof maxPrice === 'string' ? parseFloat(maxPrice) : maxPrice;
        const maxDurationNum = typeof maxDuration === 'string' ? parseFloat(maxDuration) : maxDuration;

        let tempFiltered = activities.filter(experience => {
            const matchesSearch = (
                experience.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                experience.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                experience.description.toLowerCase().includes(searchTerm.toLowerCase())
            );

            const matchesCategory = selectedCategory === "tumu" || experience.category === selectedCategory;

            const matchesExperienceType = !selectedActivityType || experience.experienceType === selectedActivityType;
            
            const matchesCity = !selectedCity || experience.location.toLowerCase() === selectedCity.toLowerCase();

            const matchesPrice = (!experience.price || (
                (isNaN(minPriceNum) || experience.price >= minPriceNum) &&
                (isNaN(maxPriceNum) || experience.price <= maxPriceNum)
            ));

            const matchesDuration = (!experience.durationHours || isNaN(maxDurationNum) || experience.durationHours <= maxDurationNum);

            return matchesSearch && matchesCategory && matchesExperienceType && matchesCity && matchesPrice && matchesDuration;
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
    }, [searchTerm, selectedCategory, selectedActivityType, selectedCity, minPrice, maxPrice, maxDuration, sortBy, activities]);

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
            if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
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
            const type = activityTypes.find(t => t.id === selectedActivityType);
            if (type) filters.push({ key: 'type', value: selectedActivityType, label: type.name });
        }
        if (selectedCity) {
            filters.push({ key: 'city', value: selectedCity, label: selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1) });
        }
        if (minPrice !== '' && maxPrice !== '') {
            filters.push({ key: 'price', value: `${minPrice}-${maxPrice}`, label: `₺${minPrice} - ₺${maxPrice}` });
        } else if (minPrice !== '') {
            filters.push({ key: 'price', value: `min-${minPrice}`, label: `Min ₺${minPrice}` });
        } else if (maxPrice !== '') {
            filters.push({ key: 'price', value: `max-${maxPrice}`, label: `Max ₺${maxPrice}` });
        }
        if (maxDuration !== '') {
            filters.push({ key: 'duration', value: maxDuration, label: `Max ${maxDuration} sa` });
        }
        return filters;
    }, [selectedActivityType, selectedCity, minPrice, maxPrice, maxDuration]);

    const removeFilter = (key: string) => {
        switch (key) {
            case 'type': setSelectedActivityType(undefined); break;
            case 'city': setSelectedCity(undefined); break;
            case 'price': 
                setMinPrice('');
                setMaxPrice(''); 
                break;
            case 'duration': setMaxDuration(''); break;
        }
        setIsFilterMenuOpen(false); // Close menu if open
    };

    // Reset Filters
    const resetFilters = () => {
        setSearchTerm("");
        setSelectedCategory("tumu");
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
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
            <div className="relative h-56 bg-gray-200"></div>
            <div className="p-5">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-1.5"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-8 bg-gray-200 rounded-lg w-1/3"></div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Hero Section - Refined */}
            <section className="relative w-full h-[550px] md:h-[600px]">
                <Image
                    src="https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?q=80&w=2070&auto=format&fit=crop"
                    alt="Bölge Aktiviteleri"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/20 pointer-events-none" />
                <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
                    <div className="w-full max-w-4xl text-center mb-8">
                        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                            <span className="block text-blue-400">Bölgenin</span> <span className="block text-orange-400">En İyi</span> <span className="block text-blue-400">Aktiviteleri</span>
                        </h1>
                        <p className="mt-6 text-xl text-white max-w-3xl mx-auto">
                            Bulunduğunuz bölgedeki en popüler ve eğlenceli aktiviteleri keşfedin.
                        </p>
                    </div>
                        
                    {/* Refined Search Section */}
                    <div className="relative z-10 w-full max-w-4xl mx-auto">
                        <div className="bg-white/95 backdrop-blur-sm rounded-full shadow-xl p-2 flex items-center gap-2">
                            {/* Search Input */}
                            <div className="flex-1 relative pl-4 pr-2 flex items-center">
                                <Search className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Aktivite, şehir veya açıklama ara..."
                                    className="w-full py-3 text-base text-gray-900 placeholder-gray-500 focus:outline-none bg-transparent"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Filter Button */}
                            <div className="relative" ref={filterMenuRef}>
                                <button 
                                    onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                                    className={`flex items-center gap-2 px-4 py-3 rounded-full text-sm font-medium transition-colors ${isFilterMenuOpen || activeFilters.length > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    <SlidersHorizontal className="h-4 w-4" />
                                    <span>Filtrele</span>
                                    {activeFilters.length > 0 && (
                                        <span className="ml-1 bg-blue-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{activeFilters.length}</span>
                                    )}
                                </button>

                                {/* Filter Dropdown/Menu */} 
                                {isFilterMenuOpen && (
                                    <div className={`absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 transition-all duration-300 ease-in-out transform ${isFilterMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                        <div className="p-5">
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="text-lg font-semibold text-gray-800">Filtreler</h4>
                                                <button 
                                                    onClick={resetFilters} 
                                                    className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    disabled={activeFilters.length === 0 && sortBy === 'popularity'}
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                    Temizle
                                                </button>
                                            </div>

                                            {/* Filter Options */}
                                            <div className="space-y-4">
                                                {/* Sort By */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Sırala</label>
                                                    <select 
                                                        value={sortBy} 
                                                        onChange={(e) => setSortBy(e.target.value)}
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                                    >
                                                        {sortOptions.map(option => (
                                                            <option key={option.id} value={option.id}>{option.name}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Activity Type */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Aktivite Türü</label>
                                                    <select 
                                                        value={selectedActivityType || ""} 
                                                        onChange={(e) => setSelectedActivityType(e.target.value || undefined)}
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                                    >
                                                        <option value="">Tüm Türler</option>
                                                        {activityTypes.map(type => (
                                                            <option key={type.id} value={type.id}>{type.name}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* City */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Şehir</label>
                                                    <select 
                                                        value={selectedCity || ""} 
                                                        onChange={(e) => setSelectedCity(e.target.value || undefined)}
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                                    >
                                                        <option value="">Tüm Şehirler</option>
                                                        {/* Dynamically get cities from activities or use a predefined list */}
                                                        {Array.from(new Set(activities.map(a => a.location))).sort().map(city => (
                                                            <option key={city} value={city.toLowerCase()}>{city}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Price Range */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Fiyat Aralığı (₺)</label>
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            placeholder="Min"
                                                            min="0"
                                                            className="w-1/2 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                            value={minPrice}
                                                            onChange={(e) => setMinPrice(e.target.value)}
                                                        />
                                                        <span className="text-gray-400">-</span>
                                                        <input
                                                            type="number"
                                                            placeholder="Max"
                                                            min="0"
                                                            className="w-1/2 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                            value={maxPrice}
                                                            onChange={(e) => setMaxPrice(e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Max Duration */}
                                                <div>
                                                    <label htmlFor="max-duration" className="block text-sm font-medium text-gray-600 mb-1.5">Maksimum Süre (Saat)</label>
                                                    <input
                                                        id="max-duration"
                                                        type="range"
                                                        min="1"
                                                        max="24" // Adjust max as needed
                                                        step="1"
                                                        value={maxDuration || 24}
                                                        onChange={(e) => setMaxDuration(e.target.valueAsNumber === 24 ? '' : e.target.value)}
                                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-thumb-blue"
                                                    />
                                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                        <span>1 sa</span>
                                                        <span>{maxDuration ? `${maxDuration} sa` : 'Sınırsız'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <button 
                                                onClick={() => setIsFilterMenuOpen(false)} 
                                                className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                                            >
                                                Filtreleri Uygula
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Search Button */}
                            <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 transition-colors">
                                <Search className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Wrapper */}
            <main className="w-full bg-gray-50 py-12 md:py-16">
                <div className="w-full max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Refined Activity Categories Buttons */}
                    <div className="mb-10">
                        <div className="flex items-center space-x-2 overflow-x-auto pb-2 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 custom-scrollbar">
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ease-in-out whitespace-nowrap ${selectedCategory === category.id ? 'bg-blue-600 text-white shadow-md scale-105' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 hover:scale-105 active:scale-100'}`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Active Filter Tags */}
                    {activeFilters.length > 0 && (
                        <div className="mb-6 flex flex-wrap items-center gap-2">
                            <span className="text-sm font-medium text-gray-600">Aktif Filtreler:</span>
                            {activeFilters.map(filter => (
                                <div key={filter.key} className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                                    <span>{filter.label}</span>
                                    <button onClick={() => removeFilter(filter.key)} className="ml-1 text-blue-600 hover:text-blue-800">
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))}
                            <button 
                                onClick={resetFilters} 
                                className="text-xs text-gray-500 hover:text-red-600 font-medium flex items-center gap-1 ml-2"
                            >
                                <Trash2 className="w-3.5 h-3.5" /> Tümünü Temizle
                            </button>
                        </div>
                    )}

                    {/* Activity Listing Section Header */}
                    <div className="mb-8 flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <div>
                            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Popüler Aktiviteler</h2>
                            <p className="mt-1 text-sm text-gray-600">
                                {!loading && `${allFilteredActivities.length} aktivite bulundu.`}
                            </p>
                        </div>
                    </div>

                    {/* Loading / No Results / Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                            {[...Array(ITEMS_PER_PAGE)].map((_, i) => <ActivityCardSkeleton key={i} />)} 
                        </div>
                    ) : displayedActivities.length === 0 ? (
                        <div className="mt-8 text-center">
                            <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 bg-white">
                                <Filter className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Sonuç Bulunamadı</h3>
                                <p className="text-sm text-gray-500 mb-4">Arama kriterlerinize uygun aktivite bulunamadı. Filtreleri değiştirmeyi veya sıfırlamayı deneyin.</p>
                                <button 
                                    className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center justify-center mx-auto gap-1"
                                    onClick={resetFilters}
                                >
                                    <Trash2 className="w-4 h-4"/> Filtreleri Sıfırla
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                                {displayedActivities.map((experience) => (
                                    // --- Refined Activity Card --- 
                                    <Link 
                                        href={`/activities/${experience.id}`} 
                                        key={experience.id} 
                                        className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1"
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
                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm">
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                    <span className="text-sm font-semibold text-gray-800">{experience.rating.toFixed(1)}</span> 
                                                    <span className="text-xs text-gray-500">({experience.reviewCount})</span>
                                                </div>
                                            </div>
                                            {/* Top Left Badge (Category/Type) */}
                                            {experience.category && (
                                              <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-blue-500 px-3 py-1 rounded-lg shadow">
                                                  <span className="text-xs font-semibold text-white capitalize tracking-wide">{experience.category}</span>
                                              </div>
                                            )}
                                        </div>
                                        <div className="p-5">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors duration-200">{experience.title}</h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1.5">
                                                <MapPin className="w-4 h-4 flex-shrink-0 text-gray-400" />
                                                <span>{experience.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                                                <Clock className="w-4 h-4 flex-shrink-0 text-gray-400" />
                                                <span>{experience.duration} {experience.durationHours ? `(${experience.durationHours} sa)` : ''}</span>
                                            </div>
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                {experience.price ? (
                                                    <span className="text-xl font-bold text-blue-600">₺{experience.price.toLocaleString('tr-TR')}</span>
                                                ) : (
                                                    <span className="text-sm font-medium text-gray-500">Fiyat Sorunuz</span>
                                                )}
                                                {/* Button style updated to match premium feel */}
                                                <span className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors duration-200 cursor-pointer">
                                                    Detayları Gör
                                                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform"/>
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
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        <Plus className="w-5 h-5" />
                                        Daha Fazla Yükle ({allFilteredActivities.length - displayedActivities.length} tane daha)
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {/* Other Sections (Popular Categories, Offers, Events, Stats, Testimonials) */}
                    
                    {/* --- Popular Categories: Refined Hover --- */} 
                    <div className="mt-16">
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900">Popüler Kategorilerimiz</h2>
                            <p className="mt-2 text-sm text-gray-700">
                                En çok tercih edilen deneyim türlerini keşfedin.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { id: "doga", name: "Doğa Turları", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop", count: 24 },
                                { id: "macera", name: "Macera Turları", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop", count: 18 },
                                { id: "kultur", name: "Kültür Turları", image: "https://images.unsplash.com/photo-1639580636443-7e739c13bbde?q=80&w=2070&auto=format&fit=crop", count: 32 },
                                { id: "gastronomi", name: "Gastronomi Turları", image: "https://images.unsplash.com/photo-1561758033-7e924f619b47?q=80&w=2070&auto=format&fit=crop", count: 12 }
                            ].map(category => (
                                <Link
                                    href={`/activities?category=${category.id}`}
                                    key={category.id}
                                    className="group relative overflow-hidden rounded-xl h-64 shadow-md block hover:shadow-xl transition-shadow duration-300"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10 transition-opacity duration-300 group-hover:opacity-80" />
                                    <Image
                                        src={category.image}
                                        alt={category.name}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 z-20 flex flex-col justify-end p-5 text-white">
                                        <h3 className="text-xl font-bold mb-1 transition-transform duration-300 group-hover:-translate-y-1">{category.name}</h3>
                                        <p className="text-sm text-white/80 mb-3 transition-opacity duration-300 group-hover:opacity-0">{category.count} tur</p>
                                        <div className="flex items-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                            <span>Kategoriyi Keşfet</span>
                                            <ChevronRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1"/>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* --- Limited Time Offer with Functional Countdown --- */}
                    <div className="mt-20">
                         <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl overflow-hidden shadow-lg">
                             <div className="grid grid-cols-1 lg:grid-cols-2">
                                 <div className="p-8 lg:p-12 flex flex-col justify-center text-white">
                                     <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-indigo-700 mb-4 self-start shadow-sm">
                                         <Timer className="w-3.5 h-3.5 mr-1.5"/> SINIRLI SÜRE TEKLİFİ
                                     </div>
                                     <h2 className="text-3xl lg:text-4xl font-bold mb-4 tracking-tight">
                                         Yaz Tatili Erken Rezervasyon Fırsatı
                                     </h2>
                                     <p className="text-indigo-100 mb-6 text-lg">
                                         Yaz aylarındaki tüm tur paketlerinde %25'e varan indirim fırsatını kaçırmayın. Erken rezervasyon avantajlarıyla hayalinizdeki tatili şimdiden planlayın.
                                     </p>
                                     {/* Functional Countdown Timer */} 
                                     <div className="flex flex-wrap gap-3 sm:gap-4 mb-8">
                                         {Object.entries(timeLeft).map(([unit, value]) => (
                                             <div key={unit} className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center min-w-[70px] sm:min-w-[80px]">
                                                 <div className="text-2xl sm:text-3xl font-bold tabular-nums">{String(value).padStart(2, '0')}</div>
                                                 <div className="text-xs text-indigo-200 uppercase tracking-wider capitalize">{unit === 'days' ? 'Gün' : unit === 'hours' ? 'Saat' : unit === 'minutes' ? 'Dakika' : 'Saniye'}</div>
                                             </div>
                                         ))}
                                          {/* Display message if countdown finished */}
                                         {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0 && (
                                            <p className="text-yellow-300 font-medium text-sm w-full">Bu fırsat sona erdi!</p>
                                         )}
                                     </div>
                                     <Link href="/deals" className="bg-white text-indigo-700 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors duration-200 inline-flex items-center self-start shadow hover:shadow-md active:scale-95">
                                         Fırsatları İncele
                                         <ChevronRight className="ml-2 h-5 w-5" />
                                     </Link>
                                 </div>
                                 <div className="relative h-64 lg:h-auto min-h-[300px]">
                                     <Image
                                         src="https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=2070&auto=format&fit=crop"
                                         alt="Yaz Tatili Fırsatları"
                                         fill
                                         className="object-cover"
                                     />
                                 </div>
                             </div>
                         </div>
                    </div>

                    {/* --- Special Events: Refined Hover --- */} 
                    <div className="mt-20">
                        <div className="mb-8 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-900">Özel Etkinlikler</h2>
                                <p className="mt-2 text-sm text-gray-700">
                                    Bu yaz unutulmaz deneyimler yaşayabileceğiniz özel etkinlikler
                                </p>
                            </div>
                            <Link 
                                href="/special-events" 
                                className="text-blue-600 hover:text-blue-800 font-medium flex items-center text-sm"
                            >
                                Tümünü Görüntüle
                                <ChevronRight className="ml-1 h-4 w-4" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { id: 1, title: "Kapadokya Festival Haftası", date: "15-22 Temmuz 2023", image: "https://images.unsplash.com/photo-1486911278844-a81c5267e227?q=80&w=2070&auto=format&fit=crop", location: "Kapadokya Vadisi" },
                                { id: 2, title: "Efes Antik Tiyatro Konserleri", date: "5-12 Ağustos 2023", image: "https://images.unsplash.com/photo-1607998802009-26ce5b682ad1?q=80&w=2070&auto=format&fit=crop", location: "Efes Antik Kenti, İzmir" },
                                { id: 3, title: "Boğaz'da Yemek Festivali", date: "3-10 Haziran 2023", image: "https://images.unsplash.com/photo-1527547637224-a93d42c7b332?q=80&w=2070&auto=format&fit=crop", location: "İstanbul Boğazı" }
                            ].map(event => (
                                <Link href={`/event/${event.id}`} key={event.id} className="group relative block overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
                                    <div className="relative h-64 w-full">
                                        <Image
                                            src={event.image}
                                            alt={event.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 group-hover:from-black/90" />
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-5">
                                        <div className="text-blue-300 text-xs font-semibold mb-1 uppercase tracking-wider">
                                            {event.date}
                                        </div>
                                        <h3 className="text-white text-lg font-bold mb-1 line-clamp-2 transition-transform duration-300 group-hover:-translate-y-1">
                                            {event.title}
                                        </h3>
                                        <div className="flex items-center text-white/80 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <MapPin className="h-3.5 w-3.5 mr-1" />
                                            {event.location}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* --- Statistics Section: Refined with Icons --- */} 
                    <div className="mt-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 rounded-2xl py-12 px-6 md:px-10 shadow-inner border border-gray-200/30 relative overflow-hidden">
                        {/* Optional: Subtle pattern - Add a real SVG path if needed */}
                        <div className="absolute inset-0 opacity-[0.02] bg-[url('/patterns/subtle-grid.svg')] bg-repeat"></div>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
                            {[ 
                                { icon: Users, val: "10K+", text: "Mutlu Müşteri", color: "text-blue-600" },
                                { icon: MapPin, val: "500+", text: "Benzersiz Tur", color: "text-orange-500" },
                                { icon: Star, val: "4.8/5", text: "Ortalama Puan", color: "text-yellow-500" },
                                { icon: Calendar, val: "7+", text: "Yıllık Deneyim", color: "text-green-500" }
                            ].map((stat, index) => (
                                <div key={index} className="flex flex-col items-center">
                                    <stat.icon className={`w-10 h-10 md:w-12 md:h-12 mb-3 ${stat.color}`} />
                                    <div className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">{stat.val}</div>
                                    <div className="mt-1 text-sm md:text-base text-gray-600">{stat.text}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- Customer Testimonials: Refined Card Style --- */} 
                    <div className="mt-20 mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Müşterilerimiz Ne Diyor?</h2>
                            <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
                                Misafirlerimizin bizimle yaşadıkları unutulmaz deneyimlere göz atın.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { name: "Ayşe Y.", avatar: "https://picsum.photos/100/100?random=20", text: "Kapadokya balon turu hayatımda yaşadığım en güzel deneyimlerden biriydi. Her şey sorunsuz ilerledi ve rehberimiz çok bilgiliydi.", tour: "Kapadokya Balon Turu", rating: 5 },
                                { name: "Mehmet K.", avatar: "https://picsum.photos/100/100?random=21", text: "İstanbul Boğaz Turu'nda harika bir gün geçirdik. Tekne çok konforluydu ve boğaz manzarası muhteşemdi. Kesinlikle tavsiye ederim!", tour: "İstanbul Boğaz Turu", rating: 4 },
                                { name: "Zeynep A.", avatar: "https://picsum.photos/100/100?random=22", text: "Efes Antik Kenti turu beklentilerimin ötesindeydi. Rehberimiz çok bilgiliydi ve tarih hakkında çok şey öğrendim.", tour: "Efes Antik Kenti Turu", rating: 5 }
                            ].map((testimonial, index) => (
                                <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col">
                                    <div className="flex items-center mb-3">
                                        {[...Array(5)].map((_, i) => (
                                            <Star 
                                                key={i} 
                                                className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                            />
                                        ))}
                                    </div>
                                    <p className="text-gray-600 italic mb-5 text-base flex-grow">"{testimonial.text}"</p>
                                    <div className="flex items-center mt-auto pt-4 border-t border-gray-100">
                                        <div className="relative w-11 h-11 mr-4 flex-shrink-0">
                                            <Image 
                                                src={testimonial.avatar} 
                                                alt={testimonial.name} 
                                                fill 
                                                sizes="44px"
                                                className="rounded-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-sm">{testimonial.name}</h4>
                                            <p className="text-xs text-gray-500">Katıldığı Tur: {testimonial.tour}</p>
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
