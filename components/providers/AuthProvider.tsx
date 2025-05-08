"use client";

import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    const isPartnerPath = pathname?.startsWith('/partner');
    const isAuthPath = pathname?.startsWith('/login') || pathname?.startsWith('/register');
    const isPartnerAuthPath = pathname?.startsWith('/partner-login') || pathname?.startsWith('/partner-register');

    // Partner sayfalarında normal kullanıcı oturumunu sonlandır
    if (isPartnerPath && !isPartnerAuthPath) {
      signOut({ redirect: false });
    }

    // Normal kullanıcı sayfalarında partner oturumunu sonlandır
    if (!isPartnerPath && !isPartnerAuthPath) {
      signOut({ redirect: false });
    }
  }, [pathname]);

  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      {children}
    </SessionProvider>
  );
} 