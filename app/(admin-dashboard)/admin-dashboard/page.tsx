'use client';

import { useState } from 'react';
import { 
  UsersIcon, 
  BuildingOfficeIcon, 
  UserGroupIcon, 
  GlobeAltIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChartBarIcon,
  CalendarIcon,
  ChatBubbleLeftEllipsisIcon,
  ExclamationCircleIcon,
  CheckBadgeIcon,
  ClockIcon,
  MapPinIcon,
  TagIcon,
  StarIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  change: string;
  changeType: 'increase' | 'decrease';
  changeText: string;
  color: 'blue' | 'green' | 'purple' | 'amber';
}

const StatCard = ({ title, value, icon: Icon, change, changeType, changeText, color }: StatCardProps) => {
  const colorClasses = {
    blue: {
      icon: 'text-blue-600',
      bg: 'bg-blue-50',
      change: 'text-blue-700'
    },
    green: {
      icon: 'text-green-600',
      bg: 'bg-green-50',
      change: 'text-green-700'
    },
    purple: {
      icon: 'text-purple-600',
      bg: 'bg-purple-50',
      change: 'text-purple-700'
    },
    amber: {
      icon: 'text-amber-600',
      bg: 'bg-amber-50',
      change: 'text-amber-700'
    }
  };

  return (
    <div className="bg-white overflow-hidden rounded-lg shadow-sm border border-gray-200">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${colorClasses[color].bg}`}>
            <Icon className={`h-6 w-6 ${colorClasses[color].icon}`} />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <div className="flex items-center">
            {changeType === 'increase' ? (
              <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`font-medium ${changeType === 'increase' ? 'text-green-700' : 'text-red-700'}`}>
              {change}
            </span>
            <span className="text-gray-500 ml-1">{changeText}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface QuickAccessCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: 'blue' | 'green' | 'amber';
}

const QuickAccessCard = ({ title, description, icon: Icon, href, color }: QuickAccessCardProps) => {
  const colorClasses = {
    blue: {
      icon: 'text-blue-600',
      bg: 'bg-blue-50',
      hover: 'hover:bg-blue-100'
    },
    green: {
      icon: 'text-green-600',
      bg: 'bg-green-50',
      hover: 'hover:bg-green-100'
    },
    amber: {
      icon: 'text-amber-600',
      bg: 'bg-amber-50',
      hover: 'hover:bg-amber-100'
    }
  };

  return (
    <a
      href={href}
      className={`block p-6 bg-white rounded-lg shadow-sm border border-gray-200 transition-colors ${colorClasses[color].hover}`}
    >
      <div className={`inline-flex p-3 rounded-lg ${colorClasses[color].bg}`}>
        <Icon className={`h-6 w-6 ${colorClasses[color].icon}`} />
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </a>
  );
};

interface ReservationStatusProps {
  reservations: {
    title: string;
    count: number;
    icon: React.ElementType;
    color: string;
    bgColor: string;
  }[];
}

const ReservationStatus = ({ reservations }: ReservationStatusProps) => (
  <div className="bg-white overflow-hidden rounded-lg shadow-sm border border-gray-200">
    <div className="px-5 py-4 border-b border-gray-200">
      <h3 className="text-base font-semibold text-gray-900">Rezervasyon Durumu</h3>
    </div>
    <div className="p-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {reservations.map((item) => (
          <div key={item.title} className="flex items-center p-4 rounded-lg border border-gray-100">
            <div className={`p-3 rounded-lg ${item.bgColor}`}>
              <item.icon className={`h-6 w-6 ${item.color}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">{item.title}</p>
              <p className="text-2xl font-semibold text-gray-900">{item.count}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

interface RecentReservationsProps {
  reservations: {
    id: number;
    customerName: string;
    customerEmail: string;
    customerInitials: string;
    activity: string;
    activityType: string;
    date: string;
    time: string;
    amount: string;
    status: string;
  }[];
}

const RecentReservations = ({ reservations }: RecentReservationsProps) => (
  <div className="bg-white overflow-hidden rounded-lg shadow-sm border border-gray-200">
    <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
      <h3 className="text-base font-semibold text-gray-900">Son Rezervasyonlar</h3>
      <a href="/admin-dashboard/reservations" className="text-sm text-blue-600 hover:text-blue-800">
        Tümünü Gör
      </a>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Müşteri
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aktivite
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tarih
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tutar
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Durum
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {reservations.map((reservation) => (
            <tr key={reservation.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                    {reservation.customerInitials}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{reservation.customerName}</div>
                    <div className="text-sm text-gray-500">{reservation.customerEmail}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{reservation.activity}</div>
                <div className="text-sm text-gray-500">{reservation.activityType}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{reservation.date}</div>
                <div className="text-sm text-gray-500">{reservation.time}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {reservation.amount}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${reservation.status === 'Onaylandı' ? 'bg-green-100 text-green-800' : 
                    reservation.status === 'Beklemede' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'}`}
                >
                  {reservation.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

interface PopularTourProps {
  tours: {
    id: number;
    title: string;
    location: string;
    rating: number;
    reviewCount: number;
    reservationCount: number;
    image: string;
  }[];
}

const PopularTours = ({ tours }: PopularTourProps) => (
  <div className="bg-white overflow-hidden rounded-lg shadow-sm border border-gray-200">
    <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
      <h3 className="text-base font-semibold text-gray-900">En Çok Rezervasyon Yapılan Turlar</h3>
      <a href="/admin-dashboard/tours" className="text-sm text-blue-600 hover:text-blue-800">
        Tümünü Gör
      </a>
    </div>
    <div className="divide-y divide-gray-200">
      {tours.map((tour) => (
        <div key={tour.id} className="p-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden">
              <img src={tour.image} alt={tour.title} className="h-full w-full object-cover" />
            </div>
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900">{tour.title}</h4>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {tour.reservationCount} Rezervasyon
                </span>
              </div>
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <MapPinIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                {tour.location}
              </div>
              <div className="mt-2 flex items-center">
                <div className="flex items-center">
                  <StarIcon className="h-4 w-4 text-yellow-400" />
                  <span className="ml-1 text-sm text-gray-600">{tour.rating}</span>
                  <span className="mx-1 text-gray-300">•</span>
                  <span className="text-sm text-gray-500">{tour.reviewCount} değerlendirme</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

interface PopularFiltersProps {
  locations: {
    name: string;
    count: number;
  }[];
  tourTypes: {
    name: string;
    count: number;
  }[];
}

const PopularFilters = ({ locations, tourTypes }: PopularFiltersProps) => (
  <div className="bg-white overflow-hidden rounded-lg shadow-sm border border-gray-200">
    <div className="px-5 py-4 border-b border-gray-200">
      <h3 className="text-base font-semibold text-gray-900">Popüler Filtreler</h3>
    </div>
    <div className="p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <MapPinIcon className="h-4 w-4 mr-1.5 text-gray-500" />
            Popüler Lokasyonlar
          </h4>
          <div className="space-y-3">
            {locations.map((location) => (
              <div key={location.name} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{location.name}</span>
                <span className="text-sm font-medium text-gray-900">{location.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <TagIcon className="h-4 w-4 mr-1.5 text-gray-500" />
            Popüler Tur Tipleri
          </h4>
          <div className="space-y-3">
            {tourTypes.map((type) => (
              <div key={type.name} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{type.name}</span>
                <span className="text-sm font-medium text-gray-900">{type.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

interface NewRegistrationsProps {
  agencies: {
    id: number;
    name: string;
    location: string;
    date: string;
  }[];
  guides: {
    id: number;
    name: string;
    specialties: string[];
    date: string;
  }[];
}

const NewRegistrations = ({ agencies, guides }: NewRegistrationsProps) => (
  <div className="bg-white overflow-hidden rounded-lg shadow-sm border border-gray-200">
    <div className="px-5 py-4 border-b border-gray-200">
      <h3 className="text-base font-semibold text-gray-900">Yeni Kayıtlar</h3>
    </div>
    <div className="p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <BuildingOfficeIcon className="h-4 w-4 mr-1.5 text-gray-500" />
            Yeni Acenteler
          </h4>
          <div className="space-y-4">
            {agencies.map((agency) => (
              <div key={agency.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{agency.name}</p>
                  <p className="text-xs text-gray-500">{agency.location}</p>
                </div>
                <span className="text-xs text-gray-500">{agency.date}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <UserGroupIcon className="h-4 w-4 mr-1.5 text-gray-500" />
            Yeni Rehberler
          </h4>
          <div className="space-y-4">
            {guides.map((guide) => (
              <div key={guide.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{guide.name}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {guide.specialties.map((specialty) => (
                      <span key={specialty} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-xs text-gray-500">{guide.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function AdminDashboardPage() {
  const stats = [
    { title: 'Aktif Turistler', value: '8.429', icon: UsersIcon, change: '%15', changeType: 'increase' as const, changeText: 'geçen aya göre', color: 'blue' as const },
    { title: 'Aktif Acenteler', value: '854', icon: BuildingOfficeIcon, change: '%8', changeType: 'increase' as const, changeText: 'geçen aya göre', color: 'green' as const },
    { title: 'Aktif Rehberler', value: '245', icon: UserGroupIcon, change: '%12', changeType: 'increase' as const, changeText: 'geçen aya göre', color: 'purple' as const },
    { title: 'Yayında Olan Turlar', value: '1.245', icon: GlobeAltIcon, change: '%5', changeType: 'increase' as const, changeText: 'geçen aya göre', color: 'amber' as const },
  ];

  const reservationStats = [
    { title: 'Bugünkü Rezervasyonlar', value: '48', icon: CalendarIcon, change: '%12', changeType: 'increase' as const, changeText: 'düne göre', color: 'blue' as const },
    { title: 'Toplam Rezervasyonlar', value: '12.429', icon: ClipboardDocumentListIcon, change: '%8', changeType: 'increase' as const, changeText: 'geçen aya göre', color: 'green' as const },
  ];

  const popularTours = [
    { id: 1, title: 'İstanbul Şehir Turu', location: 'İstanbul, Türkiye', rating: 4.8, reviewCount: 127, reservationCount: 358, image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80' },
    { id: 2, title: 'Kapadokya Turu', location: 'Nevşehir, Türkiye', rating: 4.9, reviewCount: 98, reservationCount: 276, image: 'https://images.unsplash.com/photo-1570844065536-f5135048a6e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80' },
    { id: 3, title: 'Efes Antik Kenti Turu', location: 'İzmir, Türkiye', rating: 4.7, reviewCount: 85, reservationCount: 198, image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80' },
  ];

  const popularFilters = {
    locations: [
      { name: 'İstanbul', count: 1250 },
      { name: 'Kapadokya', count: 980 },
      { name: 'Antalya', count: 850 },
      { name: 'İzmir', count: 720 },
      { name: 'Bodrum', count: 650 },
    ],
    tourTypes: [
      { name: 'Günlük Turlar', count: 2500 },
      { name: 'Kültür Turları', count: 1800 },
      { name: 'Doğa Turları', count: 1500 },
      { name: 'Yemek Turları', count: 1200 },
      { name: 'Tarih Turları', count: 1000 },
    ],
  };

  const newRegistrations = {
    agencies: [
      { id: 1, name: 'Anadolu Turizm', location: 'İstanbul', date: '2 saat önce' },
      { id: 2, name: 'Ege Seyahat', location: 'İzmir', date: '3 saat önce' },
      { id: 3, name: 'Akdeniz Tours', location: 'Antalya', date: '5 saat önce' },
    ],
    guides: [
      { id: 1, name: 'Ahmet Yılmaz', specialties: ['Tarih', 'Kültür'], date: '1 saat önce' },
      { id: 2, name: 'Ayşe Demir', specialties: ['Doğa', 'Trekking'], date: '4 saat önce' },
      { id: 3, name: 'Mehmet Kaya', specialties: ['Yemek', 'Şarap'], date: '6 saat önce' },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Başlık ve Karşılama */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Hoş Geldiniz, Admin</h1>
        <p className="text-gray-600 mt-1">Sistem genelindeki güncel bilgileri ve istatistikleri buradan takip edebilirsiniz</p>
      </div>

      {/* Ana İstatistikler */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            changeType={stat.changeType}
            changeText={stat.changeText}
            color={stat.color}
          />
        ))}
      </div>

      {/* Rezervasyon İstatistikleri */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reservationStats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            changeType={stat.changeType}
            changeText={stat.changeText}
            color={stat.color}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Yeni Kayıtlar */}
        <NewRegistrations {...newRegistrations} />
        
        {/* Popüler Filtreler */}
        <PopularFilters {...popularFilters} />
      </div>

      {/* En Çok Rezervasyon Yapılan Turlar */}
      <PopularTours tours={popularTours} />
    </div>
  );
} 