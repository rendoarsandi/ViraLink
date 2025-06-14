import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';

declare global {
  var __prisma: PrismaClient | undefined;
}

// For development (local SQLite)
function createLocalPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

// For production (Cloudflare D1)
function createD1PrismaClient(d1Database: any) {
  const adapter = new PrismaD1(d1Database);
  return new PrismaClient({
    // @ts-ignore - D1 adapter compatibility issue
    adapter: adapter,
    log: ['error'],
  });
}

// Database client factory
export function createDatabaseClient(d1Database?: any) {
  if (d1Database) {
    // Production: Use Cloudflare D1
    return createD1PrismaClient(d1Database);
  } else {
    // Development: Use local SQLite
    // Only throw error in actual Cloudflare runtime, not during build
    if (process.env.NODE_ENV === 'production' && typeof process !== 'undefined' && process.env.CF_PAGES) {
      throw new Error('D1 database binding is required in production');
    }
    
    // Reuse connection in development
    if (!globalThis.__prisma) {
      globalThis.__prisma = createLocalPrismaClient();
    }
    return globalThis.__prisma;
  }
}

// Default export for local development
export const db = createDatabaseClient();
