import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Verify authorization token
  const authHeader = request.headers.get('authorization')
  const expectedToken = `Bearer ${process.env.CRON_SECRET}`

  if (!authHeader || authHeader !== expectedToken) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    // TODO: Implement lottery results sync logic in future story
    console.log('[CRON] Lottery results sync triggered at:', new Date().toISOString())

    return NextResponse.json({
      success: true,
      message: 'Lottery results sync completed',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('[CRON] Error syncing lottery results:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
