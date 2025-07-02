-- CreateTable
CREATE TABLE "experience_date_age_ranges" (
    "id" TEXT NOT NULL,
    "minAge" INTEGER NOT NULL,
    "maxAge" INTEGER,
    "pricingType" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "activityDateId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "experience_date_age_ranges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "experience_date_age_ranges_activityDateId_minAge_maxAge_key" ON "experience_date_age_ranges"("activityDateId", "minAge", "maxAge");

-- AddForeignKey
ALTER TABLE "experience_date_age_ranges" ADD CONSTRAINT "experience_date_age_ranges_activityDateId_fkey" FOREIGN KEY ("activityDateId") REFERENCES "activity_dates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
-- ALTER INDEX "unique_age_range_per_tour_date" RENAME TO "tour_date_age_ranges_tourDateId_minAge_maxAge_key";
