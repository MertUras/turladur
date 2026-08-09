import { redirect } from 'next/navigation';

import { ACENTE_ROUTES } from '@/lib/panel-routes';

/** Bulgular P0-B4 Türkçe path → mevcut İngilizce route. */
export default async function KoltuklarAliasPage({
  params,
}: {
  params: Promise<{ id: string; dateId: string }>;
}) {
  const { id, dateId } = await params;
  redirect(ACENTE_ROUTES.tourDateSeats(id, dateId));
}
