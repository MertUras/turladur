import Link from 'next/link';

type LegalPageShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  updatedAt?: string;
};

/** Minimal marketing legal/static shell — matches about/contact palette, no redesign. */
export function LegalPageShell({
  title,
  description,
  children,
  updatedAt = '28 Temmuz 2026',
}: LegalPageShellProps) {
  return (
    <div className="bg-white">
      <div className="border-b border-neutral-200 bg-neutral-50 pt-24 pb-12">
        <div className="container mx-auto max-w-3xl px-6">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
            turta
          </p>
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
            {title}
          </h1>
          <p className="text-base text-neutral-600 md:text-lg">{description}</p>
          <p className="mt-4 text-xs text-neutral-400">
            Son güncelleme: {updatedAt}
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl px-6 py-12">
        <div className="prose prose-neutral max-w-none space-y-6 text-sm leading-relaxed text-neutral-700 md:text-base">
          {children}
        </div>

        <div className="mt-12 border-t border-neutral-200 pt-8 text-sm text-neutral-500">
          Sorularınız için{' '}
          <Link
            href="/contact"
            className="font-medium text-neutral-950 underline-offset-2 hover:underline"
          >
            iletişime geçin
          </Link>
          .
        </div>
      </div>
    </div>
  );
}
