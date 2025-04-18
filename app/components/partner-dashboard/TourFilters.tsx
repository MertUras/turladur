import { useState } from 'react';
import { AdjustmentsHorizontalIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export interface TourFiltersProps {
  onFilterChange: (filters: TourFilters) => void;
}

export interface TourFilters {
  search: string;
  status: string[];
  sortBy: string;
}

export default function TourFilters({ onFilterChange }: TourFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<TourFilters>({
    search: '',
    status: [],
    sortBy: 'newest'
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, search: e.target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleStatusChange = (status: string) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    
    const newFilters = { ...filters, status: newStatus };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilters = { ...filters, sortBy: e.target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div>
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4">
        {/* Arama */}
        <div className="flex-1 min-w-0">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2.5 text-sm border-gray-200 rounded-lg"
              placeholder="Tur ara..."
              value={filters.search}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Sıralama */}
          <div className="w-full md:w-48">
            <select
              className="block w-full pl-3 pr-10 py-2.5 text-sm border-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-lg bg-white"
              value={filters.sortBy}
              onChange={handleSortChange}
            >
              <option value="newest">En Yeni</option>
              <option value="oldest">En Eski</option>
              <option value="price_low">Fiyat (Düşük-Yüksek)</option>
              <option value="price_high">Fiyat (Yüksek-Düşük)</option>
              <option value="popular">Popülerlik</option>
            </select>
          </div>

          {/* Filtre Butonu */}
          <div>
            <button
              type="button"
              className={`inline-flex items-center px-4 py-2.5 border ${isOpen ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 bg-white text-gray-700'} text-sm font-medium rounded-lg hover:bg-gray-50 shadow-sm transition-all duration-200`}
              onClick={() => setIsOpen(!isOpen)}
            >
              <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
              Filtrele
            </button>
          </div>
        </div>
      </div>

      {/* Filtre Paneli */}
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div>
            <h3 className="text-xs font-medium text-gray-700 mb-2">Durum</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'active', name: 'Aktif' },
                { id: 'draft', name: 'Taslak' },
                { id: 'archived', name: 'Arşivlenmiş' }
              ].map((status) => (
                <button
                  key={status.id}
                  onClick={() => handleStatusChange(status.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    filters.status.includes(status.id)
                      ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                      : 'bg-gray-50 text-gray-700 border border-gray-100 hover:bg-gray-100'
                  }`}
                >
                  {status.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 