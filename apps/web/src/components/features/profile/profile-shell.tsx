'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import type { Reservation, Review, User } from '@turta/shared-types';
import {
  CreditCard,
  FileDown,
  KeyRound,
  MessageSquare,
  Ticket,
  UserRound,
} from 'lucide-react';

import {
  downloadVoucherHtml,
  getReservationVoucher,
  listReservations,
} from '@/services/booking';
import {
  changePassword,
  updateProfile,
  type UpdateProfileInput,
} from '@/services/identity';
import { listMyReviews } from '@/services/review';
import { ApiError } from '@/services/api-client';
import { useAuth } from '@/providers/auth-provider';
import { cn } from '@/lib/utils';

type TabId = 'personal' | 'billing' | 'security' | 'bookings' | 'reviews';

const TABS: Array<{ id: TabId; label: string; icon: typeof UserRound }> = [
  { id: 'personal', label: 'Kişisel', icon: UserRound },
  { id: 'billing', label: 'Fatura', icon: CreditCard },
  { id: 'security', label: 'Güvenlik', icon: KeyRound },
  { id: 'bookings', label: 'Rezervasyonlar', icon: Ticket },
  { id: 'reviews', label: 'Yorumlarım', icon: MessageSquare },
];

function displayName(user: User) {
  const full = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  return full || user.email;
}

function initials(user: User) {
  const a = user.firstName?.[0] ?? user.email[0] ?? '?';
  const b = user.lastName?.[0] ?? '';
  return (a + b).toUpperCase();
}

function isValidTcknClient(value: string): boolean {
  if (!/^[1-9][0-9]{10}$/.test(value)) return false;
  const d = value.split('').map(Number);
  const odd = d[0] + d[2] + d[4] + d[6] + d[8];
  const even = d[1] + d[3] + d[5] + d[7];
  if ((odd * 7 - even) % 10 !== d[9]) return false;
  return d.slice(0, 10).reduce((s, n) => s + n, 0) % 10 === d[10];
}

/** YYYY-MM-DD; year clamped to 4 digits (some browsers allow typing 5+). */
function clampBirthDateInput(raw: string): string {
  if (!raw) return '';
  const match = /^(\d+)-(\d{1,2})-(\d{1,2})$/.exec(raw);
  if (!match) return raw.slice(0, 10);
  const year = match[1].slice(0, 4);
  const month = match[2].padStart(2, '0').slice(0, 2);
  const day = match[3].padStart(2, '0').slice(0, 2);
  return `${year}-${month}-${day}`;
}

function isValidBirthDateClient(value: string): boolean {
  if (!value) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const currentYear = new Date().getFullYear();
  if (year < 1900 || year > currentYear) return false;
  const parsed = new Date(year, month - 1, day);
  return (
    parsed.getFullYear() === year &&
    parsed.getMonth() === month - 1 &&
    parsed.getDate() === day &&
    parsed.getTime() <= Date.now()
  );
}

function toDateInputValue(isoOrDate: string | null | undefined): string {
  if (!isoOrDate) return '';
  return clampBirthDateInput(isoOrDate.slice(0, 10));
}

export function ProfileShell() {
  const { isAuthenticated, accessToken, user, refreshProfile } = useAuth();
  const [tab, setTab] = useState<TabId>('personal');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      void refreshProfile().catch(() => undefined);
    }
  }, [isAuthenticated, accessToken, refreshProfile]);

  if (!isAuthenticated || !user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-neutral-900">Profil</h1>
        <p className="mt-2 text-neutral-600">
          Bilgilerinizi görmek için giriş yapın.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex rounded-lg bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Giriş yap
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <header className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6 sm:flex-row sm:items-center sm:gap-6">
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-lg font-semibold text-neutral-800"
          aria-hidden
        >
          {initials(user)}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-bold text-neutral-900">
            {displayName(user)}
          </h1>
          <p className="truncate text-sm text-neutral-600">{user.email}</p>
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setTab(id);
                setMessage(null);
                setError(null);
              }}
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition',
                tab === id
                  ? 'bg-neutral-950 text-white'
                  : 'text-neutral-700 hover:bg-neutral-100',
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>

        <section className="rounded-2xl border border-neutral-200 bg-white p-6">
          {message ? (
            <p className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              {message}
            </p>
          ) : null}
          {error ? (
            <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          {tab === 'personal' ? (
            <PersonalTab
              user={user}
              token={accessToken!}
              onSaved={async () => {
                await refreshProfile();
                setMessage('Kişisel bilgiler kaydedildi.');
                setError(null);
              }}
              onError={setError}
            />
          ) : null}
          {tab === 'billing' ? (
            <BillingTab
              user={user}
              token={accessToken!}
              onSaved={async () => {
                await refreshProfile();
                setMessage('Fatura adresi kaydedildi.');
                setError(null);
              }}
              onError={setError}
            />
          ) : null}
          {tab === 'security' ? (
            <SecurityTab
              token={accessToken!}
              onSaved={() => {
                setMessage('Şifreniz güncellendi.');
                setError(null);
              }}
              onError={setError}
            />
          ) : null}
          {tab === 'bookings' ? <BookingsTab token={accessToken!} /> : null}
          {tab === 'reviews' ? <ReviewsTab token={accessToken!} /> : null}
        </section>
      </div>
    </div>
  );
}

function PersonalTab({
  user,
  token,
  onSaved,
  onError,
}: {
  user: User;
  token: string;
  onSaved: () => Promise<void>;
  onError: (msg: string) => void;
}) {
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const identityNumber = String(form.get('identityNumber') ?? '').trim();
    if (identityNumber && !isValidTcknClient(identityNumber)) {
      onError('TC Kimlik No geçersiz (11 hane, kontrol hanesi hatalı).');
      return;
    }

    const birthDateRaw = clampBirthDateInput(
      String(form.get('birthDate') ?? '').trim(),
    );
    if (birthDateRaw && !isValidBirthDateClient(birthDateRaw)) {
      onError('Doğum tarihi geçersiz (yıl 4 haneli, 1900–bugün arası).');
      return;
    }

    const payload: UpdateProfileInput = {
      firstName: String(form.get('firstName') ?? '').trim(),
      lastName: String(form.get('lastName') ?? '').trim(),
      phone: String(form.get('phone') ?? '').trim() || null,
      identityNumber: identityNumber || null,
      birthDate: birthDateRaw || null,
      address: String(form.get('address') ?? '').trim() || null,
    };

    setPending(true);
    try {
      await updateProfile(payload, token);
      await onSaved();
    } catch (err) {
      onError(err instanceof ApiError ? err.message : 'Kayıt başarısız');
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-neutral-900">
          Kişisel detaylar
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          Ad/soyad e-posta hesabınızla eşleşir; e-posta buradan değiştirilemez.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Ad"
          name="firstName"
          defaultValue={user.firstName ?? ''}
          required
        />
        <Field
          label="Soyad"
          name="lastName"
          defaultValue={user.lastName ?? ''}
          required
        />
      </div>

      <Field
        label="E-posta"
        name="email"
        defaultValue={user.email}
        readOnly
        hint="Değiştirmek için destek ile iletişime geçin."
      />

      <Field
        label="Telefon"
        name="phone"
        defaultValue={user.phone ?? ''}
        placeholder="+90 5xx xxx xx xx"
      />

      <Field
        label="TC Kimlik No"
        name="identityNumber"
        defaultValue={user.identityNumber ?? ''}
        placeholder="11 haneli"
        inputMode="numeric"
        maxLength={11}
        hint="Fatura ve rezervasyon için. Sadece siz görürsünüz."
      />

      <BirthDateField
        name="birthDate"
        defaultValue={toDateInputValue(user.birthDate)}
      />

      <label className="block text-sm font-medium text-neutral-800">
        Kişisel adres
        <textarea
          name="address"
          defaultValue={user.address ?? ''}
          rows={3}
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none ring-neutral-950 focus:ring-2"
        />
      </label>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-60"
        >
          {pending ? 'Kaydediliyor…' : 'Değişiklikleri kaydet'}
        </button>
      </div>
    </form>
  );
}

function BillingTab({
  user,
  token,
  onSaved,
  onError,
}: {
  user: User;
  token: string;
  onSaved: () => Promise<void>;
  onError: (msg: string) => void;
}) {
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload: UpdateProfileInput = {
      billingLine1: String(form.get('billingLine1') ?? '').trim() || null,
      billingLine2: String(form.get('billingLine2') ?? '').trim() || null,
      billingCity: String(form.get('billingCity') ?? '').trim() || null,
      billingState: String(form.get('billingState') ?? '').trim() || null,
      billingPostalCode:
        String(form.get('billingPostalCode') ?? '').trim() || null,
      billingCountry:
        String(form.get('billingCountry') ?? '').trim() || 'Türkiye',
    };

    setPending(true);
    try {
      await updateProfile(payload, token);
      await onSaved();
    } catch (err) {
      onError(err instanceof ApiError ? err.message : 'Kayıt başarısız');
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-neutral-900">
          Fatura adresi
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          Ödeme ve fatura kesiminde kullanılır. TC Kimlik kişisel sekmededir.
        </p>
      </div>

      <Field
        label="Adres satırı 1"
        name="billingLine1"
        defaultValue={user.billingLine1 ?? ''}
        required
      />
      <Field
        label="Adres satırı 2"
        name="billingLine2"
        defaultValue={user.billingLine2 ?? ''}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="İlçe / semt"
          name="billingCity"
          defaultValue={user.billingCity ?? ''}
        />
        <Field
          label="İl"
          name="billingState"
          defaultValue={user.billingState ?? ''}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Posta kodu"
          name="billingPostalCode"
          defaultValue={user.billingPostalCode ?? ''}
        />
        <Field
          label="Ülke"
          name="billingCountry"
          defaultValue={user.billingCountry ?? 'Türkiye'}
        />
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-60"
        >
          {pending ? 'Kaydediliyor…' : 'Fatura adresini kaydet'}
        </button>
      </div>
    </form>
  );
}

function SecurityTab({
  token,
  onSaved,
  onError,
}: {
  token: string;
  onSaved: () => void;
  onError: (msg: string) => void;
}) {
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const currentPassword = String(form.get('currentPassword') ?? '');
    const newPassword = String(form.get('newPassword') ?? '');
    const confirm = String(form.get('confirmPassword') ?? '');

    if (newPassword !== confirm) {
      onError('Yeni şifreler eşleşmiyor.');
      return;
    }

    setPending(true);
    try {
      await changePassword({ currentPassword, newPassword }, token);
      e.currentTarget.reset();
      onSaved();
    } catch (err) {
      onError(err instanceof ApiError ? err.message : 'Şifre güncellenemedi');
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-neutral-900">
          Şifre değiştir
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          En az 8 karakter, 1 büyük harf ve 1 rakam.
        </p>
      </div>
      <Field
        label="Mevcut şifre"
        name="currentPassword"
        type="password"
        required
      />
      <Field label="Yeni şifre" name="newPassword" type="password" required />
      <Field
        label="Yeni şifre (tekrar)"
        name="confirmPassword"
        type="password"
        required
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-60"
      >
        {pending ? 'Güncelleniyor…' : 'Şifreyi güncelle'}
      </button>
    </form>
  );
}

function BookingsTab({ token }: { token: string }) {
  const [items, setItems] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        setItems(await listReservations(token));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Yüklenemedi');
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  async function handleVoucher(reservation: Reservation) {
    setBusyId(reservation.id);
    setError(null);
    try {
      const voucher = await getReservationVoucher(reservation.id, token);
      downloadVoucherHtml(reservation.bookingNumber, voucher.html);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Voucher alınamadı');
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <p className="text-sm text-neutral-600">Yükleniyor…</p>;
  if (error) return <p className="text-sm text-red-700">{error}</p>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-neutral-900">
          Rezervasyonlar
        </h2>
        <Link href="/bookings" className="text-sm text-neutral-950 underline">
          Tümünü gör
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-neutral-600">
          Henüz rezervasyon yok.{' '}
          <Link href="/tours" className="underline">
            Turlar
          </Link>
          {' · '}
          <Link href="/activities" className="underline">
            Aktiviteler
          </Link>
        </p>
      ) : (
        <ul className="space-y-3">
          {items.slice(0, 8).map((r) => {
            const canDownload =
              r.status === 'CONFIRMED' ||
              r.status === 'COMPLETED' ||
              r.paymentStatus === 'PAID';
            return (
              <li
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-neutral-200 px-3 py-3 text-sm"
              >
                <div className="min-w-0">
                  <p className="font-medium text-neutral-900">
                    {r.bookingNumber}
                  </p>
                  <p className="text-neutral-600">
                    {r.activityDateId ? 'Aktivite' : 'Tur'} · {r.totalAmount}{' '}
                    {r.currency}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-neutral-700">
                    {r.status}
                  </span>
                  {canDownload ? (
                    <button
                      type="button"
                      disabled={busyId === r.id}
                      onClick={() => void handleVoucher(r)}
                      className="inline-flex items-center gap-1 rounded-md border border-neutral-300 px-2 py-1 text-xs font-medium text-neutral-800 hover:bg-neutral-50 disabled:opacity-60"
                      title="Güncel voucher indir (koltuk dahil)"
                    >
                      <FileDown className="h-3.5 w-3.5" />
                      Voucher
                    </button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function ReviewsTab({ token }: { token: string }) {
  const [items, setItems] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        setItems(await listMyReviews(token));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Yüklenemedi');
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  if (loading) return <p className="text-sm text-neutral-600">Yükleniyor…</p>;
  if (error) return <p className="text-sm text-red-700">{error}</p>;

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-neutral-900">
        Yorumlarım
      </h2>
      {items.length === 0 ? (
        <p className="text-sm text-neutral-600">
          Henüz yorum yok. Tamamlanan tur/aktivite sonrası değerlendirme
          yazabilirsiniz.
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((r) => {
            const href = r.tourId
              ? `/tours/${r.tourId}`
              : r.experienceId
                ? `/activities/${r.experienceId}`
                : null;
            const kind = r.tourId
              ? 'Tur'
              : r.experienceId
                ? 'Aktivite'
                : 'Değerlendirme';
            return (
              <li
                key={r.id}
                className="rounded-lg border border-neutral-200 px-4 py-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                      {kind}
                    </p>
                    <p className="font-semibold text-neutral-900">
                      {href ? (
                        <Link href={href} className="hover:underline">
                          {r.targetTitle ?? 'Ürün detayı'}
                        </Link>
                      ) : (
                        (r.targetTitle ?? 'Değerlendirme')
                      )}
                    </p>
                    <p className="mt-1 text-sm text-neutral-600">
                      ★ {r.rating}
                      {r.comment ? ` · ${r.comment}` : ''}
                    </p>
                    {r.partnerReply ? (
                      <p className="mt-2 rounded-md bg-neutral-50 px-2 py-1.5 text-xs text-neutral-700">
                        Partner yanıtı: {r.partnerReply}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-amber-700">
                        Yanıt bekleniyor
                      </p>
                    )}
                  </div>
                  <time className="shrink-0 text-xs text-neutral-500">
                    {new Date(r.createdAt).toLocaleDateString('tr-TR')}
                  </time>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function BirthDateField({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [value, setValue] = useState(defaultValue ?? '');

  useEffect(() => {
    setValue(defaultValue ?? '');
  }, [defaultValue]);

  return (
    <label className="block text-sm font-medium text-neutral-800">
      Doğum tarihi
      <input
        name={name}
        type="date"
        value={value}
        min="1900-01-01"
        max={today}
        onChange={(e) => setValue(clampBirthDateInput(e.target.value))}
        onInput={(e) => {
          const next = clampBirthDateInput(e.currentTarget.value);
          if (next !== e.currentTarget.value) {
            e.currentTarget.value = next;
            setValue(next);
          }
        }}
        className="mt-1 h-11 w-full rounded-lg border border-neutral-300 px-3 text-sm outline-none ring-neutral-950 focus:ring-2"
      />
    </label>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = 'text',
  required,
  readOnly,
  placeholder,
  hint,
  inputMode,
  maxLength,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  hint?: string;
  inputMode?:
    | 'none'
    | 'text'
    | 'tel'
    | 'url'
    | 'email'
    | 'numeric'
    | 'decimal'
    | 'search';
  maxLength?: number;
}) {
  return (
    <label className="block text-sm font-medium text-neutral-800">
      {label}
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        readOnly={readOnly}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        className={cn(
          'mt-1 h-11 w-full rounded-lg border border-neutral-300 px-3 text-sm outline-none ring-neutral-950 focus:ring-2',
          readOnly && 'bg-neutral-50 text-neutral-600',
        )}
      />
      {hint ? (
        <span className="mt-1 block text-xs text-neutral-500">{hint}</span>
      ) : null}
    </label>
  );
}
