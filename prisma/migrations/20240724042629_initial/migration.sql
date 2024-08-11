-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT
);

-- CreateTable
CREATE TABLE "AnimeUser" (
    "userID" INTEGER NOT NULL,
    "animeID" INTEGER NOT NULL,
    "user_anime_rating" INTEGER NOT NULL,

    PRIMARY KEY ("userID", "animeID"),
    CONSTRAINT "AnimeUser_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AnimeUser_animeID_fkey" FOREIGN KEY ("animeID") REFERENCES "Anime" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Anime" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "jp_title" TEXT NOT NULL,
    "en_title" TEXT NOT NULL,
    "description" TEXT,
    "start_airing" TEXT NOT NULL,
    "finished_airing" TEXT,
    "avg_rating" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "ep_count" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "recently_added" BOOLEAN NOT NULL DEFAULT false,
    "studio_name" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
