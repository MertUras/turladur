-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "review";
CREATE SCHEMA IF NOT EXISTS "notification";

-- AlterTable Partner ratings
ALTER TABLE "identity"."Partner"
ADD COLUMN IF NOT EXISTS "averageRating" DECIMAL(3,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "reviewCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable Tour ratings
ALTER TABLE "catalog"."Tour"
ADD COLUMN IF NOT EXISTS "averageRating" DECIMAL(3,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "reviewCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable Review
CREATE TABLE "review"."Review" (
    "id" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "photoUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "partnerReply" TEXT,
    "partnerRepliedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Review_reservationId_key" ON "review"."Review"("reservationId");
CREATE INDEX "Review_tourId_idx" ON "review"."Review"("tourId");
CREATE INDEX "Review_partnerId_idx" ON "review"."Review"("partnerId");
CREATE INDEX "Review_userId_idx" ON "review"."Review"("userId");
CREATE INDEX "Review_rating_idx" ON "review"."Review"("rating");
CREATE INDEX "Review_deletedAt_idx" ON "review"."Review"("deletedAt");

-- CreateTable Notification
CREATE TABLE "notification"."Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" VARCHAR(64) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "body" TEXT NOT NULL,
    "data" JSONB,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Notification_userId_readAt_idx" ON "notification"."Notification"("userId", "readAt");
CREATE INDEX "Notification_userId_createdAt_idx" ON "notification"."Notification"("userId", "createdAt");
