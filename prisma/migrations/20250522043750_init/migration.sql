/*
  Warnings:

  - The `withDelivery` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `ProductMasterTool` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `masterId` to the `ProductMaster` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductMasterTool" DROP CONSTRAINT "ProductMasterTool_productMasterId_fkey";

-- DropForeignKey
ALTER TABLE "ProductMasterTool" DROP CONSTRAINT "ProductMasterTool_toolId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "withDelivery",
ADD COLUMN     "withDelivery" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "ProductMaster" ADD COLUMN     "masterId" TEXT NOT NULL;

-- DropTable
DROP TABLE "ProductMasterTool";

-- DropEnum
DROP TYPE "WithDelivery";

-- AddForeignKey
ALTER TABLE "ProductMaster" ADD CONSTRAINT "ProductMaster_masterId_fkey" FOREIGN KEY ("masterId") REFERENCES "Master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
