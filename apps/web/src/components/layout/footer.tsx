import Link from 'next/link';

const COLUMNS = [
  {
    title: 'Keşfet',
    links: [
      { label: 'Turlar', href: '/tours' },
      { label: 'Rezervasyonlarım', href: '/bookings' },
    ],
  },
  {
    title: 'Hesap',
    links: [
      { label: 'Giriş', href: '/login' },
      { label: 'Kayıt', href: '/register' },
      { label: 'Ödeme', href: '/checkout' },
    ],
  },
  {
    title: 'Destek',
    links: [{ label: 'API Docs', href: 'http://localhost:4000/api/docs' }],
  },
];

/** Footer mirrors legacy dark footer + sky brand without copying social SVG bulk. */
export function Footer() {
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <p className="text-xl font-semibold text-sky-400">TurlaDur</p>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            Türkiye&apos;nin turizm ekosistemini tek platformda buluşturuyoruz.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="text-sm font-semibold uppercase tracking-wide text-neutral-300">
              {col.title}
            </p>
            <ul className="mt-4 space-y-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 transition hover:text-sky-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-neutral-800 py-4 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} TurlaDur. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
