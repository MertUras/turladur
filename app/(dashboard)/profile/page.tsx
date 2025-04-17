'use client';

import React, { useState, useEffect } from 'react';
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
  const [expandedFAQs, setExpandedFAQs] = useState<number[]>([]);
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

  const toggleFAQ = (index: number) => {
    setExpandedFAQs(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
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

                {activeTab === 'help' && <HelpTab />}
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
