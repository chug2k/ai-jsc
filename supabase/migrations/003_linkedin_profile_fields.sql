-- Add LinkedIn profile fields to jsc_users
ALTER TABLE public.jsc_users ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE public.jsc_users ADD COLUMN IF NOT EXISTS linkedin_headline text;
ALTER TABLE public.jsc_users ADD COLUMN IF NOT EXISTS auth_provider text;

-- Update trigger to capture LinkedIn/Google metadata on signup
CREATE OR REPLACE FUNCTION public.handle_auth_user_created()
RETURNS TRIGGER AS $$
DECLARE
  provider text;
  full_name text;
  avatar text;
  headline text;
BEGIN
  provider := new.raw_user_meta_data->>'iss';
  full_name := COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Friend');
  avatar := new.raw_user_meta_data->>'avatar_url';
  headline := new.raw_user_meta_data->>'headline';

  INSERT INTO public.jsc_users (auth_user_id, client_id, name, avatar_url, linkedin_headline, auth_provider)
  VALUES (
    new.id,
    gen_random_uuid()::text,
    full_name,
    avatar,
    headline,
    CASE WHEN provider ILIKE '%linkedin%' THEN 'linkedin' ELSE 'google' END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
