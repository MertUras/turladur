-- Faz 6: Review expand + TourMetrics + Outbox + Tag/TourTag/PostTag
-- Neon yok. UI / Cloudflare dokunulmaz.

CREATE SCHEMA IF NOT EXISTS outbox;

DO $$ BEGIN
  ALTER TYPE "review"."ReviewTargetType" ADD VALUE IF NOT EXISTS 'AGENCY';
EXCEPTION WHEN others THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TYPE "review"."ReviewTargetType" ADD VALUE IF NOT EXISTS 'GUIDE';
EXCEPTION WHEN others THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TYPE "review"."ReviewTargetType" ADD VALUE IF NOT EXISTS 'BUS_COMPANY';
EXCEPTION WHEN others THEN NULL;
END $$;

ALTER TABLE "review"."Review" ADD COLUMN IF NOT EXISTS "agencyId" TEXT;
ALTER TABLE "review"."Review" ADD COLUMN IF NOT EXISTS "guideId" TEXT;
ALTER TABLE "review"."Review" ADD COLUMN IF NOT EXISTS "busCompanyId" TEXT;
ALTER TABLE "review"."Review" ADD COLUMN IF NOT EXISTS "accommodationRating" INTEGER;
ALTER TABLE "review"."Review" ADD COLUMN IF NOT EXISTS "guideFeedback" TEXT;
ALTER TABLE "review"."Review" ADD COLUMN IF NOT EXISTS "transportFeedback" TEXT;
ALTER TABLE "review"."Review" ADD COLUMN IF NOT EXISTS "accommodationFeedback" TEXT;
ALTER TABLE "review"."Review" ADD COLUMN IF NOT EXISTS "agencyReply" TEXT;
ALTER TABLE "review"."Review" ADD COLUMN IF NOT EXISTS "agencyRepliedAt" TIMESTAMP(3);
ALTER TABLE "review"."Review" ADD COLUMN IF NOT EXISTS "version" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "review"."Review" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "review"."Review" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "review"."Review" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

CREATE INDEX IF NOT EXISTS "Review_agencyId_idx" ON "review"."Review"("agencyId");
CREATE INDEX IF NOT EXISTS "Review_guideId_idx" ON "review"."Review"("guideId");
CREATE INDEX IF NOT EXISTS "Review_busCompanyId_idx" ON "review"."Review"("busCompanyId");
CREATE INDEX IF NOT EXISTS "Review_guideRating_idx" ON "review"."Review"("guideRating");
CREATE INDEX IF NOT EXISTS "Review_transportRating_idx" ON "review"."Review"("transportRating");
CREATE INDEX IF NOT EXISTS "Review_accommodationRating_idx" ON "review"."Review"("accommodationRating");
CREATE INDEX IF NOT EXISTS "Review_tourId_deletedAt_idx" ON "review"."Review"("tourId", "deletedAt");

CREATE TABLE IF NOT EXISTS "review"."TourMetrics" (
    "id" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "averageRating" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "averageGuideRating" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "averageTransportRating" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "averageAccommodationRating" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "averageOperatorRating" DECIMAL(3,2),
    "averageRouteRating" DECIMAL(3,2),
    "averageFoodRating" DECIMAL(3,2),
    "lastReviewAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "TourMetrics_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "TourMetrics_tourId_key" ON "review"."TourMetrics"("tourId");
CREATE INDEX IF NOT EXISTS "TourMetrics_averageRating_idx" ON "review"."TourMetrics"("averageRating");
CREATE INDEX IF NOT EXISTS "TourMetrics_averageGuideRating_idx" ON "review"."TourMetrics"("averageGuideRating");
CREATE INDEX IF NOT EXISTS "TourMetrics_averageTransportRating_idx" ON "review"."TourMetrics"("averageTransportRating");
CREATE INDEX IF NOT EXISTS "TourMetrics_averageAccommodationRating_idx" ON "review"."TourMetrics"("averageAccommodationRating");
CREATE INDEX IF NOT EXISTS "TourMetrics_reviewCount_idx" ON "review"."TourMetrics"("reviewCount");
CREATE INDEX IF NOT EXISTS "TourMetrics_avg_triple_idx"
  ON "review"."TourMetrics"("averageGuideRating", "averageTransportRating", "averageAccommodationRating");
CREATE INDEX IF NOT EXISTS "TourMetrics_deletedAt_idx" ON "review"."TourMetrics"("deletedAt");

DO $$ BEGIN
  ALTER TABLE "review"."TourMetrics"
    ADD CONSTRAINT "TourMetrics_tourId_fkey"
    FOREIGN KEY ("tourId") REFERENCES "catalog"."Tour"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "catalog"."TagKind" AS ENUM ('DESTINATION', 'TOUR_CATEGORY', 'THEME', 'GENERIC');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "catalog"."Tag" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "slug" VARCHAR(140) NOT NULL,
    "kind" "catalog"."TagKind" NOT NULL DEFAULT 'GENERIC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Tag_slug_key" ON "catalog"."Tag"("slug");
CREATE INDEX IF NOT EXISTS "Tag_kind_deletedAt_idx" ON "catalog"."Tag"("kind", "deletedAt");
CREATE INDEX IF NOT EXISTS "Tag_deletedAt_idx" ON "catalog"."Tag"("deletedAt");

CREATE TABLE IF NOT EXISTS "catalog"."TourTag" (
    "tourId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    CONSTRAINT "TourTag_pkey" PRIMARY KEY ("tourId","tagId")
);

CREATE INDEX IF NOT EXISTS "TourTag_tagId_idx" ON "catalog"."TourTag"("tagId");

DO $$ BEGIN
  ALTER TABLE "catalog"."TourTag"
    ADD CONSTRAINT "TourTag_tourId_fkey"
    FOREIGN KEY ("tourId") REFERENCES "catalog"."Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TABLE "catalog"."TourTag"
    ADD CONSTRAINT "TourTag_tagId_fkey"
    FOREIGN KEY ("tagId") REFERENCES "catalog"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "content"."PostTag" (
    "postId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    CONSTRAINT "PostTag_pkey" PRIMARY KEY ("postId","tagId")
);

CREATE INDEX IF NOT EXISTS "PostTag_tagId_idx" ON "content"."PostTag"("tagId");

DO $$ BEGIN
  ALTER TABLE "content"."PostTag"
    ADD CONSTRAINT "PostTag_postId_fkey"
    FOREIGN KEY ("postId") REFERENCES "content"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TABLE "content"."PostTag"
    ADD CONSTRAINT "PostTag_tagId_fkey"
    FOREIGN KEY ("tagId") REFERENCES "catalog"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "outbox"."OutboxStatus" AS ENUM ('PENDING', 'PROCESSING', 'PROCESSED', 'FAILED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "outbox"."OutboxEvent" (
    "id" TEXT NOT NULL,
    "aggregateType" VARCHAR(64) NOT NULL,
    "aggregateId" VARCHAR(64) NOT NULL,
    "eventType" VARCHAR(96) NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "outbox"."OutboxStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "availableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "OutboxEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "OutboxEvent_status_availableAt_idx"
  ON "outbox"."OutboxEvent"("status", "availableAt");
CREATE INDEX IF NOT EXISTS "OutboxEvent_aggregateType_aggregateId_idx"
  ON "outbox"."OutboxEvent"("aggregateType", "aggregateId");
CREATE INDEX IF NOT EXISTS "OutboxEvent_eventType_createdAt_idx"
  ON "outbox"."OutboxEvent"("eventType", "createdAt");
CREATE INDEX IF NOT EXISTS "OutboxEvent_deletedAt_idx" ON "outbox"."OutboxEvent"("deletedAt");
