"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMessage = handleMessage;
const messageService = __importStar(require("../services/messageService"));
const prismaclient_1 = __importDefault(require("../../utilities/prismaclient"));
async function handleMessage(req, res) {
    try {
        const messageData = req.body.message;
        if (!messageData) {
            res.status(400).json({ error: 'Missing message data' });
            return;
        }
        console.log(req.body);
        const { from, chat } = messageData;
        const missingFields = [];
        if (!from.id)
            missingFields.push('from.id');
        if (from.is_bot === undefined)
            missingFields.push('from.is_bot');
        if (!from.first_name)
            missingFields.push('from.first_name');
        if (!from.language_code)
            missingFields.push('from.language_code');
        if (!chat.id)
            missingFields.push('chat.id');
        if (!chat.first_name)
            missingFields.push('chat.first_name');
        if (!chat.last_name)
            missingFields.push('chat.last_name');
        if (!chat.type)
            missingFields.push('chat.type');
        if (missingFields.length > 0) {
            res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
            return;
        }
        const message = await messageService.createMessage(messageData);
        const user = await prismaclient_1.default.user.findUnique({
            where: { telegramId: from.id }
        });
        if (user) {
            req.session.loggedIn = true;
            req.session.userId = user.id.toString(); // Convert BigInt to string if necessary
            req.session.telegramId = from.id.toString();
            res.status(200).json({ message: 'Authentication successful' });
        }
        else {
            res.status(404).json({ error: 'User not found' });
        }
        // Ensure only one response is sent
        if (res.headersSent)
            return;
        res.status(201).json({
            ...message,
            messageId: message.messageId.toString(), // Convert BigInt to string
            fromId: message.fromId.toString(), // Convert BigInt to string
            chatId: message.chatId.toString() // Convert BigInt to string
        });
    }
    catch (error) {
        console.error(error);
        // Ensure only one response is sent
        if (res.headersSent)
            return;
        if (error.message.includes('Message with messageId')) {
            res.status(409).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}
