'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ChartData {
  date: string;
  value: number;
}

interface PerformanceData {
  bookings: ChartData[];
  revenue: ChartData[];
  ratings: ChartData[];
  categories: { name: string; value: number }[];
}

interface PerformanceChartsProps {
  data: PerformanceData;
  timeRange: 'week' | 'month' | 'year';
  onTimeRangeChange: (range: 'week' | 'month' | 'year') => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const PerformanceCharts = ({
  data,
  timeRange,
  onTimeRangeChange
}: PerformanceChartsProps) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'revenue' | 'ratings' | 'categories'>('bookings');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      month: 'short',
      day: 'numeric'
    });
  };

  const renderChart = () => {
    switch (activeTab) {
      case 'bookings':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data.bookings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: any) => [`${value} Rezervasyon`, 'Rezervasyon']}
                labelFormatter={formatDate}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                name="Rezervasyonlar"
                stroke="#0088FE"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'revenue':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data.revenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickFormatter={formatCurrency}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: any) => [formatCurrency(value), 'Gelir']}
                labelFormatter={formatDate}
              />
              <Legend />
              <Bar
                dataKey="value"
                name="Gelir"
                fill="#00C49F"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'ratings':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data.ratings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                domain={[0, 5]}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: any) => [`${value.toFixed(1)} Puan`, 'Puan']}
                labelFormatter={formatDate}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                name="Ortalama Puan"
                stroke="#FFBB28"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'categories':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data.categories}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                label={({ name, percent }: { name: string; percent: number }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {data.categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => [`${value} Tur`, 'Tur Sayısı']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Performans Grafikleri</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onTimeRangeChange('week')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
                timeRange === 'week'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Haftalık
            </button>
            <button
              onClick={() => onTimeRangeChange('month')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
                timeRange === 'month'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Aylık
            </button>
            <button
              onClick={() => onTimeRangeChange('year')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
                timeRange === 'year'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Yıllık
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
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
            onClick={() => setActiveTab('ratings')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
              activeTab === 'ratings'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Puanlar
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
              activeTab === 'categories'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Kategoriler
          </button>
        </div>

        {renderChart()}
      </div>
    </div>
  );
};

export default PerformanceCharts; 