import { Request, Response } from 'express';
import * as messageService from '../services/messageService';
import prisma from '../../utilities/prismaclient';

interface FromData {
  id: bigint; 
  is_bot: boolean;
  first_name: string;
  last_name: string;
  username?: string;
  language_code: string;
}

interface ChatData {
  id: bigint;
  first_name: string;
  last_name: string;
  username?: string;
  type: string;
}

interface MessageData {
  message_id: bigint; 
  from: FromData;
  chat: ChatData;
  date: number;
  text: string;
  entities?: any;
}

export async function handleMessage(req: Request, res: Response): Promise<void> {
  try {
    const messageData: MessageData = req.body.message;

    if (!messageData) {
      res.status(400).json({ error: 'Missing message data' });
      return;
    }

    console.log(req.body);

    const { from, chat } = messageData;

    const missingFields: string[] = [];
    if (!from.id) missingFields.push('from.id');
    if (from.is_bot === undefined) missingFields.push('from.is_bot');
    if (!from.first_name) missingFields.push('from.first_name');
    if (!from.language_code) missingFields.push('from.language_code');
    if (!chat.id) missingFields.push('chat.id');
    if (!chat.first_name) missingFields.push('chat.first_name');
    if (!chat.last_name) missingFields.push('chat.last_name');
    if (!chat.type) missingFields.push('chat.type');

    if (missingFields.length > 0) {
      res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
      return;
    }

    const message = await messageService.createMessage(messageData);
    const user = await prisma.user.findUnique({
      where: { telegramId: from.id }
    });

    if (user) {
      req.session.loggedIn = true;
      req.session.userId = user.id.toString(); // Convert BigInt to string if necessary
      req.session.telegramId = from.id.toString();
      res.status(200).json({ message: 'Authentication successful' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }

    // Ensure only one response is sent
    if (res.headersSent) return;
    
    res.status(201).json({
      ...message,
      messageId: message.messageId.toString(), // Convert BigInt to string
      fromId: message.fromId.toString(), // Convert BigInt to string
      chatId: message.chatId.toString() // Convert BigInt to string
    });
  } catch (error: any) {
    console.error(error);

    // Ensure only one response is sent
    if (res.headersSent) return;
    
    if (error.message.includes('Message with messageId')) {
      res.status(409).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
