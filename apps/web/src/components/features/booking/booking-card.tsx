'use client';

import {
  Building2,
  Calendar,
  Globe,
  Map,
  Sparkles,
  Store,
  Users,
  Wallet,
} from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export type BookingCardModel = {
  id: string;
  bookingNumber: string;
  status: string;
  tourId: string | null;
  hotelId: string | null;
  experienceId: string | null;
  productTitle?: string | null;
  operatorName?: string | null;
  routeLabel?: string | null;
  fromLocation?: string | null;
  toLocation?: string | null;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  adults: number;
  children: number;
  totalPrice: number;
  currency: string;
};

interface BookingCardProps {
  booking: BookingCardModel;
  onViewDetails: (booking: BookingCardModel) => void;
  onDownloadVoucher?: (booking: BookingCardModel) => void;
  voucherBusy?: boolean;
}

export function BookingCard({
  booking,
  onViewDetails,
  onDownloadVoucher,
  voucherBusy,
}: BookingCardProps) {
  const formatDate = (date?: Date | string | null) => {
    if (!date) return '-';
    try {
      return format(new Date(date), 'dd MMMM yyyy', { locale: tr });
    } catch {
      return '-';
    }
  };

  const statusStyles: Record<string, { text: string; style: string }> = {
    CONFIRMED: {
      text: 'Onaylandı',
      style: 'bg-green-100 text-green-800 ring-green-200',
    },
    PENDING: {
      text: 'Beklemede',
      style: 'bg-yellow-100 text-yellow-800 ring-yellow-200',
    },
    PENDING_PAYMENT: {
      text: 'Ödeme Bekliyor',
      style: 'bg-amber-100 text-amber-800 ring-amber-200',
    },
    SUSPENDED: {
      text: 'Askıya Alındı',
      style: 'bg-orange-100 text-orange-800 ring-orange-200',
    },
    CANCELLED: {
      text: 'İptal Edildi',
      style: 'bg-red-100 text-red-800 ring-red-200',
    },
    COMPLETED: {
      text: 'Tamamlandı',
      style: 'bg-sky-100 text-sky-800 ring-sky-200',
    },
    PAYMENT_FAILED: {
      text: 'Ödeme Başarısız',
      style: 'bg-red-100 text-red-800 ring-red-200',
    },
  };
  const currentStatus = statusStyles[booking.status] || {
    text: booking.status,
    style: 'bg-neutral-100 text-neutral-800 ring-neutral-200',
  };

  const bookingTypes = {
    hotel: {
      text: 'Otel Rezervasyonu',
      icon: Building2,
      color: 'text-blue-600',
    },
    tour: { text: 'Tur Rezervasyonu', icon: Globe, color: 'text-teal-600' },
    experience: {
      text: 'Deneyim Rezervasyonu',
      icon: Sparkles,
      color: 'text-purple-600',
    },
  };
  const bookingType = booking.hotelId
    ? bookingTypes.hotel
    : booking.tourId
      ? bookingTypes.tour
      : booking.experienceId
        ? bookingTypes.experience
        : null;

  const routeText =
    booking.routeLabel ||
    (booking.fromLocation && booking.toLocation
      ? `${booking.fromLocation} → ${booking.toLocation}`
      : booking.fromLocation || booking.toLocation || null);

  const TypeIcon = bookingType?.icon;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200/50 overflow-hidden hover:shadow-lg transition-shadow duration-200 ease-in-out">
      <div className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-2 mb-2 sm:mb-0">
            {bookingType && TypeIcon && (
              <>
                <TypeIcon className={`h-5 w-5 ${bookingType.color}`} />
                <span className={`font-semibold text-sm ${bookingType.color}`}>
                  {bookingType.text}
                </span>
              </>
            )}
            <span
              className={`ml-auto sm:ml-3 inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full capitalize ${currentStatus.style} ring-1 ring-inset`}
            >
              {currentStatus.text}
            </span>
          </div>
          <div className="text-xs text-neutral-500">
            Rez. No:{' '}
            <span className="font-semibold font-mono text-neutral-600 tracking-tight">
              {booking.bookingNumber}
            </span>
          </div>
        </div>

        {booking.productTitle ? (
          <h3 className="text-base font-semibold text-neutral-900 mb-3 leading-snug">
            {booking.productTitle}
          </h3>
        ) : null}

        {(booking.operatorName || routeText) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 mb-4 pb-4 border-b border-neutral-100">
            {booking.operatorName ? (
              <div className="flex items-start space-x-2.5 min-w-0">
                <Store className="h-5 w-5 text-neutral-400 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-medium text-neutral-500">
                    Tur Firması
                  </div>
                  <div className="text-sm text-neutral-800 truncate">
                    {booking.operatorName}
                  </div>
                </div>
              </div>
            ) : null}
            {routeText ? (
              <div className="flex items-start space-x-2.5 min-w-0">
                <Map className="h-5 w-5 text-neutral-400 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-medium text-neutral-500">
                    Nereden → Nereye
                  </div>
                  <div className="text-sm text-neutral-800 truncate">
                    {routeText}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
          <div className="flex items-start space-x-2.5">
            <Calendar className="h-5 w-5 text-neutral-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs font-medium text-neutral-500">
                Tarihler
              </div>
              <div className="text-sm text-neutral-800">
                {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-2.5">
            <Users className="h-5 w-5 text-neutral-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs font-medium text-neutral-500">
                Misafir Sayısı
              </div>
              <div className="text-sm text-neutral-800">
                {booking.adults} Yetişkin
                {booking.children > 0 && `, ${booking.children} Çocuk`}
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-2.5">
            <Wallet className="h-5 w-5 text-neutral-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs font-medium text-neutral-500">
                Toplam Fiyat
              </div>
              <div className="text-sm font-semibold text-neutral-800">
                {booking.totalPrice.toLocaleString('tr-TR', {
                  style: 'currency',
                  currency: booking.currency || 'TRY',
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-neutral-100 flex flex-wrap justify-end gap-2">
          {onDownloadVoucher &&
          (booking.status === 'CONFIRMED' || booking.status === 'COMPLETED') ? (
            <button
              type="button"
              disabled={voucherBusy}
              onClick={() => onDownloadVoucher(booking)}
              className="inline-flex items-center justify-center px-4 py-2 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 text-sm font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-60"
            >
              Voucher indir
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => onViewDetails(booking)}
            className="inline-flex items-center justify-center px-4 py-2 bg-white hover:bg-neutral-50 text-sky-700 border border-neutral-300 text-sm font-semibold rounded-lg transition-colors shadow-sm active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1"
          >
            Detayları Gör
          </button>
        </div>
      </div>
    </div>
  );
}
