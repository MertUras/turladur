/*
  Warnings:

  - You are about to drop the column `activityId` on the `activity_dates` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "activity_dates" DROP CONSTRAINT "activity_dates_activityId_fkey";

-- AlterTable
ALTER TABLE "activity_dates" DROP COLUMN "activityId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "experienceId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "activity_dates" ADD CONSTRAINT "activity_dates_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "experiences"("id") ON DELETE SET NULL ON UPDATE CASCADE;
