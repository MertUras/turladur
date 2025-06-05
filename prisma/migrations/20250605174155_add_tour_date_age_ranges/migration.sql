-- CreateTable
CREATE TABLE "tour_date_age_ranges" (
    "id" TEXT NOT NULL,
    "minAge" INTEGER NOT NULL,
    "description" TEXT,
    "pricingType" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "tourDateId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tour_date_age_ranges_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tour_date_age_ranges" ADD CONSTRAINT "tour_date_age_ranges_tourDateId_fkey" FOREIGN KEY ("tourDateId") REFERENCES "tour_dates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
