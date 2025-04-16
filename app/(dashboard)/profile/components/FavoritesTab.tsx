'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HeartIcon, MapPinIcon, StarIcon } from '@heroicons/react/24/outline';

interface FavoriteItem {
  id: number;
  name: string;
  image: string;
  location: string;
  rating: number;
  reviewCount: number;
  price: number;
  description: string;
  type: 'hotel' | 'tour';
  date?: string;
  time?: string;
  duration?: string;
  guests?: number;
}

interface FavoritesTabProps {
  favorites: Record<string, FavoriteItem[]>;
  onToggleFavorite: (item: FavoriteItem) => void;
}

export default function FavoritesTab({ favorites, onToggleFavorite }: FavoritesTabProps) {
  const [favoriteTab, setFavoriteTab] = useState('hotels');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Favorilerim</h2>
      </div>
      
      {/* Favoriler sekmeleri */}
      <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
        <button 
          onClick={() => setFavoriteTab('hotels')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            favoriteTab === 'hotels'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Oteller
        </button>
        <button 
          onClick={() => setFavoriteTab('tours')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            favoriteTab === 'tours'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Turlar
        </button>
      </div>
      
      {/* Favoriler listesi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites[favoriteTab].map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow transition-shadow"
          >
            <div className="relative h-44">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
              <button 
                onClick={() => onToggleFavorite(item)}
                className="absolute top-2 right-2 p-1.5 bg-white dark:bg-gray-800 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <HeartIcon className="h-5 w-5 text-red-500" />
              </button>
            </div>
            
            <div className="p-4">
              <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1">{item.name}</h3>
              
              <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                <MapPinIcon className="h-4 w-4 mr-1" />
                <span className="truncate">{item.location}</span>
              </div>
              
              <div className="flex items-center mt-1.5">
                <div className="flex items-center">
                  <StarIcon className="h-4 w-4 text-yellow-400" />
                  <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">{item.rating}</span>
                </div>
                <span className="mx-1.5 text-gray-500 dark:text-gray-400">•</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{item.reviewCount} değerlendirme</span>
              </div>
              
              <div className="mt-3 flex items-center justify-between">
                <div className="text-base font-bold text-gray-900 dark:text-white">
                  {item.price.toLocaleString('tr-TR')} ₺
                  {item.type === 'hotel' ? (
                    <span className="text-xs font-normal text-gray-500 dark:text-gray-400"> / gece</span>
                  ) : (
                    <span className="text-xs font-normal text-gray-500 dark:text-gray-400"> / kişi</span>
                  )}
                </div>
                
                <Link
                  href={`/${item.type === 'hotel' ? 'hotel' : 'tour'}/${item.id}`}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                >
                  Detaylar
                </Link>
              </div>
            </div>
          </div>
        ))}
        
        {favorites[favoriteTab].length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center text-gray-500 dark:text-gray-400">
            <HeartIcon className="h-12 w-12 mb-3" />
            <h3 className="text-lg font-medium">Henüz favori {favoriteTab === 'hotels' ? 'otel' : 'tur'} eklemediniz</h3>
            <p className="mt-1">Beğendiğiniz otelleri ve turları favorilerinize ekleyin.</p>
            <Link 
              href={favoriteTab === 'hotels' ? '/hotel' : '/tour'}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              {favoriteTab === 'hotels' ? 'Otelleri' : 'Turları'} Keşfet
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 