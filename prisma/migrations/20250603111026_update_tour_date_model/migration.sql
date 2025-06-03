/*
  Warnings:

  - You are about to drop the column `discount` on the `tour_dates` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tour_dates" DROP COLUMN "discount",
ALTER COLUMN "earlyBirdDiscount" DROP DEFAULT,
ALTER COLUMN "lastMinuteDiscount" DROP DEFAULT,
ALTER COLUMN "soldSeats" DROP NOT NULL,
ALTER COLUMN "waitingList" DROP NOT NULL;
