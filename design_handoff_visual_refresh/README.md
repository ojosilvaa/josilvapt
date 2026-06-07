# Handoff — Visual Refresh do Jo Silva PT

## Visão geral
Refresh visual completo do app **Jo Silva PT** (PWA para personal trainers).
Estes ficheiros são **referências de design em HTML** — protótipos clicáveis a mostrar o look & feel e comportamento pretendidos. **Não copiar diretamente para produção.** O objetivo é recriar este design dentro do código existente (`admin.html`, `aluno.html`) em **HTML + CSS + Vanilla JS** (sem frameworks, sem build) — exatamente como já está descrito no `CLAUDE.md` do repo.

## Fidelidade
**Alta fidelidade.** Cores, tipografia, espaçamentos, animações e interações estão definidos. O developer (Claude Code no terminal) deve replicar pixel a pixel — adaptando ao estilo já presente nos ficheiros atuais (inline `<style>` + `<script>` no fim do body, sem módulos).

## Como usar com Claude Code (terminal)

No teu repositório (`josilvapt`), faz:

```bash
# 1. Coloca esta pasta dentro do repo
unzip design_handoff_visual_refresh.zip -d ./

# 2. Inicia o Claude Code na raiz do repo
claude

# 3. Prompt inicial sugerido:
```

> Lê o ficheiro `design_handoff_visual_refresh/README.md` e os HTML/JSX de referência. Depois quero migrar o `aluno.html` e o `admin.html` para a estética **ARCADE** (default), mantendo a stack do projeto (HTML + CSS + Vanilla JS, sem frameworks, sem build). Antes de tocares em código, propõe-me um plano por fases e espera o meu OK.

### Sugestão de fases

1. **Design tokens** — substituir o `:root{}` atual pelas variáveis CSS deste handoff (ver `themes.jsx` → `AESTHETICS.arcade`). Adicionar suporte a `data-aesthetic` e `data-theme` no `<html>`.
2. **Componentes partilhados** — porta de `shared.jsx` para Vanilla JS:
   - `Ring(value,max,size,stroke,color,label,sub)` → função que devolve SVG.
   - `XPBar(value,max,height,color)` → div + child com `width %`.
   - `CountUp(element, to, dur)` → `requestAnimationFrame` cubic-ease.
   - `Burst(x,y,color)` → partículas absolute-positioned com `@keyframes` gerados.
   - `Stagger` → adicionar `animation-delay: ${i * 60}ms` aos filhos.
3. **Aluno · Treino** — substituir card de exercício por versão com:
   - Header `00 · Nome · meta` + chip ★ quando completo,
   - bloco de carga `−  [valor kg]  +` com delta vs anterior,
   - linha de **pips de séries** (`.set-pip` clicável → marca like ✓),
   - botão Registar com estado `disabled / pct% / ready (glow pulse)`,
   - **reward panel** que aparece após registar (XP, streak, próximo badge).
4. **Aluno · Evolução / Nutrição / Perfil** — usar `MiniLine`, `Ring` e `XPBar`.
5. **Admin · Painel** — `kpi-grid` (4 KPIs), feed de atividade live, aderência por aluno, tabela completa.
6. **Admin · Construtor + Avaliação** — ver respetivos componentes.
7. **Tema** — botão na navbar para alternar `data-aesthetic` (arcade / luxe / brutal) e `data-theme`. Persistir em `localStorage('ojo_theme')`.

## Stack alvo
- HTML + CSS + Vanilla JS (zero frameworks, zero build).
- Tudo inline no mesmo ficheiro (`admin.html`, `aluno.html`) — como já está hoje.
- Manter `sbFetch()` e PWA tal como estão.

## Ecrãs incluídos

### Aluno (mobile · 390 × 844)
| Ecrã | Ficheiro de referência | Componentes principais |
|---|---|---|
| Treino de hoje | `aluno-screens.jsx → AlunoWorkout` | hero com streak + XP ring · ttabs A/B/C · prog-strip · ex-cards com pips · btn-register · reward |
| Evolução | `aluno-screens.jsx → AlunoEvolucao` | stats-grid (4) · MiniLine de carga · MiniLine de peso · medidas |
| Nutrição | `aluno-screens.jsx → AlunoNutricao` | hero com ring kcal · 3 macros XPBar · meal-cards accordion |
| Perfil | `aluno-screens.jsx → AlunoPerfil` | xp-card · badge-grid (3×2) · PT card · orientações |

### Admin (desktop · 1180 × 820)
| Ecrã | Ficheiro de referência | Componentes principais |
|---|---|---|
| Painel | `admin-screens.jsx → AdminDashboard` | adm-hero · kpi-grid (4) · atividade live · aderência · tabela de alunos |
| Construtor | `admin-screens.jsx → AdminBuilder` | bex-list (drag-style) · biblioteca · painel IA |
| Avaliação física | `admin-screens.jsx → AdminMedidas` | 4 rings de composição · peri-grid 4×2 · textarea notas |

## Design tokens

### Estética ARCADE (default)
```css
--font-display: 'Bricolage Grotesque', 'Space Grotesk', sans-serif;
--font-body:    'Space Grotesk', system-ui, sans-serif;
--font-mono:    'JetBrains Mono', ui-monospace, monospace;
--radius: 14px; --radius-sm: 10px; --radius-lg: 22px;
--border-w: 1.5px;
--letter: 0em; --btn-letter: 0.04em;
--motion: cubic-bezier(.2,.9,.2,1.2);  --motion-dur: .35s;

/* Dark (default) */
--bg:#0A0D12; --bg2:#11151D; --bg3:#161B25; --bg4:#1E2530;
--text:#F2F4F8; --text-sub:#A8B0C2; --muted:#5A6275;
--border:#1F2733;
--accent:#ADFF4A;  /* electric lime */
--accent-2:#FF3D8B; /* hot magenta */
--accent-3:#4ED9FF; /* electric cyan */
--on-accent:#0A0D12; --danger:#FF5C5C;

/* Light */
--bg:#F3F4F6; --bg2:#FFFFFF; --bg3:#E9EBEF; --bg4:#DFE2E8;
--text:#0B0E14; --text-sub:#5A6275; --muted:#9099AC; --border:#D8DCE5;
--on-accent:#0B0E14;
```

### LUXE e BRUTAL
Ver `themes.jsx`. Tokens completos para as 3 estéticas × 2 temas.

## Animações chave
- **fadeUp** 500ms ease — cards em cascata via `animation-delay: ${i*70}ms`.
- **dash** 1.6s — linhas de gráfico desenhadas via `stroke-dashoffset`.
- **glowPulse** 1.6s ease infinite — botão "Registar" quando pct=100%.
- **pulse** 1.4s — troféu no exercício completo.
- **CountUp** ~900ms cubic ease — todos os números (KPIs, big-num, stats).
- **Ring fill** 1.2s cubic-bezier(.22,.61,.36,1) — anéis SVG via `stroke-dashoffset`.
- **Burst** 900ms — 18 partículas radiais ao tocar um set ou registar sessão.

## Comportamento — Treino do Aluno (game-feel)
- `cargas` e `doneSet` guardados localmente (já tens padrão em `localStorage` no `aluno.html`).
- Tocar num `.set-pip` → marca ✓ + dispara `Burst` no ponto do toque.
- Quando todas as séries de um exercício marcadas → ex-card recebe `.done` (border accent, ★).
- Quando 100% das séries marcadas → `.btn-register.ready` com `glowPulse`.
- Ao clicar Registar → painel **reward** fade-in com `+XP ganho`, `streak mantida`, `próximo badge`.

## Ficheiros nesta pasta
- `Jo Silva PT.html` — entry point do protótipo.
- `themes.jsx` — sistema de tokens (3 estéticas × 2 temas).
- `data.jsx` — mock data (manter forma; substituir por chamadas Supabase reais).
- `shared.jsx` — Ring, XPBar, CountUp, Burst, Stagger, Avatar, BottomNav, Sidebar, set de ícones.
- `aluno-screens.jsx` — 4 ecrãs do aluno.
- `admin-screens.jsx` — 3 ecrãs do admin.
- `app.jsx` — router + Tweaks.
- `styles.css` — todo o CSS (≈800 linhas). Esta é a fonte canónica do look final.
- `tweaks-panel.jsx` — painel de tweaks (não migrar para produção).

## Notas finais
- **Não trazer React.** O protótipo usa React+Babel só pela velocidade — em produção tudo deve ficar em Vanilla JS, em linha com o resto do app.
- **Manter PWA** (`sw.js`, manifests) — não tocar.
- **Bilingue PT/EN** fica para depois (segundo decisão do produto). Por agora tudo em PT-PT.
