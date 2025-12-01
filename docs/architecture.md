# Sorte Grande - Architecture Document

**Author:** Carlos
**Date:** 2025-11-30
**Version:** 1.0

---

## Executive Summary

**Sorte Grande** é uma plataforma web SaaS que aplica Wheeling Systems (metodologia matematicamente validada) para otimizar apostas em loterias brasileiras. A arquitetura é projetada para ser **simples, escalável e confiável**, priorizando developer experience e facilidade de manutenção sobre complexidade prematura.

**Filosofia Arquitetural:** "Boring Technology" - usar tecnologias maduras, bem documentadas e battle-tested. Next.js + Vercel + Neon PostgreSQL formam a espinha dorsal de milhares de aplicações production-ready.

**Escala Atual vs Futura:**
- **MVP:** 50 usuários, arquitetura monolítica simples
- **Fase 2:** 1.000+ usuários, mesma arquitetura (Next.js escala bem até 100k+ usuários)
- **Fase 3:** 10.000+ usuários, considerar otimizações (cache Redis, CDN, etc)

**Princípios:**
1. **Mobile-first** - 80% dos usuários no mobile
2. **API-first** - Separação clara entre UI e lógica de negócio
3. **Stateless** - Toda lógica no backend, UI apenas apresenta
4. **Observável** - Logs, metrics, traces desde dia 1
5. **Seguro por padrão** - LGPD compliance, zero dados bancários

---

## Project Initialization

### Starter Template Decision

**Decisão:** Usar **create-next-app** (Next.js 16) como base

**Comando de inicialização:**
```bash
npx create-next-app@latest app --typescript --tailwind --app --eslint --turbopack --import-alias "@/*"
```

**O que o starter já fornece:**
- ✅ TypeScript configurado
- ✅ Tailwind CSS configurado
- ✅ ESLint com regras Next.js
- ✅ App Router (`/app` directory)
- ✅ Turbopack (bundler 700x mais rápido)
- ✅ Import alias `@/*` para imports limpos
- ✅ Configuração production-ready

**Por que Next.js?**
- Suporte nativo a SSR + CSR (landing SSR, dashboard CSR)
- API Routes integradas (backend + frontend no mesmo repo)
- Otimizações automáticas (Image, Font, Code Splitting)
- Deploy Vercel com 1 comando
- shadcn/ui (UX Design) depende de Next.js
- Ecossistema maduro e documentação excelente

---

## Decision Summary

| Category | Decision | Version | Affects Epics | Rationale |
| -------- | -------- | ------- | ------------- | --------- |
| **Framework** | Next.js App Router | 16.0+ | Todos | SSR+CSR hybrid, API routes, otimizações automáticas, Vercel deploy |
| **Language** | TypeScript | 5.1+ | Todos | Type safety, melhor DX, evita bugs em runtime |
| **Styling** | Tailwind CSS | 3.4+ | UI | Utility-first, customização total, alinhado com shadcn/ui |
| **UI Components** | shadcn/ui + Radix | Latest | UI | Componentes acessíveis, customizáveis, sem vendor lock-in |
| **Database** | Neon PostgreSQL | Latest | Backend | Serverless Postgres, free tier generoso, branching para dev/staging |
| **ORM** | Drizzle ORM | Latest | Backend | Type-safe SQL, migrations, performance, melhor que Prisma para nosso caso |
| **Authentication** | NextAuth.js v5 | 5.0+ | Auth | Magic link nativo, session management, production-ready |
| **Email Service** | Resend | Latest | Notifications | API simples, free tier 3k emails/mês, templates React |
| **Form Handling** | React Hook Form + Zod | Latest | UI | Performance, validação type-safe, integração perfeita |
| **State Management** | React Context + Server Actions | Built-in | UI/Backend | Simplicidade, sem libs extras, Server Actions para mutations |
| **Cron Jobs** | Vercel Cron | Built-in | Jobs | Nativo Vercel, configuração via vercel.json, serverless |
| **Monitoring** | Vercel Analytics + Axiom | Free tier | Observability | Logs estruturados, métricas Web Vitals, traces |
| **Deployment** | Vercel | Free tier | Infraestrutura | Zero-config, CI/CD automático, preview deployments |

---

## Project Structure

```
sorte-grande/                          # Root do repositório
├── docs/                              # Documentação BMad Method
│   ├── prd.md                         # Product Requirements
│   ├── ux-design-specification.md     # UX Design
│   ├── architecture.md                # Este documento
│   ├── bmm-workflow-status.yaml       # Tracking de workflows
│   ├── ux-color-themes.html           # Theme explorer
│   └── ux-design-directions.html      # Mockups
│
├── app/                               # Aplicação Next.js
│   ├── src/
│   │   ├── app/                       # App Router (Next.js)
│   │   │   ├── (auth)/                # Route group - authentication
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx       # Magic link login
│   │   │   │   └── verify/
│   │   │   │       └── page.tsx       # Email verification
│   │   │   ├── (dashboard)/           # Route group - authenticated
│   │   │   │   ├── layout.tsx         # Dashboard layout (sidebar/bottom nav)
│   │   │   │   ├── page.tsx           # Dashboard home (empty state ou stats)
│   │   │   │   ├── generate/
│   │   │   │   │   └── page.tsx       # Generate suggestion form
│   │   │   │   ├── history/
│   │   │   │   │   ├── page.tsx       # History list
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx   # Suggestion details
│   │   │   │   └── settings/
│   │   │   │       └── page.tsx       # User settings
│   │   │   ├── api/                   # API Routes
│   │   │   │   ├── auth/
│   │   │   │   │   └── [...nextauth]/ # NextAuth endpoints
│   │   │   │   │       └── route.ts
│   │   │   │   ├── suggestions/
│   │   │   │   │   ├── route.ts       # POST create, GET list
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── route.ts   # GET detail, PATCH update
│   │   │   │   ├── cron/
│   │   │   │   │   └── verify-prizes/ # Cron job endpoint
│   │   │   │   │       └── route.ts
│   │   │   │   └── webhooks/
│   │   │   │       └── resend/        # Email webhook
│   │   │   │           └── route.ts
│   │   │   ├── layout.tsx             # Root layout (theme provider, fonts)
│   │   │   ├── page.tsx               # Landing page (public)
│   │   │   ├── globals.css            # Tailwind + custom CSS
│   │   │   └── error.tsx              # Global error boundary
│   │   │
│   │   ├── components/                # React components
│   │   │   ├── ui/                    # shadcn/ui base components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── toast.tsx
│   │   │   │   └── ...
│   │   │   ├── lottery/               # Custom lottery components
│   │   │   │   ├── ValueInput.tsx
│   │   │   │   ├── GameNumbersDisplay.tsx
│   │   │   │   ├── LotteryGameCard.tsx
│   │   │   │   ├── WheelGuaranteeDisplay.tsx
│   │   │   │   └── PrizeAlert.tsx
│   │   │   ├── layout/                # Layout components
│   │   │   │   ├── AppHeader.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── BottomNav.tsx
│   │   │   │   └── Footer.tsx
│   │   │   └── shared/                # Shared utilities
│   │   │       ├── EmptyState.tsx
│   │   │       ├── LoadingSkeleton.tsx
│   │   │       └── ErrorBoundary.tsx
│   │   │
│   │   ├── lib/                       # Core business logic
│   │   │   ├── db/                    # Database
│   │   │   │   ├── index.ts           # Drizzle client
│   │   │   │   ├── schema.ts          # Database schema
│   │   │   │   └── migrations/        # SQL migrations
│   │   │   ├── wheeling/              # Wheeling Systems engine
│   │   │   │   ├── engine.ts          # Core algorithm
│   │   │   │   ├── templates.ts       # Wheel templates database
│   │   │   │   ├── balance.ts         # Number balancing logic
│   │   │   │   └── validator.ts       # Validate wheels
│   │   │   ├── lottery/               # Lottery domain logic
│   │   │   │   ├── rules.ts           # Mega Sena / Lotofácil rules
│   │   │   │   ├── suggester.ts       # Suggestion generator
│   │   │   │   └── verifier.ts        # Prize verification
│   │   │   ├── integrations/          # External APIs
│   │   │   │   ├── caixa-api.ts       # Caixa API client
│   │   │   │   └── guto-alves-api.ts  # Fallback API
│   │   │   ├── email/                 # Email templates & sender
│   │   │   │   ├── templates/
│   │   │   │   │   ├── magic-link.tsx
│   │   │   │   │   └── prize-alert.tsx
│   │   │   │   └── sender.ts
│   │   │   ├── auth/                  # Authentication logic
│   │   │   │   └── config.ts          # NextAuth config
│   │   │   └── utils/                 # Utilities
│   │   │       ├── validators.ts      # Zod schemas
│   │   │       ├── formatters.ts      # Number/currency formatters
│   │   │       └── constants.ts       # App constants
│   │   │
│   │   └── types/                     # TypeScript types
│   │       ├── lottery.ts
│   │       ├── wheeling.ts
│   │       └── api.ts
│   │
│   ├── public/                        # Static assets
│   │   ├── favicon.ico
│   │   ├── logo.svg
│   │   ├── manifest.json              # PWA manifest
│   │   └── icons/                     # PWA icons
│   │
│   ├── .env.local                     # Local environment variables
│   ├── .env.example                   # Example env file
│   ├── drizzle.config.ts              # Drizzle ORM config
│   ├── middleware.ts                  # Next.js middleware (auth guard)
│   ├── next.config.ts                 # Next.js configuration
│   ├── tailwind.config.ts             # Tailwind + Emerald Trust theme
│   ├── tsconfig.json                  # TypeScript config
│   ├── package.json
│   └── vercel.json                    # Vercel config (cron jobs)
│
├── .bmad/                             # BMad Method tooling
├── .git/
├── .gitignore
└── README.md

```

**Rationale da estrutura:**
- `/docs` separado do código - documentação não polui app
- `/app` é a aplicação Next.js completa - pode ser deployada isoladamente
- `/src` dentro de `/app` - separação clara entre código e config
- Route groups `(auth)` e `(dashboard)` - layouts diferentes sem afetar URL
- `/lib` para lógica de negócio - separado de UI, testável isoladamente
- `/components` organizados por domínio - ui (base), lottery (custom), layout, shared

---

## Technology Stack Details

### Core Technologies

**1. Next.js 16 (App Router)**
- **Versão:** 16.0+
- **Uso:** Framework full-stack
- **Features usadas:**
  - Server Components (padrão)
  - Client Components (quando necessário interatividade)
  - Server Actions (mutations sem API routes)
  - API Routes (endpoints REST para cron/webhooks)
  - Middleware (auth guard)
  - Image Optimization
  - Font Optimization
- **Alternativas consideradas:** Remix, Vite+React - Next.js venceu por maturidade e Vercel integration

**2. TypeScript 5.1+**
- **Uso:** Linguagem principal
- **Strict mode:** `true`
- **Features:** Generics, Type guards, Utility types
- **Benefícios:** Catch bugs em compile time, melhor DX com autocomplete

**3. Tailwind CSS 3.4+**
- **Uso:** Styling system
- **Theme customization:** Emerald Trust (`#10b981` primary)
- **Plugins:** Typography, Forms
- **Benefícios:** Utility-first, sem CSS global, tree-shaking automático

**4. shadcn/ui + Radix UI**
- **Uso:** UI component library
- **Componentes:** Button, Input, Card, Badge, Toast, Dialog, Dropdown
- **Benefícios:** Acessibilidade (WCAG AA), customizável, sem vendor lock-in

**5. Neon PostgreSQL**
- **Versão:** Latest serverless
- **Uso:** Database principal
- **Features:**
  - Branching (dev/staging/prod separados)
  - Autoscaling
  - Connection pooling
- **Free tier:** 0.5GB storage, 5 GB transfer/mês
- **Paid tier (futuro):** $19/mês para 3GB, 15 GB transfer

**6. Drizzle ORM**
- **Versão:** Latest
- **Uso:** Database ORM
- **Features:**
  - Type-safe SQL queries
  - Schema migrations
  - Relations
- **Por que não Prisma:** Drizzle é mais leve, migrations mais simples, melhor performance

**7. NextAuth.js v5**
- **Versão:** 5.0+ (Auth.js)
- **Uso:** Authentication
- **Provider:** Email (Magic Link)
- **Session:** JWT (stateless)
- **Features:**
  - Magic link email
  - Session management
  - CSRF protection
  - Secure cookies

**8. Resend**
- **Uso:** Email service
- **Free tier:** 3.000 emails/mês, 100 emails/dia
- **Templates:** React components (.tsx)
- **Features:** Logs, analytics, webhooks
- **Por que não SendGrid/Mailgun:** DX superior, templates React, free tier generoso

**9. React Hook Form + Zod**
- **Uso:** Form handling + validation
- **Features:**
  - Performance (uncontrolled forms)
  - Type-safe validation schemas
  - Error handling
- **Integração:** `@hookform/resolvers/zod`

**10. Vercel (Deployment)**
- **Free tier:** Até 100 GB-hours/mês
- **Features:**
  - CI/CD automático (git push = deploy)
  - Preview deployments (PRs)
  - Edge network global
  - Serverless functions
  - Cron jobs
  - Analytics
  - Logs
- **Paid tier (futuro):** $20/mês Pro quando escalar

---

### Integration Points

**1. Caixa Lottery API**
- **Endpoint:** `https://servicebus2.caixa.gov.br/portaldeloterias/api/*`
- **Uso:** Buscar resultados oficiais de sorteios
- **Autenticação:** Pública (sem API key)
- **Rate limit:** Desconhecido (usar com cuidado)
- **Retry strategy:** Polling com backoff exponencial
- **Fallback:** API guto-alves se Caixa offline

**2. guto-alves API (Fallback)**
- **Endpoint:** `https://loteriascaixa-api.herokuapp.com/api/*`
- **Uso:** Backup quando Caixa API falha
- **Features:** Dados históricos + resultados recentes
- **Nota:** Não oficial, pode ter delay

**3. Vercel Cron**
- **Config:** `vercel.json`
- **Jobs:**
  - `verify-prizes`: Roda após sorteios oficiais (Wed/Sat 20:30)
  - Polling até resultado disponível
- **Endpoint:** `/api/cron/verify-prizes`
- **Auth:** Vercel Cron secret header

**4. Resend Webhooks**
- **Events:** Email opened, clicked, bounced
- **Endpoint:** `/api/webhooks/resend`
- **Auth:** Webhook signing secret
- **Uso:** Track email engagement (opcional para MVP)

---

## Implementation Patterns

### 1. Server Components vs Client Components

**Regra:** Use Server Components por padrão, Client Components apenas quando necessário

**Server Component (padrão):**
```tsx
// app/history/page.tsx
export default async function HistoryPage() {
  const suggestions = await db.query.suggestions.findMany()
  return <HistoryList suggestions={suggestions} />
}
```

**Client Component (quando precisa de state/events):**
```tsx
// components/lottery/ValueInput.tsx
'use client'

export function ValueInput({ onChange }: Props) {
  const [value, setValue] = useState(0)
  // ...
}
```

**Quando usar Client Component:**
- ✅ `useState`, `useEffect`, event handlers
- ✅ Browser APIs (localStorage, geolocation)
- ✅ Interatividade (click, hover, focus)

**Quando usar Server Component:**
- ✅ Data fetching
- ✅ Direct database access
- ✅ Secrets (API keys)
- ✅ Renderização estática

---

### 2. Data Fetching Pattern

**Server Actions para mutations:**
```tsx
// app/actions/suggestions.ts
'use server'

export async function createSuggestion(valueInCents: number) {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
  
  // Gerar sugestão
  const games = await wheelingEngine.generate({ value: valueInCents })
  
  // Salvar no banco
  const suggestion = await db.insert(suggestions).values({
    userId: session.user.id,
    games,
    value: valueInCents
  })
  
  revalidatePath('/dashboard')
  return suggestion
}
```

**Uso no componente:**
```tsx
// app/(dashboard)/generate/page.tsx
import { createSuggestion } from '@/app/actions/suggestions'

export default function GeneratePage() {
  return (
    <form action={createSuggestion}>
      <ValueInput name="value" />
      <button type="submit">Gerar</button>
    </form>
  )
}
```

---

### 3. Error Handling Pattern

**Try-catch com custom errors:**
```tsx
// lib/lottery/suggester.ts
export class SuggestionError extends Error {
  constructor(
    message: string,
    public code: 'INVALID_VALUE' | 'NO_TEMPLATE_FOUND' | 'GENERATION_FAILED'
  ) {
    super(message)
    this.name = 'SuggestionError'
  }
}

export async function generateSuggestion(value: number) {
  if (value < 1000) { // R$ 10,00 em centavos
    throw new SuggestionError('Valor mínimo R$ 10', 'INVALID_VALUE')
  }
  // ...
}
```

**Error boundary no app:**
```tsx
// app/error.tsx
'use client'

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div>
      <h2>Algo deu errado</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Tentar novamente</button>
    </div>
  )
}
```

---

### 4. Database Query Pattern (Drizzle)

**Schema definition:**
```ts
// lib/db/schema.ts
import { pgTable, serial, text, integer, timestamp, jsonb } from 'drizzle-orm/pg-core'

export const suggestions = pgTable('suggestions', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  games: jsonb('games').$type<Game[]>().notNull(),
  value: integer('value').notNull(), // em centavos
  lottery: text('lottery').notNull(), // 'megasena' | 'lotofacil'
  status: text('status').notNull(), // 'pending' | 'realized' | 'verified'
  createdAt: timestamp('created_at').defaultNow(),
})
```

**Query:**
```ts
// lib/db/queries.ts
import { db } from '@/lib/db'
import { suggestions } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function getUserSuggestions(userId: string) {
  return await db
    .select()
    .from(suggestions)
    .where(eq(suggestions.userId, userId))
    .orderBy(desc(suggestions.createdAt))
}
```

---

### 5. Validation Pattern (Zod)

**Schema definition:**
```ts
// lib/utils/validators.ts
import { z } from 'zod'

export const createSuggestionSchema = z.object({
  value: z.number()
    .min(1000, 'Valor mínimo R$ 10')
    .max(50000, 'Valor máximo R$ 500'),
})

export type CreateSuggestionInput = z.infer<typeof createSuggestionSchema>
```

**Uso:**
```ts
// app/api/suggestions/route.ts
export async function POST(req: Request) {
  const body = await req.json()
  const validated = createSuggestionSchema.parse(body) // throws se inválido
  // ...
}
```

---

## Consistency Rules

### Naming Conventions

**Files:**
- Components: `PascalCase.tsx` (ex: `LotteryGameCard.tsx`)
- Utilities: `camelCase.ts` (ex: `formatCurrency.ts`)
- API routes: `route.ts` (Next.js convention)
- Actions: `actions.ts` ou `mutations.ts`

**Functions:**
- Components: `PascalCase` (ex: `function ValueInput()`)
- Utilities: `camelCase` (ex: `function formatCurrency()`)
- Server Actions: `camelCase` com prefixo (ex: `async function createSuggestion()`)

**Variables:**
- Constants: `UPPER_SNAKE_CASE` (ex: `const MAX_VALUE_CENTS = 50000`)
- Regular: `camelCase` (ex: `const userName = 'Carlos'`)

**Database:**
- Tables: `snake_case` (ex: `suggestions`, `lottery_results`)
- Columns: `snake_case` (ex: `user_id`, `created_at`)

---

### Code Organization

**Import order:**
```ts
// 1. React/Next imports
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// 2. Third-party libs
import { toast } from 'sonner'
import { z } from 'zod'

// 3. Internal libs
import { db } from '@/lib/db'
import { createSuggestion } from '@/app/actions/suggestions'

// 4. Components
import { Button } from '@/components/ui/button'
import { ValueInput } from '@/components/lottery/ValueInput'

// 5. Types
import type { Suggestion } from '@/types/lottery'

// 6. Styles (se necessário)
import './styles.css'
```

**File structure pattern:**
```ts
// 1. Imports
// 2. Types/Interfaces
// 3. Constants
// 4. Component/Function
// 5. Sub-components (se houver)
// 6. Export
```

---

### Error Handling

**Pattern:**
1. **Throw custom errors** com códigos
2. **Catch no boundary** mais próximo
3. **Log errors** com contexto
4. **Show user-friendly messages**

**Example:**
```ts
// lib/wheeling/engine.ts
try {
  const template = findBestTemplate(numberCount)
  if (!template) {
    throw new WheelError('No template found', 'NO_TEMPLATE')
  }
} catch (error) {
  logger.error('Wheel generation failed', { numberCount, error })
  throw error
}
```

---

### Logging Strategy

**Pattern:** Structured logging com Axiom

```ts
// lib/utils/logger.ts
import { log } from '@axiomhq/next'

export const logger = {
  info: (message: string, meta?: Record<string, any>) => {
    log.info(message, meta)
  },
  error: (message: string, meta?: Record<string, any>) => {
    log.error(message, meta)
  },
  // ... warn, debug
}
```

**Usage:**
```ts
logger.info('Suggestion created', {
  userId: session.user.id,
  value: valueInCents,
  gamesCount: games.length
})
```

---

## Data Architecture

### Database Schema

```sql
-- Users (managed by NextAuth)
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Suggestions (user-generated)
CREATE TABLE suggestions (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  games JSONB NOT NULL, -- Array de jogos [{ numbers: [1,2,3,4,5,6] }, ...]
  value INTEGER NOT NULL, -- Valor em centavos (R$ 150 = 15000)
  lottery TEXT NOT NULL, -- 'megasena' | 'lotofacil'
  wheel_type TEXT NOT NULL, -- 'abbreviated' (futuro: 'full', 'key')
  guarantee TEXT, -- '4 if 4', '3 if 3', etc
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'realized' | 'verified'
  created_at TIMESTAMP DEFAULT NOW(),
  realized_at TIMESTAMP, -- Quando marcou como realizado
  verified_at TIMESTAMP -- Quando foi verificado contra resultado
);

CREATE INDEX idx_suggestions_user_id ON suggestions(user_id);
CREATE INDEX idx_suggestions_status ON suggestions(status);

-- Lottery Results (resultados oficiais Caixa)
CREATE TABLE lottery_results (
  id SERIAL PRIMARY KEY,
  lottery TEXT NOT NULL, -- 'megasena' | 'lotofacil'
  contest_number INTEGER NOT NULL, -- Concurso
  numbers JSONB NOT NULL, -- Números sorteados [1, 5, 12, 23, 34, 45]
  draw_date DATE NOT NULL,
  prizes JSONB, -- Prêmios por faixa { sena: 5000000, quina: 50000, quadra: 1000 }
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(lottery, contest_number)
);

CREATE INDEX idx_lottery_results_lottery ON lottery_results(lottery);
CREATE INDEX idx_lottery_results_draw_date ON lottery_results(draw_date);

-- Prizes (prêmios detectados)
CREATE TABLE prizes (
  id SERIAL PRIMARY KEY,
  suggestion_id INTEGER NOT NULL REFERENCES suggestions(id),
  game_index INTEGER NOT NULL, -- Qual jogo dentro da sugestão (0-based)
  contest_number INTEGER NOT NULL,
  prize_tier TEXT NOT NULL, -- 'sena' | 'quina' | 'quadra' | 'terno'
  prize_value INTEGER, -- Valor do prêmio em centavos (se conhecido)
  matched_numbers JSONB NOT NULL, -- Números que acertou [1, 5, 12, 23]
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_prizes_suggestion_id ON prizes(suggestion_id);

-- User Settings (configurações opcionais)
CREATE TABLE user_settings (
  user_id TEXT PRIMARY KEY REFERENCES users(id),
  notify_results BOOLEAN DEFAULT TRUE,
  notify_prizes BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Data Relationships

```
users (1) → (N) suggestions
suggestions (1) → (N) prizes
lottery_results (1) → (N) prizes (via contest_number)
```

---

## API Contracts

### REST API Endpoints

**POST /api/suggestions**
- **Auth:** Required
- **Body:**
  ```json
  {
    "value": 15000 // R$ 150 em centavos
  }
  ```
- **Response:**
  ```json
  {
    "id": 123,
    "games": [
      { "numbers": [3, 12, 18, 27, 34, 45] },
      { "numbers": [7, 15, 23, 31, 42, 58] }
    ],
    "lottery": "megasena",
    "guarantee": "4 if 4",
    "value": 15000,
    "totalGames": 12
  }
  ```
- **Errors:**
  - `400`: Invalid value
  - `401`: Unauthorized
  - `500`: Generation failed

**GET /api/suggestions**
- **Auth:** Required
- **Query:** `?status=pending|realized|verified&limit=20&offset=0`
- **Response:**
  ```json
  {
    "suggestions": [...],
    "total": 45,
    "hasMore": true
  }
  ```

**GET /api/suggestions/:id**
- **Auth:** Required (owner only)
- **Response:** Single suggestion with prizes

**PATCH /api/suggestions/:id**
- **Auth:** Required (owner only)
- **Body:**
  ```json
  {
    "status": "realized"
  }
  ```

**POST /api/cron/verify-prizes**
- **Auth:** Vercel Cron secret
- **Body:** None
- **Action:** Fetch latest results, verify all realized suggestions
- **Response:**
  ```json
  {
    "verified": 23,
    "prizes": 3
  }
  ```

---

## Security Architecture

### Authentication & Authorization

**Magic Link Flow:**
1. User enters email
2. Server generates signed token (JWT)
3. Send email with link `https://app.com/verify?token=xxx`
4. User clicks link
5. Server verifies token, creates session cookie
6. User authenticated

**Session:**
- Type: JWT
- Storage: HttpOnly cookie
- Duration: 30 days
- Refresh: On activity

**Authorization:**
- Middleware checks session on all `/dashboard/*` routes
- API routes validate session
- Users can only access own data

### Data Security

**No sensitive data stored:**
- ❌ Nenhum dado bancário (nunca armazenamos)
- ❌ Senhas (magic link = passwordless)
- ✅ Apenas email + sugestões geradas

**LGPD Compliance:**
- Email é dado pessoal → precisa consentimento
- User pode deletar conta (GDPR right to be forgotten)
- Logs não contêm PII
- Data retention: 1 ano após última atividade

### Input Validation

**All inputs validated:**
- Zod schemas em todas as APIs
- Type checking com TypeScript
- Sanitização de strings (escape HTML)

### Rate Limiting

**MVP (simples):**
- Vercel default rate limiting
- Futuro: Upstash Redis rate limiter

**Limits:**
- Create suggestion: 20/hora por user
- API calls: 100/hora por IP

---

## Performance Considerations

### Frontend Performance

**Targets (Lighthouse):**
- Performance: >90
- Accessibility: >90
- Best Practices: >90
- SEO: >90

**Strategies:**
- Next.js Image component (WebP, lazy load)
- Font optimization (next/font)
- Code splitting por rota
- Tree shaking (Tailwind purge)
- Skeleton screens (não spinners)

### Backend Performance

**Database:**
- Indexes em queries frequentes (user_id, status, contest_number)
- Connection pooling (Neon built-in)
- Prepared statements (Drizzle)

**API:**
- Edge functions quando possível
- Cache headers (stale-while-revalidate)

**Wheeling Engine:**
- Algoritmo roda em <100ms
- Templates pré-computados (não gera em runtime)

---

## Deployment Architecture

### Vercel Configuration

**vercel.json:**
```json
{
  "crons": [
    {
      "path": "/api/cron/verify-prizes",
      "schedule": "30 20 * * 3,6"
    }
  ]
}
```

**Environment Variables:**
```bash
# Database
DATABASE_URL=postgres://...

# Auth
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://sorte-grande.vercel.app

# Email
RESEND_API_KEY=...

# Cron
CRON_SECRET=...

# Monitoring
AXIOM_TOKEN=...
```

### Environments

**Development:**
- Branch: `dev`
- Database: Neon branch `dev`
- URL: `localhost:3000`

**Staging:**
- Branch: `staging`
- Database: Neon branch `staging`
- URL: Preview deployment (automático)

**Production:**
- Branch: `main`
- Database: Neon branch `main`
- URL: `sorte-grande.vercel.app`

### CI/CD

**Flow:**
1. Push to branch
2. Vercel build automático
3. Preview deployment (branches não-main)
4. Merge to main = production deploy
5. Rollback: Redeploy previous commit

---

## Development Environment

### Prerequisites

- Node.js 20.9+
- pnpm (recomendado) ou npm
- Git
- VS Code (recomendado)

### Setup Commands

```bash
# 1. Clone repo
git clone https://github.com/your-username/sorte-grande.git
cd sorte-grande

# 2. Create Next.js app in /app subdirectory
npx create-next-app@latest app --typescript --tailwind --app --eslint --turbopack --import-alias "@/*"

# 3. Navigate to app directory
cd app

# 4. Install dependencies
pnpm install

# 5. Install additional dependencies
pnpm add drizzle-orm pg
pnpm add -D drizzle-kit @types/pg
pnpm add next-auth@beta
pnpm add resend
pnpm add react-hook-form @hookform/resolvers zod
pnpm add @axiomhq/next
pnpm add sonner # Toast notifications

# 6. Install shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input card badge toast dialog dropdown-menu

# 7. Copy .env.example to .env.local
cp .env.example .env.local

# 8. Configure environment variables
# Edit .env.local with your keys

# 9. Setup database
pnpm drizzle-kit generate:pg
pnpm drizzle-kit push:pg

# 10. Run development server
pnpm dev
```

### First Story

**Story:** Project Initialization
- Create Next.js app with create-next-app
- Configure Tailwind with Emerald Trust theme
- Setup shadcn/ui
- Configure Drizzle + Neon database
- Deploy to Vercel
- **Acceptance:** App roda em production, database conectado

---

## Architecture Decision Records (ADRs)

### ADR-001: Monolith vs Microservices

**Decision:** Monolith (Next.js full-stack)

**Context:** MVP com 50 usuários, team de 1 pessoa

**Rationale:**
- Simplicidade > Complexidade prematura
- Next.js escala até 100k+ usuários facilmente
- Deploy + CI/CD trivial
- Menos moving parts = menos bugs
- Pode decompor depois se necessário (mas provavelmente não vai ser)

**Alternatives:**
- ❌ Microservices - Over-engineering brutal para MVP
- ❌ Separate backend - Duplica deploy, complexidade

---

### ADR-002: Drizzle vs Prisma

**Decision:** Drizzle ORM

**Context:** Need type-safe ORM for PostgreSQL

**Rationale:**
- Drizzle é mais leve (bundle size)
- Migrations mais simples (SQL puro)
- Performance melhor (menos overhead)
- Type inference superior
- Prisma tem lock-in maior

**Alternatives:**
- ❌ Prisma - Mais popular mas mais pesado, migrations em schema declarativo (menos controle)
- ❌ Raw SQL - Sem type safety, muito boilerplate

---

### ADR-003: NextAuth vs Clerk

**Decision:** NextAuth v5

**Context:** Need magic link authentication

**Rationale:**
- Open source, self-hosted (data ownership)
- Magic link built-in
- Free (Clerk cobra após 10k MAU)
- Integração nativa com Next.js
- Community huge

**Alternatives:**
- ❌ Clerk - Paid, vendor lock-in
- ❌ Auth0 - Over-featured, caro
- ❌ Custom - Reinventar roda, security risks

---

### ADR-004: State Management

**Decision:** React Context + Server Actions (no external lib)

**Context:** Need state management for client-side

**Rationale:**
- Simplicidade extrema
- Server Actions eliminam Redux boilerplate
- React Context suficiente para state local
- Zero dependencies extras
- Next.js 14+ encourages this pattern

**Alternatives:**
- ❌ Redux - Overkill total para nosso caso
- ❌ Zustand - Adiciona dependency, Context é suficiente
- ❌ Jotai/Recoil - Over-engineering

---

### ADR-005: Vercel Cron vs External Service

**Decision:** Vercel Cron

**Context:** Need cron job para verificar resultados

**Rationale:**
- Zero configuração extra
- Free tier incluso
- Nativo Vercel (deploy simples)
- Serverless (não precisa manter servidor rodando)

**Alternatives:**
- ❌ GitHub Actions - Separado do app, mais complexo
- ❌ Heroku Scheduler - Outro serviço para gerenciar
- ❌ AWS Lambda - Over-engineering

---

## Implementation Design Decisions

### Wheeling System Template Storage

**Decision:** TypeScript constants with type-safe structure (no database)

**Context:** Story 3.3 requires wheel template storage format specification

**Data Structure:**
```typescript
// Location: lib/wheeling/types.ts
export type WheelTemplate = {
  id: string                    // "mega-8-4if4" or "lotofacil-16-11if11"
  name: string                  // "Mega Sena 8 números"
  lottery: 'megasena' | 'lotofacil'
  wheelSize: number             // 8 (total numbers in wheel)
  gameSize: number              // 6 (numbers per game)
  guarantee: {
    match: number               // 4 (if 4 of your numbers are drawn)
    prize: number               // 4 (guarantee at least quadra)
  }
  combinations: number[][]      // 0-based indices [[0,1,2,3,4,5], ...]
  totalGames: number            // 28 games
  source: string                // "Wikipedia Covering Designs"
  costMultiplier: number        // 28 (for quick cost calculation)
}

// Location: lib/wheeling/templates.ts
export const WHEEL_TEMPLATES: WheelTemplate[] = [
  // Pre-computed templates imported from covering design literature
]
```

**Rationale:**
- **Type-safe:** TypeScript prevents runtime errors with template structure
- **Zero latency:** No database queries for templates (compiled into bundle)
- **Versioned:** Templates in git (track changes, rollback if needed)
- **Testable:** Easy to mock templates in unit tests
- **Simple:** MVP only needs 3-4 templates (Mega 8/10, Lotofácil 16/18)

**Alternatives Considered:**
- ❌ Database storage: Unnecessary complexity for static data, adds latency
- ❌ JSON files: No type safety, harder to validate at build time
- ❌ API endpoint: Over-engineering for data that never changes

**Implementation Notes:**
- Combinations use 0-based indices mapped to selected numbers at runtime
- Example: User selects [3,12,18,27,34,45,52,58], combination [0,1,2,3,4,5] → game [3,12,18,27,34,45]
- Templates sourced from Wikipedia Covering Designs and LaJolla Covering Repository

---

### Admin Dashboard Design System

**Decision:** Blue accent theme with shadcn/ui defaults

**Context:** Stories 9.1-9.5 need admin interface design (Issue #2 resolution)

**Design Specifications:**

**Color Scheme:**
- Primary: `#3b82f6` (blue-500) instead of Emerald Trust `#10b981`
- Secondary: `#60a5fa` (blue-400)
- Background/borders: Same as user dashboard (`#050505`, `#0f0f0f`, `#1a1a1a`)
- Rationale: Visual differentiation between user/admin areas

**Layout:**
- Same sidebar + main content structure as user dashboard
- Sidebar nav items with blue hover states
- Admin badge in header (blue gradient)

**Components:**
- **Metrics Cards:** shadcn/ui Card with larger stats, trend indicators (↑↓)
- **User Table:** shadcn/ui Table with striped rows, pagination, search
- **Job Logs:** shadcn/ui Table with monospace font for JSON output, collapsible details
- **Action Buttons:** shadcn/ui AlertDialog for confirmations (disable user, run job manually)

**Mockup Status:**
- Full HTML mockup deferred to Sprint 8-9 (Epic 9 implementation)
- Reason: Admin is backoffice (low priority), shadcn/ui defaults are production-ready
- Developers will use design tokens documented here + existing user mockups as reference

**Design Tokens:**
```css
/* Admin Theme Overrides */
--admin-primary: #3b82f6;
--admin-primary-hover: #2563eb;
--admin-accent: rgba(59, 130, 246, 0.15);
```

---

### Charting Library Decision

**Decision:** shadcn/ui Chart (Recharts wrapper)

**Context:** Stories 6.3 (user dashboard stats) and 9.2 (admin metrics) need visualizations

**Rationale:**
- **Design consistency:** Built on Recharts but styled with shadcn/ui tokens
- **Accessible:** Radix UI base ensures WCAG compliance
- **Tailwind styling:** Easy customization with utility classes
- **Simple charts only:** MVP needs bar charts (suggestions per week) and trend indicators
- **Zero additional config:** Already aligned with shadcn/ui installation

**Charts Needed:**

**Story 6.3 (User Dashboard):**
- Simple bar chart: Suggestions created per week (last 8 weeks)
- Trend indicators: ↑↓ for total invested, prizes won
- Stats cards: Large numbers with small sparklines (optional, can use just numbers)

**Story 9.2 (Admin Metrics):**
- Bar chart: New users per week
- Line chart: Retention rate over time
- Stats grid: 6 metric cards with trend arrows

**Implementation:**
```bash
npx shadcn-ui@latest add chart
```

**Alternatives Considered:**
- ❌ Recharts directly: More configuration, styling inconsistency
- ❌ Chart.js: Not React-native, wrapper adds overhead, styling complex
- ❌ Victory: Heavier bundle, less community support
- ❌ Custom D3: Over-engineering for simple bar/line charts

**Deferred Decision:**
- If charts need becomes complex (heatmaps, treemaps), re-evaluate in Sprint 6
- For MVP, simple bar/line charts with shadcn/ui Chart are sufficient

---

**Implementation Status:**

✅ All architectural decisions documented
✅ Wheeling template structure defined (`lib/wheeling/types.ts`)
✅ Admin design system specified (blue theme + shadcn/ui)
✅ Charting library decided (shadcn/ui Chart)
✅ Ready for Sprint Planning (`*sprint-planning`)

