import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function GET() {
  try {
    // Check all required environment variables
    const envCheck = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      RESEND_API_KEY: !!process.env.RESEND_API_KEY,
      EMAIL_FROM: !!process.env.EMAIL_FROM,
      CRON_SECRET: !!process.env.CRON_SECRET,
    };

    const missing = Object.entries(envCheck)
      .filter(([_, exists]) => !exists)
      .map(([key]) => key);

    if (missing.length > 0) {
      return NextResponse.json({ 
        error: 'Missing environment variables',
        missing,
        env_check: envCheck
      }, { status: 500 });
    }

    const dbUrl = process.env.DATABASE_URL!;
    
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
      env_check: envCheck,
      database_url_preview: dbUrl.substring(0, 50) + '...',
      nextauth_url: process.env.NEXTAUTH_URL,
      email_from: process.env.EMAIL_FROM,
      tables: tablesResult.rows.map(r => r.table_name)
    });

  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      code: error.code,
      detail: error.detail,
      env_check: {
        DATABASE_URL: !!process.env.DATABASE_URL,
        NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
        NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
        RESEND_API_KEY: !!process.env.RESEND_API_KEY,
        EMAIL_FROM: !!process.env.EMAIL_FROM,
      }
    }, { status: 500 });
  }
}
