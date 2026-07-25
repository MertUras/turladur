'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import {
  BarChart3,
  Calendar,
  CircleHelp,
  Cog,
  Globe,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  ShieldCheck,
  Users,
  Wallet,
  X,
} from 'lucide-react';

import { BrandLogo } from '@/components/brand/brand-logo';
import { NotificationBell } from '@/components/layout/notification-bell';
import {
  MembershipBadge,
  type MembershipTier,
} from '@/components/features/partner-dashboard/membership-badge';
import { PartnerForbidden } from '@/components/features/partner-dashboard/partner-forbidden';
import { getPartnerProfile } from '@/services/partner-admin';
import { useAuth } from '@/providers/auth-provider';
import {
  canAccessStaffPermission,
  hasFullPartnerAccess,
} from '@/lib/partner-permissions';
import {
  resolvePartnerRouteAccess,
  type PartnerNavPermission,
} from '@/lib/partner-route-access';
import { cn } from '@/lib/utils';

type SidebarLink = {
  name: string;
  href: string;
  icon: React.ElementType;
  description?: string;
  /** null = always; owner = partner only; else staff permission key */
  permission: PartnerNavPermission;
};

const SIDEBAR_LINKS: SidebarLink[] = [
  {
    name: 'Genel Bakış',
    href: '/partner/dashboard',
    icon: Home,
    permission: null,
  },
  { name: 'Turlar', href: '/partner/tours', icon: Globe, permission: 'tours' },
  {
    name: 'Aktiviteler',
    href: '/partner/experiences',
    icon: Globe,
    permission: 'tours',
  },
  {
    name: 'Rezervasyonlar',
    href: '/partner/reservations',
    icon: Calendar,
    permission: 'reservations',
  },
  {
    name: 'Müşteriler',
    href: '/partner/customers',
    icon: Users,
    permission: 'customers',
  },
  {
    name: 'Finansal Durum',
    href: '/partner/financials',
    icon: Wallet,
    description: 'Gelir ve ödemeler',
    permission: 'reports',
  },
  {
    name: 'Raporlar',
    href: '/partner/reports',
    icon: BarChart3,
    permission: 'reports',
  },
  {
    name: 'Kullanıcılar',
    href: '/partner/users',
    icon: Users,
    permission: 'owner',
  },
  {
    name: 'Yorumlar',
    href: '/partner/reviews',
    icon: MessageSquare,
    description: 'Müşteri değerlendirmeleri',
    permission: 'customers',
  },
  {
    name: 'Ayarlar',
    href: '/partner/settings',
    icon: Cog,
    permission: 'owner',
  },
  {
    name: 'Yardım',
    href: '/partner/help',
    icon: CircleHelp,
    description: 'Destek ve yardım',
    permission: null,
  },
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

/**
 * Partner shell — legacy sidebar layout; Nest auth + /partner/* routes.
 */
export function PartnerShell({ children }: { children: ReactNode }) {
  const { isAuthenticated, user, logout, accessToken, refreshProfile } =
    useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [membershipTier, setMembershipTier] = useState<MembershipTier | null>(
    null,
  );
  const [gate, setGate] = useState<'checking' | 'allowed' | 'denied'>(
    'checking',
  );

  const name = user ? displayName(user) : 'Partner';
  const roleLabel =
    user?.role === 'PARTNER_STAFF'
      ? 'Personel'
      : user?.role === 'PARTNER'
        ? 'Yönetici'
        : 'Yönetici';

  const canSeeNavLink = (permission: PartnerNavPermission): boolean => {
    if (!user) return false;
    if (permission === null) return true;
    if (permission === 'owner') return hasFullPartnerAccess(user.role);
    return canAccessStaffPermission(user.role, user.permissions, permission);
  };

  const visibleLinks = SIDEBAR_LINKS.filter((link) =>
    canSeeNavLink(link.permission),
  );
  const primaryLinks = visibleLinks.filter((link) =>
    [
      '/partner/dashboard',
      '/partner/tours',
      '/partner/experiences',
      '/partner/reservations',
      '/partner/customers',
      '/partner/financials',
      '/partner/reports',
    ].includes(link.href),
  );
  const secondaryLinks = visibleLinks.filter(
    (link) => !primaryLinks.includes(link),
  );

  const routeAccess = resolvePartnerRouteAccess(pathname);
  const canAccessCurrentRoute = (() => {
    if (!user) return false;
    if (routeAccess === null) return true;
    if (routeAccess === 'owner') return hasFullPartnerAccess(user.role);
    return canAccessStaffPermission(user.role, user.permissions, routeAccess);
  })();

  useEffect(() => {
    if (!accessToken || !user) {
      setGate('denied');
      router.replace('/login');
      return;
    }
    if (
      user.role !== 'PARTNER' &&
      user.role !== 'PARTNER_STAFF' &&
      user.role !== 'ADMIN' &&
      user.role !== 'SUPER_ADMIN'
    ) {
      setGate('denied');
      router.replace('/');
      return;
    }
    setGate('allowed');
  }, [accessToken, user, router]);

  useEffect(() => {
    if (gate !== 'allowed' || !accessToken) return;
    void refreshProfile().catch(() => undefined);
  }, [gate, accessToken, refreshProfile]);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    void getPartnerProfile(accessToken)
      .then((profile) => {
        if (cancelled) return;
        const tier = (profile as { membershipTier?: MembershipTier | null })
          .membershipTier;
        setMembershipTier(tier ?? null);
      })
      .catch(() => {
        if (!cancelled) setMembershipTier(null);
      });
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [sidebarOpen]);

  useEffect(() => {
    setSidebarOpen(false);
    setShowProfileMenu(false);
  }, [pathname]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
        setShowProfileMenu(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (showProfileMenu) {
        const target = e.target as HTMLElement;
        if (!target.closest('[data-dropdown]')) {
          setShowProfileMenu(false);
        }
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [showProfileMenu]);

  if (gate !== 'allowed' || !isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center text-neutral-600">
        <p>Partner paneli için giriş gerekli…</p>
        <Link
          href="/login"
          className="rounded-lg bg-neutral-950 px-4 py-2 text-sm font-semibold text-white"
        >
          Giriş sayfasına git
        </Link>
      </div>
    );
  }

  const isActive = (href: string) =>
    pathname === href ||
    (href !== '/partner/dashboard' && pathname.startsWith(href));

  const pageTitle =
    SIDEBAR_LINKS.find((link) => isActive(link.href))?.name ||
    'Partner Dashboard';

  const renderNavItem = (item: SidebarLink) => {
    const active = isActive(item.href);
    return (
      <Link
        key={item.name}
        href={item.href}
        className={cn(
          'group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150',
          active
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
        )}
      >
        <item.icon
          className={cn(
            'mr-3 h-5 w-5 transition-colors duration-150',
            active
              ? 'text-blue-600'
              : 'text-gray-400 group-hover:text-gray-500',
          )}
        />
        <span className="truncate">{item.name}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {sidebarOpen ? (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-gray-200 transition duration-300 ease-in-out lg:static lg:inset-0 lg:translate-x-0',
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
                Partner Portal
              </span>
            </div>
          </div>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="px-4 pt-3">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Ara..."
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto pb-4 pt-5">
          <div className="mb-6 px-4">
            <div className="flex items-center rounded-lg bg-blue-50 p-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold">
                {initials(name)}
              </div>
              <div className="ml-3 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {name}
                  </p>
                  <MembershipBadge tier={membershipTier} />
                </div>
                <p className="text-xs text-gray-500">{roleLabel}</p>
              </div>
            </div>
          </div>

          <div className="mb-2 px-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Ana Menü
            </h3>
          </div>
          <nav className="flex-1 space-y-1 px-3">
            {primaryLinks.map(renderNavItem)}
          </nav>

          {secondaryLinks.length > 0 ? (
            <>
              <div className="mb-2 mt-6 px-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Diğer
                </h3>
              </div>
              <nav className="space-y-1 px-3">
                {secondaryLinks.map(renderNavItem)}
              </nav>
            </>
          ) : null}

          <div className="mt-6 px-3">
            <div className="rounded-lg bg-blue-50 p-4">
              <div className="flex">
                <ShieldCheck className="h-6 w-6 text-blue-600" />
                <span className="ml-2 text-sm font-medium text-gray-900">
                  Premium
                </span>
                <span className="ml-1.5 rounded bg-blue-100 px-1.5 py-0.5 text-xs font-semibold text-blue-800">
                  Aktif
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-600">
                Premium özellikleriniz aktif durumda. Tüm avantajlardan
                yararlanabilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <header className="border-b border-gray-200 bg-white shadow-sm">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            <div className="flex items-center">
              <h1 className="hidden text-lg font-semibold text-gray-900 sm:block">
                {pageTitle}
              </h1>
            </div>

            <div className="flex items-center space-x-1">
              <div className="relative mr-3 hidden md:block">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Ara..."
                  className="block w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="relative mr-1">
                <NotificationBell
                  solid
                  footerHref="/partner/reservations"
                  footerLabel="Tüm Bildirimleri Gör"
                />
              </div>

              <Link
                href="/partner/help"
                className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
              >
                <CircleHelp className="h-6 w-6" />
              </Link>

              <div className="relative ml-1" data-dropdown>
                <button
                  type="button"
                  className="flex items-center text-gray-600 hover:text-gray-900 focus:outline-none"
                  onClick={() => {
                    setShowProfileMenu(!showProfileMenu);
                  }}
                >
                  <div className="mr-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                    {initials(name)}
                  </div>
                  <span className="hidden items-center gap-1.5 text-sm font-medium md:flex">
                    {name}
                    <MembershipBadge tier={membershipTier} />
                  </span>
                  <svg
                    className="ml-1 h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showProfileMenu ? (
                  <div className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-lg border border-gray-200 bg-white shadow-lg">
                    <div className="border-b border-gray-200 p-3">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {name}
                        </p>
                        <MembershipBadge tier={membershipTier} />
                      </div>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      {canSeeNavLink('owner') ? (
                        <Link
                          href="/partner/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Profil ve Ayarlar
                        </Link>
                      ) : null}
                      {canSeeNavLink('reports') ? (
                        <Link
                          href="/partner/financials"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Ödemeler
                        </Link>
                      ) : null}
                      <Link
                        href="/partner/help"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Yardım ve Destek
                      </Link>
                      <Link
                        href="/"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Siteye Dön
                      </Link>
                    </div>
                    <div className="border-t border-gray-200 py-1">
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          router.replace('/login');
                        }}
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <div className="flex items-center">
                          <LogOut className="mr-2 h-4 w-4 text-gray-500" />
                          Çıkış Yap
                        </div>
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 bg-gray-50">
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            {canAccessCurrentRoute ? (
              children
            ) : (
              <PartnerForbidden
                fallbackHref={
                  primaryLinks[0]?.href ??
                  secondaryLinks[0]?.href ??
                  '/partner/dashboard'
                }
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
