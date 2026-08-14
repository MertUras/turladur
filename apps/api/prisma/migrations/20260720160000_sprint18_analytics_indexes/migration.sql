CREATE SCHEMA IF NOT EXISTS "analytics";

CREATE TABLE "analytics"."SearchQueryLog" (
    "id" TEXT NOT NULL,
    "query" VARCHAR(500) NOT NULL,
    "category" VARCHAR(64),
    "resultCount" INTEGER NOT NULL DEFAULT 0,
    "cacheHit" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchQueryLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "SearchQueryLog_createdAt_idx" ON "analytics"."SearchQueryLog"("createdAt");
CREATE INDEX "SearchQueryLog_query_idx" ON "analytics"."SearchQueryLog"("query");

CREATE INDEX "Reservation_partnerId_status_createdAt_idx" ON "booking"."Reservation"("partnerId", "status", "createdAt");
