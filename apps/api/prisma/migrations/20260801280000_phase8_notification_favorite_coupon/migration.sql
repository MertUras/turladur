-- Faz 8: Notification multi-actor · Favorite · Coupon/Campaign · SearchQueryLog userId
-- Neon yok. UI / Cloudflare dokunulmaz.

CREATE SCHEMA IF NOT EXISTS promotion;

DO $$ BEGIN
  CREATE TYPE "notification"."NotificationRecipientType" AS ENUM (
    'USER', 'AGENCY', 'AGENCY_STAFF', 'BUS_COMPANY', 'GUIDE', 'PLATFORM'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "notification"."Notification" ADD COLUMN IF NOT EXISTS "recipientType" "notification"."NotificationRecipientType";
UPDATE "notification"."Notification" SET "recipientType" = 'USER' WHERE "recipientType" IS NULL;
ALTER TABLE "notification"."Notification" ALTER COLUMN "recipientType" SET DEFAULT 'USER';
ALTER TABLE "notification"."Notification" ALTER COLUMN "recipientType" SET NOT NULL;

ALTER TABLE "notification"."Notification" ALTER COLUMN "userId" DROP NOT NULL;
ALTER TABLE "notification"."Notification" ADD COLUMN IF NOT EXISTS "agencyId" TEXT;
ALTER TABLE "notification"."Notification" ADD COLUMN IF NOT EXISTS "agencyStaffId" TEXT;
ALTER TABLE "notification"."Notification" ADD COLUMN IF NOT EXISTS "busCompanyId" TEXT;
ALTER TABLE "notification"."Notification" ADD COLUMN IF NOT EXISTS "guideId" TEXT;

CREATE INDEX IF NOT EXISTS "Notification_recipientType_readAt_idx"
  ON "notification"."Notification"("recipientType", "readAt");
CREATE INDEX IF NOT EXISTS "Notification_agencyId_idx"
  ON "notification"."Notification"("agencyId");
CREATE INDEX IF NOT EXISTS "Notification_agencyStaffId_idx"
  ON "notification"."Notification"("agencyStaffId");
CREATE INDEX IF NOT EXISTS "Notification_busCompanyId_idx"
  ON "notification"."Notification"("busCompanyId");
CREATE INDEX IF NOT EXISTS "Notification_guideId_idx"
  ON "notification"."Notification"("guideId");

CREATE TABLE IF NOT EXISTS "identity"."Favorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tourId" TEXT,
    "experienceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Favorite_userId_idx" ON "identity"."Favorite"("userId");
CREATE INDEX IF NOT EXISTS "Favorite_tourId_idx" ON "identity"."Favorite"("tourId");
CREATE INDEX IF NOT EXISTS "Favorite_experienceId_idx" ON "identity"."Favorite"("experienceId");
CREATE INDEX IF NOT EXISTS "Favorite_deletedAt_idx" ON "identity"."Favorite"("deletedAt");

CREATE UNIQUE INDEX IF NOT EXISTS "Favorite_userId_tourId_active_key"
  ON "identity"."Favorite"("userId", "tourId")
  WHERE "deletedAt" IS NULL AND "tourId" IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "Favorite_userId_experienceId_active_key"
  ON "identity"."Favorite"("userId", "experienceId")
  WHERE "deletedAt" IS NULL AND "experienceId" IS NOT NULL;

DO $$ BEGIN
  ALTER TABLE "identity"."Favorite"
    ADD CONSTRAINT "Favorite_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "identity"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TABLE "identity"."Favorite"
    ADD CONSTRAINT "Favorite_tourId_fkey"
    FOREIGN KEY ("tourId") REFERENCES "catalog"."Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TABLE "identity"."Favorite"
    ADD CONSTRAINT "Favorite_experienceId_fkey"
    FOREIGN KEY ("experienceId") REFERENCES "catalog"."Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "analytics"."SearchQueryLog" ADD COLUMN IF NOT EXISTS "userId" TEXT;
CREATE INDEX IF NOT EXISTS "SearchQueryLog_userId_idx" ON "analytics"."SearchQueryLog"("userId");

CREATE TABLE IF NOT EXISTS "promotion"."Coupon" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(40) NOT NULL,
    "discountType" VARCHAR(20) NOT NULL,
    "discountValue" DECIMAL(10,2) NOT NULL,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "maxUses" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Coupon_code_key" ON "promotion"."Coupon"("code");
CREATE INDEX IF NOT EXISTS "Coupon_isActive_deletedAt_idx" ON "promotion"."Coupon"("isActive", "deletedAt");
CREATE INDEX IF NOT EXISTS "Coupon_deletedAt_idx" ON "promotion"."Coupon"("deletedAt");

CREATE TABLE IF NOT EXISTS "promotion"."CouponUsage" (
    "id" TEXT NOT NULL,
    "couponId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reservationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CouponUsage_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "CouponUsage_couponId_userId_reservationId_key"
  ON "promotion"."CouponUsage"("couponId", "userId", "reservationId");
CREATE INDEX IF NOT EXISTS "CouponUsage_couponId_idx" ON "promotion"."CouponUsage"("couponId");
CREATE INDEX IF NOT EXISTS "CouponUsage_userId_idx" ON "promotion"."CouponUsage"("userId");

DO $$ BEGIN
  ALTER TABLE "promotion"."CouponUsage"
    ADD CONSTRAINT "CouponUsage_couponId_fkey"
    FOREIGN KEY ("couponId") REFERENCES "promotion"."Coupon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TABLE "promotion"."CouponUsage"
    ADD CONSTRAINT "CouponUsage_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "identity"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "promotion"."Campaign" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(220) NOT NULL,
    "bannerUrl" TEXT,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "payload" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Campaign_slug_key" ON "promotion"."Campaign"("slug");
CREATE INDEX IF NOT EXISTS "Campaign_isActive_deletedAt_idx" ON "promotion"."Campaign"("isActive", "deletedAt");
CREATE INDEX IF NOT EXISTS "Campaign_deletedAt_idx" ON "promotion"."Campaign"("deletedAt");
