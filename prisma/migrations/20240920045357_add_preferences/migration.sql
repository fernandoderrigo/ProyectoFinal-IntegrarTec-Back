/*
  Warnings:

  - You are about to drop the column `id_usuario` on the `playlists` table. All the data in the column will be lost.
  - The primary key for the `song_in_playlist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `artistsOnSongs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `voice_command` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id_Playlist,id_Song]` on the table `song_in_playlist` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_user` to the `playlists` table without a default value. This is not possible if the table is not empty.
  - Added the required column `audio_Url` to the `songs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "artistsOnSongs" DROP CONSTRAINT "artistsOnSongs_artistId_fkey";

-- DropForeignKey
ALTER TABLE "artistsOnSongs" DROP CONSTRAINT "artistsOnSongs_songId_fkey";

-- DropForeignKey
ALTER TABLE "playlists" DROP CONSTRAINT "playlists_id_usuario_fkey";

-- AlterTable
ALTER TABLE "playlists" DROP COLUMN "id_usuario",
ADD COLUMN     "id_user" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "song_in_playlist" DROP CONSTRAINT "song_in_playlist_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "song_in_playlist_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "songs" ADD COLUMN     "audio_Url" TEXT NOT NULL,
ALTER COLUMN "duration" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "artistsOnSongs";

-- DropTable
DROP TABLE "voice_command";

-- CreateTable
CREATE TABLE "artists_on_songs" (
    "songId" INTEGER NOT NULL,
    "artistId" INTEGER NOT NULL,

    CONSTRAINT "artists_on_songs_pkey" PRIMARY KEY ("songId","artistId")
);

-- CreateTable
CREATE TABLE "preferences" (
    "id_user" INTEGER NOT NULL,
    "genders_fav" TEXT[],
    "artists_fav" TEXT[],

    CONSTRAINT "preferences_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "_UserFavoriteSongs" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserFavoriteSongs_AB_unique" ON "_UserFavoriteSongs"("A", "B");

-- CreateIndex
CREATE INDEX "_UserFavoriteSongs_B_index" ON "_UserFavoriteSongs"("B");

-- CreateIndex
CREATE UNIQUE INDEX "song_in_playlist_id_Playlist_id_Song_key" ON "song_in_playlist"("id_Playlist", "id_Song");

-- AddForeignKey
ALTER TABLE "playlists" ADD CONSTRAINT "playlists_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artists_on_songs" ADD CONSTRAINT "artists_on_songs_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artists_on_songs" ADD CONSTRAINT "artists_on_songs_songId_fkey" FOREIGN KEY ("songId") REFERENCES "songs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preferences" ADD CONSTRAINT "preferences_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFavoriteSongs" ADD CONSTRAINT "_UserFavoriteSongs_A_fkey" FOREIGN KEY ("A") REFERENCES "preferences"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFavoriteSongs" ADD CONSTRAINT "_UserFavoriteSongs_B_fkey" FOREIGN KEY ("B") REFERENCES "songs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
