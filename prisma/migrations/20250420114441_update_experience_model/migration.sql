/*
  Warnings:

  - You are about to drop the column `city` on the `experiences` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `experiences` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `experiences` table. All the data in the column will be lost.
  - You are about to drop the column `exclusions` on the `experiences` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `experiences` table. All the data in the column will be lost.
  - You are about to drop the column `inclusions` on the `experiences` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `experiences` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `experiences` table. All the data in the column will be lost.
  - You are about to drop the column `maxParticipants` on the `experiences` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `experiences` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `experiences` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `experienceId` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `reviews` table. All the data in the column will be lost.
  - Added the required column `imageUrl` to the `experiences` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longDescription` to the `experiences` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `experiences` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `experiences` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `experiences` required. This step will fail if there are existing NULL values in that column.
  - Made the column `category` on table `experiences` required. This step will fail if there are existing NULL values in that column.
  - Made the column `location` on table `experiences` required. This step will fail if there are existing NULL values in that column.
  - Made the column `comment` on table `reviews` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "experiences" DROP CONSTRAINT "experiences_providerId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_experienceId_fkey";

-- AlterTable
ALTER TABLE "experiences" DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "discount",
DROP COLUMN "exclusions",
DROP COLUMN "images",
DROP COLUMN "inclusions",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "maxParticipants",
DROP COLUMN "name",
DROP COLUMN "providerId",
ADD COLUMN     "gallery" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "highlights" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "included" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "longDescription" TEXT NOT NULL,
ADD COLUMN     "notIncluded" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "popularityRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "reviewCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "schedule" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "category" SET NOT NULL,
ALTER COLUMN "duration" SET DATA TYPE TEXT,
ALTER COLUMN "location" SET NOT NULL;

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "createdAt",
DROP COLUMN "experienceId",
DROP COLUMN "updatedAt",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "comment" SET NOT NULL;

-- CreateTable
CREATE TABLE "activity_reviews" (
    "id" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "comment" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "experienceId" TEXT NOT NULL,

    CONSTRAINT "activity_reviews_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "experiences" ADD CONSTRAINT "experiences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_reviews" ADD CONSTRAINT "activity_reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_reviews" ADD CONSTRAINT "activity_reviews_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "experiences"("id") ON DELETE CASCADE ON UPDATE CASCADE;
