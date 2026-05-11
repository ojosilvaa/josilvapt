# Jo Silva PT

PWA para personal trainers. HTML+CSS+Vanilla JS · Supabase REST · Claude API · GitHub Pages.
Deploy: `https://ojosilvaa.github.io/josilvapt/`

## Ficheiros
| Ficheiro | Papel |
|---|---|
| `admin.html` | PT: Supabase Auth, alunos CRUD, treinos, dashboard, config |
| `aluno.html` | Aluno: treino, evolução, nutrição, perfil, gamificação |
| `ia-treino.html` | Gerador de treinos com Claude API |
| `sw.js` | PWA offline — cache `josilvaPT-v3` |

## Supabase
URL: `https://oelbocimyfwwzkzbyswg.supabase.co`
Credenciais: `CONFIG.SB_URL` / `CONFIG.SB_KEY` no início do script — **nunca ler de localStorage no aluno.html**.
RLS: `allow_all` em todas as tabelas.

### Tabelas
```
alunos         id, nome, email, telefone, objetivo, modalidade, plano, obs, ativo, criado_em
treinos        id, aluno_id, nome, descricao, criado_em
exercicios     id, treino_id, ordem, nome, obs, series, reps
sessoes        id, aluno_id, treino_id, treino_nome, data, criado_em
sessao_cargas  id, sessao_id, exercicio_id, carga_kg
perimetria     id, aluno_id, data, peso, gordura, massa_magra, medidas(json), obs
anamnese       id, aluno_id, dados(json), atualizado_em
feedbacks      id, sessao_id, aluno_id, estrelas, humor, esforco, mensagem, lido, data, criado_em
refeicoes      id, aluno_id, data, nome, criado_em
refeicao_itens id, refeicao_id, alimento_id, gramas, criado_em
alimentos      id, nome, categoria, kcal_100g, prot_100g, carbo_100g, gord_100g
gamificacao    id, aluno_id, xp_total, nivel, streak_atual, streak_recorde, ultima_sessao, badges(json)
```
> `gamificacao` pode não existir no projeto Supabase — tratar sempre com try/catch silencioso.

### Padrão sbFetch
```js
async function sbFetch(path, opts = {}) {
  try {
    const r = await fetch(SB_URL + '/rest/v1/' + path, {
      headers: { 'apikey': SB_KEY, 'Authorization': 'Bearer ' + SB_KEY,
                 'Content-Type': 'application/json', 'Prefer': 'return=representation',
                 ...(opts.headers || {}) }, ...opts });
    if (!r.ok) return null;
    return r.headers.get('content-type')?.includes('json') ? await r.json() : [];
  } catch(e) { return null; }
}
```

## Design System
```css
--bg:#080808  --bg2:#111111  --bg3:#1a1a1a  --bg4:#222
--border:#1e1e1e  --gold:#C8A96E  --gold2:#8a7449  --gold3:rgba(200,169,110,.12)
--green:#5DCA9A  --red:#e05555  --text:#f0f0f0  --muted:#555
```
- Fontes: **Bebas Neue** (títulos/números) · **DM Sans** (corpo)
- Fundos sólidos — sem gradientes exceto avatares e bloco `/* ── VISUAL EFFECTS ── */`
- Touch targets ≥ 44px · Avatares com 4 gradientes rotativos (av-0…av-3)

## Arquitetura
**Admin:** `goTab(tab)` · login via Supabase Auth · alunos em 3 views (lista/novo/detalhe) · detalhe tem 4 tabs (treinos, evolucao, medidas, perfil)

**Aluno:** `goScreen(screen)` · acesso `?id=<uuid>` sem senha · cargas/done em localStorage · sessão → insere `sessoes`+`sessao_cargas` → modal feedback → atualiza `gamificacao`

## Convenções
- CSS inline em `<style>`, JS inline em `<script>` no fim do body — zero ficheiros externos
- Zero frameworks · zero TypeScript · zero build step
- IDs kebab-case (`nt-nome`, `ring-fill`) · comentários só quando WHY não é óbvio
- Não adicionar features, refactors ou abstrações além do pedido
