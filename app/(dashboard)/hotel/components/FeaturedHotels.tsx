"use client";

import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, MapPinIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { Hotel, FeatureIconInfo } from '@/types/hotel';
import FeaturedHotelCard from './FeaturedHotelCard';
import Link from 'next/link';

interface FeaturedHotelsProps {
  hotels: Hotel[];
  featureIcons: FeatureIconInfo[];
}

const FeaturedHotels: React.FC<FeaturedHotelsProps> = ({ hotels, featureIcons }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(hotels.length / itemsPerPage);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? totalPages - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === totalPages - 1 ? 0 : prevIndex + 1));
  };

  const currentHotels = hotels.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg border border-blue-100">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Öne Çıkan Oteller</h2>
          <p className="text-gray-600">En çok tercih edilen otellerimiz</p>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 bg-white p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 z-10"
          aria-label="Önceki oteller"
        >
          <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentHotels.map((hotel) => (
            <div key={hotel.id} className="group">
              <FeaturedHotelCard hotel={hotel} featureIcons={featureIcons} />
            </div>
          ))}
        </div>

        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 bg-white p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 z-10"
          aria-label="Sonraki oteller"
        >
          <ChevronRightIcon className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <div className="flex justify-center items-center gap-2 mt-6">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-blue-600 scale-125' : 'bg-gray-300'
            }`}
            aria-label={`Sayfa ${index + 1}`}
          />
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPinIcon className="w-4 h-4" />
          <span>7 şehirde 10+ otel seçeneği</span>
        </div>
        <Link 
          href="/hotel/featured"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
        >
          Tümünü Gör
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default FeaturedHotels; 