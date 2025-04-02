'use client';

import React, { useState, useRef } from 'react';
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  ChevronDownIcon, 
  CalendarDaysIcon, 
  UserGroupIcon, 
  MinusIcon, 
  PlusIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { DatePicker } from '@/app/components/booking/DatePicker';

interface City {
  id: string;
  label: string;
  count: number;
}

interface SearchBarProps {
  cities: City[];
}

export default function SearchBar({ cities }: SearchBarProps) {
  const [selectedCity, setSelectedCity] = useState('all');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [isLoading, setIsLoading] = useState(false);

  // Minimum tarih (bugün)
  const today = new Date().toISOString().split('T')[0];
  
  // Minimum çıkış tarihi (giriş tarihinden bir gün sonra)
  const minCheckOut = checkInDate 
    ? (() => {
        // Tarih string'ini parçalara ayır (YYYY-MM-DD)
        const [year, month, day] = checkInDate.split('-').map(Number);
        
        // Giriş tarihinden bir gün sonrasını hesapla
        const nextDay = new Date(year, month - 1, day + 1);
        
        // YYYY-MM-DD formatına çevir
        return nextDay.toISOString().split('T')[0];
      })()
    : today;

  // Arama işlemi
  const handleSearch = () => {
    setIsLoading(true);
    // Burada arama işlemi yapılacak
    console.log('Arama yapılıyor:', { selectedCity, checkInDate, checkOutDate, guestCount });
    
    // Simüle edilmiş yükleme
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
      {/* Konum */}
      <div className="lg:col-span-3">
        <label className="text-gray-700 font-semibold block text-left text-sm mb-1">Konum</label>
        <div className="relative">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full pl-9 pr-3 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 appearance-none bg-white text-gray-800 shadow-sm"
          >
            {cities.map(city => (
              <option key={city.id} value={city.id}>{city.label}</option>
            ))}
          </select>
          <MapPinIcon className="w-5 h-5 text-blue-600 absolute left-2.5 top-3.5" />
          <ChevronDownIcon className="w-4 h-4 text-gray-500 absolute right-2.5 top-4" />
        </div>
      </div>

      {/* Tarih Aralığı - Giriş */}
      <div className="lg:col-span-3">
        <DatePicker
          label="Giriş Tarihi"
          value={checkInDate}
          onChange={(date: string) => {
            setCheckInDate(date);
            // Eğer çıkış tarihi giriş tarihinden önce veya aynı ise, çıkış tarihini sıfırla
            if (checkOutDate && checkOutDate <= date) {
              setCheckOutDate('');
            }
          }}
          minDate={today}
          placeholder="Giriş tarihi seçin"
        />
      </div>

      {/* Tarih Aralığı - Çıkış */}
      <div className="lg:col-span-3">
        <DatePicker
          label="Çıkış Tarihi"
          value={checkOutDate}
          onChange={setCheckOutDate}
          minDate={minCheckOut}
          disabled={!checkInDate}
          placeholder="Çıkış tarihi seçin"
        />
      </div>

      {/* Misafir Sayısı ve Arama Butonu */}
      <div className="lg:col-span-3 flex flex-col">
        <label className="text-gray-700 font-semibold block text-left text-sm mb-1">Misafir</label>
        <div className="flex gap-2 h-full">
          <div className="relative flex-1">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden h-full shadow-sm">
              <button
                type="button"
                onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                className="px-3 py-3 hover:bg-gray-100 text-gray-700 transition-colors"
                aria-label="Misafir sayısını azalt"
              >
                <MinusIcon className="w-4 h-4" />
              </button>
              <div className="flex-1 text-center font-medium text-gray-800 py-2">
                {guestCount} Kişi
              </div>
              <button
                type="button"
                onClick={() => setGuestCount(guestCount + 1)}
                className="px-3 py-3 hover:bg-gray-100 text-gray-700 transition-colors"
                aria-label="Misafir sayısını artır"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <button 
            onClick={handleSearch}
            disabled={isLoading}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 shadow-md disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                <MagnifyingGlassIcon className="w-5 h-5" />
                Ara
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 