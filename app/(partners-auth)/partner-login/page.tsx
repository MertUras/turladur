'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { isPartnerSession } from '@/lib/auth/partner-session';
import {
  ArrowRightIcon as ArrowRightIconSolid,
  EyeIcon as EyeIconSolid,
  EyeSlashIcon as EyeSlashIconSolid,
  ExclamationCircleIcon as ExclamationCircleIconSolid,
  XMarkIcon,
  CheckCircleIcon as CheckCircleIconSolid,
  ClockIcon as ClockIconSolid,
  XCircleIcon as XCircleIconSolid,
  ShieldExclamationIcon as ShieldExclamationIconSolid,
} from '@heroicons/react/20/solid';
import {
  ArrowRightIcon,
  EnvelopeIcon,
  LockClosedIcon,
  BriefcaseIcon,
  ChartBarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

import BrandLogo from '@/app/components/BrandLogo';

export default function PartnerLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accountStatus, setAccountStatus] = useState<
    'PENDING' | 'REJECTED' | 'SUSPENDED' | null
  >(null);
  const [rememberMe, setRememberMe] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (isPartnerSession(session)) {
      router.replace('/partner-dashboard');
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('partner-credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/partner-dashboard',
      });

      if (result?.error) {
        // API'den gelen hata mesajını kontrol et
        if (result.error.includes('onaylanmamış')) {
          setAccountStatus('PENDING');
        } else if (result.error.includes('reddedilmiş')) {
          setAccountStatus('REJECTED');
        } else if (result.error.includes('askıya alınmış')) {
          setAccountStatus('SUSPENDED');
        }
        setError(result.error);
      } else if (result?.ok) {
        router.replace('/partner-dashboard');
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusMessage = () => {
    switch (accountStatus) {
      case 'PENDING':
        return {
          icon: ClockIconSolid,
          color: 'yellow',
          message: 'Hesabınız onay bekliyor. Lütfen admin onayını bekleyin.',
        };
      case 'REJECTED':
        return {
          icon: XCircleIconSolid,
          color: 'red',
          message:
            'Hesabınız reddedilmiş. Daha fazla bilgi için lütfen bizimle iletişime geçin.',
        };
      case 'SUSPENDED':
        return {
          icon: ShieldExclamationIconSolid,
          color: 'orange',
          message:
            'Hesabınız askıya alınmış. Daha fazla bilgi için lütfen bizimle iletişime geçin.',
        };
      default:
        return null;
    }
  };

  const statusInfo = getStatusMessage();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-neutral-950"></div>
      </div>
    );
  }

  if (status === 'authenticated' && isPartnerSession(session)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-neutral-950"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50 pt-16 lg:flex-row">
      <div className="relative hidden min-h-[420px] overflow-hidden lg:block lg:min-h-[calc(100vh-4rem)] lg:w-1/2">
        <Image
          src="https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="İş Ortaklığı Platformu"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-neutral-900/90 via-neutral-900/85 to-neutral-950/90"></div>

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-12 text-center">
          <div className="max-w-lg space-y-4">
            <h2 className="text-4xl xl:text-5xl font-bold text-white mb-5 leading-tight tracking-normal">
              Partner Portalına Hoş Geldiniz
            </h2>
            <p className="mb-6 text-lg font-light text-neutral-200/90">
              turta Partner portalı ile tüm işlemlerinizi kolayca yönetin,
              rezervasyonları takip edin ve gelirlerinizi artırın.
            </p>

            <div className="space-y-3">
              {[
                {
                  icon: BriefcaseIcon,
                  title: 'Rezervasyon Yönetimi',
                  desc: 'Tüm rezervasyonları tek bir yerden kolayca yönetin.',
                },
                {
                  icon: ChartBarIcon,
                  title: 'Gelişmiş Raporlama',
                  desc: 'Detaylı performans analizleri ve finansal raporlar.',
                },
                {
                  icon: ClockIcon,
                  title: '7/24 Destek',
                  desc: 'Uzman ekibimizden ihtiyacınız olduğunda destek alın.',
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group flex items-start bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/15 text-left shadow-sm transition-all duration-200 ease-out hover:bg-white/15 hover:border-white/25"
                >
                  <div className="bg-white/20 p-2.5 rounded-lg mr-4 mt-0.5 flex-shrink-0 shadow-sm">
                    <feature.icon className="h-5 w-5 text-white opacity-90" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm mb-0.5">
                      {feature.title}
                    </h3>
                    <p className="text-xs leading-snug text-neutral-200/80">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-1 items-center justify-center p-6 sm:p-12 lg:w-1/2 lg:p-16">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <Link
              href="/"
              className="group mb-6 inline-flex items-center gap-2"
            >
              <BrandLogo
                variant="wordmark"
                surface="light"
                href={null}
                className="transition-opacity group-hover:opacity-90"
              />
              <span className="text-sm font-semibold text-neutral-600">
                Partner
              </span>
            </Link>
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2 tracking-tight">
              İş Ortağı Girişi
            </h2>
            <p className="text-sm text-neutral-500">
              Hesabınıza giriş yaparak partner paneline erişin.
            </p>
          </div>

          {error && (
            <div
              className={`mb-5 flex items-start ${
                accountStatus
                  ? accountStatus === 'PENDING'
                    ? 'bg-yellow-50/80 border-yellow-200/80 text-yellow-800'
                    : accountStatus === 'REJECTED'
                      ? 'bg-red-50/80 border-red-200/80 text-red-800'
                      : 'bg-orange-50/80 border-orange-200/80 text-orange-800'
                  : 'bg-red-50/80 border-red-200/80 text-red-800'
              } border px-4 py-3 rounded-lg text-xs shadow-sm`}
            >
              {statusInfo ? (
                <statusInfo.icon
                  className={`w-4 h-4 mr-2 text-${statusInfo.color}-500 flex-shrink-0 mt-0.5`}
                />
              ) : (
                <ExclamationCircleIconSolid className="w-4 h-4 mr-2 text-red-500 flex-shrink-0 mt-0.5" />
              )}
              <span className="leading-tight flex-1 -mt-0.5">{error}</span>
              <button
                onClick={() => {
                  setError('');
                  setAccountStatus(null);
                }}
                className="ml-2 -mr-1 p-0.5 text-red-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-100/70"
                aria-label="Hata mesajını kapat"
              >
                <XMarkIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-neutral-700 mb-1.5"
              >
                E-posta Adresi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-4 w-4 text-neutral-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full rounded-lg border ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-300' : 'border-neutral-300 focus:border-neutral-950 focus:ring-neutral-300'} py-2.5 pl-9 pr-4 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-offset-0 sm:text-sm transition duration-200 ease-in-out shadow-sm focus:bg-white`}
                  placeholder="partner@sirketiniz.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-neutral-700"
                >
                  Şifre
                </label>
                <Link
                  href="/partner-forgot-password"
                  className="text-xs font-medium text-neutral-950 hover:text-neutral-800 hover:underline underline-offset-2 transition-colors duration-150"
                >
                  Şifrenizi mi unuttunuz?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-4 w-4 text-neutral-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full rounded-lg border ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-300' : 'border-neutral-300 focus:border-neutral-950 focus:ring-neutral-300'} py-2.5 pl-9 pr-10 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-offset-0 sm:text-sm transition duration-200 ease-in-out shadow-sm focus:bg-white`}
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

            <div className="flex items-center justify-between pt-1">
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
              <Link
                href="/partner-register"
                className="text-xs font-medium text-neutral-950 hover:text-neutral-800 hover:underline underline-offset-2 transition-colors duration-150 flex items-center"
              >
                Hesabınız yok mu?
                <ArrowRightIconSolid className="ml-1 h-3.5 w-3.5" />
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white ${
                loading
                  ? 'bg-neutral-400 cursor-not-allowed'
                  : 'bg-neutral-950 hover:bg-neutral-800'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-950 transition-colors duration-200 shadow-sm`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Giriş yapılıyor...
                </>
              ) : (
                <>
                  Giriş Yap
                  <ArrowRightIconSolid className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
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

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
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
              <button
                type="button"
                className="w-full inline-flex justify-center items-center py-2.5 px-4 rounded-lg border border-neutral-300 bg-white text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors duration-150 shadow-sm"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="#1877F2"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                </svg>
                Facebook ile Devam Et
              </button>
            </div>

            <div className="text-center pt-6">
              <p className="text-xs text-neutral-500">
                Sorun mu yaşıyorsunuz?{' '}
                <a
                  href="mailto:partners@turta.com"
                  className="font-medium text-neutral-950 hover:text-neutral-800 hover:underline underline-offset-2 transition-colors duration-150"
                >
                  Destek ile iletişime geçin
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
