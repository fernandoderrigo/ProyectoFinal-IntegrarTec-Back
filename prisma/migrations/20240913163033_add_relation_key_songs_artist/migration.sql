/*
  Warnings:

  - You are about to drop the `Artist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `album` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ArtistsOnSongs" DROP CONSTRAINT "ArtistsOnSongs_artistId_fkey";

-- DropForeignKey
ALTER TABLE "Songs" DROP CONSTRAINT "Songs_albumId_fkey";

-- DropTable
DROP TABLE "Artist";

-- DropTable
DROP TABLE "album";

-- CreateTable
CREATE TABLE "albums" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "release_Date" TIMESTAMP(3) NOT NULL,
    "image_Url" TEXT NOT NULL,
    "created_At_Datetime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At_Datetime" TIMESTAMP(3),

    CONSTRAINT "albums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artists" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Artists_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Artists_name_key" ON "Artists"("name");

-- AddForeignKey
ALTER TABLE "Songs" ADD CONSTRAINT "Songs_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistsOnSongs" ADD CONSTRAINT "ArtistsOnSongs_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
