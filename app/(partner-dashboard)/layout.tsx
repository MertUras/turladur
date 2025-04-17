'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ChartBarIcon, 
  CalendarIcon, 
  UsersIcon, 
  CogIcon, 
  HomeIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowLeftOnRectangleIcon,
  BuildingOfficeIcon,
  ChatBubbleLeftEllipsisIcon,
  ShieldCheckIcon,
  QuestionMarkCircleIcon,
  BellIcon
} from '@heroicons/react/24/outline';

interface SidebarLink {
  name: string;
  href: string;
  icon: React.ElementType;
}

const sidebarLinks: SidebarLink[] = [
  { name: 'Ana Sayfa', href: '/partner-dashboard', icon: HomeIcon },
  { name: 'Turlarım', href: '/partner-dashboard/tours', icon: BriefcaseIcon },
  { name: 'Rezervasyonlar', href: '/partner-dashboard/reservations', icon: CalendarIcon },
  { name: 'Müşteriler', href: '/partner-dashboard/customers', icon: UsersIcon },
  { name: 'Finansal Durum', href: '/partner-dashboard/financials', icon: CurrencyDollarIcon },
  { name: 'Raporlar', href: '/partner-dashboard/reports', icon: ChartBarIcon },
  { name: 'Yorumlar', href: '/partner-dashboard/reviews', icon: ChatBubbleLeftEllipsisIcon },
  { name: 'Ayarlar', href: '/partner-dashboard/settings', icon: CogIcon },
  { name: 'Yardım', href: '/partner-dashboard/help', icon: QuestionMarkCircleIcon },
];

export default function PartnerDashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  
  // Mobil cihazlarda menü açıldığında sayfanın kaydırılmasını engelle
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

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobil menü arkaplanı */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 transform transition duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        bg-gradient-to-b from-indigo-900 to-indigo-800
      `}>
        <div className="flex items-center justify-between h-20 px-6 bg-indigo-950">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <BuildingOfficeIcon className="h-8 w-8 text-indigo-300" />
              <span className="ml-3 text-xl font-semibold text-white">TourTech</span>
            </div>
          </div>
          <button
            type="button"
            className="lg:hidden text-gray-300 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto pt-5 px-3 pb-4">
          <div className="px-4 mb-6">
            <div className="flex items-center p-3 bg-indigo-800/50 rounded-xl">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                  PT
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Partner Test</p>
                <p className="text-xs text-indigo-300">Yönetici</p>
              </div>
            </div>
          </div>
          <nav className="space-y-1.5 px-3 flex-1">
            {sidebarLinks.map((item) => {
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200
                    ${isActive 
                      ? 'bg-indigo-700 text-white' 
                      : 'text-indigo-100 hover:bg-indigo-800/60 hover:text-white'}
                  `}
                >
                  <item.icon 
                    className={`
                      mr-3 h-5 w-5 transition-colors duration-200
                      ${isActive ? 'text-indigo-200' : 'text-indigo-400 group-hover:text-indigo-200'}
                    `} 
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="px-3 mt-6">
            <div className="px-4 py-3 bg-indigo-800/30 rounded-lg">
              <div className="flex items-center">
                <ShieldCheckIcon className="h-6 w-6 text-indigo-400" />
                <span className="ml-3 text-sm font-medium text-indigo-100">Partner Güvenlik</span>
              </div>
              <p className="mt-2 text-xs text-indigo-300">Hesabınızı daha güvenli hale getirmek için güvenlik ayarlarınızı güncelleyin.</p>
              <button className="mt-3 w-full px-3 py-1.5 bg-indigo-700 text-xs font-medium text-white rounded-md hover:bg-indigo-600 transition-colors">
                Ayarları Düzenle
              </button>
            </div>
          </div>
          <div className="p-3 mt-6">
            <Link
              href="/"
              className="group flex items-center px-4 py-3 text-sm font-medium rounded-lg text-indigo-100 hover:bg-indigo-800/60 hover:text-white transition-colors duration-200"
            >
              <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5 text-indigo-400 group-hover:text-indigo-200" />
              Çıkış Yap
            </Link>
          </div>
        </div>
      </div>

      {/* Ana içerik */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex h-16 items-center justify-between px-6">
            <button
              type="button"
              className="lg:hidden text-gray-500 focus:outline-none"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">
                {sidebarLinks.find(link => link.href === pathname)?.name || 'Partner Dashboard'}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-1.5 text-gray-500 rounded-full hover:text-gray-700 hover:bg-gray-100 focus:outline-none">
                <BellIcon className="h-6 w-6" />
              </button>
              <button className="p-1.5 text-gray-500 rounded-full hover:text-gray-700 hover:bg-gray-100 focus:outline-none">
                <QuestionMarkCircleIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="py-8 px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 