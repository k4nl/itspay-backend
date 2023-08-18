-- CreateTable
CREATE TABLE "UserStores" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "storeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "UserStores_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserStores" ADD CONSTRAINT "UserStores_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStores" ADD CONSTRAINT "UserStores_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
