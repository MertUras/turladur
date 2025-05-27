-- AlterTable
ALTER TABLE "tours" ADD COLUMN     "availableDates" TIMESTAMP(3)[] DEFAULT ARRAY[]::TIMESTAMP(3)[];
