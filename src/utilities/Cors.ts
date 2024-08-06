// src/middleware.ts
import { Request, Response, NextFunction } from 'express';
import cors from 'cors';

const corsOptions = {
  origin: 'http://localhost:5173',  // Replace with your frontend's origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  };
  
export const handleCorsing = (req: Request, res: Response, next: NextFunction) => {
  console.log('Handling CORS for:', req.url);
  cors(corsOptions)(req, res, next);
};
