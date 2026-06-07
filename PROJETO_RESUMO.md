# Jo Silva PT — Resumo do Projeto

## O que é
App PWA para personal trainer gerir alunos, treinos e evolução.
Objetivo: vender a outros PTs por €9,99/mês (SaaS).

## Stack
- HTML + CSS + JS puro (zero frameworks, zero build)
- Supabase (DB + auth via REST direto, sem SDK)
- Anthropic Claude API (via fetch direto no browser)
- GitHub Pages: https://ojosilvaa.github.io/josilvapt/
- Repo: https://github.com/ojosilvaa/josilvapt

## Ficheiros principais
| Ficheiro | Função |
|---|---|
| admin.html | Painel do PT (login, alunos, treinos, dashboard) |
| aluno.html | App do aluno (treino, evolução, nutrição) |
| ia-treino.html | Gerador de treinos com IA |
| sw.js | Service worker PWA |
| nutricao-schema.sql | SQL para criar tabelas de nutrição no Supabase |

## Supabase — Tabelas existentes
```
alunos, treinos, exercicios, sessoes, sessao_cargas,
perimetria, anamnese, feedbacks
refeicoes (nova — executar nutricao-schema.sql)
configuracoes (nova — executar nutricao-schema.sql)
```
RLS: allow_all em todas. Credenciais hard-coded + override via localStorage.
Login admin: senha local (localStorage `admin_pass`, default `josilva2024`)
Acesso aluno: aluno.html?id=<uuid> (sem senha)

## Design system
```
--bg:#080808  --bg2:#111  --bg3:#1a1a1a  --bg4:#222
--gold:#C8A96E  --green:#5DCA9A  --red:#e05555
Fontes: Bebas Neue (títulos) + DM Sans (texto)
```

## Feito até agora
- [x] CRUD alunos, treinos, exercícios
- [x] Registo de sessões com cargas
- [x] Gráfico evolução de carga (Chart.js)
- [x] Avaliação física (peso, gordura, 16 perímetros)
- [x] Feedbacks pós-treino
- [x] Gerador de treinos com IA
- [x] PWA instalável (Android + iOS)
- [x] Anel SVG animado (admin: taxa atividade; aluno: progresso treino)
- [x] Dashboard com métricas e delta semanal
- [x] Anamnese completa do aluno
- [x] Food tracker: foto/voz/texto → Claude API → calorias/macros → Supabase

## Pendente / próximos passos
- [ ] Executar nutricao-schema.sql no Supabase SQL Editor (tabelas refeicoes + configuracoes)
- [ ] Configurar Anthropic API Key no painel admin (tab Configurações)
- [ ] Testar food tracker completo (tirar foto → ANALISAR → GUARDAR)
- [ ] Multi-tenant (cada PT com Supabase próprio ou schema isolado)
- [ ] Página de vendas + Stripe
- [ ] Notificações push para alunos
- [ ] Relatório PDF mensal
- [ ] Dashboard de métricas do negócio (receita, churn)

## Contexto técnico importante
- CSS `position:fixed` dentro de elemento com `animation: transform` fica preso no pai → FAB do food tracker foi movido para fora do `.screen` por isso
- Anthropic key guardada em localStorage + tabela `configuracoes` no Supabase
- NUTRI_DASHARRAY=264 (r=42, circunferência≈264px)
- Gradiente `miniGrad` está num `<svg width="0" height="0">` no topo do body (browsers escondem gradientes dentro de `display:none`)
