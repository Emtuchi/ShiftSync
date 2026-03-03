import express, { Request, Response, NextFunction } from 'express';
import { env } from './config/env';
import userRoutes from './modules/users/routes';
import locationRoutes from './modules/Location/routes';
import shiftRoutes from './modules/shifts/routes';
import skillRoutes from './modules/skills/routes';
import swapRoutes from './modules/swaps/routes';
import fairnessRouter  from './modules/fairness/routes';
import notificationRouter from './modules/notifications/routes';

export const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/locations', locationRoutes);
app.use('/api/v1/shifts', shiftRoutes);
app.use('/api/v1/skills', skillRoutes);
app.use('/api/v1/swaps', swapRoutes);
app.use('/api/v1/fairness', fairnessRouter);
app.use('/api/v1/notifications', notificationRouter);

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