/*
  Warnings:

  - You are about to drop the column `name` on the `tour_operators` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `tour_operators` will be added. If there are existing duplicate values, this will fail.
  - Made the column `email` on table `tour_operators` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "sub_users" DROP CONSTRAINT "sub_users_tourOperatorId_fkey";

-- DropIndex
DROP INDEX "tour_operators_userId_key";

-- AlterTable
ALTER TABLE "experiences" ADD COLUMN     "experienceProviderId" TEXT;

-- AlterTable
ALTER TABLE "tour_operators" DROP COLUMN "name",
ADD COLUMN     "companyName" TEXT,
ALTER COLUMN "email" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';

-- CreateTable
CREATE TABLE "experience_providers" (
    "id" TEXT NOT NULL,
    "companyName" TEXT,
    "description" TEXT,
    "address" TEXT,
    "city" TEXT,
    "country" TEXT,
    "phone" TEXT,
    "email" TEXT NOT NULL,
    "website" TEXT,
    "logo" TEXT,
    "license" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "experience_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experience_operators" (
    "id" TEXT NOT NULL,
    "companyName" TEXT,
    "description" TEXT,
    "address" TEXT,
    "city" TEXT,
    "country" TEXT,
    "phone" TEXT,
    "email" TEXT NOT NULL,
    "website" TEXT,
    "logo" TEXT,
    "license" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "experience_operators_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "experience_providers_email_key" ON "experience_providers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "experience_operators_email_key" ON "experience_operators"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tour_operators_email_key" ON "tour_operators"("email");

-- AddForeignKey
ALTER TABLE "sub_users" ADD CONSTRAINT "sub_users_tourOperatorId_fkey" FOREIGN KEY ("tourOperatorId") REFERENCES "tour_operators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiences" ADD CONSTRAINT "experiences_experienceProviderId_fkey" FOREIGN KEY ("experienceProviderId") REFERENCES "experience_providers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience_providers" ADD CONSTRAINT "experience_providers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience_operators" ADD CONSTRAINT "experience_operators_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
