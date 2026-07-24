import { NextRequest, NextResponse } from 'next/server';

/** Legacy NextAuth sign-in URL → Nest login. */
export function GET(request: NextRequest) {
  const url = new URL('/login', request.url);
  const callbackUrl = request.nextUrl.searchParams.get('callbackUrl');
  if (callbackUrl) url.searchParams.set('callbackUrl', callbackUrl);
  return NextResponse.redirect(url);
}
