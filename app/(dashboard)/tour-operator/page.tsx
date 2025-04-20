"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { dummyTourOperators, dummyTours } from "@/app/lib/dummy-data";
import { 
  MapPin,
  ChevronRight,
  Building,
  Users,
  CheckCircle,
  Award,
  Phone,
  Star,
  Search,
  Calendar,
  Filter,
  ArrowRight,
  Globe,
  BadgeCheck,
  Clock,
  Bookmark,
  Share2,
  ArrowUp,
  X,
  SlidersHorizontal,
  ChevronDown
} from "lucide-react";

// Debounce function
function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    const later = () => {
      timeout = null;
      func(...args);
    };
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

export default function TourOperatorsPage() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOperators, setFilteredOperators] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    certified: false,
    rating: null as number | null,
    tourCount: null as number | null,
  });
  const [sortBy, setSortBy] = useState("popular");
  const [showScrollTop, setShowScrollTop] = useState(false);

  const categories = [
    { id: "all", name: "Tümü" },
    { id: "culture", name: "Kültür" },
    { id: "adventure", name: "Macera" },
    { id: "nature", name: "Doğa" },
    { id: "beach", name: "Deniz" },
    { id: "city", name: "Şehir" },
    { id: "gastronomy", name: "Gastronomi" },
    { id: "luxury", name: "Lüks" }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setFilteredOperators(dummyTourOperators);
    }, 800);
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const applyFilters = debounce(() => {
    let filtered = [...dummyTourOperators];
    if (searchTerm.trim() !== "") {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter((operator: any) => 
        operator.name?.toLowerCase().includes(lowerSearchTerm) ||
        operator.city?.toLowerCase().includes(lowerSearchTerm) ||
        operator.country?.toLowerCase().includes(lowerSearchTerm) ||
        operator.description?.toLowerCase().includes(lowerSearchTerm)
      );
    }
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter((operator: any) => 
        operator.categories?.includes(selectedCategory)
      );
    }
    if (filterOptions.certified) {
      filtered = filtered.filter((operator: any) => operator.certified);
    }
    if (filterOptions.rating) {
      filtered = filtered.filter((operator: any) => 
        (operator.rating || 0) >= filterOptions.rating!
      );
    }
    if (filterOptions.tourCount) {
      filtered = filtered.filter((operator: any) => {
        const tourCount = dummyTours.filter(tour => tour.tourOperatorId === operator.id).length;
        return tourCount >= filterOptions.tourCount!;
      });
    }
    filtered.sort((a: any, b: any) => {
      if (sortBy === "rating") {
        return (b.rating || 0) - (a.rating || 0);
      } else if (sortBy === "tours") {
        const aTourCount = dummyTours.filter(tour => tour.tourOperatorId === a.id).length;
        const bTourCount = dummyTours.filter(tour => tour.tourOperatorId === b.id).length;
        return bTourCount - aTourCount;
      } else {
        return (b.popularity || 0) - (a.popularity || 0);
      }
    });
    setFilteredOperators(filtered);
  }, 300);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedCategory, filterOptions, sortBy]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
    setFilterOptions({ certified: false, rating: null, tourCount: null });
    setSortBy("popular");
    setShowFilters(false);
  };

  const filterButtonClass = (isActive: boolean) => 
    `px-4 py-2 rounded-md text-sm font-medium border transition-colors duration-150 ease-out ${
      isActive 
        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
    }`;

  const primaryButtonClasses = "inline-flex items-center justify-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-[0.98] duration-150 ease-out";
  const secondaryButtonClasses = "inline-flex items-center justify-center px-5 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-[0.98] duration-150 ease-out";
  const iconButtonClasses = "p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-150 ease-out";

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="relative bg-gradient-to-b from-indigo-800 to-indigo-950 overflow-hidden border-b border-indigo-900/50">
         <div className="absolute inset-0 z-0 opacity-15" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1530363591527-19586e74fcf8?q=80&w=2070&auto=format&fit=crop')`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
         <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/80 via-indigo-900/30 to-transparent z-0"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-white mb-6 leading-tight tracking-tight">
              Güvenilir Tur Operatörleri ile <br /> Hayallerinize Yolculuk
            </h1>
            <p className="text-lg md:text-xl text-indigo-200/90 mb-10 max-w-2xl mx-auto">
              TourTech platformunda, özenle seçilmiş ve onaylanmış tur operatörleri ile unutulmaz seyahat deneyimleri sizi bekliyor.
            </p>
            
            <div className="max-w-2xl mx-auto relative z-10">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="flex items-center px-2 py-1.5 border-b border-gray-100">
                  <div className="flex-grow relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Operatör, şehir veya tur ara..."
                      className="w-full py-3 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:outline-none border-0 ring-0 focus:ring-0"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center h-9 px-4 py-2 rounded-md transition-colors duration-150 text-sm ml-2 ${showFilters ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'} focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 duration-150 ease-out`}
                  >
                    <SlidersHorizontal className="w-4 h-4 mr-1.5" />
                    <span>Filtrele</span>
                  </button>
                </div>
                
                {showFilters && (
                  <div className="bg-gray-50/70 p-5 border-t border-gray-100 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-2 block uppercase tracking-wider">Sertifika</label>
                        <label htmlFor="certified-filter" className="flex items-center bg-white p-3 rounded-md border border-gray-200 hover:border-gray-300 cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            id="certified-filter"
                            checked={filterOptions.certified}
                            onChange={(e) => setFilterOptions({...filterOptions, certified: e.target.checked})}
                            className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 focus:ring-offset-0"
                          />
                          <span className="ml-2.5 text-sm text-gray-700 flex items-center">
                            <BadgeCheck className="w-4 h-4 mr-1.5 text-indigo-500" />
                            Onaylı Operatör
                          </span>
                        </label>
                      </div>
                      
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-2 block uppercase tracking-wider">Min. Puan</label>
                        <div className="flex space-x-2">
                          {[4.5, 4, 3.5].map((rating) => (
                            <button
                              key={rating}
                              onClick={() => setFilterOptions({...filterOptions, rating: filterOptions.rating === rating ? null : rating })}
                              className={`${filterButtonClass(filterOptions.rating === rating)} focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500`}
                            >
                              {rating.toFixed(1)}+ <Star className="w-3.5 h-3.5 inline-block ml-1 fill-current text-amber-400" />
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-2 block uppercase tracking-wider">Min. Tur</label>
                        <div className="flex space-x-2">
                          {[5, 10, 25].map((count) => (
                            <button
                              key={count}
                              onClick={() => setFilterOptions({...filterOptions, tourCount: filterOptions.tourCount === count ? null : count })}
                              className={`${filterButtonClass(filterOptions.tourCount === count)} focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500`}
                            >
                              {count}+
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-5 pt-4 border-t border-gray-200">
                      <button
                        onClick={resetFilters}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mb-3 sm:mb-0 flex items-center focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 rounded"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Filtreleri Temizle
                      </button>
                      
                      <div className="flex items-center space-x-2">
                        <label htmlFor="sortBy-filter" className="text-xs font-medium text-gray-600 uppercase tracking-wider">Sırala:</label>
                        <div className="relative">
                          <select
                            id="sortBy-filter"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-white py-2 pl-3 pr-8 rounded-md text-sm border border-gray-300 text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 appearance-none shadow-sm"
                          >
                            <option value="popular">Popülerlik</option>
                            <option value="rating">Puan</option>
                            <option value="tours">Tur Sayısı</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-12 md:-mt-16 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { icon: Award, value: "140+", label: "Onaylı Operatör", color: "text-indigo-600", bgColor: "bg-indigo-50" },
            { icon: Users, value: "5K+", label: "Mutlu Müşteri", color: "text-blue-600", bgColor: "bg-blue-50" },
            { icon: Calendar, value: "380+", label: "Farklı Tur", color: "text-purple-600", bgColor: "bg-purple-50" },
            { icon: Star, value: "4.8", label: "Ortalama Puan", color: "text-amber-600", bgColor: "bg-amber-50" }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md border border-gray-100 p-5 flex items-center space-x-4 hover:shadow-lg transition-shadow duration-200 ease-out">
              <div className={`p-3 rounded-lg ${stat.bgColor} ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12 lg:mt-16">
        <div className="flex overflow-x-auto space-x-2.5 pb-3 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thumb-rounded-full">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id === "all" ? null : category.id)}
              className={`flex-none px-4 py-2 rounded-md text-sm font-medium border ${ 
                (category.id === "all" && !selectedCategory) || selectedCategory === category.id
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-gray-400 hover:text-gray-800"
              } transition-colors duration-150 ease-out whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8 lg:mt-12 pb-20" id="operators-list">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">
            Tur Operatörleri
          </h2>
          {!loading && filteredOperators.length > 0 && (
            <div className="text-sm text-gray-500 font-medium flex-shrink-0">
              {filteredOperators.length} sonuç bulundu
            </div>
          )}
        </div>

        {(filterOptions.certified || filterOptions.rating || filterOptions.tourCount || selectedCategory) && (
          <div className="mb-6 py-3 border-y border-gray-200 animate-fadeIn">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex flex-wrap items-center gap-2 py-1">
                <span className="text-sm font-medium text-gray-600 mr-2">Filtreler:</span>
                {selectedCategory && selectedCategory !== "all" && (
                  <span className="inline-flex items-center pl-2.5 pr-1 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                    {categories.find(c => c.id === selectedCategory)?.name}
                    <button onClick={() => setSelectedCategory(null)} className="ml-1 p-0.5 rounded-full hover:bg-gray-300 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-400"><X size={12} /></button>
                  </span>
                )}
                {filterOptions.certified && (
                  <span className="inline-flex items-center pl-2.5 pr-1 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                    <BadgeCheck size={14} className="mr-1 text-indigo-500" /> Onaylı
                    <button onClick={() => setFilterOptions({...filterOptions, certified: false})} className="ml-1 p-0.5 rounded-full hover:bg-gray-300 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-400"><X size={12} /></button>
                  </span>
                )}
                {filterOptions.rating && (
                  <span className="inline-flex items-center pl-2.5 pr-1 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                    <Star size={14} className="mr-1 fill-current text-amber-400" /> {filterOptions.rating}+ Puan
                    <button onClick={() => setFilterOptions({...filterOptions, rating: null})} className="ml-1 p-0.5 rounded-full hover:bg-gray-300 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-400"><X size={12} /></button>
                  </span>
                )}
                {filterOptions.tourCount && (
                  <span className="inline-flex items-center pl-2.5 pr-1 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                    <Calendar size={14} className="mr-1" /> {filterOptions.tourCount}+ Tur
                    <button onClick={() => setFilterOptions({...filterOptions, tourCount: null})} className="ml-1 p-0.5 rounded-full hover:bg-gray-300 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-400"><X size={12} /></button>
                  </span>
                )}
              </div>
              <button 
                onClick={resetFilters}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex-shrink-0 ml-2 flex items-center focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 rounded"
              >
                <X className="w-3.5 h-3.5 mr-1" /> Temizle
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                <div className="p-5 flex gap-4">
                  <div className="w-16 h-16 rounded-md bg-gray-200 flex-shrink-0"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="flex gap-2 pt-2">
                      <div className="h-8 bg-gray-200 rounded w-28"></div>
                      <div className="h-8 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-100 bg-gray-50 p-4 h-20"></div>
              </div>
            ))}
          </div>
        ) : filteredOperators.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center col-span-1 lg:col-span-2 flex flex-col items-center">
            <Search className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Sonuç Bulunamadı</h3>
            <p className="text-gray-500 mb-5 text-sm max-w-xs">Arama kriterlerinize uygun tur operatörü bulunamadı. Filtrelerinizi değiştirmeyi veya temizlemeyi deneyin.</p>
            <button
              onClick={resetFilters}
              className={secondaryButtonClasses + " text-sm focus:ring-offset-2"}
            >
              Filtreleri Temizle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredOperators.map((operator: any) => {
              const operatorTours = dummyTours.filter(t => t.tourOperatorId === operator.id);
              return (
                <div 
                  key={operator.id} 
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ease-out border border-gray-100 overflow-hidden group flex flex-col"
                >
                  <div className="p-5 flex-grow">
                    <div className="flex gap-4">
                      <Link 
                        href={`/tour-operator/${operator.id}`} 
                        className="block w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden shadow-sm border border-gray-100 bg-white flex-shrink-0 relative hover:opacity-90 transition-opacity duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500"
                      >
                        {operator.logo ? (
                          <Image src={operator.logo} alt={`${operator.name} Logo`} fill className="object-contain p-1"/>
                        ) : (
                          <div className="flex items-center justify-center h-full bg-indigo-50"><Building className="w-8 h-8 text-indigo-300" /></div>
                        )}
                         {operator.certified && (
                          <div className="absolute bottom-1 right-1 bg-indigo-600 text-white p-0.5 rounded-full border border-white">
                            <BadgeCheck size={10} />
                          </div>
                        )}
                      </Link>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-1">
                           <Link href={`/tour-operator/${operator.id}`} className="block focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500 rounded">
                             <h3 className="text-base md:text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-150 ease-out line-clamp-1">
                               {operator.name}
                             </h3>
                           </Link>
                           {operator.rating && (
                            <div className="flex items-center flex-shrink-0 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md text-xs font-medium border border-amber-100">
                              <Star size={12} className="mr-1 fill-current" />
                              <span>{operator.rating.toFixed(1)}</span>
                            </div>
                           )}
                        </div>
                        
                        <div className="flex items-center text-gray-500 text-xs md:text-sm mb-3">
                          <MapPin size={14} className="mr-1.5 text-gray-400 flex-shrink-0" />
                          <span>{operator.city}, {operator.country}</span>
                        </div>
                        
                        <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                          {operator.description || "Bu operatör için detaylı açıklama bulunmamaktadır."}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                           {operator.certified && ( <span className="inline-flex items-center px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded"><BadgeCheck size={12} className="mr-1" />Onaylı</span> )}
                           <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded"><Calendar size={12} className="mr-1" />{operatorTours.length} Tur</span>
                           {operator.international && ( <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded"><Globe size={12} className="mr-1" />Global</span> )}
                           {operator.fastResponse && ( <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded"><Clock size={12} className="mr-1" />Hızlı Yanıt</span> )}
                        </div>
                        
                        <div className="flex flex-wrap gap-2 items-center">
                          <Link 
                            href={`/tour-operator/${operator.id}`}
                            className={primaryButtonClasses + " text-sm px-4 py-2 focus:ring-offset-1 focus:ring-1"}
                          >
                            Detaylar <ChevronRight size={16} className="ml-1" />
                          </Link>
                          <a 
                            href={`tel:${operator.phone}`}
                            className={secondaryButtonClasses + " text-sm px-4 py-2 focus:ring-offset-2"}
                          >
                            <Phone size={14} className="mr-1.5" /> İletişim
                          </a>
                          <button className={iconButtonClasses + " ml-auto focus:ring-offset-1 focus:ring-1"} aria-label="Kaydet">
                            <Bookmark size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {operatorTours.length > 0 && (
                    <div className="border-t border-gray-100 bg-gray-50/50 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Öne Çıkan Turlar</h4>
                        {operatorTours.length > 2 && (
                           <Link 
                             href={`/tour-operator/${operator.id}#tours`} 
                             className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500 rounded"
                           >
                             Tümü <ChevronRight size={14} className="ml-0.5" />
                           </Link>
                        )}
                      </div>
                      <div className="space-y-2">
                        {operatorTours.slice(0, 2).map((tour: any) => (
                          <Link 
                            key={tour.id} 
                            href={`/tour/${tour.id}`}
                            className="block p-3 bg-white rounded-md hover:bg-indigo-50/30 transition-colors duration-150 ease-out border border-gray-200 hover:border-indigo-200 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500"
                          >
                             <div className="flex justify-between items-center gap-3">
                               <div className="flex-1 overflow-hidden">
                                 <h5 className="text-sm font-medium text-gray-800 truncate group-hover:text-indigo-700">{tour.name}</h5>
                                 <div className="flex items-center text-xs text-gray-500 mt-1">
                                   <span>{tour.duration} Gün</span>
                                   <span className="mx-1.5">·</span>
                                   <span className="truncate">
                                     {tour.destinations ? JSON.parse(tour.destinations)[0] : ""}
                                   </span>
                                 </div>
                               </div>
                               <div className="text-right flex-shrink-0">
                                 <div className="font-semibold text-indigo-700 text-sm">
                                   {(tour.discount && tour.discount > 0 
                                     ? (tour.price - (tour.price * tour.discount / 100))
                                     : tour.price).toLocaleString('tr-TR')} ₺
                                 </div>
                                 {tour.discount && tour.discount > 0 && (
                                   <div className="text-xs text-gray-400 line-through">
                                     {tour.price.toLocaleString('tr-TR')} ₺
                                   </div>
                                 )}
                               </div>
                             </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        <section className="mt-16 lg:mt-20 bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8 lg:p-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6 text-center">Tur Operatörleri Hakkında Bilgi</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <p className="text-gray-600 mb-6 leading-relaxed">
                 TourTech, seyahat planlarınızı güvenle yapabilmeniz için Türkiye'nin en saygın ve profesyonel tur operatörlerini bir araya getirir. Platformumuzdaki her operatör, hizmet kalitesi, yasal uygunluk ve müşteri memnuniyeti açısından dikkatle seçilir ve düzenli olarak değerlendirilir.
              </p>
              
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Operatör Seçimi İçin İpuçları</h3>
                <ul className="space-y-3">
                  {[
                    "Lisans ve sertifikalar (TÜRSAB üyeliği vb.).",
                    "Müşteri yorumları ve puanlamalar.",
                    "Tur paketlerinin detayları ve kapsamı.",
                    "Fiyatlandırma ve ek masraf politikaları.",
                    "İptal, değişiklik ve sigorta koşulları."
                  ].map((item, index) => (
                     <li key={index} className="flex items-center">
                       <CheckCircle size={18} className="text-indigo-500 mr-2.5 flex-shrink-0" />
                       <span className="text-gray-700 text-sm">{item}</span>
                     </li>
                  ))}
                </ul>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="bg-indigo-50/60 rounded-lg p-4 border border-indigo-100">
                   <h4 className="font-semibold text-indigo-800 mb-1.5 flex items-center text-sm">
                     <BadgeCheck size={16} className="mr-1.5" /> TourTech Onaylı
                   </h4>
                   <p className="text-xs text-indigo-700 leading-relaxed">
                     Onaylı operatörler, yüksek hizmet standartlarımızı karşılayan, güvenilir ve müşteri odaklı iş ortaklarımızdır.
                   </p>
                 </div>
                 <div className="bg-green-50/60 rounded-lg p-4 border border-green-100">
                   <h4 className="font-semibold text-green-800 mb-1.5 flex items-center text-sm">
                     <Award size={16} className="mr-1.5" /> Popüler Seçim
                   </h4>
                   <p className="text-xs text-green-700 leading-relaxed">
                     Yüksek puanları ve sık tercih edilmeleriyle öne çıkan, kullanıcılarımızın favori operatörleridir.
                   </p>
                 </div>
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden aspect-square lg:aspect-auto lg:h-full relative border border-gray-100 shadow-sm mt-6 lg:mt-0">
              <Image 
                src="https://images.unsplash.com/photo-1519055548599-6d4d129508c4?q=80&w=800&auto=format&fit=crop" 
                alt="Güvenli Tatil Planı"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
            </div>
          </div>
          
          <div className="mt-10 pt-8 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
              <p className="text-gray-600 text-sm">
                Yardıma mı ihtiyacınız var veya özel bir talebiniz mi var?
              </p>
              <a 
                href="tel:08501234567" 
                className={secondaryButtonClasses + " text-sm flex-shrink-0 focus:ring-offset-2"}
              >
                <Phone size={16} className="mr-1.5" /> Destek Hattı
              </a>
            </div>
          </div>
        </section>
        
        <section className="mt-16 lg:mt-20 bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8 lg:p-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-8 text-center">Sıkça Sorulan Sorular</h2>
          
          <div className="max-w-3xl mx-auto space-y-5">
            {[
              { question: "Tur operatörlerini nasıl karşılaştırabilirim?", answer: "Platformumuzdaki filtreleme (puan, sertifika, tur sayısı vb.) ve sıralama seçeneklerini kullanarak operatörleri karşılaştırabilirsiniz. Ayrıca operatör detay sayfalarında müşteri yorumlarını ve hizmet detaylarını inceleyebilirsiniz." },
              { question: "Rezervasyon sonrası operatörle nasıl iletişime geçebilirim?", answer: "Onaylanan rezervasyonunuz sonrası operatörün doğrudan iletişim bilgileri (telefon, e-posta) size iletilir. Ayrıca TourTech platformu üzerinden de mesajlaşma imkanınız bulunmaktadır." },
              { question: "TourTech Onaylı (Sertifikalı) operatör ne anlama geliyor?", answer: "Bu operatörler, TourTech tarafından belirlenen hizmet kalitesi, yasal uygunluk ve müşteri memnuniyeti standartlarını karşıladıkları için onaylanmıştır. Bu, daha güvenilir bir seyahat deneyimi anlamına gelir." },
              { question: "İptal ve değişiklik politikaları standart mı?", answer: "Hayır, her tur operatörünün ve hatta her turun farklı iptal/değişiklik koşulları olabilir. Rezervasyon yapmadan önce tur detay sayfasındaki ve operatör profilindeki ilgili politikaları dikkatlice okumanız önemlidir." },
              { question: "Seyahatim sırasında bir sorun yaşarsam ne yapmalıyım?", answer: "Öncelikle doğrudan tur operatörünüzle iletişime geçmenizi öneririz. Çözüm bulamadığınız durumlarda TourTech Müşteri Destek ekibimiz 7/24 size yardımcı olmak için hazırdır. İletişim bilgilerimize web sitemizden ulaşabilirsiniz." }
            ].map((faq, index) => (
              <details 
                key={index} 
                className="group bg-gray-50/70 border border-gray-200 rounded-lg open:bg-white open:shadow-md transition-[background-color,box-shadow] duration-200 ease-out"
              >
                 <summary className="flex justify-between items-center cursor-pointer list-none p-5 font-semibold text-gray-800 hover:text-indigo-700 transition-colors duration-150 ease-out">
                   <span>{faq.question}</span>
                   <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform duration-200 ease-out shrink-0" />
                 </summary>
                 <div className="overflow-hidden transition-all duration-300 ease-out max-h-0 group-open:max-h-screen">
                   <p className="text-gray-600 px-5 pt-1 pb-5 leading-relaxed text-sm opacity-0 group-open:opacity-100 transition-opacity duration-300 ease-out delay-100">
                     {faq.answer}
                   </p>
                 </div>
               </details>
            ))}
          </div>
          
          <div className="mt-10 pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-600 mb-4 text-sm">Yanıtını bulamadığınız başka sorularınız mı var?</p>
            <Link 
              href="/help-center" 
              className={secondaryButtonClasses + " text-sm focus:ring-offset-2"}
            >
              Yardım Merkezi <ChevronRight size={16} className="ml-1.5" />
            </Link>
          </div>
        </section>
        
        <section className="mt-16 lg:mt-20 mb-10 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-lg shadow-lg p-8 md:p-12 text-center text-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-40 h-40 border-[25px] border-white/5 rounded-full -translate-x-1/4 -translate-y-1/4 opacity-70"></div>
          <div className="absolute bottom-0 right-0 w-56 h-56 border-[35px] border-white/5 rounded-full translate-x-1/4 translate-y-1/4 opacity-70"></div>
          
          <div className="relative z-10 max-w-xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Hayalinizdeki Tatili Bulun</h2>
              <p className="text-indigo-100/90 mb-8 leading-relaxed">
                Geniş tur seçeneklerimiz ve güvenilir iş ortaklarımızla mükemmel seyahat deneyimini planlamak için daha fazla beklemeyin. Şimdi keşfedin!
              </p>
            <Link 
              href="/experience" 
              className={`bg-white text-indigo-700 hover:bg-indigo-50 ${primaryButtonClasses} text-base px-8 py-3 shadow-xl hover:shadow-lg focus:ring-offset-2`}
            >
              Tüm Turları Keşfet <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </section>
      </main>

      {/* Scroll Top Button - Subtle */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-5 right-5 bg-gray-800 hover:bg-black text-white p-2.5 rounded-full shadow-lg hover:shadow-xl z-50 transition-all duration-200 ease-out animate-fadeIn"
          aria-label="Sayfa başına dön"
        >
          <ArrowUp size={18} />
        </button>
      )}
      
      {/* Mobile Filter Sticky Bar - Minimal */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-[0_-1px_4px_rgba(0,0,0,0.04)] py-2 px-3 flex justify-around items-center z-40 h-[60px]">
        <button 
          onClick={() => setShowFilters(state => !state)} // Toggle directly
          className={`flex flex-col items-center justify-center text-xs font-medium transition-colors p-1 rounded w-16 h-full ${showFilters ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-600'} duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        >
          <SlidersHorizontal size={20} className="mb-0.5" />
          <span>Filtrele</span>
        </button>
        
        <div className="flex flex-col items-center justify-center text-xs font-medium text-gray-500 p-1 h-full">
           <label htmlFor="sortBy-mobile" className="sr-only">Sırala</label>
           <select
             id="sortBy-mobile"
             value={sortBy}
             onChange={(e) => setSortBy(e.target.value)}
             className="bg-transparent text-center font-medium focus:outline-none appearance-none -mb-1 focus:ring-1 focus:ring-indigo-500 rounded"
           >
             <option value="popular">Popüler</option>
             <option value="rating">Puan</option>
             <option value="tours">Tur Sayısı</option>
           </select>
           <span className="mt-1 opacity-80">Sırala</span>
        </div>
        
        <button 
          onClick={() => { 
              const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
              if (searchInput) {
                  searchInput.focus();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
              }
          }} 
          className="flex flex-col items-center justify-center text-xs font-medium text-gray-500 hover:text-indigo-600 transition-colors p-1 rounded w-16 h-full duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <Search size={20} className="mb-0.5" />
          <span>Ara</span>
        </button>
      </div>
      
      {/* Removed the previous global styles block */}
      <style jsx>{`
        /* Simple fade-in animation */
        @keyframes fadeIn { from { opacity: 0; transform: translateY(3px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        /* Basic scrollbar styling */
        .scrollbar-thin::-webkit-scrollbar { height: 5px; width: 5px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
        .scrollbar-thin { scrollbar-width: thin; scrollbar-color: #d1d5db transparent; }
      `}</style>
    </div>
  );
}
