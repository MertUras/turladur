/*
  Warnings:

  - Made the column `soldSeats` on table `tour_dates` required. This step will fail if there are existing NULL values in that column.
  - Made the column `waitingList` on table `tour_dates` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "tour_dates" DROP CONSTRAINT "tour_dates_tourId_fkey";

-- AlterTable
ALTER TABLE "tour_dates" ALTER COLUMN "soldSeats" SET NOT NULL,
ALTER COLUMN "waitingList" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "tour_dates" ADD CONSTRAINT "tour_dates_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
