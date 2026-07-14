'use client';

import { StarIcon } from '@heroicons/react/24/solid';
import type { ReviewableBooking } from '@/app/(dashboard)/bookings/components/RatePartnerModal';

interface PendingPartnerReviewsSectionProps {
  bookings: ReviewableBooking[];
  onRatePartner: (booking: ReviewableBooking) => void;
  className?: string;
}

export default function PendingPartnerReviewsSection({
  bookings,
  onRatePartner,
  className = '',
}: PendingPartnerReviewsSectionProps) {
  if (bookings.length === 0) return null;

  return (
    <div
      className={`bg-amber-50 border border-amber-200/70 rounded-xl p-4 sm:p-5 ${className}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <StarIcon className="h-5 w-5 text-amber-500 shrink-0" />
        <h2 className="text-sm font-semibold text-amber-900">
          Değerlendirmenizi Bekleyen Rezervasyonlar
        </h2>
      </div>
      <div className="space-y-2">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-lg border border-amber-100 px-4 py-3.5"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-neutral-900 truncate">{booking.title}</p>
              {booking.displayDateLabel && (
                <p className="text-sm text-neutral-700 mt-0.5">
                  {booking.displayDateLabel} tarihli{' '}
                  {booking.type === 'experience'
                    ? 'aktivitenin değerlendirmesi'
                    : 'turun değerlendirmesi'}{' '}
                  bekliyor
                </p>
              )}
              <p className="text-xs text-neutral-500 mt-1 truncate">
                {[
                  booking.reviewGroupBookingCount && booking.reviewGroupBookingCount > 1
                    ? `${booking.reviewGroupBookingCount} rezervasyon · ${booking.guestCount} kişi`
                    : booking.guestCount
                      ? `${booking.guestCount} kişi`
                      : null,
                  booking.partnerName,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onRatePartner(booking)}
              className="shrink-0 w-full sm:w-auto inline-flex items-center justify-center px-3 py-1.5 bg-amber-500 text-white text-xs font-semibold rounded-lg hover:bg-amber-600 transition-colors"
            >
              {booking.type === 'experience' ? 'Aktiviteyi Değerlendir' : 'Turu Değerlendir'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
