import { NextResponse } from 'next/server';

/**
 * Fail-safe middleware (risk minimization).
 *
 * Auth state şu an frontend'te memory'de (AuthProvider). Bu yüzden
 * cookie/refresh token adı net olmadan redirect yapmak yanlış yönlendirme
 * riski doğurabilir.
 *
 * Bu middleware korunan alanlarda "no-store" set ederek özel sayfaların
 * cache'den görünmesini azaltır; client-side auth akışı bozulmaz.
 */
export function middleware() {
  const response = NextResponse.next();
  response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
  return response;
}

export const config = {
  matcher: [
    '/partner/:path*',
    '/admin/:path*',
    '/profile',
    '/bookings',
    '/checkout',
  ],
};
