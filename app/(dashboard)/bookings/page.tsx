'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  ArrowPathIcon, 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon, 
  UsersIcon, 
  FunnelIcon, 
  ArrowsUpDownIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  SparklesIcon,
  ChevronDownIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import { dummyBookings } from '@/app/lib/dummy-data';
import { Booking } from '@/app/types';
import Link from 'next/link';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import BookingCard from './components/BookingCard';
import BookingDetailsModal from './components/BookingDetailsModal';
import RatePartnerModal, { ReviewableBooking } from './components/RatePartnerModal';
import { StarIcon } from '@heroicons/react/24/solid';

// Filter tipi
type FilterStatus = 'all' | 'CONFIRMED' | 'PENDING' | 'COMPLETED' | 'CANCELLED';
type FilterType = 'all' | 'hotel' | 'tour' | 'experience';
type SortOption = 'date-desc' | 'date-asc' | 'price-desc' | 'price-asc';

export default function BookingsPage() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Süresi dolmuş ve henüz partneri değerlendirilmemiş gerçek rezervasyonlar
  // (bkz. /api/user/bookings). Üstteki liste hâlâ demo verisiyle çalıştığı
  // için bu, bağımsız/gerçek bir veri kaynağıdır.
  const [reviewableBookings, setReviewableBookings] = useState<ReviewableBooking[]>([]);
  const [ratingBooking, setRatingBooking] = useState<ReviewableBooking | null>(null);

  // Filtreler
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');

  useEffect(() => {
    // Gerçek bir API'dan veri çekmek yerine dummy verileri kullanıyoruz
    // Not: Gerçek uygulamada, bu bir API çağrısı olacaktır
    const fetchBookings = () => {
      setLoading(true);
      // Kullanıcının ID'sine göre filtreleme simülasyonu
      setTimeout(() => {
        setBookings(dummyBookings);
        setLoading(false);
      }, 500);
    };

    if (status === 'authenticated') {
      fetchBookings();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    if (status !== 'authenticated') return;

    fetch('/api/user/bookings')
      .then((res) => (res.ok ? res.json() : { bookings: [] }))
      .then((data) => {
        const eligible = (data.bookings || [])
          .filter((b: any) => b.canReviewPartner)
          .map((b: any): ReviewableBooking => ({
            id: b.id,
            bookingNumber: b.bookingNumber,
            title: b.tour?.name || b.experience?.title || 'Rezervasyon',
            partnerName: b.tour?.operator?.name || b.experience?.operator?.name || 'Partner',
            type: b.tourId ? 'tour' : b.experienceId ? 'experience' : undefined,
          }));
        setReviewableBookings(eligible);
      })
      .catch(() => setReviewableBookings([]));
  }, [status]);

  const handleReviewSubmitted = (bookingId: string) => {
    setReviewableBookings((prev) => prev.filter((b) => b.id !== bookingId));
    setRatingBooking(null);
  };

  const filteredBookings = bookings.filter(booking => {
    // Durum filtrelemesi
    if (statusFilter !== 'all' && booking.status !== statusFilter) {
      return false;
    }

    // Tip filtrelemesi
    if (typeFilter !== 'all') {
      if (typeFilter === 'hotel' && !booking.hotelId) return false;
      if (typeFilter === 'tour' && !booking.tourId) return false;
      if (typeFilter === 'experience' && !booking.experienceId) return false;
    }

    return true;
  });

  // Sıralama
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      case 'date-asc':
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      case 'price-desc':
        return b.totalPrice - a.totalPrice;
      case 'price-asc':
        return a.totalPrice - b.totalPrice;
      default:
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    }
  });

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleCancelBooking = (bookingId: string) => {
    // API'ye iptal isteği gönderilecek
    toast.success('Rezervasyon iptal edildi');
    // Güncelleme yapıldığını simüle ediyoruz
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'CANCELLED' as const } 
          : booking
      )
    );
    setShowDetailsModal(false);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBookingTypeIcon = (booking: Booking) => {
    if (booking.hotelId) {
      return <BuildingOfficeIcon className="h-5 w-5 text-blue-500" />;
    } else if (booking.tourId) {
      return <GlobeAltIcon className="h-5 w-5 text-blue-500" />;
    } else if (booking.experienceId) {
      return <SparklesIcon className="h-5 w-5 text-blue-500" />;
    }
    return null;
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd MMMM yyyy', { locale: tr });
  };

  const handleClearFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
    setSortBy('date-desc'); // Optionally reset sort order too
    toast('Filtreler temizlendi');
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-16 flex items-center justify-center">
        <div className="flex flex-col items-center text-neutral-500">
          <ArrowPathIcon className="h-10 w-10 animate-spin text-sky-600" />
          <p className="mt-3 text-sm">Rezervasyonlar yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-neutral-50 pt-20">
        <div className="max-w-lg mx-auto px-4 py-16 text-center bg-white rounded-xl border border-neutral-200/50 shadow-sm">
          <h1 className="text-xl font-semibold text-neutral-900 mb-3">Erişim Reddedildi</h1>
          <p className="text-neutral-600 mb-6">Rezervasyonlarınızı görüntülemek ve yönetmek için lütfen giriş yapın.</p>
          <Link 
            href="/api/auth/signin"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-sky-600 text-white text-sm font-semibold rounded-lg hover:bg-sky-700 transition-colors shadow-sm active:scale-[0.98]"
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-6 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        {/* Başlık */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900">Rezervasyonlarım</h1>
          <p className="text-sm text-neutral-600 mt-1">Tüm geçmiş, güncel ve gelecek rezervasyonlarınızı buradan yönetebilirsiniz.</p>
        </div>
        
        {/* Değerlendirme bekleyen rezervasyonlar */}
        {reviewableBookings.length > 0 && (
          <div className="bg-amber-50 border border-amber-200/70 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <StarIcon className="h-5 w-5 text-amber-500" />
              <h2 className="text-sm font-semibold text-amber-900">Değerlendirmenizi Bekleyen Rezervasyonlar</h2>
            </div>
            <div className="space-y-2">
              {reviewableBookings.map((rb) => (
                <div
                  key={rb.id}
                  className="flex items-center justify-between gap-3 bg-white rounded-lg border border-amber-100 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">{rb.title}</p>
                    <p className="text-xs text-neutral-500 truncate">{rb.partnerName}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRatingBooking(rb)}
                    className="shrink-0 inline-flex items-center px-3 py-1.5 bg-amber-500 text-white text-xs font-semibold rounded-lg hover:bg-amber-600 transition-colors"
                  >
                    {rb.type === 'experience' ? 'Aktiviteyi Değerlendir' : 'Turu Değerlendir'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filtre ve sıralama */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200/50 p-5 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-4 gap-y-5">
            
            {/* Status Filter (Button Group) */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Durum
              </label>
              <div className="flex flex-wrap gap-2">
                {([
                  { key: 'all', label: 'Tümü' },
                  { key: 'CONFIRMED', label: 'Onaylı' },
                  { key: 'PENDING', label: 'Beklemede' },
                  { key: 'COMPLETED', label: 'Tamamlandı' },
                  { key: 'CANCELLED', label: 'İptal Edildi' },
                ] as { key: FilterStatus; label: string }[]).map(statusOpt => (
                  <button
                    key={statusOpt.key}
                    type="button"
                    onClick={() => setStatusFilter(statusOpt.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${ 
                      statusFilter === statusOpt.key
                        ? 'bg-sky-100 text-sky-700 border-sky-200 ring-1 ring-sky-200'
                        : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300'
                    }`}
                  >
                    {statusOpt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter (Button Group) - Combined with Sort for layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5 items-end">
               <div>
                 <label className="block text-sm font-medium text-neutral-700 mb-2">
                   Rezervasyon Tipi
                 </label>
                 <div className="flex flex-wrap gap-2">
                    {([
                      { key: 'all', label: 'Tümü' },
                      { key: 'hotel', label: 'Otel' },
                      { key: 'tour', label: 'Tur' },
                      { key: 'experience', label: 'Deneyim' },
                    ] as { key: FilterType; label: string }[]).map(typeOpt => (
                      <button
                        key={typeOpt.key}
                        type="button"
                        onClick={() => setTypeFilter(typeOpt.key)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${ 
                          typeFilter === typeOpt.key
                            ? 'bg-sky-100 text-sky-700 border-sky-200 ring-1 ring-sky-200'
                            : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300'
                        }`}
                      >
                        {typeOpt.label}
                      </button>
                    ))}
                  </div>
               </div>

              {/* Sort By (Dropdown) */}
              <div>
                <label htmlFor="sort-by" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Sırala
                </label>
                <div className="relative">
                  <select
                    id="sort-by"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="block w-full text-neutral-700 appearance-none rounded-md border-neutral-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm pl-3 pr-10 py-2"
                  >
                    <option value="date-desc">Tarih (Yeni)</option>
                    <option value="date-asc">Tarih (Eski)</option>
                    <option value="price-desc">Fiyat (Yüksek)</option>
                    <option value="price-asc">Fiyat (Düşük)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-400">
                    <ChevronDownIcon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Clear Filters Button */}
            {(statusFilter !== 'all' || typeFilter !== 'all' || sortBy !== 'date-desc') && (
              <div className="lg:col-span-3 flex justify-end mt-3">
                <button 
                  type="button"
                  onClick={handleClearFilters}
                  className="inline-flex items-center text-xs font-medium text-neutral-500 hover:text-sky-600 transition-colors"
                >
                  <XMarkIcon className="h-4 w-4 mr-1" />
                  Filtreleri Temizle
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Rezervasyon listesi */}
        {sortedBookings.length > 0 ? (
          <div className="space-y-5">
            {sortedBookings.map((booking) => (
              <BookingCard 
                key={booking.id}
                booking={booking}
                onViewDetails={handleViewDetails}
                onCancelBooking={handleCancelBooking}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-white rounded-xl border border-dashed border-neutral-200 mt-8">
             <div className="p-3 bg-neutral-100 rounded-full mb-4">
               <CalendarIcon className="h-8 w-8 text-neutral-400" /> 
             </div>
             <h3 className="text-lg font-semibold text-neutral-700">Rezervasyon Bulunamadı</h3>
             <p className="mt-1 text-neutral-500 text-sm max-w-xs mb-6">Seçtiğiniz filtrelere uygun rezervasyon bulunamadı veya henüz rezervasyon yapmadınız.</p>
             <Link 
               href="/"
               className="inline-flex items-center justify-center px-5 py-2.5 bg-sky-600 text-white text-sm font-semibold rounded-lg hover:bg-sky-700 transition-colors shadow-sm active:scale-[0.98]"
             >
               Yeni Rezervasyon Yap
             </Link>
           </div>
        )}
      </div>
      
      {/* Rezervasyon detayları modal */}
      {selectedBooking && (
        <BookingDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          booking={selectedBooking}
          onCancelBooking={handleCancelBooking}
        />
      )}

      {/* Partner değerlendirme modalı */}
      {ratingBooking && (
        <RatePartnerModal
          booking={ratingBooking}
          onClose={() => setRatingBooking(null)}
          onSubmitted={handleReviewSubmitted}
        />
      )}
    </div>
  );
} 