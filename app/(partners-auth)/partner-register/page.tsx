'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRightIcon, UserPlusIcon, BuildingOfficeIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { CheckIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, XMarkIcon } from '@heroicons/react/24/solid';

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
  const [currentStep, setCurrentStep] = useState(1);
  const [formComplete, setFormComplete] = useState(false);

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

    // Check if form is complete
    setTimeout(() => {
      const allFieldsFilled = Object.values(formData).every(value => value !== '');
      setFormComplete(allFieldsFilled && formData.password === formData.confirmPassword);
    }, 100);
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

  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sol taraftaki görsel alanı */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800/90 to-indigo-900/90 z-10"></div>
        <Image
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="İş Ortağı İş Birliği"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-10 text-center">
          <div className="max-w-md">
            <h2 className="text-4xl font-bold text-white mb-6">İş Ortağımız Olun</h2>
            <p className="text-lg text-white/90 mb-8">
              TourTech iş ortağı olarak işletmenizi daha geniş kitlelere ulaştırın ve gelirlerinizi artırın.
            </p>
            
            <div className="space-y-4 mt-8">
              <div className="flex items-start bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/20 text-left transition-all duration-300 hover:bg-white/15">
                <div className="bg-white/20 p-3 rounded-lg mr-4 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-medium text-lg">Daha Geniş Müşteri Kitlesi</h3>
                  <p className="text-white/80 text-sm mt-1">Binlerce potansiyel müşteriye erişim imkanı</p>
                </div>
              </div>
              
              <div className="flex items-start bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/20 text-left transition-all duration-300 hover:bg-white/15">
                <div className="bg-white/20 p-3 rounded-lg mr-4 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-medium text-lg">İş Hacminizi Artırın</h3>
                  <p className="text-white/80 text-sm mt-1">Daha fazla rezervasyon, daha fazla gelir</p>
                </div>
              </div>
              
              <div className="flex items-start bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/20 text-left transition-all duration-300 hover:bg-white/15">
                <div className="bg-white/20 p-3 rounded-lg mr-4 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-medium text-lg">Güvenilir Platform</h3>
                  <p className="text-white/80 text-sm mt-1">Güvenli ödeme sistemi ve 7/24 destek</p>
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
                <div className="text-white/80 text-sm font-medium">Turladur</div>
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
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center py-8 px-4 sm:px-10 shadow-xl shadow-gray-900/5 relative">
        <div className="w-full max-w-md space-y-6">
          {/* Logo ve Başlık */}
          <div className="text-center">
            <div className="inline-block bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-full mb-5 shadow-sm">
              <BuildingOfficeIcon className="h-8 w-8 text-blue-700" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 transition-all duration-300 ease-in-out">
              İş Ortağı Hesabı
            </h2>
            <div className="flex items-center justify-center mt-2 space-x-1 text-sm text-gray-500">
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium text-xs">Adım {currentStep}/2</span>
              <span className="mx-2">—</span>
              <span>{currentStep === 1 ? 'İşletme Bilgileri' : 'Hesap Bilgileri'}</span>
            </div>
          </div>

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

          {/* Form */}
          <form 
            className="space-y-5" 
            onSubmit={handleSubmit}
          >
            {currentStep === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                    Şirket Adı
                  </label>
                  <div className="relative rounded-lg overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-blue-500 transition-all duration-200">
                    <input
                      id="companyName"
                      name="companyName"
                      type="text"
                      autoComplete="organization"
                      required
                      value={formData.companyName}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 border border-gray-200 text-gray-900 transition-all duration-200 focus:outline-none sm:text-sm bg-white placeholder-gray-400"
                      placeholder="ABC Turizm"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="companyType" className="block text-sm font-medium text-gray-700 mb-1">
                    İşletme Türü
                  </label>
                  <div className="relative rounded-lg overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-blue-500 transition-all duration-200">
                    <select
                      id="companyType"
                      name="companyType"
                      required
                      value={formData.companyType}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 border border-gray-200 text-gray-900 transition-all duration-200 focus:outline-none sm:text-sm bg-white appearance-none"
                    >
                      <option value="" disabled>İşletme türünüzü seçin</option>
                      <option value="hotel">Otel</option>
                      <option value="tourOperator">Tur Operatörü</option>
                      <option value="rental">Araç Kiralama</option>
                      <option value="activity">Aktivite Sağlayıcı</option>
                      <option value="restaurant">Restoran</option>
                      <option value="other">Diğer</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <ChevronRightIcon className="h-4 w-4 rotate-90" />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                      İletişim Kişisi
                    </label>
                    <div className="relative rounded-lg overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-blue-500 transition-all duration-200">
                      <input
                        id="contactName"
                        name="contactName"
                        type="text"
                        autoComplete="name"
                        required
                        value={formData.contactName}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 border border-gray-200 text-gray-900 transition-all duration-200 focus:outline-none sm:text-sm bg-white placeholder-gray-400"
                        placeholder="Ad Soyad"
                      />
                    </div>
                  </div>
                  
                  <div className="relative">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Telefon
                    </label>
                    <div className="relative rounded-lg overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-blue-500 transition-all duration-200">
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 border border-gray-200 text-gray-900 transition-all duration-200 focus:outline-none sm:text-sm bg-white placeholder-gray-400"
                        placeholder="(___) ___ ____"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    E-posta Adresi
                  </label>
                  <div className="relative rounded-lg overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-blue-500 transition-all duration-200">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 border border-gray-200 text-gray-900 transition-all duration-200 focus:outline-none sm:text-sm bg-white placeholder-gray-400"
                      placeholder="ornek@sirketiniz.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Şifre
                  </label>
                  <div className="relative rounded-lg overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-blue-500 transition-all duration-200">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
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
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center space-x-1">
                          <div className={`h-2 w-2 rounded-full ${passwordStrength >= 1 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                          <div className={`h-2 w-2 rounded-full ${passwordStrength >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                          <div className={`h-2 w-2 rounded-full ${passwordStrength >= 3 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                          <div className={`h-2 w-2 rounded-full ${passwordStrength >= 4 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                          <span className="text-xs text-gray-500 ml-1">Şifre Gücü: {passwordMessage}</span>
                        </div>
                        <div className="text-xs text-gray-500">En az 8 karakter</div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Şifre Tekrar
                  </label>
                  <div className="relative rounded-lg overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-blue-500 transition-all duration-200">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-10 py-3 border text-gray-900 transition-all duration-200 focus:outline-none sm:text-sm bg-white placeholder-gray-400 ${
                        formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword
                          ? 'border-red-300 focus-within:border-red-500 focus-within:ring-red-400'
                          : formData.password && formData.confirmPassword && formData.password === formData.confirmPassword
                          ? 'border-green-300 focus-within:border-green-500 focus-within:ring-green-400'
                          : 'border-gray-200'
                      }`}
                      placeholder="••••••••"
                    />
                    {formData.password && formData.confirmPassword && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        {formData.password === formData.confirmPassword ? (
                          <CheckIcon className="h-5 w-5 text-green-500" />
                        ) : (
                          <XMarkIcon className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">Şifreler eşleşmiyor</p>
                  )}
                </div>

                <div className="pt-2">
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
                      <Link href="/partner-terms" className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors duration-200">
                        İş Ortağı Sözleşmesi
                      </Link>
                      <span> ve </span>
                      <Link href="/partner-privacy" className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors duration-200">
                        Gizlilik Politikası
                      </Link>
                      <span>'nı kabul ediyorum</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-2">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <ChevronRightIcon className="h-4 w-4 mr-1 rotate-180" />
                  Geri
                </button>
              ) : (
                <Link
                  href="/partner-login"
                  className="flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Giriş Yap
                </Link>
              )}

              {currentStep < 2 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center justify-center py-2.5 px-5 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-sm"
                >
                  İleri
                  <ChevronRightIcon className="h-4 w-4 ml-1" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex items-center justify-center py-2.5 px-5 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      Hesap Oluştur
                      <ArrowRightIcon className="ml-1.5 h-4 w-4 text-white group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          <div className="text-center pt-4">
            <p className="text-sm text-gray-500">
              Sorularınız mı var? <a href="mailto:partners@tourtech.com" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">İletişime geçin</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 