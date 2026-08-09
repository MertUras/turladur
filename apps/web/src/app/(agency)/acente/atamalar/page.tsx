'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';

import { ACENTE_ROUTES } from '@/lib/panel-routes';
import { useAuth } from '@/providers/auth-provider';
import { ApiError } from '@/services/api-client';
import {
  cancelTourDateAssignment,
  listAgencyAssignments,
  withdrawTourDateAssignment,
  type TourDateAssignmentRow,
} from '@/services/tour-date-assignment';

type FilterStatus = 'all' | 'PENDING' | 'ACCEPTED' | 'REJECTED';
type FilterRole = 'all' | 'GUIDE' | 'BUS';

function toDay(iso: string): string {
  return iso.slice(0, 10);
}

function formatRange(start: string, end: string): string {
  const from = toDay(start);
  const to = toDay(end);
  return from === to ? from : `${from} → ${to}`;
}

function statusLabel(status: string): string {
  if (status === 'PENDING') return 'Beklemede';
  if (status === 'ACCEPTED') return 'Kabul edildi';
  if (status === 'REJECTED') return 'Reddedildi';
  return status;
}

function statusClass(status: string): string {
  if (status === 'PENDING')
    return 'bg-amber-50 text-amber-800 border-amber-200';
  if (status === 'ACCEPTED')
    return 'bg-green-50 text-green-800 border-green-200';
  if (status === 'REJECTED') return 'bg-red-50 text-red-700 border-red-200';
  return 'bg-gray-50 text-gray-700 border-gray-200';
}

function roleLabel(role: string): string {
  if (role === 'GUIDE') return 'Rehber';
  if (role === 'BUS') return 'Otobüs';
  return role;
}

function assigneeLabel(row: TourDateAssignmentRow): string {
  if (row.role === 'GUIDE') {
    const guide = row.guide;
    if (!guide) return row.guideId ?? 'Rehber';
    return `${guide.firstName} ${guide.lastName}`.trim() || guide.email;
  }
  return row.busCompany?.companyName ?? row.busCompanyId ?? 'Otobüs firması';
}

export default function AgencyAssignmentsPage() {
  const { accessToken } = useAuth();
  const [rows, setRows] = useState<TourDateAssignmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [roleFilter, setRoleFilter] = useState<FilterRole>('all');

  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const data = await listAgencyAssignments(accessToken);
      setRows(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Atamalar yüklenemedi');
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      if (statusFilter !== 'all' && row.status !== statusFilter) return false;
      if (roleFilter !== 'all' && row.role !== roleFilter) return false;
      return true;
    });
  }, [rows, statusFilter, roleFilter]);

  async function handleWithdraw(assignmentId: string) {
    if (!accessToken) return;
    setBusyId(assignmentId);
    setError(null);
    setMessage(null);
    try {
      await withdrawTourDateAssignment(accessToken, assignmentId);
      setMessage('Davet geri çekildi');
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Geri çekme başarısız');
    } finally {
      setBusyId(null);
    }
  }

  async function handleCancel(assignmentId: string) {
    if (!accessToken) return;
    setBusyId(assignmentId);
    setError(null);
    setMessage(null);
    try {
      await cancelTourDateAssignment(accessToken, assignmentId);
      setMessage('Atama iptal edildi');
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'İptal başarısız');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Atamalar</h1>
          <p className="mt-1 text-sm text-gray-600">
            Rehber ve otobüs davetlerini tüm seferler için buradan takip edin.
            Yeni davet tur detayındaki sefer panelinden gönderilir.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
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
              ['PENDING', 'Bekleyen'],
              ['ACCEPTED', 'Kabul'],
              ['REJECTED', 'Red'],
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
          <span className="mx-1 hidden h-6 w-px bg-gray-200 sm:inline-block" />
          {(
            [
              ['all', 'Rol: Tümü'],
              ['GUIDE', 'Rehber'],
              ['BUS', 'Otobüs'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setRoleFilter(key)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                roleFilter === key
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
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          {message}
        </p>
      ) : null}

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-500" />
        </div>
      ) : null}

      {!loading && filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center text-sm text-gray-500">
          Atama bulunamadı. Tur detayından rehber veya otobüs daveti
          gönderebilirsiniz.
        </div>
      ) : null}

      {!loading ? (
        <ul className="space-y-3">
          {filtered.map((row) => {
            const tourId = row.tourDate?.tour.id;
            const tourTitle = row.tourDate?.tour.title ?? 'Tur';
            const range =
              row.tourDate != null
                ? formatRange(row.tourDate.startDate, row.tourDate.endDate)
                : '—';
            return (
              <li
                key={row.id}
                className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-gray-900">{tourTitle}</p>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusClass(row.status)}`}
                      >
                        {statusLabel(row.status)}
                      </span>
                      <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                        {roleLabel(row.role)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-800">
                      {assigneeLabel(row)}
                    </p>
                    <p className="mt-0.5 text-sm text-gray-500">
                      Sefer: {range}
                    </p>
                    {row.note ? (
                      <p className="mt-2 text-xs text-gray-500">{row.note}</p>
                    ) : null}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {tourId ? (
                        <Link
                          href={`${ACENTE_ROUTES.tours}/${tourId}`}
                          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Tur detayı
                        </Link>
                      ) : null}
                      {row.role === 'BUS' &&
                      row.status === 'ACCEPTED' &&
                      tourId &&
                      row.tourDateId ? (
                        <Link
                          href={ACENTE_ROUTES.tourDateSeats(
                            tourId,
                            row.tourDateId,
                          )}
                          className="rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
                        >
                          Koltuk haritası
                        </Link>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    {row.status === 'PENDING' ? (
                      <button
                        type="button"
                        disabled={busyId === row.id}
                        onClick={() => void handleWithdraw(row.id)}
                        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Daveti geri çek
                      </button>
                    ) : null}
                    {row.status === 'ACCEPTED' ? (
                      <button
                        type="button"
                        disabled={busyId === row.id}
                        onClick={() => void handleCancel(row.id)}
                        className="rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                      >
                        Atamayı iptal et
                      </button>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
