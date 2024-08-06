"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHash = generateHash;
const crypto_1 = __importDefault(require("crypto"));
const config_1 = require("./config"); // Import BOT_TOKEN from your config
if (!config_1.BOT_TOKEN) {
    throw new Error('BOT_TOKEN must be defined in the environment variables');
}
function generateHash(authData) {
    // Filter out undefined values and convert to key=value pairs
    const dataToHash = Object.entries(authData)
        .filter(([key, value]) => value !== undefined && value !== '') // Filter out undefined or empty values
        .map(([key, value]) => `${key}=${value}`) // Convert to key=value pairs
        .sort() // Sort the entries
        .join('\n'); // Join with new lines
    // Generate the secret key from BOT_TOKEN
    const secretKey = crypto_1.default.createHash('sha256').update(config_1.BOT_TOKEN).digest();
    // Generate the HMAC hash
    return crypto_1.default.createHmac('sha256', secretKey).update(dataToHash).digest('hex');
}
