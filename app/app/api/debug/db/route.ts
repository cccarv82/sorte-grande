import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function GET() {
  try {
    const dbUrl = process.env.DATABASE_URL;
    
    if (!dbUrl) {
      return NextResponse.json({ 
        error: 'DATABASE_URL not configured',
        env: Object.keys(process.env).filter(k => k.includes('DATA'))
      }, { status: 500 });
    }

    const pool = new Pool({ 
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false }
    });

    // Test connection
    const result = await pool.query('SELECT NOW()');
    
    // Check if tables exist
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    await pool.end();

    return NextResponse.json({
      success: true,
      timestamp: result.rows[0].now,
      database_url_exists: true,
      database_url_preview: dbUrl.substring(0, 50) + '...',
      tables: tablesResult.rows.map(r => r.table_name)
    });

  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      code: error.code,
      detail: error.detail,
      database_url_exists: !!process.env.DATABASE_URL
    }, { status: 500 });
  }
}
