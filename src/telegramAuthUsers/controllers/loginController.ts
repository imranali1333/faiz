import { Request, Response } from 'express';
import { findUserByTelegramId } from '../services/loginService';

async function login(req: Request, res: Response): Promise<Response> {
  const { telegramId } = req.body;

  if (!telegramId) {
    return res.status(400).json({ message: 'Missing telegramId' });
  }

  try {
    const user = await findUserByTelegramId(BigInt(telegramId));

    if (user) {
      req.session.loggedIn = true;
      req.session.userId = user.id.toString(); // Ensure userId is a string
      req.session.telegramId = telegramId;

      return res.status(200).json({ message: 'Login successful', user });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export { login };
