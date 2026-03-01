// api/src/config/database.ts
import { PrismaClient } from '@prisma/client';
import { env } from './env'; // your validated env

// Initialize Prisma with optional logging in development
export const prisma = new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// Graceful disconnect for development (helps with tsx/nodemon hot reload)
if (env.NODE_ENV === 'development') {
  const shutdown = async () => {
    await prisma.$disconnect();
    console.log('Prisma disconnected gracefully');
    process.exit();
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

// Optional helper to connect once in long-running apps
export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected');
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
};