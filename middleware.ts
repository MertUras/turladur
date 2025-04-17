import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

// Auth gerektiren sayfalar
const authRequiredPaths = [
  '/profile',
  '/bookings',
  '/favorites',
  '/settings',
  '/dashboard',
];

// Middleware
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // next-auth'tan JWT tokeni al
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  // Kullanıcı giriş yapmış mı?
  const isAuthenticated = !!token;
  
  // Kullanıcı giriş yapmışsa login ve register sayfalarına erişemez
  if (isAuthenticated && (pathname === '/login' || pathname === '/register' || pathname === '/forgot-password')) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Kullanıcı giriş yapmadan auth gerektiren sayfalara erişemez
  if (!isAuthenticated && authRequiredPaths.some(path => pathname.startsWith(path))) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

// Middleware sadece bu yollarda çalışacak
export const config = {
  matcher: [
    '/login', 
    '/register', 
    '/forgot-password',
    '/profile/:path*',
    '/bookings/:path*',
    '/favorites/:path*',
    '/settings/:path*',
    '/dashboard/:path*'
  ],
}; 