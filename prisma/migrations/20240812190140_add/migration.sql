-- CreateTable
CREATE TABLE "Discount" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "restaurantName" TEXT NOT NULL,
    "restaurantAddress" TEXT NOT NULL,
    "discount" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "restaurantName" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "NearbyRestaurants" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "restaurantName" TEXT NOT NULL,
    "restaurantAddress" TEXT NOT NULL
);
