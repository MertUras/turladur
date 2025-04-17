'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, PlusIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import CustomerCard, { CustomerCardProps } from '@/app/components/partner-dashboard/CustomerCard';

// Örnek müşteri verileri
const demoCustomers: CustomerCardProps[] = [
  {
    id: '1',
    name: 'Ahmet Yılmaz',
    email: 'ahmet@ornek.com',
    phone: '+90 (555) 123 4567',
    location: 'İstanbul, Türkiye',
    totalBookings: 5,
    totalSpent: '4.850₺',
    lastBookingDate: '12 Haz 2023',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: '2',
    name: 'Ayşe Demir',
    email: 'ayse@ornek.com',
    phone: '+90 (555) 234 5678',
    location: 'Ankara, Türkiye',
    totalBookings: 3,
    totalSpent: '2.750₺',
    lastBookingDate: '18 Tem 2023'
  },
  {
    id: '3',
    name: 'Mehmet Kaya',
    email: 'mehmet@ornek.com',
    phone: '+90 (555) 345 6789',
    location: 'İzmir, Türkiye',
    totalBookings: 7,
    totalSpent: '6.200₺',
    lastBookingDate: '3 Ağu 2023',
    profileImage: 'https://randomuser.me/api/portraits/men/41.jpg'
  },
  {
    id: '4',
    name: 'Zeynep Şahin',
    email: 'zeynep@ornek.com',
    phone: '+90 (555) 456 7890',
    location: 'Antalya, Türkiye',
    totalBookings: 2,
    totalSpent: '1.950₺',
    lastBookingDate: '22 Haz 2023',
    profileImage: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: '5',
    name: 'Can Öztürk',
    email: 'can@ornek.com',
    phone: '+90 (555) 567 8901',
    location: 'Bursa, Türkiye',
    totalBookings: 4,
    totalSpent: '3.600₺',
    lastBookingDate: '5 Eyl 2023'
  },
  {
    id: '6',
    name: 'Deniz Aksoy',
    email: 'deniz@ornek.com',
    phone: '+90 (555) 678 9012',
    location: 'Muğla, Türkiye',
    totalBookings: 6,
    totalSpent: '5.400₺',
    lastBookingDate: '29 Tem 2023',
    profileImage: 'https://randomuser.me/api/portraits/women/29.jpg'
  }
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState(demoCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Arama işlemi
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Filtreleme işlemi
  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  // Filtrelenmiş ve aranmış müşteriler
  const filteredCustomers = customers.filter(customer => {
    // Arama kriteri
    const matchesSearch = searchTerm.trim() === '' ||
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.location.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtre kriteri
    if (selectedFilter === 'all') {
      return matchesSearch;
    } else if (selectedFilter === 'high_value') {
      return matchesSearch && parseFloat(customer.totalSpent.replace(/[^\d.]/g, '')) > 5000;
    } else if (selectedFilter === 'recent') {
      // Bu örnek için basitleştirilmiş bir kontrol - gerçek uygulamada tarih kontrolü yapılır
      return matchesSearch && customer.lastBookingDate.includes('Ağu') || customer.lastBookingDate.includes('Eyl');
    } else if (selectedFilter === 'frequent') {
      return matchesSearch && customer.totalBookings > 4;
    }

    return matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Müşteriler</h1>
        <div className="mt-3 sm:mt-0 flex space-x-3">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Yeni Müşteri
          </button>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Dışa Aktar
          </button>
        </div>
      </div>

      {/* Arama ve Filtreler */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex-1 min-w-0">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Müşteri ara..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              className={`inline-flex items-center px-4 py-2 border ${showFilters ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-300 bg-white text-gray-700'} text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filtreler
            </button>
          </div>
        </div>

        {/* Filtre Seçenekleri */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleFilterChange('all')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  selectedFilter === 'all'
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                Tümü
              </button>
              <button
                onClick={() => handleFilterChange('high_value')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  selectedFilter === 'high_value'
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                Yüksek Değerli Müşteriler
              </button>
              <button
                onClick={() => handleFilterChange('recent')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  selectedFilter === 'recent'
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                Son Rezervasyon Yapanlar
              </button>
              <button
                onClick={() => handleFilterChange('frequent')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  selectedFilter === 'frequent'
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                Sık Müşteriler
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Müşteri Kartları */}
      <div className="grid grid-cols-1 gap-6">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => (
            <CustomerCard key={customer.id} {...customer} />
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
              <MagnifyingGlassIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Müşteri bulunamadı</h3>
            <p className="mt-1 text-sm text-gray-500">
              Farklı bir arama veya filtre deneyin
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 