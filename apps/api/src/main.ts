// api/src/main.ts
import { app } from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/database';

async function bootstrap() {
  try {
    await prisma.$connect();
    console.log('Connected to database');

    app.listen(env.PORT, () => {
      console.log(`Server running on http://localhost:${env.PORT}`);
    });

    // Only log ENV in development for safety
    if (env.NODE_ENV === 'development') {
      console.log('Loaded ENV:', env);
    }

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();