/** Split from tour-detail-client.tsx (Faz 7) — helpers only. */

import type { TourDestination } from './tour-detail.types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function formatAgeRange(minAge: number, maxAge: number | null): string {
  if (maxAge === null) {
    return `${minAge}+`;
  }
  return `${minAge}-${maxAge}`;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function formatPricing(
  pricingType: string,
  value: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  basePrice: number,
): string {
  switch (pricingType) {
    case 'free':
      return 'Ücretsiz';
    case 'percentage':
      return `%${value} İndirimli`;
    case 'fixed':
      return `${value.toLocaleString('tr-TR')} ₺`;
    default:
      return `${value.toLocaleString('tr-TR')} ₺`;
  }
}

export function getDestinationLabel(destination: TourDestination): string {
  if (typeof destination === 'string') return destination;
  return destination?.city ?? '';
}

export function buildFallbackItinerary(
  durationDays: number,
  destinationNames: string[],
): Record<string, unknown> {
  const days = Math.max(1, durationDays || 1);
  const itinerary: Record<string, unknown> = {};
  for (let index = 0; index < days; index += 1) {
    const city = destinationNames[index] || destinationNames[0] || '';
    const isFirst = index === 0;
    const isLast = index === days - 1;
    itinerary[`day${index}`] = {
      title: city
        ? `${index + 1}. Gün - ${city}`
        : `${index + 1}. Gün programı`,
      description: isFirst
        ? 'Buluşma noktasında toplanma, rehber tanışması ve tur başlangıcı.'
        : isLast
          ? 'Programın tamamlanması, serbest zaman ve dönüş hazırlığı.'
          : 'Rehber eşliğinde destinasyon gezisi, önemli noktaların ziyareti ve günlük aktiviteler.',
      highlights: city ? [`${city} gezisi`] : ['Günlük program'],
      schedule: [],
    };
  }
  return itinerary;
}
