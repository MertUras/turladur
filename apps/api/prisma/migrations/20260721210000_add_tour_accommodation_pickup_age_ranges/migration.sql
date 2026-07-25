-- CreateEnum
CREATE TYPE "catalog"."AgePricingType" AS ENUM ('FREE', 'HALF', 'PERCENTAGE', 'FIXED');

-- CreateTable
CREATE TABLE "catalog"."TourAccommodation" (
    "id" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "image" TEXT NOT NULL,
    "location" VARCHAR(200) NOT NULL,
    "type" VARCHAR(80) NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "features" JSONB NOT NULL DEFAULT '[]',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TourAccommodation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog"."TourPickupPoint" (
    "id" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "city" VARCHAR(120) NOT NULL,
    "location" VARCHAR(200) NOT NULL,
    "time" VARCHAR(20) NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TourPickupPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog"."TourDateAgeRange" (
    "id" TEXT NOT NULL,
    "tourDateId" TEXT NOT NULL,
    "minAge" INTEGER NOT NULL,
    "maxAge" INTEGER,
    "pricingType" "catalog"."AgePricingType" NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TourDateAgeRange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog"."ExperienceDateAgeRange" (
    "id" TEXT NOT NULL,
    "activityDateId" TEXT NOT NULL,
    "minAge" INTEGER NOT NULL,
    "maxAge" INTEGER,
    "pricingType" "catalog"."AgePricingType" NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ExperienceDateAgeRange_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TourAccommodation_tourId_key" ON "catalog"."TourAccommodation"("tourId");

-- CreateIndex
CREATE INDEX "TourAccommodation_deletedAt_idx" ON "catalog"."TourAccommodation"("deletedAt");

-- CreateIndex
CREATE INDEX "TourPickupPoint_tourId_order_idx" ON "catalog"."TourPickupPoint"("tourId", "order");

-- CreateIndex
CREATE INDEX "TourPickupPoint_city_idx" ON "catalog"."TourPickupPoint"("city");

-- CreateIndex
CREATE INDEX "TourPickupPoint_deletedAt_idx" ON "catalog"."TourPickupPoint"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "TourDateAgeRange_tourDateId_minAge_maxAge_key" ON "catalog"."TourDateAgeRange"("tourDateId", "minAge", "maxAge");

-- CreateIndex
CREATE INDEX "TourDateAgeRange_tourDateId_idx" ON "catalog"."TourDateAgeRange"("tourDateId");

-- CreateIndex
CREATE INDEX "TourDateAgeRange_deletedAt_idx" ON "catalog"."TourDateAgeRange"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ExperienceDateAgeRange_activityDateId_minAge_maxAge_key" ON "catalog"."ExperienceDateAgeRange"("activityDateId", "minAge", "maxAge");

-- CreateIndex
CREATE INDEX "ExperienceDateAgeRange_activityDateId_idx" ON "catalog"."ExperienceDateAgeRange"("activityDateId");

-- CreateIndex
CREATE INDEX "ExperienceDateAgeRange_deletedAt_idx" ON "catalog"."ExperienceDateAgeRange"("deletedAt");

-- AddForeignKey
ALTER TABLE "catalog"."TourAccommodation"
  ADD CONSTRAINT "TourAccommodation_tourId_fkey"
  FOREIGN KEY ("tourId") REFERENCES "catalog"."Tour"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog"."TourPickupPoint"
  ADD CONSTRAINT "TourPickupPoint_tourId_fkey"
  FOREIGN KEY ("tourId") REFERENCES "catalog"."Tour"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog"."TourDateAgeRange"
  ADD CONSTRAINT "TourDateAgeRange_tourDateId_fkey"
  FOREIGN KEY ("tourDateId") REFERENCES "catalog"."TourDate"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog"."ExperienceDateAgeRange"
  ADD CONSTRAINT "ExperienceDateAgeRange_activityDateId_fkey"
  FOREIGN KEY ("activityDateId") REFERENCES "catalog"."ActivityDate"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
