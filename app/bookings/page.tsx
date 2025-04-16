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
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import { dummyBookings } from '../lib/dummy-data';
import { Booking } from '../types';
import Link from 'next/link';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import BookingCard from './components/BookingCard';
import BookingDetailsModal from './components/BookingDetailsModal';

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
      }, 1000);
    };

    if (status === 'authenticated') {
      fetchBookings();
    }
  }, [status]);

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

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="animate-spin text-blue-600">
          <ArrowPathIcon className="h-10 w-10" />
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Rezervasyonlarınızı görüntülemek için giriş yapmalısınız</h1>
          <p className="text-gray-600 mb-8">Rezervasyonlarınızı görüntülemek, yönetmek ve yeni rezervasyon yapmak için lütfen giriş yapın.</p>
          <Link 
            href="/api/auth/signin"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Başlık */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Rezervasyonlarım</h1>
          <p className="text-gray-600">Tüm rezervasyonlarınızı görüntüleyin ve yönetin</p>
        </div>
        
        {/* Filtre ve sıralama */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Durum filtresi */}
              <div className="relative group">
                <label htmlFor="status-filter" className="block text-xs font-medium text-gray-700 mb-1">
                  Durum
                </label>
                <div className="relative flex items-center">
                  <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
                    className="appearance-none block w-full pl-3 pr-10 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">Tümü</option>
                    <option value="CONFIRMED">Onaylı</option>
                    <option value="PENDING">Beklemede</option>
                    <option value="COMPLETED">Tamamlandı</option>
                    <option value="CANCELLED">İptal Edildi</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <ChevronDownIcon className="h-4 w-4" />
                  </div>
                </div>
              </div>
              
              {/* Tip filtresi */}
              <div className="relative group">
                <label htmlFor="type-filter" className="block text-xs font-medium text-gray-700 mb-1">
                  Rezervasyon Tipi
                </label>
                <div className="relative flex items-center">
                  <select
                    id="type-filter"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as FilterType)}
                    className="appearance-none block w-full pl-3 pr-10 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">Tümü</option>
                    <option value="hotel">Otel</option>
                    <option value="tour">Tur</option>
                    <option value="experience">Deneyim</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <ChevronDownIcon className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sıralama */}
            <div className="relative group">
              <label htmlFor="sort-by" className="block text-xs font-medium text-gray-700 mb-1">
                Sırala
              </label>
              <div className="relative flex items-center">
                <select
                  id="sort-by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none block w-full pl-3 pr-10 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="date-desc">Tarihe Göre (Yeniden Eskiye)</option>
                  <option value="date-asc">Tarihe Göre (Eskiden Yeniye)</option>
                  <option value="price-desc">Fiyata Göre (Yüksekten Düşüğe)</option>
                  <option value="price-asc">Fiyata Göre (Düşükten Yükseğe)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <ChevronDownIcon className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Rezervasyon listesi */}
        {sortedBookings.length > 0 ? (
          <div className="space-y-4">
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="max-w-md mx-auto">
              <Image 
                src="/images/empty-bookings.svg" 
                alt="Rezervasyon bulunamadı" 
                width={200} 
                height={200} 
                className="mx-auto mb-6" 
              />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz rezervasyonunuz bulunmuyor</h3>
              <p className="text-gray-600 mb-6">Henüz hiç rezervasyon yapmadınız veya seçtiğiniz filtrelere uygun rezervasyon bulunamadı.</p>
              <Link 
                href="/" 
                className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Keşfetmeye Başla
              </Link>
            </div>
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
    </div>
  );
} 