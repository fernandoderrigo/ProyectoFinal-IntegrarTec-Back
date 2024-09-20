-- AlterTable
ALTER TABLE "songs" ADD COLUMN     "created_At_Datetime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_At_Datetime" TIMESTAMP(3);
