-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "catalog";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "identity";

-- CreateEnum
CREATE TYPE "identity"."UserRole" AS ENUM ('CUSTOMER', 'PARTNER', 'PARTNER_STAFF', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "identity"."PartnerStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "catalog"."TourStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "catalog"."TourCategory" AS ENUM ('CULTURAL', 'ADVENTURE', 'GASTRONOMY', 'NATURE', 'CITY', 'BEACH');

-- CreateTable
CREATE TABLE "identity"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "role" "identity"."UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "partnerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity"."Partner" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "taxNumber" TEXT,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT,
    "status" "identity"."PartnerStatus" NOT NULL DEFAULT 'PENDING',
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog"."Tour" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(220) NOT NULL,
    "description" TEXT NOT NULL,
    "coverUrl" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'TRY',
    "category" "catalog"."TourCategory" NOT NULL,
    "status" "catalog"."TourStatus" NOT NULL DEFAULT 'DRAFT',
    "durationDays" INTEGER NOT NULL DEFAULT 1,
    "partnerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Tour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog"."TourDate" (
    "id" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "capacity" INTEGER NOT NULL,
    "remainingCapacity" INTEGER NOT NULL,
    "priceOverride" DECIMAL(10,2),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TourDate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "identity"."User"("email");

-- CreateIndex
CREATE INDEX "User_partnerId_idx" ON "identity"."User"("partnerId");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "identity"."User"("role");

-- CreateIndex
CREATE INDEX "User_deletedAt_idx" ON "identity"."User"("deletedAt");

-- CreateIndex
CREATE INDEX "Partner_status_idx" ON "identity"."Partner"("status");

-- CreateIndex
CREATE INDEX "Partner_deletedAt_idx" ON "identity"."Partner"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Tour_slug_key" ON "catalog"."Tour"("slug");

-- CreateIndex
CREATE INDEX "Tour_partnerId_idx" ON "catalog"."Tour"("partnerId");

-- CreateIndex
CREATE INDEX "Tour_category_status_idx" ON "catalog"."Tour"("category", "status");

-- CreateIndex
CREATE INDEX "Tour_slug_idx" ON "catalog"."Tour"("slug");

-- CreateIndex
CREATE INDEX "Tour_deletedAt_idx" ON "catalog"."Tour"("deletedAt");

-- CreateIndex
CREATE INDEX "TourDate_tourId_startDate_idx" ON "catalog"."TourDate"("tourId", "startDate");

-- CreateIndex
CREATE INDEX "TourDate_deletedAt_idx" ON "catalog"."TourDate"("deletedAt");

-- AddForeignKey
ALTER TABLE "identity"."User" ADD CONSTRAINT "User_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "identity"."Partner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog"."Tour" ADD CONSTRAINT "Tour_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "identity"."Partner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog"."TourDate" ADD CONSTRAINT "TourDate_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "catalog"."Tour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
