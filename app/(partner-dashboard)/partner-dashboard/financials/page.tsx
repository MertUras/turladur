'use client';

import { useState } from 'react';
import { CurrencyDollarIcon, ArrowDownIcon, ArrowUpIcon, DocumentTextIcon, ArrowPathIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { CurrencyDollarIcon as CurrencyDollarSolidIcon } from '@heroicons/react/24/solid';

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Finansal Durum</h1>
        <p className="text-gray-500">Gelir, gider ve ödeme işlemlerinizi takip edin</p>
      </div>

      {/* Özet Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Toplam Gelir</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{formatCurrency(financialSummary.totalRevenue)}</p>
            </div>
            <div className="p-2 bg-indigo-100 rounded-md">
              <CurrencyDollarIcon className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm font-medium text-green-500">{financialSummary.comparedToLastPeriod}% artış</span>
            <span className="text-xs text-gray-500 ml-1">son aya göre</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Bekleyen Ödemeler</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{formatCurrency(financialSummary.pendingPayments)}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-md">
              <ArrowPathIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-xs text-gray-500">5 bekleyen işlem</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Toplam Ödemeler</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{formatCurrency(financialSummary.totalPayouts)}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-md">
              <CurrencyDollarSolidIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-xs text-gray-500">23 başarılı işlem</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Net Kazanç</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{formatCurrency(financialSummary.netProfit)}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-md">
              <DocumentTextIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm font-medium text-green-500">12.2% artış</span>
            <span className="text-xs text-gray-500 ml-1">son aya göre</span>
          </div>
        </div>
      </div>

      {/* Grafik ve Filtreleme */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-800">Gelir Grafiği</h2>
          <div className="flex items-center space-x-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-white border border-gray-300 text-gray-700 text-sm rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="thisWeek">Bu Hafta</option>
              <option value="thisMonth">Bu Ay</option>
              <option value="lastMonth">Geçen Ay</option>
              <option value="last3Months">Son 3 Ay</option>
              <option value="thisYear">Bu Yıl</option>
            </select>
          </div>
        </div>
        
        <div className="h-64 w-full bg-gray-50 rounded-md flex items-center justify-center">
          <p className="text-gray-500">Gelir grafiği burada gösterilecek</p>
        </div>
      </div>

      {/* İşlem Geçmişi */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">Son İşlemler</h2>
            <div className="flex items-center space-x-4">
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="bg-white border border-gray-300 text-gray-700 text-sm rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">Tüm İşlemler</option>
                <option value="ödeme">Ödemeler</option>
                <option value="iade">İadeler</option>
                <option value="komisyon">Komisyonlar</option>
              </select>
              <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                Tümünü Gör
              </button>
            </div>
          </div>
        </div>
        
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
                <tr key={transaction.id} className="hover:bg-gray-50">
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
                    <span className={`px-2 py-1 text-xs font-medium capitalize rounded-full ${getStatusClass(transaction.status)}`}>
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
            <div className="py-8 text-center text-gray-500">
              Seçilen kriterlere uygun işlem bulunamadı.
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">
              Toplam {filteredTransactions.length} işlem gösteriliyor
            </span>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                Önceki
              </button>
              <button className="px-3 py-1 bg-indigo-600 border border-indigo-600 rounded-md text-sm text-white hover:bg-indigo-700">
                Sonraki
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Banka Hesapları ve Ödeme Bilgileri */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Banka Hesaplarım</h2>
        
        <div className="border border-gray-200 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 font-bold mr-4">
                IB
              </div>
              <div>
                <p className="font-medium text-gray-800">İş Bankası</p>
                <p className="text-sm text-gray-500">TR32 0006 4000 0011 1234 5678 90</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              Varsayılan
            </span>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-md flex items-center justify-center text-red-600 font-bold mr-4">
                ZB
              </div>
              <div>
                <p className="font-medium text-gray-800">Ziraat Bankası</p>
                <p className="text-sm text-gray-500">TR21 0001 0009 8765 4321 0000 01</p>
              </div>
            </div>
            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              Varsayılan Yap
            </button>
          </div>
        </div>

        <button className="mt-4 w-full py-2 text-indigo-600 border border-dashed border-indigo-300 rounded-lg hover:bg-indigo-50 text-sm font-medium">
          + Yeni Banka Hesabı Ekle
        </button>
      </div>
    </div>
  );
} 