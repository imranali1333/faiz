"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCoinsBalance = updateCoinsBalance;
exports.getCoinsBalance = getCoinsBalance;
const prismaclient_1 = __importDefault(require("../../utilities/prismaclient"));
const socketManager_1 = require("../../sockets/socketManager");
async function updateCoinsBalance(userId, incrementAmount) {
    try {
        const existingCoins = await prismaclient_1.default.allCoins.findUnique({
            where: {
                userId: userId,
            },
        });
        let updatedCoins;
        if (existingCoins) {
            updatedCoins = await prismaclient_1.default.allCoins.update({
                where: {
                    userId: userId,
                },
                data: {
                    balance: {
                        increment: incrementAmount,
                    },
                },
            });
        }
        else {
            updatedCoins = await prismaclient_1.default.allCoins.create({
                data: {
                    userId: userId,
                    balance: incrementAmount,
                },
            });
        }
        // Emit Socket.IO event after updating the balance
        (0, socketManager_1.emitCoinsUpdated)(userId, updatedCoins.balance);
        return updatedCoins;
    }
    catch (error) {
        throw new Error(`Failed to update coins balance: ${error.message}`);
    }
}
async function getCoinsBalance(userId) {
    try {
        const coins = await prismaclient_1.default.allCoins.findUnique({
            where: {
                userId: userId,
            },
        });
        if (!coins) {
            throw new Error('Coins not found for the user');
        }
        return coins;
    }
    catch (error) {
        throw new Error(`Failed to fetch coins balance: ${error.message}`);
    }
}
