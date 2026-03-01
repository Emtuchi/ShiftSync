// api/src/app.ts
import express, { Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';
import { env } from './config/env';

export const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', env: env.NODE_ENV });
});

// Global error handler (stub)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});