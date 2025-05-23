/*
  Warnings:

  - You are about to drop the column `locationLat` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `locationLong` on the `Order` table. All the data in the column will be lost.
  - Added the required column `location` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "locationLat",
DROP COLUMN "locationLong",
ADD COLUMN     "location" JSONB NOT NULL;
