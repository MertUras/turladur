'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import BrandLogo from '@/app/components/BrandLogo';
import {
  ChartBarIcon,
  CalendarIcon,
  UsersIcon,
  CogIcon,
  HomeIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  GlobeAltIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ChatBubbleLeftEllipsisIcon,
  ShieldCheckIcon,
  QuestionMarkCircleIcon,
  BellIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { signOut, useSession } from 'next-auth/react';

interface SidebarLink {
  name: string;
  href: string;
  icon: React.ElementType;
  description?: string;
}

const sidebarLinks: SidebarLink[] = [
  {
    name: 'Dashboard',
    href: '/admin-dashboard',
    icon: HomeIcon,
    description: 'Genel istatistikler ve özet',
  },
  {
    name: 'Kullanıcı Yönetimi',
    href: '/admin-dashboard/users',
    icon: UsersIcon,
    description: 'Kullanıcı yönetimi',
  },
  {
    name: 'Tur Acentaları',
    href: '/admin-dashboard/agencies',
    icon: BuildingOfficeIcon,
    description: 'Tur acentaları yönetimi',
  },
  {
    name: 'Aktivite Acentaları',
    href: '/admin-dashboard/activity-operators',
    icon: UserGroupIcon,
    description: 'Aktivite acentaları yönetimi',
  },
  {
    name: 'Tur Rehberleri',
    href: '/admin-dashboard/guides',
    icon: UserGroupIcon,
    description: 'Tur rehberleri yönetimi',
  },
  {
    name: 'Turlar',
    href: '/admin-dashboard/tours',
    icon: GlobeAltIcon,
    description: 'Tur yönetimi',
  },
  {
    name: 'Rezervasyonlar',
    href: '/admin-dashboard/reservations',
    icon: ClipboardDocumentListIcon,
    description: 'Rezervasyon yönetimi',
  },
  {
    name: 'İstatistikler',
    href: '/admin-dashboard/statistics',
    icon: ChartBarIcon,
    description: 'İstatistikler ve raporlar',
  },
  {
    name: 'Ödemeler',
    href: '/admin-dashboard/payments',
    icon: CurrencyDollarIcon,
    description: 'Ödeme ve komisyon yönetimi',
  },
  {
    name: 'İçerik Yönetimi',
    href: '/admin-dashboard/content',
    icon: DocumentTextIcon,
    description: 'Blog ve sayfa yönetimi',
  },
  {
    name: 'Destek',
    href: '/admin-dashboard/support',
    icon: ChatBubbleLeftEllipsisIcon,
    description: 'Şikayet ve destek talepleri',
  },
  {
    name: 'Ayarlar',
    href: '/admin-dashboard/settings',
    icon: CogIcon,
    description: 'Sistem ayarları',
  },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [sidebarOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
        setShowProfileMenu(false);
        setShowNotifications(false);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (showProfileMenu || showNotifications) {
        const target = e.target as HTMLElement;
        if (!target.closest('[data-dropdown]')) {
          setShowProfileMenu(false);
          setShowNotifications(false);
        }
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [showProfileMenu, showNotifications]);

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Mobil menü arkaplanı */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        bg-white border-r border-gray-200
      `}
      >
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <BrandLogo
                variant="mark"
                surface="light"
                href={null}
                className="h-8 w-8"
              />
              <span className="text-lg font-semibold text-gray-900">turta</span>
            </div>
          </div>
          <button
            type="button"
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(false)}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="px-4 py-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Ara..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
          <div className="px-4 mb-6">
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                  {(session?.user?.name || 'Admin')
                    .split(' ')
                    .map((part) => part[0])
                    .join('')
                    .toUpperCase()}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {session?.user?.name || 'Admin'}
                </p>
                <p className="text-xs text-gray-500">Yönetici</p>
              </div>
            </div>
          </div>

          <div className="px-4 mb-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Ana Menü
            </h3>
          </div>

          <nav className="px-2 space-y-1">
            {sidebarLinks.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150
                    ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <item.icon
                    className={`
                      mr-3 h-5 w-5 transition-colors duration-150
                      ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}
                    `}
                  />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Ana içerik */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                className="text-gray-500 focus:outline-none hover:text-gray-700"
                onClick={() => setSidebarOpen(true)}
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            </div>

            <div className="flex items-center">
              <h1 className="text-lg font-semibold text-gray-900 hidden sm:block">
                {sidebarLinks.find((link) => link.href === pathname)?.name ||
                  'Admin Dashboard'}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Ara..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="relative" data-dropdown>
                <button
                  className="p-1.5 text-gray-600 rounded-lg hover:text-gray-900 hover:bg-gray-100 focus:outline-none relative"
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowProfileMenu(false);
                  }}
                >
                  <BellIcon className="h-6 w-6" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 origin-top-right">
                    <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900">
                        Bildirimler
                      </h3>
                      <button className="text-xs text-blue-600 hover:text-blue-800">
                        Tümünü Okundu İşaretle
                      </button>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      <div className="py-2 px-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <div className="flex">
                          <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <CalendarIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-gray-900 font-medium">
                              Yeni Rezervasyon
                            </p>
                            <p className="text-xs text-gray-500">
                              İstanbul Turu için yeni bir rezervasyon alındı.
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              12 dk önce
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-2 border-t border-gray-200">
                      <button className="w-full py-2 px-3 text-sm text-center text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        Tüm Bildirimleri Gör
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button className="p-1.5 text-gray-600 rounded-lg hover:text-gray-900 hover:bg-gray-100 focus:outline-none">
                <QuestionMarkCircleIcon className="h-6 w-6" />
              </button>

              <div className="relative ml-1" data-dropdown>
                <button
                  className="flex items-center text-gray-600 hover:text-gray-900 focus:outline-none"
                  onClick={() => {
                    setShowProfileMenu(!showProfileMenu);
                    setShowNotifications(false);
                  }}
                >
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold mr-1">
                    {(session?.user?.name || 'Admin')
                      .split(' ')
                      .map((part) => part[0])
                      .join('')
                      .toUpperCase()}
                  </div>
                  <span className="hidden md:block text-sm font-medium">
                    {session?.user?.name || 'Admin'}
                  </span>
                  <svg
                    className="h-5 w-5 ml-1 text-gray-400"
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

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 origin-top-right">
                    <div className="p-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {session?.user?.name || 'Admin'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {session?.user?.email || ''}
                      </p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/admin-dashboard/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profil ve Ayarlar
                      </Link>
                      <Link
                        href="/admin-dashboard/help"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Yardım ve Destek
                      </Link>
                    </div>
                    <div className="py-1 border-t border-gray-200">
                      <button
                        onClick={() => signOut({ callbackUrl: '/admin-login' })}
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <div className="flex items-center">
                          <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-2 text-gray-500" />
                          Çıkış Yap
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="py-6 px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
