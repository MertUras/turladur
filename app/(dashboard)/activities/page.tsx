"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, MapPin, Clock, ChevronLeft, ChevronRight, Search, Star, Filter, Calendar, Users, X, Wallet, Timer } from "lucide-react";

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

export default function ActivitiesPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [activities, setActivities] = useState<Experience[]>([]);
    const [filteredActivities, setFilteredActivities] = useState<Experience[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(5000);
    const [maxDuration, setMaxDuration] = useState<number>(12);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const filterMenuRef = useRef<HTMLDivElement>(null);
    const [selectedActivityType, setSelectedActivityType] = useState<string | undefined>(undefined);
    const [selectedCity, setSelectedCity] = useState<string | undefined>(undefined);
    const [selectedProgram, setSelectedProgram] = useState<string | undefined>(undefined);
    const [openFilter, setOpenFilter] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

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

    // Fetch experiences from API or use demo data
    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                setLoading(true);
                // For demo purposes, use sample data
                const demoExperiences = [
                    {
                        id: 1,
                        title: "Kapadokya Balon Turu",
                        description: "Eşsiz peri bacaları manzarasında unutulmaz bir balon deneyimi yaşayın",
                        imageUrl: "https://picsum.photos/800/500?random=1",
                        featured: true,
                        createdAt: new Date().toISOString(),
                        location: "Kapadokya",
                        duration: "3 saat",
                        durationHours: 3,
                        rating: 4.8,
                        reviewCount: 423,
                        popularityRate: 90,
                        price: 2500,
                        category: "macera"
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
                        category: "sehir"
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
                        category: "deniz"
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
                setFilteredActivities(demoExperiences);
            } catch (error) {
                console.error("Error fetching experiences:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExperiences();
    }, []);

    // Arama ve filtreleme
    useEffect(() => {
        const filtered = activities.filter(experience => {
            const matchesSearch = experience.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              experience.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              experience.description.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesCategory = !selectedCategory || selectedCategory === "tumu" || experience.category === selectedCategory;
            
            const matchesExperienceType = !selectedActivityType || experience.experienceType === selectedActivityType;
            
            const matchesPrice = (!experience.price || (experience.price >= minPrice && experience.price <= maxPrice));
            
            const matchesDuration = (!experience.durationHours || experience.durationHours <= maxDuration);
            
            return matchesSearch && matchesCategory && matchesExperienceType && matchesPrice && matchesDuration;
        });
        
        setFilteredActivities(filtered);
    }, [searchTerm, selectedCategory, selectedActivityType, activities, minPrice, maxPrice, maxDuration]);

    // Scroll handlers
    const scrollLeft = (e: React.MouseEvent) => {
        e.preventDefault();
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRight = (e: React.MouseEvent) => {
        e.preventDefault();
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    const resetFilters = () => {
        setSearchTerm("");
        setSelectedCategory(undefined);
        setSelectedActivityType(undefined);
        setSelectedCity(undefined);
        setMinPrice(0);
        setMaxPrice(5000);
        setMaxDuration(12);
    };

    const handleReservation = (category: string) => {
        const categoryToExperienceType: { [key: string]: string } = {
            'macera': 'ekstrem',
            'tarihi': 'kultur',
            'deniz': 'su-sporlari',
            'doga': 'doga-yuruyusu',
            'sehir': 'kultur',
            'tumu': 'tumu'
        };

        const experienceType = categoryToExperienceType[category] || category;
        router.push(`/tours?experienceType=${experienceType}`);
    };

    const handleCityChange = (value: string | undefined) => {
        setSelectedCity(value === 'all' ? undefined : value);
    };

    const handleProgramChange = (value: string | undefined) => {
        setSelectedProgram(value === 'all' ? undefined : value);
    };

    const handleCategoryChange = (value: string | undefined) => {
        setSelectedCategory(value === 'all' ? undefined : value);
    };

    // Click outside handler for dropdowns
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenFilter(null);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            {/* Hero Section - Enhanced */}
            <section className="relative w-full h-[600px]">
                <Image
                    src="https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?q=80&w=2070&auto=format&fit=crop"
                    alt="Bölge Aktiviteleri"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/20 pointer-events-none" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-full max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl text-center">
                            <span className="block text-blue-400">Bölgenin</span> <span className="block text-orange-400">En İyi</span> <span className="block text-blue-400">Aktiviteleri</span>
                        </h1>
                        <p className="mt-6 text-xl text-white text-center max-w-3xl mx-auto">
                            Bulunduğunuz bölgedeki en popüler ve eğlenceli aktiviteleri keşfedin.
                        </p>
                        
                        {/* Search Section */}
                        <div className="mt-10 relative max-w-5xl mx-auto" ref={dropdownRef} style={{ zIndex: 50 }}>
                            <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl overflow-visible border border-gray-100">
                                <div className="p-3">
                                    <div className="flex items-center gap-3">
                                        {/* Search Input */}
                                        <div className="relative flex-1 min-w-[200px]">
                                            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input
                                                type="text"
                                                placeholder="Hangi aktiviteyi arıyorsunuz?"
                                                className="w-full pl-9 pr-3 py-2.5 text-sm text-gray-600 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50/50"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                                            />
                                        </div>

                                        {/* Activity Types Dropdown */}
                                        <div className="relative w-[180px]">
                                            <button
                                                onClick={() => setOpenFilter(openFilter === 'activities' ? null : 'activities')}
                                                className="w-full flex items-center justify-between pl-9 pr-3 py-2.5 text-sm text-gray-600 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50/50"
                                            >
                                                <span>{selectedActivityType ? activityTypes.find(t => t.id === selectedActivityType)?.name : 'Tüm Aktiviteler'}</span>
                                                <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${openFilter === 'activities' ? 'rotate-[270deg]' : 'rotate-90'}`} />
                                            </button>
                                            <Filter className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                            
                                            {openFilter === 'activities' && (
                                                <div className="absolute top-[calc(100%+4px)] left-0 w-full py-1 bg-white rounded-xl shadow-lg border border-gray-100" style={{ zIndex: 51 }}>
                                                    <div className="max-h-[240px] overflow-y-auto custom-scrollbar">
                                                        <style jsx>{`
                                                            .custom-scrollbar::-webkit-scrollbar {
                                                                width: 6px;
                                                            }
                                                            .custom-scrollbar::-webkit-scrollbar-track {
                                                                background: transparent;
                                                            }
                                                            .custom-scrollbar::-webkit-scrollbar-thumb {
                                                                background-color: #E2E8F0;
                                                                border-radius: 20px;
                                                            }
                                                            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                                                                background-color: #CBD5E1;
                                                            }
                                                            .custom-scrollbar {
                                                                scrollbar-width: thin;
                                                                scrollbar-color: #E2E8F0 transparent;
                                                            }
                                                        `}</style>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedActivityType(undefined);
                                                                setOpenFilter(null);
                                                            }}
                                                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-gray-600"
                                                        >
                                                            Tüm Aktiviteler
                                                        </button>
                                                        {activityTypes.map(type => (
                                                            <button
                                                                key={type.id}
                                                                onClick={() => {
                                                                    setSelectedActivityType(type.id);
                                                                    setOpenFilter(null);
                                                                }}
                                                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-gray-600"
                                                            >
                                                                {type.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Cities Dropdown */}
                                        <div className="relative w-[160px]">
                                            <button
                                                onClick={() => setOpenFilter(openFilter === 'cities' ? null : 'cities')}
                                                className="w-full flex items-center justify-between pl-9 pr-3 py-2.5 text-sm text-gray-600 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50/50"
                                            >
                                                <span>{selectedCity ? selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1) : 'Tüm Şehirler'}</span>
                                                <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${openFilter === 'cities' ? 'rotate-[270deg]' : 'rotate-90'}`} />
                                            </button>
                                            <MapPin className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                            
                                            {openFilter === 'cities' && (
                                                <div className="absolute top-[calc(100%+4px)] left-0 w-full py-1 bg-white rounded-xl shadow-lg border border-gray-100" style={{ zIndex: 51 }}>
                                                    <div className="max-h-[240px] overflow-y-auto custom-scrollbar">
                                                        <style jsx>{`
                                                            .custom-scrollbar::-webkit-scrollbar {
                                                                width: 6px;
                                                            }
                                                            .custom-scrollbar::-webkit-scrollbar-track {
                                                                background: transparent;
                                                            }
                                                            .custom-scrollbar::-webkit-scrollbar-thumb {
                                                                background-color: #E2E8F0;
                                                                border-radius: 20px;
                                                            }
                                                            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                                                                background-color: #CBD5E1;
                                                            }
                                                            .custom-scrollbar {
                                                                scrollbar-width: thin;
                                                                scrollbar-color: #E2E8F0 transparent;
                                                            }
                                                        `}</style>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedCity(undefined);
                                                                setOpenFilter(null);
                                                            }}
                                                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-gray-600"
                                                        >
                                                            Tüm Şehirler
                                                        </button>
                                                        {["İstanbul", "Antalya", "Muğla", "Nevşehir", "İzmir", "Aydın", "Bodrum"].map(city => (
                                                            <button
                                                                key={city}
                                                                onClick={() => {
                                                                    setSelectedCity(city.toLowerCase());
                                                                    setOpenFilter(null);
                                                                }}
                                                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-gray-600"
                                                            >
                                                                {city}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Price Range Inputs */}
                                        <div className="flex items-center gap-2">
                                            <div className="relative w-[100px]">
                                                <input 
                                                    type="number"
                                                    placeholder="Min ₺"
                                                    className="w-full pl-9 pr-2 py-2.5 text-sm text-gray-600 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50/50"
                                                    value={minPrice || ""}
                                                    onChange={(e) => setMinPrice(Number(e.target.value))}
                                                    min="0"
                                                />
                                                <Wallet className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                            </div>
                                            <span className="text-gray-400">-</span>
                                            <div className="relative w-[100px]">
                                                <input 
                                                    type="number"
                                                    placeholder="Max ₺"
                                                    className="w-full pl-9 pr-2 py-2.5 text-sm text-gray-600 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50/50"
                                                    value={maxPrice || ""}
                                                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                                                    min={minPrice}
                                                />
                                                <Wallet className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                            </div>
                                        </div>

                                        {/* Reset Filters Button - Only show when filters are active */}
                                        {(searchTerm || selectedActivityType || selectedCity || minPrice > 0 || maxPrice < 5000) && (
                                            <button 
                                                className="flex items-center justify-center h-[38px] px-4 text-gray-500 hover:text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-100 transition-all border border-gray-200 whitespace-nowrap bg-gray-50/50"
                                                onClick={(e: React.MouseEvent) => {
                                                    e.preventDefault();
                                                    resetFilters();
                                                    setOpenFilter(null);
                                                }}
                                            >
                                                <X className="w-4 h-4 mr-1.5" /> Temizle
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Category selector */}
            <div className="bg-white sticky top-0 z-20 shadow-sm">
                <div className="w-full max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="mb-4 sm:mb-0">
                            <h2 className="text-lg font-semibold text-gray-900">Aktivite Kategorileri</h2>
                            <p className="text-sm text-gray-500">Aktivite türüne göre filtreleyin</p>
                        </div>
                        <div className="flex overflow-x-auto scrollbar-hide space-x-3 pb-2">
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={(e: React.MouseEvent) => {
                                        e.preventDefault();
                                        setSelectedCategory(category.id === "tumu" ? undefined : category.id);
                                    }}
                                    className={`flex-none px-4 py-2 rounded-full text-sm font-medium ${
                                        (category.id === "tumu" && !selectedCategory) || selectedCategory === category.id
                                            ? "bg-blue-500 text-white shadow-md hover:bg-blue-600"
                                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                    } transition-colors`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="w-full bg-gray-50">
                <div className="w-full max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="mb-8 flex justify-between items-end">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900">Bölgedeki Aktiviteler</h2>
                            <p className="mt-2 text-sm text-gray-700">
                                Bulunduğunuz bölgedeki en popüler aktiviteleri keşfedin.
                            </p>
                        </div>
                        
                        {(searchTerm || selectedCategory || minPrice > 0 || maxPrice < 5000 || maxDuration < 12) ? (
                            <button 
                                className="flex items-center text-blue-500 hover:text-blue-600 text-sm font-medium"
                                onClick={(e: React.MouseEvent) => {
                                    e.preventDefault();
                                    resetFilters();
                                }}
                            >
                                <X className="w-4 h-4 mr-1" /> Filtreleri Temizle
                            </button>
                        ) : null}
                    </div>

                    {loading ? (
                        <div className="flex h-64 items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        </div>
                    ) : filteredActivities.length === 0 ? (
                        <div className="mt-8 text-center">
                            <div className="rounded-lg border-2 border-dashed border-gray-300 p-12">
                                <p className="text-sm text-gray-500">Arama kriterlerinize uygun tur bulunamadı.</p>
                                <button 
                                    className="mt-4 text-blue-500 hover:text-blue-600 font-medium"
                                    onClick={resetFilters}
                                >
                                    Tüm turları görüntüle
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredActivities.map((experience) => (
                                <div 
                                    key={experience.id}
                                    className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all transform hover:-translate-y-1 flex flex-col cursor-pointer"
                                    onClick={() => router.push(`/activities/${experience.id}`)}
                                >
                                    <div className="relative h-64">
                                        <Image
                                            src={experience.imageUrl}
                                            alt={experience.title}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                            <div className="flex items-center gap-1.5">
                                                <Users className="w-4 h-4 text-blue-600" />
                                                <span className="text-sm font-medium text-gray-800">%{experience.popularityRate} gezginin planında</span>
                                            </div>
                                        </div>
                                        <div className="absolute top-4 left-4 bg-blue-600 px-3 py-1 rounded-full">
                                            <span className="text-sm font-medium text-white">{experience.category || 'Tur'}</span>
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex-grow">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{experience.title}</h3>
                                            <p className="text-gray-600 mb-4 line-clamp-2">{experience.description}</p>
                                            <div className="flex flex-wrap gap-4 mb-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{experience.duration}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <Users className="w-4 h-4" />
                                                    <span>{experience.durationHours} Saat</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{experience.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                                            <span className="text-xl font-bold text-blue-600">₺{experience.price}</span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Kartın tıklama eventini engellemek için
                                                    router.push(`/activities/${experience.id}`);
                                                }}
                                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                                            >
                                                Rezervasyon
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Popular Categories Section */}
                    <div className="mt-16">
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900">Popüler Kategorilerimiz</h2>
                            <p className="mt-2 text-sm text-gray-700">
                                En çok tercih edilen deneyim türlerini keşfedin.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[
                                { 
                                    id: "doga", 
                                    name: "Doğa Turları", 
                                    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop",
                                    count: 24
                                },
                                { 
                                    id: "macera", 
                                    name: "Macera Turları", 
                                    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop",
                                    count: 18
                                },
                                { 
                                    id: "kultur", 
                                    name: "Kültür Turları", 
                                    image: "https://images.unsplash.com/photo-1639580636443-7e739c13bbde?q=80&w=2070&auto=format&fit=crop",
                                    count: 32
                                },
                                { 
                                    id: "gastronomi", 
                                    name: "Gastronomi Turları", 
                                    image: "https://images.unsplash.com/photo-1561758033-7e924f619b47?q=80&w=2070&auto=format&fit=crop",
                                    count: 12
                                }
                            ].map(category => (
                                <button
                                    key={category.id}
                                    className="group relative overflow-hidden rounded-xl h-60 shadow-md"
                                    onClick={(e: React.MouseEvent) => {
                                        e.preventDefault();
                                        // Kategoriye göre ilk aktiviteyi bul ve ona yönlendir
                                        const firstActivityInCategory = activities.find(act => act.category === category.id);
                                        if (firstActivityInCategory) {
                                            router.push(`/activities/${firstActivityInCategory.id}`);
                                        } else {
                                            setSelectedCategory(category.id);
                                        }
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                                    <div className="absolute inset-0 w-full h-full">
                                        <Image
                                            src={category.image}
                                            alt={category.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="absolute inset-0 z-20 flex flex-col justify-end p-5 text-white">
                                        <h3 className="text-xl font-bold">{category.name}</h3>
                                        <p className="text-sm text-white/80">{category.count} tur</p>
                                        <div className="mt-3 flex items-center text-sm font-medium">
                                            <span>Tümünü Görüntüle</span>
                                            <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sınırlı Süreli Fırsatlar */}
                    <div className="mt-20">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl overflow-hidden">
                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                <div className="p-8 lg:p-12 flex flex-col justify-center">
                                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-blue-600 mb-4">
                                        SINIRLI SÜRE TEKLİFİ
                                    </div>
                                    <h2 className="text-3xl font-bold text-white mb-4">
                                        Yaz Tatili Erken Rezervasyon Fırsatı
                                    </h2>
                                    <p className="text-white/90 mb-6">
                                        Yaz aylarındaki tüm tur paketlerinde %25'e varan indirim fırsatını kaçırmayın. Erken rezervasyon avantajlarıyla hayalinizdeki tatili şimdiden planlayın.
                                    </p>
                                    <div className="flex flex-wrap gap-4 mb-6">
                                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center min-w-[80px]">
                                            <div className="text-2xl font-bold text-white">21</div>
                                            <div className="text-xs text-white/80">Gün</div>
                                        </div>
                                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center min-w-[80px]">
                                            <div className="text-2xl font-bold text-white">18</div>
                                            <div className="text-xs text-white/80">Saat</div>
                                        </div>
                                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center min-w-[80px]">
                                            <div className="text-2xl font-bold text-white">45</div>
                                            <div className="text-xs text-white/80">Dakika</div>
                                        </div>
                                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center min-w-[80px]">
                                            <div className="text-2xl font-bold text-white">37</div>
                                            <div className="text-xs text-white/80">Saniye</div>
                                        </div>
                                    </div>
                                    <button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center self-start">
                                        Fırsatları İncele
                                        <ChevronRight className="ml-2 h-5 w-5" />
                            </button>
                                </div>
                                <div className="relative h-64 lg:h-auto">
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

                    {/* Özel Etkinlikler */}
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
                                className="text-blue-500 hover:text-blue-600 font-medium flex items-center"
                            >
                                Tümünü Görüntüle
                                <ChevronRight className="ml-1 h-5 w-5" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                {
                                    id: 1,
                                    title: "Kapadokya Festival Haftası",
                                    date: "15-22 Temmuz 2023",
                                    image: "https://images.unsplash.com/photo-1486911278844-a81c5267e227?q=80&w=2070&auto=format&fit=crop",
                                    location: "Kapadokya Vadisi"
                                },
                                {
                                    id: 2,
                                    title: "Efes Antik Tiyatro Konserleri",
                                    date: "5-12 Ağustos 2023",
                                    image: "https://images.unsplash.com/photo-1607998802009-26ce5b682ad1?q=80&w=2070&auto=format&fit=crop",
                                    location: "Efes Antik Kenti, İzmir"
                                },
                                {
                                    id: 3,
                                    title: "Boğaz'da Yemek Festivali",
                                    date: "3-10 Haziran 2023",
                                    image: "https://images.unsplash.com/photo-1527547637224-a93d42c7b332?q=80&w=2070&auto=format&fit=crop",
                                    location: "İstanbul Boğazı"
                                }
                            ].map(event => (
                                <div key={event.id} className="group relative overflow-hidden rounded-xl shadow-md">
                                    <div className="relative h-56 w-full">
                                        <Image
                                            src={event.image}
                                            alt={event.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-5">
                                        <div className="text-blue-400 text-sm font-medium mb-2">
                                            {event.date}
                                        </div>
                                        <h3 className="text-white text-xl font-bold mb-1">
                                            {event.title}
                                        </h3>
                                        <div className="flex items-center text-white/80 text-sm">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            {event.location}
                                        </div>
                                    </div>
                                    <Link 
                                        href={`/event/${event.id}`} 
                                        className="absolute inset-0 z-10"
                                        aria-label={`${event.title} etkinliğini görüntüle`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Statistics Section */}
                    <div className="mt-20 bg-white rounded-2xl shadow-sm overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                            <div className="p-8 border-b lg:border-b-0 md:border-r border-gray-200">
                                <div className="text-4xl font-bold text-blue-500">10,000+</div>
                                <div className="mt-2 text-gray-600">Mutlu Müşteri</div>
                            </div>
                            <div className="p-8 border-b lg:border-b-0 lg:border-r border-gray-200">
                                <div className="text-4xl font-bold text-blue-500">500+</div>
                                <div className="mt-2 text-gray-600">Benzersiz Tur</div>
                            </div>
                            <div className="p-8 border-b md:border-b-0 md:border-r border-gray-200">
                                <div className="text-4xl font-bold text-blue-500">4.8/5</div>
                                <div className="mt-2 text-gray-600">Ortalama Değerlendirme</div>
                            </div>
                            <div className="p-8">
                                <div className="text-4xl font-bold text-blue-500">7+</div>
                                <div className="mt-2 text-gray-600">Yıllık Deneyim</div>
                            </div>
                        </div>
                    </div>

                    {/* Customer Testimonials */}
                    <div className="mt-16 mb-16">
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900">Müşteri Yorumları</h2>
                            <p className="mt-2 text-sm text-gray-700">
                                Misafirlerimizin bizimle yaşadıkları deneyimler.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    name: "Ayşe Y.",
                                    avatar: "https://picsum.photos/100/100?random=20",
                                    text: "Kapadokya balon turu hayatımda yaşadığım en güzel deneyimlerden biriydi. Her şey sorunsuz ilerledi ve rehberimiz çok bilgiliydi.",
                                    tour: "Kapadokya Balon Turu",
                                    rating: 5
                                },
                                {
                                    name: "Mehmet K.",
                                    avatar: "https://picsum.photos/100/100?random=21",
                                    text: "İstanbul Boğaz Turu'nda harika bir gün geçirdik. Tekne çok konforluydu ve boğaz manzarası muhteşemdi. Kesinlikle tavsiye ederim!",
                                    tour: "İstanbul Boğaz Turu",
                                    rating: 4
                                },
                                {
                                    name: "Zeynep A.",
                                    avatar: "https://picsum.photos/100/100?random=22",
                                    text: "Efes Antik Kenti turu beklentilerimin ötesindeydi. Rehberimiz çok bilgiliydi ve tarih hakkında çok şey öğrendim.",
                                    tour: "Efes Antik Kenti Turu",
                                    rating: 5
                                }
                            ].map((testimonial, index) => (
                                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex items-center space-x-1 text-blue-500 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star 
                                                key={i} 
                                                className={`h-4 w-4 ${i < testimonial.rating ? 'fill-current' : 'text-gray-300'}`} 
                                            />
                                        ))}
                                    </div>
                                    <p className="text-gray-600 italic mb-4">"{testimonial.text}"</p>
                                    <div className="flex items-center">
                                        <div className="relative w-10 h-10 mr-4">
                                            <Image 
                                                src={testimonial.avatar} 
                                                alt={testimonial.name} 
                                                fill 
                                                className="rounded-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                                            <p className="text-xs text-gray-500">{testimonial.tour}</p>
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
