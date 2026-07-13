export const DEFAULT_DEPARTURE_CITIES = [
  'İstanbul',
  'Ankara',
  'İzmir',
  'Antalya',
  'Bursa',
  'Adana',
  'Trabzon',
  'Nevşehir',
  'Denizli',
  'Mardin',
  'Van',
  'Gaziantep',
  'Konya',
  'Çanakkale',
  'Muğla',
  'Aydın',
  'Rize',
  'Karabük',
  'Adıyaman',
  'Şanlıurfa',
] as const;

export const DEFAULT_REGIONS = [
  'Marmara',
  'Ege',
  'Akdeniz',
  'İç Anadolu',
  'Karadeniz',
  'Doğu Anadolu',
  'Güneydoğu Anadolu',
] as const;

export const TURKEY_REGION_CITIES: Record<string, readonly string[]> = {
  Marmara: ['İstanbul', 'Bursa', 'Kocaeli', 'Sakarya', 'Tekirdağ', 'Edirne', 'Kırklareli', 'Balıkesir', 'Çanakkale', 'Yalova', 'Bilecik'],
  Ege: ['İzmir', 'Aydın', 'Muğla', 'Denizli', 'Manisa', 'Afyonkarahisar', 'Kütahya', 'Uşak'],
  Akdeniz: ['Antalya', 'Mersin', 'Adana', 'Hatay', 'Osmaniye', 'Isparta', 'Burdur', 'Kahramanmaraş'],
  'İç Anadolu': ['Ankara', 'Konya', 'Kayseri', 'Eskişehir', 'Sivas', 'Aksaray', 'Karaman', 'Kırıkkale', 'Kırşehir', 'Nevşehir', 'Niğde', 'Yozgat'],
  Karadeniz: ['Trabzon', 'Rize', 'Artvin', 'Giresun', 'Ordu', 'Samsun', 'Sinop', 'Kastamonu', 'Zonguldak', 'Bartın', 'Düzce', 'Bolu', 'Amasya', 'Tokat', 'Gümüşhane', 'Bayburt'],
  'Doğu Anadolu': ['Erzurum', 'Erzincan', 'Kars', 'Ağrı', 'Iğdır', 'Ardahan', 'Malatya', 'Elazığ', 'Bingöl', 'Tunceli', 'Van', 'Bitlis', 'Muş', 'Hakkari'],
  'Güneydoğu Anadolu': ['Diyarbakır', 'Şanlıurfa', 'Mardin', 'Batman', 'Siirt', 'Şırnak', 'Adıyaman', 'Gaziantep', 'Kilis'],
};

type TourFilterSource = {
  departureCity: string | null;
  region: string | null;
  destinations: unknown;
  pickupPoints: Array<{ city: string }>;
};

export function parseDepartureCities(value: string | null | undefined): string[] {
  if (!value?.trim()) return [];
  return value
    .split(',')
    .map((city) => city.trim())
    .filter(Boolean);
}

export function parseDestinationCities(destinations: unknown): string[] {
  if (!destinations) return [];

  let parsed: unknown = destinations;
  if (typeof destinations === 'string') {
    try {
      parsed = JSON.parse(destinations);
    } catch {
      return destinations.trim() ? [destinations.trim()] : [];
    }
  }

  if (!Array.isArray(parsed)) return [];

  return parsed
    .map((entry) => {
      if (typeof entry === 'string') return entry.trim();
      if (entry && typeof entry === 'object' && 'city' in entry && typeof entry.city === 'string') {
        return entry.city.trim();
      }
      return '';
    })
    .filter(Boolean);
}

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase('tr-TR');
}

function citiesMatch(source: string, target: string): boolean {
  const normalizedSource = normalize(source);
  const normalizedTarget = normalize(target);
  return (
    normalizedSource === normalizedTarget ||
    normalizedSource.includes(normalizedTarget) ||
    normalizedTarget.includes(normalizedSource)
  );
}

export function getTourCityHints(tour: TourFilterSource): string[] {
  const hints = new Set<string>();

  for (const city of parseDepartureCities(tour.departureCity)) {
    hints.add(city);
  }

  for (const point of tour.pickupPoints) {
    const city = point.city?.trim();
    if (city) hints.add(city);
  }

  for (const city of parseDestinationCities(tour.destinations)) {
    hints.add(city);
  }

  return Array.from(hints);
}

export function getRegionByCity(city: string): string | null {
  for (const [region, cities] of Object.entries(TURKEY_REGION_CITIES)) {
    if (cities.some((candidate) => citiesMatch(candidate, city))) {
      return region;
    }
  }
  return null;
}

export function getTourRegions(tour: TourFilterSource): string[] {
  const regions = new Set<string>();

  const explicitRegion = tour.region?.trim();
  if (explicitRegion) {
    regions.add(explicitRegion);
  }

  for (const city of getTourCityHints(tour)) {
    const inferred = getRegionByCity(city);
    if (inferred) regions.add(inferred);
  }

  return Array.from(regions);
}

export function tourMatchesDepartureCity(tour: TourFilterSource, city: string): boolean {
  return getTourCityHints(tour).some((hint) => citiesMatch(hint, city));
}

export function tourMatchesRegion(tour: TourFilterSource, region: string): boolean {
  return getTourRegions(tour).some((candidate) => normalize(candidate) === normalize(region));
}

export function getCitiesForRegion(region: string): string[] {
  return [...(TURKEY_REGION_CITIES[region] ?? [])];
}

function buildCountMap(
  tours: TourFilterSource[],
  getValues: (tour: TourFilterSource) => string[]
): Map<string, { label: string; count: number }> {
  const map = new Map<string, { label: string; count: number }>();

  for (const tour of tours) {
    const seen = new Set<string>();
    for (const value of getValues(tour)) {
      const key = normalize(value);
      if (seen.has(key)) continue;
      seen.add(key);

      const existing = map.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(key, { label: value, count: 1 });
      }
    }
  }

  return map;
}

function mergeWithDefaults(
  defaults: readonly string[],
  counts: Map<string, { label: string; count: number }>
) {
  const defaultKeys = new Set(defaults.map(normalize));
  const merged = defaults.map((label) => ({
    label,
    count: counts.get(normalize(label))?.count ?? 0,
  }));

  for (const [key, { label, count }] of counts) {
    if (!defaultKeys.has(key)) {
      merged.push({ label, count });
    }
  }

  return merged.sort(
    (a, b) => b.count - a.count || a.label.localeCompare(b.label, 'tr')
  );
}

export function buildDepartureCityOptions(tours: TourFilterSource[]) {
  const counts = buildCountMap(tours, getTourCityHints);
  return mergeWithDefaults(DEFAULT_DEPARTURE_CITIES, counts).map(({ label, count }) => ({
    city: label,
    count,
  }));
}

export function buildRegionOptions(tours: TourFilterSource[]) {
  const counts = buildCountMap(tours, getTourRegions);
  return mergeWithDefaults(DEFAULT_REGIONS, counts).map(({ label, count }) => ({
    region: label,
    count,
  }));
}
