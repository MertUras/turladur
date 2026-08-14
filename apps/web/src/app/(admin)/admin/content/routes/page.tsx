'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { listAdminRouteDefinitions } from '@/services/partner-admin';
import { listRoutePageOverlays } from '@/services/content';
import { useAuth } from '@/providers/auth-provider';

type RouteDefinition = {
  id: string;
  name: string;
  description: string;
};

export default function AdminRoutesContentPage() {
  const { accessToken } = useAuth();
  const [routes, setRoutes] = useState<RouteDefinition[]>([]);
  const [overlayKeys, setOverlayKeys] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    setLoading(true);
    setError(null);

    void Promise.all([
      listAdminRouteDefinitions(accessToken),
      listRoutePageOverlays().catch(() => []),
    ])
      .then(([definitions, overlays]) => {
        setRoutes(definitions);
        setOverlayKeys(
          new Set(
            overlays.filter((overlay) => overlay.exists).map((o) => o.routeKey),
          ),
        );
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [accessToken]);

  const sortedRoutes = useMemo(
    () => [...routes].sort((a, b) => a.name.localeCompare(b.name, 'tr')),
    [routes],
  );

  return (
    <div>
      <h2 className="text-lg font-semibold text-neutral-900">Rota Yönetimi</h2>
      <p className="mt-1 text-sm text-neutral-600">
        Katalog rotaları için SEO başlığı, meta açıklama ve sayfa metinlerini
        düzenleyin. Boş alanlar katalog varsayılanına döner.
      </p>

      {error ? (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200 bg-white">
        {loading ? (
          <p className="p-4 text-sm text-neutral-500">Rotalar yükleniyor…</p>
        ) : sortedRoutes.length === 0 ? (
          <p className="p-4 text-sm text-neutral-500">Rota bulunamadı.</p>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {sortedRoutes.map((route) => {
              const hasOverlay = overlayKeys.has(route.id);
              return (
                <li
                  key={route.id}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-neutral-900">{route.name}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-neutral-600">
                      {route.description}
                    </p>
                    <p className="mt-1 text-xs text-neutral-400">
                      /routes/{route.id}
                      {hasOverlay ? ' · özel içerik' : ' · katalog varsayılanı'}
                    </p>
                  </div>
                  <Link
                    href={`/admin/content/routes/${route.id}`}
                    className="inline-flex shrink-0 items-center justify-center rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-50"
                  >
                    Düzenle
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
