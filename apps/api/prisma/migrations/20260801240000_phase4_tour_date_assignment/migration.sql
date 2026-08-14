-- Faz 4: TourDateAssignment + TourDate mirror (guide/bus/vehicle)
-- Neon yok. UI / Cloudflare dokunulmaz.

DO $$ BEGIN
  CREATE TYPE "catalog"."AssignmentStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "catalog"."TourDate" ADD COLUMN IF NOT EXISTS "guideId" TEXT;
ALTER TABLE "catalog"."TourDate" ADD COLUMN IF NOT EXISTS "busCompanyId" TEXT;
ALTER TABLE "catalog"."TourDate" ADD COLUMN IF NOT EXISTS "vehicleId" TEXT;
ALTER TABLE "catalog"."TourDate" ADD COLUMN IF NOT EXISTS "busSeatLayoutId" TEXT;

CREATE INDEX IF NOT EXISTS "TourDate_guideId_idx" ON "catalog"."TourDate"("guideId");
CREATE INDEX IF NOT EXISTS "TourDate_busCompanyId_idx" ON "catalog"."TourDate"("busCompanyId");
CREATE INDEX IF NOT EXISTS "TourDate_vehicleId_idx" ON "catalog"."TourDate"("vehicleId");
CREATE INDEX IF NOT EXISTS "TourDate_busSeatLayoutId_idx" ON "catalog"."TourDate"("busSeatLayoutId");

DO $$ BEGIN
  ALTER TABLE "catalog"."TourDate"
    ADD CONSTRAINT "TourDate_guideId_fkey"
    FOREIGN KEY ("guideId") REFERENCES "identity"."Guide"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "catalog"."TourDate"
    ADD CONSTRAINT "TourDate_busCompanyId_fkey"
    FOREIGN KEY ("busCompanyId") REFERENCES "identity"."BusCompany"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "catalog"."TourDate"
    ADD CONSTRAINT "TourDate_vehicleId_fkey"
    FOREIGN KEY ("vehicleId") REFERENCES "identity"."Vehicle"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "catalog"."TourDateAssignment" (
    "id" TEXT NOT NULL,
    "tourDateId" TEXT NOT NULL,
    "role" VARCHAR(16) NOT NULL,
    "guideId" TEXT,
    "busCompanyId" TEXT,
    "status" "catalog"."AssignmentStatus" NOT NULL DEFAULT 'PENDING',
    "invitedByAgencyId" TEXT NOT NULL,
    "invitedByAgencyStaffId" TEXT,
    "respondedAt" TIMESTAMP(3),
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "TourDateAssignment_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "TourDateAssignment_tourDateId_idx"
  ON "catalog"."TourDateAssignment"("tourDateId");
CREATE INDEX IF NOT EXISTS "TourDateAssignment_guideId_status_idx"
  ON "catalog"."TourDateAssignment"("guideId", "status");
CREATE INDEX IF NOT EXISTS "TourDateAssignment_busCompanyId_status_idx"
  ON "catalog"."TourDateAssignment"("busCompanyId", "status");
CREATE INDEX IF NOT EXISTS "TourDateAssignment_invitedByAgencyId_idx"
  ON "catalog"."TourDateAssignment"("invitedByAgencyId");
CREATE INDEX IF NOT EXISTS "TourDateAssignment_deletedAt_idx"
  ON "catalog"."TourDateAssignment"("deletedAt");

-- Role başına en fazla bir aktif PENDING|ACCEPTED
CREATE UNIQUE INDEX IF NOT EXISTS "TourDateAssignment_tourDateId_role_active_key"
  ON "catalog"."TourDateAssignment"("tourDateId", "role")
  WHERE "deletedAt" IS NULL AND "status" IN ('PENDING', 'ACCEPTED');

DO $$ BEGIN
  ALTER TABLE "catalog"."TourDateAssignment"
    ADD CONSTRAINT "TourDateAssignment_tourDateId_fkey"
    FOREIGN KEY ("tourDateId") REFERENCES "catalog"."TourDate"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "catalog"."TourDateAssignment"
    ADD CONSTRAINT "TourDateAssignment_guideId_fkey"
    FOREIGN KEY ("guideId") REFERENCES "identity"."Guide"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "catalog"."TourDateAssignment"
    ADD CONSTRAINT "TourDateAssignment_busCompanyId_fkey"
    FOREIGN KEY ("busCompanyId") REFERENCES "identity"."BusCompany"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "catalog"."TourDateAssignment"
    ADD CONSTRAINT "TourDateAssignment_invitedByAgencyId_fkey"
    FOREIGN KEY ("invitedByAgencyId") REFERENCES "identity"."Agency"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "catalog"."TourDateAssignment"
    ADD CONSTRAINT "TourDateAssignment_invitedByAgencyStaffId_fkey"
    FOREIGN KEY ("invitedByAgencyStaffId") REFERENCES "identity"."AgencyStaff"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
