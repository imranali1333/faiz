"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContext = createContext;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function createContext() {
    return prisma;
}
