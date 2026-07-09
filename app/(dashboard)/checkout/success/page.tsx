'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircleIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';
import { PAYMENT_METHOD_LABELS, PaymentMethodType } from '@/app/lib/payments';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

function SuccessContent() {
  const searchParams = useSearchParams();

  const bookingNumber = searchParams.get('bookingNumber') || '—';
  const title = searchParams.get('title') || 'Rezervasyon';
  const totalPrice = Number(searchParams.get('totalPrice') || 0);
  const startDate = searchParams.get('startDate');
  const paymentMethod = (searchParams.get('paymentMethod') || 'bank_transfer') as PaymentMethodType;
  const iban = searchParams.get('iban');
  const bankName = searchParams.get('bankName');

  const formattedPrice = new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(totalPrice);

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center pt-20 md:pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 text-center">
        <div>
          <CheckCircleIcon className="mx-auto h-16 w-16 text-emerald-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-neutral-900">
            Rezervasyonunuz Oluşturuldu!
          </h2>
          <p className="mt-2 text-lg text-neutral-600">
            Rezervasyonunuz ödeme bekliyor durumunda kaydedildi.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200/70 text-left space-y-4">
          <div>
            <h3 className="text-sm font-medium text-neutral-500">Rezervasyon Numarası</h3>
            <p className="mt-1 text-2xl font-bold text-sky-700 font-mono">#{bookingNumber}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-neutral-500">Tur / Aktivite</h3>
            <p className="mt-1 text-neutral-900 font-semibold">{title}</p>
          </div>

          {startDate && (
            <div>
              <h3 className="text-sm font-medium text-neutral-500">Tarih</h3>
              <p className="mt-1 text-neutral-900">
                {format(new Date(startDate), 'd MMMM yyyy, EEEE', { locale: tr })}
              </p>
            </div>
          )}

          <div className="flex justify-between pt-2 border-t border-neutral-200">
            <span className="text-neutral-600">Toplam</span>
            <span className="font-bold text-sky-700">{formattedPrice}</span>
          </div>

          <div>
            <h3 className="text-sm font-medium text-neutral-500">Ödeme Yöntemi</h3>
            <p className="mt-1 text-neutral-900">{PAYMENT_METHOD_LABELS[paymentMethod]}</p>
          </div>

          {paymentMethod === 'bank_transfer' && iban && (
            <div className="bg-sky-50/60 rounded-lg p-4 border border-sky-100">
              <div className="flex items-center gap-2 mb-2">
                <BuildingOffice2Icon className="w-5 h-5 text-sky-600" />
                <p className="font-semibold text-neutral-800 text-sm">Havale Talimatları</p>
              </div>
              {bankName && (
                <p className="text-sm text-neutral-700">
                  <span className="font-medium">Banka:</span> {bankName}
                </p>
              )}
              <p className="text-sm text-neutral-700 mt-1">
                <span className="font-medium">IBAN:</span>{' '}
                <span className="font-mono">{iban}</span>
              </p>
              <p className="text-xs text-neutral-500 mt-2">
                Açıklama alanına rezervasyon numaranızı ({bookingNumber}) yazmayı unutmayın.
              </p>
            </div>
          )}

          {paymentMethod === 'card' && (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              Kart ödeme entegrasyonu henüz aktif değildir. Rezervasyonunuz ödeme bekliyor
              olarak kaydedildi.
            </p>
          )}
        </div>

        <div className="space-y-3">
          <Link
            href="/bookings"
            className="w-full flex justify-center py-3 px-4 rounded-lg text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 transition-colors"
          >
            Rezervasyonlarıma Git
          </Link>
          <Link
            href="/"
            className="w-full flex justify-center py-3 px-4 border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 transition-colors"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
