/*
  Warnings:

  - A unique constraint covering the columns `[storeId,owner]` on the table `UserStores` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "UserStores" DROP CONSTRAINT "UserStores_owner_fkey";

-- DropForeignKey
ALTER TABLE "UserStores" DROP CONSTRAINT "UserStores_storeId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "UserStores_storeId_owner_key" ON "UserStores"("storeId", "owner");
