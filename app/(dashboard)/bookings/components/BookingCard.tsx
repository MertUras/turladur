'use client';

import { 
  CalendarIcon, 
  UsersIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { Booking } from '../../types';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface BookingCardProps {
  booking: Booking;
  onViewDetails: (booking: Booking) => void;
  onCancelBooking: (bookingId: string) => void;
}

export default function BookingCard({ booking, onViewDetails, onCancelBooking }: BookingCardProps) {
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

  const getBookingTypeIcon = () => {
    if (booking.hotelId) {
      return <BuildingOfficeIcon className="h-5 w-5 text-blue-500" />;
    } else if (booking.tourId) {
      return <GlobeAltIcon className="h-5 w-5 text-blue-500" />;
    } else if (booking.experienceId) {
      return <SparklesIcon className="h-5 w-5 text-blue-500" />;
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <div className="flex items-center">
            {getBookingTypeIcon()}
            <span className="ml-2 font-medium text-gray-900">
              {booking.hotelId 
                ? 'Otel Rezervasyonu' 
                : booking.tourId 
                  ? 'Tur Rezervasyonu' 
                  : 'Deneyim Rezervasyonu'}
            </span>
            <span className={`ml-4 px-2.5 py-0.5 text-xs font-medium rounded-full whitespace-nowrap mr-2 inline-flex items-center ${getStatusBadgeColor(booking.status)}`}>
              {booking.status === 'CONFIRMED' && 'Onaylı'}
              {booking.status === 'PENDING' && 'Beklemede'}
              {booking.status === 'CANCELLED' && 'İptal Edildi'}
              {booking.status === 'COMPLETED' && 'Tamamlandı'}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-2 sm:mt-0">
            Rezervasyon Numarası: <span className="font-semibold">{booking.bookingNumber}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tarih bilgileri */}
          <div className="flex items-start space-x-3">
            <div className="text-blue-600">
              <CalendarIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">Tarihler</div>
              <div className="text-sm text-gray-600">
                {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
              </div>
            </div>
          </div>
          
          {/* Kişi sayısı */}
          <div className="flex items-start space-x-3">
            <div className="text-blue-600">
              <UsersIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">Misafirler</div>
              <div className="text-sm text-gray-600">
                {booking.adults} Yetişkin
                {booking.children > 0 && `, ${booking.children} Çocuk`}
              </div>
            </div>
          </div>
          
          {/* Fiyat */}
          <div className="flex items-start space-x-3">
            <div className="text-blue-600">
              <span className="inline-block h-5 w-5 flex items-center justify-center font-bold">₺</span>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">Toplam Fiyat</div>
              <div className="text-sm text-gray-600">{booking.totalPrice.toLocaleString('tr-TR')} ₺</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => onViewDetails(booking)}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          >
            Detayları Görüntüle
          </button>
          
          {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
            <button
              onClick={() => onCancelBooking(booking.id)}
              className="ml-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              İptal Et
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 