'use client';

import { CalendarIcon, UsersIcon } from '@heroicons/react/24/outline';
import { Booking } from '../../types';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  onCancelBooking: (bookingId: string) => void;
}

export default function BookingDetailsModal({ 
  isOpen, 
  onClose, 
  booking, 
  onCancelBooking 
}: BookingDetailsModalProps) {
  
  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd MMMM yyyy', { locale: tr });
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Rezervasyon Detayları</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-6">
                <div className="text-sm font-medium text-gray-500 mb-1">Rezervasyon Numarası</div>
                <div className="text-lg font-semibold">{booking.bookingNumber}</div>
              </div>
              
              <div className="mb-6">
                <div className="text-sm font-medium text-gray-500 mb-1">Durum</div>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(booking.status)}`}>
                  {booking.status === 'CONFIRMED' && 'Onaylı'}
                  {booking.status === 'PENDING' && 'Beklemede'}
                  {booking.status === 'CANCELLED' && 'İptal Edildi'}
                  {booking.status === 'COMPLETED' && 'Tamamlandı'}
                </div>
              </div>
              
              <div className="mb-6">
                <div className="text-sm font-medium text-gray-500 mb-1">Ödeme Durumu</div>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  booking.paymentStatus === 'PAID' 
                    ? 'bg-green-100 text-green-800' 
                    : booking.paymentStatus === 'PARTIALLY_PAID'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                }`}>
                  {booking.paymentStatus === 'PAID' && 'Ödendi'}
                  {booking.paymentStatus === 'PARTIALLY_PAID' && 'Kısmen Ödendi'}
                  {booking.paymentStatus === 'UNPAID' && 'Ödenmedi'}
                  {booking.paymentStatus === 'REFUNDED' && 'İade Edildi'}
                </div>
              </div>
              
              <div className="mb-6">
                <div className="text-sm font-medium text-gray-500 mb-1">Rezervasyon Türü</div>
                <div className="text-base">
                  {booking.hotelId 
                    ? 'Otel Rezervasyonu' 
                    : booking.tourId 
                      ? 'Tur Rezervasyonu' 
                      : 'Deneyim Rezervasyonu'}
                </div>
              </div>
            </div>
            
            <div>
              <div className="mb-6">
                <div className="text-sm font-medium text-gray-500 mb-1">Tarihler</div>
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <span>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="text-sm font-medium text-gray-500 mb-1">Misafirler</div>
                <div className="flex items-center">
                  <UsersIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <span>
                    {booking.adults} Yetişkin
                    {booking.children > 0 && `, ${booking.children} Çocuk`}
                  </span>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="text-sm font-medium text-gray-500 mb-1">Toplam Fiyat</div>
                <div className="text-xl font-bold text-blue-600">{booking.totalPrice.toLocaleString('tr-TR')} ₺</div>
              </div>
            </div>
          </div>
          
          {booking.specialRequests && (
            <div className="mb-6">
              <div className="text-sm font-medium text-gray-500 mb-1">Özel İstekler</div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                {booking.specialRequests}
              </div>
            </div>
          )}
          
          <div className="border-t border-gray-200 pt-6 mt-6">
            {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' ? (
              <div className="flex justify-between">
                <button
                  onClick={() => onCancelBooking(booking.id)}
                  className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  Rezervasyonu İptal Et
                </button>
                
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Kapat
                </button>
              </div>
            ) : (
              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Kapat
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 