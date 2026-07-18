'use client';

import { useEffect, useState } from 'react';

import { listAdminPartners, setPartnerStatus } from '@/services/partner-admin';
import { useAuth } from '@/providers/auth-provider';

type PartnerRow = {
  id: string;
  companyName: string;
  contactEmail: string;
  status: string;
  verifiedAt: string | null;
};

export default function AdminAgenciesPage() {
  const { accessToken } = useAuth();
  const [rows, setRows] = useState<PartnerRow[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  async function reload(status?: string) {
    if (!accessToken) return;
    setRows(await listAdminPartners(accessToken, status || undefined));
  }

  useEffect(() => {
    if (!accessToken) return;
    void reload(filter).catch((err: Error) => setError(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, filter]);

  async function setStatus(
    id: string,
    status: 'VERIFIED' | 'REJECTED' | 'SUSPENDED',
  ) {
    if (!accessToken) return;
    setError(null);
    try {
      await setPartnerStatus(id, status, accessToken);
      await reload(filter);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Güncelleme başarısız');
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">Partnerler</h1>
      <p className="mt-1 text-sm text-neutral-600">Onay / red / askıya alma</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {[
          ['', 'Tümü'],
          ['PENDING', 'Bekleyen'],
          ['VERIFIED', 'Onaylı'],
          ['REJECTED', 'Red'],
          ['SUSPENDED', 'Askıda'],
        ].map(([value, label]) => (
          <button
            key={value || 'all'}
            type="button"
            onClick={() => setFilter(value)}
            className={`rounded-lg px-3 py-1.5 text-sm ${
              filter === value
                ? 'bg-sky-600 text-white'
                : 'border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
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
              <p className="font-medium text-neutral-900">{row.companyName}</p>
              <p className="text-xs text-neutral-500">
                {row.contactEmail} · {row.status}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-700"
                onClick={() => void setStatus(row.id, 'VERIFIED')}
              >
                Onayla
              </button>
              <button
                type="button"
                className="rounded-lg bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-700"
                onClick={() => void setStatus(row.id, 'REJECTED')}
              >
                Reddet
              </button>
              <button
                type="button"
                className="rounded-lg border border-neutral-300 px-2.5 py-1 text-xs hover:bg-neutral-50"
                onClick={() => void setStatus(row.id, 'SUSPENDED')}
              >
                Askıya al
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
