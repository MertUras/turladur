'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { ArrowLeft, CheckCircle, Mail } from 'lucide-react';

import { BrandLogo } from '@/components/brand/brand-logo';

const FORGOT_VISUAL =
  'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    // Nest forgot-password endpoint henüz yok — legacy ile aynı simülasyon
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitted(true);
    setLoading(false);
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
              E-posta adresinizi girin, size şifre sıfırlama bağlantısı
              gönderelim.
            </p>
          </div>

          {!isSubmitted ? (
            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
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

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex min-h-[40px] w-full transform items-center justify-center rounded-lg border border-transparent bg-neutral-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-in-out hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <svg
                      className="h-5 w-5 animate-spin text-white"
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
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : (
                    <Mail
                      className="absolute left-3 h-5 w-5 text-blue-100 transition-colors duration-200 group-hover:text-white"
                      aria-hidden
                    />
                  )}
                  {loading
                    ? 'Gönderiliyor...'
                    : 'Şifre Sıfırlama Bağlantısı Gönder'}
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
                      Bağlantı gönderildi!
                    </h3>
                    <div className="mt-1 text-sm text-emerald-700">
                      <p className="mb-2">
                        <span className="font-medium">{email}</span> adresine
                        şifre sıfırlama bağlantısı gönderdik.
                      </p>
                      <p className="text-xs text-emerald-600/90">
                        Lütfen e-posta kutunuzu kontrol edin. Size gönderilen
                        bağlantıya tıklayarak şifrenizi sıfırlayabilirsiniz.
                        Spam klasörünü kontrol etmeyi unutmayın.
                      </p>
                    </div>
                    <div className="mt-3 flex items-center text-xs text-emerald-600/90">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-1 h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Bağlantı 30 dakika boyunca geçerlidir.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="inline-flex items-center px-3 py-2 text-xs font-medium text-neutral-950 underline-offset-2 transition-colors duration-200 hover:text-neutral-800 hover:underline focus:outline-none"
                >
                  <ArrowLeft className="mr-1.5 h-4 w-4" />
                  Farklı bir e-posta adresi dene
                </button>
              </div>
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

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Hesabınız yok mu?{' '}
              <Link
                href="/register"
                className="font-medium text-neutral-950 underline-offset-2 transition-colors duration-200 hover:text-neutral-800 hover:underline"
              >
                Hemen kaydolun
              </Link>
            </p>
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
              Endişelenmeyin, şifrenizi unutmanız normal. Size göndereceğimiz
              bağlantı ile hızlıca yeni bir şifre oluşturabilirsiniz.
            </p>
            <div className="rounded-lg border border-white/15 bg-white/10 p-5 shadow-lg backdrop-blur-sm">
              <div className="mb-2 text-xs italic text-white/70">
                Yardım Bilgisi
              </div>
              <div className="text-white">
                <p className="mb-2 text-sm font-medium">
                  Şifre sıfırlama e-postasını alamıyorsanız:
                </p>
                <ul className="list-disc space-y-1.5 pl-5 text-xs text-white/90">
                  <li>Spam veya junk klasörünüzü kontrol edin</li>
                  <li>E-posta adresinizi doğru girdiğinizden emin olun</li>
                  <li>Farklı bir e-posta adresi deneyin</li>
                  <li>
                    Destek ekibimizle iletişime geçin:{' '}
                    <a
                      href="mailto:destek@tourtech.com"
                      className="hover:underline"
                    >
                      destek@tourtech.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
