'use client';

import { useEffect, useState } from 'react';
import { Wallet } from 'lucide-react';

import { getPartnerFinancials } from '@/services/partner-admin';
import { useAuth } from '@/providers/auth-provider';

export default function PartnerFinancialsPage() {
  const { accessToken } = useAuth();
  const [data, setData] = useState<{
    currency: string;
    total: string;
    months: Array<{ month: string; total: string }>;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    void getPartnerFinancials(accessToken)
      .then(setData)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [accessToken]);

  const max = Math.max(1, ...(data?.months.map((m) => Number(m.total)) ?? [1]));

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Finansal Durum</h1>
        <p className="mt-1 text-sm text-gray-600">
          Son 12 ay onaylı/tamamlanmış rezervasyon geliri.
        </p>
      </div>

      {error ? (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
      ) : null}

      {data ? (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Toplam Gelir
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {Number(data.total).toLocaleString('tr-TR')} {data.currency}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">12 aylık toplam</p>
                </div>
                <div className="rounded-lg bg-amber-50 p-3 text-amber-700">
                  <Wallet className="h-6 w-6" />
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-600">
                Aktif Ay Sayısı
              </p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {data.months.filter((m) => Number(m.total) > 0).length}
              </p>
              <p className="mt-2 text-sm text-gray-500">Gelir üretilen aylar</p>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Aylık Gelir Dağılımı
            </h3>
            <div className="space-y-3">
              {data.months.map((m) => {
                const value = Number(m.total);
                const width = `${Math.round((value / max) * 100)}%`;
                return (
                  <div key={m.month}>
                    <div className="mb-1 flex justify-between text-xs text-gray-600">
                      <span>{m.month}</span>
                      <span>
                        {value.toLocaleString('tr-TR')} {data.currency}
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{ width }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
