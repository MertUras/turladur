-- Public /activities listing cover. Missing row = disabled (live listing unchanged).

CREATE TABLE IF NOT EXISTS "content"."SitePageCover" (
    "id" TEXT NOT NULL,
    "key" VARCHAR(64) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "headline" VARCHAR(200),
    "subtitle" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SitePageCover_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "SitePageCover_key_key" ON "content"."SitePageCover"("key");
CREATE INDEX IF NOT EXISTS "SitePageCover_deletedAt_idx" ON "content"."SitePageCover"("deletedAt");
