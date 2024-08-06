-- AlterTable
ALTER TABLE "Invitation" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '1 DAY';

-- CreateTable
CREATE TABLE "CoinMangment" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "CoinMangment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CoinMangment_userId_key" ON "CoinMangment"("userId");

-- AddForeignKey
ALTER TABLE "CoinMangment" ADD CONSTRAINT "CoinMangment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
