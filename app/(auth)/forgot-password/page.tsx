'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon, EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid, ArrowLeftIcon as ArrowLeftIconSolid } from '@heroicons/react/20/solid';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // TODO: Implement password reset logic
    console.log('Password reset requested for:', email);
    
    // Simüle edilmiş API isteği
    setTimeout(() => {
      setIsSubmitted(true);
      setLoading(false);
    }, 1500);
  };

  // Merkezi stil tanımlamaları
  const baseInputClass = "block w-full rounded-lg border text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-offset-0 sm:text-sm transition duration-200 ease-in-out shadow-sm focus:bg-white";
  const inputPaddingClass = "py-2.5 px-4";
  const inputIconPaddingClass = "pl-9 pr-4";
  const normalBorderClass = "border-neutral-300 focus:border-sky-500 focus:ring-sky-300";
  const inputIconClass = "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none";
  const inputIconSvgClass = "h-4 w-4 text-neutral-400";
  const labelClass = "block text-xs font-medium text-neutral-700 mb-1.5";

  return (
    <div className="min-h-screen flex bg-neutral-50">
      {/* Sol taraftaki form alanı */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md">
          {/* Logo ve Başlık Güncellendi */}
          <div className="mb-8 text-center lg:text-left">
            <Link href="/" className="inline-flex items-center mb-6 group">
              <div className="mr-2.5 flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center shadow group-hover:scale-105 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
                  </svg>
                </div>
              </div>
              <span className="text-xl font-semibold text-neutral-800 group-hover:text-sky-700 transition-colors">TourTech</span>
            </Link>
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2 tracking-tight">
              Şifrenizi mi Unuttunuz?
            </h2>
            <p className="text-xs text-neutral-500">
              E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
            </p>
          </div>

          {!isSubmitted ? (
            <form 
              className="mt-6 space-y-5"
              onSubmit={handleSubmit}
            >
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
                    className={`${baseInputClass} ${inputPaddingClass} ${inputIconPaddingClass} ${normalBorderClass}`}
                    placeholder="ornek@email.com"
                  />
                </div>
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-200 ease-in-out shadow-sm disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-[0.98] min-h-[40px]"
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <EnvelopeIcon className="absolute left-3 h-5 w-5 text-blue-100 group-hover:text-white transition-colors duration-200" aria-hidden="true" />
                  )}
                  {loading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Bağlantısı Gönder'}
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-6 space-y-5 animate-fadeIn">
              <div className="bg-emerald-50/80 p-5 rounded-lg shadow-sm border border-emerald-200/80">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircleIconSolid className="h-6 w-6 text-emerald-500" aria-hidden="true" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base font-semibold text-emerald-800">
                      Bağlantı gönderildi!
                    </h3>
                    <div className="mt-1 text-sm text-emerald-700">
                      <p className="mb-2">
                        <span className="font-medium">{email}</span> adresine şifre sıfırlama bağlantısı gönderdik.
                      </p>
                      <p className="text-xs text-emerald-600/90">
                        Lütfen e-posta kutunuzu kontrol edin. Size gönderilen bağlantıya tıklayarak şifrenizi sıfırlayabilirsiniz. Spam klasörünü kontrol etmeyi unutmayın.
                      </p>
                    </div>
                    <div className="mt-3 flex items-center text-xs text-emerald-600/90">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Bağlantı 30 dakika boyunca geçerlidir.</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="inline-flex items-center py-2 px-3 text-xs font-medium text-sky-600 hover:text-sky-800 hover:underline underline-offset-2 transition-colors duration-200 focus:outline-none"
                >
                  <ArrowLeftIconSolid className="h-4 w-4 mr-1.5" />
                  Farklı bir e-posta adresi dene
                </button>
              </div>
            </div>
          )}

          <div className="text-center pt-4 text-xs text-neutral-500 space-y-3">
            <Link 
              href="/login" 
              className="font-medium text-sky-600 hover:text-sky-800 hover:underline underline-offset-2 transition-colors duration-200 flex items-center justify-center"
            >
              <ArrowLeftIconSolid className="h-4 w-4 mr-1.5" />
              Giriş sayfasına geri dön
            </Link>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Hesabınız yok mu?{' '}
              <Link 
                href="/register" 
                className="font-medium text-sky-600 hover:text-sky-800 hover:underline underline-offset-2 transition-colors duration-200"
              >
                Hemen kaydolun
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* Sağ taraftaki görsel alanı */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-700/80 via-blue-800/75 to-sky-900/80 z-10"></div>
        <Image
          src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Huzurlu Manzara"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-10 text-center">
          <div className="max-w-md">
            <div className="bg-white/15 backdrop-blur-sm p-3 rounded-full inline-block mb-6">
              <EnvelopeIcon className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 tracking-normal">Şifrenizi Kolayca Sıfırlayın</h2>
            <p className="text-base text-sky-100/90 mb-8 font-light">
              Endişelenmeyin, şifrenizi unutmanız normal. Size göndereceğimiz bağlantı ile hızlıca yeni bir şifre oluşturabilirsiniz.
            </p>
            <div className="bg-white/10 backdrop-blur-sm p-5 rounded-lg border border-white/15 shadow-lg">
              <div className="text-xs text-white/70 italic mb-2">Yardım Bilgisi</div>
              <div className="text-white">
                <p className="text-sm mb-2 font-medium">Şifre sıfırlama e-postasını alamıyorsanız:</p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-white/90">
                  <li>Spam veya junk klasörünüzü kontrol edin</li>
                  <li>E-posta adresinizi doğru girdiğinizden emin olun</li>
                  <li>Farklı bir e-posta adresi deneyin</li>
                  <li>Destek ekibimizle iletişime geçin: <a href="mailto:destek@tourtech.com" className="hover:underline">destek@tourtech.com</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 