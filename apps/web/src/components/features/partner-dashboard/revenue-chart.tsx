'use client';

import { useMemo, useState } from 'react';

export type RevenueTimeRange = 'week' | 'month' | 'year';

export type RevenueChartData = Record<
  RevenueTimeRange,
  Array<{ label: string; revenue: number }>
>;

interface RevenueChartProps {
  data: RevenueChartData;
}

const RANGE_LABELS: Record<RevenueTimeRange, string> = {
  week: 'Hafta',
  month: 'Ay',
  year: 'Yıl',
};

/** Legacy RevenueChart görünümü — chart.js olmadan CSS bar (Nest veri). */
export function RevenueChart({ data }: RevenueChartProps) {
  const [timeRange, setTimeRange] = useState<RevenueTimeRange>('month');
  const points = data[timeRange] ?? [];
  const max = useMemo(
    () => Math.max(1, ...points.map((p) => p.revenue)),
    [points],
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 h-full">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-gray-900">Gelir Grafiği</h3>
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
          {(Object.keys(RANGE_LABELS) as RevenueTimeRange[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTimeRange(key)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                timeRange === key
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {RANGE_LABELS[key]}
            </button>
          ))}
        </div>
      </div>
      {points.length === 0 ? (
        <p className="text-sm text-gray-500">Gelir verisi henüz yok.</p>
      ) : (
        <div className="flex h-56 items-end gap-2">
          {points.map((point) => (
            <div
              key={point.label}
              className="flex flex-1 flex-col items-center justify-end gap-2"
            >
              <div
                className="w-full rounded-t-md bg-blue-500/80 transition-all"
                style={{
                  height: `${(point.revenue / max) * 100}%`,
                  minHeight: 4,
                }}
                title={`${point.revenue.toLocaleString('tr-TR')}₺`}
              />
              <span className="truncate text-[10px] text-gray-500">
                {point.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RevenueChart;
