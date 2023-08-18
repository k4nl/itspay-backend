/*
  Warnings:

  - You are about to drop the column `userId` on the `UserStores` table. All the data in the column will be lost.
  - Added the required column `owner` to the `UserStores` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserStores" DROP CONSTRAINT "UserStores_userId_fkey";

-- AlterTable
ALTER TABLE "UserStores" DROP COLUMN "userId",
ADD COLUMN     "owner" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "UserStores" ADD CONSTRAINT "UserStores_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
