"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client"); // Import your Prisma client and Admin type
const prisma = new client_1.PrismaClient();
const JWT_Key = process.env.JWT_SECRET || 'JWT_SECRET';
const authenticateAdmin = async (req, res, next) => {
    let token;
    // Check cookies first, then authorization header
    token = req.cookies?.token;
    if (!token) {
        token = req.headers.authorization?.split(' ')[1];
    }
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_Key);
        req.adminId = decoded.userId;
        // Fetch admin details from the database using Prisma
        const admin = await prisma.admin.findUnique({
            where: { id: req.adminId },
        });
        if (!admin) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.admin = admin;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
exports.authenticateAdmin = authenticateAdmin;
