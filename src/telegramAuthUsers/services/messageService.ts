import prisma from "../../utilities/prismaclient";

interface FromData {
  id: bigint;
  is_bot: boolean;
  first_name: string;
  last_name: string;
  username?: string;
  language_code: string;
}

interface ChatData {
  id: bigint; // Changed to bigint
  first_name: string;
  last_name: string;
  username?: string;
  type: string;
}

interface MessageData {
  message_id: bigint; // Changed to bigint
  from: FromData;
  chat: ChatData;
  date: number;
  text: string;
  entities?: any; // Adjust type as necessary based on actual structure
}

async function createMessage(data: MessageData) {
  const { message_id, from, chat, date, text, entities } = data;

  // Check if the message already exists
  const existingMessage = await prisma.message.findUnique({
    where: { messageId: message_id },
  });

  if (existingMessage) {
    throw new Error(`Message with messageId ${message_id} already exists`);
  }

  // Create or find and update user
  const user = await prisma.user.upsert({
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
  const chatRecord = await prisma.chat.upsert({
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
  const message = await prisma.message.create({
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

export { createMessage };
