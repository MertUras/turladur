-- Faz 7: AgencyCommissionRate + AgencyEarning + AgencyPayout
-- Neon yok. UI / Cloudflare dokunulmaz. AgencyBankInfo zaten Faz 1'de.

CREATE TABLE IF NOT EXISTS "payment"."AgencyCommissionRate" (
    "id" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "ratePercent" DECIMAL(5,2) NOT NULL,
    "effectiveFrom" DATE NOT NULL,
    "effectiveTo" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "AgencyCommissionRate_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "AgencyCommissionRate_agencyId_effectiveFrom_idx"
  ON "payment"."AgencyCommissionRate"("agencyId", "effectiveFrom");
CREATE INDEX IF NOT EXISTS "AgencyCommissionRate_deletedAt_idx"
  ON "payment"."AgencyCommissionRate"("deletedAt");

DO $$ BEGIN
  ALTER TABLE "payment"."AgencyCommissionRate"
    ADD CONSTRAINT "AgencyCommissionRate_agencyId_fkey"
    FOREIGN KEY ("agencyId") REFERENCES "identity"."Agency"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "payment"."AgencyPayout" (
    "id" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "status" VARCHAR(40) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "AgencyPayout_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "AgencyPayout_agencyId_status_idx"
  ON "payment"."AgencyPayout"("agencyId", "status");
CREATE INDEX IF NOT EXISTS "AgencyPayout_deletedAt_idx"
  ON "payment"."AgencyPayout"("deletedAt");

DO $$ BEGIN
  ALTER TABLE "payment"."AgencyPayout"
    ADD CONSTRAINT "AgencyPayout_agencyId_fkey"
    FOREIGN KEY ("agencyId") REFERENCES "identity"."Agency"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "payment"."AgencyEarning" (
    "id" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "grossAmount" DECIMAL(10,2) NOT NULL,
    "commissionAmount" DECIMAL(10,2) NOT NULL,
    "commissionRatePercent" DECIMAL(5,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "status" VARCHAR(40) NOT NULL,
    "payoutId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "AgencyEarning_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "AgencyEarning_reservationId_key"
  ON "payment"."AgencyEarning"("reservationId");
CREATE INDEX IF NOT EXISTS "AgencyEarning_agencyId_status_idx"
  ON "payment"."AgencyEarning"("agencyId", "status");
CREATE INDEX IF NOT EXISTS "AgencyEarning_payoutId_idx"
  ON "payment"."AgencyEarning"("payoutId");
CREATE INDEX IF NOT EXISTS "AgencyEarning_deletedAt_idx"
  ON "payment"."AgencyEarning"("deletedAt");

DO $$ BEGIN
  ALTER TABLE "payment"."AgencyEarning"
    ADD CONSTRAINT "AgencyEarning_agencyId_fkey"
    FOREIGN KEY ("agencyId") REFERENCES "identity"."Agency"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "payment"."AgencyEarning"
    ADD CONSTRAINT "AgencyEarning_reservationId_fkey"
    FOREIGN KEY ("reservationId") REFERENCES "booking"."Reservation"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "payment"."AgencyEarning"
    ADD CONSTRAINT "AgencyEarning_payoutId_fkey"
    FOREIGN KEY ("payoutId") REFERENCES "payment"."AgencyPayout"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
