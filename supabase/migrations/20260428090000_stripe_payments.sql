-- NMQ Stripe Payments Migration
-- Adds: stripe_customers, stripe_subscriptions tables
-- Extends: purchases with checkout session tracking

-- ============================================================
-- 1. NEW TABLES
-- ============================================================

-- Maps Supabase user → Stripe customer ID
CREATE TABLE IF NOT EXISTS public.stripe_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Companion subscription tracking
CREATE TABLE IF NOT EXISTS public.stripe_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  price_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. EXTEND PURCHASES TABLE
-- ============================================================

ALTER TABLE public.purchases
  ADD COLUMN IF NOT EXISTS stripe_checkout_session TEXT,
  ADD COLUMN IF NOT EXISTS stripe_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS star_magnitude TEXT,
  ADD COLUMN IF NOT EXISTS fragment TEXT,
  ADD COLUMN IF NOT EXISTS node_id TEXT DEFAULT 'rtanj';

-- ============================================================
-- 3. INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_stripe_customers_user_id ON public.stripe_customers(user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_customers_stripe_id ON public.stripe_customers(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_user_id ON public.stripe_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_stripe_id ON public.stripe_subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_purchases_stripe_session ON public.purchases(stripe_checkout_session);
CREATE INDEX IF NOT EXISTS idx_purchases_stripe_status ON public.purchases(stripe_status);

-- ============================================================
-- 4. UPDATE FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_stripe_customers_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_stripe_subscriptions_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

-- ============================================================
-- 5. ENABLE RLS
-- ============================================================

ALTER TABLE public.stripe_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_subscriptions ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 6. RLS POLICIES
-- ============================================================

-- stripe_customers
DROP POLICY IF EXISTS "users_manage_own_stripe_customers" ON public.stripe_customers;
CREATE POLICY "users_manage_own_stripe_customers"
ON public.stripe_customers FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "admin_full_access_stripe_customers" ON public.stripe_customers;
CREATE POLICY "admin_full_access_stripe_customers"
ON public.stripe_customers FOR ALL TO authenticated
USING (public.is_admin_from_auth()) WITH CHECK (public.is_admin_from_auth());

-- stripe_subscriptions
DROP POLICY IF EXISTS "users_manage_own_stripe_subscriptions" ON public.stripe_subscriptions;
CREATE POLICY "users_manage_own_stripe_subscriptions"
ON public.stripe_subscriptions FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "admin_full_access_stripe_subscriptions" ON public.stripe_subscriptions;
CREATE POLICY "admin_full_access_stripe_subscriptions"
ON public.stripe_subscriptions FOR ALL TO authenticated
USING (public.is_admin_from_auth()) WITH CHECK (public.is_admin_from_auth());

-- ============================================================
-- 7. TRIGGERS
-- ============================================================

DROP TRIGGER IF EXISTS update_stripe_customers_updated_at ON public.stripe_customers;
CREATE TRIGGER update_stripe_customers_updated_at
  BEFORE UPDATE ON public.stripe_customers
  FOR EACH ROW EXECUTE FUNCTION public.update_stripe_customers_updated_at();

DROP TRIGGER IF EXISTS update_stripe_subscriptions_updated_at ON public.stripe_subscriptions;
CREATE TRIGGER update_stripe_subscriptions_updated_at
  BEFORE UPDATE ON public.stripe_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_stripe_subscriptions_updated_at();

-- ============================================================
-- 8. SERVICE ROLE BYPASS FOR WEBHOOK (needed for webhook handler)
-- ============================================================

-- Allow service_role to bypass RLS for webhook operations
DROP POLICY IF EXISTS "service_role_bypass_stripe_customers" ON public.stripe_customers;
CREATE POLICY "service_role_bypass_stripe_customers"
ON public.stripe_customers FOR ALL TO service_role
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass_stripe_subscriptions" ON public.stripe_subscriptions;
CREATE POLICY "service_role_bypass_stripe_subscriptions"
ON public.stripe_subscriptions FOR ALL TO service_role
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass_purchases" ON public.purchases;
CREATE POLICY "service_role_bypass_purchases"
ON public.purchases FOR ALL TO service_role
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass_lights" ON public.lights;
CREATE POLICY "service_role_bypass_lights"
ON public.lights FOR ALL TO service_role
USING (true) WITH CHECK (true);
