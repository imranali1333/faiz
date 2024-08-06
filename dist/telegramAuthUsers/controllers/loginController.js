"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
const loginService_1 = require("../services/loginService");
async function login(req, res) {
    const { telegramId } = req.body;
    if (!telegramId) {
        return res.status(400).json({ message: 'Missing telegramId' });
    }
    try {
        const user = await (0, loginService_1.findUserByTelegramId)(BigInt(telegramId));
        if (user) {
            req.session.loggedIn = true;
            req.session.userId = user.id.toString(); // Ensure userId is a string
            req.session.telegramId = telegramId;
            return res.status(200).json({ message: 'Login successful', user });
        }
        else {
            return res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
