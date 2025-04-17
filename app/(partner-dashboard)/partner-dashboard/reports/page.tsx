'use client';

import { useState } from 'react';
import { ChartBarIcon, ChartPieIcon, DocumentChartBarIcon, ClockIcon, ArrowDownTrayIcon, CalendarIcon } from '@heroicons/react/24/outline';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('lastMonth');
  const [reportType, setReportType] = useState('sales');
  
  const reportTypes = [
    { id: 'sales', name: 'Satış Raporları', icon: ChartBarIcon },
    { id: 'visitors', name: 'Ziyaretçi Analizi', icon: ChartPieIcon },
    { id: 'performance', name: 'Performans Analizi', icon: DocumentChartBarIcon },
    { id: 'customer', name: 'Müşteri Analizi', icon: ClockIcon },
  ];

  const dateRanges = [
    { id: 'today', name: 'Bugün' },
    { id: 'yesterday', name: 'Dün' },
    { id: 'thisWeek', name: 'Bu Hafta' },
    { id: 'lastWeek', name: 'Geçen Hafta' },
    { id: 'thisMonth', name: 'Bu Ay' },
    { id: 'lastMonth', name: 'Geçen Ay' },
    { id: 'last3Months', name: 'Son 3 Ay' },
    { id: 'lastYear', name: 'Geçen Yıl' },
    { id: 'custom', name: 'Özel Tarih Aralığı' },
  ];

  // Örnek veriler
  const salesData = {
    totalSales: 87,
    totalRevenue: 125750,
    averageOrderValue: 1445.4,
    comparedToLastPeriod: 18.5,
    increase: true
  };

  const topSellingTours = [
    { id: 1, name: 'Kapadokya Turu', sales: 28, revenue: 42000, growth: 15.2 },
    { id: 2, name: 'İstanbul Boğaz Turu', sales: 22, revenue: 33000, growth: 8.7 },
    { id: 3, name: 'Pamukkale & Hierapolis Turu', sales: 14, revenue: 21000, growth: -2.3 },
    { id: 4, name: 'Fethiye Tekne Turu', sales: 12, revenue: 18000, growth: 22.5 },
    { id: 5, name: 'Efes Antik Kenti Turu', sales: 11, revenue: 16500, growth: 5.1 },
  ];

  const topSources = [
    { name: 'Direkt Trafik', value: 40 },
    { name: 'Organik Arama', value: 25 },
    { name: 'Sosyal Medya', value: 20 },
    { name: 'Yönlendirme', value: 10 },
    { name: 'E-posta', value: 5 },
  ];

  // Örnek fonksiyonlar
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value}%`;
  };

  const getGrowthClass = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const renderReportContent = () => {
    switch (reportType) {
      case 'sales':
        return renderSalesReport();
      case 'visitors':
        return renderVisitorsReport();
      case 'performance':
        return renderPerformanceReport();
      case 'customer':
        return renderCustomerReport();
      default:
        return renderSalesReport();
    }
  };

  const renderSalesReport = () => {
    return (
      <div className="space-y-8">
        {/* Satış Özeti */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Toplam Satış</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{salesData.totalSales}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-md">
                <ChartBarIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${salesData.increase ? 'text-green-500' : 'text-red-500'}`}>
                {formatPercentage(salesData.comparedToLastPeriod)} {salesData.increase ? 'artış' : 'azalış'}
              </span>
              <span className="text-xs text-gray-500 ml-1">son döneme göre</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Toplam Gelir</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{formatCurrency(salesData.totalRevenue)}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-md">
                <ChartBarIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-xs text-gray-500">son 30 gündeki toplam</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Ortalama Sipariş Değeri</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{formatCurrency(salesData.averageOrderValue)}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-md">
                <ChartPieIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-xs text-gray-500">son 30 gündeki ortalama</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Raporlama Dönemi</p>
                <p className="text-lg font-bold text-gray-800 mt-1">Geçen Ay</p>
              </div>
              <div className="p-2 bg-indigo-100 rounded-md">
                <CalendarIcon className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-xs text-gray-500">1 Ekim - 31 Ekim 2023</span>
            </div>
          </div>
        </div>

        {/* Satış Grafiği */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Dönemsel Satış Trendi</h2>
          <div className="h-64 w-full bg-gray-50 rounded-md flex items-center justify-center">
            <p className="text-gray-500">Satış trendi grafiği burada gösterilecek</p>
          </div>
        </div>

        {/* En Çok Satan Turlar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">En Çok Satan Turlar</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tur Adı
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Satış
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gelir
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Büyüme
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topSellingTours.map((tour) => (
                  <tr key={tour.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {tour.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {tour.sales}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatCurrency(tour.revenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getGrowthClass(tour.growth)}`}>
                        {formatPercentage(tour.growth)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rezervasyon Kaynakları */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Rezervasyon Kaynakları</h2>
            <div className="h-60 w-full bg-gray-50 rounded-md flex items-center justify-center">
              <p className="text-gray-500">Rezervasyon kaynakları pasta grafiği burada gösterilecek</p>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-2">
              {topSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full bg-indigo-${(index + 3) * 100}`}></div>
                    <span className="ml-2 text-sm text-gray-700">{source.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{source.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-6">İşlem Özeti</h2>
            <ul className="space-y-4">
              <li className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-800">Toplam Rezervasyon</span>
                  <span className="text-sm font-medium text-gray-900">87</span>
                </div>
              </li>
              <li className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-800">Tamamlanan Turlar</span>
                  <span className="text-sm font-medium text-gray-900">65</span>
                </div>
              </li>
              <li className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-800">İptal Edilen Rezervasyonlar</span>
                  <span className="text-sm font-medium text-gray-900">3</span>
                </div>
              </li>
              <li className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-800">İade Sayısı</span>
                  <span className="text-sm font-medium text-gray-900">2</span>
                </div>
              </li>
              <li className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-800">Ortalama Değerlendirme</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-1">4.7</span>
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderVisitorsReport = () => {
    return (
      <div className="h-64 w-full bg-gray-50 rounded-md flex items-center justify-center">
        <p className="text-gray-500">Ziyaretçi analizi raporu burada gösterilecek</p>
      </div>
    );
  };

  const renderPerformanceReport = () => {
    return (
      <div className="h-64 w-full bg-gray-50 rounded-md flex items-center justify-center">
        <p className="text-gray-500">Performans analizi raporu burada gösterilecek</p>
      </div>
    );
  };

  const renderCustomerReport = () => {
    return (
      <div className="h-64 w-full bg-gray-50 rounded-md flex items-center justify-center">
        <p className="text-gray-500">Müşteri analizi raporu burada gösterilecek</p>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Raporlar ve Analizler</h1>
        <p className="text-gray-500">İşletmenizin performansını analiz edin ve raporlar oluşturun</p>
      </div>

      {/* Filtreler ve Kontroller */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {reportTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setReportType(type.id)}
              className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium ${
                reportType === type.id
                  ? 'bg-indigo-600 text-white border-indigo-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <type.icon className={`mr-2 h-5 w-5 ${reportType === type.id ? 'text-white' : 'text-gray-500'}`} />
              {type.name}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-white border border-gray-300 text-gray-700 text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {dateRanges.map((range) => (
              <option key={range.id} value={range.id}>{range.name}</option>
            ))}
          </select>

          <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            <ArrowDownTrayIcon className="h-5 w-5 mr-2 text-gray-500" />
            Raporu İndir
          </button>
        </div>
      </div>

      {/* Rapor İçeriği */}
      {renderReportContent()}
    </div>
  );
} 