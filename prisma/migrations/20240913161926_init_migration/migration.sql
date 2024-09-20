/*
  Warnings:

  - You are about to drop the `artist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `songs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "history_user" DROP CONSTRAINT "history_user_id_song_fkey";

-- DropForeignKey
ALTER TABLE "song_in_playlist" DROP CONSTRAINT "song_in_playlist_id_Song_fkey";

-- DropForeignKey
ALTER TABLE "songs" DROP CONSTRAINT "songs_albumId_fkey";

-- DropForeignKey
ALTER TABLE "songs" DROP CONSTRAINT "songs_artistId_fkey";

-- DropTable
DROP TABLE "artist";

-- DropTable
DROP TABLE "songs";

-- CreateTable
CREATE TABLE "Songs" (
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

    CONSTRAINT "Songs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artist" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtistsOnSongs" (
    "songId" INTEGER NOT NULL,
    "artistId" INTEGER NOT NULL,

    CONSTRAINT "ArtistsOnSongs_pkey" PRIMARY KEY ("songId","artistId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Artist_name_key" ON "Artist"("name");

-- AddForeignKey
ALTER TABLE "Songs" ADD CONSTRAINT "Songs_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "album"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistsOnSongs" ADD CONSTRAINT "ArtistsOnSongs_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Songs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistsOnSongs" ADD CONSTRAINT "ArtistsOnSongs_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "song_in_playlist" ADD CONSTRAINT "song_in_playlist_id_Song_fkey" FOREIGN KEY ("id_Song") REFERENCES "Songs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "history_user" ADD CONSTRAINT "history_user_id_song_fkey" FOREIGN KEY ("id_song") REFERENCES "Songs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
