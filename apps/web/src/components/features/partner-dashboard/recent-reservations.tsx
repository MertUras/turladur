'use client';

import { Calendar, Clock } from 'lucide-react';
import Link from 'next/link';

interface Reservation {
  id: string;
  customerName: string;
  customerEmail: string;
  customerInitials: string;
  activity: string;
  activityType: string;
  date: string;
  time: string;
  amount: string;
  status:
    | 'Onaylandı'
    | 'Beklemede'
    | 'İptal Edildi'
    | 'Tamamlandı'
    | 'Ödeme Bekliyor'
    | 'Askıya Alındı';
}

interface RecentReservationsProps {
  reservations: Reservation[];
}

const statusColors: Record<Reservation['status'], string> = {
  Onaylandı: 'bg-green-100 text-green-700',
  Beklemede: 'bg-amber-100 text-amber-700',
  'İptal Edildi': 'bg-red-100 text-red-700',
  Tamamlandı: 'bg-blue-100 text-blue-700',
  'Ödeme Bekliyor': 'bg-yellow-100 text-yellow-800',
  'Askıya Alındı': 'bg-orange-100 text-orange-800',
};

export function RecentReservations({ reservations }: RecentReservationsProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Son Rezervasyonlar
          </h3>
          <Link
            href="/acente/reservations"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Tümünü Gör
          </Link>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {reservations.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">
            Henüz rezervasyon bulunmuyor.
          </div>
        ) : (
          reservations.map((reservation) => (
            <div key={reservation.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                    {reservation.customerInitials}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      {reservation.customerName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {reservation.customerEmail}
                    </p>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[reservation.status]}`}
                >
                  {reservation.status}
                </div>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900">
                  {reservation.activity}
                </h4>
                <p className="text-sm text-gray-500">
                  {reservation.activityType}
                </p>
              </div>
              <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {reservation.date}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {reservation.time}
                </div>
                <div className="font-medium text-gray-900">
                  {reservation.amount}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RecentReservations;
