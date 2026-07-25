-- AlterTable
ALTER TABLE "catalog"."Tour" ADD COLUMN "galleryUrls" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "catalog"."Tour" ADD COLUMN "extras" JSONB NOT NULL DEFAULT '{}';
