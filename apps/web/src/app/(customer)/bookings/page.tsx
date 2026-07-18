'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Reservation } from '@turladur/shared-types';

import { listReservations } from '@/services/booking';
import { useAuth } from '@/providers/auth-provider';

export default function BookingsPage() {
  const { isAuthenticated, accessToken } = useAuth();
  const [items, setItems] = useState<Reservation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      setLoading(false);
      return;
    }
    void (async () => {
      try {
        const data = await listReservations(accessToken);
        setItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Yüklenemedi');
      } finally {
        setLoading(false);
      }
    })();
  }, [isAuthenticated, accessToken]);

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Rezervasyonlarım</h1>
        <p className="mt-2 text-neutral-600">Görüntülemek için giriş yapın.</p>
        <Link
          href="/login"
          className="mt-6 inline-flex rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Giriş yap
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold text-neutral-900">Rezervasyonlarım</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Nest <code>/booking/reservations</code>
      </p>

      {loading ? <p className="mt-8 text-neutral-600">Yükleniyor…</p> : null}
      {error ? (
        <p className="mt-8 rounded-lg bg-red-50 p-3 text-red-700">{error}</p>
      ) : null}

      {!loading && items.length === 0 ? (
        <p className="mt-8 text-neutral-600">
          Henüz rezervasyon yok.{' '}
          <Link href="/tours" className="text-sky-700">
            Turları keşfet
          </Link>
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {items.map((r) => (
            <li
              key={r.id}
              className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-neutral-900">
                    {r.bookingNumber}
                  </p>
                  <p className="mt-1 text-sm text-neutral-600">
                    {r.totalAmount} {r.currency} · {r.adults} yetişkin
                  </p>
                </div>
                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800">
                  {r.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
