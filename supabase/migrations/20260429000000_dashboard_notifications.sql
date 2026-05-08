-- Dashboard, Win Notifications & Companion Tier Migration
-- Adds: win_notifications table, companion_assigned_at to user_profiles

-- 1. Add companion_assigned_at column to user_profiles (tracks manual admin assignment)
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS companion_assigned_at TIMESTAMPTZ DEFAULT NULL;

-- 2. Create win_notifications table
CREATE TABLE IF NOT EXISTS public.win_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  story_id UUID NOT NULL REFERENCES public.soul_stories(id) ON DELETE CASCADE,
  story_title TEXT NOT NULL,
  seen BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_win_notifications_user_id ON public.win_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_win_notifications_seen ON public.win_notifications(user_id, seen);

-- 4. Enable RLS
ALTER TABLE public.win_notifications ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for win_notifications
DROP POLICY IF EXISTS "users_read_own_win_notifications" ON public.win_notifications;
CREATE POLICY "users_read_own_win_notifications"
ON public.win_notifications
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "users_update_own_win_notifications" ON public.win_notifications;
CREATE POLICY "users_update_own_win_notifications"
ON public.win_notifications
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Admin insert policy (service role inserts notifications when anointing)
DROP POLICY IF EXISTS "service_insert_win_notifications" ON public.win_notifications;
CREATE POLICY "service_insert_win_notifications"
ON public.win_notifications
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 6. Function: is_admin_role (for admin-only operations)
CREATE OR REPLACE FUNCTION public.is_admin_role()
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

-- 7. RLS policy on user_profiles: allow admin to update user_tier and companion_assigned_at
DROP POLICY IF EXISTS "admin_update_user_tier" ON public.user_profiles;
CREATE POLICY "admin_update_user_tier"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (public.is_admin_role())
WITH CHECK (public.is_admin_role());
