import { Request, Response, NextFunction } from 'express';
import prisma from '../../utilities/prismaclient';
import { convertBigIntsToStrings } from '../../utils/bigIntUtils';

interface User {
  id: number;
  firstName: string;
  lastName: string | null;
  telegramId: string;
  telegramUsername: string | null;
  profilePicture: string | null;
  authDate: string | null; // Make authDate nullable
  added: Date;
  updatedAt: Date; // Ensure this matches the Prisma schema
}



declare module 'express-session' {
  interface SessionData {
    loggedIn: boolean;
    userId?: number;
    user?: User;
  }
}


export async function ensureAuthenticated(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (req.session.loggedIn && req.session.userId) {
    try {
      const user = await prisma.userTeleGram.findUnique({
        where: { id: req.session.userId },
        select: { 
          id: true,
          firstName: true,
          lastName: true,
          telegramId: true,
          telegramUsername: true,
          profilePicture: true,
          authDate: true, // Assuming you want to handle null values later
          added: true,
          updatedAt: true // Use updatedAt instead of updated
        }
      });      
      if (user) {
        req.session.user = user;
        next();
      } else {
        res.status(401).json({ message: 'Unauthorized: User not found' });
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(401).json({ message: 'Unauthorized: User not logged in' });
  }
}


export async function ensureAuthentication(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (req.session.loggedIn && req.session.userId) {
    try {
      // Convert userId to BigInt
      const userId = BigInt(req.session.userId);
      
      // Fetch user details from the database
      const user = await prisma.userTeleGram.findUnique({
        where: { id: userId as any },
        select: { 
          id: true,
          firstName: true,
          lastName: true,
          telegramId: true,
          telegramUsername: true,
          profilePicture: true,
          authDate: true,
          added: true,
          updatedAt: true
        }
      });
      
      // Convert BigInts to strings if user is found
      if (user) {
        req.session.user = convertBigIntsToStrings(user);
        next();
      } else {
        res.status(401).json({ message: 'Unauthorized: User not found' });
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(401).json({ message: 'Unauthorized: User not logged in' });
  }
}

