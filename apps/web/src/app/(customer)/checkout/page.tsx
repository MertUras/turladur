'use client';

import { Suspense } from 'react';

import { CheckoutClient } from '@/components/features/checkout/checkout-client';

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center bg-neutral-50">
          <p className="text-neutral-600">Yükleniyor…</p>
        </div>
      }
    >
      <CheckoutClient />
    </Suspense>
  );
}
