'use client';

import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

export interface ReviewableBooking {
  id: string;
  bookingNumber: string;
  title: string;
  partnerName: string;
  type?: 'tour' | 'experience';
}

interface RatePartnerModalProps {
  booking: ReviewableBooking;
  onClose: () => void;
  onSubmitted: (bookingId: string) => void;
}

// Müşterinin, süresi dolmuş bir rezervasyon için partneri 1-5 yıldız üzerinden
// değerlendirdiği modal. Ürüne değil, o rezervasyonu gerçekleştiren partnere
// (tur operatörü / aktivite sağlayıcısı) ait bir değerlendirmedir.
export default function RatePartnerModal({ booking, onClose, onSubmitted }: RatePartnerModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating < 1) {
      toast.error('Lütfen 1-5 arası bir yıldız seçin');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews/partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: booking.id, rating, comment }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'Değerlendirme kaydedilemedi');
      }
      toast.success('Değerlendirmeniz için teşekkürler!');
      onSubmitted(booking.id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">
              {booking.type === 'experience' ? 'Aktiviteyi Değerlendir' : 'Turu Değerlendir'}
            </h3>
            <p className="text-sm text-neutral-500 mt-0.5">{booking.title} · {booking.partnerName}</p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-1 py-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1"
              aria-label={`${star} yıldız`}
            >
              <StarIcon
                className={`h-9 w-9 transition-colors ${
                  (hoverRating || rating) >= star ? 'text-amber-400' : 'text-neutral-200'
                }`}
              />
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Deneyiminizi paylaşın (opsiyonel)"
          rows={3}
          className="w-full rounded-lg border border-neutral-300 text-sm p-3 focus:border-sky-500 focus:ring-sky-500 resize-none"
        />

        <div className="flex justify-end gap-3 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50"
          >
            Vazgeç
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 text-sm font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 disabled:opacity-60"
          >
            {submitting ? 'Gönderiliyor...' : 'Gönder'}
          </button>
        </div>
      </div>
    </div>
  );
}
