import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Verify authorization token
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Extract token from "Bearer <token>" format
  const token = authHeader.replace('Bearer ', '').trim()
  const expectedSecret = process.env.CRON_SECRET?.trim()

  if (!expectedSecret) {
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    )
  }

  if (token !== expectedSecret) {
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
