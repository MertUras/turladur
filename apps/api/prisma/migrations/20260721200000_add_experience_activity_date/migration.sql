-- CreateEnum
CREATE TYPE "catalog"."ExperienceStatus" AS ENUM (
  'DRAFT',
  'PENDING_REVIEW',
  'PUBLISHED',
  'ARCHIVED'
);

-- CreateTable
CREATE TABLE "catalog"."Experience" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(220) NOT NULL,
    "description" TEXT NOT NULL,
    "longDescription" TEXT NOT NULL,
    "category" VARCHAR(120) NOT NULL,
    "location" VARCHAR(200) NOT NULL,
    "duration" VARCHAR(80) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'TRY',
    "ageRestriction" TEXT,
    "imageUrl" TEXT,
    "gallery" JSONB NOT NULL DEFAULT '[]',
    "included" JSONB NOT NULL DEFAULT '[]',
    "notIncluded" JSONB NOT NULL DEFAULT '[]',
    "schedule" JSONB,
    "highlights" JSONB NOT NULL DEFAULT '[]',
    "averageRating" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "popularityRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "catalog"."ExperienceStatus" NOT NULL DEFAULT 'DRAFT',
    "meetingPoint" TEXT,
    "meetingPointAddress" TEXT,
    "partnerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog"."ActivityDate" (
    "id" TEXT NOT NULL,
    "experienceId" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "availableSeats" INTEGER NOT NULL,
    "remainingCapacity" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ActivityDate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Experience_slug_key" ON "catalog"."Experience"("slug");

-- CreateIndex
CREATE INDEX "Experience_partnerId_idx" ON "catalog"."Experience"("partnerId");

-- CreateIndex
CREATE INDEX "Experience_category_status_idx" ON "catalog"."Experience"("category", "status");

-- CreateIndex
CREATE INDEX "Experience_location_idx" ON "catalog"."Experience"("location");

-- CreateIndex
CREATE INDEX "Experience_slug_idx" ON "catalog"."Experience"("slug");

-- CreateIndex
CREATE INDEX "Experience_deletedAt_idx" ON "catalog"."Experience"("deletedAt");

-- CreateIndex
CREATE INDEX "ActivityDate_experienceId_startDate_idx" ON "catalog"."ActivityDate"("experienceId", "startDate");

-- CreateIndex
CREATE INDEX "ActivityDate_isActive_idx" ON "catalog"."ActivityDate"("isActive");

-- CreateIndex
CREATE INDEX "ActivityDate_deletedAt_idx" ON "catalog"."ActivityDate"("deletedAt");

-- AddForeignKey
ALTER TABLE "catalog"."Experience"
  ADD CONSTRAINT "Experience_partnerId_fkey"
  FOREIGN KEY ("partnerId") REFERENCES "identity"."Partner"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog"."ActivityDate"
  ADD CONSTRAINT "ActivityDate_experienceId_fkey"
  FOREIGN KEY ("experienceId") REFERENCES "catalog"."Experience"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
