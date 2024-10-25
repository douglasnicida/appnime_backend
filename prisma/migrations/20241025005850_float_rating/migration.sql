/*
  Warnings:

  - You are about to alter the column `user_anime_rating` on the `AnimeUser` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AnimeUser" (
    "userID" INTEGER NOT NULL,
    "animeID" INTEGER NOT NULL,
    "user_anime_rating" REAL NOT NULL,

    PRIMARY KEY ("userID", "animeID"),
    CONSTRAINT "AnimeUser_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AnimeUser_animeID_fkey" FOREIGN KEY ("animeID") REFERENCES "Anime" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AnimeUser" ("animeID", "userID", "user_anime_rating") SELECT "animeID", "userID", "user_anime_rating" FROM "AnimeUser";
DROP TABLE "AnimeUser";
ALTER TABLE "new_AnimeUser" RENAME TO "AnimeUser";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
