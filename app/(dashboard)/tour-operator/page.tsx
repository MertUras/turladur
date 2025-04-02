"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { dummyTourOperators, dummyTours } from "@/app/lib/dummy-data";
import { MapPin, ChevronRight, Building, Users, CheckCircle, Award, Phone, Mail, Globe } from "lucide-react";

export default function TourOperatorsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // API isteği simülasyonu
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Hero Bölümü */}
      <div className="relative h-[300px] md:h-[400px] bg-blue-700">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-600 opacity-90"></div>
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="text-center max-w-4xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Güvenilir Tur Operatörleri ile Keşfedin
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8">
              Türkiye'nin en profesyonel tur operatörleri ile unutulmaz seyahat deneyimleri yaşayın.
            </p>
            <Link 
              href="#operators" 
              className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition-all inline-flex items-center"
            >
              Tur Operatörlerini Görüntüle
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="#f9fafb" fillOpacity="1" d="M0,64L80,96C160,128,320,192,480,192C640,192,800,128,960,117.3C1120,107,1280,149,1360,170.7L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="container mx-auto px-4 -mt-10 relative z-10" id="operators">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Tur Operatörleri</h2>
              <p className="text-gray-600 mt-2">
                Türkiye'nin önde gelen tur operatörlerini keşfedin
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center text-sm text-blue-600">
              <span>{dummyTourOperators.length} tur operatörü listeleniyor</span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {dummyTourOperators.map((operator: any) => {
                // Tur operatörüne ait turları bul
                const operatorTours = dummyTours.filter(
                  (tour: any) => tour.tourOperatorId === operator.id
                );

                return (
                  <div 
                    key={operator.id} 
                    className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <div className="rounded-lg overflow-hidden bg-gray-100 w-full md:w-32 h-32 flex-shrink-0 relative">
                          {operator.logo ? (
                            <Image
                              src={operator.logo}
                              alt={operator.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Building className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {operator.name}
                          </h3>
                          <div className="flex items-center text-gray-600 mb-3">
                            <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                            <span>{operator.city}, {operator.country}</span>
                          </div>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {operator.description || "Bu tur operatörü hakkında henüz detaylı bilgi bulunmamaktadır."}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Lisanslı Operatör
                            </span>
                            <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                              <Award className="w-3 h-3 mr-1" />
                              Profesyonel Rehberler
                            </span>
                            <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                              <Users className="w-3 h-3 mr-1" />
                              {operatorTours.length} Aktif Tur
                            </span>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-3">
                            <Link 
                              href={`/tour-operator/${operator.id}`}
                              className="inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Detayları Görüntüle
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Link>
                            <a 
                              href={`tel:${operator.phone}`}
                              className="inline-flex items-center justify-center border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <Phone className="w-4 h-4 mr-2" />
                              Ara
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {operatorTours.length > 0 && (
                      <div className="border-t border-gray-200 bg-gray-50 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">Popüler Turlar</h4>
                          <Link href={`/tour-operator/${operator.id}#tours`} className="text-sm text-blue-600 hover:underline">
                            Tümünü Gör
                          </Link>
                        </div>
                        <div className="space-y-2">
                          {operatorTours.slice(0, 2).map((tour: any) => (
                            <Link 
                              key={tour.id} 
                              href={`/tour/${tour.id}`}
                              className="block p-3 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h5 className="font-medium text-gray-900">{tour.name}</h5>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {tour.duration} Gün | {tour.destinations ? JSON.parse(tour.destinations).join(", ") : ""}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <div className="font-semibold text-blue-600">
                                    {tour.discount && tour.discount > 0 
                                      ? (tour.price - (tour.price * tour.discount / 100)) 
                                      : tour.price} ₺
                                  </div>
                                  {tour.discount && tour.discount > 0 && (
                                    <div className="text-xs text-gray-500 line-through">{tour.price} ₺</div>
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
        </div>
        
        {/* Bilgi Bölümü */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tur Operatörleri Hakkında</h2>
          <div className="prose prose-blue max-w-none">
            <p>
              Tur operatörleri, seyahat ürünlerini planlayan, düzenleyen ve sunan profesyonel şirketlerdir. 
              TourTech platformunda listelenen tüm tur operatörleri, güvenilirlik, kalite ve müşteri memnuniyeti 
              açısından titizlikle değerlendirilmektedir.
            </p>
            <p>
              Bir tur operatörü seçerken dikkat etmeniz gereken hususlar:
            </p>
            <ul>
              <li>Operatörün lisans ve sertifikalarını kontrol edin</li>
              <li>Müşteri yorumlarını ve değerlendirmelerini inceleyin</li>
              <li>Sundukları hizmetlerin kapsamını araştırın</li>
              <li>Fiyat-performans dengesini değerlendirin</li>
              <li>Acil durum politikalarını ve iptal koşullarını öğrenin</li>
            </ul>
            <p>
              TourTech olarak, platformumuzda yer alan tüm tur operatörlerinin belirtilen hizmetleri en yüksek 
              standartlarda sunmasını sağlamak için düzenli denetimler yapmaktayız.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
