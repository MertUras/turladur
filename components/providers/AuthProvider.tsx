"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { signOut } from "next-auth/react";

function AuthContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const isPartnerPath = pathname?.startsWith('/partner');
    const isAuthPath = pathname?.startsWith('/login') || pathname?.startsWith('/register');
    const isPartnerAuthPath = pathname?.startsWith('/partner-login') || pathname?.startsWith('/partner-register');

    // Partner oturumu varsa ve partner login/register sayfalarındaysak dashboard'a yönlendir
    if (session?.user?.provider === 'partner-credentials' && isPartnerAuthPath) {
      router.push('/partner-dashboard');
      return;
    }

    // Normal kullanıcı oturumu varsa ve partner sayfasındaysak oturumu sonlandır
    if (isPartnerPath && !isPartnerAuthPath && session?.user?.provider !== 'partner-credentials') {
      signOut({ redirect: false });
    }

    // Partner oturumu varsa ve normal kullanıcı sayfasındaysak oturumu koru
    // Partner oturumu varsa ve partner dashboard'a erişmeye çalışıyorsa direkt yönlendir
    if (session?.user?.provider === 'partner-credentials' && pathname === '/partner-dashboard') {
      return;
    }
  }, [pathname, session, router]);

  return <>{children}</>;
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      <AuthContent>{children}</AuthContent>
    </SessionProvider>
  );
} 