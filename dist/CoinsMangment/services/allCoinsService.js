"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCoinsBalance = updateCoinsBalance;
exports.getCoinsBalance = getCoinsBalance;
const prismaclient_1 = __importDefault(require("../../utilities/prismaclient"));
const bigIntUtils_1 = require("../../utils/bigIntUtils");
async function updateCoinsBalance(userId, incrementAmount) {
    try {
        // Find existing coins
        const existingCoins = await prismaclient_1.default.coinMangment.findUnique({
            where: {
                userId: userId, // Directly use BigInt
            },
        });
        let updatedCoins;
        if (existingCoins) {
            // Update existing coins
            updatedCoins = await prismaclient_1.default.coinMangment.update({
                where: {
                    userId: userId, // Directly use BigInt
                },
                data: {
                    balance: {
                        increment: incrementAmount,
                    },
                },
            });
        }
        else {
            // Create new coin entry
            updatedCoins = await prismaclient_1.default.coinMangment.create({
                data: {
                    userId: userId, // Directly use BigInt
                    balance: incrementAmount,
                },
            });
        }
        // Convert result to strings
        const updatedCoinsStr = (0, bigIntUtils_1.convertBigIntsToStrings)(updatedCoins);
        return updatedCoinsStr;
    }
    catch (error) {
        throw new Error(`Failed to update coins balance: ${error.message}`);
    }
}
async function getCoinsBalance(userId) {
    try {
        // Convert BigInt to string for Prisma query
        const userIdStr = userId.toString();
        const coins = await prismaclient_1.default.coinMangment.findUnique({
            where: {
                userId: BigInt(userIdStr), // Convert back to BigInt for Prisma query
            },
        });
        if (!coins) {
            throw new Error('Coins not found for the user');
        }
        // Convert result to strings
        const coinsStr = (0, bigIntUtils_1.convertBigIntsToStrings)(coins);
        return coinsStr;
    }
    catch (error) {
        throw new Error(`Failed to fetch coins balance: ${error.message}`);
    }
}
