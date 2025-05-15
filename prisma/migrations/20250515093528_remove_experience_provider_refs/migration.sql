/*
  Warnings:

  - You are about to drop the column `experienceProviderId` on the `experiences` table. All the data in the column will be lost.
  - You are about to drop the `experience_providers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "experience_providers" DROP CONSTRAINT "experience_providers_userId_fkey";

-- DropForeignKey
ALTER TABLE "experiences" DROP CONSTRAINT "experiences_experienceProviderId_fkey";

-- AlterTable
ALTER TABLE "experiences" DROP COLUMN "experienceProviderId";

-- DropTable
DROP TABLE "experience_providers";
