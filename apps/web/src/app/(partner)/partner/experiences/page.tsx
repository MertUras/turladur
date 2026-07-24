'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';

import {
  deletePartnerExperience,
  listPartnerExperiences,
  type PartnerExperience,
} from '@/services/partner-admin';
import { useAuth } from '@/providers/auth-provider';

function statusStyle(status: string) {
  if (status === 'PUBLISHED' || status === 'ACTIVE') {
    return 'bg-emerald-50 text-emerald-700';
  }
  if (status === 'ARCHIVED') return 'bg-gray-100 text-gray-600';
  return 'bg-amber-50 text-amber-700';
}

export default function PartnerExperiencesPage() {
  const { accessToken } = useAuth();
  const [items, setItems] = useState<PartnerExperience[]>([]);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function reload() {
    if (!accessToken) return;
    setItems(await listPartnerExperiences(accessToken));
  }

  useEffect(() => {
    if (!accessToken) return;
    void reload()
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const visible = items.filter((e) => {
    if (!filter) return true;
    const q = filter.toLowerCase();
    return (
      e.title.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q) ||
      e.status.toLowerCase().includes(q)
    );
  });

  async function handleDelete(id: string) {
    if (!accessToken) return;
    if (!confirm('Bu deneyimi silmek istiyor musunuz?')) return;
    try {
      await deletePartnerExperience(id, accessToken);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Silinemedi');
    }
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Aktiviteler</h1>
          <p className="mt-1 text-sm text-gray-600">
            Müşteri sitesinde Aktiviteler olarak görünür.
          </p>
        </div>
        <Link
          href="/partner/experiences/new"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Yeni Aktivite
        </Link>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Başlık, kategori, lokasyon…"
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {error ? (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
      ) : null}

      {visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
          <p className="text-lg font-semibold text-gray-700">Aktivite yok</p>
          <Link
            href="/partner/experiences/new"
            className="mt-6 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            İlk aktiviteyi ekle
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="border-b border-gray-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
                    {item.title}
                  </h3>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${statusStyle(item.status)}`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {item.category} · {item.location}
                </p>
              </div>
              <div className="flex items-center justify-between p-4">
                <p className="text-lg font-bold text-indigo-600">
                  {Number(item.price).toLocaleString('tr-TR')} {item.currency}
                </p>
                <div className="flex gap-2">
                  <Link
                    href={`/partner/experiences/${item.id}/edit`}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Düzenle
                  </Link>
                  <button
                    type="button"
                    onClick={() => void handleDelete(item.id)}
                    className="rounded-lg border border-gray-200 p-1.5 text-gray-600 hover:bg-red-50 hover:text-red-600"
                    aria-label="Sil"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
