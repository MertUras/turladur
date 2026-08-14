-- CreateEnum
CREATE TYPE "identity"."PartnerCapability" AS ENUM ('TOURS', 'EXPERIENCES', 'HOTELS');

-- CreateEnum
CREATE TYPE "identity"."MembershipTier" AS ENUM ('BRONZE', 'SILVER', 'GOLD');

-- AlterTable Partner — aktiviteci / tur operatörü ayrımı (tek tablo, ayrı kayıt + dashboard)
ALTER TABLE "identity"."Partner"
  ADD COLUMN "capabilities" "identity"."PartnerCapability"[] NOT NULL DEFAULT ARRAY[]::"identity"."PartnerCapability"[],
  ADD COLUMN "membershipTier" "identity"."MembershipTier" NOT NULL DEFAULT 'BRONZE',
  ADD COLUMN "address" TEXT,
  ADD COLUMN "city" TEXT,
  ADD COLUMN "country" TEXT,
  ADD COLUMN "website" TEXT,
  ADD COLUMN "logo" TEXT,
  ADD COLUMN "license" TEXT;

-- CreateIndex
CREATE INDEX "Partner_membershipTier_idx" ON "identity"."Partner"("membershipTier");
