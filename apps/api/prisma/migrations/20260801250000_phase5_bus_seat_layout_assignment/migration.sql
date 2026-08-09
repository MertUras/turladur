-- Faz 5: BusSeatLayout + SeatAssignment (N+1)
-- Neon yok. UI / Cloudflare dokunulmaz.

CREATE TABLE IF NOT EXISTS "catalog"."BusSeatLayout" (
    "id" TEXT NOT NULL,
    "kind" "identity"."BusLayoutKind" NOT NULL,
    "agencyId" TEXT,
    "name" VARCHAR(120) NOT NULL,
    "passengerSeats" INTEGER NOT NULL,
    "crewSeats" INTEGER NOT NULL DEFAULT 1,
    "rows" INTEGER NOT NULL,
    "cols" INTEGER NOT NULL,
    "layoutJson" JSONB NOT NULL,
    "isSystem" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "BusSeatLayout_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "BusSeatLayout_kind_key"
  ON "catalog"."BusSeatLayout"("kind");
CREATE INDEX IF NOT EXISTS "BusSeatLayout_kind_idx"
  ON "catalog"."BusSeatLayout"("kind");
CREATE INDEX IF NOT EXISTS "BusSeatLayout_agencyId_idx"
  ON "catalog"."BusSeatLayout"("agencyId");
CREATE INDEX IF NOT EXISTS "BusSeatLayout_deletedAt_idx"
  ON "catalog"."BusSeatLayout"("deletedAt");

DO $$ BEGIN
  ALTER TABLE "catalog"."BusSeatLayout"
    ADD CONSTRAINT "BusSeatLayout_agencyId_fkey"
    FOREIGN KEY ("agencyId") REFERENCES "identity"."Agency"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "catalog"."TourDate"
    ADD CONSTRAINT "TourDate_busSeatLayoutId_fkey"
    FOREIGN KEY ("busSeatLayoutId") REFERENCES "catalog"."BusSeatLayout"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "booking"."SeatAssignment" (
    "id" TEXT NOT NULL,
    "tourDateId" TEXT NOT NULL,
    "seatCode" VARCHAR(16) NOT NULL,
    "reservationGuestId" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "assignedByAgencyStaffId" TEXT,
    "assignedByAgencyId" TEXT,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" VARCHAR(20) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "SeatAssignment_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "SeatAssignment_tourDateId_assignedAt_idx"
  ON "booking"."SeatAssignment"("tourDateId", "assignedAt");
CREATE INDEX IF NOT EXISTS "SeatAssignment_reservationId_idx"
  ON "booking"."SeatAssignment"("reservationId");
CREATE INDEX IF NOT EXISTS "SeatAssignment_reservationGuestId_idx"
  ON "booking"."SeatAssignment"("reservationGuestId");
CREATE INDEX IF NOT EXISTS "SeatAssignment_deletedAt_idx"
  ON "booking"."SeatAssignment"("deletedAt");

CREATE UNIQUE INDEX IF NOT EXISTS "SeatAssignment_tourDateId_seatCode_active_key"
  ON "booking"."SeatAssignment"("tourDateId", "seatCode")
  WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "SeatAssignment_reservationGuestId_active_key"
  ON "booking"."SeatAssignment"("reservationGuestId")
  WHERE "deletedAt" IS NULL;

DO $$ BEGIN
  ALTER TABLE "booking"."SeatAssignment"
    ADD CONSTRAINT "SeatAssignment_tourDateId_fkey"
    FOREIGN KEY ("tourDateId") REFERENCES "catalog"."TourDate"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "booking"."SeatAssignment"
    ADD CONSTRAINT "SeatAssignment_reservationGuestId_fkey"
    FOREIGN KEY ("reservationGuestId") REFERENCES "booking"."ReservationGuest"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "booking"."SeatAssignment"
    ADD CONSTRAINT "SeatAssignment_reservationId_fkey"
    FOREIGN KEY ("reservationId") REFERENCES "booking"."Reservation"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "booking"."SeatAssignment"
    ADD CONSTRAINT "SeatAssignment_assignedByAgencyStaffId_fkey"
    FOREIGN KEY ("assignedByAgencyStaffId") REFERENCES "identity"."AgencyStaff"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "booking"."SeatAssignment"
    ADD CONSTRAINT "SeatAssignment_assignedByAgencyId_fkey"
    FOREIGN KEY ("assignedByAgencyId") REFERENCES "identity"."Agency"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
