'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRightIcon, UserPlusIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

export default function PartnerRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    companyType: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMessage, setPasswordMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      // Burada partner kaydı için API çağrısı yapılacak
      // Örnek olarak setTimeout ile simüle ediyoruz
      setTimeout(() => {
        // Kayıt başarılı varsayalım ve doğrulama sayfasına yönlendirelim
        setLoading(false);
        router.push('/partner-verification');
      }, 2000);
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex pt-20">
      {/* Sol taraftaki görsel alanı */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-purple-800/90 z-10"></div>
        <Image
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="İş Ortağı İş Birliği"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-10 text-center">
          <div className="max-w-md">
            <h2 className="text-4xl font-bold text-white mb-6">İş Ortağımız Olun</h2>
            <p className="text-lg text-white/90 mb-6">
              TourTech iş ortağı olarak işletmenizi daha geniş kitlelere ulaştırın ve gelirlerinizi artırın.
            </p>
            
            <div className="space-y-4 mt-8">
              <div className="flex items-start bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 text-left">
                <div className="bg-white/20 p-2 rounded-lg mr-4 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-medium">Daha Geniş Müşteri Kitlesi</h3>
                  <p className="text-white/70 text-sm">Binlerce potansiyel müşteriye erişim imkanı</p>
                </div>
              </div>
              
              <div className="flex items-start bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 text-left">
                <div className="bg-white/20 p-2 rounded-lg mr-4 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-medium">İş Hacminizi Artırın</h3>
                  <p className="text-white/70 text-sm">Daha fazla rezervasyon, daha fazla gelir</p>
                </div>
              </div>
              
              <div className="flex items-start bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 text-left">
                <div className="bg-white/20 p-2 rounded-lg mr-4 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-medium">Güvenilir Platform</h3>
                  <p className="text-white/70 text-sm">Güvenli ödeme sistemi ve 7/24 destek</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sağ taraftaki form alanı */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md space-y-6">
          {/* Logo ve Başlık */}
          <div className="text-center">
            <div className="inline-block bg-indigo-100 p-3 rounded-full mb-4">
              <BuildingOfficeIcon className="h-10 w-10 text-indigo-700" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 transition-all duration-300 ease-in-out">
              Partner Hesabı Oluştur
            </h2>
            <p className="mt-2 text-base text-gray-600">
              Zaten bir hesabınız var mı?{' '}
              <Link 
                href="/partner-login" 
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200 hover:underline"
              >
                Giriş yapın
              </Link>
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}

          {/* Form */}
          <form 
            className="space-y-5" 
            onSubmit={handleSubmit}
          >
            <div className="space-y-5">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                  Şirket Adı
                </label>
                <div className="relative rounded-xl focus-within:ring focus-within:ring-indigo-300 transition-all duration-200 group">
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    autoComplete="organization"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-0 sm:text-sm bg-gray-50 group-hover:bg-white"
                    placeholder="Şirketinizin adı"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="companyType" className="block text-sm font-medium text-gray-700 mb-1">
                  İşletme Türü
                </label>
                <div className="relative rounded-xl focus-within:ring focus-within:ring-indigo-300 transition-all duration-200 group">
                  <select
                    id="companyType"
                    name="companyType"
                    required
                    value={formData.companyType}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-0 sm:text-sm bg-gray-50 group-hover:bg-white"
                  >
                    <option value="" disabled>İşletme türünüzü seçin</option>
                    <option value="hotel">Otel</option>
                    <option value="tourOperator">Tur Operatörü</option>
                    <option value="rental">Araç Kiralama</option>
                    <option value="activity">Aktivite Sağlayıcı</option>
                    <option value="restaurant">Restoran</option>
                    <option value="other">Diğer</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                    İletişim Kişisi
                  </label>
                  <div className="relative rounded-xl focus-within:ring focus-within:ring-indigo-300 transition-all duration-200 group">
                    <input
                      id="contactName"
                      name="contactName"
                      type="text"
                      autoComplete="name"
                      required
                      value={formData.contactName}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-0 sm:text-sm bg-gray-50 group-hover:bg-white"
                      placeholder="Ad Soyad"
                    />
                  </div>
                </div>
                
                <div className="relative">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon
                  </label>
                  <div className="relative rounded-xl focus-within:ring focus-within:ring-indigo-300 transition-all duration-200 group">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-0 sm:text-sm bg-gray-50 group-hover:bg-white"
                      placeholder="(___) ___ ____"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta Adresi
                </label>
                <div className="relative rounded-xl focus-within:ring focus-within:ring-indigo-300 transition-all duration-200 group">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-0 sm:text-sm bg-gray-50 group-hover:bg-white"
                    placeholder="sirket@sirketiniz.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Şifre
                </label>
                <div className="relative rounded-xl focus-within:ring focus-within:ring-indigo-300 transition-all duration-200 group">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-0 sm:text-sm bg-gray-50 group-hover:bg-white"
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
                <div className="relative rounded-xl focus-within:ring focus-within:ring-indigo-300 transition-all duration-200 group">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3 border rounded-xl text-gray-900 transition-all duration-200 focus:outline-none focus:ring-0 sm:text-sm bg-gray-50 group-hover:bg-white ${
                      formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword
                        ? 'border-red-500 focus:border-red-500'
                        : formData.password && formData.confirmPassword && formData.password === formData.confirmPassword
                        ? 'border-green-500 focus:border-green-500'
                        : 'border-gray-300 focus:border-indigo-500'
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
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors duration-200"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                <span>Kayıt olarak </span>
                <Link href="/partner-terms" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-colors duration-200">
                  İş Ortağı Sözleşmesi
                </Link>
                <span> ve </span>
                <Link href="/partner-privacy" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-colors duration-200">
                  Gizlilik Politikası
                </Link>
                <span>'nı kabul ediyorum</span>
              </label>
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
                  <UserPlusIcon className="absolute left-3 h-5 w-5 text-indigo-100 group-hover:text-white transition-colors duration-200" aria-hidden="true" />
                )}
                {loading ? 'Hesap Oluşturuluyor...' : 'Hesap Oluştur'}
                {!loading && (
                  <ArrowRightIcon className="ml-2 -mr-1 h-4 w-4 text-indigo-100 group-hover:text-white group-hover:translate-x-1 transition-transform duration-200" />
                )}
              </button>
            </div>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Sorularınız mı var? <a href="mailto:partners@tourtech.com" className="font-medium text-indigo-600 hover:text-indigo-500">Partner ekibimizle iletişime geçin</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 