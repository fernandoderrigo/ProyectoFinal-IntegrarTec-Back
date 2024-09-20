/*
  Warnings:

  - You are about to drop the `Artists` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ArtistsOnSongs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Songs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ArtistsOnSongs" DROP CONSTRAINT "ArtistsOnSongs_artistId_fkey";

-- DropForeignKey
ALTER TABLE "ArtistsOnSongs" DROP CONSTRAINT "ArtistsOnSongs_songId_fkey";

-- DropForeignKey
ALTER TABLE "Songs" DROP CONSTRAINT "Songs_albumId_fkey";

-- DropForeignKey
ALTER TABLE "history_user" DROP CONSTRAINT "history_user_id_song_fkey";

-- DropForeignKey
ALTER TABLE "song_in_playlist" DROP CONSTRAINT "song_in_playlist_id_Song_fkey";

-- DropTable
DROP TABLE "Artists";

-- DropTable
DROP TABLE "ArtistsOnSongs";

-- DropTable
DROP TABLE "Songs";

-- CreateTable
CREATE TABLE "songs" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "image_Url" TEXT NOT NULL,
    "release_Date" TIMESTAMP(3) NOT NULL,
    "state" TEXT NOT NULL DEFAULT '1',
    "created_At_Datetime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At_Datetime" TIMESTAMP(3),
    "albumId" INTEGER,

    CONSTRAINT "songs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artists" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "artists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artistsOnSongs" (
    "songId" INTEGER NOT NULL,
    "artistId" INTEGER NOT NULL,

    CONSTRAINT "artistsOnSongs_pkey" PRIMARY KEY ("songId","artistId")
);

-- CreateIndex
CREATE UNIQUE INDEX "artists_name_key" ON "artists"("name");

-- AddForeignKey
ALTER TABLE "songs" ADD CONSTRAINT "songs_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artistsOnSongs" ADD CONSTRAINT "artistsOnSongs_songId_fkey" FOREIGN KEY ("songId") REFERENCES "songs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artistsOnSongs" ADD CONSTRAINT "artistsOnSongs_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "song_in_playlist" ADD CONSTRAINT "song_in_playlist_id_Song_fkey" FOREIGN KEY ("id_Song") REFERENCES "songs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "history_user" ADD CONSTRAINT "history_user_id_song_fkey" FOREIGN KEY ("id_song") REFERENCES "songs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
