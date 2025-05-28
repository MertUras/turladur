-- CreateTable
CREATE TABLE "tour_dates" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "tourId" TEXT NOT NULL,

    CONSTRAINT "tour_dates_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tour_dates" ADD CONSTRAINT "tour_dates_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;
