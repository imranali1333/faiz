"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const dotenv_1 = __importDefault(require("dotenv"));
const telegramHandlers_1 = require("./telegramHandlers");
dotenv_1.default.config();
const bot = new node_telegram_bot_api_1.default(process.env.BOT_TOKEN, { polling: true });
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text || '';
    await (0, telegramHandlers_1.handleTelegramCommand)(chatId, text);
});
console.log('Bot is running...');
