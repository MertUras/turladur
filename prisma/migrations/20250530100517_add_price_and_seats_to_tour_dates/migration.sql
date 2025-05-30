/*
  Warnings:

  - Added the required column `availableSeats` to the `tour_dates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `tour_dates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tour_dates" ADD COLUMN     "availableSeats" INTEGER NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;
