'use client';

import { useState } from 'react';

import { getPresignedUpload } from '@/services/partner-admin';

type Props = {
  token: string;
  folder: string;
  entityId: string;
  currentUrl?: string | null;
  onUploaded: (publicUrl: string) => void;
  label?: string;
};

export function ImageUploadField({
  token,
  folder,
  entityId,
  currentUrl,
  onUploaded,
  label = 'Görsel',
}: Props) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | null) {
    if (!file) return;
    setPending(true);
    setError(null);
    try {
      const contentType = file.type as
        'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';
      if (!contentType?.startsWith('image/')) {
        throw new Error('Sadece görsel yükleyin');
      }
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const presigned = await getPresignedUpload(
        {
          folder,
          entityId,
          filename: safeName,
          contentType,
        },
        token,
      );
      const uploadRes = await fetch(presigned.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': contentType },
        body: file,
      });
      if (!uploadRes.ok) throw new Error('Yükleme başarısız');
      onUploaded(presigned.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Yükleme hatası');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-neutral-800">{label}</p>
      {currentUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={currentUrl}
          alt=""
          className="h-32 w-full rounded-lg object-cover"
        />
      ) : (
        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-neutral-50 text-sm text-neutral-500">
          Görsel seçin
        </div>
      )}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        disabled={pending || !entityId}
        onChange={(e) => void handleFile(e.target.files?.[0] ?? null)}
        className="block w-full text-sm text-neutral-600 file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-950 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white"
      />
      {!entityId ? (
        <p className="text-xs text-neutral-500">
          Önce kaydı oluşturun, sonra görsel ekleyin — veya oluşturma sonrası
          yüklenir.
        </p>
      ) : null}
      {pending ? <p className="text-xs text-neutral-500">Yükleniyor…</p> : null}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
