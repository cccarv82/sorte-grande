import { drizzle } from 'drizzle-orm/node-postgres'
import { getDbConnection } from '@/lib/db'

/**
 * Drizzle database instance for NextAuth adapter
 * 
 * Uses existing connection pool from Story 1.2 to avoid creating
 * duplicate connection pools. The singleton pattern ensures all
 * database operations share the same connection pool.
 * 
 * @example
 * ```typescript
 * import { db } from '@/lib/auth/adapter'
 * import { DrizzleAdapter } from '@auth/drizzle-adapter'
 * 
 * const adapter = DrizzleAdapter(db, { usersTable: users })
 * ```
 */
export const db = drizzle(getDbConnection())
