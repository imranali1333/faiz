// src/middleware.ts
import { Request, Response, NextFunction } from 'express';

// Middleware to set response locals
export const setLocals = (req: Request, res: Response, next: NextFunction) => {
  res.locals.admin = req.adminId || null;
  res.locals.currentPath = req.path;
  next();
};

// Middleware for handling CORS
export const handleCors = (req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,PATCH,PUT,POST,DELETE");
  res.header("Access-Control-Expose-Headers", "Content-Length");
  res.header(
    "Access-Control-Allow-Headers",
    "Accept, Authorization,x-auth-token, Content-Type, X-Requested-With, Range"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  } else {
    return next();
  }
};


