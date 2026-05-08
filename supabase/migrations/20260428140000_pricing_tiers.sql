-- NMQ Pricing Tiers Migration
-- Adds: user_tier to user_profiles, deep_read_queue table, extends purchase_product enum

-- ============================================================
-- 1. ADD user_tier TO user_profiles
-- ============================================================

ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS user_tier TEXT NOT NULL DEFAULT 'free';

-- ============================================================
-- 2. EXTEND purchase_product ENUM
-- We cannot ALTER ENUM directly in all Postgres versions safely,
-- so we use a workaround: change column to TEXT, drop old type,
-- recreate with new values, cast back.
-- Since purchases.product is already TEXT-backed via ENUM,
-- we add 'deep_read' value safely.
-- ============================================================

DO $$
BEGIN
  -- Add 'deep_read' to purchase_product enum if not already present
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumlabel = 'deep_read'
      AND enumtypid = (
        SELECT oid FROM pg_type WHERE typname = 'purchase_product'
      )
  ) THEN
    ALTER TYPE public.purchase_product ADD VALUE 'deep_read';
  END IF;
END $$;

-- ============================================================
-- 3. deep_read_queue TABLE
-- Tracks Deep Read purchases for admin processing + weekly limit
-- ============================================================

CREATE TABLE IF NOT EXISTS public.deep_read_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  stripe_checkout_session TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  journal_entries JSONB,
  admin_notified_at TIMESTAMPTZ,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 4. INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_deep_read_queue_user_id ON public.deep_read_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_deep_read_queue_status ON public.deep_read_queue(status);
CREATE INDEX IF NOT EXISTS idx_deep_read_queue_created_at ON public.deep_read_queue(created_at);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_tier ON public.user_profiles(user_tier);

-- ============================================================
-- 5. FUNCTIONS
-- ============================================================

-- Count Deep Read purchases in current week (site-wide)
CREATE OR REPLACE FUNCTION public.count_deep_read_this_week()
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.deep_read_queue
  WHERE created_at >= date_trunc('week', CURRENT_TIMESTAMP);
$$;

-- Update user_tier based on product
CREATE OR REPLACE FUNCTION public.update_user_tier_for_product(
  p_user_id UUID,
  p_product TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_product = 'companion' THEN
    UPDATE public.user_profiles
    SET user_tier = 'companion', updated_at = CURRENT_TIMESTAMP
    WHERE id = p_user_id;
  ELSIF p_product = 'deep_insight' THEN
    -- Only upgrade if not already companion
    UPDATE public.user_profiles
    SET user_tier = CASE WHEN user_tier = 'companion' THEN 'companion' ELSE 'deep_insight' END,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_user_id;
  ELSIF p_product = 'deep_read' THEN
    -- Only upgrade if not already companion or deep_insight
    UPDATE public.user_profiles
    SET user_tier = CASE
      WHEN user_tier IN ('companion', 'deep_insight') THEN user_tier
      ELSE 'deep_read'
    END,
    updated_at = CURRENT_TIMESTAMP
    WHERE id = p_user_id;
  ELSIF p_product = 'light' THEN
    -- Light purchase: only set to 'light' if still free
    UPDATE public.user_profiles
    SET user_tier = CASE WHEN user_tier = 'free' THEN 'light' ELSE user_tier END,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_user_id;
  END IF;
END;
$$;

-- Downgrade companion tier when subscription canceled
CREATE OR REPLACE FUNCTION public.downgrade_companion_tier(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.user_profiles
  SET user_tier = 'free', updated_at = CURRENT_TIMESTAMP
  WHERE id = p_user_id AND user_tier = 'companion';
END;
$$;

-- ============================================================
-- 6. ENABLE RLS
-- ============================================================

ALTER TABLE public.deep_read_queue ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 7. RLS POLICIES
-- ============================================================

DROP POLICY IF EXISTS "users_manage_own_deep_read_queue" ON public.deep_read_queue;
CREATE POLICY "users_manage_own_deep_read_queue"
ON public.deep_read_queue FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "admin_full_access_deep_read_queue" ON public.deep_read_queue;
CREATE POLICY "admin_full_access_deep_read_queue"
ON public.deep_read_queue FOR ALL TO authenticated
USING (public.is_admin_from_auth()) WITH CHECK (public.is_admin_from_auth());

DROP POLICY IF EXISTS "service_role_bypass_deep_read_queue" ON public.deep_read_queue;
CREATE POLICY "service_role_bypass_deep_read_queue"
ON public.deep_read_queue FOR ALL TO service_role
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass_user_profiles_tier" ON public.user_profiles;
CREATE POLICY "service_role_bypass_user_profiles_tier"
ON public.user_profiles FOR ALL TO service_role
USING (true) WITH CHECK (true);

-- ============================================================
-- 8. TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_deep_read_queue_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_deep_read_queue_updated_at ON public.deep_read_queue;
CREATE TRIGGER update_deep_read_queue_updated_at
  BEFORE UPDATE ON public.deep_read_queue
  FOR EACH ROW EXECUTE FUNCTION public.update_deep_read_queue_updated_at();
