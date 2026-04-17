-- Automated marketing agent outputs. One row per routine run.
CREATE TABLE public.jsc_marketing_outputs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  routine     text NOT NULL,
  content     text NOT NULL,
  meta        jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_marketing_outputs_routine_created
  ON public.jsc_marketing_outputs (routine, created_at DESC);

CREATE INDEX idx_marketing_outputs_created
  ON public.jsc_marketing_outputs (created_at DESC);

-- No anon read/write. Only the service role (used by the cron route) touches this.
ALTER TABLE public.jsc_marketing_outputs ENABLE ROW LEVEL SECURITY;
