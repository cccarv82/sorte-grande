import { config } from 'dotenv';
import { getDbConnection, closeDbConnection } from './index';

config({ path: '.env.local' });

async function verifyTables() {
  console.log('🔍 Verifying database schema in Neon...\n');

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
    tables.forEach(t => console.log(`  ✓ ${t}`));

    const expectedTables = ['users', 'suggestions', 'lottery_results', 'prizes'];
    const missingTables = expectedTables.filter(t => !tables.includes(t));

    if (missingTables.length > 0) {
      console.error(`\n❌ Missing tables: ${missingTables.join(', ')}`);
      process.exit(1);
    }

    console.log('\n✅ All expected tables found!');

    // Check indexes
    const indexesResult = await pool.query(`
      SELECT indexname, tablename
      FROM pg_indexes 
      WHERE schemaname = 'public' 
      AND tablename IN ('users', 'suggestions', 'lottery_results', 'prizes')
      ORDER BY tablename, indexname
    `);

    console.log('\n📊 Indexes found:');
    indexesResult.rows.forEach(r => console.log(`  ✓ ${r.tablename}.${r.indexname}`));

    // Check constraints
    const constraintsResult = await pool.query(`
      SELECT conname, contype, pg_get_constraintdef(oid) as definition
      FROM pg_constraint
      WHERE conrelid IN (
        SELECT oid FROM pg_class WHERE relname IN ('users', 'suggestions', 'lottery_results', 'prizes')
      )
      ORDER BY conname
    `);

    console.log('\n🔒 Constraints found:');
    constraintsResult.rows.forEach(r => {
      const type = r.contype === 'p' ? 'PRIMARY KEY' : 
                   r.contype === 'f' ? 'FOREIGN KEY' : 
                   r.contype === 'u' ? 'UNIQUE' : 
                   r.contype;
      console.log(`  ✓ ${r.conname} (${type})`);
    });

    console.log('\n✅ Schema validation complete!');
    console.log('\n📈 Summary:');
    console.log(`  - Tables: ${tables.length}`);
    console.log(`  - Indexes: ${indexesResult.rows.length}`);
    console.log(`  - Constraints: ${constraintsResult.rows.length}`);
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

verifyTables();
