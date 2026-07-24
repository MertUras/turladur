-- Tour search filter parity (featured flag)
ALTER TABLE "catalog"."Tour"
  ADD COLUMN IF NOT EXISTS "featured" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS "Tour_featured_status_idx"
  ON "catalog"."Tour"("featured", "status");
