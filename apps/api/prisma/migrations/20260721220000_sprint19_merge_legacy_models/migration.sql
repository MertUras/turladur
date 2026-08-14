-- Sprint 19.5–19.10: Agency, SubUser, content, Reservation genişletme, Review birleşimi, enum’lar

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "content";

-- ─── identity: User.permissions + Agency + SubUser ───

ALTER TABLE "identity"."User" ADD COLUMN IF NOT EXISTS "permissions" JSONB;

CREATE TYPE "identity"."AgencyStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');

CREATE TABLE "identity"."Agency" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "address" TEXT,
    "city" TEXT,
    "country" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "logo" TEXT,
    "license" TEXT,
    "status" "identity"."AgencyStatus" NOT NULL DEFAULT 'PENDING',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Agency_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "identity"."SubUser" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "userId" TEXT,
    "name" VARCHAR(200) NOT NULL,
    "email" TEXT NOT NULL,
    "role" VARCHAR(40) NOT NULL DEFAULT 'USER',
    "permissions" JSONB NOT NULL DEFAULT '{}',
    "status" VARCHAR(40) NOT NULL DEFAULT 'ACTIVE',
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SubUser_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Agency_userId_idx" ON "identity"."Agency"("userId");
CREATE INDEX "Agency_status_idx" ON "identity"."Agency"("status");
CREATE INDEX "Agency_deletedAt_idx" ON "identity"."Agency"("deletedAt");

CREATE UNIQUE INDEX "SubUser_partnerId_email_key" ON "identity"."SubUser"("partnerId", "email");
CREATE INDEX "SubUser_partnerId_idx" ON "identity"."SubUser"("partnerId");
CREATE INDEX "SubUser_userId_idx" ON "identity"."SubUser"("userId");
CREATE INDEX "SubUser_deletedAt_idx" ON "identity"."SubUser"("deletedAt");

ALTER TABLE "identity"."Agency"
  ADD CONSTRAINT "Agency_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "identity"."User"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "identity"."SubUser"
  ADD CONSTRAINT "SubUser_partnerId_fkey"
  FOREIGN KEY ("partnerId") REFERENCES "identity"."Partner"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- ─── booking: enum genişletme + Reservation alanları ───

ALTER TYPE "booking"."BookingStatus" ADD VALUE IF NOT EXISTS 'PENDING_PAYMENT';
ALTER TYPE "booking"."BookingStatus" ADD VALUE IF NOT EXISTS 'SUSPENDED';

CREATE TYPE "booking"."ReservationPaymentStatus" AS ENUM ('UNPAID', 'PARTIALLY_PAID', 'PAID', 'REFUNDED');

ALTER TABLE "booking"."Reservation"
  ALTER COLUMN "tourId" DROP NOT NULL,
  ALTER COLUMN "tourDateId" DROP NOT NULL;

ALTER TABLE "booking"."Reservation"
  ADD COLUMN IF NOT EXISTS "hotelId" TEXT,
  ADD COLUMN IF NOT EXISTS "roomId" TEXT,
  ADD COLUMN IF NOT EXISTS "experienceId" TEXT,
  ADD COLUMN IF NOT EXISTS "activityDateId" TEXT,
  ADD COLUMN IF NOT EXISTS "agencyId" TEXT,
  ADD COLUMN IF NOT EXISTS "paymentStatus" "booking"."ReservationPaymentStatus" NOT NULL DEFAULT 'UNPAID',
  ADD COLUMN IF NOT EXISTS "paymentMethod" TEXT,
  ADD COLUMN IF NOT EXISTS "specialRequests" TEXT,
  ADD COLUMN IF NOT EXISTS "metadata" JSONB,
  ADD COLUMN IF NOT EXISTS "startDate" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "endDate" TIMESTAMP(3);

CREATE INDEX IF NOT EXISTS "Reservation_tourId_idx" ON "booking"."Reservation"("tourId");
CREATE INDEX IF NOT EXISTS "Reservation_hotelId_idx" ON "booking"."Reservation"("hotelId");
CREATE INDEX IF NOT EXISTS "Reservation_experienceId_idx" ON "booking"."Reservation"("experienceId");
CREATE INDEX IF NOT EXISTS "Reservation_activityDateId_idx" ON "booking"."Reservation"("activityDateId");

-- ─── review: hedef tür + opsiyonel ürün FK + kategori puanları ───

CREATE TYPE "review"."ReviewTargetType" AS ENUM ('TOUR', 'EXPERIENCE', 'HOTEL', 'PARTNER');

ALTER TABLE "review"."Review"
  ALTER COLUMN "tourId" DROP NOT NULL;

ALTER TABLE "review"."Review"
  ADD COLUMN IF NOT EXISTS "targetType" "review"."ReviewTargetType" NOT NULL DEFAULT 'TOUR',
  ADD COLUMN IF NOT EXISTS "experienceId" TEXT,
  ADD COLUMN IF NOT EXISTS "hotelId" TEXT,
  ADD COLUMN IF NOT EXISTS "guideRating" INTEGER,
  ADD COLUMN IF NOT EXISTS "operatorRating" INTEGER,
  ADD COLUMN IF NOT EXISTS "routeRating" INTEGER,
  ADD COLUMN IF NOT EXISTS "foodRating" INTEGER,
  ADD COLUMN IF NOT EXISTS "hotelRating" INTEGER,
  ADD COLUMN IF NOT EXISTS "transportRating" INTEGER;

CREATE INDEX IF NOT EXISTS "Review_experienceId_idx" ON "review"."Review"("experienceId");
CREATE INDEX IF NOT EXISTS "Review_hotelId_idx" ON "review"."Review"("hotelId");
CREATE INDEX IF NOT EXISTS "Review_targetType_idx" ON "review"."Review"("targetType");

-- ─── content: Post / Category / Comment ───

CREATE TABLE "content"."Category" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "slug" VARCHAR(140) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "content"."Post" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(300) NOT NULL,
    "slug" VARCHAR(320) NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "coverImage" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "content"."Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "content"."_CategoryToPost" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

CREATE UNIQUE INDEX "Category_name_key" ON "content"."Category"("name");
CREATE UNIQUE INDEX "Category_slug_key" ON "content"."Category"("slug");
CREATE INDEX "Category_deletedAt_idx" ON "content"."Category"("deletedAt");

CREATE UNIQUE INDEX "Post_slug_key" ON "content"."Post"("slug");
CREATE INDEX "Post_authorId_idx" ON "content"."Post"("authorId");
CREATE INDEX "Post_published_publishedAt_idx" ON "content"."Post"("published", "publishedAt");
CREATE INDEX "Post_deletedAt_idx" ON "content"."Post"("deletedAt");

CREATE INDEX "Comment_postId_idx" ON "content"."Comment"("postId");
CREATE INDEX "Comment_authorId_idx" ON "content"."Comment"("authorId");
CREATE INDEX "Comment_deletedAt_idx" ON "content"."Comment"("deletedAt");

CREATE UNIQUE INDEX "_CategoryToPost_AB_unique" ON "content"."_CategoryToPost"("A", "B");
CREATE INDEX "_CategoryToPost_B_index" ON "content"."_CategoryToPost"("B");

ALTER TABLE "content"."Comment"
  ADD CONSTRAINT "Comment_postId_fkey"
  FOREIGN KEY ("postId") REFERENCES "content"."Post"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "content"."_CategoryToPost"
  ADD CONSTRAINT "_CategoryToPost_A_fkey"
  FOREIGN KEY ("A") REFERENCES "content"."Category"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "content"."_CategoryToPost"
  ADD CONSTRAINT "_CategoryToPost_B_fkey"
  FOREIGN KEY ("B") REFERENCES "content"."Post"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
