"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAuthenticated = ensureAuthenticated;
exports.ensureAuthentication = ensureAuthentication;
const prismaclient_1 = __importDefault(require("../../utilities/prismaclient"));
const bigIntUtils_1 = require("../../utils/bigIntUtils");
async function ensureAuthenticated(req, res, next) {
    if (req.session.loggedIn && req.session.userId) {
        try {
            const user = await prismaclient_1.default.userTeleGram.findUnique({
                where: { id: req.session.userId },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    telegramId: true,
                    telegramUsername: true,
                    profilePicture: true,
                    authDate: true, // Assuming you want to handle null values later
                    added: true,
                    updatedAt: true // Use updatedAt instead of updated
                }
            });
            if (user) {
                req.session.user = user;
                next();
            }
            else {
                res.status(401).json({ message: 'Unauthorized: User not found' });
            }
        }
        catch (error) {
            console.error('Error fetching user details:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    else {
        res.status(401).json({ message: 'Unauthorized: User not logged in' });
    }
}
async function ensureAuthentication(req, res, next) {
    if (req.session.loggedIn && req.session.userId) {
        try {
            // Convert userId to BigInt
            const userId = BigInt(req.session.userId);
            // Fetch user details from the database
            const user = await prismaclient_1.default.userTeleGram.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    telegramId: true,
                    telegramUsername: true,
                    profilePicture: true,
                    authDate: true,
                    added: true,
                    updatedAt: true
                }
            });
            // Convert BigInts to strings if user is found
            if (user) {
                req.session.user = (0, bigIntUtils_1.convertBigIntsToStrings)(user);
                next();
            }
            else {
                res.status(401).json({ message: 'Unauthorized: User not found' });
            }
        }
        catch (error) {
            console.error('Error fetching user details:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    else {
        res.status(401).json({ message: 'Unauthorized: User not logged in' });
    }
}
