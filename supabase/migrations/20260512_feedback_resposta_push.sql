-- Add PT response columns to feedbacks
ALTER TABLE feedbacks
  ADD COLUMN IF NOT EXISTS resposta TEXT,
  ADD COLUMN IF NOT EXISTS resposta_em TIMESTAMPTZ;

-- Push subscriptions (one per student, upsert on aluno_id)
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id UUID NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
  subscription JSONB NOT NULL,
  criado_em TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS push_subscriptions_aluno_id_idx
  ON push_subscriptions(aluno_id);
