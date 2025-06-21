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
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  const pathname = request.nextUrl.pathname;

  // Debug için log
  console.log('Middleware çalışıyor:', { 
    pathname, 
    tokenExists: !!token, 
    tokenDetails: {
      role: token?.role,
      provider: token?.provider,
      exp: token?.exp
    }
  });

  // Session cookie'sini kontrol et
  const sessionToken = request.cookies.get('next-auth.session-token')?.value;
  
  // Partner kullanıcısı için otomatik yönlendirme
  if (token?.provider === 'partner-credentials' && pathname === '/partner-login') {
    return NextResponse.redirect(new URL('/partner-dashboard', request.url));
  }

  // Partner dashboard erişim kontrolü
  if (partnerAuthRequiredPaths.some(path => pathname.startsWith(path))) {
    if (!token || !sessionToken) {
      return NextResponse.redirect(new URL('/partner-login', request.url));
    }

    // Token süresi kontrolü
    if (token?.exp && Date.now() >= (token.exp as number) * 1000) {
      const response = NextResponse.redirect(new URL('/partner-login', request.url));
      // Süresi dolmuş cookie'leri temizle
      response.cookies.delete('next-auth.session-token');
      response.cookies.delete('next-auth.csrf-token');
      return response;
    }

    // Rol kontrolü
    if ((token.role !== 'TOUR_OPERATOR' && token.role !== 'EXPERIENCE_PROVIDER') || token.provider !== 'partner-credentials') {
      return NextResponse.redirect(new URL('/partner-login', request.url));
    }

    // Alt kullanıcı yetki kontrolü
    if (!token.isMainUser) {
      console.log('Alt kullanıcı yetkileri kontrol ediliyor'); // Debug log
      const requiredPermissions = permissionRequiredPaths[pathname];
      if (requiredPermissions) {
        const hasPermission = requiredPermissions.some(
          (permission: string) => (token.permissions as Record<string, boolean>)?.[permission]
        );
        if (!hasPermission) {
          console.log('Yetersiz yetki, ana sayfaya yönlendiriliyor'); // Debug log
          return NextResponse.redirect(new URL('/partner-dashboard', request.url));
        }
      }
    }

    // Session'ı yenile
    const response = NextResponse.next();
    if (sessionToken) {
      response.cookies.set('next-auth.session-token', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60 // 30 gün
      });
    }
    return response;
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
    '/api/experiences/:path*',
    '/api/partner/:path*',
    '/profile/:path*',
    '/bookings/:path*',
    '/favorites/:path*',
    '/reviews/:path*',
    '/login',
    '/register',
  ],
}; 