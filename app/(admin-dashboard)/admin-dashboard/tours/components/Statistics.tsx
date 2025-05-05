'use client';

import { useState } from 'react';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  StarIcon,
  TagIcon
} from '@heroicons/react/24/outline';
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

interface StatisticsProps {
  data: {
    bookings: { date: string; value: number }[];
    revenue: { date: string; value: number }[];
    ratings: { date: string; value: number }[];
    categories: { name: string; value: number }[];
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Statistics({ data }: StatisticsProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [activeTab, setActiveTab] = useState<'bookings' | 'revenue' | 'ratings' | 'categories'>('bookings');

  const renderChart = () => {
    switch (activeTab) {
      case 'bookings':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.bookings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" name="Rezervasyonlar" />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'revenue':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.revenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" name="Gelir (TL)" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'ratings':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.ratings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#ffc658" name="Puan" />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'categories':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.categories}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {data.categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
    }
  };

  const getTotalValue = () => {
    switch (activeTab) {
      case 'bookings':
        return data.bookings.reduce((sum, item) => sum + item.value, 0);
      case 'revenue':
        return data.revenue.reduce((sum, item) => sum + item.value, 0);
      case 'ratings':
        const avg = data.ratings.reduce((sum, item) => sum + item.value, 0) / data.ratings.length;
        return avg.toFixed(1);
      case 'categories':
        return data.categories.length;
    }
  };

  const getIcon = () => {
    switch (activeTab) {
      case 'bookings':
        return <ChartBarIcon className="h-6 w-6 text-blue-500" />;
      case 'revenue':
        return <CurrencyDollarIcon className="h-6 w-6 text-green-500" />;
      case 'ratings':
        return <StarIcon className="h-6 w-6 text-yellow-500" />;
      case 'categories':
        return <TagIcon className="h-6 w-6 text-purple-500" />;
    }
  };

  const getTitle = () => {
    switch (activeTab) {
      case 'bookings':
        return 'Toplam Rezervasyon';
      case 'revenue':
        return 'Toplam Gelir';
      case 'ratings':
        return 'Ortalama Puan';
      case 'categories':
        return 'Toplam Kategori';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">İstatistikler</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1 text-sm rounded-md ${
                timeRange === 'week'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Haftalık
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1 text-sm rounded-md ${
                timeRange === 'month'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Aylık
            </button>
            <button
              onClick={() => setTimeRange('year')}
              className={`px-3 py-1 text-sm rounded-md ${
                timeRange === 'year'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Yıllık
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              {getIcon()}
              <h3 className="text-sm font-medium text-gray-900">{getTitle()}</h3>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {activeTab === 'revenue' ? `${getTotalValue()} TL` : getTotalValue()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              activeTab === 'bookings'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Rezervasyonlar
          </button>
          <button
            onClick={() => setActiveTab('revenue')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              activeTab === 'revenue'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Gelir
          </button>
          <button
            onClick={() => setActiveTab('ratings')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              activeTab === 'ratings'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Puanlar
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              activeTab === 'categories'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Kategoriler
          </button>
        </div>

        <div className="h-[300px]">{renderChart()}</div>
      </div>
    </div>
  );
} 