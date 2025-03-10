'use client';

import Image from 'next/image';
import { CalendarDaysIcon, MapPinIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface BookingSummaryProps {
  hotelName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  location: string;
  price: number;
  image?: string;
}

export function BookingSummary({
  hotelName,
  roomName,
  checkIn,
  checkOut,
  guests,
  location,
  price,
  image
}: BookingSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Otel Resmi */}
      <div className="relative h-48">
        {image ? (
          <Image
            src={image}
            alt={hotelName}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Resim mevcut değil</span>
          </div>
        )}
      </div>

      {/* Detaylar */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900">{hotelName}</h3>
        <p className="text-gray-600 mt-1">{roomName}</p>

        <div className="mt-6 space-y-4">
          {/* Konum */}
          <div className="flex items-center text-gray-600">
            <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
            <span>{location}</span>
          </div>

          {/* Tarihler */}
          <div className="flex items-center text-gray-600">
            <CalendarDaysIcon className="h-5 w-5 text-gray-400 mr-2" />
            <span>{checkIn} - {checkOut}</span>
          </div>

          {/* Misafir Sayısı */}
          <div className="flex items-center text-gray-600">
            <UserGroupIcon className="h-5 w-5 text-gray-400 mr-2" />
            <span>{guests} Misafir</span>
          </div>
        </div>

        {/* Fiyat Detayları */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between text-base font-medium text-gray-900">
            <p>Toplam</p>
            <p>{price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</p>
          </div>
          <p className="mt-0.5 text-sm text-gray-500">Vergiler dahildir</p>
        </div>
      </div>
    </div>
  );
} 