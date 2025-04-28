/*
  Warnings:

  - You are about to drop the column `partnerId` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `partnerId` on the `tours` table. All the data in the column will be lost.
  - You are about to drop the `partners` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_partnerId_fkey";

-- DropForeignKey
ALTER TABLE "tours" DROP CONSTRAINT "tours_partnerId_fkey";

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "partnerId",
ADD COLUMN     "tourOperatorId" TEXT;

-- AlterTable
ALTER TABLE "tours" DROP COLUMN "partnerId";

-- DropTable
DROP TABLE "partners";

-- DropEnum
DROP TYPE "PartnerStatus";

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_tourOperatorId_fkey" FOREIGN KEY ("tourOperatorId") REFERENCES "tour_operators"("id") ON DELETE SET NULL ON UPDATE CASCADE;
