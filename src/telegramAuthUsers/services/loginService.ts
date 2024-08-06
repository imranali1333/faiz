import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

function convertBigIntsToStrings(obj: any): any {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'bigint') return obj.toString();

  if (Array.isArray(obj)) {
    return obj.map(convertBigIntsToStrings);
  }

  if (typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, convertBigIntsToStrings(value)])
    );
  }

  return obj;
}

async function findUserByTelegramId(telegramId: bigint): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { telegramId },
  });

  if (user) {
    return convertBigIntsToStrings(user);
  }
  return null;
}

export { findUserByTelegramId };
