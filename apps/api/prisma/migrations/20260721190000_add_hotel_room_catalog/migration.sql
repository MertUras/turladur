-- CreateEnum
CREATE TYPE "catalog"."HotelType" AS ENUM (
  'HOTEL',
  'BOUTIQUE_HOTEL',
  'RESORT',
  'HOSTEL',
  'APARTMENT',
  'VILLA',
  'GUESTHOUSE'
);

-- CreateTable
CREATE TABLE "catalog"."Hotel" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(220) NOT NULL,
    "description" TEXT,
    "address" TEXT,
    "city" VARCHAR(120) NOT NULL,
    "country" VARCHAR(120) NOT NULL DEFAULT 'Türkiye',
    "postalCode" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "stars" INTEGER,
    "type" "catalog"."HotelType" NOT NULL DEFAULT 'HOTEL',
    "amenities" JSONB NOT NULL DEFAULT '{}',
    "images" JSONB NOT NULL DEFAULT '[]',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "checkInTime" TEXT,
    "checkOutTime" TEXT,
    "partnerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Hotel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog"."Room" (
    "id" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "type" TEXT,
    "capacity" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "discount" DECIMAL(10,2),
    "size" DOUBLE PRECISION,
    "bedType" TEXT,
    "images" JSONB NOT NULL DEFAULT '[]',
    "amenities" JSONB NOT NULL DEFAULT '{}',
    "available" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Hotel_slug_key" ON "catalog"."Hotel"("slug");

-- CreateIndex
CREATE INDEX "Hotel_partnerId_idx" ON "catalog"."Hotel"("partnerId");

-- CreateIndex
CREATE INDEX "Hotel_city_idx" ON "catalog"."Hotel"("city");

-- CreateIndex
CREATE INDEX "Hotel_type_idx" ON "catalog"."Hotel"("type");

-- CreateIndex
CREATE INDEX "Hotel_deletedAt_idx" ON "catalog"."Hotel"("deletedAt");

-- CreateIndex
CREATE INDEX "Room_hotelId_idx" ON "catalog"."Room"("hotelId");

-- CreateIndex
CREATE INDEX "Room_available_idx" ON "catalog"."Room"("available");

-- CreateIndex
CREATE INDEX "Room_deletedAt_idx" ON "catalog"."Room"("deletedAt");

-- AddForeignKey
ALTER TABLE "catalog"."Hotel"
  ADD CONSTRAINT "Hotel_partnerId_fkey"
  FOREIGN KEY ("partnerId") REFERENCES "identity"."Partner"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog"."Room"
  ADD CONSTRAINT "Room_hotelId_fkey"
  FOREIGN KEY ("hotelId") REFERENCES "catalog"."Hotel"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
