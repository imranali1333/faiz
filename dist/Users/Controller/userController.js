"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authUser = authUser;
exports.getUser = getUser;
exports.loginUser = loginUser;
exports.logoutUser = logoutUser;
const authUtils_1 = require("../utils/authUtils");
const UserService_1 = require("../Service/UserService");
const prismaclient_1 = __importDefault(require("../../utilities/prismaclient"));
async function authUser(req, res) {
    try {
        const authData = (0, authUtils_1.checkTelegramAuthorization)(req.query);
        await (0, UserService_1.userAuthentication)(authData);
        req.session.loggedIn = true;
        req.session.telegramId = authData.id;
        res.status(200).json({ message: 'Authentication successful' });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}
async function getUser(req, res) {
    if (!req.session.loggedIn) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const userData = await prismaclient_1.default.userTeleGram.findUnique({
        where: { telegramId: req.session.telegramId }
    });
    if (!userData) {
        return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(userData);
}
function loginUser(req, res) {
    if (req.session.loggedIn) {
        res.status(200).json({ message: 'Already logged in' });
    }
    else {
        res.status(200).json({ message: 'Login required', telegramBotUsername: process.env.BOT_USERNAME });
    }
}
function logoutUser(req, res) {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Failed to logout' });
        }
        res.status(200).json({ message: 'Logout successful' });
    });
}
//https://api.telegram.org/bot6874242710:AAGxnJ1R00JeRcTWF_9I7sjUvPYZ-Tns4hM/setWebhook?url=https://1279-223-123-12-202.ngrok-free.app
