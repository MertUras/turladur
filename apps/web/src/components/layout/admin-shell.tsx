'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

import { useAuth } from '@/providers/auth-provider';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/admin/dashboard', label: 'Özet' },
  { href: '/admin/users', label: 'Kullanıcılar' },
  { href: '/admin/agencies', label: 'Partnerler' },
  { href: '/admin/tours', label: 'Tur onay' },
];

/** Admin shell — separate from marketing; sky brand preserved. */
export function AdminShell({ children }: { children: ReactNode }) {
  const { isAuthenticated, user, logout, accessToken } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!accessToken) {
      router.replace('/login');
      return;
    }
    if (user && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
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
      <header className="border-b border-neutral-200 bg-neutral-900 text-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/admin/dashboard" className="font-semibold text-sky-400">
            TurlaDur Admin
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-neutral-300">{user?.email}</span>
            <Link href="/" className="text-neutral-400 hover:text-white">
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
