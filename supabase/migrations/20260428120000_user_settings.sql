-- User Settings: appearance_year and shadow_mode fields
-- Adds generational context and privacy toggle to user_profiles

ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS appearance_year INTEGER DEFAULT NULL,
ADD COLUMN IF NOT EXISTS shadow_mode BOOLEAN DEFAULT FALSE NOT NULL;

-- Index for shadow_mode queries (used in pyramid visibility)
CREATE INDEX IF NOT EXISTS idx_user_profiles_shadow_mode ON public.user_profiles(shadow_mode);
