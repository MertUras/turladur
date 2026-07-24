import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import {
  getSessionCookieName,
  useSecureSessionCookies,
} from '@/lib/auth/session-cookie';

/** Nest apps/web — migration döneminde tek partner giriş noktası */
const NEW_WEB_URL =
  process.env.NEXT_PUBLIC_APPS_WEB_URL ?? 'http://localhost:3001';

const isPartnerDashboardPath = (pathname: string) =>
  pathname === '/partner-dashboard' ||
  pathname.startsWith('/partner-dashboard/');

function redirectToNewWeb(pathname: string) {
  return NextResponse.redirect(new URL(pathname, NEW_WEB_URL));
}

// Normal kullanıcı sayfaları için gerekli yollar
const userAuthRequiredPaths = [
  '/profile',
  '/bookings',
  '/checkout',
  '/favorites',
  '/reviews',
];

// Partner kullanıcılarının erişemeyeceği sayfalar
const partnerRestrictedPaths = [
  '/login',
  '/register',
  '/profile',
  '/bookings',
  '/favorites',
  '/reviews',
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Legacy partner → Nest apps/web (NextAuth partner-login artık kullanılmaz)
  if (pathname === '/partner-login') {
    return redirectToNewWeb('/login');
  }
  if (pathname === '/partner-register') {
    return redirectToNewWeb('/register');
  }
  if (isPartnerDashboardPath(pathname)) {
    const rest = pathname.replace(/^\/partner-dashboard\/?/, '') || 'dashboard';
    return redirectToNewWeb(`/partner/${rest}`);
  }

  const sessionCookieName = getSessionCookieName();

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: useSecureSessionCookies(),
    cookieName: sessionCookieName,
  });

  // Normal kullanıcı sayfaları için erişim kontrolü
  if (userAuthRequiredPaths.some((path) => pathname.startsWith(path))) {
    if (!token) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login';
      loginUrl.searchParams.set(
        'callbackUrl',
        pathname + request.nextUrl.search,
      );
      return NextResponse.redirect(loginUrl);
    }

    if (
      token.role === 'TOUR_OPERATOR' ||
      token.role === 'EXPERIENCE_PROVIDER'
    ) {
      return redirectToNewWeb('/partner/dashboard');
    }
  }

  // Partner kullanıcılarının erişemeyeceği sayfalar
  if (partnerRestrictedPaths.some((path) => pathname.startsWith(path))) {
    if (
      token?.role === 'TOUR_OPERATOR' ||
      token?.role === 'EXPERIENCE_PROVIDER'
    ) {
      return redirectToNewWeb('/partner/dashboard');
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/partner-dashboard/:path*',
    '/api/experiences/:path*',
    '/api/partner/:path*',
    '/profile/:path*',
    '/bookings/:path*',
    '/checkout/:path*',
    '/favorites/:path*',
    '/reviews/:path*',
    '/login',
    '/register',
    '/partner-login',
    '/partner-register',
  ],
};
