'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  CalendarIcon,
  CurrencyDollarIcon,
  CheckBadgeIcon,
  ClockIcon,
  ChartBarIcon,
  BuildingStorefrontIcon,
  UserGroupIcon,
  StarIcon
} from "@heroicons/react/24/outline";
import QuickAccessCard from '../../components/partner-dashboard/QuickAccessCard';
import StatCard from '../../components/partner-dashboard/StatCard';
import ReservationStatus from '../../components/partner-dashboard/ReservationStatus';
import RevenueChart from '../../components/partner-dashboard/RevenueChart';
import RecentReservations from '../../components/partner-dashboard/RecentReservations';
import PopularTours from '../../components/partner-dashboard/PopularTours';
import {
  PartnerDashboardData,
  PartnerDashboardStatTrends,
  PartnerDashboardStats,
} from '@/lib/partner/dashboard';

export default function PartnerDashboardPage() {
  const { data: session } = useSession();
  const [dashboardData, setDashboardData] = useState<PartnerDashboardData | null>(null);
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

  const userRole = session?.user?.role;
  const quickAccessItems = [
    userRole === 'EXPERIENCE_PROVIDER'
      ? {
          title: 'Yeni Aktivite Ekle',
          description: 'Yeni bir aktivite ekleyerek portföyünüzü genişletin',
          icon: BuildingStorefrontIcon,
          href: '/partner-dashboard/experiences/create',
          color: 'blue' as const,
        }
      : {
          title: 'Yeni Tur Ekle',
          description: 'Yeni bir tur ekleyerek portföyünüzü genişletin',
          icon: BuildingStorefrontIcon,
          href: '/partner-dashboard/tours/create',
          color: 'blue' as const,
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

  const stats = buildStatCards(dashboardData.stats, dashboardData.trends, userRole);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Hoş Geldiniz, {session?.user?.name}</h1>
        <p className="text-gray-600 mt-1">İşletmenizle ilgili güncel bilgileri ve istatistikleri buradan takip edebilirsiniz</p>
      </div>

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
        <ReservationStatus reservations={dashboardData.reservationStatus} />
        
        <div className="lg:col-span-2">
          <RevenueChart data={dashboardData.revenueChart} />
        </div>
      </div>
      
      <RecentReservations reservations={dashboardData.recentReservations} />
      
      <PopularTours tours={dashboardData.popularTours} />
    </div>
  );
}

function buildStatCards(
  stats: PartnerDashboardStats,
  trends: PartnerDashboardStatTrends,
  userRole?: string
) {
  const tourLabel = userRole === 'EXPERIENCE_PROVIDER' ? 'Toplam Aktivite' : 'Toplam Tur';
  const upcomingLabel = userRole === 'EXPERIENCE_PROVIDER' ? 'Yaklaşan Aktiviteler' : 'Yaklaşan Turlar';

  return [
    {
      title: tourLabel,
      value: stats.totalTours.toString(),
      icon: BuildingStorefrontIcon,
      ...pickTrend(trends.totalTours),
      color: 'blue' as const,
    },
    {
      title: 'Toplam Rezervasyon',
      value: stats.totalBookings.toString(),
      icon: CalendarIcon,
      ...pickTrend(trends.totalBookings),
      color: 'green' as const,
    },
    {
      title: 'Toplam Gelir',
      value: `${stats.totalRevenue.toLocaleString('tr-TR')}₺`,
      icon: CurrencyDollarIcon,
      ...pickTrend(trends.totalRevenue),
      color: 'amber' as const,
    },
    {
      title: 'Toplam Müşteri',
      value: stats.totalCustomers.toString(),
      icon: UserGroupIcon,
      ...pickTrend(trends.totalCustomers),
      color: 'purple' as const,
    },
    {
      title: 'Ortalama Puan',
      value: stats.averageRating.toFixed(1),
      icon: StarIcon,
      ...pickTrend(trends.averageRating),
      color: 'red' as const,
    },
    {
      title: upcomingLabel,
      value: stats.upcomingTours.toString(),
      icon: ClockIcon,
      ...pickTrend(trends.upcomingTours),
      color: 'blue' as const,
    },
  ];
}

function pickTrend(trend?: PartnerDashboardStatTrends[keyof PartnerDashboardStatTrends]) {
  if (!trend) {
    return {};
  }
  return {
    change: trend.change,
    changeType: trend.changeType,
    changeText: trend.changeText,
  };
}
