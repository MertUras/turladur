import {
  inferDestinationScope,
  inferStayKind,
  normalizeDepartureCities,
  TourDestinationScope,
  TourStayKind,
} from '@turta/shared-constants';

export function readExtrasRecord(extras: unknown): Record<string, unknown> {
  if (extras && typeof extras === 'object' && !Array.isArray(extras)) {
    return extras as Record<string, unknown>;
  }
  return {};
}

export function resolveTourTaxonomy(input: {
  stayKind?: string;
  destinationScope?: string;
  departureCities?: string[];
  durationDays?: number;
  extras?: unknown;
}): {
  stayKind: TourStayKind;
  destinationScope: TourDestinationScope;
  departureCities: string[];
  durationDays: number;
} {
  const extras = readExtrasRecord(input.extras);
  const tourType = typeof extras.tourType === 'string' ? extras.tourType : null;
  const region = typeof extras.region === 'string' ? extras.region : null;

  const stayKind = inferStayKind({
    stayKind: input.stayKind,
    durationDays: input.durationDays,
    tourType,
  });

  const destinationScope = inferDestinationScope({
    destinationScope: input.destinationScope,
    tourType,
    region,
  });

  const departureCities = normalizeDepartureCities(
    input.departureCities ?? extras.departureCity,
  );

  const durationDays =
    stayKind === TourStayKind.DAY_TRIP
      ? 1
      : input.durationDays != null
        ? Math.max(1, input.durationDays)
        : 2;

  return { stayKind, destinationScope, departureCities, durationDays };
}
