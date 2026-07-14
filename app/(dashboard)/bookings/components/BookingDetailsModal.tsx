'use client';

import { CalendarIcon, UsersIcon, CreditCardIcon, InformationCircleIcon, XMarkIcon, CheckCircleIcon, ClockIcon, ExclamationTriangleIcon, NoSymbolIcon, BuildingStorefrontIcon, MapIcon } from '@heroicons/react/24/outline';
import { Booking } from '@/app/types';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useMemo } from 'react';
import SpecialRequirementsSection from '@/app/components/booking/SpecialRequirementsSection';
import { extractBookingSpecialConditions } from '@/lib/user/bookings';

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  onCancelBooking: (bookingId: string) => void;
}

const getStatusInfo = (status: Booking['status']) => {
  switch (status) {
    case 'CONFIRMED': return { icon: CheckCircleIcon, text: 'Onaylandı', color: 'text-green-600', badge: 'bg-green-100 text-green-800 ring-green-200' };
    case 'PENDING': return { icon: ClockIcon, text: 'Beklemede', color: 'text-yellow-600', badge: 'bg-yellow-100 text-yellow-800 ring-yellow-200' };
    case 'PENDING_PAYMENT': return { icon: ClockIcon, text: 'Ödeme Bekliyor', color: 'text-amber-600', badge: 'bg-amber-100 text-amber-800 ring-amber-200' };
    case 'SUSPENDED': return { icon: ExclamationTriangleIcon, text: 'Askıya Alındı', color: 'text-orange-600', badge: 'bg-orange-100 text-orange-800 ring-orange-200' };
    case 'CANCELLED': return { icon: NoSymbolIcon, text: 'İptal Edildi', color: 'text-red-600', badge: 'bg-red-100 text-red-800 ring-red-200' };
    case 'COMPLETED': return { icon: CheckCircleIcon, text: 'Tamamlandı', color: 'text-sky-600', badge: 'bg-sky-100 text-sky-800 ring-sky-200' };
    default: return { icon: InformationCircleIcon, text: status, color: 'text-neutral-600', badge: 'bg-neutral-100 text-neutral-800 ring-neutral-200' };
  }
};

const getPaymentStatusInfo = (status: Booking['paymentStatus']) => {
   switch (status) {
    case 'PAID': return { text: 'Ödendi', badge: 'bg-green-100 text-green-800 ring-green-200' };
    case 'PARTIALLY_PAID': return { text: 'Kısmen Ödendi', badge: 'bg-yellow-100 text-yellow-800 ring-yellow-200' };
    case 'UNPAID': return { text: 'Ödenmedi', badge: 'bg-red-100 text-red-800 ring-red-200' };
    case 'REFUNDED': return { text: 'İade Edildi', badge: 'bg-purple-100 text-purple-800 ring-purple-200' };
    default: return { text: status, badge: 'bg-neutral-100 text-neutral-800 ring-neutral-200' };
  }
};

export default function BookingDetailsModal({ 
  isOpen, 
  onClose, 
  booking, 
  onCancelBooking 
}: BookingDetailsModalProps) {
  
  const formatDate = (date?: Date | string) => {
     if (!date) return '-';
     try {
      return format(new Date(date), 'dd MMMM yyyy, EEEE', { locale: tr });
     } catch { return '-'; }
  };

  const bookingStatusInfo = getStatusInfo(booking.status);
  const paymentStatusInfo = getPaymentStatusInfo(booking.paymentStatus);

  const bookingTypeLabel = booking.hotelId ? 'Otel' : booking.tourId ? 'Tur' : 'Deneyim';

  const routeText = booking.routeLabel || (
    booking.fromLocation && booking.toLocation
      ? `${booking.fromLocation} → ${booking.toLocation}`
      : booking.fromLocation || booking.toLocation || null
  );

  const specialConditionsSummary = useMemo(
    () =>
      booking.specialConditionsSummary ??
      extractBookingSpecialConditions({
        metadata: booking.metadata,
        specialRequests: booking.specialRequests,
      }),
    [booking.metadata, booking.specialConditionsSummary, booking.specialRequests]
  );

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between p-5 border-b border-neutral-100">
                  <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-neutral-900">
                    Rezervasyon Detayları (#{booking.bookingNumber})
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>

                <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200/80">
                      <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Rezervasyon Durumu</p>
                      <div className="flex items-center">
                         <bookingStatusInfo.icon className={`h-5 w-5 mr-1.5 ${bookingStatusInfo.color}`} />
                         <span className={`text-sm font-medium ${bookingStatusInfo.color}`}>{bookingStatusInfo.text}</span>
                      </div>
                    </div>
                     <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200/80">
                      <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Ödeme Durumu</p>
                       <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full capitalize ${paymentStatusInfo.badge} ring-1 ring-inset`}>
                         {paymentStatusInfo.text}
                       </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                     {booking.productTitle && (
                       <div>
                          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Tur / Deneyim Adı</p>
                          <p className="text-sm text-neutral-800 font-medium">{booking.productTitle}</p>
                       </div>
                     )}
                     <div>
                        <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Rezervasyon Tipi</p>
                        <p className="text-sm text-neutral-800 font-medium">{bookingTypeLabel}</p>
                     </div>
                     {booking.operatorName && (
                       <div>
                          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Tur Firması</p>
                          <div className="flex items-center text-sm text-neutral-800">
                            <BuildingStorefrontIcon className="h-4 w-4 text-neutral-400 mr-1.5 flex-shrink-0" />
                            <span>{booking.operatorName}</span>
                          </div>
                       </div>
                     )}
                     {routeText && (
                       <div>
                          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Nereden → Nereye</p>
                          <div className="flex items-center text-sm text-neutral-800">
                            <MapIcon className="h-4 w-4 text-neutral-400 mr-1.5 flex-shrink-0" />
                            <span>{routeText}</span>
                          </div>
                       </div>
                     )}
                     <div>
                        <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Tarihler</p>
                        <div className="flex items-center text-sm text-neutral-800">
                          <CalendarIcon className="h-4 w-4 text-neutral-400 mr-1.5 flex-shrink-0" />
                          <span>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>
                        </div>
                      </div>
                       <div>
                        <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Misafirler</p>
                         <div className="flex items-center text-sm text-neutral-800">
                           <UsersIcon className="h-4 w-4 text-neutral-400 mr-1.5 flex-shrink-0" />
                            <span>
                             {booking.adults} Yetişkin
                             {booking.children > 0 && `, ${booking.children} Çocuk`}
                           </span>
                         </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Toplam Tutar</p>
                        <div className="flex items-center text-base font-semibold text-neutral-900">
                           <CreditCardIcon className="h-4 w-4 text-neutral-400 mr-1.5 flex-shrink-0" />
                           <span>{booking.totalPrice.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
                         </div>
                      </div>
                  </div>
                  
                  <SpecialRequirementsSection summary={specialConditionsSummary} />
                </div>

                <div className="bg-neutral-50 px-5 py-4 border-t border-neutral-100">
                  {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' ? (
                    <div className="flex flex-col sm:flex-row justify-end gap-3">
                       <button
                        type="button"
                        onClick={() => onCancelBooking(booking.id)}
                        className="inline-flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                         <ExclamationTriangleIcon className="h-4 w-4 mr-1.5" />
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
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 