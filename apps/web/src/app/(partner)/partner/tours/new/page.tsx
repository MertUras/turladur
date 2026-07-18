'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import {
  createPartnerTour,
  getPresignedUpload,
  updatePartnerTour,
} from '@/services/partner-admin';
import { useAuth } from '@/providers/auth-provider';

const CATEGORIES = [
  'CULTURAL',
  'ADVENTURE',
  'GASTRONOMY',
  'NATURE',
  'CITY',
  'BEACH',
] as const;

export default function PartnerNewTourPage() {
  const { accessToken } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: 1000,
    category: 'ADVENTURE' as (typeof CATEGORIES)[number],
    durationDays: 1,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken) return;
    setSaving(true);
    setError(null);
    try {
      const tour = await createPartnerTour(
        {
          title: form.title,
          description: form.description,
          price: form.price,
          category: form.category,
          durationDays: form.durationDays,
        },
        accessToken,
      );

      if (coverFile) {
        const contentType = coverFile.type as
          'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';
        const safeName = coverFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const presigned = await getPresignedUpload(
          {
            folder: 'tours',
            entityId: tour.id,
            filename: safeName,
            contentType,
          },
          accessToken,
        );
        const uploadRes = await fetch(presigned.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': contentType },
          body: coverFile,
        });
        if (!uploadRes.ok) {
          throw new Error('Görsel yüklenemedi');
        }
        await updatePartnerTour(
          tour.id,
          { coverUrl: presigned.publicUrl },
          accessToken,
        );
      }

      router.push('/partner/tours');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kayıt başarısız');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <Link
        href="/partner/tours"
        className="text-sm text-sky-700 hover:underline"
      >
        ← Turlarım
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-neutral-900">Yeni tur</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Oluşturulunca durum: PENDING_REVIEW
      </p>
      {error ? (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-red-700">{error}</p>
      ) : null}
      <form onSubmit={handleSubmit} className="mt-6 max-w-lg space-y-4">
        <label className="block text-sm">
          <span className="font-medium text-neutral-700">Başlık</span>
          <input
            required
            minLength={3}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-neutral-700">Açıklama</span>
          <textarea
            required
            minLength={10}
            rows={4}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-neutral-700">Kategori</span>
          <select
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
            value={form.category}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                category: e.target.value as (typeof CATEGORIES)[number],
              }))
            }
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm">
            <span className="font-medium text-neutral-700">Gün</span>
            <input
              type="number"
              min={1}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
              value={form.durationDays}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  durationDays: Number(e.target.value),
                }))
              }
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-neutral-700">Fiyat (TRY)</span>
            <input
              type="number"
              min={0}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
              value={form.price}
              onChange={(e) =>
                setForm((f) => ({ ...f, price: Number(e.target.value) }))
              }
            />
          </label>
        </div>
        <label className="block text-sm">
          <span className="font-medium text-neutral-700">Kapak görseli</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="mt-1 block w-full text-sm"
            onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
          />
        </label>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60"
        >
          {saving ? 'Kaydediliyor…' : 'Oluştur'}
        </button>
      </form>
    </div>
  );
}
