'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { listPartnerTours, type PartnerTour } from '@/services/partner-admin';
import { useAuth } from '@/providers/auth-provider';

export default function PartnerToursPage() {
  const { accessToken } = useAuth();
  const [tours, setTours] = useState<PartnerTour[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    void listPartnerTours(accessToken)
      .then(setTours)
      .catch((err: Error) => setError(err.message));
  }, [accessToken]);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Turlarım</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Yeni turlar admin onayına gider (PENDING_REVIEW).
          </p>
        </div>
        <Link
          href="/partner/tours/new"
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
        >
          Yeni tur
        </Link>
      </div>
      {error ? (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-red-700">{error}</p>
      ) : null}
      <ul className="mt-6 divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
        {tours.length === 0 && !error ? (
          <li className="p-4 text-sm text-neutral-600">Henüz tur yok.</li>
        ) : null}
        {tours.map((tour) => (
          <li
            key={tour.id}
            className="flex flex-wrap items-center justify-between gap-2 px-4 py-3"
          >
            <div>
              <p className="font-medium text-neutral-900">{tour.title}</p>
              <p className="text-xs text-neutral-500">
                {tour.category} · {tour.price} {tour.currency} ·{' '}
                {tour.durationDays} gün
              </p>
            </div>
            <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-700">
              {tour.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
