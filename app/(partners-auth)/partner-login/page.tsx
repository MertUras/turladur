'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRightIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { LockClosedIcon, BuildingOfficeIcon, EnvelopeIcon, EyeIcon, EyeSlashIcon, XMarkIcon } from '@heroicons/react/24/solid';

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
    <div className="min-h-screen flex bg-gray-50">
      {/* Sol taraftaki görsel alanı */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800/90 to-indigo-900/90 z-10"></div>
        <Image
          src="https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Partner İş Ortağı"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-10 text-center">
          <div className="max-w-md">
            <h2 className="text-4xl font-bold text-white mb-6">İş Ortağı Portalına Hoş Geldiniz</h2>
            <p className="text-lg text-white/90 mb-8">
              TurlaDur Partner portalı ile tüm işlemlerinizi kolayca yönetin, rezervasyonları takip edin ve gelirlerinizi artırın.
            </p>
            
            <div className="space-y-4 mt-8">
              <div className="flex items-start bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/20 text-left transition-all duration-300 hover:bg-white/15">
                <div className="bg-white/20 p-3 rounded-lg mr-4 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-medium text-lg">Rezervasyon Yönetimi</h3>
                  <p className="text-white/80 text-sm mt-1">Tüm rezervasyonları tek bir yerden kolayca yönetin</p>
                </div>
              </div>
              
              <div className="flex items-start bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/20 text-left transition-all duration-300 hover:bg-white/15">
                <div className="bg-white/20 p-3 rounded-lg mr-4 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-medium text-lg">Gelişmiş Raporlama</h3>
                  <p className="text-white/80 text-sm mt-1">Detaylı performans analizleri ve finansal raporlar</p>
                </div>
              </div>

              <div className="flex items-start bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/20 text-left transition-all duration-300 hover:bg-white/15">
                <div className="bg-white/20 p-3 rounded-lg mr-4 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-medium text-lg">7/24 Destek</h3>
                  <p className="text-white/80 text-sm mt-1">Uzman ekibimizden her zaman destek alın</p>
                </div>
              </div>
            </div>

            <div className="pt-12 pb-8">
              <div className="flex justify-center items-center space-x-8">
                <div className="flex items-center">
                  <div className="h-1 w-24 bg-white/30 rounded-full relative overflow-hidden">
                    <div className="h-full absolute left-0 top-0 w-full bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="text-white/80 text-sm font-medium">TurlaDur</div>
                <div className="flex items-center">
                  <div className="h-1 w-24 bg-white/30 rounded-full relative overflow-hidden">
                    <div className="h-full absolute left-0 top-0 w-full bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sağ taraftaki form alanı */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center py-8 px-4 sm:px-12 shadow-xl shadow-gray-900/5 relative">
        <div className="w-full max-w-md space-y-6">
          {/* Logo ve Başlık */}
          <div className="text-center">
            <div className="inline-block bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-full mb-5 shadow-sm">
              <BuildingOfficeIcon className="h-8 w-8 text-blue-700" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 transition-all duration-300 ease-in-out">
              İş Ortağı Girişi
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Hesabınıza giriş yaparak TurlaDur partner paneline erişin
            </p>
          </div>

          {/* Form */}
          <div className="mt-8 space-y-6 transform transition-all duration-300"> 
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center shadow-sm animate-fadeIn">
                <XMarkIcon className="h-5 w-5 mr-2 text-red-500 flex-shrink-0" />
                <p>{error}</p>
                <button 
                  onClick={() => setError('')} 
                  className="ml-auto text-red-400 hover:text-red-500"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            )}
            
            <form 
              className="space-y-5" 
              onSubmit={handleSubmit}
            >
              <div className="space-y-4">
                <div className="relative">
                  <label 
                    htmlFor="email" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    E-posta Adresi
                  </label>
                  <div className="relative rounded-lg overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-blue-500 transition-all duration-200">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 px-4 py-3 border border-gray-200 text-gray-900 transition-all duration-200 focus:outline-none sm:text-sm bg-white placeholder-gray-400"
                      placeholder="partner@sirketiniz.com"
                    />
                  </div>
                </div>

                <div className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Şifre
                    </label>
                    <Link href="/partner-forgot-password" className="text-xs font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors duration-200">
                      Şifrenizi mi unuttunuz?
                    </Link>
                  </div>
                  <div className="relative rounded-lg overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-blue-500 transition-all duration-200">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-3 border border-gray-200 text-gray-900 transition-all duration-200 focus:outline-none sm:text-sm bg-white placeholder-gray-400"
                      placeholder="••••••••"
                    />
                    <div 
                      className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" 
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Beni hatırla
                  </label>
                </div>
                
                <Link 
                  href="/partner-register" 
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors duration-200 flex items-center"
                >
                  <span>Kayıt ol</span>
                  <ChevronRightIcon className="ml-1 h-4 w-4" />
                </Link>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex items-center justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      Giriş Yap
                      <ArrowRightIcon className="ml-2 h-4 w-4 text-white group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="relative flex items-center justify-center pt-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">veya</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Link
                href="#"
                className="flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 12C6 8.68629 8.68629 6 12 6C13.6569 6 15.1569 6.67157 16.2426 7.75736L19.0711 4.92893C17.1823 3.04019 14.7157 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 10.8954 21.8754 9.82384 21.6414 8.79906H12V12.4991H17.3999C16.8533 14.5732 15.1399 16.1631 12.9428 16.8317L16.0605 19.9493C18.6843 17.9498 20.3333 15.1477 20.3333 12.0001H6Z" fill="#4285F4" />
                  <path d="M3.8533 9.61758L7.50844 12.3786C8.3305 9.80723 10.8851 8.00001 14 8.00001C15.5264 8.00001 16.9793 8.57193 18.1433 9.52454L21.1398 6.5281C19.0172 4.75701 16.6349 3.75 14 3.75C9.48256 3.75 5.57955 6.75178 3.8533 9.61758Z" fill="#EA4335" />
                  <path d="M13.9999 20.25C16.5077 20.25 18.7254 19.3549 20.3888 17.9019L17.0801 15.1037C15.9475 15.9391 14.5343 16.5 13.0042 16.5C10.0052 16.5 7.46223 14.5944 6.50703 11.9966L3.02539 14.7207C4.71889 18.1238 8.58077 20.25 13.9999 20.25Z" fill="#34A853" />
                  <path d="M3.8736 7.80738C2.76814 9.52315 2.00917 11.6214 2.00917 14.0001C2.00917 14.1147 2.01272 14.2144 2.01979 14.3142L6.04222 10.2917C5.75342 8.73252 6.86744 6.15117 9.00724 5.2967L3.87362 7.80738H3.8736Z" fill="#FBBC05" />
                </svg>
                Google
              </Link>
              
              <Link
                href="#"
                className="flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2 text-[#3b5998]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
                Facebook
              </Link>
            </div>

            <div className="text-center pt-4">
              <p className="text-sm text-gray-500">
                Sorun mu yaşıyorsunuz? <a href="mailto:partners@turladur.com" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">İletişime geçin</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}