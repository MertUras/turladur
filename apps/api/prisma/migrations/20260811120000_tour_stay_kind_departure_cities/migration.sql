-- R1: first-class tour taxonomy + departure cities (extras bag is no longer the source of truth)

CREATE TYPE "catalog"."TourStayKind" AS ENUM ('DAY_TRIP', 'OVERNIGHT');
CREATE TYPE "catalog"."TourDestinationScope" AS ENUM ('DOMESTIC', 'INTERNATIONAL');

ALTER TABLE "catalog"."Tour"
  ADD COLUMN "stayKind" "catalog"."TourStayKind" NOT NULL DEFAULT 'OVERNIGHT',
  ADD COLUMN "destinationScope" "catalog"."TourDestinationScope" NOT NULL DEFAULT 'DOMESTIC',
  ADD COLUMN "departureCities" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

UPDATE "catalog"."Tour"
SET
  "stayKind" = CASE
    WHEN "durationDays" = 1 THEN 'DAY_TRIP'::"catalog"."TourStayKind"
    WHEN COALESCE(extras->>'tourType', '') ILIKE '%günübirlik%'
      OR COALESCE(extras->>'tourType', '') ILIKE '%gunubirlik%'
      THEN 'DAY_TRIP'::"catalog"."TourStayKind"
    ELSE 'OVERNIGHT'::"catalog"."TourStayKind"
  END,
  "destinationScope" = CASE
    WHEN COALESCE(extras->>'tourType', '') || ' ' || COALESCE(extras->>'region', '')
      ILIKE '%yurtdış%'
      OR COALESCE(extras->>'tourType', '') || ' ' || COALESCE(extras->>'region', '')
      ILIKE '%yurtdis%'
      OR COALESCE(extras->>'tourType', '') || ' ' || COALESCE(extras->>'region', '')
      ILIKE '%international%'
      THEN 'INTERNATIONAL'::"catalog"."TourDestinationScope"
    ELSE 'DOMESTIC'::"catalog"."TourDestinationScope"
  END,
  "departureCities" = CASE
    WHEN jsonb_typeof(extras->'departureCity') = 'array' THEN
      ARRAY(
        SELECT DISTINCT trim(value)
        FROM jsonb_array_elements_text(extras->'departureCity') AS value
        WHERE trim(value) <> ''
      )
    WHEN extras->>'departureCity' IS NOT NULL AND trim(extras->>'departureCity') <> '' THEN
      ARRAY[trim(extras->>'departureCity')]
    ELSE ARRAY[]::TEXT[]
  END;

CREATE INDEX "Tour_stayKind_status_idx"
  ON "catalog"."Tour" ("stayKind", "status");

CREATE INDEX "Tour_destinationScope_status_idx"
  ON "catalog"."Tour" ("destinationScope", "status");
