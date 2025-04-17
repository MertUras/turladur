'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UserCircleIcon, KeyIcon, BellIcon, CreditCardIcon, CameraIcon, ShieldCheckIcon, UserGroupIcon, ChartBarIcon, GiftIcon, QuestionMarkCircleIcon, CalendarIcon, HeartIcon, BuildingOfficeIcon, TicketIcon, MapPinIcon, ClockIcon, TrashIcon, StarIcon, FunnelIcon, ArrowsUpDownIcon, PlusIcon, EllipsisVerticalIcon, ArrowPathIcon, UsersIcon, MapPinIcon as LocationMarkerIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

// Component importları
import ProfileInfoTab from './components/ProfileInfoTab';
import BookingsTab from './components/BookingsTab';
import FavoritesTab from './components/FavoritesTab';
import PaymentTab from './components/PaymentTab';
import NotificationsTab from './components/NotificationsTab';
import SecurityTab from './components/SecurityTab';
import HelpTab from './components/HelpTab';

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
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [mounted, setMounted] = useState(false);
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
  
  // Rezervasyon ve favoriler için state'ler
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

  const handleSaveCard = (newCard: Omit<Card, 'id'>) => {
    const cardWithId = { ...newCard, id: Date.now() };
    setSavedCards(prev => [...prev, cardWithId]);
    toast.success('Kart başarıyla kaydedildi');
  };

  const handleDeleteCard = (cardId: number) => {
    setSavedCards(prev => prev.filter(card => card.id !== cardId));
    toast.success('Kart başarıyla silindi');
  };

  const handleCancelBooking = (bookingId: number) => {
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
    toast(`Rezervasyon #${bookingId} iptal edildi`, { icon: '🗑️' });
  };

  const handleViewBookingDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleToggleFavorite = (item: FavoriteItem) => {
    // Favori listesinden öğeyi kaldıralım
    const updatedFavorites = {
      ...favorites,
      [item.type === 'hotel' ? 'hotels' : 'tours']: favorites[item.type === 'hotel' ? 'hotels' : 'tours'].filter(fav => fav.id !== item.id)
    };
    setFavorites(updatedFavorites);
    toast.success(`${item.name} favorilerden kaldırıldı`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profil başlık kısmı */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profilim</h1>
          <p className="text-gray-600 dark:text-gray-400">Hesap bilgilerinizi yönetin ve rezervasyonlarınızı takip edin</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sol Sidebar - Kullanıcı bilgileri ve menü */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow border border-gray-100 dark:border-gray-700">
              {/* Kullanıcı profil kartı */}
              <div className="p-5 flex flex-col items-center">
                <div className="relative group">
                  <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow">
                    <Image
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt="Profil fotoğrafı"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button 
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    title="Profil fotoğrafını değiştir"
                  >
                    <CameraIcon className="h-5 w-5 text-white" />
                  </button>
                </div>
                <h2 className="mt-3 text-xl font-semibold text-gray-900 dark:text-white">{user?.name || 'İsimsiz Kullanıcı'}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
                <div className="mt-1 flex items-center text-xs text-green-600 dark:text-green-400">
                  <ShieldCheckIcon className="h-3 w-3 mr-1" />
                  <span>Doğrulanmış</span>
                </div>
              </div>
              
              {/* Menü */}
              <nav className="mt-1 space-y-1 p-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-lg ${
                    activeTab === 'profile'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                  }`}
                >
                  <UserCircleIcon className="h-5 w-5 mr-2" />
                  Profil Bilgileri
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-lg ${
                    activeTab === 'bookings'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                  }`}
                >
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  Rezervasyonlarım
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-lg ${
                    activeTab === 'favorites'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                  }`}
                >
                  <HeartIcon className="h-5 w-5 mr-2" />
                  Favorilerim
                </button>
                <button
                  onClick={() => setActiveTab('payment')}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-lg ${
                    activeTab === 'payment'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                  }`}
                >
                  <CreditCardIcon className="h-5 w-5 mr-2" />
                  Ödeme Bilgileri
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-lg ${
                    activeTab === 'security'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                  }`}
                >
                  <KeyIcon className="h-5 w-5 mr-2" />
                  Güvenlik
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-lg ${
                    activeTab === 'notifications'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                  }`}
                >
                  <BellIcon className="h-5 w-5 mr-2" />
                  Bildirimler
                </button>
                <button
                  onClick={() => setActiveTab('help')}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-lg ${
                    activeTab === 'help'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                  }`}
                >
                  <QuestionMarkCircleIcon className="h-5 w-5 mr-2" />
                  Yardım
                </button>
              </nav>
            </div>
          </div>

          {/* Sağ İçerik - İçerik alanı */}
          <div className="lg:col-span-9">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
              {/* İçerik burada gelecek */}
              <div className="p-6">
                {activeTab === 'profile' && <ProfileInfoTab user={user} />}

                {activeTab === 'bookings' && (
                  <BookingsTab
                    bookings={bookings}
                    onViewDetails={handleViewBookingDetails}
                    onCancelBooking={handleCancelBooking}
                    formatDate={formatDate}
                  />
                )}

                {activeTab === 'favorites' && (
                  <FavoritesTab
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                  />
                )}

                {activeTab === 'payment' && (
                  <PaymentTab
                    savedCards={savedCards}
                    onSaveCard={handleSaveCard}
                    onDeleteCard={handleDeleteCard}
                    cardTypes={CARD_TYPES}
                  />
                )}

                {activeTab === 'security' && <SecurityTab />}

                {activeTab === 'notifications' && <NotificationsTab />}

<<<<<<< HEAD
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
=======
                {activeTab === 'help' && <HelpTab />}
>>>>>>> 014a45a92be15951aae5e3ec164b73d77538c273
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Rezervasyon detayları modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Rezervasyon Detayları</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5">
              <div className="space-y-4">
                <div className="relative h-56 rounded-lg overflow-hidden">
                  <Image 
                    src={selectedBooking.image} 
                    alt={selectedBooking.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedBooking.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400">{selectedBooking.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Rezervasyon No</p>
                    <p className="font-medium text-gray-900 dark:text-white">#{selectedBooking.bookingNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Durum</p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      selectedBooking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300' 
                        : selectedBooking.status === 'completed'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300'
                    }`}>
                      {selectedBooking.status === 'confirmed' 
                        ? 'Onaylandı' 
                        : selectedBooking.status === 'completed'
                          ? 'Tamamlandı'
                          : 'İptal Edildi'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Konum</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedBooking.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Misafir Sayısı</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedBooking.guests} Kişi</p>
                  </div>
                  
                  {selectedBooking.type === 'hotel' ? (
                    <>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Giriş Tarihi</p>
                        <p className="font-medium text-gray-900 dark:text-white">{formatDate(selectedBooking.checkIn || '')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Çıkış Tarihi</p>
                        <p className="font-medium text-gray-900 dark:text-white">{formatDate(selectedBooking.checkOut || '')}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Tarih</p>
                        <p className="font-medium text-gray-900 dark:text-white">{formatDate(selectedBooking.date || '')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Saat</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedBooking.time}</p>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Toplam Tutar</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{selectedBooking.price.toLocaleString('tr-TR')} ₺</p>
                  </div>
                  
                  {selectedBooking.status === 'confirmed' && (
                    <button
                      onClick={() => {
                        handleCancelBooking(selectedBooking.id);
                        setShowModal(false);
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                    >
                      Rezervasyonu İptal Et
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
