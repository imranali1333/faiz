"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const telegramHandlers_1 = require("./handleTelegramCommand/telegramHandlers");
const messageSender_1 = require("./handleTelegramCommand/messageSender");
const app = (0, express_1.default)();
app.post('/webhook', async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.sendStatus(200);
    }
    const chatId = message.chat.id;
    const text = message.text;
    try {
        await (0, telegramHandlers_1.handleTelegramCommand)(chatId, text);
    }
    catch (error) {
        console.error('Error handling webhook:', error);
        await (0, messageSender_1.sendMessage)(chatId, 'An error occurred');
    }
    res.sendStatus(200);
});
exports.default = app;
