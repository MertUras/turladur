'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  CalendarIcon,
  CurrencyDollarIcon,
  UsersIcon,
  CheckBadgeIcon,
  ExclamationCircleIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronRightIcon,
  MapPinIcon,
  ChartBarIcon,
  BuildingStorefrontIcon,
  EllipsisHorizontalIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  StarIcon
} from "@heroicons/react/24/outline";
import Image from 'next/image';
import QuickAccessCard from '../../components/partner-dashboard/QuickAccessCard';
import StatCard from '../../components/partner-dashboard/StatCard';
import ReservationStatus from '../../components/partner-dashboard/ReservationStatus';
import RevenueChart from '../../components/partner-dashboard/RevenueChart';
import RecentReservations from '../../components/partner-dashboard/RecentReservations';
import PopularTours from '../../components/partner-dashboard/PopularTours';

interface DashboardData {
  stats: {
    totalTours: number;
    totalBookings: number;
    totalRevenue: number;
    totalCustomers: number;
    averageRating: number;
    upcomingTours: number;
  };
  recentReservations: any[];
  popularTours: any[];
  reservationStatus: {
    pending: number;
    confirmed: number;
    cancelled: number;
    completed: number;
  };
}

export default function PartnerDashboardPage() {
  const { data: session } = useSession();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/partner/dashboard');
        if (!response.ok) {
          throw new Error('Veri alınamadı');
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const quickAccessItems = [
    { 
      title: 'Yeni Tur Ekle', 
      description: 'Yeni bir tur ekleyerek portföyünüzü genişletin', 
      icon: BuildingStorefrontIcon, 
      href: '/partner-dashboard/tours/create', 
      color: 'blue' as const 
    },
    { 
      title: 'Raporları İncele', 
      description: 'İşletmenizin performansını detaylı raporlarla analiz edin', 
      icon: ChartBarIcon, 
      href: '/partner-dashboard/reports', 
      color: 'green' as const 
    },
    { 
      title: 'Rezervasyonları Yönet', 
      description: 'Tüm rezervasyonlarınızı görüntüleyin ve yönetin', 
      icon: CalendarIcon, 
      href: '/partner-dashboard/reservations', 
      color: 'amber' as const 
    },
  ];

  if (loading) {
  return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">{error}</div>
  </div>
);
  }

  if (!dashboardData) {
    return null;
  }

  const stats = [
    {
      title: 'Toplam Tur',
      value: dashboardData.stats.totalTours.toString(),
      icon: BuildingStorefrontIcon,
      change: '+12%',
      changeType: 'increase' as const,
      changeText: 'Geçen aya göre',
      color: 'blue' as const
    },
    {
      title: 'Toplam Rezervasyon',
      value: dashboardData.stats.totalBookings.toString(),
      icon: CalendarIcon,
      change: '+8%',
      changeType: 'increase' as const,
      changeText: 'Geçen aya göre',
      color: 'green' as const
    },
    {
      title: 'Toplam Gelir',
      value: `${dashboardData.stats.totalRevenue.toLocaleString('tr-TR')}₺`,
      icon: CurrencyDollarIcon,
      change: '+15%',
      changeType: 'increase' as const,
      changeText: 'Geçen aya göre',
      color: 'amber' as const
    },
    {
      title: 'Toplam Müşteri',
      value: dashboardData.stats.totalCustomers.toString(),
      icon: UserGroupIcon,
      change: '+5%',
      changeType: 'increase' as const,
      changeText: 'Geçen aya göre',
      color: 'purple' as const
    },
    {
      title: 'Ortalama Puan',
      value: dashboardData.stats.averageRating.toFixed(1),
      icon: StarIcon,
      change: '+0.2',
      changeType: 'increase' as const,
      changeText: 'Geçen aya göre',
      color: 'red' as const
    },
    {
      title: 'Yaklaşan Turlar',
      value: dashboardData.stats.upcomingTours.toString(),
      icon: ClockIcon,
      change: '+3',
      changeType: 'increase' as const,
      changeText: 'Geçen haftaya göre',
      color: 'blue' as const
    }
  ];

  return (
    <div className="space-y-6">
      {/* Başlık ve Karşılama */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Hoş Geldiniz, {session?.user?.name}</h1>
        <p className="text-gray-600 mt-1">İşletmenizle ilgili güncel bilgileri ve istatistikleri buradan takip edebilirsiniz</p>
      </div>

      {/* Hızlı Erişim Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {quickAccessItems.map(item => (
          <QuickAccessCard
            key={item.title}
            title={item.title}
            description={item.description}
            icon={item.icon}
            href={item.href}
            color={item.color}
          />
        ))}
      </div>
      
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Rezervasyon Durumu */}
        <ReservationStatus reservations={dashboardData.reservationStatus} />
        
        {/* Gelir Grafiği */}
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
      </div>
      
      {/* Yaklaşan Rezervasyonlar */}
      <RecentReservations reservations={dashboardData.recentReservations} />
      
      {/* Popüler Turlar */}
      <PopularTours tours={dashboardData.popularTours} />
    </div>
  );
} 