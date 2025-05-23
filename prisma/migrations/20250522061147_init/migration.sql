/*
  Warnings:

  - Added the required column `measure` to the `ToolOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `ToolOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `ToolOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ToolOrder" ADD COLUMN     "measure" "Measure" NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "total" INTEGER NOT NULL;
