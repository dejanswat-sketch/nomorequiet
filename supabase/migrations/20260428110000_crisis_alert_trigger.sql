-- Crisis Alert Trigger Migration
-- Creates a DB function + trigger that calls the send-crisis-alert Edge Function
-- whenever a journal_entries row is inserted with crisis_flag = true

-- ============================================================
-- 1. Function: invoke send-crisis-alert edge function via pg_net
-- ============================================================

CREATE OR REPLACE FUNCTION public.notify_crisis_alert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $func$
DECLARE
  user_email TEXT;
  user_nickname TEXT;
  supabase_url TEXT;
  service_role_key TEXT;
BEGIN
  -- Only fire when crisis_flag is true
  IF NEW.crisis_flag IS NOT TRUE THEN
    RETURN NEW;
  END IF;

  -- Fetch user email + nickname from user_profiles
  SELECT up.email, up.nickname
  INTO user_email, user_nickname
  FROM public.user_profiles up
  WHERE up.id = NEW.user_id
  LIMIT 1;

  -- Retrieve Supabase project URL and service role key from vault/env
  supabase_url := current_setting('app.supabase_url', true);
  service_role_key := current_setting('app.service_role_key', true);

  -- Call the Edge Function asynchronously via pg_net (fire-and-forget)
  PERFORM net.http_post(
    url := supabase_url || '/functions/v1/send-crisis-alert',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_role_key
    ),
    body := jsonb_build_object(
      'userEmail', COALESCE(user_email, ''),
      'userNickname', COALESCE(user_nickname, ''),
      'node', COALESCE(NEW.node::TEXT, ''),
      'detectedLanguage', COALESCE(NEW.detected_language, 'en'),
      'entryId', NEW.id::TEXT,
      'journalEntryCreatedAt', NEW.created_at::TEXT
    )
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Never block the journal entry insert — log and continue
    RAISE WARNING 'Crisis alert notification failed for entry %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$func$;

-- ============================================================
-- 2. Trigger: fires AFTER INSERT on journal_entries
-- ============================================================

DROP TRIGGER IF EXISTS on_crisis_journal_entry ON public.journal_entries;
CREATE TRIGGER on_crisis_journal_entry
  AFTER INSERT ON public.journal_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_crisis_alert();
