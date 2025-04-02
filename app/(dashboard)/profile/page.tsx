'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UserCircleIcon, KeyIcon, BellIcon, CreditCardIcon, CameraIcon, ShieldCheckIcon, UserGroupIcon, ChartBarIcon, GiftIcon, QuestionMarkCircleIcon, CalendarIcon, HeartIcon, BuildingOfficeIcon, TicketIcon, MapPinIcon, ClockIcon, TrashIcon, StarIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface Booking {
  id: number;
  type: 'hotel' | 'tour';
  name: string;
  image: string;
  checkIn?: string;
  checkOut?: string;
  date?: string;
  time?: string;
  guests: number;
  status: 'confirmed' | 'completed' | 'cancelled';
  price: number;
  location: string;
  bookingNumber: string;
  description?: string;
}

interface FavoriteItem {
  id: number;
  name: string;
  image: string;
  location: string;
  rating: number;
  reviewCount: number;
  price: number;
  description: string;
  type: 'hotel' | 'tour';
  date?: string;
  time?: string;
  duration?: string;
  guests?: number;
}

interface Card {
  id: number;
  type: string;
  number: string;
  name: string;
  expiry: string;
  cvv: string;
  logo: string;
  lastFour: string;
  isExpired: boolean;
}

const CARD_TYPES = [
  {
    name: 'Visa',
    logo: 'https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/visa.png',
    pattern: /^4/,
    background: 'from-blue-500 to-blue-600'
  },
  {
    name: 'Mastercard',
    logo: 'https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/mastercard.png',
    pattern: /^5[1-5]/,
    background: 'from-red-500 to-red-600'
  },
  {
    name: 'American Express',
    logo: 'https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/amex.png',
    pattern: /^3[47]/,
    background: 'from-gray-600 to-gray-700'
  },
  {
    name: 'Discover',
    logo: 'https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/discover.png',
    pattern: /^6(?:011|5)/,
    background: 'from-orange-500 to-orange-600'
  }
];

const validateCardNumber = (number: string): boolean => {
  const cleanNumber = number.replace(/\D/g, '');
  return cleanNumber.length === 16;
};

const validateExpiryDate = (date: string): { isValid: boolean; message?: string } => {
  const [month, year] = date.split('/');
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;
  const cardYear = parseInt(year);
  const cardMonth = parseInt(month);

  if (cardMonth < 1 || cardMonth > 12) {
    return { isValid: false, message: 'Geçersiz ay' };
  }

  if (cardYear < currentYear || (cardYear === currentYear && cardMonth < currentMonth)) {
    return { isValid: false, message: 'Kartın süresi dolmuş' };
  }

  return { isValid: true };
};

const validateCVV = (cvv: string): boolean => {
  return /^\d{3}$/.test(cvv);
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [bookingTab, setBookingTab] = useState('upcoming');
  const [favoriteTab, setFavoriteTab] = useState('hotels');
  const [mounted, setMounted] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [cardType, setCardType] = useState('');
  const [savedCards, setSavedCards] = useState<Card[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Kartların süresini kontrol et
  useEffect(() => {
    const checkCardExpiry = () => {
      const currentDate = new Date();
      setSavedCards(prevCards => 
        prevCards.map(card => {
          const [month, year] = card.expiry.split('/');
          const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
          const isExpired = expiryDate < currentDate;
          
          if (isExpired && !card.isExpired) {
            toast.error(`"${card.type} **** ${card.lastFour}" kartınızın süresi doldu.`);
          }
          
          return {
            ...card,
            isExpired
          };
        })
      );
    };

    // Sayfa yüklendiğinde ve her saat başı kontrol et
    checkCardExpiry();
    const interval = setInterval(checkCardExpiry, 1000 * 60 * 60); // Her saat

    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString: string) => {
    if (!mounted) return dateString;
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const bookings: Record<string, Booking[]> = {
    upcoming: [
      {
        id: 1,
        type: 'hotel',
        name: 'Grand Hotel Antalya',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        checkIn: '2024-06-15',
        checkOut: '2024-06-20',
        guests: 2,
        status: 'confirmed',
        price: 2500,
        location: 'Antalya, Türkiye',
        bookingNumber: 'BK-2024-001',
        description: 'Lüks ve konforu bir arada sunan 5 yıldızlı otel'
      },
      {
        id: 2,
        type: 'tour',
        name: 'Kapadokya Balon Turu',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        date: '2024-07-01',
        time: '06:00',
        guests: 2,
        status: 'confirmed',
        price: 800,
        location: 'Kapadokya, Türkiye',
        bookingNumber: 'BK-2024-002',
        description: 'Güneşin doğuşunu gökyüzünden izleyin'
      }
    ],
    past: [
      {
        id: 3,
        type: 'hotel',
        name: 'Blue Resort Fethiye',
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2080&q=80',
        checkIn: '2024-03-01',
        checkOut: '2024-03-05',
        guests: 2,
        status: 'completed',
        price: 1800,
        location: 'Fethiye, Türkiye',
        bookingNumber: 'BK-2024-003',
        description: 'Deniz manzaralı muhteşem bir tatil deneyimi'
      }
    ],
    cancelled: [
      {
        id: 4,
        type: 'tour',
        name: 'Efes Antik Kenti Turu',
        image: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        date: '2024-02-15',
        time: '09:00',
        guests: 2,
        status: 'cancelled',
        price: 400,
        location: 'İzmir, Türkiye',
        bookingNumber: 'BK-2024-004',
        description: 'Antik dünyanın izlerini keşfedin'
      }
    ]
  };

  const favorites: Record<string, FavoriteItem[]> = {
    hotels: [
      {
        id: 1,
        type: 'hotel',
        name: 'Grand Hotel Antalya',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        location: 'Antalya, Türkiye',
        rating: 4.8,
        reviewCount: 128,
        price: 2500,
        description: 'Lüks ve konforu bir arada sunan 5 yıldızlı otel'
      },
      {
        id: 2,
        type: 'hotel',
        name: 'Blue Resort Fethiye',
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2080&q=80',
        location: 'Fethiye, Türkiye',
        rating: 4.6,
        reviewCount: 95,
        price: 1800,
        description: 'Deniz manzaralı muhteşem bir tatil deneyimi'
      }
    ],
    tours: [
      {
        id: 3,
        type: 'tour',
        name: 'Kapadokya Balon Turu',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        location: 'Kapadokya, Türkiye',
        rating: 4.9,
        reviewCount: 256,
        price: 800,
        description: 'Güneşin doğuşunu gökyüzünden izleyin',
        date: '2024-07-01',
        time: '06:00',
        duration: '3 saat',
        guests: 20
      },
      {
        id: 4,
        type: 'tour',
        name: 'Efes Antik Kenti Turu',
        image: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        location: 'İzmir, Türkiye',
        rating: 4.7,
        reviewCount: 189,
        price: 400,
        description: 'Antik dünyanın izlerini keşfedin',
        date: '2024-06-15',
        time: '09:00',
        duration: '6 saat',
        guests: 15
      }
    ]
  };

  const detectCardType = (number: string) => {
    const cleanNumber = number.replace(/\D/g, '');
    const foundType = CARD_TYPES.find(type => type.pattern.test(cleanNumber));
    return foundType?.name || '';
  };

  const formatCardNumber = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    const groups = cleanValue.match(/.{1,4}/g) || [];
    return groups.join(' ').substr(0, 19);
  };

  const formatExpiryDate = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length >= 2) {
      return cleanValue.substr(0, 2) + (cleanValue.length > 2 ? '/' + cleanValue.substr(2, 2) : '');
    }
    return cleanValue;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatCardNumber(e.target.value);
    setCardNumber(value);
    setCardType(detectCardType(value));
    
    if (value.length === 19 && !validateCardNumber(value)) {
      toast.error('Geçerli bir kart numarası giriniz (16 haneli)');
    }
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatExpiryDate(e.target.value);
    setExpiryDate(value);
    
    if (value.length === 5) {
      const validation = validateExpiryDate(value);
      if (!validation.isValid) {
        toast.error(validation.message || 'Geçersiz son kullanma tarihi');
      }
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substr(0, 3);
    setCvv(value);
    
    if (value.length === 3 && !validateCVV(value)) {
      toast.error('Geçerli bir CVV giriniz (3 haneli)');
    }
  };

  const handleCardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setCardName(value);
    
    if (value.length > 0 && !value.trim()) {
      toast.error('Kart sahibinin adını giriniz');
    }
  };

  const handleSaveCard = () => {
    // Kart numarası kontrolü
    if (!validateCardNumber(cardNumber)) {
      toast.error('Geçerli bir kart numarası giriniz (16 haneli)');
      return;
    }

    // Son kullanma tarihi kontrolü
    const expiryValidation = validateExpiryDate(expiryDate);
    if (!expiryValidation.isValid) {
      toast.error(expiryValidation.message || 'Geçersiz son kullanma tarihi');
      return;
    }

    // CVV kontrolü
    if (!validateCVV(cvv)) {
      toast.error('Geçerli bir CVV giriniz (3 haneli)');
      return;
    }

    // Kart sahibi kontrolü
    if (!cardName.trim()) {
      toast.error('Kart sahibinin adını giriniz');
      return;
    }

    const newCard = {
      id: Date.now(),
      type: cardType,
      number: cardNumber,
      name: cardName,
      expiry: expiryDate,
      cvv: cvv,
      logo: CARD_TYPES.find(t => t.name === cardType)?.logo || '',
      lastFour: cardNumber.slice(-4),
      isExpired: false
    };

    setSavedCards(prev => [...prev, newCard]);
    setCardNumber('');
    setCardName('');
    setExpiryDate('');
    setCvv('');
    setCardType('');
    setIsEditing(false);
    toast.success('Kart başarıyla kaydedildi');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sol Sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <div className="relative h-32 w-32 rounded-full border-4 border-blue-100 overflow-hidden">
                      <Image
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt="Profil fotoğrafı"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <CameraIcon className="h-6 w-6 text-white" />
                    </button>
                  </div>
                  <h2 className="mt-4 text-xl font-bold text-gray-900">Ahmet Yılmaz</h2>
                  <p className="text-sm text-gray-500">ahmet@example.com</p>
                  <div className="mt-2 flex items-center space-x-2 text-sm text-green-600">
                    <ShieldCheckIcon className="h-4 w-4" />
                    <span>Doğrulanmış Hesap</span>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200">
                <nav className="p-4 space-y-1">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                      activeTab === 'profile'
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <UserCircleIcon className="h-5 w-5 mr-3" />
                    Profil Bilgileri
                  </button>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                      activeTab === 'bookings'
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <CalendarIcon className="h-5 w-5 mr-3" />
                    Rezervasyonlarım
                  </button>
                  <button
                    onClick={() => setActiveTab('favorites')}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                      activeTab === 'favorites'
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <HeartIcon className="h-5 w-5 mr-3" />
                    Favorilerim
                  </button>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                      activeTab === 'security'
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <KeyIcon className="h-5 w-5 mr-3" />
                    Güvenlik
                  </button>
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                      activeTab === 'notifications'
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <BellIcon className="h-5 w-5 mr-3" />
                    Bildirimler
                  </button>
                  <button
                    onClick={() => setActiveTab('payment')}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                      activeTab === 'payment'
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <CreditCardIcon className="h-5 w-5 mr-3" />
                    Ödeme Bilgileri
                  </button>
                  <button
                    onClick={() => setActiveTab('rewards')}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                      activeTab === 'rewards'
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <GiftIcon className="h-5 w-5 mr-3" />
                    Ödüllerim
                  </button>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                      activeTab === 'analytics'
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <ChartBarIcon className="h-5 w-5 mr-3" />
                    İstatistiklerim
                  </button>
                  <button
                    onClick={() => setActiveTab('help')}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                      activeTab === 'help'
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <QuestionMarkCircleIcon className="h-5 w-5 mr-3" />
                    Yardım
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* Sağ İçerik */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6">
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold text-gray-900">Kişisel Bilgiler</h2>
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        {isEditing ? 'İptal' : 'Düzenle'}
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                          Ad
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          defaultValue="Ahmet"
                          disabled={!isEditing}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                          Soyad
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          defaultValue="Yılmaz"
                          disabled={!isEditing}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        E-posta
                      </label>
                      <input
                        type="email"
                        id="email"
                        defaultValue="ahmet@example.com"
                        disabled={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        defaultValue="+90 555 123 4567"
                        disabled={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                        Doğum Tarihi
                      </label>
                      <input
                        type="date"
                        id="birthDate"
                        defaultValue="1990-01-01"
                        disabled={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    {isEditing && (
                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          Değişiklikleri Kaydet
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'bookings' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold text-gray-900">Rezervasyonlarım</h2>
                      <Link
                        href="/search"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Yeni Rezervasyon
                      </Link>
                    </div>

                    {/* Rezervasyon Tab Menüsü */}
                    <div className="border-b border-gray-200">
                      <nav className="flex space-x-8" aria-label="Tabs">
                        <button
                          onClick={() => setBookingTab('upcoming')}
                          className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            bookingTab === 'upcoming'
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          Yaklaşan
                        </button>
                        <button
                          onClick={() => setBookingTab('past')}
                          className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            bookingTab === 'past'
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          Geçmiş
                        </button>
                        <button
                          onClick={() => setBookingTab('cancelled')}
                          className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            bookingTab === 'cancelled'
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          İptal Edilen
                        </button>
                      </nav>
                    </div>

                    {/* Rezervasyon Listesi */}
                    <div className="divide-y divide-gray-200">
                      {bookings[bookingTab].map((booking) => (
                        <div key={booking.id} className="py-6">
                          <div className="flex items-start space-x-4">
                            <div className="relative h-24 w-24 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={booking.image}
                                alt={booking.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="flex items-center space-x-2">
                                    {booking.type === 'hotel' ? (
                                      <BuildingOfficeIcon className="h-5 w-5 text-blue-500" />
                                    ) : (
                                      <TicketIcon className="h-5 w-5 text-green-500" />
                                    )}
                                    <h3 className="text-lg font-medium text-gray-900">{booking.name}</h3>
                                  </div>
                                  <p className="text-sm text-gray-500">Rezervasyon No: {booking.bookingNumber}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                  booking.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {booking.status === 'confirmed' ? 'Onaylandı' :
                                   booking.status === 'completed' ? 'Tamamlandı' :
                                   'İptal Edildi'}
                                </span>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500">
                                <MapPinIcon className="h-4 w-4 mr-1" />
                                {booking.location}
                              </div>
                              {booking.description && (
                                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{booking.description}</p>
                              )}
                              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                {booking.type === 'hotel' ? (
                                  <>
                                    <div className="flex items-center text-gray-500">
                                      <CalendarIcon className="h-4 w-4 mr-1" />
                                      Giriş: {formatDate(booking.checkIn!)}
                                    </div>
                                    <div className="flex items-center text-gray-500">
                                      <CalendarIcon className="h-4 w-4 mr-1" />
                                      Çıkış: {formatDate(booking.checkOut!)}
                                    </div>
                                  </>
                                ) : (
                                  <div className="flex items-center text-gray-500">
                                    <CalendarIcon className="h-4 w-4 mr-1" />
                                    {formatDate(booking.date!)}
                                  </div>
                                )}
                                <div className="flex items-center text-gray-500">
                                  <ClockIcon className="h-4 w-4 mr-1" />
                                  {booking.time || 'Belirtilmedi'}
                                </div>
                                <div className="flex items-center text-gray-500">
                                  <UserGroupIcon className="h-4 w-4 mr-1" />
                                  {booking.guests} Kişi
                                </div>
                                <div className="flex items-center text-gray-900 font-medium">
                                  {booking.price.toLocaleString('tr-TR')} ₺
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col space-y-2">
                              {booking.status === 'confirmed' && (
                                <>
                                  <Link
                                    href={`/bookings/${booking.id}`}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                  >
                                    Detaylar
                                  </Link>
                                  <button
                                    type="button"
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                  >
                                    İptal Et
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'favorites' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold text-gray-900">Favorilerim</h2>
                      <div className="flex items-center space-x-4">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <TrashIcon className="h-4 w-4 mr-2" />
                          Tümünü Temizle
                        </button>
                        <Link
                          href="/search"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Yeni Favori Ekle
                        </Link>
                      </div>
                    </div>

                    {/* Favori Tab Menüsü */}
                    <div className="border-b border-gray-200">
                      <nav className="flex space-x-8" aria-label="Tabs">
                        <button
                          onClick={() => setFavoriteTab('hotels')}
                          className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            favoriteTab === 'hotels'
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          Oteller
                        </button>
                        <button
                          onClick={() => setFavoriteTab('tours')}
                          className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            favoriteTab === 'tours'
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          Turlar
                        </button>
                      </nav>
                    </div>

                    {/* Favori Listesi */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favorites[favoriteTab].map((item) => (
                        <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
                          <div className="relative h-48">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                            <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors duration-200">
                              <HeartIcon className="h-5 w-5 text-red-500" />
                            </button>
                          </div>
                          <div className="p-4">
                            <div className="flex items-center space-x-2">
                              {item.type === 'hotel' ? (
                                <BuildingOfficeIcon className="h-5 w-5 text-blue-500" />
                              ) : (
                                <TicketIcon className="h-5 w-5 text-green-500" />
                              )}
                              <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                            </div>
                            <div className="mt-1 flex items-center text-sm text-gray-500">
                              <MapPinIcon className="h-4 w-4 mr-1" />
                              {item.location}
                            </div>
                            <div className="mt-2 flex items-center">
                              <StarIcon className="h-4 w-4 text-yellow-400" />
                              <span className="ml-1 text-sm text-gray-600">{item.rating}</span>
                              <span className="ml-1 text-sm text-gray-500">({item.reviewCount} değerlendirme)</span>
                            </div>
                            <p className="mt-2 text-sm text-gray-600 line-clamp-2">{item.description}</p>
                            {item.type === 'tour' && (
                              <div className="mt-4 space-y-2 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <CalendarIcon className="h-4 w-4 mr-2" />
                                  {formatDate(item.date!)}
                                </div>
                                <div className="flex items-center">
                                  <ClockIcon className="h-4 w-4 mr-2" />
                                  {item.time} - {item.duration}
                                </div>
                                <div className="flex items-center">
                                  <UserGroupIcon className="h-4 w-4 mr-2" />
                                  Maksimum {item.guests} Kişi
                                </div>
                              </div>
                            )}
                            <div className="mt-4 flex items-center justify-between">
                              <span className="text-lg font-medium text-gray-900">{item.price.toLocaleString('tr-TR')} ₺</span>
                              <Link
                                href={`/${favoriteTab}/${item.id}`}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Detaylar
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Güvenlik Ayarları</h2>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">İki Faktörlü Doğrulama</h3>
                            <p className="text-sm text-gray-500">Hesabınızı daha güvenli hale getirin</p>
                          </div>
                          <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Aktifleştir
                          </button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Şifre Değiştir</h3>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                            Mevcut Şifre
                          </label>
                          <input
                            type="password"
                            id="currentPassword"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                            Yeni Şifre
                          </label>
                          <input
                            type="password"
                            id="newPassword"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Yeni Şifre Tekrar
                          </label>
                          <input
                            type="password"
                            id="confirmPassword"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          >
                            Şifreyi Güncelle
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Bildirim Tercihleri</h2>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">E-posta Bildirimleri</h3>
                            <p className="text-sm text-gray-500">Kampanya ve fırsatlardan haberdar olun</p>
                          </div>
                          <button
                            type="button"
                            className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-blue-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          >
                            <span className="translate-x-5 pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out">
                              <span className="absolute inset-0 flex h-full w-full items-center justify-center transition-opacity duration-200 ease-in-out">
                                <svg className="h-3 w-3 text-blue-600" fill="currentColor" viewBox="0 0 12 12">
                                  <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                </svg>
                              </span>
                            </span>
                          </button>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">SMS Bildirimleri</h3>
                            <p className="text-sm text-gray-500">Önemli güncellemeleri SMS ile alın</p>
                          </div>
                          <button
                            type="button"
                            className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          >
                            <span className="translate-x-0 pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out">
                              <span className="absolute inset-0 flex h-full w-full items-center justify-center transition-opacity duration-200 ease-in-out">
                                <svg className="h-3 w-3 text-gray-400" fill="currentColor" viewBox="0 0 12 12">
                                  <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                </svg>
                              </span>
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'payment' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Ödeme Bilgileri</h2>
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="h-8 w-12 bg-gray-300 rounded flex items-center justify-center">
                                <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                              </div>
                              <div className="ml-4">
                                <p className="text-sm font-medium text-gray-900">•••• •••• •••• 4242</p>
                                <p className="text-sm text-gray-500">Son kullanma: 12/24</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              className="text-sm font-medium text-red-600 hover:text-red-500"
                            >
                              Sil
                            </button>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsEditing(!isEditing)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          {isEditing ? 'İptal' : 'Yeni Kart Ekle'}
                        </button>

                        {isEditing && (
                          <div className="mt-6 space-y-8">
                            {/* Kart Önizleme */}
                            <div className="relative h-56 w-96 mx-auto perspective-1000">
                              <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isCardFlipped ? 'rotate-y-180' : ''}`}>
                                {/* Ön Yüz */}
                                <div className={`absolute w-full h-full rounded-2xl p-6 bg-gradient-to-br ${cardType ? CARD_TYPES.find(t => t.name === cardType)?.background : 'from-gray-800 to-gray-900'} text-white backface-hidden`}>
                                  <div className="flex justify-between items-start">
                                    <div className="w-12 h-8">
                                      {cardType && (
                                        <Image
                                          src={CARD_TYPES.find(t => t.name === cardType)?.logo || ''}
                                          alt={cardType}
                                          width={48}
                                          height={32}
                                          className="object-contain"
                                        />
                                      )}
                                    </div>
                                    <div className="w-12 h-12">
                                      <Image
                                        src="https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/chip.png"
                                        alt="chip"
                                        width={48}
                                        height={48}
                                        className="object-contain"
                                      />
                                    </div>
                                  </div>
                                  <div className="mt-8 font-mono text-2xl tracking-wider">
                                    {cardNumber || '•••• •••• •••• ••••'}
                                  </div>
                                  <div className="mt-4 flex justify-between items-center">
                                    <div>
                                      <p className="text-xs text-white/60">Kart Sahibi</p>
                                      <p className="font-mono tracking-wider">{cardName || 'AD SOYAD'}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-white/60">Son Kullanma</p>
                                      <p className="font-mono tracking-wider">{expiryDate || 'MM/YY'}</p>
                                    </div>
                                  </div>
                                </div>
                                {/* Arka Yüz */}
                                <div className="absolute w-full h-full rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 text-white backface-hidden rotate-y-180">
                                  <div className="w-full h-12 bg-black/30 mt-8" />
                                  <div className="px-6 mt-8">
                                    <div className="bg-white/20 h-10 flex items-center justify-end px-4">
                                      <p className="font-mono">{cvv || 'CVV'}</p>
                                    </div>
                                    {cardType && (
                                      <div className="mt-8 flex justify-end">
                                        <div className="w-16 h-12">
                                          <Image
                                            src={CARD_TYPES.find(t => t.name === cardType)?.logo || ''}
                                            alt={cardType}
                                            width={64}
                                            height={48}
                                            className="object-contain opacity-60"
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Form */}
                            <div className="mt-6 space-y-6 bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                                    Kart Numarası
                                  </label>
                                  <div className="relative">
                                    <input
                                      type="text"
                                      id="cardNumber"
                                      value={cardNumber}
                                      onChange={handleCardNumberChange}
                                      maxLength={19}
                                      placeholder="1234 5678 9012 3456"
                                      className="block w-full rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:bg-white transition-all duration-200"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                      <CreditCardIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">
                                    Kart Üzerindeki İsim
                                  </label>
                                  <div className="relative">
                                    <input
                                      type="text"
                                      id="cardName"
                                      value={cardName}
                                      onChange={handleCardNameChange}
                                      placeholder="AD SOYAD"
                                      className="block w-full rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:bg-white transition-all duration-200"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                      <UserCircleIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                                    Son Kullanma Tarihi
                                  </label>
                                  <div className="relative">
                                    <input
                                      type="text"
                                      id="expiryDate"
                                      value={expiryDate}
                                      onChange={handleExpiryDateChange}
                                      maxLength={5}
                                      placeholder="MM/YY"
                                      className="block w-full rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:bg-white transition-all duration-200"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                      <CalendarIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                                    CVV
                                  </label>
                                  <div className="relative">
                                    <input
                                      type="text"
                                      id="cvv"
                                      value={cvv}
                                      onChange={handleCvvChange}
                                      maxLength={3}
                                      onFocus={() => setIsCardFlipped(true)}
                                      onBlur={() => setIsCardFlipped(false)}
                                      placeholder="123"
                                      className="block w-full rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:bg-white transition-all duration-200"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                      <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  id="defaultCard"
                                  type="checkbox"
                                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
                                />
                                <label htmlFor="defaultCard" className="text-sm text-gray-700">
                                  Varsayılan kart olarak ayarla
                                </label>
                              </div>
                              <div className="flex justify-end pt-4">
                                <button
                                  type="button"
                                  onClick={handleSaveCard}
                                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-sm"
                                >
                                  <CreditCardIcon className="h-5 w-5 mr-2" />
                                  Kartı Kaydet
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'rewards' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Ödüllerim</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-medium">Puanlarım</h3>
                              <p className="text-3xl font-bold mt-2">2,450</p>
                              <p className="text-sm text-blue-100 mt-1">Sonraki ödül: 500 puan</p>
                            </div>
                            <GiftIcon className="h-12 w-12 text-blue-200" />
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-medium">Seviyem</h3>
                              <p className="text-3xl font-bold mt-2">Gold</p>
                              <p className="text-sm text-purple-100 mt-1">Sonraki seviye: Platinum</p>
                            </div>
                            <ChartBarIcon className="h-12 w-12 text-purple-200" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'analytics' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">İstatistiklerim</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                          <h3 className="text-sm font-medium text-gray-500">Toplam Rezervasyon</h3>
                          <p className="text-2xl font-bold text-gray-900 mt-2">12</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                          <h3 className="text-sm font-medium text-gray-500">Toplam Harcama</h3>
                          <p className="text-2xl font-bold text-gray-900 mt-2">₺15,800</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                          <h3 className="text-sm font-medium text-gray-500">Kazanılan Puan</h3>
                          <p className="text-2xl font-bold text-gray-900 mt-2">2,450</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'help' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Yardım Merkezi</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                          <h3 className="text-lg font-medium text-gray-900">Sık Sorulan Sorular</h3>
                          <p className="text-sm text-gray-500 mt-2">En çok sorulan soruların cevaplarını bulun</p>
                          <button className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-500">
                            Görüntüle →
                          </button>
                        </div>
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                          <h3 className="text-lg font-medium text-gray-900">Destek Talebi</h3>
                          <p className="text-sm text-gray-500 mt-2">Yeni bir destek talebi oluşturun</p>
                          <button className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-500">
                            Oluştur →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Kaydedilen Kartlar */}
                {activeTab === 'payment' && savedCards.length > 0 && (
                  <div className="mt-8 space-y-8">
                    {/* Aktif Kartlar */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktif Kartlar</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedCards
                          .filter(card => !card.isExpired)
                          .map((card) => (
                            <div 
                              key={card.id} 
                              className="group relative rounded-2xl shadow-sm p-6 border transition-all duration-200 bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-lg"
                            >
                              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <button
                                  onClick={() => setSavedCards(prev => prev.filter(c => c.id !== card.id))}
                                  className="p-1.5 rounded-full bg-white/80 backdrop-blur-sm text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200"
                                >
                                  <TrashIcon className="h-5 w-5" />
                                </button>
                              </div>

                              <div className="flex items-center space-x-3 mb-6">
                                <div className="relative w-12 h-8">
                                  <Image
                                    src={card.logo}
                                    alt={card.type}
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                                <span className="text-sm font-medium text-gray-900">
                                  {card.type}
                                </span>
                              </div>

                              <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                  <CreditCardIcon className="h-4 w-4 text-gray-400" />
                                  <p className="font-mono text-lg text-gray-900">
                                    **** {card.lastFour}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <UserCircleIcon className="h-4 w-4 text-gray-400" />
                                  <p className="text-sm text-gray-600">
                                    {card.name}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                                  <p className="text-sm text-gray-600">
                                    {card.expiry}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Süresi Dolmuş Kartlar */}
                    {savedCards.filter(card => card.isExpired).length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Süresi Dolmuş Kartlar</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {savedCards
                            .filter(card => card.isExpired)
                            .map((card) => (
                              <div 
                                key={card.id} 
                                className="group relative rounded-2xl shadow-sm p-6 border bg-gray-50 border-gray-200"
                              >
                                <div className="absolute -top-2 -right-2 z-10">
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 shadow-sm">
                                    Süresi Dolmuş
                                  </span>
                                </div>
                                
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  <button
                                    onClick={() => setSavedCards(prev => prev.filter(c => c.id !== card.id))}
                                    className="p-1.5 rounded-full bg-white/80 backdrop-blur-sm text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200"
                                  >
                                    <TrashIcon className="h-5 w-5" />
                                  </button>
                                </div>

                                <div className="flex items-center space-x-3 mb-6">
                                  <div className="relative w-12 h-8">
                                    <Image
                                      src={card.logo}
                                      alt={card.type}
                                      fill
                                      className="object-contain opacity-50"
                                    />
                                  </div>
                                  <span className="text-sm font-medium text-gray-500">
                                    {card.type}
                                  </span>
                                </div>

                                <div className="space-y-4">
                                  <div className="flex items-center space-x-2">
                                    <CreditCardIcon className="h-4 w-4 text-gray-400" />
                                    <p className="font-mono text-lg text-gray-500">
                                      **** {card.lastFour}
                                    </p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <UserCircleIcon className="h-4 w-4 text-gray-400" />
                                    <p className="text-sm text-gray-500">
                                      {card.name}
                                    </p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                                    <p className="text-sm text-red-500">
                                      {card.expiry}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 