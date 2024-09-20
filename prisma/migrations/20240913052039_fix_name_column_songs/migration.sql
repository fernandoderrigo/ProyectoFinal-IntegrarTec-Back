/*
  Warnings:

  - You are about to drop the column `image` on the `songs` table. All the data in the column will be lost.
  - Added the required column `image_Url` to the `songs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "songs" DROP COLUMN "image",
ADD COLUMN     "image_Url" TEXT NOT NULL;
