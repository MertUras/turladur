'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import {
  getAdminRoutePage,
  listAdminRouteDefinitions,
  updateAdminRoutePage,
} from '@/services/partner-admin';
import { useAuth } from '@/providers/auth-provider';

type RouteDefinition = {
  id: string;
  name: string;
  description: string;
  longDescription: string;
};

export default function AdminRouteEditPage() {
  const params = useParams<{ routeKey: string }>();
  const routeKey = params.routeKey;
  const { accessToken } = useAuth();

  const [catalogRoute, setCatalogRoute] = useState<RouteDefinition | null>(
    null,
  );
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [summary, setSummary] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!accessToken || !routeKey) return;

    setLoading(true);
    setError(null);
    setSaved(false);

    void listAdminRouteDefinitions(accessToken)
      .then(async (definitions) => {
        const match =
          definitions.find((route) => route.id === routeKey) ?? null;
        setCatalogRoute(match);
        if (!match) return;

        const overlay = await getAdminRoutePage(routeKey, accessToken).catch(
          () => ({
            routeKey,
            exists: false,
            seoTitle: null,
            seoDescription: null,
            summary: null,
            body: null,
          }),
        );
        setSeoTitle(overlay.seoTitle ?? '');
        setSeoDescription(overlay.seoDescription ?? '');
        setSummary(overlay.summary ?? '');
        setBody(overlay.body ?? '');
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [accessToken, routeKey]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!accessToken || !routeKey) return;

    setSaving(true);
    setError(null);
    setSaved(false);

    void updateAdminRoutePage(
      routeKey,
      {
        seoTitle: seoTitle.trim() || null,
        seoDescription: seoDescription.trim() || null,
        summary: summary.trim() || null,
        body: body.trim() || null,
      },
      accessToken,
    )
      .then(() => setSaved(true))
      .catch((err: Error) => setError(err.message))
      .finally(() => setSaving(false));
  };

  if (loading) {
    return <p className="text-sm text-neutral-500">Rota yükleniyor…</p>;
  }

  if (!catalogRoute) {
    return (
      <div>
        {error ? (
          <p className="text-sm text-red-700">{error}</p>
        ) : (
          <p className="text-sm text-red-700">Rota bulunamadı.</p>
        )}
        <Link
          href="/admin/content/routes"
          className="mt-4 inline-block text-sm font-medium text-neutral-900 underline"
        >
          Rota listesine dön
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/admin/content/routes"
        className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
      >
        ← Rota listesi
      </Link>

      <h2 className="mt-4 text-lg font-semibold text-neutral-900">
        {catalogRoute.name}
      </h2>
      <p className="mt-1 text-sm text-neutral-600">
        /routes/{catalogRoute.id} — boş bırakılan alanlar katalog metnini
        kullanır.
      </p>

      {error ? (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      {saved ? (
        <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
          Kaydedildi.
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-6 max-w-3xl space-y-6">
        <section className="rounded-xl border border-neutral-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-neutral-900">SEO</h3>
          <div className="mt-4 space-y-4">
            <label className="block text-sm">
              <span className="font-medium text-neutral-800">
                Sayfa başlığı
              </span>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder={`${catalogRoute.name} | turta`}
                maxLength={120}
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-neutral-800">
                Meta açıklama
              </span>
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder={catalogRoute.description}
                maxLength={320}
                rows={3}
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
              />
            </label>
          </div>
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-neutral-900">
            Sayfa metni
          </h3>
          <div className="mt-4 space-y-4">
            <label className="block text-sm">
              <span className="font-medium text-neutral-800">
                Kısa özet (hero + kart)
              </span>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder={catalogRoute.description}
                maxLength={500}
                rows={3}
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-neutral-800">
                Hakkında metni
              </span>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={catalogRoute.longDescription}
                maxLength={10000}
                rows={8}
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
              />
            </label>
          </div>
        </section>

        <button
          type="submit"
          disabled={saving || !accessToken}
          className="rounded-lg bg-neutral-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          {saving ? 'Kaydediliyor…' : 'Kaydet'}
        </button>
      </form>
    </div>
  );
}
