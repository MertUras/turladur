'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CalendarIcon, ClockIcon, UsersIcon, FunnelIcon, ArrowsUpDownIcon, MapPinIcon, XMarkIcon, CheckIcon, BanknotesIcon } from '@heroicons/react/24/outline';
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
  const [sortOrder, setSortOrder] = useState<'dateDesc' | 'dateAsc' | 'priceDesc' | 'priceAsc'>('dateDesc');
  const [showSortOptions, setShowSortOptions] = useState(false);

  const handleSort = (order: 'dateDesc' | 'dateAsc' | 'priceDesc' | 'priceAsc') => {
    setSortOrder(order);
    setShowSortOptions(false);
    
    if (order.startsWith('date')) {
      toast.success(`Tarihe göre sıralandı (${order === 'dateDesc' ? 'Yeni > Eski' : 'Eski > Yeni'})`);
    } else {
      toast.success(`Fiyata göre sıralandı (${order === 'priceDesc' ? 'Yüksek > Düşük' : 'Düşük > Yüksek'})`);
    }
  };

  const currentBookings = bookings[bookingTab]?.sort((a, b) => {
    switch (sortOrder) {
      case 'dateAsc': return new Date(a.date || a.checkIn || 0).getTime() - new Date(b.date || b.checkIn || 0).getTime();
      case 'priceDesc': return b.price - a.price;
      case 'priceAsc': return a.price - b.price;
      case 'dateDesc':
      default: return new Date(b.date || b.checkIn || 0).getTime() - new Date(a.date || a.checkIn || 0).getTime();
    }
  }) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-neutral-900">Rezervasyonlarım</h2>
        
        <div className="flex items-center space-x-2">
          <button 
            className="p-2 rounded-lg text-neutral-500 hover:text-sky-600 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 transition-colors"
            onClick={() => setFilterModalOpen(true)}
            title="Filtrele"
          >
            <FunnelIcon className="h-5 w-5" />
          </button>
          <div className="relative">
            <button 
              className="p-2 rounded-lg text-neutral-500 hover:text-sky-600 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 transition-colors"
              onClick={() => setShowSortOptions(!showSortOptions)}
              title="Sırala"
            >
              <ArrowsUpDownIcon className="h-5 w-5" />
            </button>
            {showSortOptions && (
              <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-sm shadow-lg rounded-lg overflow-hidden z-20 border border-neutral-200/60 ring-1 ring-black ring-opacity-5">
                <p className="px-3 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Sırala</p>
                {[
                  { key: 'dateDesc', label: 'Tarih: En Yeni' },
                  { key: 'dateAsc', label: 'Tarih: En Eski' },
                  { key: 'priceDesc', label: 'Fiyat: Yüksekten Düşüğe' },
                  { key: 'priceAsc', label: 'Fiyat: Düşükten Yükseğe' },
                ].map(opt => (
                  <button 
                    key={opt.key}
                    className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center justify-between ${sortOrder === opt.key ? 'bg-neutral-50 text-sky-700 font-medium' : 'text-neutral-700 hover:bg-neutral-50'}`}
                    onClick={() => handleSort(opt.key as any)}
                  >
                    {opt.label}
                    {sortOrder === opt.key && <CheckIcon className="h-4 w-4 text-sky-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-b border-neutral-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {[
            { key: 'upcoming', label: 'Yaklaşan' },
            { key: 'past', label: 'Geçmiş' },
            { key: 'cancelled', label: 'İptal Edilen' },
          ].map(tab => (
            <button 
              key={tab.key}
              onClick={() => setBookingTab(tab.key)}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-150 focus:outline-none ${
                bookingTab === tab.key
                  ? 'border-sky-600 text-sky-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="space-y-5">
        {currentBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
            <div className="p-3 bg-neutral-100 rounded-full mb-4">
              <CalendarIcon className="h-8 w-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-700">Bu sekmede rezervasyon bulunmuyor</h3>
            <p className="mt-1 text-neutral-500 text-sm max-w-xs">Farklı bir sekmeyi kontrol edin veya keşfetmeye başlayarak yeni maceralar planlayın.</p>
          </div>
        ) : (
          currentBookings.map((booking) => (
            <div 
              key={booking.id} 
              className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden border border-neutral-200/50 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative h-48 md:h-auto md:w-1/3 md:max-w-xs flex-shrink-0 bg-neutral-100">
                {booking.image ? (
                  <Image
                    src={booking.image}
                    alt={booking.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 320px"
                    className="object-cover"
                    priority={bookingTab === 'upcoming'}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-neutral-400">
                    <BanknotesIcon className="h-16 w-16" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full bg-white/80 backdrop-blur-sm text-neutral-700 border border-neutral-200/80 shadow-sm">
                    {booking.type === 'hotel' ? 'Otel Konaklama' : 'Tur Aktivitesi'}
                  </span>
                </div>
              </div>
              
              <div className="flex-1 p-4 md:p-5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <div className="flex-grow">
                      <h3 className="text-base font-semibold text-neutral-900 line-clamp-1" title={booking.name}>{booking.name}</h3>
                      <div className="flex items-center mt-1 text-xs text-neutral-500">
                        <MapPinIcon className="h-3.5 w-3.5 mr-1.5 flex-shrink-0 text-neutral-400" />
                        <span className="line-clamp-1" title={booking.location}>{booking.location}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 mt-0.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full capitalize ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800 ring-1 ring-inset ring-green-200' 
                          : booking.status === 'completed'
                            ? 'bg-sky-100 text-sky-800 ring-1 ring-inset ring-sky-200'
                            : 'bg-red-100 text-red-800 ring-1 ring-inset ring-red-200'
                      }`}>
                        {booking.status === 'confirmed' ? 'Onaylandı' : booking.status === 'completed' ? 'Tamamlandı' : 'İptal Edildi'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs text-neutral-600 border-t border-neutral-100 pt-3">
                    {booking.type === 'hotel' ? (
                      <>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1.5 text-neutral-400 flex-shrink-0" />
                          <span>Giriş: <span className="font-medium text-neutral-700">{formatDate(booking.checkIn || '')}</span></span>
                        </div>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1.5 text-neutral-400 flex-shrink-0" />
                          <span>Çıkış: <span className="font-medium text-neutral-700">{formatDate(booking.checkOut || '')}</span></span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1.5 text-neutral-400 flex-shrink-0" />
                          <span>Tarih: <span className="font-medium text-neutral-700">{formatDate(booking.date || '')}</span></span>
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1.5 text-neutral-400 flex-shrink-0" />
                          <span>Saat: <span className="font-medium text-neutral-700">{booking.time || '-'}</span></span>
                        </div>
                      </>
                    )}
                    <div className="flex items-center">
                      <UsersIcon className="h-4 w-4 mr-1.5 text-neutral-400 flex-shrink-0" />
                      <UsersIcon className="h-3.5 w-3.5 mr-1 text-neutral-400 flex-shrink-0" />
                      <span>{booking.guests} Kişi</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 flex flex-col sm:flex-row sm:items-center justify-between border-t border-neutral-100 gap-3">
                  <div className="text-lg font-semibold text-neutral-900 flex-shrink-0">
                    {booking.price.toLocaleString('tr-TR')} ₺
                  </div>
                  <div className="flex space-x-2 flex-shrink-0">
                    {booking.status === 'confirmed' && (
                      <button 
                        onClick={() => onCancelBooking(booking.id)}
                        className="px-3 py-1.5 text-xs font-medium border border-red-200 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        İptal Et
                      </button>
                    )}
                    <button
                      onClick={() => onViewDetails(booking)}
                      className="px-3 py-1.5 text-xs font-medium bg-white hover:bg-neutral-50 text-sky-600 rounded-md transition-colors border border-neutral-200 shadow-sm"
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