/*
  Warnings:

  - You are about to drop the column `created_dateTime` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_dateTime` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "created_dateTime",
DROP COLUMN "updated_dateTime",
ADD COLUMN     "created_At_dateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_At_dateTime" TIMESTAMP(3);
