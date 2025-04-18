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
    // Ziyaretçi istatistikleri için örnek veriler
    const visitorStats = {
      totalVisitors: 12458,
      uniqueVisitors: 8945,
      pageViews: 35280,
      avgSessionDuration: '3m 27s',
      bounceRate: 42.3,
      increase: true,
      percentChange: 14.8
    };

    // Sayfalar için örnek veriler
    const topPages = [
      { name: 'Ana Sayfa', views: 8750, avgTime: '2m 10s', bounceRate: 35.2 },
      { name: 'Kapadokya Turu', views: 4520, avgTime: '4m 05s', bounceRate: 28.7 },
      { name: 'İstanbul Boğaz Turu', views: 3980, avgTime: '3m 42s', bounceRate: 31.5 },
      { name: 'Turlar Sayfası', views: 3650, avgTime: '3m 25s', bounceRate: 40.2 },
      { name: 'İletişim Sayfası', views: 2840, avgTime: '1m 48s', bounceRate: 45.8 },
    ];

    // Trafik kaynakları için örnek veriler
    const trafficSources = [
      { source: 'Organik Arama', visitors: 4570, percentage: 36.7 },
      { source: 'Direkt Trafik', visitors: 3250, percentage: 26.1 },
      { source: 'Sosyal Medya', visitors: 2230, percentage: 17.9 },
      { source: 'Yönlendirme', visitors: 1340, percentage: 10.8 },
      { source: 'E-posta', visitors: 1068, percentage: 8.5 },
    ];

    // Cihaz dağılımı için örnek veriler
    const deviceDistribution = [
      { device: 'Mobil', percentage: 58 },
      { device: 'Masaüstü', percentage: 32 },
      { device: 'Tablet', percentage: 10 },
    ];

    return (
      <div className="space-y-8">
        {/* Ziyaretçi Özeti */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Toplam Ziyaretçi</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{visitorStats.totalVisitors.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-md">
                <ChartPieIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${visitorStats.increase ? 'text-green-500' : 'text-red-500'}`}>
                {formatPercentage(visitorStats.percentChange)} {visitorStats.increase ? 'artış' : 'azalış'}
              </span>
              <span className="text-xs text-gray-500 ml-1">son döneme göre</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Sayfa Görüntülemeleri</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{visitorStats.pageViews.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-md">
                <DocumentChartBarIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-xs text-gray-500">son 30 gündeki toplam</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Ortalama Oturum Süresi</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{visitorStats.avgSessionDuration}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-md">
                <ClockIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-xs text-gray-500">son 30 gündeki ortalama</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Hemen Çıkma Oranı</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{visitorStats.bounceRate}%</p>
              </div>
              <div className="p-2 bg-indigo-100 rounded-md">
                <ArrowDownTrayIcon className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-xs text-gray-500">son 30 gündeki ortalama</span>
            </div>
          </div>
        </div>

        {/* Ziyaretçi Grafiği */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Ziyaretçi Trendi</h2>
          <div className="h-64 w-full bg-gray-50 rounded-md flex items-center justify-center">
            <p className="text-gray-500">Ziyaretçi trendi grafiği burada gösterilecek</p>
          </div>
        </div>

        {/* En Çok Ziyaret Edilen Sayfalar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">En Çok Ziyaret Edilen Sayfalar</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sayfa
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Görüntülenme
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ort. Süre
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hemen Çıkma
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topPages.map((page, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {page.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {page.views.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {page.avgTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {page.bounceRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trafik Kaynakları ve Cihaz Dağılımı */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Trafik Kaynakları</h2>
            <div className="h-60 w-full bg-gray-50 rounded-md flex items-center justify-center mb-4">
              <p className="text-gray-500">Trafik kaynakları grafiği burada gösterilecek</p>
            </div>
            <div className="mt-4 space-y-2">
              {trafficSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full bg-blue-${(index + 3) * 100}`}></div>
                    <span className="ml-2 text-sm text-gray-700">{source.source}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-4">{source.visitors.toLocaleString()}</span>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">{source.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Cihaz Dağılımı</h2>
            <div className="h-60 w-full bg-gray-50 rounded-md flex items-center justify-center mb-4">
              <p className="text-gray-500">Cihaz dağılımı pasta grafiği burada gösterilecek</p>
            </div>
            <div className="mt-4 space-y-4">
              {deviceDistribution.map((device, index) => (
                <div key={index} className="relative pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-sm font-medium text-gray-700">{device.device}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-900">{device.percentage}%</span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                    <div 
                      style={{ width: `${device.percentage}%` }} 
                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                        index === 0 ? 'bg-indigo-500' : index === 1 ? 'bg-purple-500' : 'bg-pink-500'
                      }`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPerformanceReport = () => {
    // Performans istatistikleri için örnek veriler
    const performanceData = {
      conversionRate: 3.8,
      completionRate: 92.5,
      avgBookingValue: 1452.75,
      monthlyBookings: [42, 38, 56, 42, 45, 54, 48, 52, 68, 72, 58, 65]
    };

    // Tur performans verileri
    const tourPerformance = [
      { name: 'Kapadokya Turu', bookings: 28, avgRating: 4.8, conversionRate: 5.2, revenue: 42000 },
      { name: 'İstanbul Boğaz Turu', bookings: 22, avgRating: 4.7, conversionRate: 4.5, revenue: 33000 },
      { name: 'Pamukkale & Hierapolis Turu', bookings: 14, avgRating: 4.4, conversionRate: 3.2, revenue: 21000 },
      { name: 'Fethiye Tekne Turu', bookings: 12, avgRating: 4.9, conversionRate: 4.8, revenue: 18000 },
      { name: 'Efes Antik Kenti Turu', bookings: 11, avgRating: 4.5, conversionRate: 3.6, revenue: 16500 },
    ];

    // Hedef takibi verileri
    const goals = [
      { name: 'Aylık Rezervasyon', current: 87, target: 100, percentage: 87 },
      { name: 'Aylık Gelir', current: 125750, target: 150000, percentage: 83.8 },
      { name: 'Müşteri Memnuniyeti', current: 4.7, target: 4.8, percentage: 97.9 },
      { name: 'Tamamlanan Turlar', current: 65, target: 70, percentage: 92.9 },
    ];

    const getGoalColorClass = (percentage: number) => {
      if (percentage >= 90) return 'bg-green-500';
      if (percentage >= 70) return 'bg-yellow-500';
      return 'bg-red-500';
    };

    return (
      <div className="space-y-8">
        {/* Performans Özeti */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Dönüşüm Oranı</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{performanceData.conversionRate}%</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-md">
                <ChartBarIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-xs text-gray-500">ziyaretçi başına rezervasyon</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Tamamlanma Oranı</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{performanceData.completionRate}%</p>
              </div>
              <div className="p-2 bg-green-100 rounded-md">
                <DocumentChartBarIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-xs text-gray-500">rezervasyonların tamamlanma oranı</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Ort. Rezervasyon Değeri</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{formatCurrency(performanceData.avgBookingValue)}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-md">
                <ChartPieIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-xs text-gray-500">müşteri başına ortalama değer</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Aylık Rezervasyonlar</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{performanceData.monthlyBookings.reduce((a, b) => a + b, 0)}</p>
              </div>
              <div className="p-2 bg-indigo-100 rounded-md">
                <CalendarIcon className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-xs text-gray-500">son 12 ay toplamı</span>
            </div>
          </div>
        </div>

        {/* Aylık Rezervasyon Grafiği */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Aylık Rezervasyon Trendi</h2>
          <div className="h-64 w-full bg-gray-50 rounded-md flex items-center justify-center">
            <p className="text-gray-500">12 aylık rezervasyon trendi grafiği burada gösterilecek</p>
          </div>
        </div>

        {/* Tur Performansları */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">Tur Performansları</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tur Adı
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rezervasyonlar
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ort. Değerlendirme
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dönüşüm Oranı
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gelir
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tourPerformance.map((tour, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {tour.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {tour.bookings}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900 mr-1">{tour.avgRating}</span>
                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {tour.conversionRate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatCurrency(tour.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hedef Takibi */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Hedef Takibi</h2>
          <div className="space-y-6">
            {goals.map((goal, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{goal.name}</span>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900">
                      {goal.name.includes('Gelir') 
                        ? formatCurrency(goal.current) + ' / ' + formatCurrency(goal.target)
                        : goal.name.includes('Memnuniyeti')
                          ? goal.current + ' / ' + goal.target
                          : goal.current + ' / ' + goal.target
                      }
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${getGoalColorClass(goal.percentage)}`}
                    style={{ width: `${goal.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-right">{goal.percentage}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderCustomerReport = () => {
    // Müşteri istatistikleri için örnek veriler
    const customerStats = {
      totalCustomers: 845,
      newCustomers: 128,
      returningCustomers: 242,
      growthRate: 15.3,
      customerLifetimeValue: 3250,
      increase: true,
      percentChange: 12.4
    };

    // Müşteri demografisi için örnek veriler
    const ageDistribution = [
      { age: '18-24', percentage: 8 },
      { age: '25-34', percentage: 32 },
      { age: '35-44', percentage: 28 },
      { age: '45-54', percentage: 18 },
      { age: '55-64', percentage: 10 },
      { age: '65+', percentage: 4 },
    ];

    // Cinsiyet dağılımı
    const genderDistribution = [
      { gender: 'Kadın', percentage: 56 },
      { gender: 'Erkek', percentage: 44 },
    ];

    // En sık rezervasyon yapan müşteriler
    const topCustomers = [
      { name: 'Ayşe Yılmaz', bookings: 7, spent: 10850, lastBooking: '15 Kas 2023' },
      { name: 'Mehmet Demir', bookings: 5, spent: 8200, lastBooking: '08 Kas 2023' },
      { name: 'Fatma Kaya', bookings: 4, spent: 7450, lastBooking: '22 Kas 2023' },
      { name: 'Ali Çelik', bookings: 4, spent: 6300, lastBooking: '03 Kas 2023' },
      { name: 'Zehra Şahin', bookings: 3, spent: 5800, lastBooking: '18 Kas 2023' }
    ];

    // Müşteri memnuniyeti
    const satisfactionData = [
      { rating: 5, percentage: 62 },
      { rating: 4, percentage: 25 },
      { rating: 3, percentage: 8 },
      { rating: 2, percentage: 3 },
      { rating: 1, percentage: 2 }
    ];

    return (
      <div className="space-y-8">
        {/* Müşteri Özeti */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Toplam Müşteri</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{customerStats.totalCustomers}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-md">
                <ChartPieIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${customerStats.increase ? 'text-green-500' : 'text-red-500'}`}>
                {formatPercentage(customerStats.percentChange)} {customerStats.increase ? 'artış' : 'azalış'}
              </span>
              <span className="text-xs text-gray-500 ml-1">son döneme göre</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Yeni Müşteriler</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{customerStats.newCustomers}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-md">
                <DocumentChartBarIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-xs text-gray-500">son 30 günde kazanılan</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Tekrar Eden Müşteriler</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{customerStats.returningCustomers}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-md">
                <ChartPieIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-xs text-gray-500">2+ sefer rezervasyon yapan</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Müşteri Yaşam Boyu Değeri</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{formatCurrency(customerStats.customerLifetimeValue)}</p>
              </div>
              <div className="p-2 bg-indigo-100 rounded-md">
                <DocumentChartBarIcon className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-xs text-gray-500">ortalama değer</span>
            </div>
          </div>
        </div>

        {/* Müşteri Demografisi */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Yaş Dağılımı */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Yaş Dağılımı</h2>
            <div className="h-60 w-full bg-gray-50 rounded-md flex items-center justify-center mb-4">
              <p className="text-gray-500">Yaş dağılımı grafiği burada gösterilecek</p>
            </div>
            <div className="mt-4 space-y-3">
              {ageDistribution.map((age, index) => (
                <div key={index} className="relative pt-1">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className="text-sm font-medium text-gray-700">{age.age}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-900">{age.percentage}%</span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                    <div 
                      style={{ width: `${age.percentage}%` }} 
                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-${400 + index * 100 > 900 ? 900 : 400 + index * 100}`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cinsiyet Dağılımı ve Müşteri Memnuniyeti */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Cinsiyet Dağılımı</h2>
            <div className="h-40 w-full bg-gray-50 rounded-md flex items-center justify-center mb-4">
              <p className="text-gray-500">Cinsiyet dağılımı pasta grafiği burada gösterilecek</p>
            </div>
            <div className="flex justify-around mb-8 mt-4">
              {genderDistribution.map((gender, index) => (
                <div key={index} className="text-center">
                  <div className={`inline-block rounded-full p-3 ${index === 0 ? 'bg-pink-100' : 'bg-blue-100'}`}>
                    <div className={`h-4 w-4 rounded-full ${index === 0 ? 'bg-pink-500' : 'bg-blue-500'}`}></div>
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-800">{gender.gender}</p>
                  <p className="text-2xl font-bold text-gray-900">{gender.percentage}%</p>
                </div>
              ))}
            </div>

            <h2 className="text-lg font-bold text-gray-800 mt-10 mb-6">Müşteri Memnuniyeti</h2>
            <div className="space-y-3">
              {satisfactionData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex items-center w-16">
                    <span className="text-sm font-medium text-gray-700 mr-2">{item.rating}</span>
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${
                          item.rating >= 4 ? 'bg-green-500' : item.rating >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="ml-4 w-16 text-right">
                    <span className="text-sm font-medium text-gray-900">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* En Sık Rezervasyon Yapan Müşteriler */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">En Sık Rezervasyon Yapan Müşteriler</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Müşteri Adı
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rezervasyon Sayısı
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Toplam Harcama
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Son Rezervasyon
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topCustomers.map((customer, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {customer.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {customer.bookings}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatCurrency(customer.spent)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {customer.lastBooking}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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