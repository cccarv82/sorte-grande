# Product Brief: Sorte Grande

**Date:** 2025-11-30  
**Author:** Carlos  
**Context:** Greenfield Web SaaS - MVP Phase

---

## Executive Summary

**Sorte Grande** é uma plataforma web SaaS que organiza apostas de loterias brasileiras (Mega Sena e Lotofácil) de forma inteligente usando **Wheeling Systems** - metodologia matematicamente comprovada de combinatória.

**Diferencial único:** Primeiro sistema brasileiro a usar Wheeling Systems de forma transparente, posicionado como "apostas inteligentes baseadas em matemática" ao invés de promessas falsas de "aumento de chances".

**Proposta de valor:** Otimiza investimento do usuário através de organização estratégica de apostas, garantindo prêmios menores sob condições específicas (ex: "4 if 4" - se 4 números saírem, garante quadra) enquanto mantém mesma chance de jackpot.

**Fase MVP:** 50 usuários gratuitos para validar UX/engagement. Foco em simplicidade extrema: usuário informa valor → sistema sugere jogos otimizados → usuário realiza na Loteria Online da Caixa → sistema verifica resultados automaticamente.

**Stack:** Next.js + Vercel + Neon PostgreSQL + shadcn/ui (TypeScript full stack)

**Visão pós-MVP:** Modelo freemium com tier premium (análises avançadas, valores ilimitados)

---

## Core Vision

### Problem Statement

**Apostadores de loterias brasileiras enfrentam três problemas principais:**

1. **Desperdício de investimento** - Fazem apostas aleatórias ou baseadas em superstições/crenças sem fundamento, sem otimizar cobertura vs custo

2. **Falta de organização** - Quando querem apostar com mais números (ex: 10 números ao invés de 6), não sabem como distribuir eficientemente em múltiplas apostas para maximizar cobertura

3. **Promessas enganosas** - Mercado cheio de "sistemas milagrosos" que prometem aumentar chances (matematicamente impossível), criando frustração e desconfiança

**Público mais afetado:** Apostadores regulares que investem R$50-200/mês, querem ser estratégicos mas não têm conhecimento de combinatória para otimizar sozinhos.

### Problem Impact

**Impacto individual:**
- Custo de oportunidade: investimento sem otimização
- Frustração: sensação de "jogar dinheiro fora" aleatoriamente  
- Desconfiança: queimados por sistemas fraudulentos

**Impacto no mercado:**
- Bilhões gastos anualmente em loterias sem estratégia
- Setor dominado por charlatanismo e promessas falsas
- Falta de soluções tecnológicas modernas e transparentes

### Why Existing Solutions Fall Short

**Pesquisa realizada (30/11/2025) revelou:**

1. **Sistemas comerciais (ex: Smart Luck):**
   - ✅ Usam Wheeling Systems válidos
   - ❌ Caros (software pago, livros)
   - ❌ Complexos (exigem conhecimento técnico)
   - ❌ Focados em mercado internacional (não otimizados para Brasil)

2. **Apps brasileiros de loteria:**
   - ✅ Convenientes para consultar resultados
   - ❌ Nenhum usa metodologias matematicamente válidas
   - ❌ Maioria usa "números quentes/frios" (Gambler's Fallacy - matematicamente inválido)
   - ❌ Promessas enganosas de "aumentar chances"

3. **Geradores aleatórios:**
   - ✅ Simples
   - ❌ Puramente aleatórios (nenhuma otimização)
   - ❌ Não organizam múltiplas apostas estrategicamente

**Gap crítico:** Nenhuma solução brasileira combina facilidade de uso + metodologia cientificamente válida + transparência total + experiência moderna.

### Proposed Solution

**Sorte Grande** aplica **Abbreviated Wheeling Systems** (única metodologia com documentação matemática sólida) de forma acessível e transparente para apostadores brasileiros.

**Como funciona:**

1. **Usuário informa valor disponível** (ex: R$100)
2. **Sistema seleciona wheel template otimizado** (ex: 10 números, 20 apostas, garantia "4 if 4")
3. **Sistema gera números base balanceados** (pares/ímpares, altos/baixos)
4. **Sistema aplica template de wheeling** → 20 combinações otimizadas de 6 números
5. **Usuário visualiza jogos formatados** (fácil copiar/screenshot)
6. **Usuário realiza apostas** na Loteria Online da Caixa (link direto)
7. **Sistema verifica resultados automaticamente** após sorteio
8. **Destaque especial se ganhou** (email + notificação visual)

**Garantia matemática exemplo:**
- Com 10 números no wheel "4 if 4" usando 20 apostas
- **SE** 4 dos seus 10 números forem sorteados
- **ENTÃO** pelo menos 1 das suas 20 apostas terá esses 4 números (ganha quadra)
- Custo: R$100 vs R$1.050 de cobrir todas combinações

**Transparência total:**
- Explicamos exatamente o que wheeling faz e NÃO faz
- Mostramos probabilidades reais (1 em 50 milhões para sena)
- Nunca prometemos "aumentar chances de jackpot"
- Posicionamento honesto: "organização inteligente, não milagres"

### Key Differentiators

1. **🎯 Único no Brasil a usar Wheeling Systems de forma transparente**
   - Metodologia com documentação científica (Combinatorial Design)
   - Referenciada em Wikipedia, estudos acadêmicos
   - Usada comercialmente há décadas no exterior

2. **🚫 Honestidade radical**
   - Não prometemos aumentar chances de jackpot
   - Comunicação clara sobre limitações matemáticas
   - Posicionamento: "apostas inteligentes" não "sistema milagroso"
   - Disclaimers visíveis e educacionais

3. **⚡ Simplicidade extrema**
   - Zero customização (confiança total no sistema)
   - Single Page Application ultra-rápida
   - Fluxo em 3 cliques: valor → visualizar → copiar números
   - Sem onboarding/tutorial necessário

4. **🔄 Loop de valor fechado**
   - Sugestão → Realização → Verificação automática → Celebração
   - Usuário não precisa verificar resultados manualmente
   - Destaque especial para premiações

5. **🏗️ Stack moderna e performática**
   - Next.js + Vercel = velocidade extrema
   - PWA = experiência mobile nativa
   - Neon PostgreSQL = banco gerenciado, zero ops
   - 100% TypeScript = confiabilidade

6. **🎮 Gamificação ética**
   - Badges por consistência, não volume de gastos
   - Mensagens de jogo responsável
   - Limites opcionais de investimento

---

## Target Users

### Primary Users

**Perfil: "Apostador Estratégico Regular"**

**Quem são:**
- Idade: 28-55 anos
- Ocupação: Profissionais CLT, autônomos, pequenos empresários
- Comportamento: Apostam regularmente (1-2x/semana), investem R$50-200/mês
- Mindset: Querem ser estratégicos mas não sabem como
- Frustração atual: "Sinto que jogo dinheiro fora de forma aleatória"
- Nível técnico: Usuários comuns de apps/internet (não experts)

**História típica:**
*"João, 38, analista de sistemas, aposta R$100/mês na Mega Sena há 5 anos. Sempre escolhe números aleatórios ou usa 'números da sorte' da família. Já tentou usar geradores online mas não confia. Viu apps que prometem 'aumentar chances' mas sabe que é furada. Quer uma forma mais inteligente de apostar mas não sabe por onde começar."*

**O que valorizam:**
- ✅ Confiabilidade e transparência (cansados de charlatanismo)
- ✅ Facilidade de uso (não querem aprender combinatória)
- ✅ Sensação de controle e estratégia
- ✅ Verificação automática de resultados
- ✅ Interface moderna e rápida

**O que NÃO querem:**
- ❌ Promessas milagrosas
- ❌ Complexidade técnica
- ❌ Múltiplas telas e configurações
- ❌ Ter que verificar resultados manualmente
- ❌ Sistemas que "parecem scam"

**Jornada atual (sem Sorte Grande):**
1. Pensa "vou apostar essa semana"
2. Escolhe números aleatoriamente ou usa "números da sorte"
3. Vai até lotérica ou acessa Loteria Online
4. Faz aposta simples (6 números, R$5)
5. Esquece de verificar resultado ou verifica manualmente dias depois
6. Nunca sabe se está jogando de forma inteligente

**Jornada ideal (com Sorte Grande):**
1. Acessa Sorte Grande no celular
2. Informa "tenho R$100 para apostar"
3. Sistema mostra 20 jogos otimizados instantaneamente
4. Copia números e cola na Loteria Online da Caixa
5. Marca "realizei" no Sorte Grande
6. Recebe email automático após sorteio: "Você ganhou quadra em 2 jogos! R$150"
7. Sente que está jogando de forma inteligente e estratégica

### Secondary Users

**Perfil: "Curioso Cético"**

**Quem são:**
- Apostadores ocasionais (apenas Mega da Virada ou sorteios especiais)
- Interessados em tecnologia/inovação
- Curiosos sobre metodologias matemáticas
- Querem entender "se funciona" antes de comprometer

**O que precisam:**
- Explicações claras sobre como wheeling funciona
- Transparência total sobre limitações
- Possibilidade de testar sem compromisso
- Dados e evidências (não promessas)

**Conversão para primary:**
- Após entenderem a lógica matemática
- Após verem resultados de prêmios menores (quadra, quina)
- Quando perceberem valor da organização vs aleatoriedade

---

## Success Metrics

### MVP Success Criteria (50 usuários, 3 meses)

**Métrica #1: Retenção (mais importante)**
- 🎯 **Target:** 60% dos usuários retornam após primeira sugestão
- **Por quê:** Indica que interface/experiência funciona e gera valor percebido
- **Como medir:** % de usuários que geram 2+ sugestões

**Métrica #2: Engagement**
- 🎯 **Target:** Usuários marcam 80%+ das sugestões como "realizadas"
- **Por quê:** Indica confiança no sistema (realmente usam as sugestões)
- **Como medir:** Ratio jogos marcados / jogos sugeridos

**Métrica #3: Satisfação**
- 🎯 **Target:** NPS > 40 ou feedback qualitativo 80%+ positivo
- **Por quê:** Valida proposta de valor e experiência
- **Como medir:** Pesquisa simples após 3-4 usos

**Métrica #4: Prêmios Menores (psicológico)**
- 🎯 **Target:** 70%+ dos usuários ganham pelo menos quadra em 10 jogos
- **Por quê:** Wheeling deve garantir prêmios menores, criando sensação de "funciona"
- **Como medir:** % usuários com pelo menos 1 premiação detectada
- **⚠️ IMPORTANTE:** Não mede eficácia vs aleatório (sample size insuficiente), apenas engajamento

**Métricas que NÃO vamos medir no MVP:**
- ❌ Taxa de acerto de sena (probabilidade muito baixa, precisaria anos)
- ❌ ROI financeiro (loterias têm expected value negativo por design)
- ❌ Eficácia estatística vs aleatório (requer milhares de apostas)

### Business Objectives (Pós-MVP)

**Fase 1 - Validação (Atual):**
- ✅ Provar que UX/proposta funciona
- ✅ Validar stack técnica
- ✅ Coletar feedback para iterar
- 💰 Custo coberto pelo fundador (~R$50-100/mês Vercel + Neon)

**Fase 2 - Monetização (Se validar):**
- 🎯 Converter 20% dos 50 para plano pago (~10 pagantes)
- 💰 Pricing: R$19,90/mês (tier único premium)
- 📈 Features premium: valores ilimitados, análises avançadas, múltiplos wheels
- 🎯 ARR Target: R$2.400/ano (prova de conceito de monetização)

**Fase 3 - Crescimento (Futuro):**
- 📈 Escalar para 500-1000 usuários
- 💰 Target: R$10-20k MRR
- 🚀 Marketing: SEO, redes sociais, programa de referral
- 🔧 Expansão: Outras loterias brasileiras, features avançadas

### Key Performance Indicators

**Durante MVP (métricas semanais):**

| KPI | Target | Medição |
|-----|---------|----------|
| Novos cadastros | 15-20/mês | Magic Link signups |
| Taxa de ativação | >80% | % que geram 1ª sugestão |
| Frequência de uso | 2-3x/mês | Média sugestões/usuário |
| Tempo para sugestão | <30s | Latência do fluxo |
| Verificações automáticas | 100% | Job success rate |
| Prêmios detectados | Variável | Count de premiações |
| Feedback respondido | >50% | Taxa de resposta |

**Pós-MVP (métricas mensais):**

| KPI | Target | Medição |
|-----|---------|----------|
| MAU | 500-1000 | Monthly active users |
| Conversion rate | 15-20% | Free → Paid |
| MRR | R$10-20k | Monthly recurring |
| Churn | <5% | Cancelamentos/mês |
| NPS | >50 | Net Promoter Score |
| CAC | <R$50 | Custo aquisição |
| LTV | >R$500 | Lifetime value |

---

## MVP Scope

### Core Features (Must-Have para lançamento)

**1. Autenticação Simples**
- Magic Link via email (sem senha)
- Limite hard-coded de 50 usuários
- Logout básico

**2. Engine de Sugestão (Coração do sistema)**
- Input: valor disponível em R$
- Seleção automática de wheel template (8, 10 ou 12 números)
- Geração de números base balanceados (pares/ímpares, altos/baixos)
- Aplicação de abbreviated wheeling template
- Output: Array de jogos (6 números cada) com garantia clara

**3. Visualização de Sugestões**
- Cards de jogos numerados e formatados
- Destaque da garantia matemática (ex: "4 if 4")
- Botão "Copiar todos os jogos"
- Link direto para Loteria Online da Caixa
- Botão "Marcar como realizado"

**4. Banco de Dados de Resultados**
- Schema PostgreSQL para resultados históricos
- Job de carga inicial (últimos 100 sorteios Mega Sena)
- Job de sincronização incremental (executar após sorteios)

**5. Verificação Automática de Prêmios**
- Job que roda após cada sorteio oficial
- Compara jogos marcados como "realizados" com resultado
- Detecta todas as faixas (sena, quina, quadra)
- Marca premiações no banco

**6. Dashboard de Histórico**
- Lista de sugestões anteriores
- Status: "aguardando sorteio" | "verificado - sem prêmio" | "🎉 GANHOU [faixa]"
- Destaque visual especial para premiações
- Filtros simples (por data, por status)

**7. Onboarding Zero**
- Landing page explica conceito em 10 segundos
- CTA: "Gerar minha primeira sugestão"
- Após login, direto para tela de sugestão
- Tooltips contextuais inline (não modals)

**8. PWA Básico**
- Manifest.json configurado
- Ícones responsive
- Experiência mobile-first
- Funciona offline (cache de última sugestão)

**9. Disclaimers e Compliance**
- Footer com disclaimers visíveis sobre probabilidades reais
- Seção "Como funciona?" explicando wheeling transparentemente
- Mensagens de jogo responsável
- LGPD: termos simples, opt-in notificações, direito de exclusão

### Out of Scope (MVP)

**Features explicitamente FORA do MVP:**

❌ **Múltiplas loterias:** Apenas Mega Sena no MVP (Lotofácil vem depois)  
❌ **Customização de números:** Usuário não escolhe números (confiança total no sistema)  
❌ **Análises avançadas:** Sem estatísticas, gráficos, hot/cold numbers  
❌ **Grupos/bolões:** Feature de compartilhamento fica para futuro  
❌ **Pagamento integrado:** MVP gratuito, sem Stripe/gateway  
❌ **App nativo:** Apenas PWA (iOS/Android nativos no futuro)  
❌ **Notificações push:** Apenas email no MVP  
❌ **Gamificação elaborada:** Sem badges, níveis, rankings no MVP  
❌ **Múltiplos valores simultâneos:** Usuário gera 1 sugestão por vez  
❌ **Histórico de "todas as loterias do Brasil":** Apenas últimos 100 sorteios  
❌ **Integração com Loteria Online:** Usuário copia números manualmente  
❌ **Verificação automática de bilhete:** Usuário marca manualmente "realizei"

### Success Criteria

**MVP considerado bem-sucedido SE:**

1. ✅ 50 usuários cadastrados e ativos em 2-3 meses
2. ✅ Taxa de retenção >60% (retornam após primeira sugestão)
3. ✅ Engagement >80% (marcam sugestões como realizadas)
4. ✅ NPS >40 ou feedback qualitativo 80%+ positivo
5. ✅ Sistema estável, sem bugs críticos
6. ✅ Verificação automática funcionando 100%
7. ✅ Pelo menos 1 caso de usuário ganhando quina ou melhor
8. ✅ Feedback claro sobre o que melhorar para versão paga

**Se critérios atingidos → Decisão de investir em versão Premium**

### Future Vision (Pós-MVP)

**Fase 2 - Premium (3-6 meses após MVP):**
- 💰 Modelo freemium: Free tier limitado + Premium R$19,90/mês
- 🎯 Free: 1 sugestão/mês, Mega Sena apenas
- 🎯 Premium: sugestões ilimitadas, Lotofácil, valores customizados, análises avançadas
- 🔧 Melhorias UX baseadas em feedback do MVP

**Fase 3 - Expansão (6-12 meses):**
- 📊 Análises avançadas (balanceamento, cobertura, simulações)
- 🎮 Gamificação ética (badges por consistência)
- 👥 Grupos/bolões (divisão de custos e prêmios)
- 🔔 Notificações push (sorteios, prêmios)
- 📱 Apps nativos iOS/Android

**Fase 4 - Escala (12+ meses):**
- 🌎 Outras loterias brasileiras (Quina, Dupla Sena, etc)
- 🤖 ML para otimização de templates (A/B testing de wheels)
- 🔗 Integração com Loteria Online (realização automática)
- 💳 Planos B2B para revendedores/lotéricas
- 📈 Programa de afiliados

---

## Context Dimensions

### Market Context

**Mercado de loterias no Brasil:**
- 📊 Mega Sena arrecada bilhões anualmente
- 🎯 Milhões de apostadores regulares
- 💰 Ticket médio: R$5-20 por aposta
- 📈 Crescimento constante, especialmente online pós-pandemia

**Mercado de software para loterias:**
- 🌍 Internacional: Smart Luck, Lotto Logic (caros, complexos)
- 🇧🇷 Brasil: Apps de consulta de resultados (não otimizam apostas)
- 🚫 Gap: Nenhum sistema brasileiro usa wheeling transparentemente
- 🎯 Oportunidade: Primeiro mover em wheeling honesto + UX moderna

**Competição:**
- **Diretos:** Nenhum (não existe wheeling brasileiro transparente)
- **Indiretos:** Apps de consulta (Loterias Caixa oficial, etc), geradores aleatórios
- **Substitutos:** Escolher números manualmente, "números da sorte"

**Barreiras de entrada:**
- ✅ Técnica: Baixa (wheeling é matemática pública)
- ✅ Desenvolvimento: Média (stack moderna mas não rocket science)
- ⚠️ Confiança: Alta (setor cheio de scams, precisa construir credibilidade)
- ⚠️ Marketing: Média (educação de mercado necessária)

**Riscos competitivos:**
- Caixa lançar wheeling oficial (baixa probabilidade)
- Grandes apps de loteria copiarem (possível após tração)
- Regulação mudar (risco baixo, wheeling é legal)

### Financial Considerations

**Modelo de negócio:**

**Fase MVP (atual):**
- 💰 **Receita:** R$0 (100% gratuito)
- 💸 **Custos:** R$50-100/mês (Vercel Hobby + Neon Free Tier)
- 🎯 **Objetivo:** Validação, não monetização
- 👤 **Financiamento:** Bootstrap do fundador

**Fase Premium (pós-validação):**
- 💰 **Pricing:** R$19,90/mês (tier único)
- 🎯 **Target:** 20% conversão (10 de 50 = R$200/mês)
- 💸 **Custos estimados:** R$200-300/mês (Vercel Pro + Neon escala)
- 📊 **Break-even:** ~15 assinantes

**Fase Crescimento (6-12 meses):**
- 💰 **Pricing:** Freemium com 2-3 tiers
  - Free: 1 sugestão/mês, Mega Sena
  - Plus: R$19,90/mês - ilimitado, 2 loterias
  - Premium: R$39,90/mês - tudo + análises avançadas
- 🎯 **Target:** 500-1000 usuários, 15-20% conversão
- 💰 **ARR Target:** R$50-120k
- 💸 **Custos:** R$500-1000/mês (infra + marketing)

**Investimento necessário:**
- MVP: R$0 (tempo do fundador)
- Marketing inicial: R$2-5k (Facebook Ads, Google Ads teste)
- Desenvolvimento pós-MVP: R$0 (fundador técnico) ou R$10-20k (contratar dev)

**Expectativa realista:**
- 🚨 Loterias são "vício difícil" - pode não monetizar bem
- 🎯 Se validar, potencial de R$10-30k MRR em 12-18 meses
- 🎲 Risco alto, mas investimento baixo (bootstrap friendly)

### Technical Preferences

**Stack definitiva:**

**Frontend:**
- ⚡ Next.js 14+ (App Router)
- 🎨 shadcn/ui + Tailwind CSS
- 📱 PWA (Service Workers, Manifest)
- 🔤 TypeScript 100%
- 🎯 Mobile-first design

**Backend:**
- 🖥️ Next.js API Routes (Node.js puro, sem Python)
- 🔗 tRPC ou REST simples
- ✉️ Resend para emails (Magic Link + notificações)
- ⏰ Vercel Cron Jobs para verificação de resultados

**Database:**
- 🗄️ Neon PostgreSQL (serverless, Vercel integrado)
- 🔧 Drizzle ORM ou Prisma
- 📦 Migrations versionadas

**Infra:**
- ☁️ Vercel (deploy, hosting, CDN, cron)
- 🔐 Vercel Auth ou NextAuth.js (Magic Link)
- 📊 Vercel Analytics
- 🐛 Sentry para error tracking

**APIs externas:**
- 🎰 API oficial da Caixa (resultados)
- 🔄 Fallback: github.com/guto-alves/loterias-api
- 🏗️ Abstração para fácil troca

**Wheeling Implementation:**
- 📐 Bibliotecas: Pure TypeScript (sem dependências pesadas)
- 🗂️ Templates: JSON estático no código (8, 10, 12 números)
- 🧮 Algoritmo: Abbreviated Wheel Generation (baseado em research)
- ✅ Testes unitários para garantir propriedades matemáticas

**DevOps:**
- 🚀 CI/CD: Vercel automático no push
- 🧪 Testes: Vitest + Testing Library
- 📝 Linting: ESLint + Prettier
- 🔒 Secrets: Vercel Environment Variables

**Referências técnicas:**
- Pagination: github.com/cccarv82/milhoes-desktop
- Wheeling math: Wikipedia Combinatorial Design
- Templates: Smart Luck (referência, não código)

### Organizational Context

**Time:**
- 👤 Carlos (fundador/dev/product)
- 🎯 Solo até validar MVP
- 🚀 Contratar após monetizar (se necessário)

**Processo:**
- 📋 BMad Method para planejamento
- 🔄 Desenvolvimento iterativo (MVPs semanais)
- 💬 Feedback direto com usuários (DM, email)
- 📊 Data-driven decisions (métricas claras)

**Capacidade:**
- ⏰ Part-time inicialmente (~10-15h/semana)
- 🎯 Full-time se validar tração
- 💪 Skill: Full-stack web, experiência com Next.js

**Timeline realista:**
- Sprint 0 (planejamento): 1 semana ✅
- Sprint 1-2 (MVP core): 2-3 semanas
- Sprint 3 (polish + testes): 1 semana
- Beta privada: 1-2 meses validação
- 🎯 Total até validação: 2-3 meses

### Risks & Assumptions

**Riscos técnicos:**

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| API Caixa instável | Média | Alto | Fallback guto-alves + retry logic |
| Wheeling incorreto | Baixa | Crítico | Testes unitários matemáticos + validação manual |
| Performance com muitos jogos | Baixa | Médio | Computação server-side + cache |
| Neon free tier limites | Média | Médio | Monitorar uso, migrar para pago se necessário |

**Riscos de produto:**

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Usuários não entendem wheeling | Alta | Crítico | Explicações ultra-simples + tooltips + FAQ |
| Não confiam no sistema | Alta | Crítico | Transparência total + disclaimers + educação |
| Não voltam após 1º uso | Média | Alto | Email após sorteio + UX memorável |
| Não marcam "realizei" | Média | Médio | Gamificação leve + reminder |

**Riscos de mercado:**

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Mercado pequeno demais | Média | Alto | Validar cedo com MVP, pivotar se necessário |
| Não pagam após gratuito | Alta | Alto | Criar features premium desejáveis |
| Regulação muda | Baixa | Crítico | Monitorar Caixa, wheeling é legal hoje |
| Caixa bloqueia scraping | Baixa | Médio | API oficial + relação institucional |

**Assumptions críticas:**

1. ✅ **Wheeling provê valor real** (validado por research - sim, otimiza cobertura)
2. ❓ **Usuários valorizam organização vs aleatoriedade** (PRECISA VALIDAR no MVP)
3. ❓ **50 usuários são alcançáveis organicamente** (friends & family + redes)
4. ❓ **Taxa de retenção >60% é viável** (benchmark de apps de loteria desconhecido)
5. ❓ **Pagariam R$19,90/mês após gratuito** (HIPÓTESE, precisa validar)
6. ✅ **Stack escolhida suporta escala** (Next.js + Vercel comprovados)
7. ✅ **API Caixa é acessível** (confirmado em research, github.com/guto-alves funciona)
8. ❓ **Marketing boca-a-boca funciona** (produto precisa ser "wow" para viralizar)

**Validações necessárias:**
1. 🎯 Assumption #2: Observar se usuários voltam e engajam
2. 🎯 Assumption #4: Medir retenção real vs target 60%
3. 🎯 Assumption #5: Perguntar explicitamente "pagaria?" antes de desenvolver premium
4. 🎯 Assumption #8: Trackear origem de cadastros

---

## Supporting Materials

**Documentos relacionados:**
- 📋 [BMad Brainstorming Session](./bmm-brainstorming-session-2025-11-30.md) - 60+ ideias geradas, top 3 prioridades
- 🔬 [Research: Lottery Methodologies](./research-lottery-methodologies-2025-11-30.md) - Deep dive em Wheeling Systems
- 📊 [Workflow Status](../bmm-workflow-status.yaml) - Tracking de progresso do BMad Method

**Referências externas:**
- 🌐 [Wikipedia: Lottery Mathematics](https://en.wikipedia.org/wiki/Lottery_mathematics)
- 🎰 [API Guto Alves](https://github.com/guto-alves/loterias-api)
- 💾 [Milhões Desktop](https://github.com/cccarv82/milhoes-desktop) - referência de paginação
- 🏛️ [Loteria Online Caixa](https://loterias.caixa.gov.br/)
- 📚 Smart Luck (referência comercial internacional)

**Próximos passos:**
1. ✅ Product Brief completo (este documento)
2. 🔜 PRD - Product Requirements Document (comando: `*prd`)
3. 🔜 UX Design - Wireframes e user flows (comando: `*create-design`)
4. 🔜 Architecture Design - Decisões técnicas detalhadas (comando: `*create-architecture`)
5. 🔜 Sprint Planning - Quebra em tarefas executáveis

---

**Document Status:** ✅ Complete  
**Last Updated:** 2025-11-30  
**Next Review:** Após MVP launch (feedback incorporation)