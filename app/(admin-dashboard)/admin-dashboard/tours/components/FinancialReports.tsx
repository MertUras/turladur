'use client';

import { useState } from 'react';
import {
  ArrowDownTrayIcon,
  DocumentArrowDownIcon,
  DocumentTextIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

interface FinancialData {
  revenue: {
    total: number;
    change: number;
    history: { date: string; amount: number }[];
  };
  expenses: {
    total: number;
    change: number;
    history: { date: string; amount: number }[];
  };
  profit: {
    total: number;
    change: number;
    history: { date: string; amount: number }[];
  };
  bookings: {
    total: number;
    change: number;
    history: { date: string; count: number }[];
  };
}

interface FinancialReportsProps {
  data: FinancialData;
  onExport: (format: 'pdf' | 'excel') => void;
}

const FinancialReports = ({
  data,
  onExport
}: FinancialReportsProps) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'expenses' | 'bookings'>('overview');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value / 100);
  };

  const getChangeColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (value: number) => {
    if (value > 0) return <ArrowTrendingUpIcon className="h-5 w-5 text-green-600" />;
    if (value < 0) return <ArrowTrendingDownIcon className="h-5 w-5 text-red-600" />;
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Finansal Raporlar</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onExport('pdf')}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
            >
              <DocumentTextIcon className="h-5 w-5" />
              PDF
            </button>
            <button
              onClick={() => onExport('excel')}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
            >
              <DocumentArrowDownIcon className="h-5 w-5" />
              Excel
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
                timeRange === 'week'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Haftalık
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
                timeRange === 'month'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Aylık
            </button>
            <button
              onClick={() => setTimeRange('year')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
                timeRange === 'year'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Yıllık
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
                activeTab === 'overview'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Genel Bakış
            </button>
            <button
              onClick={() => setActiveTab('revenue')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
                activeTab === 'revenue'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Gelir
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
                activeTab === 'expenses'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Gider
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
                activeTab === 'bookings'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Rezervasyonlar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Toplam Gelir</p>
                <p className="text-2xl font-semibold text-blue-900">
                  {formatCurrency(data.revenue.total)}
                </p>
              </div>
              <BanknotesIcon className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className={getChangeColor(data.revenue.change)}>
                {getChangeIcon(data.revenue.change)}
                {formatPercentage(data.revenue.change)}
              </span>
              <span className="text-gray-500 ml-1">geçen döneme göre</span>
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">Toplam Gider</p>
                <p className="text-2xl font-semibold text-red-900">
                  {formatCurrency(data.expenses.total)}
                </p>
              </div>
              <ArrowTrendingDownIcon className="h-8 w-8 text-red-500" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className={getChangeColor(data.expenses.change)}>
                {getChangeIcon(data.expenses.change)}
                {formatPercentage(data.expenses.change)}
              </span>
              <span className="text-gray-500 ml-1">geçen döneme göre</span>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Net Kar</p>
                <p className="text-2xl font-semibold text-green-900">
                  {formatCurrency(data.profit.total)}
                </p>
              </div>
              <ArrowTrendingUpIcon className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className={getChangeColor(data.profit.change)}>
                {getChangeIcon(data.profit.change)}
                {formatPercentage(data.profit.change)}
              </span>
              <span className="text-gray-500 ml-1">geçen döneme göre</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            {activeTab === 'overview' && 'Genel Bakış'}
            {activeTab === 'revenue' && 'Gelir Detayları'}
            {activeTab === 'expenses' && 'Gider Detayları'}
            {activeTab === 'bookings' && 'Rezervasyon Detayları'}
          </h3>
          <div className="space-y-4">
            {(activeTab === 'revenue' ? data.revenue.history :
              activeTab === 'expenses' ? data.expenses.history :
              activeTab === 'bookings' ? data.bookings.history :
              data.profit.history).map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0"
              >
                <span className="text-sm text-gray-600">
                  {new Date(item.date).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {activeTab === 'bookings'
                    ? `${item.count} Rezervasyon`
                    : formatCurrency(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialReports; 