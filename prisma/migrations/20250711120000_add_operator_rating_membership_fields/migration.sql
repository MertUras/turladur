-- CreateEnum
CREATE TYPE "MembershipTier" AS ENUM ('BRONZE', 'SILVER', 'GOLD');

-- AlterTable
ALTER TABLE "tour_operators" ADD COLUMN     "reviewCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "membershipTier" "MembershipTier" NOT NULL DEFAULT 'BRONZE';

-- AlterTable
ALTER TABLE "experience_operators" ADD COLUMN     "rating" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "reviewCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "membershipTier" "MembershipTier" NOT NULL DEFAULT 'BRONZE';
