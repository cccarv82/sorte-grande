# Story 1.4: Configure NextAuth v5 Magic Link

**Epic:** Epic 1 - Foundation & Project Setup  
**Story ID:** 1.4  
**Status:** drafted  
**Created:** 2025-12-01  
**Author:** Carlos

---

## User Story

**Como** usuário  
**Quero** autenticar via magic link enviado por email  
**Para que** possa acessar a plataforma de sugestões de loteria de forma segura sem senhas

---

## Requirements Context

### Source Documents
- **Tech Spec:** `docs/sprint-artifacts/tech-spec-epic-1.md` (Authentication section, NextAuth configuration)
- **Architecture:** `docs/architecture.md` (ADR-003: NextAuth vs Clerk)
- **Epics Detailed:** `docs/epics-detailed.md` (Epic 1, Story 1.4 - NextAuth configuration)
- **Previous Story:** `docs/sprint-artifacts/1-3-define-database-schema.md` (users table available)

### Business Context
O Sorte Grande usa autenticação passwordless via magic link para reduzir fricção no onboarding e aumentar segurança (sem senhas para gerenciar). NextAuth v5 foi escolhido por ser open-source, self-hosted (data ownership), com magic link nativo e integração perfeita com Next.js App Router. Resend transporta os emails com alta deliverability e experiência de desenvolvedor superior ao AWS SES.

### Technical Context
- **Auth Framework:** NextAuth v5 (Auth.js) com JWT session strategy
- **Email Provider:** Resend (magic link delivery)
- **Database Adapter:** DrizzleAdapter com users table do Story 1.3
- **Session Duration:** 30 dias (JWT refresh automático)
- **Magic Link Expiration:** 15 minutos (padrão NextAuth)
- **Security:** HttpOnly cookies, CSRF protection, HS256 JWT signing

### Key Requirements
1. Instalar next-auth@beta (v5) e resend como dependências
2. Criar conta Resend, verificar domínio e gerar API key
3. Configurar NextAuth com EmailProvider + Resend transport
4. Criar DrizzleAdapter para integrar com users table
5. Implementar API route `/api/auth/[...nextauth]/route.ts`
6. Adicionar NEXTAUTH_SECRET e RESEND_API_KEY ao .env.local
7. Configurar middleware para proteger rotas autenticadas
8. Testar fluxo completo: request link → receber email → clicar → autenticado

---

## Learnings from Previous Story

**From Story 1-3-define-database-schema (Status: done)**

**Available Infrastructure:**
- ✅ **Users Table:** `lib/db/schema.ts` - NextAuth v5 compatible (id: text UUID, email unique, emailVerified timestamp)
- ✅ **Database Connection:** `lib/db/index.ts` - Use `getDbConnection()` singleton Pool
- ✅ **TypeScript Types:** `types/database.ts` - Exported types (Lottery, SuggestionStatus, etc.)
- ✅ **Drizzle ORM Configured:** drizzle.config.ts with schema path, DATABASE_URL from .env.local
- ✅ **Migration System:** drizzle-kit installed with npm scripts (db:generate, db:push, db:validate)

**Key Patterns Established:**
- Users table designed for NextAuth: id (text UUID), email (unique), emailVerified (nullable timestamp), createdAt
- CASCADE delete for LGPD compliance: users → suggestions → prizes (data removal on account deletion)
- Environment variables in .env.local (never committed)
- TypeScript strict mode with 0 compilation errors
- Documentation pattern: README.md with comprehensive sections (commands, examples, resources)

**Technical Decisions:**
- Drizzle ORM for type-safety (ADR-002)
- PostgreSQL arrays for lottery numbers (native types)
- JSONB for semi-structured data (games, prizes)
- Centavos (integers) for monetary values (avoid floating-point errors)
- Text enums for flexibility (no ALTER TYPE migrations)

**Database Schema Details:**
- **users table fields:** id (text PK), email (text unique NOT NULL), name (text nullable), emailVerified (timestamp nullable), image (text nullable), createdAt (timestamp default now)
- **users table indexes:** idx_users_email (optimizes login queries WHERE email = ?)
- **Foreign key pattern:** CASCADE delete from users → suggestions (onDelete: 'cascade')
- **LGPD compliance:** Complete user data removal via CASCADE delete chain

**Important Notes:**
- Users table is READY for NextAuth DrizzleAdapter integration (no schema changes needed)
- Email index already exists (optimizes NextAuth email lookups)
- emailVerified field tracks magic link confirmation (set by NextAuth on successful verification)
- Connection pooling handled by Neon (max 10 connections configured in Story 1.2)

**Recommendations for This Story:**
- Use DrizzleAdapter with existing users table (DO NOT recreate schema)
- Follow same security patterns (.env.local for secrets, no hardcoded credentials)
- Leverage TypeScript strict mode for NextAuth type safety
- Add integration tests for CASCADE delete behavior (when user account deleted via NextAuth)
- Use tsx for any auth-related scripts (consistency with database scripts)

**File Locations:**
- Users table: `app/lib/db/schema.ts` (lines 18-34)
- Database connection: `app/lib/db/index.ts` (getDbConnection(), closeDbConnection())
- TypeScript types: `app/types/database.ts`
- Environment template: `app/.env.example` (add NEXTAUTH_SECRET, RESEND_API_KEY)

[Source: docs/sprint-artifacts/1-3-define-database-schema.md#Dev-Agent-Record, #Senior-Developer-Review]

---

## Project Structure Alignment

### Expected File Structure (After Story Completion)
```
app/
├── lib/
│   ├── auth/
│   │   ├── config.ts               # [NEW] NextAuth configuration
│   │   ├── adapter.ts              # [NEW] DrizzleAdapter wrapper
│   │   └── index.ts                # [NEW] Export auth helpers
│   ├── db/
│   │   ├── schema.ts               # [EXISTS] Users table from Story 1.3
│   │   └── index.ts                # [EXISTS] Database connection
│   ├── email/
│   │   ├── sender.ts               # [NEW] Resend client wrapper
│   │   └── templates/              # [NEW] Email templates directory
│   │       └── magic-link.tsx      # [NEW] React Email template (optional for now)
├── api/
│   └── auth/
│       └── [...nextauth]/
│           └── route.ts            # [NEW] NextAuth API handler
├── middleware.ts                   # [NEW] Route protection middleware
├── types/
│   ├── database.ts                 # [EXISTS] From Story 1.3
│   └── next-auth.d.ts              # [NEW] NextAuth session type augmentation
├── .env.local                      # [MODIFIED] Add NEXTAUTH_SECRET, RESEND_API_KEY
├── .env.example                    # [MODIFIED] Add auth environment variables
├── package.json                    # [MODIFIED] Add next-auth@beta, resend, @auth/drizzle-adapter
└── README.md                       # [MODIFIED] Add Authentication section
```

### Integration Points
- **Upstream Dependency:** Story 1.3 (users table) ✅ Done
- **Downstream Consumers:** 
  - Story 2.1 (Login Page - requires NextAuth signIn() function)
  - Story 2.2 (Verification Page - requires NextAuth session)
  - Story 2.4 (Session Management - requires middleware)
  - Story 2.5 (Logout - requires NextAuth signOut() function)
  - All Epic 3+ stories (protected routes, user context)
- **Parallel Stories:** None (Stories 1.5-1.6 UI components can proceed in parallel but won't integrate yet)

### Patterns to Follow
- Use `lib/auth/config.ts` for centralized NextAuth configuration
- Export `auth()` helper from `lib/auth/index.ts` for session access
- Create `lib/email/sender.ts` for Resend client (reusable for future emails)
- Add type augmentation in `types/next-auth.d.ts` (extend Session with user.id)
- Follow Story 1.3 pattern: comprehensive README section with examples

---

## Acceptance Criteria

### AC1: NextAuth v5 and Resend Installed
- [ ] `next-auth@beta` installed (v5.0.0-beta.25 or latest stable v5)
- [ ] `resend` installed as runtime dependency (npm install resend)
- [ ] `@auth/drizzle-adapter` installed for database integration
- [ ] TypeScript compiles without errors (npx tsc --noEmit)
- [ ] package.json contains all 3 dependencies with correct versions

### AC2: Resend Configured and API Key Obtained
- [ ] Resend account created at https://resend.com
- [ ] API key generated from Resend dashboard
- [ ] Domain verified (or use resend.dev subdomain for testing)
- [ ] RESEND_API_KEY added to .env.local
- [ ] RESEND_API_KEY added to .env.example (with placeholder value)
- [ ] Test email sent successfully via Resend API (verification script)

### AC3: NextAuth Configuration Created
- [ ] `lib/auth/config.ts` created with NextAuth configuration
- [ ] EmailProvider configured with Resend transport
- [ ] DrizzleAdapter configured with users table from Story 1.3
- [ ] JWT session strategy configured (30 days maxAge)
- [ ] Session callback extends session with user.id
- [ ] Magic link expiration set to 15 minutes (default)
- [ ] NEXTAUTH_SECRET generated and added to .env.local (openssl rand -base64 32)

### AC4: NextAuth API Route Implemented
- [ ] `app/api/auth/[...nextauth]/route.ts` created
- [ ] Exports GET and POST handlers from NextAuth
- [ ] Route handles all NextAuth endpoints: /api/auth/signin, /api/auth/callback, /api/auth/signout, /api/auth/session
- [ ] API route accessible via http://localhost:3000/api/auth/signin (returns NextAuth UI)

### AC5: DrizzleAdapter Integrated with Users Table
- [ ] `lib/auth/adapter.ts` created with DrizzleAdapter wrapper
- [ ] Adapter uses existing `getDbConnection()` from Story 1.2
- [ ] Adapter references `users` table from `lib/db/schema.ts`
- [ ] No new database tables created (uses existing users table)
- [ ] emailVerified timestamp updated on successful magic link verification

### AC6: Auth Helper Functions Exported
- [ ] `lib/auth/index.ts` created
- [ ] Exports `auth()` function for server-side session access
- [ ] Exports `signIn()` and `signOut()` functions for client components
- [ ] Type-safe: Session type includes user.id (via type augmentation)
- [ ] Helper functions importable: `import { auth, signIn, signOut } from '@/lib/auth'`

### AC7: Protected Routes Middleware Configured
- [ ] `middleware.ts` created at project root
- [ ] Middleware uses NextAuth `auth()` to check session
- [ ] Protected routes defined: /dashboard/*, /suggestions/*, /profile/*
- [ ] Public routes allowed: /, /login, /verify, /api/auth/*
- [ ] Unauthenticated users redirected to /login
- [ ] Middleware matcher configured correctly (config.matcher)

### AC8: Magic Link Flow Tested End-to-End
- [ ] User can request magic link via NextAuth signIn('email', { email: 'test@example.com' })
- [ ] Email received in inbox (or Resend logs for testing)
- [ ] Magic link contains valid token
- [ ] Clicking magic link authenticates user
- [ ] Session created with user.id and email
- [ ] Session persists across page refreshes (JWT cookie)
- [ ] Session expires after 30 days or on signOut()

---

## Tasks & Subtasks

### Task 1: Install NextAuth v5 and Dependencies
**Owner:** Developer  
**Estimated Effort:** 5 min

#### Subtasks:
1. [ ] Navigate: `cd app`
2. [ ] Install NextAuth v5 beta: `npm install next-auth@beta`
3. [ ] Install Resend: `npm install resend`
4. [ ] Install Drizzle Adapter: `npm install @auth/drizzle-adapter`
5. [ ] Verify package.json contains:
   ```json
   "dependencies": {
     "next-auth": "^5.0.0-beta.25", // Or latest v5 stable
     "resend": "^4.0.0",            // Or latest stable
     "@auth/drizzle-adapter": "^1.0.0" // Or latest stable
   }
   ```
6. [ ] Run TypeScript check: `npx tsc --noEmit` (should have 0 errors)

**Success Criteria:** All 3 packages installed, TypeScript compiles

**Notes:**
- NextAuth v5 is still in beta (as of Dec 2025) - use latest beta version
- If v5 stable released, prefer stable over beta
- Resend is lightweight (~5KB) compared to AWS SES SDK

---

### Task 2: Setup Resend Account and API Key
**Owner:** Developer  
**Estimated Effort:** 10 min

#### Subtasks:
1. [ ] Create Resend account: https://resend.com/signup
2. [ ] Verify email address
3. [ ] Navigate to API Keys section
4. [ ] Generate new API key (name: "Sorte Grande Dev")
5. [ ] Copy API key (starts with `re_...`)
6. [ ] Add to .env.local:
   ```bash
   # Resend Email Service
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
7. [ ] Update .env.example:
   ```bash
   # Resend Email Service
   RESEND_API_KEY=re_your_resend_api_key_here
   ```
8. [ ] (Optional) Verify domain for production:
   - Add DNS records (SPF, DKIM, DMARC)
   - For development, use `onboarding@resend.dev` from address (no verification needed)

**Success Criteria:** RESEND_API_KEY in .env.local, Resend account active

**Notes:**
- Free tier: 100 emails/day (sufficient for development)
- Production: Verify custom domain for higher limits
- Test emails sent from onboarding@resend.dev (free tier) or your-domain.com (verified)

---

### Task 3: Generate NEXTAUTH_SECRET
**Owner:** Developer  
**Estimated Effort:** 2 min

#### Subtasks:
1. [ ] Generate secret with OpenSSL:
   ```bash
   openssl rand -base64 32
   ```
2. [ ] Copy generated string (32 bytes base64-encoded)
3. [ ] Add to .env.local:
   ```bash
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_generated_secret_here
   ```
4. [ ] Update .env.example:
   ```bash
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
   ```

**Success Criteria:** NEXTAUTH_SECRET in .env.local (32+ characters)

**Notes:**
- NEXTAUTH_SECRET used for JWT signing (HS256 algorithm)
- Never commit actual secret to git (use .env.example placeholders)
- Generate different secrets for dev/staging/production

---

### Task 4: Create NextAuth Configuration
**Owner:** Developer  
**Estimated Effort:** 20 min

#### Subtasks:
1. [ ] Create directory: `mkdir -p lib/auth`
2. [ ] Create file: `app/lib/auth/config.ts`:
```typescript
import NextAuth from 'next-auth'
import type { NextAuthConfig } from 'next-auth'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { Resend } from 'resend'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'

const resend = new Resend(process.env.RESEND_API_KEY!)

export const authConfig: NextAuthConfig = {
  adapter: DrizzleAdapter(db, {
    usersTable: users,
  }),
  
  providers: [
    {
      id: 'email',
      type: 'email',
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      maxAge: 15 * 60, // Magic link expires in 15 minutes
      async sendVerificationRequest({ identifier: email, url }) {
        try {
          await resend.emails.send({
            from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
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
          })
        } catch (error) {
          console.error('❌ Failed to send magic link email:', error)
          throw error
        }
      },
    },
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      return session
    },
  },

  pages: {
    signIn: '/login',
    verifyRequest: '/verify',
    error: '/error', // Error code passed in query string: ?error=
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
```
3. [ ] Add JSDoc comments explaining configuration
4. [ ] Run TypeScript check: `npx tsc --noEmit`

**Success Criteria:** NextAuth config created, no TypeScript errors

**Notes:**
- EmailProvider uses Resend for email delivery
- DrizzleAdapter uses existing users table (no new tables)
- Session callback adds user.id to session for easy access
- HTML email template is inline (React Email template optional for future)

---

### Task 5: Create DrizzleAdapter Wrapper
**Owner:** Developer  
**Estimated Effort:** 10 min

#### Subtasks:
1. [ ] Create file: `app/lib/auth/adapter.ts`:
```typescript
import { drizzle } from 'drizzle-orm/node-postgres'
import { getDbConnection } from '@/lib/db'

/**
 * Drizzle database instance for NextAuth adapter
 * Uses existing connection pool from Story 1.2
 */
export const db = drizzle(getDbConnection())
```
2. [ ] Update `lib/auth/config.ts` to import db from adapter:
```typescript
import { db } from './adapter'
```
3. [ ] Add JSDoc explaining connection reuse pattern

**Success Criteria:** Adapter uses existing connection pool

**Notes:**
- Reuses getDbConnection() singleton from Story 1.2 (no duplicate pools)
- DrizzleAdapter automatically queries users table
- No additional tables needed (NextAuth v5 Adapter uses users table only)

---

### Task 6: Create Auth Helper Exports
**Owner:** Developer  
**Estimated Effort:** 5 min

#### Subtasks:
1. [ ] Create file: `app/lib/auth/index.ts`:
```typescript
/**
 * NextAuth v5 Authentication Helpers
 * 
 * Exports:
 * - auth(): Server-side session access (use in Server Components, API routes, Server Actions)
 * - signIn(): Trigger authentication (use in Client Components)
 * - signOut(): End session (use in Client Components)
 * 
 * Usage:
 * ```typescript
 * // Server Component
 * import { auth } from '@/lib/auth'
 * const session = await auth()
 * 
 * // Client Component
 * 'use client'
 * import { signIn } from '@/lib/auth'
 * <button onClick={() => signIn('email', { email: 'user@example.com' })}>Login</button>
 * ```
 */
export { auth, signIn, signOut, handlers } from './config'
```
2. [ ] Add comprehensive JSDoc with usage examples
3. [ ] Test imports: Create dummy file to verify imports resolve

**Success Criteria:** Auth helpers importable from `@/lib/auth`

**Notes:**
- Centralized exports for consistency
- JSDoc examples help developers use correctly
- `handlers` exported for API route usage

---

### Task 7: Create NextAuth API Route
**Owner:** Developer  
**Estimated Effort:** 5 min

#### Subtasks:
1. [ ] Create directory: `mkdir -p app/api/auth/[...nextauth]`
2. [ ] Create file: `app/api/auth/[...nextauth]/route.ts`:
```typescript
/**
 * NextAuth v5 API Route Handler
 * 
 * Handles all authentication endpoints:
 * - GET  /api/auth/signin        - Sign in page
 * - POST /api/auth/signin/email  - Request magic link
 * - GET  /api/auth/callback/email - Magic link callback
 * - POST /api/auth/signout       - Sign out
 * - GET  /api/auth/session       - Get session
 * - GET  /api/auth/csrf          - CSRF token
 * 
 * NextAuth automatically handles all routes via [...nextauth] catch-all.
 */
import { handlers } from '@/lib/auth'

export const { GET, POST } = handlers
```
3. [ ] Add JSDoc explaining available endpoints
4. [ ] Test API route: Navigate to http://localhost:3000/api/auth/signin (should render NextAuth UI)

**Success Criteria:** API route accessible, NextAuth UI renders

**Notes:**
- [...nextauth] catch-all handles all NextAuth routes automatically
- No additional configuration needed (NextAuth manages routing)

---

### Task 8: Add NextAuth Session Type Augmentation
**Owner:** Developer  
**Estimated Effort:** 5 min

#### Subtasks:
1. [ ] Create file: `app/types/next-auth.d.ts`:
```typescript
import { DefaultSession } from 'next-auth'

/**
 * Extend NextAuth Session type to include user.id
 * 
 * Usage:
 * ```typescript
 * const session = await auth()
 * console.log(session?.user?.id) // string (UUID)
 * ```
 */
declare module 'next-auth' {
  interface Session {
    user: {
      id: string // UUID from users table
    } & DefaultSession['user']
  }
}
```
2. [ ] Ensure tsconfig.json includes `types/` directory (should already be included via `include: ["**/*.ts", "**/*.tsx"]`)
3. [ ] Run TypeScript check: `npx tsc --noEmit`

**Success Criteria:** session.user.id typed as string, no TypeScript errors

**Notes:**
- Type augmentation allows TypeScript to know session.user.id exists
- id comes from users.id (text UUID) from Story 1.3 schema

---

### Task 9: Create Route Protection Middleware
**Owner:** Developer  
**Estimated Effort:** 15 min

#### Subtasks:
1. [ ] Create file: `app/middleware.ts`:
```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

/**
 * NextAuth Middleware - Protects authenticated routes
 * 
 * Protected routes: /dashboard/*, /suggestions/*, /profile/*
 * Public routes: /, /login, /verify, /api/auth/*
 * 
 * Unauthenticated users redirected to /login
 */
export async function middleware(request: NextRequest) {
  const session = await auth()
  const { pathname } = request.nextUrl

  // Protected route patterns
  const protectedRoutes = ['/dashboard', '/suggestions', '/profile']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // Redirect unauthenticated users
  if (isProtectedRoute && !session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname) // Redirect back after login
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
}
```
2. [ ] Add JSDoc explaining protected vs public routes
3. [ ] Test middleware: Navigate to /dashboard (should redirect to /login)
4. [ ] Verify public routes accessible: /, /login, /verify, /api/auth/*

**Success Criteria:** Middleware redirects unauthenticated users, public routes accessible

**Notes:**
- Middleware runs on Edge runtime (fast, globally distributed)
- callbackUrl preserves intended destination after login
- Matcher excludes static files for performance

---

### Task 10: Test Magic Link Flow End-to-End
**Owner:** Developer  
**Estimated Effort:** 15 min

#### Subtasks:
1. [ ] Start development server: `npm run dev`
2. [ ] Create test script: `app/lib/auth/test-magic-link.ts`:
```typescript
import { signIn } from '@/lib/auth'

async function testMagicLink() {
  console.log('🧪 Testing magic link flow...\n')

  const testEmail = 'test@example.com'

  try {
    console.log(`📧 Requesting magic link for ${testEmail}...`)
    
    // This would normally be called from a client component
    // For testing, we'll simulate the API call
    const response = await fetch('http://localhost:3000/api/auth/signin/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail }),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    console.log('✅ Magic link request sent!')
    console.log('📬 Check Resend dashboard for email logs')
    console.log('🔗 Click magic link to authenticate')
  } catch (error) {
    console.error('❌ Test failed:', error)
    process.exit(1)
  }
}

testMagicLink()
```
3. [ ] Run test script: `npx tsx lib/auth/test-magic-link.ts`
4. [ ] Check Resend dashboard for email logs: https://resend.com/emails
5. [ ] Verify email contains:
   - Subject: "Login no Sorte Grande"
   - Gradient button with link
   - Expiration notice (15 minutes)
6. [ ] Click magic link in email (or copy URL)
7. [ ] Verify redirected to callback URL
8. [ ] Check session: Navigate to http://localhost:3000/api/auth/session
9. [ ] Verify JSON response contains:
   ```json
   {
     "user": {
       "id": "uuid-here",
       "email": "test@example.com"
     },
     "expires": "2025-12-31T..."
   }
   ```
10. [ ] Test session persistence: Refresh page, check session still active
11. [ ] Test signOut: Call signOut() or navigate to /api/auth/signout
12. [ ] Verify session cleared: /api/auth/session returns `null`

**Success Criteria:** Complete flow works (request → email → click → authenticated → signOut)

**Notes:**
- First magic link may take 30-60 seconds (Resend cold start)
- Check Resend logs if email not received
- Magic link URL format: `/api/auth/callback/email?token=...&email=...`
- Session stored in HTTP-only cookie (not accessible via JavaScript)

---

### Task 11: Update Documentation
**Owner:** Developer  
**Estimated Effort:** 15 min

#### Subtasks:
1. [ ] Open `app/README.md`
2. [ ] Add "Authentication" section after "Database Schema":
```markdown
## Authentication

This project uses [NextAuth v5](https://authjs.dev) for passwordless authentication via magic link.

### Authentication Flow

**1. User requests magic link:**
```typescript
import { signIn } from '@/lib/auth'

// Client Component
<button onClick={() => signIn('email', { email: 'user@example.com' })}>
  Send Magic Link
</button>
```

**2. User receives email (via Resend):**
- Subject: "Login no Sorte Grande"
- Magic link expires in 15 minutes

**3. User clicks link and is authenticated:**
- Session created with JWT (30 days)
- Session stored in HTTP-only cookie

**4. Access session in Server Components:**
```typescript
import { auth } from '@/lib/auth'

export default async function Dashboard() {
  const session = await auth()
  
  if (!session) {
    redirect('/login')
  }

  return <div>Welcome, {session.user.email}!</div>
}
```

**5. Sign out:**
```typescript
import { signOut } from '@/lib/auth'

// Client Component
<button onClick={() => signOut()}>Sign Out</button>
```

### Protected Routes

The following routes require authentication (configured in `middleware.ts`):
- `/dashboard/*` - User dashboard
- `/suggestions/*` - Lottery suggestions
- `/profile/*` - User profile

Unauthenticated users are redirected to `/login` with `callbackUrl` parameter.

### Configuration

**Environment Variables:**
```bash
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here  # Generate with: openssl rand -base64 32

# Resend (Email)
RESEND_API_KEY=re_your_resend_api_key
EMAIL_FROM=onboarding@resend.dev  # Or your-domain.com after verification
```

### Testing Authentication

**Manual test:**
1. Start dev server: `npm run dev`
2. Navigate to http://localhost:3000/api/auth/signin
3. Enter email and click "Send magic link"
4. Check email inbox (or Resend logs)
5. Click magic link to authenticate

**Check session:**
```bash
curl http://localhost:3000/api/auth/session
```

### Resources

- [NextAuth v5 Documentation](https://authjs.dev/getting-started/introduction)
- [NextAuth Drizzle Adapter](https://authjs.dev/reference/adapter/drizzle)
- [Resend Documentation](https://resend.com/docs)
- [Magic Link Best Practices](https://postmarkapp.com/guides/magic-links)
```
3. [ ] Save file
4. [ ] Review formatting and links
5. [ ] Commit documentation: `git add README.md && git commit -m "docs: add NextAuth authentication documentation"`

**Success Criteria:** README has complete Authentication section with examples and resources

---

## Dev Notes

### Implementation Guidance

**Critical Paths:**
```bash
# From app directory
npm install next-auth@beta resend @auth/drizzle-adapter  # 1. Install packages
openssl rand -base64 32                                   # 2. Generate NEXTAUTH_SECRET
# Create Resend account, get API key                     # 3. Setup Resend
# Add NEXTAUTH_SECRET and RESEND_API_KEY to .env.local  # 4. Configure env
# Create lib/auth/config.ts                              # 5. NextAuth config
# Create app/api/auth/[...nextauth]/route.ts            # 6. API route
# Create middleware.ts                                   # 7. Route protection
npm run dev                                               # 8. Test magic link
```

**Key Files:**
- `lib/auth/config.ts` - NextAuth configuration (EmailProvider, DrizzleAdapter, session callback)
- `lib/auth/index.ts` - Centralized exports (auth, signIn, signOut)
- `app/api/auth/[...nextauth]/route.ts` - NextAuth API handler
- `middleware.ts` - Protected route enforcement
- `types/next-auth.d.ts` - Session type augmentation (user.id)

### Testing Strategy

**Manual Testing (Required):**
1. Magic link request: signIn('email', { email: 'test@example.com' })
2. Email delivery: Check Resend dashboard logs
3. Email content: Verify subject, gradient button, expiration notice
4. Magic link click: Redirect to callback, session created
5. Session persistence: Refresh page, session still active
6. Protected routes: Navigate to /dashboard (redirect to /login)
7. Sign out: signOut(), session cleared

**Integration Tests (Future - Story 2.1+):**
- Use Playwright + Mailosaur for E2E magic link testing
- Test expired link rejection (15+ minutes old)
- Test already-used link rejection
- Test rapid successive link requests (rate limiting)
- Test CASCADE delete: delete user → verify suggestions deleted

**No automated tests for this story** - Magic link flow requires email integration (complex to mock).

### Edge Cases & Gotchas

1. **Magic Link Expiration:**
   - Links expire after 15 minutes (NextAuth default)
   - Expired links show error: "Link has expired"
   - User must request new link (no refresh mechanism)

2. **Email Deliverability:**
   - Free tier emails may land in spam (no domain verification)
   - Production: Verify domain in Resend (SPF, DKIM, DMARC records)
   - Test with multiple email providers (Gmail, Outlook, Yahoo)

3. **Session vs Database:**
   - NextAuth v5 with JWT stores session in cookie (NOT in database)
   - No sessions or verificationTokens tables needed (unlike NextAuth v4)
   - emailVerified timestamp still written to users table on successful magic link verification

4. **DrizzleAdapter Tables:**
   - Adapter only needs users table (no accounts, sessions, verificationTokens)
   - This is a breaking change from NextAuth v4 (which required 4 tables)
   - Verify Adapter version supports JWT-only mode: `@auth/drizzle-adapter@^1.0.0`

5. **Middleware Edge Runtime:**
   - Middleware runs on Vercel Edge (not Node.js runtime)
   - Cannot use Node.js APIs (fs, crypto, etc.)
   - Use `auth()` from NextAuth (Edge-compatible)

6. **Email HTML Limitations:**
   - Inline CSS only (no external stylesheets)
   - Limited font support (web-safe fonts)
   - Test across email clients (Gmail, Outlook, Apple Mail)
   - Consider React Email library for future (Story 2.3)

### Technical Debt / Future Work

- [ ] **React Email Templates:** Create reusable email templates with React Email (Story 2.3)
- [ ] **Email Rate Limiting:** Prevent abuse (max 5 emails per hour per email address)
- [ ] **Integration Tests:** Add Playwright + Mailosaur tests for magic link flow (Story 2.1+)
- [ ] **Session Refresh:** Implement automatic JWT refresh before 30-day expiration
- [ ] **Account Linking:** Support multiple auth providers (Google OAuth) in post-MVP
- [ ] **Audit Logging:** Track login/logout events (security compliance) in Epic 10

### Citations

- [NextAuth v5 Documentation](https://authjs.dev/getting-started/introduction)
- [NextAuth Drizzle Adapter](https://authjs.dev/reference/adapter/drizzle)
- [Resend Documentation](https://resend.com/docs/send-with-nextjs)
- [Magic Link Best Practices](https://postmarkapp.com/guides/magic-links)
- Tech Spec Section: Authentication (Lines 359-378), Data Models (Lines 163-254)
- Architecture: ADR-003 NextAuth vs Clerk
- Previous Story: Story 1.3 - Define Database Schema (users table available)

---

## Change Log

| Date | Author | Changes |
|------|--------|---------|
| 2025-12-01 | Carlos | Initial story creation via *create-story workflow |

---

## Dev Agent Record

### Context Reference
- **Context XML:** Will be generated via `*gen-story-context` after story is marked ready-for-dev
- **Dependencies:** Story 1.3 (users table), Resend account, NEXTAUTH_SECRET generation

### Completion Notes
[To be filled during implementation]

### Debug Log References
[To be filled during implementation]

### File List
[To be filled during implementation]

---

## Senior Developer Review (AI)

**Reviewer:** [To be assigned]  
**Date:** [To be filled during review]  
**Outcome:** [To be determined]

[Review will be conducted after implementation]
