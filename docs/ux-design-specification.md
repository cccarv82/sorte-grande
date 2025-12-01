# Sorte Grande UX Design Specification

_Created on 2025-11-30 by Carlos_
_Generated using BMad Method - Create UX Design Workflow v1.0_

---

## Executive Summary

**Sorte Grande** é a primeira plataforma brasileira a aplicar Wheeling Systems (metodologia matematicamente validada) para otimizar apostas em loterias de forma transparente e honesta.

**Visão UX:** Criar uma experiência que transmita **confiança absoluta** e **empoderamento intelectual** - usuários devem sentir que estão fazendo apostas estratégicas baseadas em matemática, não em sorte aleatória ou promessas falsas.

**Personalidade Visual:** Inspirada em instituições financeiras premium (Itaú Private Bank) - sofisticada, séria, confiável. A estética de "sistema exclusivo" comunica que este não é mais um app de loteria comum, mas uma ferramenta inteligente para apostadores estratégicos.

**Princípios de Design:**
- **Simplicidade Extrema:** Interface autoexplicativa, fluxo em 3 passos
- **Confiança Total:** Sistema decide tudo, usuário confia na matemática
- **Transparência Radical:** Explicações claras sobre limitações e probabilidades reais
- **Mobile-First:** PWA otimizado para uso rápido no celular

**Plataforma:** Web Progressive App (PWA) com shadcn/ui

---

## 1. Design System Foundation

### 1.1 Design System Choice

**Sistema Escolhido: shadcn/ui**

**Justificativa:**
- ✅ **Componentes modernos e acessíveis** baseados em Radix UI
- ✅ **Totalmente personalizável** - perfeito para criar identidade visual premium única
- ✅ **TypeScript nativo** - alinhado com stack do projeto
- ✅ **Tailwind CSS** - flexibilidade total para design sofisticado
- ✅ **Sem vendor lock-in** - componentes são copiados para o projeto, não biblioteca externa
- ✅ **Acessibilidade embutida** - WCAG 2.1 Level A compliance por padrão
- ✅ **Performance excelente** - tree-shaking automático, componentes leves

**Componentes shadcn/ui que vamos usar:**
- Button (primary, secondary, ghost)
- Input (para valor em R$)
- Card (para exibir jogos sugeridos)
- Badge (para garantias matemáticas, status)
- Toast (feedback de ações)
- Dialog/Modal (explicações "Como funciona?")
- Dropdown Menu (menu usuário)
- Progress (loading states)
- Accordion (FAQ, disclaimers)

**Componentes customizados necessários:**
- **LotteryGameCard** - Card de jogo com números formatados
- **WheelGuaranteeDisplay** - Badge especial para garantia matemática (ex: "4 if 4")
- **PrizeAlert** - Destaque celebratório para premiações
- **ValueInput** - Input especializado para valor em R$ com validação
- **GameNumbersDisplay** - Grid de números otimizado para leitura

---

## 2. Core User Experience

### 2.1 Defining Experience

**Experiência Definidora do Sorte Grande:**

> *"É o app onde você coloca quanto quer investir e recebe combinações matemáticas otimizadas instantaneamente - sem escolher números, sem configurar nada. Pura confiança na ciência."*

**O Momento Mágico (Core Loop):**

1. **Input mínimo:** "Tenho R$ 150 para investir"
2. **Resultado instantâneo:** Sistema mostra 12 jogos otimizados com garantia "4 if 4"
3. **Ação sem fricção:** Copiar todos os jogos com 1 toque
4. **Celebração automática:** Email "Você ganhou quadra!" (quando acontecer)

**Diferencial vs Concorrentes:**

| Outros apps de loteria | Sorte Grande |
|------------------------|--------------|
| Escolha seus números da sorte | Sistema decide tudo (confiança total) |
| Vários passos, configurações | 3 cliques: valor → ver → copiar |
| Números aleatórios | Wheeling Systems (matemática) |
| "Aumentamos suas chances!" (falso) | "Organizamos de forma inteligente" (honesto) |
| Precisa verificar resultados manualmente | Notificação automática se ganhar |

**Princípios de Experiência:**

1. **Velocidade Radical**
   - Da landing page até ver jogos: <30 segundos
   - Geração de sugestão: <500ms (instantâneo)
   - Zero loading spinners (skeleton screens apenas)

2. **Confiança por Transparência**
   - Explicação "Como funciona?" sempre visível
   - Probabilidades reais mostradas (não escondidas)
   - Disclaimers educacionais, não enterrados em termos

3. **Controle sem Complexidade**
   - Sistema decide loteria automaticamente (Mega/Lotofácil)
   - Sistema decide quantos números no wheel
   - Usuário controla apenas: valor + realizar ou não

4. **Feedback Imediato**
   - Toast ao copiar jogos: "12 jogos copiados ✓"
   - Input de valor valida em tempo real
   - Status de verificação sempre visível

### 2.2 Novel UX Patterns

**Padrão Inovador: "Trust-Based Generation"**

O Sorte Grande inverte o padrão tradicional de apps de loteria. Em vez de customização infinita, adota **confiança total no sistema**.

**Padrão Tradicional (que NÃO vamos usar):**
```
Usuário → Escolhe loteria → Escolhe quantos números → Seleciona cada número → 
Ajusta configurações → Gera → Customiza mais → Finalmente usa
```

**Nosso Padrão Inovador:**
```
Usuário → Informa valor → Sistema decide TUDO → Usuário copia → Realiza
```

**Mecânica do "Trust-Based Generation":**

1. **Trigger:** Input de valor (R$)
2. **Sistema decide automaticamente:**
   - Qual loteria usar (Mega Sena, Lotofácil ou ambas)
   - Quantos números incluir no wheel (8, 10, 12 ou 15)
   - Qual template de wheeling aplicar
   - Quantos jogos gerar
3. **Feedback visual imediato:**
   - Cards de jogos aparecem com animação suave
   - Badge de garantia matemática destacado
   - Valor total calculado automaticamente
4. **Transparência sobre decisões:**
   - Tooltip explicando "Por que 10 números?"
   - Link para "Entenda o Wheeling System"
5. **Sem volta:** Não há botão "ajustar números"
   - Se quiser mudar: gera nova sugestão com valor diferente
   - Reforça confiança na metodologia

**Estados da interação:**

- **Default:** Campo de valor vazio, placeholder "Ex: R$ 100,00"
- **Digitando:** Validação em tempo real (mínimo R$ 10, máximo R$ 500)
- **Generating:** Skeleton cards (não spinner) - aparece <500ms
- **Success:** Cards de jogos com animação de entrada (fade + slide up)
- **Empty History:** Primeira vez - ilustração + "Gere sua primeira sugestão"

**Inspiração de padrões similares:**
- **Uber:** Você não escolhe rota, confia no algoritmo
- **Netflix:** Não configura recomendações, confia no sistema
- **Waze:** Não escolhe caminho, confia na IA

**Por que funciona:**
- Reduz fricção (paradoxo da escolha)
- Posiciona como especialista (não ferramenta passiva)
- Acelera time-to-value
- Diferencia de concorrentes que dão customização excessiva

---

## 3. Visual Foundation

### 3.1 Color System

**Exploração de Temas:**

Criamos 4 direções visuais inspiradas na elegância do Itaú Private Bank, todas com fundo escuro (dark mode) para transmitir sofisticação e reduzir fadiga visual:

**Theme 1: Private Gold** ✨
- **Personalidade:** Exclusividade máxima, premium absoluto
- **Cor Primary:** Dourado (#d4af37) com gradient luminoso
- **Psicologia:** Riqueza, exclusividade, decisões inteligentes
- **Inspiração:** Itaú Private Bank - "sistema para gente rica"
- **Melhor para:** Posicionar como ferramenta profissional premium

**Theme 2: Platinum Gray** 🎯
- **Personalidade:** Minimalismo sofisticado, ultra-moderno
- **Cor Primary:** Cinza platinum (#e0e0e0) com gradiente sutil
- **Psicologia:** Tecnologia de ponta, profissionalismo, clareza
- **Inspiração:** Apps tech premium (Tesla, Apple)
- **Melhor para:** Audiência que valoriza design clean e moderno

**Theme 3: Emerald Trust** 🌱
- **Personalidade:** Confiança com energia positiva
- **Cor Primary:** Verde esmeralda (#10b981)
- **Psicologia:** Crescimento, decisões inteligentes, confiabilidade
- **Inspiração:** Fintechs confiáveis (Nubank) + elegância dark
- **Melhor para:** Equilibrar seriedade com otimismo controlado

**Theme 4: Royal Blue** 🔷
- **Personalidade:** Autoridade institucional, precisão
- **Cor Primary:** Azul royal (#3b82f6)
- **Psicologia:** Confiabilidade, precisão matemática, institucional
- **Inspiração:** Sistemas financeiros sérios (bancos tradicionais)
- **Melhor para:** Transmitir autoridade e precisão científica

**Cores Semânticas (consistentes em todos os temas):**
- Success: Verde #10b981 (premiações, confirmações)
- Error: Vermelho #ef4444 (erros, alertas críticos)
- Warning: Amarelo #f59e0b (atenção, disclaimers)
- Info: Azul #3b82f6 (informações neutras)

**Background System:**
- Background primário: #0a0a0a (preto profundo)
- Surface (cards): #1a1a1a / #0f0f0f (cinza muito escuro)
- Borders: #333333 (cinza médio sutil)
- Text primary: #ffffff (branco puro)
- Text secondary: #cccccc (cinza claro)
- Text muted: #999999 (cinza médio)

**Typography:**
- Font Family: 
  - Display/Headings: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
  - Body: Inter, system-ui, sans-serif
  - Monospace (números): 'JetBrains Mono', 'Fira Code', monospace
- Type Scale:
  - h1: 2.5rem (40px) - Landing page hero
  - h2: 2rem (32px) - Section headers
  - h3: 1.5rem (24px) - Card titles
  - h4: 1.25rem (20px) - Subsections
  - body: 1rem (16px) - Texto principal
  - small: 0.875rem (14px) - Labels, captions
  - tiny: 0.75rem (12px) - Disclaimers

**Spacing System (8px base):**
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px

**Border Radius:**
- sm: 6px (badges, small buttons)
- md: 8px (buttons, inputs)
- lg: 12px (cards)
- xl: 16px (modals, large containers)
- full: 9999px (circular elements)

**Interactive Visualizations:**

- Color Theme Explorer: [ux-color-themes.html](./ux-color-themes.html)

**✅ TEMA ESCOLHIDO: Emerald Trust** 🌱

**Decisão Final:**
- **Cor Primary:** Verde Esmeralda (#10b981) com gradient para #34d399
- **Background:** Preto profundo (#0a0a0a) com surfaces em #0f0f0f
- **Acento:** Verde para ações positivas, mantém sofisticação dark

**Rationale:**
1. **Psicologia de cor:** Verde = confiança, crescimento, decisões inteligentes (não sorte cega)
2. **Diferenciação:** Não usa dourado óbvio de cassinos, se posiciona como ferramenta profissional
3. **Equilíbrio:** Seriedade do dark mode + energia positiva controlada do verde
4. **Inspiração fintech:** Lembra apps financeiros confiáveis (Nubank) com elegância premium
5. **Contraste excelente:** Verde + preto = acessibilidade e legibilidade perfeitas

**Implementação shadcn/ui:**
```css
/* Tailwind Config - Theme Emerald Trust */
colors: {
  primary: {
    DEFAULT: '#10b981',
    foreground: '#000000',
    50: '#ecfdf5',
    100: '#d1fae5',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
  },
  background: '#0a0a0a',
  surface: '#0f0f0f',
  border: '#333333',
}
```

---

## 4. Design Direction

### 4.1 Chosen Design Approach

**Direção Escolhida: "Premium Trust Interface"**

Combinação de elegância dark premium com clareza informacional e velocidade de interação.

**Layout Decisions:**

**Navigation Pattern:** 
- Mobile: Bottom navigation bar (3 itens principais: Home, Histórico, Perfil)
- Desktop: Sidebar esquerda fixa com navegação expandida
- Rationale: Mobile-first (usuários apostam em movimento), desktop é adaptação

**Content Structure:**
- Single column em mobile (simplicidade máxima)
- Max-width 480px para content principal (legibilidade)
- Cards como unidade básica de informação (jogos, sugestões, stats)

**Content Organization:**
- Cards com hover elevation (feedback visual claro)
- Grid de números em circles (padrão familiar de loterias)
- Badges para status e garantias (escaneabilidade)

**Visual Hierarchy Decisions:**

**Density:** Spacious (não dense)
- 24-32px padding em cards
- 16-24px gaps entre elementos
- Breathing room para reduzir ansiedade
- Rationale: Loterias causam ansiedade - design calmo ajuda

**Header Emphasis:** Bold mas não agressivo
- Títulos em 1.5-2rem (legível sem gritar)
- Color accent apenas em CTAs e sucessos
- Hierarquia por tamanho + weight, não apenas cor

**Content Focus:** Números como protagonistas
- Numbers em circles 36x36px (touch-friendly)
- Monospace font para números (precisão visual)
- Whitespace generoso ao redor de números

**Interaction Pattern Decisions:**

**Primary Actions:**
- Inline (não modal) - fluxo contínuo sem interrupções
- Full-width buttons em mobile (fácil apertar)
- Gradient button apenas para ação primária (hierarquia clara)

**Information Disclosure:**
- Progressive: mostra essencial first, detalhes sob demanda
- Tooltips para explicações matemáticas
- Accordion para disclaimers (visível mas não intrusivo)

**User Control:**
- Guided (sistema decide) mas com transparência (explica decisões)
- Undo implícito: nova sugestão substitui anterior
- Sem confirmações excessivas (reduz fricção)

**Visual Style Decisions:**

**Weight:** Balanced (nem minimal nem maximalist)
- Borders sutis (#1a1a1a) definem áreas
- Shadows apenas em hover (feedback interativo)
- Gradients só em primary button (destaque)

**Depth Cues:** Subtle elevation
- Z-index através de background shades (#0a → #0f → #1a)
- Hover transform: translateY(-2px) (sutil, não exagerado)
- Nenhum skeuomorphism (flat moderno)

**Border Style:** Subtle
- 1-2px solid borders em #1a1a1a / #333
- Border-radius 8-16px (moderno mas não excessivo)
- Border-color change on hover (feedback)

**Rationale da Direção:**

Escolhemos esta direção porque:

1. **Transmite confiança sem intimidar:** Dark premium sem ser agressivo
2. **Velocidade perceptual:** Skeleton screens, não spinners - parece mais rápido
3. **Mobile-first real:** Tudo otimizado para toque, desktop é expansão
4. **Hierarquia clara:** Uma ação primária por tela, sem confusão
5. **Familiaridade + inovação:** Usa padrões conhecidos (cards, circles) com twist premium

**Interactive Mockups:**

- Design Direction Showcase: [ux-design-directions.html](./ux-design-directions.html)

**🖼️ Mockups Criados:**

Abra o arquivo `ux-design-directions.html` para ver 6 telas completas:

1. **Landing Page** - Hero + CTA + Como Funciona
2. **Gerar Sugestão** - Input de valor + stats pessoais
3. **Resultados** - Cards de jogos com números + CTAs
4. **Histórico** - Lista de sugestões com status
5. **Premiação** - Celebração de vitória com confetti
6. **Estados Vazios** - First-time experience + loading states

---

## 5. User Journey Flows

### 5.1 Critical User Paths

**Journey 1: First-Time User → First Suggestion (Onboarding implícito)**

**Goal:** Gerar primeira sugestão de jogos sem fricção

**Flow:**
1. **Landing Page**
   - User vê: Hero "Apostas inteligentes baseadas em matemática"
   - User vê: "Como funciona" (4 passos visuais)
   - User vê: Disclaimer honesto (transparência radical)
   - **Action:** Clica "Começar Grátis"

2. **Magic Link Auth**
   - User vê: Input de email apenas
   - User digita: email@exemplo.com
   - System: Envia magic link por email
   - User: Clica link no email
   - System: Autentica e redireciona para dashboard
   - **Feedback:** Toast "Bem-vindo! ✨"

3. **Dashboard - First Use (Empty State)**
   - User vê: Empty state "Nenhuma sugestão ainda"
   - User vê: Ilustração 🎯 + CTA "Gerar Primeira Sugestão"
   - **Action:** Clica CTA

4. **Generate Suggestion**
   - User vê: Input "Valor disponível" com placeholder "R$ 100,00"
   - User vê: Hint "Mínimo R$ 10 • Máximo R$ 500"
   - User vê: Info box "O que vai acontecer?"
   - User digita: R$ 150,00
   - **Validation:** Real-time (green border on valid)
   - **Action:** Clica "Gerar Jogos Otimizados"

5. **Loading State**
   - User vê: Skeleton cards (3 placeholders animados)
   - Duration: <500ms
   - **No spinner:** Parece instantâneo

6. **Results**
   - User vê: "✨ Jogos prontos! 12 jogos • Mega Sena • Garantia: 4 if 4"
   - User vê: Info box "Garantia matemática: Se 4 dos seus 10 números saírem..."
   - User vê: 3 cards de jogos (com scroll para ver os 12)
   - User vê: Botão "📋 Copiar Todos os Jogos" (primary)
   - **Action:** Clica "Copiar Todos os Jogos"
   - **Feedback:** Toast "12 jogos copiados ✓" + clipboard preenchido

7. **External Action (Loteria Online)**
   - User vê: Botão "🔗 Abrir Loteria Online da Caixa"
   - **Action:** Clica (abre nova aba)
   - User: Cola jogos no site da Caixa
   - User: Realiza apostas
   - User: Volta para Sorte Grande

8. **Mark as Realized**
   - User vê: Botão "✓ Marcar como Realizado"
   - **Action:** Clica
   - **Feedback:** Toast "Sugestão marcada! Verificaremos automaticamente após sorteio ✓"
   - System: Atualiza status para "Aguardando sorteio"

**Success Criteria:**
- ✓ Tempo total: <2 minutos (email → jogos copiados)
- ✓ Zero dúvidas sobre próximo passo
- ✓ Sentimento: "Isso foi fácil e confiável"

---

**Journey 2: Returning User → Check Results**

**Goal:** Ver se ganhou prêmio em jogos realizados

**Flow:**
1. **Email Notification**
   - User recebe: Email "Sorte Grande - Resultados do Concurso 2750"
   - Subject line: "🎉 Boa notícia!" ou "Resultados verificados"
   - **Action:** Clica link no email

2. **Dashboard - Prize Alert**
   - User vê: Tela de celebração "🎉 Parabéns! Você acertou a Quadra!"
   - User vê: Valor grande: "R$ 1.286,00"
   - User vê: Card com números sorteados (4 highlighted em verde)
   - User vê: "Jogo #3 premiado • Mega Sena • Concurso 2750"
   - **Emotion:** Dopamine hit - celebração merecida
   - **Action:** Clica "Ver Detalhes Completos"

3. **Prize Details**
   - User vê: Breakdown de todos os 12 jogos
   - User vê: Quais acertaram (1 com quadra, outros sem prêmio)
   - User vê: Explicação: "Wheeling System funcionou! Sua garantia '4 if 4' foi acionada"
   - User vê: Histórico de premiações (todas as vitórias passadas)
   - **Feedback:** Confiança no sistema aumentada

**Alternative Flow - No Prize:**
1. Email: "Resultados verificados - Concurso 2750"
2. Dashboard: Card em histórico com status "✓ Verificado • Sem prêmio"
3. User vê: Botão "Gerar Nova Sugestão" (incentivo para continuar)
4. **No negative emotion:** Design neutro, não frustrante

**Success Criteria:**
- ✓ Premiações sempre celebradas (mesmo pequenas)
- ✓ Sem prêmio = neutro, não negativo
- ✓ User motivado a gerar próxima sugestão

---

**Journey 3: Power User → Quick Generate**

**Goal:** Usuário experiente quer gerar nova sugestão rapidamente

**Flow:**
1. **Dashboard**
   - User vê: Botão "+" floating action button (bottom-right mobile)
   - **Action:** Clica "+"

2. **Quick Generate Modal**
   - Modal aparece: Input de valor pré-preenchido com último valor usado
   - User vê: "Usar R$ 150 novamente?" com botões "Sim" | "Alterar"
   - **Action:** Clica "Sim"

3. **Instant Results**
   - Modal fecha
   - Skeleton aparece <100ms
   - Results aparecem <500ms
   - User vê: Toast "12 novos jogos gerados ✨"
   - **Flow:** Totalmente inline, sem navegação

4. **Copy & Go**
   - User: Swipe up no card para ver ações rápidas
   - User: Tapa em "Copy All"
   - User: Tapa em "Mark Realized"
   - **Total time:** <10 segundos

**Success Criteria:**
- ✓ Power users fazem isso com olhos fechados
- ✓ Muscle memory: sempre no mesmo lugar
- ✓ Zero cognitive load

---

**Decision Points & Branching:**

**Decision 1: Qual loteria?**
- System decide baseado em budget
- User nunca escolhe
- Transparência: Tooltip explica "Por que Mega Sena?"

**Decision 2: Realizar ou não realizar?**
- User pode ignorar sugestão (não marca como realizada)
- System: Mantém no histórico como "Não realizado"
- Sem cobrança: "Quer mesmo jogar isso?" - respeita autonomia

**Decision 3: Ver explicação matemática?**
- Link "Como funciona Wheeling?" sempre visível
- Opens modal com diagrama e exemplos
- Opcional: User pode confiar sem entender detalhes

**Error Recovery:**

**Erro 1: Budget insuficiente (< R$ 10)**
- Feedback: Border vermelho + mensagem "Valor mínimo R$ 10"
- Sugestão: "Tente R$ 20 para 2 jogos"

**Erro 2: API da Caixa offline**
- Feedback: Alert "Temporariamente indisponível"
- Ação: "Usar dados em cache" ou "Tentar novamente"
- Transparência: "Última atualização: 2h atrás"

**Erro 3: Magic link expirado**
- Feedback: "Link expirou. Enviar novo?"
- Ação: Botão "Enviar Novo Link"
- Sem frustração: 1 clique resolve

**Success States:**

**Success 1: Jogos copiados**
- Toast: "12 jogos copiados ✓"
- Clipboard com formato:
  ```
  Mega Sena - 12 jogos
  
  Jogo 1: 03 12 18 27 34 45
  Jogo 2: 07 15 23 31 42 58
  ...
  ```

**Success 2: Marcado como realizado**
- Toast: "Sugestão marcada ✓"
- Card status: "⏳ Aguardando sorteio"
- Next action hint: "Verificaremos automaticamente após o sorteio"

**Success 3: Premiação detectada**
- Email enviado
- Push notification (se habilitado)
- Badge no ícone do app (PWA)
- Tela de celebração on open

---

## 6. Component Library Strategy

### 6.1 shadcn/ui Base Components (Direct Use)

**From shadcn/ui - Use as-is with theme customization:**

| Component | Usage | Customization Needed |
|-----------|-------|---------------------|
| `Button` | Primary, Secondary, Ghost CTAs | Apply Emerald Trust gradient to variant="default" |
| `Input` | Value input, Email input | Focus ring color = #10b981 |
| `Card` | Base for GameCard, HistoryCard | Background = #0f0f0f, border = #1a1a1a |
| `Badge` | Price tags, Status indicators | Variants: success (green), warning (yellow), neutral (gray) |
| `Toast` | Feedback messages | Position: bottom-center mobile, top-right desktop |
| `Dialog` | Modals (How it works, Prize details) | Max-width: 480px mobile, 600px desktop |
| `Dropdown Menu` | User menu, Context menus | Arrow nav + keyboard support |
| `Progress` | Loading operations (rare) | Indeterminate bar with green gradient |
| `Accordion` | FAQ, How it works sections | Icon: chevron, open state = green text |
| `Separator` | Visual dividers | Color: #1a1a1a, thickness: 1px |

**Installation approach:**
```bash
npx shadcn-ui@latest add button input card badge toast dialog dropdown-menu progress accordion separator
```

**Theme configuration (Tailwind):**
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10b981',
          light: '#34d399',
          dark: '#059669',
        },
        surface: {
          DEFAULT: '#0f0f0f',
          elevated: '#1a1a1a',
        },
        background: '#0a0a0a',
      },
    },
  },
}
```

---

### 6.2 Custom Components (Build from scratch)

**Component 1: LotteryGameCard**

**Purpose:** Display individual lottery game with numbers, price, and metadata

**Anatomy:**
```
┌─────────────────────────────┐
│ JOGO #1          R$ 12,50   │ ← Header (title + badge)
├─────────────────────────────┤
│ ◉ ◉ ◉ ◉ ◉ ◉                 │ ← Numbers grid (6 circles)
│ 03 12 18 27 34 45           │
└─────────────────────────────┘
```

**Props:**
```typescript
interface LotteryGameCardProps {
  gameNumber: number;           // 1, 2, 3...
  numbers: number[];            // [3, 12, 18, 27, 34, 45]
  price: number;                // 12.50
  isWinning?: boolean;          // Highlight in green
  winningNumbers?: number[];    // Highlight specific numbers
  onClick?: () => void;         // Card clickable
}
```

**States:**
- Default: Gray background #0f0f0f, gray border #1a1a1a
- Hover: Green border #10b981, subtle shadow
- Winning: Green border, green highlighted numbers
- Selected: Green background rgba(16, 185, 129, 0.1)

**Variants:**
- `compact`: Smaller padding (16px), smaller numbers (28x28px)
- `expanded`: Includes metadata (lottery name, concurso)

**Behavior:**
- Click: Expand to show copy button for individual game
- Long press (mobile): Context menu (Copy, Share, Details)

**Accessibility:**
- Role: `button` (if clickable) or `article`
- ARIA label: "Jogo 1, números 03 12 18 27 34 45, preço R$ 12,50"
- Keyboard: Enter/Space to click
- Screen reader: Announces all numbers in sequence

---

**Component 2: WheelGuaranteeDisplay**

**Purpose:** Show guarantee badge ("4 if 4") with tooltip explanation

**Anatomy:**
```
┌──────────────────────┐
│ ℹ️ Garantia: 4 if 4  │ ← Badge with info icon
└──────────────────────┘
    ↓ (hover/tap)
┌────────────────────────────────┐
│ Se 4 dos seus 10 números       │
│ saírem, você ganha pelo menos  │
│ uma quadra garantida!          │
└────────────────────────────────┘
```

**Props:**
```typescript
interface WheelGuaranteeDisplayProps {
  guarantee: string;        // "4 if 4", "3 if 3"
  explanation: string;      // Long-form explanation
  position?: 'inline' | 'tooltip';
}
```

**States:**
- Default: Green badge with subtle border
- Hover: Tooltip appears (desktop)
- Tap: Tooltip toggles (mobile)

**Variants:**
- `inline`: Full explanation visible always
- `tooltip`: Explanation on hover/tap only (default)

**Accessibility:**
- Role: `button` with `aria-describedby`
- Keyboard: Tab focus, Enter/Space to toggle tooltip
- Screen reader: "Garantia 4 if 4, botão, pressione para ver explicação"

---

**Component 3: PrizeAlert**

**Purpose:** Celebration component when user wins

**Anatomy:**
```
┌─────────────────────────┐
│        🎉 5rem          │ ← Large emoji
│                         │
│     Parabéns!           │ ← H1 green 2.2rem
│  Você acertou a Quadra! │ ← H2 1.2rem
│                         │
│    R$ 1.286,00          │ ← Prize value 2.5rem bold
│                         │
│  ✨ Jogo #3 premiado    │ ← Details box
│                         │
│ [Ver Detalhes ➔]        │ ← CTA button
└─────────────────────────┘
```

**Props:**
```typescript
interface PrizeAlertProps {
  prizeType: 'sena' | 'quina' | 'quadra' | 'terno';
  prizeValue: number;          // 1286.00
  gameNumber: number;          // 3
  lotteryName: string;         // "Mega Sena"
  concursoNumber: number;      // 2750
  onViewDetails: () => void;
}
```

**States:**
- Entrance: Fade in + scale up animation (0.3s ease-out)
- Confetti: SVG confetti particles falling (CSS animation)

**Variants:**
- `large`: Full-screen takeover (default for prizes > R$ 500)
- `inline`: Card within history list (for smaller prizes)

**Behavior:**
- Auto-shows on dashboard load if unread prize exists
- Dismissible: Close button top-right
- One-time: Don't show again for same prize

**Accessibility:**
- Role: `dialog` with `aria-modal="true"`
- Focus trap: Tab cycles through elements inside
- Escape key: Closes dialog
- Screen reader: "Alerta de premiação, você ganhou R$ 1286 na quadra"

---

**Component 4: ValueInput**

**Purpose:** Specialized input for R$ currency with validation

**Anatomy:**
```
┌─────────────────────────────┐
│ VALOR DISPONÍVEL            │ ← Label (gray uppercase)
├─────────────────────────────┤
│ R$ 150,00                   │ ← Input (large 1.5rem)
├─────────────────────────────┤
│ Mínimo R$ 10 • Máximo R$ 500│ ← Hint (small gray)
└─────────────────────────────┘
```

**Props:**
```typescript
interface ValueInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;              // Default: 10
  max?: number;              // Default: 500
  currency?: string;         // Default: "R$"
  error?: string;            // Error message
}
```

**States:**
- Default: Gray border #333
- Focus: Green border #10b981, green shadow
- Valid: Green checkmark icon right side
- Error: Red border #ef4444, red error message below
- Disabled: Gray background, cursor not-allowed

**Behavior:**
- Auto-format: Types "150" → displays "R$ 150,00"
- Real-time validation: Shows error immediately if < min or > max
- Smart paste: Accepts "150", "R$ 150", "150.00", "150,00"

**Accessibility:**
- Role: `textbox` with `aria-invalid` when error
- Associated labels: `aria-labelledby` for label, `aria-describedby` for hint/error
- Keyboard: Number input type on mobile
- Screen reader: "Campo de valor disponível, R$ 150, válido"

---

**Component 5: GameNumbersDisplay**

**Purpose:** Grid of lottery number circles (visual protagonist)

**Anatomy:**
```
┌─────────────────────────────┐
│ ◉  ◉  ◉  ◉  ◉  ◉            │ ← 6 circles 36x36px
│ 03 12 18 27 34 45           │
└─────────────────────────────┘
```

**Props:**
```typescript
interface GameNumbersDisplayProps {
  numbers: number[];           // [3, 12, 18, 27, 34, 45]
  size?: 'small' | 'medium' | 'large';
  highlightedNumbers?: number[]; // [3, 12] for winning
  variant?: 'default' | 'winning' | 'muted';
}
```

**States:**
- Default: Gray background #1a1a1a, white text
- Winning: Green background #10b981, black text (bold)
- Muted: Darker gray #0f0f0f, gray text #666

**Variants:**
- `small`: 28x28px circles, 0.8rem font
- `medium`: 36x36px circles, 0.9rem font (default)
- `large`: 44x44px circles, 1.1rem font (for prize alert)

**Behavior:**
- Numbers always zero-padded: "03" not "3"
- Font: Monospace (JetBrains Mono) for numbers
- Animation: Fade in + slide up on load (staggered 50ms delay per number)

**Accessibility:**
- Role: `list` with `listitem` for each number
- ARIA label: "Números do jogo: 03, 12, 18, 27, 34, 45"
- Screen reader: Reads all numbers in sequence with pauses

---

### 6.3 Component Composition Patterns

**Pattern 1: SuggestionCard = GameCard + Metadata**

```tsx
<Card>
  <CardHeader>
    <GameMetadata /> {/* Lottery name, status, date */}
  </CardHeader>
  <CardContent>
    {games.map(game => (
      <LotteryGameCard key={game.id} {...game} />
    ))}
  </CardContent>
  <CardFooter>
    <Button>Copiar Todos</Button>
    <Button>Abrir Caixa</Button>
  </CardFooter>
</Card>
```

**Pattern 2: PrizeNotification = PrizeAlert + GameNumbersDisplay**

```tsx
<PrizeAlert>
  <Emoji>🎉</Emoji>
  <PrizeTitle>Parabéns!</PrizeTitle>
  <PrizeValue>R$ 1.286,00</PrizeValue>
  <GameNumbersDisplay 
    variant="winning" 
    highlightedNumbers={[9, 14, 26, 35]}
  />
</PrizeAlert>
```

**Pattern 3: GenerateForm = ValueInput + GuaranteeDisplay + Button**

```tsx
<Form>
  <ValueInput onChange={setValue} />
  <InfoBox>
    <WheelGuaranteeDisplay />
  </InfoBox>
  <Button>Gerar Jogos Otimizados</Button>
</Form>
```

---

### 6.4 Implementation Priority

**Phase 1 (MVP - Week 1):**
1. ✅ Button (shadcn/ui)
2. ✅ Input → ValueInput (custom)
3. ✅ Card (shadcn/ui)
4. ✅ Badge (shadcn/ui)
5. ✅ GameNumbersDisplay (custom)
6. ✅ LotteryGameCard (custom)

**Phase 2 (MVP - Week 2):**
7. ✅ Toast (shadcn/ui)
8. ✅ WheelGuaranteeDisplay (custom)
9. ✅ Dialog (shadcn/ui)

**Phase 3 (Post-MVP):**
10. ✅ PrizeAlert (custom)
11. ✅ Dropdown Menu (shadcn/ui)
12. ✅ Progress (shadcn/ui)
13. ✅ Accordion (shadcn/ui)

**Testing Strategy:**
- Storybook for all custom components
- Visual regression tests (Chromatic)
- Accessibility tests (axe, Pa11y)
- Component unit tests (Vitest + Testing Library)

---

## 7. UX Pattern Decisions

### 7.1 Button Hierarchy & Usage

**Primary Button (Green Gradient)**
- Main action on screen (only ONE per screen)
- Examples: "Gerar Jogos Otimizados", "Copiar Todos"
- Visual: Green gradient, black text, shadow

**Secondary Button (Green Outline)**
- Alternative actions
- Examples: "Abrir Loteria Online", "Ver Histórico"
- Visual: Transparent, green border

**Ghost Button (Transparent)**
- Tertiary actions
- Examples: "Cancelar", "Fechar", "Marcar como Realizado"
- Visual: Transparent, gray border

**Destructive Button (Red)**
- Dangerous actions
- Examples: "Excluir Conta", "Remover Permanentemente"
- Visual: Red background or outline

**Rules:**
- 1 Primary per screen maximum
- Full-width on mobile for Primary buttons
- Icon + Text for better scannability

---

### 7.2 Feedback Patterns

**Toast (Ephemeral):**
- Success: "Jogos copiados ✓" (3s duration)
- Position: Bottom-center mobile, top-right desktop
- Max 3 stacked

**Inline (Contextual):**
- Form validation below inputs
- Real-time on blur
- Persistent until fixed

**Modal (Blocking):**
- Critical errors
- Confirmations
- Focus trap, Escape closes

---

### 7.3 Form Patterns

**Labels:** Above inputs (not inline/floating)
**Required:** Asterisk (*) after label
**Validation:** On BLUR (balance between immediate/late)
**Errors:** Red border + icon + message below
**Help:** Gray hint below input (always visible)

---

### 7.4 Modal Patterns

**Sizes:** Small (400px) | Medium (600px) | Large (900px) | Full-screen (mobile)
**Dismiss:** X button + Escape key + Backdrop click (optional)
**Focus:** Auto-focus first element on open

---

### 7.5 Navigation Patterns

**Active State:** Green text + 4px left border
**Breadcrumbs:** Mobile only, when nested
**Back Button:** Top-left mobile, browser back desktop

---

### 7.6 Empty States

**First-Time:** Large emoji + Title + Description + CTA
**No Results:** Smaller emoji + "Nenhum resultado" + Suggestion
**Cleared:** Ghost emoji + Neutral message + Undo

---

### 7.7 Confirmation Patterns

**Destructive:** Always confirm with modal
**Non-Destructive:** No confirmation, just Toast

---

### 7.8 Notification Patterns

**In-App:** Badge in header
**Push:** Only critical (prizes, reminders)
**Email:** Prize alerts + weekly summary

---

### 7.9 Date/Time

**Format:** dd/mm/yyyy, 20:00 (24h)
**Relative:** "Hoje", "Ontem", "Há 2 dias"
**Timezone:** Always Brasília time

---

## 8. Responsive Design & Accessibility Strategy

### 8.1 Breakpoints & Adaptation

**Breakpoints:** Mobile (<768px) | Tablet (768-1024px) | Desktop (>1024px)

**Navigation:**
- Mobile: Bottom nav bar (4 items fixed)
- Desktop: Left sidebar (fixed, expanded)

**Content:**
- Cards: Full-width mobile → 2-col tablet → 3-col desktop
- Modals: Full-screen mobile → centered desktop
- Forms: Single column mobile → 2-col desktop where appropriate

**Touch Targets:**
- Mobile: 44x44px minimum (WCAG AAA)
- Number balls: 36x36px (visual, not interactive)
- Buttons: Full-width mobile primary

---

### 8.2 WCAG 2.1 Level AA Compliance

**Color Contrast (4.5:1 for text, 3:1 for UI):**
- ✅ White (#ffffff) on black (#0a0a0a): 21:1
- ✅ Gray (#cccccc) on black: 16:1
- ⚠️ Green (#10b981) on black: 3.9:1 (AA Large only ≥18px)
- Fix: Use #34d399 (lighter) for small text: 5.2:1

**Keyboard Navigation:**
- Tab order: Logical flow
- Focus indicators: 2px green outline
- Modals: Focus trap
- Skip links: "Skip to main content"

**Screen Reader:**
- Semantic HTML (proper headings h1-h6)
- ARIA labels on icons
- `role="list"` for game cards/numbers
- `aria-live="polite"` for toasts
- `aria-invalid` + `aria-describedby` for form errors

**Motion:**
- Respect `prefers-reduced-motion`
- Safe: Fade, slide (short)
- Avoid: Parallax, spin

**Testing:**
- Lighthouse ≥90 accessibility score
- axe DevTools: 0 critical violations
- Manual: Keyboard only, NVDA/VoiceOver, color blindness sim

---

## 9. Implementation Guidance

### 9.1 Development Roadmap

**Phase 1: Foundation (Week 1)**
1. Setup Next.js 14 + TypeScript + Tailwind CSS
2. Install shadcn/ui base components (Button, Input, Card, Badge, Toast)
3. Configure Emerald Trust theme in `tailwind.config.js`
4. Implement design tokens (colors, spacing, typography)
5. Build custom ValueInput component
6. Build GameNumbersDisplay component
7. Build LotteryGameCard component

**Phase 2: Core Screens (Week 2)**
1. Landing Page (Hero + How it Works + Disclaimer)
2. Dashboard (Empty state + Stats grid)
3. Generate Suggestion form (ValueInput + CTA)
4. Results Screen (Game cards + Actions)
5. History Screen (Suggestion list + Status indicators)

**Phase 3: Polish & Accessibility (Week 3)**
1. Toast notification system
2. WheelGuaranteeDisplay component with tooltips
3. PrizeAlert celebration component
4. Loading skeletons
5. Keyboard navigation + focus indicators
6. ARIA labels + screen reader testing
7. Color contrast fixes (small green text)

**Phase 4: Responsive & PWA (Week 4)**
1. Mobile bottom navigation
2. Tablet/Desktop sidebar
3. Responsive breakpoints (768px, 1024px)
4. PWA manifest + service worker
5. Install prompt
6. Offline empty states

---

### 9.2 Technical Implementation Notes

**Next.js App Router Structure:**
```
app/
├── (auth)/
│   ├── login/
│   └── layout.tsx          # Magic link auth layout
├── (dashboard)/
│   ├── layout.tsx          # Sidebar/bottom nav layout
│   ├── page.tsx            # Dashboard home
│   ├── history/
│   │   └── page.tsx
│   └── generate/
│       └── page.tsx
├── layout.tsx              # Root layout (theme provider)
└── page.tsx                # Landing page
```

**shadcn/ui Installation:**
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input card badge toast dialog dropdown-menu
```

**Custom Theme (Emerald Trust):**
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: {
          DEFAULT: '#0f0f0f',
          elevated: '#1a1a1a',
        },
        primary: {
          DEFAULT: '#10b981',
          light: '#34d399',
          dark: '#059669',
        },
        border: '#333333',
      },
    },
  },
}
```

**Component Organization:**
```
components/
├── ui/               # shadcn/ui components
│   ├── button.tsx
│   ├── input.tsx
│   └── card.tsx
├── lottery/          # Custom lottery components
│   ├── ValueInput.tsx
│   ├── GameNumbersDisplay.tsx
│   ├── LotteryGameCard.tsx
│   ├── WheelGuaranteeDisplay.tsx
│   └── PrizeAlert.tsx
└── layout/
    ├── AppHeader.tsx
    ├── Sidebar.tsx
    └── BottomNav.tsx
```

---

### 9.3 Handoff to Architect

**UX → Architecture Interface:**

This UX Design Specification provides architect with:
- ✅ Complete visual foundation (theme, colors, typography)
- ✅ All screen mockups (6 key screens in HTML)
- ✅ Component specifications (5 custom + 10 shadcn/ui)
- ✅ User journey flows (3 critical paths)
- ✅ UX patterns (buttons, feedback, forms, modals)
- ✅ Responsive strategy (3 breakpoints)
- ✅ Accessibility requirements (WCAG AA)

**Architect should define:**
- Database schema (Users, Suggestions, Games, Prizes)
- API routes (POST /api/suggestions, GET /api/history)
- State management (React Context vs Zustand vs Redux)
- Authentication flow (Magic link implementation)
- External integrations (Caixa API for results)
- Deployment pipeline (Vercel + Neon Postgres)

**Design → Development Handoff Artifacts:**
1. This specification document
2. Interactive HTML mockups (`ux-design-directions.html`)
3. Theme explorer (`ux-color-themes.html`)
4. PRD (`prd.md`) for functional requirements
5. Product Brief for business context

---

### 9.4 Completion Summary

**✅ Completed Sections:**
1. Executive Summary - Project vision, UX personality, target audience
2. Design System Foundation - shadcn/ui choice, component list
3. Core User Experience - Defining experience, "Trust-Based Generation" pattern
4. Visual Foundation - Emerald Trust theme selected with rationale
5. Design Direction - Premium Trust Interface philosophy, 6 complete mockups
6. User Journey Flows - 3 critical paths documented with decision points
7. Component Library Strategy - 5 custom + 10 shadcn/ui components specified
8. UX Pattern Decisions - Button hierarchy, feedback, forms, modals, navigation, empty states, confirmations, notifications
9. Responsive & Accessibility Strategy - Breakpoints, WCAG AA compliance, testing

**📊 Deliverables Created:**
- ✅ `docs/ux-design-specification.md` (this document - 1200+ lines)
- ✅ `docs/ux-color-themes.html` (4 theme options with interactive preview)
- ✅ `docs/ux-design-directions.html` (6 complete screen mockups with navigation)

**🎨 Design Decisions Locked:**
- **Theme:** Emerald Trust (green #10b981 + dark mode #0a0a0a)
- **Design System:** shadcn/ui (Radix UI + Tailwind CSS)
- **Core Pattern:** Trust-Based Generation (system decides all, user only inputs value)
- **Visual Style:** Premium Trust Interface (spacious, numbers as protagonists, inline flows)
- **Platform:** Web PWA, mobile-first responsive (80% mobile users)

**🚀 Ready for Next Workflows:**
1. **create-architecture** - Define technical architecture with this UX context
2. **create-epics-and-stories** - Break down into implementable units
3. **test-design** (optional) - Validate UX decisions with usability testing
4. **implementation** - Begin development with complete design foundation

**🎯 Success Metrics (Post-Launch):**
- Time to first suggestion: <2 minutes
- Completion rate (value input → copy games): >85%
- Mobile usage: >75% of sessions
- Accessibility score (Lighthouse): ≥90
- User satisfaction: "Isso foi fácil e confiável" sentiment >80%

---

**UX Design Completed: November 30, 2025**

This specification represents the complete UX foundation for Sorte Grande MVP. All critical screens, components, patterns, and accessibility requirements are documented with rationale. The design embodies "honestidade radical" - honest positioning, transparent guarantees, premium aesthetic without false promises.

**Carlos, o design está completo! 🎉**

---

## Appendix

### Related Documents

- Product Requirements: `docs/prd.md`
- Product Brief: `docs/product-brief-sorte-grande-2025-11-30.md`
- Brainstorming: `docs/bmm-brainstorming-session-2025-11-30.md`

### Core Interactive Deliverables

This UX Design Specification was created through visual collaboration:

- **Color Theme Visualizer**: `docs/ux-color-themes.html`
  - Interactive HTML showing all color theme options explored
  - Live UI component examples in each theme
  - Side-by-side comparison and semantic color usage

- **Design Direction Mockups**: `docs/ux-design-directions.html`
  - Interactive HTML with 6-8 complete design approaches
  - Full-screen mockups of key screens
  - Design philosophy and rationale for each direction

### Next Steps & Follow-Up Workflows

This UX Design Specification can serve as input to:

- **Wireframe Generation Workflow** - Create detailed wireframes from user flows
- **Interactive Prototype Workflow** - Build clickable HTML prototypes
- **Component Showcase Workflow** - Create interactive component library
- **Solution Architecture Workflow** - Define technical architecture with UX context

### Version History

| Date       | Version | Changes                         | Author |
| ---------- | ------- | ------------------------------- | ------ |
| 2025-11-30 | 1.0     | Initial UX Design Specification | Carlos |

---

_This UX Design Specification was created through collaborative design facilitation, not template generation. All decisions were made with user input and are documented with rationale._
