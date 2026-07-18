'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useEffect, useState } from 'react';

import { checkoutPayment, createReservation } from '@/services/booking';
import { ApiError } from '@/services/api-client';
import {
  getTourById,
  getTourDates,
  type TourDateRow,
} from '@/services/catalog';
import type { Tour } from '@turladur/shared-types';
import { useAuth } from '@/providers/auth-provider';

function CheckoutForm() {
  const { isAuthenticated, accessToken, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tourId = searchParams.get('tourId') ?? '';

  const [tour, setTour] = useState<Tour | null>(null);
  const [dates, setDates] = useState<TourDateRow[]>([]);
  const [tourDateId, setTourDateId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!tourId) return;
    void (async () => {
      try {
        const [t, d] = await Promise.all([
          getTourById(tourId),
          getTourDates(tourId),
        ]);
        setTour(t);
        setDates(d);
        if (d[0]) setTourDateId(d[0].id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Tur yüklenemedi');
      }
    })();
  }, [tourId]);

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Ödeme için giriş gerekli</h1>
        <p className="mt-2 text-neutral-600">
          Rezervasyon Nest Booking API ile oluşturulur.
        </p>
        <Link
          href={`/login`}
          className="mt-6 inline-flex rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Giriş yap
        </Link>
      </div>
    );
  }

  if (!tourId) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p>Önce bir tur seçin.</p>
        <Link href="/tours" className="mt-4 inline-block text-sky-700">
          Turlara git
        </Link>
      </div>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken || !tourDateId) return;
    setPending(true);
    setError(null);
    setSuccessMsg(null);
    const form = new FormData(event.currentTarget);

    try {
      const firstName = String(
        form.get('firstName') || user?.firstName || 'Misafir',
      );
      const lastName = String(
        form.get('lastName') || user?.lastName || 'Kullanici',
      );
      const reservation = await createReservation(
        {
          tourDateId,
          adults: 1,
          children: 0,
          contactEmail: String(form.get('email') || user?.email),
          guests: [{ firstName, lastName }],
        },
        accessToken,
      );

      const payment = await checkoutPayment(
        {
          reservationId: reservation.id,
          cardHolderName: String(form.get('cardHolderName')),
          cardNumber: String(form.get('cardNumber')).replace(/\s/g, ''),
          expireMonth: String(form.get('expireMonth')),
          expireYear: String(form.get('expireYear')),
          cvc: String(form.get('cvc')),
        },
        accessToken,
      );

      setSuccessMsg(
        `Ödeme ${payment.status}. Rezervasyon: ${reservation.bookingNumber}`,
      );
      router.push('/bookings');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'İşlem başarısız');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="text-2xl font-bold text-neutral-900">
        Ödeme / Rezervasyon
      </h1>
      {tour ? (
        <p className="mt-2 text-neutral-600">
          {tour.title} — {tour.price} {tour.currency}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="text-sm font-medium" htmlFor="tourDateId">
            Tarih
          </label>
          <select
            id="tourDateId"
            value={tourDateId}
            onChange={(e) => setTourDateId(e.target.value)}
            required
            className="mt-1 h-11 w-full rounded-lg border border-neutral-300 px-3"
          >
            {dates.map((d) => (
              <option key={d.id} value={d.id}>
                {d.startDate} ({d.remainingCapacity} yer)
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input
            name="firstName"
            placeholder="Ad"
            defaultValue={user?.firstName ?? ''}
            className="h-11 rounded-lg border border-neutral-300 px-3"
            required
          />
          <input
            name="lastName"
            placeholder="Soyad"
            defaultValue={user?.lastName ?? ''}
            className="h-11 rounded-lg border border-neutral-300 px-3"
            required
          />
        </div>
        <input
          name="email"
          type="email"
          placeholder="E-posta"
          defaultValue={user?.email ?? ''}
          className="h-11 w-full rounded-lg border border-neutral-300 px-3"
          required
        />
        <p className="pt-2 text-xs font-semibold uppercase text-neutral-500">
          Kart (Mock: …0008 başarılı, …0000 başarısız)
        </p>
        <input
          name="cardHolderName"
          placeholder="Kart üzerindeki isim"
          required
          className="h-11 w-full rounded-lg border border-neutral-300 px-3"
        />
        <input
          name="cardNumber"
          placeholder="5528790000000008"
          required
          className="h-11 w-full rounded-lg border border-neutral-300 px-3"
        />
        <div className="grid grid-cols-3 gap-3">
          <input
            name="expireMonth"
            placeholder="AA"
            required
            pattern="(0[1-9]|1[0-2])"
            className="h-11 rounded-lg border border-neutral-300 px-3"
          />
          <input
            name="expireYear"
            placeholder="YY"
            required
            className="h-11 rounded-lg border border-neutral-300 px-3"
          />
          <input
            name="cvc"
            placeholder="CVC"
            required
            className="h-11 rounded-lg border border-neutral-300 px-3"
          />
        </div>
        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        {successMsg ? (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {successMsg}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending || dates.length === 0}
          className="h-11 w-full rounded-lg bg-sky-600 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
        >
          {pending ? 'İşleniyor…' : 'Rezerve et ve öde'}
        </button>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<p className="p-16 text-center">Yükleniyor…</p>}>
      <CheckoutForm />
    </Suspense>
  );
}
