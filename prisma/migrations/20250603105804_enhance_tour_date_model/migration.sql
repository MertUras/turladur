/*
  Warnings:

  - Added the required column `updatedAt` to the `tour_dates` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TourDateStatus" AS ENUM ('ACTIVE', 'FULL', 'CANCELLED', 'COMPLETED', 'WAITING_LIST', 'NOT_ENOUGH_PARTICIPANTS');

-- AlterTable
ALTER TABLE "tour_dates" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "earlyBirdDeadline" TIMESTAMP(3),
ADD COLUMN     "earlyBirdDiscount" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "lastMinuteDiscount" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "lastMinuteStart" TIMESTAMP(3),
ADD COLUMN     "maxParticipants" INTEGER,
ADD COLUMN     "minParticipants" INTEGER,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "soldSeats" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" "TourDateStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "waitingList" INTEGER NOT NULL DEFAULT 0;
