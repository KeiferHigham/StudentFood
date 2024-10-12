-- CreateTable
CREATE TABLE "Submissions" (
    "id" SERIAL NOT NULL,
    "restaurantName" TEXT NOT NULL,
    "restaurantAddress" TEXT NOT NULL,
    "discount" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NearbyRestaurants" (
    "id" SERIAL NOT NULL,
    "restaurantName" TEXT NOT NULL,
    "restaurantAddress" TEXT NOT NULL,

    CONSTRAINT "NearbyRestaurants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NearbyRestaurants_restaurantName_restaurantAddress_key" ON "NearbyRestaurants"("restaurantName", "restaurantAddress");
