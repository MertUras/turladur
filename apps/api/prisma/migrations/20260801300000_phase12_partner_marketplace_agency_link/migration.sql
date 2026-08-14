-- Faz 12 soft contract: Partner.marketplaceAgencyId → Agency
ALTER TABLE "identity"."Partner"
  ADD COLUMN IF NOT EXISTS "marketplaceAgencyId" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "Partner_marketplaceAgencyId_key"
  ON "identity"."Partner"("marketplaceAgencyId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Partner_marketplaceAgencyId_fkey'
  ) THEN
    ALTER TABLE "identity"."Partner"
      ADD CONSTRAINT "Partner_marketplaceAgencyId_fkey"
      FOREIGN KEY ("marketplaceAgencyId") REFERENCES "identity"."Agency"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
