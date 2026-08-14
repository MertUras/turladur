'use client';

import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/providers/auth-provider';
import { ApiError } from '@/services/api-client';
import { listBusVehicles, type BusVehicle } from '@/services/availability';
import {
  listBusAssignments,
  respondBusAssignment,
  type TourDateAssignmentRow,
} from '@/services/tour-date-assignment';
import { busLayoutLabel } from '@/lib/bus-layout-kinds';

function toDay(iso: string): string {
  return iso.slice(0, 10);
}

export default function OtobusAtamalarPage() {
  const { accessToken } = useAuth();
  const [rows, setRows] = useState<TourDateAssignmentRow[]>([]);
  const [vehicles, setVehicles] = useState<BusVehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<
    Record<string, string>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const [assignmentRows, vehicleRows] = await Promise.all([
        listBusAssignments(accessToken),
        listBusVehicles(accessToken),
      ]);
      setRows(assignmentRows);
      setVehicles(vehicleRows.filter((vehicle) => vehicle.isActive));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Atamalar yüklenemedi');
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleRespond(
    assignmentId: string,
    status: 'ACCEPTED' | 'REJECTED',
  ) {
    if (!accessToken) return;
    setBusyId(assignmentId);
    setError(null);
    try {
      if (status === 'ACCEPTED') {
        const vehicleId = selectedVehicle[assignmentId];
        if (!vehicleId) {
          setError('Kabul için bir araç seçin.');
          return;
        }
        await respondBusAssignment(accessToken, assignmentId, {
          status,
          vehicleId,
        });
      } else {
        await respondBusAssignment(accessToken, assignmentId, { status });
      }
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Yanıt gönderilemedi');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Atamalar</h2>
        <p className="mt-1 text-sm text-gray-600">
          Acentelerden gelen sefer davetlerini kabul veya reddedin. Kabulde
          plaka seçimi zorunludur.
        </p>
      </div>

      {loading ? <p className="text-sm text-gray-500">Yükleniyor…</p> : null}
      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {!loading && rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500">
          Bekleyen veya kabul edilmiş atama yok.
        </div>
      ) : null}

      <ul className="space-y-3">
        {rows.map((row) => {
          const tourTitle = row.tourDate?.tour.title ?? 'Tur';
          const range =
            row.tourDate != null
              ? `${toDay(row.tourDate.startDate)} → ${toDay(row.tourDate.endDate)}`
              : '';
          return (
            <li
              key={row.id}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <p className="text-sm font-semibold text-gray-900">{tourTitle}</p>
              <p className="text-xs text-gray-500">{range}</p>
              {row.note ? (
                <p className="mt-1 text-xs text-gray-500">{row.note}</p>
              ) : null}
              <p className="mt-2 text-xs font-medium text-gray-600">
                Durum: {row.status}
              </p>

              {row.status === 'PENDING' ? (
                <div className="mt-3 space-y-2">
                  <label className="block text-sm text-gray-700">
                    Kabul için araç
                    <select
                      value={selectedVehicle[row.id] ?? ''}
                      onChange={(event) =>
                        setSelectedVehicle((prev) => ({
                          ...prev,
                          [row.id]: event.target.value,
                        }))
                      }
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Araç seçin…</option>
                      {vehicles.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.plateNumber} ·{' '}
                          {busLayoutLabel(vehicle.seatLayoutKind)} (
                          {vehicle.capacity})
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={busyId === row.id}
                      onClick={() => void handleRespond(row.id, 'ACCEPTED')}
                      className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      Kabul et
                    </button>
                    <button
                      type="button"
                      disabled={busyId === row.id}
                      onClick={() => void handleRespond(row.id, 'REJECTED')}
                      className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Reddet
                    </button>
                  </div>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
