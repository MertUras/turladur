'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPinIcon, 
  HeartIcon as HeartIconOutline,
  StarIcon as StarIconOutline
} from '@heroicons/react/24/outline';
import { 
  StarIcon as StarIconSolid,
  HeartIcon as HeartIconSolid,
  FireIcon as FireIconSolid,
  SparklesIcon as SparklesIconSolid,
  CheckBadgeIcon as CheckBadgeIconSolid
} from '@heroicons/react/24/solid';
import { useState } from 'react';
import FeatureIcon from './FeatureIcon';

interface Hotel {
  id: string;
  name: string;
  description: string;
  location: string;
  rating: number;
  reviewCount: number;
  price: number;
  oldPrice: number;
  discount: number;
  image: string;
  features: string[];
  isBestSeller?: boolean;
  promotion?: string;
  stars: number;
}

interface FeatureIconInfo {
  feature: string;
  iconType: string;
}

interface HotelCardProps {
  hotel: Hotel;
  featureIcons: FeatureIconInfo[];
}

export default function HotelCard({ hotel, featureIcons }: HotelCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Link 
      href={`/hotel/${hotel.id}`} 
      className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={hotel.image}
          alt={hotel.name}
          fill
          className={`object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
        <button
          onClick={toggleFavorite}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
            isFavorite 
              ? 'bg-red-500 text-white' 
              : isHovered 
                ? 'bg-white text-gray-700 shadow-md' 
                : 'bg-black/30 text-white'
          }`}
        >
          {isFavorite ? (
            <HeartIconSolid className="w-5 h-5" />
          ) : (
            <HeartIconOutline className="w-5 h-5" />
          )}
        </button>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent h-16"></div>
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white">
          <div className="flex items-center gap-1">
            <StarIconSolid className="w-4 h-4 text-yellow-400" />
            <span className="font-semibold">{hotel.rating}</span>
          </div>
          <span className="text-sm text-gray-200">({hotel.reviewCount} değerlendirme)</span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{hotel.name}</h3>
        <p className="text-gray-600 text-sm mt-1 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {hotel.location}
        </p>
        
        <div className="mt-3 flex flex-wrap gap-2">
          {hotel.features.map((feature, index) => {
            const iconInfo = featureIcons.find(fi => fi.feature === feature);
            const iconType = iconInfo?.iconType || 'default';
            
            return (
              <div 
                key={feature} 
                className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 transition-colors ${
                  isHovered 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <FeatureIcon type={iconType} />
                {feature}
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">{hotel.price.toLocaleString('tr-TR')} ₺</span>
            <span className="text-gray-500 text-sm ml-1">/ gece</span>
          </div>
          <span className={`text-sm font-medium px-3 py-1 rounded-full ${
            isHovered ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'
          } transition-colors`}>
            Detaylar
          </span>
        </div>
      </div>
    </Link>
  );
} 