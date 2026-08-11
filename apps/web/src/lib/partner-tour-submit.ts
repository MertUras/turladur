import type { TourFormData } from '@/components/features/partner-dashboard/tour-form';
import {
  inferDestinationScope,
  inferStayKind,
  normalizeDepartureCities,
} from '@turta/shared-constants';
import {
  buildTourExtrasFromForm,
  mapAgePricingType,
  mapAgePricingValue,
  mapLegacyTourCategory,
  uploadTourImageFile,
} from '@/lib/partner-tour-helpers';
import { getTourDates } from '@/services/catalog';
import {
  createPartnerTour,
  createTourDate,
  createTourDateAgeRange,
  createTourPickupPoint,
  deleteTourPickupPoint,
  getPresignedUpload,
  listTourPickupPoints,
  updatePartnerTour,
  upsertTourAccommodation,
} from '@/services/partner-admin';

type SubmitPayload = {
  formData: TourFormData;
  title: string;
  description: string;
  duration: number;
  price: number;
  tourDates: Array<{
    startDate: string | null;
    endDate: string | null;
    availableSeats: number;
    ageRanges: Array<{
      minAge: number;
      maxAge: number | null;
      pricingType: string;
      value: number;
    }>;
  }>;
  pickupPoints: Array<{
    city: string;
    location: string;
    time: string;
    description?: string;
    latitude?: number | null;
    longitude?: number | null;
    order?: number;
  }>;
  accommodationName?: string;
  tourType?: string;
  region?: string;
  features?: string[];
};

async function resolveImageUrl(
  file: File | null | undefined,
  url: string | undefined,
  entityId: string,
  token: string,
): Promise<string | undefined> {
  if (url && !url.startsWith('blob:')) return url;
  if (file) {
    return uploadTourImageFile(file, entityId, token, getPresignedUpload);
  }
  return undefined;
}

export async function persistNewPartnerTour(
  payload: SubmitPayload,
  token: string,
  uploadEntityId: string,
) {
  const { formData } = payload;

  const coverUrl =
    (await resolveImageUrl(
      formData.mainImage?.file,
      formData.mainImage?.url,
      uploadEntityId,
      token,
    )) ??
    (await resolveImageUrl(
      formData.images[0]?.file,
      formData.images[0]?.url,
      uploadEntityId,
      token,
    ));

  const galleryFromForm = formData.galleryImages ?? [];
  const galleryUrls: string[] = [];
  for (const img of galleryFromForm) {
    const uploaded = await resolveImageUrl(
      img.file,
      img.url,
      uploadEntityId,
      token,
    );
    if (uploaded) galleryUrls.push(uploaded);
  }
  for (const img of formData.images.slice(1)) {
    const uploaded = await resolveImageUrl(
      img.file,
      img.url,
      uploadEntityId,
      token,
    );
    if (uploaded) galleryUrls.push(uploaded);
  }

  const category = mapLegacyTourCategory(
    payload.tourType ?? formData.tourType,
    payload.region ?? formData.region,
    payload.features ?? formData.features,
  );

  const extras = buildTourExtrasFromForm(formData);
  const stayKind = inferStayKind({
    stayKind: formData.stayKind,
    durationDays: payload.duration,
    tourType: formData.tourType,
  });
  const destinationScope = inferDestinationScope({
    destinationScope: formData.destinationScope,
    tourType: formData.tourType,
    region: formData.region,
  });
  const departureCities = normalizeDepartureCities(formData.departureCity);

  const tour = await createPartnerTour(
    {
      title: payload.title,
      description: payload.description,
      price: payload.price,
      category,
      durationDays: stayKind === 'DAY_TRIP' ? 1 : payload.duration || 1,
      stayKind,
      destinationScope,
      departureCities,
      coverUrl,
      galleryUrls,
      extras,
    },
    token,
  );

  const tourId = tour.id;

  for (const date of payload.tourDates) {
    if (!date.startDate || !date.endDate) continue;
    const created = await createTourDate(
      tourId,
      {
        startDate: date.startDate.slice(0, 10),
        endDate: date.endDate.slice(0, 10),
        capacity: date.availableSeats || 1,
        priceOverride: payload.price,
      },
      token,
    );
    for (const range of date.ageRanges ?? []) {
      const pricingType = mapAgePricingType(
        range.pricingType as 'free' | 'half' | 'percentage' | 'fixed',
      );
      await createTourDateAgeRange(
        tourId,
        created.id,
        {
          minAge: range.minAge,
          maxAge: range.maxAge,
          pricingType,
          value: mapAgePricingValue(
            range.pricingType as 'free' | 'half' | 'percentage' | 'fixed',
            String(range.value),
          ),
        },
        token,
      );
    }
  }

  for (const [index, point] of payload.pickupPoints.entries()) {
    await createTourPickupPoint(
      tourId,
      {
        city: point.city,
        location: point.location,
        time: point.time,
        description: point.description,
        latitude: point.latitude,
        longitude: point.longitude,
        order: index,
      },
      token,
    );
  }

  if (payload.accommodationName || formData.accommodationName) {
    await upsertTourAccommodation(
      tourId,
      {
        name: payload.accommodationName || formData.accommodationName,
        image: coverUrl ?? '/brand/mark-on-light.png',
        location:
          formData.destinations[0]?.city || formData.location || 'Türkiye',
        type: formData.accommodationType || 'Otel',
      },
      token,
    );
  }

  return tourId;
}

export async function persistPartnerTourUpdate(
  tourId: string,
  payload: SubmitPayload,
  token: string,
  uploadEntityId: string,
) {
  const { formData } = payload;

  const coverUrl =
    (await resolveImageUrl(
      formData.mainImage?.file,
      formData.mainImage?.url,
      uploadEntityId,
      token,
    )) ??
    (await resolveImageUrl(
      formData.images[0]?.file,
      formData.images[0]?.url,
      uploadEntityId,
      token,
    ));

  const galleryUrls: string[] = [];
  // Keep update behavior aligned with create:
  // accept both explicit galleryImages and legacy images[] slots.
  for (const img of formData.galleryImages ?? []) {
    const uploaded = await resolveImageUrl(
      img.file,
      img.url,
      uploadEntityId,
      token,
    );
    if (uploaded) galleryUrls.push(uploaded);
  }
  for (const img of formData.images.slice(1)) {
    const uploaded = await resolveImageUrl(
      img.file,
      img.url,
      uploadEntityId,
      token,
    );
    if (uploaded) galleryUrls.push(uploaded);
  }
  const dedupedGalleryUrls = [...new Set(galleryUrls)];

  const category = mapLegacyTourCategory(
    payload.tourType ?? formData.tourType,
    payload.region ?? formData.region,
    payload.features ?? formData.features,
  );

  const extras = buildTourExtrasFromForm(formData);
  const stayKind = inferStayKind({
    stayKind: formData.stayKind,
    durationDays: payload.duration,
    tourType: formData.tourType,
  });
  const destinationScope = inferDestinationScope({
    destinationScope: formData.destinationScope,
    tourType: formData.tourType,
    region: formData.region,
  });
  const departureCities = normalizeDepartureCities(formData.departureCity);

  await updatePartnerTour(
    tourId,
    {
      title: payload.title,
      description: payload.description,
      price: payload.price,
      category,
      durationDays: stayKind === 'DAY_TRIP' ? 1 : payload.duration || 1,
      stayKind,
      destinationScope,
      departureCities,
      coverUrl,
      galleryUrls: dedupedGalleryUrls.length ? dedupedGalleryUrls : undefined,
      extras,
    },
    token,
  );

  // Only create NEW date windows — never re-create existing start/end
  // (create-on-update was duplicating TourDate rows and breaking the date picker).
  const existingDates = await getTourDates(tourId).catch(() => []);
  const existingRangeKeys = new Set(
    existingDates.map(
      (date) =>
        `${String(date.startDate).slice(0, 10)}|${String(date.endDate).slice(0, 10)}`,
    ),
  );

  for (const date of payload.tourDates) {
    if (!date.startDate || !date.endDate) continue;
    const startDate = date.startDate.slice(0, 10);
    const endDate = date.endDate.slice(0, 10);
    const rangeKey = `${startDate}|${endDate}`;
    if (existingRangeKeys.has(rangeKey)) continue;

    const created = await createTourDate(
      tourId,
      {
        startDate,
        endDate,
        capacity: date.availableSeats || 1,
        priceOverride: payload.price,
      },
      token,
    );
    existingRangeKeys.add(rangeKey);

    for (const range of date.ageRanges ?? []) {
      await createTourDateAgeRange(
        tourId,
        created.id,
        {
          minAge: range.minAge,
          maxAge: range.maxAge,
          pricingType: mapAgePricingType(
            range.pricingType as 'free' | 'half' | 'percentage' | 'fixed',
          ),
          value: mapAgePricingValue(
            range.pricingType as 'free' | 'half' | 'percentage' | 'fixed',
            String(range.value),
          ),
        },
        token,
      );
    }
  }

  // Replace pickup points (create-only on update was duplicating rows)
  const existingPickups = await listTourPickupPoints(tourId, token).catch(
    () => [],
  );
  for (const existing of existingPickups) {
    await deleteTourPickupPoint(tourId, existing.id, token);
  }
  for (const [index, point] of payload.pickupPoints.entries()) {
    await createTourPickupPoint(
      tourId,
      {
        city: point.city,
        location: point.location,
        time: point.time,
        description: point.description,
        latitude: point.latitude,
        longitude: point.longitude,
        order: index,
      },
      token,
    );
  }

  if (formData.accommodationName) {
    await upsertTourAccommodation(
      tourId,
      {
        name: formData.accommodationName,
        image: coverUrl ?? '/brand/mark-on-light.png',
        location:
          formData.destinations[0]?.city || formData.location || 'Türkiye',
        type: formData.accommodationType || 'Otel',
      },
      token,
    );
  }
}

export function isTourSubmitPayload(
  data: TourFormData | Record<string, unknown>,
): data is Record<string, unknown> & { formData: TourFormData } {
  return typeof data === 'object' && data !== null && 'formData' in data;
}
