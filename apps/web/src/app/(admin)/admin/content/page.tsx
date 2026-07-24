'use client';

import { FormEvent, useEffect, useState } from 'react';

import {
  createAdminContentPost,
  deleteAdminContentPost,
  listAdminContentPosts,
  updateAdminContentPost,
} from '@/services/partner-admin';
import { useAuth } from '@/providers/auth-provider';

type PostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  published: boolean;
  publishedAt: string | null;
};

export default function AdminContentPage() {
  const { accessToken } = useAuth();
  const [rows, setRows] = useState<PostRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    published: true,
  });

  async function reload() {
    if (!accessToken) return;
    setRows(await listAdminContentPosts(accessToken));
  }

  useEffect(() => {
    void reload().catch((err: Error) => setError(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!accessToken) return;
    try {
      await createAdminContentPost(form, accessToken);
      setForm({ title: '', excerpt: '', content: '', published: true });
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Oluşturulamadı');
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">Blog içerik</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Yazı oluştur / yayına al / sil
      </p>
      {error ? (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <form
        onSubmit={handleCreate}
        className="mt-6 max-w-2xl space-y-3 rounded-xl border border-neutral-200 bg-white p-4"
      >
        <input
          required
          placeholder="Başlık"
          className="h-11 w-full rounded-lg border px-3 text-sm"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        />
        <input
          placeholder="Özet"
          className="h-11 w-full rounded-lg border px-3 text-sm"
          value={form.excerpt}
          onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
        />
        <textarea
          required
          minLength={20}
          rows={6}
          placeholder="İçerik"
          className="w-full rounded-lg border px-3 py-2 text-sm"
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) =>
              setForm((f) => ({ ...f, published: e.target.checked }))
            }
          />
          Hemen yayınla
        </label>
        <button
          type="submit"
          className="rounded-lg bg-neutral-950 px-4 py-2 text-sm font-semibold text-white"
        >
          Yazı oluştur
        </button>
      </form>

      <ul className="mt-8 divide-y rounded-xl border border-neutral-200 bg-white">
        {rows.map((row) => (
          <li
            key={row.id}
            className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"
          >
            <div>
              <p className="font-medium">{row.title}</p>
              <p className="text-xs text-neutral-500">
                /{row.slug} · {row.published ? 'Yayında' : 'Taslak'}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-lg border px-3 py-1 text-xs"
                onClick={() => {
                  if (!accessToken) return;
                  void updateAdminContentPost(
                    row.id,
                    { published: !row.published },
                    accessToken,
                  )
                    .then(reload)
                    .catch((err: Error) => setError(err.message));
                }}
              >
                {row.published ? 'Taslağa al' : 'Yayınla'}
              </button>
              <button
                type="button"
                className="rounded-lg px-3 py-1 text-xs text-red-700"
                onClick={() => {
                  if (!accessToken) return;
                  if (!confirm('Silinsin mi?')) return;
                  void deleteAdminContentPost(row.id, accessToken)
                    .then(reload)
                    .catch((err: Error) => setError(err.message));
                }}
              >
                Sil
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
