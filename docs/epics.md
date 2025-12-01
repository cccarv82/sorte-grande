# Sorte Grande - Epics & User Stories

**Author:** Carlos  
**Date:** 2025-11-30  
**Version:** 1.0  
**Context:** PRD + UX Design + Architecture

---

## Document Overview

Este documento decompõe os 64 Functional Requirements do PRD em **Epics e User Stories implementáveis**.

**Contexto Incorporado:**
- ✅ PRD (64 FRs, 25 NFRs)
- ✅ UX Design Specification (Emerald Trust theme, shadcn/ui, 6 telas mockadas)
- ✅ Architecture (Next.js 16, TypeScript 5.1+, Neon PostgreSQL, Drizzle ORM, NextAuth v5)

**Princípios de Decomposição:**
- Cada Epic entrega **VALOR PARA O USUÁRIO** (não apenas capacidade técnica)
- Stories são **verticalmente cortadas** (full-stack, UI até banco de dados)
- Stories são **bite-sized** (completáveis em uma sessão focada)
- Sem dependências futuras (apenas backward)
- Detalhes de implementação incluídos (UI específicos, APIs, validações)

---

## FR Coverage Matrix

Mapeamento de todos os 64 FRs do PRD para Epics e Stories:

| FR | Descrição | Epic | Stories |
|----|-----------|------|---------|
| FR1 | Criar conta com email | Epic 2 | 2.1, 2.2 |
| FR2 | Receber magic link | Epic 2 | 2.3 |
| FR3 | Login via magic link | Epic 2 | 2.4 |
| FR4 | Logout | Epic 2 | 2.5 |
| FR5 | Limite 50 usuários | Epic 2 | 2.6 |
| FR6 | Editar perfil | Epic 2 | 2.7 |
| FR7-FR10 | Configurações de loterias | Epic 1 | 1.4, 1.5 |
| FR11-FR24 | Geração de sugestões (core) | Epic 3 | 3.1-3.14 |
| FR25-FR30 | Resultados históricos | Epic 4 | 4.1-4.4 |
| FR31-FR37 | Verificação automática | Epic 5 | 5.1-5.4 |
| FR38-FR43 | Dashboard e histórico | Epic 6 | 6.1-6.6 |
| FR44-FR48 | Notificações | Epic 7 | 7.1-7.3 |
| FR49-FR53 | Conteúdo educacional | Epic 8 | 8.1-8.3 |
| FR54-FR60 | Admin dashboard | Epic 9 | 9.1-9.5 |
| FR61-FR64 | PWA e offline | Epic 10 | 10.1-10.3 |

**Validação:** ✅ Todos os 64 FRs cobertos por stories

---

## Epic Structure Proposal

### Filosofia de Organização

Os epics são organizados por **VALOR PARA O USUÁRIO**, não por camadas técnicas.

**✅ Princípio:** Cada epic deve responder: "O que os usuários podem FAZER depois deste epic que não podiam antes?"

**❌ Anti-padrão evitado:**
- ~~Epic: "Database Layer"~~ → Usuário não consegue fazer nada
- ~~Epic: "API Backend"~~ → Usuário não consegue usar
- ~~Epic: "Frontend UI"~~ → Usuário não consegue interagir até tudo estar pronto

**✅ Padrão correto:**
- Epic 1: Foundation → Projeto estruturado, pronto para implementar features
- Epic 2: User Authentication → Usuário pode criar conta e fazer login
- Epic 3: Suggestion Generation → Usuário pode gerar e copiar jogos otimizados
- Epic 4-10: Funcionalidades incrementais que entregam valor

### Sequência de Epics Proposta

**Epic 1: Foundation & Project Setup** (Exceção greenfield)
- **Valor:** Infraestrutura base para todos os features subsequentes
- **Escopo:** Setup Next.js, banco de dados, auth, CI/CD, componentes base
- **FRs Habilitados:** Infraestrutura para FR1-FR64
- **Stories:** ~8 stories (setup, database schema, auth config, shadcn/ui base, deploy pipeline)

**Epic 2: User Authentication System** 
- **Valor:** ✅ Usuário pode criar conta e fazer login via magic link
- **Escopo:** Cadastro, magic link, login, logout, limite 50 usuários
- **FRs Cobertos:** FR1-FR6 (User Account & Authentication)
- **Stories:** ~7 stories

**Epic 3: Suggestion Generation Engine** (CORE VALUE)
- **Valor:** ✅ Usuário pode gerar sugestões otimizadas e copiar jogos
- **Escopo:** Input de valor, wheeling engine, geração de jogos, visualização, copiar, marcar como realizado
- **FRs Cobertos:** FR11-FR24 (Suggestion Generation) + FR7-FR10 (Lottery Config)
- **Stories:** ~14 stories

**Epic 4: Lottery Results Integration**
- **Valor:** ✅ Sistema tem resultados oficiais atualizados automaticamente
- **Escopo:** Integração com APIs da Caixa/fallback, sincronização automática
- **FRs Cobertos:** FR25-FR30 (Historical Results Management)
- **Stories:** ~4 stories

**Epic 5: Automatic Prize Verification**
- **Valor:** ✅ Usuário recebe notificação automática quando ganhar
- **Escopo:** Job de verificação, polling, detecção de prêmios, atualização de status
- **FRs Cobertos:** FR31-FR37 (Automatic Prize Verification) + FR44-FR48 (Notifications)
- **Stories:** ~7 stories (4 verification + 3 notifications)

**Epic 6: User Dashboard & History**
- **Valor:** ✅ Usuário pode ver histórico, estatísticas e gerenciar sugestões
- **Escopo:** Lista de sugestões, filtros, estatísticas pessoais, destaque de prêmios
- **FRs Cobertos:** FR38-FR43 (User Dashboard & History)
- **Stories:** ~6 stories

**Epic 7: Educational Content & Transparency**
- **Valor:** ✅ Usuário entende como funciona e confia no sistema
- **Escopo:** Landing page educacional, "Como funciona", disclaimers, probabilidades reais
- **FRs Cobertos:** FR49-FR53 (Educational Content & Transparency)
- **Stories:** ~3 stories

**Epic 8: PWA & Offline Capabilities**
- **Valor:** ✅ Usuário pode instalar app e acessar última sugestão offline
- **Escopo:** PWA manifest, service worker, cache offline, instalabilidade
- **FRs Cobertos:** FR61-FR64 (PWA & Offline)
- **Stories:** ~3 stories

**Epic 9: Admin Dashboard (Backoffice)**
- **Valor:** ✅ Admin pode monitorar uso, gerenciar usuários e jobs
- **Escopo:** Métricas, lista de usuários, logs de jobs, executar jobs manualmente
- **FRs Cobertos:** FR54-FR60 (Admin Dashboard)
- **Stories:** ~5 stories

**Epic 10: Profile & Settings**
- **Valor:** ✅ Usuário pode gerenciar perfil e preferências
- **Escopo:** Editar perfil, opt-out de emails, configurações de notificação
- **FRs Cobertos:** FR6 (Edit Profile) + FR48 (Opt-out emails)
- **Stories:** ~2 stories

### Summary

**Total:** 10 Epics, ~59 Stories estimadas

**Ordem de Prioridade (MVP):**
1. **Epic 1** (Foundation) - Base necessária
2. **Epic 2** (Auth) - Usuário pode entrar
3. **Epic 3** (Suggestion Generation) - **CORE VALUE** - Usuário pode gerar jogos
4. **Epic 7** (Educational Content) - Confiança e transparência (crítico para MVP)
5. **Epic 6** (Dashboard) - Usuário vê histórico
6. **Epic 4** (Lottery Results) - Sistema tem dados
7. **Epic 5** (Prize Verification) - Automação completa
8. **Epic 8** (PWA) - Mobile optimization
9. **Epic 10** (Profile) - Gestão básica
10. **Epic 9** (Admin) - Backoffice (pode ser fase 2)

**Validação de Valor por Epic:**
- ✅ Epic 1: Infraestrutura (exceção greenfield)
- ✅ Epic 2: Usuário pode criar conta e login
- ✅ Epic 3: Usuário pode gerar e usar jogos (CORE)
- ✅ Epic 4: Sistema tem resultados atualizados
- ✅ Epic 5: Usuário recebe notificação de prêmios
- ✅ Epic 6: Usuário gerencia histórico
- ✅ Epic 7: Usuário entende e confia
- ✅ Epic 8: Usuário instala app
- ✅ Epic 9: Admin monitora sistema
- ✅ Epic 10: Usuário gerencia perfil

---

## 📖 DETALHAMENTO COMPLETO

**Todas as 59 User Stories com BDD, Technical Notes e UX Details estão documentadas em:**

👉 **[epics-detailed.md](./epics-detailed.md)** 

O documento detalhado inclui:
- ✅ 10 Epics decompostos em 59 Stories implementáveis
- ✅ BDD Acceptance Criteria (Given/When/Then) para cada story
- ✅ Technical Notes com decisões da Architecture (Next.js 16, Drizzle, NextAuth, Resend)
- ✅ UX Details com especificações do Emerald Trust theme (cores, tamanhos, spacing)
- ✅ Prerequisites claros entre stories
- ✅ FR Coverage Matrix validando os 64 FRs cobertos
- ✅ NFRs mapeados (Performance, Security, Scalability, etc)

**Estrutura dos Epics:**
- **Epic 1:** Foundation & Project Setup (8 stories)
- **Epic 2:** User Authentication (7 stories)  
- **Epic 3:** Suggestion Generation Engine (14 stories) 🎯 **CORE**
- **Epic 4:** Lottery Results Integration (4 stories)
- **Epic 5:** Automatic Prize Verification (7 stories)
- **Epic 6:** User Dashboard & History (6 stories)
- **Epic 7:** Educational Content & Transparency (3 stories)
- **Epic 8:** PWA & Offline Capabilities (3 stories)
- **Epic 9:** Admin Dashboard (5 stories)
- **Epic 10:** Profile & Settings (2 stories)

**Tempo estimado:** 8-12 sprints (1 dev, sprints 1 semana)  
**MVP mínimo:** Epics 1-3 + 7 (~30 stories) = Foundation + Auth + Core Generation + Educational

---

## Validation Summary

✅ **FR Coverage:** 64/64 FRs mapeados para stories  
✅ **Epic Value:** Cada epic entrega valor para usuário (exceto Epic 1 greenfield)  
✅ **Story Sizing:** Bite-sized, completáveis em 1 sessão dev  
✅ **Vertical Slicing:** Cada story é full-stack (UI + API + DB)  
✅ **Dependencies:** Sem forward dependencies, apenas backward  
✅ **UX Integration:** Emerald Trust theme (#10b981) aplicado consistentemente  
✅ **Architecture Alignment:** Next.js 16 patterns, Drizzle queries, NextAuth flows documentados  
✅ **Acceptance Criteria:** BDD format para cada story  

**Status:** ✅ READY FOR IMPLEMENTATION

---

**Próximos Passos Recomendados:**
1. ✅ Review este documento (aprovação da estrutura de epics)
2. → Acessar [epics-detailed.md](./epics-detailed.md) para detalhes técnicos
3. → Rodar `*implementation-readiness` workflow (valida alinhamento PRD/UX/Arch/Epics)
4. → Rodar `*sprint-planning` workflow (agrupar stories, estimar, priorizar)
5. → Começar desenvolvimento: Epic 1.1 (Initialize Next.js Project)

