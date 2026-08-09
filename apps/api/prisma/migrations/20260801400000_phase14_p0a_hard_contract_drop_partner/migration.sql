-- P0-A hard contract: agencyId NOT NULL + DROP Partner / LegacyAgency / SubUser

-- Experience.agencyId expand
ALTER TABLE catalog."Experience" ADD COLUMN IF NOT EXISTS "agencyId" TEXT;

-- Backfill from Partner.marketplaceAgencyId while Partner still exists
UPDATE catalog."Tour" AS t
SET "agencyId" = p."marketplaceAgencyId"
FROM identity."Partner" AS p
WHERE t."partnerId" = p.id
  AND t."agencyId" IS NULL
  AND p."marketplaceAgencyId" IS NOT NULL;

UPDATE catalog."Hotel" AS h
SET "agencyId" = p."marketplaceAgencyId"
FROM identity."Partner" AS p
WHERE h."partnerId" = p.id
  AND h."agencyId" IS NULL
  AND p."marketplaceAgencyId" IS NOT NULL;

UPDATE catalog."Experience" AS e
SET "agencyId" = p."marketplaceAgencyId"
FROM identity."Partner" AS p
WHERE e."partnerId" = p.id
  AND e."agencyId" IS NULL
  AND p."marketplaceAgencyId" IS NOT NULL;

UPDATE booking."Reservation" AS r
SET "agencyId" = p."marketplaceAgencyId"
FROM identity."Partner" AS p
WHERE r."partnerId" = p.id
  AND r."agencyId" IS NULL
  AND p."marketplaceAgencyId" IS NOT NULL;

UPDATE review."Review" AS rv
SET "agencyId" = p."marketplaceAgencyId"
FROM identity."Partner" AS p
WHERE rv."partnerId" = p.id
  AND rv."agencyId" IS NULL
  AND p."marketplaceAgencyId" IS NOT NULL;

-- Fallback: any remaining nulls → seed agency if present, else first Agency
UPDATE catalog."Tour" SET "agencyId" = COALESCE(
  (SELECT id FROM identity."Agency" WHERE id = 'seed-agency-demo' AND "deletedAt" IS NULL LIMIT 1),
  (SELECT id FROM identity."Agency" WHERE "deletedAt" IS NULL ORDER BY "createdAt" ASC LIMIT 1)
) WHERE "agencyId" IS NULL;

UPDATE catalog."Hotel" SET "agencyId" = COALESCE(
  (SELECT id FROM identity."Agency" WHERE id = 'seed-agency-demo' AND "deletedAt" IS NULL LIMIT 1),
  (SELECT id FROM identity."Agency" WHERE "deletedAt" IS NULL ORDER BY "createdAt" ASC LIMIT 1)
) WHERE "agencyId" IS NULL;

UPDATE catalog."Experience" SET "agencyId" = COALESCE(
  (SELECT id FROM identity."Agency" WHERE id = 'seed-agency-demo' AND "deletedAt" IS NULL LIMIT 1),
  (SELECT id FROM identity."Agency" WHERE "deletedAt" IS NULL ORDER BY "createdAt" ASC LIMIT 1)
) WHERE "agencyId" IS NULL;

UPDATE booking."Reservation" SET "agencyId" = COALESCE(
  (SELECT id FROM identity."Agency" WHERE id = 'seed-agency-demo' AND "deletedAt" IS NULL LIMIT 1),
  (SELECT id FROM identity."Agency" WHERE "deletedAt" IS NULL ORDER BY "createdAt" ASC LIMIT 1)
) WHERE "agencyId" IS NULL;

UPDATE review."Review" SET "agencyId" = COALESCE(
  (SELECT id FROM identity."Agency" WHERE id = 'seed-agency-demo' AND "deletedAt" IS NULL LIMIT 1),
  (SELECT id FROM identity."Agency" WHERE "deletedAt" IS NULL ORDER BY "createdAt" ASC LIMIT 1)
) WHERE "agencyId" IS NULL;

-- NOT NULL
ALTER TABLE catalog."Tour" ALTER COLUMN "agencyId" SET NOT NULL;
ALTER TABLE catalog."Hotel" ALTER COLUMN "agencyId" SET NOT NULL;
ALTER TABLE catalog."Experience" ALTER COLUMN "agencyId" SET NOT NULL;
ALTER TABLE booking."Reservation" ALTER COLUMN "agencyId" SET NOT NULL;
ALTER TABLE review."Review" ALTER COLUMN "agencyId" SET NOT NULL;

-- FK agencyId on Experience (others may already exist)
DO $$ BEGIN
  ALTER TABLE catalog."Experience"
    ADD CONSTRAINT "Experience_agencyId_fkey"
    FOREIGN KEY ("agencyId") REFERENCES identity."Agency"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Drop Partner FKs
ALTER TABLE identity."User" DROP CONSTRAINT IF EXISTS "User_partnerId_fkey";
ALTER TABLE catalog."Tour" DROP CONSTRAINT IF EXISTS "Tour_partnerId_fkey";
ALTER TABLE catalog."Hotel" DROP CONSTRAINT IF EXISTS "Hotel_partnerId_fkey";
ALTER TABLE catalog."Experience" DROP CONSTRAINT IF EXISTS "Experience_partnerId_fkey";
ALTER TABLE identity."SubUser" DROP CONSTRAINT IF EXISTS "SubUser_partnerId_fkey";
ALTER TABLE identity."Partner" DROP CONSTRAINT IF EXISTS "Partner_marketplaceAgencyId_fkey";

-- Drop partnerId indexes (ignore missing)
DROP INDEX IF EXISTS identity."User_partnerId_idx";
DROP INDEX IF EXISTS catalog."Tour_partnerId_idx";
DROP INDEX IF EXISTS catalog."Hotel_partnerId_idx";
DROP INDEX IF EXISTS catalog."Experience_partnerId_idx";
DROP INDEX IF EXISTS booking."Reservation_partnerId_idx";
DROP INDEX IF EXISTS booking."Reservation_partnerId_status_createdAt_idx";
DROP INDEX IF EXISTS review."Review_partnerId_idx";

-- Drop columns
ALTER TABLE identity."User" DROP COLUMN IF EXISTS "partnerId";
ALTER TABLE catalog."Tour" DROP COLUMN IF EXISTS "partnerId";
ALTER TABLE catalog."Hotel" DROP COLUMN IF EXISTS "partnerId";
ALTER TABLE catalog."Experience" DROP COLUMN IF EXISTS "partnerId";
ALTER TABLE booking."Reservation" DROP COLUMN IF EXISTS "partnerId";
ALTER TABLE review."Review" DROP COLUMN IF EXISTS "partnerId";

-- Drop tables (order: children first)
DROP TABLE IF EXISTS identity."SubUser";
DROP TABLE IF EXISTS identity."LegacyAgency";
DROP TABLE IF EXISTS identity."Partner";
