'use client';

import { useState } from 'react';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
  StarIcon,
  MapPinIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  PhotoIcon,
  ChatBubbleLeftIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import AdvancedFilters from './components/AdvancedFilters';
import BulkActions from './components/BulkActions';
import Statistics from './components/Statistics';
import Notifications from './components/Notifications';
import TourMap from './components/TourMap';
import WeatherForecast from './components/WeatherForecast';
import FinancialReports from './components/FinancialReports';
import CustomerFeedback from './components/CustomerFeedback';
import AutoApproval from './components/AutoApproval';
import PerformanceCharts from './components/PerformanceCharts';
import TourList from './components/TourList';

interface Tour {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  price: number;
  capacity: number;
  bookedCount: number;
  rating: number;
  status: 'active' | 'draft' | 'completed' | 'cancelled';
  category: string;
  image: string;
}

const mockTours: Tour[] = [
  {
    id: '1',
    name: 'Kapadokya Balon Turu',
    location: 'Nevşehir, Kapadokya',
    startDate: '2024-04-15',
    endDate: '2024-04-17',
    price: 2500,
    capacity: 20,
    bookedCount: 15,
    rating: 4.8,
    status: 'active',
    category: 'Doğa',
    image: 'https://images.unsplash.com/photo-1533619043865-1f0c0b5b0b5b'
  },
  {
    id: '2',
    name: 'Ege Turu',
    location: 'İzmir, Çeşme',
    startDate: '2024-05-01',
    endDate: '2024-05-05',
    price: 3500,
    capacity: 30,
    bookedCount: 25,
    rating: 4.6,
    status: 'active',
    category: 'Deniz',
    image: 'https://images.unsplash.com/photo-1533619043865-1f0c0b5b0b5b'
  },
  {
    id: '3',
    name: 'Doğu Anadolu Turu',
    location: 'Van, İshak Paşa Sarayı',
    startDate: '2024-06-10',
    endDate: '2024-06-15',
    price: 4200,
    capacity: 25,
    bookedCount: 18,
    rating: 4.9,
    status: 'active',
    category: 'Kültür',
    image: 'https://images.unsplash.com/photo-1533619043865-1f0c0b5b0b5b'
  }
];

const mockPerformanceData = {
  bookings: [
    { date: '2024-01', value: 120 },
    { date: '2024-02', value: 150 },
    { date: '2024-03', value: 180 }
  ],
  revenue: [
    { date: '2024-01', value: 300000 },
    { date: '2024-02', value: 375000 },
    { date: '2024-03', value: 450000 }
  ],
  ratings: [
    { date: '2024-01', value: 4.5 },
    { date: '2024-02', value: 4.7 },
    { date: '2024-03', value: 4.8 }
  ],
  categories: [
    { name: 'Doğa', value: 15 },
    { name: 'Deniz', value: 12 },
    { name: 'Kültür', value: 8 }
  ]
};

const mockFinancialData = {
  revenue: {
    total: 1125000,
    change: 15,
    history: [
      { date: '2024-01', value: 300000 },
      { date: '2024-02', value: 375000 },
      { date: '2024-03', value: 450000 }
    ]
  },
  expenses: {
    total: 450000,
    change: 8,
    history: [
      { date: '2024-01', value: 120000 },
      { date: '2024-02', value: 150000 },
      { date: '2024-03', value: 180000 }
    ]
  },
  profit: {
    total: 675000,
    change: 20,
    history: [
      { date: '2024-01', value: 180000 },
      { date: '2024-02', value: 225000 },
      { date: '2024-03', value: 270000 }
    ]
  },
  bookings: {
    total: 450,
    change: 12,
    history: [
      { date: '2024-01', value: 120 },
      { date: '2024-02', value: 150 },
      { date: '2024-03', value: 180 }
    ]
  }
};

const mockNotifications = [
  {
    id: '1',
    type: 'success',
    title: 'Yeni Rezervasyon',
    message: 'Kapadokya Balon Turu için 2 yeni rezervasyon alındı.',
    date: '2024-03-15T10:30:00',
    read: false
  },
  {
    id: '2',
    type: 'warning',
    title: 'Kapasite Uyarısı',
    message: 'Ege Turu kapasitesinin %80\'i doldu.',
    date: '2024-03-15T09:15:00',
    read: false
  }
];

const mockAutoApprovalRules = [
  {
    id: '1',
    name: 'Standart Onay',
    conditions: [
      { field: 'price', operator: 'lte', value: 5000 },
      { field: 'rating', operator: 'gte', value: 4 }
    ],
    actions: ['auto_approve', 'send_notification'],
    status: 'active'
  }
];

export default function TourManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    dateRange: [new Date(), new Date()],
    sortBy: 'date',
    agency: 'all',
    rating: 0,
    category: 'all',
    status: 'all'
  });
  const [selectedTours, setSelectedTours] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'list' | 'map' | 'stats' | 'finance'>('list');

  const handleBulkPublish = () => {
    console.log('Seçili turlar yayınlanıyor:', selectedTours);
  };

  const handleBulkDelete = () => {
    console.log('Seçili turlar siliniyor:', selectedTours);
  };

  const handleBulkExport = () => {
    console.log('Seçili turlar dışa aktarılıyor:', selectedTours);
  };

  const handleBulkUpdate = () => {
    console.log('Seçili turlar güncelleniyor:', selectedTours);
  };

  const handleTimeRangeChange = (range: 'week' | 'month' | 'year') => {
    console.log('Zaman aralığı değiştirildi:', range);
  };

  const handleExportReport = (format: 'pdf' | 'excel') => {
    console.log('Rapor dışa aktarılıyor:', format);
  };

  const handleMarkAsRead = (notificationId: string) => {
    console.log('Bildirim okundu olarak işaretlendi:', notificationId);
  };

  const handleDeleteNotification = (notificationId: string) => {
    console.log('Bildirim silindi:', notificationId);
  };

  const handleMarkAllAsRead = () => {
    console.log('Tüm bildirimler okundu olarak işaretlendi');
  };

  const handleAddRule = () => {
    console.log('Yeni kural ekleniyor');
  };

  const handleEditRule = (ruleId: string) => {
    console.log('Kural düzenleniyor:', ruleId);
  };

  const handleDeleteRule = (ruleId: string) => {
    console.log('Kural siliniyor:', ruleId);
  };

  const handleToggleRule = (ruleId: string) => {
    console.log('Kural durumu değiştiriliyor:', ruleId);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Tur Yönetimi</h1>
        <div className="flex items-center gap-4">
          <Notifications
            notifications={mockNotifications}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDeleteNotification}
            onMarkAllAsRead={handleMarkAllAsRead}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                activeTab === 'list'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Liste
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                activeTab === 'map'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Harita
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                activeTab === 'stats'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              İstatistikler
            </button>
            <button
              onClick={() => setActiveTab('finance')}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                activeTab === 'finance'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Finans
            </button>
          </div>
        </div>
      </div>

      <AdvancedFilters
        filters={filters}
        onFilterChange={setFilters}
        onClearFilters={() => setFilters({
          priceRange: [0, 10000],
          dateRange: [new Date(), new Date()],
          sortBy: 'date',
          agency: 'all',
          rating: 0,
          category: 'all',
          status: 'all'
        })}
      />

      {selectedTours.length > 0 && (
        <BulkActions
          selectedTours={selectedTours}
          onBulkPublish={handleBulkPublish}
          onBulkDelete={handleBulkDelete}
          onBulkExport={handleBulkExport}
          onBulkUpdate={handleBulkUpdate}
        />
      )}

      {activeTab === 'list' && (
        <div className="space-y-6">
          <TourList />
          <AutoApproval
            rules={mockAutoApprovalRules}
            onAddRule={handleAddRule}
            onEditRule={handleEditRule}
            onDeleteRule={handleDeleteRule}
            onToggleRule={handleToggleRule}
          />
        </div>
      )}

      {activeTab === 'map' && (
        <div className="space-y-6">
          <TourMap
            locations={mockTours.map(tour => ({
              id: tour.id,
              name: tour.name,
              coordinates: [0, 0], // Gerçek koordinatlar eklenecek
              description: tour.location,
              type: 'stop'
            }))}
            center={[39.9334, 32.8597]} // Ankara merkez
            zoom={6}
            height={600}
          />
          <WeatherForecast
            location="Ankara"
            coordinates={[39.9334, 32.8597]}
            startDate="2024-03-15"
            endDate="2024-03-20"
          />
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="space-y-6">
          <Statistics data={mockPerformanceData} />
          <PerformanceCharts
            data={mockPerformanceData}
            timeRange="month"
            onTimeRangeChange={handleTimeRangeChange}
          />
          <CustomerFeedback />
        </div>
      )}

      {activeTab === 'finance' && (
        <FinancialReports
          data={mockFinancialData}
          onExport={handleExportReport}
        />
      )}
    </div>
  );
} 