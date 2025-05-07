/*
  Warnings:

  - The `status` column on the `tours` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TourStatus" AS ENUM ('active', 'draft', 'completed', 'cancelled');

-- AlterTable
ALTER TABLE "tours" DROP COLUMN "status",
ADD COLUMN     "status" "TourStatus" NOT NULL DEFAULT 'active';
