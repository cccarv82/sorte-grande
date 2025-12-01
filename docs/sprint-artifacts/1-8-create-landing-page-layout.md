# Story 1.8: Create Landing Page Layout

**Epic:** Epic 1 - Foundation & Project Setup  
**Story ID:** 1.8  
**Status:** drafted  
**Created:** 2025-12-01  
**Author:** Carlos (via SM Agent Bob)

---

## User Story

**Como** visitante  
**Quero** landing page profissional com hero + "Como funciona"  
**Para que** entenda a proposta e confie no sistema antes de registrar

---

## Requirements Context

### Source Documents
- **Tech Spec Epic 1:** `docs/sprint-artifacts/tech-spec-epic-1.md` (AC7 - Landing Page requirements, Story 1.8 workflow)
- **Epics Detailed:** `docs/epics-detailed.md` (Epic 1, Story 1.8 - Create Landing Page Layout)
- **UX Design Specification:** `docs/ux-design-specification.md` (Design Direction, Emerald Trust theme, Landing Page mockup)
- **UX Design Directions HTML:** `docs/ux-design-directions.html` (Lines 574-630 - Landing Page mockup completo)
- **Architecture:** `docs/architecture.md` (Component structure, Server Components pattern)
- **Previous Story:** `docs/sprint-artifacts/1-7-setup-vercel-deploy.md` (Production deployment ready)

### Business Context
A landing page do Sorte Grande é o **primeiro ponto de contato** com usuários potenciais e deve transmitir:
- **Confiança:** Apresentação profissional, não parece "mais um site de loteria duvidoso"
- **Transparência:** Disclaimer honesto sobre limitações (Wheeling NÃO aumenta chances de jackpot)
- **Clareza:** 4 passos simples mostrando como funciona
- **Ação:** CTA claro "Começar Grátis" levando para /login

Landing page profissional é crítica porque:
- **Conversão:** 80% dos visitantes decidem em 3 segundos se confiam no site
- **SEO:** Página inicial indexável com conteúdo educacional (Wheeling Systems)
- **Diferenciação:** Posicionamento como ferramenta inteligente vs cassino
- **Honestidade:** Disclaimers educacionais constroem confiança de longo prazo

### Technical Context
- **Framework:** Next.js 16 App Router com Server Components (SSR para SEO)
- **Styling:** Tailwind CSS + shadcn/ui Button component
- **Theme:** Emerald Trust (#10b981) com gradient para #34d399
- **Typography:** Inter font, h1 2.5rem mobile / 3.5rem desktop
- **Responsive:** Mobile-first (<768px), Tablet (768-1024px), Desktop (>1024px)
- **Components:** AppHeader (logo + Entrar button), Hero section, HowItWorks section, Disclaimer, Footer

### Key Requirements
1. **Server-Side Rendering:** Landing page deve ser SSR (não CSR) para SEO e performance
2. **Gradient Logo:** "Sorte Grande" com gradient #10b981→#34d399
3. **Hero Section:** Title + subtitle + CTA button com shadow
4. **4 Steps:** Como funciona com numbered circles (32x32px) e descrições
5. **Disclaimer:** Warning box vermelho sobre limitações
6. **Responsive:** Mobile-first design, adapta para tablet/desktop
7. **Accessibility:** WCAG 2.1 Level A (semantic HTML, keyboard navigation)
8. **Performance:** Lighthouse Performance > 90, Accessibility > 90

---

## Learnings from Previous Story

**From Story 1.7-setup-vercel-deploy (Status: done)**

**Available Infrastructure:**
- ✅ **Production Deployment:** Live at https://sorte-grande-ten.vercel.app (200 OK verified)
- ✅ **Environment Variables:** 6 variables configured (DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, RESEND_API_KEY, EMAIL_FROM, CRON_SECRET)
- ✅ **CI/CD Pipeline:** Automatic deployments on push to main, preview URLs for PRs
- ✅ **Cron Jobs:** Configured via vercel.json (Wednesdays/Saturdays 20:30 UTC)
- ✅ **GitHub Repository:** https://github.com/cccarv82/sorte-grande (547 files)
- ✅ **README.md Documentation:** 111-line deployment section with troubleshooting guide

**Key Patterns Established:**
- Server Components são default (sem 'use client' directive) - otimização automática
- Client Components apenas quando necessário (interatividade)
- --legacy-peer-deps flag para npm installs (NextAuth nodemailer conflict)
- Tailwind 4.0 inline styles workaround (CSS variables não funcionam em className)
- Git workflow: feature branch → commit → push → auto-deploy

**Design System Available:**
- shadcn/ui Button component instalado e funcionando (Story 1.5)
- Emerald Trust theme configurado (#10b981 primary, #0a0a0a background)
- Custom lottery components prontos (ValueInput, LotteryGameCard, etc - Story 1.6)
- Tailwind CSS classes configuradas (text-primary, bg-surface, etc)

**Files to Create:**
- `app/app/page.tsx` - Landing page (substituir placeholder atual)
- `app/components/layout/AppHeader.tsx` - Header reutilizável (logo + Entrar button)
- `app/components/layout/Footer.tsx` - Footer com links legais
- `app/components/landing/HeroSection.tsx` - Hero com CTA
- `app/components/landing/HowItWorksSection.tsx` - 4 passos
- `app/components/landing/DisclaimerSection.tsx` - Warning box

**Current Landing Page Status:**
- Existe placeholder básico em `app/app/page.tsx` (apenas "Bem-vindo" + link Dashboard)
- Precisa ser substituído por landing page profissional
- Deployment já funcionando, mudanças serão visíveis imediatamente

**Recommendations for This Story:**
- Criar componentes layout separados (AppHeader, Footer) para reuso em outras páginas
- Usar Server Components para SEO (não adicionar 'use client' desnecessariamente)
- Testar responsive com Chrome DevTools (mobile first)
- Verificar gradients com inline styles (Tailwind 4.0 limitation)
- Commit incremental: componentes → layout → integração

**Known Limitations:**
- Tailwind 4.0 CSS variables não funcionam em className (usar inline styles para gradients)
- Next.js 16 Canary pode ter breaking changes (documentar workarounds)
- shadcn/ui Button component funciona, mas pode precisar ajustes de estilo inline

**Pending Review Items from Story 1.7:**
- [ ] **[Low] .env.example has duplicate entries** - Lines 1-51 contain duplicate NEXTAUTH_URL, NEXTAUTH_SECRET, RESEND_API_KEY, EMAIL_FROM. Note: Story 1.8 doesn't modify .env.example, but be aware of this if adding variables in future. [Source: docs/sprint-artifacts/1-7-setup-vercel-deploy.md#Action-Items]

[Source: docs/sprint-artifacts/1-7-setup-vercel-deploy.md#Dev-Agent-Record, docs/sprint-artifacts/1-6-create-custom-lottery-components.md#Learnings]

---

## Project Structure Alignment

### Expected File Structure (After Story Completion)
```
app/                                 # Next.js application
├── app/
│   ├── page.tsx                     # [MODIFIED] Landing page profissional (substituir placeholder)
│   ├── layout.tsx                   # [VERIFY] Root layout com Providers
│   ├── globals.css                  # [VERIFY] Tailwind base styles
│   ├── dashboard/                   # [EXISTS] Dashboard page (protected)
│   ├── login/                       # [EXISTS] Login page
│   └── verify/                      # [EXISTS] Verify page
├── components/
│   ├── ui/                          # [EXISTS] shadcn/ui components (Button, Input, Card, Badge, Toast, Dialog)
│   ├── lottery/                     # [EXISTS] Custom lottery components (Story 1.6)
│   └── layout/                      # [NEW] Layout components
│       ├── AppHeader.tsx            # [NEW] Header reutilizável (logo + Entrar button)
│       └── Footer.tsx               # [NEW] Footer com links legais
├── landing/                         # [NEW] Landing page specific components
│   ├── HeroSection.tsx              # [NEW] Hero com title, subtitle, CTA
│   ├── HowItWorksSection.tsx        # [NEW] 4 passos com numbered circles
│   └── DisclaimerSection.tsx        # [NEW] Warning box vermelho
└── public/                          # [EXISTS] Static assets
    └── logo.svg                     # [OPTIONAL] Logo SVG (ou usar text gradient)
```

### Integration Points
- **Upstream Dependencies:** 
  - Story 1.1 ✅ (Next.js 16 project with Tailwind CSS)
  - Story 1.4 ✅ (NextAuth v5 - /login route exists)
  - Story 1.5 ✅ (shadcn/ui Button component)
  - Story 1.7 ✅ (Vercel deployment - production URL ready)
- **Downstream Consumers:** 
  - Epic 2 Stories (Login/Verify pages will use AppHeader component)
  - Epic 3 Stories (Dashboard will use AppHeader component)
  - Epic 7.1 (Will expand "Como funciona" section with Accordion)
- **Parallel Stories:** None (Story 1.8 is last story in Epic 1)

### Patterns to Follow
- Server Components por padrão (SSR para SEO)
- Client Components apenas se necessário ('use client' directive)
- AppHeader reutilizável em todas as páginas públicas
- Footer reutilizável em todas as páginas
- Gradients via inline styles (Tailwind 4.0 workaround: `style={{ background: 'linear-gradient(...)' }}`)
- Semantic HTML para accessibility (<header>, <main>, <section>, <footer>)

---

## Acceptance Criteria

### AC1: Landing Page Route Functional
- [ ] Route `/` renders landing page (not placeholder)
- [ ] Page loads within 2 seconds (measured via Chrome DevTools Network tab)
- [ ] No console errors in browser DevTools (F12)
- [ ] Page is server-side rendered (view-source shows full HTML content)
- [ ] Meta tags present (title, description) for SEO
- [ ] Open Graph tags (optional for MVP, recommended for future)

### AC2: AppHeader Component
- [ ] Component created: `components/layout/AppHeader.tsx`
- [ ] Logo "Sorte Grande" with gradient text (#10b981→#34d399)
- [ ] Button "Entrar" (ghost variant) linking to `/login`
- [ ] Header sticky on scroll (optional for MVP)
- [ ] Responsive: logo font-size adapts mobile/desktop
- [ ] Logo uses inline gradient style (Tailwind 4.0 workaround)
- [ ] TypeScript types defined for props

### AC3: Hero Section
- [ ] Component created: `components/landing/HeroSection.tsx`
- [ ] Title: "Apostas inteligentes baseadas em matemática"
- [ ] Title font-size: 2.5rem mobile, 3.5rem desktop (responsive)
- [ ] Subtitle: Brief description (1-2 sentences)
- [ ] CTA button "Começar Grátis" with gradient background (#10b981→#34d399)
- [ ] CTA button shadow: `0 4px 12px rgba(16,185,129,0.3)`
- [ ] CTA button links to `/login`
- [ ] CTA button uses shadcn/ui Button component (or custom styled)
- [ ] Section centered with max-width constraint

### AC4: "Como Funciona" Section
- [ ] Component created: `components/landing/HowItWorksSection.tsx`
- [ ] Section title "Como funciona" (h2, text-primary)
- [ ] 4 steps displayed in grid or column layout
- [ ] Each step has:
  - [ ] Numbered circle (32x32px, gradient background #10b981→#34d399, black text, font-bold)
  - [ ] Step title (h4, font-semibold)
  - [ ] Step description (p, text-muted)
- [ ] Step content (from UX mockup):
  - [ ] Step 1: "Informe o valor" - "Digite quanto você quer investir"
  - [ ] Step 2: "Receba jogos otimizados" - "Sistema aplica Wheeling Systems automaticamente"
  - [ ] Step 3: "Copie e realize" - "Cole na Loteria Online da Caixa"
  - [ ] Step 4: "Verificação automática" - "Receba notificação se ganhar"
- [ ] Responsive: single column mobile, 2-column tablet, 4-column desktop (optional)

### AC5: Disclaimer Section
- [ ] Component created: `components/landing/DisclaimerSection.tsx`
- [ ] Warning icon ⚠️ at start
- [ ] Text: "Wheeling Systems NÃO aumenta chances de jackpot (matematicamente impossível). Organiza apostas de forma inteligente com garantias condicionais."
- [ ] Background: `rgba(239,68,68,0.1)` (red semi-transparent)
- [ ] Border: `1px solid #ef4444` (red)
- [ ] Border-radius: 8px or 12px
- [ ] Padding: 16px or 20px
- [ ] Font-size: 14px or 16px (legível mas não dominante)
- [ ] Text color: text-red-500 or similar

### AC6: Footer Component
- [ ] Component created: `components/layout/Footer.tsx`
- [ ] Links: "Termos de Uso", "Política de Privacidade", "Como Funciona" (placeholders, can link to `/` for MVP)
- [ ] Copyright text: "© 2025 Sorte Grande. Todos os direitos reservados."
- [ ] Background: subtle border-top or background-surface
- [ ] Text color: text-muted
- [ ] Centered content with max-width
- [ ] Responsive: links in row (desktop) or column (mobile)

### AC7: Responsive Design
- [ ] Mobile (<768px):
  - [ ] Single column layout
  - [ ] CTA button full-width
  - [ ] Logo font-size smaller (1.25rem or 1.5rem)
  - [ ] Steps stacked vertically
  - [ ] Footer links stacked vertically
- [ ] Tablet (768-1024px):
  - [ ] 2-column layout for steps (optional)
  - [ ] CTA button max-width (not full-width)
- [ ] Desktop (>1024px):
  - [ ] Max-width container (1200px or 1400px)
  - [ ] 4-column layout for steps (optional)
  - [ ] Hero title 3.5rem

### AC8: Accessibility & Performance
- [ ] Semantic HTML: `<header>`, `<main>`, `<section>`, `<footer>` tags
- [ ] Heading hierarchy: h1 (hero title), h2 (section titles), h3/h4 (step titles)
- [ ] Link "Entrar" accessible via keyboard (Tab key)
- [ ] CTA button accessible via keyboard (Tab + Enter)
- [ ] Color contrast meets WCAG 2.1 AA (text on backgrounds)
- [ ] Lighthouse Performance score > 90
- [ ] Lighthouse Accessibility score > 90
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] No ESLint errors (`npm run lint`)

---

## Tasks & Subtasks

### Task 1: Create Layout Components (AppHeader & Footer)
**Owner:** Developer  
**Estimated Effort:** 30 min

#### Subtasks:
1. [ ] Create directory: `mkdir -p components/layout`
2. [ ] Create file: `components/layout/AppHeader.tsx`
3. [ ] Implement AppHeader:
```typescript
// components/layout/AppHeader.tsx
import Link from 'next/link'

export function AppHeader() {
  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <h1 
            className="text-2xl font-bold cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Sorte Grande
          </h1>
        </Link>
        <Link href="/login">
          <button className="px-4 py-2 text-sm font-medium text-muted hover:text-primary transition-colors">
            Entrar
          </button>
        </Link>
      </div>
    </header>
  )
}
```
4. [ ] Create file: `components/layout/Footer.tsx`
5. [ ] Implement Footer:
```typescript
// components/layout/Footer.tsx
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted">
          <p>© 2025 Sorte Grande. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-primary transition-colors">Termos de Uso</Link>
            <Link href="/" className="hover:text-primary transition-colors">Política de Privacidade</Link>
            <Link href="/" className="hover:text-primary transition-colors">Como Funciona</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
```
6. [ ] Test components in isolation (import in page.tsx temporarily)
7. [ ] Verify gradient works (inline styles)
8. [ ] Verify responsive (Chrome DevTools)
9. [ ] Commit: `git add . && git commit -m "feat: create AppHeader and Footer layout components"`

**Success Criteria:** AppHeader and Footer render correctly with gradient logo

---

### Task 2: Create Landing Page Sections (Hero, HowItWorks, Disclaimer)
**Owner:** Developer  
**Estimated Effort:** 60 min

#### Subtasks:
1. [ ] Create directory: `mkdir -p components/landing`
2. [ ] Create file: `components/landing/HeroSection.tsx`
3. [ ] Implement HeroSection:
```typescript
// components/landing/HeroSection.tsx
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-6">
        Apostas inteligentes<br />baseadas em matemática
      </h1>
      <p className="text-xl text-muted max-w-2xl mx-auto mb-8">
        A primeira plataforma brasileira a usar Wheeling Systems - metodologia cientificamente validada para organizar suas apostas de forma estratégica.
      </p>
      <Link href="/login">
        <button
          className="px-8 py-4 text-lg font-bold rounded-lg text-black"
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
            boxShadow: '0 4px 12px rgba(16,185,129,0.3)'
          }}
        >
          ✨ Começar Grátis
        </button>
      </Link>
    </section>
  )
}
```
4. [ ] Create file: `components/landing/HowItWorksSection.tsx`
5. [ ] Implement HowItWorksSection:
```typescript
// components/landing/HowItWorksSection.tsx
export function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: 'Informe o valor',
      description: 'Digite quanto você quer investir'
    },
    {
      number: 2,
      title: 'Receba jogos otimizados',
      description: 'Sistema aplica Wheeling Systems automaticamente'
    },
    {
      number: 3,
      title: 'Copie e realize',
      description: 'Cole na Loteria Online da Caixa'
    },
    {
      number: 4,
      title: 'Verificação automática',
      description: 'Receba notificação se ganhar'
    }
  ]

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-12 text-primary">
        Como funciona
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-center text-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-black font-bold text-xl mb-4"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'
              }}
            >
              {step.number}
            </div>
            <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
            <p className="text-sm text-muted">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
```
6. [ ] Create file: `components/landing/DisclaimerSection.tsx`
7. [ ] Implement DisclaimerSection:
```typescript
// components/landing/DisclaimerSection.tsx
export function DisclaimerSection() {
  return (
    <section className="container mx-auto px-4 py-8">
      <div
        className="max-w-3xl mx-auto p-6 rounded-lg"
        style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid #ef4444'
        }}
      >
        <p className="text-sm text-red-500">
          <strong>⚠️ Honestidade radical:</strong> Wheeling Systems NÃO aumenta chances de jackpot (matematicamente impossível). Organiza apostas de forma inteligente com garantias condicionais (ex: "4 if 4").
        </p>
      </div>
    </section>
  )
}
```
8. [ ] Test each component in isolation
9. [ ] Verify responsive breakpoints (Chrome DevTools resize)
10. [ ] Commit: `git add . && git commit -m "feat: create landing page sections (Hero, HowItWorks, Disclaimer)"`

**Success Criteria:** All 3 sections render correctly with proper styling

---

### Task 3: Integrate Components into Landing Page
**Owner:** Developer  
**Estimated Effort:** 20 min

#### Subtasks:
1. [ ] Open file: `app/page.tsx`
2. [ ] Replace placeholder content with landing page:
```typescript
// app/page.tsx
import { AppHeader } from '@/components/layout/AppHeader'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/landing/HeroSection'
import { HowItWorksSection } from '@/components/landing/HowItWorksSection'
import { DisclaimerSection } from '@/components/landing/DisclaimerSection'

export default function Home() {
  return (
    <>
      <AppHeader />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <DisclaimerSection />
      </main>
      <Footer />
    </>
  )
}
```
3. [ ] Run dev server: `npm run dev`
4. [ ] Open http://localhost:3000
5. [ ] Verify all sections visible
6. [ ] Verify "Entrar" button links to /login
7. [ ] Verify "Começar Grátis" button links to /login
8. [ ] Verify no console errors (F12)
9. [ ] Commit: `git add . && git commit -m "feat: integrate landing page components"`

**Success Criteria:** Landing page renders completely with all sections

---

### Task 4: Add Meta Tags & SEO Optimization
**Owner:** Developer  
**Estimated Effort:** 15 min

#### Subtasks:
1. [ ] Open file: `app/page.tsx`
2. [ ] Add metadata export:
```typescript
// app/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sorte Grande - Apostas Inteligentes Baseadas em Matemática',
  description: 'A primeira plataforma brasileira a usar Wheeling Systems para organizar suas apostas de loteria de forma estratégica. Mega Sena e Lotofácil.',
  keywords: 'loteria, mega sena, lotofácil, wheeling systems, apostas inteligentes',
}
```
3. [ ] Verify metadata appears in `<head>` (view-source in browser)
4. [ ] Test SEO with Lighthouse (Chrome DevTools → Lighthouse → Generate report)
5. [ ] Verify title shows in browser tab
6. [ ] Commit: `git add . && git commit -m "feat: add SEO metadata to landing page"`

**Success Criteria:** Metadata visible in page source, Lighthouse SEO score > 90

---

### Task 5: Responsive Design Testing
**Owner:** Developer  
**Estimated Effort:** 20 min

#### Subtasks:
1. [ ] Open http://localhost:3000
2. [ ] Open Chrome DevTools (F12) → Toggle device toolbar (Ctrl+Shift+M)
3. [ ] Test Mobile (375px width):
   - [ ] Logo readable (not too large)
   - [ ] CTA button full-width
   - [ ] Steps stacked vertically
   - [ ] Footer links stacked vertically
   - [ ] Text readable (not too small)
4. [ ] Test Tablet (768px width):
   - [ ] 2-column layout for steps (optional)
   - [ ] CTA button not full-width
   - [ ] Footer links in row
5. [ ] Test Desktop (1440px width):
   - [ ] Content max-width constraint (not edge-to-edge)
   - [ ] 4-column layout for steps
   - [ ] All spacing proportional
6. [ ] Fix any responsive issues found
7. [ ] Commit fixes: `git add . && git commit -m "fix: responsive design adjustments"`

**Success Criteria:** Page looks good on mobile, tablet, desktop

---

### Task 6: Accessibility & Performance Audit
**Owner:** Developer  
**Estimated Effort:** 25 min

#### Subtasks:
1. [ ] Run TypeScript check: `npx tsc --noEmit`
2. [ ] Fix any TypeScript errors
3. [ ] Run ESLint: `npm run lint`
4. [ ] Fix any linting errors
5. [ ] Open Chrome DevTools → Lighthouse
6. [ ] Generate report (Desktop mode):
   - [ ] Performance > 90
   - [ ] Accessibility > 90
   - [ ] Best Practices > 90
   - [ ] SEO > 90
7. [ ] Review accessibility issues:
   - [ ] Verify semantic HTML (`<header>`, `<main>`, `<section>`, `<footer>`)
   - [ ] Verify heading hierarchy (h1 → h2 → h3)
   - [ ] Test keyboard navigation (Tab through links/buttons)
   - [ ] Verify color contrast (Lighthouse will flag issues)
8. [ ] Fix any critical issues
9. [ ] Re-run Lighthouse to confirm fixes
10. [ ] Commit fixes: `git add . && git commit -m "fix: accessibility and performance improvements"`

**Success Criteria:** Lighthouse scores all > 90, no TS/ESLint errors

---

### Task 7: Production Deployment & Verification
**Owner:** Developer  
**Estimated Effort:** 15 min

#### Subtasks:
1. [ ] Commit all changes: `git add . && git commit -m "feat: complete Story 1.8 - landing page layout"`
2. [ ] Push to main: `git push origin main`
3. [ ] Wait for Vercel deployment (check Vercel Dashboard or GitHub Actions)
4. [ ] Open production URL: https://sorte-grande-ten.vercel.app
5. [ ] Verify landing page visible in production
6. [ ] Verify all sections render correctly
7. [ ] Verify "Entrar" button works
8. [ ] Verify "Começar Grátis" button works
9. [ ] Test responsive on real mobile device (optional)
10. [ ] Run Lighthouse on production URL
11. [ ] Screenshot landing page for documentation (optional)

**Success Criteria:** Production deployment successful, landing page live

---

## Dev Notes

### Implementation Guidance

**Critical Path:**
```bash
# Create layout components
mkdir -p components/layout
# Implement AppHeader.tsx (gradient logo + Entrar button)
# Implement Footer.tsx (links + copyright)

# Create landing sections
mkdir -p components/landing
# Implement HeroSection.tsx (title + CTA)
# Implement HowItWorksSection.tsx (4 steps)
# Implement DisclaimerSection.tsx (warning box)

# Integrate into landing page
# Replace app/page.tsx with component imports
# Add metadata export for SEO

# Test responsive
# Chrome DevTools → Device toolbar → Test mobile/tablet/desktop

# Lighthouse audit
# Fix accessibility/performance issues

# Deploy
git add .
git commit -m "feat: Story 1.8 complete - landing page layout"
git push origin main
```

**Key Files:**
- `components/layout/AppHeader.tsx` - Reutilizável em todas as páginas
- `components/layout/Footer.tsx` - Reutilizável em todas as páginas
- `components/landing/HeroSection.tsx` - Específico de landing page
- `components/landing/HowItWorksSection.tsx` - Específico de landing page
- `components/landing/DisclaimerSection.tsx` - Específico de landing page
- `app/page.tsx` - Landing page route (substituir placeholder)

### Technical Constraints

**From Architecture:**
- Server Components por padrão (SSR para SEO) - não adicionar 'use client' desnecessariamente
- Semantic HTML para accessibility (<header>, <main>, <section>, <footer>)
- Max-width container (1200px ou 1400px) para evitar edge-to-edge em telas grandes
- Mobile-first responsive design (<768px primary target)

**Tailwind 4.0 Limitation:**
- CSS variables não funcionam em className: `className="bg-gradient-to-r from-primary to-primary-light"` ❌
- Usar inline styles para gradients: `style={{ background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' }}` ✅
- WebkitBackgroundClip e WebkitTextFillColor para gradient text (logo)

**shadcn/ui Button:**
- Button component disponível, mas pode precisar customização
- Opção 1: Usar Button component com variant="default" e adicionar gradient via className (se Tailwind permitir)
- Opção 2: Usar <button> HTML com inline styles (gradient + shadow)
- Opção 3: Criar custom Button component wrapper

**Next.js Metadata:**
- Use `export const metadata` em page.tsx para SEO
- Title, description, keywords recomendados
- Open Graph tags (optional para MVP)

### Testing Strategy

**Manual Testing (Required):**
1. Visual: Verify landing page matches UX mockup (docs/ux-design-directions.html lines 574-630)
2. Responsive: Test mobile (<768px), tablet (768-1024px), desktop (>1024px)
3. Navigation: Click "Entrar" → redirects to /login
4. Navigation: Click "Começar Grátis" → redirects to /login
5. Lighthouse: Performance > 90, Accessibility > 90
6. Browser compatibility: Test Chrome, Firefox, Safari (optional)

**Deployment Verification:**
- Production URL accessible
- All sections visible
- No console errors
- Responsive on real mobile device (optional)

**No automated tests for this story** - Landing page is UI-focused, visual verification sufficient for MVP.

### Edge Cases & Gotchas

1. **Gradient Text (Logo):**
   - Usar WebkitBackgroundClip + WebkitTextFillColor
   - Fallback color caso gradient não funcione (text-primary)
   - Exemplo correto:
```typescript
style={{
  background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text'
}}
```

2. **CTA Button Shadow:**
   - boxShadow inline: `boxShadow: '0 4px 12px rgba(16,185,129,0.3)'`
   - Não usar Tailwind shadow classes (podem não ter cor correta)

3. **Numbered Circles (Steps):**
   - Width/height fixos: 48px (3rem) ou 32px (2rem) dependendo do design
   - Usar flex para centralizar número: `flex items-center justify-center`
   - Gradient background + texto preto (contraste)

4. **Responsive Breakpoints:**
   - Tailwind breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
   - Use md: para tablet, lg: para desktop
   - Mobile-first: classes sem prefixo são mobile por padrão

5. **Server Component SEO:**
   - Não adicionar 'use client' em page.tsx (Server Component por padrão)
   - Metadata export funciona apenas em Server Components
   - View-source deve mostrar HTML completo (não apenas <div id="root">)

6. **Link vs Button:**
   - Use `<Link>` do Next.js para navegação interna (melhor performance)
   - Pode estilizar Link como botão: `<Link href="/login"><button>...</button></Link>`
   - Ou usar Link com className: `<Link href="/login" className="btn">...</Link>`

### Technical Debt / Future Work

- [ ] **Accordion "O que são Wheeling Systems?"** - Epic 7.1 adiciona explicação expandível
- [ ] **Open Graph tags** - Melhorar preview em redes sociais (Twitter, WhatsApp)
- [ ] **Structured Data (JSON-LD)** - Rich snippets no Google (schema.org)
- [ ] **Logo SVG** - Substituir gradient text por SVG profissional (design gráfico)
- [ ] **Animações** - Fade-in ao scroll, hover effects sofisticados (Framer Motion)
- [ ] **A/B Testing** - Testar variações de CTA copy ("Começar Grátis" vs "Experimentar Agora")
- [ ] **Analytics** - Google Analytics 4 ou Vercel Analytics events (track CTA clicks)

### Citations

- [Next.js App Router](https://nextjs.org/docs/app) - Server Components e metadata
- [Tailwind CSS Gradient](https://tailwindcss.com/docs/gradient-color-stops) - Gradients (inline styles workaround)
- [shadcn/ui Button](https://ui.shadcn.com/docs/components/button) - Button component API
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) - Accessibility checklist
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/) - Performance audit tool
- Tech Spec Epic 1: docs/sprint-artifacts/tech-spec-epic-1.md (AC7 - Landing Page, Lines 693-701)
- UX Design Specification: docs/ux-design-specification.md (Emerald Trust theme, Landing Page design)
- UX Design Directions HTML: docs/ux-design-directions.html (Lines 574-630 - Landing Page mockup)
- Epics Detailed: docs/epics-detailed.md (Lines 193-220 - Story 1.8 requirements)

---

## Change Log

| Date | Author | Changes |
|------|--------|---------|
| 2025-12-01 | Carlos (via SM Agent Bob) | Initial story creation via *create-story workflow |
| 2025-12-01 | Carlos (via SM Agent Bob) | Validation improvements: Added tech spec citation, documented pending review item from Story 1.7 |

---

## Dev Agent Record

### Context Reference
- **Context XML:** `docs/sprint-artifacts/1-8-create-landing-page-layout.context.xml` (to be generated when story starts)
- **Dependencies:** Story 1.1 (Next.js), Story 1.4 (NextAuth /login), Story 1.5 (shadcn/ui), Story 1.7 (Vercel deployment)

### Agent Model Used
_To be filled when story implementation starts_

### Completion Notes
_To be filled when story implementation completes_

### File List
_To be filled when story implementation completes_
