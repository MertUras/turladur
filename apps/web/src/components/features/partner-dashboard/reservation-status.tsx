'use client';

import { BadgeCheck, Clock, XCircle, CheckCircle } from 'lucide-react';

interface ReservationStatusProps {
  reservations: {
    pending: number;
    confirmed: number;
    cancelled: number;
    completed: number;
  };
}

const statusItems = [
  {
    title: 'Onaylanan',
    icon: BadgeCheck,
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    key: 'confirmed' as const,
  },
  {
    title: 'Bekleyen',
    icon: Clock,
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    key: 'pending' as const,
  },
  {
    title: 'İptal Edilen',
    icon: XCircle,
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    key: 'cancelled' as const,
  },
  {
    title: 'Tamamlanan',
    icon: CheckCircle,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    key: 'completed' as const,
  },
];

export function ReservationStatus({ reservations }: ReservationStatusProps) {
  const formattedReservations = statusItems.map((item) => ({
    title: item.title,
    count: reservations[item.key],
    icon: item.icon,
    color: item.color,
    bgColor: item.bgColor,
  }));

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Rezervasyon Durumu
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {formattedReservations.map((item) => (
          <div
            key={item.title}
            className="flex items-center p-3 rounded-lg bg-gray-50"
          >
            <div className={`p-2 rounded-lg ${item.bgColor}`}>
              <item.icon className={`h-5 w-5 ${item.color}`} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{item.title}</p>
              <p className="text-lg font-semibold text-gray-900">
                {item.count}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReservationStatus;
