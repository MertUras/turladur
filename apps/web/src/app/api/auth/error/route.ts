import { NextRequest, NextResponse } from 'next/server';

/** Legacy NextAuth error URL → Nest login (no NextAuth on apps/web). */
export function GET(request: NextRequest) {
  const error = request.nextUrl.searchParams.get('error');
  const url = new URL('/login', request.url);
  if (error) url.searchParams.set('error', error);
  else url.searchParams.set('error', 'AuthError');
  return NextResponse.redirect(url);
}
