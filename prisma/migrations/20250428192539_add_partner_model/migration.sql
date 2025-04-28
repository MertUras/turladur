/*
  Warnings:

  - You are about to drop the column `certified` on the `tour_operators` table. All the data in the column will be lost.
  - You are about to drop the column `contactEmail` on the `tour_operators` table. All the data in the column will be lost.
  - You are about to drop the column `contactPhone` on the `tour_operators` table. All the data in the column will be lost.
  - You are about to drop the column `experienceYears` on the `tour_operators` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `tour_operators` table. All the data in the column will be lost.
  - You are about to drop the column `reviewCount` on the `tour_operators` table. All the data in the column will be lost.
  - You are about to drop the column `socialMedia` on the `tour_operators` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PartnerStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "tours" DROP CONSTRAINT "tours_tourOperatorId_fkey";

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "partnerId" TEXT;

-- AlterTable
ALTER TABLE "tour_operators" DROP COLUMN "certified",
DROP COLUMN "contactEmail",
DROP COLUMN "contactPhone",
DROP COLUMN "experienceYears",
DROP COLUMN "rating",
DROP COLUMN "reviewCount",
DROP COLUMN "socialMedia";

-- AlterTable
ALTER TABLE "tours" ADD COLUMN     "partnerId" TEXT,
ALTER COLUMN "tourOperatorId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "partners" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "country" TEXT,
    "website" TEXT,
    "logo" TEXT,
    "description" TEXT,
    "status" "PartnerStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "partners_email_key" ON "partners"("email");

-- AddForeignKey
ALTER TABLE "tours" ADD CONSTRAINT "tours_tourOperatorId_fkey" FOREIGN KEY ("tourOperatorId") REFERENCES "tour_operators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tours" ADD CONSTRAINT "tours_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE SET NULL ON UPDATE CASCADE;
