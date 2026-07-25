'use client';

import { useEffect, useMemo, useState } from 'react';
import { Calendar, RefreshCw, Users } from 'lucide-react';

import {
  listPartnerReservations,
  updatePartnerReservation,
  type PartnerReservation,
} from '@/services/partner-admin';
import { useAuth } from '@/providers/auth-provider';

type FilterStatus = 'all' | 'CONFIRMED' | 'PENDING' | 'COMPLETED' | 'CANCELLED';

function statusBadge(status: string) {
  const map: Record<string, string> = {
    CONFIRMED: 'bg-green-100 text-green-700',
    PENDING: 'bg-amber-100 text-amber-700',
    PENDING_PAYMENT: 'bg-yellow-100 text-yellow-800',
    CANCELLED: 'bg-red-100 text-red-700',
    COMPLETED: 'bg-blue-100 text-blue-700',
    SUSPENDED: 'bg-orange-100 text-orange-800',
  };
  return map[status] || 'bg-gray-100 text-gray-700';
}

function statusLabel(status: string) {
  const map: Record<string, string> = {
    CONFIRMED: 'Onaylandı',
    PENDING: 'Beklemede',
    PENDING_PAYMENT: 'Ödeme Bekliyor',
    CANCELLED: 'İptal',
    COMPLETED: 'Tamamlandı',
    SUSPENDED: 'Askıda',
  };
  return map[status] || status;
}

export default function PartnerReservationsPage() {
  const { accessToken } = useAuth();
  const [rows, setRows] = useState<PartnerReservation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');

  async function reload() {
    if (!accessToken) return;
    setRows(await listPartnerReservations(accessToken));
  }

  useEffect(() => {
    if (!accessToken) return;
    void reload()
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  async function handleStatus(
    id: string,
    status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED',
  ) {
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

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return rows;
    if (statusFilter === 'PENDING') {
      return rows.filter(
        (r) => r.status === 'PENDING' || r.status === 'PENDING_PAYMENT',
      );
    }
    return rows.filter((r) => r.status === statusFilter);
  }, [rows, statusFilter]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rezervasyonlar</h1>
          <p className="mt-1 text-sm text-gray-600">
            Sadece kendi ürünlerinize ait kayıtları yönetin.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void reload()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4" />
          Yenile
        </button>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ['all', 'Tümü'],
              ['CONFIRMED', 'Onaylı'],
              ['PENDING', 'Bekleyen'],
              ['COMPLETED', 'Tamamlanan'],
              ['CANCELLED', 'İptal'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setStatusFilter(key)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                statusFilter === key
                  ? 'border-blue-200 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
      ) : null}

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
          <Calendar className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-3 text-lg font-semibold text-gray-700">
            Rezervasyon bulunamadı
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((row) => (
            <div
              key={row.id}
              className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-gray-900">
                      {row.bookingNumber}
                    </p>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge(row.status)}`}
                    >
                      {statusLabel(row.status)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {row.contactEmail}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      {row.adults + row.children} kişi
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {new Date(row.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {Number(row.totalAmount).toLocaleString('tr-TR')}{' '}
                      {row.currency}
                    </span>
                  </div>
                </div>
                <select
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  disabled={busyId === row.id}
                  defaultValue=""
                  onChange={(e) => {
                    const v = e.target.value as
                      'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | '';
                    if (v) void handleStatus(row.id, v);
                    e.target.value = '';
                  }}
                >
                  <option value="">Durum güncelle</option>
                  <option value="CONFIRMED">Onayla</option>
                  <option value="COMPLETED">Tamamla</option>
                  <option value="CANCELLED">İptal et</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
