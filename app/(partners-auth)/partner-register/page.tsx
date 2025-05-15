'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowRightIcon as ArrowRightIconSolid,
  ChevronLeftIcon as ChevronLeftIconSolid,
  UserPlusIcon as UserPlusIconSolid,
  XMarkIcon
} from '@heroicons/react/20/solid';
import {
  ArrowRightIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  LockClosedIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeAltIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

export default function PartnerRegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    website: '',
    description: '',
    termsAccepted: false,
    role: '',
  });

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
    
    if (!formData.termsAccepted) {
      setError('Devam etmek için İş Ortağı Sözleşmesi ve Gizlilik Politikasını kabul etmelisiniz.');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/partner-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: formData.companyName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          website: formData.website,
          description: formData.description,
          role: formData.role || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Kayıt sırasında bir hata oluştu');
      }

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

  const isStepOneComplete = () => {
    return formData.companyName && formData.email && formData.password && formData.confirmPassword;
  };

  const isStepTwoComplete = () => {
    return formData.phone && formData.address && formData.city && formData.country;
  };

  return (
    <div className="min-h-screen flex bg-neutral-50">
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="İş Ortaklığı Platformu"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-sky-700/90 via-blue-800/85 to-sky-900/90 z-10"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-12 text-center">
          <div className="max-w-lg">
            <h2 className="text-4xl xl:text-5xl font-bold text-white mb-5 leading-tight tracking-normal">
              Turladur Partner Ağına Katılın
            </h2>
            <p className="text-lg text-sky-100/90 mb-10 font-light">
              Binlerce turistin seyahat planlarını yönetin, gelirinizi artırın ve işinizi büyütün.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <Link href="/" className="inline-flex items-center mb-6 group">
              <div className="mr-2.5 flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center shadow group-hover:scale-105 transition-transform duration-200">
                  <BuildingOfficeIcon className="w-4 h-4 text-white" />
                </div>
              </div>
              <span className="text-xl font-semibold text-neutral-800 group-hover:text-sky-700 transition-colors">Turladur <span className="text-sky-600">Partner</span></span>
            </Link>
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3 tracking-tight">
              İş Ortağı Hesabı Oluşturun
            </h2>
            <p className="text-sm text-neutral-500">
              Turladur partner ağına katılarak işinizi büyütün.
            </p>
          </div>

          {error && (
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md mb-5 flex items-start bg-red-50/80 border border-red-200/80 text-red-800 px-4 py-3 rounded-lg text-xs shadow-sm">
              <XMarkIcon className="w-4 h-4 mr-2 text-red-500 flex-shrink-0 mt-0.5"/>
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

          <form className="space-y-5" onSubmit={handleSubmit}>
            {currentStep === 1 ? (
              <>
                <div>
                  <label htmlFor="companyName" className="block text-xs font-medium text-neutral-700 mb-1.5">
                    Şirket Adı
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BuildingOfficeIcon className="h-4 w-4 text-neutral-400" />
                    </div>
                    <input
                      id="companyName"
                      name="companyName"
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="block w-full rounded-lg border border-neutral-300 focus:border-sky-500 focus:ring-sky-300 py-2.5 pl-9 pr-4 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-offset-0 sm:text-sm transition duration-200 ease-in-out shadow-sm focus:bg-white"
                      placeholder="Şirketinizin adı"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-neutral-700 mb-1.5">
                    E-posta Adresi
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-4 w-4 text-neutral-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="block w-full rounded-lg border border-neutral-300 focus:border-sky-500 focus:ring-sky-300 py-2.5 pl-9 pr-4 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-offset-0 sm:text-sm transition duration-200 ease-in-out shadow-sm focus:bg-white"
                      placeholder="partner@sirketiniz.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-xs font-medium text-neutral-700 mb-1.5">
                    Şifre
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-4 w-4 text-neutral-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="block w-full rounded-lg border border-neutral-300 focus:border-sky-500 focus:ring-sky-300 py-2.5 pl-9 pr-4 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-offset-0 sm:text-sm transition duration-200 ease-in-out shadow-sm focus:bg-white"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-xs font-medium text-neutral-700 mb-1.5">
                    Şifre Tekrar
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-4 w-4 text-neutral-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="block w-full rounded-lg border border-neutral-300 focus:border-sky-500 focus:ring-sky-300 py-2.5 pl-9 pr-4 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-offset-0 sm:text-sm transition duration-200 ease-in-out shadow-sm focus:bg-white"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="role" className="block text-xs font-medium text-neutral-700 mb-1.5">
                    Rol
                  </label>
                  <select
                    id="role"
                    name="role"
                    required
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    className="block w-full rounded-lg border border-neutral-300 focus:border-sky-500 focus:ring-sky-300 py-2.5 pl-3 pr-4 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-offset-0 sm:text-sm transition duration-200 ease-in-out shadow-sm focus:bg-white"
                  >
                    <option value="">Rol Seçiniz</option>
                    <option value="TOUR_OPERATOR">Tur Operatörü</option>
                    <option value="EXPERIENCE_PROVIDER">Aktivite Operatörü</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor="phone" className="block text-xs font-medium text-neutral-700 mb-1.5">
                    Telefon
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <PhoneIcon className="h-4 w-4 text-neutral-400" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="block w-full rounded-lg border border-neutral-300 focus:border-sky-500 focus:ring-sky-300 py-2.5 pl-9 pr-4 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-offset-0 sm:text-sm transition duration-200 ease-in-out shadow-sm focus:bg-white"
                      placeholder="+90 555 555 55 55"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-xs font-medium text-neutral-700 mb-1.5">
                    Adres
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPinIcon className="h-4 w-4 text-neutral-400" />
                    </div>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="block w-full rounded-lg border border-neutral-300 focus:border-sky-500 focus:ring-sky-300 py-2.5 pl-9 pr-4 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-offset-0 sm:text-sm transition duration-200 ease-in-out shadow-sm focus:bg-white"
                      placeholder="Şirket adresi"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-xs font-medium text-neutral-700 mb-1.5">
                      Şehir
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPinIcon className="h-4 w-4 text-neutral-400" />
                      </div>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="block w-full rounded-lg border border-neutral-300 focus:border-sky-500 focus:ring-sky-300 py-2.5 pl-9 pr-4 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-offset-0 sm:text-sm transition duration-200 ease-in-out shadow-sm focus:bg-white"
                        placeholder="Şehir"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-xs font-medium text-neutral-700 mb-1.5">
                      Ülke
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPinIcon className="h-4 w-4 text-neutral-400" />
                      </div>
                      <input
                        id="country"
                        name="country"
                        type="text"
                        required
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="block w-full rounded-lg border border-neutral-300 focus:border-sky-500 focus:ring-sky-300 py-2.5 pl-9 pr-4 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-offset-0 sm:text-sm transition duration-200 ease-in-out shadow-sm focus:bg-white"
                        placeholder="Ülke"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="website" className="block text-xs font-medium text-neutral-700 mb-1.5">
                    Web Sitesi
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <GlobeAltIcon className="h-4 w-4 text-neutral-400" />
                    </div>
                    <input
                      id="website"
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="block w-full rounded-lg border border-neutral-300 focus:border-sky-500 focus:ring-sky-300 py-2.5 pl-9 pr-4 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-offset-0 sm:text-sm transition duration-200 ease-in-out shadow-sm focus:bg-white"
                      placeholder="https://www.sirketiniz.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-xs font-medium text-neutral-700 mb-1.5">
                    Şirket Açıklaması
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                      <DocumentTextIcon className="h-4 w-4 text-neutral-400" />
                    </div>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="block w-full rounded-lg border border-neutral-300 focus:border-sky-500 focus:ring-sky-300 py-2.5 pl-9 pr-4 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-offset-0 sm:text-sm transition duration-200 ease-in-out shadow-sm focus:bg-white"
                      placeholder="Şirketinizi kısaca tanıtın..."
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={formData.termsAccepted}
                    onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                    className="h-4 w-4 rounded border-neutral-300 text-sky-600 focus:ring-sky-500"
                  />
                  <label htmlFor="terms" className="ml-2 block text-xs text-neutral-700">
                    <span>
                      <Link href="/terms" className="text-sky-600 hover:text-sky-800 hover:underline">
                        İş Ortağı Sözleşmesi
                      </Link>
                      {' '}ve{' '}
                      <Link href="/privacy" className="text-sky-600 hover:text-sky-800 hover:underline">
                        Gizlilik Politikası
                      </Link>
                      'nı okudum ve kabul ediyorum.
                    </span>
                  </label>
                </div>
              </>
            )}

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

              {currentStep === 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center justify-center py-2 px-4 rounded-lg border border-transparent text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors duration-200 shadow-sm"
                >
                  Devam Et
                  <ArrowRightIconSolid className="ml-1.5 h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center py-2 px-4 rounded-lg border border-transparent text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors duration-200 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      <UserPlusIconSolid className="h-4 w-4 mr-1.5" />
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