'use client';

import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { RevenueChartData, RevenueTimeRange } from '@/lib/partner/dashboard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: true,
        color: 'rgba(0, 0, 0, 0.1)',
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
  elements: {
    line: {
      tension: 0.4,
    },
  },
};

interface RevenueChartProps {
  data: RevenueChartData;
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const [timeRange, setTimeRange] = useState<RevenueTimeRange>('month');
  const points = data[timeRange];

  const chartData = {
    labels: points.map((p) => p.label),
    datasets: [
      {
        label: 'Gelir',
        data: points.map((p) => p.revenue),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Gelir Grafiği</h3>
        <div className="flex space-x-2">
          {(['week', 'month', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-sm rounded-md ${
                timeRange === range
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {range === 'week' ? 'Hafta' : range === 'month' ? 'Ay' : 'Yıl'}
            </button>
          ))}
        </div>
      </div>
      <div className="h-[300px]">
        {points.some((p) => p.revenue > 0) ? (
          <Line options={options} data={chartData} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 text-sm">
            Seçili dönemde gelir verisi bulunmuyor
          </div>
        )}
      </div>
    </div>
  );
}
