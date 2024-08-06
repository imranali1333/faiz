import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  statusCode?: number;
}

function errorHandler(err: CustomError, req: Request, res: Response, next: NextFunction): void {
  console.error('Error occurred:', err);

  // Default to internal server error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({ message });
}

export { errorHandler };
