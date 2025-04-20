'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowRightIcon as ArrowRightIconSolid,
  UserPlusIcon as UserPlusIconSolid,
  ChevronRightIcon as ChevronRightIconSolid,
  ChevronLeftIcon as ChevronLeftIconSolid,
  CheckIcon as CheckIconSolid,
  ExclamationCircleIcon as ExclamationCircleIconSolid,
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserCircleIcon,
  TagIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  XMarkIcon,
  UsersIcon,
  ChartPieIcon,
  ShieldCheckIcon
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
  
  const baseInputClass = "block w-full rounded-lg border text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-offset-0 sm:text-sm transition duration-200 ease-in-out shadow-sm focus:bg-white";
  const inputPaddingClass = "py-2.5 px-4";
  const inputIconPaddingClass = "pl-9 pr-4";
  const normalBorderClass = "border-neutral-300 focus:border-sky-500 focus:ring-sky-300";
  const errorBorderClass = "border-red-300 focus:border-red-500 focus:ring-red-300";
  const successBorderClass = "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-300";
  const inputIconClass = "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none";
  const inputIconSvgClass = "h-4 w-4 text-neutral-400";
  const labelClass = "block text-xs font-medium text-neutral-700 mb-1.5";

  return (
    <div className="min-h-screen flex bg-neutral-50">
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="İş Ortaklığı Büyüme"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-sky-700/90 via-blue-800/85 to-sky-900/90 z-10"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-12 text-center">
          <div className="max-w-lg">
            <h2 className="text-4xl xl:text-5xl font-bold text-white mb-5 leading-tight tracking-normal">
              TourTech İş Ortağı Olun
            </h2>
            <p className="text-lg text-sky-100/90 mb-10 font-light">
              İşletmenizi daha geniş kitlelere ulaştırın, rezervasyonlarınızı artırın ve TourTech ailesinin bir parçası olun.
            </p>
            
            <div className="space-y-4">
              {[ 
                { icon: UsersIcon,
                  title: "Geniş Müşteri Ağı",
                  desc: "Platformumuzdaki binlerce potansiyel müşteriye ulaşın."
                },
                { icon: ChartPieIcon,
                  title: "Gelirlerinizi Artırın",
                  desc: "Kolay yönetim paneli ile iş hacminizi ve kazancınızı yükseltin."
                },
                { icon: ShieldCheckIcon,
                  title: "Güvenilir Platform",
                  desc: "Güvenli ödeme altyapısı ve 7/24 partner desteği."
                }
              ].map((feature, index) => (
                <div 
                    key={index} 
                    className="group flex items-start bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/15 text-left shadow-sm transition-all duration-200 ease-out hover:bg-white/15 hover:border-white/25"
                >
                  <div className="bg-white/20 p-2.5 rounded-lg mr-4 mt-0.5 flex-shrink-0 shadow-sm">
                    <feature.icon className="h-5 w-5 text-white opacity-90" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm mb-0.5">{feature.title}</h3>
                    <p className="text-sky-100/80 text-xs leading-snug">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <Link href="/" className="inline-flex items-center mb-5 group">
                <div className="mr-2.5 flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center shadow group-hover:scale-105 transition-transform duration-200">
                      <BuildingOfficeIcon className="w-4 h-4 text-white" />
                   </div>
                 </div>
                 <span className="text-xl font-semibold text-neutral-800 group-hover:text-sky-700 transition-colors">TourTech <span className="text-sky-600">Partner</span></span>
            </Link>
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3 tracking-tight">
              İş Ortağı Hesabı Oluşturun
            </h2>
             <div className="flex items-center justify-center space-x-3 mt-4">
                 <div className={`flex items-center ${currentStep === 1 ? 'text-sky-600' : 'text-neutral-400'}`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${currentStep >= 1 ? 'border-sky-600' : 'border-neutral-300'} ${currentStep === 1 ? 'bg-sky-600 text-white' : 'bg-white text-neutral-500'} text-xs font-semibold mr-1.5 transition-colors duration-300`}>1</div>
                      <span className={`${currentStep === 1 ? 'font-semibold' : 'font-normal'} text-xs transition-colors duration-300`}>İşletme Bilgileri</span>
                 </div>
                  <div className={`flex-1 h-[1px] ${currentStep > 1 ? 'bg-sky-500' : 'bg-neutral-200'}`}></div>
                  <div className={`flex items-center ${currentStep === 2 ? 'text-sky-600' : 'text-neutral-400'}`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${currentStep >= 2 ? 'border-sky-600' : 'border-neutral-300'} ${currentStep === 2 ? 'bg-sky-600 text-white' : 'bg-white text-neutral-500'} text-xs font-semibold mr-1.5 transition-colors duration-300`}>2</div>
                      <span className={`${currentStep === 2 ? 'font-semibold' : 'font-normal'} text-xs transition-colors duration-300`}>Hesap Bilgileri</span>
                  </div>
              </div>
          </div>

          {error && (
            <div className="mb-5 flex items-start bg-red-50/80 border border-red-200/80 text-red-800 px-4 py-3 rounded-lg text-xs shadow-sm">
              <ExclamationCircleIconSolid className="w-4 h-4 mr-2 text-red-500 flex-shrink-0 mt-0.5"/>
              <span className="leading-tight flex-1 -mt-0.5">{error}</span>
              <button 
                onClick={() => setError('')} 
                className="ml-2 -mr-1 p-0.5 text-red-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-100/70"
                aria-label="Hata mesajını kapat"
              >
                <XMarkIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <form 
            className="space-y-4 mt-6"
            onSubmit={handleSubmit}
          >
            <div className={`${currentStep === 1 ? 'block' : 'hidden'} space-y-4 animate-fadeIn`}> 
              <div>
                <label htmlFor="companyName" className={labelClass}>
                  Şirket Adı
                </label>
                <div className="relative">
                   <div className={inputIconClass}>
                       <BuildingOfficeIcon className={inputIconSvgClass} />
                   </div>
                    <input
                      id="companyName"
                      name="companyName"
                      type="text"
                      autoComplete="organization"
                      required={currentStep === 1}
                      value={formData.companyName}
                      onChange={handleChange}
                      className={`${baseInputClass} ${inputPaddingClass} ${inputIconPaddingClass} ${normalBorderClass}`}
                      placeholder="ABC Turizm Ltd. Şti."
                    />
                 </div>
              </div>
              
              <div>
                <label htmlFor="companyType" className={labelClass}>
                  İşletme Türü
                </label>
                <div className="relative">
                   <div className={inputIconClass}>
                       <TagIcon className={inputIconSvgClass} />
                   </div>
                    <select
                      id="companyType"
                      name="companyType"
                      required={currentStep === 1}
                      value={formData.companyType}
                      onChange={handleChange}
                      className={`${baseInputClass} ${inputPaddingClass} ${inputIconPaddingClass} ${normalBorderClass} appearance-none pr-10 bg-white`}
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
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-400">
                      <ChevronRightIconSolid className="h-5 w-5 rotate-90 text-neutral-500" />
                    </div>
                 </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="contactName" className={labelClass}>
                      Yetkili Kişi
                    </label>
                    <div className="relative">
                       <div className={inputIconClass}>
                           <UserCircleIcon className={inputIconSvgClass} />
                       </div>
                        <input
                            id="contactName"
                            name="contactName"
                            type="text"
                            autoComplete="name"
                            required={currentStep === 1}
                            value={formData.contactName}
                            onChange={handleChange}
                            className={`${baseInputClass} ${inputPaddingClass} ${inputIconPaddingClass} ${normalBorderClass}`}
                            placeholder="Ad Soyad"
                        />
                     </div>
                 </div>
                
                 <div>
                    <label htmlFor="phone" className={labelClass}>
                      Yetkili Telefon
                    </label>
                    <div className="relative">
                       <div className={inputIconClass}>
                           <PhoneIcon className={inputIconSvgClass} />
                       </div>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            autoComplete="tel"
                            required={currentStep === 1}
                            value={formData.phone}
                            onChange={handleChange}
                            className={`${baseInputClass} ${inputPaddingClass} ${inputIconPaddingClass} ${normalBorderClass}`}
                            placeholder="(5XX) XXX XX XX"
                        />
                    </div>
                 </div>
              </div>
              
              <div>
                <label htmlFor="email" className={labelClass}>
                  Yetkili E-posta
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
                      required={currentStep === 1}
                      value={formData.email}
                      onChange={handleChange}
                      className={`${baseInputClass} ${inputPaddingClass} ${inputIconPaddingClass} ${normalBorderClass}`}
                      placeholder="yetkili@sirketiniz.com"
                    />
                 </div>
              </div>
            </div>

            <div className={`${currentStep === 2 ? 'block' : 'hidden'} space-y-4 animate-fadeIn`}>
              <div>
                <label htmlFor="password" className={labelClass}>
                  Yönetici Şifresi
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
                      required={currentStep === 2}
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
                      {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
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
                      required={currentStep === 2}
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
                            <XMarkIcon className="h-5 w-5 text-rose-500" />
                        )}
                        </div>
                    )}
                 </div>
                {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="mt-1 text-xs text-rose-600">Şifreler eşleşmiyor</p>
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
                      className="h-3.5 w-3.5 rounded border-neutral-300 text-sky-600 focus:ring-sky-500 focus:ring-offset-0"
                    />
                </div>
                <div className="ml-2.5 text-xs">
                    <label htmlFor="termsAccepted" className="text-neutral-600 leading-snug">
                        <Link href="/partner-terms" target="_blank" rel="noopener noreferrer" className="font-medium text-sky-600 hover:text-sky-800 hover:underline underline-offset-2 transition-colors duration-150">İş Ortağı Sözleşmesi</Link>
                        'ni ve <Link href="/partner-privacy" target="_blank" rel="noopener noreferrer" className="font-medium text-sky-600 hover:text-sky-800 hover:underline underline-offset-2 transition-colors duration-150">Gizlilik Politikası</Link>'nı okudum ve kabul ediyorum.
                    </label>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center justify-center py-2 px-4 rounded-lg border border-neutral-300 bg-white text-xs font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors duration-200 shadow-sm"
                >
                  <ChevronLeftIconSolid className="h-4 w-4 mr-1.5" />
                  Geri
                </button>
              ) : (
                <Link
                  href="/partner-login"
                  className="inline-flex items-center justify-center py-2 px-4 rounded-lg border border-neutral-300 bg-white text-xs font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors duration-200 shadow-sm"
                >
                  Giriş Yap
                </Link>
              )}

              {currentStep < 2 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepOneComplete()}
                  className="group inline-flex items-center justify-center py-2 px-4 border border-transparent rounded-lg text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-200 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-[0.98]"
                >
                  İleri
                  <ChevronRightIconSolid className="h-4 w-4 ml-1.5 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || !isStepTwoComplete()}
                  className="group relative inline-flex items-center justify-center py-2 px-4 border border-transparent rounded-lg text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-200 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-[0.98] min-h-[36px]"
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      <UserPlusIconSolid className="h-5 w-5 mr-1.5" />
                      Hesap Oluştur
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          <div className="text-center pt-6">
            <p className="text-xs text-neutral-500">
              Sorularınız mı var? <a href="mailto:partners@tourtech.com" className="font-medium text-sky-600 hover:text-sky-800 hover:underline underline-offset-2 transition-colors duration-150">Destek ile iletişime geçin</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 