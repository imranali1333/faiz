-- AlterTable
ALTER TABLE "Invitation" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '1 DAY';

-- CreateTable
CREATE TABLE "CreaterName" (
    "id" SERIAL NOT NULL,
    "setName" TEXT NOT NULL,
    "copyRight" TEXT NOT NULL,
    "Contact" TEXT NOT NULL,

    CONSTRAINT "CreaterName_pkey" PRIMARY KEY ("id")
);
