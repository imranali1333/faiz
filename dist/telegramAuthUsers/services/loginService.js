"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByTelegramId = findUserByTelegramId;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function convertBigIntsToStrings(obj) {
    if (obj === null || obj === undefined)
        return obj;
    if (typeof obj === 'bigint')
        return obj.toString();
    if (Array.isArray(obj)) {
        return obj.map(convertBigIntsToStrings);
    }
    if (typeof obj === 'object') {
        return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, convertBigIntsToStrings(value)]));
    }
    return obj;
}
async function findUserByTelegramId(telegramId) {
    const user = await prisma.user.findUnique({
        where: { telegramId },
    });
    if (user) {
        return convertBigIntsToStrings(user);
    }
    return null;
}
