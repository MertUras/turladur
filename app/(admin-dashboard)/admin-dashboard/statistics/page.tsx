'use client';

import { useState } from 'react';
import {
  ChartBarIcon,
  MapIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  CursorArrowRaysIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
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
  ResponsiveContainer,
} from 'recharts';

// Örnek veri
const userGrowthData = [
  { month: 'Oca', users: 1200 },
  { month: 'Şub', users: 1500 },
  { month: 'Mar', users: 1800 },
  { month: 'Nis', users: 2100 },
  { month: 'May', users: 2500 },
  { month: 'Haz', users: 3000 },
  { month: 'Tem', users: 3500 },
  { month: 'Ağu', users: 4000 },
  { month: 'Eyl', users: 4500 },
  { month: 'Eki', users: 5000 },
  { month: 'Kas', users: 5500 },
  { month: 'Ara', users: 6000 },
];

const revenueData = [
  { month: 'Oca', revenue: 150000, commission: 15000 },
  { month: 'Şub', revenue: 180000, commission: 18000 },
  { month: 'Mar', revenue: 220000, commission: 22000 },
  { month: 'Nis', revenue: 250000, commission: 25000 },
  { month: 'May', revenue: 300000, commission: 30000 },
  { month: 'Haz', revenue: 350000, commission: 35000 },
  { month: 'Tem', revenue: 400000, commission: 40000 },
  { month: 'Ağu', revenue: 450000, commission: 45000 },
  { month: 'Eyl', revenue: 500000, commission: 50000 },
  { month: 'Eki', revenue: 550000, commission: 55000 },
  { month: 'Kas', revenue: 600000, commission: 60000 },
  { month: 'Ara', revenue: 650000, commission: 65000 },
];

const popularCategories = [
  { name: 'Kültür Turları', value: 35 },
  { name: 'Doğa Turları', value: 25 },
  { name: 'Yemek Turları', value: 20 },
  { name: 'Macera Turları', value: 15 },
  { name: 'Diğer', value: 5 },
];

const locationPopularity = [
  { location: 'İstanbul', searches: 2500 },
  { location: 'Antalya', searches: 2000 },
  { location: 'Kapadokya', searches: 1800 },
  { location: 'İzmir', searches: 1500 },
  { location: 'Bodrum', searches: 1200 },
];

const userBehaviorData = [
  { action: 'Tur Detayı Görüntüleme', count: 15000 },
  { action: 'Rezervasyon Başlatma', count: 8000 },
  { action: 'Rezervasyon Tamamlama', count: 5000 },
  { action: 'Filtreleme Kullanımı', count: 12000 },
  { action: 'Arama Yapma', count: 20000 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function StatisticsPage() {
  const [timeRange, setTimeRange] = useState('year');

  // Para birimi formatı
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Başlık ve Üst Bölüm */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">İstatistikler & Raporlar</h1>
            <p className="text-gray-500 mt-1">Platform performansı ve kullanıcı davranışları</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="week">Son 7 Gün</option>
              <option value="month">Bu Ay</option>
              <option value="year">Bu Yıl</option>
            </select>
          </div>
        </div>

        {/* Özet Kartları */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserGroupIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Toplam Kullanıcı</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">6,000</div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        <ArrowUpIcon className="h-5 w-5 flex-shrink-0 self-center text-green-500" />
                        <span className="ml-1">12%</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CurrencyDollarIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Aylık Gelir</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{formatCurrency(650000)}</div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        <ArrowUpIcon className="h-5 w-5 flex-shrink-0 self-center text-green-500" />
                        <span className="ml-1">8%</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChartBarIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Aktif Rezervasyonlar</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">1,200</div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                        <ArrowDownIcon className="h-5 w-5 flex-shrink-0 self-center text-red-500" />
                        <span className="ml-1">3%</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CursorArrowRaysIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Günlük Ziyaret</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">15,000</div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        <ArrowUpIcon className="h-5 w-5 flex-shrink-0 self-center text-green-500" />
                        <span className="ml-1">5%</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grafikler */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Kullanıcı Artış Grafiği */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Kullanıcı Artış Grafiği</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#8884d8" name="Kullanıcı Sayısı" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gelir Tablosu */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Gelir Tablosu</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8884d8" name="Toplam Gelir" />
                  <Bar dataKey="commission" fill="#82ca9d" name="Komisyon" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Popüler Tur Kategorileri */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Popüler Tur Kategorileri</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={popularCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {popularCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Lokasyon Bazlı Popülerlik */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Lokasyon Bazlı Popülerlik</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={locationPopularity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="location" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="searches" fill="#8884d8" name="Arama Sayısı" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Kullanıcı Davranış Analitiği */}
        <div className="mt-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Kullanıcı Davranış Analitiği</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksiyon
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sayı
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dönüşüm Oranı
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userBehaviorData.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.action}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.count.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {((item.count / userBehaviorData[0].count) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 