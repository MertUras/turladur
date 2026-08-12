'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { ArrowLeft, CheckCircle, Eye, EyeOff, Lock, Mail } from 'lucide-react';

import { getCustomerPasswordError } from '@turta/shared-validators';

import { BrandLogo } from '@/components/brand/brand-logo';
import { EmailOtpPanel } from '@/components/features/auth/email-otp-panel';
import { ApiError } from '@/services/api-client';
import { resetPasswordWithOtp } from '@/services/identity';

const FORGOT_VISUAL =
  'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (otpCode.length !== 6) {
      setError('E-posta doğrulama kodunu girin.');
      return;
    }
    const passwordError = getCustomerPasswordError(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }

    setLoading(true);
    try {
      await resetPasswordWithOtp({
        email,
        code: otpCode,
        newPassword,
      });
      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Şifre sıfırlanamadı');
    } finally {
      setLoading(false);
    }
  }

  const baseInputClass =
    'block w-full rounded-lg border text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-offset-0 sm:text-sm transition duration-200 ease-in-out shadow-sm focus:bg-white';
  const inputPaddingClass = 'py-2.5 px-4';
  const inputIconPaddingClass = 'pl-9 pr-4';
  const normalBorderClass =
    'border-neutral-300 focus:border-neutral-950 focus:ring-neutral-300';
  const inputIconClass =
    'pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3';
  const inputIconSvgClass = 'h-4 w-4 text-neutral-400';
  const labelClass = 'mb-1.5 block text-xs font-medium text-neutral-700';

  return (
    <div className="flex min-h-screen bg-neutral-50">
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
              Şifrenizi mi Unuttunuz?
            </h2>
            <p className="text-xs text-neutral-500">
              E-posta adresinize gelen 6 haneli kod ile yeni şifre belirleyin.
            </p>
          </div>

          {!isSubmitted ? (
            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              {error ? (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                  {error}
                </p>
              ) : null}

              <div>
                <label htmlFor="email" className={labelClass}>
                  E-posta Adresi
                </label>
                <div className="relative">
                  <div className={inputIconClass}>
                    <Mail className={inputIconSvgClass} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${baseInputClass} ${inputPaddingClass} ${inputIconPaddingClass} ${normalBorderClass}`}
                    placeholder="ornek@email.com"
                  />
                </div>
              </div>

              <EmailOtpPanel
                email={email}
                purpose="PASSWORD_RESET"
                onCodeChange={setOtpCode}
              />

              <div>
                <label htmlFor="newPassword" className={labelClass}>
                  Yeni şifre
                </label>
                <div className="relative">
                  <div className={inputIconClass}>
                    <Lock className={inputIconSvgClass} />
                  </div>
                  <input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`${baseInputClass} ${inputPaddingClass} ${inputIconPaddingClass} pr-10 ${normalBorderClass}`}
                    placeholder="En az 8 karakter"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400"
                    aria-label="Şifreyi göster"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className={labelClass}>
                  Yeni şifre (tekrar)
                </label>
                <div className="relative">
                  <div className={inputIconClass}>
                    <Lock className={inputIconSvgClass} />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`${baseInputClass} ${inputPaddingClass} ${inputIconPaddingClass} ${normalBorderClass}`}
                    placeholder="Şifreyi tekrar girin"
                  />
                </div>
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex min-h-[40px] w-full transform items-center justify-center rounded-lg border border-transparent bg-neutral-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-in-out hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Kaydediliyor...' : 'Şifreyi sıfırla'}
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-6 space-y-5 animate-fadeIn">
              <div className="rounded-lg border border-emerald-200/80 bg-emerald-50/80 p-5 shadow-sm">
                <div className="flex">
                  <div className="shrink-0">
                    <CheckCircle
                      className="h-6 w-6 text-emerald-500"
                      aria-hidden
                    />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base font-semibold text-emerald-800">
                      Şifre güncellendi
                    </h3>
                    <p className="mt-1 text-sm text-emerald-700">
                      Yeni şifrenizle giriş yapabilirsiniz.
                    </p>
                  </div>
                </div>
              </div>
              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center rounded-lg bg-neutral-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
              >
                Giriş yap
              </Link>
            </div>
          )}

          <div className="space-y-3 pt-4 text-center text-xs text-neutral-500">
            <Link
              href="/login"
              className="flex items-center justify-center font-medium text-neutral-950 underline-offset-2 transition-colors duration-200 hover:text-neutral-800 hover:underline"
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Giriş sayfasına geri dön
            </Link>
          </div>
        </div>
      </div>

      <div className="relative hidden lg:block lg:w-1/2">
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-neutral-900/85 via-neutral-900/80 to-neutral-950/85" />
        <Image
          src={FORGOT_VISUAL}
          alt="Huzurlu Manzara"
          fill
          className="object-cover"
          sizes="50vw"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-10 text-center">
          <div className="max-w-md">
            <div className="mb-6 inline-block rounded-full bg-white/15 p-3 backdrop-blur-sm">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h2 className="mb-4 text-3xl font-bold tracking-normal text-white">
              Şifrenizi Kolayca Sıfırlayın
            </h2>
            <p className="mb-8 text-base font-light text-neutral-200/90">
              E-posta kodu ile hesabınızı güvenle yeniden açın. Local
              geliştirmeye Mailhog: localhost:8025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
