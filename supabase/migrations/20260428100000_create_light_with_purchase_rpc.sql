-- Migration: create_light_with_purchase_rpc
-- Atomically creates a light on the map and records the purchase in one transaction.
-- Idempotent: if the checkout session was already processed, returns the existing light.

CREATE OR REPLACE FUNCTION public.create_light_with_purchase(
  p_user_id          UUID,
  p_node_id          TEXT,
  p_fragment         TEXT,
  p_star_magnitude   TEXT,
  p_map_x            FLOAT,
  p_map_y            FLOAT,
  p_amount_cents     INT,
  p_payment_intent   TEXT,
  p_checkout_session TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_light_id  UUID;
  v_result    JSONB;
BEGIN
  -- Idempotency guard: if this checkout session was already processed, return existing light
  SELECT l.id INTO v_light_id
  FROM public.purchases pu
  JOIN public.lights l ON l.id = pu.light_id
  WHERE pu.stripe_checkout_session = p_checkout_session
  LIMIT 1;

  IF v_light_id IS NOT NULL THEN
    SELECT jsonb_build_object(
      'light_id',       v_light_id,
      'already_exists', true
    ) INTO v_result;
    RETURN v_result;
  END IF;

  -- Insert the light
  INSERT INTO public.lights (
    user_id,
    node_id,
    fragment,
    star_magnitude,
    map_x,
    map_y,
    is_anonymous
  )
  VALUES (
    p_user_id,
    p_node_id::public.user_node,
    p_fragment,
    p_star_magnitude::public.star_magnitude,
    p_map_x,
    p_map_y,
    false
  )
  RETURNING id INTO v_light_id;

  -- Insert the purchase record linked to the light
  INSERT INTO public.purchases (
    user_id,
    product,
    amount_cents,
    stripe_payment_intent,
    stripe_checkout_session,
    stripe_status,
    star_magnitude,
    fragment,
    node_id,
    light_id
  )
  VALUES (
    p_user_id,
    'light'::public.purchase_product,
    p_amount_cents,
    p_payment_intent,
    p_checkout_session,
    'paid',
    p_star_magnitude,
    p_fragment,
    p_node_id,
    v_light_id
  );

  SELECT jsonb_build_object(
    'light_id',       v_light_id,
    'already_exists', false
  ) INTO v_result;

  RETURN v_result;
END;
$$;
