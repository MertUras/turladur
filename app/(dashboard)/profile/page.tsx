'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  UserCircleIcon, KeyIcon, BellIcon, CreditCardIcon, CameraIcon, ShieldCheckIcon, 
  CalendarIcon, HeartIcon, QuestionMarkCircleIcon, TicketIcon, MapPinIcon, 
  ClockIcon, TrashIcon, StarIcon, FunnelIcon, ArrowsUpDownIcon, PlusIcon, 
  EllipsisVerticalIcon, ArrowPathIcon, UsersIcon, PencilIcon, XMarkIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

// Component imports (Assuming these will be refactored separately)
import ProfileInfoTab from './components/ProfileInfoTab';
import BookingsTab from './components/BookingsTab';
import FavoritesTab from './components/FavoritesTab';
import PaymentTab from './components/PaymentTab';
import NotificationsTab from './components/NotificationsTab';
import SecurityTab from './components/SecurityTab';
import HelpTab from './components/HelpTab';
import ReviewsTab from './components/ReviewsTab';
import RatePartnerModal, { ReviewableBooking } from '../bookings/components/RatePartnerModal';
import SpecialRequirementsSection from '@/app/components/booking/SpecialRequirementsSection';
import { parseJsonArray } from '@/lib/utils';
import {
  countPendingPartnerReviews,
  extractBookingSpecialConditions,
} from '@/lib/user/bookings';

interface Booking {
  id: string;
  type: 'hotel' | 'tour' | 'experience';
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
  // Partner değerlendirmesi (müşteri değerlendirmelerinden otomatik hesaplanan
  // üyelik seviyesi sistemi) için gerekli alanlar. Sadece tur/aktivite
  // rezervasyonlarında dolu gelir; otel rezervasyonlarında partner review
  // kavramı yoktur.
  partnerName?: string;
  canReviewPartner?: boolean;
  partnerReviewRating?: number;
  specialConditionsSummary?: string[];
  displayDateLabel?: string;
  reviewGroupBookingCount?: number;
  reviewGroupGuestCount?: number;
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
  
  // Rezervasyonlar artık dummy veri değil, /api/user/bookings'ten gelen
  // GERÇEK rezervasyonlardır (bkz. fetchBookings useEffect'i aşağıda).
  const [bookings, setBookings] = useState<Record<string, Booking[]>>({
    upcoming: [],
    past: [],
    cancelled: []
  });
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [pendingReviewCount, setPendingReviewCount] = useState(0);
  const [ratingBooking, setRatingBooking] = useState<ReviewableBooking | null>(null);
  const savedCardsRef = useRef(savedCards);
  const expiredToastShownRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    savedCardsRef.current = savedCards;
  }, [savedCards]);

  const fetchBookings = () => {
    setBookingsLoading(true);
    fetch('/api/user/bookings')
      .then((res) => (res.ok ? res.json() : { bookings: [] }))
      .then((data) => {
        const now = new Date();
        const buckets: Record<string, Booking[]> = { upcoming: [], past: [], cancelled: [] };

        (data.bookings || []).forEach((b: any) => {
          const type: Booking['type'] = b.hotelId ? 'hotel' : b.tourId ? 'tour' : 'experience';
          const name = b.hotel?.name || b.tour?.name || b.experience?.title || 'Rezervasyon';
          const hotelImages = parseJsonArray<string>(b.hotel?.images);
          const tourImages = parseJsonArray<string>(b.tour?.images);
          const image = tourImages[0] || b.experience?.imageUrl || hotelImages[0] || null;
          const specialConditionsSummary = extractBookingSpecialConditions({
            metadata: b.metadata,
            specialRequests: b.specialRequests,
          });

          const mapped: Booking = {
            id: b.id,
            type,
            name,
            image: image || 'https://placehold.co/800x600/e5e7eb/6b7280?text=G%C3%B6rsel+Yok',
            checkIn: type === 'hotel' ? b.startDate : undefined,
            checkOut: type === 'hotel' ? b.endDate : undefined,
            date: type !== 'hotel' ? b.startDate : undefined,
            time: undefined,
            guests: (b.adults || 0) + (b.children || 0) || 1,
            status: b.status === 'CANCELLED' ? 'cancelled' : b.status === 'COMPLETED' ? 'completed' : 'confirmed',
            price: b.totalPrice,
            location: 'Türkiye',
            bookingNumber: b.bookingNumber,
            partnerName:
              b.operatorName || b.tour?.operator?.name || b.experience?.operator?.name || undefined,
            canReviewPartner: Boolean(b.canReviewPartner),
            partnerReviewRating: b.partnerReview?.rating,
            specialConditionsSummary:
              specialConditionsSummary.length > 0 ? specialConditionsSummary : undefined,
            displayDateLabel: b.displayDateLabel || undefined,
            reviewGroupBookingCount: b.reviewGroupBookingCount || undefined,
            reviewGroupGuestCount: b.reviewGroupGuestCount || undefined,
          };

          if (b.status === 'CANCELLED') {
            buckets.cancelled.push(mapped);
          } else if (mapped.status === 'completed' || new Date(b.endDate) < now) {
            buckets.past.push({ ...mapped, status: 'completed' });
          } else {
            buckets.upcoming.push(mapped);
          }
        });

        setBookings(buckets);
        setPendingReviewCount(countPendingPartnerReviews(data.bookings || []));
      })
      .catch(() => {
        setBookings({ upcoming: [], past: [], cancelled: [] });
        setPendingReviewCount(0);
      })
      .finally(() => setBookingsLoading(false));
  };

  useEffect(() => {
    if (session?.user) {
      fetchBookings();
    }
  }, [session]);

  const reviewableBookings = useMemo(
    () =>
      [...bookings.past, ...bookings.upcoming, ...bookings.cancelled]
        .filter((booking) => booking.canReviewPartner)
        .map(
          (booking): ReviewableBooking => ({
            id: booking.id,
            bookingNumber: booking.bookingNumber,
            title: booking.name,
            partnerName: booking.partnerName || 'Partner',
            type: booking.type === 'experience' ? 'experience' : 'tour',
            displayDateLabel: booking.displayDateLabel,
            guestCount: booking.reviewGroupGuestCount ?? booking.guests,
            reviewGroupBookingCount: booking.reviewGroupBookingCount,
          })
        ),
    [bookings]
  );

  const handleOpenRatePartner = (booking: ReviewableBooking) => {
    setRatingBooking(booking);
  };

  const handleReviewSubmitted = (bookingId: string) => {
    setBookings((prev) => ({
      ...prev,
      past: prev.past.map((b) => (b.id === bookingId ? { ...b, canReviewPartner: false } : b)),
    }));
    setPendingReviewCount((prev) => Math.max(0, prev - 1));
    setRatingBooking(null);
    toast.success('Değerlendirmeniz kaydedildi');
  };

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

  useEffect(() => {
    if (!mounted) return;

    const checkCardExpiry = () => {
      const currentDate = new Date();
      const toNotify: { id: number; type: string; lastFour: string }[] = [];

      const updatedCards = savedCardsRef.current.map((card) => {
        const [month, year] = card.expiry.split('/');
        const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
        const isExpired = expiryDate < currentDate;

        if (isExpired && !card.isExpired && !expiredToastShownRef.current.has(card.id)) {
          toNotify.push({ id: card.id, type: card.type, lastFour: card.lastFour });
        }

        return { ...card, isExpired };
      });

      setSavedCards(updatedCards);

      if (toNotify.length > 0) {
        queueMicrotask(() => {
          toNotify.forEach(({ id, type, lastFour }) => {
            if (expiredToastShownRef.current.has(id)) return;
            expiredToastShownRef.current.add(id);
            toast.error(`"${type} **** ${lastFour}" kartınızın süresi doldu.`);
          });
        });
      }
    };

    checkCardExpiry();
    const interval = setInterval(checkCardExpiry, 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, [mounted]);

  const formatDate = (dateString: string) => {
    if (!mounted || !dateString) return '-';
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

  const handleCancelBooking = (bookingId: string) => {
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
    const updatedFavorites = {
      ...favorites,
      [item.type === 'hotel' ? 'hotels' : 'tours']: favorites[item.type === 'hotel' ? 'hotels' : 'tours'].filter(fav => fav.id !== item.id)
    };
    setFavorites(updatedFavorites);
    toast.success(`${item.name} favorilerden kaldırıldı`);
  };

  return (
    <main className="min-h-screen bg-neutral-50 pt-16 md:pt-20 pb-12 md:pb-16 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 md:mb-10">
          <h1 className="text-3xl font-bold text-neutral-900">Profilim</h1>
          <p className="text-neutral-600 mt-1">Hesap bilgilerinizi yönetin ve rezervasyonlarınızı takip edin.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-neutral-200/50">
              <div className="p-5 flex flex-col items-center border-b border-neutral-100">
                <div className="relative group mb-3">
                  <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-neutral-100 shadow-sm">
                    <Image
                      src={session?.user?.image || "https://avatar.vercel.sh/" + (user?.email || 'default') }
                      alt="Profil fotoğrafı"
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <button 
                    className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100 focus:outline-none"
                    title="Profil fotoğrafını değiştir"
                  >
                    <CameraIcon className="h-5 w-5 text-white" />
                  </button>
                </div>
                <h2 className="text-lg font-semibold text-neutral-900 text-center">{user?.name || 'İsimsiz Kullanıcı'}</h2>
                <p className="text-sm text-neutral-500 text-center mt-0.5">{user?.email}</p>
              </div>
              
              <nav className="p-3 space-y-1">
                {[
                  { key: 'profile', label: 'Profil Bilgileri', icon: UserCircleIcon },
                  { key: 'bookings', label: 'Rezervasyonlarım', icon: CalendarIcon },
                  { key: 'reviews', label: 'Değerlendirmelerim', icon: ChatBubbleLeftRightIcon },
                  { key: 'favorites', label: 'Favorilerim', icon: HeartIcon },
                  { key: 'payment', label: 'Ödeme Bilgileri', icon: CreditCardIcon },
                  { key: 'security', label: 'Güvenlik', icon: KeyIcon },
                  { key: 'notifications', label: 'Bildirimler', icon: BellIcon },
                  { key: 'help', label: 'Yardım', icon: QuestionMarkCircleIcon },
                ].map(item => (
                  <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                      activeTab === item.key
                        ? 'bg-sky-50 text-sky-700'
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 mr-2.5 flex-shrink-0 ${
                      activeTab === item.key ? 'text-sky-600' : 'text-neutral-400'
                    }`} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.key === 'reviews' && pendingReviewCount > 0 && (
                      <span
                        className="ml-2 inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full bg-amber-500 text-white text-[11px] font-semibold leading-none"
                        aria-label={`${pendingReviewCount} bekleyen değerlendirme`}
                      >
                        {pendingReviewCount > 99 ? '99+' : pendingReviewCount}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-9">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-neutral-200/50">
              <div className="p-6 md:p-8">
                {activeTab === 'profile' && <ProfileInfoTab user={user} />}

                {activeTab === 'bookings' && (
                  <BookingsTab
                    bookings={bookings}
                    loading={bookingsLoading}
                    pendingReviewBookings={reviewableBookings}
                    onViewDetails={handleViewBookingDetails}
                    onCancelBooking={handleCancelBooking}
                    onRatePartner={(booking) =>
                      handleOpenRatePartner({
                        id: booking.id,
                        bookingNumber: booking.bookingNumber,
                        title: booking.name,
                        partnerName: booking.partnerName || 'Partner',
                        type: booking.type === 'experience' ? 'experience' : 'tour',
                        displayDateLabel: booking.displayDateLabel,
                        guestCount: booking.reviewGroupGuestCount ?? booking.guests,
                        reviewGroupBookingCount: booking.reviewGroupBookingCount,
                      })
                    }
                    onRatePendingPartner={handleOpenRatePartner}
                    formatDate={formatDate}
                  />
                )}

                {activeTab === 'reviews' && (
                  <ReviewsTab
                    pendingReviewBookings={reviewableBookings}
                    onRatePartner={handleOpenRatePartner}
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
      
      {showModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transition-transform duration-300 ease-in-out scale-95 group-hover:scale-100">
            <div className="p-5 border-b border-neutral-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold text-neutral-900">Rezervasyon Detayları</h3>
              <button onClick={() => setShowModal(false)} className="text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 p-1 rounded-full transition-colors">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-5">
                <div className="relative h-48 md:h-56 rounded-lg overflow-hidden">
                  <Image 
                    src={selectedBooking.image} 
                    alt={selectedBooking.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 640px"
                    className="object-cover"
                  />
                </div>
                
                <div>
                  <h2 className="text-xl font-bold text-neutral-900 mb-1">{selectedBooking.name}</h2>
                  <p className="text-neutral-600 text-sm">{selectedBooking.description || 'Açıklama bulunmuyor.'}</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-t border-b border-neutral-100">
                  <div>
                    <p className="text-xs text-neutral-500 mb-0.5">Rezervasyon No</p>
                    <p className="font-medium text-neutral-800">#{selectedBooking.bookingNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 mb-0.5">Durum</p>
                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-md ${ 
                      selectedBooking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : selectedBooking.status === 'completed'
                          ? 'bg-sky-100 text-sky-700 border border-sky-200'
                          : 'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {selectedBooking.status === 'confirmed' ? 'Onaylandı' : selectedBooking.status === 'completed' ? 'Tamamlandı' : 'İptal Edildi'}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 mb-0.5">Konum</p>
                    <p className="font-medium text-neutral-800">{selectedBooking.location}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 mb-0.5">Misafir Sayısı</p>
                    <p className="font-medium text-neutral-800">{selectedBooking.guests} Kişi</p>
                  </div>
                  
                  {selectedBooking.type === 'hotel' ? (
                    <>
                      <div>
                        <p className="text-xs text-neutral-500 mb-0.5">Giriş Tarihi</p>
                        <p className="font-medium text-neutral-800">{formatDate(selectedBooking.checkIn || '')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 mb-0.5">Çıkış Tarihi</p>
                        <p className="font-medium text-neutral-800">{formatDate(selectedBooking.checkOut || '')}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-xs text-neutral-500 mb-0.5">Tarih</p>
                        <p className="font-medium text-neutral-800">{formatDate(selectedBooking.date || '')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 mb-0.5">Saat</p>
                        <p className="font-medium text-neutral-800">{selectedBooking.time || '-'}</p>
                      </div>
                    </>
                  )}
                </div>
                
                {selectedBooking.specialConditionsSummary && (
                  <SpecialRequirementsSection summary={selectedBooking.specialConditionsSummary} />
                )}

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                  <div>
                    <p className="text-xs text-neutral-500">Toplam Tutar</p>
                    <p className="text-xl font-bold text-neutral-900">{selectedBooking.price.toLocaleString('tr-TR')} ₺</p>
                  </div>
                  
                  {selectedBooking.status === 'confirmed' && (
                    <button
                      onClick={() => {
                        handleCancelBooking(selectedBooking.id);
                        setShowModal(false);
                      }}
                      className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                    >
                      Rezervasyonu İptal Et
                    </button>
                  )}
                  
                  {(selectedBooking.status === 'completed' || selectedBooking.status === 'cancelled') && (
                    <button
                      onClick={() => setShowModal(false)}
                      className="w-full sm:w-auto px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-sm font-medium rounded-lg transition-colors border border-neutral-200"
                    >
                      Kapat
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Partner değerlendirme modalı */}
      {ratingBooking && (
        <RatePartnerModal
          booking={ratingBooking}
          onClose={() => setRatingBooking(null)}
          onSubmitted={handleReviewSubmitted}
        />
      )}
    </main> 
  );
} 
