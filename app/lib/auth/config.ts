import NextAuth from 'next-auth'
import type { NextAuthConfig } from 'next-auth'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import EmailProvider from 'next-auth/providers/email'
import { Resend } from 'resend'
import { db } from './adapter'
import { users, accounts, sessions, verificationTokens } from '@/lib/db/schema'

const resend = new Resend(process.env.RESEND_API_KEY!)

/**
 * NextAuth v5 Configuration
 * 
 * Configures passwordless authentication via magic link using:
 * - EmailProvider with Resend for email delivery
 * - DrizzleAdapter with existing users table from Story 1.3
 * - JWT session strategy (30 days expiration)
 * 
 * Security features:
 * - HttpOnly cookies prevent XSS attacks
 * - CSRF protection built into NextAuth
 * - Magic links expire after 15 minutes
 * - HS256 JWT signing with NEXTAUTH_SECRET
 * 
 * @see https://authjs.dev/getting-started/introduction
 */
export const authConfig: NextAuthConfig = {
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  
  providers: [
    EmailProvider({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      maxAge: 15 * 60, // Magic link expires in 15 minutes
      
      /**
       * Send magic link email via Resend
       * 
       * @param identifier - User's email address
       * @param url - Magic link URL with token
       */
      async sendVerificationRequest({ identifier: email, url }) {
        // Validate required environment variables
        const apiKey = process.env.RESEND_API_KEY;
        const from = process.env.EMAIL_FROM || 'onboarding@resend.dev';
        
        if (!apiKey) {
          console.error('❌ RESEND_API_KEY is not defined');
          throw new Error('RESEND_API_KEY is not defined');
        }

        console.log('📧 Sending magic link to:', email);
        console.log('📧 From:', from);
        console.log('📧 URL:', url.substring(0, 50) + '...');

        try {
          const result = await resend.emails.send({
            from,
            to: email,
            subject: 'Login no Sorte Grande',
            html: `
              <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
                <h1 style="color: #10b981; text-align: center;">Sorte Grande</h1>
                <p>Clique no link abaixo para entrar na plataforma:</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${url}" style="
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
          });
          
          console.log('✅ Email sent successfully:', result);
        } catch (error) {
          console.error('❌ Failed to send magic link email:', error);
          throw error;
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    /**
     * Extend session with user.id from JWT token
     * 
     * NextAuth v5 with JWT strategy doesn't store sessions in database.
     * The user.id is extracted from the JWT token (token.sub) and added
     * to the session object for easy access in components.
     */
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      return session
    },
    
    /**
     * Authorize callback for route protection
     * 
     * Called by NextAuth middleware to determine if user can access route.
     * Returns true if authorized (has session), false otherwise.
     */
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const protectedRoutes = ['/dashboard', '/suggestions', '/profile']
      const isProtectedRoute = protectedRoutes.some(route => nextUrl.pathname.startsWith(route))
      
      if (isProtectedRoute && !isLoggedIn) {
        return false // Redirect to /login
      }
      
      return true // Allow access
    },
  },

  pages: {
    signIn: '/login',
    verifyRequest: '/verify',
    error: '/error', // Error code passed in query string: ?error=
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
