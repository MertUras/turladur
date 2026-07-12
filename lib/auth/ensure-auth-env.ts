/**
 * Vercel Preview deploy'larında NEXTAUTH_URL otomatik türetir.
 * Yerelde .env.local değerleri aynen kullanılır.
 */
export function ensureAuthEnv(): void {
  const vercelUrl = process.env.VERCEL_URL?.trim();

  if (!process.env.NEXTAUTH_URL?.trim() && vercelUrl) {
    process.env.NEXTAUTH_URL = `https://${vercelUrl}`;
  }

  if (!process.env.NEXT_PUBLIC_APP_URL?.trim() && process.env.NEXTAUTH_URL?.trim()) {
    process.env.NEXT_PUBLIC_APP_URL = process.env.NEXTAUTH_URL;
  }
}

/** SSR öncesi eksik zorunlu env'leri listeler (boş string = eksik). */
export function getMissingAuthEnv(): string[] {
  const missing: string[] = [];
  if (!process.env.DATABASE_URL?.trim()) missing.push("DATABASE_URL");
  if (!process.env.NEXTAUTH_SECRET?.trim()) missing.push("NEXTAUTH_SECRET");
  if (!process.env.NEXTAUTH_URL?.trim()) missing.push("NEXTAUTH_URL");
  return missing;
}
