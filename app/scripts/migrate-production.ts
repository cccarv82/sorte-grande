/**
 * Production Database Migration Script
 * 
 * Run this to create tables in Neon production database
 * Usage: npx tsx scripts/migrate-production.ts
 */

import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

async function migrate() {
  console.log('🚀 Starting production migration...\n');

  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl) {
    console.error('❌ DATABASE_URL not found in environment variables');
    process.exit(1);
  }

  console.log('✅ DATABASE_URL found');
  console.log(`📍 Database: ${dbUrl.split('@')[1]?.split('/')[0]}\n`);

  const pool = new Pool({ 
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful\n');

    // Check existing tables
    const existingTables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log(`📋 Existing tables: ${existingTables.rows.length}`);
    existingTables.rows.forEach(row => console.log(`   - ${row.table_name}`));
    console.log('');

    // Read migration files
    const migrationsDir = path.join(__dirname, '../drizzle');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    console.log(`📁 Found ${migrationFiles.length} migration files:\n`);

    // Run each migration
    for (const file of migrationFiles) {
      console.log(`🔄 Running: ${file}`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
      
      try {
        await pool.query(sql);
        console.log(`✅ ${file} - Success\n`);
      } catch (error: any) {
        if (error.code === '42P07') {
          console.log(`⚠️  ${file} - Tables already exist (skipping)\n`);
        } else {
          console.error(`❌ ${file} - Error: ${error.message}\n`);
          throw error;
        }
      }
    }

    // Verify tables after migration
    const finalTables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('✅ Migration complete!');
    console.log(`📋 Final tables (${finalTables.rows.length}):`);
    finalTables.rows.forEach(row => console.log(`   - ${row.table_name}`));

  } catch (error: any) {
    console.error('\n❌ Migration failed:');
    console.error(`   Code: ${error.code}`);
    console.error(`   Message: ${error.message}`);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
