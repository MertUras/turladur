'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import BrandLogo from '@/app/components/BrandLogo';

export default function PartnerNavbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-neutral-100 bg-white/95 py-2 shadow-sm backdrop-blur-md">
      <div className="container mx-auto px-6">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="group inline-flex items-center gap-2">
            <BrandLogo
              variant="wordmark"
              surface="light"
              href={null}
              priority
            />
            <span className="text-sm font-semibold text-neutral-600">
              Partner
            </span>
          </Link>

          <div className="flex items-center space-x-2">
            <Link
              href="/partner-login"
              className={`rounded-md border px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 ${
                pathname === '/partner-login'
                  ? 'border-neutral-950 bg-neutral-100 text-neutral-950'
                  : 'border-neutral-950 text-neutral-950 hover:bg-neutral-100'
              }`}
            >
              Giriş Yap
            </Link>
            <Link
              href="/partner-register"
              className={`rounded-md px-3.5 py-1.5 text-sm font-medium shadow-sm transition-all duration-300 ${
                pathname === '/partner-register'
                  ? 'bg-neutral-950 text-white'
                  : 'bg-neutral-950 text-white hover:bg-neutral-800'
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
