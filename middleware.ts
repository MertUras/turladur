import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

// Partner sayfaları için gerekli yollar
const partnerAuthRequiredPaths = [
  '/partner-dashboard',
  '/partner-dashboard/tours',
  '/partner-dashboard/reservations',
  '/partner-dashboard/customers',
  '/partner-dashboard/financials',
  '/partner-dashboard/reports',
  '/partner-dashboard/reviews',
  '/partner-dashboard/settings',
  '/partner-dashboard/help',
  '/partner-dashboard/users',
];

// Normal kullanıcı sayfaları için gerekli yollar
const userAuthRequiredPaths = [
  '/profile',
  '/bookings',
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
  const token = await getToken({ req: request });
  const pathname = request.nextUrl.pathname;

  // Partner dashboard erişim kontrolü
  if (partnerAuthRequiredPaths.some(path => pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL('/partner-login', request.url));
    }

    if (token.role !== 'TOUR_OPERATOR') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Alt kullanıcı yetki kontrolü
    if (!token.isMainUser) {
      const requiredPermissions = permissionRequiredPaths[pathname];
      if (requiredPermissions) {
        const hasPermission = requiredPermissions.some(
          (permission: string) => (token.permissions as Record<string, boolean>)?.[permission]
        );
        if (!hasPermission) {
          return NextResponse.redirect(new URL('/partner-dashboard', request.url));
        }
      }
    }
  }

  // Normal kullanıcı sayfaları için erişim kontrolü
  if (userAuthRequiredPaths.some(path => pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token.role === 'TOUR_OPERATOR') {
      return NextResponse.redirect(new URL('/partner-dashboard', request.url));
    }
  }

  // Partner kullanıcılarının erişemeyeceği sayfalar
  if (partnerRestrictedPaths.some(path => pathname.startsWith(path))) {
    if (token?.role === 'TOUR_OPERATOR') {
      return NextResponse.redirect(new URL('/partner-dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/partner-dashboard/:path*',
    '/profile/:path*',
    '/bookings/:path*',
    '/favorites/:path*',
    '/reviews/:path*',
    '/login',
    '/register',
  ],
}; 