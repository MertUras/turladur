'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { AlertCircle, Eye, EyeOff, Lock, Mail, User, X } from 'lucide-react';

import { BrandLogo } from '@/components/brand/brand-logo';
import { ApiError } from '@/services/api-client';
import { sendEmailOtp } from '@/services/identity';
import { useAuth } from '@/providers/auth-provider';

const REGISTER_VISUAL =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [otpOpen, setOtpOpen] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpPending, setOtpPending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [expiresIn, setExpiresIn] = useState(0);
  const [debugCode, setDebugCode] = useState<string | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = window.setInterval(() => {
      setCooldown((c) => Math.max(0, c - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [cooldown]);

  useEffect(() => {
    if (expiresIn <= 0) return;
    const id = window.setInterval(() => {
      setExpiresIn((c) => Math.max(0, c - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [expiresIn]);

  function updateField(name: string, value: string | boolean) {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'password' && typeof value === 'string') {
      let strength = 0;
      if (value.length >= 8) strength += 1;
      if (/[A-Z]/.test(value)) strength += 1;
      if (/[a-z]/.test(value)) strength += 1;
      if (/[0-9]/.test(value)) strength += 1;
      if (/[!@#$%^&*(),.?":{}|<>-]/.test(value)) strength += 1;
      setPasswordStrength(strength);
    }
  }

  function validateForm(): string | null {
    if (formData.password !== formData.confirmPassword) {
      return 'Şifreler eşleşmiyor.';
    }
    if (passwordStrength < 3) {
      return 'Şifre en az 8 karakter, 1 büyük harf ve 1 rakam içermelidir.';
    }
    if (!formData.termsAccepted) {
      return 'Devam etmek için Kullanım Şartları ve Gizlilik Politikasını kabul etmelisiniz.';
    }
    return null;
  }

  async function requestOtp() {
    const result = await sendEmailOtp({
      email: formData.email.trim(),
      purpose: 'REGISTER',
      firstName: formData.firstName.trim() || undefined,
    });
    setCooldown(result.resendCooldownSeconds);
    setExpiresIn(result.expiresInSeconds);
    setDebugCode(result.debugCode ?? null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setPending(true);
    try {
      await requestOtp();
      setOtpCode('');
      setOtpError(null);
      setOtpOpen(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Doğrulama kodu gönderilemedi. Lütfen tekrar deneyin.',
      );
    } finally {
      setPending(false);
    }
  }

  async function handleResendOtp() {
    if (cooldown > 0 || otpPending) return;
    setOtpPending(true);
    setOtpError(null);
    try {
      await requestOtp();
      setOtpCode('');
    } catch (err) {
      setOtpError(
        err instanceof ApiError ? err.message : 'Kod tekrar gönderilemedi',
      );
    } finally {
      setOtpPending(false);
    }
  }

  async function handleConfirmOtp() {
    if (otpCode.length !== 6) {
      setOtpError('6 haneli kodu girin.');
      return;
    }
    setOtpPending(true);
    setOtpError(null);
    try {
      await register({
        email: formData.email.trim(),
        password: formData.password,
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
        otpCode,
      });
      setOtpOpen(false);
      router.push('/tours');
    } catch (err) {
      setOtpError(
        err instanceof ApiError ? err.message : 'Kayıt başarısız oldu',
      );
    } finally {
      setOtpPending(false);
    }
  }

  const baseInputClass =
    'block w-full rounded-lg border text-sm text-neutral-900 placeholder-neutral-400 shadow-sm transition focus:bg-white focus:outline-none focus:ring-1 focus:ring-offset-0';
  const inputPad = 'px-3 py-2 pl-8';
  const borderOk =
    'border-neutral-300 focus:border-neutral-950 focus:ring-neutral-300';
  const labelClass = 'mb-1 block text-xs font-medium text-neutral-700';

  return (
    <div className="flex min-h-screen overflow-hidden bg-neutral-50">
      <div className="relative hidden h-screen lg:block lg:w-1/2">
        <Image
          src={REGISTER_VISUAL}
          alt="turta"
          fill
          priority
          className="object-cover"
          sizes="50vw"
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-neutral-900/85 via-neutral-900/80 to-neutral-950/85" />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center">
          <div className="max-w-sm">
            <h2 className="mb-3 text-3xl font-bold tracking-normal text-white">
              turta ile Seyahat Planları
            </h2>
            <p className="text-base font-light text-neutral-200/90">
              Dünyayı keşfetmek için en iyi turları ve deneyimleri burada bulun.
              Kolayca plan yapın ve rezervasyon yapın.
            </p>
          </div>
        </div>
      </div>

      <div className="flex h-screen w-full items-center justify-center overflow-y-auto bg-white p-4 sm:p-6 lg:w-1/2 lg:p-8">
        <div className="w-full max-w-sm py-6">
          <div className="mb-6 text-center lg:text-left">
            <Link href="/" className="group mb-6 inline-flex">
              <BrandLogo
                variant="wordmark"
                surface="light"
                href={null}
                className="transition-opacity group-hover:opacity-90"
              />
            </Link>
            <h2 className="mb-1.5 text-xl font-bold tracking-tight text-neutral-900 md:text-2xl">
              Hesap Oluşturun
            </h2>
            <p className="text-xs text-neutral-500">
              Zaten hesabın var mı?{' '}
              <Link
                href="/login"
                className="font-medium text-neutral-950 underline-offset-2 hover:underline"
              >
                Giriş Yap
              </Link>
            </p>
          </div>

          {error ? (
            <div className="mb-4 flex items-start rounded-lg border border-red-200/80 bg-red-50/80 px-3 py-2 text-xs text-red-800 shadow-sm">
              <AlertCircle className="mr-1.5 mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />
              <span className="-mt-0.5 flex-1 leading-tight">{error}</span>
              <button
                type="button"
                onClick={() => setError(null)}
                className="-mr-1 ml-1.5 rounded-full p-0.5 text-red-400 hover:bg-red-100/70"
                aria-label="Kapat"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : null}

          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className={labelClass}>
                  Ad
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
                  <input
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    className={`${baseInputClass} ${inputPad} ${borderOk}`}
                    placeholder="Adınız"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className={labelClass}>
                  Soyad
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
                  <input
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    className={`${baseInputClass} ${inputPad} ${borderOk}`}
                    placeholder="Soyadınız"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>
                E-posta Adresi
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className={`${baseInputClass} ${inputPad} ${borderOk}`}
                  placeholder="ornek@mail.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className={labelClass}>
                Şifre
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  className={`${baseInputClass} ${inputPad} pr-10 ${borderOk}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {formData.password ? (
                <div className="mt-1.5 flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded ${
                        passwordStrength >= level
                          ? passwordStrength <= 2
                            ? 'bg-red-400'
                            : passwordStrength <= 3
                              ? 'bg-amber-400'
                              : 'bg-emerald-500'
                          : 'bg-neutral-200'
                      }`}
                    />
                  ))}
                </div>
              ) : null}
            </div>

            <div>
              <label htmlFor="confirmPassword" className={labelClass}>
                Şifre Tekrar
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    updateField('confirmPassword', e.target.value)
                  }
                  className={`${baseInputClass} ${inputPad} ${borderOk}`}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-start pt-1">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={(e) => updateField('termsAccepted', e.target.checked)}
                className="mt-0.5 h-3.5 w-3.5 rounded border-neutral-300 text-neutral-950 focus:ring-neutral-950"
              />
              <label htmlFor="terms" className="ml-2 text-xs text-neutral-600">
                <Link
                  href="/terms"
                  className="font-medium text-neutral-950 underline"
                >
                  Kullanım Şartları
                </Link>{' '}
                ve{' '}
                <Link
                  href="/privacy"
                  className="font-medium text-neutral-950 underline"
                >
                  Gizlilik Politikası
                </Link>
                &apos;nı kabul ediyorum.
              </label>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="flex min-h-[40px] w-full items-center justify-center rounded-lg bg-neutral-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 disabled:opacity-60"
            >
              {pending ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                'Hesap Oluştur'
              )}
            </button>
          </form>
        </div>
      </div>

      {otpOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="register-otp-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3
                  id="register-otp-title"
                  className="text-lg font-bold text-neutral-900"
                >
                  E-posta doğrulama
                </h3>
                <p className="mt-1 text-sm text-neutral-600">
                  <span className="font-medium text-neutral-900">
                    {formData.email}
                  </span>{' '}
                  adresine 6 haneli kod gönderdik.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOtpOpen(false)}
                className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                aria-label="Kapat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <input
              value={otpCode}
              onChange={(e) =>
                setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))
              }
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              maxLength={6}
              placeholder="6 haneli kod"
              className="h-12 w-full rounded-lg border border-neutral-300 px-3 text-center text-lg tracking-[0.35em] text-neutral-900 focus:border-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-300"
            />

            <div className="mt-3 flex items-center justify-between gap-2 text-xs text-neutral-500">
              {expiresIn > 0 ? (
                <span>
                  Süre: {Math.floor(expiresIn / 60)}:
                  {String(expiresIn % 60).padStart(2, '0')}
                </span>
              ) : (
                <span>Kodun süresi dolmuş olabilir</span>
              )}
              <button
                type="button"
                disabled={cooldown > 0 || otpPending}
                onClick={() => void handleResendOtp()}
                className="font-medium text-neutral-950 underline-offset-2 hover:underline disabled:opacity-50"
              >
                {cooldown > 0
                  ? `Tekrar gönder (${cooldown}s)`
                  : 'Tekrar gönder'}
              </button>
            </div>

            {debugCode ? (
              <p className="mt-3 rounded bg-amber-50 px-2 py-1 text-xs text-amber-800">
                Dev kod: <strong>{debugCode}</strong>
              </p>
            ) : null}

            {otpError ? (
              <p className="mt-3 text-xs text-red-600">{otpError}</p>
            ) : null}

            <button
              type="button"
              disabled={otpPending || otpCode.length !== 6}
              onClick={() => void handleConfirmOtp()}
              className="mt-5 flex min-h-[44px] w-full items-center justify-center rounded-lg bg-neutral-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-60"
            >
              {otpPending ? 'Doğrulanıyor…' : 'Doğrula ve hesabı oluştur'}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
