'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon, EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

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

  return (
    <div className="min-h-screen flex">
      {/* Sol taraftaki form alanı */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8 transform transition-all duration-500 ease-in-out">
          {/* Logo ve Başlık */}
          <div className="text-center">
            <Link href="/" className="inline-block">
              <div className="flex items-center justify-center">
                <div className="h-12 w-12 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  T
                </div>
                <h2 className="ml-2 text-3xl font-bold text-gray-900">TourTech</h2>
              </div>
            </Link>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 transition-all duration-300 ease-in-out">
              Şifrenizi mi Unuttunuz?
            </h2>
            <p className="mt-2 text-base text-gray-600">
              E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
            </p>
          </div>

          {!isSubmitted ? (
            <form 
              className="mt-8 space-y-6 transform transition-all duration-500" 
              onSubmit={handleSubmit}
            >
              <div className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    E-posta Adresi
                  </label>
                  <div className="relative rounded-xl focus-within:ring focus-within:ring-blue-300 transition-all duration-200 group">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full px-4 py-3.5 border border-gray-300 rounded-xl text-gray-900 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-0 sm:text-sm bg-gray-50 group-hover:bg-white"
                      placeholder="ornek@email.com"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  {loading ? (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <EnvelopeIcon className="absolute left-3 h-5 w-5 text-blue-100 group-hover:text-white transition-colors duration-200" aria-hidden="true" />
                  )}
                  {loading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Bağlantısı Gönder'}
                  {!loading && (
                    <ArrowRightIcon className="ml-2 -mr-1 h-4 w-4 text-blue-100 group-hover:text-white group-hover:translate-x-1 transition-transform duration-200" />
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-8 space-y-6 transform transition-all duration-500 animate-fade-in">
              <div className="bg-green-50 p-6 rounded-xl shadow-sm border border-green-100">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="bg-green-100 rounded-full p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-green-800">
                      Bağlantı gönderildi!
                    </h3>
                    <div className="mt-2 text-green-700">
                      <p className="text-base mb-3">
                        <span className="font-medium">{email}</span> adresine şifre sıfırlama bağlantısı gönderdik.
                      </p>
                      <p className="text-sm text-green-600">
                        Lütfen e-posta kutunuzu kontrol edin. Size gönderilen bağlantıya tıklayarak şifrenizi sıfırlayabilirsiniz. Spam klasörünü kontrol etmeyi unutmayın.
                      </p>
                    </div>
                    <div className="mt-4 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-green-600">Bağlantı 30 dakika boyunca geçerlidir.</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="inline-flex items-center py-2.5 px-4 text-sm font-medium text-blue-700 hover:text-blue-800 transition-colors duration-200 focus:outline-none"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-1.5" />
                  Farklı bir e-posta adresi dene
                </button>
              </div>
            </div>
          )}

          <div className="text-center">
            <Link 
              href="/login" 
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200 hover:underline flex items-center justify-center"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1.5" />
              Giriş sayfasına geri dön
            </Link>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Hesabınız yok mu?{' '}
              <Link 
                href="/register" 
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200 hover:underline"
              >
                Hemen kaydolun
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* Sağ taraftaki görsel alanı */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/90 to-blue-700/90 z-10"></div>
        <Image
          src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Huzurlu Manzara"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-10 text-center">
          <div className="max-w-md">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-full inline-block mb-6">
              <EnvelopeIcon className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-6">Şifrenizi Kolayca Sıfırlayın</h2>
            <p className="text-lg text-white/90 mb-8">
              Endişelenmeyin, şifrenizi unutmanız normal. Size göndereceğimiz bağlantı ile hızlıca yeni bir şifre oluşturabilirsiniz.
            </p>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10 shadow-xl">
              <div className="text-sm text-white/80 italic mb-2">Yardım Bilgisi</div>
              <div className="text-white">
                <p className="mb-3">Şifre sıfırlama e-postasını alamıyorsanız:</p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-white/90">
                  <li>Spam veya junk klasörünüzü kontrol edin</li>
                  <li>E-posta adresinizi doğru girdiğinizden emin olun</li>
                  <li>Farklı bir e-posta adresi deneyin</li>
                  <li>Destek ekibimizle iletişime geçin: destek@tourtech.com</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 