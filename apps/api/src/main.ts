import { app } from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/database.js';

async function bootstrap() {
  try {
    // Connect to database
    await prisma.$connect();
    console.log('Connected to database');

    // Render provides its own PORT
    const port = process.env.PORT || env.PORT || 3000;

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

    // Only log env in development
    if (env.NODE_ENV === 'development') {
      console.log('Loaded ENV:', env);
    }

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();