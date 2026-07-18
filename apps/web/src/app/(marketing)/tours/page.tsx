import type { Metadata } from 'next';
import Link from 'next/link';

import { TourCard } from '@/components/features/tour/tour-card';
import { searchTours } from '@/services/catalog';

export const metadata: Metadata = {
  title: 'Turlar | TurlaDur',
  description: 'Yayınlanmış turları ara ve filtrele.',
};

type PageProps = {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
};

export default async function ToursPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q?.trim() ?? '';
  const category = params.category;
  const page = Number(params.page ?? '1') || 1;

  let tours: Awaited<ReturnType<typeof searchTours>>['data'] = [];
  let total = 0;
  let errorMessage: string | null = null;

  try {
    const result = await searchTours({
      q: q || undefined,
      category,
      page,
      limit: 12,
    });
    tours = result.data ?? [];
    total = result.meta?.total ?? tours.length;
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : 'Turlar yüklenemedi';
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6">
      <h1 className="font-[family-name:var(--font-montserrat)] text-3xl font-bold text-neutral-900">
        Turlar
      </h1>
      <p className="mt-2 text-neutral-600">
        Nest <code className="text-sky-700">/catalog/tours/search</code> ile
        arama (Redis cache destekli)
      </p>

      <form
        className="mt-8 flex flex-col gap-3 sm:flex-row"
        action="/tours"
        method="get"
      >
        <input
          name="q"
          defaultValue={q}
          placeholder="Kapadokya, deniz, kültür…"
          className="h-11 flex-1 rounded-lg border border-neutral-300 px-3 outline-none ring-sky-500 focus:ring-2"
        />
        <select
          name="category"
          defaultValue={category ?? ''}
          className="h-11 rounded-lg border border-neutral-300 px-3"
        >
          <option value="">Tüm kategoriler</option>
          <option value="CULTURAL">Kültür</option>
          <option value="ADVENTURE">Macera</option>
          <option value="GASTRONOMY">Gastronomi</option>
          <option value="NATURE">Doğa</option>
          <option value="CITY">Şehir</option>
          <option value="BEACH">Plaj</option>
        </select>
        <button
          type="submit"
          className="h-11 rounded-lg bg-sky-600 px-5 text-sm font-semibold text-white hover:bg-sky-700"
        >
          Ara
        </button>
      </form>

      {errorMessage ? (
        <p className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          {errorMessage}. API çalışıyor mu? <code>pnpm dev:api</code>
        </p>
      ) : null}

      {!errorMessage && tours.length === 0 ? (
        <p className="mt-10 text-neutral-600">Sonuç bulunamadı.</p>
      ) : (
        <>
          <p className="mt-6 text-sm text-neutral-500">{total} tur</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        </>
      )}

      <p className="mt-10 text-center text-sm text-neutral-500">
        <Link href="/" className="text-sky-700 hover:underline">
          Ana sayfaya dön
        </Link>
      </p>
    </div>
  );
}
