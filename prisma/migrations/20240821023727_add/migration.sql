/*
  Warnings:

  - A unique constraint covering the columns `[restaurantName,restaurantAddress]` on the table `NearbyRestaurants` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "NearbyRestaurants_restaurantName_restaurantAddress_key" ON "NearbyRestaurants"("restaurantName", "restaurantAddress");
