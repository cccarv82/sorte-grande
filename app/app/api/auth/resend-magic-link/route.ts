import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { neon } from '@neondatabase/serverless'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY?.trim())

/**
 * Custom API route for sending/resending magic link
 * 
 * This bypasses NextAuth's EmailProvider to avoid the SMTP split error
 * while keeping the same verification token flow compatible with NextAuth.
 */
export async function POST(request: NextRequest) {
  try {
    console.log('📧 Resend magic link API called')
    console.log('📧 Content-Type:', request.headers.get('content-type'))
    
    const body = await request.json().catch((e) => {
      console.error('❌ Failed to parse JSON body:', e)
      return null
    })

    console.log('📧 Request body:', body)

    if (!body || !body.email) {
      console.error('❌ Email is missing from request body')
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const { email } = body

    if (typeof email !== 'string') {
      console.error('❌ Email is not a string:', typeof email)
      return NextResponse.json(
        { error: 'Email must be a string' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.error('❌ Invalid email format:', email)
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    console.log('📧 Magic link requested for:', email)

    // Use direct Neon connection to avoid NextAuth issues
    const sql = neon(process.env.DATABASE_URL?.trim() || '')

    // Check if user exists, if not create
    let userId: string
    const existingUsers = await sql`SELECT id FROM users WHERE email = ${email}`
    
    if (existingUsers.length === 0) {
      const newUsers = await sql`
        INSERT INTO users (id, email, "emailVerified") 
        VALUES (${crypto.randomUUID()}, ${email}, NULL) 
        RETURNING id
      `
      userId = newUsers[0].id
      console.log('✅ New user created:', userId)
    } else {
      userId = existingUsers[0].id
      console.log('✅ Existing user found:', userId)
    }

    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    // Store token in database (delete old tokens first)
    await sql`DELETE FROM verification_tokens WHERE identifier = ${email}`
    await sql`
      INSERT INTO verification_tokens (identifier, token, expires) 
      VALUES (${email}, ${token}, ${expires.toISOString()})
    `
    console.log('✅ Verification token created')

    // Build magic link URL
    const baseUrl = (process.env.NEXTAUTH_URL?.trim() || 'http://localhost:3000').replace(/\r?\n/g, '')
    const callbackUrl = `${baseUrl}/api/auth/callback/email?token=${token}&email=${encodeURIComponent(email)}`

    console.log('📧 Callback URL:', callbackUrl.substring(0, 80) + '...')

    // Send email via Resend
    const from = (process.env.EMAIL_FROM || 'Sorte Grande <onboarding@resend.dev>').trim().replace(/\r?\n/g, '')
    
    console.log('📧 Sending from:', from)
    console.log('📧 Sending to:', email)

    const result = await resend.emails.send({
      from,
      to: email,
      subject: 'Login no Sorte Grande',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h1 style="color: #10b981; text-align: center;">Sorte Grande</h1>
          <p>Clique no link abaixo para entrar na plataforma:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${callbackUrl}" style="
              background: linear-gradient(135deg, #10b981, #34d399);
              color: #000;
              padding: 14px 28px;
              text-decoration: none;
              border-radius: 10px;
              font-weight: bold;
              display: inline-block;
            ">
              Entrar no Sorte Grande
            </a>
          </div>
          <p style="color: #999; font-size: 14px;">
            ⏱️ Este link expira em 15 minutos.
          </p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            Se você não solicitou este email, ignore esta mensagem.
          </p>
        </div>
      `,
    })

    if (result.error) {
      console.error('❌ Failed to send email:', result.error)
      return NextResponse.json(
        { error: result.error.message || 'Failed to send email' },
        { status: 500 }
      )
    }

    console.log('✅ Email sent successfully! ID:', result.data?.id)

    return NextResponse.json(
      { success: true, message: 'Magic link sent' },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Error in resend-magic-link:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
