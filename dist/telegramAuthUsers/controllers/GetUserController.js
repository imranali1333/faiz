"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = getUser;
const getService_1 = require("../services/getService");
async function getUser(req, res) {
    try {
        if (!req.session.loggedIn || !req.session.telegramId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const userId = BigInt(req.session.userId);
        const user = await (0, getService_1.getUserById)(userId);
        // Debugging output to verify conversion
        console.log('User:', user);
        console.log('Type of User ID:', typeof user?.id);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
