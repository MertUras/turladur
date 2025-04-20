'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { ArrowRightIcon, UserPlusIcon, EyeIcon, EyeSlashIcon, CheckIcon, XMarkIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

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

  if (status === 'loading') {
    return ( <div className="min-h-screen flex items-center justify-center bg-white"> <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div> </div> );
  }

  if (status === 'authenticated') {
    return null; 
  }
  
  return (
    <div className="min-h-screen flex bg-white">
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="https://images.unsplash.com/photo-1596941248238-0d49dcaa4263?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Tatil Manzarası"
          layout="fill"
          objectFit="cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 via-indigo-700/90 to-indigo-900/95 z-10"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-10 text-center">
          <div className="max-w-lg">
            <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">
                Üyelik Ayrıcalıklarını Keşfedin
            </h2>
            <p className="text-lg text-indigo-100/90 mb-8">
              TourTech ailesine katılarak özel fırsatlar, indirimler ve kişiselleştirilmiş seyahat deneyimlerinden faydalanın.
            </p>
            
            <div className="space-y-4">
              {[
                { icon: (props:any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V6.375c0-.621.504-1.125 1.125-1.125h.375m18 3.75h.75a.75.75 0 0 0 .75-.75V6.75m0 0h-.75a.75.75 0 0 1-.75-.75V6m0 0H3.75" /></svg>,
                  title: "İlk Rezervasyona Özel %15 İndirim",
                  desc: "Yeni üyelere özel ilk rezervasyonlarında geçerli indirim fırsatı"
                },
                { icon: (props:any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>,
                  title: "Erken Rezervasyon Fırsatları",
                  desc: "Üyelere özel erken rezervasyon ve en iyi fiyatlardan faydalanma imkanı"
                },
                { icon: (props:any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L25.75 5.25l-.813 2.846a4.5 4.5 0 0 0-3.09 3.09L18.25 12ZM18.25 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09L11.75 18.75l.813-2.846a4.5 4.5 0 0 0 3.09-3.09L18.25 12Z" /></svg>,
                  title: "Kişiselleştirilmiş Deneyimler",
                  desc: "Sadece üyelere özel turlar ve unutulmaz seyahat planları"
                }
              ].map((feature, index) => (
                <div key={index} className="flex items-start bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/15 text-left shadow-sm">
                  <div className="bg-white/20 p-2.5 rounded-lg mr-4 mt-1 flex-shrink-0">
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-base mb-0.5">{feature.title}</h3>
                    <p className="text-indigo-100/80 text-sm leading-snug">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md">
          <div className="mb-10 text-left">
            <Link href="/" className="inline-block mb-6">
               <span className="text-3xl font-bold text-gray-900">TourTech</span>
            </Link>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
              Hesap Oluşturun
            </h2>
            <p className="text-sm text-gray-500">
              Zaten hesabın var mı?{' '}
              <Link 
                href="/login" 
                className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-colors duration-150"
              >
                Giriş Yap
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-4 flex items-start bg-red-50 border-l-4 border-red-400 text-red-800 px-4 py-3 rounded-md text-sm shadow-sm">
              <ExclamationCircleIcon className="w-5 h-5 mr-2.5 text-red-500 flex-shrink-0 mt-0.5"/>
              <span className="leading-tight">{error}</span>
            </div>
          )}

          <form 
            className="space-y-5"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Ad
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 py-3 px-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200 ease-in-out shadow-sm focus:bg-indigo-50/30"
                  placeholder="Adınız"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Soyad
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 py-3 px-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200 ease-in-out shadow-sm focus:bg-indigo-50/30"
                  placeholder="Soyadınız"
                />
              </div>
            </div>
            
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
                value={formData.email}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 py-3 px-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200 ease-in-out shadow-sm focus:bg-indigo-50/30"
                placeholder="ornek@mail.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Şifre
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 py-3 px-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200 ease-in-out shadow-sm pr-10 focus:bg-indigo-50/30"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ease-in-out ${ 
                        passwordStrength === 0 ? 'w-0' :
                        passwordStrength === 1 ? 'w-[20%] bg-red-500' :
                        passwordStrength === 2 ? 'w-[40%] bg-orange-500' :
                        passwordStrength === 3 ? 'w-[60%] bg-yellow-500' :
                        passwordStrength === 4 ? 'w-[80%] bg-lime-500' :
                        'w-full bg-green-500' 
                      }`}
                      style={{ width: `${passwordStrength * 20}%` }}
                    ></div>
                  </div>
                  <p className={`text-xs ${passwordStrength < 3 ? 'text-red-600' : passwordStrength < 5 ? 'text-orange-600' : 'text-green-600'}`}>
                    {passwordMessage}
                  </p>
                </div>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                Şifre Tekrar
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full rounded-lg border py-3 px-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 sm:text-sm transition duration-200 ease-in-out shadow-sm pr-10 focus:bg-indigo-50/30 ${
                    formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
                      : formData.password && formData.confirmPassword && formData.password === formData.confirmPassword
                      ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                      : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                  }`}
                  placeholder="••••••••"
                />
                
                {formData.password && formData.confirmPassword && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      {formData.password === formData.confirmPassword ? (
                        <CheckIcon className="h-5 w-5 text-green-500" />
                      ) : (
                        <XMarkIcon className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  )}
              </div>
              {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">Şifreler eşleşmiyor</p>
              )}
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5 mt-1">
                  <input
                    id="termsAccepted"
                    name="termsAccepted"
                    type="checkbox"
                    required
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
                  />
              </div>
              <div className="ml-3 text-sm">
                  <label htmlFor="termsAccepted" className="text-gray-600">
                      <Link href="/terms" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-colors duration-150">Kullanım Şartları</Link>
                      'nı ve <Link href="/privacy" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-colors duration-150">Gizlilik Politikası</Link>'nı okudum ve kabul ediyorum.
                  </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform active:scale-[0.98] min-h-[44px]"
              >
                 {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                     <>
                       <UserPlusIcon className="absolute left-4 h-5 w-5 text-indigo-300 group-hover:text-indigo-100 transition-colors duration-200" aria-hidden="true" />
                       Hesap Oluştur
                       <ArrowRightIcon className="absolute right-4 h-5 w-5 text-indigo-300 group-hover:text-indigo-100 group-hover:translate-x-1 transition-transform duration-200" />
                     </>
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

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => signIn('google', { callbackUrl: '/' })}
                className="w-full inline-flex justify-center items-center py-3 px-4 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-150 shadow-sm"
              >
                 <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path>
                 </svg>
                 Google
              </button>
              <button
                type="button"
                onClick={() => signIn('facebook', { callbackUrl: '/' })}
                className="w-full inline-flex justify-center items-center py-3 px-4 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-150 shadow-sm"
              >
                 <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
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