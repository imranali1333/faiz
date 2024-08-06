"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manageHandleUpdateCoins = manageHandleUpdateCoins;
exports.manageHandleGetCoins = manageHandleGetCoins;
const allCoinsService_1 = require("../services/allCoinsService");
const bigIntUtils_1 = require("../../utils/bigIntUtils");
async function manageHandleUpdateCoins(req, res) {
    try {
        // Extract userId from session
        const userId = req.session.userId;
        // Check if userId exists in the session
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized: userId not found in session' });
            return;
        }
        // Validate incrementAmount
        const incrementAmount = req.body.incrementAmount;
        if (typeof incrementAmount !== 'number') {
            res.status(400).json({ error: 'Invalid input: incrementAmount must be a number' });
            return;
        }
        // Convert userId to BigInt
        const userIdBigInt = BigInt(userId); // userId should be a string representing a BigInt
        const updatedCoins = await (0, allCoinsService_1.updateCoinsBalance)(userIdBigInt, incrementAmount);
        res.status(200).json(updatedCoins); // Updated coins are already in string format
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
async function manageHandleGetCoins(req, res) {
    try {
        // Extract userId from session
        const userId = req.session.userId;
        // Check if userId exists in the session
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized: userId not found in session' });
            return;
        }
        // Convert userId to BigInt
        const userIdBigInt = BigInt(userId); // Convert from string to BigInt
        // Retrieve coins balance
        const coins = await (0, allCoinsService_1.getCoinsBalance)(userIdBigInt);
        // Convert result to strings
        const coinsStr = (0, bigIntUtils_1.convertBigIntsToStrings)(coins);
        res.status(200).json(coinsStr);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
