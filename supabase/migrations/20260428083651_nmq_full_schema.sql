-- NMQ Full Schema Migration
-- Tables: user_profiles, journal_entries, lights, portal_sessions, portal_rounds, purchases

-- ============================================================
-- 1. ENUM TYPES
-- ============================================================

DROP TYPE IF EXISTS public.user_node CASCADE;
CREATE TYPE public.user_node AS ENUM (
  'rtanj', 'sedona', 'kailash', 'shasta', 'glastonbury', 'machu_picchu', 'esvedra'
);

DROP TYPE IF EXISTS public.user_role CASCADE;
CREATE TYPE public.user_role AS ENUM ('user', 'admin');

DROP TYPE IF EXISTS public.star_magnitude CASCADE;
CREATE TYPE public.star_magnitude AS ENUM ('iskra', 'svetlost', 'svemir');

DROP TYPE IF EXISTS public.portal_status CASCADE;
CREATE TYPE public.portal_status AS ENUM ('active', 'completed');

DROP TYPE IF EXISTS public.purchase_product CASCADE;
CREATE TYPE public.purchase_product AS ENUM ('light', 'deep_insight', 'companion');

-- ============================================================
-- 2. CORE TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  nickname TEXT,
  assigned_node public.user_node DEFAULT 'rtanj'::public.user_node,
  role public.user_role DEFAULT 'user'::public.user_role,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  word_count INTEGER DEFAULT 0,
  node public.user_node NOT NULL DEFAULT 'rtanj'::public.user_node,
  depth_score INTEGER DEFAULT 0,
  emotion_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  mirroring_response TEXT,
  crisis_flag BOOLEAN DEFAULT false,
  detected_language TEXT DEFAULT 'en',
  shadow_topics TEXT[] DEFAULT ARRAY[]::TEXT[],
  archetype_hint TEXT,
  recommend_upsell BOOLEAN DEFAULT false,
  upsell_product TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.lights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  node_id public.user_node NOT NULL DEFAULT 'rtanj'::public.user_node,
  fragment TEXT,
  star_magnitude public.star_magnitude DEFAULT 'iskra'::public.star_magnitude,
  is_founding BOOLEAN DEFAULT false,
  is_builder BOOLEAN DEFAULT false,
  pulse_speed TEXT DEFAULT 'medium',
  map_x FLOAT DEFAULT 50.0,
  map_y FLOAT DEFAULT 50.0,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.portal_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  node public.user_node NOT NULL DEFAULT 'rtanj'::public.user_node,
  status public.portal_status DEFAULT 'active'::public.portal_status,
  current_round INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.portal_rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.portal_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL,
  question TEXT NOT NULL,
  user_input TEXT,
  ai_response TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  product public.purchase_product NOT NULL,
  amount_cents INTEGER NOT NULL DEFAULT 0,
  stripe_payment_intent TEXT,
  light_id UUID REFERENCES public.lights(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 3. INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON public.journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_created_at ON public.journal_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lights_node_id ON public.lights(node_id);
CREATE INDEX IF NOT EXISTS idx_lights_user_id ON public.lights(user_id);
CREATE INDEX IF NOT EXISTS idx_portal_sessions_user_id ON public.portal_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_portal_rounds_session_id ON public.portal_rounds(session_id);
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON public.purchases(user_id);

-- ============================================================
-- 4. FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, nickname, assigned_node, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nickname', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'assigned_node', 'rtanj')::public.user_node,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')::public.user_role
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_admin_from_auth()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid()
    AND (
      au.raw_user_meta_data->>'role' = 'admin'
      OR au.raw_app_meta_data->>'role' = 'admin'
    )
  )
$$;

-- ============================================================
-- 5. ENABLE RLS
-- ============================================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 6. RLS POLICIES
-- ============================================================

-- user_profiles
DROP POLICY IF EXISTS "users_manage_own_user_profiles" ON public.user_profiles;
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles FOR ALL TO authenticated
USING (id = auth.uid()) WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "admin_full_access_user_profiles" ON public.user_profiles;
CREATE POLICY "admin_full_access_user_profiles"
ON public.user_profiles FOR ALL TO authenticated
USING (public.is_admin_from_auth()) WITH CHECK (public.is_admin_from_auth());

-- journal_entries
DROP POLICY IF EXISTS "users_manage_own_journal_entries" ON public.journal_entries;
CREATE POLICY "users_manage_own_journal_entries"
ON public.journal_entries FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "admin_full_access_journal_entries" ON public.journal_entries;
CREATE POLICY "admin_full_access_journal_entries"
ON public.journal_entries FOR ALL TO authenticated
USING (public.is_admin_from_auth()) WITH CHECK (public.is_admin_from_auth());

-- lights (public read, authenticated write own)
DROP POLICY IF EXISTS "public_read_lights" ON public.lights;
CREATE POLICY "public_read_lights"
ON public.lights FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "users_manage_own_lights" ON public.lights;
CREATE POLICY "users_manage_own_lights"
ON public.lights FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "admin_full_access_lights" ON public.lights;
CREATE POLICY "admin_full_access_lights"
ON public.lights FOR ALL TO authenticated
USING (public.is_admin_from_auth()) WITH CHECK (public.is_admin_from_auth());

-- portal_sessions
DROP POLICY IF EXISTS "users_manage_own_portal_sessions" ON public.portal_sessions;
CREATE POLICY "users_manage_own_portal_sessions"
ON public.portal_sessions FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "admin_full_access_portal_sessions" ON public.portal_sessions;
CREATE POLICY "admin_full_access_portal_sessions"
ON public.portal_sessions FOR ALL TO authenticated
USING (public.is_admin_from_auth()) WITH CHECK (public.is_admin_from_auth());

-- portal_rounds
DROP POLICY IF EXISTS "users_manage_own_portal_rounds" ON public.portal_rounds;
CREATE POLICY "users_manage_own_portal_rounds"
ON public.portal_rounds FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "admin_full_access_portal_rounds" ON public.portal_rounds;
CREATE POLICY "admin_full_access_portal_rounds"
ON public.portal_rounds FOR ALL TO authenticated
USING (public.is_admin_from_auth()) WITH CHECK (public.is_admin_from_auth());

-- purchases
DROP POLICY IF EXISTS "users_manage_own_purchases" ON public.purchases;
CREATE POLICY "users_manage_own_purchases"
ON public.purchases FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "admin_full_access_purchases" ON public.purchases;
CREATE POLICY "admin_full_access_purchases"
ON public.purchases FOR ALL TO authenticated
USING (public.is_admin_from_auth()) WITH CHECK (public.is_admin_from_auth());

-- ============================================================
-- 7. TRIGGERS
-- ============================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_journal_entries_updated_at ON public.journal_entries;
CREATE TRIGGER update_journal_entries_updated_at
  BEFORE UPDATE ON public.journal_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- 8. MOCK DATA
-- ============================================================

DO $$
DECLARE
  admin_uuid UUID := gen_random_uuid();
  writer_uuid UUID := gen_random_uuid();
BEGIN
  -- Create auth users (trigger auto-creates user_profiles)
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
    is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
    recovery_token, recovery_sent_at, email_change_token_new, email_change,
    email_change_sent_at, email_change_token_current, email_change_confirm_status,
    reauthentication_token, reauthentication_sent_at, phone, phone_change,
    phone_change_token, phone_change_sent_at
  ) VALUES
    (
      admin_uuid,
      '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'founder@nomorequiet.house',
      crypt('pyramid43N', gen_salt('bf', 10)),
      now(), now(), now(),
      jsonb_build_object('nickname', 'Founder', 'assigned_node', 'rtanj', 'role', 'admin'),
      jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[], 'role', 'admin'),
      false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null
    ),
    (
      writer_uuid,
      '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'mara.ivanovic@nomorequiet.house',
      crypt('rtanj2026', gen_salt('bf', 10)),
      now(), now(), now(),
      jsonb_build_object('nickname', 'Mara', 'assigned_node', 'rtanj', 'role', 'user'),
      jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
      false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null
    )
  ON CONFLICT (id) DO NOTHING;

  -- Seed some public lights (anonymous, no user_id required)
  INSERT INTO public.lights (id, node_id, fragment, star_magnitude, is_founding, is_builder, pulse_speed, map_x, map_y, is_anonymous)
  VALUES
    (gen_random_uuid(), 'rtanj'::public.user_node, 'I stopped explaining myself to people who were not listening.', 'svetlost'::public.star_magnitude, true, false, 'slow', 53.2, 35.6, true),
    (gen_random_uuid(), 'rtanj'::public.user_node, 'The weight has a shape now. That is something.', 'iskra'::public.star_magnitude, true, false, 'slow', 54.1, 36.4, true),
    (gen_random_uuid(), 'rtanj'::public.user_node, 'I came here because I had nowhere else to put this.', 'svemir'::public.star_magnitude, true, false, 'ember', 52.8, 35.2, true),
    (gen_random_uuid(), 'rtanj'::public.user_node, 'Still here. Still carrying it. But less alone.', 'svetlost'::public.star_magnitude, true, false, 'ember', 53.8, 37.1, true),
    (gen_random_uuid(), 'rtanj'::public.user_node, 'The stone is lighter when I say its name.', 'svemir'::public.star_magnitude, true, true, 'ember', 53.5, 36.8, true),
    (gen_random_uuid(), 'sedona'::public.user_node, 'The spiral has been turning since before I noticed.', 'svetlost'::public.star_magnitude, false, false, 'medium', 13.8, 39.7, true),
    (gen_random_uuid(), 'kailash'::public.user_node, 'At this altitude, I can only carry what is true.', 'svemir'::public.star_magnitude, false, false, 'slow', 70.2, 37.8, true),
    (gen_random_uuid(), 'glastonbury'::public.user_node, 'Quiet is not the same as peace. I am learning the difference.', 'svetlost'::public.star_magnitude, false, false, 'slow', 46.2, 24.3, true),
    (gen_random_uuid(), 'esvedra'::public.user_node, 'The sea pulled me here. I stopped asking why.', 'svetlost'::public.star_magnitude, false, false, 'medium', 49.2, 40.1, true)
  ON CONFLICT (id) DO NOTHING;

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Mock data insertion failed: %', SQLERRM;
END $$;
