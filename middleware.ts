import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

const isPartnerDashboardPath = (pathname: string) =>
  pathname === '/partner-dashboard' || pathname.startsWith('/partner-dashboard/');

function redirectTo(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = '';
  return NextResponse.redirect(url);
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

// Yetki gerektiren sayfalar ve gerekli izinler
const permissionRequiredPaths: Record<string, string[]> = {
  '/partner-dashboard/tours': ['tours'],
  '/partner-dashboard/reservations': ['reservations'],
  '/partner-dashboard/customers': ['customers'],
  '/partner-dashboard/reports': ['reports'],
  '/partner-dashboard/users': ['users'],
};

export async function middleware(request: NextRequest) {
  const useSecureCookies = process.env.NODE_ENV === 'production';
  const sessionCookieName = useSecureCookies
    ? '__Secure-next-auth.session-token'
    : 'next-auth.session-token';

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: useSecureCookies,
    cookieName: sessionCookieName,
  });

  const pathname = request.nextUrl.pathname;
  const isPartnerUser =
    token?.provider === 'partner-credentials' &&
    (token.role === 'TOUR_OPERATOR' || token.role === 'EXPERIENCE_PROVIDER');

  // Partner kullanıcısı için otomatik yönlendirme
  if (isPartnerUser && pathname === '/partner-login') {
    return redirectTo(request, '/partner-dashboard');
  }

  // Partner dashboard erişim kontrolü
  if (isPartnerDashboardPath(pathname)) {
    if (!token) {
      return redirectTo(request, '/partner-login');
    }

    // Token süresi kontrolü
    if (token?.exp && Date.now() >= (token.exp as number) * 1000) {
      const response = redirectTo(request, '/partner-login');
      response.cookies.delete(sessionCookieName);
      response.cookies.delete('next-auth.csrf-token');
      return response;
    }

    // Rol kontrolü
    if (!isPartnerUser) {
      return redirectTo(request, '/partner-login');
    }

    // Alt kullanıcı yetki kontrolü
    if (!token.isMainUser) {
      const requiredPermissions = permissionRequiredPaths[pathname];
      if (requiredPermissions) {
        const hasPermission = requiredPermissions.some(
          (permission: string) => (token.permissions as Record<string, boolean>)?.[permission]
        );
        if (!hasPermission) {
          return redirectTo(request, '/partner-dashboard');
        }
      }
    }

    return NextResponse.next();
  }

  // Normal kullanıcı sayfaları için erişim kontrolü
  if (userAuthRequiredPaths.some(path => pathname.startsWith(path))) {
    if (!token) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login';
      loginUrl.searchParams.set('callbackUrl', pathname + request.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }

    if (token.role === 'TOUR_OPERATOR' || token.role === 'EXPERIENCE_PROVIDER') {
      return redirectTo(request, '/partner-dashboard');
    }
  }

  // Partner kullanıcılarının erişemeyeceği sayfalar
  if (partnerRestrictedPaths.some(path => pathname.startsWith(path))) {
    if (token?.role === 'TOUR_OPERATOR' || token?.role === 'EXPERIENCE_PROVIDER') {
      return redirectTo(request, '/partner-dashboard');
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
  ],
}; 