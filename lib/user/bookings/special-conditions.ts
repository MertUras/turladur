import {
  SpecialConditionsData,
  formatSpecialConditionsSummary,
} from '@/app/lib/special-conditions';

type BookingMetadata = {
  specialConditions?: SpecialConditionsData;
};

function parseSpecialRequestsFallback(specialRequests: string | null | undefined): string[] {
  if (!specialRequests?.trim()) return [];

  const contactMarker = 'İletişim:';
  const contactIdx = specialRequests.indexOf(contactMarker);
  const conditionText =
    contactIdx >= 0
      ? specialRequests.slice(0, contactIdx).replace(/\s*\|\s*$/, '').trim()
      : specialRequests.trim();

  if (!conditionText || conditionText === 'Özel bir durum belirtilmedi.') {
    return [];
  }

  return conditionText.split(' | ').filter(Boolean);
}

/** Rezervasyon metadata ve specialRequests alanlarından özet satırları üretir. */
export function extractBookingSpecialConditions(input: {
  metadata?: unknown;
  specialRequests?: string | null;
}): string[] {
  if (input.metadata && typeof input.metadata === 'object' && !Array.isArray(input.metadata)) {
    const parsed = input.metadata as BookingMetadata;
    if (parsed.specialConditions) {
      const summary = formatSpecialConditionsSummary(parsed.specialConditions);
      if (
        summary.length > 1 ||
        (summary.length === 1 && summary[0] !== 'Özel bir durum belirtilmedi.')
      ) {
        return summary;
      }
    }
  }

  return parseSpecialRequestsFallback(input.specialRequests);
}
