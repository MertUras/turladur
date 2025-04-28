'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  CheckCircleIcon,
  EnvelopeIcon,
  ArrowLeftIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleIconSolid,
  EnvelopeIcon as EnvelopeIconSolid
} from '@heroicons/react/20/solid';

export default function PartnerVerificationPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    // URL'den e-posta parametresini al
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, []);

  const handleResendVerification = async () => {
    setLoading(true);
    setError('');
    setResendSuccess(false);

    try {
      const response = await fetch('/api/auth/partner-verification/resend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Doğrulama e-postası gönderilemedi');
      }

      setResendSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Doğrulama e-postası gönderilemedi. Lütfen tekrar deneyin.';
      console.error('Doğrulama e-postası gönderme hatası:', message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

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
              E-posta Adresinizi Doğrulayın
            </h2>
            <p className="text-lg text-sky-100/90 mb-10 font-light">
              Hesabınızı aktifleştirmek için e-posta adresinize gönderilen doğrulama bağlantısına tıklayın.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sky-100 mb-6">
              <EnvelopeIconSolid className="w-8 h-8 text-sky-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3 tracking-tight">
              Doğrulama E-postası Gönderildi
            </h2>
            <p className="text-sm text-neutral-500">
              {email ? (
                <span>
                  <span className="font-medium text-neutral-700">{email}</span> adresine bir doğrulama e-postası gönderdik.
                </span>
              ) : (
                'Kayıt olduğunuz e-posta adresine bir doğrulama e-postası gönderdik.'
              )}
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-start bg-red-50/80 border border-red-200/80 text-red-800 px-4 py-3 rounded-lg text-xs shadow-sm">
              <XMarkIcon className="w-4 h-4 mr-2 text-red-500 flex-shrink-0 mt-0.5"/>
              <span className="leading-tight flex-1 -mt-0.5">{error}</span>
              <button 
                onClick={() => setError('')} 
                className="ml-2 -mr-1 p-0.5 text-red-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-100/70"
                aria-label="Hata mesajını kapat"
              >
                <XMarkIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {resendSuccess && (
            <div className="mb-5 flex items-start bg-emerald-50/80 border border-emerald-200/80 text-emerald-800 px-4 py-3 rounded-lg text-xs shadow-sm">
              <CheckCircleIcon className="w-4 h-4 mr-2 text-emerald-500 flex-shrink-0 mt-0.5"/>
              <span className="leading-tight flex-1 -mt-0.5">Doğrulama e-postası başarıyla gönderildi.</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-sm">
              <h3 className="text-sm font-medium text-neutral-900 mb-2">Doğrulama Adımları</h3>
              <ol className="space-y-3 text-sm text-neutral-600">
                <li className="flex items-start">
                  <CheckCircleIcon className="w-5 h-5 text-sky-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>E-posta kutunuzu kontrol edin</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-5 h-5 text-sky-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>"TourTech Partner Hesabınızı Doğrulayın" başlıklı e-postayı bulun</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-5 h-5 text-sky-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>E-postadaki "Hesabımı Doğrula" butonuna tıklayın</span>
                </li>
              </ol>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => router.push('/partner-login')}
                className="inline-flex items-center text-sm font-medium text-sky-600 hover:text-sky-800 hover:underline"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-1.5" />
                Giriş Sayfasına Dön
              </button>

              <button
                onClick={handleResendVerification}
                disabled={loading}
                className="inline-flex items-center justify-center py-2 px-4 rounded-lg border border-transparent text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors duration-200 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    <EnvelopeIcon className="w-4 h-4 mr-1.5" />
                    E-postayı Tekrar Gönder
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="text-center pt-6">
            <p className="text-xs text-neutral-500">
              E-postayı bulamıyor musunuz? <a href="mailto:partners@tourtech.com" className="font-medium text-sky-600 hover:text-sky-800 hover:underline underline-offset-2 transition-colors duration-150">Destek ile iletişime geçin</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 