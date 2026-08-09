'use client';

import Image from 'next/image';
import {
  Calendar,
  ChevronDown,
  Clock,
  Filter,
  MapPin,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useActivitiesPageUi } from './activities-page-context';

/** Split from activities-page-client.tsx (Faz 7) — hero + search/filters; UI unchanged. */
export function ActivitiesPageHero() {
  const {
    searchTerm,
    setSearchTerm,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    maxDuration,
    setMaxDuration,
    selectedActivityType,
    setSelectedActivityType,
    selectedCity,
    setSelectedCity,
    sortBy,
    setSortBy,
    isFilterMenuOpen,
    setIsFilterMenuOpen,
    filterMenuRef,
    resetFilters,
    cities,
    activityTypes,
    sortOptions,
    activeFilters,
  } = useActivitiesPageUi();

  return (
    <section className="relative w-full h-[550px] md:h-[600px]">
      <Image
        src="https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?q=80&w=2070&auto=format&fit=crop"
        alt="Bölge Aktiviteleri"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-br from-sky-700/70 via-blue-800/60 to-sky-900/70 pointer-events-none" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Unutulmaz <span className="text-sky-300">Deneyimler</span> Keşfedin
          </h1>
          <p className="mt-4 text-lg text-sky-100/90 max-w-3xl mx-auto font-light">
            Türkiye&apos;nin dört bir yanındaki en popüler turları ve
            aktiviteleri bulun.
          </p>
        </div>

        {/* Arama/Filtre Çubuğu Güncellendi */}
        <div className="relative z-10 w-full max-w-4xl mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-full shadow-xl p-1.5 flex items-center gap-1.5">
            {/* Search Input */}
            <div className="flex-1 relative pl-3 pr-2 flex items-center">
              <Search className="h-4 w-4 text-neutral-400 mr-2.5 flex-shrink-0" />
              <input
                type="text"
                placeholder="Aktivite, şehir veya açıklama ara..."
                className="w-full py-2.5 text-sm text-neutral-900 placeholder-neutral-500 focus:outline-none bg-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Button */}
            <div className="relative" ref={filterMenuRef}>
              <button
                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-xs font-semibold transition-colors ${isFilterMenuOpen || activeFilters.length > 0 ? 'bg-sky-100/80 text-sky-700' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Filtrele</span>
                {activeFilters.length > 0 && (
                  <span className="ml-0.5 bg-sky-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {activeFilters.length}
                  </span>
                )}
              </button>

              {/* Filter Dropdown/Menu - Stil Güncellendi */}
              {isFilterMenuOpen && (
                <div
                  className={cn(
                    'absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-neutral-100/80 z-50 overflow-hidden',
                    'transition-all duration-200 ease-out',
                    isFilterMenuOpen
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-95 pointer-events-none',
                  )}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3 pb-3 border-b border-neutral-100">
                      <h4 className="text-sm font-semibold text-neutral-800">
                        Filtreler
                      </h4>
                      <button
                        onClick={resetFilters}
                        className="text-xs text-neutral-500 hover:text-rose-600 font-medium flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={
                          activeFilters.length === 0 && sortBy === 'popularity'
                        }
                      >
                        <Trash2 className="w-3 h-3" />
                        Temizle
                      </button>
                    </div>

                    {/* Filter Options - Stiller Güncellendi */}
                    <div className="space-y-3.5">
                      {/* Sort By */}
                      <div>
                        <label className="block text-xs font-medium text-neutral-600 mb-1">
                          Sırala
                        </label>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-300 focus:border-sky-500 bg-white appearance-none"
                        >
                          {sortOptions.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Activity Type */}
                      <div>
                        <label className="block text-xs font-medium text-neutral-600 mb-1">
                          Aktivite Türü
                        </label>
                        <select
                          value={selectedActivityType || ''}
                          onChange={(e) =>
                            setSelectedActivityType(e.target.value || undefined)
                          }
                          className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-300 focus:border-sky-500 bg-white appearance-none"
                        >
                          <option value="">Tüm Türler</option>
                          {activityTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* City */}
                      <div>
                        <label className="block text-xs font-medium text-neutral-600 mb-1">
                          Şehir
                        </label>
                        <select
                          value={selectedCity || ''}
                          onChange={(e) =>
                            setSelectedCity(e.target.value || undefined)
                          }
                          className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-300 focus:border-sky-500 bg-white appearance-none"
                        >
                          <option value="">Tüm Şehirler</option>
                          {cities.map((city: string) => (
                            <option key={city} value={city.toLowerCase()}>
                              {city}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Price Range */}
                      <div>
                        <label className="block text-xs font-medium text-neutral-600 mb-1">
                          Fiyat Aralığı (₺)
                        </label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            placeholder="Min"
                            min="0"
                            className="w-1/2 px-3 py-1.5 text-xs border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-300 focus:border-sky-500"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                          />
                          <span className="text-neutral-400 text-sm">-</span>
                          <input
                            type="number"
                            placeholder="Max"
                            min="0"
                            className="w-1/2 px-3 py-1.5 text-xs border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-300 focus:border-sky-500"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Max Duration */}
                      <div>
                        <label
                          htmlFor="max-duration"
                          className="block text-xs font-medium text-neutral-600 mb-1.5"
                        >
                          Maksimum Süre (Saat)
                        </label>
                        <input
                          id="max-duration"
                          type="range"
                          min="1"
                          max="24" // Adjust max as needed
                          step="1"
                          value={maxDuration || 24}
                          onChange={(e) =>
                            setMaxDuration(
                              e.target.valueAsNumber === 24
                                ? ''
                                : e.target.value,
                            )
                          }
                          className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer range-thumb-sky accent-sky-600"
                        />
                        <div className="flex justify-between text-xs text-neutral-500 mt-1">
                          <span>1 sa</span>
                          <span>
                            {maxDuration ? `${maxDuration} sa` : 'Sınırsız'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsFilterMenuOpen(false)}
                      className="mt-4 w-full bg-sky-600 hover:bg-sky-700 text-white py-2 px-4 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Filtreleri Uygula
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Search Button */}
            <button className="bg-sky-600 hover:bg-sky-700 text-white rounded-full p-2.5 transition-colors shadow-md">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
