"use client";

import { SessionProvider, useSession } from "next-auth/react";
import type { Session } from "next-auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { signOut } from "next-auth/react";
import { isCustomerSession, isPartnerSession } from "@/lib/auth/partner-session";

function AuthContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const signingOutRef = useRef(false);

  useEffect(() => {
    if (status === "loading") return;

    const isPartnerDashboardPath =
      pathname === "/partner-dashboard" || pathname?.startsWith("/partner-dashboard/");
    const isPartnerAuthPath =
      pathname === "/partner-login" ||
      pathname?.startsWith("/partner-register") ||
      pathname?.startsWith("/partner-verification");

    // Partner session on auth pages → send to dashboard (middleware is backup)
    if (isPartnerSession(session) && isPartnerAuthPath) {
      router.replace("/partner-dashboard");
      return;
    }

    // Customer session on partner dashboard → sign out once, then middleware sends to login
    if (
      isPartnerDashboardPath &&
      isCustomerSession(session) &&
      !signingOutRef.current
    ) {
      signingOutRef.current = true;
      void signOut({ redirect: false, callbackUrl: "/partner-login" });
    }
  }, [pathname, session, status, router]);

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
