-- AlterTable
ALTER TABLE "Invitation" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '1 DAY';

-- AlterTable
ALTER TABLE "UserInvitation" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '1 DAY';
