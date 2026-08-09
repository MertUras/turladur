-- Faz 2: catalog expand + Room DROP + reservation roomId/hotelId DROP
-- Neon'a uygulanmaz — önce onay. UI / Storage dokunulmaz.

-- Tour expand
ALTER TABLE "catalog"."Tour" ADD COLUMN IF NOT EXISTS "childMaxAge" INTEGER;
ALTER TABLE "catalog"."Tour" ADD COLUMN IF NOT EXISTS "minParticipants" INTEGER;
ALTER TABLE "catalog"."Tour" ADD COLUMN IF NOT EXISTS "version" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "catalog"."Tour" ADD COLUMN IF NOT EXISTS "agencyId" TEXT;

CREATE INDEX IF NOT EXISTS "Tour_agencyId_idx" ON "catalog"."Tour"("agencyId");

DO $$ BEGIN
  ALTER TABLE "catalog"."Tour"
    ADD CONSTRAINT "Tour_agencyId_fkey"
    FOREIGN KEY ("agencyId") REFERENCES "identity"."Agency"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- TourDepartureRule
CREATE TABLE IF NOT EXISTS "catalog"."TourDepartureRule" (
    "id" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "rangeStart" DATE NOT NULL,
    "rangeEnd" DATE NOT NULL,
    "weekdays" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "defaultCapacity" INTEGER NOT NULL,
    "defaultPriceOverride" DECIMAL(10,2),
    "ageRangeTemplate" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastGeneratedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "TourDepartureRule_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "TourDepartureRule_tourId_isActive_idx"
  ON "catalog"."TourDepartureRule"("tourId", "isActive");
CREATE INDEX IF NOT EXISTS "TourDepartureRule_deletedAt_idx"
  ON "catalog"."TourDepartureRule"("deletedAt");

DO $$ BEGIN
  ALTER TABLE "catalog"."TourDepartureRule"
    ADD CONSTRAINT "TourDepartureRule_tourId_fkey"
    FOREIGN KEY ("tourId") REFERENCES "catalog"."Tour"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- TourDate expand
ALTER TABLE "catalog"."TourDate" ADD COLUMN IF NOT EXISTS "version" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "catalog"."TourDate" ADD COLUMN IF NOT EXISTS "departureRuleId" TEXT;

CREATE INDEX IF NOT EXISTS "TourDate_departureRuleId_idx"
  ON "catalog"."TourDate"("departureRuleId");

DO $$ BEGIN
  ALTER TABLE "catalog"."TourDate"
    ADD CONSTRAINT "TourDate_departureRuleId_fkey"
    FOREIGN KEY ("departureRuleId") REFERENCES "catalog"."TourDepartureRule"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Doküman: UNIQUE (tourId, startDate, endDate)
-- TourDate soft-delete kullandığı için partial unique (DATABASE_SCHEMA § Soft delete & partial unique).
CREATE UNIQUE INDEX IF NOT EXISTS "TourDate_tourId_startDate_endDate_active_key"
  ON "catalog"."TourDate"("tourId", "startDate", "endDate")
  WHERE "deletedAt" IS NULL;

CREATE INDEX IF NOT EXISTS "TourDate_tourId_startDate_endDate_idx"
  ON "catalog"."TourDate"("tourId", "startDate", "endDate");

-- TourExtra
CREATE TABLE IF NOT EXISTS "catalog"."TourExtra" (
    "id" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "dayNumber" INTEGER,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'TRY',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "TourExtra_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "TourExtra_tourId_isActive_idx"
  ON "catalog"."TourExtra"("tourId", "isActive");
CREATE INDEX IF NOT EXISTS "TourExtra_sortOrder_idx" ON "catalog"."TourExtra"("sortOrder");
CREATE INDEX IF NOT EXISTS "TourExtra_deletedAt_idx" ON "catalog"."TourExtra"("deletedAt");

DO $$ BEGIN
  ALTER TABLE "catalog"."TourExtra"
    ADD CONSTRAINT "TourExtra_tourId_fkey"
    FOREIGN KEY ("tourId") REFERENCES "catalog"."Tour"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- TourAccommodation expand
ALTER TABLE "catalog"."TourAccommodation" ADD COLUMN IF NOT EXISTS "dayNumber" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "catalog"."TourAccommodation" ADD COLUMN IF NOT EXISTS "hotelId" TEXT;
ALTER TABLE "catalog"."TourAccommodation" ADD COLUMN IF NOT EXISTS "nights" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "catalog"."TourAccommodation" ADD COLUMN IF NOT EXISTS "note" TEXT;
ALTER TABLE "catalog"."TourAccommodation" ADD COLUMN IF NOT EXISTS "sortOrder" INTEGER NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS "TourAccommodation_hotelId_idx"
  ON "catalog"."TourAccommodation"("hotelId");

-- TourPickupPoint
ALTER TABLE "catalog"."TourPickupPoint" ADD COLUMN IF NOT EXISTS "isFixedOrigin" BOOLEAN NOT NULL DEFAULT false;

-- Hotel expand + Room DROP
ALTER TABLE "catalog"."Hotel" ADD COLUMN IF NOT EXISTS "agencyId" TEXT;
ALTER TABLE "catalog"."Hotel" ADD COLUMN IF NOT EXISTS "averageRating" DECIMAL(3,2) DEFAULT 0;
ALTER TABLE "catalog"."Hotel" ADD COLUMN IF NOT EXISTS "reviewCount" INTEGER NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS "Hotel_agencyId_idx" ON "catalog"."Hotel"("agencyId");

DO $$ BEGIN
  ALTER TABLE "catalog"."Hotel"
    ADD CONSTRAINT "Hotel_agencyId_fkey"
    FOREIGN KEY ("agencyId") REFERENCES "identity"."Agency"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "catalog"."TourAccommodation"
    ADD CONSTRAINT "TourAccommodation_hotelId_fkey"
    FOREIGN KEY ("hotelId") REFERENCES "catalog"."Hotel"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DROP TABLE IF EXISTS "catalog"."Room";

-- Reservation: drop room/hotel sales columns
DROP INDEX IF EXISTS "booking"."Reservation_hotelId_idx";
ALTER TABLE "booking"."Reservation" DROP COLUMN IF EXISTS "roomId";
ALTER TABLE "booking"."Reservation" DROP COLUMN IF EXISTS "hotelId";
CREATE INDEX IF NOT EXISTS "Reservation_agencyId_idx" ON "booking"."Reservation"("agencyId");
