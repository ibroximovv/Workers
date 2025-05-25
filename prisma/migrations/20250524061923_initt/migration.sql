/*
  Warnings:

  - You are about to drop the column `orderId` on the `Backet` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `GeneralInfo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[links]` on the table `GeneralInfo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phones]` on the table `GeneralInfo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `backetId` to the `BacketItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Backet" DROP CONSTRAINT "Backet_orderId_fkey";

-- AlterTable
ALTER TABLE "Backet" DROP COLUMN "orderId";

-- AlterTable
ALTER TABLE "BacketItem" ADD COLUMN     "backetId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GeneralInfo" ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "links" DROP NOT NULL,
ALTER COLUMN "phones" DROP NOT NULL,
ALTER COLUMN "telegramId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "GeneralInfo_email_key" ON "GeneralInfo"("email");

-- CreateIndex
CREATE UNIQUE INDEX "GeneralInfo_links_key" ON "GeneralInfo"("links");

-- CreateIndex
CREATE UNIQUE INDEX "GeneralInfo_phones_key" ON "GeneralInfo"("phones");

-- AddForeignKey
ALTER TABLE "BacketItem" ADD CONSTRAINT "BacketItem_backetId_fkey" FOREIGN KEY ("backetId") REFERENCES "Backet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
