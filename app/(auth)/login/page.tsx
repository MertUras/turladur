'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { ArrowRightIcon, EyeIcon, EyeSlashIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

// Placeholder for a cleaner visual
const loginVisual = "https://images.unsplash.com/photo-1522199710521-72d69614c702?q=80&w=2072&auto=format&fit=crop";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('E-posta veya şifre hatalı. Lütfen kontrol edin.');
        setLoading(false);
      } else if (result?.ok) {
        // Successful login: Redirect is handled by the useEffect above,
        // but we can trigger a refresh if needed for immediate UI update elsewhere
        // router.refresh(); // Usually not needed as session status change triggers redirect
      } else {
        setError('Giriş sırasında beklenmeyen bir durum oluştu.');
        setLoading(false);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError('Giriş sırasında bir sistem hatası oluştu. Lütfen tekrar deneyin.');
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (status === 'authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white">
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src={loginVisual}
          alt="TourTech Platform"
          layout="fill"
          objectFit="cover"
          priority
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-12 text-white z-10">
            <h1 className="text-4xl font-bold mb-3 leading-tight tracking-tight">
                Seyahatinizi<br/>Teknolojiyle Buluşturun.
            </h1>
            <p className="text-lg text-indigo-100/90 max-w-md">
                TourTech platformuna giriş yaparak tüm seyahat yönetimi araçlarınıza erişin.
            </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md">
          <div className="mb-10 text-left">
            <Link href="/" className="inline-block mb-6">
               <span className="text-3xl font-bold text-gray-900">TourTech</span>
            </Link>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
              Hesabınıza Giriş Yapın
            </h2>
            <p className="text-sm text-gray-500">
              Hesabın yok mu?{' '}
              <Link
                href="/register"
                className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-colors duration-150"
              >
                Hemen Oluştur
              </Link>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="flex items-start bg-red-50 border-l-4 border-red-400 text-red-800 px-4 py-3 rounded-md text-sm shadow-sm">
                <ExclamationCircleIcon className="w-5 h-5 mr-2.5 text-red-500 flex-shrink-0 mt-0.5"/>
                <span className="leading-tight">{error}</span>
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                E-posta Adresi
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`block w-full rounded-lg border ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} py-3 px-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 sm:text-sm transition duration-200 ease-in-out shadow-sm focus:bg-indigo-50/30`}
                placeholder="ornek@mail.com"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Şifre
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                 className={`block w-full rounded-lg border ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} py-3 px-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 sm:text-sm transition duration-200 ease-in-out shadow-sm pr-10 focus:bg-indigo-50/30`}
                 placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 top-8 flex items-center px-3 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
               >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 select-none">
                  Beni hatırla
                </label>
              </div>
              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-colors duration-150">
                  Şifremi Unuttum?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform active:scale-[0.98] min-h-[44px]"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Giriş Yap'
                )}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500 uppercase tracking-wide">Veya şununla devam et</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4">
              <button
                type="button"
                onClick={() => signIn('google', { callbackUrl: '/' })}
                className="w-full inline-flex justify-center items-center py-3 px-4 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-150 shadow-sm"
              >
                 <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
                   <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                   <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                   <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                   <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                   <path fill="none" d="M0 0h48v48H0z"></path>
                 </svg>
                 Google ile Devam Et
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}