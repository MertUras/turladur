/*
  Warnings:

  - You are about to drop the column `approved` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the `Certification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CompanyInfo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Statistic` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Timeline` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "comments" DROP COLUMN "approved";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "image",
ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "excerpt" TEXT,
ADD COLUMN     "publishedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "date",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "experienceId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "comment" DROP NOT NULL;

-- DropTable
DROP TABLE "Certification";

-- DropTable
DROP TABLE "CompanyInfo";

-- DropTable
DROP TABLE "Statistic";

-- DropTable
DROP TABLE "Timeline";

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "experiences"("id") ON DELETE SET NULL ON UPDATE CASCADE;
