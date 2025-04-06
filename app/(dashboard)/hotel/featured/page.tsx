import React from 'react';
import { Hotel, FeatureIconInfo } from '@/types/hotel';
import HotelList from '../components/HotelList';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Clock, Users, Calendar } from 'lucide-react';

// Örnek veri - Gerçek uygulamada bu veriler API'den gelecek
const featuredHotels: Hotel[] = [
  {
    id: 1,
    name: "Lüks Resort & Spa",
    location: "Antalya",
    stars: 5,
    rating: 4.8,
    reviewCount: 1245,
    price: 2500,
    discount: 15,
    image: "https://images.unsplash.com/photo-1520250497591-112f8f6ca0b3",
    features: ["Havuz", "Spa", "Restoran", "Bar"],
    breakfast: true,
    description: "Deniz manzaralı lüks otel",
    checkIn: "14:00",
    checkOut: "12:00",
    cancellationPolicy: "Ücretsiz iptal",
    roomTypes: ["Standart Oda", "Deluxe Oda", "Suit Oda"],
    nearbyAttractions: ["Kaleiçi", "Düden Şelalesi", "Aquarium"],
    coordinates: { lat: 36.8841, lng: 30.7056 }
  },
  {
    id: 2,
    name: "Grand Palace Hotel",
    location: "İstanbul",
    stars: 5,
    rating: 4.9,
    reviewCount: 2156,
    price: 3200,
    discount: 20,
    image: "https://images.unsplash.com/photo-1520250497591-112f8f6ca0b3",
    features: ["Havuz", "Spa", "Restoran", "Bar", "Fitness"],
    breakfast: true,
    description: "Boğaz manzaralı lüks otel",
    checkIn: "15:00",
    checkOut: "12:00",
    cancellationPolicy: "Ücretsiz iptal",
    roomTypes: ["Standart Oda", "Deluxe Oda", "Suit Oda", "Presidential Suite"],
    nearbyAttractions: ["Taksim", "Galata Kulesi", "İstiklal Caddesi"],
    coordinates: { lat: 41.0082, lng: 28.9784 }
  },
  {
    id: 3,
    name: "Beach Resort",
    location: "Bodrum",
    stars: 4,
    rating: 4.6,
    reviewCount: 987,
    price: 1800,
    discount: 10,
    image: "https://images.unsplash.com/photo-1520250497591-112f8f6ca0b3",
    features: ["Havuz", "Restoran", "Bar", "Çocuk Kulübü"],
    breakfast: true,
    description: "Deniz kenarında aile oteli",
    checkIn: "14:00",
    checkOut: "12:00",
    cancellationPolicy: "Ücretsiz iptal",
    roomTypes: ["Standart Oda", "Aile Odası", "Suit Oda"],
    nearbyAttractions: ["Bodrum Kalesi", "Bodrum Marina", "Bodrum Çarşısı"],
    coordinates: { lat: 37.0344, lng: 27.4305 }
  },
  {
    id: 4,
    name: "Mountain View Hotel",
    location: "Bursa",
    stars: 4,
    rating: 4.5,
    reviewCount: 756,
    price: 1500,
    discount: 5,
    image: "https://images.unsplash.com/photo-1520250497591-112f8f6ca0b3",
    features: ["Spa", "Restoran", "Bar", "Kayak Merkezi"],
    breakfast: true,
    description: "Uludağ manzaralı kış oteli",
    checkIn: "14:00",
    checkOut: "12:00",
    cancellationPolicy: "Ücretsiz iptal",
    roomTypes: ["Standart Oda", "Deluxe Oda", "Suit Oda"],
    nearbyAttractions: ["Uludağ Kayak Merkezi", "Teleferik", "Bursa Merkez"],
    coordinates: { lat: 40.1825, lng:29.0670 }
  },
  {
    id: 5,
    name: "Historic Inn",
    location: "İzmir",
    stars: 3,
    rating: 4.3,
    reviewCount: 543,
    price: 1200,
    discount: 0,
    image: "https://images.unsplash.com/photo-1520250497591-112f8f6ca0b3",
    features: ["Restoran", "Bar", "WiFi"],
    breakfast: true,
    description: "Tarihi bölgede butik otel",
    checkIn: "14:00",
    checkOut: "12:00",
    cancellationPolicy: "Ücretsiz iptal",
    roomTypes: ["Standart Oda", "Deluxe Oda"],
    nearbyAttractions: ["Konak Meydanı", "Kemeraltı", "Alsancak"],
    coordinates: { lat: 38.4192, lng: 27.1287 }
  },
  {
    id: 6,
    name: "Seaside Resort",
    location: "Muğla",
    stars: 5,
    rating: 4.7,
    reviewCount: 876,
    price: 2800,
    discount: 12,
    image: "https://images.unsplash.com/photo-1520250497591-112f8f6ca0b3",
    features: ["Havuz", "Spa", "Restoran", "Bar", "Plaj"],
    breakfast: true,
    description: "Özel plajlı lüks resort",
    checkIn: "14:00",
    checkOut: "12:00",
    cancellationPolicy: "Ücretsiz iptal",
    roomTypes: ["Standart Oda", "Deluxe Oda", "Suit Oda", "Villa"],
    nearbyAttractions: ["Ölüdeniz", "Butterfly Valley", "Fethiye Merkez"],
    coordinates: { lat: 36.6538, lng: 29.1270 }
  },
  {
    id: 7,
    name: "City Center Hotel",
    location: "Ankara",
    stars: 4,
    rating: 4.4,
    reviewCount: 654,
    price: 1600,
    discount: 8,
    image: "https://images.unsplash.com/photo-1520250497591-112f8f6ca0b3",
    features: ["Restoran", "Bar", "Fitness", "Toplantı Salonu"],
    breakfast: true,
    description: "Şehir merkezinde iş oteli",
    checkIn: "14:00",
    checkOut: "12:00",
    cancellationPolicy: "Ücretsiz iptal",
    roomTypes: ["Standart Oda", "Deluxe Oda", "Suit Oda"],
    nearbyAttractions: ["Kızılay", "Tunalı", "Anıtkabir"],
    coordinates: { lat: 39.9334, lng: 32.8597 }
  },
  {
    id: 8,
    name: "Golf Resort",
    location: "Belek",
    stars: 5,
    rating: 4.9,
    reviewCount: 1123,
    price: 3000,
    discount: 15,
    image: "https://images.unsplash.com/photo-1520250497591-112f8f6ca0b3",
    features: ["Golf Sahası", "Havuz", "Spa", "Restoran", "Bar"],
    breakfast: true,
    description: "Golf sahalı lüks resort",
    checkIn: "14:00",
    checkOut: "12:00",
    cancellationPolicy: "Ücretsiz iptal",
    roomTypes: ["Standart Oda", "Deluxe Oda", "Suit Oda", "Villa"],
    nearbyAttractions: ["Golf Sahaları", "Belek Plajı", "Antalya Merkez"],
    coordinates: { lat: 36.8625, lng: 31.0556 }
  },
  {
    id: 9,
    name: "Thermal Spa Hotel",
    location: "Pamukkale",
    stars: 4,
    rating: 4.6,
    reviewCount: 789,
    price: 1400,
    discount: 5,
    image: "https://images.unsplash.com/photo-1520250497591-112f8f6ca0b3",
    features: ["Termal Havuz", "Spa", "Restoran", "Bar"],
    breakfast: true,
    description: "Termal su kaynaklı spa oteli",
    checkIn: "14:00",
    checkOut: "12:00",
    cancellationPolicy: "Ücretsiz iptal",
    roomTypes: ["Standart Oda", "Deluxe Oda", "Suit Oda"],
    nearbyAttractions: ["Pamukkale Travertenleri", "Hierapolis", "Karahayıt"],
    coordinates: { lat: 37.9167, lng: 29.1167 }
  },
  {
    id: 10,
    name: "Boutique Hotel",
    location: "Kapadokya",
    stars: 4,
    rating: 4.8,
    reviewCount: 945,
    price: 2200,
    discount: 10,
    image: "https://images.unsplash.com/photo-1520250497591-112f8f6ca0b3",
    features: ["Restoran", "Bar", "Balon Turları"],
    breakfast: true,
    description: "Mağara odalı butik otel",
    checkIn: "14:00",
    checkOut: "12:00",
    cancellationPolicy: "Ücretsiz iptal",
    roomTypes: ["Mağara Odası", "Deluxe Oda", "Suit Oda"],
    nearbyAttractions: ["Göreme", "Uçhisar Kalesi", "Avanos"],
    coordinates: { lat: 38.6431, lng: 34.8288 }
  }
];

const featureIcons: FeatureIconInfo[] = [
  { name: "Havuz", icon: "🏊" },
  { name: "Spa", icon: "💆" },
  { name: "Restoran", icon: "🍽️" },
  { name: "Bar", icon: "🍹" },
  { name: "Otopark", icon: "🚗" },
  { name: "WiFi", icon: "📶" },
  { name: "Fitness", icon: "💪" },
  { name: "Çocuk Kulübü", icon: "👶" }
];

export default function FeaturedHotelsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/hotel"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Öne Çıkan Oteller</h1>
            </div>
            <p className="text-sm text-gray-500">
              {featuredHotels.length} otel listeleniyor
            </p>
          </div>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              En Çok Tercih Edilen Otellerimiz
            </h2>
            <p className="text-gray-600">
              Müşterilerimizin en çok beğendiği ve tercih ettiği otelleri keşfedin.
              Her bütçeye ve zevke uygun seçenekler sunuyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredHotels.map((hotel) => (
              <div 
                key={hotel.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300 flex flex-col"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={hotel.image}
                    alt={hotel.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {hotel.discount > 0 && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-lg shadow-md">
                      %{hotel.discount} İndirim
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center text-white/90 text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="truncate">{hotel.location}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {hotel.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      <div className="flex items-center bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md text-sm font-medium">
                        <Star className="h-3.5 w-3.5 text-blue-500 mr-1 fill-blue-500" />
                        <span>{hotel.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="inline-flex items-center bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-medium">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      {new Date().toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="inline-flex items-center bg-green-50 text-green-700 px-2.5 py-1 rounded-md text-xs font-medium">
                      <Users className="h-3.5 w-3.5 mr-1" />
                      {hotel.roomTypes.length} Oda Tipi
                    </div>
                    <div className="inline-flex items-center bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md text-xs font-medium">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      {hotel.cancellationPolicy}
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-center justify-between">
                      <div>
                        {hotel.discount > 0 && (
                          <span className="text-gray-500 text-sm line-through mr-2">
                            ₺{hotel.price.toLocaleString()}
                          </span>
                        )}
                        <span className="text-xl font-bold text-blue-600">
                          ₺{(hotel.price * (1 - hotel.discount / 100)).toLocaleString()}
                        </span>
                        <span className="text-gray-500 text-sm">/gece</span>
                      </div>
                      <Link
                        href={`/hotel/${hotel.id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors inline-flex items-center"
                      >
                        İncele
                        <ArrowLeftIcon className="h-4 w-4 ml-1 transform rotate-180" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 