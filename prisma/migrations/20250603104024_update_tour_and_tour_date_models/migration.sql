-- AlterTable
ALTER TABLE "tour_dates" ADD COLUMN     "discount" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "tours" ADD COLUMN     "features" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "meetingPoint" TEXT,
ADD COLUMN     "meetingTime" TEXT,
ADD COLUMN     "nights" INTEGER;
