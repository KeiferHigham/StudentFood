/*
  Warnings:

  - Added the required column `discount` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Submission" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "restaurantName" TEXT NOT NULL,
    "restaurantAddress" TEXT NOT NULL,
    "discount" TEXT NOT NULL
);
INSERT INTO "new_Submission" ("id", "restaurantAddress", "restaurantName") SELECT "id", "restaurantAddress", "restaurantName" FROM "Submission";
DROP TABLE "Submission";
ALTER TABLE "new_Submission" RENAME TO "Submission";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
