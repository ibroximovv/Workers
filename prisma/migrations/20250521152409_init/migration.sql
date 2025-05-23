/*
  Warnings:

  - You are about to drop the column `priceDaily` on the `Level` table. All the data in the column will be lost.
  - You are about to drop the column `priceHourly` on the `Level` table. All the data in the column will be lost.
  - You are about to drop the column `priceDaily` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `priceHourly` on the `Product` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Partners` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `minWorkingHours` to the `ProductLevel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceDaily` to the `ProductLevel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceHourly` to the `ProductLevel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Star` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Tool" DROP CONSTRAINT "Tool_sizeId_fkey";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Level" DROP COLUMN "priceDaily",
DROP COLUMN "priceHourly";

-- AlterTable
ALTER TABLE "Partners" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Partners_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "priceDaily",
DROP COLUMN "priceHourly";

-- AlterTable
ALTER TABLE "ProductLevel" ADD COLUMN     "minWorkingHours" INTEGER NOT NULL,
ADD COLUMN     "priceDaily" INTEGER NOT NULL,
ADD COLUMN     "priceHourly" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Star" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Tool" ALTER COLUMN "sizeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Star" ADD CONSTRAINT "Star_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tool" ADD CONSTRAINT "Tool_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "Size"("id") ON DELETE SET NULL ON UPDATE CASCADE;
