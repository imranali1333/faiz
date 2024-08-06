"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessage = createMessage;
const prismaclient_1 = __importDefault(require("../../utilities/prismaclient"));
async function createMessage(data) {
    const { message_id, from, chat, date, text, entities } = data;
    // Check if the message already exists
    const existingMessage = await prismaclient_1.default.message.findUnique({
        where: { messageId: message_id },
    });
    if (existingMessage) {
        throw new Error(`Message with messageId ${message_id} already exists`);
    }
    // Create or find and update user
    const user = await prismaclient_1.default.user.upsert({
        where: { telegramId: from.id },
        update: {
            isBot: from.is_bot,
            firstName: from.first_name,
            lastName: from.last_name,
            username: from.username,
            languageCode: from.language_code,
        },
        create: {
            telegramId: from.id,
            isBot: from.is_bot,
            firstName: from.first_name,
            lastName: from.last_name,
            username: from.username,
            languageCode: from.language_code,
        },
    });
    // Create or find and update chat
    const chatRecord = await prismaclient_1.default.chat.upsert({
        where: { telegramId: chat.id },
        update: {
            firstName: chat.first_name,
            lastName: chat.last_name,
            username: chat.username,
            type: chat.type,
        },
        create: {
            telegramId: chat.id,
            firstName: chat.first_name,
            lastName: chat.last_name,
            username: chat.username,
            type: chat.type,
        },
    });
    // Create message
    const message = await prismaclient_1.default.message.create({
        data: {
            messageId: message_id,
            fromId: user.telegramId,
            chatId: chatRecord.telegramId,
            date,
            text,
            entities,
        },
    });
    return message;
}
