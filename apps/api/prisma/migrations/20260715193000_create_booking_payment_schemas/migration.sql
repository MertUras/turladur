CREATE SCHEMA IF NOT EXISTS "booking";
CREATE SCHEMA IF NOT EXISTS "payment";

CREATE TYPE "booking"."BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'PAYMENT_FAILED');

CREATE TABLE "booking"."Reservation" (
    "id" TEXT NOT NULL,
    "bookingNumber" VARCHAR(20) NOT NULL,
    "userId" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "tourDateId" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "status" "booking"."BookingStatus" NOT NULL DEFAULT 'PENDING',
    "adults" INTEGER NOT NULL DEFAULT 1,
    "children" INTEGER NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'TRY',
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT,
    "guests" JSONB NOT NULL,
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Reservation_bookingNumber_key" ON "booking"."Reservation"("bookingNumber");
CREATE INDEX "Reservation_userId_idx" ON "booking"."Reservation"("userId");
CREATE INDEX "Reservation_tourDateId_idx" ON "booking"."Reservation"("tourDateId");
CREATE INDEX "Reservation_partnerId_idx" ON "booking"."Reservation"("partnerId");
CREATE INDEX "Reservation_status_idx" ON "booking"."Reservation"("status");
CREATE INDEX "Reservation_deletedAt_idx" ON "booking"."Reservation"("deletedAt");

CREATE TYPE "payment"."PaymentStatus" AS ENUM ('PENDING', 'AWAITING_3DS', 'SUCCESS', 'FAILED', 'REFUNDED');
CREATE TYPE "payment"."PaymentProvider" AS ENUM ('IYZICO', 'MOCK');

CREATE TABLE "payment"."PaymentTransaction" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'TRY',
    "status" "payment"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "provider" "payment"."PaymentProvider" NOT NULL DEFAULT 'IYZICO',
    "conversationId" TEXT NOT NULL,
    "providerPaymentId" TEXT,
    "errorMessage" TEXT,
    "rawResponse" JSONB,
    "paidAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PaymentTransaction_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PaymentTransaction_conversationId_key" ON "payment"."PaymentTransaction"("conversationId");
CREATE INDEX "PaymentTransaction_reservationId_idx" ON "payment"."PaymentTransaction"("reservationId");
CREATE INDEX "PaymentTransaction_status_idx" ON "payment"."PaymentTransaction"("status");
