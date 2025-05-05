'use client';

import { useState } from 'react';
import { 
  FunnelIcon,
  ChevronDownIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

interface AdvancedFiltersProps {
  onFilterChange: (filters: any) => void;
}

const AdvancedFilters = ({ onFilterChange }: AdvancedFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: { min: '', max: '' },
    dateRange: { start: '', end: '' },
    sortBy: 'popularity',
    agency: '',
    rating: '',
    category: '',
    status: ''
  });

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      priceRange: { min: '', max: '' },
      dateRange: { start: '', end: '' },
      sortBy: 'popularity',
      agency: '',
      rating: '',
      category: '',
      status: ''
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <button
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
            onClick={() => setShowFilters(!showFilters)}
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5" />
            <span>Gelişmiş Filtreler</span>
            <ChevronDownIcon className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={clearFilters}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 space-y-4">
            {/* Fiyat Aralığı */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat Aralığı</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={filters.priceRange.min}
                  onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, min: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={filters.priceRange.max}
                  onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, max: e.target.value })}
                />
              </div>
            </div>

            {/* Tarih Aralığı */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tarih Aralığı</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={filters.dateRange.start}
                  onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })}
                />
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={filters.dateRange.end}
                  onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })}
                />
              </div>
            </div>

            {/* Sıralama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sıralama</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="popularity">Popülerliğe Göre</option>
                <option value="price_asc">Fiyat (Düşükten Yükseğe)</option>
                <option value="price_desc">Fiyat (Yüksekten Düşüğe)</option>
                <option value="rating">Puana Göre</option>
                <option value="date_asc">Tarih (Yakından Uzağa)</option>
                <option value="date_desc">Tarih (Uzaktan Yakına)</option>
              </select>
            </div>

            {/* Acente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Acente</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={filters.agency}
                onChange={(e) => handleFilterChange('agency', e.target.value)}
              >
                <option value="">Tümü</option>
                <option value="1">Anadolu Turizm</option>
                <option value="2">Ege Turizm</option>
                <option value="3">Akdeniz Turizm</option>
              </select>
            </div>

            {/* Puan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Puan</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
              >
                <option value="">Tümü</option>
                <option value="4">4 ve üzeri</option>
                <option value="3">3 ve üzeri</option>
                <option value="2">2 ve üzeri</option>
                <option value="1">1 ve üzeri</option>
              </select>
            </div>

            {/* Kategori */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">Tümü</option>
                <option value="culture">Kültür Turu</option>
                <option value="nature">Doğa Turu</option>
                <option value="adventure">Macera Turu</option>
                <option value="religious">Dini Tur</option>
                <option value="beach">Plaj Turu</option>
                <option value="city">Şehir Turu</option>
              </select>
            </div>

            {/* Durum */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">Tümü</option>
                <option value="published">Yayında</option>
                <option value="pending">Bekleyen</option>
                <option value="cancelled">İptal Edilmiş</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedFilters; 