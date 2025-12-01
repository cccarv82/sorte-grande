# Sorte Grande - Product Requirements Document

**Author:** Carlos
**Date:** 2025-11-30
**Version:** 1.0

---

## Executive Summary

**Sorte Grande** é a primeira plataforma brasileira a aplicar **Wheeling Systems** (metodologia matematicamente validada) para otimizar apostas em loterias de forma transparente e honesta.

**Visão do Produto:** Sistema web SaaS que organiza apostas de Mega Sena e Lotofácil de forma inteligente, garantindo prêmios menores sob condições matemáticas específicas (ex: "4 if 4") enquanto mantém as mesmas chances de jackpot que qualquer outra aposta.

**MVP:** 50 usuários gratuitos (friends & family) para validar UX, engagement e proposta de valor antes de monetizar.

**Stack:** Next.js + Vercel + Neon PostgreSQL + shadcn/ui (TypeScript full-stack)

### What Makes This Special

**Honestidade Radical + Metodologia Científica**

Este é o primeiro sistema brasileiro que:
- ✅ Usa metodologia matematicamente documentada (Wheeling Systems - Wikipedia, Combinatorial Design)
- ✅ NÃO promete "aumentar chances de jackpot" (matematicamente impossível)
- ✅ Posiciona como "organização inteligente" não "sistema milagroso"
- ✅ Transparência total sobre probabilidades reais e limitações
- ✅ Simplicidade extrema - zero customização, confiança total no sistema
- ✅ Loop de valor fechado: Sugestão → Realização → Verificação automática → Celebração

---

## Project Classification

**Technical Type:** Web App (SaaS, PWA)
**Domain:** General (Entertainment/Gaming - Loterias regulamentadas)
**Complexity:** Low-Medium

**Contexto do Projeto:**
- **Tipo:** Greenfield Web SaaS MVP
- **Fase:** Discovery completa (brainstorming + research + product brief) → Planning (PRD atual)
- **Track:** BMad Method - method-greenfield
- **Documentos de entrada:**
  - Product Brief: `docs/product-brief-sorte-grande-2025-11-30.md`
  - Research: `docs/research-lottery-methodologies-2025-11-30.md`
  - Brainstorming: `docs/bmm-brainstorming-session-2025-11-30.md`

**Descoberta chave da Research:**
Wheeling Systems é a ÚNICA metodologia com documentação matemática sólida (Wikipedia, Combinatorial Design). Outras metodologias populares (Delta System, Hot/Cold Numbers) não têm base científica ou páginas inexistentes (404).

**Verdade matemática fundamental:**
Loterias são eventos aleatórios independentes. Nenhuma metodologia pode alterar probabilidades reais de jackpot. Wheeling Systems NÃO aumenta chance de sena, mas ORGANIZA apostas para garantir prêmios menores sob condições matemáticas (ex: "4 if 4" = se 4 números saírem, garante quadra).

---

## Success Criteria

### MVP Success (50 usuários, 2-3 meses)

**Objetivo:** Validar UX/engagement e proposta de valor, NÃO eficácia estatística das metodologias (sample size insuficiente para loterias).

**Métricas Primárias:**

1. **Retenção (mais crítica)**
   - Target: 60% dos usuários retornam após primeira sugestão
   - Medição: % usuários que geram 2+ sugestões
   - Por quê: Indica que interface/experiência funciona

2. **Engagement**
   - Target: Usuários marcam 80%+ das sugestões como "realizadas"
   - Medição: Ratio jogos marcados / jogos sugeridos
   - Por quê: Indica confiança no sistema (realmente usam)

3. **Satisfação**
   - Target: NPS > 40 ou feedback qualitativo 80%+ positivo
   - Medição: Pesquisa simples após 3-4 usos
   - Por quê: Valida proposta de valor

4. **Prêmios Menores (psicológico)**
   - Target: 70%+ dos usuários ganham pelo menos quadra em 10 jogos
   - Medição: % usuários com ≥1 premiação detectada
   - Por quê: Wheeling deve garantir prêmios menores, criando sensação de "funciona"
   - ⚠️ Não mede eficácia vs aleatório (sample insuficiente)

**Métricas que NÃO vamos medir:**
- ❌ Taxa de acerto de sena (probabilidade 1 em 50 milhões)
- ❌ ROI financeiro (loterias têm expected value negativo por design)
- ❌ Eficácia estatística vs aleatório (requer milhares de apostas)

### Business Metrics

**Fase MVP (atual):**
- 💰 Receita: R$0 (100% gratuito)
- 💸 Custo: R$50-100/mês (Vercel Hobby + Neon Free Tier)
- 🎯 Objetivo: Validação apenas, não monetização
- 👥 Recrutamento: Friends & family do fundador

**Fase Monetização (pós-validação):**
- 💰 Pricing: R$19,90/mês (tier único premium)
- 🎯 Conversão: 20% dos 50 → ~10 pagantes
- 📊 ARR Target: R$2.400/ano (prova de conceito)
- 📈 Features premium: valores ilimitados, análises avançadas, múltiplos wheels

---

## Product Scope

### MVP - Minimum Viable Product

**Core Features (Must-Have):**

1. **Autenticação Simples**
   - Magic Link via email (sem senha)
   - Hard limit de 50 usuários
   - Logout básico

2. **Engine de Sugestão Inteligente** (Coração do sistema)
   - Input: valor disponível em R$
   - Sistema decide automaticamente:
     - Qual loteria (Mega Sena, Lotofácil ou ambos)
     - Quantos números no wheel (baseado em budget + regras da loteria)
   - Regras da loteria devem estar atualizadas no sistema:
     - Mega Sena: 6-15 números, range 1-60, valor por aposta
     - Lotofácil: 15-20 números, range 1-25, valor por aposta
   - Seleção de wheel template otimizado (abbreviated wheeling)
   - Geração de números base balanceados (pares/ímpares, altos/baixos)
   - Output: Array de jogos com garantia matemática clara
   - **Constraint crítico:** NÃO estourar budget nem usar muito menos

3. **Visualização de Sugestões**
   - Cards de jogos numerados e formatados
   - Destaque da garantia matemática (ex: "4 if 4")
   - Botão "Copiar todos os jogos" (texto formatado)
   - Link direto para Loteria Online da Caixa
   - Botão "Marcar como realizado"

4. **Banco de Dados de Resultados**
   - Schema PostgreSQL para resultados históricos
   - Job de carga inicial (últimos 100+ sorteios)
   - Job de sincronização incremental (após sorteios)
   - Abstração de API (oficial Caixa + fallback guto-alves)

5. **Verificação Automática de Prêmios**
   - Job que roda após cada sorteio oficial
   - **Polling com retry:** API pode demorar para disponibilizar resultado
     - Chamar API periodicamente (ex: a cada 5-10min)
     - Retry até resultado estar disponível
     - Timeout após X tentativas
   - Compara APENAS jogos marcados como "realizados"
   - Se nenhum jogo marcado → nada para verificar
   - Detecta todas as faixas (sena, quina, quadra)
   - Marca premiações no banco

6. **Dashboard de Histórico**
   - Lista de sugestões anteriores
   - Status: "aguardando sorteio" | "aguardando resultado da API" | "verificado - sem prêmio" | "🎉 GANHOU [faixa]"
   - Destaque visual especial para premiações
   - Filtros simples (por data, por status)

7. **PWA Básico**
   - Manifest.json configurado
   - Ícones responsive
   - Experiência mobile-first
   - Funciona offline (cache de última sugestão)

8. **Disclaimers e Compliance**
   - Footer com disclaimers sobre probabilidades reais
   - Seção "Como funciona?" explicando wheeling transparentemente
   - Mensagens de jogo responsável
   - LGPD: termos simples, opt-in notificações, direito de exclusão

9. **Email de Notificação**
   - Envio automático após verificação de resultados
   - Destaque especial se houver premiação

### Growth Features (Post-MVP)

**Fase 2 - Após validação:**
- Kit Mega da Virada (pacote especial para concursos especiais)
- Expansão para outras loterias (Quina, Dupla Sena, Timemania)
- Dashboard interativo avançado (gráficos explicando escolhas)
- Análises premium (insights profundos)
- Gamificação expandida (badges, streaks, comparação anônima)

**Fase 3 - Crescimento:**
- Programa de referral (indicações premiadas)
- Notificações push (além de email)
- Múltiplas estratégias (perfil conservador/agressivo)
- Google One Tap (onboarding 1 clique)

### Vision (Future)

**Moonshots (longo prazo):**
- IA Adaptativa (aprende com resultados e ajusta metodologia)
- Robo-Advisor de loterias (consultoria automática)
- Consórcio de apostas / bolões inteligentes
- Expansão internacional (outras loterias)
- API pública (licenciar engine)

---

{{#if domain_considerations}}

## Domain-Specific Requirements

{{domain_considerations}}

This section shapes all functional and non-functional requirements below.
{{/if}}

---

## Web App Specific Requirements

### Browser & Platform Support

**Browsers suportados (MVP):**
- Chrome/Edge (últimas 2 versões) - Desktop e Mobile
- Safari (últimas 2 versões) - Desktop e Mobile iOS
- Firefox (últimas 2 versões) - Desktop

**Plataformas mobile:**
- iOS 14+ (Safari)
- Android 10+ (Chrome)

**PWA Requirements:**
- Manifest.json com ícones 192x192 e 512x512
- Service Worker para cache offline
- Instalável na home screen (iOS e Android)
- Funciona offline: cache última sugestão gerada

### Responsive Design

**Mobile-first approach:**
- Interface otimizada para mobile (tela primária)
- Desktop é adaptação do mobile (não separado)
- Breakpoints: mobile (<768px), tablet (768-1024px), desktop (>1024px)

**Touch-friendly:**
- Botões com tamanho mínimo 44x44px
- Espaçamento adequado entre elementos clicáveis
- Gestos nativos (scroll, tap)

### Performance Targets

**Loading:**
- First Contentful Paint (FCP): <1.5s
- Time to Interactive (TTI): <3s
- Largest Contentful Paint (LCP): <2.5s

**Runtime:**
- Geração de sugestão: <500ms (client-side após receber template)
- API calls: <2s (com loading state)
- Navegação entre views: instantânea (SPA)

**Otimizações:**
- Next.js SSR para landing page
- Client-side rendering para dashboard
- Code splitting por rota
- Lazy loading de componentes pesados

### SEO Strategy (MVP mínimo)

**Básico necessário:**
- Meta tags (title, description, og:image)
- Sitemap.xml
- Robots.txt
- Structured data para landing page

**Fora do MVP:**
- Blog/content marketing
- Link building
- SEO avançado (após validação)

### Accessibility Level

**WCAG 2.1 Level A (mínimo para MVP):**
- Contraste de cores adequado (4.5:1 para texto)
- Alt text em imagens importantes
- Navegação por teclado funcional
- Labels em form inputs

**Não prioritário no MVP:**
- WCAG AA ou AAA completo
- Screen reader optimization avançada
- Múltiplos idiomas

---

## User Experience Principles

### Design Philosophy

**Simplicidade Extrema:**
- Zero onboarding/tutorial necessário
- Interface autoexplicativa
- Single Page Application ultra-rápida
- Cada tela tem 1 objetivo claro

**Confiança Total no Sistema:**
- Usuário NÃO escolhe números (sistema decide tudo)
- Sem customização manual
- Posicionamento: "Confie na matemática"

**Transparência Radical:**
- Explicações claras sobre o que wheeling faz e NÃO faz
- Probabilidades reais sempre visíveis
- Disclaimers educacionais, não escondidos
- Como funciona acessível em 1 clique

**Gamificação Ética:**
- Badges por consistência e inteligência, NÃO volume de gastos
- Mensagens de jogo responsável sempre presentes
- Limites opcionais de investimento

### Key Interactions

**Fluxo Principal (3 passos):**
1. **Input de valor** → Campo numérico simples "Quanto você quer investir?"
2. **Visualizar sugestões** → Cards de jogos com números formatados + garantia
3. **Copiar/Marcar** → Botão copy-to-clipboard + link Caixa + checkbox "Realizei"

**Momento Mágico (Premiação):**
- Destaque visual especial para jogos premiados
- Animação celebratória (confetti ou similar)
- Email automático com resultado
- Badge de conquista

**Estados de Loading:**
- Skeleton screens (não spinners genéricos)
- Loading states específicos ("Gerando combinações otimizadas...")
- Progress indicator para operações longas (carga inicial de dados)

**Feedback Imediato:**
- Toast notifications para ações (copiado, marcado)
- Validação inline em forms
- Erros contextuais (não alerts genéricos)

---

## Functional Requirements

### FR Group 1: User Account & Authentication

**FR1:** Usuários podem criar conta fornecendo apenas email  
**FR2:** Usuários recebem magic link por email para autenticar (sem senha)  
**FR3:** Usuários podem fazer login via magic link  
**FR4:** Usuários podem fazer logout  
**FR5:** Sistema limita cadastro a máximo 50 usuários (hard limit no MVP)  
**FR6:** Usuários podem visualizar e editar informações básicas de perfil (nome, email)

### FR Group 2: Lottery Configuration Management

**FR7:** Sistema mantém configurações atualizadas de cada loteria (Mega Sena, Lotofácil)  
**FR8:** Configurações incluem: range de números permitidos, quantidade min/max de números por aposta, valor por aposta  
**FR9:** Sistema valida apostas geradas contra regras da loteria correspondente  
**FR10:** Administrador pode atualizar configurações de loterias via interface admin

### FR Group 3: Suggestion Generation (Core)

**FR11:** Usuários podem informar valor disponível para investir (em R$)  
**FR12:** Sistema decide automaticamente qual loteria usar (Mega Sena, Lotofácil ou ambos) baseado no valor  
**FR13:** Sistema decide automaticamente quantos números incluir no wheel baseado em:
- Valor disponível (budget constraint)
- Regras da loteria selecionada
- Templates de wheeling disponíveis  

**FR14:** Sistema seleciona template de abbreviated wheeling otimizado  
**FR15:** Sistema gera números base balanceados (distribuição pares/ímpares, altos/baixos)  
**FR16:** Sistema aplica wheeling template aos números base  
**FR17:** Sistema gera array de jogos (combinações) que respeitam:
- Quantidade de números permitida pela loteria
- Valor total não excede budget informado
- Valor total usa máximo possível do budget (não desperdiça muito)  

**FR18:** Sistema calcula e exibe garantia matemática do wheel (ex: "4 if 4")  
**FR19:** Sistema salva sugestão gerada associada ao usuário  
**FR20:** Usuários podem visualizar sugestões geradas em formato legível (cards de jogos)  
**FR21:** Usuários podem copiar todos os jogos da sugestão (texto formatado para clipboard)  
**FR22:** Usuários podem acessar link direto para Loteria Online da Caixa  
**FR23:** Usuários podem marcar sugestão como "realizada"  
**FR24:** Usuários podem desmarcar sugestão como "não realizada"

### FR Group 4: Historical Results Management

**FR25:** Sistema importa resultados históricos de loterias via API externa  
**FR26:** Sistema armazena resultados em banco de dados local (PostgreSQL)  
**FR27:** Sistema sincroniza novos resultados após cada sorteio oficial  
**FR28:** Sistema possui abstração de fonte de dados (troca fácil entre API oficial Caixa e fallback guto-alves)  
**FR29:** Sistema implementa cache para evitar chamadas excessivas a APIs externas  
**FR30:** Sistema mantém histórico de pelo menos 100 sorteios por loteria

### FR Group 5: Automatic Prize Verification

**FR31:** Sistema executa job automático após horário de cada sorteio oficial  
**FR32:** Sistema faz polling na API de resultados com retry (a cada 5-10min até resultado disponível)  
**FR33:** Sistema compara APENAS jogos marcados como "realizados" com resultado oficial  
**FR34:** Sistema detecta todas as faixas de premiação (sena, quina, quadra, terno para Lotofácil)  
**FR35:** Sistema marca premiações detectadas no banco de dados  
**FR36:** Sistema registra data/hora da verificação  
**FR37:** Sistema atualiza status da sugestão: "aguardando sorteio" → "aguardando resultado API" → "verificado - sem prêmio" | "premiado - [faixa]"

### FR Group 6: User Dashboard & History

**FR38:** Usuários podem visualizar lista de todas as sugestões geradas  
**FR39:** Usuários podem filtrar sugestões por data  
**FR40:** Usuários podem filtrar sugestões por status (aguardando, verificado, premiado)  
**FR41:** Usuários visualizam destaque visual especial para sugestões premiadas não visualizadas  
**FR42:** Usuários podem marcar sugestões premiadas como "visualizadas"  
**FR43:** Usuários podem visualizar estatísticas pessoais:
- Total investido (soma de sugestões marcadas como realizadas)
- Total de sugestões geradas
- Total de prêmios ganhos (por faixa)
- Taxa de premiação (% sugestões com prêmio)

### FR Group 7: Notifications

**FR44:** Sistema envia email automático após verificação de resultados  
**FR45:** Email inclui lista de jogos verificados  
**FR46:** Email destaca premiações (se houver) com visual especial  
**FR47:** Email inclui link direto para dashboard  
**FR48:** Usuários podem optar por não receber emails (opt-out)

### FR Group 8: Educational Content & Transparency

**FR49:** Sistema exibe seção "Como funciona?" explicando Wheeling Systems  
**FR50:** Sistema exibe probabilidades reais de cada faixa de premiação  
**FR51:** Sistema exibe disclaimers sobre:
- Wheeling NÃO aumenta chance de jackpot
- Loterias são jogos de azar (expected value negativo)
- Garantias são condicionais (ex: "SE 4 números saírem, ENTÃO...")  

**FR52:** Sistema exibe mensagens de jogo responsável  
**FR53:** Usuários podem acessar termos de uso e política de privacidade (LGPD)

### FR Group 9: Admin Dashboard (Backoffice)

**FR54:** Administrador pode visualizar métricas de uso:
- Total de usuários cadastrados
- Total de sugestões geradas
- Taxa de marcação (% sugestões marcadas como realizadas)
- Taxa de retenção (% usuários que retornam)  

**FR55:** Administrador pode visualizar lista de todos os usuários  
**FR56:** Administrador pode desabilitar/habilitar usuários manualmente  
**FR57:** Administrador pode visualizar logs de jobs (sincronização, verificação)  
**FR58:** Administrador pode executar jobs manualmente (para debug)  
**FR59:** Administrador pode atualizar wheeling templates  
**FR60:** Administrador pode atualizar configurações de loterias

### FR Group 10: PWA & Offline Capabilities

**FR61:** Sistema funciona como Progressive Web App (instalável)  
**FR62:** Sistema mantém cache da última sugestão gerada para acesso offline  
**FR63:** Sistema exibe mensagem quando offline e funcionalidade requer conexão  
**FR64:** Sistema sincroniza ações pendentes quando voltar online (se aplicável)

---

## Non-Functional Requirements

### Performance

**NFR-P1: Response Times**
- Geração de sugestão: <500ms (após receber wheeling template)
- Queries ao banco: <200ms para 95% das requisições
- Carga inicial da página: FCP <1.5s, TTI <3s
- API externa (resultados): timeout após 30s, retry com backoff exponencial

**NFR-P2: Concorrência**
- Sistema deve suportar 50 usuários simultâneos (MVP)
- Jobs de verificação não devem bloquear UI
- Wheeling computation pode ser assíncrono (background)

**NFR-P3: Cache Strategy**
- Resultados históricos: cache por 24h (renovar após sorteio)
- Wheeling templates: cache estático (imutável)
- Configurações de loterias: cache por 1 semana

### Security

**NFR-S1: Authentication**
- Magic links expiram após 15 minutos
- Tokens de sessão expiram após 30 dias de inatividade
- Rate limiting em envio de magic links: máximo 3 por hora por email

**NFR-S2: Data Protection**
- Senhas NÃO são armazenadas (magic link only)
- Emails hasheados para comparação (não plain text em logs)
- Dados do usuário não são compartilhados com terceiros
- Backup diário de banco de dados

**NFR-S3: API Security**
- HTTPS obrigatório (sem HTTP)
- CORS configurado para domínio próprio apenas
- Rate limiting: 100 requests/min por usuário
- SQL injection protection (prepared statements)
- XSS protection (sanitização de inputs)

**NFR-S4: LGPD Compliance**
- Usuários podem solicitar exclusão de dados
- Dados deletados após 30 dias da solicitação
- Logs anonimizados (sem PII)
- Opt-in explícito para emails

### Scalability

**NFR-SC1: Database**
- PostgreSQL via Neon (serverless, auto-scaling)
- Índices otimizados para queries principais:
  - user_id em suggestions
  - lottery_id + draw_date em results
  - status + user_id em suggestions (para filtros)

**NFR-SC2: Horizontal Scaling (pós-MVP)**
- Vercel auto-scale functions (até 100 concurrent executions)
- Jobs de verificação podem rodar em paralelo (1 por loteria)
- Cache distribuído (Redis) se necessário após 100+ usuários

**NFR-SC3: Storage**
- Resultados históricos: ~10KB por sorteio × 2 loterias × 100 sorteios = ~2MB
- Sugestões: ~1KB por sugestão × 50 usuários × 10 sugestões = ~500KB
- Total estimado: <10MB para MVP (Neon free tier suporta até 512MB)

### Integration

**NFR-I1: External APIs**
- Abstração de fonte de dados (interface comum)
- Primary: API oficial da Caixa
- Fallback: github.com/guto-alves/loterias-api
- Failover automático se primary falhar 3x consecutivas

**NFR-I2: Email Service**
- Resend ou SendGrid para envio de emails
- Fallback: SMTP direto (último recurso)
- Rate limit respeitado (não exceder limites do provider)
- Templates de email versionados

**NFR-I3: Monitoring**
- Vercel Analytics para métricas de performance
- Sentry para error tracking
- Logs estruturados (JSON) para debug
- Health check endpoint (/api/health) para uptime monitoring

### Reliability

**NFR-R1: Uptime**
- Target: 99% uptime (permite ~7h downtime/mês)
- Degradação graciosa: se API externa falhar, mostrar última sincronização

**NFR-R2: Data Integrity**
- Validação de resultados antes de salvar (checksum, formato)
- Transações atômicas para operações críticas (marcar premiação)
- Rollback automático em caso de erro

**NFR-R3: Job Reliability**
- Jobs de verificação: retry até 10x com backoff exponencial
- Dead letter queue para jobs falhados (análise posterior)
- Alertas se job falhar >3x consecutivas

### Accessibility

**NFR-A1: WCAG 2.1 Level A (mínimo MVP)**
- Contraste de cores: 4.5:1 para texto normal
- Alt text em imagens importantes
- Labels em todos os form inputs
- Navegação por teclado funcional
- Focus indicators visíveis

**NFR-A2: Responsive Design**
- Mobile-first (otimizado para telas <768px)
- Touch targets mínimo 44x44px
- Zoom até 200% sem quebra de layout

### Maintainability

**NFR-M1: Code Quality**
- TypeScript 100% (strict mode)
- ESLint + Prettier configurados
- Code coverage mínimo: 60% (testes unitários para wheeling logic)
- Comentários em lógica complexa (wheeling templates)

**NFR-M2: Documentation**
- README com setup instructions
- API endpoints documentados (se expor API)
- Wheeling templates explicados (matemática + exemplos)
- Troubleshooting guide para jobs

**NFR-M3: DevOps**
- CI/CD automático (Vercel deploy on push)
- Migrations versionadas (banco de dados)
- Environment variables para secrets
- Rollback em <5min se deploy quebrar

---

## PRD Summary

**Documento completo:** ✅  
**Functional Requirements:** 64 FRs mapeados em 10 capability groups  
**Non-Functional Requirements:** 25 NFRs cobrindo performance, security, scalability, integration, reliability, accessibility, maintainability

**Próximos passos documentados em workflow status**

---

_Este PRD captura a essência do Sorte Grande: honestidade radical + metodologia científica + simplicidade extrema para organizar apostas de loterias de forma inteligente._

_O produto resolve o problema de apostadores regulares que desperdiçam investimento em apostas aleatórias, oferecendo organização matemática baseada em Wheeling Systems - única metodologia cientificamente documentada - com transparência total sobre limitações e probabilidades reais._

_Criado através de discovery colaborativa: brainstorming → research → product brief → PRD._

_**Autor:** Carlos | **Data:** 2025-11-30 | **Versão:** 1.0_
