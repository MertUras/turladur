'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useEffect, useState } from 'react';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  X,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

import { BrandLogo } from '@/components/brand/brand-logo';
import { ApiError } from '@/services/api-client';
import { useAuth } from '@/providers/auth-provider';

const LOGIN_VISUAL =
  'https://images.unsplash.com/photo-1522199710521-72d69614c702?q=80&w=2072&auto=format&fit=crop';

function authErrorMessage(code: string | null): string | null {
  if (!code) return null;
  switch (code) {
    case 'CredentialsSignin':
    case 'AccessDenied':
      return 'E-posta veya şifre hatalı.';
    case 'SessionRequired':
      return 'Devam etmek için giriş yapın.';
    case 'AuthError':
      return 'Oturum doğrulanamadı. Lütfen tekrar giriş yapın.';
    default:
      return 'Giriş sırasında bir sorun oluştu. Lütfen tekrar deneyin.';
  }
}

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const fromQuery = authErrorMessage(searchParams.get('error'));
    if (fromQuery) setError(fromQuery);
  }, [searchParams]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    try {
      const user = await login(email, password);
      if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
        router.push('/admin/dashboard');
      } else if (user.role === 'PARTNER' || user.role === 'PARTNER_STAFF') {
        router.push('/partner/dashboard');
      } else {
        router.push('/tours');
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Giriş başarısız oldu');
    } finally {
      setPending(false);
    }
  }

  const baseInputClass =
    'block w-full rounded-lg border text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-offset-0 sm:text-sm transition duration-200 ease-in-out shadow-sm focus:bg-white';
  const inputPaddingClass = 'py-2.5 px-4';
  const inputIconPaddingClass = 'pl-9 pr-4';
  const normalBorderClass =
    'border-neutral-300 focus:border-neutral-950 focus:ring-neutral-300';
  const errorBorderClass =
    'border-red-300 focus:border-red-500 focus:ring-red-300';
  const labelClass = 'mb-1.5 block text-xs font-medium text-neutral-700';

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <div className="relative hidden lg:block lg:w-1/2">
        <Image
          src={LOGIN_VISUAL}
          alt="turta"
          fill
          priority
          className="object-cover"
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/85 via-neutral-900/80 to-neutral-950/85" />
        <div className="absolute bottom-0 left-0 z-10 p-12 text-white">
          <h1 className="mb-3 text-4xl font-bold leading-tight tracking-normal text-white">
            Seyahatinizi
            <br />
            Teknolojiyle Buluşturun.
          </h1>
          <p className="max-w-md text-lg font-light text-neutral-200/90">
            turta platformuna giriş yaparak tüm seyahat yönetimi araçlarınıza
            erişin.
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-white p-6 sm:p-12 lg:w-1/2 lg:p-16">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <Link href="/" className="group mb-6 inline-flex">
              <BrandLogo
                variant="wordmark"
                surface="light"
                href={null}
                className="transition-opacity group-hover:opacity-90"
              />
            </Link>
            <h2 className="mb-2 text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl">
              Hesabınıza Giriş Yapın
            </h2>
            <p className="text-xs text-neutral-500">
              Hesabın yok mu?{' '}
              <Link
                href="/register"
                className="font-medium text-neutral-950 underline-offset-2 transition-colors hover:text-neutral-800 hover:underline"
              >
                Hemen Oluştur
              </Link>
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error ? (
              <div className="flex items-start rounded-lg border border-red-200/80 bg-red-50/80 px-4 py-3 text-xs text-red-800 shadow-sm">
                <AlertCircle className="mr-2 mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                <span className="-mt-0.5 flex-1 leading-tight">{error}</span>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="-mr-1 ml-2 rounded-full p-0.5 text-red-400 hover:bg-red-100/70 hover:text-red-600"
                  aria-label="Hata mesajını kapat"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : null}

            <div>
              <label htmlFor="email" className={labelClass}>
                E-posta Adresi
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-4 w-4 text-neutral-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${baseInputClass} ${inputPaddingClass} ${inputIconPaddingClass} ${error ? errorBorderClass : normalBorderClass}`}
                  placeholder="ornek@mail.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className={labelClass}>
                Şifre
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-4 w-4 text-neutral-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${baseInputClass} ${inputPaddingClass} ${inputIconPaddingClass} pr-10 ${error ? errorBorderClass : normalBorderClass}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center rounded-r-lg px-3 text-neutral-400 hover:text-neutral-600"
                  aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-neutral-300 text-neutral-950 focus:ring-neutral-950 focus:ring-offset-0"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block select-none text-xs text-neutral-700"
                >
                  Beni hatırla
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-neutral-950 underline-offset-2 hover:underline"
              >
                Şifremi Unuttum?
              </Link>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="flex min-h-[40px] w-full items-center justify-center rounded-lg border border-transparent bg-neutral-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                'Giriş Yap'
              )}
            </button>
          </form>

          <div className="mt-6">
            <Link
              href="/partner/dashboard"
              className="flex items-center justify-center rounded-md bg-neutral-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Partner Portalına Git
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-neutral-50 text-neutral-600">
          Yükleniyor…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
