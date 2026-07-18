'use client';

import { useEffect, useState } from 'react';

import {
  listPartnerReservations,
  updatePartnerReservation,
  type PartnerReservation,
} from '@/services/partner-admin';
import { useAuth } from '@/providers/auth-provider';

export default function PartnerReservationsPage() {
  const { accessToken } = useAuth();
  const [rows, setRows] = useState<PartnerReservation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function reload() {
    if (!accessToken) return;
    setRows(await listPartnerReservations(accessToken));
  }

  useEffect(() => {
    if (!accessToken) return;
    void reload().catch((err: Error) => setError(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reload on token only
  }, [accessToken]);

  async function handleStatus(id: string, status: 'CONFIRMED' | 'CANCELLED') {
    if (!accessToken) return;
    setBusyId(id);
    setError(null);
    try {
      await updatePartnerReservation(id, status, accessToken);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Güncelleme başarısız');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">Rezervasyonlar</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Sadece kendi turlarınıza ait kayıtlar.
      </p>
      {error ? (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-red-700">{error}</p>
      ) : null}
      <ul className="mt-6 divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
        {rows.length === 0 && !error ? (
          <li className="p-4 text-sm text-neutral-600">Kayıt yok.</li>
        ) : null}
        {rows.map((row) => (
          <li
            key={row.id}
            className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
          >
            <div>
              <p className="font-medium text-neutral-900">
                {row.bookingNumber}
              </p>
              <p className="text-xs text-neutral-500">
                {row.adults + row.children} kişi · {row.totalAmount}{' '}
                {row.currency} · {row.status} · {row.contactEmail}
              </p>
            </div>
            <select
              className="rounded-lg border border-neutral-300 px-2 py-1 text-sm"
              disabled={busyId === row.id}
              defaultValue=""
              onChange={(e) => {
                const v = e.target.value as 'CONFIRMED' | 'CANCELLED' | '';
                if (v) void handleStatus(row.id, v);
                e.target.value = '';
              }}
            >
              <option value="">Durum güncelle</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
}
