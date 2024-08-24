-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Submissions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "restaurantName" TEXT NOT NULL,
    "restaurantAddress" TEXT NOT NULL,
    "discount" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Submissions" ("discount", "id", "latitude", "longitude", "restaurantAddress", "restaurantName", "verified") SELECT "discount", "id", "latitude", "longitude", "restaurantAddress", "restaurantName", "verified" FROM "Submissions";
DROP TABLE "Submissions";
ALTER TABLE "new_Submissions" RENAME TO "Submissions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
