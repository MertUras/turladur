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
  Globe
} from "lucide-react";

export default function TourOperatorsPage() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOperators, setFilteredOperators] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: "all", name: "Tümü" },
    { id: "travel", name: "Seyahat" },
    { id: "culture", name: "Kültür Turları" },
    { id: "adventure", name: "Macera Turları" },
    { id: "nature", name: "Doğa Turları" }
  ];

  useEffect(() => {
    // API isteği simülasyonu
    setTimeout(() => {
      setLoading(false);
      setFilteredOperators(dummyTourOperators);
    }, 1000);
  }, []);

  useEffect(() => {
    // Operatörleri arama terimlerine göre filtrele
    let filtered = [...dummyTourOperators];
    
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((operator: any) => 
        operator.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        operator.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        operator.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        operator.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredOperators(filtered);
  }, [searchTerm, selectedCategory]);

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
              Güvenilir <span className="text-blue-300">Tur Operatörleri</span> ile<br />Hayallerinize Yolculuk
            </h1>
            
            <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
              Türkiye'nin en profesyonel ve sertifikalı tur operatörleri ile unutulmaz seyahat deneyimleri yaşayın.
            </p>
            
            {/* Arama Kutusu */}
            <div className="max-w-2xl mx-auto mb-8 relative z-10">
              <div className="flex flex-col sm:flex-row bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="flex-grow relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Tur operatörü ara..."
                    className="w-full py-4 pl-12 pr-4 text-gray-800 focus:outline-none focus:ring-0 border-0"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all duration-200 sm:w-auto w-full">
                  <Search className="w-5 h-5 inline mr-2" />
                  <span>Ara</span>
                </button>
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
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className={`bg-gradient-to-r ${stat.color} rounded-xl p-3 w-14 h-14 flex items-center justify-center mb-4`}>
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Kategori Filtreleme */}
      <section className="container mx-auto px-4 mt-12">
        <div className="flex overflow-x-auto space-x-2 pb-2 -mx-4 px-4 scrollbar-hide">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id === "all" ? null : category.id)}
              className={`flex-none px-5 py-2.5 rounded-full text-sm font-medium ${
                (category.id === "all" && !selectedCategory) || selectedCategory === category.id
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              } transition-colors border border-transparent whitespace-nowrap`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      {/* Ana İçerik */}
      <main className="container mx-auto px-4 mt-8 pb-20">
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
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
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
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Logo */}
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 rounded-xl overflow-hidden shadow-md border border-gray-100 bg-white relative">
                          {operator.logo ? (
                            <Image
                              src={operator.logo}
                              alt={operator.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-gray-50">
                              <Building className="w-10 h-10 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* İçerik */}
                      <div className="flex-1">
                        <div className="mb-4">
                          <div className="flex items-start justify-between">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {operator.name}
                            </h3>
                            <div className="flex -space-x-1 ml-2">
                              <Award className="h-5 w-5 text-blue-500" />
                              {operatorTours.length > 5 && (
                                <Star className="h-5 w-5 text-amber-500" />
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
                            <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Lisanslı
                            </span>
                            <span className="inline-flex items-center px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                              <Users className="w-3 h-3 mr-1" />
                              {operatorTours.length} Tur
                            </span>
                            <span className="inline-flex items-center px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">
                              <Globe className="w-3 h-3 mr-1" />
                              Uluslararası
                            </span>
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
                                <h5 className="font-medium text-gray-900 mb-1">{tour.name}</h5>
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
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Operatörün lisans ve sertifikalarını kontrol edin</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Müşteri yorumlarını ve değerlendirmelerini inceleyin</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Sundukları hizmetlerin kapsamını araştırın</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Fiyat-performans dengesini değerlendirin</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Acil durum politikalarını ve iptal koşullarını öğrenin</span>
                  </li>
                </ul>
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
        </section>
      </main>
    </div>
  );
}
