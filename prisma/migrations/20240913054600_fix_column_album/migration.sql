/*
  Warnings:

  - Made the column `image_Url` on table `album` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "album" ALTER COLUMN "image_Url" SET NOT NULL;
