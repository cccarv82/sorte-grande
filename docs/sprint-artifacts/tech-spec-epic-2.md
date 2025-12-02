# Epic Technical Specification: User Authentication

Date: 2025-12-01
Author: Carlos
Epic ID: 2
Status: Draft

---

## Overview

O Epic 2 implementa o sistema completo de autenticação via magic link para o Sorte Grande, permitindo que usuários criem contas e façam login usando apenas email, sem necessidade de senhas. Este sistema é fundamentado em NextAuth.js v5 com EmailProvider e Resend como serviço de SMTP, garantindo uma experiência de autenticação moderna, segura e sem fricção.

A implementação cobre todo o fluxo: desde a página de login, passando pela geração e envio de magic links, até o gerenciamento de sessões JWT com middleware de proteção de rotas. O Epic também inclui funcionalidades críticas para o MVP como o limite de 50 usuários e a capacidade de edição de perfil básica.

## Objectives and Scope

**In-Scope:**
- ✅ Página de login com input de email e validação
- ✅ Página de verificação (waiting page) com countdown para reenvio
- ✅ Template de email profissional com magic link
- ✅ Gerenciamento de sessões JWT (30 dias de duração)
- ✅ Middleware de proteção de rotas (/dashboard/*)
- ✅ Funcionalidade de logout com dropdown de avatar
- ✅ Hard limit de 50 usuários para MVP (com mensagem de waitlist)
- ✅ Página de edição de perfil (nome) em /dashboard/settings
- ✅ Revalidação de sessão após edição de perfil

**Out-of-Scope:**
- ❌ Autenticação social (Google, Facebook) - reservado para futuro
- ❌ Autenticação de dois fatores (2FA)
- ❌ Recuperação de conta (não há senha para recuperar)
- ❌ Múltiplas sessões simultâneas
- ❌ Perfil avançado (foto, preferências de loteria) - Epic 10
- ❌ Exclusão de conta (LGPD) - Epic 10
- ❌ Admin panel de gestão de usuários - Epic 9

## System Architecture Alignment

**Next.js 16 App Router:**
- Route groups: `(auth)` para páginas públicas de autenticação, `(dashboard)` para áreas protegidas
- Server Components para páginas de conteúdo estático (verify page)
- Client Components para interatividade (login form, countdown timer, avatar dropdown)
- Middleware.ts para interceptação e redirecionamento de rotas não autenticadas

**NextAuth.js v5 (Auth.js):**
- EmailProvider com Resend como transporte SMTP
- JWT session strategy (stateless, sem database session)
- Custom callbacks para estender sessão com dados do usuário
- Adapter Drizzle para persistência de usuários e tokens de verificação

**Neon PostgreSQL + Drizzle ORM:**
- Tabela `users` gerenciada pelo NextAuth (via DrizzleAdapter)
- Tabela `verification_tokens` para magic links temporários
- Indexes em `users.email` (unique) para lookup rápido
- Campo `users.disabled` para implementar MVP limit (Story 2.6)

**Resend:**
- Free tier: 3.000 emails/mês (suficiente para MVP de 50 usuários)
- Templates React (.tsx) com inline CSS
- Logs de email enviados para debug
- Webhook opcional para rastreamento (fora do MVP)

**Constraints:**
- Magic links expiram em 15 minutos (NFR-S1)
- Sessões JWT expiram após 30 dias de inatividade (NFR-S1)
- Rate limiting: máximo 3 magic links por hora por email (NFR-S1)
- MVP limit: máximo 50 usuários cadastrados no sistema

---

## Detailed Design

### Services and Modules

| Service/Module | Responsibility | Inputs | Outputs | Owner |
|---------------|----------------|--------|---------|-------|
| **AuthConfig** (`lib/auth/config.ts`) | Configuração central do NextAuth.js | Environment vars (DATABASE_URL, RESEND_API_KEY, NEXTAUTH_SECRET) | NextAuth configuration object | Backend |
| **LoginPage** (`app/(auth)/login/page.tsx`) | UI de login com form de email | User email input | Magic link request trigger | Frontend |
| **VerifyPage** (`app/(auth)/verify/page.tsx`) | Waiting page pós-envio de magic link | Email (searchParams) | Visual confirmation + resend button | Frontend |
| **AuthMiddleware** (`middleware.ts`) | Proteção de rotas autenticadas | Request path + session status | Redirect para /login ou allow | Backend |
| **MagicLinkTemplate** (`lib/email/templates/magic-link.tsx`) | Template HTML do email | Magic link URL, user email | Formatted email HTML | Backend |
| **EmailSender** (`lib/email/sender.ts`) | Abstração Resend API | Template + recipient | Email sent confirmation | Backend |
| **UserProfilePage** (`app/(dashboard)/settings/page.tsx`) | Edição de perfil do usuário | User session | Form para editar nome | Frontend |
| **UpdateProfileAction** (`app/actions/auth.ts`) | Server Action para atualização de perfil | New name, user ID | Updated user + revalidated session | Backend |
| **MVPLimitChecker** (`lib/auth/mvp-limit.ts`) | Verifica se atingiu 50 usuários | - | Boolean (can register) | Backend |

**Flow de Autenticação:**
1. Usuário acessa `/login` → LoginPage renderiza form
2. Usuário submete email → NextAuth `signIn('email')` chamado
3. NextAuth verifica MVPLimitChecker → se ok, cria verification token
4. NextAuth chama EmailSender com MagicLinkTemplate
5. Resend envia email → usuário redirecionado para `/verify`
6. Usuário clica link no email → NextAuth valida token
7. NextAuth cria sessão JWT → cookie httpOnly setado
8. Middleware permite acesso a `/dashboard/*`

### Data Models and Contracts

**User Model (Drizzle Schema):**
```typescript
// lib/db/schema.ts
export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  name: text('name'),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  image: text('image'), // Não usado no MVP, mas NextAuth exige
  disabled: boolean('disabled').default(false), // Para MVP limit
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
})

export const verificationTokens = pgTable('verification_tokens', {
  identifier: text('identifier').notNull(), // email
  token: text('token').notNull().unique(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
}, (vt) => ({
  compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
}))
```

**Session JWT Payload:**
```typescript
// lib/auth/config.ts - jwt callback
interface SessionJWT {
  sub: string // user.id
  email: string
  name: string | null
  iat: number // issued at
  exp: number // expires at (30 days)
}
```

**Login Form Schema (Zod):**
```typescript
// lib/validations/auth.ts
export const loginSchema = z.object({
  email: z.string()
    .email('Email inválido')
    .min(5, 'Email muito curto')
    .max(255, 'Email muito longo')
    .toLowerCase()
    .trim(),
})

export type LoginInput = z.infer<typeof loginSchema>
```

**Update Profile Schema:**
```typescript
export const updateProfileSchema = z.object({
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo')
    .trim()
    .optional(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
```

### APIs and Interfaces

**NextAuth API Routes (Auto-generated):**
```
POST /api/auth/signin/email
  Body: { email: string, callbackUrl?: string }
  Response: { url: string } (redirect to /verify)

GET /api/auth/callback/email?token=xxx&email=xxx
  Query: { token, email }
  Response: Set-Cookie + redirect to callbackUrl or /dashboard

POST /api/auth/signout
  Body: { callbackUrl?: string }
  Response: Clear cookie + redirect to /login

GET /api/auth/session
  Response: { user: { id, email, name }, expires }
```

**Server Action - Update Profile:**
```typescript
// app/actions/auth.ts
'use server'

export async function updateProfile(data: UpdateProfileInput) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: 'Unauthorized' }
  }

  const validated = updateProfileSchema.parse(data)
  
  await db
    .update(users)
    .set({ name: validated.name })
    .where(eq(users.id, session.user.id))

  revalidatePath('/dashboard/settings')
  
  return { success: true }
}
```

**MVP Limit Checker:**
```typescript
// lib/auth/mvp-limit.ts
export async function canRegisterNewUser(): Promise<boolean> {
  const count = await db
    .select({ count: sql<number>`count(*)` })
    .from(users)
    .where(eq(users.disabled, false))

  return count[0].count < 50
}
```

### Workflows and Sequencing

**Sequence: Magic Link Flow**
```
User -> LoginPage: Enter email
LoginPage -> NextAuth: signIn('email', { email })
NextAuth -> MVPLimitChecker: canRegisterNewUser()
MVPLimitChecker -> Database: SELECT COUNT(*) FROM users
Database -> MVPLimitChecker: count result
MVPLimitChecker -> NextAuth: boolean (can register)

[If limit reached]
  NextAuth -> LoginPage: Error "MVP lotado"
  LoginPage -> User: Show error toast + waitlist link

[If under limit]
  NextAuth -> Database: INSERT INTO verification_tokens
  Database -> NextAuth: Token created
  NextAuth -> EmailSender: send({ to: email, template: MagicLink, token })
  EmailSender -> Resend API: POST /emails
  Resend API -> EmailSender: Email queued
  EmailSender -> NextAuth: Success
  NextAuth -> LoginPage: Redirect to /verify?email=xxx
  LoginPage -> VerifyPage: Navigate

User -> Email Client: Check inbox
Email Client -> User: Show magic link email
User -> Magic Link: Click link
Magic Link -> NextAuth Callback: GET /api/auth/callback/email?token=xxx
NextAuth Callback -> Database: SELECT FROM verification_tokens WHERE token=xxx
Database -> NextAuth Callback: Token valid + user email
NextAuth Callback -> Database: DELETE verification_token (one-time use)
NextAuth Callback -> Database: UPDATE users SET emailVerified=NOW() WHERE email=xxx
NextAuth Callback -> User: Set-Cookie(session JWT) + Redirect /dashboard
```

**Sequence: Protected Route Access**
```
User -> Browser: Navigate to /dashboard/generate
Browser -> Middleware: Request /dashboard/generate
Middleware -> NextAuth: auth() (check session cookie)
NextAuth -> Middleware: Session object or null

[If no session]
  Middleware -> Browser: Redirect /login?callbackUrl=/dashboard/generate
  Browser -> LoginPage: Show login form

[If session valid]
  Middleware -> Next.js: Allow request
  Next.js -> DashboardPage: Render protected page
  DashboardPage -> User: Show content
```

**Sequence: Logout**
```
User -> AvatarDropdown: Click "Sair"
AvatarDropdown -> NextAuth: signOut()
NextAuth -> Browser: Clear session cookie
Browser -> Middleware: Next request (no session)
Middleware -> Browser: Redirect /login
Browser -> LoginPage: Show login form
LoginPage -> User: Toast "Você saiu com sucesso"
```

---

## Non-Functional Requirements

### Performance

**NFR-P1: Magic Link Generation**
- Target: <500ms from form submit to /verify redirect
- Measured: Server Action execution time
- Rationale: Usuário deve sentir que foi instantâneo

**NFR-P2: Email Delivery**
- Target: <10s from trigger até email na caixa de entrada
- Measured: Resend webhook delivery time
- Rationale: Usuário esperando na página /verify

**NFR-P3: Session Validation**
- Target: <50ms middleware check
- Measured: Middleware execution time
- Rationale: Não adiciona latência perceptível à navegação

**NFR-P4: Profile Update**
- Target: <200ms Server Action execution
- Measured: Database update + revalidation time
- Rationale: Feedback imediato ao salvar

### Security

**NFR-S1: Magic Link Expiration**
- Requirement: Tokens expiram em 15 minutos após geração
- Implementation: Database `expires` timestamp checked by NextAuth
- Rationale: Reduz janela de vulnerabilidade se email interceptado

**NFR-S2: Session Duration**
- Requirement: JWT sessions válidas por 30 dias desde última atividade
- Implementation: NextAuth JWT maxAge + sliding window
- Rationale: Balanço entre conveniência e segurança

**NFR-S3: Rate Limiting**
- Requirement: Máximo 3 tentativas de magic link por hora por email
- Implementation: Redis cache (futuro) ou in-memory Map no MVP
- Rationale: Previne spam e abuse de email service

**NFR-S4: One-Time Token**
- Requirement: Token de verificação usado apenas uma vez
- Implementation: DELETE from verification_tokens após uso
- Rationale: Previne replay attacks

**NFR-S5: Secure Cookies**
- Requirement: Session cookies com httpOnly, secure, sameSite=lax
- Implementation: NextAuth default config
- Rationale: Previne XSS e CSRF

### Reliability/Availability

**NFR-R1: Email Fallback**
- Requirement: Se Resend falhar, log erro mas não bloqueia usuário
- Implementation: Try/catch em EmailSender + fallback message
- Rationale: Não deixar usuário travado sem feedback

**NFR-R2: Token Cleanup**
- Requirement: Tokens expirados removidos automaticamente
- Implementation: Vercel cron job diário (futuro) ou NextAuth cleanup
- Rationale: Previne crescimento infinito da tabela

**NFR-R3: Session Recovery**
- Requirement: Se JWT corrompido, limpar e redirecionar para login
- Implementation: Middleware try/catch em auth()
- Rationale: Graceful degradation

### Observability

**NFR-O1: Auth Events Logging**
- Events: login_attempt, magic_link_sent, token_verified, login_success, login_failed, logout
- Implementation: Axiom structured logs
- Fields: userId, email, timestamp, ip, user_agent, error
- Rationale: Debug problemas de autenticação + detecção de anomalias

**NFR-O2: Email Delivery Tracking**
- Metrics: emails_sent_count, emails_delivered_count, emails_bounced_count
- Implementation: Resend webhooks + Axiom (futuro MVP)
- Rationale: Monitorar saúde do email service

**NFR-O3: MVP Limit Monitoring**
- Metric: current_user_count (gauge)
- Implementation: Vercel Analytics custom metric
- Alert: Quando > 45 usuários (90% do limite)
- Rationale: Saber quando MVP vai lotar

---

## Dependencies and Integrations

### External Dependencies

**Production Dependencies:**
```json
{
  "next": "^16.0.0",
  "next-auth": "^5.0.0-beta.25",
  "@auth/drizzle-adapter": "^1.7.0",
  "drizzle-orm": "^0.36.0",
  "postgres": "^3.4.5",
  "resend": "^4.0.1",
  "react-email": "^3.0.3",
  "zod": "^3.23.8",
  "react-hook-form": "^7.54.2",
  "@hookform/resolvers": "^3.9.1"
}
```

**Dev Dependencies:**
```json
{
  "drizzle-kit": "^0.28.1",
  "@types/node": "^22.0.0",
  "typescript": "^5.7.2"
}
```

### Integration Points

**1. Neon PostgreSQL**
- Connection: `DATABASE_URL` environment variable
- Pooling: Neon's native connection pooling
- Tables: `users`, `verification_tokens`
- Migrations: Drizzle Kit push/migrate

**2. Resend API**
- Endpoint: `https://api.resend.com/emails`
- Auth: `RESEND_API_KEY` header
- Rate limits: 100 requests/second (Free tier)
- Quotas: 3.000 emails/mês, 100/dia

**3. NextAuth.js**
- Version: 5.0 (beta - stable for production)
- Adapter: DrizzleAdapter (connects NextAuth to Neon)
- Providers: EmailProvider only
- Session: JWT strategy

**4. shadcn/ui Components**
- Used: Input, Button, Label, Toast, Card, DropdownMenu, Avatar
- Theme: Emerald Trust (#10b981 primary)
- Installation: Copy to `components/ui/`

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000" # ou https://sorte-grande.vercel.app
NEXTAUTH_SECRET="generate-random-32-char-secret" # openssl rand -base64 32

# Email
RESEND_API_KEY="re_xxxxxxxxxxxxx"
EMAIL_FROM="noreply@sortegrande.com.br"

# MVP Config
MVP_USER_LIMIT="50"
WAITLIST_FORM_URL="https://forms.gle/xxxxxxxxxxxx"
```

---

## Acceptance Criteria (Authoritative)

**AC1: Usuário pode solicitar magic link**
- Given: Usuário acessa /login
- When: Digita email válido e clica "Enviar magic link"
- Then: Redirecionado para /verify?email=xxx
- And: Toast "Email enviado!" aparece
- And: Email com magic link recebido em até 10 segundos

**AC2: Magic link funciona corretamente**
- Given: Usuário recebeu magic link no email
- When: Clica no link dentro de 15 minutos
- Then: Redirecionado para /dashboard
- And: Sessão JWT criada (cookie httpOnly)
- And: Pode acessar todas as rotas /dashboard/*

**AC3: Magic link expira após 15 minutos**
- Given: Magic link gerado
- When: Usuário tenta clicar após 15+ minutos
- Then: Redirecionado para /login
- And: Mensagem de erro "Link expirado, solicite um novo"

**AC4: Rotas protegidas requerem autenticação**
- Given: Usuário não autenticado
- When: Tenta acessar /dashboard ou /dashboard/generate
- Then: Redirecionado para /login?callbackUrl=/dashboard
- And: Após login bem-sucedido, retorna para página original

**AC5: Usuário pode fazer logout**
- Given: Usuário autenticado em /dashboard
- When: Clica avatar → "Sair"
- Then: Sessão invalidada (cookie limpo)
- And: Redirecionado para /login
- And: Toast "Você saiu com sucesso"

**AC6: MVP limit bloqueia registro após 50 usuários**
- Given: 50 usuários cadastrados
- When: Novo usuário tenta solicitar magic link
- Then: Erro "MVP lotado - lista de espera aberta"
- And: Email NÃO é enviado
- And: Link para Google Form waitlist exibido

**AC7: Usuário pode editar perfil**
- Given: Usuário autenticado em /dashboard/settings
- When: Edita campo "Nome" e clica "Salvar"
- Then: Nome atualizado no banco (users.name)
- And: Toast "Perfil atualizado!"
- And: Header/Avatar reflete novo nome imediatamente

**AC8: Email é read-only no perfil**
- Given: Usuário em /dashboard/settings
- Then: Campo "Email" está desabilitado (readonly)
- And: Tooltip explica "Email não pode ser alterado"

**AC9: Página de verificação tem countdown para reenvio**
- Given: Usuário em /verify após solicitar magic link
- Then: Vê "Email enviado para xxx"
- And: Botão "Reenviar email" desabilitado por 30 segundos
- And: Countdown visual mostra tempo restante
- When: Countdown termina
- Then: Botão "Reenviar" habilitado

**AC10: Sessão expira após 30 dias de inatividade**
- Given: Usuário fez login
- When: Não acessa o sistema por 30+ dias
- Then: Na próxima tentativa de acesso, redirecionado para /login
- And: Mensagem "Sessão expirada, faça login novamente"

---

## Traceability Mapping

| AC | Spec Section | Components/APIs | Test Idea |
|----|--------------|-----------------|-----------|
| AC1 | APIs and Interfaces: POST /api/auth/signin/email | LoginPage, NextAuth signIn(), EmailSender | Cypress: Preencher form, verificar redirect + email enviado |
| AC2 | Workflows: Magic Link Flow | NextAuth Callback, Middleware | Playwright: Clicar link de email de teste, verificar cookie setado |
| AC3 | NFR-S1: Magic Link Expiration | Database verification_tokens.expires | Unit test: Mock timestamp + 16min, expect erro |
| AC4 | Workflows: Protected Route Access | Middleware, NextAuth auth() | Cypress: Tentar /dashboard sem sessão, verificar redirect |
| AC5 | APIs: POST /api/auth/signout | AvatarDropdown, NextAuth signOut() | Playwright: Clicar logout, verificar cookie limpo + redirect |
| AC6 | Services: MVPLimitChecker | MVPLimitChecker.canRegisterNewUser() | Unit test: Mock 50 users, expect error message |
| AC7 | APIs: Server Action updateProfile | UpdateProfileAction, UserProfilePage | Playwright: Editar nome, salvar, verificar DB + UI atualizada |
| AC8 | Data Models: User readonly email | UserProfilePage disabled input | Snapshot test: Verificar input readonly attribute |
| AC9 | Services: VerifyPage countdown | VerifyPage ResendButton Client Component | Cypress: Component test countdown timer |
| AC10 | NFR-S2: Session Duration | NextAuth JWT maxAge | Manual test: Mock system time +31 days, expect re-login |

---

## Risks, Assumptions, Open Questions

### Risks

**R1: Resend free tier limits**
- Risk: 100 emails/dia pode ser insuficiente se testes/bugs gerarem muitos envios
- Probability: Medium
- Impact: Medium
- Mitigation: Monitorar uso Resend dashboard, preparar upgrade para tier pago ($20/mês = 50k emails)

**R2: Magic links em spam**
- Risk: Emails podem cair em spam, usuários não conseguem login
- Probability: Low-Medium (Resend tem boa reputação)
- Impact: High (usuário não consegue entrar)
- Mitigation: 
  - Configurar SPF/DKIM/DMARC no domínio
  - Testar com Gmail, Outlook, ProtonMail antes do MVP
  - Fallback: Mostrar instrução "Verifique spam" na página /verify

**R3: NextAuth v5 beta stability**
- Risk: Versão beta pode ter bugs
- Probability: Low (v5 beta já é production-ready segundo docs)
- Impact: High (bloquearia todo o login)
- Mitigation: Testar exaustivamente no staging, ter rollback plan para v4 se necessário

**R4: Middleware performance**
- Risk: Middleware em TODAS as requests pode adicionar latência
- Probability: Low (NextAuth middleware é otimizado)
- Impact: Medium (UX degradada)
- Mitigation: Benchmarking com Artillery.io, otimizar matcher do middleware para apenas /dashboard/*

### Assumptions

**A1: Usuários têm acesso confiável a email**
- Assumption: MVP target (friends & family) usa Gmail/Outlook modernos
- Validation: Survey pré-MVP sobre provedor de email

**A2: 15 minutos é suficiente para abrir email**
- Assumption: Usuários verificam email rapidamente
- Validation: Monitorar métricas de conversão (magic link clicado / enviado)

**A3: JWT sessions são aceitáveis (sem revogação imediata)**
- Assumption: Não precisamos invalidar sessões remotamente no MVP
- Validation: Se abuse detectado, implementar revogação via database (pós-MVP)

**A4: 50 usuários é suficiente para validação**
- Assumption: MVP friends & family consegue feedback qualitativo robusto
- Validation: Surveys + entrevistas qualitativas

### Open Questions

**Q1: Devemos implementar "Lembrar de mim" (sessão permanente)?**
- Current: Sessão expira após 30 dias sempre
- Alternative: Checkbox "Manter conectado" que estende para 90 dias
- Decision needed: Antes de Story 2.4 (Session Management)

**Q2: Email de boas-vindas após primeiro login?**
- Current: Não há email de onboarding
- Alternative: Enviar "Bem-vindo ao Sorte Grande" com tour do sistema
- Decision needed: Se sim, implementar em Story 2.3

**Q3: Permitir troca de email no futuro?**
- Current: Email é readonly e imutável
- Alternative: Fluxo de verificação de novo email (complexo)
- Decision needed: Avaliar demanda no feedback do MVP

**Q4: Implementar "Confiar neste dispositivo" para pular magic link?**
- Current: Sempre solicita magic link
- Alternative: Cookie de longa duração no dispositivo (OAuth-like)
- Decision needed: Post-MVP se houver feedback de fricção

---

## Test Strategy Summary

### Test Levels

**Unit Tests (Vitest):**
- Target: 80% coverage em lib/auth/*
- Focus: MVPLimitChecker, validation schemas (Zod), helpers
- Mocks: Database calls, Resend API
- Example: 
  - `canRegisterNewUser()` com diferentes counts
  - `loginSchema.parse()` com emails válidos/inválidos

**Integration Tests (Playwright):**
- Target: Happy paths completos + error paths críticos
- Focus: Fluxos end-to-end de autenticação
- Example:
  - Fluxo completo: Login → Email → Clicar link → Dashboard
  - Logout → Tentar acessar rota protegida → Redirect login
  - Editar perfil → Verificar mudança persistida

**Component Tests (Cypress Component Testing):**
- Target: Componentes interativos isolados
- Focus: LoginPage form, VerifyPage countdown, AvatarDropdown
- Example:
  - LoginPage: Validação inline de email inválido
  - VerifyPage: Countdown timer atinge zero e habilita botão

**Manual Tests:**
- Email delivery em diferentes provedores (Gmail, Outlook, ProtonMail)
- MVP limit: Criar 50 contas e verificar bloqueio na 51ª
- Session expiration: Aguardar 30 dias (ou mockar tempo)

### Coverage of ACs

| AC | Test Type | Test Description |
|----|-----------|------------------|
| AC1 | Integration | Playwright: Submit form → Verificar redirect /verify + email enviado |
| AC2 | Integration | Playwright: Clicar magic link → Verificar cookie + redirect /dashboard |
| AC3 | Unit | Vitest: Mock timestamp expirado, expect erro no callback |
| AC4 | Integration | Playwright: Acesso /dashboard sem auth → Verificar redirect /login |
| AC5 | Integration | Playwright: Logout → Verificar cookie limpo + redirect |
| AC6 | Unit | Vitest: Mock 50 users no DB, expect canRegisterNewUser() = false |
| AC7 | Integration | Playwright: Editar nome → Salvar → Verificar DB update + UI change |
| AC8 | Component | Cypress: Snapshot test input disabled attribute |
| AC9 | Component | Cypress: Countdown timer behavior |
| AC10 | Manual | Mock system time +31 days, tentar acesso, expect re-login |

### Edge Cases

**Edge1: Email já cadastrado tenta novo magic link**
- Expected: Sucesso (envia novo link, invalida anterior)
- Test: Integration test com 2 magic links consecutivos

**Edge2: Usuário clica magic link 2x (reload da callback page)**
- Expected: Segunda vez falha (token já usado), mas sessão já criada então redirect funciona
- Test: Integration test com double click

**Edge3: Concurrent logins de dispositivos diferentes**
- Expected: Ambos funcionam (JWT stateless permite)
- Test: Manual com 2 browsers diferentes

**Edge4: Nome vazio no perfil**
- Expected: Validação Zod bloqueia (min 2 chars)
- Test: Component test com string vazia

**Edge5: SQL injection no email field**
- Expected: Zod + Drizzle sanitizam, nenhum efeito
- Test: Unit test com payload `'; DROP TABLE users; --`

---

**Status:** ✅ Tech Spec Complete - Ready for Story Creation

**Next Steps:**
1. Review e aprovação deste Tech Spec
2. Executar workflow `*create-story` para criar Story 2.1
3. Cada story será implementada incrementalmente
4. Code review após cada story
5. Integration tests após Epic completo

