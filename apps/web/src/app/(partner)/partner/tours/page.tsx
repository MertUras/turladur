'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { TourCard } from '@/components/features/partner-dashboard/tour-card';
import { listPartnerTours, type PartnerTour } from '@/services/partner-admin';
import { useAuth } from '@/providers/auth-provider';

function mapStatus(status: string): 'active' | 'draft' | 'archived' {
  if (status === 'PUBLISHED' || status === 'ACTIVE') return 'active';
  if (status === 'ARCHIVED') return 'archived';
  return 'draft';
}

export default function PartnerToursPage() {
  const { accessToken } = useAuth();
  const router = useRouter();
  const [tours, setTours] = useState<PartnerTour[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [listView, setListView] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    void listPartnerTours(accessToken)
      .then(setTours)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [accessToken]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tours;
    return tours.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.status.toLowerCase().includes(q),
    );
  }, [tours, query]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Turlar</h1>
          <p className="mt-1 text-sm text-gray-600">
            Turlarınızı yönetin. Yeni turlar admin onayına gider.
          </p>
        </div>
        <Link
          href="/partner/tours/new"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Yeni Tur
        </Link>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tur ara..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setListView(false)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                !listView
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              Kart
            </button>
            <button
              type="button"
              onClick={() => setListView(true)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                listView
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              Liste
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
      ) : null}

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
          <p className="text-lg font-semibold text-gray-700">Tur bulunamadı</p>
          <p className="mt-1 text-sm text-gray-500">
            Henüz tur eklemediniz veya aramanız sonuç vermedi.
          </p>
          <Link
            href="/partner/tours/new"
            className="mt-6 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            İlk turu ekle
          </Link>
        </div>
      ) : (
        <div
          className={
            listView
              ? 'space-y-4'
              : 'grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3'
          }
        >
          {filtered.map((tour) => (
            <TourCard
              key={tour.id}
              id={tour.id}
              title={tour.title}
              price={`${Number(tour.price).toLocaleString('tr-TR')} ${tour.currency}`}
              location={tour.category || '—'}
              duration={`${tour.durationDays} gün`}
              maxParticipants={20}
              imageUrl={tour.coverUrl || '/brand/mark-on-light.png'}
              status={mapStatus(tour.status)}
              listView={listView}
              onEdit={(id) => router.push(`/partner/tours/${id}/edit`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
