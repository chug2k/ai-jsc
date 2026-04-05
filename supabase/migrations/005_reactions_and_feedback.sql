-- Message reactions (thumbs up/down on individual messages)
CREATE TABLE public.jsc_message_reactions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id    uuid NOT NULL REFERENCES public.jsc_messages(id) ON DELETE CASCADE,
  user_id       uuid NOT NULL REFERENCES public.jsc_users(id) ON DELETE CASCADE,
  reaction      text NOT NULL CHECK (reaction IN ('up', 'down')),
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (message_id, user_id)
);

CREATE INDEX idx_message_reactions_message ON public.jsc_message_reactions (message_id);

-- Session feedback (post-session ratings per member)
CREATE TABLE public.jsc_session_feedback (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    uuid NOT NULL REFERENCES public.jsc_sessions(id) ON DELETE CASCADE,
  user_id       uuid NOT NULL REFERENCES public.jsc_users(id) ON DELETE CASCADE,
  member_name   text NOT NULL,
  rating        int NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment       text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (session_id, user_id, member_name)
);

CREATE INDEX idx_session_feedback_session ON public.jsc_session_feedback (session_id);

-- Overall session reviews
CREATE TABLE public.jsc_session_reviews (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    uuid NOT NULL REFERENCES public.jsc_sessions(id) ON DELETE CASCADE,
  user_id       uuid NOT NULL REFERENCES public.jsc_users(id) ON DELETE CASCADE,
  overall_rating int NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
  comment       text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (session_id, user_id)
);

-- RLS
ALTER TABLE public.jsc_message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jsc_session_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jsc_session_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_all" ON public.jsc_message_reactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON public.jsc_session_feedback FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON public.jsc_session_reviews FOR ALL USING (true) WITH CHECK (true);

GRANT ALL ON public.jsc_message_reactions TO anon, authenticated;
GRANT ALL ON public.jsc_session_feedback TO anon, authenticated;
GRANT ALL ON public.jsc_session_reviews TO anon, authenticated;
