'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

import { ApiError } from '@/services/api-client';
import { verifyPartner } from '@/services/identity';

const PARTNER_VERIFY_VISUAL =
  'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';

function PartnerVerificationVerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function verifyAccount() {
      const token = searchParams.get('token');

      if (!token) {
        if (!cancelled) {
          setError("Doğrulama token'ı bulunamadı.");
          setLoading(false);
        }
        return;
      }

      try {
        await verifyPartner(token);
        if (!cancelled) {
          setSuccess(true);
        }
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : 'Hesap doğrulanamadı';
        if (!cancelled) {
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void verifyAccount();

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <div className="relative hidden overflow-hidden lg:block lg:w-1/2">
        <Image
          src={PARTNER_VERIFY_VISUAL}
          alt="İş Ortaklığı Platformu"
          fill
          className="object-cover"
          priority
          sizes="50vw"
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-sky-700/90 via-blue-800/85 to-sky-900/90" />

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-12 text-center">
          <div className="max-w-lg">
            <h2 className="mb-5 text-4xl font-bold leading-tight tracking-normal text-white xl:text-5xl">
              Hesap Doğrulama
            </h2>
            <p className="mb-10 text-lg font-light text-sky-100/90">
              Hesabınızın doğrulanması için lütfen bekleyin...
            </p>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center p-6 sm:p-12 lg:w-1/2 lg:p-16">
        <div className="w-full max-w-md">
          {loading ? (
            <div className="text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-sky-100">
                <svg
                  className="h-8 w-8 animate-spin text-sky-600"
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
              </div>
              <h2 className="mb-3 text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl">
                Hesap Doğrulanıyor
              </h2>
              <p className="text-sm text-neutral-500">
                Lütfen bekleyin, hesabınız doğrulanıyor...
              </p>
            </div>
          ) : error ? (
            <div className="text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="mb-3 text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl">
                Doğrulama Başarısız
              </h2>
              <p className="mb-6 text-sm text-neutral-500">{error}</p>
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => router.push('/partner-login')}
                  className="inline-flex w-full items-center justify-center rounded-lg border border-transparent bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                >
                  Giriş Sayfasına Dön
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/partner-verification')}
                  className="inline-flex w-full items-center justify-center rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-colors duration-200 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                >
                  Doğrulama Sayfasına Dön
                </button>
              </div>
            </div>
          ) : success ? (
            <div className="text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
              <h2 className="mb-3 text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl">
                E-posta Doğrulandı
              </h2>
              <p className="mb-6 text-sm text-neutral-500">
                E-posta adresiniz doğrulandı. Başvurunuz editör onayına alındı.
                Onay maili geldikten sonra giriş yapabilirsiniz.
              </p>
              <button
                type="button"
                onClick={() => router.push('/partner-login')}
                className="inline-flex w-full items-center justify-center rounded-lg border border-transparent bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              >
                Giriş Sayfasına Dön
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function PartnerVerificationVerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-neutral-50 text-neutral-600">
          Yükleniyor…
        </div>
      }
    >
      <PartnerVerificationVerifyContent />
    </Suspense>
  );
}
