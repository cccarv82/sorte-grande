import { config } from 'dotenv';
import { getDbConnection, closeDbConnection } from './index';

config({ path: '.env.local' });

async function validateSchema() {
  console.log('🔍 Validating database schema...\n');

  try {
    const pool = getDbConnection();

    // Check tables exist
    const tablesResult = await pool.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename
    `);

    console.log('📋 Tables found:');
    const tables = tablesResult.rows.map(r => r.tablename);
    tables.forEach(t => console.log(`  - ${t}`));

    const expectedTables = ['users', 'suggestions', 'lottery_results', 'prizes'];
    const missingTables = expectedTables.filter(t => !tables.includes(t));

    if (missingTables.length > 0) {
      console.error(`\n❌ Missing tables: ${missingTables.join(', ')}`);
      process.exit(1);
    }

    console.log('\n✅ All expected tables found!');

    // Check indexes
    const indexesResult = await pool.query(`
      SELECT indexname 
      FROM pg_indexes 
      WHERE schemaname = 'public' 
      AND tablename IN ('users', 'suggestions', 'lottery_results', 'prizes')
      ORDER BY indexname
    `);

    console.log('\n📊 Indexes found:');
    indexesResult.rows.forEach(r => console.log(`  - ${r.indexname}`));

    console.log('\n✅ Schema validation complete!');
  } catch (error) {
    console.error('❌ Schema validation failed:');
    if (error instanceof Error) {
      console.error(error.message);
    }
    process.exit(1);
  } finally {
    await closeDbConnection();
  }
}

validateSchema();
