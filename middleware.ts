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

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Partner sayfalarına erişim kontrolü
  if (partnerAuthRequiredPaths.some(path => pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL('/partner-login', request.url));
    }

    // Partner olmayan kullanıcıları engelle
    if (token.provider !== 'partner-credentials') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  }

  // Normal kullanıcı sayfalarına erişim kontrolü
  if (userAuthRequiredPaths.some(path => pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Partner kullanıcılarını engelle
    if (token.provider === 'partner-credentials') {
      return NextResponse.redirect(new URL('/partner-dashboard', request.url));
    }

    return NextResponse.next();
  }

  // Partner kullanıcılarının erişemeyeceği sayfalar için kontrol
  if (partnerRestrictedPaths.some(path => pathname === path || pathname.startsWith(path))) {
    if (token && token.provider === 'partner-credentials') {
      return NextResponse.redirect(new URL('/partner-dashboard', request.url));
    }
  }

  // Partner giriş/kayıt sayfalarına erişim kontrolü
  if (pathname.startsWith('/partner-login') || pathname.startsWith('/partner-register')) {
    if (token) {
      if (token.provider === 'partner-credentials') {
        return NextResponse.redirect(new URL('/partner-dashboard', request.url));
      } else {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
    return NextResponse.next();
  }

  // Normal kullanıcı giriş/kayıt sayfalarına erişim kontrolü
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    if (token) {
      if (token.provider === 'partner-credentials') {
        return NextResponse.redirect(new URL('/partner-dashboard', request.url));
      } else {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
    return NextResponse.next();
  }

  // Ana sayfa ve diğer sayfalar için partner oturumunu temizle
  if (token && token.provider === 'partner-credentials') {
    const response = NextResponse.next();
    response.cookies.delete('next-auth.session-token');
    response.cookies.delete('next-auth.callback-url');
    response.cookies.delete('next-auth.csrf-token');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/partner-dashboard/:path*',
    '/partner-login',
    '/partner-register',
    '/profile/:path*',
    '/bookings/:path*',
    '/favorites/:path*',
    '/reviews/:path*',
    '/login',
    '/register',
  ],
}; 