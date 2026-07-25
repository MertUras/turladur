import { redirect } from 'next/navigation';

/**
 * Legacy navbar: Tur Operatörleri.
 * Dedicated Nest listing page henüz yok — tur listesine yönlendir.
 */
export default function TourOperatorRedirectPage() {
  redirect('/tours');
}
