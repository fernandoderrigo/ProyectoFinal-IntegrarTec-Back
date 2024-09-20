/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `artist` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "artist_name_key" ON "artist"("name");
