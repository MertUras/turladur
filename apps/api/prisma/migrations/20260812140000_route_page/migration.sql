-- Curated route SEO/copy overlay. Missing row = catalog defaults (fail-open).

CREATE TABLE IF NOT EXISTS "content"."RoutePage" (
    "id" TEXT NOT NULL,
    "routeKey" VARCHAR(64) NOT NULL,
    "seoTitle" VARCHAR(120),
    "seoDescription" VARCHAR(320),
    "summary" VARCHAR(500),
    "body" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "RoutePage_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "RoutePage_routeKey_key" ON "content"."RoutePage"("routeKey");
CREATE INDEX IF NOT EXISTS "RoutePage_deletedAt_idx" ON "content"."RoutePage"("deletedAt");
