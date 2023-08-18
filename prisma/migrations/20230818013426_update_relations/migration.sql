/*
  Warnings:

  - You are about to drop the column `owner` on the `UserStores` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[storeId]` on the table `UserStores` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ownerId` to the `UserStores` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UserStores_storeId_owner_key";

-- AlterTable
ALTER TABLE "UserStores" DROP COLUMN "owner",
ADD COLUMN     "ownerId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserStores_storeId_key" ON "UserStores"("storeId");

-- AddForeignKey
ALTER TABLE "UserStores" ADD CONSTRAINT "UserStores_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
