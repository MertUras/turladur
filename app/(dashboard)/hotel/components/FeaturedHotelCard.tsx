'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPinIcon, 
  HeartIcon as HeartIconOutline,
  StarIcon as StarIconOutline,
  CalendarIcon,
  ChevronDownIcon
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
import { Hotel, FeatureIconInfo } from '@/types/hotel';

interface HotelCardProps {
  hotel: Hotel;
  featureIcons: FeatureIconInfo[];
}

export default function HotelCard({ hotel, featureIcons }: HotelCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);

  // Tarihleri formatla
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Gece sayısını hesapla
  const calculateNights = () => {
    if (!hotel.checkInDate || !hotel.checkOutDate) return 0;
    const checkIn = new Date(hotel.checkInDate);
    const checkOut = new Date(hotel.checkOutDate);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Toplam fiyatı hesapla
  const calculateTotalPrice = () => {
    const nights = calculateNights();
    return hotel.price * nights;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const nights = calculateNights();
  const totalPrice = hotel.price * nights;

  return (
    <Link 
      href={`/hotel/${hotel.id}`}
      className="block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group h-[500px]"
    >
      <div className="relative">
        <div className="overflow-hidden h-48">
          <Image
            src={hotel.image}
            alt={hotel.name}
            width={400}
            height={250}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {hotel.isBestSeller && (
            <div className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full hover:scale-110 transition-transform duration-300">
              En Çok Satan
            </div>
          )}
          <div className="bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full hover:scale-110 transition-transform duration-300">
            {hotel.type}
          </div>
          {hotel.breakfast && (
            <div className="bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full hover:scale-110 transition-transform duration-300">
              Kahvaltı Dahil
            </div>
          )}
          {hotel.cancellationPolicy === 'Ücretsiz İptal' && (
            <div className="bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded-full hover:scale-110 transition-transform duration-300">
              Ücretsiz İptal
            </div>
          )}
          {hotel.discount > 20 && (
            <div className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full hover:scale-110 transition-transform duration-300">
              Süper Fırsat
            </div>
          )}
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-all duration-300 hover:scale-110"
        >
          {isFavorite ? (
            <HeartIconSolid className="w-5 h-5 text-red-500" />
          ) : (
            <HeartIconOutline className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">{hotel.name}</h3>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <MapPinIcon className="w-4 h-4" />
              <span>{hotel.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <StarIconSolid className="w-5 h-5 text-yellow-400" />
            <span className="font-semibold text-gray-900">{hotel.rating}</span>
            <span className="text-sm text-gray-500">({hotel.reviewCount})</span>
          </div>
        </div>

        {/* Tarih ve Fiyat Bilgileri */}
        <div className="mb-3 p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <CalendarIcon className="w-4 h-4" />
              <span>
                {hotel.checkInDate ? formatDate(hotel.checkInDate) : 'Giriş Tarihi'} - 
                {hotel.checkOutDate ? formatDate(hotel.checkOutDate) : 'Çıkış Tarihi'}
              </span>
            </div>
            <div className="text-sm text-blue-700">
              {calculateNights()} Gece
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-left">
              <div className="text-sm text-gray-500 line-through">{formatPrice(hotel.oldPrice)}</div>
              <div className="text-lg font-bold text-blue-600 group-hover:text-blue-700 transition-colors duration-300">{formatPrice(hotel.price)}</div>
              <div className="text-xs text-green-600">%{hotel.discount} indirim</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Toplam</div>
              <div className="text-lg font-bold text-blue-600 group-hover:text-blue-700 transition-colors duration-300">{formatPrice(totalPrice)}</div>
              <div className="text-xs text-gray-500">/ {calculateNights()} gece</div>
            </div>
          </div>
        </div>

        {/* Özellikler */}
        <div className="mb-3">
          <div className="flex flex-wrap gap-2">
            {hotel.features.map((feature, index) => {
              const iconInfo = featureIcons.find(fi => fi.feature === feature);
              return (
                <div 
                  key={index} 
                  className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-2.5 py-1.5 rounded-full border border-gray-200 group-hover:bg-gray-100 group-hover:border-gray-300 transition-colors duration-300"
                >
                  {iconInfo && <FeatureIcon type={iconInfo.iconType} className="w-3.5 h-3.5" />}
                  <span>{feature}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Link>
  );
} 