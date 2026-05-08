-- Migration: Soul Stories + Voices + Gold Star
-- Timestamp: 20260428150000

-- 1. Create soul_stories table
CREATE TABLE IF NOT EXISTS public.soul_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_nominated BOOLEAN NOT NULL DEFAULT false,
  is_winner BOOLEAN NOT NULL DEFAULT false,
  pinned_at TIMESTAMPTZ,
  anointed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Add gold_expires_at to lights table
ALTER TABLE public.lights
ADD COLUMN IF NOT EXISTS gold_expires_at TIMESTAMPTZ;

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_soul_stories_user_id ON public.soul_stories(user_id);
CREATE INDEX IF NOT EXISTS idx_soul_stories_is_nominated ON public.soul_stories(is_nominated);
CREATE INDEX IF NOT EXISTS idx_soul_stories_is_winner ON public.soul_stories(is_winner);
CREATE INDEX IF NOT EXISTS idx_lights_gold_expires_at ON public.lights(gold_expires_at);

-- 4. Enable RLS
ALTER TABLE public.soul_stories ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for soul_stories
-- Users can read their own stories
DROP POLICY IF EXISTS "users_manage_own_soul_stories" ON public.soul_stories;
CREATE POLICY "users_manage_own_soul_stories"
ON public.soul_stories
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Public can read winner stories
DROP POLICY IF EXISTS "public_read_winner_soul_stories" ON public.soul_stories;
CREATE POLICY "public_read_winner_soul_stories"
ON public.soul_stories
FOR SELECT
TO public
USING (is_winner = true);

-- Admin function for checking admin role
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
  SELECT 1 FROM public.user_profiles
  WHERE id = auth.uid() AND role = 'admin'
)
$$;

-- Admin can read all nominated stories
DROP POLICY IF EXISTS "admin_read_nominated_soul_stories" ON public.soul_stories;
CREATE POLICY "admin_read_nominated_soul_stories"
ON public.soul_stories
FOR SELECT
TO authenticated
USING (public.is_admin_user() OR user_id = auth.uid());

-- Admin can update any story (for anointing)
DROP POLICY IF EXISTS "admin_update_soul_stories" ON public.soul_stories;
CREATE POLICY "admin_update_soul_stories"
ON public.soul_stories
FOR UPDATE
TO authenticated
USING (public.is_admin_user() OR user_id = auth.uid())
WITH CHECK (public.is_admin_user() OR user_id = auth.uid());
