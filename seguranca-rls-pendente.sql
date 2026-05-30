-- ════════════════════════════════════════════════════════════════
--  Jo Silva PT — RLS pendente (aplicar quando o MCP Supabase reconectar)
--  Verificado contra aluno-v3-app.js: NÃO quebra o app dos alunos.
--  Regra: authenticated (PT) = total; anon (aluno) = mínimo necessário.
-- ════════════════════════════════════════════════════════════════

-- ── configuracoes : guarda segredos (anthropic_key). SÓ admin. ──
-- (v3 não lê configuracoes — seguro fechar a anon)
DROP POLICY IF EXISTS "allow_all" ON public.configuracoes;
DROP POLICY IF EXISTS "allow_all_configuracoes" ON public.configuracoes;
CREATE POLICY "admin_all" ON public.configuracoes
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ── mensagens_pt : admin total; aluno lê + insere ──
DROP POLICY IF EXISTS "allow_all" ON public.mensagens_pt;
CREATE POLICY "admin_all"   ON public.mensagens_pt FOR ALL    TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_select" ON public.mensagens_pt FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert" ON public.mensagens_pt FOR INSERT TO anon WITH CHECK (true);

-- ── periodizacao : definida pelo PT, aluno só lê ──
DROP POLICY IF EXISTS "allow_all" ON public.periodizacao;
CREATE POLICY "admin_all"   ON public.periodizacao FOR ALL    TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_select" ON public.periodizacao FOR SELECT TO anon USING (true);

-- ── receitas : já tem admin_all; trocar select público por anon ──
DROP POLICY IF EXISTS "select_all" ON public.receitas;
CREATE POLICY "anon_select" ON public.receitas FOR SELECT TO anon USING (true);

-- ── community_* : aluno lê + insere; reações também apaga (un-react) ──
DROP POLICY IF EXISTS "allow_all" ON public.community_posts;
DROP POLICY IF EXISTS "allow_all" ON public.community_comments;
DROP POLICY IF EXISTS "allow_all" ON public.community_reactions;
DROP POLICY IF EXISTS "allow_all" ON public.community_challenges;

CREATE POLICY "admin_all"   ON public.community_posts      FOR ALL    TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_select" ON public.community_posts      FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert" ON public.community_posts      FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "admin_all"   ON public.community_comments   FOR ALL    TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_select" ON public.community_comments   FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert" ON public.community_comments   FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "admin_all"   ON public.community_reactions  FOR ALL    TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_select" ON public.community_reactions  FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert" ON public.community_reactions  FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_delete" ON public.community_reactions  FOR DELETE TO anon USING (true);  -- aluno remove a própria reação (aluno-v3-app.js:2138)

CREATE POLICY "admin_all"   ON public.community_challenges FOR ALL    TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_select" ON public.community_challenges FOR SELECT TO anon USING (true);

-- NOTA: isto fecha o acesso ABERTO mas mantém anon com USING(true),
-- ou seja, qualquer aluno ainda pode ler dados de qualquer aluno.
-- O isolamento real (por aluno) exige a decisão de arquitetura (login por email / token).
