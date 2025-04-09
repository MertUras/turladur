'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPinIcon, 
  StarIcon as StarIconSolid,
  FireIcon as FireIconSolid,
  SparklesIcon as SparklesIconSolid,
  CheckBadgeIcon as CheckBadgeIconSolid
} from '@heroicons/react/24/solid';

interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  price: number;
  image: string;
  isBestSeller?: boolean;
  stars: number;
  type: string;
  breakfast: boolean;
  cancellationPolicy: string;
}

interface SimpleHotelCardProps {
  hotel: Hotel;
}

export default function SimpleHotelCard({ hotel }: SimpleHotelCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link 
      href={`/hotel/${hotel.id}`}
      className="block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative">
        <div className="overflow-hidden h-40">
          <Image
            src={hotel.image}
            alt={hotel.name}
            width={300}
            height={200}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {hotel.isBestSeller && (
            <div className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
              En Çok Satan
            </div>
          )}
          <div className="bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
            {hotel.type}
          </div>
          {hotel.breakfast && (
            <div className="bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              Kahvaltı Dahil
            </div>
          )}
        </div>
      </div>

      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{hotel.name}</h3>
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <MapPinIcon className="w-3 h-3" />
              <span className="line-clamp-1">{hotel.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <StarIconSolid className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-semibold text-gray-900">{hotel.rating}</span>
            <span className="text-xs text-gray-500">({hotel.reviewCount})</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm font-bold text-blue-600">
            {formatPrice(hotel.price)}
            <span className="text-xs text-gray-500 font-normal ml-1">/ gece</span>
          </div>
          {hotel.cancellationPolicy === 'Ücretsiz İptal' && (
            <div className="text-xs text-green-600 font-medium">
              Ücretsiz İptal
            </div>
          )}
        </div>
      </div>
    </Link>
  );
} 