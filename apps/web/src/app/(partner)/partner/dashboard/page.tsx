'use client';

import { useEffect, useState } from 'react';

import { getPartnerStats, type PartnerStats } from '@/services/partner-admin';
import { useAuth } from '@/providers/auth-provider';

export default function PartnerDashboardPage() {
  const { accessToken } = useAuth();
  const [stats, setStats] = useState<PartnerStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    void getPartnerStats(accessToken)
      .then(setStats)
      .catch((err: Error) => setError(err.message));
  }, [accessToken]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">Partner özeti</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Nest <code>/partner/dashboard/stats</code>
      </p>
      {error ? (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-red-700">{error}</p>
      ) : null}
      {stats ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Stat
            label="Turlar"
            value={`${stats.tours.total}`}
            hint={`${stats.tours.published} yayında · ${stats.tours.pendingReview} incelemede`}
          />
          <Stat
            label="Rezervasyon"
            value={`${stats.reservations.total}`}
            hint="Toplam kayıt"
          />
          <Stat
            label="Gelir (onaylı)"
            value={`${stats.revenue.confirmedTotal} ${stats.revenue.currency}`}
            hint="CONFIRMED + COMPLETED"
          />
        </div>
      ) : (
        !error && <p className="mt-8 text-neutral-600">Yükleniyor…</p>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-neutral-900">{value}</p>
      <p className="mt-1 text-xs text-neutral-500">{hint}</p>
    </div>
  );
}
