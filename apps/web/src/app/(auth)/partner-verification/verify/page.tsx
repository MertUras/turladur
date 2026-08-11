'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Legacy e-posta doğrulama token UI — akış kaldırıldı (410). */
export default function PartnerVerificationVerifyPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/partner-verification');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 text-neutral-600">
      Yükleniyor…
    </div>
  );
}
