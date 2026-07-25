import type { TourFormData } from '@/components/features/partner-dashboard/tour-form';
import {
  buildTourExtrasFromForm,
  mapAgePricingType,
  mapAgePricingValue,
  mapLegacyTourCategory,
  uploadTourImageFile,
} from '@/lib/partner-tour-helpers';
import {
  createPartnerTour,
  createTourDate,
  createTourDateAgeRange,
  createTourPickupPoint,
  getPresignedUpload,
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

  let coverUrl =
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

  const tour = await createPartnerTour(
    {
      title: payload.title,
      description: payload.description,
      price: payload.price,
      category,
      durationDays: payload.duration || 1,
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

  let coverUrl = await resolveImageUrl(
    formData.mainImage?.file,
    formData.mainImage?.url,
    uploadEntityId,
    token,
  );

  const galleryUrls: string[] = [];
  for (const img of formData.galleryImages ?? []) {
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

  await updatePartnerTour(
    tourId,
    {
      title: payload.title,
      description: payload.description,
      price: payload.price,
      category,
      durationDays: payload.duration || 1,
      coverUrl,
      galleryUrls: galleryUrls.length ? galleryUrls : undefined,
      extras: buildTourExtrasFromForm(formData),
    },
    token,
  );

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

  for (const [index, point] of payload.pickupPoints.entries()) {
    await createTourPickupPoint(
      tourId,
      {
        city: point.city,
        location: point.location,
        time: point.time,
        description: point.description,
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
