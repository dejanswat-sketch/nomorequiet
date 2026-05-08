-- Portal Rate Limiting: track daily Portal session starts per user
-- Free users (no active Companion subscription) are limited to 1 Portal session per day

-- ============================================================
-- 1. TABLE: portal_daily_usage
-- ============================================================

CREATE TABLE IF NOT EXISTS public.portal_daily_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
  session_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, usage_date)
);

-- ============================================================
-- 2. INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_portal_daily_usage_user_date
  ON public.portal_daily_usage(user_id, usage_date);

-- ============================================================
-- 3. ENABLE RLS
-- ============================================================

ALTER TABLE public.portal_daily_usage ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 4. RLS POLICIES
-- ============================================================

DROP POLICY IF EXISTS "users_read_own_portal_usage" ON public.portal_daily_usage;
CREATE POLICY "users_read_own_portal_usage"
ON public.portal_daily_usage FOR SELECT TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "service_role_bypass_portal_daily_usage" ON public.portal_daily_usage;
CREATE POLICY "service_role_bypass_portal_daily_usage"
ON public.portal_daily_usage FOR ALL TO service_role
USING (true) WITH CHECK (true);

-- ============================================================
-- 5. FUNCTION: check_and_increment_portal_usage
-- Returns: { allowed: boolean, sessions_today: integer }
-- Checks if free user is within daily limit, increments if allowed
-- ============================================================

CREATE OR REPLACE FUNCTION public.check_and_increment_portal_usage(
  p_user_id UUID,
  p_daily_limit INTEGER DEFAULT 1
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_is_companion BOOLEAN;
  v_sessions_today INTEGER;
  v_today DATE := CURRENT_DATE;
BEGIN
  -- Check if user has an active Companion subscription
  SELECT EXISTS (
    SELECT 1 FROM public.stripe_subscriptions
    WHERE user_id = p_user_id
      AND status = 'active'
  ) INTO v_is_companion;

  -- Companion users are always allowed — no tracking needed
  IF v_is_companion THEN
    RETURN jsonb_build_object('allowed', true, 'is_companion', true, 'sessions_today', 0);
  END IF;

  -- Get today's session count for this free user
  SELECT session_count INTO v_sessions_today
  FROM public.portal_daily_usage
  WHERE user_id = p_user_id AND usage_date = v_today;

  IF v_sessions_today IS NULL THEN
    v_sessions_today := 0;
  END IF;

  -- Check against limit
  IF v_sessions_today >= p_daily_limit THEN
    RETURN jsonb_build_object('allowed', false, 'is_companion', false, 'sessions_today', v_sessions_today);
  END IF;

  -- Upsert: increment or create today's record
  INSERT INTO public.portal_daily_usage (user_id, usage_date, session_count)
  VALUES (p_user_id, v_today, 1)
  ON CONFLICT (user_id, usage_date)
  DO UPDATE SET
    session_count = portal_daily_usage.session_count + 1,
    updated_at = CURRENT_TIMESTAMP;

  RETURN jsonb_build_object('allowed', true, 'is_companion', false, 'sessions_today', v_sessions_today + 1);
END;
$$;

-- Grant execute to authenticated users (called via RPC)
GRANT EXECUTE ON FUNCTION public.check_and_increment_portal_usage(UUID, INTEGER) TO authenticated;
