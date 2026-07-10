'use client';

import { useEffect, useState } from 'react';
import {
  ChartBarIcon,
  ChartPieIcon,
  DocumentChartBarIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { PartnerReportsData } from '@/lib/partner/reports';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('thisMonth');
  const [reportType, setReportType] = useState('sales');
  const [reportsData, setReportsData] = useState<PartnerReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/partner/reports?dateRange=${dateRange}`);
        if (!response.ok) throw new Error('Rapor verisi alınamadı');
        const data = await response.json();
        setReportsData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [dateRange]);

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  };

  const formatPercentage = (value: number) => `${value > 0 ? '+' : ''}${value}%`;

  const getGrowthClass = (growth: number) => (growth >= 0 ? 'text-green-600' : 'text-red-600');

  const handleExport = () => {
    if (!reportsData) return;

    const rows = [
      ['Rapor Dönemi', reportsData.dateRange.label],
      ['Tarih Aralığı', reportsData.sales.periodRangeText],
      ['Toplam Satış', String(reportsData.sales.summary.totalSales)],
      ['Toplam Gelir', String(reportsData.sales.summary.totalRevenue)],
      ['Ortalama Sipariş Değeri', String(reportsData.sales.summary.averageOrderValue)],
      [],
      ['Tur Adı', 'Satış', 'Gelir'],
      ...reportsData.sales.topSelling.map((t) => [t.name, String(t.sales), String(t.revenue)]),
    ];

    const csv = rows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `partner-rapor-${dateRange}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderSalesReport = () => {
    if (!reportsData) return null;
    const { sales } = reportsData;

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard
            label="Toplam Satış"
            value={String(sales.summary.totalSales)}
            icon={ChartBarIcon}
            iconClass="bg-blue-100 text-blue-600"
            footer={
              sales.summary.comparedToLastPeriod !== null ? (
                <>
                  <span
                    className={`text-sm font-medium ${
                      sales.summary.increase ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {formatPercentage(sales.summary.comparedToLastPeriod)}{' '}
                    {sales.summary.increase ? 'artış' : 'azalış'}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">son döneme göre</span>
                </>
              ) : (
                <span className="text-xs text-gray-500">Karşılaştırma verisi yok</span>
              )
            }
          />
          <SummaryCard
            label="Toplam Gelir"
            value={formatCurrency(sales.summary.totalRevenue)}
            icon={ChartBarIcon}
            iconClass="bg-green-100 text-green-600"
            footer={<span className="text-xs text-gray-500">seçili dönem toplamı</span>}
          />
          <SummaryCard
            label="Ortalama Sipariş Değeri"
            value={formatCurrency(sales.summary.averageOrderValue)}
            icon={ChartPieIcon}
            iconClass="bg-purple-100 text-purple-600"
            footer={<span className="text-xs text-gray-500">seçili dönem ortalaması</span>}
          />
          <SummaryCard
            label="Raporlama Dönemi"
            value={sales.periodLabel}
            icon={CalendarIcon}
            iconClass="bg-indigo-100 text-indigo-600"
            footer={<span className="text-xs text-gray-500">{sales.periodRangeText}</span>}
            valueClass="text-lg"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Dönemsel Satış Trendi</h2>
          {sales.trend.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Satış</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Gelir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sales.trend.map((point) => (
                    <tr key={point.label}>
                      <td className="px-4 py-2 text-sm text-gray-700">{point.label}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{point.sales}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{formatCurrency(point.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-32 bg-gray-50 rounded-md flex items-center justify-center">
              <p className="text-gray-500">Seçili dönemde satış verisi bulunmuyor</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">En Çok Satan Turlar</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tur Adı</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Satış</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gelir</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Büyüme</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sales.topSelling.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                      Bu dönemde satış kaydı bulunmuyor
                    </td>
                  </tr>
                ) : (
                  sales.topSelling.map((tour) => (
                    <tr key={tour.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{tour.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{tour.sales}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{formatCurrency(tour.revenue)}</td>
                      <td className="px-6 py-4">
                        {tour.growth !== null ? (
                          <span className={`text-sm font-medium ${getGrowthClass(tour.growth)}`}>
                            {formatPercentage(tour.growth)}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Rezervasyon Durumu</h2>
            <ul className="space-y-4">
              <SummaryRow label="Toplam Rezervasyon" value={sales.bookingSummary.totalReservations} />
              <SummaryRow label="Tamamlanan Turlar" value={sales.bookingSummary.completedTours} />
              <SummaryRow label="İptal Edilen Rezervasyonlar" value={sales.bookingSummary.cancelledReservations} />
              <SummaryRow label="İade Sayısı" value={sales.bookingSummary.refundedCount} />
              <li className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-800">Ortalama Değerlendirme</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-1">
                      {sales.bookingSummary.averageRating.toFixed(1)}
                    </span>
                    <StarIcon />
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Rezervasyon Kaynakları</h2>
            <p className="text-sm text-gray-500">
              Kaynak bazlı dağılım Firebase Analytics entegrasyonu sonrası gösterilecektir.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderVisitorsReport = () => {
    if (!reportsData) return null;

    return (
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
        <ChartPieIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-gray-800 mb-2">Ziyaretçi Analizi</h2>
        <p className="text-gray-500">{reportsData.visitors.message}</p>
      </div>
    );
  };

  const renderPerformanceReport = () => {
    if (!reportsData) return null;
    const { performance } = reportsData;

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard
            label="Dönüşüm Oranı"
            value={performance.summary.conversionRate !== null ? `${performance.summary.conversionRate}%` : 'N/A'}
            icon={ChartBarIcon}
            iconClass="bg-blue-100 text-blue-600"
            footer={<span className="text-xs text-gray-500">Firebase sonrası aktif olacak</span>}
          />
          <SummaryCard
            label="Tamamlanma Oranı"
            value={`${performance.summary.completionRate}%`}
            icon={DocumentChartBarIcon}
            iconClass="bg-green-100 text-green-600"
            footer={<span className="text-xs text-gray-500">rezervasyonların tamamlanma oranı</span>}
          />
          <SummaryCard
            label="Ort. Rezervasyon Değeri"
            value={formatCurrency(performance.summary.avgBookingValue)}
            icon={ChartPieIcon}
            iconClass="bg-purple-100 text-purple-600"
            footer={<span className="text-xs text-gray-500">seçili dönem ortalaması</span>}
          />
          <SummaryCard
            label="Aylık Rezervasyonlar"
            value={String(performance.summary.monthlyBookings)}
            icon={CalendarIcon}
            iconClass="bg-indigo-100 text-indigo-600"
            footer={<span className="text-xs text-gray-500">son 12 ay toplamı</span>}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Aylık Rezervasyon Trendi</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {performance.monthlyTrend.map((point) => (
              <div key={point.label} className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">{point.label}</p>
                <p className="text-lg font-semibold text-gray-900">{point.count}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">Tur Performansları</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tur Adı</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rezervasyonlar</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ort. Değerlendirme</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dönüşüm</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gelir</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {performance.tourPerformance.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                      Performans verisi bulunmuyor
                    </td>
                  </tr>
                ) : (
                  performance.tourPerformance.map((tour) => (
                    <tr key={tour.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{tour.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{tour.bookings}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900 mr-1">{tour.avgRating.toFixed(1)}</span>
                          <StarIcon />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {tour.conversionRate !== null ? `${tour.conversionRate}%` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{formatCurrency(tour.revenue)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Hedef Takibi</h2>
          <div className="space-y-6">
            {performance.goals.map((goal) => (
              <div key={goal.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{goal.name}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {goal.name.includes('Gelir')
                      ? `${formatCurrency(goal.current)} / ${formatCurrency(goal.target)}`
                      : `${goal.current} / ${goal.target}`}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      goal.percentage >= 90
                        ? 'bg-green-500'
                        : goal.percentage >= 70
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                    }`}
                    style={{ width: `${goal.percentage}%` }}
                  />
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
    if (!reportsData) return null;
    const { customer } = reportsData;

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard
            label="Toplam Müşteri"
            value={String(customer.summary.totalCustomers)}
            icon={ChartPieIcon}
            iconClass="bg-blue-100 text-blue-600"
            footer={
              customer.summary.percentChange !== null ? (
                <>
                  <span
                    className={`text-sm font-medium ${
                      customer.summary.increase ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {formatPercentage(customer.summary.percentChange)}{' '}
                    {customer.summary.increase ? 'artış' : 'azalış'}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">son döneme göre</span>
                </>
              ) : (
                <span className="text-xs text-gray-500">Karşılaştırma verisi yok</span>
              )
            }
          />
          <SummaryCard
            label="Yeni Müşteriler"
            value={String(customer.summary.newCustomers)}
            icon={DocumentChartBarIcon}
            iconClass="bg-green-100 text-green-600"
            footer={<span className="text-xs text-gray-500">seçili dönemde ilk kez rezervasyon yapan</span>}
          />
          <SummaryCard
            label="Tekrar Eden Müşteriler"
            value={String(customer.summary.returningCustomers)}
            icon={ChartPieIcon}
            iconClass="bg-purple-100 text-purple-600"
            footer={<span className="text-xs text-gray-500">daha önce rezervasyon yapmış müşteriler</span>}
          />
          <SummaryCard
            label="Müşteri Yaşam Boyu Değeri"
            value={formatCurrency(customer.summary.customerLifetimeValue)}
            icon={DocumentChartBarIcon}
            iconClass="bg-indigo-100 text-indigo-600"
            footer={<span className="text-xs text-gray-500">müşteri başına ortalama harcama</span>}
          />
        </div>

        {customer.satisfactionDistribution.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Müşteri Memnuniyeti</h2>
            <div className="space-y-3">
              {customer.satisfactionDistribution.map((item) => (
                <div key={item.rating} className="flex items-center">
                  <div className="flex items-center w-16">
                    <span className="text-sm font-medium text-gray-700 mr-2">{item.rating}</span>
                    <StarIcon />
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${
                          item.rating >= 4 ? 'bg-green-500' : item.rating >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="ml-4 w-16 text-right">
                    <span className="text-sm font-medium text-gray-900">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">En Sık Rezervasyon Yapan Müşteriler</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Müşteri Adı</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rezervasyon</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Toplam Harcama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Son Rezervasyon</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customer.topCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                      Bu dönemde müşteri verisi bulunmuyor
                    </td>
                  </tr>
                ) : (
                  customer.topCustomers.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{row.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{row.bookings}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{formatCurrency(row.spent)}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{row.lastBooking}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderReportContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
        </div>
      );
    }

    if (error) {
      return <div className="text-center py-24 text-red-500">{error}</div>;
    }

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Raporlar ve Analizler</h1>
        <p className="text-gray-500">İşletmenizin performansını analiz edin ve raporlar oluşturun</p>
      </div>

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

          <button
            onClick={handleExport}
            disabled={!reportsData || loading}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2 text-gray-500" />
            Raporu İndir
          </button>
        </div>
      </div>

      {renderReportContent()}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  iconClass,
  footer,
  valueClass = 'text-2xl',
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
  footer: React.ReactNode;
  valueClass?: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className={`${valueClass} font-bold text-gray-800 mt-1`}>{value}</p>
        </div>
        <div className={`p-2 rounded-md ${iconClass}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div className="mt-4 flex items-center">{footer}</div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: number }) {
  return (
    <li className="bg-gray-50 p-4 rounded-lg">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-800">{label}</span>
        <span className="text-sm font-medium text-gray-900">{value}</span>
      </div>
    </li>
  );
}

function StarIcon() {
  return (
    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}
