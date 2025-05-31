-- CreateTable
CREATE TABLE "activity_dates" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "availableSeats" INTEGER NOT NULL,
    "activityId" TEXT NOT NULL,

    CONSTRAINT "activity_dates_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "activity_dates" ADD CONSTRAINT "activity_dates_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "experiences"("id") ON DELETE CASCADE ON UPDATE CASCADE;
