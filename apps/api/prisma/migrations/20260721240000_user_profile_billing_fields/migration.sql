-- Customer profile: TC kimlik + personal address + billing address
ALTER TABLE "identity"."User"
  ADD COLUMN IF NOT EXISTS "identityNumber" TEXT,
  ADD COLUMN IF NOT EXISTS "birthDate" DATE,
  ADD COLUMN IF NOT EXISTS "address" TEXT,
  ADD COLUMN IF NOT EXISTS "billingLine1" TEXT,
  ADD COLUMN IF NOT EXISTS "billingLine2" TEXT,
  ADD COLUMN IF NOT EXISTS "billingCity" TEXT,
  ADD COLUMN IF NOT EXISTS "billingState" TEXT,
  ADD COLUMN IF NOT EXISTS "billingPostalCode" TEXT,
  ADD COLUMN IF NOT EXISTS "billingCountry" TEXT DEFAULT 'Türkiye';
