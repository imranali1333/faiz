"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUpdateBalance = handleUpdateBalance;
exports.handleGetBalance = handleGetBalance;
const allCoinsService_1 = require("../services/allCoinsService");
async function handleUpdateBalance(req, res) {
    if (!req.session.loggedIn || !req.session.userId) {
        res.status(401).json({ message: 'Unauthorized: User not logged in' });
        return;
    }
    const { incrementAmount } = req.body;
    try {
        const updatedCoins = await (0, allCoinsService_1.updateCoinsBalance)(req.session.userId, incrementAmount);
        res.json(updatedCoins);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
async function handleGetBalance(req, res) {
    if (!req.session.loggedIn || !req.session.userId) {
        res.status(401).json({ message: 'Unauthorized: User not logged in' });
        return;
    }
    try {
        const coins = await (0, allCoinsService_1.getCoinsBalance)(req.session.userId);
        res.json(coins);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
