-- Agent Identities — instantiated agents with per-user identity data.
-- Each row is a specific "instance" of a soul archetype, with a name, background, etc.

CREATE TABLE public.jsc_agent_identities (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES public.jsc_users(id) ON DELETE CASCADE,
  soul_id       text NOT NULL,              -- references soul file: "strategist", "facilitator", etc.
  name          text NOT NULL,              -- display name: "Maya Chen" or "Paul Graham"
  emoji         text NOT NULL DEFAULT '🎭',
  color         text NOT NULL DEFAULT '#818cf8',
  role_title    text NOT NULL,              -- "Career Arc Advisor", "Council Moderator", etc.

  -- Structured identity context
  age           int,
  industry      text,
  years_exp     int,
  background    text,                       -- 1-2 sentence bio

  -- Flags
  is_fixed      boolean NOT NULL DEFAULT false,   -- true for famous/preset (not user-editable)
  is_moderator  boolean NOT NULL DEFAULT false,

  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_jsc_agent_identities_user ON public.jsc_agent_identities (user_id);
CREATE INDEX idx_jsc_agent_identities_soul ON public.jsc_agent_identities (soul_id);

-- Add identity_ids to council_configs (array of identity UUIDs)
ALTER TABLE public.jsc_council_configs
  ADD COLUMN IF NOT EXISTS identity_ids jsonb NOT NULL DEFAULT '[]';

-- Add identity_ids to sessions (snapshot at session start)
ALTER TABLE public.jsc_sessions
  ADD COLUMN IF NOT EXISTS identity_ids jsonb NOT NULL DEFAULT '[]';

-- RLS
ALTER TABLE public.jsc_agent_identities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_all" ON public.jsc_agent_identities FOR ALL USING (true) WITH CHECK (true);

-- Grant access
GRANT ALL ON public.jsc_agent_identities TO anon, authenticated;
