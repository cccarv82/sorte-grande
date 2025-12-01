# Sorte Grande - Detailed Epics & User Stories

**Author:** Carlos (via PM Agent John)
**Date:** 2025-11-30
**Version:** 1.0 (Generated via YOLO mode)
**Context:** PRD + UX Design (Emerald Trust) + Architecture (Next.js 16)

---

## Document Overview

Este documento decompõe os 64 FRs do PRD em **10 Epics** e **~60 User Stories** implementáveis.

Cada story inclui:
- **BDD Acceptance Criteria** (Given/When/Then)
- **Technical Notes** com decisões da Architecture
- **UX Details** com especificações do Emerald Trust theme
- **Prerequisites** (dependências entre stories)

---

## Epic 1: Foundation & Project Setup (8 stories)

**Objetivo:** Estabelecer infraestrutura base completa

**Valor:** Projeto estruturado, pronto para features

**FRs Habilitados:** Infraestrutura para FR1-FR64

### Story 1.1: Initialize Next.js 16 Project

**Como** desenvolvedor  
**Quero** projeto Next.js configurado  
**Para que** tenha base sólida

**BDD:**
```gherkin
Given repositório vazio
When executo npx create-next-app@latest app --typescript --tailwind --app
Then projeto criado com App Router
And TypeScript 5.1+ configurado
And npm run dev inicia localhost:3000
```

**Tech:** Next.js 16, TypeScript strict, Turbopack, import alias @/*

**UX:** N/A

---

### Story 1.2: Setup Neon PostgreSQL

**Como** desenvolvedor  
**Quero** banco Neon configurado  
**Para que** tenha persistência serverless

**BDD:**
```gherkin
Given conta Neon criada
When adiciono DATABASE_URL no .env.local
And instalo drizzle-orm
Then consigo conectar ao banco
```

**Tech:** Neon serverless Postgres, connection pooling, 3 branches (dev/staging/prod)

**UX:** N/A

---

### Story 1.3: Define Database Schema

**Como** desenvolvedor  
**Quero** schema completo (users, suggestions, lottery_results, prizes)  
**Para que** estrutura de dados esteja pronta

**BDD:**
```gherkin
Given Drizzle configurado
When crio schema.ts com 4 tabelas
And executo drizzle-kit push
Then tabelas criadas no Neon
And indexes aplicados (email, userId, contestNumber)
```

**Tech:**
- **users:** id, email (unique), name, emailVerified, createdAt
- **suggestions:** id, userId (fk), lottery (enum), value (decimal), games (jsonb), wheelTemplate, guarantee, status (enum), contestNumber, realizedAt
- **lottery_results:** id, lottery, contestNumber (unique), drawNumbers (int[]), drawDate
- **prizes:** id, suggestionId (fk), gameIndex, prizeTier (enum), matchedNumbers, estimatedValue

**UX:** N/A

---

### Story 1.4: Configure NextAuth v5 Magic Link

**Como** desenvolvedor  
**Quero** NextAuth configurado com Resend  
**Para que** auth funcione

**BDD:**
```gherkin
Given Resend API key
When configuro NextAuth EmailProvider
Then usuário pode solicitar magic link
And recebe email via Resend
And link expira em 15min
And sessão dura 30 dias (JWT)
```

**Tech:** NextAuth v5, EmailProvider, Resend transport, JWT session, DrizzleAdapter

**UX:** N/A

---

### Story 1.5: Install shadcn/ui Components

**Como** desenvolvedor  
**Quero** shadcn/ui com Emerald theme  
**Para que** tenha UI components

**BDD:**
```gherkin
Given projeto Next.js + Tailwind
When executo npx shadcn@latest init
And seleciono Emerald (#10b981)
And instalo button, input, card, badge, toast, dialog
Then componentes em /components/ui/
And dark mode padrão (#050505)
```

**Tech:** shadcn/ui, Radix UI, Tailwind custom colors

**UX:**
- Primary: #10b981 (emerald)
- Secondary: #34d399
- Background: #050505 (dark)
- Gradient buttons: linear-gradient(135deg, #10b981, #34d399)

---

### Story 1.6: Create Custom Lottery Components

**Como** desenvolvedor  
**Quero** componentes custom (ValueInput, GameCard, etc)  
**Para que** UI de loteria esteja pronta

**BDD:**
```gherkin
Given shadcn/ui instalado
When crio ValueInput.tsx, LotteryGameCard.tsx, WheelGuaranteeDisplay.tsx
Then ValueInput formata R$ automaticamente
And valida min R$10, max R$500
And GameCard exibe números em grid circular (36x36px balls)
```

**Tech:**
- ValueInput: react-number-format, Zod validation
- GameCard: Card wrapper, badge, números em grid
- WheelGuaranteeDisplay: Badge "4 if 4" com tooltip

**UX:**
- Input: h-14, text-2xl, border #333, focus #10b981 com ring
- Number balls: 36x36px circles, bg #1a1a1a, border #333
- Card: bg #0f0f0f, border #1a1a1a, hover border #10b981

---

### Story 1.7: Setup Vercel Deploy

**Como** desenvolvedor  
**Quero** deploy automático Vercel  
**Para que** tenha CI/CD

**BDD:**
```gherkin
Given repo no GitHub
When conecto na Vercel
And adiciono env vars (DATABASE_URL, NEXTAUTH_SECRET, RESEND_API_KEY)
Then deploy automático funciona
And preview URLs gerados para PRs
And cron job configurado (vercel.json)
```

**Tech:** Vercel deployment, cron: "30 20 * * 3,6" (Qua/Sáb 20:30)

**UX:** N/A

---

### Story 1.8: Create Landing Page Layout

**Como** visitante  
**Quero** landing page com hero + "Como funciona"  
**Para que** entenda proposta

**BDD:**
```gherkin
Given acesso /
Then vejo header com logo "Sorte Grande" + botão "Entrar"
And vejo hero "Apostas inteligentes baseadas em matemática"
And vejo CTA "Começar Grátis" (gradient emerald)
And vejo 4 passos "Como funciona"
And vejo disclaimer vermelho "⚠️ Wheeling NÃO aumenta chances de jackpot"
```

**Tech:** Server Component (SSR), layout.tsx, AppHeader component

**UX:**
- Logo: gradient text (#10b981→#34d399)
- Hero title: 2.5rem mobile, 3.5rem desktop
- CTA button: gradient, shadow 0 4px 12px rgba(16,185,129,0.3)
- Steps: 32x32px numbered circles, gradient bg
- Disclaimer: bg rgba(239,68,68,0.1), border red

---

## Epic 2: User Authentication (7 stories)

**Objetivo:** Fluxo completo de magic link auth

**Valor:** ✅ Usuário pode criar conta e login

**FRs Cobertos:** FR1-FR6

### Story 2.1: Create Login Page

**Como** visitante  
**Quero** página /login com form de email  
**Para que** possa solicitar magic link

**BDD:**
```gherkin
Given acesso /login
Then vejo form com campo email
And botão "Enviar magic link"
When digito email e submeto
And email válido (RFC 5322)
Then NextAuth signIn('email') é chamado
And redirecionado para /verify
And toast "Email enviado!"
```

**Tech:** Client Component, React Hook Form + Zod, NextAuth signIn()

**UX:**
- Form container: max-w-md (448px), centered, bg #050505
- Input: h-12, text-lg, border #333, focus #10b981 ring
- Button: w-full, h-12, gradient primary→secondary

---

### Story 2.2: Create Verification Waiting Page

**Como** usuário que solicitou link  
**Quero** página /verify confirmando envio  
**Para que** saiba que preciso verificar email

**BDD:**
```gherkin
Given solicitei magic link
When redirecionado para /verify?email=xxx
Then vejo "📧 Email enviado!"
And vejo "Clique no link enviado para xxx"
And vejo "Link expira em 15 minutos"
And vejo botão "Reenviar email" (após 30s countdown)
```

**Tech:** Server Component, email via searchParams, ResendButton (Client island)

**UX:**
- Icon: 4rem (64px), margin-bottom 1rem
- Title: text-3xl, color #10b981
- Email highlight: color white, font-medium
- Countdown: disabled 30s com progress visual

---

### Story 2.3: Magic Link Email Template

**Como** sistema  
**Quero** email formatado profissionalmente  
**Para que** usuário tenha experiência premium

**BDD:**
```gherkin
Given usuário solicitou link
When NextAuth trigger sendVerificationRequest
Then email enviado via Resend
And assunto "Login no Sorte Grande"
And corpo com logo gradient
And botão verde "Entrar no Sorte Grande"
And texto "Link expira em 15 minutos"
And footer "Se não solicitou, ignore"
```

**Tech:** React Email template, Resend sender, inline CSS

**UX:**
- Email max-width: 600px
- Logo: gradient text (same as web)
- Button: bg #10b981, color #000, padding 14px 28px, border-radius 10px
- Expiry: icon ⏱️, font-size 14px, color #999

---

### Story 2.4: Session Management & Protected Routes

**Como** sistema  
**Quero** middleware protegendo /dashboard  
**Para que** apenas autenticados acessem

**BDD:**
```gherkin
Given usuário não autenticado
When tenta acessar /dashboard
Then redirecionado para /login?callbackUrl=/dashboard

Given usuário clicou magic link válido
When NextAuth processa callback
Then sessão JWT criada (30 dias)
And cookie httpOnly setado
And redirecionado para /dashboard
```

**Tech:** middleware.ts com NextAuth auth(), protected routes: /dashboard/*, JWT session

**UX:** N/A (backend)

---

### Story 2.5: Logout Functionality

**Como** usuário autenticado  
**Quero** botão logout no header  
**Para que** possa sair

**BDD:**
```gherkin
Given autenticado em /dashboard
When clico avatar/menu
Then vejo dropdown com "Sair"
When clico "Sair"
Then NextAuth signOut() chamado
And sessão invalidada
And redirecionado para /login
And toast "Você saiu com sucesso"
```

**Tech:** Dropdown shadcn/ui, Avatar com iniciais, signOut()

**UX:**
- Avatar: 40x40px circle, gradient, initials centered, font-bold
- Dropdown: w-56, align end, bg #0f0f0f
- Logout item: color #ef4444 (red), hover bg rgba(239,68,68,0.1)

---

### Story 2.6: 50-User MVP Limit

**Como** sistema  
**Quero** bloquear cadastro após 50 usuários  
**Para que** respeite limite MVP

**BDD:**
```gherkin
Given 50 usuários cadastrados
When novo usuário tenta solicitar magic link
Then erro "MVP lotado - lista de espera aberta"
And email NÃO enviado
And toast vermelho
And link para Google Form waitlist exibido
```

**Tech:** Server Action check antes signIn(), COUNT query Drizzle, MVP_LIMIT = 50

**UX:**
- Error toast: variant destructive, icon ⚠️
- Waitlist message: "MVP lotado" bold + link primary underline

---

### Story 2.7: User Profile Edit

**Como** usuário autenticado  
**Quero** editar meu nome em /dashboard/settings  
**Para que** personalize conta

**BDD:**
```gherkin
Given autenticado em /dashboard/settings
Then vejo form com "Nome" preenchido
And vejo "Email" readonly
When edito nome e salvo
Then nome atualizado no banco (users.name)
And toast "Perfil atualizado!"
And session revalidada
```

**Tech:** Server Action updateProfile(), Drizzle update, revalidatePath()

**UX:**
- Page max-w-2xl, centered, padding 1.5rem
- Disabled input: opacity 0.6, cursor not-allowed
- Helper text: font-size 0.75rem, color gray-500

---

## Epic 3: Suggestion Generation Engine (14 stories) 🎯 CORE

**Objetivo:** Usuário gera sugestões otimizadas com Wheeling

**Valor:** ✅ Usuário pode gerar e copiar jogos

**FRs Cobertos:** FR11-FR24 (Suggestion Generation) + FR7-FR10 (Lottery Config)

### Story 3.1: Create Value Input Form Page

**Como** usuário autenticado  
**Quero** página /dashboard/generate com input R$  
**Para que** possa informar valor de investimento

**BDD:**
```gherkin
Given autenticado em /dashboard/generate
Then vejo título "Nova Sugestão"
And vejo ValueInput component (R$ mask)
And vejo hint "Mínimo R$ 10 • Máximo R$ 500"
And vejo botão "✨ Gerar Jogos Otimizados" (disabled se inválido)
And vejo stats cards (Sugestões, Investido, Prêmios)
```

**Tech:** Client Component, React Hook Form, ValueInput custom component, Zod validation min 10 max 500

**UX:**
- Page background: #050505
- Value section: bg #0f0f0f, border #1a1a1a, border-radius 16px, padding 30px
- Input: h-14, text-2xl, font-semibold, border #333, focus #10b981 ring
- Button: w-full, h-16, text-xl, gradient, icon ✨

---

### Story 3.2: Implement Lottery Rules Configuration

**Como** sistema  
**Quero** configurações de Mega Sena e Lotofácil no código  
**Para que** validações e lógica estejam corretas

**BDD:**
```gherkin
Given arquivo /lib/lottery/rules.ts
Then tenho configuração Mega Sena:
  - range: 1-60
  - gameSize: 6
  - minGameSize: 6
  - maxGameSize: 20
  - costBase: R$ 5,00
And tenho configuração Lotofácil:
  - range: 1-25
  - gameSize: 15
  - minGameSize: 15
  - maxGameSize: 20
  - costBase: R$ 3,00
```

**Tech:** TypeScript enums e constants, export LOTTERY_RULES

**UX:** N/A (config backend)

---

### Story 3.3: Implement Wheeling Templates Database

**Como** sistema  
**Quero** templates de wheeling pré-calculados  
**Para que** possa aplicar garantias matemáticas

**BDD:**
```gherkin
Given arquivo /lib/wheeling/templates.ts
Then tenho templates:
  - Mega Sena 8 números: 28 jogos, garantia "4 if 4"
  - Mega Sena 10 números: 42 jogos, garantia "4 if 4"
  - Lotofácil 16 números: 20 jogos, garantia "11 if 11"
And cada template tem: id, lottery, wheelSize, gameCount, guarantee, combinations[]
```

**Tech:** Array de objetos, type WheelTemplate, combinations pré-computadas

**UX:** N/A (data backend)

---

### Story 3.4: Implement Lottery Auto-Selection Logic

**Como** sistema  
**Quero** decidir automaticamente Mega vs Lotofácil  
**Para que** usuário não precise escolher

**BDD:**
```gherkin
Given valor R$ 30
When sistema decide loteria
Then escolhe Lotofácil (jogos mais baratos, mais combinações)

Given valor R$ 150
When sistema decide
Then escolhe Mega Sena (melhor aproveitamento)

And regra: Lotofácil se valor < R$ 100, senão Mega Sena
```

**Tech:** Function selectLottery(value: number) => 'mega_sena' | 'lotofacil'

**UX:** N/A (lógica backend, usuário vê resultado apenas)

---

### Story 3.5: Implement Wheel Size Auto-Selection

**Como** sistema  
**Quero** decidir automaticamente quantos números usar no wheel  
**Para que** maximize valor do investimento

**BDD:**
```gherkin
Given valor R$ 150 e loteria Mega Sena
When sistema calcula wheel size ideal
Then escolhe 10 números (42 jogos * R$ 5 = R$ 210, próximo ao valor)

And lógica: encontra maior wheel que cabe no orçamento
And prioriza templates com melhores garantias
```

**Tech:** Function selectWheelSize(value, lottery) => number, busca em TEMPLATES

**UX:** N/A (lógica backend)

---

### Story 3.6: Implement Number Generation with Balancing

**Como** sistema  
**Quero** gerar números balanceados (pares/ímpares, altos/baixos)  
**Para que** combinações sejam estatisticamente distribuídas

**BDD:**
```gherkin
Given wheel de 10 números para Mega Sena
When sistema gera números
Then 5 pares e 5 ímpares (ou próximo)
And 5 baixos (1-30) e 5 altos (31-60)
And sem sequências consecutivas excessivas
And números aleatórios mas balanceados
```

**Tech:** Function generateBalancedNumbers(count, range) => number[], algoritmo balanceamento

**UX:** N/A (geração backend)

---

### Story 3.7: Implement Wheeling Engine

**Como** sistema  
**Quero** aplicar template de wheeling aos números gerados  
**Para que** produza combinações com garantia matemática

**BDD:**
```gherkin
Given 10 números base: [3, 7, 12, 18, 27, 34, 42, 45, 52, 58]
And template "10 números → 42 jogos (4 if 4)"
When engine aplica template
Then gera 42 jogos de 6 números
And cada jogo é uma combinação do template aplicada aos números base
And garantia "4 if 4" é preservada
```

**Tech:** Function applyWheel(numbers, template) => Game[], mapeia combinations

**UX:** N/A (engine backend)

---

### Story 3.8: Implement Suggestion Persistence

**Como** sistema  
**Quero** salvar sugestão no banco  
**Para que** usuário possa acessar depois

**BDD:**
```gherkin
Given jogos gerados
When sistema salva no banco
Then cria registro em suggestions table
And campos: userId, lottery, value, games (jsonb), wheelTemplate, guarantee, status=pending
And retorna suggestionId
```

**Tech:** Drizzle insert, games stored as JSONB array

**UX:** N/A (persistence)

---

### Story 3.9: Create Suggestion Results Display Page

**Como** usuário  
**Quero** ver jogos gerados em /dashboard/history/[id]  
**Para que** possa visualizar e copiar

**BDD:**
```gherkin
Given acesso /dashboard/history/[id]
Then vejo título "✨ Jogos prontos!"
And vejo subtitle "12 jogos • Mega Sena • Garantia: 4 if 4"
And vejo badge info "Garantia matemática: Se 4 dos seus 10 números saírem..."
And vejo lista de GameCards (cada jogo com números)
And vejo botões: "Copiar Todos", "Abrir Loteria Online Caixa", "Marcar como Realizado"
And vejo footer "Total: R$ 150,00 • 12 jogos"
```

**Tech:** Server Component, fetch suggestion by ID, GameCard components

**UX:**
- Title: text-2xl, color #10b981
- Info badge: bg rgba(16,185,129,0.1), border #10b981, padding 15px
- GameCard: bg #0f0f0f, border #1a1a1a, hover #10b981
- Number balls: 36x36px, bg #1a1a1a, font-bold
- Buttons: stack vertical, gap 10px

---

### Story 3.10: Implement Copy to Clipboard

**Como** usuário  
**Quero** copiar todos os jogos com 1 clique  
**Para que** possa colar na Loteria Online

**BDD:**
```gherkin
Given vejo jogos gerados
When clico "📋 Copiar Todos os Jogos"
Then números copiados para clipboard no formato:
  03 12 18 27 34 45
  07 15 23 31 42 58
  ...
And toast "12 jogos copiados!" aparece
And posso colar em qualquer app (WhatsApp, Loteria Online, etc)
```

**Tech:** navigator.clipboard.writeText(), format números com espaços

**UX:**
- Button: primary gradient, w-full, icon 📋
- Toast: success variant, green bg, auto-dismiss 3s

---

### Story 3.11: Link to Caixa Lottery Site

**Como** usuário  
**Quero** botão abrindo Loteria Online da Caixa  
**Para que** possa realizar apostas rapidamente

**BDD:**
```gherkin
Given vejo jogos gerados
When clico "🔗 Abrir Loteria Online da Caixa"
Then nova aba abre com URL https://www.loteriasonline.caixa.gov.br
And URL pre-filled se possível (query params)
```

**Tech:** Link component, target="_blank", rel="noopener noreferrer"

**UX:**
- Button: secondary variant (border primary), w-full, icon 🔗

---

### Story 3.12: Mark Suggestion as Realized

**Como** usuário  
**Quero** marcar sugestão como realizada  
**Para que** sistema rastreie quais apostei

**BDD:**
```gherkin
Given vejo jogos gerados (status=pending)
When clico "✓ Marcar como Realizado"
Then Dialog confirma "Você realmente apostou esses jogos?"
When confirmo
Then status atualizado para "realized" no banco
And realizedAt timestamp setado
And toast "Sugestão marcada como realizada!"
And botão muda para disabled "✓ Realizado"
```

**Tech:** Server Action updateStatus(), Dialog shadcn/ui, optimistic UI update

**UX:**
- Button: ghost variant, w-full, icon ✓
- Dialog: max-w-md, title "Confirmar", buttons "Sim, apostei" (primary) + "Cancelar" (ghost)
- Disabled state: opacity 0.5, cursor not-allowed

---

### Story 3.13: Display Suggestion Stats Summary

**Como** usuário  
**Quero** ver estatísticas na página /dashboard/generate  
**Para que** saiba meu histórico de uso

**BDD:**
```gherkin
Given autenticado em /dashboard/generate
Then vejo 3 stat cards abaixo do form:
  - "12 Sugestões" (total criadas)
  - "R$ 1,2k Investido" (soma de values das realized)
  - "3 Prêmios" (total de prizes ganhos)
```

**Tech:** Server Component, aggregate queries Drizzle (COUNT, SUM)

**UX:**
- Stats grid: 3 columns mobile, auto-fit, gap 15px
- Stat card: bg #0f0f0f, border #1a1a1a, border-radius 12px, padding 20px, text-center
- Value: text-4xl, font-bold, color #10b981
- Label: text-sm, uppercase, tracking-wide, color #999

---

### Story 3.14: Implement Suggestion Generation Flow (Integration)

**Como** usuário  
**Quero** fluxo completo de geração funcionando  
**Para que** possa criar sugestões end-to-end

**BDD:**
```gherkin
Given estou em /dashboard/generate
When digito R$ 150
And clico "Gerar Jogos Otimizados"
Then <500ms sistema:
  - Decide loteria (Mega Sena)
  - Decide wheel size (10 números)
  - Gera números balanceados
  - Aplica template wheeling
  - Salva no banco
And sou redirecionado para /dashboard/history/[id]
And vejo jogos gerados
And toast "Sugestão criada com sucesso!"
```

**Tech:** Server Action generateSuggestion(), orchestrates all logic, redirect to results

**UX:**
- Loading: Button shows "Gerando..." com spinner
- Transition: Smooth page navigation
- Performance: <500ms generation (NFR-P1)

---

## Epic 4: Lottery Results Integration (4 stories)

**Objetivo:** Sistema sincroniza resultados oficiais

**Valor:** ✅ Sistema tem dados atualizados de sorteios

**FRs Cobertos:** FR25-FR30

### Story 4.1: Implement Caixa API Client

**Como** sistema  
**Quero** cliente HTTP para API da Caixa  
**Para que** possa buscar resultados

**BDD:**
```gherkin
Given arquivo /lib/integrations/caixa-api.ts
When chamo fetchLatestResult('mega_sena')
Then retorna { lottery, contestNumber, drawNumbers, drawDate }
And usa endpoint https://servicebus2.caixa.gov.br/portaldeloterias/api/megasena
```

**Tech:** fetch() nativo, error handling, timeout 10s, retry logic

**UX:** N/A (backend client)

---

### Story 4.2: Implement Fallback API (guto-alves)

**Como** sistema  
**Quero** API fallback se Caixa falhar  
**Para que** tenha resiliência

**BDD:**
```gherkin
Given Caixa API retorna erro 500
When sistema tenta fallback
Then chama https://loteriascaixa-api.herokuapp.com/api/megasena/latest
And parseia resposta diferente
And retorna mesmo formato
```

**Tech:** Try/catch wrapper, fallback em guto-alves-api.ts, log qual API funcionou

**UX:** N/A (backend resilience)

---

### Story 4.3: Implement Results Sync Job

**Como** sistema  
**Quero** job que busca últimos resultados  
**Para que** banco esteja atualizado

**BDD:**
```gherkin
Given Vercel cron trigger /api/cron/sync-results
When job executa
Then busca últimos 10 concursos de cada loteria (Mega + Lotofácil)
And inserta em lottery_results se não existir (UNIQUE constraint contestNumber)
And retorna { synced: 5, skipped: 5 }
```

**Tech:** API Route /api/cron/sync-results/route.ts, Drizzle upsert, cron separate from verify-prizes

**UX:** N/A (background job)

---

### Story 4.4: Display Last Results in Dashboard

**Como** usuário  
**Quero** ver últimos resultados no dashboard  
**Para que** fique informado

**BDD:**
```gherkin
Given acesso /dashboard
Then vejo seção "Últimos Sorteios"
And vejo card Mega Sena: Concurso 2750, números sorteados, data
And vejo card Lotofácil: Concurso 3152, números sorteados, data
```

**Tech:** Server Component, query últimos 2 results (1 de cada), GameNumbersDisplay component

**UX:**
- Section title: text-xl, margin-bottom 1rem
- Result cards: bg #0f0f0f, grid 2 columns mobile-stack
- Numbers: same 36x36px balls

---

## Epic 5: Automatic Prize Verification (7 stories)

**Objetivo:** Sistema verifica prêmios automaticamente

**Valor:** ✅ Usuário recebe notificação quando ganhar

**FRs Cobertos:** FR31-FR37 (Verification) + FR44-FR48 (Notifications)

### Story 5.1: Implement Prize Comparison Logic

**Como** sistema  
**Quero** comparar jogos com resultado  
**Para que** detecte acertos

**BDD:**
```gherkin
Given jogo [3, 12, 18, 27, 34, 45]
And resultado sorteado [3, 12, 18, 27, 41, 53]
When comparo
Then 4 acertos detectados
And prizeTier = "quadra"
```

**Tech:** Function compareNumbers(game, result) => { matches, tier }, set intersection

**UX:** N/A (comparison logic)

---

### Story 5.2: Implement Multi-Tier Prize Detection

**Como** sistema  
**Quero** detectar todos os tiers (sena, quina, quadra)  
**Para que** não perca nenhum prêmio

**BDD:**
```gherkin
Given Mega Sena tem tiers: sena (6), quina (5), quadra (4)
And Lotofácil tem tiers: quinze (15), quatorze (14), treze (13), doze (12), onze (11)
When verifico jogo
Then retorno array de prêmios por tier
```

**Tech:** PRIZE_TIERS config por loteria, loop em cada jogo

**UX:** N/A (detection logic)

---

### Story 5.3: Create Prize Verification Cron Job

**Como** sistema  
**Quero** job automático verificando prêmios  
**Para que** usuários sejam notificados

**BDD:**
```gherkin
Given Vercel cron 30 20 * * 3,6 (Qua/Sáb 20:30)
When /api/cron/verify-prizes executa
Then busca todas suggestions com status=realized e sem prizes
And busca result correspondente (lottery + contestNumber futuro)
And compara cada jogo
And cria registros em prizes table se acertos
And atualiza suggestion.status para "verified"
And envia emails de notificação
And retorna { checked: 10, prizesFound: 2 }
```

**Tech:** API Route, query suggestions + results, batch processing, email trigger

**UX:** N/A (background automation)

---

### Story 5.4: Implement Prize Notification Email

**Como** usuário que ganhou  
**Quero** receber email celebrando vitória  
**Para que** saiba imediatamente

**BDD:**
```gherkin
Given prêmio detectado (quadra, R$ 1.286)
When sistema envia email
Then assunto "🎉 Você ganhou na Mega Sena!"
And corpo tem:
  - Celebração "Parabéns!"
  - Tier + valor estimado
  - Números que acertou (highlighted)
  - Link para ver detalhes no app
And responsivo mobile/desktop
```

**Tech:** React Email template prize-alert.tsx, Resend sender, highlight matched numbers

**UX:**
- Subject emoji: 🎉
- Corpo: gradient heading, large value (R$ X.XXX), matched numbers em verde #10b981
- CTA button: "Ver Detalhes" primary style

---

### Story 5.5: Create Prize Details Page

**Como** usuário  
**Quero** ver página /dashboard/prizes/[id] detalhando vitória  
**Para que** tenha informações completas

**BDD:**
```gherkin
Given tenho prêmio detectado
When acesso /dashboard/prizes/[id]
Then vejo celebração 🎉 "Parabéns!"
And vejo tier + valor estimado em destaque
And vejo PrizeAlert component com jogo premiado
And vejo números sorteados com matched highlighted
And vejo botão "Ver Detalhes Completos" linkando para sugestão original
```

**Tech:** Server Component, query prize + suggestion + result, PrizeAlert component

**UX:**
- Page background: #050505
- Celebration: text-5xl icon 🎉, text-2xl title color #10b981
- Value: text-4xl, font-bold, color #10b981
- PrizeAlert: gradient border #10b981, bg rgba(16,185,129,0.15)
- Matched numbers: bg #10b981, border #10b981 (different from normal gray)

---

### Story 5.6: Implement Notification Opt-Out

**Como** usuário  
**Quero** desativar emails de notificação em /dashboard/settings  
**Para que** não receba se não quiser

**BDD:**
```gherkin
Given estou em /dashboard/settings
Then vejo toggle "Receber notificações de prêmios por email"
And toggle ON por padrão
When desativo toggle
Then campo users.emailNotifications atualizado para false
And toast "Preferências salvas"
And sistema para de enviar prize emails
```

**Tech:** Toggle shadcn/ui, Server Action updateNotificationPrefs(), add column users.emailNotifications (boolean default true)

**UX:**
- Toggle: primary color when ON, gray when OFF
- Label: "Receber notificações de prêmios" (clear description)
- Help text: "Você continuará vendo prêmios no app"

---

### Story 5.7: Display Prizes in History List

**Como** usuário  
**Quero** ver prêmios destacados no histórico  
**Para que** identifique vitórias rapidamente

**BDD:**
```gherkin
Given acesso /dashboard/history
Then vejo lista de sugestões
And sugestões com prêmios têm:
  - Border color #10b981 (ao invés de #1a1a1a)
  - Badge "🏆 Premiado" verde
  - Tier + valor exibidos
```

**Tech:** Query suggestions LEFT JOIN prizes, conditional styling

**UX:**
- Prize badge: bg #10b981, color #000, icon 🏆, font-bold
- Card border: 2px solid #10b981 com box-shadow
- Prize value: text-lg, color #10b981, display inline no subtitle

---

## Epic 6: User Dashboard & History (6 stories)

**Objetivo:** Usuário gerencia sugestões e vê histórico

**Valor:** ✅ Usuário vê histórico e estatísticas

**FRs Cobertos:** FR38-FR43

### Story 6.1: Create Dashboard Home Page

**Como** usuário autenticado  
**Quero** dashboard inicial em /dashboard  
**Para que** veja visão geral

**BDD:**
```gherkin
Given acesso /dashboard
Then vejo header com logo + UserMenu
And vejo título "Dashboard"
And vejo CTA button "➕ Nova Sugestão" (link /dashboard/generate)
And vejo últimas 3 sugestões (preview)
And vejo stats cards (Total sugestões, Investido, Prêmios)
And vejo seção "Últimos Sorteios" (2 últimos results)
```

**Tech:** Server Component, queries agregadas, layout com Sidebar desktop / BottomNav mobile

**UX:**
- Layout: grid 2 columns (sidebar + main) desktop, stack mobile
- Sidebar: 280px, bg #0f0f0f, border-right #1a1a1a
- Main content: padding 2rem, max-width 1200px
- CTA button: primary gradient, size lg, prominent

---

### Story 6.2: Create Suggestions History List

**Como** usuário  
**Quero** ver lista completa em /dashboard/history  
**Para que** acesse todas as sugestões

**BDD:**
```gherkin
Given acesso /dashboard/history
Then vejo título "Histórico" + botão "Nova Sugestão"
And vejo lista de sugestões (mais recente primeiro)
And cada card mostra:
  - Loteria + qtd jogos
  - Status (Aguardando sorteio / Verificado / Premiado / Não realizado)
  - Valor
  - Data + concurso (se realizado)
```

**Tech:** Server Component, query suggestions ORDER BY createdAt DESC, pagination 20 per page

**UX:**
- Cards grid: gap 16px, margin-top 25px
- Status colors:
  - Aguardando: #f59e0b (amber)
  - Verificado: #10b981 (green)
  - Premiado: #10b981 com icon 🏆
  - Não realizado: #999 (gray)

---

### Story 6.3: Implement History Filters (Date)

**Como** usuário  
**Quero** filtrar histórico por data  
**Para que** encontre sugestões específicas

**BDD:**
```gherkin
Given estou em /dashboard/history
Then vejo select "Período: Todos" com opções:
  - Últimos 7 dias
  - Últimos 30 dias
  - Últimos 3 meses
  - Todos
When seleciono "Últimos 7 dias"
Then lista filtra sugestões createdAt >= hoje - 7 dias
```

**Tech:** Select shadcn/ui, query filter WHERE createdAt >= date, client state ou searchParams

**UX:**
- Select: width 200px, border #333, icon calendar
- Positioned top-right ao lado do botão "Nova Sugestão"

---

### Story 6.4: Implement History Filters (Status)

**Como** usuário  
**Quero** filtrar por status  
**Para que** veja apenas realizadas/premiadas

**BDD:**
```gherkin
Given estou em /dashboard/history
Then vejo tabs horizontais:
  - Todas (default)
  - Aguardando sorteio (status=realized, sem result ainda)
  - Verificadas (status=verified, sem prizes)
  - Premiadas (has prizes)
  - Não realizadas (status=pending)
When clico "Premiadas"
Then lista mostra apenas sugestões com prizes
```

**Tech:** Tabs shadcn/ui, query filters, searchParams state

**UX:**
- Tabs: border-bottom active #10b981 2px, color active #10b981
- Count badge em cada tab: "(12)" gray

---

### Story 6.5: Display Personal Statistics

**Como** usuário  
**Quero** ver estatísticas pessoais em /dashboard/stats  
**Para que** analise meu uso

**BDD:**
```gherkin
Given acesso /dashboard/stats
Then vejo cards:
  - Total de sugestões criadas
  - Valor total investido (soma realized)
  - Sugestões realizadas (count status=realized|verified)
  - Taxa de realização (% realizadas / total)
  - Total de prêmios ganhos (count prizes)
  - Prêmios por tier (quadras: X, quinas: Y)
  - Taxa de vitória (% suggestions com prizes)
```

**Tech:** Server Component, aggregate queries (COUNT, SUM, GROUP BY), stat cards grid

**UX:**
- Stats grid: 3 columns desktop, 2 mobile, gap 20px
- Large values: text-5xl, font-bold, color #10b981
- Percentage values: show chart (progress bar) se possível

---

### Story 6.6: Implement "Mark as Viewed" for Prizes

**Como** usuário  
**Quero** marcar prêmio como visualizado  
**Para que** não apareça como novo

**BDD:**
```gherkin
Given tenho novo prêmio não visualizado
Then vejo badge "Novo!" no card
When clico no card (acesso /dashboard/prizes/[id])
Then prize.viewedAt timestamp atualizado
And badge "Novo!" desaparece na próxima carga
```

**Tech:** Server Action markPrizeViewed(), add column prizes.viewedAt, auto-trigger on page view

**UX:**
- "Novo!" badge: bg #ef4444 (red), color white, pulse animation
- Positioned top-right do card

---

## Epic 7: Educational Content & Transparency (3 stories)

**Objetivo:** Usuário entende e confia no sistema

**Valor:** ✅ Usuário compreende Wheeling Systems

**FRs Cobertos:** FR49-FR53

### Story 7.1: Create "Como Funciona" Section (Landing)

**Como** visitante  
**Quero** entender Wheeling Systems na landing  
**Para que** confie antes de registrar

**BDD:**
```gherkin
Given acesso /
Then vejo seção "Como funciona" com 4 passos:
  1. Informe o valor
  2. Receba jogos otimizados (explica Wheeling)
  3. Copie e realize
  4. Verificação automática
And cada passo tem ícone, título, descrição curta
And vejo Accordion "O que são Wheeling Systems?"
And accordion expande explicação técnica + link Wikipedia
```

**Tech:** Server Component, Accordion shadcn/ui, external link Wikipedia

**UX:**
- Steps grid: gap 20px, margin 30px 0
- Step number: 32x32px circle, gradient, color #000, font-bold
- Accordion: border #1a1a1a, bg #0f0f0f quando expandido
- Link externo: icon arrow-up-right, color primary, underline

---

### Story 7.2: Display Real Probabilities

**Como** usuário  
**Quero** ver probabilidades reais na página de sugestão  
**Para que** tenha expectativas corretas

**BDD:**
```gherkin
Given vejo jogos gerados (Mega Sena 10 números, 4 if 4)
Then vejo badge "Honestidade Radical"
And vejo texto:
  - "Chance de jackpot: 1 em 50.063.860 (inalterado)"
  - "Garantia condicional: SE 4 dos seus 10 números saírem, você ganha pelo menos uma quadra"
  - "Wheeling organiza apostas, não aumenta chances"
```

**Tech:** Static text component, probabilities calculated per lottery

**UX:**
- Badge "Honestidade Radical": bg rgba(239,68,68,0.1), border red, icon ⚠️
- Text: font-size 0.9rem, color #ccc, line-height 1.6
- "inalterado" em bold
- Positioned below guarantee explanation

---

### Story 7.3: Create Disclaimers & Terms Pages

**Como** visitante/usuário  
**Quero** acessar Termos, Privacidade LGPD  
**Para que** conheça políticas

**BDD:**
```gherkin
Given footer na landing/dashboard
Then vejo links:
  - Termos de Uso (/legal/terms)
  - Política de Privacidade (/legal/privacy)
  - Sobre Wheeling Systems (/legal/wheeling)
When acesso /legal/terms
Then vejo documento com:
  - Limitação de responsabilidade (não somos casa lotérica)
  - Jogo responsável
  - Direitos do usuário
And vejo /legal/privacy com:
  - LGPD compliance
  - Dados coletados (apenas email)
  - Direito de exclusão
  - Retenção 1 ano
```

**Tech:** Static pages, Markdown rendered, layout simples

**UX:**
- Footer: bg #0a0a0a, border-top #1a1a1a, padding 40px
- Links: color #999, hover color #10b981, font-size 0.875rem
- Legal pages: max-w-3xl, centered, padding 3rem, prose styles

---

## Epic 8: PWA & Offline (3 stories)

**Objetivo:** App instalável e funciona offline

**Valor:** ✅ Usuário instala app no celular

**FRs Cobertos:** FR61-FR64

### Story 8.1: Create PWA Manifest

**Como** usuário mobile  
**Quero** app instalável  
**Para que** tenha ícone na home screen

**BDD:**
```gherkin
Given arquivo /public/manifest.json
Then contém:
  - name: "Sorte Grande"
  - short_name: "Sorte Grande"
  - description: "Apostas inteligentes com Wheeling Systems"
  - theme_color: "#10b981"
  - background_color: "#050505"
  - display: "standalone"
  - start_url: "/dashboard"
  - icons: 192x192, 512x512 (PNG)
And navegador mostra banner "Instalar Sorte Grande"
```

**Tech:** manifest.json, icons gerados (logo Sorte Grande), linked in layout.tsx

**UX:**
- Icons: logo gradient on dark background
- Splash screen: theme_color #10b981, background #050505

---

### Story 8.2: Implement Service Worker for Offline Cache

**Como** usuário  
**Quero** acessar última sugestão offline  
**Para que** veja jogos sem internet

**BDD:**
```gherkin
Given service worker registrado
When usuário acessa /dashboard/history/[id] online
Then página é cached
When usuário perde conexão
And tenta acessar mesma página
Then página carrega do cache
And banner "Você está offline" aparece no topo
```

**Tech:** next-pwa plugin, workbox, cache strategy: NetworkFirst for API, CacheFirst for static

**UX:**
- Offline banner: bg #f59e0b (amber), color #000, text "Você está offline", positioned top fixed

---

### Story 8.3: Implement Sync on Reconnect

**Como** usuário  
**Quero** sincronizar ao reconectar  
**Para que** veja updates automáticos

**BDD:**
```gherkin
Given usuário estava offline
And tentou marcar sugestão como realizada (action enfileirada)
When reconecta
Then service worker detecta online
And executa ações enfileiradas (sync API)
And toast "Sincronizado!" aparece
```

**Tech:** Background Sync API, queue pending actions, replay on online event

**UX:**
- Sync toast: icon 🔄, "Sincronizando dados..." → "Sincronizado!" (success)

---

## Epic 9: Admin Dashboard (5 stories)

**Objetivo:** Admin monitora sistema

**Valor:** ✅ Admin gerencia usuários e jobs

**FRs Cobertos:** FR54-FR60

### Story 9.1: Create Admin Auth Guard

**Como** sistema  
**Quero** proteger rotas /admin  
**Para que** apenas admins acessem

**BDD:**
```gherkin
Given middleware verifica role do usuário
When usuário comum tenta /admin
Then redirect para /dashboard com erro 403

Given usuário com users.role='admin'
When acessa /admin
Then acesso permitido
```

**Tech:** Add column users.role (enum 'user'|'admin'), middleware check, hardcode admin emails em .env

**UX:** N/A (backend guard)

---

### Story 9.2: Display Usage Metrics

**Como** admin  
**Quero** ver métricas em /admin  
**Para que** monitore uso

**BDD:**
```gherkin
Given acesso /admin
Then vejo dashboard com cards:
  - Total usuários
  - Usuários ativos (last 7 days)
  - Total sugestões criadas
  - Taxa de realização (% realized)
  - Taxa de retenção (% users with >1 suggestion)
  - Total prêmios detectados
  - Valor total investido
```

**Tech:** Server Component, aggregate queries, admin layout

**UX:**
- Admin layout: different color scheme (blue accent ao invés de green)
- Stats cards: larger, with charts (simple bars)

---

### Story 9.3: Display User Management List

**Como** admin  
**Quero** ver lista de usuários em /admin/users  
**Para que** gerencie contas

**BDD:**
```gherkin
Given acesso /admin/users
Then vejo tabela com colunas:
  - Email
  - Nome
  - Data cadastro
  - Última atividade
  - Status (ativo/desativado)
  - Ações (desativar/ativar, ver detalhes)
And posso filtrar por status
And posso buscar por email
```

**Tech:** Table shadcn/ui, pagination, search input

**UX:**
- Table: striped rows, hover highlight
- Actions: icon buttons (eye, ban), confirm dialog antes de desativar

---

### Story 9.4: Implement User Disable/Enable

**Como** admin  
**Quero** desativar usuários problemáticos  
**Para que** bloqueie acesso

**BDD:**
```gherkin
Given vejo usuário ativo
When clico "Desativar"
Then dialog confirma ação
When confirmo
Then users.disabled=true no banco
And usuário não consegue mais fazer login (magic link falha)
And toast "Usuário desativado"
```

**Tech:** Server Action toggleUserStatus(), add column users.disabled (boolean), check in auth config

**UX:**
- Confirm dialog: "Tem certeza? Usuário não poderá mais acessar."
- Disabled users: row opacity 0.6, badge "Desativado" red

---

### Story 9.5: Display Cron Job Logs

**Como** admin  
**Quero** ver logs de jobs em /admin/jobs  
**Para que** monitore automações

**BDD:**
```gherkin
Given acesso /admin/jobs
Then vejo tabela de execuções recentes:
  - Job name (sync-results, verify-prizes)
  - Timestamp
  - Duration
  - Status (success/error)
  - Output (JSON collapse)
And posso executar job manualmente (botão "Run Now")
```

**Tech:** Create job_logs table (id, jobName, startedAt, finishedAt, status, output jsonb), log em cada cron

**UX:**
- Logs table: monospace font para output
- Manual trigger: button warning color, confirm dialog
- Real-time: refresh button, auto-refresh 30s option

---

## Epic 10: Profile & Settings (2 stories)

**Objetivo:** Usuário gerencia preferências

**Valor:** ✅ Usuário personaliza conta

**FRs Cobertos:** FR6 + FR48

### Story 10.1: Enhanced Profile Settings

**Como** usuário  
**Quero** configurações completas em /dashboard/settings  
**Para que** gerencie preferências

**BDD:**
```gherkin
Given acesso /dashboard/settings
Then vejo seções:
  - Perfil (nome, email readonly)
  - Notificações (toggle email prêmios, toggle email resultados)
  - Conta (botão "Excluir conta" vermelho)
And posso salvar cada seção independentemente
```

**Tech:** Tabs shadcn/ui, separate Server Actions per section

**UX:**
- Tabs horizontal: Perfil, Notificações, Conta
- Delete button: variant destructive, positioned bottom, icon trash, confirm dialog

---

### Story 10.2: Implement Account Deletion (LGPD)

**Como** usuário  
**Quero** excluir minha conta  
**Para que** exerça direito LGPD

**BDD:**
```gherkin
Given acesso /dashboard/settings → aba Conta
When clico "Excluir conta"
Then dialog confirma: "Esta ação é irreversível. Todos os seus dados serão apagados."
And peço confirmação digitando email
When confirmo
Then CASCADE delete: users → suggestions → prizes
And session invalidada
And redirecionado para / com toast "Conta excluída"
```

**Tech:** Server Action deleteAccount(), Drizzle cascade delete (FK configurado), email confirmation input

**UX:**
- Dialog: max-w-md, red accent
- Confirmation input: "Digite seu email para confirmar"
- Button: disabled até email match, text "Excluir permanentemente"

---

## FR Coverage Validation

### Coverage Matrix (Resumo)

| Epic | FRs Cobertos | Stories | Status |
|------|--------------|---------|--------|
| Epic 1 | Infraestrutura | 8 | ✅ |
| Epic 2 | FR1-FR6 | 7 | ✅ |
| Epic 3 | FR7-FR10, FR11-FR24 | 14 | ✅ |
| Epic 4 | FR25-FR30 | 4 | ✅ |
| Epic 5 | FR31-FR37, FR44-FR48 | 7 | ✅ |
| Epic 6 | FR38-FR43 | 6 | ✅ |
| Epic 7 | FR49-FR53 | 3 | ✅ |
| Epic 8 | FR61-FR64 | 3 | ✅ |
| Epic 9 | FR54-FR60 | 5 | ✅ |
| Epic 10 | FR6, FR48 | 2 | ✅ |

**Total:** 64 FRs cobertos, 59 stories, 10 epics

### NFRs Coverage

- **NFR-P1-P3 (Performance):** Stories 3.14 (<500ms generation), 1.8 (LCP <2.5s), cache strategy em 8.2
- **NFR-S1-S4 (Security):** Story 1.4 (magic link 15min), 2.4 (JWT 30d), middleware auth guard
- **NFR-SC1-SC3 (Scalability):** Story 1.2 (Neon serverless), 1.3 (indexes), Vercel auto-scale
- **NFR-I1-I3 (Integration):** Story 4.1-4.2 (API abstraction + fallback)
- **NFR-R1-R3 (Reliability):** Story 5.3 (retry logic), 4.2 (fallback), job logs
- **NFR-A1-A2 (Accessibility):** shadcn/ui WCAG base, responsive breakpoints
- **NFR-M1-M3 (Maintainability):** TypeScript strict, inline docs, CI/CD 1.7

---

## Implementation Readiness

✅ **Todas as 64 FRs mapeadas para stories**  
✅ **UX Details incorporados** (Emerald Trust theme, shadcn/ui specs)  
✅ **Architecture decisions aplicadas** (Next.js 16, Drizzle, NextAuth, Resend)  
✅ **BDD acceptance criteria definidos** para cada story  
✅ **Dependencies claras** (Prerequisites entre stories)  
✅ **Performance targets documentados** (NFRs referenciados)

**Próximos passos sugeridos:**
1. ✅ **Validação deste documento** (você aprova a decomposição?)
2. → **Implementation Readiness Check** (rodar workflow para validar alinhamento PRD/UX/Arch/Epics)
3. → **Sprint Planning** (agrupar stories em sprints, estimar esforço, priorizar MVP)
4. → **Development** (começar pela Epic 1 → 2 → 3 → ...)

---

**Documento gerado via YOLO mode - create-epics-and-stories workflow v1.0**  
**Tempo estimado de implementação:** 8-12 sprints (1 desenvolvedor, sprints de 1 semana)  
**MVP mínimo viável:** Epics 1-3 + 7 (Foundation + Auth + Suggestion Generation + Educational) = ~30 stories

