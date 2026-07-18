import Link from 'next/link';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1583062482795-d2bef78e9bc1?q=80&w=2070&auto=format&fit=crop';

/**
 * Full-bleed hero (legacy pattern) — brand first, one CTA, no card clutter.
 * Search submits to /tours?q= for Nest catalog search.
 */
export function Hero() {
  return (
    <section className="relative min-h-[88vh] w-full overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={HERO_IMAGE}
        alt="Türkiye'de seyahat"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/65" />

      <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-center px-4 pb-20 pt-28 sm:px-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-200">
          TurlaDur
        </p>
        <h1 className="mt-3 max-w-2xl font-[family-name:var(--font-montserrat)] text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
          Hayalindeki turu keşfet
        </h1>
        <p className="mt-4 max-w-xl text-base text-white/85 sm:text-lg">
          Kapadokya&apos;dan Ege&apos;ye, güvenli rezervasyon ve şeffaf
          fiyatlarla.
        </p>

        <form
          action="/tours"
          method="get"
          className="mt-8 flex w-full max-w-xl flex-col gap-3 sm:flex-row"
        >
          <label className="sr-only" htmlFor="hero-q">
            Tur ara
          </label>
          <input
            id="hero-q"
            name="q"
            type="search"
            placeholder="Örn. Kapadokya, Antalya…"
            className="h-12 flex-1 rounded-lg border-0 bg-white/95 px-4 text-neutral-900 shadow-lg outline-none ring-sky-500 focus:ring-2"
          />
          <button
            type="submit"
            className="h-12 rounded-lg bg-sky-600 px-6 text-sm font-semibold text-white shadow-lg transition hover:bg-sky-700"
          >
            Turları Ara
          </button>
        </form>

        <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/80">
          <span>Güvenli ödeme</span>
          <span aria-hidden>·</span>
          <span>7/24 destek</span>
          <span aria-hidden>·</span>
          <Link href="/tours" className="underline-offset-2 hover:underline">
            Tüm turları gör
          </Link>
        </div>
      </div>
    </section>
  );
}
