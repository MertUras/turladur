'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { EyeIcon as EyeIconSolid, EyeSlashIcon as EyeSlashIconSolid, CheckIcon as CheckIconSolid, XMarkIcon as XMarkIconSolid } from '@heroicons/react/20/solid';
import { UserCircleIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function RegisterPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMessage, setPasswordMessage] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: val
    }));

    if (name === 'password') {
      let strength = 0;
      let messages = [];
      if (value.length >= 8) { strength += 1; } else { messages.push("8+ karakter"); }
      if (/[A-Z]/.test(value)) { strength += 1; } else { messages.push("Büyük harf"); }
      if (/[a-z]/.test(value)) { strength += 1; } else { messages.push("Küçük harf"); }
      if (/[0-9]/.test(value)) { strength += 1; } else { messages.push("Sayı"); }
      if (/[!@#$%^&*(),.?":{}|<>-]/.test(value)) { strength += 1; } else { messages.push("Özel karakter"); }
      
      setPasswordStrength(strength);
      setPasswordMessage(messages.length > 0 ? `Eksik: ${messages.join(', ')}` : 'Güçlü');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }
    
    if (passwordStrength < 4) {
      setError('Şifreniz yeterince güçlü değil. Lütfen kriterleri kontrol edin.');
      return;
    }

    if (!formData.termsAccepted) {
      setError('Devam etmek için Kullanım Şartları ve Gizlilik Politikasını kabul etmelisiniz.');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setError('Bu e-posta adresi zaten kayıtlı. Giriş yapmayı deneyin.');
        } else {
          throw new Error(data.message || 'Kayıt işlemi başarısız oldu.');
        }
        setLoading(false);
        return; 
      }

      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Kayıt başarılı ancak otomatik giriş yapılamadı. Lütfen manuel giriş yapın.');
      } else if (result?.ok) {
        // Redirect handled by useEffect
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.');
      setLoading(false);
    }
  };

  const baseInputClass = "block w-full rounded-lg border text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-offset-0 text-sm transition duration-200 ease-in-out shadow-sm focus:bg-white";
  const inputPaddingClass = "py-2 px-3";
  const inputIconPaddingClass = "pl-8 pr-3";
  const normalBorderClass = "border-neutral-300 focus:border-sky-500 focus:ring-sky-300";
  const errorBorderClass = "border-red-300 focus:border-red-500 focus:ring-red-300";
  const successBorderClass = "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-300";
  const inputIconClass = "absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none";
  const inputIconSvgClass = "h-3.5 w-3.5 text-neutral-400";
  const labelClass = "block text-xs font-medium text-neutral-700 mb-1";

  if (status === 'loading') {
    return ( <div className="min-h-screen flex items-center justify-center bg-white"> <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-sky-600"></div> </div> );
  }

  if (status === 'authenticated') {
    return null; 
  }
  
  return (
    <div className="h-screen flex bg-neutral-50 pt-16 overflow-hidden">
      <div className="hidden lg:block lg:w-1/2 relative h-[calc(100vh-4rem)]">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Dağ Manzarası"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-sky-700/80 via-blue-800/75 to-sky-900/80 z-10"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-8 text-center">
          <div className="max-w-sm">
            <h2 className="text-3xl font-bold text-white mb-3 tracking-normal">
              Turladur ile Seyahat Planları
            </h2>
            <p className="text-base text-sky-100/90 font-light">
              Dünyayı keşfetmek için en iyi turları ve deneyimleri burada bulun. Kolayca plan yapın ve rezervasyon yapın.
            </p>
          </div>
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-4 sm:p-6 lg:p-8 h-[calc(100vh-4rem)]">
        <div className="w-full max-w-sm">
          <div className="mb-6 text-center lg:text-left">
            <Link href="/" className="inline-flex items-center mb-6 group">
               <div className="mr-2.5 flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center shadow group-hover:scale-105 transition-transform duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
                      </svg>
                  </div>
                </div>
                <span className="text-xl font-semibold text-neutral-800 group-hover:text-sky-700 transition-colors">Turladur</span>
            </Link>
            <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-1.5 tracking-tight">
              Hesap Oluşturun
            </h2>
            <p className="text-xs text-neutral-500">
              Zaten hesabın var mı?{' '}
              <Link 
                href="/login" 
                className="font-medium text-sky-600 hover:text-sky-800 hover:underline underline-offset-2 transition-colors duration-150"
              >
                Giriş Yap
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-4 flex items-start bg-red-50/80 border border-red-200/80 text-red-800 px-3 py-2 rounded-lg text-xs shadow-sm">
              <XMarkIconSolid className="w-3.5 h-3.5 mr-1.5 text-red-500 flex-shrink-0 mt-0.5"/>
              <span className="leading-tight flex-1 -mt-0.5">{error}</span>
              <button 
                 type="button"
                 onClick={() => setError('')} 
                 className="ml-1.5 -mr-1 p-0.5 text-red-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-100/70"
                 aria-label="Hata mesajını kapat"
               >
                 <XMarkIconSolid className="h-3 w-3" />
              </button>
            </div>
          )}

          <form 
            className="space-y-3"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className={labelClass}>
                  Ad
                </label>
                <div className="relative">
                  <div className={inputIconClass}>
                    <UserCircleIcon className={inputIconSvgClass} />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`${baseInputClass} ${inputPaddingClass} ${inputIconPaddingClass} ${normalBorderClass}`}
                    placeholder="Adınız"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className={labelClass}>
                  Soyad
                </label>
                <div className="relative">
                  <div className={inputIconClass}>
                    <UserCircleIcon className={inputIconSvgClass} />
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`${baseInputClass} ${inputPaddingClass} ${inputIconPaddingClass} ${normalBorderClass}`}
                    placeholder="Soyadınız"
                  />
                </div>
              </div>
            </div>
            
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
                  value={formData.email}
                  onChange={handleChange}
                  className={`${baseInputClass} ${inputPaddingClass} ${inputIconPaddingClass} ${normalBorderClass}`}
                  placeholder="ornek@mail.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className={labelClass}>
                Şifre
              </label>
              <div className="relative">
                <div className={inputIconClass}>
                  <LockClosedIcon className={inputIconSvgClass} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`${baseInputClass} ${inputPaddingClass} ${inputIconPaddingClass} ${normalBorderClass} pr-10`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-neutral-400 hover:text-neutral-600 transition-colors rounded-r-lg"
                  aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                >
                  {showPassword ? <EyeSlashIconSolid className="h-5 w-5" /> : <EyeIconSolid className="h-5 w-5" />}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <div className="w-full h-1 bg-neutral-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ease-out ${ 
                        passwordStrength === 0 ? 'w-0' :
                        passwordStrength === 1 ? 'bg-rose-500' :
                        passwordStrength === 2 ? 'bg-amber-500' :
                        passwordStrength === 3 ? 'bg-amber-500' :
                        passwordStrength === 4 ? 'bg-emerald-500' :
                        'bg-emerald-500' 
                      }`}
                      style={{ width: `${passwordStrength * 20}%` }}
                    ></div>
                  </div>
                  <p className={`text-xs font-medium ${passwordStrength < 3 ? 'text-rose-600' : passwordStrength < 5 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {passwordMessage}
                  </p>
                </div>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className={labelClass}>
                Şifre Tekrar
              </label>
              <div className="relative">
                <div className={inputIconClass}>
                  <LockClosedIcon className={inputIconSvgClass} />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`${baseInputClass} ${inputPaddingClass} ${inputIconPaddingClass} pr-10 ${ 
                    formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? errorBorderClass
                      : formData.password && formData.confirmPassword && formData.password === formData.confirmPassword
                      ? successBorderClass
                      : normalBorderClass
                  }`}
                  placeholder="••••••••"
                />
                
                {formData.password && formData.confirmPassword && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      {formData.password === formData.confirmPassword ? (
                        <CheckIconSolid className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <XMarkIconSolid className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  )}
              </div>
              {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">Şifreler eşleşmiyor</p>
              )}
            </div>
            
            <div className="flex items-start pt-1">
              <div className="flex items-center h-4 mt-0.5">
                  <input
                    id="termsAccepted"
                    name="termsAccepted"
                    type="checkbox"
                    required
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    className="h-3 w-3 rounded border-neutral-300 text-sky-600 focus:ring-sky-500 focus:ring-offset-0"
                  />
              </div>
              <div className="ml-2 text-xs">
                  <label htmlFor="termsAccepted" className="text-neutral-600 leading-snug">
                      <Link href="/terms" target="_blank" rel="noopener noreferrer" className="font-medium text-sky-600 hover:text-sky-800 hover:underline underline-offset-2 transition-colors duration-150">Kullanım Şartları</Link>
                      'nı ve <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="font-medium text-sky-600 hover:text-sky-800 hover:underline underline-offset-2 transition-colors duration-150">Gizlilik Politikası</Link>'nı okudum ve kabul ediyorum.
                  </label>
              </div>
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-200 ease-in-out shadow-sm disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-[0.98] min-h-[36px]"
              >
                 {loading ? (
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                     <>Hesap Oluştur</>
                  )}
              </button>
            </div>
          </form>

          <div className="mt-4">
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-neutral-300"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-neutral-500 uppercase tracking-wide">Veya</span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => signIn('google', { callbackUrl: '/'})}
                className="w-full inline-flex justify-center items-center py-2 px-3 rounded-lg border border-neutral-300 bg-white text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors duration-150 shadow-sm"
              >
                 <svg className="w-3.5 h-3.5 mr-1.5" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path>
                 </svg>
                 Google
              </button>
              <button
                onClick={() => signIn('facebook', { callbackUrl: '/' })}
                className="w-full inline-flex justify-center items-center py-2 px-3 rounded-lg border border-neutral-300 bg-white text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors duration-150 shadow-sm"
              >
                 <svg className="w-3.5 h-3.5 mr-1.5" fill="#1877F2" viewBox="0 0 24 24">
                   <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
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