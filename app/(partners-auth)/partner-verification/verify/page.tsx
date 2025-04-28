'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleIconSolid,
  XCircleIcon as XCircleIconSolid
} from '@heroicons/react/20/solid';

export default function PartnerVerificationVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyAccount = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setError('Doğrulama token\'ı bulunamadı.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/auth/partner-verification/verify?token=${token}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Hesap doğrulanamadı');
        }

        setSuccess(true);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Hesap doğrulanamadı';
        console.error('Hesap doğrulama hatası:', message);
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    verifyAccount();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex bg-neutral-50">
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="İş Ortaklığı Platformu"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-sky-700/90 via-blue-800/85 to-sky-900/90 z-10"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-12 text-center">
          <div className="max-w-lg">
            <h2 className="text-4xl xl:text-5xl font-bold text-white mb-5 leading-tight tracking-normal">
              Hesap Doğrulama
            </h2>
            <p className="text-lg text-sky-100/90 mb-10 font-light">
              Hesabınızın doğrulanması için lütfen bekleyin...
            </p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md">
          {loading ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sky-100 mb-6">
                <svg className="animate-spin h-8 w-8 text-sky-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3 tracking-tight">
                Hesap Doğrulanıyor
              </h2>
              <p className="text-sm text-neutral-500">
                Lütfen bekleyin, hesabınız doğrulanıyor...
              </p>
            </div>
          ) : error ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
                <XCircleIconSolid className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3 tracking-tight">
                Doğrulama Başarısız
              </h2>
              <p className="text-sm text-neutral-500 mb-6">
                {error}
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => router.push('/partner-login')}
                  className="w-full inline-flex items-center justify-center py-2 px-4 rounded-lg border border-transparent text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors duration-200 shadow-sm"
                >
                  Giriş Sayfasına Dön
                </button>
                <button
                  onClick={() => router.push('/partner-verification')}
                  className="w-full inline-flex items-center justify-center py-2 px-4 rounded-lg border border-neutral-300 bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors duration-200 shadow-sm"
                >
                  Doğrulama Sayfasına Dön
                </button>
              </div>
            </div>
          ) : success ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-6">
                <CheckCircleIconSolid className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3 tracking-tight">
                Hesap Doğrulandı
              </h2>
              <p className="text-sm text-neutral-500 mb-6">
                Hesabınız başarıyla doğrulandı. Şimdi giriş yapabilirsiniz.
              </p>
              <button
                onClick={() => router.push('/partner-login')}
                className="w-full inline-flex items-center justify-center py-2 px-4 rounded-lg border border-transparent text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors duration-200 shadow-sm"
              >
                Giriş Yap
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
} 