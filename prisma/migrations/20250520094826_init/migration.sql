/*
  Warnings:

  - You are about to drop the column `districtId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `District` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `priceDaily` to the `Level` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceHourly` to the `Level` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `ProductOrder` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "District" DROP CONSTRAINT "District_regionId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_districtId_fkey";

-- AlterTable
ALTER TABLE "Level" ADD COLUMN     "priceDaily" INTEGER NOT NULL,
ADD COLUMN     "priceHourly" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ProductOrder" ADD COLUMN     "total" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "districtId";

-- DropTable
DROP TABLE "District";
