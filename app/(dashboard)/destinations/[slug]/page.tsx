"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Star, 
  ChevronRight,
  ArrowLeft
} from "lucide-react";
import { dummyTours } from "@/app/lib/dummy-data";
import { parseJsonString } from "@/app/utils/format";

interface Tour {
  id: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  discount?: number;
  startDate?: Date;
  endDate?: Date;
  maxParticipants?: number;
  currentParticipants?: number;
  departureCity?: string;
  region?: string;
  transportation?: string;
  period?: string;
  destinations: string;
  inclusions: string;
  exclusions: string;
  itinerary?: string;
  images: string;
  features: string;
  rating?: number;
  reviews?: number;
  featured: boolean;
  isJointTour?: boolean;
  createdAt: Date;
  updatedAt: Date;
  tourOperatorId: string;
}

const destinations = {
  istanbul: {
    name: "İstanbul",
    description: "İki kıtayı birleştiren, binlerce yıllık tarihi ve kültürel mirasıyla dünyanın en özel şehirlerinden biri.",
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800&auto=format&fit=crop",
    highlights: [
      "Ayasofya ve Sultanahmet Camii",
      "Topkapı Sarayı",
      "Kapalıçarşı",
      "Boğaz Turu",
      "Galata Kulesi"
    ]
  },
  kapadokya: {
    name: "Kapadokya",
    description: "Peri bacaları, balon turları ve yeraltı şehirleriyle ünlü, eşsiz bir doğa harikası.",
    image: "https://images.unsplash.com/photo-1586611292717-f828b167408c?q=80&w=800&auto=format&fit=crop",
    highlights: [
      "Peri Bacaları",
      "Balon Turları",
      "Yeraltı Şehirleri",
      "Ihlara Vadisi",
      "Göreme Açık Hava Müzesi"
    ]
  },
  antalya: {
    name: "Antalya",
    description: "Türkiye'nin en popüler tatil destinasyonu, mavi bayraklı plajları ve antik kentleriyle ünlü.",
    image: "https://images.unsplash.com/photo-1591804374401-9f6a7d0e0b1a?q=80&w=800&auto=format&fit=crop",
    highlights: [
      "Kaleiçi",
      "Düden Şelalesi",
      "Perge Antik Kenti",
      "Aspendos Tiyatrosu",
      "Konyaaltı Plajı"
    ]
  },
  pamukkale: {
    name: "Pamukkale",
    description: "Beyaz travertenleri ve termal sularıyla dünyaca ünlü doğal miras.",
    image: "https://images.unsplash.com/photo-1586611292717-f828b167408c?q=80&w=800&auto=format&fit=crop",
    highlights: [
      "Travertenler",
      "Hierapolis Antik Kenti",
      "Kleopatra Havuzu",
      "Antik Havuz",
      "Arkeoloji Müzesi"
    ]
  },
  efes: {
    name: "Efes",
    description: "Antik dünyanın en önemli şehirlerinden biri, Celsus Kütüphanesi ve Artemis Tapınağı ile ünlü.",
    image: "https://images.unsplash.com/photo-1586611292717-f828b167408c?q=80&w=800&auto=format&fit=crop",
    highlights: [
      "Celsus Kütüphanesi",
      "Artemis Tapınağı",
      "Büyük Tiyatro",
      "Yamaç Evler",
      "Hadrian Tapınağı"
    ]
  },
  karadeniz: {
    name: "Karadeniz",
    description: "Yeşilin her tonunu barındıran, yaylaları ve doğal güzellikleriyle ünlü bölge.",
    image: "https://images.unsplash.com/photo-1586611292717-f828b167408c?q=80&w=800&auto=format&fit=crop",
    highlights: [
      "Uzungöl",
      "Ayder Yaylası",
      "Sümela Manastırı",
      "Trabzon Kalesi",
      "Karadeniz Mutfağı"
    ]
  }
};

export default function DestinationPage() {
  const params = useParams();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  const destination = destinations[params.slug as keyof typeof destinations];
  
  useEffect(() => {
    // API isteği simülasyonu
    setTimeout(() => {
      const filteredTours = dummyTours.filter(tour => {
        // Destinasyonları doğru şekilde parse et
        const rawDestinations = parseJsonString<any[]>(tour.destinations, []);
        const tourDestinations = rawDestinations.map(dest => {
          if (typeof dest === 'string') return dest;
          if (typeof dest === 'object' && dest.city) return dest.city;
          return '';
        }).filter(dest => dest !== '');
        
        return tourDestinations.some(dest => {
          const destLower = dest.toLowerCase();
          const destinationNameLower = destination.name.toLowerCase();
          
          // Temel eşleşme kontrolü
          if (destLower.includes(destinationNameLower)) {
            return true;
          }
          
          // Destinasyona özel eşleşmeler
          switch (destination.name) {
            case "İstanbul":
              return destLower.includes("boğaz") || 
                     destLower.includes("kız kulesi") || 
                     destLower.includes("ortaköy") ||
                     destLower.includes("sultanahmet") ||
                     destLower.includes("ayasofya") ||
                     destLower.includes("topkapı");
            case "Kapadokya":
              return destLower.includes("göreme") || 
                     destLower.includes("uçhisar") || 
                     destLower.includes("avanos") ||
                     destLower.includes("peri bacaları") ||
                     destLower.includes("yeraltı şehri");
            case "Antalya":
              return destLower.includes("kaleiçi") || 
                     destLower.includes("düden") || 
                     destLower.includes("perge") ||
                     destLower.includes("aspendos") ||
                     destLower.includes("konyaaltı");
            case "Pamukkale":
              return destLower.includes("hierapolis") || 
                     destLower.includes("kleopatra") || 
                     destLower.includes("traverten");
            case "Efes":
              return destLower.includes("celsus") || 
                     destLower.includes("artemis") || 
                     destLower.includes("meryem ana") ||
                     destLower.includes("şirince");
            case "Karadeniz":
              return destLower.includes("uzungöl") || 
                     destLower.includes("ayder") || 
                     destLower.includes("sümela") ||
                     destLower.includes("trabzon") ||
                     destLower.includes("rize");
            default:
              return false;
          }
        });
      });
      setTours(filteredTours);
      setLoading(false);
    }, 1000);
  }, [destination.name]);

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Destinasyon bulunamadı</h1>
          <Link 
            href="/tours"
            className="text-blue-600 hover:text-blue-800 inline-flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Turlara dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Bölümü */}
      <div className="relative h-96">
        <div className="absolute inset-0">
          <Image
            src={destination.image}
            alt={destination.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>
        <div className="container mx-auto px-4 relative h-full flex flex-col justify-end pb-12">
          <div className="max-w-3xl">
            <Link 
              href="/tours"
              className="inline-flex items-center text-white/90 hover:text-white mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Turlara dön
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {destination.name}
            </h1>
            <p className="text-lg text-white/90">
              {destination.description}
            </p>
          </div>
        </div>
      </div>

      {/* Öne Çıkanlar */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Öne Çıkanlar</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {destination.highlights.map((highlight, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-sm font-medium text-gray-900">{highlight}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Turlar */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {destination.name} Turları
        </h2>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        ) : tours.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="mx-auto w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <MapPin className="w-10 h-10 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {destination.name} için tur bulunamadı
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Bu destinasyon için henüz tur bulunmuyor. Lütfen daha sonra tekrar kontrol edin.
            </p>
            <Link
              href="/tours"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg inline-flex items-center transition-colors"
            >
              Tüm turları gör
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour) => {
              const tourImages = parseJsonString<string[]>(tour.images, []);
              
              // Destinasyonları doğru şekilde parse et
              const rawDestinations = parseJsonString<any[]>(tour.destinations, []);
              const destinations = rawDestinations.map(dest => {
                if (typeof dest === 'string') return dest;
                if (typeof dest === 'object' && dest.city) return dest.city;
                return '';
              }).filter(dest => dest !== '');
              
              const remainingSpots = (tour.maxParticipants || 0) - (tour.currentParticipants || 0);
              const startDate = new Date(tour.startDate || new Date());
              const discountedPrice = tour.discount 
                ? tour.price * (1 - (tour.discount || 0) / 100) 
                : tour.price;
              
              return (
                <div 
                  key={tour.id} 
                  className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-lg transition-all duration-300 flex flex-col transform hover:-translate-y-1"
                >
                  <div className="relative h-64 overflow-hidden">
                    <div className="relative w-full h-full">
                      <Image
                        src={tourImages[0] || 'https://placehold.co/800x600/e5e7eb/6b7280?text=Tur'}
                        alt={tour.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        priority={true}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    
                    {/* Tur Durumu Etiketleri */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      {tour.discount && tour.discount > 0 && (
                        <div className="bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-lg shadow-md animate-pulse">
                          %{tour.discount} İndirim
                        </div>
                      )}
                      {remainingSpots <= 5 && remainingSpots > 0 && (
                        <div className="bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-lg shadow-md">
                          Son {remainingSpots} yer
                        </div>
                      )}
                      {remainingSpots === 0 && (
                        <div className="bg-gray-600 text-white text-xs font-semibold px-3 py-1 rounded-lg shadow-md">
                          Dolu
                        </div>
                      )}
                    </div>
                    
                    {/* Destinasyon Bilgisi */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center text-white/90 text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="truncate">{destinations.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-grow flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {tour.name}
                    </h3>
                    
                    {/* En Önemli 4 Bilgi */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Tarih</div>
                          <div className="text-sm font-medium">
                            {startDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mr-3">
                          <Clock className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Süre</div>
                          <div className="text-sm font-medium">{tour.duration} gün</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mr-3">
                          <Users className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Kalan Yer</div>
                          <div className="text-sm font-medium">{remainingSpots} kişi</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mr-3">
                          <Star className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Puan</div>
                          <div className="text-sm font-medium">4.8/5 (128)</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <div>
                        {tour.discount && tour.discount > 0 && (
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
        )}
      </div>
    </div>
  );
} 