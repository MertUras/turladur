-- Soft-delete actor audit: createdBy / updatedBy / deletedBy on domain tables
-- Skip ephemeral: RefreshToken, IdempotencyKey, OutboxEvent

ALTER TABLE "identity"."User" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "identity"."User" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "identity"."User" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

ALTER TABLE "identity"."Favorite" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "identity"."Favorite" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "identity"."Favorite" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

ALTER TABLE "identity"."Agency" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "identity"."Agency" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "identity"."Agency" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

ALTER TABLE "identity"."AgencyStaff" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "identity"."AgencyStaff" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "identity"."AgencyStaff" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

ALTER TABLE "identity"."BusCompany" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "identity"."BusCompany" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "identity"."BusCompany" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

ALTER TABLE "identity"."Guide" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "identity"."Guide" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "identity"."Guide" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

ALTER TABLE "identity"."Vehicle" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "identity"."Vehicle" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "identity"."Vehicle" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

ALTER TABLE "identity"."GuideAvailability" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "identity"."GuideAvailability" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "identity"."GuideAvailability" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

ALTER TABLE "identity"."VehicleAvailability" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "identity"."VehicleAvailability" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "identity"."VehicleAvailability" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

ALTER TABLE "identity"."AgencyBankInfo" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "identity"."AgencyBankInfo" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "identity"."AgencyBankInfo" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

ALTER TABLE "catalog"."Tour" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "catalog"."Tour" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "catalog"."Tour" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

ALTER TABLE "catalog"."Tag" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "catalog"."Tag" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "catalog"."Tag" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

ALTER TABLE "catalog"."TourDepartureRule" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "catalog"."TourDepartureRule" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "catalog"."TourDepartureRule" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

ALTER TABLE "catalog"."TourDate" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "catalog"."TourDate" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "catalog"."TourDate" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

ALTER TABLE "catalog"."BusSeatLayout" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "catalog"."BusSeatLayout" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "catalog"."BusSeatLayout" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

ALTER TABLE "catalog"."TourDateAssignment" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "catalog"."TourDateAssignment" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "catalog"."TourDateAssignment" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

ALTER TABLE "catalog"."TourExtra" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "catalog"."TourExtra" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "catalog"."TourExtra" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

ALTER TABLE "catalog"."TourAccommodation" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "catalog"."TourAccommodation" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "catalog"."TourAccommodation" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

ALTER TABLE "catalog"."TourPickupPoint" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "catalog"."TourPickupPoint" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "catalog"."TourPickupPoint" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

ALTER TABLE "catalog"."TourDateAgeRange" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "catalog"."TourDateAgeRange" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "catalog"."TourDateAgeRange" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

ALTER TABLE "catalog"."Hotel" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "catalog"."Hotel" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "catalog"."Hotel" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

ALTER TABLE "catalog"."Experience" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "catalog"."Experience" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "catalog"."Experience" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

ALTER TABLE "catalog"."ActivityDate" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "catalog"."ActivityDate" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "catalog"."ActivityDate" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

ALTER TABLE "catalog"."ExperienceDateAgeRange" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "catalog"."ExperienceDateAgeRange" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "catalog"."ExperienceDateAgeRange" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

ALTER TABLE "booking"."Reservation" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "booking"."Reservation" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "booking"."Reservation" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

ALTER TABLE "booking"."ReservationGuest" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "booking"."ReservationGuest" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "booking"."ReservationGuest" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

ALTER TABLE "booking"."ReservationExtra" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "booking"."ReservationExtra" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "booking"."ReservationExtra" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

ALTER TABLE "booking"."Voucher" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "booking"."Voucher" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "booking"."Voucher" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

ALTER TABLE "booking"."SeatAssignment" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "booking"."SeatAssignment" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "booking"."SeatAssignment" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

ALTER TABLE "payment"."PaymentTransaction" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "payment"."PaymentTransaction" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "payment"."PaymentTransaction" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

ALTER TABLE "payment"."Refund" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "payment"."Refund" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "payment"."Refund" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

ALTER TABLE "payment"."Invoice" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "payment"."Invoice" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "payment"."Invoice" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

ALTER TABLE "payment"."AgencyCommissionRate" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "payment"."AgencyCommissionRate" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "payment"."AgencyCommissionRate" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

ALTER TABLE "payment"."AgencyEarning" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "payment"."AgencyEarning" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "payment"."AgencyEarning" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

ALTER TABLE "payment"."AgencyPayout" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "payment"."AgencyPayout" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "payment"."AgencyPayout" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

ALTER TABLE "review"."Review" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "review"."Review" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "review"."Review" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

ALTER TABLE "review"."TourMetrics" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "review"."TourMetrics" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "review"."TourMetrics" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

ALTER TABLE "content"."Category" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "content"."Category" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "content"."Category" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

ALTER TABLE "content"."Post" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "content"."Post" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "content"."Post" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

ALTER TABLE "content"."Comment" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "content"."Comment" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "content"."Comment" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

ALTER TABLE "promotion"."Coupon" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "promotion"."Coupon" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "promotion"."Coupon" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

ALTER TABLE "promotion"."Campaign" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "promotion"."Campaign" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;
ALTER TABLE "promotion"."Campaign" ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;

