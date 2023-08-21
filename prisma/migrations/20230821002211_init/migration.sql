-- DropForeignKey
ALTER TABLE "Store" DROP CONSTRAINT "Store_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "UserStores" DROP CONSTRAINT "UserStores_ownerId_fkey";

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStores" ADD CONSTRAINT "UserStores_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStores" ADD CONSTRAINT "UserStores_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;
