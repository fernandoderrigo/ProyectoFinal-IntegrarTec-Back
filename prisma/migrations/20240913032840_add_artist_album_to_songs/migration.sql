/*
  Warnings:

  - You are about to drop the column `album` on the `songs` table. All the data in the column will be lost.
  - You are about to drop the column `artist` on the `songs` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `nickName` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nick_Name]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `first_Name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_Name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nick_Name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_nickName_key";

-- AlterTable
ALTER TABLE "songs" DROP COLUMN "album",
DROP COLUMN "artist",
ADD COLUMN     "albumId" INTEGER,
ADD COLUMN     "artistId" INTEGER;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "nickName",
ADD COLUMN     "first_Name" TEXT NOT NULL,
ADD COLUMN     "last_Name" TEXT NOT NULL,
ADD COLUMN     "nick_Name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "album" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "release_Date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "album_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artist" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "artist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_nick_Name_key" ON "users"("nick_Name");

-- AddForeignKey
ALTER TABLE "songs" ADD CONSTRAINT "songs_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "songs" ADD CONSTRAINT "songs_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "album"("id") ON DELETE SET NULL ON UPDATE CASCADE;
