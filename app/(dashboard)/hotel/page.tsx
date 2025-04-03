import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';
import { 
  BuildingOfficeIcon, 
  ChevronDownIcon,
  ArrowUpRightIcon,
  ShieldCheckIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { prisma } from '@/lib/prisma';
import HotelFilters from './components/HotelFilters';
import HotelCard from './components/HotelCard';
import SearchBar from './components/SearchBar';

// Otel ve ilgili tipler için arayüzler
interface Hotel {
  id: string;
  name: string;
  description: string;
  location: string;
  rating: number;
  reviewCount: number;
  price: number;
  oldPrice: number;
  discount: number;
  image: string;
  features: string[];
  isBestSeller?: boolean;
  stars: number;
}

interface FeatureIconInfo {
  feature: string;
  iconType: string;
}

// Şehir seçenekleri
const cities = [
  { id: 'all', label: 'Tüm Şehirler', count: 120 },
  { id: 'istanbul', label: 'İstanbul', count: 42 },
  { id: 'antalya', label: 'Antalya', count: 28 },
  { id: 'mugla', label: 'Muğla', count: 18 },
  { id: 'izmir', label: 'İzmir', count: 15 },
  { id: 'nevsehir', label: 'Nevşehir', count: 9 },
  { id: 'sakarya', label: 'Sakarya', count: 8 },
];

// Fiyat aralıkları
const priceRanges = [
  { id: 'all', label: 'Tüm Fiyatlar' },
  { id: 'low', label: '₺0 - ₺1000' },
  { id: 'medium', label: '₺1000 - ₺2000' },
  { id: 'high', label: '₺2000 - ₺3000' },
  { id: 'luxury', label: '₺3000+' },
];

// Sıralama seçenekleri
const sortOptions = [
  { id: 'popular', label: 'En Popüler' },
  { id: 'price-low', label: 'Fiyat (Düşükten Yükseğe)' },
  { id: 'price-high', label: 'Fiyat (Yüksekten Düşüğe)' },
  { id: 'rating', label: 'Puan (En Yüksek)' },
  { id: 'discount', label: 'İndirim Oranı' },
];

// Özellik filtreleri için ikonlar
const featureFilters = [
  { id: 'wifi', label: 'Ücretsiz Wi-Fi', icon: 'wifi' },
  { id: 'pool', label: 'Havuz', icon: 'pool' },
  { id: 'breakfast', label: 'Kahvaltı Dahil', icon: 'breakfast' },
  { id: 'spa', label: 'Spa', icon: 'spa' },
  { id: 'sea-view', label: 'Deniz Manzaralı', icon: 'sea-view' },
  { id: 'all-inclusive', label: 'Her Şey Dahil', icon: 'all-inclusive' },
  { id: 'kids-friendly', label: 'Çocuk Dostu', icon: 'kids-friendly' },
  { id: 'bar', label: 'Bar', icon: 'bar' },
];

// Popüler filtreler
const popularFilters = [
  { id: 'discount', label: 'İndirimli Oteller', icon: 'discount' },
  { id: 'bestseller', label: 'En Çok Satanlar', icon: 'bestseller' },
  { id: 'new', label: 'Yeni Eklenenler', icon: 'new' },
  { id: 'sea-view', label: 'Deniz Manzaralı', icon: 'sea-view' },
];

// Popüler destinasyonlar
const popularDestinations = [
  { 
    name: 'İstanbul', 
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3540&q=80',
    hotels: 42
  },
  { 
    name: 'Antalya', 
    image: 'https://images.unsplash.com/photo-1688282109227-a207922ae045?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    hotels: 28
  },
  { 
    name: 'Bodrum', 
    image: 'https://images.unsplash.com/photo-1679856564958-13669a1a1dbe?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    hotels: 18
  }
];

// Özellik ikonları için yardımcı fonksiyon
const getFeatureIcon = (feature: string) => {
  const featureLower = feature.toLowerCase();
  
  if (featureLower.includes('deniz') || featureLower.includes('manzara')) {
    return 'sea-view';
  } else if (featureLower.includes('wifi') || featureLower.includes('internet') || featureLower.includes('wi-fi')) {
    return 'wifi';
  } else if (featureLower.includes('havuz')) {
    return 'pool';
  } else if (featureLower.includes('spa') || featureLower.includes('masaj')) {
    return 'spa';
  } else if (featureLower.includes('restoran') || featureLower.includes('kahvaltı') || featureLower.includes('yemek')) {
    return 'breakfast';
  } else if (featureLower.includes('tv') || featureLower.includes('televizyon')) {
    return 'tv';
  } else if (featureLower.includes('teras') || featureLower.includes('balkon')) {
    return 'balcony';
  } else if (featureLower.includes('klima') || featureLower.includes('ısıtma')) {
    return 'climate';
  } else if (featureLower.includes('ücretsiz') || featureLower.includes('bedava')) {
    if (featureLower.includes('wifi') || featureLower.includes('wi-fi') || featureLower.includes('internet')) {
      return 'wifi';
    }
    return 'free';
  } else if (featureLower.includes('bar')) {
    return 'bar';
  } else if (featureLower.includes('çocuk') || featureLower.includes('cocuk')) {
    return 'kids-friendly';
  } else if (featureLower.includes('spor') || featureLower.includes('salon')) {
    return 'gym';
  } else if (featureLower.includes('marina')) {
    return 'marina';
  } else if (featureLower.includes('her şey') || featureLower.includes('her sey') || featureLower.includes('dahil')) {
    return 'all-inclusive';
  } else if (featureLower.includes('aquapark') || featureLower.includes('su park')) {
    return 'aquapark';
  } else {
    return 'default';
  }
};

// Özellik ikonları listesi
const featureIcons = [
  { feature: 'Ücretsiz Wi-Fi', iconType: 'wifi' },
  { feature: 'Havuz', iconType: 'pool' },
  { feature: 'Spa', iconType: 'spa' },
  { feature: 'Deniz Manzaralı', iconType: 'sea-view' },
  { feature: 'Her Şey Dahil', iconType: 'all-inclusive' },
  { feature: 'Çocuk Dostu', iconType: 'kids-friendly' },
  { feature: 'Bar', iconType: 'bar' },
  { feature: 'Kahvaltı Dahil', iconType: 'breakfast' },
  { feature: 'Fitness Merkezi', iconType: 'gym' },
  { feature: 'Marina Manzaralı', iconType: 'marina' },
  { feature: 'Aquapark', iconType: 'aquapark' },
  { feature: 'Balon Turu', iconType: 'balloon' },
  { feature: 'Mağara Oda', iconType: 'cave' }
];

// Dummy otel verileri
const dummyHotels: Hotel[] = [
  {
    id: '1',
    name: 'Grand Hotel Istanbul',
    description: 'Boğaz manzaralı lüks otel',
    location: 'İstanbul, Türkiye',
    rating: 4.8,
    reviewCount: 128,
    price: 2500,
    oldPrice: 3000,
    discount: 17,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    features: ['Ücretsiz Wi-Fi', 'Havuz', 'Spa', 'Deniz Manzaralı', 'Her Şey Dahil'],
    isBestSeller: true,
    stars: 5
  },
  {
    id: '2',
    name: 'Blue Paradise Resort',
    description: 'Muhteşem deniz manzaralı tatil cenneti',
    location: 'Antalya, Türkiye',
    rating: 4.6,
    reviewCount: 95,
    price: 1800,
    oldPrice: 2200,
    discount: 18,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    features: ['Ücretsiz Wi-Fi', 'Havuz', 'Aquapark', 'Deniz Manzaralı', 'Her Şey Dahil'],
    isBestSeller: true,
    stars: 5
  },
  {
    id: '3',
    name: 'Bodrum Beach Hotel',
    description: 'Ege\'nin incisi Bodrum\'da lüks konaklama',
    location: 'Bodrum, Türkiye',
    rating: 4.7,
    reviewCount: 76,
    price: 2100,
    oldPrice: 2600,
    discount: 19,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2080&q=80',
    features: ['Ücretsiz Wi-Fi', 'Havuz', 'Spa', 'Deniz Manzaralı', 'Bar'],
    isBestSeller: false,
    stars: 4
  },
  {
    id: '4',
    name: 'Cappadocia Cave Hotel',
    description: 'Peri bacaları manzaralı mağara otel',
    location: 'Nevşehir, Türkiye',
    rating: 4.9,
    reviewCount: 112,
    price: 1500,
    oldPrice: 1800,
    discount: 17,
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2025&q=80',
    features: ['Ücretsiz Wi-Fi', 'Spa', 'Balon Turu', 'Mağara Oda', 'Kahvaltı Dahil'],
    isBestSeller: true,
    stars: 5
  },
  {
    id: '5',
    name: 'Izmir Marina Hotel',
    description: 'Marina manzaralı modern otel',
    location: 'İzmir, Türkiye',
    rating: 4.5,
    reviewCount: 84,
    price: 1200,
    oldPrice: 1500,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2089&q=80',
    features: ['Ücretsiz Wi-Fi', 'Havuz', 'Marina Manzaralı', 'Bar', 'Fitness Merkezi'],
    isBestSeller: false,
    stars: 4
  }
];

// Veritabanından otelleri getir
async function getHotels(): Promise<Hotel[]> {
  try {
    const hotels = await prisma.hotel.findMany({
      include: {
        rooms: {
          orderBy: {
            price: 'asc'
          },
          take: 1
        },
        reviews: {
          include: {
            user: true
          }
        }
      }
    });

    return hotels.map((hotel: any) => {
      // Ortalama puanı hesapla
      const avgRating = hotel.reviews.length 
        ? hotel.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / hotel.reviews.length 
        : 0;
      
      // Özellikleri parse et
      let amenities: string[] = [];
      try {
        if (typeof hotel.amenities === 'string') {
          const parsedAmenities = JSON.parse(hotel.amenities as string);
          if (typeof parsedAmenities === 'object' && !Array.isArray(parsedAmenities)) {
            amenities = Object.keys(parsedAmenities).filter(key => parsedAmenities[key]);
          } else if (Array.isArray(parsedAmenities)) {
            amenities = parsedAmenities;
          }
        } else if (typeof hotel.amenities === 'object') {
          if (Array.isArray(hotel.amenities)) {
            amenities = hotel.amenities as string[];
          } else {
            const amenitiesObj = hotel.amenities as Record<string, boolean>;
            amenities = Object.keys(amenitiesObj).filter(key => amenitiesObj[key]);
          }
        }
      } catch (error) {
        console.error('Amenities parsing error:', error);
      }

      // Resimleri parse et
      let images: string[] = [];
      try {
        if (typeof hotel.images === 'string') {
          const parsedImages = JSON.parse(hotel.images as string);
          if (Array.isArray(parsedImages)) {
            images = parsedImages;
          }
        } else if (Array.isArray(hotel.images)) {
          images = hotel.images as string[];
        }
      } catch (error) {
        console.error('Images parsing error:', error);
      }

      // En düşük oda fiyatını al
      const lowestPrice = hotel.rooms.length > 0 ? hotel.rooms[0].price : 0;
      
      // Rastgele indirim (gerçek uygulamada bu veritabanından gelir)
      const discount = Math.floor(Math.random() * 30) + 5; // %5 ile %35 arası
      const oldPrice = Math.round(lowestPrice * (1 + discount / 100));

      return {
        id: hotel.id,
        name: hotel.name,
        description: hotel.description || '',
        location: `${hotel.city || ''}, ${hotel.country || ''}`,
        rating: parseFloat(avgRating.toFixed(1)),
        reviewCount: hotel.reviews.length,
        price: lowestPrice,
        oldPrice: oldPrice,
        discount: discount,
        image: images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
        features: amenities.slice(0, 5),
        isBestSeller: hotel.reviews.length > 10,
        stars: hotel.stars || 3
      };
    });
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return [];
  }
}

export const metadata: Metadata = {
  title: 'Oteller | TourTech',
  description: 'Türkiye\'nin en iyi otellerini keşfedin ve rezervasyon yapın.',
};

export default async function HotelsPage() {
  const hotels = dummyHotels;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px]">
        <Image
          src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Hotel Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Hayalinizdeki Tatili Keşfedin</h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              Türkiye'nin en iyi otellerinde unutulmaz bir konaklama deneyimi yaşayın
            </p>
          </div>
        </div>
      </div>

      {/* Arama ve Filtreleme Kartı */}
      <div className="max-w-7xl mx-auto px-4 -mt-6 sm:-mt-8 md:-mt-12 mb-12 relative z-10">
        <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 border border-gray-100">
          <SearchBar cities={cities} />
        </div>
      </div>

      {/* Avantajlar */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/hotel/guarantee" className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm text-center md:text-left flex flex-col md:flex-row items-center md:items-start gap-4 hover:shadow-md transition-shadow">
            <div className="bg-blue-100 p-3 rounded-full">
              <ShieldCheckIcon className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">En İyi Fiyat Garantisi</h3>
              <p className="text-sm text-gray-600">Daha uygun bir fiyat bulursanız, farkı iade ediyoruz.</p>
            </div>
          </Link>
          <Link href="/hotel/cancellation" className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm text-center md:text-left flex flex-col md:flex-row items-center md:items-start gap-4 hover:shadow-md transition-shadow">
            <div className="bg-blue-100 p-3 rounded-full">
              <CreditCardIcon className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Ücretsiz İptal</h3>
              <p className="text-sm text-gray-600">Çoğu rezervasyonda ücretsiz iptal seçeneği sunuyoruz.</p>
            </div>
          </Link>
          <Link href="/hotel/about" className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm text-center md:text-left flex flex-col md:flex-row items-center md:items-start gap-4 hover:shadow-md transition-shadow">
            <div className="bg-blue-100 p-3 rounded-full">
              <BuildingOfficeIcon className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">10.000+ Otel</h3>
              <p className="text-sm text-gray-600">Türkiye'nin ve dünyanın en iyi otellerini sunuyoruz.</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Popüler Destinasyonlar */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Popüler Destinasyonlar</h2>
          <Link href="/hotel/destinations" className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1">
            Tümünü Gör
            <ArrowUpRightIcon className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {popularDestinations.map((destination) => (
            <Link href={`/hotel/destinations/${destination.name.toLowerCase()}`} key={destination.name} className="group relative h-64 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <Image
                src={destination.image}
                alt={destination.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{destination.name}</h3>
                <p className="text-sm text-white/90">{destination.hotels} otel</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Otel Listesi */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Öne Çıkan Oteller</h2>
          <Link href="/hotel/all" className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1">
            Tümünü Gör
            <ArrowUpRightIcon className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} featureIcons={featureIcons} />
          ))}
        </div>
      </div>

      {/* Alt Bilgi Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">TourTech ile Tatil Fırsatlarını Kaçırmayın</h2>
          <p className="text-sm sm:text-base text-blue-100 mb-8 max-w-2xl mx-auto">
            En iyi fiyat garantisi ve ödüllü müşteri hizmetlerimizle unutulmaz bir tatil deneyimi yaşayın.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
            <Link href="/hotel/offers" className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg flex-1">
              Özel Teklifleri Keşfedin
            </Link>
            <Link href="/hotel/help" className="bg-transparent text-white border border-white hover:bg-white/10 px-6 py-3 rounded-lg font-semibold transition-colors flex-1">
              Yardım Alın
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
