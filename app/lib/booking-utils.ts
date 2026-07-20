export function generateBookingNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `TT-${ts}-${rand}`;
}

export function calculateAgeRangePrice(
  basePrice: number,
  pricingType: string,
  value: number,
): number {
  switch (pricingType) {
    case 'free':
      return 0;
    case 'half':
      return basePrice * 0.5;
    case 'percentage':
      return basePrice * (1 - value / 100);
    case 'fixed':
      return value;
    default:
      return basePrice;
  }
}

export interface AgeRangeLike {
  id: string;
  minAge: number;
  maxAge: number | null;
}

export interface AgeRangePricingLike extends AgeRangeLike {
  pricingType: string;
  value: number;
}

export interface TourPriceBreakdownLine {
  label: string;
  count: number;
  unitPrice: number;
  subtotal: number;
}

export const SHARED_ADULT_KEY = '__adult';
export const SHARED_CHILD_KEY = '__child';

export const ADULT_AGE_THRESHOLD = 18;

/** Primary adult pricing tier: explicit 18+ range, else highest minAge (e.g. 13+). */
export function findAdultAgeRange(ranges: AgeRangeLike[]): AgeRangeLike | null {
  if (!ranges.length) return null;
  const explicitAdult = ranges.find((r) => r.minAge >= ADULT_AGE_THRESHOLD);
  if (explicitAdult) return explicitAdult;
  return ranges.reduce((best, r) => (r.minAge > best.minAge ? r : best));
}

export function childSharesAdultRange(ranges: AgeRangeLike[]): boolean {
  const adultRange = findAdultAgeRange(ranges);
  const childRange = findChildAgeRange(ranges);
  return Boolean(adultRange && childRange && adultRange.id === childRange.id);
}

/** Representative child pricing tier for simplified Yetişkin/Çocuk UI. */
export function findChildAgeRange(ranges: AgeRangeLike[]): AgeRangeLike | null {
  const childRanges = ranges.filter((r) => r.minAge < ADULT_AGE_THRESHOLD);
  if (!childRanges.length) return null;

  const schoolAge = childRanges.find(
    (r) => r.minAge >= 7 && (r.maxAge === null || r.maxAge <= 12),
  );
  if (schoolAge) return schoolAge;

  const preschool = childRanges.find(
    (r) => r.minAge >= 3 && (r.maxAge === null || r.maxAge <= 6),
  );
  if (preschool) return preschool;

  return childRanges.reduce((best, r) => (r.minAge > best.minAge ? r : best));
}

/**
 * Adults pay the published per-person (tour date) price.
 * Child discounts (percentage / half / free / fixed) never apply to adults.
 * Optional: fixed adult override only when an explicit positive value is set.
 */
export function getAdultUnitPrice(
  basePrice: number,
  range: AgeRangePricingLike,
): number {
  if (range.pricingType === 'fixed' && Number(range.value) > 0) {
    return Number(range.value);
  }
  return basePrice;
}

/** Child price from child tier, or discounted base when sharing the adult range. */
export function getChildUnitPrice(
  basePrice: number,
  adultRange: AgeRangePricingLike,
  childRange: AgeRangePricingLike,
): number {
  if (adultRange.id !== childRange.id) {
    return calculateAgeRangePrice(
      basePrice,
      childRange.pricingType,
      childRange.value,
    );
  }

  switch (childRange.pricingType) {
    case 'percentage':
      return basePrice * (1 - childRange.value / 100);
    case 'half':
      return basePrice * 0.5;
    case 'free':
      return 0;
    case 'fixed':
      return childRange.value;
    default:
      return basePrice;
  }
}

export function computeTourPricing(
  basePrice: number,
  ranges: AgeRangePricingLike[],
  adults: number,
  children: number,
): { total: number; breakdown: TourPriceBreakdownLine[] } {
  const adultRange = findAdultAgeRange(ranges) as AgeRangePricingLike | null;
  const childRange = findChildAgeRange(ranges) as AgeRangePricingLike | null;
  const breakdown: TourPriceBreakdownLine[] = [];
  let total = 0;

  if (adults > 0) {
    const unitPrice = adultRange
      ? getAdultUnitPrice(basePrice, adultRange)
      : basePrice;
    const subtotal = unitPrice * adults;
    total += subtotal;
    breakdown.push({ label: 'Yetişkin', count: adults, unitPrice, subtotal });
  }

  if (children > 0) {
    let unitPrice = basePrice;
    if (childRange && adultRange) {
      unitPrice = getChildUnitPrice(basePrice, adultRange, childRange);
    } else if (childRange) {
      unitPrice = calculateAgeRangePrice(
        basePrice,
        childRange.pricingType,
        childRange.value,
      );
    }
    const subtotal = unitPrice * children;
    total += subtotal;
    breakdown.push({ label: 'Çocuk', count: children, unitPrice, subtotal });
  }

  return { total, breakdown };
}

export function adultChildToParticipants(
  adults: number,
  children: number,
  ranges: AgeRangeLike[],
): Record<string, number> {
  const result: Record<string, number> = {};
  const adultRange = findAdultAgeRange(ranges);
  const childRange = findChildAgeRange(ranges);

  if (childSharesAdultRange(ranges)) {
    if (adults > 0) result[SHARED_ADULT_KEY] = adults;
    if (children > 0) result[SHARED_CHILD_KEY] = children;
    return result;
  }

  if (adults > 0 && adultRange) result[adultRange.id] = adults;
  if (children > 0 && childRange) {
    result[childRange.id] = (result[childRange.id] || 0) + children;
  }
  return result;
}

export function participantsToAdultChild(
  participants: Record<string, number>,
  ranges: AgeRangeLike[],
): { adults: number; children: number } {
  if (SHARED_ADULT_KEY in participants || SHARED_CHILD_KEY in participants) {
    return {
      adults: participants[SHARED_ADULT_KEY] || 0,
      children: participants[SHARED_CHILD_KEY] || 0,
    };
  }

  const adultRangeId = findAdultAgeRange(ranges)?.id;
  const childRangeId = findChildAgeRange(ranges)?.id;
  let adults = 0;
  let children = 0;

  for (const [rangeId, count] of Object.entries(participants)) {
    if (count <= 0 || rangeId === 'total') continue;
    if (rangeId === adultRangeId) {
      adults += count;
    } else if (rangeId === childRangeId) {
      children += count;
    } else {
      const range = ranges.find((r) => r.id === rangeId);
      if (!range) continue;
      if (rangeId === adultRangeId || range.minAge >= ADULT_AGE_THRESHOLD) {
        adults += count;
      } else {
        children += count;
      }
    }
  }

  return { adults, children };
}

export function countParticipants(
  participants: Record<string, number>,
  ageRanges: AgeRangeLike[],
): { adults: number; children: number; total: number } {
  const { adults, children } = participantsToAdultChild(
    participants,
    ageRanges,
  );
  const total = adults + children;

  if (total === 0) {
    const fallback = getParticipantTotal(participants);
    return { adults: fallback, children: 0, total: fallback };
  }

  return { adults, children, total };
}

export function parseParticipantsParam(
  raw: string | null,
): Record<string, number> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed.total === 'number') {
      return { total: parsed.total };
    }
    if (typeof parsed === 'object' && parsed !== null) {
      return Object.fromEntries(
        Object.entries(parsed).map(([k, v]) => [k, Number(v) || 0]),
      );
    }
  } catch {
    // ignore
  }
  return {};
}

export function getParticipantTotal(
  participants: Record<string, number>,
): number {
  if (typeof participants.total === 'number') {
    return participants.total;
  }
  return Object.values(participants).reduce((sum, n) => sum + (n || 0), 0);
}
