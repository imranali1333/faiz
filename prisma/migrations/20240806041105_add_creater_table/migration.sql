-- AlterTable
ALTER TABLE "Invitation" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '1 DAY';

-- CreateTable
CREATE TABLE "UserInvitation" (
    "id" BIGSERIAL NOT NULL,
    "invitedById" BIGINT NOT NULL,
    "invitedUserId" BIGINT,
    "acceptedById" BIGINT,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) DEFAULT NOW() + INTERVAL '1 DAY',

    CONSTRAINT "UserInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserInvitation_code_key" ON "UserInvitation"("code");

-- CreateIndex
CREATE INDEX "UserInvitation_invitedById_idx" ON "UserInvitation"("invitedById");

-- CreateIndex
CREATE INDEX "UserInvitation_code_idx" ON "UserInvitation"("code");

-- CreateIndex
CREATE INDEX "UserInvitation_expiresAt_idx" ON "UserInvitation"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserInvitation_code_acceptedById_key" ON "UserInvitation"("code", "acceptedById");

-- AddForeignKey
ALTER TABLE "UserInvitation" ADD CONSTRAINT "UserInvitation_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInvitation" ADD CONSTRAINT "UserInvitation_invitedUserId_fkey" FOREIGN KEY ("invitedUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInvitation" ADD CONSTRAINT "UserInvitation_acceptedById_fkey" FOREIGN KEY ("acceptedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
