import { Pool, type PoolConfig } from 'pg';

/**
 * PostgreSQL connection pool (singleton)
 * 
 * Uses Neon serverless PostgreSQL with built-in connection pooling.
 * SSL is enforced by Neon (sslmode=require in DATABASE_URL).
 * 
 * Environment Variables:
 * - DATABASE_URL: PostgreSQL connection string from Neon
 * 
 * References:
 * - Tech Spec: Database section (NFR-S2, NFR-R2)
 * - Neon Docs: https://neon.tech/docs/connect/connect-from-any-app
 */

let pool: Pool | null = null;

export function getDbConnection(): Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL is not defined. Please add it to .env.local file.\n' +
      'Get your connection string from: Neon dashboard → Branches → development'
    );
  }

  if (!pool) {
    const config: PoolConfig = {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false, // Neon uses SSL with self-signed cert
      },
      max: 10, // Maximum 10 connections in pool
      idleTimeoutMillis: 30000, // Close idle connections after 30s
      connectionTimeoutMillis: 10000, // Fail after 10s if no connection
    };

    pool = new Pool(config);

    // Log connection errors
    pool.on('error', (err) => {
      console.error('Unexpected database error:', err);
    });
  }

  return pool;
}

/**
 * Gracefully close database connections (for cleanup)
 */
export async function closeDbConnection(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

// Export Drizzle schema for type-safe queries
export * from './schema';
