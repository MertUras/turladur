'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  StarIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  WifiIcon,
  SparklesIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarIcon,
  UserGroupIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  UserIcon,
  Square2StackIcon,
  ChevronDownIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { StarIcon as SolidStarIcon } from '@heroicons/react/24/solid';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

// Dummy otel verileri
const dummyHotels = [
  {
    id: '1',
    name: 'Lüks Resort & Spa',
    shortDescription: 'Deniz manzaralı lüks otel',
    location: 'Antalya, Türkiye',
    coordinates: { lat: 36.8841, lng: 30.7056 }, // Antalya koordinatları
    rating: 4.8,
    reviewCount: 1245,
    price: 2500,
    oldPrice: 3000,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1520250497591-112f8f6ca0b3',
    features: ['Havuz', 'Spa', 'Restoran', 'Bar'],
    isBestSeller: true,
    stars: 5,
        images: [
      'https://images.unsplash.com/photo-1520250497591-112f8f6ca0b3',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd'
    ],
    description: `Lüks Resort & Spa, Antalya'nın en gözde bölgesinde, deniz manzarasına hakim, lüks ve konforu bir araya getiren 5 yıldızlı bir oteldir. Modern mimarisi ve geleneksel Türk misafirperverliğini harmanlayan otelimiz, şehrin merkezinde konumlanmıştır.

    Özellikler:
    • Deniz manzaralı odalar
    • 24 saat oda servisi
    • Spa ve wellness merkezi
    • Açık ve kapalı yüzme havuzları
    • Dünya mutfaklarından lezzetler sunan restoranlar
    • Toplantı ve etkinlik salonları
    • Fitness merkezi
    • Ücretsiz Wi-Fi
    • Valet park hizmeti`,
    amenities: {
      wifi: true,
      pool: true,
      spa: true,
      restaurant: true,
      gym: true,
      parking: true,
      roomService: true,
      concierge: true,
      laundry: true,
      businessCenter: true
    },
    nearbyPlaces: {
      airport: { name: 'Antalya Havalimanı', distance: '15 km', time: '20 dk' },
      cityCenter: { name: 'Antalya Merkez', distance: '8 km', time: '15 dk' },
      attractions: [
        { name: 'Düden Şelalesi', distance: '5 km', time: '10 dk' },
        { name: 'Kaleiçi', distance: '7 km', time: '12 dk' },
        { name: 'Lara Plajı', distance: '2 km', time: '5 dk' }
      ],
      transport: {
        shuttle: true,
        taxi: true,
        bus: true,
        metro: false
      }
    },
    services: {
      reception: { available: true, hours: '24 saat' },
      roomService: { available: true, hours: '07:00 - 23:00' },
      laundry: { available: true, hours: '09:00 - 18:00', price: '₺50/çamaşır' },
      parking: { available: true, type: 'Valet', price: '₺100/gün' },
      wifi: { available: true, speed: '100 Mbps', coverage: 'Tüm otel' }
    },
    dining: {
      breakfast: { hours: '07:00 - 11:00', type: 'Açık Büfe' },
      restaurants: [
        { name: 'Akdeniz Restoran', type: 'A la carte', hours: '12:00 - 23:00' },
        { name: 'Pool Bar', type: 'Snack', hours: '10:00 - 18:00' }
      ],
      specialDiets: ['Vejetaryen', 'Vegan', 'Glutensiz']
    },
    spa: {
      services: [
        { name: 'Masaj', duration: '60 dk', price: '₺500' },
        { name: 'Hamam', duration: '45 dk', price: '₺300' }
      ],
      hours: '09:00 - 21:00',
      facilities: ['Sauna', 'Buhar Odası', 'Jakuzi']
    },
    meetings: {
      rooms: [
        { name: 'Toplantı Salonu A', capacity: 50, price: '₺1000/saat' },
        { name: 'Toplantı Salonu B', capacity: 100, price: '₺2000/saat' }
      ],
      equipment: ['Projeksiyon', 'WiFi', 'Flipchart'],
      catering: true
    },
    children: {
      club: { available: true, hours: '10:00 - 18:00', age: '4-12' },
      activities: ['Oyun Odası', 'Havuz', 'Animasyon'],
      babysitting: { available: true, price: '₺100/saat' },
      menu: true
    },
    specialRequests: {
      accessibility: true,
      pets: { allowed: false },
      smoking: { areas: ['Teras', 'Bar'] },
      specialDiets: true
    },
    policies: {
      cancellation: {
        freeUntil: '48 saat öncesi',
        lateFee: '1 gecelik ücret'
      },
      earlyCheckout: '₺500',
      roomChange: 'Ücretsiz (müsaitlik durumuna göre)',
      guarantee: 'Kredi kartı gereklidir'
    },
    reviews: {
      total: 1245,
      average: 4.8,
      distribution: {
        5: 65,
        4: 25,
        3: 7,
        2: 2,
        1: 1
      },
      recent: [
        {
          user: 'Ahmet Y.',
          rating: 5,
          date: '2024-03-15',
          comment: 'Harika bir deneyimdi. Özellikle spa hizmetleri çok iyiydi.',
          photos: ['url1', 'url2']
        }
      ]
    },
    packages: [
      {
        name: 'Erken Rezervasyon',
        discount: 20,
        conditions: '3 ay öncesi rezervasyon'
      },
      {
        name: 'Balayı Paketi',
        includes: ['Romantik akşam yemeği', 'Spa seansı', 'Oda süsleme'],
        price: '₺3500'
      }
    ]
  },
  {
    id: '2',
    name: 'Grand Palace Hotel',
    shortDescription: 'Boğaz manzaralı lüks otel',
    location: 'İstanbul, Türkiye',
    coordinates: { lat: 41.0082, lng: 28.9784 }, // İstanbul koordinatları
    rating: 4.9,
    reviewCount: 2156,
    price: 3200,
    oldPrice: 4000,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1520250497591-112f8f6ca0b3',
    features: ['Havuz', 'Spa', 'Restoran', 'Bar', 'Fitness'],
    isBestSeller: true,
    stars: 5,
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f8f6ca0b3',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd'
    ],
    description: `Grand Palace Hotel, İstanbul Boğazı'nın muhteşem manzarasına hakim, lüks ve konforu bir araya getiren 5 yıldızlı bir oteldir. Modern mimarisi ve geleneksel Türk misafirperverliğini harmanlayan otelimiz, şehrin merkezinde konumlanmıştır.

    Özellikler:
    • Boğaz manzaralı odalar
    • 24 saat oda servisi
    • Spa ve wellness merkezi
    • Açık ve kapalı yüzme havuzları
    • Dünya mutfaklarından lezzetler sunan restoranlar
    • Toplantı ve etkinlik salonları
    • Fitness merkezi
    • Ücretsiz Wi-Fi
    • Valet park hizmeti`,
    amenities: {
      wifi: true,
      pool: true,
      spa: true,
      restaurant: true,
      gym: true,
      parking: true,
      roomService: true,
      concierge: true,
      laundry: true,
      businessCenter: true
    }
  },
  {
    id: '3',
    name: 'Beach Resort',
    shortDescription: 'Deniz kenarında aile oteli',
    location: 'Bodrum, Türkiye',
    coordinates: { lat: 37.0344, lng: 27.4305 }, // Bodrum koordinatları
    rating: 4.6,
    reviewCount: 987,
    price: 1800,
    oldPrice: 2000,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1520250497591-112f8f6ca0b3',
    features: ['Havuz', 'Restoran', 'Bar', 'Çocuk Kulübü'],
    isBestSeller: true,
    stars: 4,
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f8f6ca0b3',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd'
    ],
    description: `Beach Resort, Bodrum'un en gözde plajında, deniz kenarında konumlanmış, aileler için ideal bir 4 yıldızlı oteldir. Modern mimarisi ve sıcak atmosferiyle misafirlerine unutulmaz bir tatil deneyimi sunar.

    Özellikler:
    • Deniz manzaralı odalar
    • 24 saat oda servisi
    • Çocuk kulübü
    • Açık ve kapalı yüzme havuzları
    • Restoran ve bar
    • Animasyon programı
    • Fitness merkezi
    • Ücretsiz Wi-Fi
    • Otopark`,
    amenities: {
      wifi: true,
      pool: true,
      restaurant: true,
      gym: true,
      parking: true,
      roomService: true,
      concierge: true,
      laundry: true,
      kidsClub: true
    }
  }
];

interface RoomType {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  size: number;
  features: string[];
  images: string[];
  rating: number;
  reviewCount: number;
  reviews: Review[];
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  roomType?: string;
}

const reviews: Review[] = [
  {
    id: '1',
    userName: 'Ahmet Y.',
    rating: 4.5,
    date: '2024-03-15',
    comment: 'Harika bir deneyimdi. Özellikle deniz manzarası muhteşemdi.',
    roomType: 'Standard Oda'
  },
  {
    id: '2',
    userName: 'Ayşe K.',
    rating: 5,
    date: '2024-03-10',
    comment: 'Personel çok ilgiliydi, odalar tertemiz ve konforluydu.',
    roomType: 'Deluxe Oda'
  },
  {
    id: '3',
    userName: 'Mehmet S.',
    rating: 4,
    date: '2024-03-05',
    comment: 'Kahvaltı çeşitleri zengin, havuz alanı çok güzeldi.',
    roomType: 'Suite Oda'
  }
];

const roomTypes: RoomType[] = [
  {
    id: '1',
    name: 'Standart Oda',
    description: 'Boğaz manzaralı, modern dekorasyonlu standart oda',
    price: 2500,
    capacity: 2,
    size: 30,
    features: ['Ücretsiz Wi-Fi', 'TV', 'Minibar', 'Klima', 'Balkon', 'King Boy Yatak'],
        images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    ],
    rating: 4.2,
    reviewCount: 45,
    reviews: reviews.filter(r => r.roomType === 'Standard Oda')
  },
  {
    id: '2',
    name: 'Deluxe Oda',
    description: 'Geniş ve lüks dekorasyonlu deluxe oda',
    price: 3500,
    capacity: 2,
    size: 40,
    features: ['Ücretsiz Wi-Fi', 'TV', 'Minibar', 'Klima', 'Balkon', 'Jakuzi', 'Oturma Alanı', 'Queen Boy Yatak', 'Tek Kişilik Yatak'],
    images: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    ],
    rating: 4.5,
    reviewCount: 32,
    reviews: reviews.filter(r => r.roomType === 'Deluxe Oda')
  },
  {
    id: '3',
    name: 'Suite Oda',
    description: 'Oturma alanı ve jakuzi içeren suite oda',
    price: 5000,
    capacity: 2,
    size: 60,
    features: ['Ücretsiz Wi-Fi', 'TV', 'Minibar', 'Klima', 'Balkon', 'Jakuzi', 'Oturma Alanı', 'Bar', 'Deniz Manzarası', 'King Boy Yatak', 'Çift Kişilik Yatak'],
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    ],
    rating: 4.8,
    reviewCount: 28,
    reviews: reviews.filter(r => r.roomType === 'Suite Oda')
  }
];

interface ReservationFormData {
  name: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  message: string;
  selectedRoom: string;
  roomCount: number;
  adults: number;
  children: number;
  infants: number;
}

// Fiyat formatlaması için yardımcı fonksiyon
const formatPrice = (price: number): string => {
  return `₺${price.toFixed(2)}`;
};

// Yatak sayısı kontrolü için yardımcı fonksiyon
const getBedCount = (features: string[]): number => {
  const bedFeatures = features.filter(f => 
    f.toLowerCase().includes('yatak') || 
    f.toLowerCase().includes('king') || 
    f.toLowerCase().includes('queen') ||
    f.toLowerCase().includes('çift kişilik')
  );
  return bedFeatures.length;
};

// Modal bileşeni için interface
interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: typeof dummyHotels[0];
  formData: ReservationFormData;
  setFormData: React.Dispatch<React.SetStateAction<ReservationFormData>>;
  handleSubmit: (e: React.FormEvent) => void;
  calculateTotalPrice: () => number;
  selectedRoomType: RoomType | null;
}

// Modal bileşeni
const BookingModal = ({ 
  isOpen, 
  onClose, 
  hotel, 
  formData, 
  setFormData, 
  handleSubmit,
  calculateTotalPrice,
  selectedRoomType
}: BookingModalProps) => {
  if (!isOpen) return null;

  const price = selectedRoomType ? selectedRoomType.price : hotel.price;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        
        <h2 className="text-xl font-bold text-gray-900 mb-6">Rezervasyon Yap</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form içeriği */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giriş Tarihi
              </label>
              <input
                type="date"
                value={formData.checkIn}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => {
                  const newDate = e.target.value;
                  setFormData(prev => ({
                    ...prev,
                    checkIn: newDate,
                    checkOut: prev.checkOut && new Date(prev.checkOut) <= new Date(newDate) ? 
                      new Date(new Date(newDate).getTime() + 86400000).toISOString().split('T')[0] : 
                      prev.checkOut
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Çıkış Tarihi
              </label>
              <input
                type="date"
                value={formData.checkOut}
                min={formData.checkIn ? new Date(new Date(formData.checkIn).getTime() + 86400000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, checkOut: e.target.value }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Misafir Sayısı
              </label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-500">Yetişkin</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.adults}
                    onChange={(e) => setFormData(prev => ({ ...prev, adults: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500">Çocuk</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.children}
                    onChange={(e) => setFormData(prev => ({ ...prev, children: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500">Bebek</label>
                  <input
                    type="number"
                    min="0"
                    max="2"
                    value={formData.infants}
                    onChange={(e) => setFormData(prev => ({ ...prev, infants: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Fiyat Özeti */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Gecelik</span>
              <span className="text-lg font-semibold text-gray-900">₺{price}</span>
            </div>
            {formData.checkIn && formData.checkOut && (
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Toplam Gece</span>
                <span>{Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 60 * 60 * 24))} gece</span>
              </div>
            )}
            <div className="border-t border-gray-200 mt-2 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-base font-medium text-gray-900">Toplam</span>
                <span className="text-xl font-bold text-blue-600">₺{calculateTotalPrice()}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Rezervasyon Yap
          </button>
        </form>
      </div>
    </div>
  );
};

// Ana bileşen içinde
export default function HotelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const hotel = dummyHotels.find(h => h.id === resolvedParams.id);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(null);
  const [showRoomDetails, setShowRoomDetails] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const [selectedRoomImages, setSelectedRoomImages] = useState<string[]>([]);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const guestPickerRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<ReservationFormData>({
    name: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    message: '',
    selectedRoom: '',
    roomCount: 1,
    adults: 2,
    children: 0,
    infants: 0
  });

  // Oda filtreleme ve sıralama için state'ler
  const [sortBy, setSortBy] = useState<'recommended' | 'price_asc' | 'price_desc'>('recommended');
  const [filterBy, setFilterBy] = useState<'all' | '1_bed' | '2_bed' | '3_plus_bed'>('all');

  // Filtrelenmiş ve sıralanmış odaları hesapla
  const getFilteredAndSortedRooms = () => {
    let filtered = [...roomTypes];

    // Filtreleme
    if (filterBy !== 'all') {
      filtered = filtered.filter(room => {
        const bedCount = getBedCount(room.features);
        switch (filterBy) {
          case '1_bed': return bedCount === 1;
          case '2_bed': return bedCount === 2;
          case '3_plus_bed': return bedCount >= 3;
          default: return true;
        }
      });
    }

    // Sıralama
    switch (sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'recommended':
      default:
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }

    return filtered;
  };

  // Tarih kontrolü için yardımcı fonksiyon
  const isValidDateRange = (checkIn: string, checkOut: string): boolean => {
    if (!checkIn || !checkOut) return false;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return start < end && start >= new Date();
  };

  // Rezervasyon form handler'ı güncellendi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.selectedRoom) {
      alert('Lütfen bir oda tipi seçin');
      return;
    }

    if (!isValidDateRange(formData.checkIn, formData.checkOut)) {
      alert('Lütfen geçerli bir tarih aralığı seçin');
      return;
    }

    try {
      console.log('Rezervasyon formu gönderildi:', formData);
      setReservationSuccess(true);
      
      setTimeout(() => {
        setShowReservationModal(false);
        setReservationSuccess(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          checkIn: '',
          checkOut: '',
          guests: 1,
          message: '',
          selectedRoom: '',
          roomCount: 1,
          adults: 2,
          children: 0,
          infants: 0
        });
      }, 3000);
    } catch (error) {
      console.error('Rezervasyon hatası:', error);
      alert('Rezervasyon yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const calculateTotalPrice = () => {
    if (!formData.checkIn || !formData.checkOut || !selectedRoomType) return 0;
    
    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return selectedRoomType.price * nights * formData.roomCount;
  };

  // Dışarı tıklandığında popup'ları kapatmak için useEffect ekleyelim
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
      if (guestPickerRef.current && !guestPickerRef.current.contains(event.target as Node)) {
        setShowGuestPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const mapContainerStyle = {
    width: '100%',
    height: '400px'
  };

  const center = hotel?.coordinates || { lat: 41.0082, lng: 28.9784 };

  if (!hotel) {
  return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Otel Bulunamadı</h1>
          <Link href="/hotel" className="text-blue-600 hover:text-blue-800">
            Otellere Dön
            </Link>
          </div>
        </div>
    );
  }

  // Sabit buton
  const FloatingBookButton = () => {
    const price = selectedRoomType ? selectedRoomType.price : hotel.price;
    
    return (
      <button
        onClick={() => setShowReservationModal(true)}
        className="fixed bottom-6 left-6 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40 flex items-center gap-2"
      >
        <span className="font-semibold">₺{price}</span>
        <span className="text-sm">/ gece</span>
        <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Rezervasyon Yap</span>
      </button>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Üst Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/hotel" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
              <ArrowLeftIcon className="w-5 h-5" />
              Otellere Dön
            </Link>
            <div className="flex items-center gap-4">
              <button className="text-gray-600 hover:text-gray-900">
                <CalendarIcon className="w-5 h-5" />
              </button>
              <button className="text-gray-600 hover:text-gray-900">
                <UserGroupIcon className="w-5 h-5" />
              </button>
          </div>
          </div>
        </div>
              </div>
              
      {/* Otel Başlık */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">{hotel.name}</h1>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPinIcon className="w-5 h-5" />
              <span className="text-base">{hotel.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
                <div className="flex items-center">
                  {[...Array(hotel.stars)].map((_, i) => (
                <SolidStarIcon key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
            <span className="text-base text-gray-600">({hotel.reviewCount} değerlendirme)</span>
                    </div>
                  </div>
              </div>

      {/* Otel Görselleri */}
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            className="relative h-[450px] rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => {
              setSelectedRoomImages(hotel.images);
              setCurrentImageIndex(0);
              setSelectedRoomType(null);
              setShowImagePopup(true);
            }}
          >
            <Image
              src={hotel.images[0]}
              alt={hotel.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {hotel.images.slice(1).map((image, index) => (
              <div 
                key={index} 
                className="relative h-[215px] rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => {
                  setSelectedRoomImages(hotel.images);
                  setCurrentImageIndex(index + 1);
                  setSelectedRoomType(null);
                  setShowImagePopup(true);
                }}
              >
                <Image
                  src={image}
                  alt={`${hotel.name} - Görsel ${index + 2}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Otel Detayları */}
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Taraf - Detaylar */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Otel Hakkında</h2>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed whitespace-pre-line">{hotel.description}</p>
              </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Özellikler</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {Object.entries(hotel.amenities).map(([key, value]) => (
                  value && (
                    <div key={key} className="flex items-center gap-3 text-base text-gray-600">
                      <SparklesIcon className="w-6 h-6 text-blue-500" />
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </div>
                  )
                ))}
              </div>
                      </div>

            {/* Yakın Yerler ve Ulaşım */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Yakın Yerler ve Ulaşım</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-700">Havaalanı</h3>
                  <p className="text-base text-gray-600">
                    {hotel?.nearbyPlaces?.airport?.name} - {hotel?.nearbyPlaces?.airport?.distance} ({hotel?.nearbyPlaces?.airport?.time})
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-700">Şehir Merkezi</h3>
                  <p className="text-base text-gray-600">
                    {hotel?.nearbyPlaces?.cityCenter?.name} - {hotel?.nearbyPlaces?.cityCenter?.distance} ({hotel?.nearbyPlaces?.cityCenter?.time})
                  </p>
                </div>
                <div className="col-span-2">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Yakındaki Turistik Yerler</h3>
                  <div className="space-y-3">
                    {hotel?.nearbyPlaces?.attractions?.map((attraction, index) => (
                      <p key={index} className="text-base text-gray-600">
                        {attraction.name} - {attraction.distance} ({attraction.time})
                      </p>
                    ))}
                  </div>
                </div>
                <div className="col-span-2">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Ulaşım Seçenekleri</h3>
                  <div className="flex gap-6">
                    {hotel?.nearbyPlaces?.transport?.shuttle && (
                      <span className="text-base text-gray-600">Servis</span>
                    )}
                    {hotel?.nearbyPlaces?.transport?.taxi && (
                      <span className="text-base text-gray-600">Taksi</span>
                    )}
                    {hotel?.nearbyPlaces?.transport?.bus && (
                      <span className="text-base text-gray-600">Otobüs</span>
                    )}
                    {hotel?.nearbyPlaces?.transport?.metro && (
                      <span className="text-base text-gray-600">Metro</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Otel Hizmetleri */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Otel Hizmetleri</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-700">Resepsiyon</h3>
                  <p className="text-base text-gray-600">{hotel?.services?.reception?.hours}</p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-700">Oda Servisi</h3>
                  <p className="text-base text-gray-600">{hotel?.services?.roomService?.hours}</p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-700">Çamaşırhane</h3>
                  <p className="text-base text-gray-600">{hotel?.services?.laundry?.hours} - {hotel?.services?.laundry?.price}</p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-700">Otopark</h3>
                  <p className="text-base text-gray-600">{hotel?.services?.parking?.type} - {hotel?.services?.parking?.price}</p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-700">Wi-Fi</h3>
                  <p className="text-base text-gray-600">{hotel?.services?.wifi?.speed} - {hotel?.services?.wifi?.coverage}</p>
                </div>
              </div>
            </div>

            {/* Restoran ve Bar */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Restoran ve Bar</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Kahvaltı</h3>
                  <p className="text-base text-gray-600">{hotel?.dining?.breakfast?.hours} - {hotel?.dining?.breakfast?.type}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Restoranlar</h3>
                  <div className="space-y-4">
                    {hotel?.dining?.restaurants?.map((restaurant, index) => (
                      <div key={index} className="text-base text-gray-600">
                        <p className="font-semibold">{restaurant.name}</p>
                        <p>{restaurant.type} - {restaurant.hours}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Özel Diyet Seçenekleri</h3>
                  <div className="flex gap-3 mt-2">
                    {hotel?.dining?.specialDiets?.map((diet, index) => (
                      <span key={index} className="text-base text-gray-600">{diet}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Spa ve Wellness */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Spa ve Wellness</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Hizmetler</h3>
                  <div className="space-y-4">
                    {hotel?.spa?.services?.map((service, index) => (
                      <div key={index} className="text-base text-gray-600">
                        <p className="font-semibold">{service.name}</p>
                        <p>{service.duration} - {service.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Çalışma Saatleri</h3>
                  <p className="text-base text-gray-600">{hotel?.spa?.hours}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Tesisler</h3>
                  <div className="flex gap-3 mt-2">
                    {hotel?.spa?.facilities?.map((facility, index) => (
                      <span key={index} className="text-base text-gray-600">{facility}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Toplantı ve Etkinlik Alanları */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Toplantı ve Etkinlik Alanları</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Salonlar</h3>
                  <div className="space-y-4">
                    {hotel?.meetings?.rooms?.map((room, index) => (
                      <div key={index} className="text-base text-gray-600">
                        <p className="font-semibold">{room.name}</p>
                        <p>Kapasite: {room.capacity} kişi - {room.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Teknik Ekipman</h3>
                  <div className="flex gap-3 mt-2">
                    {hotel?.meetings?.equipment?.map((item, index) => (
                      <span key={index} className="text-sm text-gray-600">{item}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Catering</h3>
                  <p className="text-sm text-gray-600">{hotel?.meetings?.catering ? 'Mevcut' : 'Mevcut Değil'}</p>
                </div>
              </div>
            </div>

            {/* Çocuk Hizmetleri */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Çocuk Hizmetleri</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-700">Çocuk Kulübü</h3>
                  <p className="text-sm text-gray-600">
                    {hotel?.children?.club?.hours} ({hotel?.children?.club?.age} yaş)
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-700">Bebek Bakıcılığı</h3>
                  <p className="text-sm text-gray-600">{hotel?.children?.babysitting?.price}</p>
                </div>
                <div className="col-span-2">
                  <h3 className="font-medium text-gray-700 mb-2">Aktiviteler</h3>
                  <div className="flex gap-2">
                    {hotel?.children?.activities?.map((activity, index) => (
                      <span key={index} className="text-sm text-gray-600">{activity}</span>
                    ))}
                  </div>
                </div>
                <div className="col-span-2">
                  <h3 className="font-medium text-gray-700">Çocuk Menüsü</h3>
                  <p className="text-sm text-gray-600">{hotel?.children?.menu ? 'Mevcut' : 'Mevcut Değil'}</p>
                </div>
              </div>
            </div>

            {/* Özel İstekler */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Özel İstekler</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-700">Engelli Erişimi</h3>
                  <p className="text-sm text-gray-600">{hotel?.specialRequests?.accessibility ? 'Mevcut' : 'Mevcut Değil'}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-700">Evcil Hayvan</h3>
                  <p className="text-sm text-gray-600">{hotel?.specialRequests?.pets?.allowed ? 'İzin Veriliyor' : 'İzin Verilmiyor'}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-700">Sigara İçme Alanları</h3>
                  <div className="flex gap-2">
                    {hotel?.specialRequests?.smoking?.areas?.map((area, index) => (
                      <span key={index} className="text-sm text-gray-600">{area}</span>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-700">Özel Diyetler</h3>
                  <p className="text-sm text-gray-600">{hotel?.specialRequests?.specialDiets ? 'Mevcut' : 'Mevcut Değil'}</p>
                </div>
              </div>
            </div>

            {/* İptal ve Değişiklik Politikaları */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">İptal ve Değişiklik Politikaları</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700">İptal Politikası</h3>
                  <p className="text-sm text-gray-600">
                    Ücretsiz iptal: {hotel?.policies?.cancellation?.freeUntil}<br />
                    Geç iptal ücreti: {hotel?.policies?.cancellation?.lateFee}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Erken Çıkış Ücreti</h3>
                  <p className="text-sm text-gray-600">{hotel?.policies?.earlyCheckout}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Oda Değişikliği</h3>
                  <p className="text-sm text-gray-600">{hotel?.policies?.roomChange}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Rezervasyon Garantisi</h3>
                  <p className="text-sm text-gray-600">{hotel?.policies?.guarantee}</p>
                </div>
              </div>
            </div>

            {/* Müşteri Yorumları */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Müşteri Yorumları</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-blue-600">{hotel?.reviews?.average}</p>
                    <p className="text-sm text-gray-600">{hotel?.reviews?.total} yorum</p>
                  </div>
                  <div className="flex-1">
                    {Object.entries(hotel?.reviews?.distribution || {}).map(([rating, percentage]) => (
                      <div key={rating} className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-600">{rating} yıldız</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-full bg-blue-600 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  {hotel?.reviews?.recent?.map((review, index) => (
                    <div key={index} className="border-t pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900">{review.user}</p>
                          <p className="text-sm text-gray-600">{review.date}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <SolidStarIcon className="w-5 h-5 text-yellow-400" />
                          <span className="text-gray-900">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                      {review.photos && review.photos.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {review.photos.map((photo, photoIndex) => {
                            try {
                              new URL(photo);
                              return (
                                <Image
                                  key={photoIndex}
                                  src={photo}
                                  alt="Yorum fotoğrafı"
                                  width={100}
                                  height={100}
                                  className="rounded-lg"
                                />
                              );
                            } catch (e) {
                              return null;
                            }
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Özel Teklifler ve Paketler */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Özel Teklifler ve Paketler</h2>
              <div className="space-y-4">
                {hotel?.packages?.map((pkg, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">{pkg.name}</h3>
                    {pkg.discount && (
                      <p className="text-sm text-gray-600">%{pkg.discount} indirim - {pkg.conditions}</p>
                    )}
                    {pkg.includes && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700">Dahil Olanlar:</p>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {pkg.includes.map((item, itemIndex) => (
                            <li key={itemIndex}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {pkg.price && (
                      <p className="mt-2 text-sm font-medium text-gray-900">{pkg.price}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Harita */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Konum</h2>
              <div className="relative h-[400px] rounded-lg overflow-hidden">
                <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={15}
                  >
                    <Marker position={center} />
                  </GoogleMap>
                </LoadScript>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                <MapPinIcon className="w-5 h-5" />
                <span>{hotel?.location}</span>
              </div>
                      </div>

            {/* Oda Tipleri */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Oda Tipleri</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Sıralama:</span>
                    <select 
                      className="border rounded-md px-2 py-1 text-sm"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    >
                      <option value="recommended">Önerilen</option>
                      <option value="price_asc">Fiyat (Düşükten Yükseğe)</option>
                      <option value="price_desc">Fiyat (Yüksekten Düşüğe)</option>
                    </select>
                    </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Filtrele:</span>
                    <select 
                      className="border rounded-md px-2 py-1 text-sm"
                      value={filterBy}
                      onChange={(e) => setFilterBy(e.target.value as typeof filterBy)}
                    >
                      <option value="all">Tüm Odalar</option>
                      <option value="1_bed">1 Yatak</option>
                      <option value="2_bed">2 Yatak</option>
                      <option value="3_plus_bed">3+ Yatak</option>
                    </select>
                  </div>
              </div>
              </div>

              <div className="space-y-6">
                {getFilteredAndSortedRooms().map((room) => (
                  <div key={room.id} className="border rounded-lg overflow-hidden">
                    <div className="grid grid-cols-12 gap-6">
                      {/* Oda Görseli */}
                      <div className="col-span-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div 
                            className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer"
                            onClick={() => {
                              setSelectedRoomImages(room.images);
                              setCurrentImageIndex(0);
                              setSelectedRoomType(room);
                              setShowImagePopup(true);
                            }}
                          >
                            <Image
                              src={room.images[0]}
                              alt={`${room.name} - Ana Görsel`}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            {room.images.slice(1).map((image, index) => (
                              <div 
                                key={index} 
                                className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer"
                                onClick={() => {
                                  setSelectedRoomImages(room.images);
                                  setCurrentImageIndex(index + 1);
                                  setSelectedRoomType(room);
                                  setShowImagePopup(true);
                                }}
                              >
                                <Image
                                  src={image}
                                  alt={`${room.name} - ${index === 0 ? 'Yatak Odası' : index === 1 ? 'Banyo' : index === 2 ? 'Oturma Alanı' : 'Balkon'} Görseli`}
                                  fill
                                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Oda Detayları */}
                      <div className="col-span-5 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <SolidStarIcon
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(room.rating)
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">{room.rating.toFixed(1)}</span>
                            <span className="text-sm text-gray-500">({room.reviewCount} yorum)</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                      <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <UserIcon className="w-4 h-4" />
                              <span>{room.capacity} Kişilik</span>
                      </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Square2StackIcon className="w-4 h-4" />
                              <span>{room.size}m²</span>
                    </div>
                          </div>
                          <p className="text-sm text-gray-600">{room.description}</p>
                          <div className="space-y-1">
                            {room.features.map((feature, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                                <span>{feature}</span>
                              </div>
                ))}
              </div>
                          </div>
                      </div>

                      {/* Fiyat ve Rezervasyon */}
                      <div className="col-span-3 bg-gray-50 p-4 flex flex-col justify-between">
                          <div>
                          <div className="text-right mb-2">
                            <div className="text-sm text-gray-500 line-through">{formatPrice(room.price * 1.1)}</div>
                            <div className="text-2xl font-bold text-gray-900">{formatPrice(room.price)}</div>
                            <div className="text-sm text-gray-500">gecelik</div>
                                </div>
                          <div className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full text-center mb-2">
                            %10 indirim
                                </div>
                          <div className="text-sm text-gray-600 text-center">
                            vergiler ve ücretler dahil
                                </div>
                        </div>
                        <div>
                          <button
                            onClick={() => {
                              setFormData({ ...formData, selectedRoom: room.id });
                              setSelectedRoomType(room);
                              // Rezervasyon modalını açmak yerine yan taraftaki formu güncelle
                              const element = document.querySelector('.sticky');
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth' });
                              }
                            }}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                          >
                            Rezervasyon Yap
                          </button>
                          <div className="text-xs text-gray-500 text-center mt-2">
                            Henüz ödeme alınmayacak
                          </div>
                        </div>
                      </div>
                            </div>
                            
                    {/* İptal Politikası ve Ekstralar */}
                    <div className="border-t px-4 py-3 bg-gray-50">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 mb-1">İptal Politikası</div>
                          <div className="text-sm text-gray-600">15 Nis tarihinden önce ücretsiz iptal</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 mb-1">Ekstralar</div>
                          <div className="text-sm text-gray-600">2 Kişilik Kahvaltı Dahil</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-sm text-gray-500 text-center">
                {getFilteredAndSortedRooms().length}/{roomTypes.length} oda gösteriliyor
                              </div>
            </div>
                          </div>

          {/* Sağ Taraf - Rezervasyon */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                            <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl sm:text-3xl font-bold text-gray-900">₺{hotel.price}</span>
                    <span className="text-lg sm:text-xl text-gray-500 line-through">₺{hotel.oldPrice}</span>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      %{hotel.discount} İndirim
                              </span>
                    </div>
                  <p className="text-sm text-gray-500 mt-1">gece başına</p>
                </div>
                            </div>
                            
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                  <ShieldCheckIcon className="w-5 h-5 text-blue-500" />
                  <span>En İyi Fiyat Garantisi</span>
                          </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                  <CreditCardIcon className="w-5 h-5 text-blue-500" />
                  <span>Ücretsiz İptal</span>
                        </div>
                      </div>
                        
              <div className="border-t border-gray-100 pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Oda Seçimi */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Oda Tipi
                    </label>
                    <div className="space-y-3">
                      {getFilteredAndSortedRooms().map((room) => (
                        <div
                          key={room.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                            formData.selectedRoom === room.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                          onClick={() => {
                            setFormData({ ...formData, selectedRoom: room.id });
                            setSelectedRoomType(room);
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-900">{room.name}</h3>
                              <p className="text-sm text-gray-600">{room.description}</p>
                            </div>
                            <span className="font-semibold text-gray-900">₺{room.price}</span>
                          </div>
                          <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <UserIcon className="w-4 h-4" />
                              <span>{room.capacity} Kişilik</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Square2StackIcon className="w-4 h-4" />
                              <span>{room.size}m²</span>
                            </div>
                    </div>
                  </div>
                ))}
              </div>
                </div>
                
                  {/* Arama Alanları */}
                  <div className="flex flex-col gap-4 mb-8">
                    {/* Konum Seçimi */}
                    <div className="relative">
                      <div className="flex items-center border rounded-lg hover:border-blue-300 bg-white cursor-pointer">
                        <div className="flex-1 p-3">
                          <div className="text-xs text-gray-500 font-medium">Nereye?</div>
                          <div className="text-gray-900 mt-0.5">Bodrum, Muğla, Türkiye</div>
                    </div>
                        <div className="px-3 border-l">
                          <MapPinIcon className="w-5 h-5 text-gray-400" />
                        </div>
                </div>
              </div>

                    {/* Tarih Seçimi */}
                    <div className="relative" ref={datePickerRef}>
                      <div 
                        className="flex items-center border rounded-lg hover:border-blue-300 bg-white cursor-pointer"
                        onClick={() => setShowDatePicker(!showDatePicker)}
                      >
                        <div className="flex-1 p-3">
                          <div className="text-xs text-gray-500 font-medium">Tarihler</div>
                          <div className="text-gray-900 mt-0.5">
                            {formData.checkIn ? new Date(formData.checkIn).toLocaleDateString('tr-TR') : 'Giriş Tarihi'} - 
                            {formData.checkOut ? new Date(formData.checkOut).toLocaleDateString('tr-TR') : 'Çıkış Tarihi'}
                          </div>
                        </div>
                        <div className="px-3 border-l">
                          <CalendarIcon className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                      {showDatePicker && (
                        <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border p-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">
                                Giriş
                              </label>
                              <input
                                type="date"
                                value={formData.checkIn}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={(e) => {
                                  const newDate = e.target.value;
                                  setFormData(prev => ({
                                    ...prev,
                                    checkIn: newDate,
                                    checkOut: prev.checkOut && new Date(prev.checkOut) <= new Date(newDate) ? 
                                      new Date(new Date(newDate).getTime() + 86400000).toISOString().split('T')[0] : 
                                      prev.checkOut
                                  }));
                                }}
                                className="w-full px-3 py-2 bg-blue-50 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-900 font-medium cursor-pointer"
                                required
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowDatePicker(true);
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">
                                Çıkış
                              </label>
                              <input
                                type="date"
                                value={formData.checkOut}
                                min={formData.checkIn ? new Date(new Date(formData.checkIn).getTime() + 86400000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                                onChange={(e) => {
                                  setFormData(prev => ({ ...prev, checkOut: e.target.value }));
                                }}
                                className="w-full px-3 py-2 bg-blue-50 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-900 font-medium cursor-pointer"
                                required
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowDatePicker(true);
                                }}
                              />
                            </div>
                          </div>
                          <div className="mt-4 flex justify-end">
                            <button
                              type="button"
                              onClick={() => setShowDatePicker(false)}
                              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                            >
                              Tamam
                            </button>
                          </div>
                            </div>
                          )}
                        </div>
                        
                    {/* Misafir Seçimi */}
                    <div className="relative" ref={guestPickerRef}>
                      <div 
                        className="flex items-center border rounded-lg hover:border-blue-300 bg-white cursor-pointer"
                        onClick={() => setShowGuestPicker(!showGuestPicker)}
                      >
                        <div className="flex-1 p-3">
                          <div className="text-xs text-gray-500 font-medium">Misafir sayısı</div>
                          <div className="text-gray-900 mt-0.5">
                            {formData.roomCount} oda, {formData.adults + formData.children} misafir
                            {formData.infants > 0 && `, ${formData.infants} bebek`}
                          </div>
                        </div>
                        <div className="px-3 border-l">
                          <UserGroupIcon className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                      {showGuestPicker && (
                        <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border p-4">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                            <div>
                                <div className="text-blue-900 font-medium">Oda</div>
                                <div className="text-sm text-blue-600">Oda sayısı</div>
                              </div>
                              <div className="flex items-center gap-3">
                                <button 
                                  type="button"
                                  onClick={() => setFormData(prev => ({...prev, roomCount: Math.max(1, prev.roomCount - 1)}))}
                                  className="w-8 h-8 rounded-full bg-white border border-blue-200 flex items-center justify-center text-blue-600 hover:border-blue-500 hover:text-blue-700"
                                >
                                  -
                                </button>
                                <span className="w-8 text-center font-medium text-blue-900">{formData.roomCount}</span>
                                <button 
                                  type="button"
                                  onClick={() => setFormData(prev => ({...prev, roomCount: Math.min(5, prev.roomCount + 1)}))}
                                  className="w-8 h-8 rounded-full bg-white border border-blue-200 flex items-center justify-center text-blue-600 hover:border-blue-500 hover:text-blue-700"
                                >
                                  +
                                </button>
                            </div>
                          </div>
                            <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                              <div>
                                <div className="text-blue-900 font-medium">Yetişkin</div>
                                <div className="text-sm text-blue-600">18 yaş ve üzeri</div>
                          </div>
                              <div className="flex items-center gap-3">
                                <button 
                                  type="button"
                                  onClick={() => setFormData(prev => ({...prev, adults: Math.max(1, prev.adults - 1)}))}
                                  className="w-8 h-8 rounded-full bg-white border border-blue-200 flex items-center justify-center text-blue-600 hover:border-blue-500 hover:text-blue-700"
                                >
                                  -
                                </button>
                                <span className="w-8 text-center font-medium text-blue-900">{formData.adults}</span>
                                <button 
                                  type="button"
                                  onClick={() => setFormData(prev => ({...prev, adults: Math.min(10, prev.adults + 1)}))}
                                  className="w-8 h-8 rounded-full bg-white border border-blue-200 flex items-center justify-center text-blue-600 hover:border-blue-500 hover:text-blue-700"
                                >
                                  +
                                </button>
                        </div>
                      </div>
                            <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                              <div>
                                <div className="text-blue-900 font-medium">Çocuk</div>
                                <div className="text-sm text-blue-600">0-17 yaş</div>
                    </div>
                              <div className="flex items-center gap-3">
                                <button 
                                  type="button"
                                  onClick={() => setFormData(prev => ({...prev, children: Math.max(0, prev.children - 1)}))}
                                  className="w-8 h-8 rounded-full bg-white border border-blue-200 flex items-center justify-center text-blue-600 hover:border-blue-500 hover:text-blue-700"
                                >
                                  -
                                </button>
                                <span className="w-8 text-center font-medium text-blue-900">{formData.children}</span>
                                <button 
                                  type="button"
                                  onClick={() => setFormData(prev => ({...prev, children: Math.min(10, prev.children + 1)}))}
                                  className="w-8 h-8 rounded-full bg-white border border-blue-200 flex items-center justify-center text-blue-600 hover:border-blue-500 hover:text-blue-700"
                                >
                                  +
                                </button>
                </div>
                            </div>
                            <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                              <div>
                                <div className="text-blue-900 font-medium">Bebek</div>
                                <div className="text-sm text-blue-600">0-2 yaş</div>
                              </div>
                              <div className="flex items-center gap-3">
                                <button 
                                  type="button"
                                  onClick={() => setFormData(prev => ({...prev, infants: Math.max(0, prev.infants - 1)}))}
                                  className="w-8 h-8 rounded-full bg-white border border-blue-200 flex items-center justify-center text-blue-600 hover:border-blue-500 hover:text-blue-700"
                                >
                                  -
                                </button>
                                <span className="w-8 text-center font-medium text-blue-900">{formData.infants}</span>
                                <button 
                                  type="button"
                                  onClick={() => setFormData(prev => ({...prev, infants: Math.min(2, prev.infants + 1)}))}
                                  className="w-8 h-8 rounded-full bg-white border border-blue-200 flex items-center justify-center text-blue-600 hover:border-blue-500 hover:text-blue-700"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                </div>
              )}
                    </div>
          </div>

                  {/* Toplam Fiyat */}
                  {formData.checkIn && formData.checkOut && selectedRoomType && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Toplam Fiyat</span>
                        <span className="text-xl font-bold text-gray-900">₺{calculateTotalPrice()}</span>
                </div>
                      <p className="text-xs text-gray-500">
                        {Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 60 * 60 * 24))} gece
                      </p>
              </div>
                  )}

                  {/* Ara Butonu */}
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg"
                  >
                    Ara
                  </button>
                </form>
            </div>
            
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Rezervasyon yaparken sorun yaşarsanız bize ulaşın
                </p>
                <div className="mt-2 flex items-center justify-center gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+90 850 123 45 67</span>
                </div>
              </div>
            </div>
          </div>
                  </div>
                </div>
                
      {/* Rezervasyon Modal */}
      {showReservationModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowReservationModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {reservationSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Rezervasyon Başarılı!</h3>
                <p className="text-gray-600">Rezervasyonunuz alındı. En kısa sürede sizinle iletişime geçeceğiz.</p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Rezervasyon Yap</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Ad Soyad
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      E-posta
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                    <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Mesajınız
                    </label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Rezervasyon Yap
                  </button>
                </form>
              </>
            )}
                    </div>
                  </div>
                )}

      {/* Fotoğraf Popup */}
      {showImagePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-5xl">
            <button
              onClick={() => setShowImagePopup(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="relative aspect-[16/9]">
              <Image
                src={selectedRoomImages[currentImageIndex]}
                alt={selectedRoomType ? `${selectedRoomType.name} - Görsel ${currentImageIndex + 1}` : `${hotel.name} - Görsel ${currentImageIndex + 1}`}
                fill
                className="object-contain"
              />
              
              {selectedRoomImages.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex(prev => (prev - 1 + selectedRoomImages.length) % selectedRoomImages.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full"
                  >
                    <ArrowLeftIcon className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex(prev => (prev + 1) % selectedRoomImages.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full"
                  >
                    <ArrowRightIcon className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
            
            {/* Otel veya Oda Bilgileri */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
              <div className="max-w-2xl">
                <h3 className="text-xl font-semibold">
                  {selectedRoomType ? selectedRoomType.name : hotel.name}
                </h3>
                {selectedRoomType && (
                  <>
                    <div className="flex flex-wrap items-center gap-4 text-sm mt-2">
                      <div className="flex items-center gap-1">
                        <UserIcon className="w-4 h-4" />
                        <span>{selectedRoomType.capacity} Kişilik</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Square2StackIcon className="w-4 h-4" />
                        <span>{selectedRoomType.size}m²</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">₺{selectedRoomType.price.toLocaleString('tr-TR')}</span>
                        <span className="text-sm">/ gece</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-200">{selectedRoomType.description}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedRoomType.features.map((feature, index) => (
                          <span key={index} className="text-xs bg-white/10 px-2 py-1 rounded-full">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="mt-4 flex justify-center gap-2">
              {selectedRoomImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Alt Bilgi */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
              <h3 className="text-base sm:text-lg font-semibold mb-4">TourTech Hakkında</h3>
              <p className="text-sm text-gray-400">
                Türkiye'nin en büyük otel rezervasyon platformu. En iyi fiyat garantisi ve 7/24 müşteri desteği ile hizmetinizdeyiz.
                    </p>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-4">Hızlı Bağlantılar</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/hotel/about" className="text-sm text-gray-400 hover:text-white">
                    Hakkımızda
                  </Link>
                </li>
                <li>
                  <Link href="/hotel/contact" className="text-sm text-gray-400 hover:text-white">
                    İletişim
                  </Link>
                </li>
                <li>
                  <Link href="/hotel/faq" className="text-sm text-gray-400 hover:text-white">
                    Sık Sorulan Sorular
                </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-4">İletişim</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>+90 850 123 45 67</li>
                <li>info@tourtech.com</li>
                <li>İstanbul, Türkiye</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Buton */}
      <FloatingBookButton />

      {/* Modal */}
      <BookingModal
        isOpen={showReservationModal}
        onClose={() => setShowReservationModal(false)}
        hotel={hotel}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        calculateTotalPrice={calculateTotalPrice}
        selectedRoomType={selectedRoomType}
      />
    </div>
  );
}
