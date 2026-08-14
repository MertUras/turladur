'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

import { ImageUploadField } from '@/components/features/partner/image-upload-field';
import {
  createExperienceDate,
  deleteExperienceDate,
  getExperienceDetail,
  listExperienceDates,
  updatePartnerExperience,
} from '@/services/partner-admin';
import { useAuth } from '@/providers/auth-provider';

const CATEGORIES = [
  'Doğa',
  'Kültür',
  'Macera',
  'Deniz',
  'Tarihi',
  'Yemek',
  'Eğlence',
  'Spor',
  'Sanat',
];

export default function PartnerEditExperiencePage() {
  const { id } = useParams<{ id: string }>();
  const { accessToken } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [dates, setDates] = useState<
    Array<{
      id: string;
      startDate: string;
      endDate: string;
      price: string;
      availableSeats: number;
    }>
  >([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    longDescription: '',
    category: 'Kültür',
    location: '',
    duration: '',
    price: 0,
    meetingPoint: '',
    ageRestriction: 'everyone',
    imageUrl: '' as string | null,
    status: 'DRAFT',
  });
  const [newDate, setNewDate] = useState({
    startDate: '',
    endDate: '',
    availableSeats: 12,
  });

  async function reload() {
    if (!accessToken || !id) return;
    const [detail, dateRows] = await Promise.all([
      getExperienceDetail(id, accessToken),
      listExperienceDates(id, accessToken),
    ]);
    setForm({
      title: detail.title,
      description: detail.description,
      longDescription: detail.longDescription,
      category: detail.category,
      location: detail.location,
      duration: detail.duration,
      price: Number(detail.price),
      meetingPoint: detail.meetingPoint ?? '',
      ageRestriction: detail.ageRestriction ?? 'everyone',
      imageUrl: detail.imageUrl,
      status: detail.status,
    });
    setDates(dateRows);
  }

  useEffect(() => {
    void reload().catch((err: Error) => setError(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, id]);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!accessToken || !id) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await updatePartnerExperience(
        id,
        {
          title: form.title,
          description: form.description,
          longDescription: form.longDescription,
          category: form.category,
          location: form.location,
          duration: form.duration,
          price: form.price,
          meetingPoint: form.meetingPoint || undefined,
          ageRestriction: form.ageRestriction,
          imageUrl: form.imageUrl || undefined,
          status: form.status,
        },
        accessToken,
      );
      setMessage('Kaydedildi.');
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kayıt başarısız');
    } finally {
      setSaving(false);
    }
  }

  async function handleAddDate(e: FormEvent) {
    e.preventDefault();
    if (!accessToken || !id || !newDate.startDate || !newDate.endDate) return;
    try {
      await createExperienceDate(
        id,
        {
          startDate: newDate.startDate,
          endDate: newDate.endDate,
          price: form.price,
          availableSeats: newDate.availableSeats,
        },
        accessToken,
      );
      setNewDate({ startDate: '', endDate: '', availableSeats: 12 });
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tarih eklenemedi');
    }
  }

  return (
    <div>
      <Link
        href="/acente/experiences"
        className="text-sm text-neutral-950 hover:underline"
      >
        ← Deneyimler
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-neutral-900">
        Deneyim düzenle
      </h1>
      {message ? (
        <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <form onSubmit={handleSave} className="mt-6 max-w-2xl space-y-4">
        <label className="block text-sm font-medium">
          Başlık
          <input
            required
            className="mt-1 h-11 w-full rounded-lg border border-neutral-300 px-3"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
        </label>
        <label className="block text-sm font-medium">
          Kısa açıklama
          <textarea
            required
            rows={3}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
          />
        </label>
        <label className="block text-sm font-medium">
          Uzun açıklama
          <textarea
            required
            rows={5}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
            value={form.longDescription}
            onChange={(e) =>
              setForm((f) => ({ ...f, longDescription: e.target.value }))
            }
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            Kategori
            <select
              className="mt-1 h-11 w-full rounded-lg border border-neutral-300 px-3"
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({ ...f, category: e.target.value }))
              }
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium">
            Lokasyon
            <input
              required
              className="mt-1 h-11 w-full rounded-lg border border-neutral-300 px-3"
              value={form.location}
              onChange={(e) =>
                setForm((f) => ({ ...f, location: e.target.value }))
              }
            />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block text-sm font-medium">
            Süre
            <input
              className="mt-1 h-11 w-full rounded-lg border border-neutral-300 px-3"
              value={form.duration}
              onChange={(e) =>
                setForm((f) => ({ ...f, duration: e.target.value }))
              }
            />
          </label>
          <label className="block text-sm font-medium">
            Fiyat
            <input
              type="number"
              className="mt-1 h-11 w-full rounded-lg border border-neutral-300 px-3"
              value={form.price}
              onChange={(e) =>
                setForm((f) => ({ ...f, price: Number(e.target.value) }))
              }
            />
          </label>
          <label className="block text-sm font-medium">
            Durum
            <select
              className="mt-1 h-11 w-full rounded-lg border border-neutral-300 px-3"
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({ ...f, status: e.target.value }))
              }
            >
              <option value="DRAFT">Taslak</option>
              <option value="PENDING_REVIEW">Onay bekliyor</option>
              <option value="PUBLISHED">Yayında</option>
              <option value="ARCHIVED">Arşiv</option>
            </select>
          </label>
        </div>
        <label className="block text-sm font-medium">
          Buluşma noktası
          <input
            className="mt-1 h-11 w-full rounded-lg border border-neutral-300 px-3"
            value={form.meetingPoint}
            onChange={(e) =>
              setForm((f) => ({ ...f, meetingPoint: e.target.value }))
            }
          />
        </label>

        {accessToken ? (
          <ImageUploadField
            token={accessToken}
            folder="experiences"
            entityId={id}
            currentUrl={form.imageUrl}
            onUploaded={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
          />
        ) : null}

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? 'Kaydediliyor…' : 'Değişiklikleri kaydet'}
        </button>
      </form>

      <section className="mt-10 max-w-2xl">
        <h2 className="text-lg font-semibold text-neutral-900">
          Müsait tarihler
        </h2>
        <ul className="mt-3 divide-y rounded-xl border border-neutral-200 bg-white">
          {dates.length === 0 ? (
            <li className="p-3 text-sm text-neutral-600">Tarih yok.</li>
          ) : null}
          {dates.map((d) => (
            <li
              key={d.id}
              className="flex items-center justify-between gap-2 px-3 py-2 text-sm"
            >
              <span>
                {d.startDate}
                {d.endDate !== d.startDate ? ` → ${d.endDate}` : ''} ·{' '}
                {d.availableSeats} kontenjan · {d.price} TRY
              </span>
              <button
                type="button"
                className="text-xs text-red-700"
                onClick={() => {
                  if (!accessToken) return;
                  void deleteExperienceDate(id, d.id, accessToken)
                    .then(reload)
                    .catch((err: Error) => setError(err.message));
                }}
              >
                Sil
              </button>
            </li>
          ))}
        </ul>
        <form
          onSubmit={handleAddDate}
          className="mt-4 grid gap-2 rounded-xl border border-neutral-200 p-3 sm:grid-cols-4"
        >
          <input
            type="date"
            required
            className="h-10 rounded-lg border border-neutral-300 px-2 text-sm"
            value={newDate.startDate}
            onChange={(e) =>
              setNewDate((d) => ({ ...d, startDate: e.target.value }))
            }
          />
          <input
            type="date"
            required
            className="h-10 rounded-lg border border-neutral-300 px-2 text-sm"
            value={newDate.endDate}
            onChange={(e) =>
              setNewDate((d) => ({ ...d, endDate: e.target.value }))
            }
          />
          <input
            type="number"
            min={1}
            className="h-10 rounded-lg border border-neutral-300 px-2 text-sm"
            value={newDate.availableSeats}
            onChange={(e) =>
              setNewDate((d) => ({
                ...d,
                availableSeats: Number(e.target.value),
              }))
            }
          />
          <button
            type="submit"
            className="h-10 rounded-lg bg-neutral-950 text-sm font-medium text-white"
          >
            Tarih ekle
          </button>
        </form>
      </section>
    </div>
  );
}
