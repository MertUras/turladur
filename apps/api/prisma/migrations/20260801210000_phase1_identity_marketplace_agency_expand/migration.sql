-- Faz 1 expand: Legacy B2B Agency rename + marketplace Agency / staff / guide / bus / refresh
-- Partner tablosu KALIR. Room DROP yok (Faz 2). Neon'a uygulanmaz — önce onay.

-- 1) UserRole expand
ALTER TYPE "identity"."UserRole" ADD VALUE 'PLATFORM_ADMIN';
ALTER TYPE "identity"."UserRole" ADD VALUE 'PLATFORM_SUPER_ADMIN';

-- 2) Legacy AgencyStatus → LegacyAgencyStatus (rename type + table)
ALTER TYPE "identity"."AgencyStatus" RENAME TO "LegacyAgencyStatus";

ALTER TABLE "identity"."Agency" RENAME TO "LegacyAgency";

ALTER TABLE "identity"."LegacyAgency" RENAME CONSTRAINT "Agency_pkey" TO "LegacyAgency_pkey";

-- Prisma FK / index names may still say Agency; rename for clarity where present
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'Agency_userId_fkey'
      AND conrelid = 'identity."LegacyAgency"'::regclass
  ) THEN
    ALTER TABLE "identity"."LegacyAgency" RENAME CONSTRAINT "Agency_userId_fkey" TO "LegacyAgency_userId_fkey";
  END IF;
END $$;

-- 3) Marketplace enums
CREATE TYPE "identity"."AgencyStaffRole" AS ENUM ('AGENCY_OWNER', 'AGENCY_ADMIN', 'AGENCY_STAFF');
CREATE TYPE "identity"."AgencyStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED');
CREATE TYPE "identity"."AgencyCapability" AS ENUM ('TOURS');
CREATE TYPE "identity"."SellerTier" AS ENUM ('BRONZE', 'SILVER', 'GOLD');
CREATE TYPE "identity"."BusCompanyStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED');
CREATE TYPE "identity"."GuideStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED');
CREATE TYPE "identity"."TursabVerificationStatus" AS ENUM (
  'NOT_SUBMITTED', 'PENDING', 'VERIFIED', 'MISMATCH', 'NOT_FOUND', 'SUSPENDED', 'ERROR'
);
CREATE TYPE "identity"."BusLayoutKind" AS ENUM (
  'BUS_19_PLUS_1', 'BUS_31_PLUS_1', 'BUS_35_PLUS_1', 'BUS_46_PLUS_1', 'BUS_50_PLUS_1'
);

-- 4) Marketplace Agency (tüzel satıcı)
CREATE TABLE "identity"."Agency" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "taxNumber" TEXT NOT NULL,
    "legalTitle" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT,
    "country" TEXT DEFAULT 'Türkiye',
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT,
    "status" "identity"."AgencyStatus" NOT NULL DEFAULT 'PENDING',
    "capabilities" "identity"."AgencyCapability"[] DEFAULT ARRAY['TOURS']::"identity"."AgencyCapability"[],
    "sellerTier" "identity"."SellerTier" NOT NULL DEFAULT 'BRONZE',
    "sellerScore" DECIMAL(5,2),
    "sellerTierCalculatedAt" TIMESTAMP(3),
    "website" TEXT,
    "logo" TEXT,
    "license" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "tursabBelgeNo" TEXT,
    "tursabUnvan" TEXT,
    "tursabGroup" TEXT,
    "tursabCity" TEXT,
    "tursabVerificationStatus" "identity"."TursabVerificationStatus" NOT NULL DEFAULT 'NOT_SUBMITTED',
    "tursabVerifiedAt" TIMESTAMP(3),
    "tursabLastCheckedAt" TIMESTAMP(3),
    "tursabExpiresAt" TIMESTAMP(3),
    "tursabRawSnapshot" JSONB,
    "averageRating" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Agency_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Agency_status_idx" ON "identity"."Agency"("status");
CREATE INDEX "Agency_taxNumber_idx" ON "identity"."Agency"("taxNumber");
CREATE INDEX "Agency_sellerTier_idx" ON "identity"."Agency"("sellerTier");
CREATE INDEX "Agency_deletedAt_idx" ON "identity"."Agency"("deletedAt");
CREATE INDEX "Agency_contactEmail_idx" ON "identity"."Agency"("contactEmail");

-- Partial unique (soft-delete safe)
CREATE UNIQUE INDEX "Agency_taxNumber_active_key"
  ON "identity"."Agency"("taxNumber") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "Agency_contactEmail_active_key"
  ON "identity"."Agency"("contactEmail") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "Agency_tursabBelgeNo_active_key"
  ON "identity"."Agency"("tursabBelgeNo") WHERE "deletedAt" IS NULL AND "tursabBelgeNo" IS NOT NULL;

-- 5) AgencyStaff
CREATE TABLE "identity"."AgencyStaff" (
    "id" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "identity"."AgencyStaffRole" NOT NULL,
    "permissions" JSONB NOT NULL DEFAULT '{}',
    "status" VARCHAR(40) NOT NULL DEFAULT 'ACTIVE',
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AgencyStaff_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AgencyStaff_agencyId_idx" ON "identity"."AgencyStaff"("agencyId");
CREATE INDEX "AgencyStaff_email_idx" ON "identity"."AgencyStaff"("email");
CREATE INDEX "AgencyStaff_deletedAt_idx" ON "identity"."AgencyStaff"("deletedAt");
CREATE UNIQUE INDEX "AgencyStaff_agencyId_email_active_key"
  ON "identity"."AgencyStaff"("agencyId", "email") WHERE "deletedAt" IS NULL;

ALTER TABLE "identity"."AgencyStaff"
  ADD CONSTRAINT "AgencyStaff_agencyId_fkey"
  FOREIGN KEY ("agencyId") REFERENCES "identity"."Agency"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- 6) BusCompany
CREATE TABLE "identity"."BusCompany" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "taxNumber" TEXT,
    "contactEmail" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "contactPhone" TEXT,
    "status" "identity"."BusCompanyStatus" NOT NULL DEFAULT 'PENDING',
    "address" TEXT,
    "city" TEXT,
    "country" TEXT,
    "website" TEXT,
    "logo" TEXT,
    "licenseNumber" TEXT,
    "vehicleCount" INTEGER,
    "notes" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "averageRating" DECIMAL(3,2) DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "BusCompany_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "BusCompany_status_idx" ON "identity"."BusCompany"("status");
CREATE INDEX "BusCompany_deletedAt_idx" ON "identity"."BusCompany"("deletedAt");
CREATE INDEX "BusCompany_contactEmail_idx" ON "identity"."BusCompany"("contactEmail");
CREATE UNIQUE INDEX "BusCompany_contactEmail_active_key"
  ON "identity"."BusCompany"("contactEmail") WHERE "deletedAt" IS NULL;

-- 7) Guide
CREATE TABLE "identity"."Guide" (
    "id" TEXT NOT NULL,
    "identityNumber" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "phone" TEXT,
    "birthDate" DATE,
    "status" "identity"."GuideStatus" NOT NULL DEFAULT 'PENDING',
    "languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "oda" TEXT,
    "sicilNo" TEXT,
    "ruhsatNo" TEXT,
    "ruhsatExpiresAt" TIMESTAMP(3),
    "licenseNumber" TEXT,
    "bio" TEXT,
    "photoUrl" TEXT,
    "city" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "averageRating" DECIMAL(3,2) DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Guide_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Guide_status_idx" ON "identity"."Guide"("status");
CREATE INDEX "Guide_city_idx" ON "identity"."Guide"("city");
CREATE INDEX "Guide_sicilNo_idx" ON "identity"."Guide"("sicilNo");
CREATE INDEX "Guide_deletedAt_idx" ON "identity"."Guide"("deletedAt");
CREATE INDEX "Guide_email_idx" ON "identity"."Guide"("email");
CREATE INDEX "Guide_identityNumber_idx" ON "identity"."Guide"("identityNumber");
CREATE UNIQUE INDEX "Guide_identityNumber_active_key"
  ON "identity"."Guide"("identityNumber") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "Guide_email_active_key"
  ON "identity"."Guide"("email") WHERE "deletedAt" IS NULL;

-- 8) Vehicle
CREATE TABLE "identity"."Vehicle" (
    "id" TEXT NOT NULL,
    "busCompanyId" TEXT NOT NULL,
    "plateNumber" TEXT NOT NULL,
    "modelYear" INTEGER,
    "seatLayoutKind" "identity"."BusLayoutKind" NOT NULL,
    "capacity" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Vehicle_busCompanyId_idx" ON "identity"."Vehicle"("busCompanyId");
CREATE INDEX "Vehicle_seatLayoutKind_idx" ON "identity"."Vehicle"("seatLayoutKind");
CREATE INDEX "Vehicle_deletedAt_idx" ON "identity"."Vehicle"("deletedAt");
CREATE INDEX "Vehicle_plateNumber_idx" ON "identity"."Vehicle"("plateNumber");
CREATE UNIQUE INDEX "Vehicle_plateNumber_active_key"
  ON "identity"."Vehicle"("plateNumber") WHERE "deletedAt" IS NULL;

ALTER TABLE "identity"."Vehicle"
  ADD CONSTRAINT "Vehicle_busCompanyId_fkey"
  FOREIGN KEY ("busCompanyId") REFERENCES "identity"."BusCompany"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- 9) Availability
CREATE TABLE "identity"."GuideAvailability" (
    "id" TEXT NOT NULL,
    "guideId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "GuideAvailability_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "GuideAvailability_guideId_date_key"
  ON "identity"."GuideAvailability"("guideId", "date");
CREATE INDEX "GuideAvailability_guideId_date_isAvailable_idx"
  ON "identity"."GuideAvailability"("guideId", "date", "isAvailable");

ALTER TABLE "identity"."GuideAvailability"
  ADD CONSTRAINT "GuideAvailability_guideId_fkey"
  FOREIGN KEY ("guideId") REFERENCES "identity"."Guide"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "identity"."VehicleAvailability" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "VehicleAvailability_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "VehicleAvailability_vehicleId_date_key"
  ON "identity"."VehicleAvailability"("vehicleId", "date");
CREATE INDEX "VehicleAvailability_vehicleId_date_isAvailable_idx"
  ON "identity"."VehicleAvailability"("vehicleId", "date", "isAvailable");

ALTER TABLE "identity"."VehicleAvailability"
  ADD CONSTRAINT "VehicleAvailability_vehicleId_fkey"
  FOREIGN KEY ("vehicleId") REFERENCES "identity"."Vehicle"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- 10) TursabVerificationLog
CREATE TABLE "identity"."TursabVerificationLog" (
    "id" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "belgeNo" VARCHAR(32) NOT NULL,
    "trigger" VARCHAR(40) NOT NULL,
    "success" BOOLEAN NOT NULL,
    "statusResult" "identity"."TursabVerificationStatus",
    "httpStatus" INTEGER,
    "requestId" TEXT,
    "errorMessage" TEXT,
    "responseSummary" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,

    CONSTRAINT "TursabVerificationLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "TursabVerificationLog_agencyId_createdAt_idx"
  ON "identity"."TursabVerificationLog"("agencyId", "createdAt");
CREATE INDEX "TursabVerificationLog_belgeNo_createdAt_idx"
  ON "identity"."TursabVerificationLog"("belgeNo", "createdAt");
CREATE INDEX "TursabVerificationLog_success_createdAt_idx"
  ON "identity"."TursabVerificationLog"("success", "createdAt");

ALTER TABLE "identity"."TursabVerificationLog"
  ADD CONSTRAINT "TursabVerificationLog_agencyId_fkey"
  FOREIGN KEY ("agencyId") REFERENCES "identity"."Agency"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- 11) AgencyBankInfo
CREATE TABLE "identity"."AgencyBankInfo" (
    "id" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "iban" VARCHAR(34) NOT NULL,
    "accountName" VARCHAR(200) NOT NULL,
    "bankName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AgencyBankInfo_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AgencyBankInfo_agencyId_key" ON "identity"."AgencyBankInfo"("agencyId");

ALTER TABLE "identity"."AgencyBankInfo"
  ADD CONSTRAINT "AgencyBankInfo_agencyId_fkey"
  FOREIGN KEY ("agencyId") REFERENCES "identity"."Agency"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- 12) RefreshToken
CREATE TABLE "identity"."RefreshToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "agencyStaffId" TEXT,
    "busCompanyId" TEXT,
    "guideId" TEXT,
    "tokenHash" TEXT NOT NULL,
    "familyId" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "idleTimeoutMinutes" INTEGER,
    "lastUsedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "replacedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "RefreshToken_userId_idx" ON "identity"."RefreshToken"("userId");
CREATE INDEX "RefreshToken_agencyStaffId_idx" ON "identity"."RefreshToken"("agencyStaffId");
CREATE INDEX "RefreshToken_busCompanyId_idx" ON "identity"."RefreshToken"("busCompanyId");
CREATE INDEX "RefreshToken_guideId_idx" ON "identity"."RefreshToken"("guideId");
CREATE INDEX "RefreshToken_expiresAt_idx" ON "identity"."RefreshToken"("expiresAt");
CREATE INDEX "RefreshToken_familyId_idx" ON "identity"."RefreshToken"("familyId");
CREATE INDEX "RefreshToken_tokenHash_idx" ON "identity"."RefreshToken"("tokenHash");
CREATE UNIQUE INDEX "RefreshToken_tokenHash_active_key"
  ON "identity"."RefreshToken"("tokenHash") WHERE "deletedAt" IS NULL;

ALTER TABLE "identity"."RefreshToken"
  ADD CONSTRAINT "RefreshToken_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "identity"."User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "identity"."RefreshToken"
  ADD CONSTRAINT "RefreshToken_agencyStaffId_fkey"
  FOREIGN KEY ("agencyStaffId") REFERENCES "identity"."AgencyStaff"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "identity"."RefreshToken"
  ADD CONSTRAINT "RefreshToken_busCompanyId_fkey"
  FOREIGN KEY ("busCompanyId") REFERENCES "identity"."BusCompany"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "identity"."RefreshToken"
  ADD CONSTRAINT "RefreshToken_guideId_fkey"
  FOREIGN KEY ("guideId") REFERENCES "identity"."Guide"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "identity"."RefreshToken"
  ADD CONSTRAINT "RefreshToken_replacedById_fkey"
  FOREIGN KEY ("replacedById") REFERENCES "identity"."RefreshToken"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- 13) IdempotencyKey + AuditLog
CREATE TABLE "identity"."IdempotencyKey" (
    "id" TEXT NOT NULL,
    "key" VARCHAR(128) NOT NULL,
    "userId" TEXT,
    "agencyId" TEXT,
    "agencyStaffId" TEXT,
    "method" VARCHAR(16) NOT NULL,
    "path" VARCHAR(256) NOT NULL,
    "requestHash" TEXT,
    "responseStatus" INTEGER,
    "responseBody" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "IdempotencyKey_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "IdempotencyKey_key_key" ON "identity"."IdempotencyKey"("key");
CREATE INDEX "IdempotencyKey_expiresAt_idx" ON "identity"."IdempotencyKey"("expiresAt");
CREATE INDEX "IdempotencyKey_userId_createdAt_idx" ON "identity"."IdempotencyKey"("userId", "createdAt");

CREATE TABLE "identity"."AuditLog" (
    "id" TEXT NOT NULL,
    "actorType" VARCHAR(40) NOT NULL,
    "actorId" TEXT,
    "action" VARCHAR(80) NOT NULL,
    "entityType" VARCHAR(80) NOT NULL,
    "entityId" TEXT,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AuditLog_entityType_entityId_createdAt_idx"
  ON "identity"."AuditLog"("entityType", "entityId", "createdAt");
CREATE INDEX "AuditLog_actorId_createdAt_idx"
  ON "identity"."AuditLog"("actorId", "createdAt");
