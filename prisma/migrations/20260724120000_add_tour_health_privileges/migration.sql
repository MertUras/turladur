-- AlterTable
ALTER TABLE "tours" ADD COLUMN IF NOT EXISTS "healthPrivileges" JSONB NOT NULL DEFAULT '[]';
