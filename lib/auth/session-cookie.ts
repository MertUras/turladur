/** NextAuth session cookie — middleware ve authOptions aynı ismi kullanmalı. */
export function useSecureSessionCookies(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function getSessionCookieName(): string {
  return useSecureSessionCookies()
    ? '__Secure-next-auth.session-token'
    : 'next-auth.session-token';
}
