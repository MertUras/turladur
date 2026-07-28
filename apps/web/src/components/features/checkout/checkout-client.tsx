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
import type { Experience, Tour } from '@turta/shared-types';

import { BookingSteps } from '@/components/booking/booking-steps';
import { EmailOtpPanel } from '@/components/features/auth/email-otp-panel';
import {
  PhoneInput,
  formatFullPhone,
  parsePhoneValue,
} from '@/components/ui/phone-input';
import { SHARED_ADULT_KEY, SHARED_CHILD_KEY } from '@/lib/booking-utils';
import { BANK_TRANSFER_DETAILS } from '@/lib/constants/bank-transfer';
import { getPhoneValidationError, isValidFullPhone } from '@/lib/phone-rules';
import { isValidTckn } from '@/lib/tckn';
import { ApiError } from '@/services/api-client';
import { getExperienceById, getExperienceDates } from '@/services/activity';
import {
  getTourById,
  getTourDates,
  getTourPickupPoints,
  type TourDateRow,
  type TourPickupPoint,
} from '@/services/catalog';
import { checkoutPayment, createReservation } from '@/services/booking';
import { guestBootstrap, getProfile } from '@/services/identity';
import { useAuth } from '@/providers/auth-provider';
import type { ActivityDate, User } from '@turta/shared-types';

type CardBrand = 'visa' | 'mastercard' | 'amex' | 'unknown';

function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

function detectCardBrand(cardNumber: string): CardBrand {
  const digits = digitsOnly(cardNumber);
  if (/^4/.test(digits)) return 'visa';
  if (/^3[47]/.test(digits)) return 'amex';
  if (/^5[1-5]/.test(digits) || /^2(2[2-9]|[3-6]\d|7[01])/.test(digits)) {
    return 'mastercard';
  }
  return 'unknown';
}

function formatCardNumberInput(value: string, brand: CardBrand): string {
  const maxLen = brand === 'amex' ? 15 : 16;
  const digits = digitsOnly(value).slice(0, maxLen);
  if (brand === 'amex') {
    // 4-6-5 grouping
    const parts = [
      digits.slice(0, 4),
      digits.slice(4, 10),
      digits.slice(10, 15),
    ].filter(Boolean);
    return parts.join(' ');
  }
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

function formatExpiryInput(value: string): string {
  const digits = digitsOnly(value).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function formatCvcInput(value: string, brand: CardBrand): string {
  const maxLen = brand === 'amex' ? 4 : 3;
  return digitsOnly(value).slice(0, maxLen);
}

const CARD_BRAND_LABEL: Record<CardBrand, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'Amex',
  unknown: '',
};

type GuestForm = {
  firstName: string;
  lastName: string;
  birthDate: string;
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
    birthDate: '',
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

function toDateInputValue(value: string | null | undefined): string {
  if (!value?.trim()) return '';
  // Profile API returns YYYY-MM-DD; tolerate ISO datetime. Clamp year to 4 digits.
  const match = value.trim().match(/^(\d+)-(\d{2})-(\d{2})/);
  if (!match) return '';
  return `${match[1].slice(0, 4)}-${match[2]}-${match[3]}`;
}

function clampBirthDateInput(raw: string): string {
  if (!raw) return '';
  const match = /^(\d+)-(\d{1,2})-(\d{1,2})$/.exec(raw);
  if (!match) return raw.slice(0, 10);
  const year = match[1].slice(0, 4);
  const month = match[2].padStart(2, '0').slice(0, 2);
  const day = match[3].padStart(2, '0').slice(0, 2);
  return `${year}-${month}-${day}`;
}

function applyProfileToPrimaryGuest(
  primary: GuestForm,
  profile: User,
): GuestForm {
  const parsedPhone = parsePhoneValue(profile.phone ?? '');
  return {
    ...primary,
    firstName: profile.firstName ?? '',
    lastName: profile.lastName ?? '',
    email: profile.email ?? '',
    phoneDial: parsedPhone.countryCode,
    phoneLocal: parsedPhone.localNumber,
    identityNumber: profile.identityNumber ?? '',
    birthDate: toDateInputValue(profile.birthDate),
    address: profile.address ?? '',
  };
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
  /** Fresh Nest `/identity/profile` — preferred over login memory snapshot. */
  const [profile, setProfile] = useState<User | null>(null);

  const [tour, setTour] = useState<Tour | null>(null);
  const [experience, setExperience] = useState<Experience | null>(null);
  const [tourDate, setTourDate] = useState<TourDateRow | null>(null);
  const [activityDate, setActivityDate] = useState<ActivityDate | null>(null);

  const [guests, setGuests] = useState<GuestForm[]>([]);
  const [billingFullName, setBillingFullName] = useState('');
  const [billingLine1, setBillingLine1] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingCountry, setBillingCountry] = useState('Türkiye');
  const [taxId, setTaxId] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [pickupPoints, setPickupPoints] = useState<TourPickupPoint[]>([]);
  const [pickupPointId, setPickupPointId] = useState('');

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('bank_transfer');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [threeDsHtml, setThreeDsHtml] = useState<string | null>(null);
  const [emailOtpVerified, setEmailOtpVerified] = useState(false);
  const [bankTransferAck, setBankTransferAck] = useState(false);

  const cardBrand = useMemo(() => detectCardBrand(cardNumber), [cardNumber]);
  const cardBrandLabel = CARD_BRAND_LABEL[cardBrand];
  const expectedCvcLength = cardBrand === 'amex' ? 4 : 3;
  const primaryEmail = guests[0]?.email?.trim() ?? '';

  useEffect(() => {
    setEmailOtpVerified(false);
  }, [primaryEmail]);

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
          const [t, dates, pickups] = await Promise.all([
            getTourById(itemId),
            getTourDates(itemId),
            getTourPickupPoints(itemId).catch(() => [] as TourPickupPoint[]),
          ]);
          setTour(t);
          setTourDate(dates.find((d) => d.id === dateId) ?? dates[0] ?? null);
          const activePickups = pickups.filter((p) => p.isActive !== false);
          // Partner update historically re-created pickups → duplicate rows in DB.
          // Deduplicate by city+location+time for checkout UX (keep first by order).
          const seenPickupKeys = new Set<string>();
          const uniquePickups = [...activePickups]
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .filter((point) => {
              const key = [
                point.city.trim().toLocaleLowerCase('tr-TR'),
                point.location.trim().toLocaleLowerCase('tr-TR'),
                point.time.trim(),
              ].join('|');
              if (seenPickupKeys.has(key)) return false;
              seenPickupKeys.add(key);
              return true;
            });
          setPickupPoints(uniquePickups);
          setPickupPointId(uniquePickups[0]?.id ?? '');
        } else {
          const [e, dates] = await Promise.all([
            getExperienceById(itemId),
            getExperienceDates(itemId),
          ]);
          setExperience(e);
          setActivityDate(
            dates.find((d) => d.id === dateId) ?? dates[0] ?? null,
          );
          setPickupPoints([]);
          setPickupPointId('');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Önizleme yüklenemedi');
      } finally {
        setLoading(false);
      }
    })();
  }, [itemId, dateId, isTour, isActivity]);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      setProfile(null);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const fresh = await getProfile(accessToken);
        if (!cancelled) setProfile(fresh);
      } catch {
        // Fallback: AuthProvider memory user (login payload).
        if (!cancelled) setProfile(user);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, accessToken, user]);

  useEffect(() => {
    const forms: GuestForm[] = [];
    let primary = emptyGuest('primary');
    const source = profile ?? user;
    if (source) {
      primary = applyProfileToPrimaryGuest(primary, source);
      setBillingFullName(
        `${source.firstName ?? ''} ${source.lastName ?? ''}`.trim(),
      );
      setBillingLine1(source.billingLine1 ?? source.address ?? '');
      setBillingCity(source.billingCity ?? '');
      setBillingCountry(source.billingCountry ?? 'Türkiye');
      setTaxId(source.identityNumber ?? '');
    }
    forms.push(primary);

    const extraAdults = Math.max(0, party.adults - 1);
    for (let i = 0; i < extraAdults; i += 1) {
      forms.push(emptyGuest('adult'));
    }
    for (let i = 0; i < party.children; i += 1) {
      forms.push(emptyGuest('child'));
    }

    setGuests(forms);
  }, [profile, user, party.adults, party.children]);

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

      if (guest.role === 'primary') {
        if (!isValidFullPhone(guest.phoneDial, guest.phoneLocal)) {
          return (
            getPhoneValidationError(guest.phoneLocal, guest.phoneDial) ??
            `${label}: geçerli telefon numarası zorunlu`
          );
        }

        if (!guest.email.trim() || !guest.email.includes('@')) {
          return `${label}: geçerli e-posta zorunlu`;
        }

        if (!guest.address.trim() || guest.address.trim().length < 5) {
          return `${label}: adres zorunlu (en az 5 karakter)`;
        }
      }
    }

    if (isTour && pickupPoints.length > 0 && !pickupPointId) {
      return 'Kalkış noktası seçimi zorunlu';
    }

    if (!billingFullName.trim() || billingFullName.trim().length < 2) {
      return 'Fatura / ödeme sahibi ad soyad zorunlu';
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
    emailOtpVerified &&
    (paymentMethod === 'bank_transfer'
      ? bankTransferAck
      : digitsOnly(cardNumber).length >= 15 &&
        digitsOnly(cardExpiry).length === 4 &&
        digitsOnly(cardCvc).length >= expectedCvcLength &&
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
          ...(isTour && pickupPointId ? { pickupPointId } : {}),
          adults: party.adults,
          children: party.children,
          contactEmail: primary.email,
          contactPhone: primaryPhone,
          guests: guests.map((guest, index) => ({
            firstName: guest.firstName.trim(),
            lastName: guest.lastName.trim(),
            birthDate: guest.birthDate.trim() || undefined,
            identityNumber: guest.identityNumber.replace(/\D/g, ''),
            ...(index === 0 || guest.phoneLocal.trim()
              ? {
                  phone: formatFullPhone(guest.phoneDial, guest.phoneLocal),
                }
              : {}),
            ...(index === 0 || guest.email.trim()
              ? { email: guest.email.trim() }
              : {}),
            address: guest.address.trim() || undefined,
          })),
          billing: {
            fullName: billingFullName.trim(),
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
        const payment = await checkoutPayment(
          {
            reservationId: reservation.id,
            cardHolderName: cardName,
            cardNumber: digitsOnly(cardNumber),
            expireMonth: month.trim().padStart(2, '0'),
            expireYear: year.trim().slice(-2),
            cvc: digitsOnly(cardCvc),
          },
          token,
        );

        if (payment.requires3ds && payment.threeDSHtmlContent) {
          // Bank / mock 3DS will POST to API callback → redirect to success
          sessionStorage.setItem(
            'turta.pendingCheckout',
            JSON.stringify({
              bookingNumber: reservation.bookingNumber,
              reservationId: reservation.id,
              title,
              totalPrice,
              paymentMethod,
              startDate: startDate ? String(startDate) : null,
            }),
          );
          setThreeDsHtml(payment.threeDSHtmlContent);
          setSubmitting(false);
          return;
        }
      }

      const params = new URLSearchParams({
        bookingNumber: reservation.bookingNumber,
        reservationId: reservation.id,
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
      setCurrentStep(2);
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

  if (threeDsHtml) {
    return (
      <div className="min-h-screen bg-neutral-950 px-4 py-8 text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-2 text-center text-xl font-semibold">
            3D Secure doğrulama
          </h1>
          <p className="mb-6 text-center text-sm text-neutral-400">
            Banka doğrulama ekranı. Sandbox SMS kodu genelde{' '}
            <strong className="text-white">123456</strong>.
          </p>
          <iframe
            title="3D Secure"
            className="h-[70vh] w-full rounded-xl border border-neutral-800 bg-white"
            srcDoc={threeDsHtml}
            sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation allow-top-navigation-by-user-activation"
          />
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
                          <div>
                            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                              Doğum Tarihi
                            </label>
                            <input
                              type="date"
                              value={guest.birthDate}
                              min="1900-01-01"
                              max={new Date().toISOString().slice(0, 10)}
                              onChange={(e) =>
                                updateGuest(index, {
                                  birthDate: clampBirthDateInput(
                                    e.target.value,
                                  ),
                                })
                              }
                              className="h-11 w-full rounded-lg border border-neutral-300 px-3 text-sm"
                            />
                          </div>
                          {guest.role === 'primary' ? (
                            <>
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
                                  E-posta{' '}
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  value={guest.email}
                                  onChange={(e) =>
                                    updateGuest(index, {
                                      email: e.target.value,
                                    })
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
                                  <span className="text-red-500"> *</span>
                                </label>
                                <input
                                  value={guest.address}
                                  onChange={(e) =>
                                    updateGuest(index, {
                                      address: e.target.value,
                                    })
                                  }
                                  placeholder="Açık adres"
                                  className="h-11 w-full rounded-lg border border-neutral-300 px-3 text-sm"
                                  required
                                />
                              </div>
                            </>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}

                  {isTour && pickupPoints.length > 0 ? (
                    <div className="rounded-xl border border-neutral-200/70 bg-white p-6 shadow-sm sm:p-8">
                      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-neutral-900">
                        <MapPin className="h-5 w-5" />
                        Kalkış noktası
                      </h2>
                      <select
                        value={pickupPointId}
                        onChange={(e) => setPickupPointId(e.target.value)}
                        className="h-11 w-full rounded-lg border border-neutral-300 px-3 text-sm"
                      >
                        {pickupPoints.map((point) => (
                          <option key={point.id} value={point.id}>
                            {point.city} — {point.location} ({point.time})
                          </option>
                        ))}
                      </select>
                      <p className="mt-2 text-xs text-neutral-500">
                        Koltuk numarası partner tarafından atanacaktır.
                      </p>
                    </div>
                  ) : null}

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
                          Ödeme / fatura sahibi{' '}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={billingFullName}
                          onChange={(e) => setBillingFullName(e.target.value)}
                          placeholder="Ad Soyad"
                          className="h-11 w-full rounded-lg border border-neutral-300 px-3 text-sm"
                          required
                        />
                      </div>
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
                      onClick={() => {
                        setPaymentMethod('bank_transfer');
                        setBankTransferAck(false);
                      }}
                      className={`rounded-xl border p-4 text-left ${
                        paymentMethod === 'bank_transfer'
                          ? 'border-neutral-950 bg-neutral-50'
                          : 'border-neutral-200'
                      }`}
                    >
                      <Building2 className="mb-2 h-5 w-5" />
                      <p className="font-semibold">Havale / EFT</p>
                      <p className="text-xs text-neutral-500">
                        IBAN bilgilerini görüp onaylayın
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod('card');
                        setBankTransferAck(false);
                      }}
                      className={`rounded-xl border p-4 text-left ${
                        paymentMethod === 'card'
                          ? 'border-neutral-950 bg-neutral-50'
                          : 'border-neutral-200'
                      }`}
                    >
                      <CreditCard className="mb-2 h-5 w-5" />
                      <p className="font-semibold">Kredi / Banka Kartı</p>
                      <p className="text-xs text-neutral-500">
                        Kart (3DS): …0008 mock 3DS · …0000 red · İyzico key
                        varsa sandbox test kartı
                      </p>
                    </button>
                  </div>

                  {paymentMethod === 'bank_transfer' ? (
                    <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
                      <p className="font-semibold">Havale / EFT bilgileri</p>
                      <dl className="mt-3 space-y-2 text-sm">
                        <div className="flex justify-between gap-3">
                          <dt className="text-amber-800/80">Banka</dt>
                          <dd className="font-medium text-right">
                            {BANK_TRANSFER_DETAILS.bankName}
                          </dd>
                        </div>
                        <div className="flex justify-between gap-3">
                          <dt className="text-amber-800/80">Hesap sahibi</dt>
                          <dd className="font-medium text-right">
                            {BANK_TRANSFER_DETAILS.accountHolder}
                          </dd>
                        </div>
                        <div className="flex justify-between gap-3">
                          <dt className="text-amber-800/80">Şube</dt>
                          <dd className="font-medium text-right">
                            {BANK_TRANSFER_DETAILS.branch}
                          </dd>
                        </div>
                        <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-3">
                          <dt className="text-amber-800/80">IBAN</dt>
                          <dd className="font-mono text-sm font-semibold tracking-wide sm:text-right">
                            {BANK_TRANSFER_DETAILS.iban}
                          </dd>
                        </div>
                      </dl>
                      <p className="mt-3 text-xs text-amber-800">
                        {BANK_TRANSFER_DETAILS.descriptionHint}. Partner ödemeyi
                        onayladıktan sonra rezervasyon kesinleşir.
                      </p>
                      <label className="mt-4 flex cursor-pointer items-start gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={bankTransferAck}
                          onChange={(e) => setBankTransferAck(e.target.checked)}
                          className="mt-1 h-4 w-4 rounded border-amber-400"
                        />
                        <span>
                          IBAN ve havale bilgilerini okudum, ödemeyi bu hesaba
                          yapacağımı onaylıyorum.
                        </span>
                      </label>
                    </div>
                  ) : null}

                  {paymentMethod === 'card' ? (
                    <div className="mt-6 space-y-3">
                      <input
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Kart üzerindeki isim"
                        autoComplete="cc-name"
                        className="h-11 w-full rounded-lg border border-neutral-300 px-3 text-sm"
                      />
                      <div className="relative">
                        <input
                          value={cardNumber}
                          onChange={(e) => {
                            const nextBrand = detectCardBrand(e.target.value);
                            setCardNumber(
                              formatCardNumberInput(e.target.value, nextBrand),
                            );
                            setCardCvc((prev) =>
                              formatCvcInput(prev, nextBrand),
                            );
                          }}
                          placeholder="5528 7900 0000 0008"
                          inputMode="numeric"
                          autoComplete="cc-number"
                          maxLength={19}
                          className="h-11 w-full rounded-lg border border-neutral-300 px-3 pr-28 text-sm tracking-wide"
                        />
                        {cardBrandLabel ? (
                          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-semibold uppercase tracking-wide text-neutral-600">
                            {cardBrandLabel}
                          </span>
                        ) : null}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          value={cardExpiry}
                          onChange={(e) =>
                            setCardExpiry(formatExpiryInput(e.target.value))
                          }
                          placeholder="AA/YY"
                          inputMode="numeric"
                          autoComplete="cc-exp"
                          maxLength={5}
                          className="h-11 rounded-lg border border-neutral-300 px-3 text-sm"
                        />
                        <input
                          value={cardCvc}
                          onChange={(e) =>
                            setCardCvc(
                              formatCvcInput(e.target.value, cardBrand),
                            )
                          }
                          placeholder={cardBrand === 'amex' ? 'CVC (4)' : 'CVC'}
                          inputMode="numeric"
                          autoComplete="cc-csc"
                          maxLength={expectedCvcLength}
                          className="h-11 rounded-lg border border-neutral-300 px-3 text-sm"
                        />
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-6">
                    <EmailOtpPanel
                      email={primaryEmail}
                      purpose="CHECKOUT"
                      firstName={guests[0]?.firstName}
                      verifyOnSubmit
                      onVerified={() => setEmailOtpVerified(true)}
                    />
                    {!primaryEmail ? (
                      <p className="mt-2 text-xs text-amber-700">
                        Önce katılımcı formunda e-posta girin.
                      </p>
                    ) : null}
                  </div>

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
                    {paymentMethod === 'bank_transfer' ? (
                      <li className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
                        <p className="font-semibold">IBAN</p>
                        <p className="mt-1 font-mono text-xs tracking-wide">
                          {BANK_TRANSFER_DETAILS.iban}
                        </p>
                        <p className="mt-1 text-xs">
                          {BANK_TRANSFER_DETAILS.bankName} ·{' '}
                          {BANK_TRANSFER_DETAILS.accountHolder}
                        </p>
                      </li>
                    ) : null}
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
