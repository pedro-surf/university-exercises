import { PrismaClient } from '@prisma/client';

// This ensures we reuse the same Prisma instance across the entire app
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Optional: logs SQL queries to your terminal, great for debugging!
});

export default prisma;