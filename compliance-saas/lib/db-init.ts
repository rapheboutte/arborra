import { PrismaClient } from '@prisma/client';

let isInitialized = false;
const prisma = new PrismaClient();

export async function initializeDatabase() {
  if (isInitialized) return;

  try {
    // Test database connection
    await prisma.$connect();

    // Check if we need to seed the database
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      console.log('Database is empty, needs initialization');
      throw new Error('Database needs initialization');
    }

    isInitialized = true;
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
