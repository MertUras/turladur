'use client';

import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  BanknotesIcon, 
  AdjustmentsHorizontalIcon, 
  XMarkIcon,
  ArrowPathIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { 
  FireIcon as FireIconSolid,
  CheckBadgeIcon as CheckBadgeIconSolid
} from '@heroicons/react/24/solid';
import FeatureIcon from './FeatureIcon';

interface City {
  id: string;
  label: string;
  count: number;
}

interface PriceRange {
  id: string;
  label: string;
}

interface FeatureFilter {
  id: string;
  label: string;
  icon: string;
}

interface PopularFilter {
  id: string;
  label: string;
  icon: string;
}

interface HotelFiltersProps {
  cities: City[];
  priceRanges: PriceRange[];
  featureFilters: FeatureFilter[];
  popularFilters: PopularFilter[];
}

export default function HotelFilters({ 
  cities, 
  priceRanges, 
  featureFilters, 
  popularFilters 
}: HotelFiltersProps) {
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Aktif filtre sayısını hesapla
  const activeFilters = (selectedCity !== 'all' ? 1 : 0) + 
                        (selectedPriceRange !== 'all' ? 1 : 0) + 
                        selectedFeatures.length;

  // Filtreleri temizle
  const clearFilters = () => {
    setSelectedCity('all');
    setSelectedPriceRange('all');
    setSelectedFeatures([]);
    setSearchQuery('');
  };

  return (
    <>
      {/* Aktif Filtreler */}
      {activeFilters > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6 mt-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
          <h3 className="w-full text-sm font-semibold text-blue-700 mb-2">Aktif Filtreler</h3>
          
          {selectedCity !== 'all' && (
            <div className="bg-white text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 border border-blue-200">
              {cities.find(c => c.id === selectedCity)?.label}
              <button onClick={() => setSelectedCity('all')} className="ml-1 text-blue-500 hover:text-blue-700">
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          )}
          
          {selectedPriceRange !== 'all' && (
            <div className="bg-white text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 border border-blue-200">
              <BanknotesIcon className="w-4 h-4" />
              {priceRanges.find(p => p.id === selectedPriceRange)?.label}
              <button onClick={() => setSelectedPriceRange('all')} className="ml-1 text-blue-500 hover:text-blue-700">
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          )}
          
          {selectedFeatures.map(feature => (
            <div key={feature} className="bg-white text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 border border-blue-200">
              <CheckIcon className="w-4 h-4" />
              {featureFilters.find(f => f.id === feature)?.label}
              <button 
                onClick={() => setSelectedFeatures(selectedFeatures.filter(f => f !== feature))} 
                className="ml-1 text-blue-500 hover:text-blue-700"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          <button 
            onClick={clearFilters}
            className="mt-2 w-full text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center gap-1.5 bg-white py-2 px-3 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Tüm Filtreleri Temizle
          </button>
        </div>
      )}

      {/* Mobil Filtre Butonu */}
      <div className="lg:hidden mb-4">
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg py-3 px-4 text-gray-700 font-medium shadow-sm hover:bg-gray-50 transition-colors"
        >
          <AdjustmentsHorizontalIcon className="w-5 h-5" />
          Filtreleri {showFilters ? 'Gizle' : 'Göster'}
          {activeFilters > 0 && (
            <span className="bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilters}
            </span>
          )}
        </button>
      </div>

      {/* Filtreler (Mobilde Gizlenebilir) */}
      <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
        {/* Arama */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <MagnifyingGlassIcon className="w-5 h-5 text-blue-600" />
            Otel Ara
          </h3>
          <div className="relative">
            <input
              type="text"
              placeholder="Otel adı veya özellik ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow-sm text-gray-800"
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
          </div>
        </div>

        {/* Popüler Filtreler */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <FireIconSolid className="w-5 h-5 text-blue-600" />
            Popüler Filtreler
          </h3>
          <div className="space-y-2">
            {popularFilters.map(filter => (
              <button
                key={filter.id}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-blue-50 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <div className="text-blue-600 group-hover:text-blue-700">
                    <FeatureIcon type={filter.icon} />
                  </div>
                  <span className="text-gray-700 group-hover:text-blue-700 font-medium">{filter.label}</span>
                </div>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full group-hover:bg-blue-100 group-hover:text-blue-700">142</span>
              </button>
            ))}
          </div>
        </div>

        {/* Fiyat Aralığı */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <BanknotesIcon className="w-5 h-5 text-blue-600" />
            Fiyat Aralığı
          </h3>
          <div className="space-y-3">
            {priceRanges.map(range => (
              <label
                key={range.id}
                className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-colors ${
                  selectedPriceRange === range.id 
                    ? 'bg-blue-50 border border-blue-100' 
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <input
                    type="radio"
                    name="priceRange"
                    value={range.id}
                    checked={selectedPriceRange === range.id}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500 h-5 w-5"
                  />
                </div>
                <span className={`font-medium ${selectedPriceRange === range.id ? 'text-blue-700' : 'text-gray-700'}`}>
                  {range.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Özellikler */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <CheckBadgeIconSolid className="w-5 h-5 text-blue-600" />
            Otel Özellikleri
          </h3>
          <div className="space-y-3">
            {featureFilters.map(feature => (
              <label
                key={feature.id}
                className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-colors ${
                  selectedFeatures.includes(feature.id) 
                    ? 'bg-blue-50 border border-blue-100' 
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    value={feature.id}
                    checked={selectedFeatures.includes(feature.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFeatures([...selectedFeatures, feature.id]);
                      } else {
                        setSelectedFeatures(selectedFeatures.filter(f => f !== feature.id));
                      }
                    }}
                    className="text-blue-600 focus:ring-blue-500 rounded h-5 w-5"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-blue-600">
                    <FeatureIcon type={feature.icon} />
                  </div>
                  <span className={`font-medium ${selectedFeatures.includes(feature.id) ? 'text-blue-700' : 'text-gray-700'}`}>
                    {feature.label}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </>
  );
} 