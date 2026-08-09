-- Faz 3: hold 10dk, Guest, Extra, Voucher, Invoice, EXPIRED
-- Neon yok. UI / Cloudflare dokunulmaz.

-- BookingStatus EXPIRED
ALTER TYPE "booking"."BookingStatus" ADD VALUE IF NOT EXISTS 'EXPIRED';
ALTER TYPE "booking"."BookingStatus" ADD VALUE IF NOT EXISTS 'PENDING_PAYMENT';

-- PaymentMethod enum (booking schema — Prisma cross-ref)
DO $$ BEGIN
  CREATE TYPE "booking"."PaymentMethod" AS ENUM ('CARD', 'BANK_TRANSFER', 'WALLET', 'OTHER');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Invoice enums
DO $$ BEGIN
  CREATE TYPE "payment"."InvoiceProvider" AS ENUM ('MOCK', 'PARASUT', 'LOGO', 'UYUMSOFT', 'OTHER');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE TYPE "payment"."InvoiceStatus" AS ENUM ('DRAFT', 'QUEUED', 'ISSUED', 'FAILED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE TYPE "payment"."RefundStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Reservation expand
ALTER TABLE "booking"."Reservation" ADD COLUMN IF NOT EXISTS "boardingPickupPointId" TEXT;
ALTER TABLE "booking"."Reservation" ADD COLUMN IF NOT EXISTS "holdExpiresAt" TIMESTAMP(3);
ALTER TABLE "booking"."Reservation" ADD COLUMN IF NOT EXISTS "heldPartySize" INTEGER;
ALTER TABLE "booking"."Reservation" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "booking"."Reservation" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "booking"."Reservation" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

-- paymentMethod: String → enum (best-effort)
ALTER TABLE "booking"."Reservation" ALTER COLUMN "paymentMethod" DROP DEFAULT;
ALTER TABLE "booking"."Reservation" ALTER COLUMN "guests" DROP NOT NULL;

DO $$ BEGIN
  ALTER TABLE "booking"."Reservation"
    ALTER COLUMN "paymentMethod" TYPE "booking"."PaymentMethod"
    USING (
      CASE
        WHEN "paymentMethod" IN ('CARD', 'BANK_TRANSFER', 'WALLET', 'OTHER')
          THEN "paymentMethod"::"booking"."PaymentMethod"
        ELSE NULL
      END
    );
EXCEPTION WHEN others THEN
  -- db push may already have enum column
  NULL;
END $$;

ALTER TABLE "booking"."Reservation" ALTER COLUMN "status" SET DEFAULT 'PENDING_PAYMENT';

CREATE INDEX IF NOT EXISTS "Reservation_status_holdExpiresAt_idx"
  ON "booking"."Reservation"("status", "holdExpiresAt");
CREATE INDEX IF NOT EXISTS "Reservation_agencyId_status_createdAt_idx"
  ON "booking"."Reservation"("agencyId", "status", "createdAt");

DO $$ BEGIN
  ALTER TABLE "booking"."Reservation"
    ADD CONSTRAINT "Reservation_boardingPickupPointId_fkey"
    FOREIGN KEY ("boardingPickupPointId") REFERENCES "catalog"."TourPickupPoint"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ReservationGuest
CREATE TABLE IF NOT EXISTS "booking"."ReservationGuest" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "fullName" VARCHAR(200) NOT NULL,
    "identityNumber" TEXT NOT NULL,
    "birthDate" DATE,
    "isChild" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "ReservationGuest_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ReservationGuest_reservationId_idx"
  ON "booking"."ReservationGuest"("reservationId");
DO $$ BEGIN
  ALTER TABLE "booking"."ReservationGuest"
    ADD CONSTRAINT "ReservationGuest_reservationId_fkey"
    FOREIGN KEY ("reservationId") REFERENCES "booking"."Reservation"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ReservationExtra
CREATE TABLE IF NOT EXISTS "booking"."ReservationExtra" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "tourExtraId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "ReservationExtra_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "ReservationExtra_reservationId_tourExtraId_key"
  ON "booking"."ReservationExtra"("reservationId", "tourExtraId");
CREATE INDEX IF NOT EXISTS "ReservationExtra_reservationId_idx"
  ON "booking"."ReservationExtra"("reservationId");
CREATE INDEX IF NOT EXISTS "ReservationExtra_tourExtraId_idx"
  ON "booking"."ReservationExtra"("tourExtraId");
DO $$ BEGIN
  ALTER TABLE "booking"."ReservationExtra"
    ADD CONSTRAINT "ReservationExtra_reservationId_fkey"
    FOREIGN KEY ("reservationId") REFERENCES "booking"."Reservation"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TABLE "booking"."ReservationExtra"
    ADD CONSTRAINT "ReservationExtra_tourExtraId_fkey"
    FOREIGN KEY ("tourExtraId") REFERENCES "catalog"."TourExtra"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Voucher
CREATE TABLE IF NOT EXISTS "booking"."Voucher" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "code" VARCHAR(40) NOT NULL,
    "qrPayload" TEXT,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "Voucher_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Voucher_reservationId_key" ON "booking"."Voucher"("reservationId");
CREATE UNIQUE INDEX IF NOT EXISTS "Voucher_code_key" ON "booking"."Voucher"("code");
DO $$ BEGIN
  ALTER TABLE "booking"."Voucher"
    ADD CONSTRAINT "Voucher_reservationId_fkey"
    FOREIGN KEY ("reservationId") REFERENCES "booking"."Reservation"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- PaymentTransaction method + deletedAt
ALTER TABLE "payment"."PaymentTransaction" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);
ALTER TABLE "payment"."PaymentTransaction" ADD COLUMN IF NOT EXISTS "method" "booking"."PaymentMethod" DEFAULT 'CARD';

-- Refund
CREATE TABLE IF NOT EXISTS "payment"."Refund" (
    "id" TEXT NOT NULL,
    "paymentTransactionId" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "status" "payment"."RefundStatus" NOT NULL DEFAULT 'PENDING',
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "Refund_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Refund_reservationId_idx" ON "payment"."Refund"("reservationId");
DO $$ BEGIN
  ALTER TABLE "payment"."Refund"
    ADD CONSTRAINT "Refund_paymentTransactionId_fkey"
    FOREIGN KEY ("paymentTransactionId") REFERENCES "payment"."PaymentTransaction"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Invoice
CREATE TABLE IF NOT EXISTS "payment"."Invoice" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "paymentTransactionId" TEXT,
    "userId" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "provider" "payment"."InvoiceProvider" NOT NULL DEFAULT 'MOCK',
    "status" "payment"."InvoiceStatus" NOT NULL DEFAULT 'QUEUED',
    "externalId" TEXT,
    "invoiceNumber" TEXT,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "buyerSnapshot" JSONB NOT NULL,
    "sellerSnapshot" JSONB NOT NULL,
    "linesSnapshot" JSONB NOT NULL,
    "pdfUrl" TEXT,
    "rawResponse" JSONB,
    "issuedAt" TIMESTAMP(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Invoice_reservationId_idx" ON "payment"."Invoice"("reservationId");
CREATE INDEX IF NOT EXISTS "Invoice_status_createdAt_idx" ON "payment"."Invoice"("status", "createdAt");
CREATE INDEX IF NOT EXISTS "Invoice_provider_idx" ON "payment"."Invoice"("provider");
CREATE INDEX IF NOT EXISTS "Invoice_externalId_idx" ON "payment"."Invoice"("externalId");
DO $$ BEGIN
  ALTER TABLE "payment"."Invoice"
    ADD CONSTRAINT "Invoice_paymentTransactionId_fkey"
    FOREIGN KEY ("paymentTransactionId") REFERENCES "payment"."PaymentTransaction"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
