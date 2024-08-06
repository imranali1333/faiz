/*
  Warnings:

  - You are about to drop the column `added` on the `UserTeleGram` table. All the data in the column will be lost.
  - You are about to drop the column `authDate` on the `UserTeleGram` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `UserTeleGram` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `UserTeleGram` table. All the data in the column will be lost.
  - You are about to drop the column `hash` on the `UserTeleGram` table. All the data in the column will be lost.
  - You are about to drop the column `isBot` on the `UserTeleGram` table. All the data in the column will be lost.
  - You are about to drop the column `languageCode` on the `UserTeleGram` table. All the data in the column will be lost.
  - You are about to drop the column `lastLogin` on the `UserTeleGram` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `UserTeleGram` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `UserTeleGram` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicture` on the `UserTeleGram` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `UserTeleGram` table. All the data in the column will be lost.
  - You are about to drop the column `telegramId` on the `UserTeleGram` table. All the data in the column will be lost.
  - You are about to drop the column `telegramUsername` on the `UserTeleGram` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `UserTeleGram` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UserTeleGram_telegramId_key";

-- AlterTable
ALTER TABLE "Invitation" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '1 DAY';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "UserTeleGram" DROP COLUMN "added",
DROP COLUMN "authDate",
DROP COLUMN "createdAt",
DROP COLUMN "firstName",
DROP COLUMN "hash",
DROP COLUMN "isBot",
DROP COLUMN "languageCode",
DROP COLUMN "lastLogin",
DROP COLUMN "lastName",
DROP COLUMN "phoneNumber",
DROP COLUMN "profilePicture",
DROP COLUMN "status",
DROP COLUMN "telegramId",
DROP COLUMN "telegramUsername",
DROP COLUMN "updatedAt";

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserTeleGram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
