"use client";

import React from 'react';
import SimpleHotelCard from './SimpleHotelCard';
import { Hotel } from '@/types/hotel';

interface FeaturedHotelsProps {
  hotels: Hotel[];
}

export default function FeaturedHotels({ hotels }: FeaturedHotelsProps) {
  return (
    
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Öne Çıkan Oteller</h2>
        <p className="text-sm text-gray-500">* Fiyatlar ortalama gecelik fiyatlardır</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {hotels.map((hotel) => (
          <SimpleHotelCard key={hotel.id} hotel={hotel} />
        ))}
      </div>
    </div>
  );
} 