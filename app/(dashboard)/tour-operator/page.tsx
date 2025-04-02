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
  Heart,
  Bookmark,
  Share2,
  ArrowUp
} from "lucide-react";

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
  const [sortBy, setSortBy] = useState("popular"); // popular, rating, tours
  const [showScrollTop, setShowScrollTop] = useState(false);

  const categories = [
    { id: "all", name: "Tümü" },
    { id: "travel", name: "Seyahat" },
    { id: "culture", name: "Kültür Turları" },
    { id: "adventure", name: "Macera Turları" },
    { id: "nature", name: "Doğa Turları" },
    { id: "beach", name: "Deniz Turları" },
    { id: "city", name: "Şehir Turları" }
  ];

  useEffect(() => {
    // API isteği simülasyonu
    setTimeout(() => {
      setLoading(false);
      setFilteredOperators(dummyTourOperators);
    }, 1000);

    // Scroll event listener
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Operatörleri arama terimlerine ve filtrelere göre filtrele
    let filtered = [...dummyTourOperators];
    
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((operator: any) => 
        operator.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        operator.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        operator.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        operator.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory && selectedCategory !== "all") {
      // Kategoriye göre filtrele (gerçek veri ile değiştirilecek)
      filtered = filtered.filter((operator: any) => 
        operator.categories?.includes(selectedCategory)
      );
    }

    // Ek filtreler için
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
        const tourCount = dummyTours.filter(
          (tour: any) => tour.tourOperatorId === operator.id
        ).length;
        return tourCount >= filterOptions.tourCount!;
      });
    }

    // Sıralama
    if (sortBy === "rating") {
      filtered.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "tours") {
      filtered.sort((a: any, b: any) => {
        const aTourCount = dummyTours.filter(tour => tour.tourOperatorId === a.id).length;
        const bTourCount = dummyTours.filter(tour => tour.tourOperatorId === b.id).length;
        return bTourCount - aTourCount;
      });
    } else {
      // Varsayılan popülerliğe göre (dummy veri)
      filtered.sort((a: any, b: any) => (b.popularity || 0) - (a.popularity || 0));
    }
    
    setFilteredOperators(filtered);
  }, [searchTerm, selectedCategory, filterOptions, sortBy]);

  // Filtreleri sıfırla
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
    setFilterOptions({
      certified: false,
      rating: null,
      tourCount: null,
    });
    setSortBy("popular");
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Bölümü */}
      <section className="relative bg-blue-900 overflow-hidden">
        {/* Arka plan görseli */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1530363591527-19586e74fcf8?q=80&w=2070&auto=format&fit=crop" 
            alt="Tur Operatörleri"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 via-blue-900/70 to-blue-900/95"></div>
        </div>
        
        {/* Hero İçeriği */}
        <div className="container mx-auto px-4 py-20 md:py-28 lg:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="bg-blue-800/50 text-blue-100 text-sm font-medium px-4 py-2 rounded-full inline-block mb-6 backdrop-blur-sm">
              TourTech ile Güvenli Seyahat
            </span>
            
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Güvenilir <span className="text-blue-300 relative">
                Tur Operatörleri
                <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-300/40"></span>
              </span> ile<br />Hayallerinize Yolculuk
            </h1>
            
            <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
              Türkiye'nin en profesyonel ve sertifikalı tur operatörleri ile unutulmaz seyahat deneyimleri yaşayın.
            </p>
            
            {/* Arama ve Filtreleme */}
            <div className="max-w-3xl mx-auto mb-8 relative z-10">
              <div className="flex flex-col bg-white rounded-xl shadow-xl overflow-hidden">
                {/* Arama Kutusu */}
                <div className="flex flex-col sm:flex-row">
                  <div className="flex-grow relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Tur operatörü veya lokasyon ara..."
                      className="w-full py-4 pl-12 pr-4 text-gray-800 focus:outline-none focus:ring-0 border-0"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="sm:border-l border-gray-100">
                    <button 
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center justify-center h-full px-6 py-4 w-full sm:w-auto text-blue-600 hover:bg-blue-50 border-t sm:border-t-0 border-gray-100"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      <span>Filtrele</span>
                    </button>
                  </div>
                  <button className="px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all duration-200 sm:w-auto w-full flex items-center justify-center">
                    <Search className="w-5 h-5 mr-2" />
                    <span>Ara</span>
                  </button>
                </div>
                
                {/* Filtreler */}
                {showFilters && (
                  <div className="bg-blue-50/70 p-4 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Sertifikasyon Filtresi */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Sertifikasyon</label>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="certified"
                            checked={filterOptions.certified}
                            onChange={(e) => setFilterOptions({...filterOptions, certified: e.target.checked})}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <label htmlFor="certified" className="ml-2 text-sm text-gray-700">
                            Sadece sertifikalı operatörler
                          </label>
                        </div>
                      </div>
                      
                      {/* Değerlendirme Filtresi */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Değerlendirme</label>
                        <div className="flex space-x-3">
                          {[4, 3, 2].map((rating) => (
                            <button
                              key={rating}
                              onClick={() => setFilterOptions({
                                ...filterOptions, 
                                rating: filterOptions.rating === rating ? null : rating
                              })}
                              className={`px-3 py-1.5 rounded-md text-sm ${
                                filterOptions.rating === rating 
                                  ? "bg-blue-600 text-white" 
                                  : "bg-white text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              {rating}+ <Star className="w-3 h-3 inline-block" />
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Tur Sayısı Filtresi */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Tur Sayısı</label>
                        <div className="flex space-x-3">
                          {[5, 10, 20].map((count) => (
                            <button
                              key={count}
                              onClick={() => setFilterOptions({
                                ...filterOptions, 
                                tourCount: filterOptions.tourCount === count ? null : count
                              })}
                              className={`px-3 py-1.5 rounded-md text-sm ${
                                filterOptions.tourCount === count 
                                  ? "bg-blue-600 text-white" 
                                  : "bg-white text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              {count}+ Tur
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-4 pt-4 border-t border-blue-100">
                      <button
                        onClick={resetFilters}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Tüm filtreleri temizle
                      </button>
                      
                      <div className="space-x-3">
                        <label className="text-sm font-medium text-gray-700">Sırala:</label>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="bg-white py-1.5 px-3 rounded-md text-sm border border-gray-200 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="popular">Popülerlik</option>
                          <option value="rating">Değerlendirme</option>
                          <option value="tours">Tur Sayısı</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* İstatistikler */}
      <section className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { icon: Award, value: "140+", label: "Sertifikalı Operatör", color: "from-blue-500 to-blue-600" },
            { icon: Users, value: "5200+", label: "Memnun Müşteri", color: "from-indigo-500 to-indigo-600" },
            { icon: Calendar, value: "380+", label: "Benzersiz Tur", color: "from-purple-500 to-purple-600" },
            { icon: Star, value: "4.8/5", label: "Müşteri Memnuniyeti", color: "from-sky-500 to-sky-600" }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 overflow-hidden relative group">
              <div className={`bg-gradient-to-r ${stat.color} rounded-xl p-3 w-14 h-14 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-gray-100/80 via-transparent to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Kategori Filtreleme */}
      <section className="container mx-auto px-4 mt-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Kategoriler</h2>
          <button 
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
            onClick={resetFilters}
          >
            Tümünü Göster
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>
        <div className="flex overflow-x-auto space-x-2 pb-2 -mx-4 px-4 scrollbar-hide">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id === "all" ? null : category.id)}
              className={`flex-none px-5 py-2.5 rounded-full text-sm font-medium ${
                (category.id === "all" && !selectedCategory) || selectedCategory === category.id
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              } transition-colors border border-transparent whitespace-nowrap shadow-sm`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      {/* Popüler Tur Operatörleri (Yeni Bölüm) */}
      <section className="container mx-auto px-4 mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Popüler Tur Operatörleri</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredOperators.slice(0, 4).map((operator: any) => {
            const tourCount = dummyTours.filter(
              (tour: any) => tour.tourOperatorId === operator.id
            ).length;
            
            return (
              <Link
                key={operator.id}
                href={`/tour-operator/${operator.id}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group"
              >
                <div className="h-40 bg-blue-100 relative overflow-hidden">
                  {operator.coverImage ? (
                    <Image
                      src={operator.coverImage}
                      alt={operator.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-all duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-400 to-blue-600">
                      <Building className="w-16 h-16 text-white/70" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    {operator.certified && (
                      <div className="bg-blue-600 text-white p-1.5 rounded-full shadow-lg">
                        <BadgeCheck className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  {operator.logo && (
                    <div className="absolute -bottom-6 left-4 w-16 h-16 rounded-xl overflow-hidden border-4 border-white shadow-md bg-white">
                      <Image
                        src={operator.logo}
                        alt={`${operator.name} logo`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
                
                <div className="p-4 pt-8 flex-grow flex flex-col">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {operator.name}
                  </h3>
                  
                  <div className="flex items-center text-gray-500 text-sm mt-1 mb-2">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-blue-500 flex-shrink-0" />
                    <span className="truncate">{operator.city}, {operator.country}</span>
                  </div>
                  
                  <div className="flex-grow">
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {operator.description || "Bu tur operatörü hakkında henüz detaylı bilgi bulunmamaktadır."}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-blue-500 mr-1.5" />
                      <span className="text-sm font-medium">{tourCount} Tur</span>
                    </div>
                    
                    {operator.rating && (
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-blue-500 fill-blue-500" />
                        <span className="text-sm font-medium ml-1">{operator.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        
        <div className="text-center mt-8">
          <button 
            onClick={() => {
              const operatorsList = document.getElementById('operators-list');
              if (operatorsList) {
                window.scrollTo({
                  top: operatorsList.offsetTop - 100, 
                  behavior: 'smooth'
                });
              }
            }}
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            Tüm Operatörleri Görüntüle
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </section>

      {/* Ana İçerik */}
      <main className="container mx-auto px-4 mt-12 pb-20" id="operators-list">
        {/* Operatörler Başlık */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Tur Operatörleri
            </h2>
            <p className="text-gray-600">
              Türkiye'nin önde gelen tur operatörleri ile tatil planlarınızı gerçekleştirin
            </p>
          </div>
          <div className="mt-4 md:mt-0 py-2 px-4 bg-blue-50 rounded-full text-blue-600 font-medium text-sm">
            {filteredOperators.length} tur operatörü listeleniyor
          </div>
        </div>

        {/* Operatörler Listesi */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Logo Skeleton */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 rounded-xl bg-gray-200"></div>
                    </div>
                    
                    {/* İçerik Skeleton */}
                    <div className="flex-1">
                      <div className="mb-4">
                        <div className="flex items-start justify-between">
                          <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                          <div className="bg-gray-200 h-5 w-16 rounded"></div>
                        </div>
                        
                        <div className="h-4 bg-gray-200 rounded w-40 mb-3"></div>
                        
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                        
                        {/* Etiketler Skeleton */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                          <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                          <div className="h-6 bg-gray-200 rounded-full w-28"></div>
                        </div>
                        
                        {/* Butonlar Skeleton */}
                        <div className="flex flex-wrap gap-3">
                          <div className="h-10 bg-gray-200 rounded-lg w-40"></div>
                          <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Tur Önerileri Skeleton */}
                <div className="border-t border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-5 bg-gray-200 rounded w-32"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-200 rounded-lg h-16"></div>
                    <div className="p-3 bg-gray-200 rounded-lg h-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredOperators.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Tur operatörü bulunamadı</h3>
            <p className="text-gray-500 mb-4">Aramanızla eşleşen tur operatörü bulunamadı.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory(null);
                setFilterOptions({
                  certified: false,
                  rating: null,
                  tourCount: null,
                });
                setSortBy("popular");
              }}
              className="text-blue-600 font-medium hover:text-blue-700 inline-flex items-center"
            >
              Tüm operatörleri göster
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredOperators.map((operator: any) => {
              // Tur operatörüne ait turları bul
              const operatorTours = dummyTours.filter(
                (tour: any) => tour.tourOperatorId === operator.id
              );

              return (
                <div 
                  key={operator.id} 
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Logo */}
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 rounded-xl overflow-hidden shadow-md border border-gray-100 bg-white relative group-hover:shadow-lg transition-all">
                          {operator.logo ? (
                            <Image
                              src={operator.logo}
                              alt={operator.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-blue-50">
                              <Building className="w-10 h-10 text-blue-400" />
                            </div>
                          )}
                          {operator.certified && (
                            <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-full">
                              <BadgeCheck className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* İçerik */}
                      <div className="flex-1">
                        <div className="mb-4">
                          <div className="flex items-start justify-between">
                            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                              {operator.name}
                            </h3>
                            <div className="flex items-center gap-1 ml-2">
                              {operator.rating && (
                                <div className="flex items-center bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md text-sm font-medium">
                                  <Star className="h-3.5 w-3.5 text-blue-500 mr-1 fill-blue-500" />
                                  <span>{operator.rating.toFixed(1)}</span>
                                </div>
                              )}
                              {operatorTours.length > 10 && (
                                <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md text-sm font-medium">
                                  Popüler
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center text-gray-500 mb-3">
                            <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                            <span>{operator.city}, {operator.country}</span>
                          </div>
                          
                          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                            {operator.description || "Bu tur operatörü hakkında henüz detaylı bilgi bulunmamaktadır."}
                          </p>
                          
                          {/* Etiketler */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {operator.certified && (
                              <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Lisanslı
                              </span>
                            )}
                            <span className="inline-flex items-center px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                              <Users className="w-3 h-3 mr-1" />
                              {operatorTours.length} Tur
                            </span>
                            {operator.international && (
                              <span className="inline-flex items-center px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">
                                <Globe className="w-3 h-3 mr-1" />
                                Uluslararası
                              </span>
                            )}
                            {operator.fastResponse && (
                              <span className="inline-flex items-center px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">
                                <Clock className="w-3 h-3 mr-1" />
                                Hızlı Yanıt
                              </span>
                            )}
                          </div>
                          
                          {/* Butonlar */}
                          <div className="flex flex-wrap gap-3">
                            <Link 
                              href={`/tour-operator/${operator.id}`}
                              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              Detayları Görüntüle
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Link>
                            <a 
                              href={`tel:${operator.phone}`}
                              className="inline-flex items-center justify-center border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              <Phone className="w-4 h-4 mr-1.5" />
                              İletişim
                            </a>
                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                              <Bookmark className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                              <Share2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tur Önerileri */}
                  {operatorTours.length > 0 && (
                    <div className="border-t border-gray-100 bg-gray-50 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Öne Çıkan Turlar</h4>
                        <Link 
                          href={`/tour-operator/${operator.id}#tours`} 
                          className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                        >
                          Tümü
                          <ChevronRight className="w-4 h-4 ml-0.5" />
                        </Link>
                      </div>
                      <div className="space-y-2">
                        {operatorTours.slice(0, 2).map((tour: any) => (
                          <Link 
                            key={tour.id} 
                            href={`/tour/${tour.id}`}
                            className="block p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h5 className="font-medium text-gray-900 mb-1 group-hover:text-blue-600">{tour.name}</h5>
                                <div className="flex items-center text-xs text-gray-500">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  <span>{tour.duration} Gün</span>
                                  <span className="mx-2">•</span>
                                  <MapPin className="w-3 h-3 mr-1" />
                                  <span className="truncate max-w-[120px]">
                                    {tour.destinations ? JSON.parse(tour.destinations)[0] : ""}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-blue-600">
                                  {tour.discount && tour.discount > 0 
                                    ? (tour.price - (tour.price * tour.discount / 100)).toLocaleString('tr-TR')
                                    : tour.price.toLocaleString('tr-TR')} ₺
                                </div>
                                {tour.discount && tour.discount > 0 && (
                                  <div className="text-xs text-gray-500 line-through">
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
        
        {/* Bilgi Bölümü */}
        <section className="mt-16 bg-white rounded-xl shadow-md p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tur Operatörleri ile Güvenli Seyahat</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <p className="text-gray-600 mb-4">
                Tur operatörleri, seyahat ürünlerini planlayan, düzenleyen ve sunan profesyonel şirketlerdir. 
                TourTech platformunda listelenen tüm tur operatörleri, güvenilirlik, kalite ve müşteri memnuniyeti 
                açısından titizlikle değerlendirilmektedir.
              </p>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tur Operatörü Seçerken Dikkat Etmeniz Gerekenler</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Operatörün lisans ve sertifikalarını kontrol edin</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Müşteri yorumlarını ve değerlendirmelerini inceleyin</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Sundukları hizmetlerin kapsamını araştırın</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Fiyat-performans dengesini değerlendirin</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Acil durum politikalarını ve iptal koşullarını öğrenin</span>
                  </li>
                </ul>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                    <BadgeCheck className="w-5 h-5 mr-2 text-blue-600" />
                    TourTech Sertifikası Nedir?
                  </h4>
                  <p className="text-sm text-blue-800">
                    TourTech sertifikalı operatörler, yüksek hizmet standartlarını karşılayan, yasal olarak tescilli ve müşteri memnuniyeti yüksek olan güvenilir işletmelerdir.
                  </p>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-purple-600" />
                    Popüler Operatörler
                  </h4>
                  <p className="text-sm text-purple-800">
                    En çok tercih edilen ve en yüksek değerlendirmelere sahip tur operatörleri, "popüler" rozeti ile öne çıkarılmaktadır.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="rounded-xl overflow-hidden relative h-64 md:h-auto">
              <Image 
                src="https://images.unsplash.com/photo-1519055548599-6d4d129508c4?q=80&w=2070&auto=format&fit=crop" 
                alt="Güvenli Seyahat"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                <div className="text-white">
                  <h4 className="font-semibold mb-1">TourTech Güvencesi</h4>
                  <p className="text-sm text-white/80">Güvenilir operatörler, memnun müşteriler</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-gray-600 text-sm">
                Seyahatiniz için uygun bir tur operatörü bulamadınız mı?
              </p>
              <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                Yardım ve Bilgi Hattı: 0850 123 45 67
              </button>
            </div>
          </div>
        </section>
        
        {/* SSS Bölümü */}
        <section className="mt-16 bg-white rounded-xl shadow-md p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Sıkça Sorulan Sorular</h2>
          
          <div className="space-y-6">
            {[
              {
                question: "Tur operatörlerini nasıl karşılaştırabilirim?",
                answer: "TourTech platformunda tur operatörlerini değerlendirme puanlarına, sunduğu tur sayılarına ve müşteri yorumlarına göre filtreleyebilir ve karşılaştırabilirsiniz. Ayrıca detay sayfalarında her operatörün hizmet kapsamını ve özel avantajlarını görebilirsiniz."
              },
              {
                question: "Rezervasyon yaptığım tur operatörü ile nasıl iletişime geçebilirim?",
                answer: "Rezervasyon yaptığınız tur operatörünün iletişim bilgilerine hem tur detay sayfasından hem de operatör profilinden ulaşabilirsiniz. Ayrıca TourTech Müşteri Hizmetleri üzerinden de operatörlerle bağlantı kurabilirsiniz."
              },
              {
                question: "Tur operatörünün sertifikalı olması neden önemlidir?",
                answer: "Sertifikalı tur operatörleri, TourTech kalite standartlarını karşıladıklarını ve güvenilir hizmet sunduklarını belgelemişlerdir. Bu operatörler düzenli olarak denetlenir ve yüksek müşteri memnuniyeti sağlar."
              },
              {
                question: "İptal ve değişiklik politikaları her tur operatöründe aynı mıdır?",
                answer: "Hayır, her tur operatörünün kendine özgü iptal ve değişiklik politikaları olabilir. Bu politikalara operatör profil sayfasından ve tur detay sayfasından ulaşabilirsiniz. Rezervasyon yapmadan önce bu politikaları incelemenizi öneririz."
              },
              {
                question: "Bir problem yaşarsam TourTech nasıl yardımcı olabilir?",
                answer: "TourTech, tüm müşterilerine 7/24 destek sunmaktadır. Herhangi bir problem yaşarsanız, online yardım merkezimizi kullanabilir, canlı destek hattımızı arayabilir veya müşteri hizmetleri e-posta adresimize ulaşabilirsiniz."
              }
            ].map((faq, index) => (
              <div key={index} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                    {index + 1}
                  </span>
                  {faq.question}
                </h3>
                <p className="text-gray-600 pl-9">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-600 mb-4">Başka sorularınız mı var?</p>
            <Link 
              href="/help-center" 
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded-lg transition-colors"
            >
              Yardım Merkezine Git
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </section>
        
        {/* Çağrı Bölümü */}
        <section className="mt-16 mb-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-md p-8 md:p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/4"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="md:w-2/3">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Hayalinizdeki Tatili Planlayın</h2>
              <p className="text-blue-100 max-w-xl">
                TourTech'in güvenilir tur operatörleri ve özel fırsatlarıyla unutulmaz tatil deneyimleri yaşayın. 
                İster kültür turu, ister plaj tatili, ister macera dolu bir deneyim – hepsi TourTech'te!
              </p>
            </div>
            
            <div className="md:w-1/3 flex flex-col md:items-end gap-3">
              <Link 
                href="/experience" 
                className="inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-blue-50 text-blue-700 font-medium rounded-lg transition-colors text-center"
              >
                Tüm Deneyimleri Keşfet
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg transition-colors border border-blue-500 text-center"
              >
                Özel Tur Talebi Oluştur
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Yukarı Çık Butonu */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-50 transition-all duration-300 animate-fade-in"
          aria-label="Sayfanın başına dön"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
      
      {/* Mobil Filtreleme Çubuğu */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg py-3 px-4 flex justify-between items-center z-40">
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center text-gray-700 hover:text-blue-600"
        >
          <Filter className="h-5 w-5 mr-2" />
          <span className="font-medium">Filtrele</span>
        </button>
        
        <div className="border-l border-gray-200 h-8 mx-2"></div>
        
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">Sırala:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent text-gray-700 text-sm font-medium focus:outline-none focus:text-blue-600"
          >
            <option value="popular">Popülerlik</option>
            <option value="rating">Değerlendirme</option>
            <option value="tours">Tur Sayısı</option>
          </select>
        </div>
        
        <div className="border-l border-gray-200 h-8 mx-2"></div>
        
        <button 
          onClick={() => {
            const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
            if (searchInput) {
              searchInput.focus();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }} 
          className="flex items-center justify-center text-gray-700 hover:text-blue-600"
        >
          <Search className="h-5 w-5 mr-2" />
          <span className="font-medium">Ara</span>
        </button>
      </div>
      
      {/* Filtrelere göre aktif etiketleri göster */}
      {(filterOptions.certified || filterOptions.rating || filterOptions.tourCount || selectedCategory) && (
        <div className="sticky top-16 z-30 bg-white border-b border-gray-200 shadow-sm py-2 px-4 mb-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500">Aktif filtreler:</span>
              
              {selectedCategory && selectedCategory !== "all" && (
                <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                  {categories.find(c => c.id === selectedCategory)?.name}
                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className="ml-1 text-blue-400 hover:text-blue-700"
                  >
                    &times;
                  </button>
                </span>
              )}
              
              {filterOptions.certified && (
                <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                  Sertifikalı
                  <button 
                    onClick={() => setFilterOptions({...filterOptions, certified: false})}
                    className="ml-1 text-blue-400 hover:text-blue-700"
                  >
                    &times;
                  </button>
                </span>
              )}
              
              {filterOptions.rating && (
                <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                  {filterOptions.rating}+ Yıldız
                  <button 
                    onClick={() => setFilterOptions({...filterOptions, rating: null})}
                    className="ml-1 text-blue-400 hover:text-blue-700"
                  >
                    &times;
                  </button>
                </span>
              )}
              
              {filterOptions.tourCount && (
                <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                  {filterOptions.tourCount}+ Tur
                  <button 
                    onClick={() => setFilterOptions({...filterOptions, tourCount: null})}
                    className="ml-1 text-blue-400 hover:text-blue-700"
                  >
                    &times;
                  </button>
                </span>
              )}
            </div>
            
            <button 
              onClick={resetFilters}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Tümünü Temizle
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
