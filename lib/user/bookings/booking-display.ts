/** Tur kalkış şehri ve varış noktasından rota etiketi üretir. */

function parseFirstDestination(destinations: unknown): string | null {
  if (!Array.isArray(destinations) || destinations.length === 0) return null;
  const first = destinations[0];
  if (typeof first === 'string' && first.trim()) return first.trim();
  if (first && typeof first === 'object') {
    if ('name' in first && typeof (first as { name: unknown }).name === 'string') {
      const name = (first as { name: string }).name.trim();
      if (name) return name;
    }
    if ('city' in first && typeof (first as { city: unknown }).city === 'string') {
      const city = (first as { city: string }).city.trim();
      if (city) return city;
    }
  }
  return null;
}

function parseDepartureCity(departureCity: string | null | undefined): string | null {
  if (!departureCity?.trim()) return null;
  return departureCity.split(',')[0]?.trim() || null;
}

export function buildRouteLabel(
  fromLocation: string | null | undefined,
  toLocation: string | null | undefined
): string | null {
  const from = fromLocation?.trim() || null;
  const to = toLocation?.trim() || null;
  if (from && to) return `${from} → ${to}`;
  return from || to || null;
}

export interface TourRouteInput {
  departureCity?: string | null;
  destinations?: unknown;
}

export interface ExperienceRouteInput {
  location?: string | null;
  meetingPoint?: string | null;
}

export function getTourRouteFields(tour: TourRouteInput) {
  const fromLocation = parseDepartureCity(tour.departureCity);
  const toLocation = parseFirstDestination(tour.destinations);
  return {
    fromLocation,
    toLocation,
    routeLabel: buildRouteLabel(fromLocation, toLocation),
  };
}

export function getExperienceRouteFields(experience: ExperienceRouteInput) {
  const fromLocation = experience.meetingPoint?.trim() || null;
  const toLocation = experience.location?.trim() || null;
  return {
    fromLocation,
    toLocation,
    routeLabel: buildRouteLabel(fromLocation, toLocation),
  };
}

/** Banner ve modal için "23 Temmuz 2026" biçiminde tarih etiketi */
export function formatBookingDisplayDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const REVIEW_INELIGIBLE_STATUSES = new Set(['CANCELLED', 'PENDING', 'PENDING_PAYMENT']);

export function isBookingEligibleForPartnerReview(input: {
  status: string;
  endDate: Date | string;
  now?: Date;
}): boolean {
  if (REVIEW_INELIGIBLE_STATUSES.has(input.status)) return false;
  const now = input.now ?? new Date();
  return input.status === 'COMPLETED' || new Date(input.endDate) < now;
}

export function getBookingGuestCount(adults: number, children: number): number {
  return adults + children;
}

/** Aynı tur/aktivite + aynı tarih aralığı için tek partner değerlendirmesi grubu. */
export interface PartnerReviewGroupInput {
  tourId?: string | null;
  experienceId?: string | null;
  startDate: Date | string;
  endDate: Date | string;
}

export function buildPartnerReviewGroupKey(input: PartnerReviewGroupInput): string | null {
  const productId = input.tourId || input.experienceId;
  if (!productId) return null;

  const productType = input.tourId ? 'tour' : 'experience';
  const start = new Date(input.startDate).toISOString();
  const end = new Date(input.endDate).toISOString();
  return `${productType}:${productId}:${start}:${end}`;
}

/** Booking.metadata içinde kardeş rezervasyonların değerlendirildiğini işaretler. */
export interface BookingPartnerReviewMetadata {
  reviewedViaBookingId?: string;
}

export function getReviewedViaBookingId(metadata: unknown): string | null {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return null;
  const id = (metadata as BookingPartnerReviewMetadata).reviewedViaBookingId;
  return typeof id === 'string' && id.trim() ? id.trim() : null;
}

export function isBookingDirectlyOrIndirectlyReviewed(input: {
  partnerReview?: { id: string } | null;
  reviewedViaBookingId?: string | null;
}): boolean {
  return Boolean(input.partnerReview) || Boolean(input.reviewedViaBookingId);
}

export interface PartnerReviewGroupMember {
  id: string;
  tourId?: string | null;
  experienceId?: string | null;
  startDate: Date | string;
  endDate: Date | string;
  createdAt: Date | string;
  adults: number;
  children: number;
  partnerReview?: { id: string } | null;
  metadata?: unknown;
  canReviewPartner: boolean;
}

export interface PartnerReviewGroupFields {
  reviewGroupKey: string | null;
  reviewGroupBookingCount: number;
  reviewGroupGuestCount: number;
  reviewedViaBookingId: string | null;
  isReviewGroupRepresentative: boolean;
  canReviewPartner: boolean;
}

/**
 * Aynı tur/aktivite + tarih aralığındaki rezervasyonları gruplar.
 * Grup başına yalnızca bir temsilci rezervasyon `canReviewPartner: true` alır.
 */
export function resolvePartnerReviewGroups<T extends PartnerReviewGroupMember>(
  bookings: T[]
): (T & PartnerReviewGroupFields)[] {
  const groups = new Map<string, T[]>();

  for (const booking of bookings) {
    const key = buildPartnerReviewGroupKey(booking);
    if (!key) continue;
    const list = groups.get(key) ?? [];
    list.push(booking);
    groups.set(key, list);
  }

  const groupStats = new Map<
    string,
    {
      bookingCount: number;
      guestCount: number;
      groupReviewed: boolean;
      representativeId: string | null;
    }
  >();

  for (const [key, members] of groups) {
    const bookingCount = members.length;
    const guestCount = members.reduce(
      (sum, member) => sum + getBookingGuestCount(member.adults, member.children),
      0
    );

    const groupReviewed = members.some((member) =>
      isBookingDirectlyOrIndirectlyReviewed({
        partnerReview: member.partnerReview,
        reviewedViaBookingId: getReviewedViaBookingId(member.metadata),
      })
    );

    const eligibleMembers = members.filter((member) => member.canReviewPartner);
    const representative = [...eligibleMembers].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )[0];

    groupStats.set(key, {
      bookingCount,
      guestCount,
      groupReviewed,
      representativeId: groupReviewed ? null : (representative?.id ?? null),
    });
  }

  return bookings.map((booking) => {
    const key = buildPartnerReviewGroupKey(booking);
    const reviewedViaBookingId = getReviewedViaBookingId(booking.metadata);

    if (!key) {
      const individuallyReviewed = isBookingDirectlyOrIndirectlyReviewed({
        partnerReview: booking.partnerReview,
        reviewedViaBookingId,
      });

      return {
        ...booking,
        reviewGroupKey: null,
        reviewGroupBookingCount: 1,
        reviewGroupGuestCount: getBookingGuestCount(booking.adults, booking.children),
        reviewedViaBookingId,
        isReviewGroupRepresentative: booking.canReviewPartner && !individuallyReviewed,
        canReviewPartner: booking.canReviewPartner && !individuallyReviewed,
      };
    }

    const stats = groupStats.get(key)!;
    const isRepresentative = stats.representativeId === booking.id;

    return {
      ...booking,
      reviewGroupKey: key,
      reviewGroupBookingCount: stats.bookingCount,
      reviewGroupGuestCount: stats.guestCount,
      reviewedViaBookingId,
      isReviewGroupRepresentative: isRepresentative,
      canReviewPartner: isRepresentative && booking.canReviewPartner && !stats.groupReviewed,
    };
  });
}
