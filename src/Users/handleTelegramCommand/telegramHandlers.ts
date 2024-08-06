
import { AuthData, checkTelegramAuthorization } from '../utils/authUtils';
import { Request, Response } from 'express';
import { userAuthentication } from '../Service/UserService';
import { sendMessage } from './messageSender';
import prisma from '../../utilities/prismaclient';
import { generateHash } from '../Auth/generateHash';
import dotenv from 'dotenv';
dotenv.config();
const BOT_TOKEN = process.env.BOT_TOKEN;
const AUTH_URL = process.env.AUTH_URL;

declare module 'express-session' {
  interface SessionData {
    loggedIn: boolean;
    telegramId: string;

  }
}
declare module 'express-session' {
  interface Session {
    loggedIn: boolean;
    telegramId: string;
    userId?: any;

  }
}



export async function handleTelegramCommand(chatId: number, text: string): Promise<void> {
  if (text.startsWith('/start')) {
    await handleStartCommand(chatId);
  } else if (text.startsWith('/login')) {
    await handleLoginCommand(chatId);
  } else if (text.startsWith('/logout')) {
    await handleLogoutCommand(chatId);
  } else if (text.startsWith('/user')) {
    await handleUserCommand(chatId);
  } else {
    await sendMessage(chatId, 'Unknown command');
  }
}

async function handleStartCommand(chatId: number): Promise<void> {
  const NGROK_URL = '9b09-182-255-48-55.ngrok-free.app';
  await sendMessage(chatId, 'Welcome! Use /login to log in.');
}

async function handleLogoutCommand(chatId: number): Promise<void> {
  // Mocking the request and response objects
  const req = { session: { telegramId: chatId, destroy: (cb: Function) => cb(null) } } as unknown as Request;
  const res = {
    status: (code: number) => ({ json: (data: any) => ({ code, data }) })
  } as unknown as Response;

  const response = await new Promise((resolve) => {
    req.session.destroy((err: any) => {
      if (err) {
        resolve(res.status(500).json({ message: 'Failed to logout' }));
      } else {
        resolve(res.status(200).json({ message: 'Logout successful' }));
      }
    });
  });
  // @ts-ignore
  await sendMessage(chatId, response.data.message);
}

async function handleUserCommand(chatId: number): Promise<void> {
  // Mocking the request and response objects
  const req = { session: { loggedIn: true, telegramId: chatId.toString() } } as unknown as Request;
  const res = {
    status: (code: number) => ({
      json: (data: any) => ({ code, data })
    })
  } as unknown as Response;

  const userData = await prisma.userTeleGram.findUnique({
    where: { telegramId: chatId.toString() }
  });

  const response = !req.session.loggedIn
    ? res.status(401).json({ message: 'Unauthorized' })
    : userData
      ? res.status(200).json(userData)
      : res.status(404).json({ message: 'User not found' });
  // @ts-ignore
  await sendMessage(chatId, JSON.stringify(response.data));
}

export async function authUser(req: Request, res: Response): Promise<void> {
  try {
    // Extract all relevant fields from the query parameters
    const {
      id,
      telegramId,
      first_name,
      last_name,
      username,
      photo_url,
      auth_date,
      hash,
      phone_number,
      language_code,
      is_bot,
      from
    } = req.body;

    console.log(req.body);

    // Validate required fields
    const missingFields = [];
    if (!id) missingFields.push('id');
    if (!telegramId) missingFields.push('telegramId');
    if (!first_name) missingFields.push('first_name');
    if (!auth_date) missingFields.push('auth_date');
    if (missingFields.length > 0) {
      res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
      return;
    }

    // Construct the authData object
    const authData: AuthData = {
      id: id.toString(),
      telegramId: telegramId.toString(),
      first_name: first_name.toString(),
      last_name: last_name?.toString() || '',
      username: username?.toString() || '',
      photo_url: photo_url?.toString() || '',
      auth_date: auth_date.toString(),
      hash: hash.toString(),
      phone_number: phone_number?.toString() || '',
      language_code: language_code?.toString() || '',
      is_bot: is_bot || false,
    };

    // Log the received data
    console.log('Received data:', authData);

    // Generate the expected hash
    const dataToHash = {
      id: authData.id,
      first_name: authData.first_name,
      last_name: authData.last_name ?? '', // Handle missing last_name
      username: authData.username ?? '', // Handle missing username
      photo_url: authData.photo_url ?? '', // Handle missing photo_url
      auth_date: authData.auth_date ?? '', // Handle missing auth_date
      phone_number: authData.phone_number ?? '', // Handle missing phone_number
      telegramId: authData.telegramId,
    };

    const generatedHash = generateHash(dataToHash);

    // Log the generated hash
    console.log('Generated Hash:', generatedHash);

    await userAuthentication(authData);

    // Fetch the user from the database
    const user = await prisma.userTeleGram.findUnique({
      where: { telegramId: authData.telegramId }
    });

    if (user) {
      req.session.loggedIn = true;
      req.session.userId = user.id;
      req.session.telegramId = authData.telegramId;
      res.status(200).json({ message: 'Authentication successful' });
    } else {
      res.status(400).json({ message: 'User not found' });
    }
  } catch (error: any) {
    console.error('Error in authUser:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


export async function getUser(req: Request, res: Response): Promise<Response> {
  if (!req.session.loggedIn || !req.session.telegramId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const userData = await prisma.userTeleGram.findUnique({
      where: { telegramId: req.session.telegramId },
      include: {
        wallet: true, // Include related wallet
        allCoins: true, // Include related allCoins
        transactions: true, // Include transactions where this user is involved
        fromTransactions: true, // Include transactions where this user is the sender
        toTransactions: true // Include transactions where this user is the receiver
      }
    });

    if (!userData) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(userData);
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function searchUsers(req: Request, res: Response): Promise<Response> {
  const query = req.query.q as string;
  const fieldsString = req.query.fields as string;

  if (!query || !fieldsString || query.trim() === '') {
    return res.status(202).json({
      success: false,
      result: [],
      message: "No document found by this request",
    });
  }

  const fieldsArray = fieldsString.split(',');

  // Construct the search criteria
  const searchCriteria = {
    OR: fieldsArray.map(field => ({
      [field]: {
        contains: query,
        mode: 'insensitive',
      }
    }))
  };

  try {
    const users = await prisma.userTeleGram.findMany({
      where: searchCriteria,
      include: {
        wallet: true,
        allCoins: true,
        transactions: {
          include: {
            fromUser: true,
            toUser: true,
          },
        },
      },
      orderBy: { firstName: 'asc' },
      take: 10,
    });

    if (users.length > 0) {
      return res.status(200).json({
        success: true,
        result: users,
        message: "Successfully found all documents",
      });
    } else {
      return res.status(202).json({
        success: false,
        result: [],
        message: "No document found by this request",
      });
    }
  } catch (error) {
    console.error('Error searching for users:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: "Oops there is an Error",
    });
  }
}
export async function getAllUsers(req: Request, res: Response): Promise<Response> {
  // Retrieve pagination parameters
  const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
  const skip = (page - 1) * limit;

  try {
    // Query users with pagination and include all related data
    const users = await prisma.userTeleGram.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        telegramId: true,
        phoneNumber: true,
        telegramUsername: true,
        profilePicture: true,
        authDate: true,
        createdAt: true,
        updatedAt: true,
        added: true,
        allCoins: {
          select: {
            id: true,
            balance: true,
          },
        },
        invitationsSent: {
          select: {
            id: true,
            invitedUserId: true,
            code: true,
            acceptedById: true,
            createdAt: true,
          },
        },
        invitationsReceived: {
          select: {
            id: true,
            invitedById: true,
            code: true,
            acceptedById: true,
            createdAt: true,
          },
        },
        eventsAttending: {
          select: {
            id: true,
            name: true,
            date: true,
          },
        },
        tasksAssigned: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        wallet: {
          select: {
            id: true,
            walletId: true,
            balance: true,
            transactions: {
              select: {
                id: true,
                amount: true,
                transactionType: true,
                createdAt: true,
              },
            },
          },
        },
        transactions: {
          select: {
            id: true,
            amount: true,
            transactionType: true,
            createdAt: true,
          },
        },
        fromTransactions: {
          select: {
            id: true,
            amount: true,
            transactionType: true,
            createdAt: true,
          },
        },
        toTransactions: {
          select: {
            id: true,
            amount: true,
            transactionType: true,
            createdAt: true,
          },
        },
      },
    });

    // Count total users
    const count = await prisma.userTeleGram.count();

    // Calculate total pages
    const pages = Math.ceil(count / limit);

    // Construct pagination object
    const pagination = { page, pages, count };

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        result: [],
        pagination,
        message: 'No users found',
      });
    }

    return res.status(200).json({
      success: true,
      result: users,
      pagination,
      message: 'Successfully found all users',
    });
  } catch (error) {
    console.error('Error retrieving users:', error);
    return res.status(500).json({
      success: false,
      result: [],
      message: 'Internal Server Error',
    });
  }
}


export async function loginUser(req: Request, res: Response): Promise<void> {
  try {
    // Check if the user is already logged in
    if (req.session.loggedIn) {
      res.status(200).json({ message: 'Already logged in' });
      return;
    }

    // Extract and validate the Telegram authentication data from the query parameters
    const { id, first_name, last_name, username, photo_url, auth_date, phone_number, telegramId } = req.query;

    if (!id || !telegramId) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    // Construct the data to verify the hash
    const dataToHash = {
      id: id as string,
      first_name: first_name as string,
      last_name: last_name as string,
      username: username as string,
      photo_url: photo_url as string,
      auth_date: auth_date as string,
      phone_number: phone_number as string,
      telegramId: telegramId as string,
    };

    // Generate the hash from the data
    const generatedHash = generateHash(dataToHash);

    // Verify the provided hash against the generated hash

    // Fetch the user from the database using the Telegram ID
    const user = await prisma.userTeleGram.findUnique({
      where: { telegramId: telegramId as string },
    });

    if (user) {
      // Set the session data if the user exists
      req.session.loggedIn = true;
      req.session.userId = user.id;
      req.session.telegramId = telegramId as string;
      res.status(200).json({ message: 'Login successful' });
    } else {
      // If user does not exist, respond accordingly
      res.status(400).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error in loginUser:', error); // Log the error for debugging
    res.status(500).json({ message: 'Internal server error' });
  }
}

export function logoutUser(req: Request, res: Response): void {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Failed to logout' });
    }
    res.status(200).json({ message: 'Logout successful' });
  });
}
const NGROK_URL = '9b09-182-255-48-55.ngrok-free.app'; // Replace this with your actual ngrok URL

export async function handleTelegramWebhook(req: Request, res: Response): Promise<void> {
  const { message } = req.body;
  console.log('Incoming request:', req.body)

  if (!message || !message.text || !message.chat || !message.chat.id) {
    res.status(400).send('Invalid message format');
    return;
  }

  const chatId = message.chat.id;
  const text = message.text;

  if (text.startsWith('/start')) {
    await sendMessage(chatId, 'Welcome! Use /login to log in.');
  } else if (text.startsWith('/login')) {
    const loginUrl = `https://${NGROK_URL}/api/auth?telegramId=${chatId}`;
    await sendMessage(chatId, `Please log in using the following link: ${loginUrl}`);
  } else if (text.startsWith('/logout')) {
    // Mocking the request and response objects
    const req = { session: { telegramId: chatId, destroy: (cb: Function) => cb(null) } } as unknown as Request;
    const res = {
      status: (code: number) => ({ json: (data: any) => ({ code, data }) })
    } as unknown as Response;

    const response = await new Promise((resolve) => {
      req.session.destroy((err: any) => {
        if (err) {
          resolve(res.status(500).json({ message: 'Failed to logout' }));
        } else {
          resolve(res.status(200).json({ message: 'Logout successful' }));
        }
      });
    });
    // @ts-ignore
    await sendMessage(chatId, response.data.message);
  } else if (text.startsWith('/user')) {
    const userData = await prisma.userTeleGram.findUnique({
      where: { telegramId: chatId.toString() }
    });

    if (userData) {
      await sendMessage(chatId, JSON.stringify(userData));
    } else {
      await sendMessage(chatId, 'User not found');
    }
  } else {
    await sendMessage(chatId, 'Unknown command');
  }

  res.status(200).send('OK');
}

export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  const userId = parseInt(req.params.id, 10);

  if (isNaN(userId)) {
    return res.status(400).json({
      success: false,
      result: null,
      message: "Invalid ID format",
    });
  }

  try {
    // Find the user by id and delete it
    const result = await prisma.userTeleGram.delete({
      where: { id: userId },
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: "No document found by this id: " + userId,
      });
    }

    return res.status(200).json({
      success: true,
      result,
      message: "Successfully Deleted the document by id: " + userId,
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: "Oops there is an Error",
    });
  }
};



export async function handleLoginCommand(chatId: number): Promise<void> {
  try {
    console.log('Handling /login command for chatId:', chatId);
    const telegramId = BigInt(chatId).toString();
    const loginUrl = `${AUTH_URL}/telegram/login`;
    await sendMessage(chatId, `To log in, please follow this [link](${loginUrl}?telegramId=${telegramId}).`);
  } catch (error) {
    console.error('Error handling /login command:', error);
    await sendMessage(chatId, 'An error occurred while processing your request.');
  }
}






