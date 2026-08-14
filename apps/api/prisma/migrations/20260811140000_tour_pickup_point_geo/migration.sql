-- R9: pickup pin coordinates (Leaflet / OSM). No Google placeId.

ALTER TABLE "catalog"."TourPickupPoint"
  ADD COLUMN IF NOT EXISTS "latitude" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "longitude" DOUBLE PRECISION;
