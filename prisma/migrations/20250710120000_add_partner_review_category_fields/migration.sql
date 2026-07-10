-- AlterTable
ALTER TABLE "partner_reviews" ADD COLUMN IF NOT EXISTS "guideRating" INTEGER;
ALTER TABLE "partner_reviews" ADD COLUMN IF NOT EXISTS "operatorRating" INTEGER;
ALTER TABLE "partner_reviews" ADD COLUMN IF NOT EXISTS "routeRating" INTEGER;
ALTER TABLE "partner_reviews" ADD COLUMN IF NOT EXISTS "foodRating" INTEGER;
ALTER TABLE "partner_reviews" ADD COLUMN IF NOT EXISTS "hotelRating" INTEGER;
ALTER TABLE "partner_reviews" ADD COLUMN IF NOT EXISTS "transportRating" INTEGER;
ALTER TABLE "partner_reviews" ADD COLUMN IF NOT EXISTS "guideFeedback" TEXT;
ALTER TABLE "partner_reviews" ADD COLUMN IF NOT EXISTS "operatorFeedback" TEXT;
ALTER TABLE "partner_reviews" ADD COLUMN IF NOT EXISTS "routeFeedback" TEXT;
ALTER TABLE "partner_reviews" ADD COLUMN IF NOT EXISTS "foodFeedback" TEXT;
ALTER TABLE "partner_reviews" ADD COLUMN IF NOT EXISTS "hotelFeedback" TEXT;
ALTER TABLE "partner_reviews" ADD COLUMN IF NOT EXISTS "transportFeedback" TEXT;
