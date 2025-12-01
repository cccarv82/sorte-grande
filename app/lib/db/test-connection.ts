import { config } from 'dotenv';
import { getDbConnection, closeDbConnection } from './index';

// Load environment variables
config({ path: '.env.local' });

/**
 * Test database connection
 * 
 * Runs a simple SELECT 1 query to verify:
 * - DATABASE_URL is configured correctly
 * - Network can reach Neon
 * - SSL connection works
 * - Credentials are valid
 * 
 * Usage:
 *   node --loader ts-node/esm lib/db/test-connection.ts
 */

async function testConnection() {
  console.log('🔄 Testing database connection...\n');

  try {
    const pool = getDbConnection();
    
    // Execute simple query
    const result = await pool.query('SELECT 1 as connected, NOW() as server_time');
    
    console.log('✅ Database connected successfully!');
    console.log(`📅 Server time: ${result.rows[0].server_time}`);
    console.log(`🔗 Connection pool ready (max: 10 connections)\n`);

    // Test connection details
    const versionResult = await pool.query('SELECT version()');
    console.log(`🐘 PostgreSQL version: ${versionResult.rows[0].version.split(',')[0]}\n`);

  } catch (error) {
    console.error('❌ Database connection failed:\n');
    if (error instanceof Error) {
      console.error(error.message);
      console.error('\nTroubleshooting:');
      console.error('1. Check DATABASE_URL in .env.local');
      console.error('2. Verify Neon project is active');
      console.error('3. Ensure development branch exists');
      console.error('4. Check network/firewall allows PostgreSQL (port 5432)');
    }
    process.exit(1);
  } finally {
    await closeDbConnection();
    console.log('👋 Connection closed');
  }
}

// Run test
testConnection();
