'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import type { Session } from 'next-auth';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { signOut } from 'next-auth/react';
import {
  isCustomerSession,
  isPartnerSession,
} from '@/lib/auth/partner-session';

const NEW_WEB_URL =
  process.env.NEXT_PUBLIC_APPS_WEB_URL ?? 'http://localhost:3001';

function AuthContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const signingOutRef = useRef(false);

  useEffect(() => {
    if (status === 'loading') return;

    const isPartnerDashboardPath =
      pathname === '/partner-dashboard' ||
      pathname?.startsWith('/partner-dashboard/');
    const isPartnerAuthPath =
      pathname === '/partner-login' ||
      pathname?.startsWith('/partner-register') ||
      pathname?.startsWith('/partner-verification');

    // Partner auth/dashboard → Nest apps/web (tek portal)
    if (
      isPartnerSession(session) &&
      (isPartnerAuthPath || isPartnerDashboardPath)
    ) {
      window.location.replace(`${NEW_WEB_URL}/login`);
      return;
    }

    // Customer session on partner dashboard → sign out once
    if (
      isPartnerDashboardPath &&
      isCustomerSession(session) &&
      !signingOutRef.current
    ) {
      signingOutRef.current = true;
      void signOut({ redirect: false }).then(() => {
        window.location.replace(`${NEW_WEB_URL}/login`);
      });
    }
  }, [pathname, session, status]);

  return <>{children}</>;
}

export default function AuthProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <AuthContent>{children}</AuthContent>
    </SessionProvider>
  );
}
