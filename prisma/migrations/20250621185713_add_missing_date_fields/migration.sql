-- AlterTable
ALTER TABLE "tour_dates" ADD COLUMN     "earlyBirdDeadlineStart" TIMESTAMP(3),
ADD COLUMN     "lastMinuteStartEnd" TIMESTAMP(3);

-- RenameIndex
-- ALTER INDEX "unique_age_range_per_tour_date" RENAME TO "tour_date_age_ranges_tourDateId_minAge_maxAge_key";
