-- AlterTable
ALTER TABLE "identity"."Partner" ADD COLUMN "verificationToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Partner_verificationToken_key" ON "identity"."Partner"("verificationToken");
