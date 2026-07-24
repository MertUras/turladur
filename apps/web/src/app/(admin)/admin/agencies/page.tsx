'use client';

import { useEffect, useState } from 'react';

import {
  listAdminAgencies,
  listAdminPartners,
  setAgencyStatusAdmin,
  setPartnerStatus,
} from '@/services/partner-admin';
import { useAuth } from '@/providers/auth-provider';

export default function AdminAgenciesPage() {
  const { accessToken } = useAuth();
  const [tab, setTab] = useState<'partners' | 'agencies'>('partners');
  const [partners, setPartners] = useState<
    Array<{
      id: string;
      companyName: string;
      contactEmail: string;
      status: string;
    }>
  >([]);
  const [agencies, setAgencies] = useState<
    Array<{
      id: string;
      name: string;
      status: string;
      email: string | null;
      city: string | null;
    }>
  >([]);
  const [error, setError] = useState<string | null>(null);

  async function reload() {
    if (!accessToken) return;
    const [p, a] = await Promise.all([
      listAdminPartners(accessToken),
      listAdminAgencies(accessToken).catch(() => []),
    ]);
    setPartners(p);
    setAgencies(a);
  }

  useEffect(() => {
    void reload().catch((err: Error) => setError(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">
        Partnerler & Acenteler
      </h1>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => setTab('partners')}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
            tab === 'partners'
              ? 'bg-neutral-950 text-white'
              : 'border border-neutral-300'
          }`}
        >
          Partnerler
        </button>
        <button
          type="button"
          onClick={() => setTab('agencies')}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
            tab === 'agencies'
              ? 'bg-neutral-950 text-white'
              : 'border border-neutral-300'
          }`}
        >
          Acenteler
        </button>
      </div>
      {error ? (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {tab === 'partners' ? (
        <ul className="mt-6 divide-y rounded-xl border bg-white">
          {partners.map((row) => (
            <li
              key={row.id}
              className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"
            >
              <div>
                <p className="font-medium">{row.companyName}</p>
                <p className="text-xs text-neutral-500">
                  {row.contactEmail} · {row.status}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-lg bg-emerald-600 px-2 py-1 text-xs text-white"
                  onClick={() => {
                    if (!accessToken) return;
                    void setPartnerStatus(row.id, 'VERIFIED', accessToken)
                      .then(reload)
                      .catch((err: Error) => setError(err.message));
                  }}
                >
                  Onayla
                </button>
                <button
                  type="button"
                  className="rounded-lg border px-2 py-1 text-xs"
                  onClick={() => {
                    if (!accessToken) return;
                    void setPartnerStatus(row.id, 'REJECTED', accessToken)
                      .then(reload)
                      .catch((err: Error) => setError(err.message));
                  }}
                >
                  Red
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="mt-6 divide-y rounded-xl border bg-white">
          {agencies.length === 0 ? (
            <li className="p-4 text-sm text-neutral-600">Acente yok.</li>
          ) : null}
          {agencies.map((row) => (
            <li
              key={row.id}
              className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"
            >
              <div>
                <p className="font-medium">{row.name}</p>
                <p className="text-xs text-neutral-500">
                  {row.email} · {row.city} · {row.status}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-lg bg-emerald-600 px-2 py-1 text-xs text-white"
                  onClick={() => {
                    if (!accessToken) return;
                    void setAgencyStatusAdmin(row.id, 'APPROVED', accessToken)
                      .then(reload)
                      .catch((err: Error) => setError(err.message));
                  }}
                >
                  Onayla
                </button>
                <button
                  type="button"
                  className="rounded-lg border px-2 py-1 text-xs"
                  onClick={() => {
                    if (!accessToken) return;
                    void setAgencyStatusAdmin(row.id, 'REJECTED', accessToken)
                      .then(reload)
                      .catch((err: Error) => setError(err.message));
                  }}
                >
                  Red
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
