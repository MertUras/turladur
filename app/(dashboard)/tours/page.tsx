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

export default function ToursPage() {
  const searchParams = useSearchParams();
  const durationParam = searchParams.get('duration');
  const featuredParam = searchParams.get('featured');
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTours, setFilteredTours] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState("popular"); // popular, price-low, price-high, duration
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    minPrice: null as number | null,
    maxPrice: null as number | null,
    duration: durationParam ? parseInt(durationParam) : null as number | null,
    featured: featuredParam === 'true'
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [toursPerPage, setToursPerPage] = useState(6);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    // API isteği simülasyonu
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Turları filtrele
    let filtered = [...dummyTours];
    
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((tour) => 
        tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parseJsonString<string[]>(tour.destinations, []).some(dest => 
          dest.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        tour.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Ek filtreler
    if (filterOptions.minPrice !== null) {
      filtered = filtered.filter((tour) => tour.price >= filterOptions.minPrice!);
    }
    
    if (filterOptions.maxPrice !== null) {
      filtered = filtered.filter((tour) => tour.price <= filterOptions.maxPrice!);
    }
    
    if (filterOptions.duration !== null) {
      filtered = filtered.filter((tour) => tour.duration === filterOptions.duration);
    }
    
    if (filterOptions.featured) {
      filtered = filtered.filter((tour) => tour.featured);
    }
    
    // Sıralama
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => {
          const aPrice = a.price * (1 - (a.discount || 0) / 100);
          const bPrice = b.price * (1 - (b.discount || 0) / 100);
          return aPrice - bPrice;
        });
        break;
      case "price-high":
        filtered.sort((a, b) => {
          const aPrice = a.price * (1 - (a.discount || 0) / 100);
          const bPrice = b.price * (1 - (b.discount || 0) / 100);
          return bPrice - aPrice;
        });
        break;
      case "duration":
        filtered.sort((a, b) => a.duration - b.duration);
        break;
      default: // popular
        // Varsayılan popülerliğe göre sıralama
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }
    
    setFilteredTours(filtered);
  }, [searchTerm, filterOptions, sortBy]);

  // Filtreleri sıfırla
  const resetFilters = () => {
    setSearchTerm("");
    setFilterOptions({
      minPrice: null,
      maxPrice: null,
      duration: null,
      featured: false
    });
    setSortBy("popular");
  };

  // Sayfalama için hesaplamalar
  const totalTours = filteredTours.length;
  const indexOfLastTour = currentPage * toursPerPage;
  const displayedTours = filteredTours.slice(0, indexOfLastTour);
  
  const hasMoreTours = indexOfLastTour < totalTours;

  // Daha fazla tur yükleme fonksiyonu
  const loadMoreTours = useCallback(() => {
    if (hasMoreTours) {
      setLoadingMore(true);
      // API isteği simülasyonu
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setLoadingMore(false);
      }, 800);
    }
  }, [hasMoreTours]);

  // Filtreler değiştiğinde sayfalamayı sıfırla
  useEffect(() => {
    setCurrentPage(1);
  }, [filterOptions, searchTerm, sortBy]);

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
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Kategoriler */}
          <div className={`lg:w-1/4 lg:block ${showMobileFilters ? 'block' : 'hidden'}`}>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-24">
              <div className="bg-gray-50 border-b border-gray-100 py-4 px-6 flex justify-between items-center">
                <h3 className="font-bold text-gray-900 flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-blue-600" />
                  Filtreler
                </h3>
                <button 
                  onClick={() => setShowMobileFilters(false)}
                  className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Fiyat Filtresi */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Fiyat Aralığı</h4>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        placeholder="₺ Min"
                        className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-gray-700 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        value={filterOptions.minPrice || ''}
                        onChange={(e) => setFilterOptions({
                          ...filterOptions,
                          minPrice: e.target.value ? parseInt(e.target.value) : null
                        })}
                      />
                    </div>
                    <span className="text-gray-400">-</span>
                    <div className="relative flex-1">
                      <input
                        type="number"
                        placeholder="₺ Max"
                        className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-gray-700 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        value={filterOptions.maxPrice || ''}
                        onChange={(e) => setFilterOptions({
                          ...filterOptions,
                          maxPrice: e.target.value ? parseInt(e.target.value) : null
                        })}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Süre Filtresi */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Tur Süresi</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 5, 7, 10].map((day) => (
                      <button
                        key={day}
                        onClick={() => setFilterOptions({
                          ...filterOptions,
                          duration: filterOptions.duration === day ? null : day
                        })}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          filterOptions.duration === day
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {day} {day === 1 ? "Gün" : "Gün"}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Diğer Filtreler */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Tur Özellikleri</h4>
                  <div className="space-y-2">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filterOptions.featured}
                        onChange={(e) => setFilterOptions({...filterOptions, featured: e.target.checked})}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">Öne çıkan turlar</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">İndirimli turlar</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">En yüksek puanlı</span>
                    </label>
                  </div>
                </div>
                
                {/* Filtre Temizleme */}
                <div className="pt-4 border-t border-gray-100">
                  <button
                    onClick={resetFilters}
                    className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                  >
                    Filtreleri Temizle
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tur Listesi */}
          <div className="lg:w-3/4">
            {/* Sıralama ve Sonuç Sayısı */}
            <div className="hidden lg:flex justify-between items-center bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="text-gray-600">
                {loading ? (
                  <div className="h-5 bg-gray-200 animate-pulse rounded w-40"></div>
                ) : (
                  <span><span className="font-medium text-gray-900">{filteredTours.length}</span> tur bulundu</span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sırala:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-gray-50 border border-gray-200 rounded-lg py-2 pl-4 pr-10 text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  >
                    <option value="popular">Popülerlik</option>
                    <option value="price-low">Fiyat: Düşük - Yüksek</option>
                    <option value="price-high">Fiyat: Yüksek - Düşük</option>
                    <option value="duration">Süre</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>
            
            {/* Aktif Filtreler */}
            {Object.values(filterOptions).some(value => value !== null && value !== false) && (
              <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="flex items-center mb-2">
                  <Filter className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-gray-900">Aktif Filtreler</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.minPrice !== null && (
                    <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <span>Min: ₺{filterOptions.minPrice}</span>
                      <button 
                        onClick={() => setFilterOptions({...filterOptions, minPrice: null})}
                        className="ml-2"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  {filterOptions.maxPrice !== null && (
                    <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <span>Max: ₺{filterOptions.maxPrice}</span>
                      <button 
                        onClick={() => setFilterOptions({...filterOptions, maxPrice: null})}
                        className="ml-2"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  {filterOptions.duration !== null && (
                    <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <span>{filterOptions.duration} gün</span>
                      <button 
                        onClick={() => setFilterOptions({...filterOptions, duration: null})}
                        className="ml-2"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  {filterOptions.featured && (
                    <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <span>Öne Çıkan</span>
                      <button 
                        onClick={() => setFilterOptions({...filterOptions, featured: false})}
                        className="ml-2"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  <button 
                    onClick={resetFilters} 
                    className="text-sm text-gray-600 hover:text-gray-900 underline ml-2"
                  >
                    Tümünü Temizle
                  </button>
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
                    <span className="text-blue-600 font-semibold">{totalTours}</span> tur arasından <span className="text-blue-600 font-semibold">{displayedTours.length}</span> tanesi gösteriliyor
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {displayedTours.map((tour) => {
                    const tourImages = parseJsonString<string[]>(tour.images, []);
                    const destinations = parseJsonString<string[]>(tour.destinations, []);
                    const inclusions = parseJsonString<string[]>(tour.inclusions, []);
                    const tourOperator = dummyTourOperators.find(op => op.id === tour.tourOperatorId);
                    
                    // İndirimli fiyat hesaplama
                    const discountedPrice = tour.discount 
                      ? tour.price * (1 - tour.discount / 100) 
                      : tour.price;
                    
                    return (
                      <div 
                        key={tour.id} 
                        className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300 flex flex-col"
                      >
                        <div className="relative h-56 overflow-hidden">
                          <Image
                            src={tourImages[0] || '/placeholder-image.jpg'}
                            alt={tour.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {tour.discount > 0 && (
                            <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-lg shadow-md">
                              %{tour.discount} İndirim
                            </div>
                          )}
                          {tour.featured && (
                            <div className="absolute bottom-4 left-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-lg shadow-md flex items-center">
                              <Star className="w-3 h-3 mr-1" />
                              <span>Öne Çıkan</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="flex items-center text-white/90 text-sm">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span className="truncate">{destinations.join(', ')}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-5 flex-grow flex flex-col">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center">
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-4 w-4 ${star <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-500 ml-1">(128)</span>
                            </div>
                            
                            <Link 
                              href={`/tour-operator/${tourOperator?.id}`}
                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {tourOperator?.name}
                            </Link>
                          </div>
                          
                          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {tour.name}
                          </h3>
                          
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {tour.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            <div className="inline-flex items-center bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-medium">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              {tour.duration} gün
                            </div>
                            <div className="inline-flex items-center bg-green-50 text-green-700 px-2.5 py-1 rounded-md text-xs font-medium">
                              <Users className="h-3.5 w-3.5 mr-1" />
                              Maks. {tour.maxParticipants || 10} kişi
                            </div>
                            <div className="inline-flex items-center bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md text-xs font-medium">
                              <Calendar className="h-3.5 w-3.5 mr-1" />
                              {new Date(tour.startDate || new Date()).toLocaleDateString('tr-TR', {
                                day: 'numeric',
                                month: 'short',
                              })}
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
                
                {/* Load More Button */}
                {hasMoreTours && (
                  <div className="mt-10 text-center">
                    <button 
                      onClick={loadMoreTours}
                      disabled={loadingMore}
                      className="bg-white hover:bg-gray-50 text-blue-600 font-medium px-8 py-3 rounded-lg border border-gray-200 inline-flex items-center justify-center shadow-sm transition-colors"
                    >
                      {loadingMore ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Yükleniyor...
                        </>
                      ) : (
                        <>
                          Daha Fazla Göster
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
                            {totalTours - displayedTours.length} tur daha
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                )}
                
                {/* Tour Count Information */}
                <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4 text-center">
                  <p className="text-blue-700 text-sm">
                    Toplamda <span className="font-semibold">{totalTours}</span> tur arasından <span className="font-semibold">{displayedTours.length}</span> tanesini görüntülüyorsunuz.
                  </p>
                </div>
              </>
            )}
          </div>
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
              { name: "İstanbul", image: "/images/destinations/istanbul.jpg", count: 42 },
              { name: "Kapadokya", image: "/images/destinations/cappadocia.jpg", count: 28 },
              { name: "Antalya", image: "/images/destinations/antalya.jpg", count: 36 },
              { name: "Pamukkale", image: "/images/destinations/pamukkale.jpg", count: 18 },
              { name: "Efes", image: "/images/destinations/ephesus.jpg", count: 15 },
              { name: "Karadeniz", image: "/images/destinations/blacksea.jpg", count: 24 }
            ].map((destination, index) => (
              <Link 
                href={`/destination/${destination.name.toLowerCase()}`}
                key={index}
                className="group relative rounded-xl overflow-hidden aspect-square shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10"></div>
                <Image
                  src={destination.image}
                  alt={destination.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
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
                question: "Rezervasyon iptali durumunda iade politikanız nedir?", 
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