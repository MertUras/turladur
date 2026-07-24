'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import BrandLogo from '@/app/components/BrandLogo';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 border-b border-neutral-200/80 shadow-sm py-2.5 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          <BrandLogo variant="wordmark" surface="light" priority />

          <div className="flex items-center space-x-2">
            <Link
              href="/login"
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors duration-200 ease-out ${
                pathname === '/login'
                  ? 'bg-neutral-100 text-neutral-950'
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
              }`}
            >
              Giriş Yap
            </Link>
            <Link
              href="/register"
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors duration-200 ease-out border ${
                pathname === '/register'
                  ? 'bg-neutral-950 text-white border-neutral-950 shadow-sm'
                  : 'bg-neutral-950 text-white border-neutral-950 hover:bg-neutral-800 hover:border-neutral-800'
              }`}
            >
              Kayıt Ol
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
