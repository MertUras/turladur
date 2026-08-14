'use client';

import Link from 'next/link';

import { useAuth } from '@/providers/auth-provider';
import { OTOBUS_ROUTES } from '@/lib/panel-routes';

export default function OtobusDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Merhaba{user?.firstName ? `, ${user.firstName}` : ''}
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Araç listenizi ve müsaitlik takvimini buradan yönetin.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900">Oturum</h3>
        <dl className="mt-3 space-y-2 text-sm text-gray-600">
          <div className="flex justify-between gap-4">
            <dt>E-posta</dt>
            <dd className="font-medium text-gray-900">{user?.email}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Rol</dt>
            <dd className="font-medium text-gray-900">Otobüs firması</dd>
          </div>
        </dl>
      </div>

      <Link
        href={OTOBUS_ROUTES.vehicles}
        className="block rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm font-medium text-blue-700 hover:bg-blue-100"
      >
        Araçlar ve müsaitlik →
      </Link>
    </div>
  );
}
