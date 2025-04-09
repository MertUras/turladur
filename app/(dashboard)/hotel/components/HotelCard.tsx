'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  BuildingOfficeIcon, 
  ChevronDownIcon,
  ArrowUpRightIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  FunnelIcon,
  XMarkIcon,
  CalendarIcon,
  MinusIcon,
  PlusIcon,
  StarIcon,
  MapPinIcon,
  WifiIcon,
  SunIcon,
  TvIcon,
  KeyIcon,
  BellIcon,
  HeartIcon,
  ShoppingBagIcon,
  GiftIcon,
  SparklesIcon,
  FireIcon,
  BoltIcon,
  RocketLaunchIcon,
  TrophyIcon,
  StarIcon as StarIconSolid
} from '@heroicons/react/24/outline';
import { 
  HeartIcon as HeartIconSolid,
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

  return (
    <Link href={`/hotel/${hotel.id}`} className="group">
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
        {/* Resim */}
        <div className="relative h-72 overflow-hidden">
          <Image
            src={hotel.image}
            alt={hotel.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          {/* Üst Etiketler */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {hotel.isBestSeller && (
              <div className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Çok Satan
              </div>
            )}
            {hotel.discount > 0 && (
              <div className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                %{hotel.discount} İndirim
              </div>
            )}
          </div>

          {/* Favori Butonu */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsFavorite(!isFavorite);
            }}
            className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors z-10"
          >
            {isFavorite ? (
              <HeartIconSolid className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5 text-gray-600" />
            )}
          </button>

          {/* Alt Bilgiler */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(hotel.stars)].map((_, i) => (
                    <StarIconSolid key={i} className="h-4 w-4 text-yellow-400" />
                  ))}
                </div>
                <span className="text-white text-sm font-medium">
                  {hotel.rating} ({hotel.reviewCount})
                </span>
              </div>
              <div className="text-right">
                <span className="text-white text-sm font-medium">
                  {calculateNights()} gece • {hotel.guests || 2} kişi
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* İçerik */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Başlık ve Konum */}
          <div className="mb-3">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {hotel.name}
              </h3>
              <div className="flex items-center gap-1 text-gray-600 text-sm">
                <MapPinIcon className="h-3.5 w-3.5" />
                <span className="font-medium">{hotel.location}</span>
              </div>
            </div>
          </div>

          {/* Özellikler */}
          <div className="mb-3">
            <div className="flex flex-wrap gap-1.5">
              {hotel.features.slice(0, 3).map((feature) => {
                const iconInfo = featureIcons.find((fi) => fi.feature === feature);
                return (
                  <span
                    key={feature}
                    className="inline-flex items-center gap-1 bg-gray-50 text-gray-700 text-xs px-2 py-1 rounded-full font-medium border border-gray-100"
                  >
                    {iconInfo?.iconType === 'wifi' && <WifiIcon className="h-3 w-3 text-blue-500" />}
                    {iconInfo?.iconType === 'breakfast' && <SunIcon className="h-3 w-3 text-yellow-500" />}
                    {iconInfo?.iconType === 'pool' && <SparklesIcon className="h-3 w-3 text-blue-400" />}
                    {iconInfo?.iconType === 'spa' && <FireIcon className="h-3 w-3 text-pink-500" />}
                    {iconInfo?.iconType === 'parking' && <KeyIcon className="h-3 w-3 text-gray-500" />}
                    {iconInfo?.iconType === 'restaurant' && <GiftIcon className="h-3 w-3 text-red-500" />}
                    {iconInfo?.iconType === 'sea-view' && <SunIcon className="h-3 w-3 text-blue-400" />}
                    {iconInfo?.iconType === 'garden' && <SparklesIcon className="h-3 w-3 text-green-500" />}
                    {iconInfo?.iconType === 'lake-view' && <SunIcon className="h-3 w-3 text-blue-400" />}
                    {iconInfo?.iconType === 'cancel' && <XMarkIcon className="h-3 w-3 text-green-500" />}
                    {feature}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Fiyat ve Rezervasyon */}
          <div className="mt-auto pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="text-right">
                {hotel.oldPrice ? (
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-xs line-through">₺{hotel.oldPrice}</span>
                      <span className="text-red-500 text-xs font-medium bg-red-50 px-2 py-0.5 rounded-full">%{hotel.discount} indirim</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xl font-bold text-red-500">₺{hotel.price}</span>
                      <span className="text-gray-500 text-xs">/gece</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <span className="text-xl font-bold text-blue-600">₺{hotel.price}</span>
                    <span className="text-gray-500 text-xs">/gece</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-600">
                <span className="font-medium">Toplam: </span>
                <span className="font-bold text-blue-600">₺{calculateTotalPrice()}</span>
              </div>
              <div className="flex gap-2">
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium py-1.5 px-3 rounded-lg transition-colors duration-200">
                  Detay Gör
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-4 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md text-sm">
                  Rezervasyon
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
} 