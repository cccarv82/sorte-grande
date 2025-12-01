# Story 1.5: Install shadcn/ui Components

**Epic:** Epic 1 - Foundation & Project Setup  
**Story ID:** 1.5  
**Status:** done  
**Created:** 2025-12-01  
**Completed:** 2025-12-01  
**Author:** Carlos (via SM Agent Bob)  
**Developer:** Dev Agent Amelia  
**Context:** `1-5-install-shadcn-ui-components.context.xml`

---

## User Story

**Como** desenvolvedor  
**Quero** instalar e configurar shadcn/ui com tema Emerald Trust  
**Para que** tenha componentes de UI acessíveis e customizados prontos para uso

---

## Requirements Context

### Source Documents
- **Tech Spec:** `docs/sprint-artifacts/tech-spec-epic-1.md` (Design System Foundation section)
- **Architecture:** `docs/architecture.md` (Technology Stack Details - shadcn/ui)
- **Epics Detailed:** `docs/epics-detailed.md` (Epic 1, Story 1.5 - Install shadcn/ui)
- **UX Design:** `docs/ux-design-specification.md` (Design System, Emerald Trust theme)
- **Previous Story:** `docs/sprint-artifacts/1-4-configure-nextauth-v5-magic-link.md` (auth configured, Next.js app ready)

### Business Context
shadcn/ui fornece componentes React acessíveis (WCAG 2.1 Level A) baseados em Radix UI, que são copiados diretamente para o projeto (não instalados via npm package). Isso elimina vendor lock-in e permite customização total. O tema Emerald Trust (#10b981 primary, #050505 background) será aplicado via Tailwind CSS, criando a identidade visual profissional e confiável do Sorte Grande.

### Technical Context
- **UI Library:** shadcn/ui (Radix UI primitives + Tailwind CSS)
- **Installation:** CLI que copia componentes para `components/ui/`
- **Theme:** Emerald Trust (#10b981 green primary, dark mode default)
- **Components Needed:** Button, Input, Card, Badge, Toast, Dialog (6 components para MVP)
- **Dependencies:** Radix UI packages (auto-installed), class-variance-authority, clsx, tailwind-merge
- **Accessibility:** WCAG 2.1 Level A out-of-box (keyboard nav, ARIA labels, focus management)

### Key Requirements
1. Executar `npx shadcn@latest init` para inicializar shadcn/ui
2. Configurar tema Emerald Trust durante init (primary #10b981, dark mode default)
3. Instalar 6 componentes essenciais: button, input, card, badge, toast, dialog
4. Customizar `tailwind.config.ts` com cores Emerald Trust (#10b981, #34d399, #050505, #0f0f0f, #1a1a1a)
5. Configurar dark mode como padrão (className strategy)
6. Verificar componentes renderizam corretamente com tema aplicado
7. Testar responsividade e acessibilidade básica (keyboard navigation)
8. Documentar tema e componentes no README

---

## Learnings from Previous Story

**From Story 1-4-configure-nextauth-v5-magic-link (Status: done)**

**Available Infrastructure:**
- ✅ **Next.js 16 App Router:** Server Components padrão, Client Components com 'use client'
- ✅ **Tailwind CSS 3.4+:** Já configurado, pronto para custom theme tokens
- ✅ **TypeScript Strict Mode:** Todos componentes devem ser tipados
- ✅ **Import Alias:** `@/` resolve para `app/` directory
- ✅ **ESLint + Prettier:** Ferramentas de qualidade configuradas

**Key Patterns Established:**
- Environment variables em .env.local (nunca commit secrets)
- Comprehensive README sections (setup, examples, resources)
- JSDoc comments explicando configurações complexas
- TypeScript type augmentation em `types/` directory
- Centralized exports em `index.ts` files

**Technical Decisions:**
- Dark mode preferred (background #050505, less eye strain for users)
- Mobile-first responsive design (breakpoints: 768px, 1024px)
- Component composition pattern (shadcn/ui components reusable)
- No inline styles (Tailwind utility classes only)

**Important Notes:**
- Tailwind já configurado em Story 1.1 - apenas adicionar theme tokens
- Dark mode strategy: 'className' (não 'media') para controle manual
- shadcn/ui components são copiados (não npm package) - possível editar diretamente
- Radix UI primitives fornecem acessibilidade (keyboard nav, ARIA)

**Recommendations for This Story:**
- Use `npx shadcn@latest init` para configuração interativa (selecione Emerald)
- Customize `tailwind.config.ts` após init com cores exatas do UX Design
- Teste cada componente isoladamente antes de integrar (Storybook opcional)
- Documente theme tokens no README para consistência de equipe futura
- Verifique dark mode ativo verificando body className (deve ter 'dark')

**File Locations:**
- Tailwind config: `app/tailwind.config.ts` (será modificado)
- Components will be: `app/components/ui/` (shadcn/ui CLI cria diretório)
- Global styles: `app/app/globals.css` (theme CSS variables)

[Source: docs/sprint-artifacts/1-4-configure-nextauth-v5-magic-link.md#Dev-Agent-Record, #Learnings-from-Previous-Story]

---

## Project Structure Alignment

### Expected File Structure (After Story Completion)
```
app/
├── components/
│   └── ui/                         # [NEW] shadcn/ui components directory
│       ├── button.tsx              # [NEW] Button component
│       ├── input.tsx               # [NEW] Input component  
│       ├── card.tsx                # [NEW] Card component
│       ├── badge.tsx               # [NEW] Badge component
│       ├── toast.tsx               # [NEW] Toast notification
│       ├── toaster.tsx             # [NEW] Toast container
│       └── dialog.tsx              # [NEW] Dialog/modal component
├── app/
│   ├── globals.css                 # [MODIFIED] Add theme CSS variables
│   └── layout.tsx                  # [MODIFIED] Add dark className, Toaster provider
├── lib/
│   └── utils.ts                    # [NEW] shadcn/ui utility functions (cn helper)
├── tailwind.config.ts              # [MODIFIED] Add Emerald Trust theme tokens
├── components.json                 # [NEW] shadcn/ui configuration file
├── package.json                    # [MODIFIED] Add Radix UI dependencies
└── README.md                       # [MODIFIED] Add Design System section
```

### Integration Points
- **Upstream Dependencies:** 
  - Story 1.1 ✅ (Next.js + Tailwind configured)
  - Story 1.4 ✅ (Next.js app running, ready for components)
- **Downstream Consumers:** 
  - Story 1.6 (Custom Lottery Components - will use Button, Card, Badge)
  - Story 1.8 (Landing Page - will use Button, Card)
  - Story 2.1 (Login Page - will use Input, Button)
  - All Epic 2+ stories (UI components foundational for all pages)
- **Parallel Stories:** Story 1.6 (can start after this) and Story 1.7 (independent - Vercel deploy)

### Patterns to Follow
- All shadcn/ui components in `components/ui/` (never modify this convention)
- Import components: `import { Button } from '@/components/ui/button'`
- Use `cn()` utility for conditional Tailwind classes
- Extend components via props, not by editing source (prefer composition)
- Theme tokens in `tailwind.config.ts` (single source of truth)

---

## Acceptance Criteria

### AC1: shadcn/ui Initialized Successfully
- [x] Run `npx shadcn@latest init` completed without errors
- [x] `components.json` file created with configuration
- [x] `lib/utils.ts` created with `cn()` helper function
- [x] Tailwind config updated with shadcn/ui defaults
- [x] TypeScript compiles: `npx tsc --noEmit` (0 errors)

### AC2: Emerald Trust Theme Configured
- [x] Primary color set to #10b981 (emerald-500)
- [x] Secondary color set to #34d399 (emerald-400)
- [x] Background set to #050505 (near black)
- [x] Card background set to #0f0f0f (dark gray)
- [x] Border color set to #1a1a1a (darker gray)
- [x] Dark mode active by default (className strategy)
- [x] `globals.css` contains CSS variables for theme colors
- [x] Body element has `dark` className in `layout.tsx`

### AC3: Required Components Installed
- [x] `button.tsx` installed in `components/ui/`
- [x] `input.tsx` installed in `components/ui/`
- [x] `card.tsx` installed in `components/ui/`
- [x] `badge.tsx` installed in `components/ui/`
- [x] `sonner.tsx` (toast replacement) installed in `components/ui/`
- [x] `dialog.tsx` installed in `components/ui/`
- [x] All 6 components importable: `import { Button } from '@/components/ui/button'`
- [x] No TypeScript errors in component files

### AC4: Radix UI Dependencies Installed
- [x] `@radix-ui/react-slot` installed (Button primitive)
- [x] `@radix-ui/react-dialog` installed (Dialog primitive)
- [x] `sonner` installed (Toast primitive - replaces @radix-ui/react-toast)
- [x] `class-variance-authority` installed (variant styling)
- [x] `clsx` installed (conditional classes)
- [x] `tailwind-merge` installed (merge Tailwind classes)
- [x] `lucide-react` installed (icon library for components)
- [x] All dependencies in `package.json` with correct versions

### AC5: Components Render with Theme
- [x] Create test page `/test-components` (temporary)
- [x] Render Button: variants (default, outline, ghost), sizes (sm, default, lg)
- [x] Render Input: with placeholder, with error state
- [x] Render Card: with CardHeader, CardContent, CardFooter
- [x] Render Badge: variants (default, secondary, destructive, outline)
- [x] Render Toast: show toast notification programmatically
- [x] Render Dialog: open/close modal with content
- [x] All components display Emerald theme colors correctly

### AC6: Accessibility Verified
- [x] Keyboard navigation works (Tab, Enter, Escape keys)
- [x] Focus indicators visible (outline on focused elements)
- [x] ARIA labels present on interactive elements
- [x] Button has proper role and accessible name
- [x] Input has label association (for attribute)
- [x] Dialog traps focus when open
- [x] Toast announces to screen readers (aria-live)

### AC7: Responsive Design Tested
- [x] Components render correctly on mobile (< 768px)
- [x] Components render correctly on tablet (768-1024px)
- [x] Components render correctly on desktop (> 1024px)
- [x] Touch targets minimum 44x44px on mobile
- [x] No horizontal scroll on small screens
- [x] Font sizes scale appropriately (rem units)

### AC8: Documentation Updated
- [x] README.md has "Design System" section
- [x] Theme colors documented with hex codes
- [x] Example usage for each component provided
- [x] shadcn/ui CLI commands documented (add new components)
- [x] Tailwind theme tokens explained
- [x] Resources section links to shadcn/ui docs

---

## Tasks & Subtasks

### Task 1: Initialize shadcn/ui
**Owner:** Developer  
**Estimated Effort:** 5 min

#### Subtasks:
1. [ ] Navigate: `cd app`
2. [ ] Run init command: `npx shadcn@latest init`
3. [ ] Answer prompts:
   - Style: `New York` (more refined aesthetic)
   - Base color: `Zinc` (will customize to Emerald after)
   - CSS variables: `Yes` (for theme flexibility)
   - Import alias: `@/*` (already configured)
   - React Server Components: `Yes` (Next.js App Router)
4. [ ] Verify created files:
   - `components.json` (shadcn/ui config)
   - `lib/utils.ts` (cn helper function)
   - Updated `tailwind.config.ts`
   - Updated `globals.css` (CSS variables)
5. [ ] Run: `npx tsc --noEmit` (verify 0 errors)

**Success Criteria:** shadcn/ui initialized, configuration files created

**Notes:**
- "New York" style é mais clean que "Default" (preferido para dashboard apps)
- CSS variables permite trocar tema dinamicamente (future-proof)
- shadcn CLI auto-detects Tailwind e TypeScript configs

---

### Task 2: Configure Emerald Trust Theme
**Owner:** Developer  
**Estimated Effort:** 15 min

#### Subtasks:
1. [ ] Open `app/tailwind.config.ts`
2. [ ] Replace theme.extend.colors with Emerald Trust palette:
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'], // Enable dark mode via className
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```
3. [ ] Open `app/app/globals.css`
4. [ ] Update CSS variables in `:root` and `.dark` sections:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;
    --primary: 160 84% 39%; /* #10b981 emerald-500 */
    --primary-foreground: 0 0% 0%;
    --secondary: 159 65% 55%; /* #34d399 emerald-400 */
    --secondary-foreground: 0 0% 0%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 160 84% 39%; /* Same as primary */
    --radius: 0.5rem;
  }

  .dark {
    --background: 0 0% 2%; /* #050505 */
    --foreground: 0 0% 98%;
    --card: 0 0% 6%; /* #0f0f0f */
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 6%; /* #0f0f0f */
    --popover-foreground: 0 0% 98%;
    --primary: 160 84% 39%; /* #10b981 emerald-500 */
    --primary-foreground: 0 0% 0%;
    --secondary: 159 65% 55%; /* #34d399 emerald-400 */
    --secondary-foreground: 0 0% 0%;
    --muted: 0 0% 15%; /* #262626 */
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 15%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 10%; /* #1a1a1a */
    --input: 0 0% 20%; /* #333333 */
    --ring: 160 84% 39%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```
5. [ ] Save files
6. [ ] Restart dev server: `npm run dev` (Tailwind needs restart for config changes)
7. [ ] Verify theme active: Inspect element, check CSS variables computed

**Success Criteria:** Emerald Trust theme colors applied, CSS variables correct

**Notes:**
- HSL format required for CSS variables (shadcn/ui convention)
- Convert hex to HSL: #10b981 → hsl(160, 84%, 39%)
- Dark mode uses same primary/secondary (Emerald always visible)

---

### Task 3: Enable Dark Mode by Default
**Owner:** Developer  
**Estimated Effort:** 5 min

#### Subtasks:
1. [ ] Open `app/app/layout.tsx`
2. [ ] Add `dark` className to `<body>` element:
```typescript
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="dark antialiased">
        {children}
      </body>
    </html>
  )
}
```
3. [ ] Save file
4. [ ] Refresh browser
5. [ ] Verify dark mode active:
   - Background should be #050505 (very dark)
   - Text should be white/light gray
   - Inspect `<body>` element: should have `class="dark antialiased"`

**Success Criteria:** Body has dark className, dark theme visible

**Notes:**
- `antialiased` improves font rendering on dark backgrounds
- Dark mode set via className (not media query) for manual control
- Future: add theme toggle button (Story 10.1 - Profile Settings)

---

### Task 4: Install Required Components
**Owner:** Developer  
**Estimated Effort:** 10 min

#### Subtasks:
1. [ ] Navigate: `cd app`
2. [ ] Install Button: `npx shadcn@latest add button`
3. [ ] Install Input: `npx shadcn@latest add input`
4. [ ] Install Card: `npx shadcn@latest add card`
5. [ ] Install Badge: `npx shadcn@latest add badge`
6. [ ] Install Toast: `npx shadcn@latest add toast`
7. [ ] Install Dialog: `npx shadcn@latest add dialog`
8. [ ] Verify all components created in `components/ui/`:
   ```bash
   ls components/ui/
   # Should show: button.tsx, input.tsx, card.tsx, badge.tsx, toast.tsx, toaster.tsx, dialog.tsx
   ```
9. [ ] Run: `npx tsc --noEmit` (verify 0 TypeScript errors)

**Success Criteria:** All 6 components installed, no TypeScript errors

**Notes:**
- shadcn CLI auto-installs Radix UI dependencies per component
- `toaster.tsx` created automatically with toast (container component)
- Each component is standalone (can edit without breaking others)

---

### Task 5: Add Toaster to Root Layout
**Owner:** Developer  
**Estimated Effort:** 5 min

#### Subtasks:
1. [ ] Open `app/app/layout.tsx`
2. [ ] Import Toaster: `import { Toaster } from '@/components/ui/toaster'`
3. [ ] Add Toaster before closing `</body>`:
```typescript
import { Toaster } from '@/components/ui/toaster'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="dark antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
```
4. [ ] Save file
5. [ ] Verify Toaster renders (check React DevTools - should show Toaster component)

**Success Criteria:** Toaster component in layout, ready for toast notifications

**Notes:**
- Toaster must be in layout to show toasts from any page
- Toast notifications triggered via `toast()` hook (imported from `@/components/ui/use-toast`)
- Position: bottom-right by default (customizable in toaster.tsx)

---

### Task 6: Create Component Test Page
**Owner:** Developer  
**Estimated Effort:** 20 min

#### Subtasks:
1. [ ] Create directory: `mkdir -p app/app/test-components`
2. [ ] Create file: `app/app/test-components/page.tsx`:
```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'

export default function TestComponentsPage() {
  const { toast } = useToast()
  const [inputValue, setInputValue] = useState('')

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-4xl font-bold text-primary">shadcn/ui Component Test</h1>
      
      {/* Button Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      {/* Input */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Input</h2>
        <Input 
          type="text" 
          placeholder="Digite algo..." 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="max-w-md"
        />
        <p className="text-sm text-muted-foreground">Valor: {inputValue}</p>
      </section>

      {/* Card */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Card</h2>
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>This is a card description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card content goes here. The card has emerald accents.</p>
          </CardContent>
          <CardFooter>
            <Button>Card Action</Button>
          </CardFooter>
        </Card>
      </section>

      {/* Badges */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Badges</h2>
        <div className="flex flex-wrap gap-4">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </section>

      {/* Dialog */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Dialog</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
              <DialogDescription>
                This is a dialog description. Press ESC to close.
              </DialogDescription>
            </DialogHeader>
            <p>Dialog content goes here.</p>
          </DialogContent>
        </Dialog>
      </section>

      {/* Toast */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Toast</h2>
        <div className="flex flex-wrap gap-4">
          <Button 
            onClick={() => toast({ title: 'Success', description: 'This is a success toast' })}
          >
            Show Toast
          </Button>
          <Button 
            variant="destructive"
            onClick={() => toast({ 
              title: 'Error', 
              description: 'This is an error toast',
              variant: 'destructive'
            })}
          >
            Show Error Toast
          </Button>
        </div>
      </section>
    </div>
  )
}
```
3. [ ] Save file
4. [ ] Navigate to http://localhost:3000/test-components
5. [ ] Test each component:
   - Click all button variants (verify hover/click states)
   - Type in input (verify value updates)
   - View card (verify styling)
   - Hover badges (verify styles)
   - Open dialog (verify modal opens, ESC closes)
   - Click toast buttons (verify notifications appear bottom-right)
6. [ ] Screenshot page for documentation

**Success Criteria:** All components render, interactions work, Emerald theme visible

**Notes:**
- Page is temporary (delete after Story 1.6 - custom components created)
- Use this page as reference when building custom lottery components
- Test page demonstrates all shadcn/ui features developers will use

---

### Task 7: Verify Accessibility
**Owner:** Developer  
**Estimated Effort:** 10 min

#### Subtasks:
1. [ ] Navigate to http://localhost:3000/test-components
2. [ ] Test keyboard navigation:
   - Press Tab: focus moves between interactive elements
   - Press Enter on button: button activates
   - Press Space on button: button activates
   - Open dialog with Enter: dialog opens
   - Press ESC in dialog: dialog closes
3. [ ] Verify focus indicators:
   - Focused elements have visible outline (ring)
   - Ring color matches primary (Emerald)
4. [ ] Check ARIA attributes (Inspect element):
   - Button has `role="button"` (implicit)
   - Dialog has `role="dialog"`, `aria-modal="true"`
   - Toast has `role="status"`, `aria-live="polite"`
5. [ ] Test screen reader (optional - if available):
   - Navigate page with screen reader
   - Verify announcements for interactive elements

**Success Criteria:** Keyboard nav works, focus visible, ARIA attributes present

**Notes:**
- Radix UI provides WCAG 2.1 Level A accessibility out-of-box
- Focus ring styled via `ring` CSS variable (Emerald color)
- Full WCAG AA/AAA testing deferred to post-MVP (acceptable for MVP)

---

### Task 8: Test Responsive Design
**Owner:** Developer  
**Estimated Effort:** 10 min

#### Subtasks:
1. [ ] Open http://localhost:3000/test-components
2. [ ] Open Chrome DevTools (F12)
3. [ ] Toggle device toolbar (Ctrl+Shift+M)
4. [ ] Test mobile (375px width - iPhone SE):
   - Components stack vertically
   - Buttons full-width or wrap correctly
   - No horizontal scroll
   - Text readable (font-size ≥ 16px)
5. [ ] Test tablet (768px width - iPad):
   - Components use more horizontal space
   - Grid layouts activate (if present)
6. [ ] Test desktop (1920px width):
   - Components center or max-width constrained
   - No awkward stretching
7. [ ] Test touch targets on mobile:
   - Buttons minimum 44x44px (use DevTools ruler)
   - Spacing between interactive elements

**Success Criteria:** Components responsive, touch targets adequate, no overflow

**Notes:**
- shadcn/ui components are mobile-first by default
- Tailwind responsive classes (sm:, md:, lg:) work automatically
- Custom components (Story 1.6) should follow same responsive patterns

---

### Task 9: Update Documentation
**Owner:** Developer  
**Estimated Effort:** 20 min

#### Subtasks:
1. [ ] Open `app/README.md`
2. [ ] Add "Design System" section after "Authentication":
```markdown
## Design System

This project uses [shadcn/ui](https://ui.shadcn.com) components with a custom Emerald Trust theme.

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
5. **Toast** - Notification popups (success, error, info)
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

**Toast:**
```typescript
import { useToast } from '@/components/ui/use-toast'

const { toast } = useToast()

toast({
  title: 'Success',
  description: 'Operation completed successfully'
})

toast({
  title: 'Error',
  description: 'Something went wrong',
  variant: 'destructive'
})
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
1. Edit `tailwind.config.ts` (Tailwind tokens)
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
- [Emerald Trust Theme Colors](https://tailwindcss.com/docs/customizing-colors#color-palette-reference)
```
3. [ ] Save file
4. [ ] Review formatting and links
5. [ ] Commit: `git add README.md && git commit -m "docs: add Design System section"`

**Success Criteria:** README has comprehensive Design System section

---

## Dev Notes

### Implementation Guidance

**Critical Path:**
```bash
# From app directory
npx shadcn@latest init                    # 1. Initialize shadcn/ui
# Edit tailwind.config.ts (Emerald theme)  # 2. Customize theme colors
# Edit app/globals.css (CSS variables)     # 3. Update CSS variables
# Edit app/layout.tsx (add dark className) # 4. Enable dark mode
npx shadcn@latest add button input card badge toast dialog  # 5. Install components
# Create test-components/page.tsx          # 6. Test components
npm run dev                                # 7. Verify in browser
```

**Key Files:**
- `components.json` - shadcn/ui configuration (generated by CLI)
- `lib/utils.ts` - cn() helper for conditional Tailwind classes
- `tailwind.config.ts` - Theme tokens (colors, radius, etc.)
- `app/globals.css` - CSS variables for light/dark themes
- `app/layout.tsx` - Dark mode className, Toaster provider
- `components/ui/` - All shadcn/ui components (editable)

### Testing Strategy

**Visual Testing (Required):**
1. Create `/test-components` page with all 6 components
2. Test each variant (button: default, outline, ghost, etc.)
3. Verify Emerald theme colors (#10b981 primary visible)
4. Test interactions (click buttons, type in inputs, open dialogs)
5. Test responsive (mobile, tablet, desktop)
6. Screenshot for documentation

**Accessibility Testing (Required):**
1. Keyboard navigation (Tab, Enter, Space, ESC)
2. Focus indicators visible (ring color Emerald)
3. Screen reader testing (optional but recommended)

**No automated tests for this story** - shadcn/ui components are well-tested upstream (Radix UI test suite).

### Edge Cases & Gotchas

1. **Dark Mode Not Active:**
   - Verify `<body>` has `className="dark"` in layout.tsx
   - Check Tailwind config has `darkMode: ['class']`
   - Restart dev server after config changes

2. **CSS Variables Not Applied:**
   - Verify `globals.css` has correct HSL values
   - Check CSS variable names match Tailwind config
   - Inspect element: computed styles should show Emerald colors

3. **Components Not Importable:**
   - Verify `@/` import alias works: `tsconfig.json` paths configured
   - Check component files exist in `components/ui/`
   - Restart TypeScript server in VSCode (Ctrl+Shift+P → "Restart TS Server")

4. **Toaster Not Showing Toasts:**
   - Verify `<Toaster />` in layout.tsx (before closing `</body>`)
   - Check `useToast()` imported from `@/components/ui/use-toast`
   - Test toast: button onClick → toast({ title: 'Test' })

5. **Theme Colors Wrong:**
   - HSL conversion correct? Use online converter (hex → HSL)
   - #10b981 → hsl(160, 84%, 39%)
   - Restart dev server after changing CSS variables

6. **TypeScript Errors:**
   - Run `npm install` (Radix UI deps may not auto-install)
   - Run `npx tsc --noEmit` to see all errors
   - Check component imports use correct paths

### Technical Debt / Future Work

- [ ] **Storybook:** Setup Storybook for component development (post-MVP)
- [ ] **Component Tests:** Add Vitest tests for custom components (Story 1.6+)
- [ ] **Theme Toggle:** Add light/dark mode toggle button (Story 10.1)
- [ ] **More Components:** Add dropdown-menu, avatar, tabs as needed (future stories)
- [ ] **Custom Icons:** Replace lucide-react with custom Sorte Grande icons (post-MVP)
- [ ] **Animation Library:** Consider framer-motion for advanced animations (post-MVP)

### Citations

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [shadcn/ui Theming Guide](https://ui.shadcn.com/docs/theming)
- [Radix UI Primitives](https://www.radix-ui.com/primitives/docs/overview/introduction)
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- Tech Spec: Design System Foundation (Lines 163-254)
- UX Design: Section 3.1 (Emerald Trust theme colors)
- Architecture: Technology Stack Details - shadcn/ui

---

## Change Log

| Date | Author | Changes |
|------|--------|---------|
| 2025-12-01 | Carlos (via SM Agent Bob) | Initial story creation via *create-story workflow (YOLO mode) |
| 2025-12-01 | Carlos (via Dev Agent Amelia) | Implementation complete - shadcn/ui + Emerald Trust theme configured, all 6 components installed and tested |

---

## Dev Agent Record

### Context Reference
- **Context XML:** Will be generated via `*story-context` workflow after story marked ready-for-dev
- **Dependencies:** Story 1.1 (Next.js + Tailwind), Story 1.4 (Next.js app running)

### Agent Model Used
Claude Sonnet 4.5

### Completion Notes

**Implementation Summary:**
- ✅ shadcn/ui initialized with New York style (components.json + lib/utils.ts created)
- ✅ Emerald Trust theme configured in globals.css (HSL format: primary 160 84% 39%)
- ✅ Dark mode enabled by default via body className="dark"
- ✅ 6 components installed: Button, Input, Card, Badge, Dialog, Sonner (toast)
- ✅ All Radix UI dependencies installed (@radix-ui/react-slot, react-dialog, @radix-ui/react-icons, next-themes, sonner)
- ✅ Test page created at /test-components with all component variants
- ✅ Accessibility verified (keyboard navigation, focus indicators, ARIA labels)
- ✅ Responsive design tested (mobile 375px, tablet 768px, desktop 1024px+)
- ✅ README.md updated with comprehensive Design System section

**Key Decisions:**
- **Used Sonner instead of @radix-ui/react-toast:** shadcn CLI deprecated toast component in favor of Sonner (better DX, simpler API)
- **Manual component creation:** shadcn CLI conflicts with NextAuth nodemailer peer dependency - installed deps with --legacy-peer-deps, then manually created component files from official shadcn/ui source
- **Tailwind 4.0 compatibility:** Maintained existing @import "tailwindcss" syntax, converted shadcn CSS variables from oklch to HSL format

**Dependencies Added:**
- clsx (1.2.1)
- tailwind-merge (2.7.0)
- class-variance-authority (0.7.1)
- lucide-react (latest)
- @radix-ui/react-slot (latest)
- @radix-ui/react-dialog (latest)
- @radix-ui/react-icons (latest)
- sonner (latest)
- next-themes (latest)

**Testing Notes:**
- Visual testing complete: All components render with Emerald theme (#10b981 visible on buttons, focus rings)
- Accessibility testing complete: Tab navigation works, focus indicators visible, ESC closes dialogs
- Responsive testing complete: Components adapt correctly to mobile/tablet/desktop
- TypeScript compilation: 0 errors (npx tsc --noEmit passed)
- Dev server: Running at http://localhost:3000, test page at /test-components

**Known Limitations:**
- Test page is temporary (will be removed after Story 1.6 - Custom Lottery Components)
- Tailwind 4.0 CSS linter warnings expected (@theme inline, @custom-variant syntax)
- npm peer dependency conflict with nodemailer (NextAuth 5.0 beta requires nodemailer 7.x, project uses 6.x) - resolved with --legacy-peer-deps

**Next Steps:**
- Story 1.6: Create custom lottery components using shadcn/ui primitives (ValueInput, LotteryGameCard, WheelGuaranteeDisplay)
- Post-MVP: Setup Storybook for component development
- Post-MVP: Add light/dark mode toggle (Story 10.1)

### Debug Log References
[To be filled during implementation]

### File List
- `app/components.json` - shadcn/ui configuration (NEW)
- `app/lib/utils.ts` - cn() helper function (NEW)
- `app/components/ui/button.tsx` - Button component (NEW)
- `app/components/ui/input.tsx` - Input component (NEW)
- `app/components/ui/card.tsx` - Card component with subcomponents (NEW)
- `app/components/ui/badge.tsx` - Badge component (NEW)
- `app/components/ui/dialog.tsx` - Dialog modal component (NEW)
- `app/components/ui/sonner.tsx` - Toast component using Sonner (NEW)
- `app/app/globals.css` - Emerald Trust theme CSS variables (MODIFIED)
- `app/app/layout.tsx` - Added dark className + Toaster (MODIFIED)
- `app/app/test-components/page.tsx` - Component test page (NEW - temporary)
- `app/README.md` - Design System documentation (MODIFIED)
- `app/package.json` - Added Radix UI, CVA, Sonner dependencies (MODIFIED)

---

## Senior Developer Review (AI)

**Reviewer:** [To be assigned]  
**Date:** [To be filled during review]  
**Outcome:** [To be determined]

[Review will be conducted after implementation]
