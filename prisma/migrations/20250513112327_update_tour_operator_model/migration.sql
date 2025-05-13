-- CreateEnum
CREATE TYPE "TourOperatorStatus" AS ENUM ('pending', 'approved', 'rejected', 'suspended');

-- DropForeignKey
ALTER TABLE "sub_users" DROP CONSTRAINT "sub_users_tourOperatorId_fkey";

-- DropIndex
DROP INDEX "tour_operators_email_key";

-- AlterTable
ALTER TABLE "agencies" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "tour_operators" ADD COLUMN     "status" "TourOperatorStatus" NOT NULL DEFAULT 'pending',
ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "tours" ADD COLUMN     "currentParticipants" INTEGER DEFAULT 0;

-- AddForeignKey
ALTER TABLE "sub_users" ADD CONSTRAINT "sub_users_tourOperatorId_fkey" FOREIGN KEY ("tourOperatorId") REFERENCES "tour_operators"("id") ON DELETE CASCADE ON UPDATE CASCADE;
