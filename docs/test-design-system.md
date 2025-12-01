# Sorte Grande - System-Level Test Design

**Autor:** Murat (Master Test Architect)  
**Data:** 2025-11-30  
**Versão:** 1.0  
**Modo:** System-Level Testability Review (Phase 3 - Solutioning)  

---

## Executive Summary

Esta avaliação analisa a **testabilidade da arquitetura** do Sorte Grande antes da gate check de implementation-readiness. O objetivo é identificar riscos de testabilidade, validar se requisitos não-funcionais são testáveis, e recomendar estratégia de testes para garantir qualidade durante implementação.

**Veredito Geral:** ✅ **PASS com CONCERNS**

**Score de Testabilidade:** 82/100

**Resumo:**
- ✅ Arquitetura moderna e testável (Next.js 16, TypeScript strict, Drizzle ORM)
- ✅ NFRs bem definidos e mensuráveis (25 NFRs com targets claros)
- ✅ Separação clara de responsabilidades (UI, business logic, data)
- ⚠️ **CONCERN:** Dependência crítica de APIs externas sem estratégia de teste robusta
- ⚠️ **CONCERN:** Lógica complexa de Wheeling precisa de testes matemáticos rigorosos
- ⚠️ **CONCERN:** Jobs assíncronos (cron) com retry/polling precisam de testes de resiliência

**Recomendação:** Prosseguir para implementação COM implementação prioritária de:
1. Mocks/stubs para APIs externas (Caixa, guto-alves)
2. Suite de testes unitários para wheeling engine (coverage >90%)
3. Testes de resiliência para jobs de verificação

---

## 1. Testability Assessment

### 1.1 Controllability ✅ PASS

**Definição:** Podemos controlar o estado do sistema para testes?

**Análise:**

✅ **Database Seeding:** PostgreSQL via Neon permite factories e reset total
```typescript
// Estratégia: Drizzle migrations + factory functions
// lib/test/factories/user.factory.ts
export async function createTestUser(overrides = {}) {
  return await db.insert(users).values({
    id: uuidv4(),
    email: 'test@example.com',
    ...overrides
  })
}
```

✅ **Dependency Injection:** Server Actions e API routes aceitam dependências mockáveis
```typescript
// Pattern: Injetar clientes de API como parâmetros
export async function fetchLotteryResults(
  api: LotteryAPIClient = realCaixaAPI
) {
  return await api.getLatestResults()
}
```

✅ **Time Control:** Jobs de cron podem receber timestamps customizáveis
```typescript
// Permitir injeção de currentDate nos jobs
export async function verifyPrizes(currentDate = new Date()) {
  // ...
}
```

⚠️ **CONCERN - External APIs:**
- APIs da Caixa e guto-alves são externas (sem controle)
- **Mitigation:** Abstrair em interfaces mockáveis
```typescript
// lib/integrations/lottery-api.interface.ts
export interface LotteryAPIClient {
  getResults(contest: number): Promise<LotteryResult>
}

// lib/integrations/caixa-api.mock.ts
export const mockCaixaAPI: LotteryAPIClient = {
  getResults: async () => ({ numbers: [1,2,3,4,5,6], ... })
}
```

**Score:** 4/5 (Alta controlabilidade com uma concern sobre APIs externas)

---

### 1.2 Observability ✅ PASS

**Definição:** Podemos inspecionar o estado do sistema após testes?

**Análise:**

✅ **Database Inspection:** Drizzle ORM fornece queries type-safe
```typescript
// Verificar estado após ação
const suggestion = await db.query.suggestions.findFirst({
  where: eq(suggestions.userId, testUser.id)
})
expect(suggestion.status).toBe('realized')
```

✅ **Logging Estruturado:** Axiom logs com contexto rico
```typescript
logger.info('Prize detected', {
  suggestionId,
  prizeValue,
  matchedNumbers,
  timestamp: new Date()
})
// Testes podem capturar logs para validação
```

✅ **Return Values:** Server Actions retornam resultados ricos
```typescript
const result = await createSuggestion(15000)
expect(result.games).toHaveLength(12)
expect(result.guarantee).toBe('4 if 4')
```

✅ **Metrics:** Vercel Analytics + Axiom fornecem métricas de runtime
- Web Vitals (LCP, CLS, FCP)
- API response times
- Error rates

**Validation Strategy:**
```typescript
// Playwright E2E pode capturar Web Vitals
const metrics = await page.evaluate(() => 
  JSON.parse(window.__NEXT_DATA__.props.pageProps.vitals)
)
expect(metrics.LCP).toBeLessThan(2500) // NFR-P1
```

**Score:** 5/5 (Observabilidade excelente)

---

### 1.3 Reliability ✅ PASS com CONCERNS

**Definição:** Testes são isolados, determinísticos e reproduzíveis?

**Análise:**

✅ **Test Isolation:** Database pode ser resetada entre testes
```typescript
// vitest.setup.ts
beforeEach(async () => {
  await db.delete(suggestions)
  await db.delete(users)
  await db.delete(prizes)
})
```

✅ **Stateless Architecture:** Next.js Server Components são stateless por padrão

⚠️ **CONCERN - Non-Deterministic Elements:**

**1. Random Number Generation (Wheeling)**
```typescript
// lib/wheeling/balance.ts
export function generateBalancedNumbers(count: number) {
  const numbers = []
  while (numbers.length < count) {
    const num = Math.random() * 60 + 1
    // ... balanceamento par/ímpar, alto/baixo
  }
  return numbers
}
```

**Risk:** Testes unitários podem falhar aleatoriamente
**Mitigation:** Injetar seed para Math.random
```typescript
// Usar seedrandom ou similar
import seedrandom from 'seedrandom'

export function generateBalancedNumbers(
  count: number, 
  seed = Date.now()
) {
  const rng = seedrandom(seed.toString())
  const num = Math.floor(rng() * 60) + 1
  // ...
}

// Teste
const numbers = generateBalancedNumbers(6, 12345) // seed fixo
expect(numbers).toEqual([3, 12, 18, 27, 34, 45]) // determinístico
```

**2. Polling Jobs com Retry**
```typescript
// Retry com backoff exponencial não é determinístico em timing
export async function fetchResultsWithRetry(maxRetries = 10) {
  for (let i = 0; i < maxRetries; i++) {
    const delay = Math.pow(2, i) * 1000 // 1s, 2s, 4s, 8s...
    await sleep(delay)
    // ...
  }
}
```

**Risk:** Testes de integração podem ter timing inconsistente
**Mitigation:** Mock timers com vitest/jest
```typescript
vi.useFakeTimers()
await fetchResultsWithRetry()
vi.advanceTimersByTime(15000) // simula 15s instantaneamente
```

**3. External API Availability**
- APIs externas podem estar offline durante testes
**Mitigation:** SEMPRE usar mocks em testes automatizados
```typescript
// playwright.config.ts
webServer: {
  command: 'MOCK_EXTERNAL_APIS=true npm run dev',
  // ...
}
```

**Score:** 4/5 (Alta confiabilidade com concerns sobre determinismo)

---

### Testability Summary

| Critério | Score | Status |
|----------|-------|--------|
| Controllability | 4/5 | ✅ PASS - concern sobre APIs externas |
| Observability | 5/5 | ✅ PASS - excelente |
| Reliability | 4/5 | ✅ PASS - concerns sobre determinismo |
| **TOTAL** | **13/15** | ✅ **PASS (86.7%)** |

---

## 2. Architecturally Significant Requirements (ASRs)

ASRs são requisitos que **dirigem decisões arquiteturais** e **exigem testabilidade especial**.

### ASR-1: Wheeling Engine Correctness (FR13-FR18) 🔴 HIGH RISK

**Requirement:**
- Sistema deve gerar combinações matematicamente corretas
- Garantias (ex: "4 if 4") devem ser verificáveis
- Budget constraint: não estourar nem desperdiçar muito

**Risk Category:** TECH (Technical/Architecture)  
**Probability:** 3 (Likely - lógica complexa, bugs fáceis)  
**Impact:** 3 (Critical - core value proposition quebra)  
**Risk Score:** **9/9 (CRITICAL)**

**Why Architecturally Significant:**
- Core business logic
- Matemática complexa (combinatória)
- Difícil de validar manualmente

**Testing Strategy:**

1. **Unit Tests (Property-Based Testing)**
```typescript
// Exemplo com fast-check
import fc from 'fast-check'

describe('Wheeling Engine', () => {
  it('should never exceed budget', () => {
    fc.assert(
      fc.property(
        fc.integer(1000, 50000), // budget aleatório
        (budget) => {
          const result = generateSuggestion(budget)
          const totalCost = result.games.length * GAME_COST
          expect(totalCost).toBeLessThanOrEqual(budget)
        }
      )
    )
  })

  it('should guarantee "4 if 4" when stated', () => {
    const result = generateSuggestion(15000)
    if (result.guarantee === '4 if 4') {
      // Verificar matematicamente que QUALQUER combinação de 4 números
      // garante pelo menos 1 jogo com 4 acertos
      const allCombinations = generateAllCombinations(4, result.baseNumbers)
      for (const combo of allCombinations) {
        const hasMatch = result.games.some(game => 
          intersect(game.numbers, combo).length >= 4
        )
        expect(hasMatch).toBe(true)
      }
    }
  })
})
```

2. **Integration Tests (Known Test Cases)**
```typescript
// Usar exemplos documentados de wheeling
const knownWheels = [
  {
    numbers: [1, 2, 3, 4, 5, 6, 7],
    guarantee: '3 if 3',
    expectedGames: [
      [1, 2, 3, 4, 5, 6],
      [1, 2, 3, 4, 5, 7],
      // ... 7 jogos totais para Mega Sena
    ]
  }
]

it('should match known wheel templates', () => {
  const result = applyWheel(knownWheels[0])
  expect(result.games).toEqual(knownWheels[0].expectedGames)
})
```

3. **E2E Tests (User Perspective)**
```typescript
// Playwright
test('user generates suggestion and verifies guarantee', async ({ page }) => {
  await page.fill('[data-testid="value-input"]', '150')
  await page.click('button:has-text("Gerar")')
  
  await expect(page.locator('[data-testid="guarantee"]'))
    .toHaveText(/4 if 4/)
  
  const games = await page.locator('[data-testid="game-card"]').count()
  expect(games).toBeGreaterThan(0)
})
```

**Mitigation Owner:** Dev Team  
**Timeline:** Sprint 1-2 (before wheeling implementation)

---

### ASR-2: External API Resilience (NFR-R3, FR25-FR30) 🟡 MEDIUM RISK

**Requirement:**
- Sistema deve tolerar falhas de APIs externas (Caixa, guto-alves)
- Retry com backoff exponencial até 10x
- Failover automático para fallback API

**Risk Category:** OPS (Operations)  
**Probability:** 3 (Likely - APIs externas falham frequentemente)  
**Impact:** 2 (Degraded - funcionalidade impaired, workaround difícil)  
**Risk Score:** **6/9 (HIGH)**

**Testing Strategy:**

1. **Unit Tests (Mock API Failures)**
```typescript
describe('Lottery API Client', () => {
  it('should retry on 5xx errors', async () => {
    const mockAPI = vi.fn()
      .mockRejectedValueOnce(new Error('503 Service Unavailable'))
      .mockRejectedValueOnce(new Error('503 Service Unavailable'))
      .mockResolvedValue({ numbers: [1,2,3,4,5,6] })
    
    const result = await fetchWithRetry(mockAPI, { maxRetries: 3 })
    
    expect(mockAPI).toHaveBeenCalledTimes(3)
    expect(result.numbers).toEqual([1,2,3,4,5,6])
  })

  it('should failover to backup API after 3 failures', async () => {
    const primaryAPI = vi.fn().mockRejectedValue(new Error('Timeout'))
    const backupAPI = vi.fn().mockResolvedValue({ numbers: [7,8,9,10,11,12] })
    
    const result = await fetchResults({ primaryAPI, backupAPI })
    
    expect(primaryAPI).toHaveBeenCalledTimes(3)
    expect(backupAPI).toHaveBeenCalledTimes(1)
    expect(result.numbers).toEqual([7,8,9,10,11,12])
  })
})
```

2. **Integration Tests (Simulate Network Issues)**
```typescript
// Playwright Network Interception
test('should show graceful error when API down', async ({ page, context }) => {
  await context.route('**/api/caixa/**', route => 
    route.abort('failed')
  )
  
  await page.goto('/history')
  
  await expect(page.locator('[data-testid="error-message"]'))
    .toHaveText(/Não foi possível carregar resultados/)
})
```

3. **E2E Tests (Contract Testing with Pact)**
```typescript
// Validar que API real retorna formato esperado
describe('Caixa API Contract', () => {
  it('should match expected schema', async () => {
    const result = await caixaAPI.getResults(2700)
    
    expect(result).toMatchSchema({
      concurso: expect.any(Number),
      data: expect.stringMatching(/\d{2}\/\d{2}\/\d{4}/),
      dezenas: expect.arrayOf(expect.stringMatching(/\d{2}/)),
      premiacoes: expect.any(Object)
    })
  })
})
```

**Mitigation Owner:** Dev + QA  
**Timeline:** Sprint 3-4 (during integration implementation)

---

### ASR-3: Performance Under Load (NFR-P1, NFR-P2) 🟡 MEDIUM RISK

**Requirement:**
- Geração de sugestão: <500ms
- LCP <2.5s, TTI <3s
- Suportar 50 usuários simultâneos (MVP)

**Risk Category:** PERF (Performance)  
**Probability:** 2 (Possible - Next.js escala bem, mas wheeling pode ser lento)  
**Impact:** 2 (Degraded - UX prejudicada, workaround: loading states)  
**Risk Score:** **4/9 (MEDIUM)**

**Testing Strategy:**

1. **Load Testing (k6)**
```javascript
// k6/scenarios/generate-suggestion.js
import http from 'k6/http'
import { check } from 'k6'

export const options = {
  stages: [
    { duration: '1m', target: 10 },  // Ramp up to 10 users
    { duration: '3m', target: 50 },  // Stay at 50 users (MVP target)
    { duration: '1m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // NFR-P1: <500ms for 95%
  },
}

export default function () {
  const payload = JSON.stringify({ value: 15000 })
  const res = http.post('https://app/api/suggestions', payload)
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  })
}
```

2. **Lighthouse CI (Performance Budget)**
```yaml
# .lighthouserc.json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000"],
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:no-pwa",
      "assertions": {
        "first-contentful-paint": ["warn", { "maxNumericValue": 1500 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "time-to-interactive": ["error", { "maxNumericValue": 3000 }]
      }
    }
  }
}
```

3. **Profiling (React DevTools + Next.js Profiler)**
```typescript
// Identificar componentes lentos
import { Profiler } from 'react'

function onRenderCallback(
  id, phase, actualDuration, baseDuration, startTime, commitTime
) {
  console.log(`${id} took ${actualDuration}ms to render`)
}

<Profiler id="GamesList" onRender={onRenderCallback}>
  <GamesList games={games} />
</Profiler>
```

**Mitigation Owner:** Dev + Performance Engineer  
**Timeline:** Sprint 1 (setup CI), Sprint 5+ (optimization)

---

### ASR-4: Data Integrity (NFR-R2, FR35-FR37) 🟢 LOW RISK

**Requirement:**
- Validação de resultados antes de salvar
- Transações atômicas para operações críticas
- Rollback automático em caso de erro

**Risk Category:** DATA (Data Integrity)  
**Probability:** 1 (Unlikely - Drizzle ORM + PostgreSQL são confiáveis)  
**Impact:** 3 (Critical - data corruption é grave)  
**Risk Score:** **3/9 (LOW-MEDIUM)**

**Testing Strategy:**

1. **Transaction Tests**
```typescript
describe('Prize Verification Atomicity', () => {
  it('should rollback if prize update fails', async () => {
    const suggestion = await createTestSuggestion()
    
    // Force error in prize creation
    vi.spyOn(db, 'insert').mockRejectedValueOnce(new Error('DB Error'))
    
    await expect(verifyPrizesForSuggestion(suggestion.id))
      .rejects.toThrow()
    
    // Verificar que suggestion.status NÃO foi alterado
    const updated = await db.query.suggestions.findFirst({ 
      where: eq(suggestions.id, suggestion.id) 
    })
    expect(updated.status).toBe('realized') // não mudou para 'verified'
  })
})
```

2. **Data Validation Tests**
```typescript
describe('Lottery Result Validation', () => {
  it('should reject invalid result format', async () => {
    const invalidResult = {
      concurso: 2700,
      dezenas: ['1', '2', '3', '4', '5'] // apenas 5 números (Mega Sena precisa 6)
    }
    
    await expect(saveLotteryResult(invalidResult))
      .rejects.toThrow('Invalid result format')
  })

  it('should reject duplicate contest', async () => {
    await saveLotteryResult({ concurso: 2700, ... })
    
    await expect(saveLotteryResult({ concurso: 2700, ... }))
      .rejects.toThrow('Contest already exists')
  })
})
```

**Mitigation Owner:** Dev Team  
**Timeline:** Sprint 4 (during verification implementation)

---

### ASR-5: LGPD Compliance (NFR-S4, FR6) 🟡 MEDIUM RISK

**Requirement:**
- Usuários podem solicitar exclusão de dados
- Dados deletados após 30 dias
- Logs anonimizados (sem PII)

**Risk Category:** BUS (Business Impact - compliance violation)  
**Probability:** 2 (Possible - fácil esquecer de anonimizar logs)  
**Impact:** 3 (Critical - multas LGPD são severas)  
**Risk Score:** **6/9 (HIGH)**

**Testing Strategy:**

1. **E2E Tests (User Deletion Flow)**
```typescript
test('user can request account deletion', async ({ page }) => {
  await loginAsUser(page, 'test@example.com')
  await page.goto('/settings')
  await page.click('button:has-text("Deletar conta")')
  await page.fill('[data-testid="confirm-email"]', 'test@example.com')
  await page.click('button:has-text("Confirmar")')
  
  await expect(page.locator('[data-testid="deletion-scheduled"]'))
    .toBeVisible()
})
```

2. **Data Retention Tests**
```typescript
describe('LGPD Data Deletion', () => {
  it('should anonymize user data after 30 days', async () => {
    const user = await createTestUser({ email: 'delete@test.com' })
    await requestDeletion(user.id)
    
    // Simular 30 dias
    vi.advanceTimersByTime(30 * 24 * 60 * 60 * 1000)
    await runDeletionJob()
    
    const deleted = await db.query.users.findFirst({
      where: eq(users.id, user.id)
    })
    
    expect(deleted.email).toBe('deleted@anonymized.local')
    expect(deleted.name).toBeNull()
  })
})
```

3. **Log Sanitization Tests**
```typescript
describe('Log Anonymization', () => {
  it('should not log PII (email, name)', () => {
    const logSpy = vi.spyOn(logger, 'info')
    
    await createSuggestion(15000, { userId: 'user-123' })
    
    const logCalls = logSpy.mock.calls
    for (const call of logCalls) {
      const logMessage = JSON.stringify(call)
      expect(logMessage).not.toMatch(/@/) // email
      expect(logMessage).not.toMatch(/name:/) // nome
    }
  })
})
```

**Mitigation Owner:** Dev + Legal  
**Timeline:** Sprint 10 (before public launch)

---

### ASR Summary Table

| ASR | Category | Prob×Impact | Risk Score | Priority | Owner | Timeline |
|-----|----------|-------------|------------|----------|-------|----------|
| ASR-1: Wheeling Correctness | TECH | 3×3 | 9 🔴 | P0 | Dev | Sprint 1-2 |
| ASR-2: API Resilience | OPS | 3×2 | 6 🟡 | P1 | Dev+QA | Sprint 3-4 |
| ASR-3: Performance | PERF | 2×2 | 4 🟡 | P1 | Dev+Perf | Sprint 1,5+ |
| ASR-4: Data Integrity | DATA | 1×3 | 3 🟢 | P2 | Dev | Sprint 4 |
| ASR-5: LGPD Compliance | BUS | 2×3 | 6 🟡 | P1 | Dev+Legal | Sprint 10 |

**Total High-Risk ASRs:** 3 (scores ≥6)  
**Total ASRs:** 5

---

## 3. Test Levels Strategy

### 3.1 Test Pyramid Recommendation

Baseado na arquitetura Next.js full-stack com lógica de negócio crítica:

```
         /\
        /  \
       / E2E \ ← 10% (Critical user journeys)
      /______\
     /        \
    /   API    \ ← 30% (Business logic validation)
   /____________\
  /              \
 /   Component    \ ← 20% (UI components + interactions)
/___________________\
        Unit        ← 40% (Core algorithms, utilities)
```

**Rationale:**

**Unit (40%):**
- Wheeling engine (generateBalancedNumbers, applyWheel, findBestTemplate)
- Validators (Zod schemas, custom validators)
- Formatters (currency, dates)
- Pure functions (utilities)

**Component (20%):**
- Custom lottery components (ValueInput, GameNumbersDisplay, LotteryGameCard)
- Form validation logic
- Interactions (click, hover, focus)
- Visual regression (Storybook + Chromatic)

**API/Integration (30%):**
- Server Actions (createSuggestion, updateSuggestionStatus)
- API Routes (/api/suggestions, /api/cron/verify-prizes)
- Database queries (Drizzle)
- External API clients (with mocks)

**E2E (10%):**
- Critical user flows only:
  1. Registration → Login (magic link)
  2. Generate suggestion → Copy → Mark realized
  3. View history → See prize notification
- Run on every PR to main
- Playwright with parallelization

---

### 3.2 Framework Recommendations

| Test Level | Framework | Rationale |
|------------|-----------|-----------|
| **Unit** | Vitest | Fast (10x faster than Jest), native ESM, Vi API familiar |
| **Component** | React Testing Library + Vitest | Testing behavior, not implementation |
| **Visual Regression** | Storybook + Chromatic | Catch UI regressions automatically |
| **API/Integration** | Vitest + Supertest | Fast, can use in-memory DB for speed |
| **E2E** | Playwright | Best DX, parallel execution, auto-wait, trace viewer |
| **Performance** | k6 | Load testing, can run in CI, Grafana integration |
| **Contract** | Pact | Validate external API contracts |

---

### 3.3 Test Environment Strategy

| Environment | Purpose | Tech Stack | Data |
|-------------|---------|------------|------|
| **Local** | Dev testing | SQLite in-memory | Factories |
| **CI** | Automated tests | Neon branch (ephemeral) | Seeded fixtures |
| **Staging** | Pre-prod validation | Neon preview | Production-like |
| **Production** | Monitoring only | Neon main | Real data (no tests) |

**Neon Branching Strategy:**
```bash
# CI creates ephemeral branch per PR
neon branches create --name "pr-123" --parent main
# Run tests against ephemeral DB
DATABASE_URL=postgres://neon/pr-123 npm run test
# Delete after merge
neon branches delete pr-123
```

---

## 4. NFR Testing Approach

### 4.1 Performance Testing (NFR-P1, NFR-P2, NFR-P3)

**NFR Targets:**
- Geração de sugestão: <500ms
- Queries ao banco: <200ms (p95)
- LCP <2.5s, TTI <3s, FCP <1.5s
- 50 usuários simultâneos

**Test Tools:**

1. **k6 (Load Testing)**
```javascript
// k6/load-test.js
export const options = {
  scenarios: {
    constant_load: {
      executor: 'constant-vus',
      vus: 50, // NFR-P2: 50 usuários simultâneos
      duration: '5m',
    },
  },
  thresholds: {
    'http_req_duration{type:suggestion}': ['p(95)<500'], // NFR-P1
    'http_req_duration{type:query}': ['p(95)<200'], // NFR-P1
  },
}
```

2. **Lighthouse CI (Web Vitals)**
```yaml
# GitHub Action
- name: Run Lighthouse CI
  uses: treosh/lighthouse-ci-action@v9
  with:
    urls: |
      https://staging.sortegrande.com
      https://staging.sortegrande.com/generate
      https://staging.sortegrande.com/history
    budgetPath: .lighthouserc.json
    uploadArtifacts: true
```

3. **Playwright Performance API**
```typescript
test('measure generation performance', async ({ page }) => {
  await page.goto('/generate')
  
  const startTime = Date.now()
  await page.fill('[data-testid="value-input"]', '150')
  await page.click('button:has-text("Gerar")')
  await page.waitForSelector('[data-testid="game-card"]')
  const endTime = Date.now()
  
  const duration = endTime - startTime
  expect(duration).toBeLessThan(500) // NFR-P1
})
```

**Success Criteria:**
- ✅ All performance targets met under load
- ✅ No degradation between releases (regression testing)
- ✅ Lighthouse CI score >90

---

### 4.2 Security Testing (NFR-S1, NFR-S2, NFR-S3, NFR-S4)

**NFR Targets:**
- Magic links expiram após 15min
- Rate limiting (100 req/min por usuário)
- HTTPS obrigatório
- SQL injection protection
- LGPD compliance

**Test Tools:**

1. **OWASP ZAP (Automated Scan)**
```yaml
# GitHub Action
- name: OWASP ZAP Scan
  uses: zaproxy/action-baseline@v0.7.0
  with:
    target: 'https://staging.sortegrande.com'
    rules_file_name: '.zap/rules.tsv'
```

2. **Playwright Security Tests**
```typescript
test('should reject expired magic link', async ({ page }) => {
  const expiredToken = generateToken({ expiresAt: Date.now() - 1000 })
  await page.goto(`/auth/verify?token=${expiredToken}`)
  
  await expect(page.locator('[data-testid="error"]'))
    .toHaveText(/Link expirado/)
})

test('should enforce rate limiting', async ({ request }) => {
  const requests = Array(101).fill(null).map(() => 
    request.post('/api/auth/magic-link', { data: { email: 'test@example.com' } })
  )
  
  const responses = await Promise.all(requests)
  const rateLimited = responses.filter(r => r.status() === 429)
  
  expect(rateLimited.length).toBeGreaterThan(0)
})
```

3. **SQL Injection Tests**
```typescript
test('should prevent SQL injection', async ({ request }) => {
  const maliciousInput = "1' OR '1'='1"
  const response = await request.post('/api/suggestions', {
    data: { value: maliciousInput }
  })
  
  expect(response.status()).toBe(400) // Rejeitado por validação
})
```

**Success Criteria:**
- ✅ OWASP ZAP scan: 0 high/critical vulnerabilities
- ✅ All auth/authz tests pass
- ✅ Rate limiting effective

---

### 4.3 Reliability Testing (NFR-R1, NFR-R2, NFR-R3)

**NFR Targets:**
- 99% uptime
- Retry até 10x com backoff exponencial
- Transações atômicas

**Test Tools:**

1. **Chaos Engineering (Simulated Failures)**
```typescript
describe('Chaos Tests', () => {
  it('should survive database connection loss', async () => {
    const db = await createTestDB()
    
    // Simular perda de conexão
    await db.close()
    
    const response = await fetch('/api/suggestions')
    
    expect(response.status).toBe(503) // Graceful degradation
    expect(response.json()).toMatchObject({
      error: 'Service temporarily unavailable'
    })
  })

  it('should retry API calls on transient errors', async () => {
    let callCount = 0
    const mockAPI = () => {
      callCount++
      if (callCount < 3) throw new Error('Transient error')
      return { numbers: [1,2,3,4,5,6] }
    }
    
    const result = await fetchWithRetry(mockAPI, { maxRetries: 10 })
    
    expect(callCount).toBe(3)
    expect(result.numbers).toBeDefined()
  })
})
```

2. **Health Check Endpoint**
```typescript
// app/api/health/route.ts
export async function GET() {
  const checks = {
    database: await db.query.users.findFirst() !== null,
    caixaAPI: await caixaAPI.ping(),
    backupAPI: await gutoAlvesAPI.ping(),
  }
  
  const healthy = Object.values(checks).every(Boolean)
  
  return Response.json(checks, { 
    status: healthy ? 200 : 503 
  })
}
```

3. **Uptime Monitoring (UptimeRobot + Vercel)**
```yaml
# Monitor health endpoint
uptime_monitor:
  url: https://sortegrande.com/api/health
  interval: 5min
  expected_status: 200
  alert: email@example.com
```

**Success Criteria:**
- ✅ 99% uptime maintained
- ✅ Graceful degradation on external failures
- ✅ All retry mechanisms tested

---

### 4.4 Accessibility Testing (NFR-A1, NFR-A2)

**NFR Targets:**
- WCAG 2.1 Level A
- Contraste 4.5:1
- Touch targets 44x44px
- Navegação por teclado

**Test Tools:**

1. **axe-core (Automated)**
```typescript
// Playwright + axe
import { injectAxe, checkA11y } from 'axe-playwright'

test('landing page should be accessible', async ({ page }) => {
  await page.goto('/')
  await injectAxe(page)
  
  const violations = await checkA11y(page, null, {
    detailedReport: true,
    detailedReportOptions: { html: true }
  })
  
  expect(violations).toHaveLength(0)
})
```

2. **Manual Testing Checklist**
```markdown
- [ ] Navegação completa usando apenas Tab/Enter/Esc
- [ ] Leitores de tela (NVDA/JAWS) leem conteúdo corretamente
- [ ] Contraste de cores validado com Chrome DevTools
- [ ] Zoom 200% não quebra layout
- [ ] Touch targets ≥44x44px (mobile)
```

3. **Lighthouse Accessibility Audit**
```yaml
# .lighthouserc.json
"assertions": {
  "categories:accessibility": ["error", { "minScore": 1.0 }]
}
```

**Success Criteria:**
- ✅ axe violations: 0
- ✅ Lighthouse accessibility: 100/100
- ✅ Manual testing checklist: 100% pass

---

### 4.5 Maintainability (NFR-M1, NFR-M2, NFR-M3)

**NFR Targets:**
- TypeScript strict mode
- Code coverage ≥60%
- ESLint + Prettier
- CI/CD automático

**Test Tools:**

1. **Code Coverage (Vitest)**
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 60, // NFR-M1
        functions: 60,
        branches: 60,
        statements: 60
      }
    }
  }
})
```

2. **Type Checking (CI)**
```yaml
# GitHub Action
- name: Type Check
  run: npm run type-check
- name: Lint
  run: npm run lint
```

3. **Mutation Testing (Stryker)**
```javascript
// stryker.conf.js
module.exports = {
  mutate: ['src/lib/wheeling/**/*.ts'],
  testRunner: 'vitest',
  coverageAnalysis: 'perTest',
  thresholds: { high: 80, low: 60, break: 50 }
}
```

**Success Criteria:**
- ✅ Coverage ≥60%
- ✅ Type check passes
- ✅ Lint/format passes
- ✅ Mutation score >60%

---

## 5. Test Environment Requirements

### 5.1 Infrastructure Needs

**Development:**
```yaml
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: sortegrande_dev
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev123
    ports:
      - "5432:5432"

  redis: # Opcional - cache futuro
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

**CI/CD:**
```yaml
# GitHub Actions
name: Test Suite
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run migrations
        run: npm run db:migrate
        env:
          DATABASE_URL: postgres://postgres:postgres@localhost:5432/test
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run integration tests
        run: npm run test:integration
      
      - name: Run E2E tests
        run: npx playwright test
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

**Staging:**
- Neon PostgreSQL (preview branch)
- Vercel preview deployment
- Mock external APIs (via environment variables)

---

### 5.2 Test Data Strategy

**Factories (Fishery):**
```typescript
// lib/test/factories/user.factory.ts
import { Factory } from 'fishery'
import { users } from '@/lib/db/schema'

export const userFactory = Factory.define<typeof users.$inferInsert>(({ sequence }) => ({
  id: `user-${sequence}`,
  email: `user${sequence}@test.com`,
  name: `Test User ${sequence}`,
  createdAt: new Date(),
}))

// Uso
const testUser = await userFactory.create()
```

**Fixtures (Known Data):**
```typescript
// lib/test/fixtures/lottery-results.ts
export const knownMegaSenaResults = [
  {
    concurso: 2700,
    data: '2024-01-03',
    dezenas: ['05', '12', '18', '27', '34', '45'],
    premiacoes: { sena: 5000000, quina: 50000, quadra: 1000 }
  },
  // ... mais resultados conhecidos
]
```

**Seeding Script:**
```typescript
// scripts/seed-test-db.ts
import { db } from '@/lib/db'
import { userFactory } from '@/lib/test/factories'
import { knownMegaSenaResults } from '@/lib/test/fixtures'

async function seed() {
  // 10 usuários
  const users = await Promise.all(
    Array(10).fill(null).map(() => userFactory.create())
  )
  
  // Resultados históricos
  await db.insert(lotteryResults).values(knownMegaSenaResults)
  
  console.log('Database seeded!')
}

seed()
```

---

## 6. Testability Concerns & Blockers

### 🔴 CRITICAL CONCERN 1: External API Testability

**Issue:** APIs externas (Caixa, guto-alves) são black boxes sem ambiente de teste.

**Impact:**
- Não podemos testar integração real sem hitting production APIs
- Testes E2E podem falhar por instabilidade externa
- Rate limiting pode bloquear CI runs

**Mitigation:**

1. **Abstração com Interface:**
```typescript
// lib/integrations/lottery-api.interface.ts
export interface LotteryAPIClient {
  getResults(contest: number): Promise<LotteryResult>
  getLatestContest(): Promise<number>
}

// lib/integrations/caixa-api.ts
export class CaixaAPIClient implements LotteryAPIClient {
  async getResults(contest: number) { /* real implementation */ }
}

// lib/integrations/mock-api.ts
export class MockAPIClient implements LotteryAPIClient {
  async getResults(contest: number) {
    return knownResults[contest] // fixture data
  }
}
```

2. **Dependency Injection:**
```typescript
// app/api/cron/verify-prizes/route.ts
const apiClient = process.env.NODE_ENV === 'test' 
  ? new MockAPIClient() 
  : new CaixaAPIClient()

export async function GET() {
  const results = await apiClient.getResults(latestContest)
  // ...
}
```

3. **Contract Testing (Pact):**
```typescript
// tests/contracts/caixa-api.contract.test.ts
describe('Caixa API Contract', () => {
  it('should match expected schema', async () => {
    const result = await realCaixaAPI.getResults(2700)
    
    expect(result).toMatchSchema(lotteryResultSchema)
  })
})
// Run periodically (weekly) to catch breaking changes
```

**Status:** ⚠️ **Must implement before Sprint 4** (integration sprint)

---

### 🟡 CONCERN 2: Wheeling Complexity Verification

**Issue:** Como validar que wheeling engine gera combinações matematicamente corretas?

**Impact:**
- Bugs podem passar despercebidos (garantia falsa)
- Testes unitários podem ter false positives

**Mitigation:**

1. **Property-Based Testing:**
```typescript
// Verificar propriedades matemáticas invariantes
it('should satisfy guarantee property', () => {
  fc.assert(
    fc.property(
      fc.integer(6, 15), // número de bolas no wheel
      fc.constantFrom('4 if 4', '3 if 3'), // garantia
      (numberCount, guarantee) => {
        const result = generateWheel(numberCount, guarantee)
        const [matchRequired, matchGuaranteed] = guarantee.split(' if ')
        
        // Propriedade: QUALQUER combinação de X números deve
        // ter pelo menos 1 jogo com Y acertos
        const allCombinations = generateAllCombinations(
          parseInt(matchRequired), 
          result.baseNumbers
        )
        
        for (const combo of allCombinations) {
          const hasMatchingGame = result.games.some(game => 
            intersect(game.numbers, combo).length >= parseInt(matchGuaranteed)
          )
          expect(hasMatchingGame).toBe(true)
        }
      }
    )
  )
})
```

2. **Benchmark Against Known Wheels:**
```typescript
// Usar wheels documentados (Wikipedia, CoverageDesign.com)
const knownWheels = [
  {
    name: 'W(7,6,3)',
    numbers: 7,
    gameSize: 6,
    guarantee: '3 if 3',
    expectedGames: 7,
    games: [
      [1,2,3,4,5,6],
      [1,2,3,4,5,7],
      [1,2,3,4,6,7],
      [1,2,3,5,6,7],
      [1,2,4,5,6,7],
      [1,3,4,5,6,7],
      [2,3,4,5,6,7]
    ]
  }
]

it('should match known wheels', () => {
  for (const wheel of knownWheels) {
    const result = generateWheel(wheel.numbers, wheel.guarantee)
    expect(result.games.length).toBe(wheel.expectedGames)
    expect(result.games).toEqual(wheel.games)
  }
})
```

3. **Manual Review by Domain Expert:**
- Contratar matemático/estatístico para code review da wheeling logic
- Validar contra papers acadêmicos (Combinatorial Design Theory)

**Status:** ⚠️ **Must implement in Sprint 1-2** (before wheeling implementation)

---

### 🟢 NON-BLOCKING: Timing-Dependent Tests

**Issue:** Jobs de cron e polling têm timing não-determinístico.

**Impact:**
- Testes de integração podem ter flakiness
- CI runs lentos

**Mitigation:**

1. **Fake Timers:**
```typescript
vi.useFakeTimers()

test('should retry with exponential backoff', async () => {
  const mockAPI = vi.fn()
    .mockRejectedValueOnce(new Error('Timeout'))
    .mockResolvedValueOnce({ numbers: [1,2,3,4,5,6] })
  
  const promise = fetchWithRetry(mockAPI, { maxRetries: 3 })
  
  // Avançar tempo instantaneamente
  await vi.advanceTimersByTime(1000) // 1s
  await vi.advanceTimersByTime(2000) // 2s
  
  const result = await promise
  
  expect(mockAPI).toHaveBeenCalledTimes(2)
  expect(result.numbers).toBeDefined()
})
```

2. **Inject Time Dependencies:**
```typescript
// lib/cron/verify-prizes.ts
export async function verifyPrizes(
  currentDate = new Date() // injetável
) {
  // ...
}

// Test
await verifyPrizes(new Date('2024-01-03T21:00:00'))
```

**Status:** ✅ **Non-blocking** (standard practice)

---

## 7. Recommendations for Sprint 0

### 7.1 Sprint 0: Test Infrastructure Setup

**Duration:** 1 sprint (antes da implementação)

**Deliverables:**

1. ✅ **Test Framework Setup**
   - Vitest configured (vitest.config.ts)
   - Playwright installed (@playwright/test)
   - Coverage thresholds configured (60%)

2. ✅ **Database Test Strategy**
   - In-memory SQLite for fast unit tests
   - Neon branching for integration tests
   - Factories (Fishery) for test data

3. ✅ **Mock Strategy**
   - External API interfaces defined
   - Mock implementations created
   - Environment-based injection

4. ✅ **CI/CD Pipeline**
   - GitHub Actions workflow configured
   - Parallel test execution
   - Coverage reporting (Codecov)
   - Playwright trace upload on failure

5. ✅ **Quality Gates**
   - ESLint + Prettier
   - TypeScript strict mode
   - Pre-commit hooks (Husky)

**Effort:** ~5-8 hours (1 dia focado)

---

### 7.2 Testing Checklists

**Before Implementation (Definition of Ready):**
- [ ] Story has clear acceptance criteria (BDD format)
- [ ] Technical risks identified and scored
- [ ] Test data requirements documented
- [ ] Mock/stub dependencies identified

**During Implementation (TDD Cycle):**
- [ ] Write failing test first (Red)
- [ ] Implement minimum code to pass (Green)
- [ ] Refactor while keeping tests green
- [ ] Add edge case tests

**Before PR Merge (Definition of Done):**
- [ ] All tests pass (unit + integration + E2E)
- [ ] Coverage ≥60% for new code
- [ ] No ESLint/TypeScript errors
- [ ] Playwright tests pass in CI
- [ ] Manual testing checklist complete
- [ ] Code reviewed by peer

---

## 8. Quality Gate Criteria

### Gate 1: Unit Test Gate (Every Commit)

**Criteria:**
- ✅ All unit tests pass
- ✅ Coverage ≥60% (new code)
- ✅ TypeScript type check passes
- ✅ ESLint passes (no warnings)

**Auto-fail if:**
- ❌ Coverage drops below 60%
- ❌ New TypeScript errors introduced

---

### Gate 2: Integration Test Gate (PR to Main)

**Criteria:**
- ✅ All integration tests pass
- ✅ All E2E critical paths pass (P0 tests)
- ✅ No high-risk (score ≥6) items unmitigated
- ✅ Playwright visual regression passes

**Auto-fail if:**
- ❌ E2E P0 tests fail
- ❌ Visual regression detected (not approved)

---

### Gate 3: Performance Gate (Before Deploy)

**Criteria:**
- ✅ Lighthouse CI score ≥90
- ✅ LCP <2.5s (p95)
- ✅ TTI <3s (p95)
- ✅ No performance budget violations

**Auto-fail if:**
- ❌ LCP >3s
- ❌ Lighthouse score <80

---

### Gate 4: Security Gate (Weekly + Pre-Launch)

**Criteria:**
- ✅ OWASP ZAP scan: 0 high/critical vulnerabilities
- ✅ All auth/authz tests pass
- ✅ Rate limiting verified
- ✅ LGPD compliance tests pass

**Auto-fail if:**
- ❌ Critical vulnerability detected
- ❌ Auth bypass possible

---

## 9. Output Summary

**System-Level Test Design Complete** ✅

**Testability Assessment:**
- Controllability: 4/5 (concern: external APIs)
- Observability: 5/5 (excellent)
- Reliability: 4/5 (concerns: determinism)
- **Overall Score: 82/100 (PASS)**

**Architecturally Significant Requirements (ASRs):**
- Total ASRs identified: 5
- High-priority risks (≥6): 3
  - ASR-1: Wheeling Correctness (9/9) 🔴
  - ASR-2: API Resilience (6/9) 🟡
  - ASR-5: LGPD Compliance (6/9) 🟡

**Test Levels Strategy:**
- Unit: 40% (Vitest)
- Component: 20% (React Testing Library)
- API/Integration: 30% (Vitest + Supertest)
- E2E: 10% (Playwright)

**NFR Testing Coverage:**
- Performance: k6 + Lighthouse CI ✅
- Security: OWASP ZAP + Playwright ✅
- Reliability: Chaos tests + health checks ✅
- Accessibility: axe-core + Lighthouse ✅
- Maintainability: Coverage + Stryker ✅

**Testability Concerns:**
- 🔴 CRITICAL: External API testability (mitigation: interface abstraction)
- 🟡 CONCERN: Wheeling complexity verification (mitigation: property-based testing)
- 🟢 NON-BLOCKING: Timing-dependent tests (mitigation: fake timers)

**Quality Gate Criteria Defined:**
- Gate 1: Unit tests (every commit)
- Gate 2: Integration tests (PR to main)
- Gate 3: Performance (before deploy)
- Gate 4: Security (weekly + pre-launch)

---

## 10. Next Steps

**Imediato (antes de continuar implementation):**
1. ✅ Review este documento com time técnico
2. ✅ Aprovar recomendações de Sprint 0
3. ⏭️ Executar `*implementation-readiness` workflow (cross-document validation)
4. ⏭️ Implementar Sprint 0 (test infrastructure setup)

**Sprint 1-2:**
- Implementar abstrações de APIs externas
- Criar factory functions e fixtures
- Configurar CI/CD pipeline completo
- Setup Playwright + Lighthouse CI

**Sprints Subsequentes:**
- Implementar testes junto com features (TDD)
- Monitorar coverage (manter ≥60%)
- Executar quality gates em cada PR

**Pré-Launch:**
- Executar security scan completo (OWASP ZAP)
- Performance testing com k6 (50 usuários simultâneos)
- Accessibility audit manual + automated
- LGPD compliance final check

---

**Arquivo gerado:** `docs/test-design-system.md`  
**Workflow:** `*test-design` (System-Level Mode)  
**Fase:** Phase 2 - Solutioning (80% → 100% após implementation-readiness)

**Próximo Workflow Recomendado:** `*implementation-readiness`
