-- CreateTable
CREATE TABLE "tour_pickup_points" (
    "id" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "tour_pickup_points_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tour_pickup_points" ADD CONSTRAINT "tour_pickup_points_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;
