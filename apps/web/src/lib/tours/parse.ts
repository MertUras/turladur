export function parseJsonString<T>(
  value: string | null | undefined,
  fallback: T,
): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function parseDepartureCities(
  value: string | string[] | null | undefined,
): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
  } catch {
    /* plain string */
  }
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function parseDestinationCities(
  value: string | string[] | null | undefined,
): string[] {
  return parseDepartureCities(value);
}
