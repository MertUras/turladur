'use client';

import Link from 'next/link';
import { useMemo, useState, useEffect } from 'react';
import type { Reservation } from '@turladur/shared-types';
import { Calendar, ChevronDown, RefreshCw, X } from 'lucide-react';

import {
  BookingCard,
  type BookingCardModel,
} from '@/components/features/booking/booking-card';
import { BookingDetailsModal } from '@/components/features/booking/booking-details-modal';
import { listReservations } from '@/services/booking';
import { useAuth } from '@/providers/auth-provider';

type FilterStatus = 'all' | 'CONFIRMED' | 'PENDING' | 'COMPLETED' | 'CANCELLED';
type FilterType = 'all' | 'hotel' | 'tour' | 'experience';
type SortOption = 'date-desc' | 'date-asc' | 'price-desc' | 'price-asc';

function mapReservation(r: Reservation): BookingCardModel & {
  paymentStatus?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
} {
  return {
    id: r.id,
    bookingNumber: r.bookingNumber,
    status: r.status,
    tourId: r.tourId,
    hotelId: r.hotelId,
    experienceId: r.experienceId,
    productTitle: r.tourId
      ? `Tur · ${r.bookingNumber}`
      : r.experienceId
        ? `Aktivite · ${r.bookingNumber}`
        : r.hotelId
          ? `Otel · ${r.bookingNumber}`
          : r.bookingNumber,
    startDate: r.createdAt,
    endDate: r.updatedAt,
    adults: r.adults,
    children: r.children,
    totalPrice: Number(r.totalAmount) || 0,
    currency: r.currency || 'TRY',
    contactEmail: r.contactEmail,
    contactPhone: r.contactPhone,
    paymentStatus:
      r.status === 'CONFIRMED' || r.status === 'COMPLETED' ? 'PAID' : 'PENDING',
  };
}

function matchesStatusFilter(status: string, filter: FilterStatus) {
  if (filter === 'all') return true;
  if (filter === 'PENDING') {
    return status === 'PENDING' || status === 'PENDING_PAYMENT';
  }
  return status === filter;
}

export function BookingsPageClient() {
  const { isAuthenticated, accessToken } = useAuth();
  const [items, setItems] = useState<Reservation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [selectedBooking, setSelectedBooking] = useState<ReturnType<
    typeof mapReservation
  > | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [cancelledIds, setCancelledIds] = useState<Set<string>>(new Set());

  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');

  const load = async (refresh = false) => {
    if (!accessToken) return;
    if (refresh) setIsRefreshing(true);
    else setLoading(true);
    try {
      const data = await listReservations(accessToken);
      setItems(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Yüklenemedi');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      setLoading(false);
      return;
    }
    void load(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial load on auth
  }, [isAuthenticated, accessToken]);

  const bookings = useMemo(
    () =>
      items.map((r) => {
        const mapped = mapReservation(r);
        if (cancelledIds.has(mapped.id)) {
          return { ...mapped, status: 'CANCELLED' };
        }
        return mapped;
      }),
    [items, cancelledIds],
  );

  const filteredBookings = bookings.filter((booking) => {
    if (!matchesStatusFilter(booking.status, statusFilter)) return false;
    if (typeFilter !== 'all') {
      if (typeFilter === 'hotel' && !booking.hotelId) return false;
      if (typeFilter === 'tour' && !booking.tourId) return false;
      if (typeFilter === 'experience' && !booking.experienceId) return false;
    }
    return true;
  });

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return (
          new Date(b.startDate || 0).getTime() -
          new Date(a.startDate || 0).getTime()
        );
      case 'date-asc':
        return (
          new Date(a.startDate || 0).getTime() -
          new Date(b.startDate || 0).getTime()
        );
      case 'price-desc':
        return b.totalPrice - a.totalPrice;
      case 'price-asc':
        return a.totalPrice - b.totalPrice;
      default:
        return (
          new Date(b.startDate || 0).getTime() -
          new Date(a.startDate || 0).getTime()
        );
    }
  });

  const handleViewDetails = (booking: BookingCardModel) => {
    setSelectedBooking(booking as ReturnType<typeof mapReservation>);
    setShowDetailsModal(true);
  };

  const handleCancelBooking = (bookingId: string) => {
    setCancelledIds((prev) => new Set(prev).add(bookingId));
    setShowDetailsModal(false);
  };

  const handleClearFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
    setSortBy('date-desc');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-20">
        <div className="max-w-lg mx-auto px-4 py-16 text-center bg-white rounded-xl border border-neutral-200/50 shadow-sm">
          <h1 className="text-xl font-semibold text-neutral-900 mb-3">
            Erişim Reddedildi
          </h1>
          <p className="text-neutral-600 mb-6">
            Rezervasyonlarınızı görüntülemek ve yönetmek için lütfen giriş
            yapın.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-sky-600 text-white text-sm font-semibold rounded-lg hover:bg-sky-700 transition-colors shadow-sm active:scale-[0.98]"
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-16 flex items-center justify-center">
        <div className="flex flex-col items-center text-neutral-500">
          <RefreshCw className="h-10 w-10 animate-spin text-sky-600" />
          <p className="mt-3 text-sm">Rezervasyonlar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-6 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">
              Rezervasyonlarım
            </h1>
            <p className="text-sm text-neutral-600 mt-1">
              Tüm geçmiş, güncel ve gelecek rezervasyonlarınızı buradan
              yönetebilirsiniz.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isRefreshing ? (
              <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                <RefreshCw className="h-4 w-4 animate-spin text-sky-600" />
                Güncelleniyor...
              </div>
            ) : (
              <button
                type="button"
                onClick={() => void load(true)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-sky-600"
              >
                <RefreshCw className="h-4 w-4" />
                Yenile
              </button>
            )}
          </div>
        </div>

        {error ? (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="bg-white rounded-xl shadow-sm border border-neutral-200/50 p-5 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-4 gap-y-5">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Durum
              </label>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { key: 'all', label: 'Tümü' },
                    { key: 'CONFIRMED', label: 'Onaylı' },
                    { key: 'PENDING', label: 'Beklemede' },
                    { key: 'COMPLETED', label: 'Tamamlandı' },
                    { key: 'CANCELLED', label: 'İptal Edildi' },
                  ] as { key: FilterStatus; label: string }[]
                ).map((statusOpt) => (
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5 items-end">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Rezervasyon Tipi
                </label>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      { key: 'all', label: 'Tümü' },
                      { key: 'hotel', label: 'Otel' },
                      { key: 'tour', label: 'Tur' },
                      { key: 'experience', label: 'Deneyim' },
                    ] as { key: FilterType; label: string }[]
                  ).map((typeOpt) => (
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

              <div>
                <label
                  htmlFor="sort-by"
                  className="block text-sm font-medium text-neutral-700 mb-1.5"
                >
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
                    <ChevronDown className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>

            {(statusFilter !== 'all' ||
              typeFilter !== 'all' ||
              sortBy !== 'date-desc') && (
              <div className="lg:col-span-3 flex justify-end mt-3">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="inline-flex items-center text-xs font-medium text-neutral-500 hover:text-sky-600 transition-colors"
                >
                  <X className="h-4 w-4 mr-1" />
                  Filtreleri Temizle
                </button>
              </div>
            )}
          </div>
        </div>

        {sortedBookings.length > 0 ? (
          <div className="space-y-5">
            {sortedBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-white rounded-xl border border-dashed border-neutral-200 mt-8">
            <div className="p-3 bg-neutral-100 rounded-full mb-4">
              <Calendar className="h-8 w-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-700">
              Rezervasyon Bulunamadı
            </h3>
            <p className="mt-1 text-neutral-500 text-sm max-w-xs mb-6">
              Seçtiğiniz filtrelere uygun rezervasyon bulunamadı veya henüz
              rezervasyon yapmadınız.
            </p>
            <Link
              href="/tours"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-sky-600 text-white text-sm font-semibold rounded-lg hover:bg-sky-700 transition-colors shadow-sm active:scale-[0.98]"
            >
              Yeni Rezervasyon Yap
            </Link>
          </div>
        )}
      </div>

      {selectedBooking ? (
        <BookingDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          booking={selectedBooking}
          onCancelBooking={handleCancelBooking}
        />
      ) : null}
    </div>
  );
}
