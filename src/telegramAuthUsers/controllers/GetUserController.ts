import { Request, Response } from 'express';
import { getUserById } from '../services/getService';

export async function getUser(req: Request, res: Response): Promise<void> {
    try {
      if (!req.session.loggedIn || !req.session.telegramId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      const userId = BigInt(req.session.userId);
      const user = await getUserById(userId);
  
      // Debugging output to verify conversion
      console.log('User:', user);
      console.log('Type of User ID:', typeof user?.id);
  
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.status(200).json(user);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
  
