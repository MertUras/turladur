import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { TourReviews } from '@/components/features/review/tour-reviews';
import { getTourById, getTourDates } from '@/services/catalog';

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const tour = await getTourById(id);
    return {
      title: `${tour.title} | TurlaDur`,
      description: tour.description.slice(0, 160),
      openGraph: {
        title: tour.title,
        description: tour.description.slice(0, 160),
      },
    };
  } catch {
    return { title: 'Tur | TurlaDur' };
  }
}

/**
 * SSR tour detail — Google-indexable (Sprint 15 DoD).
 * Why Nest not legacy /api/tours: cutover path; legacy app stays intact.
 */
export default async function TourDetailPage({ params }: PageProps) {
  const { id } = await params;

  let tour;
  let dates: Awaited<ReturnType<typeof getTourDates>> = [];
  try {
    tour = await getTourById(id);
    dates = await getTourDates(id);
  } catch {
    notFound();
  }

  const price = new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: tour.currency || 'TRY',
    maximumFractionDigits: 0,
  }).format(Number(tour.price));

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl bg-neutral-100">
          {tour.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={tour.coverUrl}
              alt={tour.title}
              className="aspect-[4/3] w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-sky-100 to-sky-300 text-sky-900">
              {tour.category}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-sky-700">
            {tour.category}
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-montserrat)] text-3xl font-bold text-neutral-900 sm:text-4xl">
            {tour.title}
          </h1>
          <p className="mt-4 text-neutral-700 leading-relaxed">
            {tour.description}
          </p>
          <p className="mt-6 text-3xl font-bold text-neutral-900">{price}</p>
          <p className="text-sm text-neutral-500">{tour.durationDays} gün</p>
          {tour.reviewCount > 0 ? (
            <p className="mt-2 text-sm text-amber-700">
              ★ {Number(tour.averageRating).toFixed(1)} · {tour.reviewCount}{' '}
              yorum
            </p>
          ) : (
            <p className="mt-2 text-sm text-neutral-500">Henüz puan yok</p>
          )}

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-neutral-900">
              Müsait tarihler
            </h2>
            {dates.length === 0 ? (
              <p className="mt-2 text-sm text-neutral-600">
                Henüz tarih eklenmemiş.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {dates.map((d) => (
                  <li
                    key={d.id}
                    className="flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                  >
                    <span>
                      {d.startDate}
                      {d.endDate !== d.startDate ? ` → ${d.endDate}` : ''}
                    </span>
                    <span className="text-neutral-500">
                      {d.remainingCapacity}/{d.capacity} kişi
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link
            href={`/checkout?tourId=${tour.id}`}
            className="mt-8 inline-flex rounded-lg bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-700"
          >
            Rezervasyona geç
          </Link>
        </div>
      </div>

      <TourReviews tourId={tour.id} />
    </div>
  );
}
