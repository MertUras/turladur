function envValue(key: string): string {
  const value = process.env[key];
  return typeof value === 'string' ? value.trim() : '';
}

function setEnv(key: string, value: string): void {
  // Bracket access avoids Next.js build-time env inlining on assignment targets.
  process.env[key] = value;
}

/**
 * Vercel Preview deploy'larında NEXTAUTH_URL otomatik türetir.
 * Yerelde .env.local değerleri aynen kullanılır.
 */
export function ensureAuthEnv(): void {
  const vercelUrl = envValue('VERCEL_URL');

  if (!envValue('NEXTAUTH_URL') && vercelUrl) {
    setEnv('NEXTAUTH_URL', `https://${vercelUrl}`);
  }

  const nextAuthUrl = envValue('NEXTAUTH_URL');
  if (!envValue('NEXT_PUBLIC_APP_URL') && nextAuthUrl) {
    setEnv('NEXT_PUBLIC_APP_URL', nextAuthUrl);
  }
}

/** SSR öncesi eksik zorunlu env'leri listeler (boş string = eksik). */
export function getMissingAuthEnv(): string[] {
  const missing: string[] = [];
  if (!envValue('DATABASE_URL')) missing.push('DATABASE_URL');
  if (!envValue('NEXTAUTH_SECRET')) missing.push('NEXTAUTH_SECRET');
  if (!envValue('NEXTAUTH_URL')) missing.push('NEXTAUTH_URL');
  return missing;
}
