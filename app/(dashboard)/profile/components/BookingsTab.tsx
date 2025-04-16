'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CalendarIcon, ClockIcon, UsersIcon, TicketIcon, FunnelIcon, ArrowsUpDownIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface Booking {
  id: number;
  type: 'hotel' | 'tour';
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
}

interface BookingsTabProps {
  bookings: Record<string, Booking[]>;
  onViewDetails: (booking: Booking) => void;
  onCancelBooking: (bookingId: number) => void;
  formatDate: (dateString: string) => string;
}

export default function BookingsTab({ bookings, onViewDetails, onCancelBooking, formatDate }: BookingsTabProps) {
  const [bookingTab, setBookingTab] = useState('upcoming');
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'priceAsc' | 'priceDesc' | 'dateAsc' | 'dateDesc'>('dateDesc');
  const [showSortOptions, setShowSortOptions] = useState(false);

  // Sıralama işlevi
  const handleSort = (order: 'priceAsc' | 'priceDesc' | 'dateAsc' | 'dateDesc') => {
    setSortOrder(order);
    setShowSortOptions(false);
    
    if (order === 'priceAsc') {
      toast.success('Rezervasyonlar fiyata göre artan sıralandı');
    } else if (order === 'priceDesc') {
      toast.success('Rezervasyonlar fiyata göre azalan sıralandı');
    } else if (order === 'dateAsc') {
      toast.success('Rezervasyonlar tarihe göre artan sıralandı');
    } else if (order === 'dateDesc') {
      toast.success('Rezervasyonlar tarihe göre azalan sıralandı');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Rezervasyonlarım</h2>
        
        <div className="flex space-x-2">
          <button 
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
            onClick={() => setFilterModalOpen(true)}
          >
            <FunnelIcon className="h-5 w-5" />
          </button>
          <div className="relative">
            <button 
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              onClick={() => setShowSortOptions(!showSortOptions)}
            >
              <ArrowsUpDownIcon className="h-5 w-5" />
            </button>
            {showSortOptions && (
              <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden z-20 border border-gray-200 dark:border-gray-700">
                <button 
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  onClick={() => handleSort('dateDesc')}
                >
                  En Yeni Tarih
                </button>
                <button 
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  onClick={() => handleSort('dateAsc')}
                >
                  En Eski Tarih
                </button>
                <button 
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  onClick={() => handleSort('priceDesc')}
                >
                  Fiyat: Yüksekten Düşüğe
                </button>
                <button 
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  onClick={() => handleSort('priceAsc')}
                >
                  Fiyat: Düşükten Yükseğe
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rezervasyon sekmeleri */}
      <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
        <button 
          onClick={() => setBookingTab('upcoming')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            bookingTab === 'upcoming'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Yaklaşan
        </button>
        <button 
          onClick={() => setBookingTab('past')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            bookingTab === 'past'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Geçmiş
        </button>
        <button 
          onClick={() => setBookingTab('cancelled')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            bookingTab === 'cancelled'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          İptal Edilen
        </button>
      </div>

      {/* Rezervasyon listesi */}
      <div className="space-y-4">
        {bookings[bookingTab].length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 dark:text-gray-400">
            <CalendarIcon className="h-12 w-12 mb-3" />
            <h3 className="text-lg font-medium">Henüz rezervasyonunuz yok</h3>
            <p className="mt-1">Yeni bir rezervasyon yapmak için keşfetmeye başlayın.</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
              Otel Ara
            </button>
          </div>
        ) : (
          bookings[bookingTab].map((booking) => (
            <div 
              key={booking.id} 
              className="flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow transition-shadow"
            >
              <div className="relative h-48 md:h-auto md:w-1/3 md:max-w-xs">
                <Image
                  src={booking.image}
                  alt={booking.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-white dark:bg-gray-800 shadow">
                    {booking.type === 'hotel' ? 'Otel' : 'Tur'}
                  </span>
                </div>
              </div>
              
              <div className="flex-1 p-4 flex flex-col">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{booking.name}</h3>
                    <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      <span>{booking.location}</span>
                    </div>
                  </div>
                  
                  <div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300' 
                        : booking.status === 'completed'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300'
                    }`}>
                      {booking.status === 'confirmed' 
                        ? 'Onaylandı' 
                        : booking.status === 'completed'
                          ? 'Tamamlandı'
                          : 'İptal Edildi'}
                    </span>
                  </div>
                </div>
                
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  {booking.type === 'hotel' ? (
                    <>
                      <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <CalendarIcon className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                        <span>Giriş: {formatDate(booking.checkIn || '')}</span>
                      </div>
                      <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <CalendarIcon className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                        <span>Çıkış: {formatDate(booking.checkOut || '')}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <CalendarIcon className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                        <span>Tarih: {formatDate(booking.date || '')}</span>
                      </div>
                      <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <ClockIcon className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                        <span>Saat: {booking.time}</span>
                      </div>
                    </>
                  )}
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <UsersIcon className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                    <span>{booking.guests} Kişi</span>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <TicketIcon className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                    <span>#{booking.bookingNumber}</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {booking.price.toLocaleString('tr-TR')} ₺
                  </div>
                  
                  <div className="mt-3 md:mt-0 flex space-x-2">
                    {booking.status === 'confirmed' && (
                      <button 
                        onClick={() => onCancelBooking(booking.id)}
                        className="px-3 py-1 text-sm border border-red-200 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        İptal Et
                      </button>
                    )}
                    <button
                      onClick={() => onViewDetails(booking)}
                      className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      Detaylar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 