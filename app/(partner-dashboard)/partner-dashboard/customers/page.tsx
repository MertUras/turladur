'use client';

import { useState, Fragment } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, PlusIcon, ArrowDownTrayIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Transition, Menu, Popover } from '@headlessui/react';
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
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Arama işlemi
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Filtreleme işlemi
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  // Filtrelenmiş ve aranmış müşteriler
  const filteredCustomers = customers.filter(customer => {
    // Arama kriteri
    const matchesSearch = searchTerm.trim() === '' ||
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.location.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtre kriteri
    if (activeFilter === 'all') {
      return matchesSearch;
    } else if (activeFilter === 'high_value') {
      return matchesSearch && parseFloat(customer.totalSpent.replace(/[^\d.]/g, '')) > 5000;
    } else if (activeFilter === 'recent') {
      return matchesSearch && customer.lastBookingDate.includes('Ağu') || customer.lastBookingDate.includes('Eyl');
    } else if (activeFilter === 'frequent') {
      return matchesSearch && customer.totalBookings > 4;
    }

    return matchesSearch;
  });

  // Filtre seçenekleri
  const filterOptions = [
    { id: 'all', name: 'Tümü' },
    { id: 'high_value', name: 'Yüksek Değerli Müşteriler' },
    { id: 'recent', name: 'Son Rezervasyon Yapanlar' },
    { id: 'frequent', name: 'Sık Müşteriler' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Başlık ve Üst Bölüm */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Müşteriler</h1>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Yeni Müşteri
            </button>

            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex items-center justify-center w-full px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
                  <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                  Dışa Aktar
                  <ChevronDownIcon className="h-4 w-4 ml-2" aria-hidden="true" />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={`${
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                          } block px-4 py-2 text-sm`}
                        >
                          Excel (.xlsx)
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={`${
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                          } block px-4 py-2 text-sm`}
                        >
                          CSV
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={`${
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                          } block px-4 py-2 text-sm`}
                        >
                          PDF
                        </a>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>

        {/* Arama ve Filtreler */}
        <div className="mt-8 mb-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
            <div className="flex-1 min-w-0">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 py-3 sm:text-sm border-gray-300 rounded-md"
                  placeholder="İsim, e-posta veya konum ile ara..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <div>
              <Popover className="relative">
                {({ open }) => (
                  <>
                    <Popover.Button
                      className={`inline-flex items-center px-4 py-3 border ${
                        open ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-300 bg-white text-gray-700'
                      } text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200`}
                    >
                      <FunnelIcon className="h-5 w-5 mr-2" />
                      {filterOptions.find(option => option.id === activeFilter)?.name || 'Filtreler'}
                      <ChevronDownIcon
                        className={`ml-2 h-4 w-4 ${open ? 'transform rotate-180' : ''}`}
                        aria-hidden="true"
                      />
                    </Popover.Button>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1"
                    >
                      <Popover.Panel className="absolute right-0 z-10 mt-2 w-60 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          {filterOptions.map((option) => (
                            <button
                              key={option.id}
                              onClick={() => handleFilterChange(option.id)}
                              className={`${
                                activeFilter === option.id
                                  ? 'bg-indigo-50 text-indigo-700 font-medium'
                                  : 'text-gray-700'
                              } flex items-center w-full px-4 py-3 text-sm hover:bg-gray-50`}
                            >
                              {option.name}
                            </button>
                          ))}
                        </div>
                      </Popover.Panel>
                    </Transition>
                  </>
                )}
              </Popover>
            </div>
          </div>
        </div>

        {/* Müşteri Sonuçları */}
        <div className="mt-2">
          <p className="text-sm text-gray-500 mb-4">
            {filteredCustomers.length} müşteri gösteriliyor
          </p>

          {/* Müşteri Kartları */}
          <div className="grid grid-cols-1 gap-6">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <CustomerCard key={customer.id} {...customer} />
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                  <MagnifyingGlassIcon className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Müşteri bulunamadı</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Farklı bir arama veya filtre deneyin
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 