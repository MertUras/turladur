'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, Search, User, X } from 'lucide-react';

import { useAuth } from '@/providers/auth-provider';
import { cn } from '@/lib/utils';
import { NotificationBell } from '@/components/layout/notification-bell';

const NAV = [
  { href: '/tours', label: 'Turlar' },
  { href: '/bookings', label: 'Rezervasyonlarım' },
];

/**
 * Simplified Header preserving legacy brand cues (sky accent, scroll solidify).
 * Why rewrite not copy: legacy Header is NextAuth + huge dropdowns; we bind Nest JWT.
 */
export function Header() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const solid = scrolled || !isHome;

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        solid
          ? 'border-b border-neutral-200/80 bg-white/95 shadow-sm backdrop-blur'
          : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span
            className={cn(
              'text-xl font-semibold tracking-tight',
              solid ? 'text-sky-700' : 'text-white',
            )}
          >
            TurlaDur
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm font-medium transition-colors',
                solid
                  ? 'text-neutral-700 hover:text-sky-700'
                  : 'text-white/90 hover:text-white',
                pathname.startsWith(item.href) &&
                  (solid ? 'text-sky-700' : 'text-white'),
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/tours"
            className={cn(
              'rounded-full p-2 transition-colors',
              solid
                ? 'text-neutral-600 hover:bg-neutral-100'
                : 'text-white hover:bg-white/10',
            )}
            aria-label="Tur ara"
          >
            <Search className="h-5 w-5" />
          </Link>
          <NotificationBell solid={solid} />
          {isAuthenticated ? (
            <>
              <span
                className={cn(
                  'text-sm',
                  solid ? 'text-neutral-600' : 'text-white/90',
                )}
              >
                {user?.firstName ?? user?.email}
              </span>
              <button
                type="button"
                onClick={logout}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium',
                  solid
                    ? 'bg-sky-600 text-white hover:bg-sky-700'
                    : 'bg-white text-sky-800 hover:bg-sky-50',
                )}
              >
                Çıkış
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium',
                solid
                  ? 'bg-sky-600 text-white hover:bg-sky-700'
                  : 'bg-white text-sky-800 hover:bg-sky-50',
              )}
            >
              <User className="h-4 w-4" />
              Giriş
            </Link>
          )}
        </div>

        <button
          type="button"
          className={cn(
            'rounded-md p-2 md:hidden',
            solid ? 'text-neutral-800' : 'text-white',
          )}
          aria-label="Menü"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-neutral-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-neutral-800"
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-800">
                    Bildirimler
                  </span>
                  <NotificationBell solid />
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-lg bg-sky-600 px-4 py-2 text-left text-sm font-medium text-white"
                >
                  Çıkış
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white"
              >
                Giriş / Kayıt
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
