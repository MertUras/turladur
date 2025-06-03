"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { signOut } from "next-auth/react";

function AuthContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const isPartnerPath = pathname?.startsWith('/partner');
    const isAuthPath = pathname?.startsWith('/login') || pathname?.startsWith('/register');
    const isPartnerAuthPath = pathname?.startsWith('/partner-login') || pathname?.startsWith('/partner-register');

    // Session durumunu kontrol et
    if (status === 'loading') return;

    // Partner oturumu varsa ve partner login/register sayfalarındaysak dashboard'a yönlendir
    if (session?.user?.provider === 'partner-credentials' && isPartnerAuthPath) {
      router.push('/partner-dashboard');
      return;
    }

    // Partner oturumu yoksa ve partner sayfalarına erişmeye çalışıyorsa login'e yönlendir
    if (isPartnerPath && !isPartnerAuthPath && !session?.user?.provider) {
      router.push('/partner-login');
      return;
    }

    // Normal kullanıcı oturumu varsa ve partner sayfasındaysak oturumu sonlandır
    if (isPartnerPath && !isPartnerAuthPath && session?.user?.provider !== 'partner-credentials') {
      signOut({ 
        redirect: false,
        callbackUrl: '/partner-login'
      });
      return;
    }

    // Session süresi kontrolü
    const sessionExpiry = session?.expires ? new Date(session.expires) : null;
    if (sessionExpiry && new Date() > sessionExpiry) {
      signOut({ 
        redirect: false,
        callbackUrl: isPartnerPath ? '/partner-login' : '/login'
      });
      return;
    }

  }, [pathname, session, status, router]);

  return <>{children}</>;
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AuthContent>{children}</AuthContent>
    </SessionProvider>
  );
} 