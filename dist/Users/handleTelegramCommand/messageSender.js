"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = sendMessage;
const axios_1 = __importDefault(require("axios"));
async function sendMessage(chatId, text) {
    const url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`;
    try {
        await axios_1.default.post(url, {
            chat_id: chatId,
            text: text,
        });
    }
    catch (error) {
        console.error('Error sending message:', error);
    }
}
