'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

const CONTENT_TABS = [
  { href: '/admin/content/blog', label: 'Blog Yönetimi' },
  { href: '/admin/content/activities', label: 'Aktivite Sayfası Yönetimi' },
  { href: '/admin/content/routes', label: 'Rota Yönetimi' },
];

export default function AdminContentLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">İçerik Yönetimi</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Blog yazıları, pazarlama sayfası kapakları ve rota SEO metinleri
      </p>
      <nav className="mt-6 flex gap-1 overflow-x-auto border-b border-neutral-200">
        {CONTENT_TABS.map((tab) => {
          const active =
            pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'shrink-0 border-b-2 px-3 py-2 text-sm font-medium',
                active
                  ? 'border-neutral-950 text-neutral-950'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800',
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-6">{children}</div>
    </div>
  );
}
