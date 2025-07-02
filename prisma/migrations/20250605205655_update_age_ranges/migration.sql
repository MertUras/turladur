-- Yaş aralıkları tablosunu güncelle
ALTER TABLE "tour_date_age_ranges" DROP COLUMN IF EXISTS "description";
ALTER TABLE "tour_date_age_ranges" ADD COLUMN IF NOT EXISTS "maxAge" INTEGER;

-- Yaş aralıkları için unique constraint ekle
-- ALTER TABLE "tour_date_age_ranges" DROP CONSTRAINT IF EXISTS "unique_age_range_per_tour_date";
-- ALTER TABLE "tour_date_age_ranges" ADD CONSTRAINT "unique_age_range_per_tour_date" UNIQUE ("tourDateId", "minAge", "maxAge");

-- Yaş aralıkları için check constraint ekle
ALTER TABLE "tour_date_age_ranges" DROP CONSTRAINT IF EXISTS "valid_age_range";
ALTER TABLE "tour_date_age_ranges" ADD CONSTRAINT "valid_age_range" CHECK ("minAge" >= 0 AND ("maxAge" IS NULL OR "maxAge" > "minAge")); 