-- AI-JSC Schema
-- Creates the ai_jsc schema with all tables for the Job Search Council app.

-- ─── SCHEMA ──────────────────────────────────────────────────────────────────
CREATE SCHEMA IF NOT EXISTS ai_jsc;

-- ─── USERS ───────────────────────────────────────────────────────────────────
-- Lightweight user profile. No auth — identified by a self-generated client ID
-- stored in localStorage. This keeps it zero-friction (no sign-up).
CREATE TABLE ai_jsc.users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id     text UNIQUE NOT NULL,  -- generated in browser, stored in localStorage
  name          text NOT NULL DEFAULT 'Friend',
  search_status text NOT NULL DEFAULT 'slow' CHECK (search_status IN ('slow', 'fast', 'exploring', 'paused')),
  context       text DEFAULT '',       -- user's situation/background
  model         text DEFAULT 'gpt-4.1',
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_client_id ON ai_jsc.users (client_id);

-- ─── COUNCIL CONFIGS ─────────────────────────────────────────────────────────
-- Which members a user has selected for their council.
CREATE TABLE ai_jsc.council_configs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES ai_jsc.users(id) ON DELETE CASCADE,
  selected_ids  jsonb NOT NULL DEFAULT '["prizrak","strategist","operator","devils_advocate"]',
  custom_members jsonb NOT NULL DEFAULT '[]',  -- array of custom member objects
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

-- ─── SESSIONS ────────────────────────────────────────────────────────────────
CREATE TABLE ai_jsc.sessions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES ai_jsc.users(id) ON DELETE CASCADE,
  started_at    timestamptz NOT NULL DEFAULT now(),
  ended_at      timestamptz,
  phase         text NOT NULL DEFAULT 'opening',
  member_ids    jsonb NOT NULL DEFAULT '[]',    -- snapshot of council for this session
  summary       text,                            -- optional AI-generated summary
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_sessions_user_id ON ai_jsc.sessions (user_id, started_at DESC);

-- ─── MESSAGES ────────────────────────────────────────────────────────────────
CREATE TABLE ai_jsc.messages (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    uuid NOT NULL REFERENCES ai_jsc.sessions(id) ON DELETE CASCADE,
  role          text NOT NULL CHECK (role IN ('user', 'assistant')),
  content       text NOT NULL,
  member_name   text,            -- which council member spoke (null for user messages)
  phase         text,            -- phase when message was sent
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_session_id ON ai_jsc.messages (session_id, created_at);

-- ─── COMMITMENTS ─────────────────────────────────────────────────────────────
CREATE TABLE ai_jsc.commitments (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES ai_jsc.users(id) ON DELETE CASCADE,
  session_id    uuid REFERENCES ai_jsc.sessions(id) ON DELETE SET NULL,  -- session where created
  text          text NOT NULL,
  done          boolean NOT NULL DEFAULT false,
  due_date      date,            -- extracted deadline if available
  completed_at  timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_commitments_user_id ON ai_jsc.commitments (user_id, created_at DESC);
CREATE INDEX idx_commitments_active ON ai_jsc.commitments (user_id) WHERE NOT done;

-- ─── UPDATED_AT TRIGGER ─────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION ai_jsc.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON ai_jsc.users
  FOR EACH ROW EXECUTE FUNCTION ai_jsc.set_updated_at();

CREATE TRIGGER trg_council_configs_updated_at
  BEFORE UPDATE ON ai_jsc.council_configs
  FOR EACH ROW EXECUTE FUNCTION ai_jsc.set_updated_at();

-- ─── ROW LEVEL SECURITY ─────────────────────────────────────────────────────
-- Using anon key: RLS scoped by client_id passed as a request header or JWT claim.
-- For this app we use a simple approach: the client_id is passed via a custom
-- header and matched in policies. Since we're using the anon key in a browser app,
-- we enable RLS but use permissive policies that filter by client_id.

ALTER TABLE ai_jsc.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_jsc.council_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_jsc.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_jsc.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_jsc.commitments ENABLE ROW LEVEL SECURITY;

-- For a client-side app without auth, we use service role for writes
-- and permissive read policies. In production you'd use Supabase Auth.
-- For now: allow all operations via anon key (the app is single-user per browser).

CREATE POLICY "anon_all" ON ai_jsc.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON ai_jsc.council_configs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON ai_jsc.sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON ai_jsc.messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON ai_jsc.commitments FOR ALL USING (true) WITH CHECK (true);

-- ─── GRANT ACCESS ────────────────────────────────────────────────────────────
-- Allow the anon and authenticated roles to use the schema and tables.

GRANT USAGE ON SCHEMA ai_jsc TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA ai_jsc TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA ai_jsc TO anon, authenticated;
