/*
  Warnings:

  - A unique constraint covering the columns `[telegramId]` on the table `UserTeleGram` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authDate` to the `UserTeleGram` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `UserTeleGram` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telegramId` to the `UserTeleGram` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `UserTeleGram` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invitation" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '1 DAY';

-- AlterTable
ALTER TABLE "UserTeleGram" ADD COLUMN     "added" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "authDate" VARCHAR(32) NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "firstName" VARCHAR(64) NOT NULL,
ADD COLUMN     "hash" TEXT,
ADD COLUMN     "isBot" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "languageCode" VARCHAR(16),
ADD COLUMN     "lastLogin" TIMESTAMP(3),
ADD COLUMN     "lastName" VARCHAR(64),
ADD COLUMN     "phoneNumber" VARCHAR(32),
ADD COLUMN     "profilePicture" VARCHAR(128),
ADD COLUMN     "status" VARCHAR(16),
ADD COLUMN     "telegramId" VARCHAR(32) NOT NULL,
ADD COLUMN     "telegramUsername" VARCHAR(64),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserTeleGram_telegramId_key" ON "UserTeleGram"("telegramId");
