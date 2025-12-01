# Epic Technical Specification: Foundation & Project Setup

Date: 2025-11-30
Author: Carlos
Epic ID: 1
Status: Draft

---

## Overview

O Epic 1 - Foundation & Project Setup estabelece toda a infraestrutura base do Sorte Grande, desde a inicialização do projeto Next.js até o deploy na Vercel com landing page funcional. Este epic habilita todos os epics subsequentes ao criar:

- Projeto Next.js 16 configurado com TypeScript strict mode, Tailwind CSS e App Router
- Banco de dados PostgreSQL serverless (Neon) com schema completo para usuários, sugestões, resultados e prêmios
- Sistema de autenticação magic link via NextAuth v5 + Resend
- Design system shadcn/ui customizado com tema Emerald Trust (#10b981)
- Componentes custom de loteria (ValueInput, GameCard, WheelGuaranteeDisplay)
- Pipeline CI/CD automático na Vercel com preview deployments
- Landing page profissional com hero, "Como funciona" e disclaimers

**Valor de negócio:** Sem este epic, nenhum desenvolvimento subsequente é possível. Ele entrega a fundação arquitetural e visual que suporta todo o MVP.

## Objectives and Scope

### In-Scope

**Infraestrutura:**
- ✅ Projeto Next.js 16 inicializado com create-next-app
- ✅ TypeScript 5.1+ strict mode configurado
- ✅ Tailwind CSS 3.4+ com tema Emerald Trust
- ✅ App Router (`/app` directory) configurado
- ✅ Import alias `@/*` para imports limpos
- ✅ ESLint + Prettier configurados

**Database:**
- ✅ Neon PostgreSQL serverless conectado
- ✅ Drizzle ORM instalado e configurado
- ✅ Schema completo: users, suggestions, lottery_results, prizes
- ✅ Migrations versionadas
- ✅ Indexes otimizados (userId, contestNumber, email)
- ✅ 3 branches Neon (dev, staging, prod)

**Autenticação:**
- ✅ NextAuth v5 configurado
- ✅ EmailProvider com Resend transport
- ✅ Magic link funcionando (15min expiration)
- ✅ JWT session (30 dias)
- ✅ Middleware de proteção de rotas

**Design System:**
- ✅ shadcn/ui instalado (Button, Input, Card, Badge, Toast, Dialog)
- ✅ Tema Emerald Trust aplicado (primary #10b981, background #050505)
- ✅ Dark mode padrão
- ✅ 5 componentes custom (ValueInput, GameNumbersDisplay, LotteryGameCard, WheelGuaranteeDisplay, PrizeAlert)

**Deploy:**
- ✅ Vercel deployment automático
- ✅ Preview URLs para PRs
- ✅ Environment variables configuradas
- ✅ Cron job placeholder (vercel.json)

**Landing Page:**
- ✅ Header com logo + botão "Entrar"
- ✅ Hero section com CTA
- ✅ Seção "Como funciona" (4 passos)
- ✅ Disclaimer honesto sobre limitações
- ✅ Footer com links legais

### Out-of-Scope (para outros epics)

**Epic 2:**
- ❌ Páginas de login/verify (apenas estrutura básica)
- ❌ Email templates customizados
- ❌ Limite de 50 usuários

**Epic 3+:**
- ❌ Lógica de wheeling engine
- ❌ Geração de sugestões
- ❌ Integração com APIs de resultados
- ❌ PWA features

**Post-MVP:**
- ❌ Admin dashboard
- ❌ Analytics avançado
- ❌ Múltiplas loterias além de Mega/Lotofácil

## System Architecture Alignment

Este epic implementa a camada de fundação da arquitetura documentada em `docs/architecture.md`:

**Framework & Stack:**
- Next.js 16 App Router conforme decisão ADR-001 (Monolith over Microservices)
- TypeScript strict mode para type safety
- Tailwind CSS para styling system
- Turbopack bundler (700x mais rápido que Webpack)

**Database Layer:**
- Neon PostgreSQL serverless conforme especificação de Architecture
- Drizzle ORM conforme decisão ADR-002 (Drizzle over Prisma)
- Schema alinhado com seção "Data Architecture" do documento de arquitetura
- Connection pooling automático do Neon

**Authentication:**
- NextAuth v5 conforme decisão ADR-003 (NextAuth over Clerk)
- Resend para transporte de email
- Magic link passwordless auth
- JWT session strategy (stateless)

**Deployment:**
- Vercel conforme decisão ADR-005 (Vercel Cron over External Service)
- CI/CD automático
- Serverless functions
- Edge network global

**Project Structure:**
Implementa exatamente a estrutura definida em `docs/architecture.md` Section "Project Structure":
```
app/
  src/
    app/ (App Router)
    components/ (ui/ + lottery/ + layout/)
    lib/ (db/ + wheeling/ + lottery/ + integrations/)
    types/
  public/
  package.json
  next.config.ts
  tailwind.config.ts
```

**Consistency com UX Design:**
- shadcn/ui conforme `docs/ux-design-specification.md` Section 1.1
- Emerald Trust theme (#10b981) conforme Section 3.1
- Componentes custom alinhados com Section 6.2
- Mobile-first responsive conforme Section 8.1

**Nenhuma divergência arquitetural:** Este epic segue 100% as decisões de arquitetura documentadas.

## Detailed Design

### Services and Modules

| Module | Responsibility | Owner | Inputs | Outputs |
|--------|---------------|-------|--------|---------|
| **Next.js App** | Framework principal, routing, SSR/CSR | Framework | HTTP requests | HTML/JSON responses |
| **Drizzle Client** | Database ORM, queries, migrations | `lib/db/index.ts` | SQL queries | Typed results |
| **NextAuth Config** | Authentication provider, session management | `lib/auth/config.ts` | Email, magic link token | JWT session |
| **Resend Client** | Email delivery service | `lib/email/sender.ts` | Email templates, recipient | Delivery status |
| **shadcn/ui Components** | Base UI components (Button, Input, Card) | `components/ui/*` | Props | React elements |
| **Custom Lottery Components** | Domain-specific UI (GameCard, ValueInput) | `components/lottery/*` | Props | React elements |
| **Layout Components** | App structure (Header, Sidebar, Footer) | `components/layout/*` | Props | React elements |

**Module Dependencies:**
```
NextAuth Config → Drizzle Client (user lookups)
NextAuth Config → Resend Client (magic link emails)
Custom Components → shadcn/ui Components (composition)
All Modules → TypeScript Types (type safety)
```

### Data Models and Contracts

**Database Schema (Drizzle ORM):**

```typescript
// lib/db/schema.ts
import { pgTable, serial, text, integer, timestamp, jsonb, boolean, decimal, date } from 'drizzle-orm/pg-core'

// Users table (NextAuth compatible)
export const users = pgTable('users', {
  id: text('id').primaryKey(), // UUID
  email: text('email').notNull().unique(),
  name: text('name'),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  image: text('image'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
})

// Suggestions table
export const suggestions = pgTable('suggestions', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  lottery: text('lottery').notNull(), // 'megasena' | 'lotofacil'
  value: integer('value').notNull(), // centavos (R$ 150 = 15000)
  games: jsonb('games').$type<Game[]>().notNull(), // Array de jogos
  wheelTemplate: text('wheel_template'), // "mega-10-4if4"
  guarantee: text('guarantee'), // "4 if 4"
  status: text('status').notNull().default('pending'), // 'pending' | 'realized' | 'verified'
  contestNumber: integer('contest_number'), // Concurso que será verificado
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  realizedAt: timestamp('realized_at', { mode: 'date' }),
  verifiedAt: timestamp('verified_at', { mode: 'date' }),
})

// Lottery Results table
export const lotteryResults = pgTable('lottery_results', {
  id: serial('id').primaryKey(),
  lottery: text('lottery').notNull(),
  contestNumber: integer('contest_number').notNull(),
  drawNumbers: integer('draw_numbers').array().notNull(), // [3, 12, 18, 27, 34, 45]
  drawDate: date('draw_date', { mode: 'date' }).notNull(),
  prizes: jsonb('prizes').$type<PrizeTiers>(), // { sena: 5000000, quina: 50000 }
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
}, (table) => ({
  uniqueContest: unique().on(table.lottery, table.contestNumber)
}))

// Prizes table
export const prizes = pgTable('prizes', {
  id: serial('id').primaryKey(),
  suggestionId: integer('suggestion_id').notNull().references(() => suggestions.id, { onDelete: 'cascade' }),
  gameIndex: integer('game_index').notNull(), // Qual jogo (0-based)
  contestNumber: integer('contest_number').notNull(),
  prizeTier: text('prize_tier').notNull(), // 'sena' | 'quina' | 'quadra' | 'terno'
  prizeValue: integer('prize_value'), // centavos (estimado)
  matchedNumbers: integer('matched_numbers').array().notNull(), // [3, 12, 18, 27]
  viewedAt: timestamp('viewed_at', { mode: 'date' }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
})
```

**Indexes:**
```sql
CREATE INDEX idx_suggestions_user_id ON suggestions(user_id);
CREATE INDEX idx_suggestions_status ON suggestions(status);
CREATE INDEX idx_lottery_results_lottery ON lottery_results(lottery);
CREATE INDEX idx_lottery_results_draw_date ON lottery_results(draw_date);
CREATE INDEX idx_prizes_suggestion_id ON prizes(suggestion_id);
CREATE UNIQUE INDEX idx_lottery_results_contest ON lottery_results(lottery, contest_number);
```

**TypeScript Types:**

```typescript
// types/lottery.ts
export type Lottery = 'megasena' | 'lotofacil'

export type SuggestionStatus = 'pending' | 'realized' | 'verified'

export interface Game {
  numbers: number[] // [3, 12, 18, 27, 34, 45]
}

export interface PrizeTiers {
  sena?: number       // R$ em centavos
  quina?: number
  quadra?: number
  quinze?: number     // Lotofácil
  quatorze?: number
  treze?: number
  doze?: number
  onze?: number
}

export type PrizeTier = 'sena' | 'quina' | 'quadra' | 'terno' | 'quinze' | 'quatorze' | 'treze' | 'doze' | 'onze'
```

**NextAuth Session Type:**
```typescript
// types/next-auth.d.ts
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
    } & DefaultSession['user']
  }
}
```

### APIs and Interfaces

**API Routes (Next.js App Router):**

| Route | Method | Purpose | Auth | Request | Response |
|-------|--------|---------|------|---------|----------|
| `/api/auth/[...nextauth]` | ALL | NextAuth endpoints | N/A | Per NextAuth spec | Per NextAuth spec |
| `/api/health` | GET | Health check | No | - | `{ status: 'ok' }` |

**Server Actions (para epics futuros):**
```typescript
// app/actions/suggestions.ts (Epic 3)
'use server'
export async function createSuggestion(value: number): Promise<Suggestion>
export async function updateSuggestionStatus(id: number, status: SuggestionStatus): Promise<void>
```

**Component Interfaces:**

```typescript
// components/lottery/ValueInput.tsx
interface ValueInputProps {
  value: number
  onChange: (value: number) => void
  min?: number          // Default: 1000 (R$ 10)
  max?: number          // Default: 50000 (R$ 500)
  error?: string
  disabled?: boolean
}

// components/lottery/GameNumbersDisplay.tsx
interface GameNumbersDisplayProps {
  numbers: number[]     // [3, 12, 18, 27, 34, 45]
  size?: 'small' | 'medium' | 'large'
  highlightedNumbers?: number[]
  variant?: 'default' | 'winning' | 'muted'
}

// components/lottery/LotteryGameCard.tsx
interface LotteryGameCardProps {
  gameNumber: number
  numbers: number[]
  price: number         // centavos
  isWinning?: boolean
  winningNumbers?: number[]
  onClick?: () => void
}

// components/lottery/WheelGuaranteeDisplay.tsx
interface WheelGuaranteeDisplayProps {
  guarantee: string     // "4 if 4"
  explanation: string
  position?: 'inline' | 'tooltip'
}

// components/lottery/PrizeAlert.tsx (Epic 5)
interface PrizeAlertProps {
  prizeType: PrizeTier
  prizeValue: number
  gameNumber: number
  lotteryName: string
  concursoNumber: number
  onViewDetails: () => void
}
```

### Workflows and Sequencing

**Story 1.1: Initialize Next.js Project**
```
Developer → Terminal
├─ 1. npx create-next-app@latest app --typescript --tailwind --app --eslint --turbopack --import-alias "@/*"
├─ 2. cd app
├─ 3. npm install
└─ 4. npm run dev → localhost:3000 ✓
```

**Story 1.2-1.3: Setup Database**
```
Developer → Neon Console
├─ 1. Create project "sorte-grande"
├─ 2. Create 3 branches (main, staging, dev)
├─ 3. Copy DATABASE_URL for dev branch
│
Developer → Local
├─ 4. npm install drizzle-orm pg
├─ 5. npm install -D drizzle-kit @types/pg
├─ 6. Create .env.local with DATABASE_URL
├─ 7. Create lib/db/schema.ts (4 tables)
├─ 8. Create drizzle.config.ts
├─ 9. npx drizzle-kit generate:pg
└─ 10. npx drizzle-kit push:pg → Tables created ✓
```

**Story 1.4: Configure NextAuth**
```
Developer → Resend Console
├─ 1. Create account
├─ 2. Verify domain (or use resend.dev for testing)
├─ 3. Generate API key
│
Developer → Local
├─ 4. npm install next-auth@beta resend
├─ 5. Create lib/auth/config.ts (NextAuth config)
├─ 6. Create app/api/auth/[...nextauth]/route.ts
├─ 7. Add NEXTAUTH_SECRET to .env.local
├─ 8. Add RESEND_API_KEY to .env.local
└─ 9. Test magic link flow ✓
```

**Story 1.5-1.6: Setup UI Components**
```
Developer → Local
├─ 1. npx shadcn-ui@latest init
│   └─ Select: Emerald (#10b981), dark mode
├─ 2. npx shadcn-ui@latest add button input card badge toast dialog
├─ 3. Customize tailwind.config.ts (Emerald Trust theme)
├─ 4. Create components/lottery/ValueInput.tsx
├─ 5. Create components/lottery/GameNumbersDisplay.tsx
├─ 6. Create components/lottery/LotteryGameCard.tsx
├─ 7. Create components/lottery/WheelGuaranteeDisplay.tsx
├─ 8. Create components/lottery/PrizeAlert.tsx (placeholder)
└─ 9. Test components in Storybook (optional) ✓
```

**Story 1.7: Setup Vercel Deploy**
```
Developer → GitHub
├─ 1. git init
├─ 2. git add .
├─ 3. git commit -m "Initial commit"
├─ 4. Create repo "sorte-grande"
└─ 5. git push origin main
│
Developer → Vercel Console
├─ 6. Import GitHub repo
├─ 7. Configure project:
│   ├─ Framework: Next.js
│   ├─ Root directory: ./app
│   └─ Build command: npm run build
├─ 8. Add environment variables:
│   ├─ DATABASE_URL (Neon production)
│   ├─ NEXTAUTH_SECRET
│   ├─ NEXTAUTH_URL
│   └─ RESEND_API_KEY
├─ 9. Deploy
└─ 10. Verify production URL works ✓
│
Developer → Local
└─ 11. Create vercel.json (cron placeholder)
```

**Story 1.8: Create Landing Page**
```
Developer → Local
├─ 1. Create app/page.tsx (landing)
├─ 2. Create components/layout/AppHeader.tsx
├─ 3. Create components/layout/Footer.tsx
├─ 4. Implement hero section:
│   ├─ Gradient logo
│   ├─ Title + subtitle
│   └─ CTA button "Começar Grátis"
├─ 5. Implement "Como funciona" section:
│   ├─ 4 steps with icons
│   └─ Visual flow
├─ 6. Implement disclaimer section:
│   └─ Red warning box
├─ 7. Test responsive (mobile/tablet/desktop)
└─ 8. Deploy to Vercel ✓
```

**Critical Path:**
```
1.1 (Initialize) → 1.2 (Neon) → 1.3 (Schema) → 1.4 (Auth) → 1.5 (shadcn) → 1.6 (Custom) → 1.7 (Vercel) → 1.8 (Landing)
```

**Parallel Opportunities:**
- Stories 1.5 e 1.6 podem ser desenvolvidas em paralelo (UI não depende de backend)
- Story 1.8 pode começar após 1.5 (não precisa de auth para landing pública)

## Non-Functional Requirements

### Performance

**NFR-P1: Initial Page Load**
- Target: First Contentful Paint (FCP) < 1.5s
- Target: Largest Contentful Paint (LCP) < 2.5s
- Target: Time to Interactive (TTI) < 3s
- Measurement: Lighthouse CI in production
- Mitigation: Next.js SSR for landing page, code splitting, image optimization

**NFR-P2: Database Connection**
- Target: Query response time < 200ms (p95)
- Measurement: Drizzle ORM logging + Neon metrics
- Mitigation: Connection pooling (Neon built-in), indexes on all foreign keys

**NFR-P3: Build Time**
- Target: Production build < 2 minutes
- Measurement: Vercel build logs
- Mitigation: Turbopack bundler, incremental builds

**NFR-P4: Development Hot Reload**
- Target: File save → browser refresh < 500ms
- Measurement: Manual testing
- Mitigation: Turbopack fast refresh

### Security

**NFR-S1: Environment Variables**
- All secrets in .env.local (never committed to git)
- .env.example with placeholder values
- Vercel environment variables for production
- Never expose DATABASE_URL, NEXTAUTH_SECRET, RESEND_API_KEY in client code

**NFR-S2: Database Access**
- All queries via Drizzle ORM (no raw SQL from user input)
- Prepared statements prevent SQL injection
- Row-level security via userId filters
- Cascade deletes configured (user deletion removes all data)

**NFR-S3: Authentication Foundation**
- Magic links expire in 15 minutes (NextAuth default)
- JWT tokens signed with NEXTAUTH_SECRET (HS256)
- HttpOnly cookies prevent XSS attacks
- CSRF protection via NextAuth built-in

**NFR-S4: HTTPS Only**
- Vercel enforces HTTPS in production
- Local development allows HTTP (localhost exception)
- HSTS headers configured in next.config.ts

**NFR-S5: Dependency Security**
- npm audit run before every deploy
- Dependabot alerts enabled in GitHub
- No dependencies with known critical vulnerabilities

### Reliability/Availability

**NFR-R1: Deployment Success Rate**
- Target: 99% successful deploys (no rollbacks)
- Measurement: Vercel deployment logs
- Mitigation: TypeScript strict mode catches errors at build time, ESLint enforces best practices

**NFR-R2: Database Availability**
- Target: 99.9% uptime (Neon SLA)
- Measurement: Neon dashboard
- Mitigation: Serverless Postgres (auto-scaling), connection pooling

**NFR-R3: Vercel Platform Availability**
- Target: 99.99% uptime (Vercel SLA)
- Measurement: Vercel status page
- Mitigation: Global edge network, automatic failover

**NFR-R4: Graceful Degradation**
- Database down: Show cached data + "Temporariamente indisponível"
- Vercel down: Not applicable (no self-hosting in MVP)
- Resend down: Auth fails gracefully with error message

**NFR-R5: Data Backup**
- Neon automated daily backups (retained 7 days)
- Point-in-time recovery available
- Manual backup before schema migrations

### Observability

**NFR-O1: Application Logging**
- Console.log for development
- Vercel logs for production (automatic)
- Structured JSON logs for error tracking
- Log levels: info, warn, error

**NFR-O2: Error Tracking**
- Vercel Error Tracking (built-in, no Sentry in MVP)
- Unhandled exceptions captured automatically
- React Error Boundaries for UI errors
- Error context includes: userId, route, timestamp

**NFR-O3: Performance Monitoring**
- Vercel Web Analytics (Core Web Vitals)
- Real User Monitoring (RUM) for LCP, FCP, CLS
- Build time tracking

**NFR-O4: Database Monitoring**
- Neon dashboard for query performance
- Connection pool metrics
- Slow query alerts (>1s)

**NFR-O5: Deployment Visibility**
- Vercel deployment notifications (Slack integration optional)
- Git commit linked to each deploy
- Preview URLs for every PR

**Signal Requirements:**
- Logs: Available in Vercel dashboard, retention 7 days free tier
- Metrics: Web Vitals tracked per page
- Traces: Not required for MVP (add if performance issues)

## Dependencies and Integrations

**Core Dependencies (package.json):**

```json
{
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "typescript": "^5.1.0",
    "tailwindcss": "^3.4.0",
    "drizzle-orm": "^0.29.0",
    "pg": "^8.11.0",
    "next-auth": "^5.0.0-beta",
    "resend": "^2.0.0",
    "@radix-ui/react-*": "^1.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/pg": "^8.10.0",
    "drizzle-kit": "^0.20.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^16.0.0",
    "prettier": "^3.0.0",
    "prettier-plugin-tailwindcss": "^0.5.0"
  }
}
```

**External Service Integrations:**

| Service | Purpose | API/SDK | Auth Method | Rate Limits | Fallback |
|---------|---------|---------|-------------|-------------|----------|
| **Neon** | PostgreSQL database | Postgres driver | Connection string | No limit (free tier 512MB) | N/A (critical) |
| **Vercel** | Hosting + deployment | Vercel CLI | Git push | 100 GB-hours/month free | N/A (critical) |
| **Resend** | Email delivery | resend SDK | API key | 3k emails/month, 100/day | SMTP fallback (manual config) |
| **NextAuth** | Auth provider | Built-in | N/A | N/A | N/A (critical) |

**Integration Points:**

1. **Neon PostgreSQL**
   - Connection: `DATABASE_URL` environment variable
   - Protocol: PostgreSQL wire protocol
   - Pooling: Neon built-in (no pgBouncer needed)
   - TLS: Enforced in production

2. **Resend Email**
   - SDK: `resend` npm package
   - API: REST (https://api.resend.com)
   - Auth: Bearer token in headers
   - Webhook: `/api/webhooks/resend` (Epic 5)

3. **Vercel Platform**
   - Deploy: Git push triggers build
   - Environment: Vercel dashboard
   - Cron: vercel.json configuration
   - Logs: Vercel dashboard + API

**Version Constraints:**
- Next.js: >=16.0.0 (App Router stable)
- React: >=19.0.0 (Next.js 16 requirement)
- Node.js: >=20.9.0 (LTS)
- TypeScript: >=5.1.0 (strict mode features)
- Drizzle: >=0.29.0 (stable API)

**Dependency Management:**
- Lock file: package-lock.json (npm)
- Updates: Dependabot weekly checks
- Security: npm audit before each deploy
- Major version bumps: Test in staging first

## Acceptance Criteria (Authoritative)

**AC1: Project Initialization**
- ✅ Next.js 16 app created with TypeScript
- ✅ `npm run dev` starts on localhost:3000
- ✅ App Router (`/app` directory) configured
- ✅ Import alias `@/*` works for imports
- ✅ ESLint passes with 0 errors
- ✅ Turbopack bundler active (check terminal output)

**AC2: Database Setup**
- ✅ Neon project "sorte-grande" created with 3 branches
- ✅ DATABASE_URL in .env.local connects successfully
- ✅ Drizzle ORM installed and configured
- ✅ 4 tables created: users, suggestions, lottery_results, prizes
- ✅ All indexes applied (check Neon SQL editor)
- ✅ Foreign keys enforce referential integrity
- ✅ Cascade deletes configured (user → suggestions → prizes)

**AC3: Authentication**
- ✅ NextAuth v5 installed
- ✅ `/api/auth/signin` endpoint responds
- ✅ EmailProvider configured with Resend
- ✅ Magic link email sends successfully
- ✅ Magic link redirects to callback URL
- ✅ JWT session created (inspect cookie)
- ✅ Session expires after 30 days

**AC4: Design System**
- ✅ shadcn/ui initialized with Emerald theme
- ✅ 6 components installed: button, input, card, badge, toast, dialog
- ✅ Primary color is #10b981 (green)
- ✅ Background is #050505 (dark)
- ✅ Dark mode active by default
- ✅ Tailwind config has custom theme tokens

**AC5: Custom Components**
- ✅ ValueInput: Formats R$ automatically, validates min/max
- ✅ GameNumbersDisplay: Shows number circles, supports highlighting
- ✅ LotteryGameCard: Displays game with metadata
- ✅ WheelGuaranteeDisplay: Shows tooltip explanation
- ✅ PrizeAlert: Placeholder component exists (full implementation Epic 5)
- ✅ All components TypeScript typed with interfaces

**AC6: Vercel Deployment**
- ✅ GitHub repo connected to Vercel
- ✅ Production deployment successful
- ✅ Environment variables configured
- ✅ Production URL accessible (https://*.vercel.app)
- ✅ Preview deployments work for PRs
- ✅ vercel.json exists with cron placeholder

**AC7: Landing Page**
- ✅ Route `/` renders landing page
- ✅ Header with logo "Sorte Grande" + button "Entrar"
- ✅ Hero section with title, subtitle, CTA
- ✅ "Como funciona" section with 4 steps
- ✅ Disclaimer section with warning
- ✅ Footer with legal links
- ✅ Responsive: mobile (< 768px), tablet, desktop
- ✅ Lighthouse score: Performance >90, Accessibility >90

**AC8: Code Quality**
- ✅ TypeScript strict mode enabled (tsconfig.json)
- ✅ ESLint configured with Next.js rules
- ✅ Prettier configured with Tailwind plugin
- ✅ All files formatted consistently
- ✅ No console.error in production build
- ✅ Build completes without warnings

**Definition of Done:**
- All 8 acceptance criteria met
- Code reviewed and merged to main
- Production deployment successful
- Smoke test: Can access landing page at production URL
- Documentation updated (README.md with setup steps)

## Traceability Mapping

| AC | PRD Functional Requirements | Architecture Section | Component/API | Test Approach |
|----|----------------------------|---------------------|---------------|---------------|
| **AC1** | Infrastructure (enables all FRs) | Project Initialization | Next.js app | Manual: `npm run dev` works |
| **AC2** | FR1-FR6 (User data storage) | Database Schema | Drizzle ORM + Neon | Manual: Query test users table |
| **AC3** | FR1-FR4 (Auth) | Authentication & Authorization | NextAuth + Resend | Manual: Send magic link, login |
| **AC4** | NFR-A1 (Accessibility) | Design System Foundation | shadcn/ui | Visual: Check theme in browser |
| **AC5** | FR11-FR24 (UI for suggestions) | Component Library | Custom components | Storybook (optional) / Visual |
| **AC6** | NFR-M3 (DevOps) | Deployment Architecture | Vercel platform | CI/CD: Every git push |
| **AC7** | FR49-FR53 (Educational content) | Landing page | React components | Manual: Check all sections exist |
| **AC8** | NFR-M1 (Code quality) | Maintainability | TypeScript + ESLint | Automated: `npm run lint` |

**PRD → Tech Spec → Implementation Trace:**

```
PRD Section "Functional Requirements" → Epic 1 (Infraestrutura)
  ├─ FR1-FR6 (User Account) → AC2 (Database users table) → Story 1.3
  ├─ FR1-FR4 (Auth) → AC3 (NextAuth config) → Story 1.4
  └─ FR49-FR53 (Educational) → AC7 (Landing page) → Story 1.8

PRD Section "Non-Functional Requirements" → Epic 1 (NFRs)
  ├─ NFR-P1 (Performance) → AC1 (Next.js optimizations) → Story 1.1
  ├─ NFR-S1 (Security) → AC2 (Database security) → Story 1.3
  ├─ NFR-A1 (Accessibility) → AC4 (shadcn/ui WCAG) → Story 1.5
  └─ NFR-M3 (DevOps) → AC6 (Vercel CI/CD) → Story 1.7

Architecture Document → Epic 1 (Implementation)
  ├─ Section "Technology Stack" → AC1-AC3 (Next.js + Neon + NextAuth)
  ├─ Section "Project Structure" → AC1 (Folder layout)
  ├─ Section "Data Architecture" → AC2 (Database schema)
  └─ Section "Deployment" → AC6 (Vercel setup)

UX Design Document → Epic 1 (Visual Foundation)
  ├─ Section "Design System" → AC4 (shadcn/ui + Emerald theme)
  ├─ Section "Component Library" → AC5 (Custom components)
  └─ Section "Design Direction" → AC7 (Landing page mockup)
```

**Coverage Analysis:**
- ✅ All 8 stories traced to acceptance criteria
- ✅ All AC traced to PRD/Architecture/UX requirements
- ✅ Test approach defined for each AC
- ✅ Components mapped to business requirements

**Gap Analysis:**
- ❌ No gaps identified - Epic 1 scope complete

## Risks, Assumptions, Open Questions

**RISKS:**

| ID | Risk | Impact | Probability | Mitigation |
|----|------|--------|-------------|------------|
| **R1** | Next.js 16 breaking changes from beta | High | Low | Pin to stable 16.0.0+, avoid canary channel |
| **R2** | Neon free tier limits (512MB) exceeded during dev | Medium | Medium | Monitor usage, upgrade to paid ($19/mo) if needed |
| **R3** | Resend free tier (100 emails/day) insufficient for testing | Low | Medium | Use test mode, batch test emails, upgrade if needed |
| **R4** | shadcn/ui component bugs or breaking changes | Medium | Low | Pin Radix UI versions, test updates in staging |
| **R5** | Vercel free tier limits (100 GB-hours/month) | Low | Low | Monitor usage, single developer unlikely to exceed |
| **R6** | Database schema changes require complex migrations | Medium | High | Design schema carefully upfront, use Drizzle migrations |
| **R7** | TypeScript strict mode causes productivity slowdown | Low | Medium | Accept tradeoff - type safety prevents runtime bugs |

**ASSUMPTIONS:**

| ID | Assumption | Validation | Contingency if False |
|----|------------|------------|----------------------|
| **A1** | Developer has Node.js 20+ installed | Check: `node -v` | Install from nodejs.org |
| **A2** | Developer has git configured | Check: `git --version` | Install git, configure user |
| **A3** | Neon connection stable from developer location | Check: Test query | Use VPN if firewall blocks |
| **A4** | Resend domain verification not required for testing | Use resend.dev emails | Verify custom domain if needed |
| **A5** | Next.js 16 stable by implementation time | Check: npm registry | Use 15.x if 16 unstable |
| **A6** | shadcn/ui components work in Next.js 16 | Test: Install and render | Wait for compatibility update |
| **A7** | Single developer can complete 8 stories in 1 week | Track: Story completion time | Extend timeline or reduce scope |
| **A8** | No major breaking changes in dependencies during dev | Monitor: Dependabot alerts | Pin versions, avoid updates mid-epic |

**OPEN QUESTIONS:**

| ID | Question | Owner | Target Resolution | Status |
|----|----------|-------|-------------------|--------|
| **Q1** | Should we use npm, pnpm, or yarn? | Carlos | Before Story 1.1 | ✅ **RESOLVED: npm** (Next.js default) |
| **Q2** | Do we need Storybook for component development? | Carlos | Before Story 1.6 | 🔄 **OPEN** (Optional, defer to post-MVP) |
| **Q3** | Should we set up Sentry for error tracking in MVP? | Carlos | Before Story 1.7 | ✅ **RESOLVED: No** (Use Vercel built-in) |
| **Q4** | Do we need a separate staging environment? | Carlos | Before Story 1.7 | ✅ **RESOLVED: Yes** (Neon staging branch + Vercel preview) |
| **Q5** | Should database migrations be manual or automatic? | Carlos | Before Story 1.3 | ✅ **RESOLVED: Manual** (Drizzle Kit push after review) |
| **Q6** | Do we need Redis for caching in MVP? | Carlos | Before Story 1.2 | ✅ **RESOLVED: No** (Defer to post-MVP scaling) |
| **Q7** | Should we implement i18n (internationalization) structure? | Carlos | Before Story 1.1 | ✅ **RESOLVED: No** (PT-BR only MVP) |

**DEPENDENCIES (External to Epic):**

| Dependency | Type | Owner | ETA | Blocker Impact |
|------------|------|-------|-----|----------------|
| Neon account creation | External service | Carlos | Day 1 | Blocks Story 1.2 |
| Resend account + API key | External service | Carlos | Day 1 | Blocks Story 1.4 |
| GitHub repo creation | External service | Carlos | Day 1 | Blocks Story 1.7 |
| Vercel account + team | External service | Carlos | Day 1 | Blocks Story 1.7 |
| Domain name (optional) | External service | Carlos | Post-MVP | Not blocking |

**TECHNICAL DEBT (Accepted for MVP):**

| Debt Item | Reason | Cleanup Plan |
|-----------|--------|---------------|
| No comprehensive test suite | Speed > Coverage in MVP | Add tests in Epic 3+ as complexity grows |
| Magic link email not branded | Resend default template faster | Custom HTML email template in Epic 2 |
| No monitoring dashboard | Vercel built-in sufficient | Consider Axiom/Datadog post-100 users |
| Environment variables in Vercel UI | Quick setup | Move to encrypted vault post-MVP |
| No code reviews (solo dev) | No team yet | Implement PR reviews when team grows |

## Test Strategy Summary

**Test Levels:**

| Level | Scope | Tools | Coverage Target | Priority |
|-------|-------|-------|-----------------|----------|
| **Manual** | Smoke tests after deployment | Browser | 100% critical paths | High |
| **Integration** | Database + Auth flow | Manual queries + test login | Key workflows | Medium |
| **Visual** | UI components match design | Browser DevTools | All components | High |
| **Automated** | Linting + Type checking | ESLint + TypeScript | 100% files | High |
| **Unit** | (Defer to Epic 3) | Vitest (future) | N/A for Epic 1 | Low |
| **E2E** | (Defer to Epic 3) | Playwright (future) | N/A for Epic 1 | Low |

**Test Plan by Story:**

**Story 1.1 - Initialize Next.js:**
- ✅ Manual: Run `npm run dev`, verify localhost:3000 loads
- ✅ Manual: Run `npm run build`, verify 0 errors
- ✅ Manual: Check TypeScript strict mode in tsconfig.json
- ✅ Automated: ESLint passes (`npm run lint`)

**Story 1.2 - Setup Neon:**
- ✅ Manual: Test connection with `psql $DATABASE_URL`
- ✅ Manual: Verify 3 branches exist in Neon dashboard
- ✅ Manual: Check connection pooling active (Neon metrics)

**Story 1.3 - Database Schema:**
- ✅ Manual: Run `npx drizzle-kit push:pg`
- ✅ Manual: Query `SELECT * FROM users LIMIT 1` (should work)
- ✅ Manual: Insert test user, verify cascade delete works
- ✅ Manual: Check indexes exist (`\d+ suggestions` in psql)
- ✅ Integration: Create user → create suggestion → delete user → verify cascade

**Story 1.4 - Configure NextAuth:**
- ✅ Manual: Navigate to `/api/auth/signin`
- ✅ Manual: Enter email, verify magic link received
- ✅ Manual: Click link, verify redirect to callback URL
- ✅ Manual: Inspect cookies, verify JWT token present
- ✅ Integration: Full auth flow (request → email → login → session)

**Story 1.5 - Install shadcn/ui:**
- ✅ Visual: Render Button component, verify green color
- ✅ Visual: Check dark mode active (background #050505)
- ✅ Visual: Test responsive breakpoints (resize browser)
- ✅ Manual: Verify 6 components in `components/ui/`

**Story 1.6 - Custom Components:**
- ✅ Visual: Render ValueInput, test R$ formatting
- ✅ Visual: Render GameNumbersDisplay with [3,12,18,27,34,45]
- ✅ Visual: Render LotteryGameCard with mock data
- ✅ Visual: Test highlighting in GameNumbersDisplay
- ✅ Manual: Verify TypeScript types compile

**Story 1.7 - Vercel Deploy:**
- ✅ Manual: Push to GitHub, verify Vercel auto-deploys
- ✅ Manual: Check production URL loads
- ✅ Manual: Create PR, verify preview URL generated
- ✅ Manual: Test environment variables in production (check logs)
- ✅ Integration: Full deployment pipeline (commit → build → deploy → live)

**Story 1.8 - Landing Page:**
- ✅ Visual: Verify hero section matches mockup
- ✅ Visual: Check "Como funciona" has 4 steps
- ✅ Visual: Verify disclaimer warning box (red)
- ✅ Manual: Test responsive on mobile (Chrome DevTools)
- ✅ Manual: Run Lighthouse, verify scores >90
- ✅ Manual: Check all links work (footer legal links)

**Edge Cases & Error Scenarios:**

| Scenario | Expected Behavior | Test Approach |
|----------|-------------------|---------------|
| Database connection fails | App shows error page | Disconnect DB, reload page |
| Invalid DATABASE_URL | Build fails with clear error | Set wrong URL, run build |
| Magic link expired (>15min) | Show "Link expired, request new" | Wait 15min, click old link |
| Resend API key invalid | Auth fails with error | Set wrong key, test login |
| Vercel environment var missing | Build fails | Remove var, trigger deploy |
| TypeScript error in build | Build fails, show error | Add intentional TS error |
| Mobile viewport (320px) | Layout doesn't break | Test in DevTools mobile mode |
| Slow network (3G) | Skeleton screens, no broken images | Throttle network in DevTools |

**Regression Tests (Before Merge):**

- ✅ `npm run build` succeeds
- ✅ `npm run lint` passes with 0 errors
- ✅ TypeScript compiles with 0 errors
- ✅ Landing page loads in production
- ✅ Database connection works
- ✅ No console errors in browser

**Acceptance Test Checklist:**

Before marking Epic 1 as "done", verify:

- [ ] All 8 stories completed
- [ ] All 8 acceptance criteria met
- [ ] Production deployment successful
- [ ] Landing page accessible at public URL
- [ ] Database schema deployed to production
- [ ] NextAuth magic link works end-to-end
- [ ] All custom components render correctly
- [ ] Lighthouse scores: Performance >90, Accessibility >90
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] README.md updated with setup instructions
- [ ] .env.example file created

**Test Data:**

- Test user email: `test@sorte-grande.com.br`
- Test database: Use Neon `dev` branch
- Test deployment: Vercel preview URL

**Known Limitations (MVP Acceptable):**

- No automated test suite (manual testing sufficient for Epic 1)
- No performance benchmarks (Lighthouse scores proxy)
- No load testing (50 users won't stress system)
- No security penetration testing (OWASP in post-MVP)
