'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRightIcon, LockClosedIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

export default function PartnerLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Burada partner girişi için API çağrısı yapılacak
      // Örnek olarak setTimeout ile simüle ediyoruz
      setTimeout(() => {
        // Giriş başarılı varsayalım ve dashboard'a yönlendirelim
        setLoading(false);
        router.push('/partner-dashboard');
      }, 2000);

    } catch (error) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sol taraftaki görsel alanı */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-purple-800/90 z-10"></div>
        <Image
          src="https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Partner İş Ortağı"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-10 text-center">
          <div className="max-w-md">
            <h2 className="text-4xl font-bold text-white mb-6">İş Ortağı Portalına Hoş Geldiniz</h2>
            <p className="text-lg text-white/90 mb-8">
              TourTech Partner portalı ile tüm işlemlerinizi kolayca yönetin, rezervasyonları takip edin ve gelirlerinizi artırın.
            </p>
            
            <div className="space-y-4 mt-8">
              <div className="flex items-start bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 text-left">
                <div className="bg-white/20 p-2 rounded-lg mr-4 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-medium">Rezervasyon Yönetimi</h3>
                  <p className="text-white/70 text-sm">Tüm rezervasyonları tek bir yerden kolayca yönetin</p>
                </div>
              </div>
              
              <div className="flex items-start bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 text-left">
                <div className="bg-white/20 p-2 rounded-lg mr-4 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-medium">Gelişmiş Raporlama</h3>
                  <p className="text-white/70 text-sm">Detaylı performans analizleri ve finansal raporlar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sağ taraftaki form alanı */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8 transform transition-all duration-500 ease-in-out">
          {/* Logo ve Başlık */}
          <div className="text-center">
            <div className="inline-block bg-indigo-100 p-3 rounded-full mb-4">
              <BuildingOfficeIcon className="h-10 w-10 text-indigo-700" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 transition-all duration-300 ease-in-out">
              Partner Girişi
            </h2>
            <p className="mt-2 text-base text-gray-600">
              Partner hesabınız yok mu?{' '}
              <Link 
                href="/partner-register" 
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200 hover:underline"
              >
                Hemen kayıt olun
              </Link>
            </p>
          </div>

          {/* Form */}
          <form 
            className="mt-8 space-y-6 transform transition-all duration-500" 
            onSubmit={handleSubmit}
          >
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </div>
            )}
            
            <div className="space-y-5">
              <div className="relative">
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  E-posta Adresi
                </label>
                <div className="relative rounded-xl focus-within:ring focus-within:ring-indigo-300 transition-all duration-200 group">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-4 py-3.5 border border-gray-300 rounded-xl text-gray-900 transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-0 sm:text-sm bg-gray-50 group-hover:bg-white"
                    placeholder="partner@sirketiniz.com"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Şifre
                  </label>
                  <Link href="/partner-forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-colors duration-200">
                    Şifrenizi mi unuttunuz?
                  </Link>
                </div>
                <div className="relative rounded-xl focus-within:ring focus-within:ring-indigo-300 transition-all duration-200 group">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-4 py-3.5 border border-gray-300 rounded-xl text-gray-900 transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-0 sm:text-sm bg-gray-50 group-hover:bg-white"
                    placeholder="••••••••"
                  />
                  <div 
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </div>
                </div>
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
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors duration-200"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Beni hatırla
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <LockClosedIcon className="absolute left-3 h-5 w-5 text-indigo-100 group-hover:text-white transition-colors duration-200" aria-hidden="true" />
                )}
                {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                {!loading && (
                  <ArrowRightIcon className="ml-2 -mr-1 h-4 w-4 text-indigo-100 group-hover:text-white group-hover:translate-x-1 transition-transform duration-200" />
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Bir sorun mu yaşıyorsunuz? <a href="mailto:support@tourtech.com" className="font-medium text-indigo-600 hover:text-indigo-500">Destek ekibimizle iletişime geçin</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}