'use client';

import { useEffect, useState } from 'react';

import { getAdminStats, type AdminStats } from '@/services/partner-admin';
import { useAuth } from '@/providers/auth-provider';

export default function AdminStatisticsPage() {
  const { accessToken } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    void getAdminStats(accessToken)
      .then(setStats)
      .catch((err: Error) => setError(err.message));
  }, [accessToken]);

  const bars = stats
    ? [
        { label: 'Kullanıcı', value: stats.users },
        { label: 'Partner', value: stats.partners.total },
        { label: 'Tur', value: stats.tours.total },
        { label: 'Deneyim', value: stats.experiences?.total ?? 0 },
        { label: 'Rezervasyon', value: stats.reservations },
        { label: 'Başarılı ödeme', value: stats.paymentsSuccess },
      ]
    : [];
  const max = Math.max(1, ...bars.map((b) => b.value));

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">İstatistikler</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Platform KPI özeti (Nest admin dashboard stats)
      </p>
      {error ? (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {stats ? (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Kpi label="Bekleyen partner" value={stats.partners.pending} />
            <Kpi label="İncelemede tur" value={stats.tours.pendingReview} />
            <Kpi
              label="İncelemede deneyim"
              value={stats.experiences?.pendingReview ?? 0}
            />
          </div>

          <div className="mt-10 space-y-4 rounded-xl border border-neutral-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-neutral-900">
              Hacim karşılaştırması
            </h2>
            {bars.map((b) => (
              <div key={b.label}>
                <div className="mb-1 flex justify-between text-xs text-neutral-600">
                  <span>{b.label}</span>
                  <span>{b.value.toLocaleString('tr-TR')}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full bg-neutral-900"
                    style={{
                      width: `${Math.round((b.value / max) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        !error && <p className="mt-8 text-sm text-neutral-600">Yükleniyor…</p>
      )}
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-neutral-900">
        {value.toLocaleString('tr-TR')}
      </p>
    </div>
  );
}
