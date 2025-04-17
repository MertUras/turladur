'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { ArrowRightIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { isAuthenticated, validatePassword } from '@/lib/auth/index';

export default function RegisterPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMessage, setPasswordMessage] = useState('');

  useEffect(() => {
    // Kullanıcı oturum açtıysa ana sayfaya yönlendir
    if (isAuthenticated(status)) {
      router.push('/');
      router.refresh();
    }
  }, [status, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Şifre gücünü kontrol et
    if (name === 'password') {
      let strength = 0;
      if (value.length >= 8) strength += 1;
      if (/[A-Z]/.test(value)) strength += 1;
      if (/[0-9]/.test(value)) strength += 1;
      if (/[^A-Za-z0-9]/.test(value)) strength += 1;
      
      setPasswordStrength(strength);
      
      switch(strength) {
        case 0:
          setPasswordMessage('Çok zayıf');
          break;
        case 1:
          setPasswordMessage('Zayıf');
          break;
        case 2:
          setPasswordMessage('Orta');
          break;
        case 3:
          setPasswordMessage('İyi');
          break;
        case 4:
          setPasswordMessage('Güçlü');
          break;
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }
    
    if (passwordStrength < 2) {
      setError('Lütfen daha güçlü bir şifre seçin');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Kayıt işlemi başarısız oldu');
      }

      // Kayıt başarılı, otomatik giriş yap
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // Başarılı giriş, useSession hook'u ile otomatik olarak yönlendirilecek
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Kullanıcı zaten giriş yaptıysa register sayfasını gösterme
  if (isAuthenticated(status)) {
    return null; // veya bir yükleme ekranı gösterilebilir
  }
  
  return (
    <div className="min-h-screen flex pt-18">
      {/* Sol taraftaki görsel alanı */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-indigo-800/90 z-10"></div>
        <Image
          src="https://images.unsplash.com/photo-1596941248238-0d49dcaa4263?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Tatil Manzarası"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-10 text-center">
          <div className="max-w-md">
            <h2 className="text-4xl font-bold text-white mb-6">Üyelik Ayrıcalıklarını Keşfedin</h2>
            <p className="text-lg text-white/90 mb-6">
              TourTech ailesine katılarak özel fırsatlar, indirimler ve kişiselleştirilmiş seyahat deneyimlerinden faydalanın.
            </p>
            
            <div className="space-y-4 mt-8">
              <div className="flex items-start bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 text-left">
                <div className="bg-white/20 p-2 rounded-lg mr-4 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-medium">İlk Rezervasyona Özel %15 İndirim</h3>
                  <p className="text-white/70 text-sm">Yeni üyelere özel ilk rezervasyonlarında geçerli indirim fırsatı</p>
                </div>
              </div>
              
              <div className="flex items-start bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 text-left">
                <div className="bg-white/20 p-2 rounded-lg mr-4 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-medium">Erken Rezervasyon Fırsatları</h3>
                  <p className="text-white/70 text-sm">Üyelere özel erken rezervasyon yapma ve en iyi fiyatlardan faydalanma imkanı</p>
                </div>
              </div>
              
              <div className="flex items-start bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 text-left">
                <div className="bg-white/20 p-2 rounded-lg mr-4 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-medium">Özel Deneyimler</h3>
                  <p className="text-white/70 text-sm">Sadece üyelere özel turlar ve unutulmaz seyahat deneyimleri</p>
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
            <Link href="/" className="inline-block">
              <div className="flex items-center justify-center">
                <div className="h-12 w-12 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  T
                </div>
                <h2 className="ml-2 text-3xl font-bold text-gray-900">TourTech</h2>
              </div>
            </Link>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 transition-all duration-300 ease-in-out">
              Yeni Hesap Oluştur
            </h2>
            <p className="mt-2 text-base text-gray-600">
              Veya{' '}
              <Link 
                href="/login" 
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200 hover:underline"
              >
                mevcut hesabınıza giriş yapın
              </Link>
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form 
            className="mt-8 space-y-6 transform transition-all duration-500" 
            onSubmit={handleSubmit}
          >
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    Ad
                  </label>
                  <div className="relative rounded-xl focus-within:ring focus-within:ring-blue-300 transition-all duration-200 group">
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="block w-full px-4 py-3.5 border border-gray-300 rounded-xl text-gray-900 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-0 sm:text-sm bg-gray-50 group-hover:bg-white"
                      placeholder="Adınız"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Soyad
                  </label>
                  <div className="relative rounded-xl focus-within:ring focus-within:ring-blue-300 transition-all duration-200 group">
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="block w-full px-4 py-3.5 border border-gray-300 rounded-xl text-gray-900 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-0 sm:text-sm bg-gray-50 group-hover:bg-white"
                      placeholder="Soyadınız"
                    />
                  </div>
                </div>
              </div>
              
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
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full px-4 py-3.5 border border-gray-300 rounded-xl text-gray-900 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-0 sm:text-sm bg-gray-50 group-hover:bg-white"
                    placeholder="ornek@email.com"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Şifre
                </label>
                <div className="relative rounded-xl focus-within:ring focus-within:ring-blue-300 transition-all duration-200 group">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full px-4 py-3.5 border border-gray-300 rounded-xl text-gray-900 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-0 sm:text-sm bg-gray-50 group-hover:bg-white"
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
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-xs text-gray-500">Şifre Gücü: {passwordMessage}</div>
                      <div className="text-xs text-gray-500">En az 8 karakter</div>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          passwordStrength === 0 ? 'w-0' :
                          passwordStrength === 1 ? 'w-1/4 bg-red-500' :
                          passwordStrength === 2 ? 'w-2/4 bg-yellow-500' :
                          passwordStrength === 3 ? 'w-3/4 bg-blue-500' :
                          'w-full bg-green-500'
                        }`}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Şifre Tekrar
                </label>
                <div className="relative rounded-xl focus-within:ring focus-within:ring-blue-300 transition-all duration-200 group">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3.5 border rounded-xl text-gray-900 transition-all duration-200 focus:outline-none focus:ring-0 sm:text-sm bg-gray-50 group-hover:bg-white ${
                      formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword
                        ? 'border-red-500 focus:border-red-500'
                        : formData.password && formData.confirmPassword && formData.password === formData.confirmPassword
                        ? 'border-green-500 focus:border-green-500'
                        : 'border-gray-300 focus:border-blue-500'
                    }`}
                    placeholder="••••••••"
                  />
                  {formData.password && formData.confirmPassword && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      {formData.password === formData.confirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                  )}
                </div>
                {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">Şifreler eşleşmiyor</p>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                <span>Kayıt olarak </span>
                <Link href="/terms" className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors duration-200">
                  Kullanım Şartları
                </Link>
                <span> ve </span>
                <Link href="/privacy" className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors duration-200">
                  Gizlilik Politikası
                </Link>
                <span>'nı kabul ediyorum</span>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || (formData.password !== '' && formData.confirmPassword !== '' && formData.password !== formData.confirmPassword)}
                className={`group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${loading || (formData.password !== '' && formData.confirmPassword !== '' && formData.password !== formData.confirmPassword) ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <UserPlusIcon className="absolute left-3 h-5 w-5 text-blue-100 group-hover:text-white transition-colors duration-200" aria-hidden="true" />
                )}
                {loading ? 'Hesap Oluşturuluyor...' : 'Hesap Oluştur'}
                {!loading && (
                  <ArrowRightIcon className="ml-2 -mr-1 h-4 w-4 text-blue-100 group-hover:text-white group-hover:translate-x-1 transition-transform duration-200" />
                )}
              </button>
            </div>
          </form>

          {/* Sosyal Giriş Butonları */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Veya şununla devam et</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-3 px-4 rounded-xl border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-700 hover:border-blue-400 transition-all duration-200 shadow-sm hover:shadow"
              >
                <svg className="w-5 h-5 mr-2 text-blue-600" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google 
              </button>

              <button
                type="button"
                className="w-full inline-flex justify-center py-3 px-4 rounded-xl border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-700 hover:border-blue-400 transition-all duration-200 shadow-sm hover:shadow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-900" viewBox="0 0 320 512">
                  <path fill="currentColor" d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path>
                </svg>
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 