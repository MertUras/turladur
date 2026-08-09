'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { UserRound } from 'lucide-react';

import { useAuth } from '@/providers/auth-provider';
import { ApiError } from '@/services/api-client';
import {
  cancelTourDateAssignment,
  inviteGuideToTourDate,
  listAgencyGuides,
  listTourDateAssignments,
  withdrawTourDateAssignment,
  type AgencyGuideCandidate,
  type TourDateAssignmentRow,
} from '@/services/tour-date-assignment';

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

type Sefer = {
  id: string;
  startDate: string;
  endDate: string;
};

type TourDateGuideAssignmentPanelProps = {
  tourDates: Sefer[];
};

export function TourDateGuideAssignmentPanel({
  tourDates,
}: TourDateGuideAssignmentPanelProps) {
  const { accessToken } = useAuth();
  const [selectedId, setSelectedId] = useState<string | null>(
    tourDates[0]?.id ?? null,
  );
  const selected = useMemo(
    () => tourDates.find((row) => row.id === selectedId) ?? null,
    [tourDates, selectedId],
  );

  const [assignments, setAssignments] = useState<TourDateAssignmentRow[]>([]);
  const [guides, setGuides] = useState<AgencyGuideCandidate[]>([]);
  const [search, setSearch] = useState('');
  const [availableOnly, setAvailableOnly] = useState(true);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedId && tourDates[0]) {
      setSelectedId(tourDates[0].id);
    }
  }, [tourDates, selectedId]);

  const load = useCallback(async () => {
    if (!accessToken || !selected) return;
    setLoading(true);
    setError(null);
    try {
      const from = toDay(selected.startDate);
      const to = toDay(selected.endDate);
      const [assignmentRows, guideRows] = await Promise.all([
        listTourDateAssignments(accessToken, selected.id),
        listAgencyGuides(accessToken, {
          from,
          to,
          q: search || undefined,
          availableOnly,
        }),
      ]);
      setAssignments(assignmentRows.filter((row) => row.role === 'GUIDE'));
      setGuides(guideRows);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Rehber / atama verisi yüklenemedi',
      );
    } finally {
      setLoading(false);
    }
  }, [accessToken, selected, search, availableOnly]);

  useEffect(() => {
    void load();
  }, [load]);

  const activeGuide = assignments.find(
    (row) => row.status === 'PENDING' || row.status === 'ACCEPTED',
  );

  async function handleInvite(guideId: string) {
    if (!accessToken || !selected) return;
    setBusyId(guideId);
    setError(null);
    setMessage(null);
    try {
      await inviteGuideToTourDate(accessToken, selected.id, { guideId });
      setMessage('Rehber daveti gönderildi (PENDING).');
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Davet gönderilemedi');
    } finally {
      setBusyId(null);
    }
  }

  async function handleWithdraw(assignmentId: string) {
    if (!accessToken) return;
    setBusyId(assignmentId);
    setError(null);
    setMessage(null);
    try {
      await withdrawTourDateAssignment(accessToken, assignmentId);
      setMessage('Davet geri çekildi.');
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Davet geri çekilemedi');
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
      setMessage('Atama iptal edildi; müsaitlik yeniden açıldı.');
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Atama iptal edilemedi');
    } finally {
      setBusyId(null);
    }
  }

  if (tourDates.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500">
        Rehber görevlendirmek için önce tur seferi (tarih) ekleyin.
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          Sefer bazlı rehber görevlendirme
        </h3>
        <p className="mt-1 text-sm text-gray-600">
          Her sefer için farklı rehber davet edebilirsiniz. Davet PENDING kalır;
          rehber kabul edince sefere yazılır ve müsaitlik kapanır.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tourDates.map((sefer, index) => {
          const active = sefer.id === selectedId;
          return (
            <button
              key={sefer.id}
              type="button"
              onClick={() => setSelectedId(sefer.id)}
              className={
                active
                  ? 'rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700'
                  : 'rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50'
              }
            >
              Sefer {index + 1}: {formatRange(sefer.startDate, sefer.endDate)}
            </button>
          );
        })}
      </div>

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          {message}
        </p>
      ) : null}

      {activeGuide ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Aktif atama
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {activeGuide.guide
                  ? `${activeGuide.guide.firstName} ${activeGuide.guide.lastName}`
                  : activeGuide.guideId}
              </p>
              <p className="text-xs text-gray-500">
                {activeGuide.guide?.email}
                {activeGuide.guide?.city ? ` · ${activeGuide.guide.city}` : ''}
              </p>
              <span
                className={`mt-2 inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${statusClass(activeGuide.status)}`}
              >
                {statusLabel(activeGuide.status)}
              </span>
            </div>
            <div className="flex gap-2">
              {activeGuide.status === 'PENDING' ? (
                <button
                  type="button"
                  disabled={busyId === activeGuide.id}
                  onClick={() => void handleWithdraw(activeGuide.id)}
                  className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Daveti geri çek
                </button>
              ) : null}
              {activeGuide.status === 'ACCEPTED' ? (
                <button
                  type="button"
                  disabled={busyId === activeGuide.id}
                  onClick={() => void handleCancel(activeGuide.id)}
                  className="rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                >
                  Atamayı iptal et
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rehber ara (ad, e-posta, şehir)"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <label className="flex shrink-0 items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(event) => setAvailableOnly(event.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Sadece müsait
            </label>
          </div>

          {loading ? (
            <p className="text-sm text-gray-500">Yükleniyor…</p>
          ) : null}

          {!loading && guides.length === 0 ? (
            <p className="rounded-md border border-dashed border-gray-300 px-3 py-4 text-sm text-gray-500">
              Bu sefer aralığında uygun rehber bulunamadı.
            </p>
          ) : null}

          <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200">
            {guides.map((guide) => (
              <li
                key={guide.id}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                    <UserRound className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {guide.firstName} {guide.lastName}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      TCKN: {guide.identityNumber}
                      {guide.city ? ` · ${guide.city}` : ''}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-gray-500">
                      {guide.languages.join(', ') || 'Dil yok'}
                      {guide.oda ? ` · Oda: ${guide.oda}` : ''}
                      {guide.sicilNo ? ` · Sicil: ${guide.sicilNo}` : ''}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-gray-500">
                      {guide.ruhsatNo ? `Ruhsat: ${guide.ruhsatNo}` : ''}
                      {guide.ruhsatExpiresAt
                        ? ` · Geçerlilik: ${guide.ruhsatExpiresAt}`
                        : ''}
                      {guide.isRuhsatExpired ? ' · süresi dolmuş' : ''}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {guide.isAvailableForRange
                        ? 'Sefer aralığında müsait'
                        : `${guide.unavailableDayCount} gün uygun değil`}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={
                    !guide.isAvailableForRange ||
                    guide.isRuhsatExpired ||
                    busyId === guide.id ||
                    loading
                  }
                  onClick={() => void handleInvite(guide.id)}
                  className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Davet et
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
