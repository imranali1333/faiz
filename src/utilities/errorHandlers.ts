// src/errorHandlers.ts
import { Request, Response, NextFunction } from 'express';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: 'Not Found' });
};

export const developmentErrors = (err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    message: err.message,
    error: err,
  });
};

export const productionErrors = (err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    message: 'An unexpected error occurred',
  });
};
