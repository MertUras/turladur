'use client';

import { useState, useEffect, Fragment } from 'react';
import {
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { CurrencyDollarIcon as CurrencyDollarSolidIcon } from '@heroicons/react/24/solid';
import { Transition, Menu, Popover } from '@headlessui/react';
import RevenueChart from '@/app/components/partner-dashboard/RevenueChart';
import {
  FinancialDateRangeId,
  FinancialTransactionType,
  PartnerFinancialsData,
} from '@/lib/partner/financials';

export default function FinancialsPage() {
  const [dateRange, setDateRange] = useState<FinancialDateRangeId>('thisMonth');
  const [paymentFilter, setPaymentFilter] = useState<'all' | FinancialTransactionType>('all');
  const [data, setData] = useState<PartnerFinancialsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFinancials();
  }, [dateRange]);

  const fetchFinancials = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/partner/financials?range=${dateRange}`);
      if (!response.ok) {
        throw new Error('Finansal veriler yüklenemedi');
      }
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

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
      case 'beklemede':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  };

  const financialSummary = data?.summary;
  const recentTransactions = data?.transactions || [];

  const filteredTransactions = recentTransactions.filter((transaction) => {
    if (paymentFilter === 'all') return true;
    return transaction.type === paymentFilter;
  });

  const dateRangeOptions: { id: FinancialDateRangeId; name: string }[] = [
    { id: 'thisWeek', name: 'Bu Hafta' },
    { id: 'thisMonth', name: 'Bu Ay' },
    { id: 'lastMonth', name: 'Geçen Ay' },
    { id: 'last3Months', name: 'Son 3 Ay' },
    { id: 'thisYear', name: 'Bu Yıl' },
  ];

  const paymentFilterOptions = [
    { id: 'all', name: 'Tüm İşlemler' },
    { id: 'ödeme', name: 'Ödemeler' },
    { id: 'iade', name: 'İadeler' },
    { id: 'beklemede', name: 'Bekleyenler' },
  ];

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchFinancials}
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
                        <span className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} block px-4 py-2 text-sm cursor-default`}>
                          Excel (.xlsx)
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
                    <Menu.Item>
                      {({ active }) => (
                        <span className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} block px-4 py-2 text-sm cursor-default`}>
                          CSV
                        </span>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Toplam Gelir</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(financialSummary?.totalRevenue || 0)}
                </p>
              </div>
              <div className="p-2.5 bg-indigo-100 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            {financialSummary?.comparedToLastPeriod !== null && financialSummary?.comparedToLastPeriod !== undefined ? (
              <div className="mt-4 flex items-center">
                {financialSummary.increase ? (
                  <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1.5" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1.5" />
                )}
                <span className={`text-sm font-medium ${financialSummary.increase ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(financialSummary.comparedToLastPeriod)}% {financialSummary.increase ? 'artış' : 'azalış'}
                </span>
                <span className="text-xs text-gray-500 ml-1.5">önceki döneme göre</span>
              </div>
            ) : (
              <div className="mt-4 text-sm text-gray-500">Karşılaştırma verisi yok</div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Bekleyen Ödemeler</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(financialSummary?.pendingPayments || 0)}
                </p>
              </div>
              <div className="p-2.5 bg-yellow-100 rounded-lg">
                <ArrowPathIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-gray-500">
                {financialSummary?.pendingTransactionCount || 0} bekleyen işlem
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Toplam Ödemeler</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(financialSummary?.totalPayouts || 0)}
                </p>
              </div>
              <div className="p-2.5 bg-green-100 rounded-lg">
                <CurrencyDollarSolidIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-gray-500">
                {financialSummary?.completedTransactionCount || 0} başarılı işlem
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Net Kazanç</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(financialSummary?.netProfit || 0)}
                </p>
              </div>
              <div className="p-2.5 bg-purple-100 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            {financialSummary?.netProfitChange !== null && financialSummary?.netProfitChange !== undefined ? (
              <div className="mt-4 flex items-center">
                {financialSummary.netProfitIncrease ? (
                  <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1.5" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1.5" />
                )}
                <span className={`text-sm font-medium ${financialSummary.netProfitIncrease ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(financialSummary.netProfitChange)}% {financialSummary.netProfitIncrease ? 'artış' : 'azalış'}
                </span>
                <span className="text-xs text-gray-500 ml-1.5">önceki döneme göre</span>
              </div>
            ) : (
              <div className="mt-4 text-sm text-gray-500">İadeler düşülmüş net gelir</div>
            )}
          </div>
        </div>

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
                      {dateRangeOptions.find((option) => option.id === dateRange)?.name || 'Tarih Aralığı'}
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

        {data?.revenueChart && (
          <div className="mt-6 mb-8">
            <RevenueChart data={data.revenueChart} />
          </div>
        )}

        {data?.paymentMethods && data.paymentMethods.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Ödeme Yöntemleri</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.paymentMethods.map((method) => (
                <div key={method.method} className="border border-gray-100 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-900">{method.method}</p>
                  <p className="text-lg font-semibold text-indigo-600 mt-1">{formatCurrency(method.amount)}</p>
                  <p className="text-xs text-gray-500 mt-1">{method.count} işlem</p>
                </div>
              ))}
            </div>
          </div>
        )}

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
                      {paymentFilterOptions.find((option) => option.id === paymentFilter)?.name || 'Tüm İşlemler'}
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
                              onClick={() => setPaymentFilter(option.id as typeof paymentFilter)}
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
                    Seçili dönemde işlem kaydı bulunmuyor veya farklı bir filtre deneyin
                  </p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-500">
                  <span>{filteredTransactions.length} kayıt gösteriliyor</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
