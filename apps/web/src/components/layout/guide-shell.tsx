'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import {
  CalendarDays,
  ClipboardList,
  Home,
  LogOut,
  Menu,
  UserRound,
  X,
} from 'lucide-react';

import { BrandLogo } from '@/components/brand/brand-logo';
import { useAuth } from '@/providers/auth-provider';
import { REHBER_LOGIN, REHBER_ROUTES } from '@/lib/panel-routes';
import { cn } from '@/lib/utils';

const NAV = [
  { name: 'Genel Bakış', href: REHBER_ROUTES.dashboard, icon: Home },
  { name: 'Atamalar', href: REHBER_ROUTES.assignments, icon: ClipboardList },
  { name: 'Müsaitlik', href: REHBER_ROUTES.availability, icon: CalendarDays },
  { name: 'Profil', href: REHBER_ROUTES.profile, icon: UserRound },
];

function displayName(user: {
  firstName?: string | null;
  lastName?: string | null;
  email: string;
}) {
  const full = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  return full || user.email;
}

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/** Guide panel shell — AgencyShell layout parity (P0-B). */
export function GuideShell({ children }: { children: ReactNode }) {
  const { isAuthenticated, user, logout, accessToken, isBootstrapping } =
    useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [gate, setGate] = useState<'checking' | 'allowed' | 'denied'>(
    'checking',
  );

  const name = user ? displayName(user) : 'Rehber';

  useEffect(() => {
    if (isBootstrapping) return;
    if (!accessToken || !user) {
      setGate('denied');
      router.replace(REHBER_LOGIN);
      return;
    }
    if (user.role !== 'GUIDE') {
      setGate('denied');
      router.replace('/');
      return;
    }
    setGate('allowed');
  }, [isBootstrapping, accessToken, user, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (isBootstrapping || gate === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center text-neutral-600">
        Yükleniyor…
      </div>
    );
  }

  if (gate !== 'allowed' || !isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center text-neutral-600">
        <p>Rehber paneli için giriş gerekli…</p>
        <Link
          href={REHBER_LOGIN}
          className="rounded-lg bg-neutral-950 px-4 py-2 text-sm font-semibold text-white"
        >
          Giriş sayfasına git
        </Link>
      </div>
    );
  }

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {sidebarOpen ? (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-200 bg-white transition duration-300 ease-in-out lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <BrandLogo
              variant="mark"
              surface="light"
              href={null}
              className="h-8 w-8"
            />
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-neutral-800">
                turta
              </span>
              <span className="text-xs font-medium tracking-wide text-neutral-500">
                Rehber Portalı
              </span>
            </div>
          </div>
          <button
            type="button"
            className="text-gray-500 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6 px-4 pt-4">
          <div className="flex items-center rounded-lg bg-blue-50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
              {initials(name)}
            </div>
            <div className="ml-3 min-w-0">
              <p className="truncate text-sm font-medium text-gray-900">
                {name}
              </p>
              <p className="text-xs text-gray-500">Rehber</p>
            </div>
          </div>
        </div>

        <nav className="space-y-1 px-3">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium',
                  active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100',
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 h-5 w-5',
                    active ? 'text-blue-600' : 'text-gray-400',
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-1 flex-col">
        <header className="border-b border-gray-200 bg-white shadow-sm">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <button
              type="button"
              className="text-gray-500 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              {NAV.find((item) => isActive(item.href))?.name ?? 'Genel Bakış'}
            </h1>
            <button
              type="button"
              onClick={() => {
                void logout().then(() => router.replace(REHBER_LOGIN));
              }}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="h-4 w-4" />
              Çıkış
            </button>
          </div>
        </header>
        <main className="flex-1 bg-gray-50">
          <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
