-- AlterTable
ALTER TABLE "tours" ALTER COLUMN "status" SET DEFAULT 'draft';

-- DropEnum
DROP TYPE "TourStatus";
