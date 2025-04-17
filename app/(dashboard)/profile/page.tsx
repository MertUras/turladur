'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UserCircleIcon, KeyIcon, BellIcon, CreditCardIcon, CameraIcon, ShieldCheckIcon, UserGroupIcon, ChartBarIcon, GiftIcon, QuestionMarkCircleIcon, CalendarIcon, HeartIcon, BuildingOfficeIcon, TicketIcon, MapPinIcon, ClockIcon, TrashIcon, StarIcon, FunnelIcon, ArrowsUpDownIcon, PlusIcon, EllipsisVerticalIcon, ArrowPathIcon, UsersIcon, MapPinIcon as LocationMarkerIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';


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
  const { data: session } = useSession();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
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
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [savedCards, setSavedCards] = useState<Card[]>([
    {
      id: 1,
      type: 'Visa',
      number: '4111111111111111',
      name: 'AHMET YILMAZ',
      expiry: '12/25',
      cvv: '123',
      logo: 'https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/visa.png',
      lastFour: '1111',
      isExpired: false
    },
    {
      id: 2,
      type: 'Mastercard',
      number: '5111111111111118',
      name: 'AHMET YILMAZ',
      expiry: '09/23',
      cvv: '456',
      logo: 'https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/mastercard.png',
      lastFour: '1118',
      isExpired: true
    }
  ]);
  
  // Yeni eklenen durumlar
  const [expandedFAQs, setExpandedFAQs] = useState<number[]>([0]); // İlk soruyu varsayılan olarak açık tut
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'priceAsc' | 'priceDesc' | 'dateAsc' | 'dateDesc'>('dateDesc');
  const [filters, setFilters] = useState({
    type: 'all',
    priceRange: [0, 5000],
    status: 'all',
    date: ''
  });
  
  // Rezervasyon ve favoriler için state ekleyelim
  const [bookings, setBookings] = useState<Record<string, Booking[]>>({
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
  });

  const [favorites, setFavorites] = useState<Record<string, FavoriteItem[]>>({
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
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  
  useEffect(() => {
    if (session?.user) {
      setUser({
        name: session.user.name || '',
        email: session.user.email || ''
      });
    }
  }, [session]);


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
    if (mounted) {
      checkCardExpiry();
      const interval = setInterval(checkCardExpiry, 1000 * 60 * 60); // Her saat
      return () => clearInterval(interval);
    }
  }, [mounted]);

  const formatDate = (dateString: string) => {
    if (!mounted) return dateString;
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
    const detectedType = detectCardType(value);
    setCardType(detectedType);
    
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

    const cleanNumber = cardNumber.replace(/\D/g, '');

    const newCard = {
      id: Date.now(),
      type: cardType,
      number: cleanNumber,
      name: cardName,
      expiry: expiryDate,
      cvv: cvv,
      logo: CARD_TYPES.find(t => t.name === cardType)?.logo || '',
      lastFour: cleanNumber.slice(-4),
      isExpired: false
    };

    setSavedCards(prev => [...prev, newCard]);
    setCardNumber('');
    setCardName('');
    setExpiryDate('');
    setCvv('');
    setCardType('');
    setIsCardFlipped(false);
    setIsEditing(false);
    toast.success('Kart başarıyla kaydedildi');
  };

  const handleDeleteCard = (cardId: number) => {
    setSavedCards(prev => prev.filter(card => card.id !== cardId));
    toast.success('Kart başarıyla silindi');
  };

  // Yeni işlevler ekleyelim
  const handleCancelBooking = (bookingId: number) => {
    // Gerçek bir uygulamada burada API çağrısı yapılır
    toast(`Rezervasyon #${bookingId} iptal edildi`, {
      icon: '🗑️',
    });
    
    // İptal edilen rezervasyonu güncelleyelim
    const updatedBookings = {
      ...bookings,
      upcoming: bookings.upcoming.filter(booking => booking.id !== bookingId),
      cancelled: [
        ...bookings.cancelled,
        {
          ...bookings.upcoming.find(booking => booking.id === bookingId)!,
          status: 'cancelled' as 'cancelled'
        }
      ].filter(Boolean)
    };
    
    setBookings(updatedBookings);
  };

  const handleViewBookingDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleToggleFavorite = (item: FavoriteItem) => {
    toast.success(`${item.name} favorilerden kaldırıldı`);
    // Favori listesinden öğeyi kaldıralım
    const updatedFavorites = {
      ...favorites,
      [favoriteTab]: favorites[favoriteTab].filter(fav => fav.id !== item.id)
    };
    setFavorites(updatedFavorites);
  };

  // Sıkça sorulan sorular için açılıp kapanma işlevi
  const toggleFAQ = (index: number) => {
    setExpandedFAQs(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  // Rezervasyonları filtreleme işlevi
  const applyFilters = () => {
    setFilterModalOpen(false);
    toast.success('Filtreler uygulandı');
  };

  // Rezervasyonları sıralama işlevi
  const handleSort = (order: 'priceAsc' | 'priceDesc' | 'dateAsc' | 'dateDesc') => {
    setSortOrder(order);
    
    const sortedBookings = {...bookings};
    Object.keys(sortedBookings).forEach(key => {
      const bookingList = sortedBookings[key];
      
      if (order === 'priceAsc') {
        sortedBookings[key] = [...bookingList].sort((a, b) => a.price - b.price);
        toast.success('Rezervasyonlar fiyata göre artan sıralandı');
      } else if (order === 'priceDesc') {
        sortedBookings[key] = [...bookingList].sort((a, b) => b.price - a.price);
        toast.success('Rezervasyonlar fiyata göre azalan sıralandı');
      } else if (order === 'dateAsc') {
        sortedBookings[key] = [...bookingList].sort((a, b) => {
          const dateA = a.date || a.checkIn || '';
          const dateB = b.date || b.checkIn || '';
          return new Date(dateA).getTime() - new Date(dateB).getTime();
        });
        toast.success('Rezervasyonlar tarihe göre artan sıralandı');
      } else if (order === 'dateDesc') {
        sortedBookings[key] = [...bookingList].sort((a, b) => {
          const dateA = a.date || a.checkIn || '';
          const dateB = b.date || b.checkIn || '';
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        });
        toast.success('Rezervasyonlar tarihe göre azalan sıralandı');
      }
    });
    
    setBookings(sortedBookings);
  };

  // Filtre sıfırlama işlevi
  const resetFilters = () => {
    setFilters({
      type: 'all',
      priceRange: [0, 5000],
      status: 'all',
      date: ''
    });
    toast.success('Filtreler sıfırlandı');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sol Sidebar - Modern Tasarım */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-200 dark:border-gray-700">
              <div className="relative">
                {/* Profil banner arkaplanı */}
                <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 w-full"></div>
                
                <div className="p-6 -mt-14">
                  <div className="flex flex-col items-center">
                    <div className="relative group">
                      <div className="relative h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden shadow-lg">
                        <Image
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt="Profil fotoğrafı"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button 
                        className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm"
                        title="Profil fotoğrafını değiştir"
                      >
                        <CameraIcon className="h-7 w-7 text-white" />
                      </button>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name || 'İsimsiz Kullanıcı'}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                    <div className="mt-2 flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
                      <ShieldCheckIcon className="h-4 w-4" />
                      <span>Doğrulanmış Hesap</span>
                    </div>
                    

                    {/* Kullanıcı istatistikleri */}
                    <div className="mt-6 w-full grid grid-cols-3 gap-2 text-center border-t border-gray-100 dark:border-gray-700 pt-6">
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">12</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Rezervasyon</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">2450</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Puan</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">4</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Kayıtlı Kart</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-100 dark:border-gray-700">
                <nav className="p-2 space-y-1">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      activeTab === 'profile'
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 dark:from-blue-900/40 dark:to-indigo-900/40 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                    }`}
                  >
                    <UserCircleIcon className="h-5 w-5 mr-3" />
                    Profil Bilgileri
                  </button>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      activeTab === 'bookings'
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 dark:from-blue-900/40 dark:to-indigo-900/40 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                    }`}
                  >
                    <CalendarIcon className="h-5 w-5 mr-3" />
                    Rezervasyonlarım
                  </button>
                  <button
                    onClick={() => setActiveTab('favorites')}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      activeTab === 'favorites'
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 dark:from-blue-900/40 dark:to-indigo-900/40 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                    }`}
                  >
                    <HeartIcon className="h-5 w-5 mr-3" />
                    Favorilerim
                  </button>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      activeTab === 'security'
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 dark:from-blue-900/40 dark:to-indigo-900/40 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                    }`}
                  >
                    <KeyIcon className="h-5 w-5 mr-3" />
                    Güvenlik
                  </button>
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      activeTab === 'notifications'
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 dark:from-blue-900/40 dark:to-indigo-900/40 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                    }`}
                  >
                    <BellIcon className="h-5 w-5 mr-3" />
                    Bildirimler
                  </button>
                  <button
                    onClick={() => setActiveTab('payment')}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      activeTab === 'payment'
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 dark:from-blue-900/40 dark:to-indigo-900/40 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                    }`}
                  >
                    <CreditCardIcon className="h-5 w-5 mr-3" />
                    Ödeme Bilgileri
                  </button>
                  <button
                    onClick={() => setActiveTab('rewards')}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      activeTab === 'rewards'
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 dark:from-blue-900/40 dark:to-indigo-900/40 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                    }`}
                  >
                    <GiftIcon className="h-5 w-5 mr-3" />
                    <div className="flex items-center justify-between w-full">
                      <span>Ödüllerim</span>
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">Yeni</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      activeTab === 'analytics'
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 dark:from-blue-900/40 dark:to-indigo-900/40 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                    }`}
                  >
                    <ChartBarIcon className="h-5 w-5 mr-3" />
                    İstatistiklerim
                  </button>
                  <button
                    onClick={() => setActiveTab('help')}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      activeTab === 'help'
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 dark:from-blue-900/40 dark:to-indigo-900/40 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                    }`}
                  >
                    <QuestionMarkCircleIcon className="h-5 w-5 mr-3" />
                    Yardım
                  </button>
                </nav>
              </div>
            </div>
            
            {/* Hızlı Aksiyonlar Kartı - Mobil Görünümde Görünecek */}
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-5 border border-gray-200 dark:border-gray-700 lg:hidden">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Hızlı İşlemler</h3>
              <div className="grid grid-cols-3 gap-2">
                <button className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  <CalendarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <span className="mt-1 text-xs">Rezervasyon</span>
                </button>
                <button className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  <CreditCardIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <span className="mt-1 text-xs">Ödemeler</span>
                </button>
                <button className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  <HeartIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <span className="mt-1 text-xs">Favoriler</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sağ İçerik - İyileştirilmiş Tasarım */}
          <div className="lg:col-span-9">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl">
              <div className="p-6">
                {activeTab === 'profile' && (
                  <div className="space-y-8">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Kişisel Bilgiler</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Hesap bilgilerinizi yönetin ve güncelleyin</p>
                      </div>
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        {isEditing ? (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            İptal
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Düzenle
                          </>
                        )}
                      </button>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-5 border border-blue-100 dark:border-blue-900/50">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 p-3 bg-blue-100 dark:bg-blue-800 rounded-xl">
                          <UserCircleIcon className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-md font-medium text-gray-900 dark:text-white">Profil Tamamlama: 85%</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Profilinizi tamamlayarak daha fazla fırsat yakalayın</p>
                        </div>
                        <div className="ml-auto">
                          <div className="w-full h-2 bg-blue-200 dark:bg-blue-700 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Ad
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          defaultValue={user?.name || ''}
                          disabled={!isEditing}
                          className={`mt-1 block w-full rounded-xl border-gray-300 dark:border-gray-600 shadow-sm dark:bg-gray-700 dark:text-white
                          ${isEditing 
                            ? 'focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 transition-colors duration-200' 
                            : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Soyad
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          defaultValue={user?.name || ''}
                          disabled={!isEditing}
                          className={`mt-1 block w-full rounded-xl border-gray-300 dark:border-gray-600 shadow-sm dark:bg-gray-700 dark:text-white
                          ${isEditing 
                            ? 'focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 transition-colors duration-200' 
                            : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        E-posta
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          id="email"
                          defaultValue={user?.email || ''}
                          disabled={!isEditing}
                          className={`mt-1 block w-full rounded-xl border-gray-300 dark:border-gray-600 shadow-sm dark:bg-gray-700 dark:text-white pl-12
                          ${isEditing 
                            ? 'focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 transition-colors duration-200' 
                            : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Telefon
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          id="phone"
                          defaultValue="+90 555 123 4567"
                          disabled={!isEditing}
                          className={`mt-1 block w-full rounded-xl border-gray-300 dark:border-gray-600 shadow-sm dark:bg-gray-700 dark:text-white pl-12
                          ${isEditing 
                            ? 'focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 transition-colors duration-200' 
                            : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Doğum Tarihi
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          id="birthDate"
                          defaultValue="1990-01-01"
                          disabled={!isEditing}
                          className={`mt-1 block w-full rounded-xl border-gray-300 dark:border-gray-600 shadow-sm dark:bg-gray-700 dark:text-white pl-12
                          ${isEditing 
                            ? 'focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 transition-colors duration-200' 
                            : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex justify-end space-x-4">
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="inline-flex justify-center rounded-xl border border-gray-300 dark:border-gray-600 px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                        >
                          İptal
                        </button>
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-xl border border-transparent bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-md hover:shadow-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
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
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Rezervasyonlarım</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Geçmiş ve gelecek tur rezervasyonlarınız</p>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                          onClick={() => setFilterModalOpen(true)}
                        >
                          <FunnelIcon className="h-4 w-4 mr-2" />
                          Filtrele
                        </button>
                        <div className="relative">
                          <button 
                            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                            onClick={() => document.getElementById('sortDropdown')?.classList.toggle('hidden')}
                          >
                            <ArrowsUpDownIcon className="h-4 w-4 mr-2" />
                            Sırala
                          </button>
                          <div 
                            id="sortDropdown" 
                            className="hidden absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10 divide-y divide-gray-100 dark:divide-gray-700"
                          >
                            <div className="py-1" role="menu" aria-orientation="vertical">
                              <button 
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" 
                                role="menuitem"
                                onClick={() => handleSort('priceAsc')}
                              >
                                Fiyat: Artan
                              </button>
                              <button 
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" 
                                role="menuitem"
                                onClick={() => handleSort('priceDesc')}
                              >
                                Fiyat: Azalan
                              </button>
                              <button 
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" 
                                role="menuitem"
                                onClick={() => handleSort('dateAsc')}
                              >
                                Tarih: Eski - Yeni
                              </button>
                              <button 
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" 
                                role="menuitem"
                                onClick={() => handleSort('dateDesc')}
                              >
                                Tarih: Yeni - Eski
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                      <div className="border-b border-gray-200 dark:border-gray-700 pb-4 flex space-x-4">
                        <button 
                          onClick={() => setBookingTab('upcoming')}
                          className={`px-4 py-2 text-sm font-medium rounded-lg ${bookingTab === 'upcoming' ? 
                            'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 
                            'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                        >
                          Yaklaşan
                        </button>
                        <button 
                          onClick={() => setBookingTab('past')}
                          className={`px-4 py-2 text-sm font-medium rounded-lg ${bookingTab === 'past' ? 
                            'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 
                            'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                        >
                          Geçmiş
                        </button>
                        <button 
                          onClick={() => setBookingTab('cancelled')}
                          className={`px-4 py-2 text-sm font-medium rounded-lg ${bookingTab === 'cancelled' ? 
                            'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 
                            'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                        >
                          İptal Edilen
                        </button>
                      </div>
                    </div>

                    {/* Filtreleme Modal */}
                    {filterModalOpen && (
                      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeInBg">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-zoomIn">
                          <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Rezervasyonları Filtrele</h3>
                              <button
                                onClick={() => setFilterModalOpen(false)}
                                className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                            
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Rezervasyon Tipi
                                </label>
                                <select 
                                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                  value={filters.type}
                                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                                >
                                  <option value="all">Tümü</option>
                                  <option value="hotel">Otel</option>
                                  <option value="tour">Tur</option>
                                </select>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Fiyat Aralığı: ₺{filters.priceRange[0]} - ₺{filters.priceRange[1]}
                                </label>
                                <div className="flex space-x-4 items-center">
                                  <input 
                                    type="range" 
                                    min="0" 
                                    max="5000" 
                                    step="100"
                                    value={filters.priceRange[0]} 
                                    onChange={(e) => setFilters({...filters, priceRange: [parseInt(e.target.value), filters.priceRange[1]]})}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                  />
                                  <input 
                                    type="range" 
                                    min="0" 
                                    max="5000" 
                                    step="100"
                                    value={filters.priceRange[1]} 
                                    onChange={(e) => setFilters({...filters, priceRange: [filters.priceRange[0], parseInt(e.target.value)]})}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Durum
                                </label>
                                <select 
                                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                  value={filters.status}
                                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                                >
                                  <option value="all">Tümü</option>
                                  <option value="confirmed">Onaylandı</option>
                                  <option value="completed">Tamamlandı</option>
                                  <option value="cancelled">İptal Edildi</option>
                                </select>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Tarih
                                </label>
                                <input 
                                  type="date" 
                                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                  value={filters.date}
                                  onChange={(e) => setFilters({...filters, date: e.target.value})}
                                />
                              </div>
                            </div>
                            
                            <div className="mt-6 flex justify-end space-x-3">
                              <button
                                onClick={resetFilters}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                              >
                                Sıfırla
                              </button>
                              <button
                                onClick={applyFilters}
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700"
                              >
                                Uygula
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-5 border border-blue-100 dark:border-blue-900/50 mb-6">
                      <div className="flex flex-col md:flex-row md:items-center">
                        <div className="flex-shrink-0 p-3 bg-blue-100 dark:bg-blue-800 rounded-xl">
                          <CalendarIcon className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div className="mt-3 md:mt-0 md:ml-4">
                          <h3 className="text-md font-medium text-gray-900 dark:text-white">Yaklaşan Rezervasyon</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {bookings.upcoming.length > 0 
                              ? `${bookings.upcoming[0].name} — ${bookings.upcoming[0].type === 'hotel' 
                                ? `${formatDate(bookings.upcoming[0].checkIn || '')}`
                                : `${formatDate(bookings.upcoming[0].date || '')}, ${bookings.upcoming[0].time}`}`
                              : 'Yaklaşan rezervasyonunuz bulunmuyor.'}
                          </p>
                        </div>
                        {bookings.upcoming.length > 0 && (
                          <div className="mt-4 md:mt-0 md:ml-auto flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                            <button 
                              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md hover:shadow-lg transition-all duration-200"
                              onClick={() => handleViewBookingDetails(bookings.upcoming[0])}
                            >
                              Rezervasyonu Görüntüle
                            </button>
                            <button 
                              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                              onClick={() => handleCancelBooking(bookings.upcoming[0].id)}
                            >
                              İptal Et
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Rezervasyon Kartları */}
                      {bookings[bookingTab].map((booking) => (
                        <div key={booking.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-all duration-200">
                          <div className="flex flex-col md:flex-row">
                            <div className="relative h-48 md:h-auto md:w-48 rounded-xl overflow-hidden mb-4 md:mb-0">
                              <Image 
                                src={booking.image}
                                alt={booking.name}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-lg">
                                {booking.status === 'confirmed' ? 'Onaylandı' :
                                 booking.status === 'completed' ? 'Tamamlandı' :
                                 'İptal Edildi'}
                              </div>
                            </div>
                            <div className="md:ml-6 flex-1">
                              <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{booking.name}</h3>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {booking.type === 'hotel' 
                                      ? `${formatDate(booking.checkIn || '')} - ${formatDate(booking.checkOut || '')}`
                                      : `${formatDate(booking.date || '')}, ${booking.time}`}
                                  </p>
                                </div>
                                <div className="mt-2 md:mt-0 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-lg">
                                  ₺{booking.price.toLocaleString('tr-TR')}
                                </div>
                              </div>
                              <div className="mt-4 border-t border-gray-100 dark:border-gray-700 pt-4">
                                <div className="flex flex-wrap gap-4">
                                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <UsersIcon className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
                                    {booking.guests} Kişi
                                  </div>
                                  {booking.type === 'hotel' && (
                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                      <ClockIcon className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
                                      {new Date(booking.checkOut || '').getDate() - new Date(booking.checkIn || '').getDate()} Gece
                                    </div>
                                  )}
                                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <LocationMarkerIcon className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
                                    {booking.location}
                                  </div>
                                </div>
                                <div className="mt-4 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                                  <button 
                                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm hover:shadow-md transition-all duration-200"
                                    onClick={() => handleViewBookingDetails(booking)}
                                  >
                                    Detayları Görüntüle
                                  </button>
                                  {booking.status === 'confirmed' && (
                                    <>
                                      <button 
                                        className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                                        onClick={() => {
                                          toast.success('Rezervasyon değişikliği için rehbere mesaj gönderildi');
                                        }}
                                      >
                                        Rehbere Mesaj
                                      </button>
                                      <button 
                                        className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-xl text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                                        onClick={() => handleCancelBooking(booking.id)}
                                      >
                                        İptal Et
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {bookings[bookingTab].length === 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
                          <CalendarIcon className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" />
                          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                            {bookingTab === 'upcoming' 
                              ? 'Yaklaşan rezervasyonunuz bulunmuyor' 
                              : bookingTab === 'past' 
                                ? 'Geçmiş rezervasyonunuz bulunmuyor' 
                                : 'İptal edilmiş rezervasyonunuz bulunmuyor'}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {bookingTab === 'upcoming' 
                              ? 'Yeni bir rezervasyon yapmak için ana sayfaya dönebilirsiniz.' 
                              : bookingTab === 'past' 
                                ? 'Tamamlanan rezervasyonlarınız burada görüntülenecektir.' 
                                : 'İptal ettiğiniz rezervasyonlar burada görüntülenecektir.'}
                          </p>
                          {bookingTab === 'upcoming' && (
                            <button 
                              className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700"
                              onClick={() => toast.success('Rezervasyon sayfasına yönlendiriliyorsunuz')}
                            >
                              Rezervasyon Yap
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'favorites' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Favorilerim</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Kaydettiğiniz oteller ve turlar</p>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                      <div className="border-b border-gray-200 dark:border-gray-700 pb-4 flex space-x-4">
                        <button 
                          onClick={() => setFavoriteTab('hotels')}
                          className={`px-4 py-2 text-sm font-medium rounded-lg ${favoriteTab === 'hotels' ? 
                            'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 
                            'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                        >
                          Oteller
                        </button>
                        <button 
                          onClick={() => setFavoriteTab('tours')}
                          className={`px-4 py-2 text-sm font-medium rounded-lg ${favoriteTab === 'tours' ? 
                            'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 
                            'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                        >
                          Turlar
                        </button>
                      </div>
                      
                      <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {favorites[favoriteTab].map((item) => (
                          <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 relative">
                            <div className="relative h-48">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute top-2 right-2">
                                <button 
                                  className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-red-500 hover:bg-white"
                                  onClick={() => handleToggleFavorite(item)}
                                >
                                  <HeartIcon className="h-5 w-5 fill-current" />
                                </button>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.location}</p>
                                </div>
                                <div className="flex items-center text-sm">
                                  <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                                  <span>{item.rating}</span>
                                  <span className="text-gray-400 dark:text-gray-500 ml-1">({item.reviewCount})</span>
                                </div>
                              </div>
                              <div className="mt-4 flex justify-between items-center">
                                <span className="font-semibold text-gray-900 dark:text-white">₺{item.price.toLocaleString('tr-TR')}</span>
                                <button 
                                  className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/30"
                                  onClick={() => {
                                    toast.success(`${item.name} detayları görüntüleniyor`);
                                  }}
                                >
                                  Detaylar
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'payment' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ödeme Bilgileri</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Kayıtlı kartlarınızı yönetin</p>
                      </div>
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Yeni Kart Ekle
                      </button>
                    </div>

                    {isEditing ? (
                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Yeni Kart Ekle</h3>
                        
                        {/* Kart önizleme */}
                        <div className="mb-6 perspective-1000">
                          <div className={`card-container ${isCardFlipped ? 'flipped' : ''}`}>
                            <div className={`card-inner relative w-full h-56 rounded-2xl transition-all duration-500 transform-style-3d ${isCardFlipped ? 'rotate-y-180' : ''}`}>
                              {/* Kart ön yüz */}
                              <div className={`card-front absolute w-full h-full rounded-2xl p-6 shadow-xl backface-hidden bg-gradient-to-br ${
                                cardType && CARD_TYPES.find(t => t.name === cardType)?.background || 'from-gray-500 to-gray-600'
                              }`}>
                                <div className="flex justify-between items-start h-full flex-col">
                                  <div className="w-full flex justify-between items-center">
                                    <div className="w-16 h-12 flex items-center justify-center">
                                      {cardType && CARD_TYPES.find(t => t.name === cardType)?.logo ? (
                                        <img 
                                          src={CARD_TYPES.find(t => t.name === cardType)?.logo} 
                                          alt={cardType} 
                                          className="w-full" 
                                        />
                                      ) : (
                                        <div className="w-12 h-12 bg-white/30 rounded-full backdrop-blur-sm"></div>
                                      )}
                                    </div>
                                    <span className="text-xl text-white font-bold backdrop-blur-sm">{cardType || 'KART'}</span>
                                  </div>
                                  
                                  <div className="w-full">
                                    <div className="mb-6">
                                      <span className="text-gray-200 text-xs mb-1 block">Kart Numarası</span>
                                      <span className="text-white text-xl tracking-wider">
                                        {cardNumber || '•••• •••• •••• ••••'}
                                      </span>
                                    </div>
                                    
                                    <div className="flex justify-between">
                                      <div>
                                        <span className="text-gray-200 text-xs mb-1 block">Kart Sahibi</span>
                                        <span className="text-white text-md uppercase">
                                          {cardName || 'AD SOYAD'}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-gray-200 text-xs mb-1 block">Son Kullanma</span>
                                        <span className="text-white text-md">
                                          {expiryDate || 'AA/YY'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Kart arka yüz */}
                              <div className="card-back absolute w-full h-full rounded-2xl shadow-xl backface-hidden rotate-y-180 bg-gradient-to-br from-gray-800 to-gray-900">
                                <div className="w-full h-12 bg-black mt-8"></div>
                                <div className="px-6 mt-8">
                                  <div className="h-10 bg-white/80 flex items-center justify-end pr-4 rounded-lg">
                                    <span className="text-gray-800 text-lg tracking-wider">
                                      {cvv || 'CVV'}
                                    </span>
                                  </div>
                                  <div className="mt-8 text-right">
                                    <span className="text-white text-xs">İmza için güvenli alan</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Kart Numarası
                            </label>
                            <input
                              type="text"
                              id="cardNumber"
                              placeholder="0000 0000 0000 0000"
                              value={cardNumber}
                              onChange={handleCardNumberChange}
                              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                          <div>
                            <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Kart Üzerindeki İsim
                            </label>
                            <input
                              type="text"
                              id="cardName"
                              placeholder="AD SOYAD"
                              value={cardName}
                              onChange={handleCardNameChange}
                              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Son Kullanma Tarihi
                              </label>
                              <input
                                type="text"
                                id="expiryDate"
                                placeholder="AA/YY"
                                value={expiryDate}
                                onChange={handleExpiryDateChange}
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                              />
                            </div>
                            <div>
                              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                CVV
                              </label>
                              <input
                                type="text"
                                id="cvv"
                                placeholder="123"
                                value={cvv}
                                onChange={handleCvvChange}
                                onFocus={() => setIsCardFlipped(true)}
                                onBlur={() => setIsCardFlipped(false)}
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2 mt-4">
                            <button
                              onClick={() => setIsEditing(false)}
                              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              İptal
                            </button>
                            <button
                              onClick={handleSaveCard}
                              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Kartı Kaydet
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {savedCards.length === 0 ? (
                          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
                            <CreditCardIcon className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" />
                            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Kayıtlı Kart Bulunamadı</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Hızlı ödeme için kart bilgilerinizi güvenle saklayabilirsiniz.</p>
                            <button 
                              onClick={() => setIsEditing(true)}
                              className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700"
                            >
                              Kart Ekle
                            </button>
                          </div>
                        ) : (
                          savedCards.map((card) => (
                            <div key={card.id} className={`bg-white dark:bg-gray-800 rounded-2xl border ${card.isExpired ? 'border-red-200 dark:border-red-900/50' : 'border-gray-200 dark:border-gray-700'} shadow-lg overflow-hidden`}>
                              <div className={`h-20 bg-gradient-to-r ${
                                CARD_TYPES.find(t => t.name === card.type)?.background || 'from-gray-500 to-gray-600'
                              }`}>
                                <div className="h-full w-full p-4 flex justify-between items-center backdrop-blur-sm bg-black/20">
                                  {card.logo && (
                                    <img src={card.logo} alt={card.type} className="h-10" />
                                  )}
                                  <span className="text-white text-xl font-bold">{card.type}</span>
                                </div>
                              </div>
                              <div className="p-5">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white text-lg">
                                      **** **** **** {card.lastFour}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                      {card.name} • Son Kullanma: {card.expiry}
                                    </p>
                                  </div>
                                  {card.isExpired && (
                                    <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium rounded-full">
                                      Süresi Doldu
                                    </span>
                                  )}
                                </div>
                                <div className="mt-4 flex justify-end space-x-2">
                                  <button 
                                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    onClick={() => {
                                      // Kart detaylarını gösterme işlemleri burada yapılabilir
                                      toast.success(`${card.type} kartı seçildi`);
                                    }}
                                  >
                                    <EllipsisVerticalIcon className="h-5 w-5" />
                                  </button>
                                  <button 
                                    className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    onClick={() => handleDeleteCard(card.id)}
                                  >
                                    <TrashIcon className="h-5 w-5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Güvenlik sekmesi */}
                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Güvenlik Ayarları</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Hesap güvenliğinizi yönetin</p>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Şifre Değiştir</h3>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Mevcut Şifre
                          </label>
                          <input
                            type="password"
                            id="currentPassword"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div>
                          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Yeni Şifre
                          </label>
                          <input
                            type="password"
                            id="newPassword"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Yeni Şifre (Tekrar)
                          </label>
                          <input
                            type="password"
                            id="confirmPassword"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div className="pt-2">
                          <button
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Şifreyi Güncelle
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">İki Faktörlü Doğrulama</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            İki faktörlü doğrulama etkinleştirildiğinde, oturum açarken ek bir güvenlik kodu girmeniz istenecektir.
                          </p>
                          <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-2">
                            Aktif
                          </p>
                        </div>
                        <label className="inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Oturum Geçmişi</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-xl">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Windows - Chrome</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">İstanbul, Türkiye • Şu an aktif</div>
                          </div>
                          <div className="flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Bu cihaz</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-xl">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">iPhone - Safari</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">İstanbul, Türkiye • 1 saat önce</div>
                          </div>
                          <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
                            Çıkış Yap
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bildirimler sekmesi */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Bildirim Ayarları</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Hangi bildirimler alacağınızı yönetin</p>
                      </div>
                      <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md hover:shadow-lg transition-all duration-200">
                        <ArrowPathIcon className="h-5 w-5 mr-2" />
                        Tümünü Güncelle
                      </button>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">E-posta Bildirimleri</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">Rezervasyon Onayları</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Rezervasyonlarınız onaylandığında bildirim alın</p>
                          </div>
                          <label className="inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">Seyahat Hatırlatıcıları</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Yaklaşan seyahatleriniz için hatırlatıcılar alın</p>
                          </div>
                          <label className="inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">Özel Teklifler</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Size özel indirim ve kampanyalar hakkında bilgi alın</p>
                          </div>
                          <label className="inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between py-3">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">Bülten</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Aylık seyahat haberleri ve ipuçlarını alın</p>
                          </div>
                          <label className="inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Mobil Bildirimleri</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">Anlık Bildirimler</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Rezervasyon durumu değişiklikleri için anlık bildirimler alın</p>
                          </div>
                          <label className="inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">Seyahat İpuçları</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Seyahatiniz sırasında yararlı bilgiler alın</p>
                          </div>
                          <label className="inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Ödüller sekmesi */}
                {activeTab === 'rewards' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ödüller ve Puanlar</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Kazandığınız puanlar ve ödüller</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl shadow-lg overflow-hidden">
                      <div className="p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-2xl font-bold">TurlaDur Elit Üye</h3>
                            <p className="text-blue-100">{user?.name || 'İsimsiz Kullanıcı'}</p>
                          </div>
                          <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <GiftIcon className="h-8 w-8 text-white" />
                          </div>
                        </div>
                        <div className="mt-8">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-blue-100">Toplam Puan</span>
                            <span className="text-2xl font-bold">2,450</span>
                          </div>
                          <div className="w-full h-2 bg-blue-400/30 rounded-full overflow-hidden">
                            <div className="h-full bg-white rounded-full" style={{ width: '65%' }}></div>
                          </div>
                          <p className="text-sm text-blue-100 mt-2">550 puan daha kazanarak Platin seviyesine yükseleceksiniz</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
                        <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl mb-4">
                          <TicketIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">%15 İndirim</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Sonraki otel rezervasyonunuzda</p>
                        <button className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700">
                          Kullan (500 puan)
                        </button>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
                        <div className="inline-flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/40 rounded-xl mb-4">
                          <BuildingOfficeIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Ücretsiz Konaklama</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Bir gece ücretsiz konaklama</p>
                        <button className="w-full py-2 px-4 bg-gradient-to-r from-green-500 to-teal-600 text-white text-sm font-medium rounded-xl hover:from-green-600 hover:to-teal-700">
                          Kullan (1,500 puan)
                        </button>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
                        <div className="inline-flex items-center justify-center p-3 bg-purple-100 dark:bg-purple-900/40 rounded-xl mb-4">
                          <MapPinIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Özel Tur</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">VIP tur deneyimi</p>
                        <button className="w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm font-medium rounded-xl hover:from-purple-600 hover:to-pink-700">
                          Kullan (2,000 puan)
                        </button>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Puan Geçmişi</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">Kapadokya Balon Turu Rezervasyonu</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">15 Haziran 2023</p>
                          </div>
                          <span className="text-green-600 dark:text-green-400 font-medium">+350 puan</span>
                        </div>
                        
                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">%10 İndirim Kuponu Kullanımı</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">2 Mayıs 2023</p>
                          </div>
                          <span className="text-red-600 dark:text-red-400 font-medium">-300 puan</span>
                        </div>
                        
                        <div className="flex items-center justify-between py-3">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">İstanbul Boğaz Turu Değerlendirmesi</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">11 Mayıs 2023</p>
                          </div>
                          <span className="text-green-600 dark:text-green-400 font-medium">+50 puan</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* İstatistikler sekmesi */}
                {activeTab === 'analytics' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Seyahat İstatistikleri</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Seyahat alışkanlıklarınız ve istatistikleriniz</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <ArrowPathIcon className="h-4 w-4 mr-2" />
                          Yenile
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                          <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl">
                            <MapPinIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Ziyaret Edilen Şehir</h3>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
                          </div>
                        </div>
                        <div className="mt-4 flex text-xs">
                          <span className="text-green-600 dark:text-green-400 flex items-center">
                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                            20% artış
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 ml-2">geçen yıla göre</span>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                          <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-xl">
                            <ClockIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Toplam Seyahat Günü</h3>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">32</p>
                          </div>
                        </div>
                        <div className="mt-4 flex text-xs">
                          <span className="text-green-600 dark:text-green-400 flex items-center">
                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                            15% artış
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 ml-2">geçen yıla göre</span>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                          <div className="p-3 bg-purple-100 dark:bg-purple-900/40 rounded-xl">
                            <TicketIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Katıldığınız Turlar</h3>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
                          </div>
                        </div>
                        <div className="mt-4 flex text-xs">
                          <span className="text-green-600 dark:text-green-400 flex items-center">
                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                            40% artış
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 ml-2">geçen yıla göre</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">En Çok Ziyaret Ettiğiniz Yerler</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-lg font-bold text-gray-900 dark:text-white mr-3">1</span>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">İstanbul</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">4 ziyaret</p>
                            </div>
                          </div>
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-lg font-bold text-gray-900 dark:text-white mr-3">2</span>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">Antalya</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">3 ziyaret</p>
                            </div>
                          </div>
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-lg font-bold text-gray-900 dark:text-white mr-3">3</span>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">Kapadokya</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">2 ziyaret</p>
                            </div>
                          </div>
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '40%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Rezervasyon Tercihleri</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Konaklama Türü</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-500 dark:text-gray-400">Otel</span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">65%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                            </div>
                          </div>
                          <div className="space-y-2 mt-4">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-500 dark:text-gray-400">Apart</span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">25%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div className="bg-green-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                            </div>
                          </div>
                          <div className="space-y-2 mt-4">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-500 dark:text-gray-400">Diğer</span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">10%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Tur Tercihleri</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-500 dark:text-gray-400">Kültürel</span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">45%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div className="bg-red-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                            </div>
                          </div>
                          <div className="space-y-2 mt-4">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-500 dark:text-gray-400">Doğa</span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">35%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                            </div>
                          </div>
                          <div className="space-y-2 mt-4">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-500 dark:text-gray-400">Macera</span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">20%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Yardım sekmesi */}
                {activeTab === 'help' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Yardım ve Destek</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sık sorulan sorular ve destek kanalları</p>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Sık Sorulan Sorular</h3>
                      <div className="space-y-4">
                        <div className="border-b border-gray-100 dark:border-gray-700 pb-4">
                          <button 
                            className="flex justify-between items-center w-full text-left"
                            onClick={() => toggleFAQ(0)}
                          >
                            <h4 className="font-medium text-gray-900 dark:text-white">Rezervasyonumu nasıl iptal edebilirim?</h4>
                            <svg 
                              className={`h-5 w-5 text-gray-500 dark:text-gray-400 transform transition-transform ${expandedFAQs.includes(0) ? 'rotate-180' : ''}`} 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          {expandedFAQs.includes(0) && (
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                              Rezervasyonunuzu iptal etmek için "Rezervasyonlarım" bölümüne gidin, iptal etmek istediğiniz rezervasyonu bulun ve "İptal Et" düğmesine tıklayın. İptal koşulları ve iade politikası, rezervasyon tipine ve zamanlamasına bağlı olarak değişiklik gösterebilir.
                            </p>
                          )}
                        </div>
                        
                        <div className="border-b border-gray-100 dark:border-gray-700 pb-4">
                          <button 
                            className="flex justify-between items-center w-full text-left"
                            onClick={() => toggleFAQ(1)}
                          >
                            <h4 className="font-medium text-gray-900 dark:text-white">Ödeme bilgilerimi nasıl güncelleyebilirim?</h4>
                            <svg 
                              className={`h-5 w-5 text-gray-500 dark:text-gray-400 transform transition-transform ${expandedFAQs.includes(1) ? 'rotate-180' : ''}`} 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          {expandedFAQs.includes(1) && (
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                              Ödeme bilgilerinizi güncellemek için "Ödeme Bilgileri" sekmesine gidin. Buradan mevcut kartlarınızı görüntüleyebilir, yeni kartlar ekleyebilir veya mevcut kartları silebilirsiniz. Yeni bir kart eklemek için "Yeni Kart Ekle" düğmesine tıklayarak gerekli bilgileri girin ve "Kartı Kaydet" düğmesine tıklayın.
                            </p>
                          )}
                        </div>
                        
                        <div className="border-b border-gray-100 dark:border-gray-700 pb-4">
                          <button 
                            className="flex justify-between items-center w-full text-left"
                            onClick={() => toggleFAQ(2)}
                          >
                            <h4 className="font-medium text-gray-900 dark:text-white">Puanlarımı nasıl kullanabilirim?</h4>
                            <svg 
                              className={`h-5 w-5 text-gray-500 dark:text-gray-400 transform transition-transform ${expandedFAQs.includes(2) ? 'rotate-180' : ''}`} 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          {expandedFAQs.includes(2) && (
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                              Puanlarınızı kullanmak için "Ödüllerim" sekmesine gidin. Burada mevcut puanlarınızı ve kullanabileceğiniz ödülleri göreceksiniz. İstediğiniz ödülün altındaki "Kullan" düğmesine tıkladığınızda, gerekli puanlar hesabınızdan düşülerek ödülünüz aktif hale gelecektir. Ödüllerinizi rezervasyon yaparken veya mevcut rezervasyonlarınız için kullanabilirsiniz.
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <button 
                            className="flex justify-between items-center w-full text-left"
                            onClick={() => toggleFAQ(3)}
                          >
                            <h4 className="font-medium text-gray-900 dark:text-white">Şifre değiştirirken sorun yaşıyorum.</h4>
                            <svg 
                              className={`h-5 w-5 text-gray-500 dark:text-gray-400 transform transition-transform ${expandedFAQs.includes(3) ? 'rotate-180' : ''}`} 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          {expandedFAQs.includes(3) && (
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                              Şifre değiştirirken sorun yaşıyorsanız, lütfen şu adımları izleyin: 1) Mevcut şifrenizi doğru girdiğinizden emin olun. 2) Yeni şifreniz en az 8 karakter uzunluğunda olmalı ve büyük harf, küçük harf, rakam ve özel karakter içermelidir. 3) Şifre değiştirme işlemi sırasında internet bağlantınızın kesintisiz olduğundan emin olun. Sorun devam ederse, lütfen destek ekibimizle iletişime geçin.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Bize Ulaşın</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl text-center">
                          <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-1">E-posta</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Sorularınız için bize yazın</p>
                          <a href="mailto:destek@turladur.com" className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
                            destek@turladur.com
                          </a>
                        </div>
                        
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl text-center">
                          <div className="inline-flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/40 rounded-xl mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-1">Telefon</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">7/24 müşteri hizmetleri</p>
                          <a href="tel:+908502123456" className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
                            0850 212 34 56
                          </a>
                        </div>
                        
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl text-center">
                          <div className="inline-flex items-center justify-center p-3 bg-purple-100 dark:bg-purple-900/40 rounded-xl mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-1">Canlı Sohbet</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Anında destek alın</p>
                          <button 
                            className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
                            onClick={() => toast.success('Canlı sohbet başlatılıyor...')}
                          >
                            Sohbet Başlat
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Yardım Bulamadınız mı?</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-4">
                        İhtiyacınız olan bilgiyi bulamadıysanız, destek ekibimiz size yardımcı olmaktan memnuniyet duyacaktır.
                      </p>
                      <button 
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700"
                        onClick={() => toast.success('Destek talebi oluşturuluyor...')}
                      >
                        Destek Talebi Oluştur
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rezervasyon Detay Modalı */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeInBg">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl animate-zoomIn">
            <div className="relative">
              <div className="h-48 w-full">
                <Image 
                  src={selectedBooking.image}
                  alt={selectedBooking.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/40 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div className="absolute bottom-4 left-6">
                <div className={`inline-block px-3 py-1 rounded-lg ${
                  selectedBooking.status === 'confirmed' ? 'bg-green-500 text-white' :
                  selectedBooking.status === 'completed' ? 'bg-gray-500 text-white' :
                  'bg-red-500 text-white'
                }`}>
                  {selectedBooking.status === 'confirmed' ? 'Onaylandı' :
                   selectedBooking.status === 'completed' ? 'Tamamlandı' :
                   'İptal Edildi'}
                </div>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedBooking.name}</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{selectedBooking.location}</p>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Rezervasyon Numarası</h3>
                  <p className="text-gray-900 dark:text-white">{selectedBooking.bookingNumber}</p>
                </div>
                {selectedBooking.type === 'hotel' ? (
                  <>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Misafir Sayısı</h3>
                      <p className="text-gray-900 dark:text-white">{selectedBooking.guests} Kişi</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Giriş Tarihi</h3>
                      <p className="text-gray-900 dark:text-white">{formatDate(selectedBooking.checkIn || '')}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Çıkış Tarihi</h3>
                      <p className="text-gray-900 dark:text-white">{formatDate(selectedBooking.checkOut || '')}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Misafir Sayısı</h3>
                      <p className="text-gray-900 dark:text-white">{selectedBooking.guests} Kişi</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Tarih</h3>
                      <p className="text-gray-900 dark:text-white">{formatDate(selectedBooking.date || '')}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Saat</h3>
                      <p className="text-gray-900 dark:text-white">{selectedBooking.time}</p>
                    </div>
                  </>
                )}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Toplam Tutar</h3>
                  <p className="text-gray-900 dark:text-white">₺{selectedBooking.price.toLocaleString('tr-TR')}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Açıklama</h3>
                <p className="text-gray-900 dark:text-white mt-1">{selectedBooking.description}</p>
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                {selectedBooking.status === 'confirmed' && (
                  <>
                    <button
                      className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => {
                        setShowModal(false);
                        toast.success('Rezervasyon değişikliği için rehbere mesaj gönderildi');
                      }}
                    >
                      Değişiklik Talebi
                    </button>
                    <button
                      className="px-4 py-2 border border-transparent rounded-xl text-white bg-red-600 hover:bg-red-700"
                      onClick={() => {
                        handleCancelBooking(selectedBooking.id);
                        setShowModal(false);
                      }}
                    >
                      Rezervasyonu İptal Et
                    </button>
                  </>
                )}
                <button
                  className="px-4 py-2 border border-transparent rounded-xl text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                  onClick={() => setShowModal(false)}
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 