'use client';

import { useEffect, useState } from 'react';

import { ACTIVITIES_LISTING_COVER_KEY } from '@turta/shared-constants';

import {
  getAdminPageCover,
  updateAdminPageCover,
} from '@/services/partner-admin';
import { useAuth } from '@/providers/auth-provider';

export default function AdminActivitiesPageManagement() {
  const { accessToken } = useAuth();
  const [coverEnabled, setCoverEnabled] = useState(false);
  const [coverPending, setCoverPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    void getAdminPageCover(ACTIVITIES_LISTING_COVER_KEY, accessToken)
      .then((cover) => setCoverEnabled(cover.enabled))
      .catch((err: Error) => {
        setCoverEnabled(false);
        setError(err.message);
      });
  }, [accessToken]);

  return (
    <div>
      <h2 className="text-lg font-semibold text-neutral-900">
        Aktivite Sayfası Yönetimi
      </h2>
      <p className="mt-1 text-sm text-neutral-600">
        /activities listing kapağını aç veya kapat
      </p>
      {error ? (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mt-6 max-w-2xl rounded-xl border border-neutral-200 bg-white p-4">
        <p className="text-sm font-semibold text-neutral-900">
          Aktiviteler kapağı
        </p>
        <p className="mt-1 text-xs text-neutral-500">
          Açıkken /activities listing yerine yenileme kapağı gösterilir. Kapalı
          varsayılan: mevcut listing.
        </p>
        <label className="mt-3 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={coverEnabled}
            disabled={coverPending || !accessToken}
            onChange={(e) => {
              if (!accessToken) return;
              const next = e.target.checked;
              setCoverPending(true);
              setError(null);
              void updateAdminPageCover(
                ACTIVITIES_LISTING_COVER_KEY,
                { enabled: next },
                accessToken,
              )
                .then((cover) => setCoverEnabled(cover.enabled))
                .catch((err: Error) => setError(err.message))
                .finally(() => setCoverPending(false));
            }}
          />
          Kapak açık
        </label>
      </div>
    </div>
  );
}
