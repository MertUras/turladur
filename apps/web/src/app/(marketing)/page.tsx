import type { Metadata } from 'next';
import Link from 'next/link';

import { Hero } from '@/components/features/home/hero';
import { TourCard } from '@/components/features/tour/tour-card';
import { searchTours } from '@/services/catalog';

export const metadata: Metadata = {
  title: 'TurlaDur — Hayalindeki turu keşfet',
  description:
    'Türkiye turizm ekosistemi: turlar, güvenli rezervasyon ve şeffaf fiyatlar.',
  openGraph: {
    title: 'TurlaDur',
    description: 'Hayalindeki turu keşfet',
    locale: 'tr_TR',
    type: 'website',
  },
};

/**
 * Marketing home: legacy section order (Hero → popular tours) but data from Nest.
 * Why not copy HotDeals/Stats yet: those still need Nest endpoints; keep home stable.
 */
export default async function HomePage() {
  let tours: Awaited<ReturnType<typeof searchTours>>['data'] = [];
  try {
    const result = await searchTours({ limit: 6 });
    tours = result.data ?? [];
  } catch {
    tours = [];
  }

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-[family-name:var(--font-montserrat)] text-2xl font-bold text-neutral-900 sm:text-3xl">
              Popüler Turlar
            </h2>
            <p className="mt-2 text-neutral-600">
              Nest catalog API&apos;den güncel yayınlanmış turlar
            </p>
          </div>
          <Link
            href="/tours"
            className="shrink-0 text-sm font-semibold text-sky-700 hover:text-sky-800"
          >
            Tümünü gör →
          </Link>
        </div>

        {tours.length === 0 ? (
          <p className="mt-10 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center text-neutral-600">
            Henüz yayınlanmış tur yok. Partner paneli veya API ile tur ekleyin.
            <br />
            <span className="mt-2 inline-block text-sm">
              Legacy site <code className="text-sky-700">pnpm dev</code> ile
              bozulmadan çalışmaya devam eder.
            </span>
          </p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-neutral-200 bg-sky-50">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-14 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">
              Rezervasyona hazır mısın?
            </h2>
            <p className="mt-2 text-neutral-600">
              Giriş yap, tarih seç, güvenli ödeme ile tamamla.
            </p>
          </div>
          <Link
            href="/register"
            className="rounded-lg bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-700"
          >
            Ücretsiz kayıt ol
          </Link>
        </div>
      </section>
    </>
  );
}
