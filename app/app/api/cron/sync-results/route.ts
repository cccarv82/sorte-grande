import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Verify authorization token
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'No authorization header provided' },
      { status: 401 }
    )
  }

  // Extract token from "Bearer <token>" format
  const token = authHeader.replace('Bearer ', '').trim()
  const expectedSecret = process.env.CRON_SECRET?.trim()

  console.log('[CRON] Token length:', token.length, 'Expected length:', expectedSecret?.length)
  console.log('[CRON] Token first 10 chars:', token.substring(0, 10))
  console.log('[CRON] Expected first 10 chars:', expectedSecret?.substring(0, 10))

  if (!expectedSecret) {
    return NextResponse.json(
      { error: 'Server configuration error', message: 'CRON_SECRET not configured' },
      { status: 500 }
    )
  }

  if (token !== expectedSecret) {
    return NextResponse.json(
      { 
        error: 'Unauthorized', 
        message: 'Invalid token',
        debug: { tokenLen: token.length, expectedLen: expectedSecret.length }
      },
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
