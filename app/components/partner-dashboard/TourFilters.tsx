import { useState } from 'react';
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

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
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
        {/* Arama */}
        <div className="flex-1 min-w-0">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Tur ara..."
              value={filters.search}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Sıralama */}
        <div className="w-full md:w-48">
          <select
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => setIsOpen(!isOpen)}
          >
            <FunnelIcon className="h-5 w-5 mr-2 text-gray-400" />
            Filtrele
          </button>
        </div>
      </div>

      {/* Filtre Paneli */}
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Durum</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {['active', 'draft', 'archived'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                    filters.status.includes(status)
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {status === 'active' && 'Aktif'}
                  {status === 'draft' && 'Taslak'} 
                  {status === 'archived' && 'Arşivlenmiş'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 