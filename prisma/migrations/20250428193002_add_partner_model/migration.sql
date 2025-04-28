-- AlterTable
ALTER TABLE "partners" ADD COLUMN     "verificationToken" TEXT,
ADD COLUMN     "verificationTokenExpires" TIMESTAMP(3),
ADD COLUMN     "verifiedAt" TIMESTAMP(3);
