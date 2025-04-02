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
}

export default function ExperiencesPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(5000);
    const [maxDuration, setMaxDuration] = useState<number>(12);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Kategoriler
    const categories = [
        { id: "all", name: "Tümü" },
        { id: "nature", name: "Doğa" },
        { id: "history", name: "Tarihi" },
        { id: "beach", name: "Deniz" },
        { id: "city", name: "Şehir" },
        { id: "adventure", name: "Macera" }
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
                        category: "adventure"
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
                        category: "nature"
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
                        category: "history"
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
                        category: "city"
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
                        category: "beach"
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
                        category: "history"
                    }
                ];
                
                setExperiences(demoExperiences);
                setFilteredExperiences(demoExperiences);
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
        const filtered = experiences.filter(experience => {
            const matchesSearch = experience.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              experience.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              experience.description.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesCategory = !selectedCategory || selectedCategory === "all" || experience.category === selectedCategory;
            
            const matchesPrice = (!experience.price || (experience.price >= minPrice && experience.price <= maxPrice));
            
            const matchesDuration = (!experience.durationHours || experience.durationHours <= maxDuration);
            
            return matchesSearch && matchesCategory && matchesPrice && matchesDuration;
        });
        
        setFilteredExperiences(filtered);
    }, [searchTerm, selectedCategory, experiences, minPrice, maxPrice, maxDuration]);

    // Scroll handlers
    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    const resetFilters = () => {
        setSearchTerm("");
        setSelectedCategory(null);
        setMinPrice(0);
        setMaxPrice(5000);
        setMaxDuration(12);
    };

    return (
        <>
            {/* Hero Section - Enhanced */}
            <section className="relative w-full h-[600px] overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?q=80&w=2070&auto=format&fit=crop"
                    alt="Türkiye Seyahat Deneyimleri"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/20" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-full max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl text-center">
                            <span className="block text-blue-400">Türkiye'nin</span> En İyi Tatil Deneyimleri
                        </h1>
                        <p className="mt-6 text-xl text-white text-center max-w-3xl mx-auto">
                            Tarihi, doğal ve kültürel zenginlikleriyle Türkiye'nin eşsiz rotalarında unutulmaz anılar biriktirin.
                        </p>
                        
                        {/* Search Section */}
                        <div className="mt-10 relative max-w-3xl mx-auto">
                            <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden">
                                <div className="flex flex-col md:flex-row">
                                    <div className="flex-grow p-4 relative">
                                        <div className="flex items-center">
                                            <Search className="h-5 w-5 text-gray-400 absolute left-4" />
                                            <input
                                                type="text"
                                                placeholder="Nereye gitmek istersiniz?"
                                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <button 
                                        className="flex items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 font-medium hover:from-blue-600 hover:to-blue-700 md:rounded-l-none md:rounded-r-xl transition-all duration-300"
                                        onClick={() => setShowFilters(!showFilters)}
                                    >
                                        <Filter className="w-5 h-5 mr-2" />
                                        {showFilters ? "Filtreleri Gizle" : "Filtreleri Göster"}
                                    </button>
                                </div>
                                
                                {/* Expandable filters */}
                                {showFilters && (
                                    <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Fiyat Aralığı
                                            </label>
                                            <div className="flex items-center space-x-3">
                                                <div className="relative flex-grow">
                                                    <Wallet className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                                    <input 
                                                        type="number"
                                                        placeholder="Min. Fiyat"
                                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                                                        value={minPrice}
                                                        onChange={(e) => setMinPrice(Number(e.target.value))}
                                                        min="0"
                                                    />
                                                </div>
                                                <span className="text-gray-500">-</span>
                                                <div className="relative flex-grow">
                                                    <Wallet className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                                    <input 
                                                        type="number"
                                                        placeholder="Max. Fiyat"
                                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                                                        value={maxPrice}
                                                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                                                        min={minPrice}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Maksimum Süre: {maxDuration} saat
                                            </label>
                                            <div className="relative">
                                                <div className="flex items-center">
                                                    <Timer className="h-5 w-5 text-gray-400 mr-3" />
                                                    <input
                                                        type="range"
                                                        min="1" 
                                                        max="24"
                                                        step="1"
                                                        value={maxDuration}
                                                        onChange={(e) => setMaxDuration(Number(e.target.value))}
                                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                                    />
                                                </div>
                                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                    <span>1 saat</span>
                                                    <span>12 saat</span>
                                                    <span>24 saat</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between">
                                            <button 
                                                className="text-gray-500 hover:text-gray-700 text-sm font-medium flex items-center"
                                                onClick={resetFilters}
                                            >
                                                <X className="w-4 h-4 mr-1" />
                                                Filtreleri Temizle
                                            </button>
                                            <button 
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                                                onClick={() => setShowFilters(false)}
                                            >
                                                Sonuçları Göster
                                                <ChevronRight className="w-4 h-4 ml-1" />
                                            </button>
                                        </div>
                                    </div>
                                )}
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
                            <h2 className="text-lg font-semibold text-gray-900">Kategoriler</h2>
                            <p className="text-sm text-gray-500">Deneyim türüne göre filtreleyin</p>
                        </div>
                        <div className="flex overflow-x-auto scrollbar-hide space-x-3 pb-2">
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id === "all" ? null : category.id)}
                                    className={`flex-none px-4 py-2 rounded-full text-sm font-medium ${
                                        (category.id === "all" && !selectedCategory) || selectedCategory === category.id
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
                            <h2 className="text-2xl font-semibold text-gray-900">Öne Çıkan Rotalarımız</h2>
                            <p className="mt-2 text-sm text-gray-700">
                                En popüler ve beğenilen rotalarımızı keşfedin.
                            </p>
                        </div>
                        
                        {(searchTerm || selectedCategory || minPrice > 0 || maxPrice < 5000 || maxDuration < 12) ? (
                            <button 
                                className="flex items-center text-blue-500 hover:text-blue-600 text-sm font-medium"
                                onClick={resetFilters}
                            >
                                <X className="w-4 h-4 mr-1" /> Filtreleri Temizle
                            </button>
                        ) : null}
                    </div>

                    {loading ? (
                        <div className="flex h-64 items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        </div>
                    ) : filteredExperiences.length === 0 ? (
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredExperiences.map((experience) => (
                                <Link
                                    key={experience.id}
                                    href={`/experience/${experience.id}`}
                                    className="group flex flex-col h-full rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                                >
                                    <div className="relative h-[200px] w-full overflow-hidden">
                                        <Image
                                            src={experience.imageUrl}
                                            alt={experience.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        {/* Kategori etiketi */}
                                        {experience.category && (
                                            <div className="absolute top-4 left-4">
                                                <span className="inline-flex items-center rounded-full bg-black/60 backdrop-blur-sm px-2.5 py-0.5 text-xs font-medium text-white capitalize">
                                                    {experience.category}
                                                </span>
                                            </div>
                                        )}
                                        {experience.featured && (
                                            <div className="absolute top-4 right-4">
                                                <span className="inline-flex items-center rounded-full bg-white/80 backdrop-blur-sm px-2.5 py-0.5 text-xs font-medium text-gray-700">
                                                    %{experience.popularityRate} Gezginin Rotasında
                                                </span>
                                            </div>
                                        )}
                                        {/* Fiyat etiketi */}
                                        <div className="absolute bottom-4 right-4">
                                            <span className="inline-flex items-center rounded-full bg-blue-500 px-3 py-1 text-sm font-medium text-white">
                                                {experience.price} ₺
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4 flex flex-col flex-grow">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-500 transition-colors">
                                            {experience.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-3 flex-grow line-clamp-2">
                                            {experience.description}
                                        </p>
                                        <div className="mt-auto space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-1 text-blue-500">
                                                    <Star className="h-4 w-4 fill-current" />
                                                    <span className="font-medium">{experience.rating}</span>
                                                    <span className="text-gray-500 text-xs">({experience.reviewCount} değerlendirme)</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                                                    <span>{experience.location}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Clock className="h-4 w-4 mr-1 text-gray-400" />
                                                    <span>{experience.duration}</span>
                                                </div>
                                            </div>
                                            <div className="pt-3 border-t border-gray-100">
                                                <div className="group-hover:text-blue-500 text-sm font-medium text-gray-600 flex items-center justify-between transition-colors">
                                                    <span>Detayları Görüntüle</span>
                                                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
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
                                    id: "nature", 
                                    name: "Doğa Turları", 
                                    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop",
                                    count: 24
                                },
                                { 
                                    id: "adventure", 
                                    name: "Macera Turları", 
                                    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop",
                                    count: 18
                                },
                                { 
                                    id: "culture", 
                                    name: "Kültür Turları", 
                                    image: "https://images.unsplash.com/photo-1639580636443-7e739c13bbde?q=80&w=2070&auto=format&fit=crop",
                                    count: 32
                                },
                                { 
                                    id: "food", 
                                    name: "Gastronomi Turları", 
                                    image: "https://images.unsplash.com/photo-1561758033-7e924f619b47?q=80&w=2070&auto=format&fit=crop",
                                    count: 12
                                }
                            ].map(category => (
                                <button
                                    key={category.id}
                                    className="group relative overflow-hidden rounded-xl h-60 shadow-md"
                                    onClick={() => setSelectedCategory(category.id)}
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
