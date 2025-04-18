'use client';

import { useState, Fragment } from 'react';
import { 
  CurrencyDollarIcon, 
  ArrowDownIcon, 
  ArrowUpIcon, 
  DocumentTextIcon, 
  ArrowPathIcon, 
  ChevronDownIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { CurrencyDollarIcon as CurrencyDollarSolidIcon } from '@heroicons/react/24/solid';
import { Transition, Menu, Popover } from '@headlessui/react';

export default function FinancialsPage() {
  const [dateRange, setDateRange] = useState('thisMonth');
  const [paymentFilter, setPaymentFilter] = useState('all');
  
  // Örnek veri
  const financialSummary = {
    totalRevenue: 78500,
    pendingPayments: 12350,
    totalPayouts: 65200,
    netProfit: 52640,
    comparedToLastPeriod: 14.5,
    increase: true
  };

  const recentTransactions = [
    { id: 1, date: '15 Kas 2023', type: 'ödeme', amount: 2500, status: 'tamamlandı', customer: 'Mehmet Yılmaz', tourName: 'Kapadokya Turu' },
    { id: 2, date: '13 Kas 2023', type: 'ödeme', amount: 3200, status: 'tamamlandı', customer: 'Ayşe Kaya', tourName: 'İstanbul Boğaz Turu' },
    { id: 3, date: '10 Kas 2023', type: 'komisyon', amount: -450, status: 'tamamlandı', customer: 'Sistem', tourName: 'Platform Komisyonu' },
    { id: 4, date: '08 Kas 2023', type: 'ödeme', amount: 1800, status: 'tamamlandı', customer: 'Ali Demir', tourName: 'Efes Antik Kenti Turu' },
    { id: 5, date: '05 Kas 2023', type: 'iade', amount: -1500, status: 'tamamlandı', customer: 'Zeynep Şahin', tourName: 'Pamukkale Turu' },
    { id: 6, date: '02 Kas 2023', type: 'ödeme', amount: 4200, status: 'beklemede', customer: 'Emre Yıldız', tourName: 'Karadeniz Yaylalar Turu' },
    { id: 7, date: '01 Kas 2023', type: 'ödeme', amount: 2800, status: 'tamamlandı', customer: 'Deniz Aksoy', tourName: 'Fethiye Tekne Turu' },
  ];

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'tamamlandı':
        return 'bg-green-100 text-green-800';
      case 'beklemede':
        return 'bg-yellow-100 text-yellow-800';
      case 'iptal':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeClass = (type: string) => {
    switch (type) {
      case 'ödeme':
        return 'text-green-600';
      case 'iade':
        return 'text-red-600';
      case 'komisyon':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  };

  const filteredTransactions = recentTransactions.filter((transaction) => {
    if (paymentFilter === 'all') return true;
    return transaction.type === paymentFilter;
  });

  // Tarih aralığı seçenekleri
  const dateRangeOptions = [
    { id: 'thisWeek', name: 'Bu Hafta' },
    { id: 'thisMonth', name: 'Bu Ay' },
    { id: 'lastMonth', name: 'Geçen Ay' },
    { id: 'last3Months', name: 'Son 3 Ay' },
    { id: 'thisYear', name: 'Bu Yıl' },
  ];

  // İşlem türü seçenekleri
  const paymentFilterOptions = [
    { id: 'all', name: 'Tüm İşlemler' },
    { id: 'ödeme', name: 'Ödemeler' },
    { id: 'iade', name: 'İadeler' },
    { id: 'komisyon', name: 'Komisyonlar' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Başlık ve Üst Bölüm */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Finansal Durum</h1>
            <p className="text-gray-500 mt-1">Gelir, gider ve ödeme işlemlerinizi takip edin</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex items-center justify-center w-full px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
                  <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                  Rapor İndir
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
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
                          PDF
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
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>

        {/* Özet Kartları */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Toplam Gelir</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(financialSummary.totalRevenue)}</p>
              </div>
              <div className="p-2.5 bg-indigo-100 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1.5" />
              <span className="text-sm font-medium text-green-500">{financialSummary.comparedToLastPeriod}% artış</span>
              <span className="text-xs text-gray-500 ml-1.5">son aya göre</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Bekleyen Ödemeler</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(financialSummary.pendingPayments)}</p>
              </div>
              <div className="p-2.5 bg-yellow-100 rounded-lg">
                <ArrowPathIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-gray-500">5 bekleyen işlem</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Toplam Ödemeler</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(financialSummary.totalPayouts)}</p>
              </div>
              <div className="p-2.5 bg-green-100 rounded-lg">
                <CurrencyDollarSolidIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-gray-500">23 başarılı işlem</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Net Kazanç</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(financialSummary.netProfit)}</p>
              </div>
              <div className="p-2.5 bg-purple-100 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1.5" />
              <span className="text-sm font-medium text-green-500">12.2% artış</span>
              <span className="text-xs text-gray-500 ml-1.5">son aya göre</span>
            </div>
          </div>
        </div>

        {/* Tarih Aralığı Filtresi */}
        <div className="mt-8 mb-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
            <div>
              <Popover className="relative">
                {({ open }) => (
                  <>
                    <Popover.Button
                      className={`inline-flex items-center px-4 py-3 border ${
                        open ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-300 bg-white text-gray-700'
                      } text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200`}
                    >
                      <CalendarDaysIcon className="h-5 w-5 mr-2" />
                      {dateRangeOptions.find(option => option.id === dateRange)?.name || 'Tarih Aralığı'}
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
                      <Popover.Panel className="absolute left-0 z-10 mt-2 w-60 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          {dateRangeOptions.map((option) => (
                            <button
                              key={option.id}
                              onClick={() => setDateRange(option.id)}
                              className={`${
                                dateRange === option.id
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

        {/* Grafik */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md mt-6 mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">Gelir Grafiği</h2>
          </div>
          <div className="h-64 w-full p-6 flex items-center justify-center">
            <p className="text-gray-500">Gelir grafiği burada gösterilecek</p>
          </div>
        </div>

        {/* İşlem Geçmişi */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Son İşlemler</h2>
            
            <div className="flex items-center">
              <Popover className="relative">
                {({ open }) => (
                  <>
                    <Popover.Button
                      className={`inline-flex items-center px-4 py-2 border ${
                        open ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-300 bg-white text-gray-700'
                      } text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 mr-3`}
                    >
                      <FunnelIcon className="h-5 w-5 mr-2" />
                      {paymentFilterOptions.find(option => option.id === paymentFilter)?.name || 'Tüm İşlemler'}
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
                          {paymentFilterOptions.map((option) => (
                            <button
                              key={option.id}
                              onClick={() => setPaymentFilter(option.id)}
                              className={`${
                                paymentFilter === option.id
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
              
              <a href="#" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors">
                Tümünü Gör
              </a>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarih
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlem Türü
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tutar
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Müşteri
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tur
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {transaction.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`capitalize font-medium ${getTypeClass(transaction.type)}`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}>
                          {formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 text-xs font-medium capitalize rounded-full ${getStatusClass(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {transaction.customer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {transaction.tourName}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredTransactions.length === 0 && (
                <div className="py-12 text-center">
                  <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                    <DocumentTextIcon className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">İşlem bulunamadı</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Farklı bir filtre seçeneği deneyin
                  </p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-500">
                  <span>{filteredTransactions.length} kayıt gösteriliyor</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                    Önceki
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                    Sonraki
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 