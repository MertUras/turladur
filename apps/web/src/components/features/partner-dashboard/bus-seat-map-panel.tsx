'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Armchair, RefreshCw } from 'lucide-react';

import {
  BUS_LAYOUT_KINDS,
  busLayoutLabel,
  type BusLayoutKindValue,
} from '@/lib/bus-layout-kinds';
import { useAuth } from '@/providers/auth-provider';
import { ApiError } from '@/services/api-client';
import {
  assignSeatManual,
  autoFifoSeats,
  getTourDateSeatMap,
  setTourDateBusLayout,
  unassignSeat,
  type SeatMapCell,
  type SeatMapData,
  type UnassignedGuest,
} from '@/services/seat-assignment';

type BusSeatMapPanelProps = {
  tourDateId: string;
};

function cellKey(cell: SeatMapCell) {
  return `${cell.row}-${cell.col}-${cell.code}`;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function SeatCellButton({
  cell,
  selectedGuestId,
  busy,
  onSeatClick,
}: {
  cell: SeatMapCell;
  selectedGuestId: string | null;
  busy: boolean;
  onSeatClick: (cell: SeatMapCell) => void;
}) {
  if (cell.type === 'AISLE') {
    return <div className="h-10 w-10" aria-hidden />;
  }

  if (cell.type === 'CREW') {
    return (
      <div
        title="Şoför / mürettebat"
        className="flex h-10 w-10 items-center justify-center rounded border border-amber-300 bg-amber-100 text-[10px] font-semibold text-amber-900"
      >
        ŞOF
      </div>
    );
  }

  if (cell.type === 'DOOR') {
    return (
      <div
        title="Kapı"
        className="flex h-10 w-10 items-center justify-center rounded border border-dashed border-slate-400 bg-slate-100 text-[9px] font-semibold uppercase text-slate-600"
      >
        Kapı
      </div>
    );
  }

  if (cell.type === 'WC' || cell.type === 'BLOCKED' || !cell.sellable) {
    return (
      <div
        title={cell.type}
        className="flex h-10 w-10 items-center justify-center rounded border border-gray-200 bg-gray-100 text-[10px] text-gray-400"
      >
        —
      </div>
    );
  }

  const occupied = cell.occupancy;
  if (occupied) {
    return (
      <button
        type="button"
        disabled={busy}
        title={`${occupied.fullName} · ${occupied.bookingNumber} (kaldırmak için tıkla)`}
        onClick={() => onSeatClick(cell)}
        className="flex h-10 w-10 flex-col items-center justify-center rounded border border-red-300 bg-red-50 text-[10px] font-semibold text-red-800 hover:bg-red-100 disabled:opacity-60"
      >
        <span>{cell.code}</span>
        <span className="leading-none">{initials(occupied.fullName)}</span>
      </button>
    );
  }

  const canAssign = Boolean(selectedGuestId);
  return (
    <button
      type="button"
      disabled={busy || !canAssign}
      title={
        canAssign ? `Koltuk ${cell.code} ata` : 'Önce soldan bir misafir seçin'
      }
      onClick={() => onSeatClick(cell)}
      className={`flex h-10 w-10 items-center justify-center rounded border text-xs font-semibold disabled:opacity-50 ${
        canAssign
          ? 'border-blue-300 bg-blue-50 text-blue-800 hover:bg-blue-100'
          : 'border-gray-200 bg-white text-gray-700'
      }`}
    >
      {cell.code}
    </button>
  );
}

export function BusSeatMapPanel({ tourDateId }: BusSeatMapPanelProps) {
  const { accessToken } = useAuth();
  const [map, setMap] = useState<SeatMapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);
  const [layoutKind, setLayoutKind] = useState<BusLayoutKindValue | ''>('');
  const [needsLayout, setNeedsLayout] = useState(false);

  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    setNeedsLayout(false);
    try {
      const data = await getTourDateSeatMap(tourDateId, accessToken);
      setMap(data);
      setSelectedGuestId((prev) => {
        if (!prev) return null;
        return data.unassignedGuests.some((guest) => guest.id === prev)
          ? prev
          : null;
      });
    } catch (err) {
      setMap(null);
      if (err instanceof ApiError && err.code === 'LAYOUT_REQUIRED') {
        setNeedsLayout(true);
        setError(null);
      } else {
        setError(
          err instanceof Error ? err.message : 'Koltuk haritası yüklenemedi',
        );
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, tourDateId]);

  useEffect(() => {
    void load();
  }, [load]);

  const grid = useMemo(() => {
    const cells = map?.layout.cells ?? [];
    const maxRow = cells.reduce((max, cell) => Math.max(max, cell.row), 0);
    const maxCol = cells.reduce((max, cell) => Math.max(max, cell.col), 0);
    const byPos = new Map(
      cells.map((cell) => [`${cell.row}:${cell.col}`, cell]),
    );
    const rows: Array<Array<SeatMapCell | null>> = [];
    for (let row = 0; row <= maxRow; row += 1) {
      const line: Array<SeatMapCell | null> = [];
      for (let col = 0; col <= maxCol; col += 1) {
        line.push(byPos.get(`${row}:${col}`) ?? null);
      }
      rows.push(line);
    }
    return rows;
  }, [map]);

  async function handleBindLayout() {
    if (!accessToken || !layoutKind) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await setTourDateBusLayout(tourDateId, layoutKind, accessToken);
      setMessage('Oturma planı bağlandı');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Plan bağlanamadı');
    } finally {
      setBusy(false);
    }
  }

  async function handleSeatClick(cell: SeatMapCell) {
    if (!accessToken) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      if (cell.occupancy) {
        await unassignSeat(cell.occupancy.assignmentId, accessToken);
        setMessage(`Koltuk ${cell.code} boşaltıldı`);
      } else if (selectedGuestId) {
        await assignSeatManual(
          tourDateId,
          { seatCode: cell.code, reservationGuestId: selectedGuestId },
          accessToken,
        );
        setMessage(`Koltuk ${cell.code} atandı`);
        setSelectedGuestId(null);
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'İşlem başarısız');
    } finally {
      setBusy(false);
    }
  }

  async function handleAutoFifo() {
    if (!accessToken) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await autoFifoSeats(tourDateId, accessToken);
      setMessage('Boş koltuklar AUTO_FIFO ile dolduruldu');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Otomatik atama başarısız');
    } finally {
      setBusy(false);
    }
  }

  const guests: UnassignedGuest[] = map?.unassignedGuests ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Koltuk haritası
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Onaylı misafirleri seçip boş koltuğa tıklayın. Şoför ve kapılar
            satılmaz.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading || busy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
        >
          <RefreshCw className="h-4 w-4" />
          Yenile
        </button>
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

      {needsLayout ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-900">
            Bu sefer için oturma planı henüz seçilmedi.
          </p>
          <p className="mt-1 text-xs text-amber-800">
            Otobüs kabulünde plan otomatik bağlanır; yoksa kind seçerek
            bağlayabilirsiniz.
          </p>
          <div className="mt-3 flex flex-wrap items-end gap-2">
            <label className="block text-sm text-gray-700">
              Araç tipi
              <select
                value={layoutKind}
                onChange={(event) =>
                  setLayoutKind(event.target.value as BusLayoutKindValue | '')
                }
                className="mt-1 block w-48 rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">Seçin…</option>
                {BUS_LAYOUT_KINDS.map((row) => (
                  <option key={row.kind} value={row.kind}>
                    {row.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              disabled={!layoutKind || busy}
              onClick={() => void handleBindLayout()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Planı bağla
            </button>
          </div>
        </div>
      ) : null}

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-500" />
        </div>
      ) : null}

      {!loading && map ? (
        <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Atanmamış misafirler
            </p>
            {guests.length === 0 ? (
              <p className="mt-3 text-sm text-gray-500">
                Tüm onaylı misafirlere koltuk atanmış.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {guests.map((guest) => {
                  const active = guest.id === selectedGuestId;
                  return (
                    <li key={guest.id}>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedGuestId(active ? null : guest.id)
                        }
                        className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${
                          active
                            ? 'border-blue-300 bg-blue-50 text-blue-900'
                            : 'border-gray-200 bg-white text-gray-800 hover:bg-gray-50'
                        }`}
                      >
                        <span className="font-medium">{guest.fullName}</span>
                        <span className="mt-0.5 block text-xs text-gray-500">
                          {guest.bookingNumber}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
            <button
              type="button"
              disabled={busy || guests.length === 0}
              onClick={() => void handleAutoFifo()}
              className="mt-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              AUTO_FIFO doldur
            </button>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-800">
                <Armchair className="h-4 w-4 text-gray-500" />
                {busLayoutLabel(map.layout.kind)} · {map.layout.passengerSeats}{' '}
                yolcu
              </p>
              <div className="flex flex-wrap gap-2 text-[11px] text-gray-600">
                <span className="inline-flex items-center gap-1">
                  <span className="h-3 w-3 rounded border border-blue-300 bg-blue-50" />{' '}
                  Boş
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-3 w-3 rounded border border-red-300 bg-red-50" />{' '}
                  Dolu
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-3 w-3 rounded border border-amber-300 bg-amber-100" />{' '}
                  Şoför
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-3 w-3 rounded border border-dashed border-slate-400 bg-slate-100" />{' '}
                  Kapı
                </span>
              </div>
            </div>

            <div className="mb-2 rounded-md bg-slate-800 px-3 py-1.5 text-center text-xs font-semibold tracking-wide text-white">
              ÖN · ŞOFÖR SOL · 1. KAPİ SAĞ
            </div>

            <div className="overflow-x-auto">
              <div className="inline-flex flex-col gap-1.5">
                {grid.map((line, rowIndex) => (
                  <div key={`row-${rowIndex}`} className="flex gap-1.5">
                    {line.map((cell, colIndex) =>
                      cell ? (
                        <SeatCellButton
                          key={cellKey(cell)}
                          cell={cell}
                          selectedGuestId={selectedGuestId}
                          busy={busy}
                          onSeatClick={(clicked) =>
                            void handleSeatClick(clicked)
                          }
                        />
                      ) : (
                        <div
                          key={`empty-${rowIndex}-${colIndex}`}
                          className="h-10 w-10"
                          aria-hidden
                        />
                      ),
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
