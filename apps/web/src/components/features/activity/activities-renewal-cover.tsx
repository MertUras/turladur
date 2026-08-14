import Image from 'next/image';
import Link from 'next/link';

const COVER_IMAGE =
  'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?q=80&w=2070&auto=format&fit=crop';

const DEFAULT_HEADLINE = 'Sizin için aktiviteleri yeniliyoruz.';
const DEFAULT_SUBTITLE =
  'Yeni deneyim vitrini yakında. Şimdiden rotaları ve turları keşfedin.';

type ActivitiesRenewalCoverProps = {
  headline?: string | null;
  subtitle?: string | null;
};

export function ActivitiesRenewalCover({
  headline,
  subtitle,
}: ActivitiesRenewalCoverProps) {
  return (
    <section className="relative min-h-[100svh] w-full">
      <Image
        src={COVER_IMAGE}
        alt="Aktiviteler yenileniyor"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/85 via-neutral-900/80 to-neutral-950/85" />
      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-6 pt-24 pb-16 text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-neutral-300">
          turta
        </p>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          {headline?.trim() || DEFAULT_HEADLINE}
        </h1>
        <p className="mt-5 max-w-xl text-base font-light text-neutral-200/90 sm:text-lg">
          {subtitle?.trim() || DEFAULT_SUBTITLE}
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/routes"
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-neutral-950 hover:bg-neutral-100"
          >
            Rotaları keşfet
          </Link>
          <Link
            href="/tours"
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-white px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
          >
            Turları gör
          </Link>
        </div>
      </div>
    </section>
  );
}
