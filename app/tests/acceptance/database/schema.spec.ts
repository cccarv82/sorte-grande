/**
 * Acceptance Tests: Database Schema (Story 1.3)
 * 
 * Tests validate that the database schema is correctly defined and applied
 * according to all acceptance criteria from Story 1.3.
 * 
 * Story: 1.3 - Define Database Schema with Drizzle ORM
 * Epic: Epic 1 - Foundation & Project Setup
 * 
 * These tests verify:
 * - All 4 tables exist (users, suggestions, lottery_results, prizes)
 * - Correct field types and constraints
 * - Foreign key relationships with CASCADE delete
 * - Indexes for query optimization
 * - Type safety with TypeScript
 */

import { test, expect } from '@playwright/test';
import { config } from 'dotenv';
import { getDbConnection, closeDbConnection } from '../../../lib/db';

// Load environment variables
config({ path: '.env.local' });

test.describe('Story 1.3: Database Schema - Acceptance Tests', () => {
  
  test.afterAll(async () => {
    await closeDbConnection();
  });

  test.describe('AC1: Drizzle ORM Installed and Configured', () => {
    
    test('GIVEN Drizzle is installed WHEN checking package.json THEN drizzle-orm and drizzle-kit are present', async () => {
      // GIVEN: Project has package.json
      const packageJson = require('../../../package.json');
      
      // WHEN: Checking dependencies
      const hasDrizzleOrm = packageJson.dependencies?.['drizzle-orm'];
      const hasDrizzleKit = packageJson.devDependencies?.['drizzle-kit'];
      
      // THEN: Both packages are installed
      expect(hasDrizzleOrm).toBeDefined();
      expect(hasDrizzleOrm).toMatch(/^\^0\.\d+\.\d+$/); // Version format ^0.x.x
      expect(hasDrizzleKit).toBeDefined();
      expect(hasDrizzleKit).toMatch(/^\^0\.\d+\.\d+$/);
    });

    test('GIVEN Drizzle config exists WHEN loading drizzle.config.ts THEN configuration is valid', async () => {
      // GIVEN: Drizzle config file exists
      const drizzleConfig = require('../../../drizzle.config.ts');
      
      // WHEN: Checking configuration
      const config = drizzleConfig.default;
      
      // THEN: Configuration has required fields
      expect(config.schema).toBe('./lib/db/schema.ts');
      expect(config.out).toBe('./drizzle');
      expect(config.dialect).toBe('postgresql');
      expect(config.dbCredentials).toBeDefined();
    });

    test('GIVEN Database connection WHEN connecting to Neon THEN connection succeeds', async () => {
      // GIVEN: DATABASE_URL is configured
      expect(process.env.DATABASE_URL).toBeDefined();
      
      // WHEN: Getting database connection
      const pool = getDbConnection();
      const result = await pool.query('SELECT NOW()');
      
      // THEN: Connection is successful
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0].now).toBeDefined();
    });
  });

  test.describe('AC2: Users Table Defined (NextAuth Compatible)', () => {
    
    test('GIVEN Database schema WHEN querying users table THEN table exists with correct structure', async () => {
      // GIVEN: Database connection
      const pool = getDbConnection();
      
      // WHEN: Querying table structure
      const result = await pool.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'users'
        ORDER BY ordinal_position
      `);
      
      // THEN: Table has all required fields
      const columns = result.rows.map(r => r.column_name);
      expect(columns).toContain('id');
      expect(columns).toContain('email');
      expect(columns).toContain('name');
      expect(columns).toContain('email_verified');
      expect(columns).toContain('image');
      expect(columns).toContain('created_at');
    });

    test('GIVEN Users table WHEN checking constraints THEN email has unique constraint', async () => {
      // GIVEN: Database connection
      const pool = getDbConnection();
      
      // WHEN: Querying unique constraints
      const result = await pool.query(`
        SELECT constraint_name, constraint_type
        FROM information_schema.table_constraints
        WHERE table_schema = 'public' 
          AND table_name = 'users'
          AND constraint_type = 'UNIQUE'
      `);
      
      // THEN: Email unique constraint exists
      const uniqueConstraints = result.rows;
      expect(uniqueConstraints.length).toBeGreaterThan(0);
      
      // Verify email column has unique constraint
      const emailUniqueResult = await pool.query(`
        SELECT constraint_name
        FROM information_schema.constraint_column_usage
        WHERE table_name = 'users' AND column_name = 'email'
      `);
      expect(emailUniqueResult.rows.length).toBeGreaterThan(0);
    });

    test('GIVEN Users table WHEN checking indexes THEN email index exists', async () => {
      // GIVEN: Database connection
      const pool = getDbConnection();
      
      // WHEN: Querying indexes
      const result = await pool.query(`
        SELECT indexname
        FROM pg_indexes
        WHERE schemaname = 'public' AND tablename = 'users'
      `);
      
      // THEN: Email index exists
      const indexes = result.rows.map(r => r.indexname);
      expect(indexes).toContain('idx_users_email');
    });
  });

  test.describe('AC3: Suggestions Table Defined', () => {
    
    test('GIVEN Database schema WHEN querying suggestions table THEN table exists with all 12 fields', async () => {
      // GIVEN: Database connection
      const pool = getDbConnection();
      
      // WHEN: Querying table structure
      const result = await pool.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'suggestions'
        ORDER BY ordinal_position
      `);
      
      // THEN: Table has all required fields
      const columns = result.rows.map(r => r.column_name);
      expect(columns).toContain('id');
      expect(columns).toContain('user_id');
      expect(columns).toContain('lottery');
      expect(columns).toContain('value');
      expect(columns).toContain('games');
      expect(columns).toContain('wheel_template');
      expect(columns).toContain('guarantee');
      expect(columns).toContain('status');
      expect(columns).toContain('contest_number');
      expect(columns).toContain('created_at');
      expect(columns).toContain('realized_at');
      expect(columns).toContain('verified_at');
      expect(columns.length).toBe(12);
    });

    test('GIVEN Suggestions table WHEN checking foreign keys THEN CASCADE delete to users exists', async () => {
      // GIVEN: Database connection
      const pool = getDbConnection();
      
      // WHEN: Querying foreign key constraints
      const result = await pool.query(`
        SELECT
          tc.constraint_name,
          tc.table_name,
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name,
          rc.delete_rule
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        JOIN information_schema.referential_constraints AS rc
          ON tc.constraint_name = rc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_name = 'suggestions'
          AND ccu.table_name = 'users'
      `);
      
      // THEN: Foreign key with CASCADE delete exists
      expect(result.rows.length).toBe(1);
      expect(result.rows[0].delete_rule).toBe('CASCADE');
      expect(result.rows[0].column_name).toBe('user_id');
      expect(result.rows[0].foreign_column_name).toBe('id');
    });

    test('GIVEN Suggestions table WHEN checking indexes THEN userId and status indexes exist', async () => {
      // GIVEN: Database connection
      const pool = getDbConnection();
      
      // WHEN: Querying indexes
      const result = await pool.query(`
        SELECT indexname
        FROM pg_indexes
        WHERE schemaname = 'public' AND tablename = 'suggestions'
      `);
      
      // THEN: Both indexes exist
      const indexes = result.rows.map(r => r.indexname);
      expect(indexes).toContain('idx_suggestions_user_id');
      expect(indexes).toContain('idx_suggestions_status');
    });

    test('GIVEN Suggestions table WHEN checking status default THEN default is pending', async () => {
      // GIVEN: Database connection
      const pool = getDbConnection();
      
      // WHEN: Querying column defaults
      const result = await pool.query(`
        SELECT column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' 
          AND table_name = 'suggestions'
          AND column_name = 'status'
      `);
      
      // THEN: Default value is 'pending'
      expect(result.rows[0].column_default).toContain('pending');
    });
  });

  test.describe('AC4: Lottery Results Table Defined', () => {
    
    test('GIVEN Database schema WHEN querying lottery_results table THEN table exists with all 7 fields', async () => {
      // GIVEN: Database connection
      const pool = getDbConnection();
      
      // WHEN: Querying table structure
      const result = await pool.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'lottery_results'
        ORDER BY ordinal_position
      `);
      
      // THEN: Table has all required fields
      const columns = result.rows.map(r => ({ name: r.column_name, type: r.data_type }));
      const columnNames = columns.map(c => c.name);
      
      expect(columnNames).toContain('id');
      expect(columnNames).toContain('lottery');
      expect(columnNames).toContain('contest_number');
      expect(columnNames).toContain('draw_numbers');
      expect(columnNames).toContain('draw_date');
      expect(columnNames).toContain('prizes');
      expect(columnNames).toContain('created_at');
      expect(columnNames.length).toBe(7);
      
      // Verify draw_numbers is array type
      const drawNumbersCol = columns.find(c => c.name === 'draw_numbers');
      expect(drawNumbersCol?.type).toBe('ARRAY');
    });

    test('GIVEN Lottery Results table WHEN checking unique constraint THEN (lottery, contestNumber) is unique', async () => {
      // GIVEN: Database connection
      const pool = getDbConnection();
      
      // WHEN: Querying unique constraints
      const result = await pool.query(`
        SELECT
          tc.constraint_name,
          kcu.column_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        WHERE tc.constraint_type = 'UNIQUE'
          AND tc.table_name = 'lottery_results'
        ORDER BY kcu.ordinal_position
      `);
      
      // THEN: Unique constraint exists on lottery and contest_number
      expect(result.rows.length).toBe(2); // Two columns in unique constraint
      const columns = result.rows.map(r => r.column_name);
      expect(columns).toContain('lottery');
      expect(columns).toContain('contest_number');
    });

    test('GIVEN Lottery Results table WHEN checking indexes THEN lottery and drawDate indexes exist', async () => {
      // GIVEN: Database connection
      const pool = getDbConnection();
      
      // WHEN: Querying indexes
      const result = await pool.query(`
        SELECT indexname
        FROM pg_indexes
        WHERE schemaname = 'public' AND tablename = 'lottery_results'
      `);
      
      // THEN: Both indexes exist
      const indexes = result.rows.map(r => r.indexname);
      expect(indexes).toContain('idx_lottery_results_lottery');
      expect(indexes).toContain('idx_lottery_results_draw_date');
    });
  });

  test.describe('AC5: Prizes Table Defined', () => {
    
    test('GIVEN Database schema WHEN querying prizes table THEN table exists with all 9 fields', async () => {
      // GIVEN: Database connection
      const pool = getDbConnection();
      
      // WHEN: Querying table structure
      const result = await pool.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'prizes'
        ORDER BY ordinal_position
      `);
      
      // THEN: Table has all required fields
      const columns = result.rows.map(r => ({ name: r.column_name, type: r.data_type }));
      const columnNames = columns.map(c => c.name);
      
      expect(columnNames).toContain('id');
      expect(columnNames).toContain('suggestion_id');
      expect(columnNames).toContain('game_index');
      expect(columnNames).toContain('contest_number');
      expect(columnNames).toContain('prize_tier');
      expect(columnNames).toContain('prize_value');
      expect(columnNames).toContain('matched_numbers');
      expect(columnNames).toContain('viewed_at');
      expect(columnNames).toContain('created_at');
      expect(columnNames.length).toBe(9);
      
      // Verify matched_numbers is array type
      const matchedNumbersCol = columns.find(c => c.name === 'matched_numbers');
      expect(matchedNumbersCol?.type).toBe('ARRAY');
    });

    test('GIVEN Prizes table WHEN checking foreign keys THEN CASCADE delete to suggestions exists', async () => {
      // GIVEN: Database connection
      const pool = getDbConnection();
      
      // WHEN: Querying foreign key constraints
      const result = await pool.query(`
        SELECT
          tc.constraint_name,
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name,
          rc.delete_rule
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        JOIN information_schema.referential_constraints AS rc
          ON tc.constraint_name = rc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_name = 'prizes'
          AND ccu.table_name = 'suggestions'
      `);
      
      // THEN: Foreign key with CASCADE delete exists
      expect(result.rows.length).toBe(1);
      expect(result.rows[0].delete_rule).toBe('CASCADE');
      expect(result.rows[0].column_name).toBe('suggestion_id');
      expect(result.rows[0].foreign_column_name).toBe('id');
    });

    test('GIVEN Prizes table WHEN checking indexes THEN suggestionId index exists', async () => {
      // GIVEN: Database connection
      const pool = getDbConnection();
      
      // WHEN: Querying indexes
      const result = await pool.query(`
        SELECT indexname
        FROM pg_indexes
        WHERE schemaname = 'public' AND tablename = 'prizes'
      `);
      
      // THEN: Index exists
      const indexes = result.rows.map(r => r.indexname);
      expect(indexes).toContain('idx_prizes_suggestion_id');
    });
  });

  test.describe('AC6: TypeScript Types Exported', () => {
    
    test('GIVEN TypeScript types WHEN checking types/database.ts THEN file exists with type exports', async () => {
      // GIVEN: types/database file
      const fs = require('fs');
      const path = require('path');
      const typesPath = path.join(__dirname, '../../../types/database.ts');
      
      // WHEN: Reading file content
      const content = fs.readFileSync(typesPath, 'utf-8');
      
      // THEN: All required type exports exist
      expect(content).toContain('export type Lottery');
      expect(content).toContain('export type SuggestionStatus');
      expect(content).toContain('export type PrizeTier');
      expect(content).toContain('export interface Game');
      expect(content).toContain('export interface PrizeTiers');
    });

    test('GIVEN Schema exports WHEN importing from lib/db THEN schema tables are available', async () => {
      // GIVEN: lib/db/schema module
      const schema = await import('../../../lib/db/schema');
      
      // THEN: All tables are exported
      expect(schema.users).toBeDefined();
      expect(schema.suggestions).toBeDefined();
      expect(schema.lotteryResults).toBeDefined();
      expect(schema.prizes).toBeDefined();
    });
  });

  test.describe('AC7: Migrations Generated and Applied', () => {
    
    test('GIVEN Migration file WHEN checking drizzle directory THEN migration SQL exists', async () => {
      // GIVEN: Drizzle migrations directory
      const fs = require('fs');
      const path = require('path');
      const migrationsDir = path.join(__dirname, '../../../drizzle');
      
      // WHEN: Reading migrations directory
      const files = fs.readdirSync(migrationsDir);
      
      // THEN: At least one .sql migration file exists
      const sqlFiles = files.filter((f: string) => f.endsWith('.sql'));
      expect(sqlFiles.length).toBeGreaterThan(0);
      
      // Verify migration contains all table definitions
      const migrationFile = fs.readFileSync(
        path.join(migrationsDir, sqlFiles[0]),
        'utf-8'
      );
      expect(migrationFile).toContain('CREATE TABLE "users"');
      expect(migrationFile).toContain('CREATE TABLE "suggestions"');
      expect(migrationFile).toContain('CREATE TABLE "lottery_results"');
      expect(migrationFile).toContain('CREATE TABLE "prizes"');
    });

    test('GIVEN Database WHEN querying all tables THEN all 4 tables exist', async () => {
      // GIVEN: Database connection
      const pool = getDbConnection();
      
      // WHEN: Querying all tables
      const result = await pool.query(`
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
        ORDER BY tablename
      `);
      
      // THEN: All 4 tables exist
      const tables = result.rows.map(r => r.tablename);
      expect(tables).toContain('users');
      expect(tables).toContain('suggestions');
      expect(tables).toContain('lottery_results');
      expect(tables).toContain('prizes');
    });

    test('GIVEN Database WHEN counting constraints THEN all FK and unique constraints exist', async () => {
      // GIVEN: Database connection
      const pool = getDbConnection();
      
      // WHEN: Querying all constraints
      const result = await pool.query(`
        SELECT constraint_type, COUNT(*) as count
        FROM information_schema.table_constraints
        WHERE table_schema = 'public'
          AND table_name IN ('users', 'suggestions', 'lottery_results', 'prizes')
        GROUP BY constraint_type
      `);
      
      // THEN: Expected constraint counts
      const constraints = result.rows.reduce((acc, row) => {
        acc[row.constraint_type] = parseInt(row.count);
        return acc;
      }, {} as Record<string, number>);
      
      expect(constraints['PRIMARY KEY']).toBe(4); // 4 tables = 4 PKs
      expect(constraints['FOREIGN KEY']).toBe(2); // suggestions→users, prizes→suggestions
      expect(constraints['UNIQUE']).toBeGreaterThanOrEqual(2); // users.email, lottery_results(lottery,contestNumber)
    });
  });

  test.describe('AC8: Schema Validation and Documentation', () => {
    
    test('GIVEN Validation script WHEN running db:validate THEN script passes', async () => {
      // GIVEN: Database connection
      const pool = getDbConnection();
      
      // WHEN: Executing validation logic (same as validate-schema.ts)
      const tablesResult = await pool.query(`
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        ORDER BY tablename
      `);
      
      const expectedTables = ['users', 'suggestions', 'lottery_results', 'prizes'];
      const tables = tablesResult.rows.map(r => r.tablename);
      const missingTables = expectedTables.filter(t => !tables.includes(t));
      
      // THEN: All expected tables found
      expect(missingTables).toHaveLength(0);
      
      // Verify indexes
      const indexesResult = await pool.query(`
        SELECT indexname 
        FROM pg_indexes 
        WHERE schemaname = 'public' 
        AND tablename IN ('users', 'suggestions', 'lottery_results', 'prizes')
      `);
      
      // At least 6 custom indexes + system indexes
      expect(indexesResult.rows.length).toBeGreaterThanOrEqual(6);
    });

    test('GIVEN README WHEN checking documentation THEN Database Schema section exists', async () => {
      // GIVEN: README file
      const fs = require('fs');
      const path = require('path');
      const readmePath = path.join(__dirname, '../../../README.md');
      const readme = fs.readFileSync(readmePath, 'utf-8');
      
      // THEN: Database Schema section exists with required content
      expect(readme).toContain('## Database Schema');
      expect(readme).toContain('Drizzle ORM');
      expect(readme).toContain('npm run db:generate');
      expect(readme).toContain('npm run db:push');
      expect(readme).toContain('npm run db:validate');
      expect(readme).toContain('https://orm.drizzle.team');
    });
  });
});
