/*
  Warnings:

  - You are about to drop the column `measure` on the `ToolOrder` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `ToolOrder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ToolOrder" DROP COLUMN "measure",
DROP COLUMN "quantity";
