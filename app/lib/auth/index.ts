/**
 * NextAuth v5 Authentication Helpers
 * 
 * Centralized exports for authentication functions and handlers.
 * 
 * ## Exports
 * 
 * - **auth()**: Server-side session access (use in Server Components, API routes, Server Actions)
 * - **signIn()**: Trigger authentication (use in Client Components)
 * - **signOut()**: End session (use in Client Components)
 * - **handlers**: API route handlers (use in app/api/auth/[...nextauth]/route.ts)
 * 
 * ## Usage Examples
 * 
 * ### Server Component
 * ```typescript
 * import { auth } from '@/lib/auth'
 * 
 * export default async function Dashboard() {
 *   const session = await auth()
 *   
 *   if (!session) {
 *     redirect('/login')
 *   }
 * 
 *   return <div>Welcome, {session.user.email}!</div>
 * }
 * ```
 * 
 * ### Client Component
 * ```typescript
 * 'use client'
 * import { signIn, signOut } from '@/lib/auth'
 * 
 * export function LoginButton() {
 *   return (
 *     <button onClick={() => signIn('email', { email: 'user@example.com' })}>
 *       Send Magic Link
 *     </button>
 *   )
 * }
 * 
 * export function LogoutButton() {
 *   return (
 *     <button onClick={() => signOut()}>
 *       Sign Out
 *     </button>
 *   )
 * }
 * ```
 * 
 * ### Middleware
 * ```typescript
 * import { auth } from '@/lib/auth'
 * 
 * export async function middleware(request: NextRequest) {
 *   const session = await auth()
 *   
 *   if (!session) {
 *     return NextResponse.redirect(new URL('/login', request.url))
 *   }
 *   
 *   return NextResponse.next()
 * }
 * ```
 * 
 * @module lib/auth
 */
export { auth, signIn, signOut, handlers } from './config'
