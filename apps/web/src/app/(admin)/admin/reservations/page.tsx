'use client';

import { useEffect, useState } from 'react';
import { FileDown, RefreshCw } from 'lucide-react';

import { downloadVoucherHtml, getReservationVoucher } from '@/services/booking';
import {
  listAdminReservations,
  type AdminReservationRow,
} from '@/services/partner-admin';
import { useAuth } from '@/providers/auth-provider';

function formatMoney(amount: string, currency: string) {
  return `${Number(amount).toLocaleString('tr-TR')} ${currency}`;
}

export default function AdminReservationsPage() {
  const { accessToken } = useAuth();
  const [rows, setRows] = useState<AdminReservationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function reload() {
    if (!accessToken) return;
    setRows(await listAdminReservations(accessToken));
  }

  useEffect(() => {
    if (!accessToken) return;
    void reload()
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  async function handleVoucher(row: AdminReservationRow) {
    if (!accessToken) return;
    setBusyId(row.id);
    setError(null);
    try {
      const voucher = await getReservationVoucher(row.id, accessToken);
      downloadVoucherHtml(row.bookingNumber, voucher.html);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Voucher alınamadı');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Rezervasyonlar
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Platform geneli rezervasyon listesi (Super Admin).
          </p>
        </div>
        <button
          type="button"
          onClick={() => void reload().catch((e: Error) => setError(e.message))}
          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
        >
          <RefreshCw className="h-4 w-4" />
          Yenile
        </button>
      </div>

      {error ? (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
      ) : null}

      {loading ? (
        <p className="text-sm text-neutral-500">Yükleniyor…</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium">PNR</th>
                <th className="px-4 py-3 font-medium">Müşteri</th>
                <th className="px-4 py-3 font-medium">Tur</th>
                <th className="px-4 py-3 font-medium">Partner</th>
                <th className="px-4 py-3 font-medium">Tarih</th>
                <th className="px-4 py-3 font-medium">Tutar</th>
                <th className="px-4 py-3 font-medium">Ödeme</th>
                <th className="px-4 py-3 font-medium">Yolcu</th>
                <th className="px-4 py-3 font-medium">Durum</th>
                <th className="px-4 py-3 font-medium">Voucher</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-4 py-10 text-center text-neutral-500"
                  >
                    Rezervasyon yok
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-neutral-100 last:border-0"
                  >
                    <td className="px-4 py-3 font-mono text-xs font-semibold">
                      {row.bookingNumber}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-neutral-900">
                        {row.customerName}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {row.contactEmail}
                      </div>
                    </td>
                    <td className="px-4 py-3">{row.tourTitle ?? '—'}</td>
                    <td className="px-4 py-3">{row.partnerName ?? '—'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {row.startDate
                        ? new Date(row.startDate).toLocaleDateString('tr-TR')
                        : new Date(row.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium">
                      {formatMoney(row.totalAmount, row.currency)}
                    </td>
                    <td className="px-4 py-3">{row.paymentStatus}</td>
                    <td className="px-4 py-3">{row.guestCount}</td>
                    <td className="px-4 py-3">{row.status}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        disabled={busyId === row.id}
                        onClick={() => void handleVoucher(row)}
                        className="inline-flex items-center gap-1 rounded-md border border-neutral-200 px-2 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
                      >
                        <FileDown className="h-3.5 w-3.5" />
                        İndir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
