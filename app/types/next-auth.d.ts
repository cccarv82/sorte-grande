import { DefaultSession } from 'next-auth'

/**
 * Extend NextAuth Session type to include user.id
 * 
 * By default, NextAuth's Session type only includes user.email, name, and image.
 * This type augmentation adds the user.id field (UUID from users table) to the
 * session object for easy access throughout the application.
 * 
 * ## Usage
 * 
 * ```typescript
 * import { auth } from '@/lib/auth'
 * 
 * const session = await auth()
 * 
 * if (session) {
 *   console.log(session.user.id)    // ✅ TypeScript knows this exists (string)
 *   console.log(session.user.email) // ✅ From DefaultSession
 *   console.log(session.user.name)  // ✅ Optional from DefaultSession
 * }
 * ```
 * 
 * ## How it works
 * 
 * The session callback in lib/auth/config.ts extracts user.id from the JWT
 * token (token.sub) and adds it to the session object. This type declaration
 * tells TypeScript that user.id will always be present in the session.
 * 
 * @see lib/auth/config.ts - session callback
 */
declare module 'next-auth' {
  interface Session {
    user: {
      /** User's UUID from users table (primary key) */
      id: string
    } & DefaultSession['user']
  }
}
