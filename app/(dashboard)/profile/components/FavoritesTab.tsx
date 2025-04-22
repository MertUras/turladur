'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HeartIcon, MapPinIcon, StarIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/20/solid';

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

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={`full-${i}`} className="h-4 w-4 text-yellow-400 fill-yellow-400" />);
    }
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarIcon key={`empty-${i}`} className="h-4 w-4 text-neutral-300 fill-neutral-300" />);
    }
    return stars;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-neutral-900">Favorilerim</h2>
      </div>
      
      <div className="flex space-x-1 border-b border-neutral-200">
        {[
          { key: 'hotels', label: 'Oteller' },
          { key: 'tours', label: 'Turlar' },
        ].map(tab => (
          <button 
            key={tab.key}
            onClick={() => setFavoriteTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-150 ${ 
              favoriteTab === tab.key
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {favorites[favoriteTab]?.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center text-center py-16 bg-neutral-100 rounded-xl border border-neutral-200/80">
            <HeartIcon className="h-10 w-10 text-neutral-400 mb-4" />
            <h3 className="text-lg font-medium text-neutral-600">Henüz favori {favoriteTab === 'hotels' ? 'otel' : 'tur'} eklemediniz</h3>
            <p className="mt-1 text-neutral-500 text-sm mb-6">Beğendiğiniz {favoriteTab === 'hotels' ? 'otelleri' : 'turları'} favorilerinize ekleyebilirsiniz.</p>
            <Link 
              href={favoriteTab === 'hotels' ? '/hotel' : '/tour'}
              className="inline-flex items-center justify-center px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              {favoriteTab === 'hotels' ? 'Otelleri' : 'Turları'} Keşfet
            </Link>
          </div>
        ) : (
          favorites[favoriteTab]?.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl overflow-hidden border border-neutral-200/50 shadow-sm transition-shadow duration-300 hover:shadow-md"
            >
              <div className="relative h-44 group">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
                <button 
                  onClick={() => onToggleFavorite(item)}
                  className="absolute top-2 right-2 p-1.5 bg-black/30 text-white rounded-full transition-all duration-200 opacity-80 hover:opacity-100 hover:bg-black/50 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 focus:ring-offset-black/30"
                  title="Favorilerden Kaldır"
                >
                  <HeartSolidIcon className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-neutral-900 line-clamp-1 text-base mb-1">{item.name}</h3>
                
                <div className="flex items-center text-xs text-neutral-500 mb-1.5">
                  <MapPinIcon className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>
                
                <div className="flex items-center text-xs mb-2.5">
                  <div className="flex items-center mr-1.5">{renderStars(item.rating)}</div>
                  <span className="text-neutral-500">({item.reviewCount})</span>
                </div>
                
                <div className="flex items-center justify-between border-t border-neutral-100 pt-3 mt-3">
                  <div className="text-base font-semibold text-neutral-900">
                    {item.price.toLocaleString('tr-TR')} ₺
                    <span className="ml-1 text-xs font-normal text-neutral-500">{item.type === 'hotel' ? '/ gece' : '/ kişi'}</span>
                  </div>
                  
                  <Link
                    href={`/${item.type === 'hotel' ? 'hotel' : 'tour'}/${item.id}`}
                    className="inline-flex items-center text-sky-600 hover:text-sky-800 text-xs font-medium hover:bg-sky-50 px-2.5 py-1 rounded-md transition-colors"
                  >
                    Detaylar
                    <ArrowRightIcon className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 