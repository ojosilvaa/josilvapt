# Jo Silva PT — Contexto do Projeto

## Visão
App web PWA para personal trainers gerirem alunos, treinos e evolução.
Modelo SaaS: licença por personal trainer a €9.99/mês.
Stack sem servidor — tudo corre no browser do utilizador.

## Stack
- **Frontend**: HTML + CSS + Vanilla JS (zero frameworks, zero build tools)
- **DB + Auth**: Supabase (REST API direta, sem SDK)
- **IA**: Anthropic API (Claude) via `ia-treino.html`
- **Hosting**: GitHub Pages → `https://ojosilvaa.github.io/josilvapt/`
- **PWA**: service worker em `sw.js`, manifests em `manifest.json` e `manifest-admin.json`

## Ficheiros
| Ficheiro | Descrição |
|---|---|
| `admin.html` | Painel do personal trainer (login + gestão completa) |
| `aluno.html` | App do aluno (treino, evolução, feedbacks) |
| `ia-treino.html` | Gerador de treinos com IA (multi-step form → Claude API) |
| `sw.js` | Service worker para PWA offline |
| `manifest.json` | PWA manifest do aluno |
| `manifest-admin.json` | PWA manifest do admin |

## Supabase — Tabelas
```
alunos          id, nome, email, telefone, objetivo, modalidade, plano, obs, ativo, criado_em
treinos         id, aluno_id, nome, descricao, criado_em
exercicios      id, treino_id, ordem, nome, obs, series, reps
sessoes         id, aluno_id, treino_id, treino_nome, data, criado_em
sessao_cargas   id, sessao_id, exercicio_id, carga_kg
perimetria      id, aluno_id, data, peso, gordura, massa_magra, medidas(json), obs
anamnese        id, aluno_id, dados(json), atualizado_em
feedbacks       id, sessao_id, aluno_id, estrelas, humor, esforco, mensagem, lido, data, criado_em
```
RLS: todas as tabelas têm `allow_all` (autenticação feita pelo personal via senha local).
Supabase credentials estão hard-coded + sobrescritas via localStorage (`sb_url`, `sb_key`).

## Design System
```css
--bg:#080808  --bg2:#111111  --bg3:#1a1a1a  --bg4:#222222
--border:#1e1e1e  --gold:#C8A96E  --gold2:#8a7449
--green:#5DCA9A  --red:#e05555  --text:#f0f0f0  --muted:#555
```
- Fontes: **Bebas Neue** (títulos/valores) + **DM Sans** (texto)
- Fundos: sempre sólidos (sem gradientes) — só avatares têm gradiente
- Avatares: 4 gradientes rotativos (av-0 dourado, av-1 azul, av-2 rosa, av-3 verde)
- Touch targets: min 44px em botões de ação

## Componentes Padrão
- **Anel SVG animado** (admin: taxa de ativos; aluno: progresso do treino)
  - `stroke-dasharray: 320` (admin, r=52) / `138` (aluno mini, r=22)
  - Anima via `requestAnimationFrame` → `style.strokeDashoffset`
  - Transição: `1.4s cubic-bezier(.4,0,.2,1)`
  - Glow: círculo dourado a `opacity: .15` por baixo
- **Cards em cascata**: `animation: fadeUp .3s ease ${i*0.07}s both`
- **Barra de progresso**: `linear-gradient(90deg, #8a7449, #C8A96E)` + `transition: width 1s`
- **Toast**: `.toast.show` com `opacity:1`, auto-remove em 2.4s
- **Bottom nav**: dot ativo `4px círculo dourado` via `::after`
- **Tabs**: Bebas Neue 12px, `letter-spacing: 2px`, `border-bottom: 2px solid gold` ativo

## Padrão de Fetch Supabase
```js
async function sbFetch(path, opts = {}) {
  const r = await fetch(SB_URL + '/rest/v1/' + path, {
    headers: { 'apikey': SB_KEY, 'Authorization': 'Bearer ' + SB_KEY,
               'Content-Type': 'application/json', 'Prefer': 'return=representation',
               ...(opts.headers || {}) }, ...opts });
  if (!r.ok) return null;
  return r.headers.get('content-type')?.includes('json') ? r.json() : [];
}
```

## Arquitetura Admin
- **Login**: senha local (localStorage `admin_pass`, default `josilva2024`)
- **Navegação**: `goTab(tab)` → mostra/esconde `.screen` + ativa `bnav-item`
- **Alunos**: 3 views dentro de `#screen-alunos` — `lista`, `novo`, `detalhe`
- **Detalhe aluno**: 4 tabs — treinos, evolucao, medidas, perfil
- **Dashboard**: anel de taxa de ativos + métricas com delta semanal + atividade recente

## Arquitetura Aluno
- **Link de acesso**: `aluno.html?id=<uuid>` — sem senha
- **Navegação**: `goScreen(screen)` — treino, evolucao, orientacoes
- **Estado local**: cargas e exercícios feitos em localStorage por aluno+treino
- **Sessão**: ao registar → insere `sessoes` + `sessao_cargas` → abre modal feedback
- **Offline**: sessão guardada em localStorage se Supabase falhar

## Convenções de Código
- CSS inline no `<style>` do mesmo ficheiro (sem ficheiros externos)
- JS inline no `<script>` no fim do body (sem módulos)
- Sem frameworks, sem TypeScript, sem build step
- IDs de elementos: kebab-case descritivo (`nt-nome`, `ring-fill`, `mini-ring-pct`)
- Não adicionar comentários ao código a não ser que o WHY seja não-óbvio

## Funcionalidades Atuais
- [x] CRUD completo de alunos (criar, editar, ativar/inativar, deletar)
- [x] CRUD de treinos com exercícios (séries, reps, obs)
- [x] Registo de sessões com cargas por exercício
- [x] Evolução: gráfico Chart.js de progressão de carga por exercício
- [x] Avaliação física: peso, gordura, massa magra, 16 perímetros
- [x] Histórico de medidas com variação percentual
- [x] Feedbacks pós-treino (estrelas, humor, esforço, mensagem)
- [x] Badge de feedbacks não lidos no admin
- [x] Gerador de treinos com IA (Anthropic Claude)
- [x] PWA instalável (Android + iOS)
- [x] Métricas com delta semanal no dashboard
- [x] Anel animado de taxa de atividade (admin) + progresso de treino (aluno)
- [x] Anamnese/perfil completo do aluno

## Próximos Passos Planeados (SaaS)
- [ ] Multi-tenant: cada personal tem o seu Supabase ou schema isolado
- [ ] Página de vendas / landing page
- [ ] Sistema de pagamento (Stripe ou similar)
- [ ] Onboarding automático pós-pagamento
- [ ] Notificações push para alunos (treino do dia, lembrete)
- [ ] Relatório PDF mensal para aluno
- [ ] Foto de progresso (upload no Supabase Storage)
- [ ] Plano nutricional básico com IA
- [ ] Dashboard de métricas do negócio para o personal (receita, churn, etc.)
