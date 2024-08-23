-- CreateTable
CREATE TABLE "Submissions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "restaurantName" TEXT NOT NULL,
    "restaurantAddress" TEXT NOT NULL,
    "discount" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "NearbyRestaurants" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "restaurantName" TEXT NOT NULL,
    "restaurantAddress" TEXT NOT NULL
);
