'use client';

import {
  Ban,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Info,
  Map,
  Store,
  TriangleAlert,
  Users,
  X,
} from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

import type { BookingCardModel } from '@/components/features/booking/booking-card';

type BookingDetailsModel = BookingCardModel & {
  paymentStatus?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
};

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingDetailsModel;
  onCancelBooking: (bookingId: string) => void;
}

function getStatusInfo(status: string) {
  switch (status) {
    case 'CONFIRMED':
      return {
        icon: CheckCircle2,
        text: 'Onaylandı',
        color: 'text-green-600',
        badge: 'bg-green-100 text-green-800 ring-green-200',
      };
    case 'PENDING':
      return {
        icon: Clock,
        text: 'Beklemede',
        color: 'text-yellow-600',
        badge: 'bg-yellow-100 text-yellow-800 ring-yellow-200',
      };
    case 'PENDING_PAYMENT':
      return {
        icon: Clock,
        text: 'Ödeme Bekliyor',
        color: 'text-amber-600',
        badge: 'bg-amber-100 text-amber-800 ring-amber-200',
      };
    case 'SUSPENDED':
      return {
        icon: TriangleAlert,
        text: 'Askıya Alındı',
        color: 'text-orange-600',
        badge: 'bg-orange-100 text-orange-800 ring-orange-200',
      };
    case 'CANCELLED':
      return {
        icon: Ban,
        text: 'İptal Edildi',
        color: 'text-red-600',
        badge: 'bg-red-100 text-red-800 ring-red-200',
      };
    case 'COMPLETED':
      return {
        icon: CheckCircle2,
        text: 'Tamamlandı',
        color: 'text-sky-600',
        badge: 'bg-sky-100 text-sky-800 ring-sky-200',
      };
    default:
      return {
        icon: Info,
        text: status,
        color: 'text-neutral-600',
        badge: 'bg-neutral-100 text-neutral-800 ring-neutral-200',
      };
  }
}

function getPaymentStatusInfo(status?: string | null) {
  switch (status) {
    case 'PAID':
    case 'SUCCESS':
      return {
        text: 'Ödendi',
        badge: 'bg-green-100 text-green-800 ring-green-200',
      };
    case 'PARTIALLY_PAID':
      return {
        text: 'Kısmen Ödendi',
        badge: 'bg-yellow-100 text-yellow-800 ring-yellow-200',
      };
    case 'UNPAID':
    case 'PENDING':
      return {
        text: 'Ödenmedi',
        badge: 'bg-red-100 text-red-800 ring-red-200',
      };
    case 'REFUNDED':
      return {
        text: 'İade Edildi',
        badge: 'bg-purple-100 text-purple-800 ring-purple-200',
      };
    default:
      return {
        text: status || 'Bilinmiyor',
        badge: 'bg-neutral-100 text-neutral-800 ring-neutral-200',
      };
  }
}

export function BookingDetailsModal({
  isOpen,
  onClose,
  booking,
  onCancelBooking,
}: BookingDetailsModalProps) {
  if (!isOpen) return null;

  const formatDate = (date?: Date | string | null) => {
    if (!date) return '-';
    try {
      return format(new Date(date), 'dd MMMM yyyy, EEEE', { locale: tr });
    } catch {
      return '-';
    }
  };

  const bookingStatusInfo = getStatusInfo(booking.status);
  const paymentStatusInfo = getPaymentStatusInfo(booking.paymentStatus);
  const StatusIcon = bookingStatusInfo.icon;

  const bookingTypeLabel = booking.hotelId
    ? 'Otel'
    : booking.tourId
      ? 'Tur'
      : 'Deneyim';

  const routeText =
    booking.routeLabel ||
    (booking.fromLocation && booking.toLocation
      ? `${booking.fromLocation} → ${booking.toLocation}`
      : booking.fromLocation || booking.toLocation || null);

  return (
    <div className="relative z-50" role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <div className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-neutral-100">
              <h3 className="text-lg font-semibold leading-6 text-neutral-900">
                Rezervasyon Detayları (#{booking.bookingNumber})
              </h3>
              <button
                type="button"
                className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                onClick={onClose}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200/80">
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
                    Rezervasyon Durumu
                  </p>
                  <div className="flex items-center">
                    <StatusIcon
                      className={`h-5 w-5 mr-1.5 ${bookingStatusInfo.color}`}
                    />
                    <span
                      className={`text-sm font-medium ${bookingStatusInfo.color}`}
                    >
                      {bookingStatusInfo.text}
                    </span>
                  </div>
                </div>
                <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200/80">
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
                    Ödeme Durumu
                  </p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full capitalize ${paymentStatusInfo.badge} ring-1 ring-inset`}
                  >
                    {paymentStatusInfo.text}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {booking.productTitle ? (
                  <div>
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
                      Tur / Deneyim Adı
                    </p>
                    <p className="text-sm text-neutral-800 font-medium">
                      {booking.productTitle}
                    </p>
                  </div>
                ) : null}
                <div>
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
                    Rezervasyon Tipi
                  </p>
                  <p className="text-sm text-neutral-800 font-medium">
                    {bookingTypeLabel}
                  </p>
                </div>
                {booking.operatorName ? (
                  <div>
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
                      Tur Firması
                    </p>
                    <div className="flex items-center text-sm text-neutral-800">
                      <Store className="h-4 w-4 text-neutral-400 mr-1.5 flex-shrink-0" />
                      <span>{booking.operatorName}</span>
                    </div>
                  </div>
                ) : null}
                {routeText ? (
                  <div>
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
                      Nereden → Nereye
                    </p>
                    <div className="flex items-center text-sm text-neutral-800">
                      <Map className="h-4 w-4 text-neutral-400 mr-1.5 flex-shrink-0" />
                      <span>{routeText}</span>
                    </div>
                  </div>
                ) : null}
                <div>
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
                    Tarihler
                  </p>
                  <div className="flex items-center text-sm text-neutral-800">
                    <Calendar className="h-4 w-4 text-neutral-400 mr-1.5 flex-shrink-0" />
                    <span>
                      {formatDate(booking.startDate)} -{' '}
                      {formatDate(booking.endDate)}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
                    Misafirler
                  </p>
                  <div className="flex items-center text-sm text-neutral-800">
                    <Users className="h-4 w-4 text-neutral-400 mr-1.5 flex-shrink-0" />
                    <span>
                      {booking.adults} Yetişkin
                      {booking.children > 0 && `, ${booking.children} Çocuk`}
                    </span>
                  </div>
                </div>
                {(booking.contactEmail || booking.contactPhone) && (
                  <div>
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
                      İletişim
                    </p>
                    <p className="text-sm text-neutral-800">
                      {[booking.contactEmail, booking.contactPhone]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
                    Toplam Tutar
                  </p>
                  <div className="flex items-center text-base font-semibold text-neutral-900">
                    <CreditCard className="h-4 w-4 text-neutral-400 mr-1.5 flex-shrink-0" />
                    <span>
                      {booking.totalPrice.toLocaleString('tr-TR', {
                        style: 'currency',
                        currency: booking.currency || 'TRY',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-neutral-50 px-5 py-4 border-t border-neutral-100">
              {booking.status !== 'CANCELLED' &&
              booking.status !== 'COMPLETED' ? (
                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => onCancelBooking(booking.id)}
                    className="inline-flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    <TriangleAlert className="h-4 w-4 mr-1.5" />
                    Rezervasyonu İptal Et
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center px-4 py-2 bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-300 text-sm font-semibold rounded-lg transition-colors shadow-sm active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    Kapat
                  </button>
                </div>
              ) : (
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center px-4 py-2 bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-300 text-sm font-semibold rounded-lg transition-colors shadow-sm active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    Kapat
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
