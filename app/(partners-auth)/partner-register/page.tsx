'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowRightIcon,
  UserPlusIcon,
  BuildingOfficeIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserCircleIcon,
  TagIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

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
    termsAccepted: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const isStepOneComplete = () => {
    return formData.companyName && formData.companyType && formData.contactName && formData.phone && formData.email;
  };

  const isStepTwoComplete = () => {
    return formData.password && formData.confirmPassword && formData.termsAccepted && formData.password === formData.confirmPassword && passwordStrength >= 3;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

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

    if (currentStep !== 2 || !isStepTwoComplete()) {
        setError('Lütfen tüm gerekli alanları doldurun ve şartları kabul edin.');
        return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }
    
    if (passwordStrength < 3) {
      setError('Şifreniz yeterince güçlü değil. Lütfen kriterleri kontrol edin.');
      return;
    }

    if (!formData.termsAccepted) {
        setError('Devam etmek için İş Ortağı Sözleşmesi ve Gizlilik Politikasını kabul etmelisiniz.');
        return;
    }
    
    setLoading(true);
    
    try {
      console.log('Registering partner with:', {
          companyName: formData.companyName,
          contactName: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          companyType: formData.companyType,
      });
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Partner registration successful');
      router.push('/partner-verification');

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.';
      console.error('Partner registration error:', message);
      setError(message);
      setLoading(false);
    }
  };

  const nextStep = () => {
    setError('');
    if (currentStep === 1 && isStepOneComplete()) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 1 && !isStepOneComplete()) {
        setError('Lütfen bu adımdaki tüm zorunlu alanları doldurun.');
    }
  };

  const prevStep = () => {
    setError('');
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const inputClass = "block w-full rounded-lg border border-gray-300 py-3 px-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200 ease-in-out shadow-sm focus:bg-indigo-50/30";
  const inputIconClass = "absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none";
  const inputIcon = "h-5 w-5 text-gray-400";

  return (
    <div className="min-h-screen flex bg-white">
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="İş Ortaklığı Büyüme"
          layout="fill"
          objectFit="cover"
          priority
          className="absolute inset-0 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-tl from-indigo-900/90 via-indigo-800/85 to-blue-700/80 z-10"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-12 text-center">
          <div className="max-w-lg">
            <h2 className="text-4xl xl:text-5xl font-extrabold text-white mb-5 leading-tight tracking-tight">
              TurlaDur İş Ortağı Olun
            </h2>
            <p className="text-lg text-indigo-100/90 mb-10">
              İşletmenizi daha geniş kitlelere ulaştırın, rezervasyonlarınızı artırın ve TurlaDur ailesinin bir parçası olun.
            </p>
            
            <div className="space-y-5">
              {[ 
                { icon: (props:any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-3.741-1.5a3 3 0 0 0-3.741 1.5M15 11.678a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Zm0 0H8.25m4.125 0a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 0H15.75m-3.75 0a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z" /></svg>,
                  title: "Geniş Müşteri Ağı",
                  desc: "Platformumuzdaki binlerce potansiyel müşteriye ulaşın."
                },
                { icon: (props:any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>,
                  title: "Gelirlerinizi Artırın",
                  desc: "Kolay yönetim paneli ile iş hacminizi ve kazancınızı yükseltin."
                },
                { icon: (props:any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>,
                  title: "Güvenilir Platform",
                  desc: "Güvenli ödeme altyapısı ve 7/24 partner desteği."
                }
              ].map((feature, index) => (
                <div 
                    key={index} 
                    className="group flex items-start bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/15 text-left shadow-sm transition-all duration-300 ease-in-out hover:bg-white/20 hover:border-white/25 hover:scale-[1.02]"
                >
                  <div className="bg-gradient-to-br from-white/30 to-white/10 p-3 rounded-lg mr-4 mt-0.5 flex-shrink-0 shadow">
                    <feature.icon className="h-6 w-6 text-white opacity-90 group-hover:opacity-100" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-base mb-0.5 group-hover:text-white">{feature.title}</h3>
                    <p className="text-indigo-100/80 text-sm leading-snug group-hover:text-indigo-100/90">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center"> 
            <Link href="/" className="inline-block mb-5">
               <span className="text-3xl font-bold text-gray-900">TurlaDur <span className="text-indigo-600">Partner</span></span>
            </Link>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
              İş Ortağı Hesabı Oluşturun
            </h2>
             <div className="flex items-center justify-center space-x-4 mt-4">
                 <div className={`flex items-center ${currentStep === 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
                     <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${currentStep === 1 ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'} text-sm font-semibold ${currentStep === 1 ? 'text-white' : 'text-gray-500'} mr-2 transition-colors duration-300`}>1</div>
                     <span className={`${currentStep === 1 ? 'font-medium' : ''} text-sm transition-colors duration-300`}>İşletme Bilgileri</span>
                 </div>
                 <div className="flex-1 h-0.5 bg-gray-200"></div>
                 <div className={`flex items-center ${currentStep === 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
                     <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${currentStep === 2 ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'} text-sm font-semibold ${currentStep === 2 ? 'text-white' : 'text-gray-500'} mr-2 transition-colors duration-300`}>2</div>
                     <span className={`${currentStep === 2 ? 'font-medium' : ''} text-sm transition-colors duration-300`}>Hesap Bilgileri</span>
                 </div>
             </div>
          </div>

          {error && (
            <div className="mb-4 flex items-start bg-red-50 border-l-4 border-red-400 text-red-800 px-4 py-3 rounded-md text-sm shadow-sm">
              <ExclamationCircleIcon className="w-5 h-5 mr-2.5 text-red-500 flex-shrink-0 mt-0.5"/>
              <span className="leading-tight flex-1">{error}</span>
              <button 
                onClick={() => setError('')} 
                className="ml-2 text-red-400 hover:text-red-600 transition-colors"
                aria-label="Hata mesajını kapat"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          )}

          <form 
            className="space-y-5 mt-6" 
            onSubmit={handleSubmit}
          >
            <div className={`${currentStep === 1 ? 'block' : 'hidden'} space-y-4 animate-fadeIn`}> 
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Şirket Adı
                </label>
                <div className="relative">
                   <div className={inputIconClass}>
                       <BuildingOfficeIcon className={inputIcon} />
                   </div>
                    <input
                      id="companyName"
                      name="companyName"
                      type="text"
                      autoComplete="organization"
                      required={currentStep === 1}
                      value={formData.companyName}
                      onChange={handleChange}
                      className={`${inputClass} pl-11`}
                      placeholder="ABC Turizm Ltd. Şti."
                    />
                 </div>
              </div>
              
              <div>
                <label htmlFor="companyType" className="block text-sm font-medium text-gray-700 mb-1.5">
                  İşletme Türü
                </label>
                <div className="relative">
                   <div className={inputIconClass}>
                       <TagIcon className={inputIcon} />
                   </div>
                    <select
                      id="companyType"
                      name="companyType"
                      required={currentStep === 1}
                      value={formData.companyType}
                      onChange={handleChange}
                      className={`${inputClass} pl-11 appearance-none pr-10`} 
                    >
                      <option value="" disabled>İşletme türünü seçin...</option>
                      <option value="hotel">Otel</option>
                      <option value="tourOperator">Tur Operatörü / Seyahat Acentası</option>
                      <option value="rental">Araç Kiralama</option>
                      <option value="activity">Aktivite Sağlayıcı</option>
                      <option value="restaurant">Restoran</option>
                      <option value="transport">Ulaşım (Transfer vb.)</option>
                      <option value="other">Diğer</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-gray-400">
                      <ChevronRightIcon className="h-5 w-5 rotate-90" />
                    </div>
                 </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Yetkili Kişi
                    </label>
                    <div className="relative">
                       <div className={inputIconClass}>
                           <UserCircleIcon className={inputIcon} />
                       </div>
                        <input
                            id="contactName"
                            name="contactName"
                            type="text"
                            autoComplete="name"
                            required={currentStep === 1}
                            value={formData.contactName}
                            onChange={handleChange}
                            className={`${inputClass} pl-11`}
                            placeholder="Ad Soyad"
                        />
                     </div>
                 </div>
                
                 <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Yetkili Telefon
                    </label>
                    <div className="relative">
                       <div className={inputIconClass}>
                           <PhoneIcon className={inputIcon} />
                       </div>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            autoComplete="tel"
                            required={currentStep === 1}
                            value={formData.phone}
                            onChange={handleChange}
                            className={`${inputClass} pl-11`}
                            placeholder="(5XX) XXX XX XX"
                        />
                    </div>
                 </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Yetkili E-posta
                </label>
                 <div className="relative">
                   <div className={inputIconClass}>
                       <EnvelopeIcon className={inputIcon} />
                   </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required={currentStep === 1}
                      value={formData.email}
                      onChange={handleChange}
                      className={`${inputClass} pl-11`}
                      placeholder="yetkili@sirketiniz.com"
                    />
                 </div>
              </div>
            </div>

            <div className={`${currentStep === 2 ? 'block' : 'hidden'} space-y-4 animate-fadeIn`}>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Yönetici Şifresi
                </label>
                 <div className="relative">
                   <div className={inputIconClass}>
                       <LockClosedIcon className={inputIcon} />
                   </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required={currentStep === 2}
                      value={formData.password}
                      onChange={handleChange}
                      className={`${inputClass} pl-11 pr-10`}
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
                                passwordStrength === 1 ? 'bg-red-500' :
                                passwordStrength === 2 ? 'bg-orange-500' :
                                passwordStrength === 3 ? 'bg-yellow-500' :
                                passwordStrength === 4 ? 'bg-lime-500' :
                                'bg-green-500' 
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
                    <div className={inputIconClass}>
                       <LockClosedIcon className={inputIcon} />
                   </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required={currentStep === 2}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`${inputClass} pl-11 pr-10 ${ 
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

              <div className="pt-1 flex items-start"> 
                <div className="flex items-center h-5 mt-0.5">
                    <input
                      id="termsAccepted"
                      name="termsAccepted"
                      type="checkbox"
                      required={currentStep === 2}
                      checked={formData.termsAccepted}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
                    />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor="termsAccepted" className="text-gray-600 leading-snug">
                        <Link href="/partner-terms" target="_blank" rel="noopener noreferrer" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-colors duration-150">İş Ortağı Sözleşmesi</Link>
                        'ni ve <Link href="/partner-privacy" target="_blank" rel="noopener noreferrer" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-colors duration-150">Gizlilik Politikası</Link>'nı okudum ve kabul ediyorum.
                    </label>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center justify-center py-2.5 px-5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 shadow-sm"
                >
                  <ChevronLeftIcon className="h-4 w-4 mr-1.5" />
                  Geri
                </button>
              ) : (
                <Link
                  href="/partner-login"
                  className="inline-flex items-center justify-center py-2.5 px-5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 shadow-sm"
                >
                  Giriş Yap
                </Link>
              )}

              {currentStep < 2 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepOneComplete()}
                  className="group inline-flex items-center justify-center py-2.5 px-5 border border-transparent rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-[0.98]"
                >
                  İleri
                  <ChevronRightIcon className="h-4 w-4 ml-1.5 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || !isStepTwoComplete()}
                  className="group relative inline-flex items-center justify-center py-2.5 px-5 border border-transparent rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-[0.98] min-h-[42px]"
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      <UserPlusIcon className="h-5 w-5 mr-1.5" />
                      Hesap Oluştur
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          <div className="text-center pt-4">
            <p className="text-sm text-gray-500">
              Sorularınız mı var? <a href="mailto:partners@turladur.com" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-colors duration-150">Destek ile iletişime geçin</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 