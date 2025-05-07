/*
  Warnings:

  - You are about to drop the column `status` on the `tours` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `tour_operators` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `tour_operators` will be added. If there are existing duplicate values, this will fail.
  - Made the column `email` on table `tour_operators` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "tour_operators" DROP CONSTRAINT "tour_operators_userId_fkey";

-- AlterTable
ALTER TABLE "tour_operators" ALTER COLUMN "email" SET NOT NULL;

-- AlterTable
ALTER TABLE "tours" DROP COLUMN "status";

-- CreateTable
CREATE TABLE "sub_users" (
    "id" TEXT NOT NULL,
    "tourOperatorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "permissions" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sub_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sub_users_tourOperatorId_email_key" ON "sub_users"("tourOperatorId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "tour_operators_userId_key" ON "tour_operators"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "tour_operators_email_key" ON "tour_operators"("email");

-- AddForeignKey
ALTER TABLE "tour_operators" ADD CONSTRAINT "tour_operators_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_users" ADD CONSTRAINT "sub_users_tourOperatorId_fkey" FOREIGN KEY ("tourOperatorId") REFERENCES "tour_operators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
