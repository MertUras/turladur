-- AlterTable
ALTER TABLE "tour_operators" ADD COLUMN     "certified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "experienceYears" INTEGER,
ADD COLUMN     "socialMedia" JSONB DEFAULT '{}';
