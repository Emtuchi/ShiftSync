import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/base.error.js';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  console.error('Unexpected Error:', err);

  return res.status(500).json({
    message: 'Internal Server Error',
  });
}