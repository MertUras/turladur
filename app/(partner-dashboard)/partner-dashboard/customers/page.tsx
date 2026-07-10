'use client';

import { useState, useEffect, Fragment } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, PlusIcon, ArrowDownTrayIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Transition, Menu, Popover } from '@headlessui/react';
import CustomerCard, { CustomerCardProps } from '@/app/components/partner-dashboard/CustomerCard';
import { PartnerCustomer } from '@/lib/partner/customers';

const RECENT_DAYS = 30;
const HIGH_VALUE_THRESHOLD = 5000;
const FREQUENT_BOOKINGS_THRESHOLD = 4;

function mapCustomerToCard(customer: PartnerCustomer): CustomerCardProps & { totalSpentAmount: number; lastBookingAt: string } {
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    location: customer.location,
    totalBookings: customer.totalBookings,
    totalSpent: customer.totalSpentFormatted,
    lastBookingDate: customer.lastBookingDate,
    profileImage: customer.profileImage,
    totalSpentAmount: customer.totalSpent,
    lastBookingAt: customer.lastBookingAt,
  };
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<(CustomerCardProps & { totalSpentAmount: number; lastBookingAt: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/partner/customers');
      if (!response.ok) {
        throw new Error('Müşteriler yüklenemedi');
      }
      const data = await response.json();
      setCustomers((data.customers || []).map(mapCustomerToCard));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const isRecentCustomer = (lastBookingAt: string) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - RECENT_DAYS);
    return new Date(lastBookingAt) >= cutoff;
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.location.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'all') return true;
    if (activeFilter === 'high_value') {
      return customer.totalSpentAmount >= HIGH_VALUE_THRESHOLD;
    }
    if (activeFilter === 'recent') {
      return isRecentCustomer(customer.lastBookingAt);
    }
    if (activeFilter === 'frequent') {
      return customer.totalBookings >= FREQUENT_BOOKINGS_THRESHOLD;
    }

    return true;
  });

  const filterOptions = [
    { id: 'all', name: 'Tümü' },
    { id: 'high_value', name: 'Yüksek Değerli Müşteriler' },
    { id: 'recent', name: 'Son Rezervasyon Yapanlar' },
    { id: 'frequent', name: 'Sık Müşteriler' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchCustomers}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                        <span className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} block px-4 py-2 text-sm cursor-default`}>
                          Excel (.xlsx)
                        </span>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <span className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} block px-4 py-2 text-sm cursor-default`}>
                          CSV
                        </span>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <span className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} block px-4 py-2 text-sm cursor-default`}>
                          PDF
                        </span>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>

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
                      {filterOptions.find((option) => option.id === activeFilter)?.name || 'Filtreler'}
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

        <div className="mt-2">
          <p className="text-sm text-gray-500 mb-4">
            {filteredCustomers.length} müşteri gösteriliyor
          </p>

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
                  {customers.length === 0
                    ? 'Henüz rezervasyon yapan müşteri bulunmuyor'
                    : 'Farklı bir arama veya filtre deneyin'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
