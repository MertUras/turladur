'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import {
  BarChart3,
  Calendar,
  CircleHelp,
  ClipboardList,
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
import { resolveMediaUrl } from '@/lib/media';
import { getPartnerProfile } from '@/services/partner-admin';
import { useAuth } from '@/providers/auth-provider';
import {
  canAccessStaffPermission,
  hasFullPartnerAccess,
  isSellerPanelRole,
} from '@/lib/partner-permissions';
import {
  resolvePartnerRouteAccess,
  type PartnerNavPermission,
} from '@/lib/partner-route-access';
import {
  ACENTE_DASHBOARD,
  ACENTE_LOGIN,
  ACENTE_PRIMARY_HREFS,
  ACENTE_ROUTES,
} from '@/lib/panel-routes';
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
    href: ACENTE_ROUTES.dashboard,
    icon: Home,
    permission: null,
  },
  {
    name: 'Turlar',
    href: ACENTE_ROUTES.tours,
    icon: Globe,
    permission: 'tours',
  },
  {
    name: 'Aktiviteler',
    href: ACENTE_ROUTES.experiences,
    icon: Globe,
    permission: 'tours',
  },
  {
    name: 'Rezervasyonlar',
    href: ACENTE_ROUTES.reservations,
    icon: Calendar,
    permission: 'reservations',
  },
  {
    name: 'Atamalar',
    href: ACENTE_ROUTES.assignments,
    icon: ClipboardList,
    description: 'Rehber / otobüs davetleri',
    permission: 'tours',
  },
  {
    name: 'Müşteriler',
    href: ACENTE_ROUTES.customers,
    icon: Users,
    permission: 'customers',
  },
  {
    name: 'Finansal Durum',
    href: ACENTE_ROUTES.financials,
    icon: Wallet,
    description: 'Gelir ve ödemeler',
    permission: 'reports',
  },
  {
    name: 'Raporlar',
    href: ACENTE_ROUTES.reports,
    icon: BarChart3,
    permission: 'reports',
  },
  {
    name: 'Kullanıcılar',
    href: ACENTE_ROUTES.users,
    icon: Users,
    permission: 'owner',
  },
  {
    name: 'Yorumlar',
    href: ACENTE_ROUTES.reviews,
    icon: MessageSquare,
    description: 'Müşteri değerlendirmeleri',
    permission: 'customers',
  },
  {
    name: 'Ayarlar',
    href: ACENTE_ROUTES.settings,
    icon: Cog,
    permission: 'owner',
  },
  {
    name: 'Yardım',
    href: ACENTE_ROUTES.help,
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

function AgencyAvatar({
  name,
  logoUrl,
  className,
}: {
  name: string;
  logoUrl: string | null;
  className: string;
}) {
  const [hasFailed, setHasFailed] = useState(false);
  const src = !hasFailed ? resolveMediaUrl(logoUrl) : null;

  if (src) {
    return (
      <div className={`${className} overflow-hidden`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setHasFailed(true)}
        />
      </div>
    );
  }

  return <div className={className}>{initials(name)}</div>;
}

/**
 * Agency shell — PartnerShell parity; Nest auth + /acente/* routes (P0-B).
 */
export function AgencyShell({ children }: { children: ReactNode }) {
  const {
    isAuthenticated,
    user,
    logout,
    accessToken,
    refreshProfile,
    isBootstrapping,
  } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [membershipTier, setMembershipTier] = useState<MembershipTier | null>(
    null,
  );
  const [agencyLogo, setAgencyLogo] = useState<string | null>(null);
  const [gate, setGate] = useState<'checking' | 'allowed' | 'denied'>(
    'checking',
  );

  const name = user ? displayName(user) : 'Acente';
  const roleLabel =
    user?.role === 'PARTNER_STAFF' || user?.role === 'AGENCY_STAFF'
      ? 'Personel'
      : user?.role === 'PARTNER' ||
          user?.role === 'AGENCY_OWNER' ||
          user?.role === 'AGENCY_ADMIN'
        ? 'Yönetici'
        : (user?.role ?? 'Yönetici');

  const isAgencyStaffActor =
    user?.role === 'AGENCY_OWNER' ||
    user?.role === 'AGENCY_ADMIN' ||
    user?.role === 'AGENCY_STAFF';

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
    ACENTE_PRIMARY_HREFS.includes(link.href),
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
    if (isBootstrapping) return;
    if (!accessToken || !user) {
      setGate('denied');
      router.replace(ACENTE_LOGIN);
      return;
    }
    if (!isSellerPanelRole(user.role)) {
      setGate('denied');
      router.replace('/');
      return;
    }
    setGate('allowed');
  }, [isBootstrapping, accessToken, user, router]);

  useEffect(() => {
    if (gate !== 'allowed' || !accessToken) return;
    // AgencyStaff has no User profile endpoint — keep synthetic session.
    if (isAgencyStaffActor) return;
    void refreshProfile().catch(() => undefined);
  }, [gate, accessToken, refreshProfile, isAgencyStaffActor]);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    void getPartnerProfile(accessToken)
      .then((profile) => {
        if (cancelled) return;
        const tier = (profile as { membershipTier?: MembershipTier | null })
          .membershipTier;
        setMembershipTier(tier ?? null);
        setAgencyLogo(resolveMediaUrl(profile.logo));

        // Legacy Partner users must be VERIFIED; AgencyStaff uses Agency status via API.
        if (user?.role === 'PARTNER' || user?.role === 'PARTNER_STAFF') {
          if (profile.status && profile.status !== 'VERIFIED') {
            logout();
            router.replace(ACENTE_LOGIN);
          }
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMembershipTier(null);
          setAgencyLogo(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [accessToken, user?.role, logout, router]);

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
        <p>Acente paneli için giriş gerekli…</p>
        <Link
          href={ACENTE_LOGIN}
          className="rounded-lg bg-neutral-950 px-4 py-2 text-sm font-semibold text-white"
        >
          Giriş sayfasına git
        </Link>
      </div>
    );
  }

  const isActive = (href: string) =>
    pathname === href ||
    (href !== ACENTE_DASHBOARD && pathname.startsWith(href));

  const pageTitle =
    SIDEBAR_LINKS.find((link) => isActive(link.href))?.name || 'Acente Paneli';

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
                Acente Portalı
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
              <AgencyAvatar
                name={name}
                logoUrl={agencyLogo}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold"
              />
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
                  footerHref={ACENTE_ROUTES.reservations}
                  footerLabel="Tüm Bildirimleri Gör"
                />
              </div>

              <Link
                href={ACENTE_ROUTES.help}
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
                  <AgencyAvatar
                    name={name}
                    logoUrl={agencyLogo}
                    className="mr-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700"
                  />
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
                          href={ACENTE_ROUTES.settings}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Profil ve Ayarlar
                        </Link>
                      ) : null}
                      {canSeeNavLink('reports') ? (
                        <Link
                          href={ACENTE_ROUTES.financials}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Ödemeler
                        </Link>
                      ) : null}
                      <Link
                        href={ACENTE_ROUTES.help}
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
                  ACENTE_DASHBOARD
                }
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

/** @deprecated Use AgencyShell — P0-B alias */
export const PartnerShell = AgencyShell;
