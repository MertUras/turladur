'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  Calendar,
  BarChart3,
  Clock,
  Star,
  Users,
  Wallet,
} from 'lucide-react';

import { QuickAccessCard } from '@/components/features/partner-dashboard/quick-access-card';
import { StatCard } from '@/components/features/partner-dashboard/stat-card';
import { ReservationStatus } from '@/components/features/partner-dashboard/reservation-status';
import { RevenueChart } from '@/components/features/partner-dashboard/revenue-chart';
import { RecentReservations } from '@/components/features/partner-dashboard/recent-reservations';
import { PopularTours } from '@/components/features/partner-dashboard/popular-tours';
import {
  getPartnerFinancials,
  getPartnerStats,
  listPartnerReservations,
  listPartnerTours,
  type PartnerReservation,
  type PartnerStats,
  type PartnerTour,
} from '@/services/partner-admin';
import { useAuth } from '@/providers/auth-provider';
import {
  canAccessStaffPermission,
  hasFullPartnerAccess,
} from '@/lib/partner-permissions';

function statusLabel(status: string) {
  switch (status) {
    case 'CONFIRMED':
      return 'Onaylandı' as const;
    case 'PENDING':
    case 'PENDING_PAYMENT':
      return 'Beklemede' as const;
    case 'CANCELLED':
      return 'İptal Edildi' as const;
    case 'COMPLETED':
      return 'Tamamlandı' as const;
    case 'SUSPENDED':
      return 'Askıya Alındı' as const;
    default:
      return 'Beklemede' as const;
  }
}

function mapRecent(rows: PartnerReservation[], hideAmounts = false) {
  return rows.slice(0, 5).map((r) => {
    const email = r.contactEmail || 'misafir@turta.com';
    const local = email.split('@')[0] || 'M';
    const initials = local.slice(0, 2).toUpperCase();
    const created = new Date(r.createdAt);
    return {
      id: r.id,
      customerName: local,
      customerEmail: email,
      customerInitials: initials,
      activity: r.bookingNumber,
      activityType: r.tourId ? 'Tur' : 'Rezervasyon',
      date: created.toLocaleDateString('tr-TR'),
      time: created.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      amount: hideAmounts
        ? '—'
        : `${Number(r.totalAmount).toLocaleString('tr-TR')} ${r.currency}`,
      status: statusLabel(r.status),
    };
  });
}

function mapPopular(tours: PartnerTour[]) {
  return tours.slice(0, 4).map((t) => ({
    id: t.id,
    title: t.title,
    location: t.category || 'Türkiye',
    rating: 4.5,
    reviewCount: 0,
    reservationCount: 0,
    guestCount: 0,
    price: `${Number(t.price).toLocaleString('tr-TR')} ${t.currency}`,
    image: t.coverUrl || '/brand/mark-on-light.png',
  }));
}

export default function PartnerDashboardPage() {
  const { accessToken, user } = useAuth();
  const [stats, setStats] = useState<PartnerStats | null>(null);
  const [reservations, setReservations] = useState<PartnerReservation[]>([]);
  const [tours, setTours] = useState<PartnerTour[]>([]);
  const [months, setMonths] = useState<Array<{ month: string; total: string }>>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canSeeRevenue = canAccessStaffPermission(
    user?.role,
    user?.permissions,
    'reports',
  );
  const canManageTours = canAccessStaffPermission(
    user?.role,
    user?.permissions,
    'tours',
  );
  const canManageReservations = canAccessStaffPermission(
    user?.role,
    user?.permissions,
    'reservations',
  );

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    void (async () => {
      try {
        const [s, r, t, f] = await Promise.all([
          getPartnerStats(accessToken),
          canManageReservations
            ? listPartnerReservations(accessToken).catch(() => [])
            : Promise.resolve([] as PartnerReservation[]),
          canManageTours
            ? listPartnerTours(accessToken).catch(() => [])
            : Promise.resolve([] as PartnerTour[]),
          canSeeRevenue
            ? getPartnerFinancials(accessToken).catch(() => null)
            : Promise.resolve(null),
        ]);
        if (cancelled) return;
        setStats(s);
        setReservations(r);
        setTours(t);
        setMonths(f?.months ?? []);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Dashboard yüklenemedi',
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [accessToken, canManageReservations, canManageTours, canSeeRevenue]);

  const reservationStatus = useMemo(() => {
    const counts = { pending: 0, confirmed: 0, cancelled: 0, completed: 0 };
    for (const r of reservations) {
      if (r.status === 'CONFIRMED') counts.confirmed += 1;
      else if (r.status === 'CANCELLED') counts.cancelled += 1;
      else if (r.status === 'COMPLETED') counts.completed += 1;
      else counts.pending += 1;
    }
    return counts;
  }, [reservations]);

  const revenueChart = useMemo(() => {
    const monthPoints = months.map((m) => ({
      label: m.month.slice(5) || m.month,
      revenue: Number(m.total) || 0,
    }));
    return {
      week: monthPoints.slice(-2),
      month: monthPoints.length
        ? monthPoints
        : [
            {
              label: 'Toplam',
              revenue: Number(stats?.revenue?.confirmedTotal) || 0,
            },
          ],
      year: monthPoints,
    };
  }, [months, stats]);

  const name = user
    ? [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email
    : 'Partner';

  const quickAccessItems = [
    canManageTours
      ? {
          title: 'Yeni Tur Ekle',
          description: 'Yeni bir tur ekleyerek portföyünüzü genişletin',
          icon: Building2,
          href: '/partner/tours/new',
          color: 'blue' as const,
        }
      : null,
    canSeeRevenue
      ? {
          title: 'Raporları İncele',
          description:
            'İşletmenizin performansını detaylı raporlarla analiz edin',
          icon: BarChart3,
          href: '/partner/reports',
          color: 'green' as const,
        }
      : null,
    canManageReservations
      ? {
          title: 'Rezervasyonları Yönet',
          description: 'Tüm rezervasyonlarınızı görüntüleyin ve yönetin',
          icon: Calendar,
          href: '/partner/reservations',
          color: 'amber' as const,
        }
      : null,
  ].filter(Boolean) as Array<{
    title: string;
    description: string;
    icon: typeof Building2;
    href: string;
    color: 'blue' | 'green' | 'amber';
  }>;

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="font-medium text-red-600">Dashboard yüklenemedi</p>
        <p className="text-sm text-gray-600">{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Tekrar dene
        </button>
      </div>
    );
  }

  if (!stats) return null;

  const isOwner = hasFullPartnerAccess(user?.role);
  const showTourStats = isOwner || canManageTours;
  const showReservationStats = isOwner || canManageReservations;

  const statCards = [
    showTourStats
      ? {
          title: 'Toplam Tur',
          value: stats.tours.total.toString(),
          icon: Building2,
          color: 'blue' as const,
          changeText: `${stats.tours.published} yayında`,
        }
      : null,
    showReservationStats
      ? {
          title: 'Toplam Rezervasyon',
          value: stats.reservations.total.toString(),
          icon: Calendar,
          color: 'green' as const,
        }
      : null,
    canSeeRevenue
      ? {
          title: 'Toplam Gelir',
          value: `${Number(stats.revenue?.confirmedTotal ?? 0).toLocaleString('tr-TR')}₺`,
          icon: Wallet,
          color: 'amber' as const,
        }
      : null,
    showTourStats
      ? {
          title: 'İncelemede',
          value: stats.tours.pendingReview.toString(),
          icon: Clock,
          color: 'purple' as const,
        }
      : null,
    isOwner
      ? {
          title: 'Ortalama Puan',
          value: '—',
          icon: Star,
          color: 'red' as const,
        }
      : null,
    showTourStats
      ? {
          title: 'Aktif Turlar',
          value: stats.tours.published.toString(),
          icon: Users,
          color: 'blue' as const,
        }
      : null,
  ].filter(Boolean) as Array<{
    title: string;
    value: string;
    icon: typeof Building2;
    color: 'blue' | 'green' | 'amber' | 'purple' | 'red';
    changeText?: string;
  }>;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Hoş Geldiniz, {name}
        </h1>
        <p className="mt-1 text-gray-600">
          İşletmenizle ilgili güncel bilgileri ve istatistikleri buradan takip
          edebilirsiniz
        </p>
      </div>

      {quickAccessItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {quickAccessItems.map((item) => (
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
      ) : null}

      {statCards.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {statCards.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              changeText={stat.changeText}
              color={stat.color}
            />
          ))}
        </div>
      ) : null}

      <div
        className={`grid grid-cols-1 gap-5 ${canSeeRevenue ? 'lg:grid-cols-3' : ''}`}
      >
        {showReservationStats ? (
          <ReservationStatus reservations={reservationStatus} />
        ) : null}
        {canSeeRevenue ? (
          <div className="lg:col-span-2">
            <RevenueChart data={revenueChart} />
          </div>
        ) : null}
      </div>

      {showReservationStats ? (
        <RecentReservations
          reservations={mapRecent(reservations, !canSeeRevenue)}
        />
      ) : null}
      {showTourStats ? <PopularTours tours={mapPopular(tours)} /> : null}
    </div>
  );
}
