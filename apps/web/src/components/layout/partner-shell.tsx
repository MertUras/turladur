'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

import { useAuth } from '@/providers/auth-provider';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/partner/dashboard', label: 'Özet' },
  { href: '/partner/tours', label: 'Turlarım' },
  { href: '/partner/reservations', label: 'Rezervasyonlar' },
];

/**
 * Partner shell — isolated from marketing Header so customer UI stays untouched.
 */
export function PartnerShell({ children }: { children: ReactNode }) {
  const { isAuthenticated, user, logout, accessToken } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!accessToken) {
      router.replace('/login');
      return;
    }
    if (
      user &&
      user.role !== 'PARTNER' &&
      user.role !== 'PARTNER_STAFF' &&
      user.role !== 'ADMIN' &&
      user.role !== 'SUPER_ADMIN'
    ) {
      router.replace('/');
    }
  }, [accessToken, user, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center text-neutral-600">
        Yönlendiriliyor…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link
            href="/partner/dashboard"
            className="font-semibold text-sky-700"
          >
            TurlaDur Partner
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-neutral-600">{user?.email}</span>
            <Link href="/" className="text-neutral-500 hover:text-sky-700">
              Site
            </Link>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg bg-sky-600 px-3 py-1.5 text-white hover:bg-sky-700"
            >
              Çıkış
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-[200px_1fr]">
        <nav className="flex flex-row gap-2 md:flex-col">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium',
                pathname.startsWith(item.href)
                  ? 'bg-sky-100 text-sky-800'
                  : 'text-neutral-700 hover:bg-neutral-100',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div>{children}</div>
      </div>
    </div>
  );
}
