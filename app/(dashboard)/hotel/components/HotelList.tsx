"use client";

import React, { useState, useMemo } from 'react';
import { Hotel, FeatureIconInfo } from '@/types/hotel';
import HotelCard from './HotelCard';

interface HotelListProps {
  hotels: Hotel[];
  featureIcons: FeatureIconInfo[];
}

const HotelList: React.FC<HotelListProps> = ({ hotels: initialHotels, featureIcons }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('popular');
  const [filterBy, setFilterBy] = useState('all');
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Filtreleme ve sıralama işlemleri
  const filteredAndSortedHotels = useMemo(() => {
    let result = [...initialHotels];

    // Filtreleme
    if (filterBy !== 'all') {
      result = result.filter(hotel => {
        switch (filterBy) {
          case '5-star':
            return hotel.stars === 5;
          case '4-star':
            return hotel.stars === 4;
          case '3-star':
            return hotel.stars === 3;
          case 'breakfast':
            return hotel.breakfast;
          case 'pool':
            return hotel.features.includes('Havuz');
          case 'spa':
            return hotel.features.includes('Spa');
          default:
            return true;
        }
      });
    }

    // Sıralama
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        result.sort((a, b) => b.discount - a.discount);
        break;
      default: // popular
        result.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return result;
  }, [initialHotels, filterBy, sortBy]);

  // Sayfalama için hesaplamalar
  const totalPages = Math.ceil(filteredAndSortedHotels.length / itemsPerPage);
  const paginatedHotels = filteredAndSortedHotels.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <p className="text-sm text-gray-600">{filteredAndSortedHotels.length} otel bulundu</p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <select 
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="popular">En Popüler</option>
            <option value="price-low">Fiyat (Düşükten Yükseğe)</option>
            <option value="price-high">Fiyat (Yüksekten Düşüğe)</option>
            <option value="rating">Puan (En Yüksek)</option>
            <option value="discount">İndirim Oranı</option>
          </select>

          <select 
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
          >
            <option value="all">Tüm Oteller</option>
            <option value="5-star">5 Yıldızlı</option>
            <option value="4-star">4 Yıldızlı</option>
            <option value="3-star">3 Yıldızlı</option>
            <option value="breakfast">Kahvaltı Dahil</option>
            <option value="pool">Havuzlu</option>
            <option value="spa">Spa</option>
          </select>

          <select 
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value="6">Sayfa Başına 6 Otel</option>
            <option value="12">Sayfa Başına 12 Otel</option>
            <option value="24">Sayfa Başına 24 Otel</option>
            <option value="36">Sayfa Başına 36 Otel</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedHotels.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} featureIcons={featureIcons} />
        ))}
      </div>

      {/* Sayfalama */}
      <div className="mt-8 flex justify-center items-center gap-2">
        <button 
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed text-blue-600 hover:text-blue-700 disabled:text-gray-400"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          Önceki
        </button>
        
        <div className="flex items-center gap-2">
          {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
            const pageNumber = index + 1;
            return (
              <button
                key={pageNumber}
                className={`w-10 h-10 rounded-lg text-sm ${
                  currentPage === pageNumber
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
                onClick={() => setCurrentPage(pageNumber)}
              >
                {pageNumber}
              </button>
            );
          })}
          {totalPages > 5 && (
            <>
              <span className="text-gray-500">...</span>
              <button
                className={`w-10 h-10 rounded-lg text-sm ${
                  currentPage === totalPages
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
                onClick={() => setCurrentPage(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button 
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed text-blue-600 hover:text-blue-700 disabled:text-gray-400"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          Sonraki
        </button>
      </div>
    </div>
  );
};

export default HotelList; 