/**
 * NextAuth v5 API Route Handler
 * 
 * Handles all authentication endpoints via catch-all route [...nextauth].
 * NextAuth automatically manages routing for all auth-related requests.
 * 
 * ## Available Endpoints
 * 
 * - **GET  /api/auth/signin**        - Sign in page (NextAuth UI)
 * - **POST /api/auth/signin/email**  - Request magic link
 * - **GET  /api/auth/callback/email** - Magic link callback
 * - **POST /api/auth/signout**       - Sign out
 * - **GET  /api/auth/session**       - Get session (returns JSON)
 * - **GET  /api/auth/csrf**          - CSRF token
 * - **GET  /api/auth/providers**     - Available providers
 * 
 * ## How it works
 * 
 * The [...nextauth] catch-all route captures all requests to /api/auth/*
 * and delegates them to NextAuth's internal routing system. The handlers
 * object contains GET and POST methods that NextAuth uses to process
 * different authentication flows.
 * 
 * ## Security
 * 
 * - CSRF protection enabled by default
 * - HttpOnly cookies prevent XSS attacks
 * - Magic links expire after 15 minutes
 * - JWT tokens signed with NEXTAUTH_SECRET (HS256)
 * 
 * @see https://authjs.dev/reference/nextjs
 */
import { handlers } from '@/lib/auth'

export const GET = handlers.GET
export const POST = handlers.POST
