'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  AlertCircle,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  MapPin,
  Users,
} from 'lucide-react';
import type { Experience, Tour } from '@turladur/shared-types';

import { BookingSteps } from '@/components/booking/booking-steps';
import {
  PhoneInput,
  formatFullPhone,
  parsePhoneValue,
} from '@/components/ui/phone-input';
import { SHARED_ADULT_KEY, SHARED_CHILD_KEY } from '@/lib/booking-utils';
import { getPhoneValidationError, isValidFullPhone } from '@/lib/phone-rules';
import { isValidTckn } from '@/lib/tckn';
import { ApiError } from '@/services/api-client';
import { getExperienceById, getExperienceDates } from '@/services/activity';
import {
  getTourById,
  getTourDates,
  type TourDateRow,
} from '@/services/catalog';
import { checkoutPayment, createReservation } from '@/services/booking';
import { guestBootstrap } from '@/services/identity';
import { useAuth } from '@/providers/auth-provider';
import type { ActivityDate } from '@turladur/shared-types';

type GuestForm = {
  firstName: string;
  lastName: string;
  identityNumber: string;
  phoneDial: string;
  phoneLocal: string;
  email: string;
  address: string;
  role: 'primary' | 'adult' | 'child';
};

type PaymentMethod = 'bank_transfer' | 'card';

const STEPS = [
  { id: '01', name: 'Özet', description: 'Rezervasyon detaylarını inceleyin' },
  { id: '02', name: 'Bilgiler', description: 'Katılımcı ve fatura bilgileri' },
  { id: '03', name: 'Ödeme', description: 'Ödeme yöntemini seçin' },
  { id: '04', name: 'Onay', description: 'Rezervasyonu tamamlayın' },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(price);
}

function emptyGuest(role: GuestForm['role']): GuestForm {
  return {
    firstName: '',
    lastName: '',
    identityNumber: '',
    phoneDial: '+90',
    phoneLocal: '',
    email: '',
    address: '',
    role,
  };
}

function parsePartySize(searchParams: URLSearchParams): {
  adults: number;
  children: number;
} {
  const adultsParam = Number(searchParams.get('adults') || '');
  const childrenParam = Number(searchParams.get('children') || '');
  if (Number.isFinite(adultsParam) && adultsParam >= 1) {
    return {
      adults: adultsParam,
      children:
        Number.isFinite(childrenParam) && childrenParam >= 0
          ? childrenParam
          : 0,
    };
  }

  const raw = searchParams.get('participants');
  if (!raw) return { adults: 1, children: 0 };
  try {
    const parsed = JSON.parse(raw) as Record<string, number>;
    if (SHARED_ADULT_KEY in parsed || SHARED_CHILD_KEY in parsed) {
      return {
        adults: Number(parsed[SHARED_ADULT_KEY] || 0) || 1,
        children: Number(parsed[SHARED_CHILD_KEY] || 0) || 0,
      };
    }
    if (typeof parsed.total === 'number' && parsed.total >= 1) {
      return { adults: parsed.total, children: 0 };
    }
    const sum = Object.values(parsed).reduce(
      (acc, value) => acc + (Number(value) || 0),
      0,
    );
    return { adults: Math.max(1, sum), children: 0 };
  } catch {
    return { adults: 1, children: 0 };
  }
}

export function CheckoutClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, accessToken, user } = useAuth();

  const type = searchParams.get('type'); // tour | activity
  const itemId = searchParams.get('itemId') || '';
  const dateId = searchParams.get('dateId') || '';
  const party = useMemo(() => parsePartySize(searchParams), [searchParams]);

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [tour, setTour] = useState<Tour | null>(null);
  const [experience, setExperience] = useState<Experience | null>(null);
  const [tourDate, setTourDate] = useState<TourDateRow | null>(null);
  const [activityDate, setActivityDate] = useState<ActivityDate | null>(null);

  const [guests, setGuests] = useState<GuestForm[]>([]);
  const [billingLine1, setBillingLine1] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingCountry, setBillingCountry] = useState('Türkiye');
  const [taxId, setTaxId] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('bank_transfer');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');

  const isTour = type === 'tour';
  const isActivity = type === 'activity';
  const isGuest = !isAuthenticated;

  useEffect(() => {
    if (!itemId || !dateId || (!isTour && !isActivity)) {
      setError(
        'Eksik rezervasyon bilgisi. Lütfen tur veya aktivite sayfasından tekrar deneyin.',
      );
      setLoading(false);
      return;
    }

    void (async () => {
      setLoading(true);
      setError(null);
      try {
        if (isTour) {
          const [t, dates] = await Promise.all([
            getTourById(itemId),
            getTourDates(itemId),
          ]);
          setTour(t);
          setTourDate(dates.find((d) => d.id === dateId) ?? dates[0] ?? null);
        } else {
          const [e, dates] = await Promise.all([
            getExperienceById(itemId),
            getExperienceDates(itemId),
          ]);
          setExperience(e);
          setActivityDate(
            dates.find((d) => d.id === dateId) ?? dates[0] ?? null,
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Önizleme yüklenemedi');
      } finally {
        setLoading(false);
      }
    })();
  }, [itemId, dateId, isTour, isActivity]);

  useEffect(() => {
    const forms: GuestForm[] = [];
    const primary = emptyGuest('primary');
    if (user) {
      primary.firstName = user.firstName ?? '';
      primary.lastName = user.lastName ?? '';
      primary.email = user.email ?? '';
      const parsedPhone = parsePhoneValue(user.phone ?? '');
      primary.phoneDial = parsedPhone.countryCode;
      primary.phoneLocal = parsedPhone.localNumber;
      primary.identityNumber = user.identityNumber ?? '';
      primary.address = user.address ?? '';
      setBillingLine1(user.billingLine1 ?? user.address ?? '');
      setBillingCity(user.billingCity ?? '');
      setBillingCountry(user.billingCountry ?? 'Türkiye');
      setTaxId(user.identityNumber ?? '');
    }
    forms.push(primary);

    const extraAdults = isGuest
      ? Math.max(0, party.adults - 1)
      : Math.max(0, party.adults - 1);
    for (let i = 0; i < extraAdults; i += 1) {
      forms.push(emptyGuest('adult'));
    }
    // Guest: all adults already counted (1 primary + extras). Logged-in same.
    // For guest with adults=2: primary + 1 adult. Good.
    // Wait: guest should ask for ALL. primary is adult 1, extras = adults-1. Same.
    // Children: always collect full forms for each child (both guest and logged-in)
    for (let i = 0; i < party.children; i += 1) {
      forms.push(emptyGuest('child'));
    }

    // Guest edge: if somehow adults=0, keep at least primary
    setGuests(forms);
  }, [user, isGuest, party.adults, party.children]);

  const unitPrice = useMemo(() => {
    if (isTour && tourDate) {
      return Number(tourDate.priceOverride ?? tour?.price ?? 0);
    }
    if (isActivity && activityDate) {
      return Number(activityDate.price ?? experience?.price ?? 0);
    }
    return Number(tour?.price ?? experience?.price ?? 0);
  }, [isTour, isActivity, tourDate, activityDate, tour, experience]);

  const partySize = party.adults + party.children;
  const totalPrice = unitPrice * partySize;

  const title = tour?.title ?? experience?.title ?? 'Rezervasyon';
  const image = tour?.coverUrl ?? null;
  const startDate = tourDate?.startDate ?? activityDate?.startDate ?? null;
  const endDate = tourDate?.endDate ?? activityDate?.endDate ?? null;

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
    [currentStep],
  );

  const updateGuest = (index: number, patch: Partial<GuestForm>) => {
    setGuests((prev) =>
      prev.map((guest, i) => (i === index ? { ...guest, ...patch } : guest)),
    );
  };

  const validateGuests = (): string | null => {
    for (let i = 0; i < guests.length; i += 1) {
      const guest = guests[i];
      const label =
        guest.role === 'primary'
          ? 'Birincil katılımcı'
          : guest.role === 'child'
            ? `Çocuk ${i}`
            : `Katılımcı ${i + 1}`;

      if (!guest.firstName.trim() || !guest.lastName.trim()) {
        return `${label}: ad ve soyad zorunlu`;
      }

      const tckn = guest.identityNumber.replace(/\D/g, '');
      if (!tckn) {
        return `${label}: TC kimlik no zorunlu`;
      }
      if (!isValidTckn(tckn)) {
        return `${label}: geçerli bir TC kimlik no girin`;
      }

      if (!isValidFullPhone(guest.phoneDial, guest.phoneLocal)) {
        return (
          getPhoneValidationError(guest.phoneLocal, guest.phoneDial) ??
          `${label}: geçerli telefon numarası zorunlu`
        );
      }

      if (!guest.email.trim() || !guest.email.includes('@')) {
        return `${label}: geçerli e-posta zorunlu`;
      }

      // Adres yalnızca satın alan (birincil) kullanıcıda zorunlu
      if (guest.role === 'primary') {
        if (!guest.address.trim() || guest.address.trim().length < 5) {
          return `${label}: adres zorunlu (en az 5 karakter)`;
        }
      }
    }

    if (!billingLine1.trim() || billingLine1.trim().length < 5) {
      return 'Fatura adresi zorunlu';
    }
    if (!billingCity.trim()) {
      return 'Fatura şehri zorunlu';
    }
    if (!billingCountry.trim()) {
      return 'Fatura ülkesi zorunlu';
    }

    return null;
  };

  const handleStep2Next = () => {
    const validationError = validateGuests();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setCurrentStep(2);
  };

  const canProceedPayment =
    paymentMethod === 'bank_transfer' ||
    (cardNumber.replace(/\s/g, '').length >= 15 &&
      cardExpiry.trim().length >= 4 &&
      cardCvc.trim().length >= 3 &&
      cardName.trim().length > 0);

  const handleSubmit = async () => {
    const validationError = validateGuests();
    if (validationError) {
      setError(validationError);
      setCurrentStep(1);
      return;
    }
    if (!dateId) return;

    setSubmitting(true);
    setError(null);

    try {
      const primary = guests[0];
      const primaryPhone = formatFullPhone(
        primary.phoneDial,
        primary.phoneLocal,
      );
      let token = accessToken;

      if (!token) {
        const boot = await guestBootstrap({
          email: primary.email,
          firstName: primary.firstName,
          lastName: primary.lastName,
          phone: primaryPhone,
          address: primary.address,
          billingLine1,
          billingCity,
          billingCountry,
          identityNumber: primary.identityNumber.replace(/\D/g, ''),
        });
        token = boot.accessToken;
      }

      if (!token) {
        throw new Error('Oturum oluşturulamadı');
      }

      const reservation = await createReservation(
        {
          ...(isTour ? { tourDateId: dateId } : { activityDateId: dateId }),
          adults: party.adults,
          children: party.children,
          contactEmail: primary.email,
          contactPhone: primaryPhone,
          guests: guests.map((guest) => ({
            firstName: guest.firstName.trim(),
            lastName: guest.lastName.trim(),
            identityNumber: guest.identityNumber.replace(/\D/g, ''),
            phone: formatFullPhone(guest.phoneDial, guest.phoneLocal),
            email: guest.email.trim(),
            address: guest.address.trim() || undefined,
          })),
          billing: {
            line1: billingLine1.trim(),
            city: billingCity.trim(),
            country: billingCountry.trim(),
            taxId:
              (taxId || primary.identityNumber).replace(/\D/g, '') || undefined,
            companyName: companyName || undefined,
          },
          specialRequests: specialRequests.trim() || undefined,
        },
        token,
      );

      if (paymentMethod === 'card') {
        const [month, year] = cardExpiry.includes('/')
          ? cardExpiry.split('/')
          : [cardExpiry.slice(0, 2), cardExpiry.slice(2)];
        await checkoutPayment(
          {
            reservationId: reservation.id,
            cardHolderName: cardName,
            cardNumber: cardNumber.replace(/\s/g, ''),
            expireMonth: month.trim().padStart(2, '0'),
            expireYear: year.trim().slice(-2),
            cvc: cardCvc.trim(),
          },
          token,
        );
      }

      const params = new URLSearchParams({
        bookingNumber: reservation.bookingNumber,
        title,
        totalPrice: String(totalPrice),
        paymentMethod,
      });
      if (startDate) params.set('startDate', String(startDate));
      router.push(`/checkout/success?${params.toString()}`);
    } catch (err) {
      if (err instanceof ApiError && err.code === 'EMAIL_ALREADY_REGISTERED') {
        const callback = `/checkout?${searchParams.toString()}`;
        setError(
          'Bu e-posta ile hesap var. Lütfen giriş yapıp rezervasyona devam edin.',
        );
        router.push(`/login?callbackUrl=${encodeURIComponent(callback)}`);
        return;
      }
      setError(
        err instanceof ApiError ? err.message : 'Rezervasyon tamamlanamadı',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const loginCallback = `/login?callbackUrl=${encodeURIComponent(`/checkout?${searchParams.toString()}`)}`;

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-b-2 border-neutral-950" />
          <p className="text-neutral-600">
            Rezervasyon bilgileri yükleniyor...
          </p>
        </div>
      </div>
    );
  }

  if (error && !tour && !experience) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-neutral-50 px-4">
        <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h1 className="mb-2 text-xl font-bold text-neutral-900">
            Rezervasyon Başlatılamadı
          </h1>
          <p className="mb-6 text-neutral-600">{error}</p>
          <Link
            href="/tours"
            className="inline-flex rounded-lg bg-neutral-950 px-6 py-2.5 font-semibold text-white hover:bg-neutral-800"
          >
            Turlara Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-14 pt-8 sm:pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              Rezervasyonunu Tamamla
            </h1>
            <p className="text-lg text-neutral-600">
              Bilgilerini kontrol et, katılımcı detaylarını ekle ve
              rezervasyonunu güvenle tamamla.
            </p>
          </div>

          {isGuest ? (
            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Üye olmadan devam ediyorsunuz. Fatura ve tüm katılımcı bilgileri
              alınacaktır.{' '}
              <Link href={loginCallback} className="font-semibold underline">
                Giriş yap
              </Link>
            </div>
          ) : null}

          <div className="mb-8">
            <BookingSteps steps={activeSteps} />
          </div>

          {error ? (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              {currentStep === 0 ? (
                <div className="rounded-xl border border-neutral-200/70 bg-white p-6 shadow-sm sm:p-8">
                  <h2 className="mb-6 text-xl font-bold text-neutral-900">
                    Rezervasyon Özeti
                  </h2>
                  <div className="space-y-4">
                    <div className="flex gap-4 rounded-lg border border-neutral-100 bg-neutral-50 p-4">
                      <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-neutral-950" />
                      <div>
                        <p className="text-sm font-medium text-neutral-700">
                          Tarih
                        </p>
                        <p className="font-semibold text-neutral-900">
                          {startDate
                            ? format(new Date(startDate), 'd MMMM yyyy', {
                                locale: tr,
                              })
                            : '—'}
                          {endDate
                            ? ` – ${format(new Date(endDate), 'd MMMM yyyy', { locale: tr })}`
                            : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4 rounded-lg border border-neutral-100 bg-neutral-50 p-4">
                      <Users className="mt-0.5 h-5 w-5 shrink-0 text-neutral-950" />
                      <div>
                        <p className="text-sm font-medium text-neutral-700">
                          Katılımcılar
                        </p>
                        <p className="font-semibold text-neutral-900">
                          {party.adults} yetişkin
                          {party.children > 0
                            ? `, ${party.children} çocuk`
                            : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4 rounded-lg border border-neutral-100 bg-neutral-50 p-4">
                      <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-neutral-950" />
                      <div>
                        <p className="text-sm font-medium text-neutral-700">
                          Ürün
                        </p>
                        <p className="font-semibold text-neutral-900">
                          {title}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="inline-flex items-center gap-2 rounded-lg bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
                    >
                      Devam et
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : null}

              {currentStep === 1 ? (
                <div className="space-y-6">
                  {guests.map((guest, index) => {
                    const heading =
                      guest.role === 'primary'
                        ? isGuest
                          ? 'Birincil katılımcı / iletişim'
                          : 'Üye bilgileri'
                        : guest.role === 'child'
                          ? `Çocuk ${guests.filter((g, i) => g.role === 'child' && i <= index).length}`
                          : `Ek yetişkin ${index}`;
                    return (
                      <div
                        key={`${guest.role}-${index}`}
                        className="rounded-xl border border-neutral-200/70 bg-white p-6 shadow-sm sm:p-8"
                      >
                        <h2 className="mb-4 text-lg font-bold text-neutral-900">
                          {heading}
                        </h2>
                        {!isGuest &&
                        guest.role === 'primary' &&
                        party.adults > 1 ? (
                          <p className="mb-4 text-xs text-neutral-500">
                            Üyelik bilgileriniz birincil katılımcı olarak
                            kullanılır. Diğer kişiler için ayrı form doldurun.
                          </p>
                        ) : null}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                              Ad <span className="text-red-500">*</span>
                            </label>
                            <input
                              value={guest.firstName}
                              onChange={(e) =>
                                updateGuest(index, {
                                  firstName: e.target.value,
                                })
                              }
                              placeholder="Ad"
                              className="h-11 w-full rounded-lg border border-neutral-300 px-3 text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                              Soyad <span className="text-red-500">*</span>
                            </label>
                            <input
                              value={guest.lastName}
                              onChange={(e) =>
                                updateGuest(index, { lastName: e.target.value })
                              }
                              placeholder="Soyad"
                              className="h-11 w-full rounded-lg border border-neutral-300 px-3 text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                              TC Kimlik No{' '}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              value={guest.identityNumber}
                              onChange={(e) =>
                                updateGuest(index, {
                                  identityNumber: e.target.value
                                    .replace(/\D/g, '')
                                    .slice(0, 11),
                                })
                              }
                              placeholder="11 haneli TC kimlik no"
                              inputMode="numeric"
                              maxLength={11}
                              className="h-11 w-full rounded-lg border border-neutral-300 px-3 text-sm"
                              required
                            />
                          </div>
                          <PhoneInput
                            countryCode={guest.phoneDial}
                            onCountryCodeChange={(dial) =>
                              updateGuest(index, { phoneDial: dial })
                            }
                            value={guest.phoneLocal}
                            onChange={(local) =>
                              updateGuest(index, { phoneLocal: local })
                            }
                            required
                          />
                          <div className="sm:col-span-2">
                            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                              E-posta <span className="text-red-500">*</span>
                            </label>
                            <input
                              value={guest.email}
                              onChange={(e) =>
                                updateGuest(index, { email: e.target.value })
                              }
                              type="email"
                              placeholder="E-posta"
                              className="h-11 w-full rounded-lg border border-neutral-300 px-3 text-sm"
                              required
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                              Adres
                              {guest.role === 'primary' ? (
                                <span className="text-red-500"> *</span>
                              ) : (
                                <span className="font-normal text-neutral-400">
                                  {' '}
                                  (opsiyonel)
                                </span>
                              )}
                            </label>
                            <input
                              value={guest.address}
                              onChange={(e) =>
                                updateGuest(index, { address: e.target.value })
                              }
                              placeholder={
                                guest.role === 'primary'
                                  ? 'Açık adres'
                                  : 'Adres (opsiyonel)'
                              }
                              className="h-11 w-full rounded-lg border border-neutral-300 px-3 text-sm"
                              required={guest.role === 'primary'}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div className="rounded-xl border border-neutral-200/70 bg-white p-6 shadow-sm sm:p-8">
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-neutral-900">
                      <Building2 className="h-5 w-5" />
                      Fatura bilgileri
                      <span className="text-xs font-normal text-neutral-500">
                        (zorunlu)
                      </span>
                    </h2>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                          Fatura adresi <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={billingLine1}
                          onChange={(e) => setBillingLine1(e.target.value)}
                          placeholder="Fatura adresi"
                          className="h-11 w-full rounded-lg border border-neutral-300 px-3 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                          Şehir <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={billingCity}
                          onChange={(e) => setBillingCity(e.target.value)}
                          placeholder="Şehir"
                          className="h-11 w-full rounded-lg border border-neutral-300 px-3 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                          Ülke <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={billingCountry}
                          onChange={(e) => setBillingCountry(e.target.value)}
                          placeholder="Ülke"
                          className="h-11 w-full rounded-lg border border-neutral-300 px-3 text-sm"
                          required
                        />
                      </div>
                      <input
                        value={taxId}
                        onChange={(e) =>
                          setTaxId(
                            e.target.value.replace(/\D/g, '').slice(0, 11),
                          )
                        }
                        placeholder="Vergi / TC No (opsiyonel)"
                        className="h-11 rounded-lg border border-neutral-300 px-3 text-sm"
                        inputMode="numeric"
                        maxLength={11}
                      />
                      <input
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Firma unvanı (opsiyonel)"
                        className="h-11 rounded-lg border border-neutral-300 px-3 text-sm"
                      />
                    </div>
                    <textarea
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="Özel istekler / notlar (opsiyonel)"
                      className="mt-3 min-h-[88px] w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                    />
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(0)}
                      className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Geri
                    </button>
                    <button
                      type="button"
                      onClick={handleStep2Next}
                      className="inline-flex items-center gap-2 rounded-lg bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
                    >
                      Devam et
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : null}

              {currentStep === 2 ? (
                <div className="rounded-xl border border-neutral-200/70 bg-white p-6 shadow-sm sm:p-8">
                  <h2 className="mb-6 text-xl font-bold text-neutral-900">
                    Ödeme Yöntemi
                  </h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bank_transfer')}
                      className={`rounded-xl border p-4 text-left ${
                        paymentMethod === 'bank_transfer'
                          ? 'border-neutral-950 bg-neutral-50'
                          : 'border-neutral-200'
                      }`}
                    >
                      <Building2 className="mb-2 h-5 w-5" />
                      <p className="font-semibold">Havale / EFT</p>
                      <p className="text-xs text-neutral-500">
                        Onay sonrası IBAN bilgisi
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`rounded-xl border p-4 text-left ${
                        paymentMethod === 'card'
                          ? 'border-neutral-950 bg-neutral-50'
                          : 'border-neutral-200'
                      }`}
                    >
                      <CreditCard className="mb-2 h-5 w-5" />
                      <p className="font-semibold">Kredi / Banka Kartı</p>
                      <p className="text-xs text-neutral-500">
                        Mock: …0008 başarılı
                      </p>
                    </button>
                  </div>

                  {paymentMethod === 'card' ? (
                    <div className="mt-6 space-y-3">
                      <input
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Kart üzerindeki isim"
                        className="h-11 w-full rounded-lg border border-neutral-300 px-3 text-sm"
                      />
                      <input
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="5528790000000008"
                        className="h-11 w-full rounded-lg border border-neutral-300 px-3 text-sm"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="AA/YY"
                          className="h-11 rounded-lg border border-neutral-300 px-3 text-sm"
                        />
                        <input
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          placeholder="CVC"
                          className="h-11 rounded-lg border border-neutral-300 px-3 text-sm"
                        />
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-8 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Geri
                    </button>
                    <button
                      type="button"
                      disabled={!canProceedPayment}
                      onClick={() => setCurrentStep(3)}
                      className="inline-flex items-center gap-2 rounded-lg bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-50"
                    >
                      Devam et
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : null}

              {currentStep === 3 ? (
                <div className="rounded-xl border border-neutral-200/70 bg-white p-6 shadow-sm sm:p-8">
                  <h2 className="mb-6 text-xl font-bold text-neutral-900">
                    Onay
                  </h2>
                  <ul className="space-y-2 text-sm text-neutral-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                      {title}
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                      {party.adults} yetişkin
                      {party.children > 0 ? `, ${party.children} çocuk` : ''}
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                      {guests.length} katılımcı formu tamamlandı
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                      Ödeme:{' '}
                      {paymentMethod === 'card' ? 'Kart' : 'Havale / EFT'}
                    </li>
                    <li className="flex items-start gap-2 font-semibold">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                      Toplam: {formatPrice(totalPrice)}
                    </li>
                  </ul>
                  <div className="mt-8 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Geri
                    </button>
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => void handleSubmit()}
                      className="inline-flex items-center gap-2 rounded-lg bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-60"
                    >
                      {submitting ? 'İşleniyor…' : 'Rezervasyonu tamamla'}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            <aside className="lg:col-span-1">
              <div className="sticky top-24 overflow-hidden rounded-xl border border-neutral-200/70 bg-white shadow-sm">
                <div className="relative aspect-[16/10] bg-neutral-200">
                  {image ? (
                    <Image
                      src={image}
                      alt={title}
                      fill
                      className="object-cover"
                      sizes="320px"
                    />
                  ) : null}
                </div>
                <div className="space-y-3 p-5">
                  <h3 className="text-lg font-bold text-neutral-900">
                    {title}
                  </h3>
                  <p className="text-sm text-neutral-600">
                    {party.adults} yetişkin
                    {party.children > 0 ? ` · ${party.children} çocuk` : ''}
                  </p>
                  <div className="border-t border-neutral-100 pt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">Birim</span>
                      <span>{formatPrice(unitPrice)}</span>
                    </div>
                    <div className="mt-2 flex justify-between text-base font-bold">
                      <span>Toplam</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutClient;
