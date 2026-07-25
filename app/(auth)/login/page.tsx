'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signIn, useSession, signOut } from 'next-auth/react';
import {
  ArrowRightIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import {
  ArrowRightIcon as ArrowRightIconSolid,
  EyeIcon as EyeIconSolid,
  EyeSlashIcon as EyeSlashIconSolid,
  ExclamationCircleIcon as ExclamationCircleIconSolid,
  XMarkIcon as XMarkIconSolid,
} from '@heroicons/react/20/solid';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

import BrandLogo from '@/app/components/BrandLogo';

// Placeholder for a cleaner visual
const loginVisual =
  'https://images.unsplash.com/photo-1522199710521-72d69614c702?q=80&w=2072&auto=format&fit=crop';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [callbackUrl, setCallbackUrl] = useState('/');
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const url = params.get('callbackUrl');
    if (url && url.startsWith('/')) {
      setCallbackUrl(url);
    }
  }, []);

  const handlePartnerPortalClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const newWeb =
      process.env.NEXT_PUBLIC_APPS_WEB_URL ?? 'http://localhost:3001';
    // Nest apps/web — legacy NextAuth partner-login kullanılmaz
    window.location.href = `${newWeb}/login`;
  };

  useEffect(() => {
    if (status !== 'authenticated') return;
    if (session?.user?.provider === 'partner-credentials') {
      const newWeb =
        process.env.NEXT_PUBLIC_APPS_WEB_URL ?? 'http://localhost:3001';
      window.location.replace(`${newWeb}/login`);
      return;
    }
    window.location.replace(callbackUrl);
  }, [status, session, callbackUrl]);

  // NextAuth "loading" sonsuza kadar kalmasın (çoklu next port kaosunda sık olur)
  const [sessionWaitTimedOut, setSessionWaitTimedOut] = useState(false);
  useEffect(() => {
    if (status !== 'loading') {
      setSessionWaitTimedOut(false);
      return;
    }
    const id = window.setTimeout(() => setSessionWaitTimedOut(true), 4000);
    return () => window.clearTimeout(id);
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        remember: rememberMe,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('Giriş yapılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Merkezi stil tanımlamaları
  const baseInputClass =
    'block w-full rounded-lg border text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-offset-0 sm:text-sm transition duration-200 ease-in-out shadow-sm focus:bg-white';
  const inputPaddingClass = 'py-2.5 px-4';
  const inputIconPaddingClass = 'pl-9 pr-4';
  const normalBorderClass =
    'border-neutral-300 focus:border-neutral-950 focus:ring-neutral-300';
  const errorBorderClass =
    'border-red-300 focus:border-red-500 focus:ring-red-300';
  const inputIconClass =
    'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none';
  const inputIconSvgClass = 'h-4 w-4 text-neutral-400';
  const labelClass = 'block text-xs font-medium text-neutral-700 mb-1.5';

  if (status === 'loading' && !sessionWaitTimedOut) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-neutral-950"></div>
      </div>
    );
  }

  // authenticated iken redirect çalışıyor; formu yine göster ki spinner'da kilitlenmesin
  if (status === 'authenticated') {
    const newWeb =
      process.env.NEXT_PUBLIC_APPS_WEB_URL ?? 'http://localhost:3001';
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-4 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-neutral-950" />
        <p className="text-sm text-neutral-600">Yönlendiriliyor…</p>
        <a
          href={`${newWeb}/login`}
          className="text-sm font-medium text-neutral-950 underline"
        >
          Partner girişine git (Nest)
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-neutral-50">
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src={loginVisual}
          alt="turta"
          layout="fill"
          objectFit="cover"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/85 via-neutral-900/80 to-neutral-950/85"></div>
        <div className="absolute bottom-0 left-0 p-12 text-white z-10">
          <h1 className="text-4xl font-bold text-white mb-3 leading-tight tracking-normal">
            Seyahatinizi
            <br />
            Teknolojiyle Buluşturun.
          </h1>
          <p className="text-lg text-neutral-200/90 max-w-md font-light">
            turta platformuna giriş yaparak tüm seyahat yönetimi araçlarınıza
            erişin.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <Link href="/" className="inline-flex mb-6 group">
              <BrandLogo
                variant="wordmark"
                surface="light"
                href={null}
                className="transition-opacity group-hover:opacity-90"
              />
            </Link>
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2 tracking-tight">
              Hesabınıza Giriş Yapın
            </h2>
            <p className="text-xs text-neutral-500">
              Hesabın yok mu?{' '}
              <Link
                href="/register"
                className="font-medium text-neutral-950 hover:text-neutral-800 hover:underline underline-offset-2 transition-colors duration-150"
              >
                Hemen Oluştur
              </Link>
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="flex items-start bg-red-50/80 border border-red-200/80 text-red-800 px-4 py-3 rounded-lg text-xs shadow-sm">
                <ExclamationCircleIconSolid className="w-4 h-4 mr-2 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="leading-tight flex-1 -mt-0.5">{error}</span>
                <button
                  type="button"
                  onClick={() => setError('')}
                  className="ml-2 -mr-1 p-0.5 text-red-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-100/70"
                  aria-label="Hata mesajını kapat"
                >
                  <XMarkIconSolid className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            <div>
              <label htmlFor="email" className={labelClass}>
                E-posta Adresi
              </label>
              <div className="relative">
                <div className={inputIconClass}>
                  <EnvelopeIcon className={inputIconSvgClass} />
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

            <div className="relative">
              <label htmlFor="password" className={labelClass}>
                Şifre
              </label>
              <div className="relative">
                <div className={inputIconClass}>
                  <LockClosedIcon className={inputIconSvgClass} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${baseInputClass} ${inputPaddingClass} ${inputIconPaddingClass} ${error ? errorBorderClass : normalBorderClass} pr-10`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-neutral-400 hover:text-neutral-600 transition-colors rounded-r-lg"
                  aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                >
                  {showPassword ? (
                    <EyeSlashIconSolid className="h-5 w-5" />
                  ) : (
                    <EyeIconSolid className="h-5 w-5" />
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
                  className="ml-2 block text-xs text-neutral-700 select-none"
                >
                  Beni hatırla
                </label>
              </div>
              <div className="text-xs">
                <Link
                  href="/forgot-password"
                  className="font-medium text-neutral-950 hover:text-neutral-800 hover:underline underline-offset-2 transition-colors duration-150"
                >
                  Şifremi Unuttum?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-neutral-950 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-950 transition-all duration-200 ease-in-out shadow-sm disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-[0.98] min-h-[40px]"
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <>Giriş Yap</>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative my-6">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-neutral-300"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-neutral-500 uppercase tracking-wide">
                  Veya
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={() => signIn('google', { callbackUrl: '/' })}
                className="w-full inline-flex justify-center items-center py-2.5 px-4 rounded-lg border border-neutral-300 bg-white text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors duration-150 shadow-sm"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 48 48">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  ></path>
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  ></path>
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  ></path>
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  ></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
                Google ile Devam Et
              </button>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href={
                (process.env.NEXT_PUBLIC_APPS_WEB_URL ??
                  'http://localhost:3001') + '/login'
              }
              onClick={handlePartnerPortalClick}
              className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-neutral-900 to-neutral-950 hover:from-neutral-800 hover:to-neutral-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-950"
            >
              Partner Portalına Git
              <ArrowRightIcon className="ml-2 -mr-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
