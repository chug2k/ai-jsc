-- Link jsc_users to Supabase Auth
ALTER TABLE public.jsc_users ADD COLUMN IF NOT EXISTS auth_user_id uuid UNIQUE REFERENCES auth.users(id);

-- Auto-create jsc_users row on signup
CREATE OR REPLACE FUNCTION public.handle_auth_user_created()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.jsc_users (auth_user_id, client_id, name)
  VALUES (
    new.id,
    gen_random_uuid()::text,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Friend')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_auth_user_created();

-- Update RLS policies: scope to authenticated user
-- Users
DROP POLICY IF EXISTS "anon_all" ON public.jsc_users;
CREATE POLICY "users_own" ON public.jsc_users
  FOR ALL USING (auth_user_id = auth.uid()) WITH CHECK (auth_user_id = auth.uid());

-- Council configs
DROP POLICY IF EXISTS "anon_all" ON public.jsc_council_configs;
CREATE POLICY "configs_own" ON public.jsc_council_configs
  FOR ALL USING (user_id IN (SELECT id FROM public.jsc_users WHERE auth_user_id = auth.uid()))
  WITH CHECK (user_id IN (SELECT id FROM public.jsc_users WHERE auth_user_id = auth.uid()));

-- Sessions
DROP POLICY IF EXISTS "anon_all" ON public.jsc_sessions;
CREATE POLICY "sessions_own" ON public.jsc_sessions
  FOR ALL USING (user_id IN (SELECT id FROM public.jsc_users WHERE auth_user_id = auth.uid()))
  WITH CHECK (user_id IN (SELECT id FROM public.jsc_users WHERE auth_user_id = auth.uid()));

-- Messages (scoped through sessions)
DROP POLICY IF EXISTS "anon_all" ON public.jsc_messages;
CREATE POLICY "messages_own" ON public.jsc_messages
  FOR ALL USING (session_id IN (
    SELECT s.id FROM public.jsc_sessions s
    JOIN public.jsc_users u ON s.user_id = u.id
    WHERE u.auth_user_id = auth.uid()
  ))
  WITH CHECK (session_id IN (
    SELECT s.id FROM public.jsc_sessions s
    JOIN public.jsc_users u ON s.user_id = u.id
    WHERE u.auth_user_id = auth.uid()
  ));

-- Commitments
DROP POLICY IF EXISTS "anon_all" ON public.jsc_commitments;
CREATE POLICY "commitments_own" ON public.jsc_commitments
  FOR ALL USING (user_id IN (SELECT id FROM public.jsc_users WHERE auth_user_id = auth.uid()))
  WITH CHECK (user_id IN (SELECT id FROM public.jsc_users WHERE auth_user_id = auth.uid()));

-- Subscriptions
DROP POLICY IF EXISTS "anon_all" ON public.jsc_subscriptions;
CREATE POLICY "subs_own" ON public.jsc_subscriptions
  FOR ALL USING (user_id IN (SELECT id FROM public.jsc_users WHERE auth_user_id = auth.uid()))
  WITH CHECK (user_id IN (SELECT id FROM public.jsc_users WHERE auth_user_id = auth.uid()));

-- Usage
DROP POLICY IF EXISTS "anon_all" ON public.jsc_usage;
CREATE POLICY "usage_own" ON public.jsc_usage
  FOR ALL USING (user_id IN (SELECT id FROM public.jsc_users WHERE auth_user_id = auth.uid()))
  WITH CHECK (user_id IN (SELECT id FROM public.jsc_users WHERE auth_user_id = auth.uid()));

-- Payments
DROP POLICY IF EXISTS "anon_all" ON public.jsc_payments;
CREATE POLICY "payments_own" ON public.jsc_payments
  FOR ALL USING (user_id IN (SELECT id FROM public.jsc_users WHERE auth_user_id = auth.uid()))
  WITH CHECK (user_id IN (SELECT id FROM public.jsc_users WHERE auth_user_id = auth.uid()));

-- Plan limits remain readable by all (public config)
-- (anon_read policy already exists)
