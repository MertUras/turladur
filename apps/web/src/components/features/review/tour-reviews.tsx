'use client';

import { useEffect, useState } from 'react';

import {
  createReview,
  getReviewEligibility,
  listTourReviews,
} from '@/services/review';
import { useAuth } from '@/providers/auth-provider';
import type { Review } from '@turladur/shared-types';

type Props = { tourId: string };

/**
 * Tour reviews — list (public) + form when user has COMPLETED booking.
 */
export function TourReviews({ tourId }: Props) {
  const { accessToken, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [eligible, setEligible] = useState<{
    reservationId: string;
    alreadyReviewed: boolean;
  } | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function reload() {
    const { data, meta } = await listTourReviews(tourId);
    setReviews(data);
    setTotal(meta?.total ?? data.length);
  }

  useEffect(() => {
    void reload().catch((err: Error) => setError(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourId]);

  useEffect(() => {
    if (!accessToken) {
      setEligible(null);
      return;
    }
    void getReviewEligibility(tourId, accessToken)
      .then(setEligible)
      .catch(() => setEligible(null));
  }, [tourId, accessToken]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken || !eligible?.reservationId) return;
    setSaving(true);
    setError(null);
    try {
      await createReview(
        {
          reservationId: eligible.reservationId,
          rating,
          comment: comment.trim() || undefined,
        },
        accessToken,
      );
      setComment('');
      setEligible({ ...eligible, alreadyReviewed: true });
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Yorum kaydedilemedi');
    } finally {
      setSaving(false);
    }
  }

  const canWrite =
    isAuthenticated &&
    eligible &&
    !eligible.alreadyReviewed &&
    Boolean(eligible.reservationId);

  return (
    <section className="mt-14 border-t border-neutral-200 pt-10">
      <h2 className="text-xl font-semibold text-neutral-900">
        Yorumlar
        {total > 0 ? (
          <span className="ml-2 text-sm font-normal text-neutral-500">
            ({total})
          </span>
        ) : null}
      </h2>

      {error ? (
        <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {canWrite ? (
        <form onSubmit={handleSubmit} className="mt-6 max-w-lg space-y-3">
          <p className="text-sm text-neutral-600">
            Tamamlanan rezervasyonunuz için yorum yazabilirsiniz.
          </p>
          <label className="block text-sm">
            <span className="font-medium text-neutral-700">Puan</span>
            <select
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} / 5
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-medium text-neutral-700">Yorum</span>
            <textarea
              rows={3}
              minLength={3}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Deneyiminizi paylaşın…"
            />
          </label>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-neutral-950 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60"
          >
            {saving ? 'Gönderiliyor…' : 'Gönder'}
          </button>
        </form>
      ) : null}

      {!isAuthenticated ? (
        <p className="mt-4 text-sm text-neutral-600">
          Yorum yazmak için giriş yapın (tamamlanmış tur gerekir).
        </p>
      ) : null}

      <ul className="mt-8 space-y-4">
        {reviews.length === 0 ? (
          <li className="text-sm text-neutral-600">Henüz yorum yok.</li>
        ) : null}
        {reviews.map((r) => (
          <li
            key={r.id}
            className="rounded-xl border border-neutral-200 bg-white p-4"
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold text-amber-600">{r.rating}/5</span>
              <span className="text-xs text-neutral-400">
                {new Date(r.createdAt).toLocaleDateString('tr-TR')}
              </span>
            </div>
            {r.comment ? (
              <p className="mt-2 text-sm text-neutral-700">{r.comment}</p>
            ) : null}
            {r.partnerReply ? (
              <p className="mt-3 rounded-lg bg-neutral-50 p-3 text-sm text-neutral-600">
                <span className="font-medium text-neutral-800">
                  Partner yanıtı:{' '}
                </span>
                {r.partnerReply}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
