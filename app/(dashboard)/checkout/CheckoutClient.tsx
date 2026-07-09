'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { BookingSteps } from '@/app/components/booking/BookingSteps';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  CreditCardIcon,
  BuildingOffice2Icon,
  MapPinIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import {
  PAYMENT_METHOD_LABELS,
  PLACEHOLDER_BANK_DETAILS,
  PaymentMethodType,
  PaymentInitResult,
} from '@/app/lib/payments';
import {
  EMPTY_SPECIAL_CONDITIONS,
  SpecialConditionsData,
  formatSpecialConditionsSummary,
  getPhoneValidationError,
  isValidFullPhone,
  validateSpecialConditions,
} from '@/app/lib/special-conditions';
import SpecialConditionsSection from './SpecialConditionsSection';
import PhoneInput, { formatFullPhone, parsePhoneValue } from '@/app/components/PhoneInput';

interface CheckoutPreview {
  type: 'tour' | 'activity';
  itemId: string;
  dateId: string;
  title: string;
  image: string | null;
  location: string;
  startDate: string;
  endDate: string;
  participants: { adults: number; children: number; total: number };
  totalPrice: number;
  breakdown: { label: string; count: number; unitPrice: number; subtotal: number }[];
  operator: { name: string } | null;
  requiresEquipment?: boolean;
}

const STEPS = [
  { id: '01', name: 'Özet', description: 'Rezervasyon detaylarını inceleyin', status: 'current' as const },
  { id: '02', name: 'Bilgiler', description: 'İletişim bilgilerinizi girin', status: 'upcoming' as const },
  { id: '03', name: 'Ödeme', description: 'Ödeme yöntemini seçin', status: 'upcoming' as const },
  { id: '04', name: 'Onay', description: 'Rezervasyonu tamamlayın', status: 'upcoming' as const },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(price);
}

export default function CheckoutClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status: authStatus } = useSession();

  const type = searchParams.get('type');
  const itemId = searchParams.get('itemId');
  const dateId = searchParams.get('dateId');
  const participantsParam = searchParams.get('participants');

  const [currentStep, setCurrentStep] = useState(0);
  const [preview, setPreview] = useState<CheckoutPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+90');
  const [phoneLocal, setPhoneLocal] = useState('');
  const [specialConditions, setSpecialConditions] =
    useState<SpecialConditionsData>(EMPTY_SPECIAL_CONDITIONS);
  const [step2Errors, setStep2Errors] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('bank_transfer');

  // Kart placeholder alanları (gerçek ödeme entegrasyonu yok)
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      const callback = `/checkout?${searchParams.toString()}`;
      router.replace(`/login?callbackUrl=${encodeURIComponent(callback)}`);
    }
  }, [authStatus, router, searchParams]);

  useEffect(() => {
    if (session?.user) {
      const nameParts = (session.user.name || '').split(' ');
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
      setEmail(session.user.email || '');
      if (session.user.phone) {
        const parsed = parsePhoneValue(session.user.phone);
        setCountryCode(parsed.countryCode);
        setPhoneLocal(parsed.localNumber);
      }
    }
  }, [session]);

  const phone = useMemo(
    () => formatFullPhone(countryCode, phoneLocal),
    [countryCode, phoneLocal]
  );

  useEffect(() => {
    if (authStatus !== 'authenticated' || !type || !itemId || !dateId) {
      if (authStatus === 'authenticated' && (!type || !itemId || !dateId)) {
        setError('Eksik rezervasyon bilgisi. Lütfen tur veya aktivite sayfasından tekrar deneyin.');
        setLoading(false);
      }
      return;
    }

    const fetchPreview = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ type, itemId, dateId });
        if (participantsParam) params.set('participants', participantsParam);

        const res = await fetch(`/api/checkout/preview?${params.toString()}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Önizleme yüklenemedi');
        setPreview(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [authStatus, type, itemId, dateId, participantsParam]);

  const activeSteps = useMemo(
    () =>
      STEPS.map((step, index) => ({
        ...step,
        status:
          index < currentStep
            ? ('complete' as const)
            : index === currentStep
              ? ('current' as const)
              : ('upcoming' as const),
      })),
    [currentStep]
  );

  const canProceedStep1 = Boolean(preview);
  const canProceedStep2 =
    firstName.trim() &&
    lastName.trim() &&
    email.trim() &&
    phoneLocal.trim() &&
    isValidFullPhone(countryCode, phoneLocal);
  const canProceedStep3 =
    paymentMethod === 'bank_transfer' ||
    (cardNumber.trim().length >= 16 && cardExpiry.trim() && cardCvc.trim() && cardName.trim());

  const specialConditionsSummary = useMemo(
    () => formatSpecialConditionsSummary(specialConditions),
    [specialConditions]
  );

  const handleStep2Next = () => {
    const errors: Record<string, string> = {};

    if (!isValidFullPhone(countryCode, phoneLocal)) {
      errors.phone = getPhoneValidationError(phoneLocal, countryCode) ?? 'Geçerli bir telefon numarası girin.';
    }

    const conditionErrors = validateSpecialConditions(specialConditions);
    Object.assign(errors, conditionErrors);

    setStep2Errors(errors);
    if (Object.keys(errors).length === 0) {
      setCurrentStep(2);
    }
  };

  const handleSubmit = async () => {
    if (!preview || !type || !itemId || !dateId) return;

    setSubmitting(true);
    setError(null);

    try {
      const participants = participantsParam ? JSON.parse(participantsParam) : { total: 1 };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          itemId,
          dateId,
          participants,
          contact: { firstName, lastName, email, phone, specialConditions },
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Rezervasyon oluşturulamadı');

      const payment: PaymentInitResult = data.payment;
      const params = new URLSearchParams({
        bookingNumber: data.booking.bookingNumber,
        paymentMethod,
        title: preview.title,
        totalPrice: String(data.booking.totalPrice),
        startDate: data.booking.startDate,
      });

      if (payment.bankTransferDetails) {
        params.set('iban', payment.bankTransferDetails.iban);
        params.set('bankName', payment.bankTransferDetails.bankName);
      }

      router.push(`/checkout/success?${params.toString()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Rezervasyon tamamlanamadı');
    } finally {
      setSubmitting(false);
    }
  };

  if (authStatus === 'loading' || authStatus === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600 mx-auto mb-4" />
          <p className="text-neutral-600">Rezervasyon bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error && !preview) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-neutral-200/70 p-8 text-center">
          <ExclamationCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-neutral-900 mb-2">Rezervasyon Başlatılamadı</h1>
          <p className="text-neutral-600 mb-6">{error}</p>
          <Link
            href="/tours"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold transition-colors"
          >
            Turlara Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-16 md:pt-20 pb-10 sm:pb-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-2">
              Rezervasyonunu Tamamla
            </h1>
            <p className="text-lg text-neutral-600">
              Bilgilerini kontrol et, gerekli detayları ekle ve rezervasyonunu güvenle tamamla.
            </p>
          </div>

          <div className="mb-10">
            <BookingSteps steps={activeSteps} theme="sky" />
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Adım 1: Özet */}
              {currentStep === 0 && preview && (
                <div className="bg-white rounded-xl border border-neutral-200/70 shadow-sm p-6 sm:p-8">
                  <h2 className="text-xl font-bold text-neutral-900 mb-6">Rezervasyon Özeti</h2>
                  <div className="space-y-4">
                    <div className="flex gap-4 p-4 bg-sky-50/60 rounded-lg border border-sky-100">
                      <CalendarDaysIcon className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-neutral-700">Tarih</p>
                        <p className="text-neutral-900 font-semibold">
                          {format(new Date(preview.startDate), 'd MMMM yyyy', { locale: tr })}
                          {preview.type === 'tour' &&
                            ` – ${format(new Date(preview.endDate), 'd MMMM yyyy', { locale: tr })}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200/70">
                      <UserGroupIcon className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-neutral-700">Katılımcılar</p>
                        <p className="text-neutral-900 font-semibold">
                          {preview.participants.total} kişi
                          {preview.type === 'tour'
                            ? ` (${preview.participants.adults} yetişkin${
                                preview.participants.children > 0
                                  ? `, ${preview.participants.children} çocuk`
                                  : ''
                              })`
                            : preview.participants.children > 0 &&
                              ` (${preview.participants.adults} yetişkin, ${preview.participants.children} çocuk)`}
                        </p>
                      </div>
                    </div>
                    {preview.operator && (
                      <div className="flex gap-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200/70">
                        <MapPinIcon className="w-5 h-5 text-neutral-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-neutral-700">Operatör</p>
                          <p className="text-neutral-900">{preview.operator.name}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      disabled={!canProceedStep1}
                      className="inline-flex items-center px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Devam Et
                      <ChevronRightIcon className="ml-2 h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Adım 2: İletişim */}
              {currentStep === 1 && (
                <div className="bg-white rounded-xl border border-neutral-200/70 shadow-sm p-6 sm:p-8">
                  <h2 className="text-xl font-bold text-neutral-900 mb-6">
                    İletişim ve Rezervasyon Bilgileri
                  </h2>
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">Ad</label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full py-2.5 px-4 border border-neutral-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 text-neutral-900"
                          placeholder="Adınız"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">Soyad</label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full py-2.5 px-4 border border-neutral-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 text-neutral-900"
                          placeholder="Soyadınız"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">E-posta</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full py-2.5 px-4 border border-neutral-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 text-neutral-900"
                        placeholder="ornek@email.com"
                      />
                    </div>
                    <PhoneInput
                      countryCode={countryCode}
                      onCountryCodeChange={setCountryCode}
                      value={phoneLocal}
                      onChange={(value) => {
                        setPhoneLocal(value);
                        if (step2Errors.phone) {
                          setStep2Errors((prev) => {
                            const next = { ...prev };
                            delete next.phone;
                            return next;
                          });
                        }
                      }}
                      error={step2Errors.phone}
                      required
                    />
                    <SpecialConditionsSection
                      value={specialConditions}
                      onChange={(value) => {
                        setSpecialConditions(value);
                        if (Object.keys(step2Errors).length > 0) {
                          setStep2Errors((prev) => {
                            const phoneError = prev.phone ? { phone: prev.phone } : {};
                            return { ...phoneError, ...validateSpecialConditions(value) };
                          });
                        }
                      }}
                      requiresEquipment={preview?.requiresEquipment ?? false}
                      errors={step2Errors}
                    />
                  </div>
                  <div className="mt-8 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(0)}
                      className="inline-flex items-center px-5 py-2.5 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 font-medium"
                    >
                      <ChevronLeftIcon className="mr-2 h-5 w-5" />
                      Geri
                    </button>
                    <button
                      type="button"
                      onClick={handleStep2Next}
                      disabled={!canProceedStep2}
                      className="inline-flex items-center px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Devam Et
                      <ChevronRightIcon className="ml-2 h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Adım 3: Ödeme yöntemi */}
              {currentStep === 2 && (
                <div className="bg-white rounded-xl border border-neutral-200/70 shadow-sm p-6 sm:p-8">
                  <h2 className="text-xl font-bold text-neutral-900 mb-6">Ödeme Yöntemi</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bank_transfer')}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        paymentMethod === 'bank_transfer'
                          ? 'border-sky-600 bg-sky-50/60'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <BuildingOffice2Icon className="w-8 h-8 text-sky-600 mb-2" />
                      <p className="font-semibold text-neutral-900">Havale / EFT</p>
                      <p className="text-sm text-neutral-600 mt-1">Banka havalesi ile ödeme</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        paymentMethod === 'card'
                          ? 'border-sky-600 bg-sky-50/60'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <CreditCardIcon className="w-8 h-8 text-sky-600 mb-2" />
                      <p className="font-semibold text-neutral-900">Kredi & Banka Kartı</p>
                      <p className="text-sm text-neutral-600 mt-1">Güvenli kart ödemesi</p>
                    </button>
                  </div>

                  {paymentMethod === 'bank_transfer' && (
                    <div className="bg-neutral-50 rounded-xl p-5 border border-neutral-200/70 space-y-3">
                      <p className="text-sm font-semibold text-neutral-800">Banka Bilgileri (Demo)</p>
                      <div className="text-sm text-neutral-700 space-y-1.5">
                        <p>
                          <span className="font-medium">Banka:</span> {PLACEHOLDER_BANK_DETAILS.bankName}
                        </p>
                        <p>
                          <span className="font-medium">Hesap Sahibi:</span>{' '}
                          {PLACEHOLDER_BANK_DETAILS.accountHolder}
                        </p>
                        <p>
                          <span className="font-medium">IBAN:</span>{' '}
                          <span className="font-mono">{PLACEHOLDER_BANK_DETAILS.iban}</span>
                        </p>
                        <p className="text-neutral-500 text-xs pt-2">
                          {PLACEHOLDER_BANK_DETAILS.referenceNote}
                        </p>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
                        Kart ödeme entegrasyonu yakında aktif olacaktır. Bu alanlar yalnızca arayüz
                        önizlemesidir; gerçek ödeme işlenmez.
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                          Kart Numarası
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                          placeholder="1234 5678 9012 3456"
                          className="w-full py-2.5 px-4 border border-neutral-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 text-neutral-900"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                            Son Kullanma
                          </label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                            className="w-full py-2.5 px-4 border border-neutral-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 text-neutral-900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1.5">CVC</label>
                          <input
                            type="text"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            placeholder="123"
                            className="w-full py-2.5 px-4 border border-neutral-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 text-neutral-900"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                          Kart Üzerindeki İsim
                        </label>
                        <input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="Ad Soyad"
                          className="w-full py-2.5 px-4 border border-neutral-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 text-neutral-900"
                        />
                      </div>
                    </div>
                  )}

                  {specialConditionsSummary.length > 0 &&
                    !(
                      specialConditionsSummary.length === 1 &&
                      specialConditionsSummary[0] === 'Özel bir durum belirtilmedi.'
                    ) && (
                      <div className="mb-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200/70">
                        <p className="text-sm font-semibold text-neutral-800 mb-2">
                          Özel Durumlar ve Talepler
                        </p>
                        <ul className="text-sm text-neutral-600 space-y-1 list-disc list-inside">
                          {specialConditionsSummary.map((line, i) => (
                            <li key={i}>{line}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                  <div className="mt-8 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="inline-flex items-center px-5 py-2.5 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 font-medium"
                    >
                      <ChevronLeftIcon className="mr-2 h-5 w-5" />
                      Geri
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      disabled={!canProceedStep3}
                      className="inline-flex items-center px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Devam Et
                      <ChevronRightIcon className="ml-2 h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Adım 4: Onay */}
              {currentStep === 3 && preview && (
                <div className="bg-white rounded-xl border border-neutral-200/70 shadow-sm p-6 sm:p-8">
                  <h2 className="text-xl font-bold text-neutral-900 mb-6">Son Onay</h2>
                  <div className="space-y-4 text-sm">
                    <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200/70">
                      <p className="font-semibold text-neutral-900 mb-2">{preview.title}</p>
                      <p className="text-neutral-600">
                        {format(new Date(preview.startDate), 'd MMMM yyyy', { locale: tr })} ·{' '}
                        {preview.participants.total} katılımcı
                      </p>
                    </div>
                    <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200/70">
                      <p className="font-medium text-neutral-800">
                        {firstName} {lastName}
                      </p>
                      <p className="text-neutral-600">{email}</p>
                      <p className="text-neutral-600">{phone}</p>
                    </div>
                    {specialConditionsSummary.length > 0 &&
                      !(
                        specialConditionsSummary.length === 1 &&
                        specialConditionsSummary[0] === 'Özel bir durum belirtilmedi.'
                      ) && (
                        <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200/70">
                          <p className="font-medium text-neutral-800 mb-2">
                            Özel Durumlar ve Talepler
                          </p>
                          <ul className="text-neutral-600 space-y-1 list-disc list-inside">
                            {specialConditionsSummary.map((line, i) => (
                              <li key={i}>{line}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    <div className="p-4 bg-sky-50/60 rounded-lg border border-sky-100">
                      <p className="font-medium text-neutral-800">
                        Ödeme: {PAYMENT_METHOD_LABELS[paymentMethod]}
                      </p>
                      <p className="text-2xl font-bold text-sky-700 mt-1">
                        {formatPrice(preview.totalPrice)}
                      </p>
                    </div>
                    <p className="text-xs text-neutral-500">
                      Rezervasyonu tamamladığınızda durum &quot;Ödeme Bekliyor&quot; olarak
                      kaydedilir. Havale onayı veya kart entegrasyonu sonrası rezervasyon
                      kesinleşir.
                    </p>
                  </div>
                  <div className="mt-8 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      disabled={submitting}
                      className="inline-flex items-center px-5 py-2.5 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 font-medium"
                    >
                      <ChevronLeftIcon className="mr-2 h-5 w-5" />
                      Geri
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="inline-flex items-center px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold disabled:opacity-60"
                    >
                      {submitting ? (
                        <>
                          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          İşleniyor...
                        </>
                      ) : (
                        <>
                          Rezervasyonu Tamamla
                          <CheckCircleIcon className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Yan panel */}
            {preview && (
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl border border-neutral-200/70 shadow-sm overflow-hidden sticky top-24">
                  {preview.image && (
                    <div className="relative h-40">
                      <Image src={preview.image} alt={preview.title} fill className="object-cover" />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-neutral-900">{preview.title}</h3>
                    <p className="text-sm text-neutral-600 flex items-center mt-1">
                      <MapPinIcon className="w-4 h-4 mr-1 text-neutral-400" />
                      {preview.location}
                    </p>
                    <div className="mt-4 pt-4 border-t border-neutral-200 space-y-2">
                      {preview.breakdown.map((line, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-neutral-600">
                            {line.label} × {line.count}
                          </span>
                          <span className="text-neutral-900">{formatPrice(line.subtotal)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between pt-3 border-t border-neutral-200">
                        <span className="font-semibold text-neutral-900">Toplam</span>
                        <span className="text-xl font-bold text-sky-700">
                          {formatPrice(preview.totalPrice)}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500">Vergiler dahildir</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
