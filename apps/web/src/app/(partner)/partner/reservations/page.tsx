'use client';

import { useEffect, useMemo, useState } from 'react';
import { Calendar, FileDown, RefreshCw, Users } from 'lucide-react';

import { downloadVoucherHtml, getReservationVoucher } from '@/services/booking';
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
    PAYMENT_FAILED: 'bg-red-100 text-red-700',
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
    PAYMENT_FAILED: 'Ödeme başarısız',
  };
  return map[status] || status;
}

function paymentLabel(paymentStatus?: string, bookingStatus?: string) {
  if (
    paymentStatus === 'PAID' ||
    bookingStatus === 'CONFIRMED' ||
    bookingStatus === 'COMPLETED'
  ) {
    return 'Ödendi';
  }
  if (paymentStatus === 'REFUNDED') return 'İade';
  if (paymentStatus === 'PARTIALLY_PAID') return 'Kısmi';
  return 'Ödenmedi';
}

export default function PartnerReservationsPage() {
  const { accessToken } = useAuth();
  const [rows, setRows] = useState<PartnerReservation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [seatDrafts, setSeatDrafts] = useState<Record<string, string>>({});

  async function reload() {
    if (!accessToken) return;
    const data = await listPartnerReservations(accessToken);
    setRows(data);
    setSeatDrafts(
      Object.fromEntries(data.map((row) => [row.id, row.seatNumbers ?? ''])),
    );
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
    const seats = (seatDrafts[id] ?? '').trim();
    if (status === 'CONFIRMED' && !seats) {
      setError('Onaylamadan önce koltuk numarası girmelisiniz');
      return;
    }
    setBusyId(id);
    setError(null);
    try {
      await updatePartnerReservation(
        id,
        status === 'CONFIRMED' ? { status, seatNumbers: seats } : { status },
        accessToken,
      );
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Güncelleme başarısız');
    } finally {
      setBusyId(null);
    }
  }

  async function handleSaveSeats(id: string) {
    if (!accessToken) return;
    setBusyId(id);
    setError(null);
    try {
      await updatePartnerReservation(
        id,
        { seatNumbers: seatDrafts[id] ?? '' },
        accessToken,
      );
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Koltuk kaydı başarısız');
    } finally {
      setBusyId(null);
    }
  }

  async function handleVoucher(id: string, bookingNumber: string) {
    if (!accessToken) return;
    setBusyId(id);
    setError(null);
    try {
      const voucher = await getReservationVoucher(id, accessToken);
      downloadVoucherHtml(bookingNumber, voucher.html);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Voucher alınamadı');
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
            Sadece kendi ürünlerinize ait kayıtları yönetin. Koltuk atamasını
            buradan yapın.
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
          {filtered.map((row) => {
            const needsConfirm =
              row.status === 'PENDING' ||
              row.status === 'PENDING_PAYMENT' ||
              row.status === 'PAYMENT_FAILED';
            return (
              <div
                key={row.id}
                className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-gray-900">
                        {row.bookingNumber}
                      </p>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge(row.status)}`}
                      >
                        {statusLabel(row.status)}
                      </span>
                      <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-700">
                        {paymentLabel(row.paymentStatus, row.status)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-gray-800">
                      {row.tourTitle ?? 'Tur / deneyim'}
                    </p>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {row.customerName ?? row.contactEmail}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        {row.guestCount ?? row.adults + row.children} kişi
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {row.startDate
                          ? new Date(row.startDate).toLocaleDateString('tr-TR')
                          : new Date(row.createdAt).toLocaleDateString('tr-TR')}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {Number(row.totalAmount).toLocaleString('tr-TR')}{' '}
                        {row.currency}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-end gap-2">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">
                          Koltuk no{' '}
                          <span className="text-red-500" aria-hidden>
                            *
                          </span>
                          <span className="sr-only">(zorunlu)</span>
                        </label>
                        <input
                          value={seatDrafts[row.id] ?? ''}
                          onChange={(e) =>
                            setSeatDrafts((prev) => ({
                              ...prev,
                              [row.id]: e.target.value,
                            }))
                          }
                          placeholder="örn. 14, 15"
                          required
                          aria-required="true"
                          className="h-9 w-40 rounded-lg border border-gray-300 px-2 text-sm"
                        />
                        {needsConfirm && !(seatDrafts[row.id] ?? '').trim() ? (
                          <p className="mt-1 text-[11px] text-amber-700">
                            Onay için koltuk numarası zorunlu
                          </p>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        disabled={busyId === row.id}
                        onClick={() => void handleSaveSeats(row.id)}
                        className="h-9 rounded-lg border border-gray-300 px-3 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                      >
                        Koltuk kaydet
                      </button>
                      <button
                        type="button"
                        disabled={busyId === row.id}
                        onClick={() =>
                          void handleVoucher(row.id, row.bookingNumber)
                        }
                        className="inline-flex h-9 items-center gap-1 rounded-lg border border-gray-300 px-3 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                      >
                        <FileDown className="h-3.5 w-3.5" />
                        Voucher
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:items-end">
                    {needsConfirm ? (
                      <button
                        type="button"
                        disabled={
                          busyId === row.id ||
                          !(seatDrafts[row.id] ?? '').trim()
                        }
                        onClick={() => void handleStatus(row.id, 'CONFIRMED')}
                        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                        title={
                          !(seatDrafts[row.id] ?? '').trim()
                            ? 'Önce koltuk numarası girin'
                            : 'Rezervasyonu onayla'
                        }
                      >
                        Onayla
                      </button>
                    ) : null}
                    <select
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:opacity-50"
                      disabled={busyId === row.id}
                      defaultValue=""
                      onChange={(e) => {
                        const v = e.target.value as
                          'CANCELLED' | 'COMPLETED' | '';
                        if (v) void handleStatus(row.id, v);
                        e.target.value = '';
                      }}
                    >
                      <option value="">Diğer işlemler</option>
                      {row.status === 'CONFIRMED' ? (
                        <option value="COMPLETED">Tamamla</option>
                      ) : null}
                      {row.status !== 'CANCELLED' &&
                      row.status !== 'COMPLETED' ? (
                        <option value="CANCELLED">İptal et</option>
                      ) : null}
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
