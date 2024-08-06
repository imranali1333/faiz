"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkTelegramAuthorization = checkTelegramAuthorization;
const crypto_1 = __importDefault(require("crypto"));
const BOT_TOKEN = process.env.BOT_TOKEN || '';
function checkTelegramAuthorization(authData) {
    const checkHash = authData.hash;
    const dataCheckArr = [];
    for (const key in authData) {
        if (key !== 'hash' && authData[key] !== undefined) {
            dataCheckArr.push(`${key}=${authData[key]}`);
        }
    }
    dataCheckArr.sort();
    const dataCheckString = dataCheckArr.join('\n');
    const secretKey = crypto_1.default.createHash('sha256').update(BOT_TOKEN).digest();
    const hash = crypto_1.default.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
    if (hash !== checkHash) {
        throw new Error('Data is NOT from Telegram');
    }
    if ((Date.now() / 1000) - parseInt(authData.auth_date) > 86400) {
        throw new Error('Data is outdated');
    }
    return authData;
}
function generateAuthData() {
    return {
        id: '123456',
        telegramId: '123456789',
        first_name: 'imranali',
        last_name: '44444hfwhf',
        username: '@aaliiajaii.dev',
        photo_url: 'http://example.com/photo.jpg',
        phone_number: "03056151224",
        auth_date: Math.floor(Date.now() / 1000).toString(),
        hash: '',
    };
}
function generateHash(authData) {
    const dataCheckArr = [];
    for (const key in authData) {
        if (authData[key] !== undefined && key !== 'hash') {
            dataCheckArr.push(`${key}=${authData[key]}`);
        }
    }
    dataCheckArr.sort();
    const dataCheckString = dataCheckArr.join('\n');
    const secretKey = crypto_1.default.createHash('sha256').update(BOT_TOKEN).digest();
    return crypto_1.default.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
}
function generateAuthUrl(authData) {
    authData.hash = generateHash(authData); // Set the hash value
    const params = new URLSearchParams({
        ...authData,
        hash: authData.hash
    }).toString();
    return `http://localhost:8080/api/auth?${params}`;
}
const authData = generateAuthData();
authData.hash = generateHash(authData); // Set the hash value
const url = generateAuthUrl(authData);
console.log('Generated URL for Test:', url);
