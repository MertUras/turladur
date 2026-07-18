'use client';

import { useEffect, useState } from 'react';

import { listPendingTours, setTourStatusAdmin } from '@/services/partner-admin';
import { useAuth } from '@/providers/auth-provider';

type TourRow = {
  id: string;
  title: string;
  partnerId: string;
  price: string;
  currency: string;
  category: string;
  status: string;
};

export default function AdminToursPage() {
  const { accessToken } = useAuth();
  const [rows, setRows] = useState<TourRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function reload() {
    if (!accessToken) return;
    setRows(await listPendingTours(accessToken));
  }

  useEffect(() => {
    if (!accessToken) return;
    void reload().catch((err: Error) => setError(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  async function setStatus(
    id: string,
    status: 'PUBLISHED' | 'ARCHIVED' | 'DRAFT',
  ) {
    if (!accessToken) return;
    setError(null);
    try {
      await setTourStatusAdmin(id, status, accessToken);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Güncelleme başarısız');
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">Tur onay</h1>
      <p className="mt-1 text-sm text-neutral-600">
        PENDING_REVIEW turları yayına al / arşivle
      </p>
      {error ? (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-red-700">{error}</p>
      ) : null}
      <ul className="mt-6 divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
        {rows.length === 0 && !error ? (
          <li className="p-4 text-sm text-neutral-600">Bekleyen tur yok.</li>
        ) : null}
        {rows.map((row) => (
          <li
            key={row.id}
            className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
          >
            <div>
              <p className="font-medium text-neutral-900">{row.title}</p>
              <p className="text-xs text-neutral-500">
                {row.category} · {row.price} {row.currency} · partner{' '}
                {row.partnerId.slice(0, 8)}…
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-700"
                onClick={() => void setStatus(row.id, 'PUBLISHED')}
              >
                Yayınla
              </button>
              <button
                type="button"
                className="rounded-lg border border-neutral-300 px-2.5 py-1 text-xs hover:bg-neutral-50"
                onClick={() => void setStatus(row.id, 'DRAFT')}
              >
                Taslak
              </button>
              <button
                type="button"
                className="rounded-lg bg-neutral-800 px-2.5 py-1 text-xs font-medium text-white hover:bg-neutral-900"
                onClick={() => void setStatus(row.id, 'ARCHIVED')}
              >
                Arşivle
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
