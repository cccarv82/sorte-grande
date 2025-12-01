# Sorte Grande - Application

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Requirements

- **Node.js:** >= 20.9.0 (required for Next.js 16)
- **Package Manager:** npm (default)

Check your Node.js version:
```bash
node -v
```

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The development server uses **Turbopack** bundler (700x faster than Webpack) for instant hot reload.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Available Scripts

- **`npm run dev`** - Start development server with Turbopack (hot reload enabled)
- **`npm run build`** - Build optimized production bundle
- **`npm run start`** - Start production server (requires `npm run build` first)
- **`npm run lint`** - Run ESLint code quality checks
- **`npm run test:e2e`** - Run end-to-end tests with Playwright
- **`npm run test:e2e:ui`** - Run E2E tests in UI mode
- **`npm run test:e2e:debug`** - Run E2E tests in debug mode
- **`npm run db:generate`** - Generate Drizzle migration files from schema
- **`npm run db:push`** - Apply schema changes to database (development)
- **`npm run db:studio`** - Open Drizzle Studio GUI for data inspection
- **`npm run db:validate`** - Validate database schema integrity

## Database Setup

This project uses [Neon](https://neon.tech) serverless PostgreSQL.

### Prerequisites

- Neon account (free tier available)
- Database project "sorte-grande" created with 3 branches (production, staging, development)

### Environment Configuration

1. **Copy environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Get your DATABASE_URL from Neon:**
   - Go to: https://console.neon.tech/app/projects
   - Select project: **sorte-grande**
   - Select branch: **development**
   - Copy "Connection String"

3. **Update `.env.local` with your DATABASE_URL:**
   ```bash
   DATABASE_URL=postgresql://user:password@host.region.aws.neon.tech/dbname?sslmode=require
   ```

   **⚠️ Important:** Never commit `.env.local` to git - it contains sensitive credentials!

### Test Connection

Verify your database connection is working:

```bash
npx tsx lib/db/test-connection.ts
```

**Expected output:**
```
✅ Database connected successfully!
📅 Server time: [current timestamp]
🔗 Connection pool ready (max: 10 connections)
🐘 PostgreSQL version: PostgreSQL 17.x
```

### Troubleshooting

**Error: DATABASE_URL is not defined**
- Ensure `.env.local` exists in the project root (`app/.env.local`)
- Check the variable name is exactly `DATABASE_URL` (case-sensitive)
- Verify no quotes around the value in `.env.local`

**Error: Connection refused**
- Verify your connection string is correct
- Check that your Neon project is active (not paused)
- Ensure you copied the connection string from the correct branch (development)

**Error: SSL required**
- Neon requires SSL connections
- Ensure your DATABASE_URL includes `?sslmode=require`
- The connection helper handles SSL certificates automatically

**Error: Authentication failed**
- Check that you copied the complete connection string with password
- Verify the branch (development) is accessible
- Try regenerating the connection string in Neon dashboard

## Database Schema

This project uses [Drizzle ORM](https://orm.drizzle.team) for type-safe database queries and migrations.

### Schema Overview

The database has **4 tables**:

- **`users`** - User accounts (NextAuth v5 compatible)
- **`suggestions`** - Generated lottery suggestions with wheeling data
- **`lottery_results`** - Official lottery results synced from Caixa API
- **`prizes`** - Detected prizes from verified suggestions

### Working with Drizzle

**Generate migrations after schema changes:**
```bash
npm run db:generate
```

**Apply migrations to database:**
```bash
npm run db:push
```

**Validate schema is applied:**
```bash
npm run db:validate
```

**Open Drizzle Studio (GUI):**
```bash
npm run db:studio
```

### Schema Definition

Schema is defined in `lib/db/schema.ts` using Drizzle's declarative syntax with TypeScript:

```typescript
import { pgTable, serial, text, integer, timestamp, jsonb } from 'drizzle-orm/pg-core';

// Example: Users table
export const users = pgTable('users', {
  id: text('id').primaryKey(),           // UUID from NextAuth
  email: text('email').notNull().unique(),
  name: text('name'),
  emailVerified: timestamp('email_verified'),
  createdAt: timestamp('created_at').defaultNow(),
});
```

**Type-safe queries:**
```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { getDbConnection } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const pool = getDbConnection();
const db = drizzle(pool);

// TypeScript knows the exact shape of the result
const user = await db.select().from(users).where(eq(users.email, 'user@example.com'));
```

### Migrations

Migration files are auto-generated in the `drizzle/` directory and **should be committed to git**.

For production deployments, use connection pooling:
```bash
drizzle-kit migrate
```

**Note:** `drizzle-kit push` is convenient for development (applies schema directly), but migrations are better for production (version control + rollback capability).

### Resources

- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Drizzle with Neon](https://orm.drizzle.team/docs/get-started-postgresql#neon)
- [Schema Definition Guide](https://orm.drizzle.team/docs/sql-schema-declaration)
- [Drizzle Queries](https://orm.drizzle.team/docs/crud)

## Authentication

This project uses [NextAuth v5](https://authjs.dev/) (Auth.js) for authentication with **passwordless magic link** sign-in.

### Features

- **Email Magic Links:** Users receive a secure login link via email (no passwords needed)
- **JWT Sessions:** Stateless sessions with 30-day expiration
- **DrizzleAdapter:** Seamless integration with PostgreSQL database
- **Email Provider:** [Resend](https://resend.com/) SMTP transport for reliable email delivery
- **Type-Safe:** Full TypeScript support with session augmentation

### Setup

**1. Configure Environment Variables:**

Add to your `.env.local`:
```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here  # Generate with: openssl rand -base64 32

# Resend Email Provider
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com
```

**2. Get Resend API Key:**
- Create account at [resend.com](https://resend.com/)
- Add your sending domain (or use Resend's onboarding domain for testing)
- Copy API key from dashboard

**3. Generate Secret:**
```bash
openssl rand -base64 32
```

### Usage

**Server Components (Recommended):**

```typescript
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }
  
  return <div>Welcome, {session.user.email}!</div>;
}
```

**Client Components:**

```typescript
'use client';
import { signIn, signOut } from 'next-auth/react';

export function LoginButton() {
  return (
    <button onClick={() => signIn('email', { email: 'user@example.com' })}>
      Sign in
    </button>
  );
}

export function LogoutButton() {
  return <button onClick={() => signOut()}>Sign out</button>;
}
```

**API Routes:**

```typescript
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await auth();
  
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  return Response.json({ userId: session.user.id });
}
```

### Authentication Flow

1. **User submits email** on `/login` page
2. **Magic link generated** by NextAuth with secure token
3. **Email sent** via Resend SMTP with custom HTML template
4. **User clicks link** in email (valid for 15 minutes)
5. **Token verified** by NextAuth, session created
6. **User redirected** to dashboard or callback URL

### Database Schema

NextAuth uses **4 tables** managed by DrizzleAdapter:

- **`users`** - User accounts (id, email, name, emailVerified)
- **`accounts`** - OAuth provider accounts (linked to users)
- **`sessions`** - Active sessions (sessionToken, userId, expires)
- **`verificationTokens`** - Magic link tokens (identifier, token, expires)

All tables are automatically created by Drizzle migrations.

---

## Design System

This project uses [shadcn/ui](https://ui.shadcn.com) components with a custom **Emerald Trust** theme.

### Theme Colors

**Emerald Trust Palette:**
- **Primary:** `#10b981` (emerald-500) - Main CTA buttons, focus rings, accents
- **Secondary:** `#34d399` (emerald-400) - Secondary actions, hover states
- **Background:** `#050505` (near black) - Page background (dark mode)
- **Card:** `#0f0f0f` (dark gray) - Card backgrounds, elevated surfaces
- **Border:** `#1a1a1a` (darker gray) - Borders, dividers
- **Input:** `#333333` (medium gray) - Input fields, form controls
- **Destructive:** `#ef4444` (red-500) - Error states, delete actions

**Gradient (for special CTAs):**
```css
background: linear-gradient(135deg, #10b981, #34d399);
```

### Components

**Installed shadcn/ui Components:**
1. **Button** - Call-to-action buttons with variants (default, outline, ghost, destructive)
2. **Input** - Text input fields with focus states
3. **Card** - Containers with header, content, footer sections
4. **Badge** - Labels for status, tags, categories
5. **Toast (Sonner)** - Notification popups (success, error, info)
6. **Dialog** - Modal overlays for confirmations, forms

### Usage Examples

**Button:**
```typescript
import { Button } from '@/components/ui/button'

<Button>Primary Action</Button>
<Button variant="outline">Secondary Action</Button>
<Button variant="ghost">Tertiary Action</Button>
<Button size="sm">Small</Button>
```

**Input:**
```typescript
import { Input } from '@/components/ui/input'

<Input 
  type="email" 
  placeholder="seu@email.com" 
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

**Card:**
```typescript
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
</Card>
```

**Badge:**
```typescript
import { Badge } from '@/components/ui/badge'

<Badge>Status</Badge>
<Badge variant="destructive">Error</Badge>
```

**Toast (Sonner):**
```typescript
import { toast } from 'sonner'

toast.success('Success', { description: 'Operation completed successfully' })
toast.error('Error', { description: 'Something went wrong' })
toast.info('Info', { description: 'Important information' })
```

**Dialog:**
```typescript
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    <p>Dialog content</p>
  </DialogContent>
</Dialog>
```

### Adding New Components

To add more shadcn/ui components:

```bash
npx shadcn@latest add [component-name]
```

**Available components:** https://ui.shadcn.com/docs/components

**Examples:**
```bash
npx shadcn@latest add dropdown-menu
npx shadcn@latest add avatar
npx shadcn@latest add tabs
```

### Customization

**Modify component styles:**
- Components are in `components/ui/` (editable)
- Use Tailwind classes or CSS variables
- Prefer composition over modification (extend via props)

**Update theme colors:**
1. Edit `tailwind.config.ts` (Tailwind tokens) - Not used in Tailwind 4.0
2. Edit `app/globals.css` (CSS variables in `:root` and `.dark`)
3. Restart dev server: `npm run dev`

### Accessibility

All shadcn/ui components meet WCAG 2.1 Level A:
- ✅ Keyboard navigation (Tab, Enter, Space, ESC)
- ✅ Focus indicators (visible ring on focused elements)
- ✅ ARIA labels and roles
- ✅ Screen reader announcements

**Test accessibility:**
- Use keyboard only (no mouse)
- Use browser screen reader (optional)
- Check focus order makes sense

### Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Sonner Toast Library](https://sonner.emilkowal.ski/)

---

## Custom Lottery Components

This project has custom React components specific to lottery functionality, built on top of shadcn/ui base components.

### Components

**Available Custom Components:**
1. **ValueInput** - Currency input (R$) with validation (R$10-R$500)
2. **LotteryGameCard** - Display lottery game with numbers in grid layout
3. **WheelGuaranteeDisplay** - Badge showing wheeling guarantee with tooltip

### Usage Examples

**ValueInput:**
```typescript
import { ValueInput } from '@/components/lottery'

function MyForm() {
  const [value, setValue] = useState<number | undefined>(100)

  return (
    <ValueInput 
      value={value} 
      onChange={(newValue) => setValue(newValue)} 
    />
  )
}
```

**Props:**
- `value?: number` - Current value (in BRL)
- `onChange?: (value: number | undefined) => void` - Callback when value changes
- `error?: string` - External error message (optional, component has internal validation)
- `className?: string` - Additional Tailwind classes

**Validation:** Min R$10, Max R$500

---

**LotteryGameCard:**
```typescript
import { LotteryGameCard } from '@/components/lottery'

<LotteryGameCard
  title="Mega-Sena 2650"
  numbers={[5, 12, 23, 34, 45, 56]}
  date="2025-12-10"
  status="pending"
  prize="Quina - R$ 1.234,56" // optional
/>
```

**Props:**
- `title: string` - Game title (e.g., "Mega-Sena 2650")
- `numbers: number[]` - Array of lottery numbers to display
- `date?: string` - Game date (ISO format, will be formatted to pt-BR)
- `status?: 'pending' | 'realized' | 'winner' | 'loser'` - Game status (default: 'pending')
- `prize?: string` - Prize description (shown in footer if provided)
- `className?: string` - Additional Tailwind classes

**Number Grid:** Automatically adjusts layout based on quantity (6 numbers = 6 cols, 15 numbers = 5 cols)

---

**WheelGuaranteeDisplay:**
```typescript
import { WheelGuaranteeDisplay } from '@/components/lottery'

<WheelGuaranteeDisplay
  guaranteeType="4 if 4"
  explanation="Garante mínimo 4 acertos se você tiver 4 números corretos nas dezenas sorteadas"
/>
```

**Props:**
- `guaranteeType: string` - Guarantee label (e.g., "4 if 4", "5 if 6")
- `explanation: string` - Tooltip text explaining the guarantee
- `className?: string` - Additional Tailwind classes

**Interaction:** Hover or focus badge to show tooltip, press ESC to dismiss

---

### Component Architecture

**Directory Structure:**
```
app/components/
├── ui/              # shadcn/ui base components (Button, Card, Badge, Input, etc.)
└── lottery/         # Custom lottery components
    ├── value-input.tsx
    ├── lottery-game-card.tsx
    ├── wheel-guarantee-display.tsx
    └── index.ts     # Barrel export
```

**Import Pattern:**
```typescript
// Single import for all lottery components
import { ValueInput, LotteryGameCard, WheelGuaranteeDisplay } from '@/components/lottery'

// Or import individually
import { ValueInput } from '@/components/lottery/value-input'
```

### Customization

**Modify component styles:**
- Components are in `components/lottery/` (editable)
- Use Tailwind utility classes via `className` prop
- Extend shadcn/ui base components (Card, Badge, Input)
- Follow Emerald Trust theme (#10b981 primary)

**Update validation rules:**
- Edit `lib/validations/lottery.ts`
- Modify Zod schema `valueInputSchema`
- Update min/max values or add new validations

### Validation Schema

**Location:** `app/lib/validations/lottery.ts`

**Schema:**
```typescript
import { z } from 'zod'

export const valueInputSchema = z.object({
  value: z.number()
    .min(10, 'Valor mínimo é R$ 10,00')
    .max(500, 'Valor máximo é R$ 500,00')
})

export type ValueInputData = z.infer<typeof valueInputSchema>
```

### Accessibility

All custom lottery components meet WCAG 2.1 Level A:
- ✅ ValueInput: Label association, error announcements, keyboard input
- ✅ LotteryGameCard: Semantic HTML, ARIA labels on number balls
- ✅ WheelGuaranteeDisplay: Keyboard accessible tooltip, ESC to dismiss, ARIA labels

### Testing

**Test Page:** http://localhost:3000/test-lottery (temporary)

**Manual Tests:**
1. ValueInput: Type values, verify R$ formatting, test min/max validation
2. LotteryGameCard: Check number display, status badges, hover effects
3. WheelGuaranteeDisplay: Hover badges, verify tooltips appear and dismiss
4. Keyboard nav: Tab through components, Enter/Space to interact
5. Responsive: Test mobile (375px), tablet (768px), desktop (1024px)

### Resources

- [react-number-format Documentation](https://github.com/s-yadav/react-number-format)
- [Radix UI Tooltip](https://www.radix-ui.com/primitives/docs/components/tooltip)
- [Zod Validation](https://zod.dev/)

---

**Session Type Augmentation:**

TypeScript knows the exact shape of your session:

```typescript
import type { Session } from 'next-auth';

// Session includes user.id by default
const session: Session = {
  user: {
    id: 'uuid-here',        // ✅ Added via type augmentation
    email: 'user@example.com',
    name: 'User Name',
    image: null,
  },
  expires: '2025-12-31T23:59:59.999Z',
};
```

Type definitions are in `types/next-auth.d.ts`.

### Security Features

- **HttpOnly Cookies:** Session tokens are inaccessible to JavaScript (XSS protection)
- **CSRF Protection:** Built-in CSRF token validation on all POST requests
- **Secure Flag:** Cookies marked secure in production (HTTPS only)
- **JWT Signing:** Sessions signed with HS256 algorithm using NEXTAUTH_SECRET
- **Token Expiration:** Magic links expire after 15 minutes, sessions after 30 days

### Demo Pages

- **`/login`** - Email sign-in form
- **`/verify`** - Post-submission page (check your email message)
- **`/dashboard`** - Protected page example (requires authentication)

### Troubleshooting

**Magic link not received:**
- Check spam folder
- Verify RESEND_API_KEY is correct
- Check Resend dashboard logs for delivery status
- Ensure EMAIL_FROM matches verified domain

**Session not persisting:**
- Verify NEXTAUTH_SECRET is set (required for JWT signing)
- Check browser allows cookies (required for session storage)
- Ensure NEXTAUTH_URL matches your deployment URL

**TypeScript errors on session.user.id:**
- Run `npm run dev` to regenerate Next.js type definitions
- Check `types/next-auth.d.ts` exists and is properly structured

### Resources

- [NextAuth v5 Documentation](https://authjs.dev/)
- [Email Provider Guide](https://authjs.dev/getting-started/providers/email)
- [Resend Documentation](https://resend.com/docs)
- [DrizzleAdapter Guide](https://authjs.dev/getting-started/adapters/drizzle)

## Available Scripts

## Project Configuration

### TypeScript

- **Strict Mode:** Enabled (`tsconfig.json`)
- **Import Alias:** `@/*` maps to project root for clean imports

Example:
```typescript
import { MyComponent } from '@/components/MyComponent'
```

### Styling

- **Framework:** Tailwind CSS v4
- **Configuration:** See `postcss.config.mjs` and `app/globals.css`
- **Dark Mode:** Supported via CSS variables

### Turbopack

This project uses **Turbopack** as the default bundler for development, providing:
- 700x faster incremental builds compared to Webpack
- Instant hot module replacement (HMR)
- Optimized for Next.js 16 App Router

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - Next.js features and API
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) - TypeScript guide
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Utility-first CSS framework
- [Turbopack Documentation](https://nextjs.org/docs/architecture/turbopack) - Next-gen bundler

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
