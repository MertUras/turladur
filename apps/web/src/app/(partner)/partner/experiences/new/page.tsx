'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

import { ImageUploadField } from '@/components/features/partner/image-upload-field';
import {
  createExperienceDate,
  createPartnerExperience,
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

export default function PartnerNewExperiencePage() {
  const { accessToken } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    longDescription: '',
    category: 'Kültür',
    location: '',
    duration: '2 saat',
    price: 500,
    meetingPoint: '',
    ageRestriction: 'everyone',
    dateStart: '',
    dateEnd: '',
    dateSeats: 12,
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!accessToken) return;
    setSaving(true);
    setError(null);
    try {
      const created = await createPartnerExperience(
        {
          title: form.title,
          description: form.description,
          longDescription: form.longDescription || form.description,
          category: form.category,
          location: form.location,
          duration: form.duration,
          price: form.price,
          meetingPoint: form.meetingPoint || undefined,
          ageRestriction: form.ageRestriction || undefined,
          imageUrl: imageUrl || undefined,
        },
        accessToken,
      );
      setCreatedId(created.id);

      if (imageUrl) {
        await updatePartnerExperience(created.id, { imageUrl }, accessToken);
      }

      if (form.dateStart && form.dateEnd) {
        await createExperienceDate(
          created.id,
          {
            startDate: form.dateStart,
            endDate: form.dateEnd,
            price: form.price,
            availableSeats: form.dateSeats,
          },
          accessToken,
        );
      }

      router.push(`/partner/experiences/${created.id}/edit`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kayıt başarısız');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <Link
        href="/partner/experiences"
        className="text-sm text-neutral-950 hover:underline"
      >
        ← Deneyimler
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-neutral-900">Yeni deneyim</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Kaydedilince aktiviteler kataloğuna (onay sonrası) yansır.
      </p>
      {error ? (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-6 max-w-2xl space-y-4">
        <Field
          label="Başlık"
          value={form.title}
          onChange={(v) => setForm((f) => ({ ...f, title: v }))}
          required
        />
        <label className="block text-sm font-medium text-neutral-800">
          Kısa açıklama
          <textarea
            required
            minLength={10}
            rows={3}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
          />
        </label>
        <label className="block text-sm font-medium text-neutral-800">
          Uzun açıklama
          <textarea
            required
            minLength={10}
            rows={5}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            value={form.longDescription}
            onChange={(e) =>
              setForm((f) => ({ ...f, longDescription: e.target.value }))
            }
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-neutral-800">
            Kategori
            <select
              className="mt-1 h-11 w-full rounded-lg border border-neutral-300 px-3"
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({ ...f, category: e.target.value }))
              }
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <Field
            label="Lokasyon"
            value={form.location}
            onChange={(v) => setForm((f) => ({ ...f, location: v }))}
            required
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Süre"
            value={form.duration}
            onChange={(v) => setForm((f) => ({ ...f, duration: v }))}
            required
          />
          <label className="block text-sm font-medium text-neutral-800">
            Fiyat (TRY)
            <input
              type="number"
              min={0}
              required
              className="mt-1 h-11 w-full rounded-lg border border-neutral-300 px-3"
              value={form.price}
              onChange={(e) =>
                setForm((f) => ({ ...f, price: Number(e.target.value) }))
              }
            />
          </label>
        </div>
        <Field
          label="Buluşma noktası"
          value={form.meetingPoint}
          onChange={(v) => setForm((f) => ({ ...f, meetingPoint: v }))}
        />
        <label className="block text-sm font-medium text-neutral-800">
          Yaş kısıtı
          <select
            className="mt-1 h-11 w-full rounded-lg border border-neutral-300 px-3"
            value={form.ageRestriction}
            onChange={(e) =>
              setForm((f) => ({ ...f, ageRestriction: e.target.value }))
            }
          >
            <option value="everyone">Herkes</option>
            <option value="12+">12+</option>
            <option value="18+">18+</option>
          </select>
        </label>

        <div className="rounded-xl border border-neutral-200 p-4">
          <p className="text-sm font-semibold text-neutral-900">
            İlk müsait tarih (opsiyonel)
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <label className="text-xs font-medium text-neutral-700">
              Başlangıç
              <input
                type="date"
                className="mt-1 h-10 w-full rounded-lg border border-neutral-300 px-2"
                value={form.dateStart}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dateStart: e.target.value }))
                }
              />
            </label>
            <label className="text-xs font-medium text-neutral-700">
              Bitiş
              <input
                type="date"
                className="mt-1 h-10 w-full rounded-lg border border-neutral-300 px-2"
                value={form.dateEnd}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dateEnd: e.target.value }))
                }
              />
            </label>
            <label className="text-xs font-medium text-neutral-700">
              Kontenjan
              <input
                type="number"
                min={1}
                className="mt-1 h-10 w-full rounded-lg border border-neutral-300 px-2"
                value={form.dateSeats}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    dateSeats: Number(e.target.value),
                  }))
                }
              />
            </label>
          </div>
        </div>

        {accessToken && createdId ? (
          <ImageUploadField
            token={accessToken}
            folder="experiences"
            entityId={createdId}
            currentUrl={imageUrl}
            onUploaded={setImageUrl}
            label="Kapak görseli"
          />
        ) : (
          <p className="text-xs text-neutral-500">
            Görsel yüklemek için kaydı oluşturun; düzenleme sayfasında da
            ekleyebilirsiniz.
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-60"
        >
          {saving ? 'Kaydediliyor…' : 'Oluştur ve düzenlemeye geç'}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-medium text-neutral-800">
      {label}
      <input
        required={required}
        className="mt-1 h-11 w-full rounded-lg border border-neutral-300 px-3 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
