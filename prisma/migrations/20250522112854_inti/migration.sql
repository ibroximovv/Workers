-- CreateTable
CREATE TABLE "BacketItem" (
    "id" TEXT NOT NULL,
    "productId" TEXT,
    "levelId" TEXT,
    "toolId" TEXT,
    "quantity" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "BacketItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BacketItem" ADD CONSTRAINT "BacketItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BacketItem" ADD CONSTRAINT "BacketItem_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BacketItem" ADD CONSTRAINT "BacketItem_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BacketItem" ADD CONSTRAINT "BacketItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
